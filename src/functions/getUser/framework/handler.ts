import { APIGatewayProxyEvent } from 'aws-lambda';
import {
  bootstrapLogging, customMetric, error,
} from '@dvsa/mes-microservice-common/application/utils/logger';
import createResponse from '../../../common/application/utils/createResponse';
import HttpStatus from '../../../common/application/api/HttpStatus';
import getStaffNumber from '../application/validation/get-staff-number';
import findUser from '../application/service/FindUser';
import UserNotFoundError from '../domain/user-not-found-error';
import Metric from '../../../common/application/metric/metric';
import Response from '../../../common/application/api/Response';

async function handler(event: APIGatewayProxyEvent): Promise<Response> {
  bootstrapLogging('user-service', event);

  const staffNumber = getStaffNumber(event.pathParameters);
  if (staffNumber === null) {
    return createResponse('No staffNumber provided', HttpStatus.BAD_REQUEST);
  }

  try {
    await findUser(staffNumber);
    customMetric(Metric.UserFound, 'User found in DynamoDB table using staff number provided');
    return createResponse({});
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      customMetric(Metric.UserNotFound, 'User not found in DynamoDB table using staff number provided');
      return createResponse({}, HttpStatus.NOT_FOUND);
    }
    error('Unknown error', err);
    return createResponse('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export default handler;
