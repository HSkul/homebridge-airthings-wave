# homebridge-airthings-wave

[Airthings Wave](https://www.airthings.com/)
temperature/humidity/radon sensor service plugin for [Homebridge](https://github.com/nfarina/homebridge).

* Display of temperature, humidity and radon (short- and long-term average) from Airthings Wave via Raspberry Pi
* Only temperature and humidity can be viewed in the Home app, radon levels can be viewed using Eve app (and others)

# Build Instructions

Make sure you are using a bluetooth capable Raspberry Pi and that it is located within range of the Airthings Wave.

## Installation
1.	Install Homebridge using `npm install -g homebridge`
2.	Install this plugin ` npm install -g --unsafe-perm https://github.com/HSkul/homebridge-airthings-wave`
3.  Download quary_wave.py Python script and place it in /home/pi or another location of your choice (indicated in config.json).  Make sure the user running homebridge has permission to execute it
4.  Download find_wave.py Python script from [here](https://airthings.com/tech/find_wave.py)
3.	Update your configuration file - see below for an example

Use 'python find_wave.py SN' to find the bluetooth address of your Airthings Wave radon sensor, where SN is the serial number of your radon sensor (found on the back of it).  Setup config.json according to below. 

## Configuration
* `accessory`: "Airthings"
* `name`: descriptive name
* `name_temperature` (optional): descriptive name for the temperature sensor
* `name_humidity` (optional): descriptive name for the humidity sensor
* `address`: bluetooth address of Wave obtained from find_wave.py
* `refresh`: Optional, time interval for refreshing data in seconds, defaults to 1h
* `path` ( optional ): Full path and name of the python script.  Defaults to '/home/pi/quary_wave.pi'

Example configuration:

```json
    "accessories": [
        {
            "accessory": "Airthings",
            "name": "Sensor",
            "name_temperature": "Temperature",
            "name_humidity": "Humidity",
            "address": "AA:BB:CC:DD:11:22",
            "refresh": 900,
            "path": "/var/lib/homebridge/quary_wave.py"
        }
    ]
```

This plugin creates two services: TemperatureSensor and HumiditySensor.

## See also

* [homebridge-bme280](https://www.npmjs.com/package/homebridge-bme280)
* [homebridge-dht-sensor](https://www.npmjs.com/package/homebridge-dht-sensor)
* [Airthings Wave](https://www.airthings.com)

## Credits
* NorthernMan54/rxseger - Barometric Pressure and Device Polling Plugin this based on

## License

MIT
