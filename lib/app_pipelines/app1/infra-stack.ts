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
        this.specprops = {
            vpc: new Vpc(this, 'appVpc'),
            subnets: this.specprops.vpc.privateSubnets,
            securityGroups: [this.specprops.vpc.vpcDefaultSecurityGroup],
            cluster: new Cluster(this, 'FargateCluster', {
                vpc: this.specprops.vpc
            }),
            ecrRepository: new Repository(this, 'ecrRepository'),
        }
    }
}
