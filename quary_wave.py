
# Usage: quary_wave.py BTaddress
# Output Humidity Temperature Radon_shortterm Radon_shortterm
# ===============================
# Module import dependencies
# ===============================

from bluepy.btle import UUID, Peripheral, Scanner, DefaultDelegate
import sys
from datetime import datetime
import time
import struct

# ====================================
# No script guards for correct usage
# ====================================
# See www.airthings.com for other Python scripts

BTAddress = sys.argv[1]

# ===================================
# Sensor index definitions
# ===================================
# We are not using the date/time from the python script

SENSOR_IDX_DATETIME      = 0
SENSOR_IDX_HUMIDITY      = 1
SENSOR_IDX_TEMPERATURE   = 2
SENSOR_IDX_RADON_ST_AVG  = 3
SENSOR_IDX_RADON_LT_AVG  = 4

# ===============================
# Class WavePlus
# ===============================

class Wave():
    UUID_DATETIME     = UUID(0x2A08)
    UUID_HUMIDITY     = UUID(0x2A6F)
    UUID_TEMPERATURE  = UUID(0x2A6E)
    UUID_RADON_ST_AVG = UUID("b42e01aa-ade7-11e4-89d3-123b93f75cba")
    UUID_RADON_LT_AVG = UUID("b42e0a4c-ade7-11e4-89d3-123b93f75cba")

    def __init__(self, SerialNumber):
        self.periph            = None
        self.datetime_char     = None
        self.humidity_char     = None
        self.temperature_char  = None
        self.radon_st_avg_char = None
        self.radon_lt_avg_char = None

    def connect(self):
        scanner     = Scanner().withDelegate(DefaultDelegate())
        # This Scanner must be an external function that scans the Bluetooth for a device
        self.periph = Peripheral(BTAddress)
        self.datetime_char     = self.periph.getCharacteristics(uuid=self.UUID_DATETIME)[0]
        self.humidity_char     = self.periph.getCharacteristics(uuid=self.UUID_HUMIDITY)[0]
        self.temperature_char  = self.periph.getCharacteristics(uuid=self.UUID_TEMPERATURE)[0]
        self.radon_st_avg_char = self.periph.getCharacteristics(uuid=self.UUID_RADON_ST_AVG)[0]
        self.radon_lt_avg_char = self.periph.getCharacteristics(uuid=self.UUID_RADON_LT_AVG)[0]
        
   def read(self, sensor_idx):
        if (sensor_idx==SENSOR_IDX_DATETIME and self.datetime_char!=None):
                rawdata = self.datetime_char.read()
                rawdata = struct.unpack('HBBBBB', rawdata)
                data    = datetime(rawdata[0], rawdata[1], rawdata[2], rawdata[3], rawdata[4], rawdata[5])
                unit    = " "
        elif (sensor_idx==SENSOR_IDX_HUMIDITY and self.humidity_char!=None):
                rawdata = self.humidity_char.read()
                data    = struct.unpack('H', rawdata)[0] * 1.0/100.0
                unit    = " %rH"
        elif (sensor_idx==SENSOR_IDX_TEMPERATURE and self.temperature_char!=None):
                rawdata = self.temperature_char.read()
                data    = struct.unpack('h', rawdata)[0] * 1.0/100.0
                unit    = " degC"
        elif (sensor_idx==SENSOR_IDX_RADON_ST_AVG and self.radon_st_avg_char!=None):
                rawdata = self.radon_st_avg_char.read()
                data    = struct.unpack('H', rawdata)[0] * 1.0
                unit    = " Bq/m3"
        elif (sensor_idx==SENSOR_IDX_RADON_LT_AVG and self.radon_lt_avg_char!=None):
                rawdata = self.radon_lt_avg_char.read()
                data    = struct.unpack('H', rawdata)[0] * 1.0
                unit    = " Bq/m3"
        else:
            print "ERROR: Incorrect Wave BTaddress or device out of range"
            sys.exit(1)
        return str(data)

    def disconnect(self):
        if self.periph is not None:
            self.periph.disconnect()
            self.periph            = None
            self.datetime_char     = None
            self.humidity_char     = None
            self.temperature_char  = None
            self.radon_st_avg_char = None
            self.radon_lt_avg_char = None

try:
    #---- Connect to device ----#
    wave = Wave(BTAddress)
    wave.connect()

    humidity     = wave.read(SENSOR_IDX_HUMIDITY)
    temperature  = wave.read(SENSOR_IDX_TEMPERATURE)
    radon_st_avg = wave.read(SENSOR_IDX_RADON_ST_AVG)
    radon_lt_avg = wave.read(SENSOR_IDX_RADON_LT_AVG)

    print humidity, temperature, radon_st_avg, radon_lt_avg, "done"
    sys.stdout.flush()
#    print data
     #   time.sleep(SamplePeriod)

finally:
    wave.disconnect()


