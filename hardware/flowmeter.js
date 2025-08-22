import Gpio from 'onoff';
import process from 'process';

const inputPin = new Gpio.Gpio(534, 'in', 'both');

let lastRisingTime = 0n;
let lastFallingTime = 0n;
let period = 0n;
let frequency = 0;

inputPin.watch((err, value) => {
	if (err) {
		console.error('Flow meter GPIO watch error:', err);
		return;
	}
	const currentTime = process.hrtime.bigint();
	if (value === 1) { // Rising edge
		lastRisingTime = currentTime;
	} else { // Falling edge
		lastFallingTime = currentTime;
	}
	if (lastRisingTime !== 0n && lastFallingTime > lastRisingTime) {
		period = lastFallingTime - lastRisingTime;
		frequency = (1 / (Number(period) / 1_000_000_000)).toFixed(2);
		// console.log(`Flow sensor output: ${frequency} Hz`);
	}
});

process.on('message', () => {
	const timeNow = process.hrtime.bigint();
	if (timeNow - lastFallingTime > 1_000_000_000) {
		frequency = 0;
	}
	process.send(frequency);
});