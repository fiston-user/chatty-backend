import { INotificationJobData } from '@notification/interfaces/notification.interface';
import { BaseQueue } from '@service/queues/base.queue';
import { notificationWorker } from '@worker/notification.worker';

class NotificationQueue extends BaseQueue {
  constructor() {
    super('notifications');
    this.proccessJob('updateNotification', 6, notificationWorker.updateNotification);
    this.proccessJob('deleteNotification', 6, notificationWorker.deleteNotification);
  }

  public addNotificationJob(name: string, data: INotificationJobData): void {
    this.addJob(name, data);
  }
}

export const notificationQueue: NotificationQueue = new NotificationQueue();
