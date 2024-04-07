import { typescript } from "projen";
import { Nx } from "./nx";
import { VscodeSettings } from "./vscode";
import { PnpmWorkspace } from "./pnpm";
import { EslintFlatConfig } from "./eslint-config";
import { NxMonorepoChildProject } from "../child/nx-monorepo-child-project";

interface NxMonorepoProjectOptions extends typescript.TypeScriptProjectOptions {
  pnpmVersion: string;
  cdkVersion: string;
  nodeVersion: string;
}

export class NxMonorepoProject extends typescript.TypeScriptProject {
  public nameSpace: string;
  public pnpmVersion: string;
  public cdkVersion: string;
  public defaultReleaseBranch: string;
  public childProjects: NxMonorepoChildProject[] = [];

  constructor(props: NxMonorepoProjectOptions) {
    super({
      name: props.name,
      defaultReleaseBranch: props.defaultReleaseBranch,
      packageManager: props.packageManager,
      projenCommand: "pnpm dlx projen",
      minNodeVersion: props.nodeVersion,
      projenrcTs: true,
      sampleCode: false,
      licensed: false,

      // Jest and eslint are disabled at the root as they will be
      // configured by each subproject. Using a single jest/eslint
      // config at the root is out of scope for this walkthrough
      eslint: false,
      jest: false,
      prettier: true,

      // Disable default github actions workflows generated
      // by projen as we will generate our own later (that uses nx)
      depsUpgradeOptions: { workflow: false },
      buildWorkflow: false,
      release: false,

      devDeps: ["@nx/node", "@nx/js", "@nx/workspace", "nx"],

      disableTsconfig: true,
      tsconfigDevFile: "tsconfig.base.json",
      tsconfigDev: {
        compilerOptions: {
          rootDir: ".",
          baseUrl: ".",
          paths: {
            "@aws-cdk-nx-monorepo/shared-lib/*": [
              "./packages/shared-lib/src/*",
            ],
          },
        },
        exclude: ["packages/**/jest.config.ts"],
      },
      // Add the shared-lib path to the root tsconfig paths
      // tsconfig: {
      //   compilerOptions: {
      //     paths: {
      //       '@aws-cdk-nx-monorepo/shared-lib/*': [
      //         './packages/shared-lib/src/*',
      //       ],
      //     },
      //   },
      // },
    });

    const { name, defaultReleaseBranch, cdkVersion, pnpmVersion } = props;

    this.nameSpace = `@${name}`;
    this.defaultReleaseBranch = defaultReleaseBranch;
    this.cdkVersion = cdkVersion;
    this.pnpmVersion = pnpmVersion;
    this.childProjects = [];
  }

  preSynthesize(): void {
    this.package.addField("packageManager", `pnpm@${this.pnpmVersion}`);
    this.npmrc.addConfig("auto-install-peers", "true");

    new PnpmWorkspace(this);
    new VscodeSettings(this);
    new Nx(this);
    new EslintFlatConfig(this);
  }
}
