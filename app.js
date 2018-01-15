var request = require('request');
var osc = require('node-osc');
var express = require('express');
var app = express();

// FIRST WE HAVE TO SETUP EXPRESS
app.use(express.static(__dirname + '/public')); // SET PUBLIC FOLDER CONTENT REACHABLE FOR CLIENT

var server = require('http').createServer(app);  
var io = require('socket.io')(server);

var hueIp = "10.13.19.1";

var url = 'http://' + hueIp + '/api/29F7GK0rrxT2uyQr7Oe6B-kQLyHjknb-XZPMtmCs/lights/1/state';

var data = {on: false};

var isGoodData = [ 0,0,0,0 ];
var eegData = [ 0,0,0,0 ];

var step = 0;

var _on = false;

var concentrationValue = 0;

var concentrationThreshold = 50;

var attention = 0;


var options = {
    uri: url,
    headers: {
        'Content-Type': 'application/json'
       
    },
	 body: JSON.stringify(data) 
}


var oscServer = new osc.Server(7000, '127.0.0.1');
oscServer.on("message", function (msg, rinfo) {
      //console.log("TUIO message:");
   
if(msg[0] == 'Person0/elements/is_good'){
	
	
	//console.log(msg[0]);
	isGoodData = [ msg[1] , msg[2] , msg[3] , msg[4] ];
	
}

if(msg[0] == 'Person0/eeg'){
	
	
	//console.log(msg);
	eegData = [ msg[1] , msg[2] , msg[3] , msg[4] ];
	
	
}



});



// 

	
		app.get('/start',function(req, res ) { 

			res.render('start.ejs',{ value: "" } );

		});
	
		
		app.get('/instructions',function(req, res ) { 

			res.render('instructions.ejs',{ value: "" } );

		});
	
	
	app.get('/checkAttention',function(req, res ) { 

			step = 1;

			res.render('checkAttention.ejs',{ value: "" } );

	});
	
	app.get('/playEegMusic',function(req, res ) { 

			step = 2;

			res.render('playEegMusic.ejs',{ value: "" } );

	});
	
	app.get('/credits',function(req, res ) { 

			step = 3;

			res.render('credits.ejs',{ value: "" } );

	});
	
	app.get('/restart',function(req, res ) { 

			step = 0;
			concentrationValue = 0;

			res.redirect('start');

	});




	io.on('connection', function(client) {  
				console.log('Client connected...');

				client.on('join', function(data) {
					
					//console.log(data);
				
					var _isGoodData = isGoodData;
					_isGoodData.push(concentrationValue);
				
				
					if(step == 1)client.emit('isgood', _isGoodData);
					if(step == 2)client.emit('eeg', eegData);
				
					
				});

			});


function mainLoop(arg){
	

	
	// MEASURING FOCUS LEVEL
	if(step == 1){
		
		attention = 0;
		concentrationValue = 0;
		
		attention += isGoodData[0];
		attention += isGoodData[1];
		attention += isGoodData[2];
		attention += isGoodData[3];
		
		console.log("ATTENTION " + attention);
		
		
		if(attention == 0){
			
			concentrationValue = -3;
			// RED LIGHT
			
			var json = {on:false};
			controlLight(json);
		}
		
		if(attention == 1){
			
			concentrationValue = 0;
			var json = 	{"on":true, "sat":0, "bri":50,"hue": 0 };
			controlLight(json);
			
			// BLUE LIGHT
		}
		
		if(attention == 2){
			
			var json = 	{"on":true, "sat":0, "bri":100,"hue": 0 };
			controlLight(json);
		
			concentrationValue += attention*2;
			// GREEN LIGHT
		}
		
		if(attention == 3){
			
			var json = 	{"on":true, "sat":0, "bri":200,"hue": 0 };
			controlLight(json);
		
			concentrationValue += attention*2;
			// GREEN LIGHT
		}
		
		if(attention == 4){
			
			var json = 	{"on":true, "sat":0, "bri":254,"hue": 0 };
			controlLight(json);
		
			concentrationValue += attention*2;
			// GREEN LIGHT
		}
		
		
		console.log("Attention Value : " + concentrationValue);
		

		
		
		
		
	}
	
	
	// PLAY MUSIC
	if(step == 2){
		
	
		var satValue = parseInt(eegData[2],10) % 255;
		var hueValue = parseInt(eegData[0],10) * parseInt(eegData[0],10) % 40000;
		
		console.log("hue Value " + hueValue);
		
		var json = 	{"on":true, "sat":255, "bri":254,"hue": hueValue };
		controlLight(json);
			
		
		
		
	}
	
	
	//CREDENTIALS
	if(step == 3){
		
		var json = 	{"on":false, "sat":0, "bri":254,"hue": 0 };
		controlLight(json);
		
		
	}
	
	
	
	
	
	
}




function controlLight(json){
	
	data = json;
  
	options = {
		uri: url,
		headers: {
			'Content-Type': 'application/json'		   
		},
		body: JSON.stringify(data) 
	}


	request.put(options, function(err, response, body) {
		
		//console.log(body);
	
	});
	
	
}



function myLoop(arg) {
  
  console.log(arg);
  _on = !_on;
  
  data = {on: _on};
  
  options = {
    uri: url,
    headers: {
        'Content-Type': 'application/json'
       
    },
	 body: JSON.stringify(data) 
}


request.put(options, function(err, response, body) {
    console.log(body)
	
	
	
});

}

setInterval(mainLoop, 200, 'My Loop');


app.listen(8080);   
server.listen(8081);
