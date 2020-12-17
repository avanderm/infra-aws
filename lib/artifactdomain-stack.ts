import * as cdk from '@aws-cdk/core';
import * as codeartifact from '@aws-cdk/aws-codeartifact';

export class ArtifactDomainStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new codeartifact.CfnDomain(this, 'BrainFartLab', {
          domainName: 'brainfartlab'
        });
    }
}
