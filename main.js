import cors from 'cors';
import express from 'express';
import managePump from './hardware/pump.js';
import toggleCooler from './hardware/cooler.js';
import readTubeSensor from './hardware/tubesensors.js';
import readTemperatures from './hardware/tempsensors.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let isCoolerOn = false;
let pumpSpeed = 0;
let servoPosition = 0;

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
  console.log('Received manage pump request with speed:', requestedSpeed);
  managePump(requestedSpeed);
  pumpSpeed = requestedSpeed;
  res.json({ message: 'New pump speed is', data: { speed: pumpSpeed } });
});

app.post('/api/manageServo', (req, res) => {
  const requestedAngle = req.body.angle;
  console.log('Received servo rotate request with angle:', requestedAngle);
  servoPosition += requestedAngle;
  res.json({ message: 'New servo position is', data: { position: servoPosition } });
});

app.get('/temperatures', async (req, res) => {
  const temperatures = await readTemperatures();
  console.log({ temperatures });
  res.send(temperatures || [-273, -273, -273]);
});

app.get('/tubeSensorStatus', async (req, res) => {
  const isTubeEmpty = await readTubeSensor();
  res.send(isTubeEmpty);
});

app.listen(port, () => {
  console.log(`\nServer listening at http://localhost:${port}`);
});
