import test from 'ava';
import safeStringify from './index.js';

const options = {
	indentation: '\t',
};

const traceOptions = {
	indentation: '\t',
	trace: true,
};

test('main', t => {
	const fixture = {
		a: true,
		b: {
			c: 1,
		},
	};

	t.is(safeStringify(fixture, options), JSON.stringify(fixture, undefined, '\t'));
});

test('circular object', t => {
	const fixture = {
		a: true,
	};

	fixture.b = fixture;

	fixture.c = [fixture, fixture.b];

	fixture.d = {
		e: fixture.c,
	};

	t.snapshot(safeStringify(fixture, options));
});

test('circular object with trace', t => {
	const fixture = {
		a: {
			b: [],
		},
	};

	fixture.self = fixture;
	fixture.a.self = fixture.a;
	fixture.a.b.push(fixture, fixture.a, fixture.a.b);

	t.snapshot(safeStringify(fixture, traceOptions));
});

test('circular object 2', t => {
	const fixture2 = {
		c: true,
	};

	const fixture = {
		a: fixture2,
		b: fixture2,
	};

	t.snapshot(safeStringify(fixture, options));
});

test('circular array', t => {
	const fixture = [1];

	fixture.push(fixture, fixture);

	t.snapshot(safeStringify(fixture, options));
});

test('multiple circular objects in array', t => {
	const fixture = {
		a: true,
	};

	fixture.b = fixture;

	t.snapshot(safeStringify([fixture, fixture], options));
});

test('multiple circular objects in object', t => {
	const fixture = {
		a: true,
	};

	fixture.b = fixture;

	t.snapshot(safeStringify({x: fixture, y: fixture}, options));
});

test('nested non-circular object', t => {
	const fixture = {
		a: {
			b: {
				c: {
					d: 1,
				},
			},
		},
	};

	t.is(safeStringify(fixture, options), JSON.stringify(fixture, undefined, '\t'));
});

test('nested circular object', t => {
	const fixture = {
		a: {
			b: {
				c: {},
			},
		},
	};

	fixture.a.b.c.d = fixture.a;

	t.snapshot(safeStringify(fixture, options));
});

test('complex object with circular and non-circular references', t => {
	const shared = {x: 1};
	const circular = {y: 2};
	circular.self = circular;

	const fixture = {
		a: shared,
		b: {
			c: shared,
			d: circular,
		},
		e: circular,
	};

	t.snapshot(safeStringify(fixture, options));
});

test('object with circular references at different depths', t => {
	const fixture = {
		a: {
			b: {
				c: {},
			},
		},
	};

	fixture.a.b.c.d = fixture.a;
	fixture.a.b.c.e = fixture.a.b;

	t.snapshot(safeStringify(fixture, options));
});

test('object with value as a circular reference', t => {
	const fixture = {
		a: 1,
		b: 2,
	};

	fixture.self = fixture;

	t.snapshot(safeStringify(fixture, options));
});

test('empty object', t => {
	const fixture = {};

	t.is(safeStringify(fixture, options), JSON.stringify(fixture, undefined, '\t'));
});

test('object with null value', t => {
	const fixture = {
		a: null,
	};

	t.is(safeStringify(fixture, options), JSON.stringify(fixture, undefined, '\t'));
});

test('object with undefined value', t => {
	const fixture = {
		a: undefined,
	};

	t.is(safeStringify(fixture, options), JSON.stringify(fixture, undefined, '\t'));
});

test('circular object with multiple nested circular references', t => {
	const fixture = {
		a: {
			b: {
				c: {},
			},
		},
	};

	fixture.a.b.c.d = fixture.a;
	fixture.a.b.c.e = fixture.a.b;
	fixture.a.b.c.f = fixture.a.b.c;

	t.snapshot(safeStringify(fixture, options));
});

test('circular array with nested circular arrays', t => {
	const fixture = [[1, 2, 3]];

	fixture.push(fixture, [fixture, fixture]);

	t.snapshot(safeStringify(fixture, options));
});

test('object with circular reference to parent and grandparent', t => {
	const fixture = {
		a: {
			b: {
				c: {},
			},
		},
	};

	fixture.a.b.c.parent = fixture.a.b;
	fixture.a.b.c.grandparent = fixture.a;

	t.snapshot(safeStringify(fixture, options));
});

test('array containing objects with the same circular reference', t => {
	const circular = {a: 1};
	circular.self = circular;

	const fixture = [
		{b: 2, c: circular},
		{d: 3, e: circular},
	];

	t.snapshot(safeStringify(fixture, options));
});

test('Date object', t => {
	const fixture = {
		date: new Date('2024-06-12T16:06:46.442Z'),
	};

	t.is(safeStringify(fixture, options), JSON.stringify(fixture, undefined, '\t'));
});

test('object with toJSON method', t => {
	const fixture = {
		a: 1,
		toJSON() {
			return {b: 2};
		},
	};

	t.is(safeStringify(fixture, options), JSON.stringify(fixture, undefined, '\t'));
});

test('complex object with Date and toJSON', t => {
	const fixture = {
		date: new Date('2024-06-12T16:06:46.442Z'),
		nested: {
			toJSON() {
				return {b: 2};
			},
		},
	};

	t.is(safeStringify(fixture, options), JSON.stringify(fixture, undefined, '\t'));
});

test('circular object with Date', t => {
	const fixture = {
		date: new Date('2024-06-12T16:06:46.442Z'),
	};

	fixture.self = fixture;

	const expected = JSON.stringify({date: '2024-06-12T16:06:46.442Z', self: '[Circular]'}, undefined, '\t');
	t.is(safeStringify(fixture, options), expected);
});

test('nested toJSON methods', t => {
	const fixture = {
		a: {
			toJSON() {
				return {b: 2};
			},
		},
		b: {
			toJSON() {
				return {c: 3};
			},
		},
	};

	t.is(safeStringify(fixture, options), JSON.stringify(fixture, undefined, '\t'));
});

test('toJSON method returning circular object', t => {
	const fixture = {
		a: 1,
		toJSON() {
			const x = {b: 2};
			x.self = x;
			return x;
		},
	};

	const expected = JSON.stringify({b: 2, self: '[Circular]'}, undefined, '\t');
	t.is(safeStringify(fixture, options), expected);
});

test('array with objects having toJSON methods', t => {
	const fixture = [
		{
			toJSON() {
				return {a: 1};
			},
		},
		{
			toJSON() {
				return {b: 2};
			},
		},
	];

	t.is(safeStringify(fixture, options), JSON.stringify(fixture, undefined, '\t'));
});

test('array with Date objects and toJSON methods', t => {
	const fixture = [
		new Date('2024-06-12T16:06:46.442Z'),
		{
			toJSON() {
				return {b: 2};
			},
		},
	];

	t.is(safeStringify(fixture, options), JSON.stringify(fixture, undefined, '\t'));
});

test('complex object with circular references and toJSON', t => {
	const shared = {
		x: 1,
		toJSON() {
			return {
				x: this.x,
			};
		},
	};

	const circular = {
		y: 2,
		toJSON() {
			return {
				y: this.y,
				self: '[Circular]',
			};
		},
	};

	circular.self = circular;

	const fixture = {
		a: shared,
		b: {
			c: shared,
			d: circular,
		},
		e: circular,
	};

	const expected = JSON.stringify({
		a: {
			x: 1,
		},
		b: {
			c: {
				x: 1,
			},
			d: {
				y: 2,
				self: '[Circular]',
			},
		},
		e: {
			y: 2,
			self: '[Circular]',
		},
	}, undefined, '\t');

	t.is(safeStringify(fixture, options), expected);
});
