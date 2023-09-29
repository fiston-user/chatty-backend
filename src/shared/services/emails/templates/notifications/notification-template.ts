import { INotificationTemplate } from '@notification/interfaces/notification.interface';
import ejs from 'ejs';
import fs from 'fs';

class NotificationTemplate {
  public notificationMessageTemplate(templateParams: INotificationTemplate): string {
    const { username, header, message } = templateParams;
    return ejs.render(fs.readFileSync(__dirname + '/notification.ejs', 'utf-8'), {
      username,
      header,
      message,
      image_url: ''
    });
  }
}

export const notificationTemplate: NotificationTemplate = new NotificationTemplate();
