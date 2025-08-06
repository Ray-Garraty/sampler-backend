'use strict'

import ModbusRTU from 'modbus-serial';

const coils = {};
const inputRegisters = {};
const discreteInputs = {};
const holdingRegisters = {};

const vector = {
    getInputRegister: function(addr) {
        return inputRegisters[addr];
    },
    getMultipleInputRegisters: function(startAddr, length) {
        const values = [];
        for (let i = 0; i < length; i++) {
            values[i] = inputRegisters[startAddr + i];
        }
        return values;
    },
    getDiscreteInput: function(addr) {
        return discreteInputs[addr];
    },
    getHoldingRegister: function(addr) {
        return holdingRegisters[addr];
    },
    setRegister: function(addr, value) {
        holdingRegisters[addr] = value;
        return;
    },
    getMultipleHoldingRegisters: function(startAddr, length) {
        const values = [];
        for (let i = 0; i < length; i++) {
            values[i] = holdingRegisters[startAddr + i];
        }
        return values;
    },
    getCoil: function(addr) {
        return coils[addr];
    },
    setCoil: function(addr, value) {
        coils[addr] = value;
        return coils[addr];
    },
    readDeviceIdentification: function() {
        return {
            0x00: "MyVendorName",
            0x01: "MyProductCode",
            0x02: "MyMajorMinorRevision",
            0x05: "MyModelName",
            0x97: "MyExtendedObject1",
            0xab: "MyExtendedObject2"
        };
    }
};

const serverSerial = new ModbusRTU.ServerSerial(
    vector,
    {
      port: "/dev/ttyUSB0",
      baudRate: 9600,
      dataBits: 8,
      stopBits: 1,
      parity: "none",
      debug: true,
      unitID: 1,
    }
);

serverSerial.on("error", (err) => {
    console.error(err);
});

serverSerial.on("initialized", () => {
    console.log("Server initialized and listening on /dev/ttyUSB0");
});

serverSerial.on("socketError", (err) => {
    console.error(err);
    serverSerial.close(console.log("server closed"));
});

serverSerial.on("data", (data) => {
    console.log(data.toString());
});
