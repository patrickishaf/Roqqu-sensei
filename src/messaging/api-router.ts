import express from 'express';
import { getChatsByCustomer } from './request-handlers';

export const messagingRouter = express.Router();

export const registerMessagingHandlers = () => {
  messagingRouter.get('/chats/:email', getChatsByCustomer);
}