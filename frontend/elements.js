'use strict';

export const coolerBtn = document.getElementById('Cooler on/off'); 
export const coolerSpinner = document.getElementById('coolerSpinner');
export const coolerBtnSpan = document.getElementById('coolerText');

export const pumpButton = document.getElementById('Pump on/off');
export const pumpSpinner = document.getElementById('pumpSpinner');
export const pumpBtnSpan = document.getElementById('pumpText');
export const pumpDirSelectGroup = document.getElementsByName('Rotation direction');
export const cwDirRadioElt = document.getElementById('Clockwise');
export const ccwDirRadioElt = document.getElementById('Counterclockwise');

export const pumpSpeedInput = document.getElementById('pumpSpeedRange');
export const pumpSpeedOutput = document.getElementById('pumpSpeedRangeValue');
export const pumpContinuousModeInputElt = document.getElementById('Continuous dosing');
export const pumpDiscreteModeInputElt = document.getElementById('Discrete dosing');
export const pumpModeSelectGroup = document.getElementsByName('Dosing mode');
export const pumpCalModeInputElt = document.getElementById('Pump calibration');
export const stepsCountInputElt = document.getElementById('Steps count');
export const timeInputElt = document.getElementById('Pump time');

export const servoButton = document.getElementById('Move servo');
export const servoStatusElt = document.getElementById('Servo status');
export const servoAngleInput = document.getElementById('servoAngle');
export const servoAngleOutput = document.getElementById('servoAngleValue');

const t1Field = document.getElementById('T1');
const t2Field = document.getElementById('T2');
const t3Field = document.getElementById('T3');
export const chamberTempFields = [t1Field, t2Field, t3Field];

export const tubeSensorField = document.getElementById('Tube status');
export const rtcTempField = document.getElementById('Case temperature');
export const dateTimeField = document.getElementById('Date & Time');
export const cpuTempElt = document.getElementById('CPU temperature');
export const modbusStatusField = document.getElementById('Modbus status');