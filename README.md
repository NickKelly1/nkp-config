# nkp-config

[![npm version](https://badge.fury.io/js/%40nkp%2Fconfig.svg)](https://www.npmjs.com/package/@nkp/config)
[![Node.js Package](https://github.com/NickKelly1/nkp-config/actions/workflows/release.yml/badge.svg)](https://github.com/NickKelly1/nkp-config/actions/workflows/release.yml)
![Known Vulnerabilities](https://snyk.io/test/github/nickkelly1/nkp-config/badge.svg)

Set of functions to help parse environment variables and bootstrap configuration objects.

## Examples

### Parsing objects

```ts
import * as c from '@nkp/config';

/**
 * the parse function correctly sets the type of `config`
 * {
 *  DEBUG: false;
 *  MAIL: string | undefined;
 *  HOST: string;
 *  PORT: number;
 *  env: 'development' | 'testing' | 'production';
 * }
 */
const config = c.parse({
  // coerces DEBUG is a boolean defaulting to false if not provided
  DEBUG: c.boolean().default(false),

  // coerces MAIL_HOST to string, or leaves undefined if it doesn't exist
  MAIL_HOST: c.string().optional(),

  // coerces process.env.HOST to string
  HOST: c.string() ,

  // coerces process.env.PORT to string
  // if not provided, defaults to 3000
  PORT: c.integer().default(3000),

  // ensures procese.env.NODE_ENV is one of the given values
  env: c
    .key('NODE_ENV')
    .oneOf(['development', 'testing', 'production',] as const),
}, process.env);
```

### Parsing values

Instead of parsing an object, a single key can be parsed.

```ts
import { key } from '@nkp/config';

// by key - required
const email1: string = key('EMAIL')
  .string()
  .parse(process.env);

// by key - optional
const email2: string | undefined = key('EMAIL')
  .string()
  .optional()
  .parse(process.env);

// by value - with default
const email3: string = string()
  .default('example@example.com')
  .parse(process.env['EMAIL']);

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
