import test from 'ava';
import safeStringify from './index.js';

const options = {
	indentation: '\t',
};

const optionsWithTrace = {
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
	t.is(safeStringify(fixture, optionsWithTrace), JSON.stringify(fixture, undefined, '\t'));
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

test('circular object with trace enabled', t => {
	const fixture = {
		a: true,
	};

	fixture.b = fixture;

	fixture.c = [fixture, fixture.b];

	fixture.d = {
		e: fixture.c,
	};

	t.snapshot(safeStringify(fixture, optionsWithTrace));
});

test('circular array', t => {
	const fixture = [1];

	fixture.push(fixture, fixture);

	t.snapshot(safeStringify(fixture, options));
});

test('circular array with trace enabled', t => {
	const fixture = [1];

	fixture.push(fixture, fixture);

	t.snapshot(safeStringify(fixture, optionsWithTrace));
});

test('multiple circular objects in array', t => {
	const fixture = {
		a: true,
	};

	fixture.b = fixture;

	t.snapshot(safeStringify([fixture, fixture], options));
});

test('multiple circular objects in array with trace enabled', t => {
	const fixture = {
		a: true,
	};

	fixture.b = fixture;

	t.snapshot(safeStringify([fixture, fixture], optionsWithTrace));
});

test('multiple circular objects in object', t => {
	const fixture = {
		a: true,
	};

	fixture.b = fixture;

	t.snapshot(safeStringify({x: fixture, y: fixture}, options));
});

test('multiple circular objects in object with trace enabled', t => {
	const fixture = {
		a: true,
	};

	fixture.b = fixture;

	t.snapshot(safeStringify({x: fixture, y: fixture}, optionsWithTrace));
});
