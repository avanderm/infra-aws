import cdk = require('@aws-cdk/core');
import budgets = require('@aws-cdk/aws-budgets');
import sns = require('@aws-cdk/aws-sns');

export interface BudgetStackProps extends cdk.StackProps {
  email?: string;
  topic: sns.ITopic;
}

export class BudgetStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: BudgetStackProps) {
    super(scope, id, props);

    const subscribers = [];

    if (props.email) {
      subscribers.push({
        address: props.email,
        subscriptionType: 'EMAIL'
      });
    }

    // ChatBot notification
    subscribers.push({
        address: props.topic.topicArn,
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
  }
}
