'use strict'

import Gpio from 'onoff';
import pwm from 'raspi-soft-pwm';

export default (speed, direction, mode, stepsCount, volume) => {
	const stepPin = new pwm.SoftPWM({
		pin: 'GPIO21',
		frequency: speed // cannot be set less than 10 (Hz)
  });
    
  const dirPin = new Gpio.Gpio(532, 'out');
  const enPin = new Gpio.Gpio(528, 'out');
		
	const dirNum = direction === 'CW' ? 0 : 1;
		
  console.log('\nApplying pump changes...');
	console.table({speed, direction, mode, stepsCount, volume});
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
      for (let i = 0; i < stepsCount; i += 1) {
        stepPin.write(0.5);
      }
      enPin.write(1); // disabled
      stepPin.write(0);
      resolve(0);
    }

    if (mode === 'Pump calibration') {
      console.warn('\n Pump calibration mode has not been implemented yet...\n');
      resolve(0);
    }
  });
};