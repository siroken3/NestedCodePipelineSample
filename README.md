# Nested CodePipeline Sample

> **Waning**
> This repository is under constraction!

This is a sample repository for Nexted Codepipeline. This repository contains the following patterns.

* Building both applications and its Infrastracture codepipeline

## Prerequirement

* An AWS account
* AWS CLI v2
* CDK 2

## Setup

### CreateCodeStar Connections to GitHub

Please see: [Official Document: Developer Tools console](https://docs.aws.amazon.com/dtconsole/latest/userguide/connections-create-github.html)

### bootstrap CDK

You need to setup CDK project to target AWS account. 

```console
$ export AWS_PROFILE=<AWS_PROFILE | default>
$ export AWS_ACCOUNT_ID=<AWS_ACCOUNT_ID>
$ export AWS_DEFAULT_REGION=<AWS_REGION>
$ export CONNECTION_ARN=<CodeStarConnection>
```

```console
cdk bootstrap -c ConnectionArn=$CONNECTION_ARN aws://$AWS_ACCOUNT_ID/$AWS_DEFAULT_REGION
```

## Deploy

Before deploy, check the difference.

```console
$ cdk diff -c ConnectionArn=$CONNECTION_ARN
```

Then, deploy as the follows.

```console
$ cdk deploy -c ConnectionArn=$CONNECTION_ARN
```
