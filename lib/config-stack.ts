import * as cdk from '@aws-cdk/core';
import * as config from '@aws-cdk/aws-config';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as sns from '@aws-cdk/aws-sns';
import * as targets from '@aws-cdk/aws-events-targets';

export class ConfigStack extends cdk.Stack {
    /**
     * See: https://docs.aws.amazon.com/config/latest/developerguide/iamrole-permissions.html
     */
    public readonly topic: sns.ITopic;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const account = cdk.Stack.of(this).account;
        const region = cdk.Stack.of(this).region;

        const bucket = new s3.Bucket(this, 'ConfigBucket', {
            bucketName: `bfl.config-${region}`,
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });

        const bucketAclPolicy = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            resources: [bucket.bucketArn],
            actions: ['s3:GetBucketAcl'],
        });

        const bucketPutPolicy = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            resources: [`${bucket.bucketArn}/AWSLogs/${account}/*`],
            actions: ['s3:PutObject'],
            conditions: {
                StringLike: {
                    's3:x-amz-acl': 'bucket-owner-full-control'
                }
            }
        });

        const role = new iam.Role(this, 'ConfigRole', {
            assumedBy: new iam.ServicePrincipal('config.amazonaws.com'),
            inlinePolicies: {
                's3': new iam.PolicyDocument({
                    statements: [
                        bucketAclPolicy,
                        bucketPutPolicy
                    ]
                })
            },
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSConfigRole')
            ]
        });
        
        const topic = new sns.Topic(this, 'ConfigAlertsTopic', {
            topicName: 'AWSConfigAlerts'
        });

        topic.grantPublish(role);

        const tagRule = new config.ManagedRule(this, 'RequiredTags', {
            description: 'Ensure all resources conform to our tagging strategy.',
            identifier: 'REQUIRED_TAGS',
            inputParameters: {
                'tag1Key': 'Environment',
                'tag1Value': 'test,staging,production',
                'tag2Key': 'Project'
            }
        });

        tagRule.onComplianceChange('ComplianceChange', {
            target: new targets.SnsTopic(topic)
        });

        const systemsManagerRule = new config.ManagedRule(this, 'ManagedBySSM', {
            description: 'All instances are manager by the AWS Systems Manager.',
            identifier: 'EC2_INSTANCE_MANAGED_BY_SSM'
        });

        systemsManagerRule.onComplianceChange('ComplianceChange', {
            target: new targets.SnsTopic(topic)
        });

        this.topic = topic;
    }
}
