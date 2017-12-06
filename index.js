const {json, send} = require('micro');
const post = require('micro-post');
const rateLimit = require('micro-ratelimit');
const auth = require('./lib/auth');
const lights = require('./lib/lights');
const keyDb = require('./keys.json');
const {APIError, MalformattedCommandSyntaxError} = require('./lib/errors');

const app = async (req, res) => {
	try {
		const body = await json(req);

		if (!body || Object.keys(body).length < 1) {
			throw new MalformattedCommandSyntaxError('Could not parse command from request');
		}

		if (body.power) {
			lights().power(body.power);
		}

		if (body.color) {
			lights().changeColor(body.color);
		}

		if (body.brightness) {
			lights().dim(body.brightness);
		}

		return {error: false};
	} catch (err) {
		if (err instanceof APIError) {
			return send(res, err.statusCode, err.body);
		}

		console.error(err);
		return send(res, 500, {error: 'Unkown error occured, please try again later'});
	}
};

const authConfig = {keyDb};

const rateLimitConfig = {
	window: 10000,
	limit: 5
};

module.exports = auth(authConfig, rateLimit(rateLimitConfig, post(app)));
