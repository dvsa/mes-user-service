export function createS3Event(): {
    Records: {
        eventVersion: string;
        eventTime: string;
        requestParameters: {
            sourceIPAddress: string;
        };
        s3: {
            configurationId: string;
            object: {
                eTag: string;
                sequencer: string;
                key: string;
                size: number;
            };
            bucket: {
                arn: string;
                name: string;
                ownerIdentity: {
                    principalId: string;
                };
            };
            s3SchemaVersion: string;
        };
        responseElements: {
            "x-amz-id-2": string;
            "x-amz-request-id": string;
        };
        awsRegion: string;
        eventName: string;
        userIdentity: {
            principalId: string;
        };
        eventSource: string;
    }[];
};
export function createDynamoDBEvent(options: any): any;
export function createSNSEvent(options: any): {
    Records: {
        EventVersion: string;
        EventSubscriptionArn: string;
        EventSource: string;
        Sns: {
            SignatureVersion: string;
            Timestamp: string;
            Signature: string;
            SigningCertUrl: string;
            MessageId: string;
            Message: any;
            MessageAttributes: {
                Test: {
                    Type: string;
                    Value: string;
                };
                TestBinary: {
                    Type: string;
                    Value: string;
                };
            };
            Type: string;
            UnsubscribeUrl: string;
            TopicArn: string;
            Subject: string;
        };
    }[];
};
export function createAPIGatewayEvent(options: any): {
    resource: string;
    path: any;
    httpMethod: any;
    headers: any;
    queryStringParameters: any;
    pathParameters: any;
    stageVariables: any;
    requestContext: {
        accountId: string;
        resourceId: string;
        stage: string;
        requestId: string;
        identity: {
            cognitoIdentityPoolId: any;
            accountId: string;
            cognitoIdentityId: any;
            caller: string;
            apiKey: string;
            sourceIp: string;
            accessKey: string;
            cognitoAuthenticationType: any;
            cognitoAuthenticationProvider: any;
            userArn: string;
            userAgent: string;
            user: string;
        };
        resourcePath: any;
        httpMethod: any;
        apiId: string;
    };
    body: any;
    isBase64Encoded: boolean;
};
