import express, { Express } from 'express';
import { ChattyServer } from '@root/setupServer';
import databaseConnection from '@root/setupDatabase';
import { config } from '@root/config';
import Logger from 'bunyan';

const log: Logger = config.createLogger('app');

class Application {
  public initialize(): void {
    this.loadConfig();
    databaseConnection();
    const app: Express = express();
    const server: ChattyServer = new ChattyServer(app);
    server.start();
    Application.handleExit();
  }

  private loadConfig(): void {
    config.validateConfig();
    config.cloudinaryConfig();
  }

  private static handleExit(): void {
    process.on('uncaughtException', (error: Error) => {
      log.error(`There was an uncaught error: ${error}`);
      Application.shutDownProperly(1);
    });

    process.on('unhandledRejection', (reason: Error) => {
      log.error(`There was an unhandled promise rejection: ${reason}`);
      Application.shutDownProperly(2);
    });

    process.on('SIGINT', () => {
      log.info('Received SIGINT');
      Application.shutDownProperly(0);
    });

    process.on('SIGTERM', () => {
      log.info('Received SIGTERM');
      Application.shutDownProperly(0);
    });

    process.on('exit', (code: number) => {
      log.info(`Process exited with code: ${code}`);
    });
  }

  private static shutDownProperly(exitCode: number): void {
    Promise.resolve()
      .then(() => {
        log.info('Shutting down server');
        process.exit(exitCode);
      })
      .catch((error: Error) => {
        log.error(error, 'Error during shutdown');
        process.exit(1);
      });
  }
}

const application: Application = new Application();
application.initialize();
