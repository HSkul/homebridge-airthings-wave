var inherits = require('util').inherits;
var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  var CustomCharacteristic = {};
  // Define Radon - short term
  CustomCharacteristic.RadonLevelShortTermAverage = function() {
    Characteristic.call(this, 'Radon Level ST', CustomCharacteristic.RadonLevelShortTermAverage.UUID);
    this.setProps({
      format: Characteristic.Formats.UINT8,
      unit: "Bq/m3",
      minValue: 0,
      maxValue: 1000,
      minStep: 1,
      perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
    });
    this.value = this.getDefaultValue();
  };
  CustomCharacteristic.RadonLevelShortTermAverage.UUID = 'B42E01AA-ADE7-11E4-89D3-123B93F75CBA';
  inherits(CustomCharacteristic.RadonLevelShortTermAverage, Characteristic);
  
  // Define Radon - long term
  CustomCharacteristic.RadonLevelLongTermAverage = function() {
    Characteristic.call(this, 'Radon Level LT', CustomCharacteristic.RadonLevelLongTermAverage.UUID);
    this.setProps({
      format: Characteristic.Formats.UINT8,
      unit: "Bq/m3",
      minValue: 0,
      maxValue: 1000,
      minStep: 1,
      perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
    });
    this.value = this.getDefaultValue();
  };
  CustomCharacteristic.RadonLevelLongTermAverage.UUID = 'B42E0A4C-ADE7-11E4-89D3-123B93F75CBA';
  inherits(CustomCharacteristic.RadonLevelLongTermAverage, Characteristic);
  // Define Pressure
  CustomCharacteristic.Pressure = function() {
    Characteristic.call(this, 'Pressure', CustomCharacteristic.Pressure.UUID);
    this.setProps({
      format: Characteristic.Formats.FLOAT,
      unit: "hPa",
      minValue: 0.0,
      maxValue: 10000.0,
      minStep: 0.1,
      perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
    });
    this.value = this.getDefaultValue();
  };
  CustomCharacteristic.Pressure.UUID = '873AE82A-4C5A-4342-B539-9D900BF7EBD0';
  inherits(CustomCharacteristic.Pressure, Characteristic);

  // Define VOCLevel
  CustomCharacteristic.VOCLevel = function() {
    Characteristic.call(this, 'VOC Level', CustomCharacteristic.VOCLevel.UUID);
    this.setProps({
      format: Characteristic.Formats.FLOAT,
      unit: "ppb",
      minValue: 0,
      maxValue: 1000,
      minStep: 1,
      perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
    });
    this.value = this.getDefaultValue();
  };
  CustomCharacteristic.VOCLevel.UUID = 'B42E41C4-ADE7-11E4-89D3-123B93F75CBA';
  inherits(CustomCharacteristic.VOCLevel, Characteristic);
  
  // courtesy of https://github.com/robi-van-kinobi/homebridge-cubesensors
  CustomCharacteristic.RadonLevelSensor = function(displayName, subtype) {
    Service.call(this, displayName, CustomCharacteristic.RadonLevelSensor.UUID, subtype);

    // Required Characteristics
    this.addCharacteristic(CustomCharacteristic.RadonLevelShortTermAverage);
    this.addCharacteristic(CustomCharacteristic.RadonLevelLongTermAverage);

    // Optional Characteristics
    this.addOptionalCharacteristic(Characteristic.StatusActive);
    this.addOptionalCharacteristic(Characteristic.StatusFault);
    this.addOptionalCharacteristic(Characteristic.StatusLowBattery);
    this.addOptionalCharacteristic(Characteristic.StatusTampered);
    this.addOptionalCharacteristic(Characteristic.Name);
  };
  CustomCharacteristic.RadonLevelSensor.UUID = 'B42E1C08-ADE7-11E4-89D3-123B93F75CBA';
  inherits(CustomCharacteristic.RadonLevelSensor, Service);

  // courtesy of https://github.com/robi-van-kinobi/homebridge-cubesensors
  CustomCharacteristic.PressureSensor = function(displayName, subtype) {
    Service.call(this, displayName, CustomCharacteristic.PressureSensor.UUID, subtype);

    // Required Characteristics
    this.addCharacteristic(CustomCharacteristic.Pressure);
    this.addCharacteristic(CustomCharacteristic.VOCLevel);
    // Optional Characteristics
    this.addOptionalCharacteristic(Characteristic.StatusActive);
    this.addOptionalCharacteristic(Characteristic.StatusFault);
    this.addOptionalCharacteristic(Characteristic.StatusLowBattery);
    this.addOptionalCharacteristic(Characteristic.StatusTampered);
    this.addOptionalCharacteristic(Characteristic.Name);
  };
  CustomCharacteristic.PressureSensor.UUID = '873AE82A-4C5A-4342-B539-9D900BF7EBD0';
  inherits(CustomCharacteristic.PressureSensor, Service);



/*
  CustomCharacteristic.ValvePosition = function() {
    Characteristic.call(this, 'Valve position', 'B42E01AA-ADE7-11E4-89D3-123B93F75CBA');
    this.setProps({
      format: Characteristic.Formats.UINT8,
      unit: Characteristic.Units.PERCENTAGE,
      perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
    });
    this.value = this.getDefaultValue();
  };
  inherits(CustomCharacteristic.ValvePosition, Characteristic);

  CustomCharacteristic.ProgramCommand = function() {
    Characteristic.call(this, 'Program command', 'B42E01AA-ADE7-11E4-89D3-123B93F75CBA');
    this.setProps({
      format: Characteristic.Formats.DATA,
      perms: [Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
    });
    this.value = this.getDefaultValue();
  };
  inherits(CustomCharacteristic.ProgramCommand, Characteristic);

  CustomCharacteristic.ProgramData = function() {
    Characteristic.call(this, 'Program data', 'B42E01AA-ADE7-11E4-89D3-123B93F75CBA');
    this.setProps({
      format: Characteristic.Formats.DATA,
      perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
    });
    this.value = this.getDefaultValue();
  };
  inherits(CustomCharacteristic.ProgramData, Characteristic);
*/

  return CustomCharacteristic;
};
