import { App } from 'aws-cdk-lib';
import { ServiceBStack } from '../lib/stack';

const app = new App();

new ServiceBStack(app, 'service-a', {
  env: {
    account: 'YOUR_AWS_ACCOUNT',
    region: 'YOUR_AWS_REGION',
  },
});

app.synth();
