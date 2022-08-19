#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfraPipelineStack } from '../lib/infra_pipeline-stack';

const app = new cdk.App();
new InfraPipelineStack(app, 'RootCodePipelineStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  connectionArn: app.node.tryGetContext("ConnectionArn") as string,
  githubRepo: app.node.tryGetContext("GitHubRepo") as string,
});