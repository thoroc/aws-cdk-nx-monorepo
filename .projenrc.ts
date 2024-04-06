import { javascript, typescript, awscdk } from 'projen';
import { PnpmWorkspace } from './projenrc/pnpm';
import { VscodeSettings } from './projenrc/vscode';
import { Nx } from './projenrc/nx';

const defaultReleaseBranch = 'main';
const cdkVersion = '2.61.1';
const nodeVersion = '18.16.0';
const pnpmVersion = '8.6.0';
const appNameSpace = '@aws-cdk-monorepo';
const cdkPath = 'cdk';

// Defines the root project that will contain other subprojects packages
const root = new typescript.TypeScriptProject({
  name: `${appNameSpace}/root`,
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

  // Add the shared-lib path to the root tsconfig paths
  tsconfig: {
    compilerOptions: {
      paths: {
        '@aws-cdk-monorepo/shared-lib/*': ['./packages/shared-lib/src/*'],
      },
    },
  },
});

// Defines the subproject for shared lib
new typescript.TypeScriptProject({
  parent: root,
  name: `${appNameSpace}/shared-lib`,
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
  name: `${appNameSpace}/service-a`,
  deps: [`${appNameSpace}/shared-lib@workspace:*`],
  outdir: './packages/service-a',
  cdkVersion,
  defaultReleaseBranch,
  sampleCode: false,
  licensed: false,
  requireApproval: awscdk.ApprovalLevel.NEVER,
  appEntrypoint: `${cdkPath}/bin/main.ts`,
  watchIncludes: [`${cdkPath}/**/*.ts`],

  // Use same settings from root project
  packageManager: root.package.packageManager,
  projenCommand: root.projenCommand,
  minNodeVersion: root.minNodeVersion,
  tsconfig: {
    compilerOptions: {
      rootDir: '.',
      paths: {
        '@aws-cdk-monorepo/shared-lib/*': ['../shared-lib/src/*'],
      },
    },
    include: [`${cdkPath}/**/*.ts`],
  },
});

// Defines the subproject for 'service-b'
new awscdk.AwsCdkTypeScriptApp({
  parent: root,
  name: `${appNameSpace}/service-b`,
  deps: [`${appNameSpace}/shared-lib@workspace:*`],
  outdir: './packages/service-b',
  cdkVersion,
  defaultReleaseBranch,
  sampleCode: false,
  licensed: false,
  requireApproval: awscdk.ApprovalLevel.NEVER,
  appEntrypoint: `${cdkPath}/bin/main.ts`,
  watchIncludes: [`${cdkPath}/**/*.ts`],

  // Use same settings from root project
  packageManager: root.package.packageManager,
  projenCommand: root.projenCommand,
  minNodeVersion: root.minNodeVersion,
  tsconfig: {
    compilerOptions: {
      rootDir: '.',
      paths: {
        '@aws-cdk-monorepo/shared-lib/*': ['../shared-lib/src/*'],
      },
    },
    include: [`${cdkPath}/**/*.ts`],
  },
});

root.package.addField('packageManager', `pnpm@${pnpmVersion}`);
root.npmrc.addConfig('auto-install-peers', 'true');

new PnpmWorkspace(root);
new VscodeSettings(root);
new Nx(root);

root.synth(); // Synthesize all projects
