import {CognitoCdkSampleStackProps} from "../../lib/cognito-cdk-sample-stack";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as cdk from "aws-cdk-lib";

const PREFIX = "cognito-sample";

export const sampleConfig: CognitoCdkSampleStackProps = {
    env: {
        account: "<YOUR SERVICE ACCOUNT ID>",
        region: "ap-northeast-1",
    },
    userpool: {
        userPoolName: 'SampleUserPool',
        // サインインの設定
        signInAliases: {
            email: true,
            username: true,
        },
        // セルフサインアップの設定
        selfSignUpEnabled: true,
        // ユーザー検証の設定
        userVerification: {
            emailSubject: 'アカウント認証のお知らせ',
            emailBody: '認証コード: {####}',
            emailStyle: cognito.VerificationEmailStyle.CODE,
        },
        // パスワードポリシー
        passwordPolicy: {
            minLength: 8,
            requireLowercase: true,
            requireUppercase: true,
            requireDigits: true,
            requireSymbols: true,
        },
        // アカウント回復の設定
        accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
        // 標準属性
        standardAttributes: {
            email: {
                required: true,
                mutable: true,
            },
            givenName: {
                required: false,
                mutable: true,
            },
            familyName: {
                required: false,
                mutable: true,
            },
        },
        // カスタム属性
        customAttributes: {
            'department': new cognito.StringAttribute({
                minLen: 1,
                maxLen: 50,
                mutable: true,
            }),
        },
        // MFA設定
        mfa: cognito.Mfa.OPTIONAL,
        mfaSecondFactor: {
            sms: true,
            otp: true,
        },
        // デバイストラッキング
        deviceTracking: {
            challengeRequiredOnNewDevice: true,
            deviceOnlyRememberedOnUserPrompt: false,
        },
        // Lambda トリガー（オプション）
        // lambdaTriggers: {
        //   preSignUp: preSignUpLambda,
        //   postConfirmation: postConfirmationLambda,
        // },
        // 削除保護
        removalPolicy: cdk.RemovalPolicy.RETAIN,
    }

}
