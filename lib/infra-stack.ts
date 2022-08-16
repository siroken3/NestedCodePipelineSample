import * as cdk from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster } from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';

export class InfraStack extends cdk.Stack {
    public readonly clusterName: string;
    public readonly vpcId: string;
    public readonly subnetIds: Array<string>;
    public readonly securityGroupIds: Array<string>;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const vpc = new Vpc(this, 'appVpc');
        this.vpcId = vpc.vpcId;
        this.subnetIds = vpc.privateSubnets.map((isubnet) => {
            return isubnet.subnetId;
        });
        this.securityGroupIds = [vpc.vpcDefaultSecurityGroup];
        const cluster = new Cluster(this, 'FargateCluster', {
            vpc: vpc
        });
        this.clusterName = cluster.clusterName;
    }
}