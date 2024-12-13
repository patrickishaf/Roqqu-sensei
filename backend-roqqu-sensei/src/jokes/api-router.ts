import express from 'express';
import { generateRandomJokes } from './request-handlers';

export const jokesRouter = express.Router();

export const registerJokesHandlers = () => {
  jokesRouter.get('/', generateRandomJokes);
}