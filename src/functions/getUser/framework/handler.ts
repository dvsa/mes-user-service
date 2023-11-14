import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { bootstrapLogging, error, info } from '@dvsa/mes-microservice-common/application/utils/logger';
import { HttpStatus } from '@dvsa/mes-microservice-common/application/api/http-status';
import { getPathParam } from '@dvsa/mes-microservice-common/framework/validation/event-validation';
import { createResponse } from '@dvsa/mes-microservice-common/application/api/create-response';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { LambdaInterface } from '@aws-lambda-powertools/commons';
import { findUser } from '../application/service/FindUser';
import { UserNotFoundError } from '../domain/user-not-found-error';

const options = { serviceName: 'get-user' };
export const tracer = new Tracer(options);

class Lambda implements LambdaInterface {

  @tracer.captureLambdaHandler()
  public async handler(event: APIGatewayProxyEvent, _context?: Context) {
    try {
      process.env.X_AMZN_TRACE_ID = tracer.getRootXrayTraceId();

      bootstrapLogging(options.serviceName, event);

      const staffNumber = getPathParam(event.pathParameters, 'staffNumber');

      if (!staffNumber) {
        error('No staffNumber provided');
        return createResponse('No staffNumber provided', HttpStatus.BAD_REQUEST);
      }

      await this.findUser(staffNumber);

      info('User found in DynamoDB table using staff number provided');

      return createResponse({});
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        error('User not found in DynamoDB table using staff number provided');
        return createResponse({}, HttpStatus.NOT_FOUND);
      }

      error((err instanceof Error) ? err.message : `Unknown error: ${err}`);

      return createResponse('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @tracer.captureMethod({ subSegmentName: '### findUser' })
  private async findUser(staffNumber: string) {
    return findUser(staffNumber);
  }
}

const handlerClass = new Lambda();
export const handler = handlerClass.handler.bind(handlerClass);
