# cdk-lambda-code

[![Build Status](https://travis-ci.org/hupe1980/cdk-lambda-code.svg?branch=master)](https://travis-ci.org/hupe1980/cdk-lambda-code)

> Wrapper arroud @aws-cdk/aws-lambda Code to support mocking in test mode and configuration wtih package.json namespaces

:warning: This is experimental and subject to breaking changes.

## Install

```sh
// with npm
npm install cdk-lambda-code

// with yarn
yarn add cdk-lambda-code
```

## How to use `fromPackageJson`

```json
// package.json

{
  "name": "construct",
  "lambdaDependencies": {
    "lambdaHandler": {
      "runtime": "nodejs10.x",
      "handler": "lib/index.handler",
      "artifact": "bundle.zip"
    }
  }
}
```

```typescript
// smaple-construct.ts
import { LambdaCode } from 'cdk-lambda-code';

new Function(this, 'LambdaFunction', {
  ...LambdaCode.fromPackageJson('lambdaHandler', {
    cwd: __dirname,
    mockInTestMode: true
  })
});
```

## How to use `fromFileAsInline`

```typescript
// smaple-construct.ts
import { LambdaCode } from 'cdk-lambda-code';

new Function(this, 'LambdaFunction', {
  ...LambdaCode.fromFileAsInline(path.join(__dirname, '..', 'handler.js'))
  runtime: Runtime.NODEJS_10_X,
  handler: 'index.handler'
});
```

## License

[MIT](LICENSE)
