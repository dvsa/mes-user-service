import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { fromIni } from '@aws-sdk/credential-providers';
import { DynamoDBClientConfig } from '@aws-sdk/client-dynamodb/dist-types/DynamoDBClient';
import { warn } from '@dvsa/mes-microservice-common/application/utils/logger';
import { UserRecord } from '../../domain/UserRecord';

const createDynamoClient = (): DynamoDBDocument => {
  const opts = { region: 'eu-west-1' } as DynamoDBClientConfig;

  if (process.env.USE_CREDENTIALS === 'true') {
    warn('Using ~/.aws/credentials');
    opts.credentials = fromIni();
  } else if (process.env.USE_SLS === 'true') {
    warn('Using sls offline');
    opts.endpoint = 'http://localhost:8000';
  }

  return DynamoDBDocument.from(new DynamoDBClient(opts));
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
