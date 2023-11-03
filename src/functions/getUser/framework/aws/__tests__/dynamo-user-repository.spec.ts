import * as repository from '../dynamo-user-repository';
import {mockClient} from 'aws-sdk-client-mock';
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {GetCommand, GetCommandOutput} from '@aws-sdk/lib-dynamodb';
import {UserRecord} from '../../../domain/UserRecord';
import {ExaminerRole} from '@dvsa/mes-microservice-common/domain/examiner-role';

describe('Dynamo repository', () => {
  const mockDynamo = mockClient(DynamoDBClient);
  const userRecord = {
    role: ExaminerRole.DE,
    staffNumber: '1234567',
    testPermissionPeriods: [],
  } as UserRecord;

  beforeEach(() => {
    process.env.IS_OFFLINE = 'false';
    process.env.USE_CREDENTIALS = 'false';
  });

  describe('getUserRecord', () => {
    ['true', 'false'].forEach((value) => {
      it(`should return item from DynamoDB when found & IS_OFFLINE is ${value}`, async () => {
        process.env.IS_OFFLINE = value;
        mockDynamo.on(GetCommand).resolves({ $metadata: {}, Item: userRecord } as GetCommandOutput);
        const record = await repository.getUserRecord('1234567');
        expect(record).toEqual(userRecord);
      });
    });

    ['true', 'false'].forEach((value) => {
      it(`should return item from DynamoDB when found & USE_CREDENTIALS is ${value}`, async () => {
        process.env.USE_CREDENTIALS = value;
        mockDynamo.on(GetCommand).resolves({ $metadata: {}, Item: userRecord } as GetCommandOutput);
        const record = await repository.getUserRecord('1234567');
        expect(record).toEqual(userRecord);
      });
    });

    it('should return null when not found in DynamoDB', async () => {
      mockDynamo.on(GetCommand).resolves({ $metadata: {}, Item: undefined } as GetCommandOutput);
      const record = await repository.getUserRecord('1234567');
      expect(record).toEqual(null);
    });
  });
});
