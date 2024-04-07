import { awscdk } from 'projen';
import { NxMonorepoProject } from '../root/nx-monorepo-project';
import { JestConfigTs } from './jest-config';
import { tsConfigApp } from './tsconfig-app';
import { tsConfigSpec } from './tsconfig-spec';
import { TypescriptConfigExtends } from 'projen/lib/javascript';

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
      // disableTsconfig: true,
      tsconfig: {
        extends: TypescriptConfigExtends.fromPaths([
          '../../tsconfig.base.json',
        ]),
      },
      disableTsconfigDev: true,
      packageManager: props.parent.package.packageManager,
      projenCommand: props.parent.projenCommand,
      minNodeVersion: props.parent.minNodeVersion,
      // tsconfig: {
      //   compilerOptions: {
      //     rootDir: '.',
      //     ...props.tsconfig?.compilerOptions,
      //   },
      //   include: [`${props.cdkPath}/**/*.ts`],
      // },
    });

    this.displayName = props.name;
  }

  preSynthesize(): void {
    new JestConfigTs(this);

    const tsConfig = this.tryFindObjectFile('tsconfig.json');
    tsConfig?.addOverride('file', []);
    tsConfig?.addOverride('include', []);
    tsConfig?.addOverride('references', [
      {
        path: './tsconfig.app.json',
      },
      {
        path: './tsconfig.spec.json',
      },
    ]);
    tsConfig?.addDeletionOverride('compilerOptions');
    tsConfig?.addOverride('compilerOptions', {
      rootDir: undefined,
      outDir: undefined,
      alwaysStrict: undefined,
      declaration: undefined,
      esModuleInterop: true,
      experimentalDecorators: undefined,
      inlineSourceMap: undefined,
      inlineSources: undefined,
      lib: undefined,
      module: undefined,
      noEmitOnError: undefined,
      noFallthroughCasesInSwitch: undefined,
      noImplicitAny: undefined,
      noImplicitReturns: undefined,
      noImplicitThis: undefined,
      noUnusedLocals: undefined,
      noUnusedParameters: undefined,
      resolveJsonModule: undefined,
      strict: undefined,
      strictNullChecks: undefined,
      strictPropertyInitialization: undefined,
      stripInternal: undefined,
      target: undefined,
    });
    tsConfig?.addOverride('exclude', undefined);

    // new tsConfig(this);
    new tsConfigApp(this);
    new tsConfigSpec(this);
  }
}
