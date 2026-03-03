import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) return res.status(401).json({ error: 'Missing token.' });

    try {
        const secret: Secret | undefined = process.env.JWT_SECRET;

        if (!secret) throw new Error("JWT_SECRET is not defined");

        const decoded = jwt.verify(token, secret) as JwtPayload;

        const userId = Number(decoded.sub);

        if (!userId || Number.isNaN(userId)) {
            return res.status(401).json({ error: 'Invalid token subject.' });
        }

        req.user = { 
            id: userId
        };
        
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid token.' })
    }
} 