import * as cdk from 'aws-cdk-lib';
import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { Cluster } from 'aws-cdk-lib/aws-ecs';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as config from './config';

export class App1InfraStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        // IAM Role
        const executionRole = new Role(this, 'EcsTaskExecutionRole', {
            roleName: config.executionRole,
            assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
            managedPolicies: [
                ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')
            ],
        });
        const serviceTaskRole = new Role(this, 'EcsServiceTaskRole', {
            roleName: config.serviceTaskRole,
            assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
        });

        // VPC
        const vpc = new Vpc(this, 'appVpc', {
            vpcName: config.vpcName,
            maxAzs: 2,
            subnetConfiguration: [
                {
                    name: 'Public',
                    subnetType: SubnetType.PUBLIC,
                },
                {
                    name: 'Private',
                    subnetType: SubnetType.PRIVATE_WITH_NAT,
                },
                {
                    name: 'Isolated',
                    subnetType: SubnetType.PRIVATE_ISOLATED,
                },
            ],
        });
        // ECS
        new Cluster(this, 'appCluster', {
            clusterName: config.clusterName,
            vpc: vpc,
        });
        new Repository(this, 'ecrRepository', {
            repositoryName: config.ecrRepository,
        });
    }
}
