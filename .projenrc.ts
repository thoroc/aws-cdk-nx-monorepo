import { javascript, typescript } from "projen";
import { NxMonorepoProject, BackendTsProject } from "./projenrc";

const defaultReleaseBranch = "main";
const cdkVersion = "2.61.1";
const nodeVersion = "18.16.0";
const pnpmVersion = "8.6.0";
const appNameSpace = "@aws-cdk-nx-monorepo";
const cdkPath = "cdk";

// Defines the root of the monorepo that will contain other subprojects packages
const monorepo = new NxMonorepoProject({
  name: "aws-cdk-nx-monorepo",
  defaultReleaseBranch,
  packageManager: javascript.NodePackageManager.PNPM,
  cdkVersion,
  nodeVersion,
  pnpmVersion,
});

// monorepo
//   .tryFindObjectFile('tsconfig.json')
//   ?.addOverride('include', ['packages/**/*']);

// Defines the subproject for shared lib
new typescript.TypeScriptProject({
  parent: monorepo,
  name: `${appNameSpace}/shared-lib`,
  outdir: "./packages/shared-lib",
  defaultReleaseBranch,
  sampleCode: false,
  licensed: false,

  // Use same settings from monorepo project
  packageManager: monorepo.package.packageManager,
  projenCommand: monorepo.projenCommand,
  minNodeVersion: monorepo.minNodeVersion,
});

// Defines the subproject for 'service-a'
new BackendTsProject({
  parent: monorepo,
  name: "service-a",
  deps: [`${appNameSpace}/shared-lib@workspace:*`],
  cdkPath,
  cdkVersion,
  defaultReleaseBranch,
  tsconfig: {
    compilerOptions: {
      rootDir: ".",
      paths: {
        "@aws-cdk-nx-monorepo/shared-lib/*": ["../shared-lib/src/*"],
      },
    },
    include: [`${cdkPath}/**/*.ts`],
  },
});

// Defines the subproject for 'service-b'
new BackendTsProject({
  parent: monorepo,
  name: "service-b",
  deps: [`${appNameSpace}/shared-lib@workspace:*`],
  cdkPath,
  cdkVersion,
  defaultReleaseBranch,
  tsconfig: {
    compilerOptions: {
      paths: {
        "@aws-cdk-nx-monorepo/shared-lib/*": ["../shared-lib/src/*"],
      },
    },
  },
});

new BackendTsProject({
  parent: monorepo,
  name: "backend",
  deps: [`${appNameSpace}/shared-lib@workspace:*`],
  cdkPath,
  cdkVersion,
  defaultReleaseBranch,
  tsconfig: {
    compilerOptions: {
      paths: {
        "@aws-cdk-nx-monorepo/shared-lib/*": ["../shared-lib/src/*"],
      },
    },
  },
});

monorepo.synth(); // Synthesize all projects
