import { Response } from "express";
import HttpCode from "../../utils/httpUtil/httpCode";
import logger from "../logger";
import { AppError } from "./AppError";

class ErrorHandler {
  //handles error
  public async handleError(err: Error, responseStream?: Response) {
    this.logError(err);
    this.crashIfUntrustedErrorOrSendResponse(err, responseStream);
  }

  private async crashIfUntrustedErrorOrSendResponse(
    err: Error,
    responseStream?: Response
  ) {
    if (err instanceof AppError && err.isOperational) {
      this.sendErrorResponse(err.httpCode, err.message, responseStream);
    } else {
      //unexpected error, crash app
      process.exit(1);
    }
  }

  public async handleUnhandledRejection(reason: {} | null | undefined) {}

  private sendErrorResponse(
    status: HttpCode,
    message?: string,
    responseStream?: Response
  ) {
    if (message === undefined || message === null || message === "") {
      responseStream?.status(status).end();
    } else {
      responseStream?.status(status).json({ errorMessage: message });
    }
  }

  private logError(err: Error) {
    if (err instanceof AppError) {
      err.httpCode < 400
        ? logger.info(err)
        : err.httpCode < 500 ?? logger.warn(err);
    } else logger.error(err);
  }
}

export const errorHandler = new ErrorHandler();
