import test from 'ava';
import sinon from 'sinon';
import lights from '../lib/lights';

test('should be a function', t => {
	t.is(typeof lights, 'function');
});

test('should return an object', t => {
	t.is(typeof lights(), 'object');
});

test.beforeEach(t => {
	const lamps = {
		on: sinon.stub(),
		off: sinon.stub(),
		rgb: sinon.stub(),
		zone: sinon.stub().returnsThis(),
		white: sinon.stub(),
		hsv: sinon.stub()
	};

	t.context.lamps = lamps;

	t.context.instance = lights({lamps});
});

test('on() should turn on the lamps', t => {
	t.context.instance.on();

	t.true(t.context.lamps.on.calledOnce);
});

test('off() should turn off the lamps', t => {
	t.context.instance.off();

	t.true(t.context.lamps.off.calledOnce);
});

test('power() should call either on() or off() based on the argument received', t => {
	t.context.instance.power('on');
	t.context.instance.power('off');

	t.true(t.context.lamps.on.calledOnce);
	t.true(t.context.lamps.off.calledOnce);
});

test('power() should throw when given an incorrect argument', t => {
	t.throws(() => {
		t.context.instance.power('keyboard cat');
	});
});

test('changeColor() should change the lamp color, given a correct argument', t => {
	t.context.instance.changeColor('#f00');

	t.true(t.context.lamps.zone.calledWith([1, 2, 3, 4, 5]));
	t.true(t.context.lamps.rgb.calledWith('#ff0000'));
});

test('changeColor() should change the lamp color to white, when the argument is resolved to be white color', t => {
	t.context.instance.changeColor('#fff');

	t.true(t.context.lamps.white.calledWith(100));
});

test('changeColor() should throw when given an incorrect argument', t => {
	t.throws(() => {
		t.context.instance.changeColor('#asd');
	});
});

test('dim() should dim the lamps, given a correct argument', t => {
	t.context.instance.dim(50);

	t.true(t.context.lamps.zone.calledWith([1, 2, 3, 4, 5]));
	t.true(t.context.lamps.hsv.calledWith(-1, -1, 50));
});

test('dim() should throw when given an incorrect argument', t => {
	t.throws(() => {
		t.context.instance.dim(null);
	});
});
