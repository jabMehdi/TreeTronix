const express = require('express');
const router =express.Router();
var jwt = require('jsonwebtoken');
const Sensor = require('../models/Sensor');
const {spawn} = require('child_process');

function verifyToken(req, res, next) {
    let payload;
    if (req.query.token === 'null') {
        return res.status(401).send('Unauthorized request')
    }
    try {
        payload = jwt.verify(req.query.token, 'tawfik');
    } catch (e) {
        return res.status(400).send('Invalid User');
    }
    if (!payload) {
        return res.status(401).send('Unauthorized request');
    }

    decoded = jwt.decode(req.query.token, {complete: true});
    req.id = decoded.payload.id;

    next()
}

 function LitleToBigEndian(data){
   
    let i=data.length-1;
    let j=0

    var resl=''
    while (i>0){


       resl+=data[i-1]

        resl+=data[i]
 
        i=i-2;
  

  
    }
    
  
    console.log("result: "+resl)
    return(resl)
    
}
router.post('/SensorOff', /*verifyToken, */async (req, res) => {

console.log ("test test ")
    try {
        var arg1="0000";
        var arg2="1111";
        var largeDataSet = [];
        console.log('Donwlink : Sensor Off')
        var dataToSend;
        device = await Sensor.findOne({ code: req.body.code });
         console.log(device)
       console.log("adress: "+device.Countersdata[device.Countersdata.length-1].Adress)
       console.log ("test test2 ")
        // spawn new child process to call the python script
        if (device.type=="mono"){
            adress=LitleToBigEndian(device.Countersdata[device.Countersdata.length-1].Adress)
console.log ("test test 3")
        }else if (device.type=="triphase"){
            adress=LitleToBigEndian(device.ConsomationTripahse[device.ConsomationTripahse.length-1].Adress)
        }
       
        console.log('adressss: '+adress)
        const python = spawn('python3', ['python/downlink.py',req.body.code,req.body.event, adress]);
        // collect data from script
        python.stdout.on('data', function (data) {
         console.log('Pipe data from python script ...');
         largeDataSet.push(data)
         dataToSend = data.toString();
      
        });
        // in close event we are sure that stream from child process is closed
        python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
        console.log("dataToSend: " +dataToSend)
        res.json(largeDataSet.join(""));
        });

    } catch (err) {
        res.json({ message: err.message });

    }

});


module.exports = router;
