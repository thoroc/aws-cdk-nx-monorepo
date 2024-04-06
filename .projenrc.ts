import { javascript, typescript, awscdk } from 'projen';
import { PnpmWorkspace } from './projenrc/pnpm';
import { VscodeSettings } from './projenrc/vscode';

const defaultReleaseBranch = 'main';
const cdkVersion = '2.61.1';
const nodeVersion = '18.16.0';
const pnpmVersion = '8.6.0';
const appName = 'aws-cdk-monorepo';

// Defines the root project that will contain other subprojects packages
const root = new typescript.TypeScriptProject({
  name: `@${appName}/root`,
  defaultReleaseBranch,
  packageManager: javascript.NodePackageManager.PNPM,
  projenCommand: 'pnpm dlx projen',
  minNodeVersion: nodeVersion,
  projenrcTs: true,
  sampleCode: false,
  licensed: false,

  // Jest and eslint are disabled at the root as they will be
  // configured by each subproject. Using a single jest/eslint
  // config at the root is out of scope for this walkthrough
  eslint: false,
  jest: false,

  // Disable default github actions workflows generated
  // by projen as we will generate our own later (that uses nx)
  depsUpgradeOptions: { workflow: false },
  buildWorkflow: false,
  release: false,
});

// Defines the subproject for shared lib
new typescript.TypeScriptProject({
  parent: root,
  name: `@${appName}/shared-lib`,
  outdir: './packages/shared-lib',
  defaultReleaseBranch,
  sampleCode: false,
  licensed: false,

  // Use same settings from root project
  packageManager: root.package.packageManager,
  projenCommand: root.projenCommand,
  minNodeVersion: root.minNodeVersion,
});

// Defines the subproject for 'service-a'
new awscdk.AwsCdkTypeScriptApp({
  parent: root,
  name: `@${appName}/service-a`,
  deps: [`@${appName}/shared-lib@workspace:*`],
  outdir: './packages/service-a',
  cdkVersion,
  defaultReleaseBranch,
  sampleCode: false,
  licensed: false,
  requireApproval: awscdk.ApprovalLevel.NEVER,

  // Use same settings from root project
  packageManager: root.package.packageManager,
  projenCommand: root.projenCommand,
  minNodeVersion: root.minNodeVersion,
});

// Defines the subproject for 'service-b'
new awscdk.AwsCdkTypeScriptApp({
  parent: root,
  name: `@${appName}/service-b`,
  deps: [`@${appName}/shared-lib@workspace:*`],
  outdir: './packages/service-b',
  cdkVersion,
  defaultReleaseBranch,
  sampleCode: false,
  licensed: false,
  requireApproval: awscdk.ApprovalLevel.NEVER,

  // Use same settings from root project
  packageManager: root.package.packageManager,
  projenCommand: root.projenCommand,
  minNodeVersion: root.minNodeVersion,
});

root.package.addField('packageManager', `pnpm@${pnpmVersion}`);
root.npmrc.addConfig('auto-install-peers', 'true');

new PnpmWorkspace(root);
new VscodeSettings(root);

root.synth(); // Synthesize all projects
