import { UserRecord } from '../../../domain/UserRecord';

const userRecordFixture: UserRecord = {
  role: 'DE',
  staffNumber: '123456',
  testPermissionPeriods: [
    {
      from: 'yesterday',
      testCategory: 'B',
      to: true,
    },
  ],
};

export default userRecordFixture;
