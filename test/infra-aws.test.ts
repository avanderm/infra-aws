import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import InfraAws = require('../lib/infra-aws-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new InfraAws.InfraAwsStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});