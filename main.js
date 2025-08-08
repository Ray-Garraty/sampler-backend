'use strict'

import cors from 'cors';
import express from 'express';
import readRtc from './hardware/rtc.js';
import managePump from './hardware/pump.js';
import toggleCooler from './hardware/cooler.js';
import readTubeSensor from './hardware/tubesensors.js';
import readTemperatures from './hardware/tempsensors.js';
import modbusServerLaunch from './communication/jsmodbus-server.js';

const app = express();
const port = 3000;
const tempInquirePeriod = 3000; // in ms
const tubeSensorInquirePeriod = 1000;
const rtcInquirePeriod = 5000;

app.use(cors());
app.use(express.json());

let isCoolerOn = false;
let pumpSpeed = 0;
let servoPosition = 0;
let temperatures = [null, null, null];
let isTubeEmpty = true;
let caseTemperature = null;
let dateTime = null;

modbusServerLaunch();

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
  res.send(pumpSpeed);
});

app.post('/api/managePump', (req, res) => {
  const requestedSpeed = req.body.speed;
  const requestedDirection = req.body.direction;
  console.log('Received manage pump request with speed:', requestedSpeed, 'and dir:', requestedDirection);
  managePump(requestedSpeed, requestedDirection);
  pumpSpeed = requestedSpeed;
  res.json({ message: 'New pump speed is', data: { speed: pumpSpeed } });
});

app.post('/api/manageServo', (req, res) => {
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

app.get('/dateTime', (req, res) => {
  res.send(dateTime);
});

app.get('/tubeSensorStatus', async (req, res) => {
  res.send(isTubeEmpty);
});

app.listen(port, () => {
  console.log(`\nServer listening at http://localhost:${port}`);
});
