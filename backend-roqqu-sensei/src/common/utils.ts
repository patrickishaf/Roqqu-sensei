import config from "../config";
import Joi from "joi";
import {v4} from "uuid";

export const createSuccessResponse = (data: any, message: string = '') => {
  return ({
    status: 'success',
    message: message,
    data,
  })
}

export const createErrorResponse = (message: string, data?: any) => {
  return ({
    status: 'error',
    message: message,
    data,
  });
}

export const validateDataWithSchema = (data: any, schema: Joi.Schema) => {
  const { error } = schema.validate(data, { abortEarly: false });

  if (error) {
    const message = error.details
      .map((detail: any) => detail.message.replace(/\\/g, ''))
      .join("; ");
    return message.split(";")[0].replace('"', '').replace('"', '');
  }
}

export const logToConsole = (message?: any, ...optionalParams: any[]) => {
  if (config.nodeEnv === 'development') {
    console.log(message, ...optionalParams)
  }
}

export const generateUUID = () => {
  return v4();
}