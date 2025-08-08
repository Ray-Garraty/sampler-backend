import { exec } from 'child_process';

    exec('cat /sys/class/thermal/thermal_zone0/temp', (error, stdout) => {
        if (error) {
            console.error(`Cpu temp reading error: ${error}`);
            return;
        }
        const rawTemp = parseInt(stdout.trim());
        const celsiusTemp = rawTemp / 1000;
        console.log(`CPU Temperature: ${celsiusTemp}°C`);
    });

export default () => new Promise((resolve, reject) => {
	exec('cat /sys/class/thermal/thermal_zone0/temp', (error, stdout) => {
    if (error) {
        console.error(`CPU Temperature reading error: ${error}`);
        reject(error);
    }
    const rawTemp = parseInt(stdout.trim());
    const celsiusTemp = (Math.round(rawTemp / 100))/10;
    console.log(`CPU Temperature: ${celsiusTemp}°C`);
		resolve(celsiusTemp);
   });
});