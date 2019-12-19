import fs from 'fs-extra';
import path from 'path';
import {
  AssetCode,
  CfnParametersCode,
  CfnParametersCodeProps,
  InlineCode,
  S3Code,
  Code,
  Runtime
} from '@aws-cdk/aws-lambda';
import { AssetOptions } from '@aws-cdk/aws-s3-assets';
import { IBucket } from '@aws-cdk/aws-s3';

import { loadLambdaConfig } from './load-lambda-config';

export interface Options {
  namespace?: string;
  mockInTestMode?: boolean;
  cwd?: string;
}

export interface LambdaConfig {
  runtime?:
    | 'nodejs10.x'
    | 'nodejs12.x'
    | 'python2.7'
    | 'python3.6'
    | 'python3.7'
    | 'python3.8'
    | 'go1.x';
  handler?: string;
  artifact: string;
}

export class LambdaCode {
  /**
   * Loads the function code from a local disk asset.
   * The configuration is done in package.json
   * @returns `code`, `handler` and `runtime`.
   * @param key The key in the package.json namespace
   */
  public static fromPackageJson(key: string, options?: Options): {
    code: AssetCode | InlineCode;
    runtime: Runtime;
    handler: string;
  } {
    const { namespace, mockInTestMode, cwd } = {
      namespace: 'lambdaDependencies',
      mockInTestMode: false,
      cwd: process.cwd(),
      ...options
    };

    const lambdaConfig = loadLambdaConfig(namespace, key, cwd);

    const lambdaAsset = path.join(
      lambdaConfig.assetRoot,
      lambdaConfig.artifact
    );

    const runtime = Runtime.ALL.find(
      item => item.name === lambdaConfig.runtime
    );

    return {
      runtime: runtime || Runtime.NODEJS_10_X,
      handler: lambdaConfig.handler || 'lib/index.handler',
      code: LambdaCode.fromAsset(lambdaAsset, { mockInTestMode })
    };
  }

  /**
   * @returns `LambdaS3Code` associated with the specified S3 object.
   * @param bucket The S3 bucket
   * @param key The object key
   * @param objectVersion Optional S3 object version
   */
  public static fromBucket(
    bucket: IBucket,
    key: string,
    objectVersion?: string
  ): S3Code {
    return Code.fromBucket(bucket, key, objectVersion);
  }

  /**
   * @returns `LambdaInlineCode` with inline code.
   * @param code The actual handler code (limited to 4KiB)
   */
  public static fromInline(code: string): InlineCode {
    return Code.fromInline(code);
  }

  /**
   * @returns `LambdaInlineCode` with inline code.
   * @param path The path of the source file (limited to 4KiB)
   */
  public static fromFileAsInline(path: string): InlineCode {
    if(!fs.pathExistsSync(path)) {
      throw new Error(`No file found for path ${path}`);
    }

    const code = fs.readFileSync(path, { encoding: 'uft8' });
    
    return LambdaCode.fromInline(code);
  }

  /**
   * Loads the function code from a local disk asset.
   * In test mode (process.env.NODE_ENV === 'test'), the asset is replaced by an inline code mock
   * @returns `LambdaAssetCode` or `LambdaInlineCode`.
   * @param path Either a directory with the Lambda code bundle or a .zip file
   */
  public static fromAsset(
    path: string,
    options?: AssetOptions & { mockInTestMode: boolean }
  ): AssetCode | InlineCode {
    if (options?.mockInTestMode && process.env.NODE_ENV === 'test') {
      return LambdaCode.fromInline('__MOCK__');
    }

    return Code.fromAsset(path, options);
  }

  /**
   * Creates a new Lambda source defined using CloudFormation parameters.
   *
   * @returns a new instance of `CfnParametersCode`
   * @param props optional construction properties of {@link CfnParametersCode}
   */
  public static fromCfnParameters(
    props?: CfnParametersCodeProps
  ): CfnParametersCode {
    return Code.fromCfnParameters(props);
  }
}
