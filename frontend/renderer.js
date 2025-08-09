'use strict'

import {
  setCoolerBtnStyle, 
  setPumpElementsStyle, 
  setChamberTempFieldStyle, 
  setTubeSensorFieldStyle, 
  setRtcTempEltStyle, 
  setDateTimeEltStyle
} from './stylers.js';

const chambTempWarnThreshold = 4.5;
const rtcTempWarnThreshold = 35;

coolerSpinner.style.display = 'none';

pumpSpinner.style.display = 'none';

let speed = Number(pumpSpeedInput.textContent || pumpSpeedInput.value);
pumpSpeedOutput.textContent = speed;

let angle = Number(servoAngleInput.textContent || servoAngleInput.value);
servoAngleOutput.textContent = angle + '⁰';

const tubeSensorField = document.getElementById('Tube status');

const rtcTempField = document.getElementById('Case temperature');

const dateTimeField = document.getElementById('Date & Time');

const inquireCoolerStatus = async () => {
  const response = await fetch('http://localhost:3000/coolerStatus');
  const isCoolerOn = await response.json();
  console.log({isCoolerOn});
  return isCoolerOn;
};

const fetchCoolerStatusAndUpdateBtn = () => {
  inquireCoolerStatus()
    .then(isOn => {
      coolerBtn.disabled = false;
      setCoolerBtnStyle(isOn);
    })
    .catch(err => {
      console.error(err);
    });
};

const fetchChamberTempSensorsAndUpdElts = async () => {
  const temperaturesResponse = await fetch('http://localhost:3000/temperatures');
  const temps = await temperaturesResponse.json();
  if (temps.every(element => element === null)) {
		console.log('No response from chamber temperature sensors...');
	} else {
		console.log('Current temperatures:', temps);
		tempFields.forEach((field, i) => {
      setTempFieldStyle(field, temps[i], chambTempWarnThreshold);
    });
	} 
};

const fetchTubeSensorStatusAndUpdElt = async () => {
  const tubeSensorResponse = await fetch('http://localhost:3000/tubeSensorStatus');
  const isTubeEmpty = await tubeSensorResponse.json();
  console.log({isTubeEmpty});
  setTubeSensorFiledStyle(isTubeEmpty);
};

const fetchRtcTempAndUpdElt = async () => {
  const response = await fetch('http://localhost:3000/caseTemperature');
  const rtcTemp = await response.json();
  console.log({rtcTemp});
  setRtcTempEltStyle(rtcTemp, rtcTempWarnThreshold);
};

const fetchDateTimeAndUpdElt = async () => {
  const dateTimeResponse = await fetch('http://localhost:3000/dateTime');
  const dateTime = await dateTimeResponse.json();
  console.log({dateTime});
  setDateTimeEltStyle(dateTime);
};

