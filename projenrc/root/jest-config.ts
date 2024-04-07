import { Component, SourceCode } from "projen";
import { NxMonorepoProject } from "./nx-monorepo-project";

export class JestConfigTs extends Component {
  constructor(rootProject: NxMonorepoProject) {
    super(rootProject);

    rootProject.addDevDeps(
      "@nx/jest",
      "@types/jest",
      "eslint-plugin-jest",
      "jest",
      "jest-environment-node",
      "ts-jest",
    );

    new SourceCode(rootProject, "jest.config.ts", { readonly: true }).line(
      `import { getJestProjectsAsync } from '@nx/jest';

export default async () => ({
  projects: await getJestProjectsAsync(),
});`,
    );

    new SourceCode(rootProject, "jest.preset.js", { readonly: true }).line(
      `const nxPreset = require('@nx/jest/preset').default;

module.exports = { ...nxPreset };`,
    );
  }
}
