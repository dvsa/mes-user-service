import { APIGatewayProxyEventPathParameters } from 'aws-lambda';
import { warn } from '@dvsa/mes-microservice-common/application/utils/logger';

export function getStaffNumber(pathParams: APIGatewayProxyEventPathParameters | null): string | null {
  if (pathParams === null
        || typeof pathParams.staffNumber !== 'string'
        || pathParams.staffNumber.trim().length === 0) {
    warn('No staffNumber path parameter found');
    return null;
  }
  return pathParams.staffNumber;
}
