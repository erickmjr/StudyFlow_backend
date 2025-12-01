import { PrismaClient } from "@prisma/client/extension";
import { Router } from "express";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
export const router = Router();

const prisma = new PrismaClient();

router.post('/sign', async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const created = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
                createdAt: new Date()
            }
        });

        if (!created) {
            res.status(400).json( { error: 'Client error.' } );
        }

        const token = jwt.sign(
            {
                id: created.id,
                email: created.email
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: '2h'
            }
        );

        res.status(201).json(
            { 
                message: 'User successfully signed up.',
                token
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }

});

router.post('/login', async (req: Request, res: Response) => {
    const {email, hashedPassword} = req.body;

    try {
        const user = prisma.user.findUnique({
            where: { email: email }
        });
    
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const isMatch = await bcrypt.compare(user.password, hashedPassword);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "2h"
            }
        );

        return res.status(200).json({
            message: 'Login successful',
            token
        })
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error.' })
    }
});

export default router;