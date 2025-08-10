'use strict'

import cors from 'cors';
import express from 'express';
import readRtc from './hardware/rtc.js';
import managePump from './hardware/pump.js';
import toggleCooler from './hardware/cooler.js';
import readCpuTemp from './hardware/cpu_temp.js';
import readTubeSensor from './hardware/tubesensors.js';
import readTemperatures from './hardware/tempsensors.js';
import modbusServerLaunch from './communication/jsmodbus-server.js';

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

const tempInquirePeriod = 3000; // in ms
const tubeSensorInquirePeriod = 1000;
const rtcInquirePeriod = 5000;
const cpuTempInquirePeriod = 5000;

let isCoolerOn = false;
let pumpSpeed = 0;
let pumpDir = 'CW';
let servoPosition = 0;
let temperatures = [null, null, null];
let isTubeEmpty = true;
let caseTemperature = null;
let dateTime = null;
let cpuTemperature = null;
let isModBusOK = null;

modbusServerLaunch()
  .then(() => { 
    isModBusOK = true;
    console.log('\nSuccessfully connected to the Serial Port');
  })
  .catch(() => {
    isModBusOK = false;
    console.error('\n---Could not connect to the Serial Port!---\n');
  });

const inquireTemperatures = async () => {
  temperatures = await Promise.all(readTemperatures());
};
setInterval(inquireTemperatures, tempInquirePeriod);

const inquireTubeSensor = async () => {
  isTubeEmpty = await readTubeSensor();
};
setInterval(inquireTubeSensor, tubeSensorInquirePeriod);

const inquireRtc = async () => {
  try {
    const rtcData = await Promise.all(readRtc());
    dateTime = rtcData[0];
    caseTemperature = rtcData[1];
  }
  catch (err) {
    console.error(err);
  }
};
setInterval(inquireRtc, rtcInquirePeriod);

const inquireCpuTemp = async () => {
  cpuTemperature = await readCpuTemp();
};
setInterval(inquireCpuTemp, cpuTempInquirePeriod);

app.get('/coolerStatus', (req, res) => {
  res.send(isCoolerOn);
});

app.get('/toggleCooler',  (req, res) => {
  const pendingStatus = !isCoolerOn;
  toggleCooler(pendingStatus);
  isCoolerOn = !isCoolerOn;
  res.send(pendingStatus);
});

app.get('/pumpStatus', (req, res) => {
  res.send([pumpSpeed, pumpDir]);
});

app.post('/managePump', (req, res) => {
  const requestedSpeed = req.body.speed;
  const requestedDirection = req.body.direction;
  console.log('\nReceived manage pump request with speed:', requestedSpeed, 'and dir:', requestedDirection, '\n');
  managePump(requestedSpeed, requestedDirection);
  pumpSpeed = requestedSpeed;
  pumpDir = requestedDirection;
  res.json({ message: 'New pump speed is', data: { speed: pumpSpeed, dir: pumpDir } });
});

app.post('/manageServo', (req, res) => {
  const requestedAngle = req.body.angle;
  console.log('Received servo rotate request with angle:', requestedAngle);
  servoPosition += requestedAngle;
  res.json({ message: 'New servo position is', data: { position: servoPosition } });
});

app.get('/temperatures', (req, res) => {
  res.send(temperatures);
});

app.get('/caseTemperature', (req, res) => {
  res.send(caseTemperature);
});

app.get('/cpuTemperature', (req, res) => {
  res.send(cpuTemperature);
});

app.get('/dateTime', (req, res) => {
  res.send(dateTime);
});

app.get('/tubeSensorStatus', (req, res) => {
  res.send(isTubeEmpty);
});

app.get('/modbusStatus', (req, res) => {
  res.send(isModBusOK);
});

app.listen(port, () => {
  console.log(`\nBackend is listening at http://localhost:${port}`);
});
