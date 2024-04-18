import { SampleFile, SampleFileOptions } from "projen";
import { NxMonorepoAwsCdkChildProject } from "../projects/nx-monorepo-cdk";
import { CdkLib } from "./cdk-lib";

interface CdkBinProps extends SampleFileOptions {
  readonly appName?: string;
  readonly stacks: CdkLib[];
  readonly awsAccount: string;
  readonly awsRegion: string;
}

export class CdkBin extends SampleFile {
  public contents: string;

  constructor(
    context: NxMonorepoAwsCdkChildProject,
    id: string,
    props: CdkBinProps,
  ) {
    super(context, id, {
      ...props,
      sourcePath: `${context.outdir}/src/${context.cdkPath}/bin/main.ts`,
    });

    this.contents = `import { App } from 'aws-cdk-lib';
`;

    for (const stack of props.stacks) {
      this.contents += `
    import { ${stack.stackName}Stack } from '../lib/${stack.stackId}-stack';`;
    }

    this.contents += `

const app = new App();
`;

    for (const stack of props.stacks) {
      this.contents += `

    new ${stack.stackName}Stack(app, "${stack.stackId}", {
      env: {
        account: "${props.awsAccount}",
        region: "${props.awsRegion}",
      },
    });
    `;
    }

    this.contents += `
app.synth();
`;
  }
}
