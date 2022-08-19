import { pipelines, Stack, StackProps, Stage, StageProps } from "aws-cdk-lib";
import { Repository } from "aws-cdk-lib/aws-ecr";
import { Construct } from "constructs";
import { AppTask1Stack } from "./app-stack";

export class AppPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        const ecrRepository = Repository.fromRepositoryName(this, 'ecrRepositoryRef', 'myrepo');
        const synth = new pipelines.CodeBuildStep('synth', {
            input: pipelines.CodePipelineSource.ecr(ecrRepository, {
                imageTag: 'latest',
            }),
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
        const wave = pipeline.addWave('AppTaskWave');
        wave.addStage(new class extends Stage {
            constructor(scope: Construct, id: string, stageProps?: StageProps) {
                super(scope, id, stageProps);
                new AppTask1Stack(this, 'AppTask1', {
                    env: {
                        account: process.env.CDK_DEFAULT_ACCOUNT,
                        region: process.env.CDK_DEFAULT_REGION,
                    }
                });
            }
        }(this, 'AppTask1Stage'));
    }
}
