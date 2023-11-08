# Python script from Airthings
# Usage: python waveplus_read.py BTAddress
# Output Humidity Temperature Radon_shortterm Radon_longterm, Pressure, CO2, VOC

# ===============================
# Module import dependencies
# ===============================

from bluepy.btle import UUID, Peripheral, Scanner, DefaultDelegate
import sys
import time
import struct

BTAddress = sys.argv[1]

# ===============================
# Class WavePlus
# ===============================

class WavePlus():
    def __init__(self, BTAddress):
        self.periph        = None
        self.curr_val_char = None
        self.MacAddr       = BTAddress
        self.SN            = None
        self.uuid          = UUID("b42e2a68-ade7-11e4-89d3-123b93f75cba")

    def connect(self):
        # Connect to device
        if (self.periph is None):
            self.periph = Peripheral(self.MacAddr)
        if (self.curr_val_char is None):
            self.curr_val_char = self.periph.getCharacteristics(uuid=self.uuid)[0]

    def read(self):
        if (self.curr_val_char is None):
            print ("ERROR: Devices are not connected.")
            sys.exit(1)
        rawdata = self.curr_val_char.read()
        rawdata = struct.unpack('<BBBBHHHHHHHH', rawdata)
        sensors = Sensors()
        sensors.set(rawdata)
        return sensors

    def disconnect(self):
        if self.periph is not None:
            self.periph.disconnect()
            self.periph = None
            self.curr_val_char = None

# ===================================
# Class Sensor and sensor definitions
# ===================================

NUMBER_OF_SENSORS               = 7
SENSOR_IDX_HUMIDITY             = 0
SENSOR_IDX_RADON_SHORT_TERM_AVG = 1
SENSOR_IDX_RADON_LONG_TERM_AVG  = 2
SENSOR_IDX_TEMPERATURE          = 3
SENSOR_IDX_REL_ATM_PRESSURE     = 4
SENSOR_IDX_CO2_LVL              = 5
SENSOR_IDX_VOC_LVL              = 6

class Sensors():
    def __init__(self):
        self.sensor_version = None
        self.sensor_data    = [None]*NUMBER_OF_SENSORS
        self.sensor_units   = ["%rH", "Bq/m3", "Bq/m3", "degC", "hPa", "ppm", "ppb"]

    def set(self, rawData):
        self.sensor_version = rawData[0]
        if (self.sensor_version == 1):
            self.sensor_data[SENSOR_IDX_HUMIDITY]             = rawData[1]/2.0
            self.sensor_data[SENSOR_IDX_RADON_SHORT_TERM_AVG] = self.conv2radon(rawData[4])
            self.sensor_data[SENSOR_IDX_RADON_LONG_TERM_AVG]  = self.conv2radon(rawData[5])
            self.sensor_data[SENSOR_IDX_TEMPERATURE]          = rawData[6]/100.0
            self.sensor_data[SENSOR_IDX_REL_ATM_PRESSURE]     = rawData[7]/50.0
            self.sensor_data[SENSOR_IDX_CO2_LVL]              = rawData[8]*1.0
            self.sensor_data[SENSOR_IDX_VOC_LVL]              = rawData[9]*1.0
        else:
            print ("ERROR: Unknown sensor version.\n")
            print ("GUIDE: Contact Airthings for support.\n")
            sys.exit(1)

    def conv2radon(self, radon_raw):
        radon = "N/A" # Either invalid measurement, or not available
        if 0 <= radon_raw <= 16383:
            radon  = radon_raw
        return radon

    def getValue(self, sensor_index):
        return self.sensor_data[sensor_index]

    def getUnit(self, sensor_index):
        return self.sensor_units[sensor_index]

try:
    #---- Initialize ----#
    waveplus = WavePlus(BTAddress)
    waveplus.connect()

    # read values
    sensors = waveplus.read()

    # extract

    humidity     = str(sensors.getValue(SENSOR_IDX_HUMIDITY))
    radon_st_avg = str(sensors.getValue(SENSOR_IDX_RADON_SHORT_TERM_AVG))
    radon_lt_avg = str(sensors.getValue(SENSOR_IDX_RADON_LONG_TERM_AVG))
    temperature  = str(sensors.getValue(SENSOR_IDX_TEMPERATURE))
    pressure     = str(sensors.getValue(SENSOR_IDX_REL_ATM_PRESSURE))
    CO2_lvl      = str(sensors.getValue(SENSOR_IDX_CO2_LVL))
    VOC_lvl      = str(sensors.getValue(SENSOR_IDX_VOC_LVL))

    # Print data
    print (humidity, temperature, radon_st_avg, radon_lt_avg, pressure, CO2_lvl, VOC_lvl, "done")
    sys.stdout.flush()
    waveplus.disconnect()



finally:
    waveplus.disconnect()
