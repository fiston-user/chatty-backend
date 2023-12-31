import { config } from '@root/config';
import { redisConnection } from '@service/redis/redis.connection';
import Logger from 'bunyan';
import mongoose from 'mongoose';

const log: Logger = config.createLogger('setupDatabase');

export default () => {
  const connect = () => {
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        log.info('Successfully connected to database');
        redisConnection.connect();
      })
      .catch((error) => {
        log.error('database connection failed. exiting now...');
        console.error(error);
        process.exit(1);
      });
  };
  connect();

  mongoose.connection.on('disconnected', connect);
};
