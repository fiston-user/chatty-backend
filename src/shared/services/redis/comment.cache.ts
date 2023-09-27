import { ICommentDocument, ICommentNameList } from '@comment/interfaces/comment.interface';
import { InternalServerError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/helpers';
import { config } from '@root/config';
import { BaseCache } from '@service/redis/base.cache';
import Logger from 'bunyan';
import { find } from 'lodash';

const log: Logger = config.createLogger('commentCache');

export class CommentCache extends BaseCache {
  constructor() {
    super('commentCache');
  }

  public async savePostCommentToCache(postId: string, value: string): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.LPUSH(`comments:${postId}`, value);
      const commentsCount: string[] = await this.client.HMGET(`posts:${postId}`, 'commentsCount');
      let count: number = Helpers.parseJson(commentsCount[0]) as number;
      count += 1;
      await this.client.HSET(`posts:${postId}`, 'commentsCount', `${count}`);
    } catch (error) {
      log.error(error);
      throw new InternalServerError('Server error. Try again.');
    }
  }

  public async getCommentsFromCache(postId: string): Promise<ICommentDocument[]> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const reply: string[] = await this.client.LRANGE(`comments:${postId}`, 0, -1);
      const comments: ICommentDocument[] = [];
      for (const comment of reply) {
        const parsedComment: ICommentDocument = Helpers.parseJson(comment) as ICommentDocument;
        comments.push(parsedComment);
      }
      return comments;
    } catch (error) {
      log.error(error);
      throw new InternalServerError('Server error. Try again.');
    }
  }

  public async getCommentsNamesFromCache(postId: string): Promise<ICommentNameList[]> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const commentsCount: number = await this.client.LLEN(`comments:${postId}`);
      const comments: string[] = await this.client.LRANGE(`comments:${postId}`, 0, -1);
      const list: string[] = [];
      for (const comment of comments) {
        const parsedComment: ICommentDocument = Helpers.parseJson(comment) as ICommentDocument;
        list.push(parsedComment.username);
      }
      const response: ICommentNameList = {
        count: commentsCount,
        names: list
      };
      return [response];
    } catch (error) {
      log.error(error);
      throw new InternalServerError('Server error. Try again.');
    }
  }

  public async getSingleCommentFromCache(postId: string, commentId: string): Promise<ICommentDocument[]> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const comments: string[] = await this.client.LRANGE(`comments:${postId}`, 0, -1);
      const list: ICommentDocument[] = [];
      for (const comment of comments) {
        list.push(Helpers.parseJson(comment));
      }
      const result: ICommentDocument = find(list, (listItem: ICommentDocument) => {
        return listItem._id === commentId;
      }) as ICommentDocument;

      return [result];
    } catch (error) {
      log.error(error);
      throw new InternalServerError('Server error. Try again.');
    }
  }
}
