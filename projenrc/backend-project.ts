import { awscdk } from 'projen';
import { NxMonorepoProject } from './nx-monorepo-project';

interface BackendTsProjectOptions extends awscdk.AwsCdkTypeScriptAppOptions {
  parent: NxMonorepoProject;
  cdkPath: string;
}

export class BackendTsProject extends awscdk.AwsCdkTypeScriptApp {
  constructor(props: BackendTsProjectOptions) {
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
  }
}
