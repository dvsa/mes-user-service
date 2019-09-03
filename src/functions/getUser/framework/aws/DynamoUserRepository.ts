import { DynamoDB } from 'aws-sdk';
import * as logger from '../../../../common/application/utils/logger';
import { UserRecord } from '../../domain/UserRecord';

const createDynamoClient = () => {
  return process.env.IS_OFFLINE
    ? new DynamoDB.DocumentClient({ endpoint: 'http://localhost:8000' })
    : new DynamoDB.DocumentClient();
};

const ddb = createDynamoClient();
const tableName = getUserTableName();

export async function getUserRecord(staffNumber: string): Promise<UserRecord | null> {
  const getUserResult = await ddb.get({
    TableName: tableName,
    Key: {
      staffNumber,
    },
  }).promise();

  if (getUserResult.Item === undefined) {
    return null;
  }

  return getUserResult.Item as UserRecord;
}

function getUserTableName(): string {
  let tableName = process.env.USERS_DDB_TABLE_NAME;
  if (tableName === undefined || tableName.length === 0) {
    logger.warn('No user table name set, using the default');
    tableName = 'users';
  }
  return tableName;
}
