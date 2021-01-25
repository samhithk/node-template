import express from "express";
import { createServer } from "http";
import { errorHandler } from "./lib/errors/ErrorHandler";
import logger from "./lib/logger";

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT;

process.on("uncaughtException", (error: Error) => {
  errorHandler.handleError(error);
});

process.on("unhandledRejection", (reason) => {
  errorHandler.handleUnhandledRejection(reason);
});

async function main() {
  //start server
  httpServer.listen(port, () =>
    logger.info(`server listening on port ${port}`)
  );
}

main();
