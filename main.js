import cors from 'cors';
import express from 'express';

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

app.get('/toggleCooler', (req, res) => {
  isCoolerOn = !isCoolerOn;
  console.log('Received toggle cooler request, its new status is: ', isCoolerOn);
  res.send(isCoolerOn);
});

app.get('/pumpStatus', (req, res) => {
  res.send(pumpSpeed);
});

app.post('/api/managePump', (req, res) => {
  const requestedSpeed = req.body.speed;
  console.log('Received manage pump request with speed:', requestedSpeed);
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
  res.send([0, 0, 0]);
});

app.get('/tubeSensorStatus', (req, res) => {
  res.send(false); // false = full, true = empty
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
