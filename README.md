
 run `npm install`
    run `npm start` // 
	
	 api add  device  url méthode psot  : http://localhost:3007/api/sensors/sensor
	  
	 
	 Body -> raw ->	 json
	
	{
    "code": "004A77012404D36E",
    "type": "triphase"
    }
	
	{
    "code": "004A77012404D323",
    "type": "mono"
    }

    {
    "code": "9999999999999999",
    "type": "Sensor"
    }

    {
    "code": "CCCCCCCCCCCCCCCC",
    "type": "Sensor"
    }

    {
    "code": "004A77012404D3A5",
    "type": "WaterMeter"
    }

    {
    "code": "004A77012404D2B7",
    "type": " GasMeter"
    }

    {
    "code": "5555555555555555",
    "type": "smoke"
    }

node default port  is 3007 to change  go app.js and change port 

kafka defaut port 9092

in lunix you must instal python3 and go to  C:\Users\BASSEM\Desktop\Projet\Usina\BackEnd\routes\SensorRoute.js and change python to python 3

and go  Downlink.js and change    const python = spawn('python', ['python/downlink.py',req.body.code,req.body.event, adress]); to

   const python = spawn('python3', ['python/downlink.py',req.body.code,req.body.event, adress]);

For downlikn you must change time : GMT +? : C:\Users\BASSEM\Desktop\Projet\Usina\BackEnd\python

# TreeTronix
