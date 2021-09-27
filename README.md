# nkp-config

[![npm version](https://badge.fury.io/js/%40nkp%2Fconfig.svg)](https://www.npmjs.com/package/@nkp/config)
[![Node.js Package](https://github.com/nickkelly1/config/actions/workflows/release.yml/badge.svg)](https://github.com/nickkelly1/nkp-config/actions/workflows/release.yml)
![Known Vulnerabilities](https://snyk.io/test/github/nickkelly1/nkp-config/badge.svg)

Set of functions to help parse environment variables and bootstrap configuration objects.

## Examples

### Parsing objects

```ts
import { key, oneOf, integer, parse } from '@nkp/config';

interface Config {
  port: number;
  env: 'development' | 'testing' | 'production';
}

const config = parse({
  port: key('PORT').integer(),
  env: key('NODE_ENV').oneOf<Config['env']>([
    'development',
    'testing',
    'production']),
}, process.env);

// TypeScript knows config's type
// config: {
//    port: number,
//    env: 'development' | 'testing' | 'production'
// }
```

### Parsing values

Instead of parsing an object, a single key can be parsed.

```ts
import { key, string } from '@nkp/config';
const email = key('EMAIL').string().parse(process.env);
```

### Default values

Default values can be provided.

```ts
import { key, integer } from '@nkp/config';
const port = key('PORT').integer().default(3000).parse(process.env);
```

### Throws on missing values

If no default value is provided and the key is not found, an error will be thrown.

```ts
import { key, string } from '@nkp/config';
const vars = {};
const value = key('MISSING_VALUE').string().parse(vars);
// throws TypeError "MISSING_VALUE is not defined"
```

## Publishing

To a release a new version:

1. Update the version number in package.json
2. Push the new version to the `master` branch on GitHub
3. Create a `new release` on GitHub for the latest version

This will trigger a GitHub action that tests and publishes the npm package.
