# homebridge-airthings-wave

[Homebridge](https://github.com/nfarina/homebridge) plugin for both Wave (first generation) and Wave Plus 
radon sensors from [Airthings](https://www.airthings.com/)  Requires bluetooth capable Raspberry Pi that
communicates directly with the the Wave/Wave Plus without the need of a hub.  Reads the following values:
* Temperature
* Humidity
* Radon short-term average
* Radon long-term average
* Atmospheric pressure (Wave Plus only)
* Carbon dioxide level (Wave Plus only)
* Volatile organic compounds level (Wave Plus only)
  
Note that radon, pressure and VOC can only be viewed using the Eve app (and others) but not in the Home app.
However, these values can be accessed using Automation shortcuts in the Home app so they can be automatically
logged to a database if needed (they all show up as 'Custom' variable).

![image](https://github.com/HSkul/homebridge-airthings-wave/assets/32560714/f662b831-d686-4594-afa8-d3030caad789)

# Build Instructions

Make sure you are using a bluetooth capable Raspberry Pi and that it is located within range of the Airthings Wave 
/ Wave Plus.

## Installation
1.	Install Homebridge using `npm install -g homebridge`
2.	Install this plugin ` npm install -g --unsafe-perm https://github.com/HSkul/homebridge-airthings-wave`
3.  Download wave_read.py and/or waveplus_read.py Python scripts and place them in /home/pi or another location of your choice (indicated in config.json).
4.  Download find_wave.py Python script and place it in /home/pi (or other location of your choice)
5.	Update your configuration file - see below for an example

Use 'python find_wave.py SN' to find the bluetooth address of your Airthings Wave radon sensor, where SN is the serial number of your radon sensor (found on the back of it).  If you have multiple Wave/Wave Plus sensors it will actually list bluetooth addresses of them all even if you just run it with one of serial numbers.  Note that you may need to turn bluetooth off on your phone so the Waves are broadcasting (and this is the reason why I have the python scripts take the bluetooth address and not the serial number as I want my phone to still talk to the Wave/Wave Plus).

6. Setup config.json according to below. 

## Configuration
* `accessory`: "Airthings"
* `name`: descriptive name
* `waveplus`: true / false : false is for Wave generation 1 
* `name_temperature` (optional): descriptive name for the temperature sensor
* `name_humidity` (optional): descriptive name for the humidity sensor
* `address`: bluetooth address of Wave/Wave Plus obtained from find_wave.py
* `refresh`: Optional, time interval for refreshing data in seconds, defaults to 1h
* `path` ( optional ): Full path and name of the python script.  Defaults to '/home/pi/wave_read.pi'.  Use waveplus_read.py if you have a Wave Plus

Example configuration:

```json
    "accessories": [
    {
        "accessory": "Airthings",
        "name": "MyWave",
        "waveplus": false,
        "name_temperature": "Temperature",
        "name_humidity": "Humidity",
        "refresh": 3600,
        "address": "AA:BB:BB:CC:DD:EE",
        "path": "/home/pi/wave_read.py"
    },
    {
        "accessory": "Airthings",
        "name": "MyWavePlus",
        "waveplus": true,
        "name_temperature": "Temperature",
        "name_humidity": "Humidity",
        "name_CO2": "Carbon Dioxide",
        "refresh": 900,
        "address": "AA:BB:BB:CC:DD:EE",
        "path": "/home/pi/waveplus_read.py"
    }
]
```

## See also

* [homebridge-bme280](https://www.npmjs.com/package/homebridge-bme280)
* [homebridge-dht-sensor](https://www.npmjs.com/package/homebridge-dht-sensor)
* [Airthings Wave](https://www.airthings.com)

## Credits
* NorthernMan54/rxseger - Barometric Pressure and Device Polling Plugin this based on

## License

MIT
