import path from 'path';
import pkgConf from 'pkg-conf';
import callerPath from 'caller-path';
import isEmpty from 'lodash.isempty';

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
  assetRoot: string;
}

export const loadLambdaConfig = (
  namespace: string,
  key: string,
  cwd?: string
): LambdaConfig => {
  const config = pkgConf.sync(namespace, {
    cwd: path.dirname(cwd || (callerPath() as string))
  }) as Record<string, LambdaConfig>;

  if (isEmpty(config)) {
    throw new Error(`No config found for namespace ${namespace}`);
  }

  const filePath = pkgConf.filepath(config) as string;

  if (!config[key]) {
    throw new Error(`No entry in namespace ${namespace} for key ${key}`);
  }

  return {
    ...config[key],
    assetRoot: path.dirname(filePath)
  };
};
