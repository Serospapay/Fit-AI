/**
 * @file: apiResponse.ts
 * @description: Уніфіковані хелпери для формування API-відповідей та логування помилок контролерів
 * @dependencies: ../lib/logger, ../middleware/errorHandler
 * @created: 2025-11-07
 */
import { Response } from 'express';
import logger from '../lib/logger';
import { AppError } from '../middleware/errorHandler';

interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: unknown;
}

interface ControllerErrorContext {
  controller: string;
  operation: string;
  errorTitle?: string;
  userMessage?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

const DEFAULT_ERROR_TITLE = 'Internal Server Error';
const DEFAULT_ERROR_MESSAGE = 'Сталася внутрішня помилка. Спробуйте пізніше.';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  options?: { statusCode?: number; message?: string }
) => {
  const { statusCode = 200, message } = options || {};
  const payload: SuccessResponse<T> = { success: true, data };

  if (message) {
    payload.message = message;
  }

  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  options: {
    statusCode?: number;
    error?: string;
    message?: string;
    details?: unknown;
  }
) => {
  const {
    statusCode = 500,
    error = DEFAULT_ERROR_TITLE,
    message = DEFAULT_ERROR_MESSAGE,
    details,
  } = options;

  const payload: ErrorResponse = {
    success: false,
    error,
    message,
  };

  if (details !== undefined) {
    payload.details = details;
  }

  return res.status(statusCode).json(payload);
};

const extractErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return 'Unknown error';
  }
};

export const handleControllerError = (
  res: Response,
  error: unknown,
  context: ControllerErrorContext
) => {
  const {
    controller,
    operation,
    errorTitle = DEFAULT_ERROR_TITLE,
    userMessage = DEFAULT_ERROR_MESSAGE,
    statusCode,
    details,
  } = context;

  const isAppErr = error instanceof AppError;
  const resolvedStatus = statusCode ?? (isAppErr ? error.statusCode : 500);
  const resolvedMessage = isAppErr ? error.message : userMessage;

  logger.error(`[${controller}] ${operation} failed`, {
    error: extractErrorMessage(error),
    stack: error instanceof Error ? error.stack : undefined,
    details,
  });

  return sendError(res, {
    statusCode: resolvedStatus,
    error: errorTitle,
    message: resolvedMessage,
  });
};


