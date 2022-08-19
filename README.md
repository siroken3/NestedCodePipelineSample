# Nested CodePipeline Sample

> **Waning**
> This repository is under constraction!

This is a sample repository for Nexted Codepipeline. As a sample, building both application's and its Infrastracture's codepipeline.
Every update to the main branch of this repository triggers to start the entire pipeline.
The application's pipeline will be started when there is a change in the image of the ECR repository named `myrepo`.

## Prerequirement

* An AWS account
* AWS CLI v2
* CDK 2

## Setup

### Create CodeStar Connections to GitHub

Please see: [Official Document: Developer Tools console](https://docs.aws.amazon.com/dtconsole/latest/userguide/connections-create-github.html)

### bootstrap CDK

You need to setup CDK project to target AWS account. 

```console
$ export AWS_PROFILE=<AWS_PROFILE | default>
$ export AWS_ACCOUNT_ID=<AWS_ACCOUNT_ID>
$ export AWS_REGION=<AWS_REGION>
```

And, set the ARN of the CodeStar Connection that will be displayed as a result of the creation in the previous section.

```
$ export CONNECTION_ARN=<CodeStarConnection>
```

Then, do the following.

```console
cdk bootstrap -c ConnectionArn=$CONNECTION_ARN aws://$AWS_ACCOUNT_ID/$AWS_REGION
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

## Pipeline work



## Customize

You can change this repository by Forking it and passing it to the context `GitHubRepo`. Or you can change it permanently by changing the parameter `GitHubRepo` value in cdk.json.

cdk bootstrap -c GitHubRepo=$YOUR_REPOSITOTY -c ConnectionArn=$CONNECTION_ARN aws://$AWS_ACCOUNT_ID/$AWS_REGION