const makeCircularReplacer = () => {
	const seen = new WeakSet();

	return (key, value) => {
		if (value !== null && typeof value === 'object') {
			if (seen.has(value)) {
				return '[Circular]';
			}

			seen.add(value);
		}

		return value;
	};
};

export default function safeStringify(object, {indentation} = {}) {
	// Without this, the replacer would replace duplicate objects in a top-level array.
	if (Array.isArray(object)) {
		object = object.map(element => JSON.parse(JSON.stringify(element, makeCircularReplacer())));
	}

	return JSON.stringify(object, makeCircularReplacer(), indentation);
}
