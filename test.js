import test from 'ava';
import safeStringify from './index.js';

const options = {
	indentation: '\t',
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

test('circular object w BigInt custom replacer', t => {
	const fixture = {
		a: 123n,
	};

	fixture.b = fixture;

	fixture.c = [fixture, fixture.b];

	fixture.d = {
		e: fixture.c,
	};

	t.snapshot(safeStringify(
		fixture,
		{
			...options,
			customReplacer: (key, value) =>
				typeof value === 'bigint' ? value.toString() + 'n' : value,
		},
	));
});

test('custom replacer has correct "this"', t => {
	const fixture = {
		foo: 'bar',
	};

	const customReplacer = function (key, value) {
		t.is(
			this,
			fixture,
			'The object in which the key was found must be provided as the replacer\'s this context.',
		);

		return typeof value === 'bigint' ? `${value.toString()}n` : value;
	};

	t.snapshot(safeStringify(
		fixture,
		{
			...options,
			customReplacer,
		},
	));
});
