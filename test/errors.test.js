import test from 'ava';
import {APIError, MalformattedCommandSyntaxError, BadCommandParameterError} from '../lib/errors';

test('APIError extends Error', t => {
	const error = new APIError('keyboard cat');
	t.true(error instanceof Error);
});

test('APIError stores constructor parameters', t => {
	const options = {
		message: 'keyboard cat',
		statusCode: 400
	};

	const error = new APIError(options.message, options.statusCode);
	t.truthy(error.message);
	t.truthy(error.statusCode);
});

test('APIError constructs correct body', t => {
	const options = {
		message: 'keyboard cat'
	};

	const error = new APIError(options.message);
	t.truthy(error.body);
	t.truthy(error.body.error);
	t.is(error.body.error, options.message);
});

test('MalformattedCommandSyntaxError should extend APIError', t => {
	const error = new MalformattedCommandSyntaxError('keyboard cat');
	t.true(error instanceof APIError);
});

test('BadCommandParameterError should extend APIError', t => {
	const error = new BadCommandParameterError('keyboard cat');
	t.true(error instanceof APIError);
});
