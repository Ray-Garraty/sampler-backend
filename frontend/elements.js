'use strict'

const coolerBtn = document.getElementById('Cooler on/off');
const coolerSpinner = document.getElementById('coolerSpinner');
const coolerBtnSpan = document.getElementById('coolerText');

const pumpButton = document.getElementById('Pump on/off');
const pumpSpinner = document.getElementById('pumpSpinner');
const pumpBtnSpan = document.getElementById('pumpText');
const cwDirRadioElt = document.getElementById('Clockwise');
const ccwDirRadioElt = document.getElementById('Counterclockwise');

const servoButton = document.getElementById('Move servo');
const servoStatus = document.getElementById('Servo status');

const pumpSpeedInput = document.getElementById('pumpSpeedRange');
const pumpSpeedOutput = document.getElementById('pumpSpeedRangeValue');

const servoAngleInput = document.getElementById('servoAngle');
const servoAngleOutput = document.getElementById('servoAngleValue');

const t1Field = document.getElementById('T1');
const t2Field = document.getElementById('T2');
const t3Field = document.getElementById('T3');
const tempFields = [t1Field, t2Field, t3Field];

const tubeSensorField = document.getElementById('Tube status');

const rtcTempField = document.getElementById('Case temperature');

const dateTimeField = document.getElementById('Date & Time');

export {
  coolerBtn,
	coolerSpinner,
	coolerBtnSpan,
	pumpButton,
	pumpSpinner,
	
};