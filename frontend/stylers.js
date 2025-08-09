'use strict'

const setCoolerBtnStyle = (button, textSpan, spinner, isOn) => {
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

const setPumpElementsStyle = (button, textSpan, speedInput, cwDirRadioElt, ccwDirRadioElt, spinner, isOn) => {
  speedInput.disabled = isOn;
  cwDirRadioElt.disabled = isOn;
  ccwDirRadioElt.disabled = isOn;
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

const setChamberTempFieldStyle = (element, t, threshold) => {
  element.innerText = t + '⁰C';
	element.classList.remove(...element.classList);
	element.classList.add('btn', 'btn-lg');
	const outlineClass = t > threshold ? 'btn-outline-danger' : 'btn-outline-success';
	element.classList.add(outlineClass);
};

const setTubeSensorFieldStyle = (element, isEmpty) => {
  element.classList.remove(...element.classList);
	element.classList.add('btn', 'btn-lg');
	const outlineClass = isEmpty ? 'btn-outline-danger' : 'btn-outline-success';
	element.classList.add(outlineClass);
	element.innerText = isEmpty ? 'Трубка пустая' : 'В трубке есть вода';
};

const setRtcTempEltStyle = (element, t, threshold) => {
  element.classList.remove(...element.classList);
  element.classList.add('btn', 'btn-lg');
  const outlineClass = t > threshold ? 'btn-outline-danger' : 'btn-outline-success';
	element.classList.add(outlineClass);
  element.innerText = `t контроллера: ${t}⁰C`;
};

const setDateTimeEltStyle = (element, dateTime) => {
  element.innerText = (new Date(dateTime)).toLocaleString('ru-RU');
};

export {
	setCoolerBtnStyle, 
	setPumpElementsStyle, 
	setChamberTempFieldStyle, 
	setTubeSensorFieldStyle, 
	setRtcTempEltStyle, 
	setDateTimeEltStyle
};