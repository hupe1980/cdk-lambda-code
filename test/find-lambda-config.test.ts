import path from 'path';
import { findLambdaConfig } from '../src/find-lambda-config';

const root = path.join(__dirname, 'fixture', 'root');
const nested = path.join(root, 'nested');

it('should throw an exception if there is no package.json for specified namespace', () => {
    const namespace = 'NOT_AVAILABLE';
    const key = 'foo';

    const test = (): void => {
        findLambdaConfig(namespace, key, nested);
    }

    expect(test).toThrowError(
      `No config found for namespace ${namespace}`
    );
});

it('should throw an exception if there is no entry for a specified key', () => {
  const namespace = 'lambdaDependencies';
  const key = 'NOT_AVAILABLE';

  const test = (): void => {
    findLambdaConfig(namespace, key, nested);
  };

  expect(test).toThrowError(
    `No entry in namespace ${namespace} for key ${key}`
  );
});