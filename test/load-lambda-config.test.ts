import path from 'path';
import { loadLambdaConfig } from '../src/load-lambda-config';

const root = path.join(__dirname, 'fixture', 'root');
const nested = path.join(root, 'node_modules', 'nested');

it('should throw an exception if there is no package.json for specified namespace', () => {
    const namespace = 'NOT_AVAILABLE';
    const key = 'foo';

    const test = (): void => {
        loadLambdaConfig(namespace, key, nested);
    }

    expect(test).toThrowError(`No config found for namespace ${namespace}`)
});

it('should throw an exception if there is no entry for a specified key', () => {
  const namespace = 'lambdaDependencies';
  const key = 'NOT_AVAILABLE';

  const test = (): void => {
    loadLambdaConfig(namespace, key, nested);
  };

  expect(test).toThrowError(
    `No entry in namespace ${namespace} for key ${key}`
  );
});