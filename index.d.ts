export type Options = {
	/**
	The indentation of the JSON.

	By default, the JSON is not indented.

	Set it to `'\t'` for tab indentation or the number of spaces you want.
	*/
	readonly indentation?: string | number;
	/**
 	A replacer function as for [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#replacer) to alter the serialization for custom objects.

	The custom replacer is applied before circularity is detected.

	*Note: Unlike `JSON.stringify` `replacer` cannot be an array.*
	*/
	replacer?: (key: string | number, value: unknown) => any;
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
```
*/
export default function safeStringify(value: unknown, options?: Options): string;
