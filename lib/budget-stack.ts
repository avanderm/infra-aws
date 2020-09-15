import * as cdk from '@aws-cdk/core';
import * as budgets from '@aws-cdk/aws-budgets';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';


export interface BudgetStackProps extends cdk.StackProps {
    email?: string;
}

export class BudgetStack extends cdk.Stack {
    public readonly topic: sns.ITopic;

    constructor(scope: cdk.Construct, id: string, props: BudgetStackProps) {
        super(scope, id, props);

        const subscribers = [];

        const topic = new sns.Topic(this, 'BudgetAlertsTopic', {
            topicName: 'AWSBudgetAlerts'
        });

        const budgetPermissions = new iam.PolicyStatement({
            principals: [
                new iam.ServicePrincipal('budgets.amazonaws.com')
            ],
            actions: [ 'sns:Publish' ],
            resources: [ '*' ]
        });

        topic.addToResourcePolicy(budgetPermissions);

        if (props.email) {
            subscribers.push({
                address: props.email,
                subscriptionType: 'EMAIL'
            });
        }

        // ChatBot notification
        subscribers.push({
            address: topic.topicArn,
            subscriptionType: 'SNS'
        });

        const budget = new budgets.CfnBudget(this, 'Budget', {
            budget: {
                budgetType: 'COST',
                budgetLimit: {
                    amount: 40,
                    unit: 'USD'
                },
                budgetName: 'MonthlyBudget',
                timeUnit: 'MONTHLY'
            },
            notificationsWithSubscribers: [
                {
                    notification: {
                        comparisonOperator: 'GREATER_THAN',
                        notificationType: 'ACTUAL',
                        threshold: 100,
                        thresholdType: 'PERCENTAGE'
                    },
                    subscribers: subscribers
                }
            ]
        });

        this.topic = topic;
    }
}
