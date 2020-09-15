#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { BudgetStack } from '../lib/budget-stack';
import { NetworkingStack } from '../lib/networking-stack';
import { RolesStack } from '../lib/roles-stack';
import { ConfigStack } from '../lib/config-stack';
// import { DnsStack } from '../lib/dns-stack';

const app = new cdk.App();

const environment = process.env.CDK_ENVIRONMENT || 'test';

const email = app.node.tryGetContext('email');

new NetworkingStack(app, 'Networking', {
    env: {
        account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION
    },
    tags: {
        Environment: environment,
        Project: 'general'
    }
});

new RolesStack(app, 'Roles', {
    env: {
        account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION
    },
    tags: {
        Environment: environment,
        Project: 'general'
    }
});

new ConfigStack(app, 'Config', {
    env: {
        account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION
    },
    tags: {
        Environment: environment,
        Project: 'general'
    }
});

new BudgetStack(app, 'Budget', {
    env: {
        account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION
    },
    tags: {
        Environment: environment,
        Project: 'general'
    },
    email: email
});

// new DnsStack(app, 'DNS', {
//     env: {
//         account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
//         region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION
//     },
//     tags: {
//         Environment: environment,
//         Project: 'general'
//     }
// });
