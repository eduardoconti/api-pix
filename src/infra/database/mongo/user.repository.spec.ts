import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { mockUserEntity } from '@domain/__mocks__';

import { UserModel } from '@infra/database/models';
import { UserRepositoryMongo } from '@infra/database/mongo/user.repository';
import { UserNotFoundException } from '@infra/exceptions';

describe('UserRepositoryMongo', () => {
  let repository: UserRepositoryMongo;
  let userModel: Model<UserModel>;
  const model = UserModel.fromEntity(mockUserEntity);

  const mockUserModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    updateOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepositoryMongo,
        {
          provide: getModelToken(UserModel.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    repository = module.get<UserRepositoryMongo>(UserRepositoryMongo);
    userModel = module.get<Model<UserModel>>(getModelToken(UserModel.name));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create new user', async () => {
      jest.spyOn(userModel, 'create').mockResolvedValue(model as any);
      const result = await repository.save(mockUserEntity);

      expect(userModel.create).toHaveBeenCalledWith(model);
      expect(result).toStrictEqual(mockUserEntity);
    });
  });

  describe('exists', () => {
    it('should return true when a user exists', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUserEntity);

      const result = await repository.exists(mockUserEntity.props.email);

      expect(userModel.findOne).toHaveBeenCalledWith({
        email: mockUserEntity.props.email.value,
      });
      expect(result).toEqual(true);
    });

    it('should return false when a user does not exist', async () => {
      mockUserModel.findOne.mockResolvedValueOnce(null);

      const result = await repository.exists(mockUserEntity.props.email);

      expect(userModel.findOne).toHaveBeenCalledWith({
        email: mockUserEntity.props.email.value,
      });
      expect(result).toBeFalsy();
    });
  });

  describe('findOne', () => {
    it('should find one user', async () => {
      mockUserModel.findOne.mockResolvedValue(model);

      const result = await repository.findOne({ id: mockUserEntity.id });

      expect(userModel.findOne).toHaveBeenCalledWith({
        id: mockUserEntity.id.value,
      });
      expect(result).toStrictEqual(mockUserEntity);
    });

    it('should find one user by email', async () => {
      mockUserModel.findOne.mockResolvedValue(model);

      const result = await repository.findOne({
        email: mockUserEntity.props.email,
      });

      expect(userModel.findOne).toHaveBeenCalledWith({
        email: mockUserEntity.props.email.value,
      });
      expect(result).toStrictEqual(mockUserEntity);
    });

    it('should throw UserNotFoundException when user not found', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(
        repository.findOne({
          email: mockUserEntity.props.email,
        }),
      ).rejects.toThrowError(new UserNotFoundException('user not found'));

      expect(userModel.findOne).toHaveBeenCalledWith({
        email: mockUserEntity.props.email.value,
      });
    });
  });

  describe('findMany', () => {
    it('should find many users', async () => {
      mockUserModel.find.mockResolvedValue([model]);

      const result = await repository.findMany();

      expect(userModel.find).toBeCalled();
      expect(result).toStrictEqual([mockUserEntity]);
    });

    it('should find many users by status', async () => {
      mockUserModel.find.mockResolvedValue([model]);

      const result = await repository.findMany({
        status: mockUserEntity.props.status,
      });

      expect(userModel.find).toBeCalledWith({
        status: mockUserEntity.props.status,
      });
      expect(result).toStrictEqual([mockUserEntity]);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      mockUserModel.updateOne.mockResolvedValue(model);

      const result = await repository.update(mockUserEntity);

      expect(userModel.updateOne).toBeCalledWith(
        { id: mockUserEntity.id.value },
        { $set: model },
      );
      expect(result).toStrictEqual(mockUserEntity);
    });
  });
});
