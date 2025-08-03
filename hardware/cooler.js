import Gpio from 'onoff';
import os from 'node:os';

const toggleCooler = os.platform() === 'win32' ?
  (stateToToggle) => {
    console.log('');
    if (stateToToggle) {
      console.log('Cooler enabled');
    } else {
      console.log('Cooler disabled');
    };
    console.log('');
  }    
: 
  (stateToToggle) => {
    const relayPinNumber = 529;
    const relayPin = new Gpio.Gpio(relayPinNumber, 'out');
    if (stateToToggle) {
      return relayPin.write(1, (err) => {
				if (err) {
					console.log('Error enabling cooler pin');
				} else {
					console.log('Cooler enabled');
				}
			});
    } else {
      return relayPin.write(0, (err) => {
				if (err) {
					console.log('Error disabling cooler pin');
				} else {
					console.log('Cooler disabled');
				}
			});
    };
  } 
;

export default toggleCooler;
