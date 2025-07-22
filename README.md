# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

# Setup

1. aws cliをインストールし、 `aws configure` を実行しクレデンシャルを設定します
2. nvmをインストールします `brew install nvm`
3. node.js で 20　を使います `nvm use 20`
4. cdkをインストールします `cdk i -g cdk`
5. 鬱陶しいのでどうでもいい注意書きを抑止 `cdk acknowledge 34892`

# Boostrap

`cdk bootstrap`

# Compute Stack(s) with cdk

* `npm run build`   コンパイル
* `npx cdk deploy {StackName}` AWSアカウント／リージョンへスタックのデプロイ
* `npx cdk diff {StackName}`    
* `npx cdk synth {StackName}`   合成されたCloudFormationテンプレートを作成する

* ex: `cdk deploy CognitoCdkSampleStack` CognitoCdkSampleStackというスタックをAWSアカウントにデプロイする
