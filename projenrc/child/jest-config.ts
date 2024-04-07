import { Component, SourceCode } from 'projen';
import { NxMonorepoChildProject } from './nx-monorepo-child-project';

export class JestConfigTs extends Component {
  constructor(project: NxMonorepoChildProject) {
    super(project);

    new SourceCode(project, 'jest.config.ts', {}).line(
      `/* eslint-disable */
export default {
  displayName: '${project.displayName}',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/${project.displayName}',
};`
    );
  }
}
