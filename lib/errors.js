class APIError extends Error {
	constructor(message, statusCode = 400) {
		super(message);
		this.message = message;
		this.statusCode = statusCode;
		this.body = {error: message};
	}
}

class MalformattedCommandSyntaxError extends APIError {}

class BadCommandParameterError extends APIError {}

module.exports = {
	APIError,
	MalformattedCommandSyntaxError,
	BadCommandParameterError
};
