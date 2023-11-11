import { Mock } from 'typemoq';
import { ExaminerWorkSchedule } from '@dvsa/mes-journal-schema';
import { UserNotFoundError } from '../../../domain/user-not-found-error';
import { findUser } from '../FindUser';
import * as DynamoUserRepository from '../../../framework/aws/dynamo-user-repository';
import { userRecordFixture } from '../__mocks__/FindUser.mock.data';

const dummyWorkSchedule = Mock.ofType<ExaminerWorkSchedule>();
dummyWorkSchedule.setup((x: any) => x.staffNumber).returns(() => '00000000');
dummyWorkSchedule.setup((x: any) => x.then).returns(() => null);

describe('FindUser', () => {
  describe('findUser', () => {
    it('should throw UserNotFoundError when the repo cant get the user', async () => {
      jest.spyOn(DynamoUserRepository, 'getUserRecord').mockReturnValue(Promise.resolve(null));

      try {
        await findUser('00000000');
      } catch (err) {
        expect(err instanceof UserNotFoundError).toBe(true);
        return;
      }
      fail();
    });

    it('should not throw error when found in DynamoDB', async () => {
      jest.spyOn(DynamoUserRepository, 'getUserRecord').mockReturnValue(Promise.resolve(userRecordFixture));

      expect(
        async () => await findUser('00000000')
      ).not.toThrow(UserNotFoundError);
    });
  });
});
