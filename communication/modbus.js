'use strict'

import ModbusRTU from 'modbus-serial';
import SerialPort from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

const port = new SerialPort.SerialPort({
  path: "/dev/ttyUSB0",
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
  parity: "none",
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" })); // for debugging

const server = new ModbusRTU.ServerSerial(port, {
  holdingRegisters: [0, 0, 0, 0, 0],
  inputRegisters: [0, 0, 0, 0, 0],
  coils: [false, false, false, false, false],
  discreteInputs: [false, false, false, false, false],
});

server.on("preReadCoils", (request, respond) => {
  console.log("Coil read request:", request);
  respond(null, server.coils);
});

server.on("preWriteCoil", (request, respond) => {
  console.log("Coil write request:", request);
  server.coils[request.address] = request.value;
  respond(null);
});

// ... Similar event listeners for other register types (holdingRegisters, inputRegisters, discreteInputs)

port.on("open", () => {
  console.log("Serial port opened. Modbus RTU server listening...");
});

port.on("error", (err) => {
  console.error("Serial port error:", err.message);
});

parser.on("data", (data) => {
  console.log("Received data:", data); // for debugging
});
