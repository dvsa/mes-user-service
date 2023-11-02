import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { fromIni } from '@aws-sdk/credential-providers';
import { warn } from '@dvsa/mes-microservice-common/application/utils/logger';
import { UserRecord } from '../../domain/UserRecord';

const createDynamoClient = () => {
  const opts = { region: 'eu-west-1' } as DynamoDBClientConfig;

  if (process.env.USE_CREDENTIALS === 'true') {
    warn('Using AWS credentials');
    opts.credentials = fromIni();
  } else if (process.env.IS_OFFLINE === 'true') {
    warn('Using SLS offline');
    opts.endpoint = process.env.DDB_OFFLINE_ENDPOINT;
  }

  return new DynamoDBClient(opts);
};

export async function getUserRecord(staffNumber: string): Promise<UserRecord | null> {
  const ddb = createDynamoClient();
  const tableName = getUserTableName();

  const response = await ddb.send(
    new GetCommand({
      TableName: tableName,
      Key: { staffNumber },
    })
  );

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
