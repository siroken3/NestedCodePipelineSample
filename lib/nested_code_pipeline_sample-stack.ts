import * as cdk from 'aws-cdk-lib';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';

type RootCodePipelineStackProps = cdk.StackProps & {
  connectionArn: string,
}


export class RootCodePipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: RootCodePipelineStackProps) {
    super(scope, id, props);

    const rootPipelineName = 'rootPipeline'
    const rootPipelineSynth = new pipelines.ShellStep('RootPipelineSynth', {
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
    });

    const rootPipeline = new pipelines.CodePipeline(this, rootPipelineName, {
      pipelineName: rootPipelineName,
      selfMutation: true,
      synth: rootPipelineSynth,
    });

    rootPipeline.addStage(new NestedCodePipelineStackStage(this, 'NestedCodePipelineStackStage', {

    });
  }
}
