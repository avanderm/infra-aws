#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { BudgetStack } from '../lib/budget-stack';

const app = new cdk.App();

const environment = process.env.CDK_ENVIRONMENT || 'test';

new BudgetStack(app, 'Budget', {
    env: {
        account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION
    },
    tags: {
        Environment: environment,
        Project: 'general'
    },
    email: app.node.tryGetContext('email')
});
