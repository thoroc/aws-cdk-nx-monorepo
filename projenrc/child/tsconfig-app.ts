import { Component, JsonFile } from 'projen';
import { NxMonorepoChildProject } from './nx-monorepo-child-project';

export class tsConfigApp extends Component {
  constructor(project: NxMonorepoChildProject) {
    super(project);

    new JsonFile(project, 'tsconfig.app.json', {
      obj: {
        extends: './tsconfig.json',
        compilerOptions: {
          outDir: '../../dist/out-tsc',
          module: 'commonjs',
          types: ['node'],
        },
        exclude: ['jest.config.ts', 'src/**/*.spec.ts', 'src/**/*.test.ts'],
        include: ['src/**/*.ts'],
      },
    });
  }
}
