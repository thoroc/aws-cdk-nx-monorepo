import {
  NxMonorepoAwsCdkChildProject,
  NxMonorepoAwsCdkChildProjectOptions,
} from "./nx-monorepo-cdk";

export class BackendTsProject extends NxMonorepoAwsCdkChildProject {
  constructor(props: NxMonorepoAwsCdkChildProjectOptions) {
    super(props);
  }
}
