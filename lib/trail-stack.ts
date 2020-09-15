import * as cdk from '@aws-cdk/core';
import * as cloudtrail from '@aws-cdk/aws-cloudtrail';
import * as s3 from '@aws-cdk/aws-s3';

interface TrailStackProps extends cdk.StackProps {
    dataBunkerAccount: string;
}

export class TrailStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: TrailStackProps) {
        super(scope, id, props);

        const logBucket = s3.Bucket.fromBucketName(this, 'LogBucket', `aws-cloudtrail-logs-${props.dataBunkerAccount}`);

        new cloudtrail.Trail(this, 'OrganizationTrail', {
            bucket: logBucket,
            enableFileValidation: true,
            isMultiRegionTrail: true
        });
    }
}
