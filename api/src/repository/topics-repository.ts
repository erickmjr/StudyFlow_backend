import { PrismaClient } from "../../generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from '@prisma/adapter-pg';
import { TopicModel } from "../models/Topic";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export const getAllUserTopics = async (userId: number): Promise<TopicModel[]> => {
    const topics = await prisma.topic.findMany({
        where: { userId }
    });

    return topics;
};

export const createTopic = async (title: string, description: string, dueDate: Date, userId: number, now: Date): Promise<TopicModel> => {

    const createdTopic = await prisma.topic.create({
        data: {
            title,
            description,
            dueDate,
            createdAt: now,
            updatedAt: now,
            userId,
            done: false,
        }
    });

    return createdTopic;
};

export const updateTopic = async (topicId: number, userId: number, data: Partial<TopicModel>) => {
    const updatedTopic = await prisma.topic.update({
        where: { id: topicId, userId: userId },
        data: {
            title: data.title,
            description: data.description,
            dueDate: data.dueDate,
            done: data.done,
            updatedAt: new Date(),
        }
    });

    return updatedTopic;
};


export const deleteTopicById = async (topicId: number, userId: number) => {
    const deletedTopic = await prisma.topic.delete({
        where: { id: topicId, userId: userId }
    });

    return deletedTopic;
}

export const getTopicById = async (topicId: number, userId: number) => {
    const existingTopic = await prisma.topic.findFirst({
        where: {
            id: topicId,
            userId: userId
        },
    });

    return existingTopic;
};