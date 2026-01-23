import * as topicsRepository from '../repository/topics-repository';

export const getAllTopics = async (userId: number) => {

    if (!userId) return { status: 401, body: { error: 'Unauthorized' } };

    try {
        const topics = await topicsRepository.getAllUserTopics(userId);

        return { status: 200, body: { topics, total: topics.length } }

    } catch (error) {
        return { status: 500, body: { error: 'Server error' } }
    }
};

export const createTopic = async (userId: number, title: string, description: string, rawDueDate: string) => {
    if (!userId) return { status: 400, body: { error: 'User id not specified.' } };

    if (!title || !description || !rawDueDate) {
        return { status: 400, body: { error: 'POST requires: title, description and dueDate' } }
    }

    const dueDate = new Date(rawDueDate);
    dueDate.setSeconds(0);
    dueDate.setMilliseconds(0);

    if (isNaN(dueDate.getTime())) {
        return { status: 400, body: { error: 'Invalid date format.' } };
    }

    try {

        const now = new Date();
        const createdTopic = await topicsRepository.createTopic(title, description, dueDate, userId, now);

        return { status: 201, body: { createdTopic } };

    } catch (error) {
        return { status: 500, body: { error: 'Internal server error.' } };
    };
};

export const deleteTopic = async (topicId: number, userId: number) => {
    if (isNaN(topicId)) return { status: 400, body: { error: 'Invalid topic id.' } };

    try {
        const deletedTopic = await topicsRepository.deleteTopicById(topicId, userId);

        if (!deletedTopic) return  { status: 404, body: { error: 'Topic not found.' } };

        return { status: 200, body: { deleteTopic } };

    } catch (error) {
        return { status: 500, body: { error: 'Internal server error.' } };
    }
}

export const updateFullTopic = async (topicId: number, userId: number, title: string, description: string, dueDate: Date | undefined, done: boolean) => {

    if (isNaN(topicId)) return { status: 400, body: { error: 'Invalid topic id.' } };

    if (!title || !description || dueDate === undefined || done === undefined) {
        return { status: 400, body: { error: 'PUT requires a full topic payload.' } };
    };

    try {

        const existingTopic = await topicsRepository.getTopicById(topicId, userId);

        if (!existingTopic) return { status: 404, body: { error: 'Topic not found.' } };

        const topicUpdated = await topicsRepository.updateTopic(topicId, userId, { title, description, done, dueDate });

        return { status: 200, body: { topicUpdated } };

    } catch (error) {
        return { status: 500, body: { error: 'Internal server error.' } };
    };
};

export const updateTopicPiece = async (topicId: number, userId: number, dataToUpdate: Record<string, any>) => {
    
    try {
        
        if (Object.keys(dataToUpdate).length === 0) return { status: 400, body: { error: 'No valid fields to update.' }} ;

        const existingTopic = await topicsRepository.getTopicById(topicId, userId);

        if (!existingTopic) return { status: 204, body: { error: 'Topic not found.' } } ;

        const updatedTopic = await topicsRepository.updateTopic(topicId, userId, {...dataToUpdate});

        return { status: 200, body: { updatedTopic } };

    } catch (error) {
        return { status: 500, body: { error: 'Internal server error.' } };
    };
};

export const getTopicById = async (topicId: number, userId: number) => {
    
    try {
        const topic = await topicsRepository.getTopicById(topicId, userId);

        if (!topic) return { status: 204, body: { error: 'Topic not found.' } };

        return { status: 200, body:  { topic }  };

    } catch (error) {
        return  { status: 500, body: { error: 'Internal server error.' } };
    }
};
