import { APIGatewayProxyEvent, APIGatewayProxyEventPathParameters, Context } from 'aws-lambda';
import { customMetric, error, warn } from '@dvsa/mes-microservice-common/application/utils/logger';
import createResponse from '../../../common/application/utils/createResponse';
import { HttpStatus } from '../../../common/application/api/HttpStatus';
import { findUser } from '../application/service/FindUser';
import { UserNotFoundError } from '../domain/user-not-found-error';

export async function handler(event: APIGatewayProxyEvent, fnCtx: Context) {
  const staffNumber = getStaffNumber(event.pathParameters);
  if (staffNumber === null) {
    return createResponse('No staffNumber provided', HttpStatus.BAD_REQUEST);
  }

  try {
    await findUser(staffNumber);
    customMetric('UserFound', 'User found in DynamoDB table using staff number provided');
    return createResponse({});
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      customMetric('UserNotFound', 'User not found in DynamoDB table using staff number provided');
      return createResponse({}, HttpStatus.NOT_FOUND);
    }
    error(err as string);
    return createResponse('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

function getStaffNumber(pathParams: APIGatewayProxyEventPathParameters | null): string | null {
  if (pathParams === null
    || typeof pathParams.staffNumber !== 'string'
    || pathParams.staffNumber.trim().length === 0) {
    warn('No staffNumber path parameter found');
    return null;
  }
  return pathParams.staffNumber;
}
