import { Request, Response } from 'express';
import * as TopicsServices from '../services/topics-services'

export const getUserTopics = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.user?.sub);

        const response = await TopicsServices.getAllTopics(userId);

        res.status(response.status).json(response.body);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error.' });
    }
};

export const getTopicById = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.user?.sub);
        const topicId = Number(req.params.id);

        if (isNaN(topicId)) return res.status(400).json({ error: 'Invalid Topic ID.' });

        const response = await TopicsServices.getTopicById(topicId, userId);

        return res.status(response.status).json(response.body);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const postTopic = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.user?.sub);

        if (!req.body) return res.status(400).json({ error: 'Request body is missing.' });

        const { title, description, rawDueDate } = req.body;

        const response = await TopicsServices.createTopic(userId, title, description, rawDueDate);

        res.status(response.status).json(response.body);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const putTopic = async (req: Request, res: Response) => {
    try {
        
        const topicId = Number(req.params.id);
        const userId = Number(req.user?.sub);

        if (isNaN(topicId)) return res.status(400).json({ error: 'Invalid topic ID.' });

        if (!req.body) return res.status(400).json({ error: 'Request body is missing.' });

        const { title, description, dueDate, done } = req.body;

        const parsedDueDate = dueDate ? new Date(dueDate) : undefined;

        if (parsedDueDate && isNaN(parsedDueDate.getTime())) {
            return res.status(400).json({ error: 'Invalid dueDate.' });
        }

        if (typeof done !== 'boolean') return res.status(400).json({ error: 'Invalid done value.' });

        const response = await TopicsServices.updateFullTopic(topicId, userId, title, description, parsedDueDate, done);

        return res.status(response.status).json(response.body);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error.' });
    }
};

export const patchTopic = async (req: Request, res: Response) => {
    try {
        const topicId = Number(req.params.id);
        const userId = Number(req.user?.sub);

        if (!req.body) return res.status(400).json({ error: 'Request body is missing.' });

        const allowedFields = ['title', 'description', 'dueDate', 'done'];

        const dataToUpdate: Record<string, any> = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                dataToUpdate[field] = req.body[field];
            };
        };

        const response = await TopicsServices.updateTopicPiece(topicId, userId, dataToUpdate);

        return res.status(response.status).json(response.body);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error.' });
    }
};

export const deleteTopic = async (req: Request, res: Response) => {
    try {
        const topicId = Number(req.params.id);
        const userId = Number(req.user?.sub);

        const existingTopic = await TopicsServices.getTopicById(topicId, userId);

        if (!existingTopic) return res.status(404).json({ error: 'Topic not found.' });

        const deletedTopic = await TopicsServices.deleteTopic(topicId, userId);

        return res.status(200).json(deletedTopic);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error.' });
    }
}
