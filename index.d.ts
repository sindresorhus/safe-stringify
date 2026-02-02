export type Options = {
	/**
	The indentation of the JSON.

	By default, the JSON is not indented.

	Set it to `'\t'` for tab indentation or the number of spaces you want.
	*/
	readonly indentation?: string | number;

	/**
	Include the full object path in circular reference markers, like `[Circular *a.b]`.

	@example
	```
	import safeStringify from 'safe-stringify';

	const bar = {a: {b: {}}};
	bar.a.b.c = bar.a;

	console.log(safeStringify(bar, {trace: true}));
	//=> '{"a":{"b":{"c":"[Circular *a]"}}}'
	```
	*/
	readonly trace?: boolean;
};

/**
Serialize objects to JSON with handling for circular references.

@example
```
import safeStringify from 'safe-stringify';

const foo = {a: true};
foo.b = foo;

console.log(safeStringify(foo));
//=> '{"a":true,"b":"[Circular]"}'

console.log(JSON.stringify(foo));
//=> TypeError: Converting circular structure to JSON
```
*/
export default function safeStringify(value: unknown, options?: Options): string;
