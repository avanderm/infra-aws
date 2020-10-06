import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';

export class RolesStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new iam.Role(this, 'ApiGatewayCloudWatchLogsRole', {
            assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonAPIGatewayPushToCloudWatchLogs')
            ]
        });

        new iam.Role(this, 'DMSVPCRole', {
            assumedBy: new iam.ServicePrincipal('dms.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonDMSVPCManagementRole')
            ],
            roleName: 'dms-vpc-role'
        });
    }
}
