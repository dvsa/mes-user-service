import { APIGatewayProxyEvent } from 'aws-lambda';
import { bootstrapLogging, customMetric, error } from '@dvsa/mes-microservice-common/application/utils/logger';
import { HttpStatus } from '@dvsa/mes-microservice-common/application/api/http-status';
import { getPathParam } from '@dvsa/mes-microservice-common/framework/validation/event-validation';
import { createResponse } from '@dvsa/mes-microservice-common/application/api/create-response';
import { findUser } from '../application/service/FindUser';
import { UserNotFoundError } from '../domain/user-not-found-error';
import { Metric } from '../../../common/application/metric/metric';

export async function handler(event: APIGatewayProxyEvent) {
  try {
    bootstrapLogging('get-user', event);

    const staffNumber = getPathParam(event.pathParameters, 'staffNumber');

    if (!staffNumber) {
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

    error((err instanceof Error) ? err.message : `Unknown error: ${err}`);

    return createResponse('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
