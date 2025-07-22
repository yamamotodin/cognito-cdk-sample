#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CognitoCdkSampleStack } from '../lib/cognito-cdk-sample-stack';
import {sampleConfig} from "../config/test";

const app = new cdk.App();
new CognitoCdkSampleStack(app, 'CognitoCdkSampleStack', sampleConfig);
