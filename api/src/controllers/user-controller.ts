import { Request, Response } from 'express';
import { PrismaClient } from "../../generated/prisma/client";
import { Pool } from "../../node_modules/@types/pg";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaPg } from '@prisma/adapter-pg';
import * as UsersServices from '../services/users-services';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export const registerUser = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    const response = await UsersServices.registerUser(email, password, name);

    res.status(response.status).json(response.body);
}

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const response = await UsersServices.loginUser(email, password);

    res.status(response.status).json(response.body);
}

export const deleteUserById = async (req: Request, res: Response) => {
    const { userId } = req.body;

    const response = await UsersServices.deleteUserById(userId);

    res.status(response.status).json(response.body);
}