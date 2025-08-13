import sensor from 'ds18x20';

console.log('\nChecking temperature sensors...');
const sensorsIDs = (sensor.list()).filter(id => id.startsWith('28-'));
// const sensorsIDs = ['28-00000053e471', '28-8b96451f64ff', '28-8b96451f64ff'];
console.log({sensorsIDs});

export default () => {
    if (sensorsIDs.length === 0) {
      return Promise.reject(console.warn('Please connect at least 1 temperature sensor and restart the app'));
    }
    const tempPromises = sensorsIDs.map((sensorId) => {
      return new Promise((resolve, reject) => {
          sensor.get(sensorId, (error, data) => {
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
    return tempPromises;
  }
;