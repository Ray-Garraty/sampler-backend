'use strict';

export default (prevAngle, angleToGo) => {
  console.log('\nPrevious Servo position was', prevAngle, '⁰');
  console.log('Rotating Servo by', angleToGo, '⁰...\n');
  if ((prevAngle + angleToGo) > 360) {
    return prevAngle + angleToGo - 360;
  } else if ((prevAngle + angleToGo) < -360) {
    return prevAngle + angleToGo + 360;
  } else {
    return prevAngle + angleToGo;
  }
}