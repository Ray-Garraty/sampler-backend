import os from 'node:os';
import Gpio from 'onoff';
import pwm from 'raspi-soft-pwm';

const managePump = os.platform() === 'win32' ?
  (speed, direction) => {
    console.log('');
    if (speed === 0) {
      console.log('Pump stopped');
    } else {
      console.log('Pump started at', speed, 'speed');
    }
    console.log('');
  }  
:
  (speed, direction) => {
		const stepPin = new pwm.SoftPWM({
			pin: 'GPIO21',
			frequency: speed // cannot be set less than 10 (Hz)
    });
    
    const dirPin = new Gpio.Gpio(532, 'out');
    const enPin = new Gpio.Gpio(528, 'out');
		
		const dirNum = direction === 'CW' ? 0 : 1;
		
    console.log('Applying pump changes...');
		console.log({ speed });
		console.log({ direction });
		
		if (speed === 0) {
		  enPin.write(1); // disabled
		  stepPin.write(0);
		} else {
			enPin.write(0); // enabled
			dirPin.write(dirNum);
			stepPin.write(0.5);
	  }
  }
;

export default managePump;
