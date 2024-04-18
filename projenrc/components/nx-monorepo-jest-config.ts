import { Component, SourceCode } from "projen";
import { NxMonorepoProject } from "../nx-monorepo-project";

export class MonorepoJestConfigTs extends Component {
  constructor(project: NxMonorepoProject) {
    super(project);

    project.addDevDeps(
      "@nx/jest",
      "@types/jest",
      "eslint-plugin-jest",
      "jest",
      "jest-environment-node",
      "ts-jest",
    );

    new SourceCode(project, "jest.config.ts", { readonly: true }).line(
      `import { getJestProjectsAsync } from '@nx/jest';

export default async () => ({
  projects: await getJestProjectsAsync(),
});`,
    );

    new SourceCode(project, "jest.preset.js", { readonly: true }).line(
      `const nxPreset = require('@nx/jest/preset').default;

module.exports = { ...nxPreset };`,
    );
  }
}
