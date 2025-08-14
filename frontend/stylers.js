'use strict';

export const setCoolerBtnStyle = (button, textSpan, spinner, isOn) => {
  textSpan.innerText = isOn ? 'Выключить Пельтье' : 'Включить Пельтье';
	button.classList.remove(...button.classList);
	button.classList.add('btn', 'btn-lg');
	const outlineClass = isOn ? 'btn-danger' : 'btn-success';
	button.classList.add(outlineClass);
	if (isOn) {
    spinner.removeAttribute("style");
  } else {
    spinner.style.display = 'none';
  };
};

export const setPumpElementsStyle = (
  button,
  textSpan,
  speedInput,
  cwDirRadioElt,
  ccwDirRadioElt,
  spinner,
  isOn,
  dir,
  contModeInput,
  discrModeInput,
  calModeInput,
) => {
  [speedInput, cwDirRadioElt, ccwDirRadioElt, contModeInput, discrModeInput, calModeInput].forEach((element) => {
    element.disabled = isOn;
  });
  if (dir === 'CW') {
		cwDirRadioElt.checked = true;
  } else {
		ccwDirRadioElt.checked = true;
	}
	textSpan.innerText = isOn ? 'Выключить насос' : 'Включить насос';
  button.classList.remove(...button.classList);
	button.classList.add('btn', 'btn-lg');
	const outlineClass = isOn ? 'btn-danger' : 'btn-success';
	button.classList.add(outlineClass);
	if (isOn) {
    spinner.removeAttribute("style");
  } else {
    spinner.style.display = 'none';
  };
};

export const setChamberTempFieldStyle = (element, t, threshold) => {
  element.classList.remove(...element.classList);
  element.classList.add('btn', 'btn-lg');
	let outlineClass;
	if (t == false) {
		outlineClass = 'btn-outline-secondary';
		element.innerText = 't⁰: ...';
	} else {
		element.innerText = t + '⁰C';
		outlineClass = t > threshold ? 'btn-outline-danger' : 'btn-outline-success';
	}
	element.classList.add(outlineClass);
};

export const setTubeSensorFieldStyle = (element, isEmpty) => {
  element.classList.remove(...element.classList);
  element.classList.add('btn', 'btn-lg');
  const outlineClass = isEmpty ? 'btn-outline-danger' : 'btn-outline-success';
  element.classList.add(outlineClass);
  element.innerText = isEmpty ? 'Трубка пустая' : 'В трубке есть вода';
};

export const setDateTimeEltStyle = (element, dateTime) => {
  const dateTimeStringWithSec = (new Date(dateTime)).toLocaleString('ru-RU');
  const dateTimeStringNoSec = dateTimeStringWithSec.slice(0, -3);
  element.innerText = dateTimeStringNoSec;
};

export const setRtcTempEltStyle = (element, t, threshold) => {
  element.classList.remove(...element.classList);
  element.classList.add('btn', 'btn-lg');
  const outlineClass = t > threshold ? 'btn-outline-danger' : 'btn-outline-success';
  element.classList.add(outlineClass);
  element.innerText = `t контроллера: ${t}⁰C`;
};

export const setCpuTempBtnStyle = (element, t, threshold) => {
  element.classList.remove(...element.classList);
  element.classList.add('btn', 'btn-lg');
  const outlineClass = t > threshold ? 'btn-outline-danger' : 'btn-outline-success';
  element.classList.add(outlineClass);
  element.innerText = `t ЦП: ${t}⁰C`;
};

export const setModbusFieldStyle = (element, isReady) => {
  const colorClass = isReady ? 'text-success' : 'text-danger';
  element.classList.add(colorClass);
  element.innerText = isReady ? 'Готов к приёму команд по MODBUS' : 'Ошибка USB-RS485 конвертера';
};

export const setServoStatusEltStyle = (element, angle) => {
  element.innerText = "Текущая позиция сервопривода: " + angle + '⁰';
};