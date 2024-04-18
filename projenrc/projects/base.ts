import {
  TypeScriptAppProject,
  TypeScriptProjectOptions,
} from "projen/lib/typescript";
import { NxMonorepoProject } from "../nx-monorepo-project";
import { TypescriptConfigExtends } from "projen/lib/javascript";
import { ProjectJestConfigTs } from "../components/project-jest-config";

interface NxMonorepoTsChildProjectOptions extends TypeScriptProjectOptions {
  parent: NxMonorepoProject;
}

export class NxMonorepoTsChildProject extends TypeScriptAppProject {
  public displayName: string;

  constructor(props: NxMonorepoTsChildProjectOptions) {
    super({
      ...props,
      name: `${props.parent.nameSpace}/${props.name}`,
      outdir: `./packages/${props.name}`,
      defaultReleaseBranch: props.parent.defaultReleaseBranch,
      sampleCode: false,
      licensed: false,
      eslint: false,
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
    });

    this.displayName = props.name;
    (this.parent as NxMonorepoProject)?.childProjects.push(this);
  }

  preSynthesize(): void {
    new ProjectJestConfigTs(this);
  }
}
