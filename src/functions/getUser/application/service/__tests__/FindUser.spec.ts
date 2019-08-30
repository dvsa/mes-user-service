import { Mock, It, Times } from 'typemoq';
import { ExaminerWorkSchedule } from '@dvsa/mes-journal-schema/Journal';
import { UserNotFoundError } from '../../../domain/user-not-found-error';
import { userRecordFixture } from './FindUser.spec.data';
import { findUser } from '../FindUser';
import * as DynamoUserRepository from '../../../framework/aws/DynamoUserRepository';


const dummyWorkSchedule = Mock.ofType<ExaminerWorkSchedule>();
dummyWorkSchedule.setup((x: any) => x.staffNumber).returns(() => '00000000');
dummyWorkSchedule.setup((x: any) => x.then).returns(() => null);

describe('FindUser', () => {

  describe('findUser', () => {
    it('should throw UserNotFoundError when the repo cant get the user', async () => {
      spyOn(DynamoUserRepository, 'getUserRecord').and.returnValue(null);

      try {
        await findUser('00000000');
      } catch (err) {
        expect(err instanceof UserNotFoundError).toBe(true);
        return;
      }
      fail();
    });

    it('should return the user record', async () => {
      spyOn(DynamoUserRepository, 'getUserRecord')
        .and.returnValue(userRecordFixture);

      const result = await findUser('00000000');
      expect(result).toBe(userRecordFixture);
    });

  });
});
