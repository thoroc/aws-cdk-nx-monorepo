import { SampleFile, SampleFileOptions } from "projen";
import { NxMonorepoAwsCdkChildProject } from "../nx-monorepo-cdk-project";

export interface CdkLibProps extends SampleFileOptions {
  readonly stackName: string;
  readonly stackId: string;
}

export class CdkLib extends SampleFile {
  public contents: string;
  public stackName: string;
  public stackId: string;

  constructor(
    context: NxMonorepoAwsCdkChildProject,
    id: string,
    props: CdkLibProps,
  ) {
    super(context, id, {
      ...props,
      sourcePath: `${context.outdir}/src/${context.cdkPath}/lib/${props.stackId}-stack.ts`,
    });

    this.stackName = props.stackName;
    this.stackId = props.stackId;

    this.contents = `import { Stack, StackProps, Tags } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class ${props.stackName}Stack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const lambda = new NodejsFunction(this, 'greeting', {
      entry: 'src/handler.ts',
    });
    Tags.of(lambda).add('Name', '${props.stackId}-greeting');
  }
}
`;
  }
}
