# nkp-config

Set of functions to help parse environment variables and bootstrap configuration objects.

## Examples

### Parsing objects

```ts
import { oneOf, integer, parse } from '@nkp/config';

interface Config {
  port: number;
  env: 'development' | 'testing' | 'production';
}

const config: Config = parse({
  port: key('PORT').as(integer()),
  env: key('NODE_ENV').as(oneOf<Config['env']>([
    'development',
    'testing',
    'production'])),
});
```

### Parsing values

Instead of parsing an object, a single key can be parsed.

```ts
import { string } from '@nkp/config';
const email = key('EMAIL').as(string()).get();
```

### Default values

Default values can be provided.

```ts
import { integer } from '@nkp/config';
const port = key('PORT').as(integer(3000)).get();
```

### Throws on missing values

If no default value is provided and the key is not found, an error will be thrown.

```ts
import { string } from '@nkp/config';
const vars = {};
const value = key('MISSING_VALUE').as(string()).get(vars);
// throws TypeError "MISSING_VALUE is not defined"
```
