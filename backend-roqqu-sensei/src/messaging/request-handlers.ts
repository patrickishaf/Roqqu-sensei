import express from "express";
import {createErrorResponse, createSuccessResponse, logToConsole, validateDataWithSchema} from "../common";
import {HttpStatusCode} from "axios";
import Joi from "joi";
import * as chatService from "./chat-service";

const router = express.Router();

const getChatsByCustomer = async (req: express.Request, res: express.Response) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const errorMsg = validateDataWithSchema(req.params, schema);
    if (errorMsg) {
      logToConsole(`bad request. failed to get chats by customer. error: ${errorMsg}`);
      return res.status(HttpStatusCode.BadRequest).json(errorMsg);
    }
    const chats = await chatService.getChatsByCustomer(req.params.email);
    return res.status(HttpStatusCode.Ok).json(createSuccessResponse(chats));
  } catch (err: any) {
    logToConsole(`failed to get chats by a customer with email ${req.params.email}. error: ${err.message}`);
    return res.status(HttpStatusCode.InternalServerError).json(createErrorResponse(err.message));
  }
}

// @ts-ignore
router.get('/chats/:email', getChatsByCustomer);

export const messagingRouter = router;