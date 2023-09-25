import express, { Express } from 'express';

import { config } from './config';
import databaseConnection from './setupDatabase';
import { ChattyServer } from './setupServer';

class Application {
  public initialize(): void {
    this.loadSettings();
    databaseConnection();
    const app: Express = express();
    const server: ChattyServer = new ChattyServer(app);
    server.start();
  }

  private loadSettings(): void {
    config.validateConfig();
  }
}

const application: Application = new Application();
application.initialize();
