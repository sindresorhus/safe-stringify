function safeStringifyReplacer(seen) {
	return function (key, value) {
		if (value !== null && typeof value === 'object') {
			if (seen.has(value)) {
				return '[Circular]';
			}

			seen.add(value);

			const newValue = Array.isArray(value) ? [] : {};

			for (const [key2, value2] of Object.entries(value)) {
				newValue[key2] = safeStringifyReplacer(seen)(key2, value2);
			}

			seen.delete(value);

			return newValue;
		}

		return value;
	};
}

export default function safeStringify(object, {indentation, customReplacer} = {}) {
	const seen = new WeakSet();
	let preReplacer = (k, v) => v;
	if (customReplacer) {
		preReplacer = customReplacer;
	}

	return JSON.stringify(
		object,
		(key, value) => safeStringifyReplacer(seen)(key, preReplacer.call(object, key, value)),
		indentation,
	);
}
