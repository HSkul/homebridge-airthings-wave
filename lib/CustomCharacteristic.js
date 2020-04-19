var inherits = require('util').inherits;
var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  var CustomCharacteristic = {};



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


  // courtesy of https://github.com/robi-van-kinobi/homebridge-cubesensors
  CustomCharacteristic.AtmosphericPressureSensor = function(displayName, subtype) {
    Service.call(this, displayName, CustomCharacteristic.RadonLevelShortTermAverage.UUID, subtype);

    // Required Characteristics
    this.addCharacteristic(CustomCharacteristic.RadonLevelShortTermAverage);

    // Optional Characteristics
    this.addOptionalCharacteristic(Characteristic.StatusActive);
    this.addOptionalCharacteristic(Characteristic.StatusFault);
    this.addOptionalCharacteristic(Characteristic.StatusLowBattery);
    this.addOptionalCharacteristic(Characteristic.StatusTampered);
    this.addOptionalCharacteristic(Characteristic.Name);
  };
  CustomCharacteristic.RadonLevelSTSensor.UUID = 'B42E01AA-ADE7-11E4-89D6-123B93F75CBA';
  inherits(CustomCharacteristic.RadonLevelSTSensor, Service);
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
