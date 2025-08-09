'use strict'

fetchCoolerStatusAndUpdateBtn();

setInterval(fetchChamberTempSensorsAndUpdElts, 1000);

setInterval(fetchTubeSensorStatusAndUpdElt, 500);

setInterval(inquireCaseTemperature, 10000);

setInterval(inquireDateTime, 10000);

coolerBtn.addEventListener('click', async () => {  
  try {
    const response = await fetch('http://localhost:3000/toggleCooler');
    const isCoolerOn = await response.json();
    setCoolerBtnStyle(isCoolerOn);
  } catch (error) {
    console.error(error);
  }
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
  setPumpElementsStyle(isPumpOn);
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