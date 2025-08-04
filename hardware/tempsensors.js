import os from 'node:os';
import sensor from 'ds18x20';

const sensorsIDs = ['28-00000053e471', '28-8b96451f64ff', '28-8b96451f64ff'];

const readTemperatures = os.platform() === 'win32' ? 
  () => {
    const template = [3.5, 3.5, 3.5];
    const temps = template.map((temp) => Math.round((temp + Math.random()) * 10) / 10);
    console.log('Temperatures:', temps);
    return temps;
  }
: 
  () => new Promise((resolve, reject) => {
		sensor.getAll((error, data) => {
      if (error) {
				console.error(error);
        reject(error);
      } else {
				console.log('Raw temp sensors data:', data);
        resolve(data);
      }
    });
	})
;

export default readTemperatures;
