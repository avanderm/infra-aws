import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

export class StorageStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const account = cdk.Stack.of(this).account;
        const region = cdk.Stack.of(this).region;

        new s3.Bucket(this, 'AthenaQueryResultsBucket', {
          bucketName: `query-results-${account}-${region}`
        });
    }
}
