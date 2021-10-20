import { APIGatewayProxyEvent, APIGatewayProxyEventPathParameters, Context } from 'aws-lambda';
import createResponse from '../../../common/application/utils/createResponse';
import { HttpStatus } from '../../../common/application/api/HttpStatus';
import * as logger from '../../../common/application/utils/logger';
import { findUser } from '../application/service/FindUser';
import { UserRecord } from '../domain/UserRecord';
import { UserNotFoundError } from '../domain/user-not-found-error';

export async function handler(event: APIGatewayProxyEvent, fnCtx: Context) {
  const staffNumber = getStaffNumber(event.pathParameters);
  if (staffNumber === null) {
    return createResponse('No staffNumber provided', HttpStatus.BAD_REQUEST);
  }

  try {
    const userRecord: UserRecord = await findUser(staffNumber);
    return createResponse({});
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return createResponse({}, HttpStatus.NOT_FOUND);
    }
    logger.error(err);
    return createResponse('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

function getStaffNumber(pathParams: APIGatewayProxyEventPathParameters | null): string | null {
  if (pathParams === null
    || typeof pathParams.staffNumber !== 'string'
    || pathParams.staffNumber.trim().length === 0) {
    logger.warn('No staffNumber path parameter found');
    return null;
  }
  return pathParams.staffNumber;
}
