import test from 'ava';
import safeStringify from './index.js';

test('main', t => {
	const fixture = {
		a: true,
		b: {
			c: 1,
		},
	};

	t.is(safeStringify(fixture, {indentation: '\t'}), JSON.stringify(fixture, undefined, '\t'));
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

	t.snapshot(safeStringify(fixture));
});

test('multiple circular objects', t => {
	const fixture = {
		a: true,
	};

	fixture.b = fixture;

	t.snapshot(safeStringify([fixture, fixture]));
});
