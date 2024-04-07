import { Component, JsonFile } from "projen";
import { NxMonorepoChildProject } from "./nx-monorepo-child-project";

export class tsConfig extends Component {
  constructor(project: NxMonorepoChildProject) {
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

export class tsConfigSpec extends Component {
  constructor(project: NxMonorepoChildProject) {
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

export class tsConfigApp extends Component {
  constructor(project: NxMonorepoChildProject) {
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
