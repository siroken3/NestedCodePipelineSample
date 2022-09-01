import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';

import { app1_pipeline, app1_infra } from './app_pipelines';
import { App1InfraStack } from './app_pipelines/app1/infra-stack';

type InfraPipelineStackProps = cdk.StackProps & {
  connectionArn: string,
  githubRepo: string,
}

export class InfraPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: InfraPipelineStackProps) {
    super(scope, id, props);

    const infraPipeline = new pipelines.CodePipeline(this, 'rootCodePipeline', {
      pipelineName: 'rootCodePipeline',
      selfMutation: true,
      synth: new pipelines.CodeBuildStep('RootPipelineSynth', {
        input: pipelines.CodePipelineSource.connection(props.githubRepo, 'main', {
          connectionArn: props.connectionArn,
        }),
        installCommands: [
          'npm install -g aws-cdk'
        ],
        commands: [
          'npm ci',
          'npm run build',
          `npx cdk synth -c ConnectionArn=${props.connectionArn} -c githubRepo=${props.githubRepo}`,
        ],
        rolePolicyStatements: [
          new iam.PolicyStatement({
            actions: ['sts:AssumeRole'],
            resources: ['*'],
            conditions: {
              StringEquals: {
                'iam:ResourceTag/aws-cdk:bootstrap-role': 'lookup',
              }
            }
          })
        ]
      }),
    });

    let infra: app1_infra.App1InfraStack;
    /* At first, manually create the following
    infraPipeline.addStage(new class extends cdk.Stage {
      constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);
        infra = new App1InfraStack(this, 'Infra');
      }
    }(this, 'InfraStackStage'));
    */
    infraPipeline.addStage(new class extends cdk.Stage {
      constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);
        new app1_pipeline.AppPipelineStack(this, 'App1Pipeline', {
          // Due to use Vpc.fromLookup() in AppPipelineStack, we need `env` property
          env: {
            account: process.env.CDK_DEFAULT_ACCOUNT,
            region: process.env.CDK_DEFAULT_REGION,
          }
        });
      }
    }(this, 'App1PipelineStackStage'));
  }
}
