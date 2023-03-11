import UserNotFoundError from '../../../domain/user-not-found-error';
import userRecordFixture from './FindUser.spec.data';
import findUser from '../FindUser';
import * as DynamoUserRepository from '../../../framework/aws/DynamoUserRepository';

describe('FindUser', () => {
  describe('findUser', () => {
    it('should throw UserNotFoundError when the repo cant get the user', async () => {
      spyOn(DynamoUserRepository, 'default').and.resolveTo(null);

      try {
        await findUser('00000000');
      } catch (err) {
        expect(err instanceof UserNotFoundError).toBe(true);
        return;
      }
      fail();
    });

    it('should return the user record', async () => {
      spyOn(DynamoUserRepository, 'default').and.resolveTo(userRecordFixture);

      const result = await findUser('00000000');

      expect(result).toBe(userRecordFixture);
    });
  });
});
