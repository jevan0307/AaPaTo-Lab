'use strict';

var app = {
    initialize: function () {
        this.bind();
    },
    bind: function () {
        document.addEventListener('deviceready', this.deviceready, false);
        controlScreen.hidden = true;
    },
    deviceready: function () {
        // wire buttons to functions
        deviceList.ontouchstart = app.connect; // assume not scrolling
        refreshButton.ontouchstart = app.list;
        disconnectButton.ontouchstart = app.disconnect;

        // throttle changes
        var throttledOnBpmChange = _.throttle(app.onBpmChange, 200);
        var throttledOnSearchDevice = _.throttle(app.list, 200);
        $('#bpm').on('change', throttledOnBpmChange);
        $('#searchDevice').on('change', throttledOnSearchDevice);
        $("#melodyCtrl").on('click', app.sendCtrl);

        app.setCtrl("Play");
        app.list();
        //app.onconnect();
    },
    list: function (event) {
        deviceList.firstChild.innerHTML = "Discovering...";
        app.setStatus("Looking for Bluetooth Devices...");

        bluetoothSerial.list(app.ondevicelist, app.generateFailureFunction("List Failed"));
    },
    connect: function (e) {
        app.setStatus("Connecting...");
        var device = e.target.getAttribute('deviceId');
        console.log("Requesting connection to " + device);

        bluetoothSerial.connect(device, app.onconnect, app.ondisconnect);
    },
    disconnect: function (event) {
        if (event) {
            event.preventDefault();
        }
        app.setStatus("Disconnecting...");
        bluetoothSerial.disconnect(app.ondisconnect);
    },
    onconnect: function () {
        connectionScreen.hidden = true;
        controlScreen.hidden = false;
        console.log('Connect success');
        app.setStatus("Connected.");
    },
    ondisconnect: function () {
        connectionScreen.hidden = false;
        controlScreen.hidden = true;
        console.log('Connect failed');
        app.setStatus("Disconnected.");
    },
    onBpmChange: function (evt) {
        app.sendBpm(bpm.value)
    },
    sendBpm: function (c) {
        console.log('Sending bpm:' + c + '...');
        bluetoothSerial.write(String.fromCharCode(c));
    },
    sendCtrl: function (evt) {
        console.log('Sending play/pause message...');
        if (melodyCtrl.innerHTML == "Pause") {
            bluetoothSerial.write(String.fromCharCode(0));
            app.setCtrl("Play");
        }
        else {
            bluetoothSerial.write(String.fromCharCode(1));
            app.setCtrl("Pause");
        }
    },
    setCtrl: function (c) {
        if (c == "Play") {
            melodyCtrl.innerHTML = "Play";
            $( "#bpm" ).prop( "disabled", true );
        }
        else if(c == "Pause"){
            melodyCtrl.innerHTML = "Pause";
            $( "#bpm" ).prop( "disabled", false );
        }
    },
    timeoutId: 0,
    setStatus: function(status) {
        if (app.timeoutId) {
            clearTimeout(app.timeoutId);
        }
        messageDiv.innerText = status;
        app.timeoutId = setTimeout(function() { messageDiv.innerText = ""; }, 4000);
    },
    ondevicelist: function(devices) {
        var listItem, deviceId;

        // remove existing devices
        deviceList.innerHTML = " ";
        app.setStatus("");

        var searchName = searchDevice.value;
        var deviceNum = 0;
        devices.forEach(function(device) {
            if(searchName != "" && device.name.search(searchName) == -1){
                console.log('pass ' + device.name);
                return;
            }
            deviceNum += 1;
            listItem = document.createElement('li');
            listItem.className = "topcoat-list__item";
            if (device.hasOwnProperty("uuid")) { // TODO https://github.com/don/BluetoothSerial/issues/5
                deviceId = device.uuid;
            } else if (device.hasOwnProperty("address")) {
                deviceId = device.address;
            } else {
                deviceId = "ERROR " + JSON.stringify(device);
            }
            listItem.setAttribute('deviceId', device.address);            
            listItem.innerHTML = device.name + "<br/><i>" + deviceId + "</i>";
            deviceList.appendChild(listItem);
        });

        if (deviceNum === 0) {
            
            if (cordova.platformId === "ios") { // BLE
                app.setStatus("No Bluetooth Peripherals Discovered.");
            } else { // Android
                app.setStatus("No Bluetooth Peripherals Discovered.\nPlease Pair a Bluetooth Device.");
            }

        } else {
            app.setStatus("Found " + deviceNum + " device" + (deviceNum === 1 ? "." : "s."));
        }
    },
    generateFailureFunction: function(message) {
        var func = function(reason) {
            var details = "";
            if (reason) {
                details += ": " + JSON.stringify(reason);
            }
            app.setStatus(message + details);
        };
        return func;
    }
};