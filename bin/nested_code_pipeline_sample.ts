#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { RootCodePipelineStack } from '../lib/nested_code_pipeline_sample-stack';

const app = new cdk.App();
new RootCodePipelineStack(app, 'RootCodePipelineStack', {
  connectionArn: app.node.tryGetContext("ConnectionArn") as string,
});