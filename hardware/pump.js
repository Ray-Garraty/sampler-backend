import os from 'node:os';
import Gpio from 'onoff';
import pwm from 'raspi-soft-pwm';

const managePump = os.platform() === 'win32' ?
  (speed) => {
    console.log('');
    if (speed === 0) {
      console.log('Pump stopped');
    } else {
      console.log('Pump started at', speed, 'speed');
    }
    console.log('');
  }  
:
  (speed) => {
		const stepPin = new pwm.SoftPWM({
			pin: 'GPIO21',
			frequency: speed // cannot be set less than 10 (Hz)
    });
    
    const dirPin = new Gpio.Gpio(532, 'out');
    const enPin = new Gpio.Gpio(528, 'out');
  
    console.log('Applying pump changes...');
		console.log({ speed });
		
		if (speed === 0) {
		  enPin.write(1); // disabled
		  stepPin.write(0);
		} else {
			enPin.write(0); // enabled
			dirPin.write(1);
			stepPin.write(0.5);
	  }
  }
;

export default managePump;
