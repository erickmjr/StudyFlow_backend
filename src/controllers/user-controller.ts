import { Request, Response } from 'express';
import * as UsersServices from '../services/users-services';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { userType } = req.body;

        if (userType !== 'admin') return res.status(403).json({ message: 'Insufficient permission.' });

        const response = await UsersServices.getAllUsers();

        res.status(response.status).json(response.body);

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        const response = await UsersServices.registerUser(email, password, name);

        if (response.status === 201 && response.token) {
            res.cookie('token', response.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 1000 * 60 * 60 * 2,
                path: '/'
            })
        }


        res.status(response.status).json(response.body);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const response = await UsersServices.loginUser(email, password);

        if (response.status === 200 && response.token) {
            res.cookie('token', response.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 1000 * 60 * 60 * 2,
                path: '/'
            })
        }


        res.status(response.status).json(response.body);

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteUserById = async (req: Request, res: Response) => {
    try {
        const { userId, userType } = req.body;

        if (userType !== 'admin') return res.status(403).json({ message: 'Insufficient permission' })

        const response = await UsersServices.deleteUserById(userId);


        res.status(response.status).json(response.body);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }

};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).json({ error: 'Email is required.' });

        const response = await UsersServices.forgotPassword(email);

        if (!response) return res.status(500).json({ message: 'Internal server error' });

        res.status(response.status).json(response.body);

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    };
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;

        if (!newPassword) return res.status(400).json({ error: 'New password are required.' });

        if (!token) return res.status(400).json({ error: 'Missing token.' });

        const response = await UsersServices.resetPassword(token, newPassword);

        res.status(response.status).json(response.body);

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

export const getMe = async (req: Request, res: Response) => {
    try {

        const userId = req.user?.id;

        if (!userId) return res.status(400).json({ error: 'Invalid user ID.' });  

        const response = await UsersServices.getMe(userId);

        res.status(response.status).json(response.body);

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error.' }); 
    }
};

export const editUsername = async (req: Request, res: Response) => {
    try {

        const userId = req.user?.id;

        if (!userId) return res.status(400).json({ error: 'Invalid user ID.' });
        
        const username = req.body?.username;
        
        if (!username) return res.status(400).json({ error: 'Username is required.' });

        const response = await UsersServices.editUsername(userId, username);

        res.status(response.status).json(response.body);

    } catch {
        return res.status(500).json({ message: 'Internval server error.' });
    }
}