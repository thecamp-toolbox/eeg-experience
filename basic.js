var request = require('request');

var url = 'http://10.13.15.1/api/29F7GK0rrxT2uyQr7Oe6B-kQLyHjknb-XZPMtmCs/lights/1/state';

var data = {on: true};



var options = {
    uri: url,
    headers: {
        'Content-Type': 'application/json'
       
    },
	 body: JSON.stringify(data) 
}

request.put(options, function(err, response, body) {
    
	
	console.log(body)
	
	
	
});