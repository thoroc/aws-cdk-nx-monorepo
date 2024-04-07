import { Component, JsonFile } from 'projen';
import { NxMonorepoChildProject } from './nx-monorepo-child-project';

export class tsConfig extends Component {
  constructor(project: NxMonorepoChildProject) {
    super(project);

    new JsonFile(project, 'tsconfig.spec.json', {
      obj: {
        extends: '../../tsconfig.base.json',
        files: [],
        include: [],
        references: [
          {
            path: './tsconfig.app.json',
          },
          {
            path: './tsconfig.spec.json',
          },
        ],
        compilerOptions: {
          esModuleInterop: true,
        },
      },
    });
  }
}
