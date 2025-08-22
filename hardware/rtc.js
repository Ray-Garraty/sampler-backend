import { DS3231 } from "@nanomatic/ds3231";

const RTC = new DS3231();

const inquireRtc = () => {
  const datePromise = new Promise((resolve, reject) => {
    try {
      const dateTime = RTC.get();
      console.log(dateTime);
      resolve(dateTime);
    } catch (err) {
      reject(err);
    }
  });

  const temperaturePromise = new Promise((resolve, reject) => {
    try {
      const temperature = RTC.getTemperature();
      console.log({ temperature });
      resolve(Math.round(temperature * 10) / 10);
    } catch (err) {
      reject(err);
    }
  });

  return [datePromise, temperaturePromise];
};

export default inquireRtc;
