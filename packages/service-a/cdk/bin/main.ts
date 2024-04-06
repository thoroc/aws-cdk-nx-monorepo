import { App } from 'aws-cdk-lib';
import { ServiceAStack } from '../lib/stack';

const app = new App();

new ServiceAStack(app, 'service-a', {
  env: {
    account: 'YOUR_AWS_ACCOUNT',
    region: 'YOUR_AWS_REGION',
  },
});

app.synth();
