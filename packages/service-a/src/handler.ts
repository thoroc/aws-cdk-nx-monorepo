import { sayHello } from '@aws-vebsite/shared-lib';

export const handler = async () => {
  return `${sayHello()} This is service a`;
};
