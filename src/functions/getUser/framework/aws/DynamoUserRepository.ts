import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { warn } from '@dvsa/mes-microservice-common/application/utils/logger';
import { UserRecord } from '../../domain/UserRecord';

const createDynamoClient = () => {
  return process.env.IS_OFFLINE
    ? DynamoDBDocument.from(new DynamoDB({ endpoint: 'http://localhost:8000' }))
    : DynamoDBDocument.from(new DynamoDB({ region: 'eu-west-1' }));
};

const ddb = createDynamoClient();
const tableName = getUserTableName();

export async function getUserRecord(staffNumber: string): Promise<UserRecord | null> {
  const response = await ddb.get({
    TableName: tableName,
    Key: { staffNumber },
  });

  if (response.Item === undefined) {
    return null;
  }

  return response.Item as UserRecord;
}

function getUserTableName(): string {
  let tableName = process.env.USERS_DDB_TABLE_NAME;
  if (tableName === undefined || tableName.length === 0) {
    warn('No user table name set, using the default');
    tableName = 'users';
  }
  return tableName;
}
