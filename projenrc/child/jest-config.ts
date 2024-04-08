import { Component, SourceCode } from "projen";
import { NxMonorepoAwsCdkChildProject } from "./nx-monorepo-cdk-project";
import { NxMonorepoTsChildProject } from "./nx-monorepo-ts-project";

export class JestConfigTs extends Component {
  constructor(
    project: NxMonorepoAwsCdkChildProject | NxMonorepoTsChildProject,
  ) {
    super(project);

    new SourceCode(project, "jest.config.ts", {}).line(
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
};`,
    );
  }
}
