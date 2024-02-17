import { IFileImageJobData } from '@image/interfaces/image.interface';
import { BaseQueue } from '@service/queues/base.queue';
import { imageWorker } from '@worker/image.worker';

class ImageQueue extends BaseQueue {
  constructor() {
    super('images');
    this.proccessJob('addUserProfileImageToDB', 5, imageWorker.addUserProfileImageToDB);
    this.proccessJob('updateBGImageInDB', 5, imageWorker.updateBGImageInDB);
    this.proccessJob('addImageToDB', 5, imageWorker.addImageToDB);
    this.proccessJob('removeImageFromDB', 5, imageWorker.removeImageFromDB);
  }

  public addImageJob(name: string, data: IFileImageJobData): void {
    this.addJob(name, data);
  }
}

export const imageQueue: ImageQueue = new ImageQueue();
