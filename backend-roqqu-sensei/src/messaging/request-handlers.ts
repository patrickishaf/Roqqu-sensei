import express from "express";
import {createErrorResponse, createSuccessResponse, logToConsole, validateSchemaOrThrow} from "../common";
import {HttpStatusCode} from "axios";
import Joi from "joi";
import * as chatService from "./chat-service";

export const getChatsByCustomer = async (req: express.Request, res: express.Response) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    validateSchemaOrThrow(req.params, schema);
    const chats = await chatService.getChatsByCustomer(req.params.email);
    res.status(HttpStatusCode.Ok).json(createSuccessResponse(chats));
  } catch (err: any) {
    logToConsole(`failed to get chats by a customer with email ${req.params.email}. error: ${err.message}`);
    res.status(HttpStatusCode.InternalServerError).json(createErrorResponse(err.message));
  }
}