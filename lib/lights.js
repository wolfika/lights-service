const Milight = require('milight');
const onecolor = require('onecolor');
const {BadCommandParameterError} = require('./errors');

/**
 * Returns a default initialized Milight instance.
 *
 * @returns {Milight} - Milight instance, using the 'milight' node package
 */
const getDefaultMilightInstance = () => {
	return new Milight({
		host: process.env.LIGHTS_ADDRESS,
		port: process.env.LIGHTS_PORT,
		delayBetweenMessages: 1000
	});
};

/**
 * Class which serves as an interface to a set of Milight lamps.
 */
class Lights {
	/**
	 * Constructor for the Lights class, initializing the instance with a default options object, optionally overrided
	 * by an options object passed as parameter.
	 *
	 * @param {Object} rawOptions - Options for lamp-related functionality
	 * @param {Milight=} rawOptions.lamps - Milight instance, using the 'milight' node package
	 */
	constructor(rawOptions) {
		const defaultOptions = {};

		if (!rawOptions || !rawOptions.lamps) {
			defaultOptions.lamps = getDefaultMilightInstance();
		}

		const options = Object.assign({}, defaultOptions, rawOptions);

		this._lamps = options.lamps;
	}

	/**
	 * Sends the power on command to the lamps instance.
	 */
	on() {
		this._lamps.on();
	}

	/**
	 * Sends the power off command to the lamps instance.
	 */
	off() {
		this._lamps.off();
	}

	/**
	 * Switches the lamp state either on or off.
	 *
	 * @param {string} state
	 */
	power(state) {
		if (state === 'on') {
			this.on();
		} else if (state === 'off') {
			this.off();
		} else {
			throw new BadCommandParameterError('power command only accepts \'on\' or \'off\' as parameter');
		}
	}

	/**
	 * Changes the color of all lamps, to the color specified in the rawColor parameter.
	 *
	 * @param {string} rawColor - Non-empty string, which can be resolved to a valid color value. Accepts a wide range
	 * of formats. For more information, see: https://github.com/One-com/one-color#api-overview
	 */
	changeColor(rawColor) {
		const color = onecolor(rawColor);

		if (!color) {
			throw new BadCommandParameterError('color command only accepts valid color values');
		}

		const hex = color.hex();

		if (hex === '#ffffff') {
			this._lamps.white(100);
		} else {
			this._lamps.zone([1, 2, 3, 4, 5]).rgb(hex);
		}
	}

	/**
	 * Dims the lamps to the specified brightness.
	 *
	 * @param {number} brightness - Numeric value of the desired brightness. 0-100
	 */
	dim(brightness) {
		if (!brightness || isNaN(brightness)) {
			throw new BadCommandParameterError('dim command only accepts numeric values as parameter');
		}

		this._lamps.zone([1, 2, 3, 4, 5]).hsv(-1, -1, brightness);
	}

	/**
	 * Returns a ready-to-use instantiated Lights object.
	 *
	 * @param {Object} options
	 * @param {Object} options.lamps - Options for lamp-related functionality
	 * @returns {Lights} - Instantiated Lights object
	 */
	static instance(options) {
		return new this(options);
	}
}

module.exports = options => Lights.instance(options);
