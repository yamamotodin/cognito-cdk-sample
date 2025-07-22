import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface CognitoCdkSampleStackProps extends cdk.StackProps {
    userpool: cognito.UserPoolProps;
}

export class CognitoCdkSampleStack extends cdk.Stack {
    public readonly userPool: cognito.UserPool;
    public readonly userPoolClient: cognito.UserPoolClient;
    public readonly identityPool: cognito.CfnIdentityPool;

    constructor(scope: Construct, id: string, props: CognitoCdkSampleStackProps) {
        super(scope, id, props);

        // User Pool の作成
        this.userPool = new cognito.UserPool(this, 'UserPool', props.userpool);

        // User Pool Client の作成
        this.userPoolClient = this.userPool.addClient('UserPoolClient', {
            userPoolClientName: 'MyAppClient',
            // 認証フロー
            authFlows: {
                userPassword: true,
                userSrp: true,
                custom: true,
                adminUserPassword: true,
            },
            // OAuth設定
            oAuth: {
                flows: {
                    authorizationCodeGrant: true,
                    implicitCodeGrant: true,
                },
                scopes: [
                    cognito.OAuthScope.EMAIL,
                    cognito.OAuthScope.OPENID,
                    cognito.OAuthScope.PROFILE,
                ],
                callbackUrls: [
                    'http://localhost:3000/callback',
                    'https://yourapp.example.com/callback',
                ],
                logoutUrls: [
                    'http://localhost:3000/signout',
                    'https://yourapp.example.com/signout',
                ],
            },
            // トークンの有効期限
            accessTokenValidity: cdk.Duration.hours(1),
            idTokenValidity: cdk.Duration.hours(1),
            refreshTokenValidity: cdk.Duration.days(30),
            // セキュリティ設定
            preventUserExistenceErrors: true,
            // 読み書き属性
            readAttributes: new cognito.ClientAttributes()
                .withStandardAttributes({
                    email: true,
                    givenName: true,
                    familyName: true,
                })
                .withCustomAttributes('department'),
            writeAttributes: new cognito.ClientAttributes()
                .withStandardAttributes({
                    email: true,
                    givenName: true,
                    familyName: true,
                })
                .withCustomAttributes('department'),
        });

        // User Pool Domain の作成（Hosted UI用）
        const userPoolDomain = this.userPool.addDomain('UserPoolDomain', {
            cognitoDomain: {
                domainPrefix: 'myapp-auth-domain', // 一意である必要があります
            },
        });

        // Identity Pool の作成
        this.identityPool = new cognito.CfnIdentityPool(this, 'IdentityPool', {
            identityPoolName: 'MyAppIdentityPool',
            allowUnauthenticatedIdentities: false,
            cognitoIdentityProviders: [{
                clientId: this.userPoolClient.userPoolClientId,
                providerName: this.userPool.userPoolProviderName,
                serverSideTokenCheck: true,
            }],
        });

        // 認証済みユーザー用のロール
        const authenticatedRole = new iam.Role(this, 'AuthenticatedRole', {
            assumedBy: new iam.FederatedPrincipal(
                'cognito-identity.amazonaws.com',
                {
                    StringEquals: {
                        'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
                    },
                    'ForAnyValue:StringLike': {
                        'cognito-identity.amazonaws.com:amr': 'authenticated',
                    },
                },
                'sts:AssumeRoleWithWebIdentity'
            ),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'),
                // 必要に応じて他のポリシーを追加
            ],
        });

        // 未認証ユーザー用のロール（必要に応じて）
        const unauthenticatedRole = new iam.Role(this, 'UnauthenticatedRole', {
            assumedBy: new iam.FederatedPrincipal(
                'cognito-identity.amazonaws.com',
                {
                    StringEquals: {
                        'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
                    },
                    'ForAnyValue:StringLike': {
                        'cognito-identity.amazonaws.com:amr': 'unauthenticated',
                    },
                },
                'sts:AssumeRoleWithWebIdentity'
            ),
        });

        // Identity Pool とロールの関連付け
        new cognito.CfnIdentityPoolRoleAttachment(this, 'IdentityPoolRoleAttachment', {
            identityPoolId: this.identityPool.ref,
            roles: {
                authenticated: authenticatedRole.roleArn,
                unauthenticated: unauthenticatedRole.roleArn,
            },
        });

        // 出力
        new cdk.CfnOutput(this, 'UserPoolId', {
            value: this.userPool.userPoolId,
            description: 'User Pool ID',
        });

        new cdk.CfnOutput(this, 'UserPoolClientId', {
            value: this.userPoolClient.userPoolClientId,
            description: 'User Pool Client ID',
        });

        new cdk.CfnOutput(this, 'IdentityPoolId', {
            value: this.identityPool.ref,
            description: 'Identity Pool ID',
        });

        new cdk.CfnOutput(this, 'UserPoolDomain', {
            value: `https://${userPoolDomain.domainName}.auth.${this.region}.amazoncognito.com`,
            description: 'User Pool Domain URL',
        });
    }
}
