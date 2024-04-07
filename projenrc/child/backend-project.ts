import {
  NxMonorepoChildProject,
  NxMonorepoChildProjectOptions,
} from './nx-monorepo-child-project';

export class BackendTsProject extends NxMonorepoChildProject {
  constructor(props: NxMonorepoChildProjectOptions) {
    super(props);
  }
}
