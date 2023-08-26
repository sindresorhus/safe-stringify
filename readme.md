# safe-stringify

> Serialize objects to JSON with handling for circular references

`JSON.stringify()` throws an error if the object contains circular references. This package replaces circular references with `"[Circular]"`.

## Install

```sh
npm install @sindresorhus/safe-stringify
```

## Usage

```js
import safeStringify from '@sindresorhus/safe-stringify';

const foo = {a: true};
foo.b = foo;

console.log(safeStringify(foo));
//=> '{"a":true,"b":"[Circular]"}'

console.log(JSON.stringify(foo));
//=> TypeError: Converting circular structure to JSON

//Use customReplacer option to support BigInt
const bar = {x: 123n};
bar.y = bar;

console.log(safeStringify(foo, {customReplacer: (k, v) => typeof v === 'bigint' ? `${v.toString()}n` : v}));
//=> '{"x":"123n","y":"[Circular]"}'
```

## API

### safeStringify(value, options?)

Returns a string.

#### value

Type: `unknown`

The value to convert to a JSON string.

#### options

Type: `object`

##### indentation

Type: `'string' | 'number'`

The indentation of the JSON.

By default, the JSON is not indented. Set it to `'\t'` for tab indentation or the number of spaces you want.

##### customReplacer

Type: `(key: string, value: any) => any`

A replacer as for [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) to alter the serialization for custom objects.

The custom replacer is applied before circularity is detected.

## FAQ

### Why another safe stringify package?

The existing ones either did too much, did it incorrectly, or used inefficient code (not using `WeakSet`). For example, many packages incorrectly replaced all duplicate objects, not just circular references, and did not handle circular arrays.
