const {send} = require('micro');
const {MissingClientKeyError, InvalidClientKeyError} = require('./errors');

module.exports = (options, handler) => {
	if (!options || !options.keyDb) {
		throw new Error('Auth middleware received empty keyDb');
	}

	return (req, res) => {
		try {
			if (!req.headers['x-client-key']) {
				throw new MissingClientKeyError('No client key sent', 401);
			}

			if (!options.keyDb.includes(req.headers['x-client-key'])) {
				throw new InvalidClientKeyError('Invalid client key sent', 403);
			}
		} catch (err) {
			send(res, err.statusCode, {error: err.message});
		}

		return handler(req, res);
	};
};
