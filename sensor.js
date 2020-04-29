'use strict';

const airthings_humidity = 0;
const airthings_temperature = 1;
const airthings_radon_st = 2;
const airthings_radon_lt = 3;

let Service, Characteristic;
var CustomCharacteristic;

module.exports = (homebridge) => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  CustomCharacteristic = require('./lib/CustomCharacteristic.js')(homebridge);
  
  homebridge.registerAccessory('homebridge-airthings-wave', 'Airthings', AirthingsPlugin);
};

class AirthingsPlugin {
  constructor(log, config) {
    this.log = log;
    this.name = config.name;
    this.name_temperature = config.name_temperature || this.name;
    this.name_humidity = config.name_humidity || this.name;
    this.refresh = config['refresh'] || 3600; // Update every hour
    this.address = config.address;
    this.path = config.path || "/home/pi/quary_wave.py";

    this.devicePolling.bind(this);
    this.informationService = new Service.AccessoryInformation();
    this.informationService
      .setCharacteristic(Characteristic.Manufacturer, "Airthings")
      .setCharacteristic(Characteristic.Model, "Airthings Wave")
      .setCharacteristic(Characteristic.SerialNumber, this.address)
      .setCharacteristic(Characteristic.FirmwareRevision, require('./package.json').version);

    this.humidityService = new Service.HumiditySensor(this.name_humidity);
    this.temperatureService = new Service.TemperatureSensor(this.name_temperature);
    this.temperatureService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .setProps({
        minValue: -100,
        maxValue: 100
      });

    this.temperatureService
      .addCharacteristic(CustomCharacteristic.RadonLevelShortTermAverage);
    this.temperatureService
      .addCharacteristic(CustomCharacteristic.RadonLevelLongTermAverage);

    setInterval(this.devicePolling.bind(this), this.refresh * 1000);
    //this.temperatureService.log = this.log;
  }

  devicePolling() {
    var strvalues
    var valuest
    var spawn = require("child_process").spawn;
    var pythonProcess = spawn('python',[this.path, this.address]);
    pythonProcess.stdout.on('data', (data) => {
      strvalues = data.toString('utf8');
      valuest = strvalues.split(' ');

      this.log('Humidity: ',roundInt(valuest[airthings_humidity]));
      this.log('Temperature: ',roundInt(valuest[airthings_temperature]));
      this.log('Radon short term: ',roundInt(valuest[airthings_radon_st]));
      this.log('Radon long term: ',roundInt(valuest[airthings_radon_lt]));

      this.humidityService
        .setCharacteristic(Characteristic.CurrentRelativeHumidity, roundInt(valuest[airthings_humidity]));
      this.temperatureService
        .setCharacteristic(Characteristic.CurrentTemperature, roundInt(valuest[airthings_temperature]));
      this.temperatureService
        .setCharacteristic(CustomCharacteristic.RadonLevelShortTermAverage, roundInt(valuest[airthings_radon_st]));
      this.temperatureService
        .setCharacteristic(CustomCharacteristic.RadonLevelLongTermAverage, roundInt(valuest[airthings_radon_lt]));
    });
  }

  getServices() {
    return [this.informationService, this.temperatureService, this.humidityService]
  }
}

function roundInt(string) {
  return Math.round(parseFloat(string) * 10) / 10;
}
