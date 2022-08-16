import { pipelines, Stack, StackProps, Stage, StageProps } from "aws-cdk-lib";
import { Repository } from "aws-cdk-lib/aws-ecr";
import { Construct } from "constructs";

type AppPipelineStackProps = StackProps & {
    clusterName: string,
    vpcId: string,
    subnetIds: Array<string>,
    securityGroupIds: Array<string>,
};

export class AppPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props: AppPipelineStackProps) {
        super(scope, id, props);
        const ecrRepository = Repository.fromRepositoryName(this, 'ecrRepositoryRef', '');
        const synth = new pipelines.CodeBuildStep('synth', {
            input: pipelines.CodePipelineSource.ecr(ecrRepository),
            commands: [
                'mkdir ./cdk.out',
                'echo dummy > ./cdk.out/dummy.txt'
            ],
            primaryOutputDirectory: './cdk.out',
        });
        const pipeline = new pipelines.CodePipeline(this, 'NestedCodePipeline1', {
            pipelineName: 'NestedCodePipeline1',
            selfMutation: false,
            synth: synth,
        });

        const wave = pipeline.addWave('ScheduledTaskWave');
        const clusterName = '';
        const vpcId = '';
        const subnetIds = [

        ];
        const securityGroupIds = [

        ];
        wave.addStage(new class extends Stage {
            constructor(scope: Construct, id: string, stageProps?: StageProps) {
                super(scope, id, stageProps);
            }
        }(this, 'ScheduledTask1'));
        wave.addStage(new class extends Stage {
            constructor(scope: Construct, id: string, stageProps?: StageProps) {
                super(scope, id, stageProps);
            }
        }(this, 'ScheduledTask2'));
    }
}