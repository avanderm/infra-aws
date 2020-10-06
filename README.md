# Infrastructure

AWS infrastructure as code for personal accounts.

# Stacks

## Roles

This stack includes several IAM roles for first time setting up certain AWS services (e.g. API Gateway).

## Networking

Contains VPC configurations (subnets, EIPs, NAT, ...).

## Budget

Contains AWS Budget resources.

## Config

Contains AWS Config rules. The default configuration recorder and delivery channel are not supported by the CDK at the time of writing (version 1.62.0). These must be created manually through the console of CLI first time around. It is recommended to include a delivery channel to S3. For SNS notifications we create a SNS topic and link it to individual AWS Config rules, since they can be formatted by the AW ChatBot.

## ChatOps

Configures the Slack channels for AWS ChatBot. It is important that the bot is invited to the used Slack channels to ensure notification delivery success.

## Trail

Configures a CloudTrail to the data bunker AWS account. The CDK does not provide a message to make the trail organization wide, so it must be configured afterwards through the CLI or the console.

# Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
