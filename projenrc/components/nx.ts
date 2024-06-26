import { Component, JsonFile, typescript } from "projen";
import { MonorepoJestConfigTs } from "./nx-monorepo-jest-config";
import { NxMonorepoProject } from "../nx-monorepo-project";

// Custom projen component that configures nx.

export class Nx extends Component {
  constructor(rootProject: typescript.TypeScriptProject) {
    super(rootProject);

    // Add nx library dependencies
    rootProject.addDevDeps("nx", "@nrwl/devkit", "@nrwl/workspace");

    // Add nx.json file
    new JsonFile(rootProject, "nx.json", {
      obj: {
        extends: "nx/presets/npm.json",
        tasksRunnerOptions: {
          default: {
            runner: "@nx/workspace/tasks-runners/default",
            options: {
              // By default nx uses a local cache to prevent re-running targets

              // that have not had their inputs changed (eg. no changes to source files).
              // The following specifies what targets are cacheable.
              cacheableOperations: ["build"],
            },
          },
        },

        $schema: "./node_modules/nx/schemas/nx-schema.json",
        namedInputs: {
          default: ["{projectRoot}/**/*", "sharedGlobals"],
          production: [
            "default",
            "!{projectRoot}/.eslintrc.json",
            "!{projectRoot}/eslint.config.js",
            "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
            "!{projectRoot}/jest.config.[jt]s",
            "!{projectRoot}/src/test-setup.[jt]s",
            "!{projectRoot}/test-setup.[jt]s",
          ],
          sharedGlobals: [],
        },

        targetDefaults: {
          build: {
            // Specifies the build target of a project is dependent on the
            // build target of dependant projects (via the caret)
            dependsOn: ["^build"],

            // Inputs tell nx which files can invalidate the cache should they updated.
            // We only want the build target cache to be invalidated if there
            // are changes to source files so the config below ignores output files.
            inputs: [
              "!{projectRoot}/test-reports/**/*",
              "!{projectRoot}/coverage/**/*",
              "!{projectRoot}/build/**/*",
              "!{projectRoot}/dist/**/*",
              "!{projectRoot}/lib/**/*",
              "!{projectRoot}/cdk.out/**/*",
            ],

            // Outputs tell nx where artifacts can be found for caching purposes.
            // The need for this will become more obvious when we configure

            // github action workflows and need to restore the nx cache for

            // subsequent job to fetch artifacts
            outputs: [
              "{projectRoot}/dist",
              "{projectRoot}/lib",
              "{projectRoot}/cdk.out",
            ],
          },
          deploy: { dependsOn: ["build"] },
        },

        plugins: [
          {
            plugin: "@nx/eslint/plugin",
            options: {
              targetName: "lint",
            },
          },
          {
            plugin: "@nx/jest/plugin",
            options: {
              targetName: "test",
            },
          },
        ],

        // This is used when running 'nx affected ….' command to selectively
        // run targets against only those packages that have changed since
        // lastest commit on origin/main
        // affected: { defaultBase: 'origin/main' },
      },
    });

    this.project.addTask("nx:build-all", {
      description: "Build all projects",
      exec: "pnpm nx run-many --target build",
    });

    this.project.gitignore.exclude(".nx");
  }

  preSynthesize(): void {
    new MonorepoJestConfigTs(this.project as NxMonorepoProject);
  }
}
