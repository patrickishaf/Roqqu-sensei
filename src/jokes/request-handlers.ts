import { HttpStatusCode } from 'axios';
import { createErrorResponse, createSuccessResponse, logToConsole, validateSchemaOrThrow } from '../common';
import { Request, Response } from 'express';
import Joi from 'joi';
import { convertJokesResponseToStringArray, generateJokes } from './joke-generator';

export const generateRandomJokes = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      count: Joi.number().min(1).max(10).optional(),
    });
    await validateSchemaOrThrow(req.query, schema);
    const jokes = await generateJokes(req.query.content ? Number(req.query.content) : undefined);
    res.status(HttpStatusCode.Ok).json(createSuccessResponse(convertJokesResponseToStringArray(jokes)));
  } catch (err: any) {
    logToConsole('failed to generate random Jokes', err.message);
    res.status(HttpStatusCode.InternalServerError).json(createErrorResponse(err.message));
  }
}