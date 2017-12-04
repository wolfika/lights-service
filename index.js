const {json, send} = require('micro');
const post = require('micro-post');
const lights = require('./lib/lights');
const {APIError, MalformattedCommandSyntaxError} = require('./lib/errors');

module.exports = post(async (req, res) => {
	try {
		const body = await json(req);

		if (!body || !Object.keys(body).length) {
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
		} else {
			console.error(err);
			return send(res, 500, {error: 'Unkown error occured, please try again later'});
		}
	}
});
