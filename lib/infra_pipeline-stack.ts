import * as cdk from 'aws-cdk-lib';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';

import { app_pipeline1 } from './app_pipelines';
import { InfraStack } from './infra-stack';

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

    let infra: InfraStack;
    infraPipeline.addStage(new class extends cdk.Stage {
      constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);
        infra = new InfraStack(this, 'Infra');
      }
    }(this, 'InfraStackStage'));

    infraPipeline.addStage(new class extends cdk.Stage {
      constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);
        new app_pipeline1.AppPipelineStack(this, 'App1Pipeline', {
          clusterName: infra.clusterName,
          vpcId: infra.vpcId,
          subnetIds: infra.subnetIds,
          securityGroupIds: infra.securityGroupIds,
        });
      }
    }(this, 'App1PipelineStackStage'));
  }
}
