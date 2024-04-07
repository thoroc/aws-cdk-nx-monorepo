import { Component, SourceCode } from 'projen';
import { NxMonorepoProject } from './nx-monorepo-project';

export class EslintFlatConfig extends Component {
  constructor(project: NxMonorepoProject) {
    super(project);

    project.addDevDeps(
      '@eslint/eslintrc',
      '@nx/eslint-plugin',
      '@eslint/js',
      'eslint',
      'eslint-plugin-cdk',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser'
    );

    const config = new SourceCode(project, 'eslint.config.js');

    config.line(`
const { FlatCompat } = require('@eslint/eslintrc');
const nxEslintPlugin = require('@nx/eslint-plugin');
const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  { plugins: { '@nx': nxEslintPlugin } },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  ...compat.config({ extends: ['plugin:@nx/typescript'] }).map((config) => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx'],
    rules: {},
  })),
  ...compat.config({ extends: ['plugin:@nx/javascript'] }).map((config) => ({
    ...config,
    files: ['**/*.js', '**/*.jsx'],
    rules: {},
  })),
  ...compat.config({ env: { jest: true } }).map((config) => ({
    ...config,
    files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
    rules: {},
  })),
];`);
  }

  preSynthesize(): void {
    (this.project as NxMonorepoProject).childProjects.forEach((child) => {
      child.addDevDeps(
        'eslint',
        'eslint-plugin-cdk',
        '@typescript-eslint/eslint-plugin',
        '@typescript-eslint/parser'
      );

      const config = new SourceCode(child, 'eslint.config.js');

      config.line(`const baseConfig = require('../../eslint.config.js');

module.exports = [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {},
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {},
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {},
  },
];`);
    });
  }
}