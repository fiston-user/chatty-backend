import { IBlockedUserJobData } from '@follower/interfaces/follower.interface';
import { BaseQueue } from '@service/queues/base.queue';
import { blockUserWorker } from '@worker/blocked.worker';

class BlockedUserQueue extends BaseQueue {
  constructor() {
    super('blockedUsers');
    this.processJob('addBlockedUserToDB', 5, blockUserWorker.addBlockedUserToDB);
    this.processJob('removeBlockedUserFromDB', 5, blockUserWorker.addBlockedUserToDB);
  }

  public addBlockedUserJob(name: string, data: IBlockedUserJobData): void {
    this.addJob(name, data);
  }
}

export const blockedUserQueue: BlockedUserQueue = new BlockedUserQueue();
