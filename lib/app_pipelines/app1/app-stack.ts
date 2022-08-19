import { Stack, StackProps } from "aws-cdk-lib";
import { ISecurityGroup, SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage, FargateService, FargateTaskDefinition, Protocol } from 'aws-cdk-lib/aws-ecs';
import { Role } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import * as config from './config';

export class AppTask1Stack extends Stack {
    constructor(scope: Construct, id: string, stackProps?: StackProps) {
        super(scope, id, stackProps);
        const vpc = Vpc.fromLookup(this, 'vpcRef', {
            vpcName: config.vpcName,
        });
        const securityGroups: Array<ISecurityGroup> = [
            SecurityGroup.fromLookupByName(this, 'securityGroupRef', 'default', vpc),
        ];
        const cluster = Cluster.fromClusterAttributes(this, `clusterRef`, {
            clusterName: config.clusterName,
            vpc: vpc,
            securityGroups: securityGroups,
        });
        const image = ContainerImage.fromRegistry(config.ecrRepository);
        const serviceTaskDefinition = new FargateTaskDefinition(this, 'ServiceTaskDefinition', {
            executionRole: Role.fromRoleName(this, 'executionRoleRef', config.executionRole),
            taskRole: Role.fromRoleName(this, 'serviceTaskRoleRef', config.serviceTaskRole),
        });
        serviceTaskDefinition.addContainer('serviceTaskContainerDefinition', {
            image,
        }).addPortMappings({
            containerPort: 3000,
            protocol: Protocol.TCP,
        });
        
        new FargateService(this, 'ServiceDefinition', {
            cluster: cluster,
            serviceName: 'helloWorld',
            assignPublicIp: false,
            taskDefinition: serviceTaskDefinition,
            vpcSubnets: {
                subnetType: SubnetType.PRIVATE_ISOLATED,
            }
        });
    }
};