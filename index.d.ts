export type Options = {
	/**
	The indentation of the JSON.

	By default, the JSON is not indented.

	Set it to `'\t'` for tab indentation or the number of spaces you want.
	*/
	readonly indentation?: string | number;

	/**
	 Enable key tracing for circular references.

	 By default, this option is set to false.
	 */
	readonly trace?: boolean;
};

/**
Serialize objects to JSON with handling for circular references.

@example
```
import safeStringify from '@sindresorhus/safe-stringify';

const foo = {a: true};
foo.b = foo;

console.log(safeStringify(foo));
//=> '{"a":true,"b":"[Circular]"}'

console.log(JSON.stringify(foo));
//=> TypeError: Converting circular structure to JSON

console.log(safeStringify(foo, {trace: true}));
//=> '{ "a": true, "b": "[Circular *]" }'
```
*/
export default function safeStringify(value: unknown, options?: Options): string;
