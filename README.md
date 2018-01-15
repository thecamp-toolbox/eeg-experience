# eeg-experience
triggering content using a MUSE headset and controlling a Philips HUE smart bulb

Working with the Muse Head Band Device

http://www.choosemuse.com/

and an HUE Philips Device

https://www2.meethue.com/en-us

## Prerequisites
* 1 - Download the Muse Direct app ( UNFORTUNATELY ONLY AVAILABLE ON WINDOWS )

https://www.microsoft.com/en-us/store/p/muse-direct/9p0mbp6nv07x

* 2 - Plug your HUE Phillips device on same network with your computer

* 3 - You have to know your HUE ip on the local network

* 4 - Define your hueIp on app.js
```
var hueIp = "YOUR IP DEVICE";
```

## Instructions to install 
1- Install npm dependencies
```
npm install
```
2- Launch app.js
```
node app.js
```

3- Start the experience : http://localhost:8080/instructions

## Credentials

sachaamm @ The Camp Aix-en-Provence
