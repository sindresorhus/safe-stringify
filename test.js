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

/// test('circular object 2', t => {
// 	const fixture2 = {
// 		c: true,
// 	};

// 	const fixture = {
// 		a: fixture2,
// 		b: fixture2,
// 	};

// 	t.snapshot(safeStringify(fixture, options));
// });

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
