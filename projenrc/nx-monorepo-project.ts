import { typescript } from 'projen';
// import { NodePackageManager } from 'projen/lib/javascript';
import { Nx } from './nx';
import { VscodeSettings } from './vscode';
import { PnpmWorkspace } from './pnpm';

interface NxMonorepoProjectOptions extends typescript.TypeScriptProjectOptions {
  // defaultReleaseBranch: string;
  // packageManager: NodePackageManager;
  cdkVersion: string;
  nodeVersion: string;
}

export class NxMonorepoProject extends typescript.TypeScriptProject {
  public nameSpace: string;
  public cdkVersion: string;
  public defaultReleaseBranch: string;

  constructor(props: NxMonorepoProjectOptions) {
    super({
      name: props.name,
      defaultReleaseBranch: props.defaultReleaseBranch,
      packageManager: props.packageManager,
      projenCommand: 'pnpm dlx projen',
      minNodeVersion: props.nodeVersion,
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
            '@aws-cdk-nx-monorepo/shared-lib/*': [
              './packages/shared-lib/src/*',
            ],
          },
        },
      },
    });

    this.nameSpace = `@${props.name}`;
    this.defaultReleaseBranch = props.defaultReleaseBranch;
    this.cdkVersion = props.cdkVersion;
  }

  preSynthesize(): void {
    new PnpmWorkspace(this);
    new VscodeSettings(this);
    new Nx(this);
  }
}
