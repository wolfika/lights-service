import test from 'ava';
import sinon from 'sinon';
import auth from '../lib/auth';

const keyDb = [
	'keyboard cat'
];

test('should be a function', t => {
	t.is(typeof auth, 'function');
});

test('should throw when a keyDb is not provided', t => {
	t.throws(() => {
		auth();
	});
});

test('should return a function', t => {
	t.is(typeof auth({keyDb}), 'function');
});

test('should throw when request has missing client key', t => {
	const req = {
		headers: {}
	};

	const res = {};

	t.throws(() => {
		auth({keyDb})(req, res);
	});
});

test('should throw when request has invalid client key', t => {
	const req = {
		headers: {
			'x-client-key': 'something else'
		}
	};

	const res = {};

	t.throws(() => {
		auth({keyDb})(req, res);
	});
});

test('should return handler(req, res) when request has valid client key', t => {
	const req = {
		headers: {
			'x-client-key': keyDb[0]
		}
	};

	const res = {};

	const handler = sinon.stub();

	auth({keyDb}, handler)(req, res);

	t.true(handler.calledWith(req, res));
});
