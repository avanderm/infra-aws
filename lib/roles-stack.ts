import cdk = require('@aws-cdk/core')
import iam = require('@aws-cdk/aws-iam')

export class RolesStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new iam.Role(this, 'ApiGatewayCloudWatchLogsRole', {
            assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonAPIGatewayPushToCloudWatchLogs')
            ]
        });

        const slackPermissions = new iam.PolicyStatement();
        slackPermissions.addAllResources();
        slackPermissions.addActions(
            'chatbot:Describe*',
            'chatbot:CreateSlackChannelConfiguration',
            'chatbot:DeleteSlackChannelConfiguration',
            'chatbot:UpdateSlackChannelConfiguration',
        );

        const chatbotPermissions = new iam.PolicyStatement();
        chatbotPermissions.addAllResources();
        chatbotPermissions.addActions(
            'cloudwatch:Describe*',
            'cloudwatch:Get*',
            'cloudwatch:List*',
            'logs:Get*',
            'logs:List*',
            'logs:Describe*',
            'logs:TestMetricFilter',
            'logs:FilterLogEvents',
            'sns:Get*',
            'sns:List*',
        );

        const chatbotRole = new iam.Role(this, 'AWSChatBot', {
            assumedBy: new iam.ServicePrincipal('chatbot.amazonaws.com')
        });

        chatbotRole.addToPolicy(slackPermissions);
        chatbotRole.addToPolicy(chatbotPermissions);
    }
}
