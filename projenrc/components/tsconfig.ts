import { Component, JsonFile } from "projen";
import { NxMonorepoAwsCdkChildProject } from "../projects/nx-monorepo-cdk";

export class TsConfig extends Component {
  constructor(project: NxMonorepoAwsCdkChildProject) {
    super(project);

    new JsonFile(project, "tsconfig.spec.json", {
      obj: {
        extends: "../../tsconfig.base.json",
        files: [],
        include: [],
        references: [
          {
            path: "./tsconfig.app.json",
          },
          {
            path: "./tsconfig.spec.json",
          },
        ],
        compilerOptions: {
          esModuleInterop: true,
        },
      },
    });
  }
}

export class TsConfigSpec extends Component {
  constructor(project: NxMonorepoAwsCdkChildProject) {
    super(project);

    new JsonFile(project, "tsconfig.spec.json", {
      obj: {
        extends: "./tsconfig.json",
        compilerOptions: {
          outDir: "../../dist/out-tsc",
          module: "commonjs",
          types: ["jest", "node"],
        },
        include: [
          "jest.config.ts",
          "src/**/*.test.ts",
          "src/**/*.spec.ts",
          "src/**/*.d.ts",
        ],
      },
    });
  }
}

export class TsConfigApp extends Component {
  constructor(project: NxMonorepoAwsCdkChildProject) {
    super(project);

    new JsonFile(project, "tsconfig.app.json", {
      obj: {
        extends: "./tsconfig.json",
        compilerOptions: {
          outDir: "../../dist/out-tsc",
          module: "commonjs",
          types: ["node"],
        },
        exclude: ["jest.config.ts", "src/**/*.spec.ts", "src/**/*.test.ts"],
        include: ["src/**/*.ts"],
      },
    });
  }
}
