import cdk = require('@aws-cdk/core');
import config = require('@aws-cdk/aws-config');
import iam = require('@aws-cdk/aws-iam');
import targets = require('@aws-cdk/aws-events-targets');
import s3 = require('@aws-cdk/aws-s3');
import sns = require('@aws-cdk/aws-sns');

export class ConfigStack extends cdk.Stack {
    public readonly configTopic: sns.Topic;

    /**
     * See: https://docs.aws.amazon.com/config/latest/developerguide/iamrole-permissions.html
     */
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
        
        const topic = new sns.Topic(this, 'ConfigTopic', {
            topicName: 'AWSConfigAlerts'
        });

        topic.grantPublish(role);

        this.configTopic = topic;
    }
}

interface ConfigRulesStackProps extends cdk.StackProps {
    configTopic: sns.Topic;
}

export class ConfigRulesStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: ConfigRulesStackProps) {
        super(scope, id, props);

        const tagRule = new config.ManagedRule(this, 'RequiredTags', {
            identifier: 'REQUIRED_TAGS',
            inputParameters: {
                'tag1Key': 'Environment',
                'tag1Value': 'test,staging,production',
                'tag2Key': 'Project'
            }
        });

        tagRule.onComplianceChange('ComplianceChange', {
            target: new targets.SnsTopic(props.configTopic)
        });
    }
}
