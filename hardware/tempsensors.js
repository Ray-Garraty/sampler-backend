import os from 'node:os';
import sensor from 'ds18b20-raspi';

console.log('\nChecking temperature sensors...');
const sensorsIDs = sensor.list();
// const sensorsIDs = ['28-00000053e471', '28-8b96451f64ff', '28-8b96451f64ff'];
console.log({sensorsIDs});

const readTemperatures = os.platform() === 'win32' ? 
  () => {
    const template = [3.5, 3.5, 3.5];
    const temps = template.map((temp) => Math.round((temp + Math.random()) * 10) / 10);
    console.log('Temperatures:', temps);
    return temps;
  }
: 
  () => {
    if (sensorsIDs.length === 0) {
      return Promise.reject(console.warn('Please connect at least 1 temperature sensor and restart the app'));
    }
    const tempPromises = sensorsIDs.map((sensorId) => {
      return new Promise((resolve, reject) => {
          sensor.readC(sensorId, 1, (error, data) => {
            if (error) {
              console.error(error);
              reject(error);
            } else {
              console.log(sensorId, data);
              resolve(data);
            }
          });       
	    })
    });
    return Promise.all(tempPromises);
  }  

/* () => new Promise((resolve, reject) => {
		sensor.getAll((error, data) => {
      if (error) {
				console.error(error);
        reject(error);
      } else {
				console.log('Raw temp sensors data:', data);
        resolve(data);
      }
    });
	}) */
;

export default readTemperatures;
