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

export const logToConsole = (message?: any, ...optionalParams: any[]) => {
  if (config.nodeEnv === 'development') {
    console.log(message, ...optionalParams);
  }
}

export const generateUUID = () => {
  return v4();
}

export const validateSchemaOrThrow = (data: any, schema: Joi.Schema) => {
  const validationState = schema.validate(data, { abortEarly: false });
  if (validationState.hasOwnProperty('error')) {
    throw new Error(validationState.error?.details[0].message);
  } else if (validationState.value === undefined) {
    throw new Error("invalid payload");
  }
  return undefined;
}

export const convertWordToTitleCase = (word: string) => {
  if (word.length === 0) {
    return '';
  }
  let firstLetter = word.charAt(0);
  firstLetter = firstLetter.toUpperCase();
  if (word.length === 1) {
    return firstLetter.toUpperCase();
  }
  const remainingPartOfWord = word.substring(1)
  const titleCasedWord = firstLetter + remainingPartOfWord;
  return titleCasedWord;
}