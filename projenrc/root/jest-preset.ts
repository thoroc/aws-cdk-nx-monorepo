import { Component, SourceCode } from 'projen';
import { NxMonorepoProject } from './nx-monorepo-project';

export class JestPresetJs extends Component {
  constructor(rootProject: NxMonorepoProject) {
    super(rootProject);

    new SourceCode(rootProject, 'jest.preset.js', { readonly: true }).line(
      `const nxPreset = require('@nx/jest/preset').default;

module.exports = { ...nxPreset };`
    );
  }
}
