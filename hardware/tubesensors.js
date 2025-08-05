import Gpio from 'onoff';
import os from 'node:os';

const readTubeSensor = os.platform() === 'win32' ? 
  () => {
    const state = Math.round(Math.random());
    const consoleMsg = state ? 'No water in the tube' : 'Water in the tube detected';
    console.log(consoleMsg);
    return state;
  }
:
  async () => {
    const waterSensorPin = new Gpio.Gpio(539, 'in');
    const state = await waterSensorPin.read();
		const consoleMsg = state === 1 ? 'empty' : 'full';
		console.log('Water in the tube sensor state:', consoleMsg); 
    return state;  
  }
; 

export default readTubeSensor;
