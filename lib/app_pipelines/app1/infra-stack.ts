import * as cdk from 'aws-cdk-lib';
import { ISubnet, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Repository, RepositoryBase } from 'aws-cdk-lib/aws-ecr';
import { Cluster } from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';
import * as pipeline from './pipeline-stack';

export class App1InfraStack extends cdk.Stack {
    public readonly specprops: pipeline.EcsClusterSpecProps
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const vpc = new Vpc(this, 'appVpc');
        this.specprops = {
            vpc: vpc,
            subnets: vpc.privateSubnets,
            securityGroups: [vpc.vpcDefaultSecurityGroup],
            cluster: new Cluster(this, 'FargateCluster', {
                vpc: vpc
            }),
            ecrRepository: new Repository(this, 'ecrRepository'),
        }
    }
}
