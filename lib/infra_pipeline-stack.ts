import * as cdk from 'aws-cdk-lib';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';

import { app_pipeline1, app_infra1 } from './app_pipelines';
import { App1InfraStack } from './app_pipelines/app1/infra-stack';

type InfraPipelineStackProps = cdk.StackProps & {
  connectionArn: string,
}

export class InfraPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: InfraPipelineStackProps) {
    super(scope, id, props);

    const infraPipeline = new pipelines.CodePipeline(this, 'rootCodePipeline', {
      pipelineName: 'rootCodePipeline',
      selfMutation: true,
      synth: new pipelines.ShellStep('RootPipelineSynth', {
        input: pipelines.CodePipelineSource.connection('', 'main', {
          connectionArn: props.connectionArn,
        }),
        installCommands: [
          'npm install -g aws-cdk'
        ],
        commands: [
          'npm ci',
          'npm run build',
          `npx cdk synth -c ConnectionArn=${props?.connectionArn}`,
        ]
      }),
    });

    let infra: app_infra1.App1InfraStack;
    infraPipeline.addStage(new class extends cdk.Stage {
      constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);
        infra = new App1InfraStack(this, 'Infra');
      }
    }(this, 'InfraStackStage'));

    infraPipeline.addStage(new class extends cdk.Stage {
      constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);
        new app_pipeline1.AppPipelineStack(this, 'App1Pipeline', infra.specprops);
      }
    }(this, 'App1PipelineStackStage'));
  }
}
