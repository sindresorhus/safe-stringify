function serializeValue(value, seen, trace, currentPath) {
	// Handle objects with a custom `.toJSON()` method.
	if (typeof value?.toJSON === 'function') {
		value = value.toJSON();
	}

	if (!(value !== null && typeof value === 'object')) {
		return value;
	}

	if (seen.has(value)) {
		if (!trace) {
			return '[Circular]';
		}

		const existingPath = seen.get(value);
		const circularPath = existingPath === '' ? '*' : `*${existingPath}`;
		return `[Circular ${circularPath}]`;
	}

	seen.set(value, currentPath);

	const newValue = Array.isArray(value) ? [] : {};

	for (const [propertyKey, propertyValue] of Object.entries(value)) {
		const nextPath = currentPath === '' ? propertyKey : `${currentPath}.${propertyKey}`;
		newValue[propertyKey] = serializeValue(propertyValue, seen, trace, nextPath);
	}

	seen.delete(value);

	return newValue;
}

export default function safeStringify(value, {indentation, trace} = {}) {
	const seen = new WeakMap();
	const serializedValue = serializeValue(value, seen, trace, '');
	return JSON.stringify(serializedValue, undefined, indentation);
}
