const Milight = require('milight');
const onecolor = require('onecolor');
const {BadCommandParameterError} = require('./errors');

const milight = new Milight({
	host: process.env.LIGHTS_ADDRESS,
	port: process.env.LIGHTS_PORT,
	delayBetweenMessages: 1000
});

class Lights {
	constructor(rawOptions) {
		const defaultOptions = {
			lamps: milight
		};

		const options = Object.assign({}, defaultOptions, rawOptions);

		this._lamps = options.lamps;
	}

	on() {
		this._lamps.on();
	}

	off() {
		this._lamps.off();
	}

	power(state) {
		if (state === 'on') {
			this.on();
		} else if (state === 'off') {
			this.off();
		} else {
			throw new BadCommandParameterError('power command only accepts \'on\' or \'off\' as parameter');
		}
	}

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

	dim(brightness) {
		if (!brightness || isNaN(brightness)) {
			throw new BadCommandParameterError('dim command only accepts numeric values as parameter');
		}

		this._lamps.zone([1, 2, 3, 4, 5]).hsv(-1, -1, brightness);
	}

	static instance(options) {
		return new this(options);
	}
}

module.exports = options => Lights.instance(options);
