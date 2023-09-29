import { config } from '@root/config';
import databaseConnection from '@root/setupDatabase';
import { ChattyServer } from '@root/setupServer';
import Logger from 'bunyan';
import express, { Express } from 'express';

const log: Logger = config.createLogger('app');

class Application {
  public initialize(): void {
    this.loadSettings();
    databaseConnection();
    const app: Express = express();
    const server: ChattyServer = new ChattyServer(app);
    server.start();
    Application.handleExit();
  }

  private loadSettings(): void {
    config.validateConfig();
    config.cloudinaryConfig();
  }

  private static handleExit(): void {
    process.on('uncaughtException', (error: Error) => {
      log.error(`They was an uncaught exception: ${error}`);
      Application.shutDownProperly(1);
    });

    process.on('unhandledRejection', (reason: Error) => {
      log.error(`Unhandled rejection occurred: ${reason}`);
      Application.shutDownProperly(2);
    });

    process.on('SIGTERM', () => {
      log.error('Caught SIGTERM');
      Application.shutDownProperly(2);
    });

    process.on('SIGINT', () => {
      log.error('Caught SIGINT');
      Application.shutDownProperly(2);
    });

    process.on('exit', () => {
      log.error('Exiting process');
      Application.shutDownProperly(2);
    });
  }

  private static shutDownProperly(exitCode: number) {
    Promise.resolve()
      .then(() => {
        log.error('Shutting down server properly');
        process.exit(exitCode);
      })
      .catch((error) => {
        log.error(`Error occurred while shutting down server properly: ${error}`);
        process.exit(1);
      });
  }
}

const application: Application = new Application();
application.initialize();
