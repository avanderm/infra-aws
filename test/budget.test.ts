import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import Budget = require('../lib/budget-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Budget.BudgetStack(app, 'MyTestStack', {
      email: 'someone@example.com'
    });
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});