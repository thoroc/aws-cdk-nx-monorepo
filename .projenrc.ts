import { javascript, typescript, awscdk } from 'projen';
import { BackendTsProject } from './projenrc/backend-project';
import { NxMonorepoProject } from './projenrc/nx-monorepo-project';

const defaultReleaseBranch = 'main';
const cdkVersion = '2.61.1';
const nodeVersion = '18.16.0';
const pnpmVersion = '8.6.0';
const appNameSpace = '@aws-cdk-nx-monorepo';
const cdkPath = 'cdk';

// Defines the root project that will contain other subprojects packages
const root = new NxMonorepoProject({
  name: 'aws-cdk-nx-monorepo',
  defaultReleaseBranch,
  packageManager: javascript.NodePackageManager.PNPM,
  cdkVersion,
  nodeVersion,
});

// root
//   .tryFindObjectFile('tsconfig.json')
//   ?.addOverride('include', ['packages/**/*']);

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
        '@aws-cdk-nx-monorepo/shared-lib/*': ['../shared-lib/src/*'],
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
        '@aws-cdk-nx-monorepo/shared-lib/*': ['../shared-lib/src/*'],
      },
    },
    include: [`${cdkPath}/**/*.ts`],
  },
});

new BackendTsProject({
  parent: root,
  name: 'backend',
  deps: [`${appNameSpace}/shared-lib@workspace:*`],
  cdkPath,
  cdkVersion,
  defaultReleaseBranch,
  tsconfig: {
    compilerOptions: {
      paths: {
        '@aws-cdk-nx-monorepo/shared-lib/*': ['../shared-lib/src/*'],
      },
    },
  },
});

root.package.addField('packageManager', `pnpm@${pnpmVersion}`);
root.npmrc.addConfig('auto-install-peers', 'true');

// new PnpmWorkspace(root);
// new VscodeSettings(root);
// new Nx(root);

root.synth(); // Synthesize all projects
