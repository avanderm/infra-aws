import * as cdk from '@aws-cdk/core';
import * as chatbot from '@aws-cdk/aws-chatbot';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';


interface ChatOpsStackProps extends cdk.StackProps {
    budgetTopic: sns.ITopic;
    configTopic: sns.ITopic;
    workspaceId: string;
}

export class ChatOpsStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: ChatOpsStackProps) {
        super(scope, id, props);

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

        const role = new iam.Role(this, 'AWSChatBot', {
            assumedBy: new iam.ServicePrincipal('chatbot.amazonaws.com')
        });

        role.addToPolicy(slackPermissions);
        role.addToPolicy(chatbotPermissions);

        new chatbot.SlackChannelConfiguration(this, 'BudgetChannel', {
            notificationTopics: [
                props.budgetTopic
            ],
            role: role,
            slackChannelConfigurationName: 'aws-budget',
            slackChannelId: 'G01AQKGCH1R',
            slackWorkspaceId: props.workspaceId
        });

        new chatbot.SlackChannelConfiguration(this, 'ConfigChannel', {
            notificationTopics: [
                props.configTopic
            ],
            role: role,
            slackChannelConfigurationName: 'aws-config',
            slackChannelId: 'G01ALLYB21F',
            slackWorkspaceId: props.workspaceId
        });
    }
}
