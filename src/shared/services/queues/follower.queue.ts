import { IFollowerJobData } from '@follower/interfaces/follower.interface';
import { BaseQueue } from '@service/queues/base.queue';
import { followerWorker } from '@worker/follower.worker';

class FollowerQueue extends BaseQueue {
  constructor() {
    super('followers');
    this.proccessJob('addFollowerToDB', 6, followerWorker.addFollowerToDB);
    this.proccessJob('removeFollowerFromDB', 6, followerWorker.removeFollowerFromDB);
  }

  public addFollowerJob(name: string, data: IFollowerJobData): void {
    this.addJob(name, data);
  }
}

export const followerQueue: FollowerQueue = new FollowerQueue();