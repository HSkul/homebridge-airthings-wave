# homebridge-airthings-wave

[Airthings Wave](https://www.airthings.com/)
temperature/humidity/radon sensor service plugin for [Homebridge](https://github.com/nfarina/homebridge).

* Display of temperature, humidity and radon (short- and long-term average) from Airthings Wave via Raspberry Pi
* Only temperature and humidity can be viewed in the Home app, radon levels can be viewed using Eve app (and others)
* Archives results every 3 hours to a google spreadsheet
* Support the graphing feature of the Eve app for trends

# Build Instructions

Make sure the Raspberry Pi is bluetooth capable and that it is located within bluetooth range of the Airthings Wave.

## Installation
1.	Install Homebridge using `npm install -g homebridge`
2.	Install this plugin ` npm install -g --unsafe-perm https://github.com/HSkul/homebridge-airthings-wave`
3.  Download quary_wave.py Python script
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
* `spreadsheetId` ( optional ): Log data to a google sheet, this is part of the URL of your spreadsheet.  ie the spreadsheet ID in the URL https://docs.google.com/spreadsheets/d/abc1234567/edit#gid=0 is "abc1234567".

Example configuration:

```json
    "accessories": [
        {
            "accessory": "Airthings",
            "name": "Sensor",
            "name_temperature": "Temperature",
            "name_humidity": "Humidity",
            "address": "AA:BB:CC:DD:11:22",
            "spreadsheetId": "abc1234567"
            }
        }
    ]
```

This plugin creates two services: TemperatureSensor and HumiditySensor.

## Optional - Enable access to Google Sheets to log data

This presumes you already have a google account, and have access to google drive/sheets already

Step 1: Turn on the Drive API
a. Use this wizard ( https://console.developers.google.com/start/api?id=sheets.googleapis.com )
to create or select a project in the Google Developers Console and automatically turn on the API. Click Continue, then Go to credentials.

b. On the Add credentials to your project page, click the Cancel button.

c. At the top of the page, select the OAuth consent screen tab. Select an Email address, enter a Product name if not already set, and click the Save button.  I used 'Sheets Data Logger'

d. Select the Credentials tab, click the Create credentials button and select OAuth client ID.

e. Select the application type Other, enter the name "Drive API Quickstart", and click the Create button.

f. Click OK to dismiss the resulting dialog.

g. Click the file_download (Download JSON) button to the right of the client ID.

h. Move this file to your .homebridge and rename it logger_client_secret.json.

Step 2: Authorize your computer to access your Drive Account

a. Change to the directory where the plugin is installed i.e.

cd /usr/lib/node_modules/homebridge-mcuiot/node_modules/mcuiot-logger

b. Run the authorization module

node quickstart.js

c. Browse to the provided URL in your web browser.

If you are not already logged into your Google account, you will be prompted to log in. If you are logged into multiple Google accounts, you will be asked to select one account to use for the authorization.

d. Click the Accept button.

e. Copy the code you're given, paste it into the command-line prompt, and press Enter.

## See also

* [homebridge-bme280](https://www.npmjs.com/package/homebridge-bme280)
* [homebridge-dht-sensor](https://www.npmjs.com/package/homebridge-dht-sensor)
* [Airthings Wave](https://www.airthings.com)

## Credits
* NorthernMan54/rxseger - Barometric Pressure and Device Polling
* simont77 - History Service

## License

MIT
