import { exec } from "node:child_process";

exec("cat /sys/class/thermal/thermal_zone0/temp", (error, stdout) => {
  if (error) {
    console.error(`Cpu temp reading error: ${error}`);
    return;
  }
  const rawTemp = parseInt(stdout.trim(), 10);
  const celsiusTemp = rawTemp / 1000;
  console.log(`CPU Temperature: ${celsiusTemp}°C`);
});

const inquireCpuTemp = () =>
  new Promise((resolve, reject) => {
    exec("cat /sys/class/thermal/thermal_zone0/temp", (error, stdout) => {
      if (error) {
        console.error(`CPU Temperature reading error: ${error}`);
        reject(error);
      }
      const rawTemp = parseInt(stdout.trim(), 10);
      const celsiusTemp = Math.round(rawTemp / 100) / 10;
      console.log(`CPU Temperature: ${celsiusTemp}°C`);
      resolve(celsiusTemp);
    });
  });

export default inquireCpuTemp;
