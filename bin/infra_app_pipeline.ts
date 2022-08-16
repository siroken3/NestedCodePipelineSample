#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfraPipelineStack } from '../lib/infra_pipeline-stack';

const app = new cdk.App();
new InfraPipelineStack(app, 'RootCodePipelineStack', {
  connectionArn: app.node.tryGetContext("ConnectionArn") as string,
});