import { awscdk } from 'projen';
import { NxMonorepoProject } from '../root/nx-monorepo-project';
import { JestConfigTs } from './jest-config';

export interface NxMonorepoChildProjectOptions
  extends awscdk.AwsCdkTypeScriptAppOptions {
  parent: NxMonorepoProject;
  cdkPath: string;
}

export class NxMonorepoChildProject extends awscdk.AwsCdkTypeScriptApp {
  public displayName: string;

  constructor(props: NxMonorepoChildProjectOptions) {
    super({
      ...props,
      name: `${props.parent.nameSpace}/${props.name}`,
      outdir: `./packages/${props.name}`,
      cdkVersion: props.cdkVersion,
      defaultReleaseBranch: props.parent.defaultReleaseBranch,
      sampleCode: false,
      licensed: false,
      requireApproval: awscdk.ApprovalLevel.NEVER,
      appEntrypoint: `${props.cdkPath}/bin/main.ts`,
      watchIncludes: [`${props.cdkPath}/**/*.ts`],
      jest: false,
      packageManager: props.parent.package.packageManager,
      projenCommand: props.parent.projenCommand,
      minNodeVersion: props.parent.minNodeVersion,
      // disableTsconfig: true,
      tsconfig: {
        compilerOptions: {
          rootDir: '.',
          ...props.tsconfig?.compilerOptions,
        },
        include: [`${props.cdkPath}/**/*.ts`],
      },
    });

    this.displayName = props.name;
  }

  preSynthesize(): void {
    new JestConfigTs(this);
  }
}
