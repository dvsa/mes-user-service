import { Mock } from 'typemoq';
import { ExaminerWorkSchedule } from '@dvsa/mes-journal-schema';
import { UserNotFoundError } from '../../../domain/user-not-found-error';
import { userRecordFixture } from './FindUser.spec.data';
import { findUser } from '../FindUser';
import * as DynamoUserRepository from '../../../framework/aws/dynamo-user-repository';

const dummyWorkSchedule = Mock.ofType<ExaminerWorkSchedule>();
dummyWorkSchedule.setup((x: any) => x.staffNumber).returns(() => '00000000');
dummyWorkSchedule.setup((x: any) => x.then).returns(() => null);

describe('FindUser', () => {
  describe('findUser', () => {
    it('should throw UserNotFoundError when the repo cant get the user', async () => {
      spyOn(DynamoUserRepository, 'getUserRecord').and.returnValue(Promise.resolve(null));

      try {
        await findUser('00000000');
      } catch (err) {
        expect(err instanceof UserNotFoundError).toBe(true);
        return;
      }
      fail();
    });

    it('should not throw error when found in DynamoDB', async () => {
      spyOn(DynamoUserRepository, 'getUserRecord').and.returnValue(Promise.resolve(userRecordFixture));

      expect(
        async () => await findUser('00000000')
      ).not.toThrow(UserNotFoundError);
    });
  });
});
