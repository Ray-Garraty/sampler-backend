'use strict'

import modbus from 'jsmodbus';
import SerialPort from 'serialport';

const portPath = '/dev/ttyUSB0';

const checkIfPortAvailable = async (portName) => {
  const ports = await SerialPort.SerialPort.list();
	console.table(ports.map(port => port.path));
  const isAvailable = ports.some(port => port.path === portName);
  return isAvailable;
}

export default async () => {
	const isPortAvailable = await checkIfPortAvailable(portPath);
	if (!isPortAvailable) {
		console.error(portPath, 'port not found!');
		throw new Error();
	}
		
	const port = await new SerialPort.SerialPort({
		path: portPath,
		baudRate: 9600,
		dataBits: 8,
		parity: 'none',
		stopBits: 1
	});
	
	port.on("error", (err) => {
		console.error("Serial port error detected:", err.message);
		throw new Error(err);
	});
	
	const server = new modbus.server.RTU(port, {
		unitID: 1,
		buffer: Buffer.alloc(10000),
	});
	
		port.on("open", () => {
			console.log("Serial port opened. Modbus RTU server listening...");
		});
		port.on('data', (data) => {
			console.log ('Incoming raw data:', data);
		});
		server.on('connection', () => {
			console.log('Connection established succesfully');
		});
		server.on('error', (error) => {
			console.error(error);
		});
		server.on('preReadCoils', (message) => {
			console.log('Read coils message received:\n', message);
		});
		server.on('preWriteSingleCoil', (message) => {
			console.log('Write Single Coil message received:\n', message);
		});
		server.on('preWriteMultipleCoils', (message) => {
			console.log('Write Multiple Coils message received:\n', message);
		});
		server.on('preReadHoldingRegisters', (message) => {
			console.log('Read Holding Registers message received:\n', message);
		});
		server.on('preReadDiscreteInputs', (message) => {
			console.log('Read Discrete Inputs message received:\n', message);
		});
		server.on('preReadInputRegisters', (message) => {
			console.log('Read Input Registers message received:\n', message);
		});
		server.on('preWriteMultipleRegisters', (message) => {
			console.log('Write Multiple Registers message received:\n', message);
		});
};