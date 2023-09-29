/* eslint-disable @typescript-eslint/no-explicit-any */
import { SignUp } from '@auth/controllers/signup';
import * as cloudinaryUploads from '@global/helpers/cloudinary-upload';
import { CustomError } from '@global/helpers/error-handler';
import { authMock, authMockRequest, authMockResponse } from '@root/mocks/auth.mock';
import { authService } from '@service/db/auth.service';
import { UserCache } from '@service/redis/user.cache';
import { Request, Response } from 'express';

jest.mock('@service/queues/base.queue');
jest.mock('@service/redis/user.cache');
jest.mock('@service/queues/user.queue');
jest.mock('@service/queues/auth.queue');
jest.mock('@global/helpers/cloudinary-upload');

describe('SignUp', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should throw an error if username is not availble', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: '',
        email: 'fiston@fiston.us',
        password: 'XXXXXXXX',
        avatarColor: '#9c27b0',
        avatarImage: 'avatarImage'
      }
    ) as Request;
    const res: Response = authMockResponse();

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Username is a required field');
    });
  });

  it('should throw an error if email is not availble', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'XXXXXX',
        email: '',
        password: 'XXXXXXXX',
        avatarColor: '#9c27b0',
        avatarImage: 'avatarImage'
      }
    ) as Request;
    const res: Response = authMockResponse();

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Email is a required field');
    });
  });

  it('should throw an error if password is not availble', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'XXXXXX',
        email: 'XXXXXXXXXXXXXXXX',
        password: '',
        avatarColor: '#9c27b0',
        avatarImage: 'avatarImage'
      }
    ) as Request;
    const res: Response = authMockResponse();

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Password is a required field');
    });
  });

  it('should throw unauthorized error if user already exists', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'Manny',
        email: 'manny@me.com',
        password: 'XXXXXXXX',
        avatarColor: '#9c27b0',
        avatarImage: 'avatarImage'
      }
    ) as Request;
    const res: Response = authMockResponse();

    jest.spyOn(authService, 'getUserByUsernameOrEmail').mockResolvedValue(authMock);
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid credentials');
    });
  });

  it('should set session data for valid credentials and send correct json response', async () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'Manny',
        email: 'manny@me.com',
        password: 'XXXXXXXX',
        avatarColor: '#9c27b0',
        avatarImage: 'avatarImage'
      }
    ) as Request;
    const res: Response = authMockResponse();

    jest.spyOn(authService, 'getUserByUsernameOrEmail').mockResolvedValue(null as any);
    const userSpy = jest.spyOn(UserCache.prototype, 'saveUserToCache');
    jest.spyOn(cloudinaryUploads, 'uploads').mockImplementation((): any => Promise.resolve({ version: '1156', public_id: '444' }));

    await SignUp.prototype.create(req, res);
    expect(req.session?.jwt).toBeDefined();
    expect(res.json).toHaveBeenCalledWith({
      message: 'User created successfully',
      user: userSpy.mock.calls[0][2],
      token: req.session?.jwt
    });
  });
});
