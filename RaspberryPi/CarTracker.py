import paho.mqtt.client as mqtt
import serial
import obd
from gps import *
import time
import json
from gpiozero import LEDBoard
from time import sleep

obdLed = LEDBoard(26)
gpsLed = LEDBoard(13)
port = '/dev/serial0'

#setup serial for GPS
gpsSer = serial.Serial(port, baudrate = 9600, timeout = 2.5)

def parseGPS(data):
	#print ("raw:", data) #prints raw data
	if data[0:6] == "$GPRMC":
		sdata = data.split(",")
		if sdata[2] == 'V':
			#print('no satellite data available')
			return
		#print("---Parsing GPRMC---"),
		time = sdata[1][0:2] + ":" + sdata[1][2:4] + ":" + sdata[1][4:6]
		lat = decode(sdata[3]) #latitude
		dirLat = sdata[4]      #latitude direction N/S
		lon = decode(sdata[5]) #longitute
		dirLon = sdata[6]      #longitude direction E/W
		speed = sdata[7]       #Speed in knots
		trCourse = sdata[8]    #True course
		date = sdata[9][0:2] + "/" + sdata[9][2:4] + "/" + sdata[9][4:6]#date
		#print("time : %s, latitude : %s(%s), longitude : %s(%s), speed : %s, True Course : %s, Date : %s") %  (time,lat,dirLat,lon,dirLon,speed,trCourse,date)
		#print ("latitude: ", lat, "'", dirLat)
		#print ("Longitude: ", lon, "'", dirLon)
		cords = lat + "'" + dirLat + ", " + lon + "'" + dirLon
		return cords

def GetGPS():
	gpsSer.flushInput()
	data = gpsSer.readline()
	gps = parseGPS(data.decode("utf-8"))
	return gps

def decode(coord):
    #Converts DDDMM.MMMMM > DD deg MM.MMMMM min
    x = coord.split(".")
    head = x[0]
    tail = x[1]
    deg = head[0:-2]
    min = head[-2:]
    return deg + " " + min + "." + tail

def GetRPM():
	command ="01 0C \r"
	carSer.write(command.encode())
	rpm_hex=carSer.readline().decode().replace('\r', '').split(' ')
	rpm=((int('0x'+rpm_hex[4], 0)*256)+int('0x'+rpm_hex[5],0)) /4
	return rpm

def GetSpeed():
	command ="01 0D \r"
	carSer.write(command.encode())
	speed_hex = carSer.readline().decode().split(' ')
	speed = float(int('0x'+speed_hex[4], 0 ))
	return speed

def GetThrottlePosition():
	command = "01 11 \r"
	carSer.write(command.encode())
	throttle_position_hex = carSer.readline().decode().replace('\r', '').split(' ')
	throttle_position = ((int('0x'+throttle_position_hex[4], 0 ))*100/255)
	return throttle_position

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))


connectedToOBD = False
odbPorts = obd.scan_serial()       # return list of valid USB or RF ports
if len(odbPorts) > 0:
	carSer = serial.Serial(odbPorts[0], 38400, timeout=2.5)
	connectedToOBD = True
	obdLed.on()
else:
	obdLed.off()
	print ("Could not connect to OBD")


broker_address= "farmer.cloudmqtt.com"
port = 13596
user = "atunlaym"
password = "wXL5lxfHLKkK"

client = mqtt.Client()
client.username_pw_set(user, password=password)
client.on_connect = on_connect

client.connect(broker_address, port=port)

licnese_plate = "BL86205"

data ={}
data['plate'] = licnese_plate
data['time'] = int(time.time())
json_data = json.dumps(data)
#client.publish("car", json_data)
print (json_data)
while True:
	data = {}
	gps = GetGPS()
	if gps is None:
		gpsLed.off()
		print ("Could not get GPS")
		data['gps'] = "GPS Not available"
	else:
		gpsLed.on()
		data['gps'] = gps
	if(connectedToOBD):
		speed = GetSpeed()
		rpm = GetRPM()
		throttle_position = GetThrottlePosition()
		data['speed'] = speed
		data['rpm'] = rpm
		data['throttle_position'] = throttle_position
	else:
		time.sleep(3)
	data['plate'] = licnese_plate
	data['time'] = int(time.time())	
	json_data = json.dumps(data)
	#client.publish("car", json_data)
	print (json_data)
	#time.sleep(5)
