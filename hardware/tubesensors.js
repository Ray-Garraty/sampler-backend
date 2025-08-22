import Gpio from "onoff";

const inquireLiquidSensor = async () => {
  const waterSensorPin = new Gpio.Gpio(539, "in");
  const state = await waterSensorPin.read();
  const consoleMsg = state === 1 ? "empty" : "full";
  console.log("Water in the tube sensor state:", consoleMsg);
  return state;
};

export default inquireLiquidSensor;
