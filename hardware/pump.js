'use strict';

import Gpio from 'onoff';
import pwm from 'raspi-soft-pwm';

const dirPin = new Gpio.Gpio(532, 'out');
const enPin = new Gpio.Gpio(528, 'out');

const calculateDosingTime = (v) => v * 1; // insert pump calibration equation here

export default (speed, direction, mode, timeInSec, volume) => {
	const stepPin = new pwm.SoftPWM({
		pin: 'GPIO21',
		frequency: speed // cannot be set less than 10 (Hz)
  });
    
	const dirNum = direction === 'CW' ? 0 : 1;
		
  console.log('\nApplying pump changes...');
	console.table({speed, direction, mode, timeInSec, volume});
  console.log();

  return new Promise((resolve) => {
    if (speed === 0) { // stop pump command
      console.log('\nShutting down pump...');
      enPin.write(1); // disabled
      stepPin.write(0);
      resolve(0);
    } 

    if (mode === 'Continuous dosing') {
      console.log('\nContinuous dosing...\n');
      enPin.write(0); // enabled
      dirPin.write(dirNum);
      stepPin.write(0.5);
      resolve(speed);
    } 
    
    if (mode === 'Dosing by time') {
      console.log('\nDosing by time started\n');
      console.time('by time');
      enPin.write(0); // enabled
      dirPin.write(dirNum);
      stepPin.write(0.5);
      setTimeout(() => {
        enPin.write(1); // disabled
        stepPin.write(0);
        console.log('\nDosing finished');
        console.timeEnd('by time');
        console.log();
        resolve(0);
      }, timeInSec * 1000);
    }

    if (mode === 'Dosing by volume') {
      console.log('\nDosing by volume started\n');
      console.time('by vol');
      const time = calculateDosingTime(volume);
      enPin.write(0); // enabled
      dirPin.write(dirNum);
      stepPin.write(0.5);
      setTimeout(() => {
        enPin.write(1); // disabled
        stepPin.write(0);
        console.log('\nDosing finished');
        console.timeEnd('by vol');
        console.log();
        resolve(0);
      }, time * 1000);
    }

    if (mode === 'Pump calibration') {
      console.warn('\n Pump calibration mode has not been implemented yet...\n');
      resolve(0);
    }
  });
};