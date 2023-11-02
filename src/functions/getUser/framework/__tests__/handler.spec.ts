const lambdaTestUtils = require('aws-lambda-test-utils');
import * as response from '@dvsa/mes-microservice-common/application/api/create-response';
import { handler } from '../handler';
import { APIGatewayEvent } from 'aws-lambda';
import * as FindUser from '../../application/service/FindUser';
import { Mock, It } from 'typemoq';
import { UserNotFoundError } from '../../domain/user-not-found-error';

describe('getUser handler', () => {
  let dummyApigwEvent: APIGatewayEvent;
  let createResponseSpy: jasmine.Spy;

  const moqFindUser = Mock.ofInstance(FindUser.findUser);

  beforeEach(() => {
    moqFindUser.reset();

    createResponseSpy = spyOn(response, 'createResponse');
    dummyApigwEvent = lambdaTestUtils.mockEventCreator.createAPIGatewayEvent({
      pathParameters: {
        staffNumber: '12345678',
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: '12345',
      },
    });
    dummyApigwEvent.requestContext.authorizer = { staffNumber: '12345678' };
    process.env.EMPLOYEE_ID_VERIFICATION_DISABLED = undefined;
    spyOn(FindUser, 'findUser').and.callFake(moqFindUser.object);
  });

  describe('given the FindUser returns a journal', () => {
    it('should return a successful response', async () => {
      moqFindUser.setup(x => x(It.isAny())).returns(() => Promise.resolve());
      createResponseSpy.and.returnValue({ statusCode: 200 });

      const resp = await handler(dummyApigwEvent);

      expect(resp.statusCode).toBe(200);
      expect(response.createResponse).toHaveBeenCalledWith({});
    });
  });

  describe('given FindUser throws a UserNotFound error', () => {
    it('should return HTTP 404 NOT_FOUND', async () => {
      moqFindUser.setup(x => x(It.isAny())).throws(new UserNotFoundError());
      createResponseSpy.and.returnValue({ statusCode: 404 });

      const resp = await handler(dummyApigwEvent);

      expect(resp.statusCode).toBe(404);
      expect(response.createResponse).toHaveBeenCalledWith({}, 404);
    });
  });

  describe('given there is no staffNumber provided', () => {
    it('should indicate a bad request', async () => {
      dummyApigwEvent.pathParameters = {};
      createResponseSpy.and.returnValue({ statusCode: 400 });

      const resp = await handler(dummyApigwEvent);

      expect(resp.statusCode).toBe(400);
      expect(response.createResponse).toHaveBeenCalledWith('No staffNumber provided', 400);
    });
  });
});
