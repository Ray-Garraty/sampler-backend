import Gpio from "onoff";

const toggleCooler = (stateToToggle) => {
  const relayPinNumber = 529;
  const relayPin = new Gpio.Gpio(relayPinNumber, "out");
  if (stateToToggle) {
    return relayPin.write(1, (err) => {
      if (err) {
        console.log("Error enabling cooler pin");
      } else {
        console.log("Cooler enabled");
      }
    });
  }
  return relayPin.write(0, (err) => {
    if (err) {
      console.log("Error disabling cooler pin");
    } else {
      console.log("Cooler disabled");
    }
  });
};
export default toggleCooler;
