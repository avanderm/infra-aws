#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { InfraAwsStack } from '../lib/infra-aws-stack';

const app = new cdk.App();
new InfraAwsStack(app, 'InfraAwsStack');
