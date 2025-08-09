'use strict'

import {
  setCoolerBtnStyle,
  setPumpElementsStyle,
  setChamberTempFieldStyle,
  setTubeSensorFieldStyle,
  setRtcTempEltStyle,
  setDateTimeEltStyle,
} from './frontend/stylers.js';

import {
  coolerBtn,
  coolerSpinner,
  coolerBtnSpan,
  pumpButton,
  pumpSpinner,
  pumpBtnSpan,
  cwDirRadioElt,
  ccwDirRadioElt,
  servoButton,
  servoStatusElt,
  pumpSpeedInput,
  pumpSpeedOutput,
  servoAngleInput,
  servoAngleOutput,
  chamberTempFields,
  tubeSensorField,
  rtcTempField,
  dateTimeField,
} from './frontend/elements.js';

const hostAddress = 'http://localhost:3000/';
const chambTempWarnThreshold = 4.5;
const rtcTempWarnThreshold = 35;
const chamberTempsUpdatePeriod = 3000;
const tubeSensorUpdatePeriod = 1000;
const rtcDataUpdatePeriod = 10000;

const fetchChamberTempsAndUpdElts = async () => {
  const temperaturesResponse = await fetch(hostAddress + 'temperatures');
  const temps = await temperaturesResponse.json();
  if (temps.every(element => element === null)) {
		console.log('No response from chamber temperature sensors...');
	} else {
		console.log('Current temperatures:', temps);
		chamberTempFields.forEach((field, i) => {
      setChamberTempFieldStyle(field, temps[i], chambTempWarnThreshold);
    });
	} 
};

const fetchCoolerStatus = async () => {
  const response = await fetch(hostAddress + 'coolerStatus');
  const isCoolerOn = await response.json();
  console.log({isCoolerOn});
  return isCoolerOn;
};

const fetchPumpStatus = async () => {
  const response = await fetch(hostAddress + 'pumpStatus');
  const pumpSpdAndDir = await response.json();
  console.table(pumpSpdAndDir);
  return pumpSpdAndDir;
};

fetchCoolerStatus()
  .then(isOn => {
    coolerBtn.disabled = false;
    setCoolerBtnStyle(coolerBtn, coolerBtnSpan, coolerSpinner, isOn);
  }).catch(err => {
    console.error(err);
  });

fetchPumpStatus()
  .then(([spd, dir]) => {
    pumpButton.disabled = false;
    setPumpElementsStyle(pumpButton, pumpBtnSpan, pumpSpeedInput, cwDirRadioElt, ccwDirRadioElt, pumpSpinner, spd > 0, dir);
  }).catch(err => {
    console.error(err);
  });


let speed = Number(pumpSpeedInput.textContent || pumpSpeedInput.value);
pumpSpeedOutput.textContent = speed;

let angle = Number(servoAngleInput.textContent || servoAngleInput.value);
servoAngleOutput.textContent = angle + '⁰';

coolerSpinner.style.display = 'none';
pumpSpinner.style.display = 'none';

const fetchTubeSensorAndUpdElt = async () => {
  const tubeSensorResponse = await fetch(hostAddress + 'tubeSensorStatus');
  const isTubeEmpty = await tubeSensorResponse.json();
  console.log({isTubeEmpty});
  setTubeSensorFieldStyle(tubeSensorField, isTubeEmpty);
};

const fetchRtcTempAndUpdElt = async () => {
  const response = await fetch(hostAddress + 'caseTemperature');
  const rtcTemp = await response.json();
  console.log({rtcTemp});
  setRtcTempEltStyle(rtcTempField, rtcTemp, rtcTempWarnThreshold);
};

const fetchDateTimeAndUpdElt = async () => {
  const dateTimeResponse = await fetch(hostAddress + 'dateTime');
  const dateTime = await dateTimeResponse.json();
  console.log({dateTime});
  setDateTimeEltStyle(dateTimeField, dateTime);
};

coolerBtn.addEventListener('click', async () => {  
  try {
    const response = await fetch(hostAddress + 'toggleCooler');
    const isCoolerOn = await response.json();
    setCoolerBtnStyle(coolerBtn, coolerBtnSpan, coolerSpinner, isCoolerOn);
  } catch (error) {
    console.error(error);
  }
});

pumpButton.addEventListener('click', async () => {
  const resp = await fetch(hostAddress + 'pumpStatus');
  const [crntSpd] = await resp.json();
  const speedToRequest = crntSpd > 0 ? 0 : speed;
  const dirToRequest = cwDirRadioElt.checked ? 'CW' : 'CCW';
  
  const response = await fetch(hostAddress + 'managePump', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
			speed: speedToRequest, 
			direction: dirToRequest
		})
	});
	const parsedResponse = await response.json();
	console.log('Pump speed is', parsedResponse.data.speed, 'now');
	const isPumpOn = parsedResponse.data.speed > 0;
  const newDir = parsedResponse.data.dir;
  setPumpElementsStyle(pumpButton, pumpBtnSpan, pumpSpeedInput, cwDirRadioElt, ccwDirRadioElt, pumpSpinner, isPumpOn, newDir);
});

pumpSpeedInput.addEventListener('input', () => {
  pumpSpeedOutput.textContent = pumpSpeedInput.value;
  speed = pumpSpeedInput.valueAsNumber;
});

servoButton.addEventListener('click', async () => {
  const response = await fetch(hostAddress + 'manageServo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ angle: angle })
	});
	const parsedResponse = await response.json();
	servoStatusElt.innerText = "Текущая позиция сервопривода: " + parsedResponse.data.position + '⁰';
});

servoAngleInput.addEventListener('input', () => {
  servoAngleOutput.textContent = servoAngleInput.value + '⁰';
  angle = servoAngleInput.valueAsNumber;
});

setInterval(fetchChamberTempsAndUpdElts, chamberTempsUpdatePeriod);

setInterval(fetchTubeSensorAndUpdElt, tubeSensorUpdatePeriod);

setInterval(fetchRtcTempAndUpdElt, rtcDataUpdatePeriod);

setInterval(fetchDateTimeAndUpdElt, rtcDataUpdatePeriod);