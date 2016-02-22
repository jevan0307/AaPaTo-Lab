# AaPaTo Lab - Melody

Control your LinkIt One play a melody via buzzer from your Android phone.

## Hardware

 * MediaTek LinkIt™ ONE / Arduino Uno
 * Buzzer
 * Red light LED
 * [SparkFun Bluetooth Mate Silver (necessary when using Arduino)](https://www.sparkfun.com/products/10393)
 
## Android

See supported Android versions and devices [here.](https://github.com/don/BluetoothSerial)

### Upload the sketch

The LinkIt One code file is in ./Arduino/AaPaTo_Melody .
Upload the ino file to your board using the Arduino IDE.

### Pair your phone

Pair your Android phone with the bluetooth adapter.

## Cordova - Android

This assumes you have the [Android SDK](http://developer.android.com/sdk/index.html) installed and $ANDROID_HOME/tools and $ANDROID_HOME/platform-tools in your system path.

Adding platforms generates the native project

    $ cordova platform add android
    
Install the Bluetooth Serial plugin with cordova

    $ cordova plugin add cordova-plugin-bluetooth-serial

Connect your phone to the computer.

Compile and run the application

    $ cordova run
    
After the application starts, connect bluetooth by touching the "Connect" label. Occasionally it takes a few times to connect. Watch for the green connect light on the Bluetooth adapter. 

Move the sliders to adjust BPM values.

