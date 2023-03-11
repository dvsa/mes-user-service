import { APIGatewayEvent } from 'aws-lambda';
import { Mock, It } from 'typemoq';
import {
  APIGatewayProxyEventBase,
  APIGatewayProxyEventHeaders,
  APIGatewayProxyEventPathParameters,
} from 'aws-lambda/trigger/api-gateway-proxy';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import lambdaTestUtils = require('aws-lambda-test-utils');
import * as createResponse from '../../../../common/application/utils/createResponse';
import * as FindUser from '../../application/service/FindUser';
import handler from '../handler';
import userRecordFixture from '../../application/service/__tests__/FindUser.spec.data';
import UserNotFoundError from '../../domain/user-not-found-error';
import { UserRecord } from '../../domain/UserRecord';

describe('getUser handler', () => {
  let dummyApigwEvent: APIGatewayEvent;
  let createResponseSpy: jasmine.Spy;
  const mockApiGatewayEvent = {
    pathParameters: { staffNumber: '12345678' } as APIGatewayProxyEventPathParameters,
    headers: { 'Content-Type': 'application/json', Authorization: '12345' } as APIGatewayProxyEventHeaders,
  } as APIGatewayProxyEventBase<object>;

  const moqFindUser = Mock.ofInstance(FindUser.default);

  beforeEach(() => {
    moqFindUser.reset();
    createResponseSpy = spyOn(createResponse, 'default');
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    dummyApigwEvent = lambdaTestUtils.mockEventCreator.createAPIGatewayEvent(mockApiGatewayEvent);
    dummyApigwEvent.requestContext.authorizer = { staffNumber: '12345678' };
    process.env.EMPLOYEE_ID_VERIFICATION_DISABLED = undefined;
    spyOn(FindUser, 'default').and.callFake(moqFindUser.object);
  });

  describe('given the FindUser returns a journal', () => {
    it('should return a successful response', async () => {
      moqFindUser.setup(
        (x: (staffNumber: string) => Promise<UserRecord>) => x(It.isAnyString()),
      ).returns(() => Promise.resolve(userRecordFixture));

      createResponseSpy.and.returnValue({ statusCode: 200 });

      const resp = await handler(dummyApigwEvent);

      expect(resp.statusCode).toBe(200);
      expect(createResponse.default).toHaveBeenCalledWith({});
    });
  });

  describe('given FindUser throws a UserNotFound error', () => {
    it('should return HTTP 404 NOT_FOUND', async () => {
      moqFindUser.setup(
        (x: (staffNumber: string) => Promise<UserRecord>) => x(It.isAnyString()),
      ).throws(new UserNotFoundError());

      createResponseSpy.and.returnValue({ statusCode: 404 });

      const resp = await handler(dummyApigwEvent);

      expect(resp.statusCode).toBe(404);
      expect(createResponse.default).toHaveBeenCalledWith({}, 404);
    });
  });

  describe('given there is no staffNumber provided', () => {
    it('should indicate a bad request', async () => {
      dummyApigwEvent.pathParameters = {};
      createResponseSpy.and.returnValue({ statusCode: 400 });

      const resp = await handler(dummyApigwEvent);

      expect(resp.statusCode).toBe(400);
      expect(createResponse.default).toHaveBeenCalledWith('No staffNumber provided', 400);
    });
  });
});
