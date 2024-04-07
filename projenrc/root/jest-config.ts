import { Component, SourceCode } from 'projen';
import { NxMonorepoProject } from './nx-monorepo-project';

export class JestConfigTs extends Component {
  constructor(rootProject: NxMonorepoProject) {
    super(rootProject);

    new SourceCode(rootProject, 'jest.config.ts', { readonly: true }).line(
      `import { getJestProjectsAsync } from '@nx/jest';

export default async () => ({
  projects: await getJestProjectsAsync(),
});`
    );
  }
}
