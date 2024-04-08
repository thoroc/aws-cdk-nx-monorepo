import {
  NxMonorepoAwsCdkChildProject,
  NxMonorepoAwsCdkChildProjectOptions,
} from "./nx-monorepo-cdk-project";

export class BackendTsProject extends NxMonorepoAwsCdkChildProject {
  constructor(props: NxMonorepoAwsCdkChildProjectOptions) {
    super(props);
  }
}
