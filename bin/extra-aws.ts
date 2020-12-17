#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import { ArtifactDomainStack } from '../lib/artifactdomain-stack';

const app = new cdk.App()

const environment = process.env.CDK_ENVIRONMENT || 'test';

new ArtifactDomainStack(app, 'ArtifactDomains', {
    env: {
        account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION
    },
    tags: {
        Environment: environment,
        Project: 'general'
    }
});
