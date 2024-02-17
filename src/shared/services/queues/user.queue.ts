import { BaseQueue } from '@service/queues/base.queue';
import { IUserJob } from '@user/interfaces/user.interface';
import { userWorker } from '@worker/user.worker';

class UserQueue extends BaseQueue {
  constructor() {
    super('user');
    this.proccessJob('addUserToDB', 5, userWorker.addUserToDB);
    this.proccessJob('updateSocialLinksInDB', 5, userWorker.updateSocialLinks);
    this.proccessJob('updateBasicInfoInDB', 5, userWorker.updateUserInfo);
    this.proccessJob('updateNotificationSettingsInDB', 5, userWorker.updateNotificationSettings);
  }

  public addUserJob(name: string, data: IUserJob): void {
    this.addJob(name, data);
  }
}

export const userQueue: UserQueue = new UserQueue();
