import { Router } from 'express';
import { authMiddleware } from './middlewares/auth-middleware';
export const router = Router();
import * as TopicsController from './controllers/topics-controller';
import * as UserController from './controllers/user-controller';

router.post('/user/auth/register', UserController.registerUser);
router.post('/user/auth/login', UserController.loginUser);
router.post('/user/forgot-password', UserController.forgotPassword);
router.post('/user/reset-password', UserController.resetPassword);

router.get('/users', UserController.getAllUsers);

router.get('/topics', authMiddleware, TopicsController.getUserTopics);
router.get('/topics/:id', authMiddleware, TopicsController.getTopicById);
router.post('/topics', authMiddleware, TopicsController.postTopic);
router.put('/topics/:id', authMiddleware, TopicsController.putTopic);
router.patch('/topics/:id', authMiddleware, TopicsController.patchTopic);
router.delete('/topics/:id', authMiddleware, TopicsController.deleteTopic);

export default router;