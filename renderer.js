window.onload = window.resizeTo(800, 480);

const coolerBtn = document.getElementById('Cooler on/off');
const coolerSpinner = document.getElementById('coolerSpinner');
const coolerBtnSpan = document.getElementById('coolerText');
coolerSpinner.style.display = 'none';

const pumpButton = document.getElementById('Pump on/off');
const pumpSpinner = document.getElementById('pumpSpinner');
pumpSpinner.style.display = 'none';
const pumpBtnSpan = document.getElementById('pumpText');
const cwDirRadioElt = document.getElementById('Clockwise');
const ccwDirRadioElt = document.getElementById('Counterclockwise');

const servoButton = document.getElementById('Move servo');
const servoStatus = document.getElementById('Servo status');

const pumpSpeedInput = document.getElementById('pumpSpeedRange');
let speed = Number(pumpSpeedInput.textContent || pumpSpeedInput.value);
const pumpSpeedOutput = document.getElementById('pumpSpeedRangeValue');
pumpSpeedOutput.textContent = speed;

const servoAngleInput = document.getElementById('servoAngle');
let angle = Number(servoAngleInput.textContent || servoAngleInput.value);
const servoAngleOutput = document.getElementById('servoAngleValue');
servoAngleOutput.textContent = angle + '⁰';

const t1Field = document.getElementById('T1');
const t2Field = document.getElementById('T2');
const t3Field = document.getElementById('T3');
const tempFields = [t1Field, t2Field, t3Field];

const tubeSensorField = document.getElementById('Tube status');

coolerBtn.addEventListener('click', async () => {  
  const toggleResponse = await fetch('http://localhost:3000/toggleCooler');
  const isCoolerOn = await toggleResponse.json();
  console.log('Cooler state now is:', isCoolerOn);
  
	if (isCoolerOn) {
    coolerBtn.classList.remove('btn-success');
    coolerBtn.classList.add('btn-danger');
    coolerBtnSpan.innerText = "Выключить Пельтье";
    coolerSpinner.removeAttribute("style");
  } else {
    coolerBtn.classList.remove('btn-danger');
    coolerBtn.classList.add('btn-success');
    coolerBtnSpan.innerText = "Включить Пельтье";
    coolerSpinner.style.display = 'none';
  };
});

pumpButton.addEventListener('click', async () => {
  const pumpStatusResponse = await fetch('http://localhost:3000/pumpStatus');
  const currentPumpSpeed = await pumpStatusResponse.json();
  console.log('Previous pump speed was:', currentPumpSpeed);
  
  const speedToRequest = currentPumpSpeed > 0 ? 0 : speed;
  
  const dirToRequest = cwDirRadioElt.checked ? 'CW' : 'CCW';
  
  const response = await fetch('http://localhost:3000/api/managePump', {
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
  if (isPumpOn) {
    pumpButton.classList.remove('btn-success');
    pumpButton.classList.add('btn-danger');
    pumpBtnSpan.innerText = "Выключить насос";
    pumpSpeedInput.disabled = true;
    cwDirRadioElt.disabled = true;
    ccwDirRadioElt.disabled = true;
    pumpSpinner.removeAttribute("style");
  } else {
    pumpButton.classList.remove('btn-danger');
    pumpButton.classList.add('btn-success');
    pumpBtnSpan.innerText = "Включить насос";
    pumpSpeedInput.disabled = false;
    cwDirRadioElt.disabled = false;
    ccwDirRadioElt.disabled = false;
    pumpSpinner.style.display = 'none';
  };
});

pumpSpeedInput.addEventListener('input', () => {
  pumpSpeedOutput.textContent = pumpSpeedInput.value;
  speed = pumpSpeedInput.valueAsNumber;
});

servoButton.addEventListener('click', async () => {
  const response = await fetch('http://localhost:3000/api/manageServo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ angle: angle })
	});
	const parsedResponse = await response.json();
	servoStatus.innerText = "Текущая позиция сервопривода: " + parsedResponse.data.position + '⁰';
});

servoAngleInput.addEventListener('input', () => {
  servoAngleOutput.textContent = servoAngleInput.value + '⁰';
  angle = servoAngleInput.valueAsNumber;
});

const inquireTempSensors = async () => {
  const temperaturesResponse = await fetch('http://localhost:3000/temperatures');
  const temps = await temperaturesResponse.json();
  if (temps[0] === -273) {
		console.log('No response from temperature sensors...');
	} else {
		console.log('Current temperatures:', temps);
		tempFields.forEach((field, i) => {
			field.innerText = temps[i] + '⁰C';
			field.classList.remove(...field.classList);
			if (temps[i] > 4.2) {
				field.classList.add('btn', 'btn-lg', 'btn-outline-danger');
			} else {
				field.classList.add('btn', 'btn-lg', 'btn-outline-success');
			};
		});
	} 
};

const inquireTubeSensor = async () => {
  const tubeSensorResponse = await fetch('http://localhost:3000/tubeSensorStatus');
  const isTubeEmpty = await tubeSensorResponse.json();
  console.log('Пустая ли трубка с водой?', isTubeEmpty);
  if (isTubeEmpty) {
    tubeSensorField.classList.remove(...tubeSensorField.classList);
    tubeSensorField.classList.add('btn', 'btn-lg', 'btn-outline-danger');
    tubeSensorField.innerText = "Трубка пустая";
  } else {
    tubeSensorField.classList.remove(...tubeSensorField.classList);
    tubeSensorField.classList.add('btn', 'btn-lg', 'btn-outline-success');
    tubeSensorField.innerText = "В трубке есть вода";
  };
};

setInterval(inquireTempSensors, 2000);

setInterval(inquireTubeSensor, 1000);
