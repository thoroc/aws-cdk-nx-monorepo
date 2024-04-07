import { Component, SourceCode } from 'projen';
import { BackendTsProject } from './backend-project';

export class JestConfigTs extends Component {
  constructor(rootProject: BackendTsProject) {
    super(rootProject);

    new SourceCode(rootProject, 'jest.config.ts', {}).line(
      `/* eslint-disable */
export default {
  displayName: '${rootProject.displayName}',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/${rootProject.displayName}',
};`
    );
  }
}
