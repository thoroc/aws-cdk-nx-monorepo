import { sayHello } from '@aws-cdk-nx-monorepo/shared-lib';

export const handler = async () => {
  return `${sayHello()} This is service a`;
};
