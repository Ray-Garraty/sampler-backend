'use strict';

import Gpio from 'onoff';
import pwm from 'raspi-soft-pwm';

const dirPin = new Gpio.Gpio(532, 'out');
const enPin = new Gpio.Gpio(528, 'out');

export default (speed, direction, mode, stepsCount, timeInSec) => {
	const stepPin = new pwm.SoftPWM({
		pin: 'GPIO21',
		frequency: speed // cannot be set less than 10 (Hz)
  });
    
	const dirNum = direction === 'CW' ? 0 : 1;
		
  console.log('\nApplying pump changes...');
	console.table({speed, direction, mode, stepsCount, timeInSec});
  console.log();

  return new Promise((resolve) => {
    if (speed === 0) { // stop pump command
      console.log('\nShutting down pump...');
      enPin.write(1); // disabled
      stepPin.write(0);
      resolve(0);
    } 

    if (mode === 'Continuous dosing') {
      console.log('\nContinuous dosing mode is active');
      enPin.write(0); // enabled
      dirPin.write(dirNum);
      stepPin.write(0.5);
      resolve(speed);
    } 
    
    if (mode === 'Discrete dosing') {
      console.log('\nDiscrete dosing mode is active');
      enPin.write(0); // enabled
      dirPin.write(dirNum);
      stepPin.write(0.5);
      /* for (let i = 0; i < stepsCount; i += 1) {
        stepPin.write(0.5);
      } */

      setTimeout(() => {
        enPin.write(1); // disabled
        stepPin.write(0);
        resolve(0);
      }, timeInSec * 1000);
    }

    if (mode === 'Pump calibration') {
      console.warn('\n Pump calibration mode has not been implemented yet...\n');
      resolve(0);
    }
  });
};