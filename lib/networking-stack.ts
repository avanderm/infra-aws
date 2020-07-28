import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');

export class NetworkingStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const vpc = new ec2.Vpc(this, 'sandbox-vpc', {
            cidr: '10.0.0.0/16',
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'Public',
                    subnetType: ec2.SubnetType.PUBLIC
                },
                {
                    cidrMask: 24,
                    name: 'Isolated',
                    subnetType: ec2.SubnetType.ISOLATED
                }
            ],
            vpnGateway: false
        });
    }
}