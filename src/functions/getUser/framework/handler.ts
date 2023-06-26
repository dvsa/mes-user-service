import { APIGatewayProxyEvent, APIGatewayProxyEventPathParameters } from 'aws-lambda';
import { bootstrapLogging, customMetric, error, warn } from '@dvsa/mes-microservice-common/application/utils/logger';
import createResponse from '../../../common/application/utils/createResponse';
import { HttpStatus } from '../../../common/application/api/HttpStatus';
import { findUser } from '../application/service/FindUser';
import { UserNotFoundError } from '../domain/user-not-found-error';
import { Metric } from '../../../common/application/metric/metric';

export async function handler(event: APIGatewayProxyEvent) {
  try {
    bootstrapLogging('user-service', event);

    const staffNumber = getStaffNumber(event.pathParameters);
    if (staffNumber === null) {
      error('No staffNumber provided');
      return createResponse('No staffNumber provided', HttpStatus.BAD_REQUEST);
    }

    await findUser(staffNumber);

    customMetric(Metric.UserFound, 'User found in DynamoDB table using staff number provided');

    return createResponse({});
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      customMetric(Metric.UserNotFound, 'User not found in DynamoDB table using staff number provided');
      return createResponse({}, HttpStatus.NOT_FOUND);
    }
    error('Unknown error', (err instanceof Error) ? err.message : err);
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
