import { config } from '@root/config';
import axios from 'axios';
import express, { Request, Response, Router } from 'express';
import HTTP_STATUS from 'http-status-codes';
import moment from 'moment';
import { performance } from 'perf_hooks';

class HealthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public health(): Router {
    this.router.get('/health', (req: Request, res: Response) => {
      res
        .status(HTTP_STATUS.OK)
        .send(`Health: Server instance is health with process id ${process.pid} on ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
    });

    return this.router;
  }

  public env(): Router {
    this.router.get('/env', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.OK).send(`This is ${config.NODE_ENV} environment`);
    });

    return this.router;
  }

  public instance(): Router {
    this.router.get('/instance', async (req: Request, res: Response) => {
      const response = await axios({
        method: 'get',
        url: config.EC2_URL
      });

      res
        .status(HTTP_STATUS.OK)
        .send(
          `Server is running on EC2 instance with id ${response.data} and process id ${process.pid} on ${moment().format(
            'YYYY-MM-DD HH:mm:ss'
          )}`
        );
    });

    return this.router;
  }

  public fiboRoutes(): Router {
    this.router.get('/fibo/:num', async (req: Request, res: Response) => {
      const start: number = performance.now();
      const result: number = this.fibo(parseInt(req.params.num, 10));
      const end: number = performance.now();
      const response = await axios({
        method: 'get',
        url: config.EC2_URL
      });
      res
        .status(HTTP_STATUS.OK)
        .send(
          `Fibo of ${req.params.num} is ${result} in ${end - start} milliseconds with EC2 instance of ${response.data} and process id ${
            process.pid
          } on ${moment().format('YYYY-MM-DD HH:mm:ss')}`
        );
    });

    return this.router;
  }

  private fibo(data: number): number {
    if (data < 2) {
      return 1;
    } else {
      return this.fibo(data - 2) + this.fibo(data - 1);
    }
  }
}

export const healthRoutes: HealthRoutes = new HealthRoutes();
