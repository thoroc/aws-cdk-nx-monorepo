import { Component, SourceCode } from "projen";
import { NxMonorepoAwsCdkChildProject } from "../projects/nx-monorepo-cdk";
import { NxMonorepoTsChildProject } from "../projects/base";

export class ProjectJestConfigTs extends Component {
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
