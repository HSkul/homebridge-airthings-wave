'use strict';

var debug = require('debug');
var logger = require("mcuiot-logger").logger;
const moment = require('moment');

const airthings_humidity = 0;
const airthings_temperature = 1;
const airthings_radon_st = 2;
const airthings_radon_lt = 3;

var os = require("os");
var hostname = os.hostname();

let Service, Characteristic;
var CustomCharacteristic;
var FakeGatoHistoryService;

module.exports = (homebridge) => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  CustomCharacteristic = require('./lib/CustomCharacteristic.js')(homebridge);
  FakeGatoHistoryService = require('fakegato-history')(homebridge);

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

    this.options = config.options || {};
    this.spreadsheetId = config['spreadsheetId'];
    if (this.spreadsheetId) {
      this.log_event_counter = 2;
      this.logger = new logger(this.spreadsheetId);
    }

    this.devicePolling.bind(this);
    this.informationService = new Service.AccessoryInformation();
    this.informationService
      .setCharacteristic(Characteristic.Manufacturer, "Airthings")
      .setCharacteristic(Characteristic.Model, "Airthings Wave")
      .setCharacteristic(Characteristic.SerialNumber, "123-456-789")
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

    this.temperatureService.log = this.log;
    this.loggingService = new FakeGatoHistoryService("radon", this.temperatureService);
  }

  devicePolling() {
    var strvalues
    var valuest
    var spawn = require("child_process").spawn;
    var pythonProcess = spawn('python',['/home/pi/quary_wave.py', this.address]);
    pythonProcess.stdout.on('data', (data) => {
      strvalues = data.toString('utf8');
      valuest = strvalues.split(' ');

      this.log('Humidity value ',roundInt(valuest[airthings_humidity]));
      this.log('Temperature value ',roundInt(valuest[airthings_temperature]));
      this.log('Radon short term value ',roundInt(valuest[airthings_radon_st]));
      this.log('Radon long term value ',roundInt(valuest[airthings_radon_lt]));

      this.loggingService.addEntry({
        time: moment().unix(),
        temp: roundInt(valuest[airthings_temperature]),
        humidity: roundInt(valuest[airthings_humidity]),
        radon_st: roundInt(valuest[airthings_radon_st]),
        radon_lt: roundInt(valuest[airthings_radon_lt])
      });

      if (this.spreadsheetId) {
        this.log_event_counter = this.log_event_counter + 1;
        if (this.log_event_counter > 2) {
          this.logger.storeBME(this.name, 0, roundInt(valuest[airthings_temperature]), roundInt(valuest[airthings_humidity]), roundInt(valuest[airthings_radon_st]), roundInt(valuest[airthings_radon_lt]));
          this.log_event_counter = 0;
        }
      }
      
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
    return [this.informationService, this.temperatureService, this.humidityService, this.loggingService]
  }
}

function roundInt(string) {
  return Math.round(parseFloat(string) * 10) / 10;
}
