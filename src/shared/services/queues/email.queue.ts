import { BaseQueue } from '@service/queues/base.queue';
import { IEmailJob } from '@user/interfaces/user.interface';
import { emailWorker } from '@worker/email.worker';

class EmailQueue extends BaseQueue {
  constructor() {
    super('emails');
    this.proccessJob('forgotPasswordEmail', 6, emailWorker.addNotificationEmail);
    this.proccessJob('commentsEmail', 6, emailWorker.addNotificationEmail);
    this.proccessJob('followerEmail', 6, emailWorker.addNotificationEmail);
    this.proccessJob('reactionsEmail', 6, emailWorker.addNotificationEmail);
    this.proccessJob('directMessageEmail', 6, emailWorker.addNotificationEmail);
    this.proccessJob('changePassword', 6, emailWorker.addNotificationEmail);
  }

  public addEmailJob(name: string, data: IEmailJob): void {
    this.addJob(name, data);
  }
}

export const emailQueue: EmailQueue = new EmailQueue();
