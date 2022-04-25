const makeCircularReplacer = ({trace} = {}) => {
	const seen = new WeakMap();

	return (key, value) => {
		if (value !== null && typeof value === 'object') {
			if (seen.has(value) && seen.get(value) !== key) {
				return trace ? `[Circular *${seen.get(value)}]` : '[Circular]';
			}

			seen.set(value, key);
		}

		return value;
	};
};

export default function safeStringify(object, {indentation, trace} = {}) {
	return JSON.stringify(object, makeCircularReplacer({trace}), indentation);
}
