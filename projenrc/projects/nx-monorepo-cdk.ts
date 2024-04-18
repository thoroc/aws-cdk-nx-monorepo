import { awscdk } from "projen";
import { NxMonorepoProject } from "../nx-monorepo-project";
import { ProjectJestConfigTs } from "../components/project-jest-config";
import { TypescriptConfigExtends } from "projen/lib/javascript";
import { TsConfigApp, TsConfigSpec } from "../components/tsconfig";

export interface StackOptions {
  awsAccount: string;
  awsRegion: string;
}

export interface NxMonorepoAwsCdkChildProjectOptions
  extends awscdk.AwsCdkTypeScriptAppOptions {
  parent: NxMonorepoProject;
  cdkPath: string;
  sampleCode?: boolean;
  stackNames?: string[];
  stackOptions: StackOptions;
}

export class NxMonorepoAwsCdkChildProject extends awscdk.AwsCdkTypeScriptApp {
  public displayName: string;
  cdkPath: string;
  sampleCode: boolean;
  stackNames: string[];
  awsRegion: string;
  awsAccount: string;

  constructor(props: NxMonorepoAwsCdkChildProjectOptions) {
    super({
      ...props,
      name: `${props.parent.nameSpace}/${props.name}`,
      outdir: `./packages/${props.name}`,
      cdkVersion: props.cdkVersion,
      defaultReleaseBranch: props.parent.defaultReleaseBranch,
      sampleCode: false,
      licensed: false,
      eslint: false,
      requireApproval: awscdk.ApprovalLevel.NEVER,
      // appEntrypoint: `./${props.cdkPath}/bin/main.ts`,
      watchIncludes: [`${props.cdkPath}/**/*.ts`],
      jest: false,
      tsconfig: {
        extends: TypescriptConfigExtends.fromPaths([
          "../../tsconfig.base.json",
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
    this.cdkPath = props.cdkPath;
    this.sampleCode = props.sampleCode ?? true;
    this.stackNames = props.stackNames ?? ["Sample A", "Sample B"];
    this.awsAccount = props.stackOptions.awsAccount;
    this.awsRegion = props.stackOptions.awsRegion;
    (this.parent as NxMonorepoProject)?.childProjects.push(this);
  }

  preSynthesize(): void {
    new ProjectJestConfigTs(this);

    const tsConfig = this.tryFindObjectFile("tsconfig.json");
    tsConfig?.addOverride("file", []);
    tsConfig?.addOverride("include", []);
    tsConfig?.addOverride("references", [
      {
        path: "./tsconfig.app.json",
      },
      {
        path: "./tsconfig.spec.json",
      },
    ]);
    tsConfig?.addDeletionOverride("compilerOptions");
    tsConfig?.addOverride("compilerOptions", {
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
    tsConfig?.addOverride("exclude", undefined);

    // new tsConfig(this);
    new TsConfigApp(this);
    new TsConfigSpec(this);
  }
}
