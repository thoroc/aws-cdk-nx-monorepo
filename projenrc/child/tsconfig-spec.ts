import { Component, JsonFile } from 'projen';
import { NxMonorepoChildProject } from './nx-monorepo-child-project';

export class tsConfigSpec extends Component {
  constructor(project: NxMonorepoChildProject) {
    super(project);

    new JsonFile(project, 'tsconfig.spec.json', {
      obj: {
        extends: './tsconfig.json',
        compilerOptions: {
          outDir: '../../dist/out-tsc',
          module: 'commonjs',
          types: ['jest', 'node'],
        },
        include: [
          'jest.config.ts',
          'src/**/*.test.ts',
          'src/**/*.spec.ts',
          'src/**/*.d.ts',
        ],
      },
    });
  }
}
