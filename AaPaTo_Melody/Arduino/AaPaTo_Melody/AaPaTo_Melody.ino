#include <LBT.h>
#include <LBTServer.h>
char serverName[] = "My_LinkitOne";// 這裡是幫自己的LinkitOne 命名,可以取自己的英文名子加上生日
// ex: char serverName[]= “DaMingWan0127”

int melody[] = {1, 1, 5, 5, 6, 6, 5, 4, 4, 3, 3, 2, 2, 1, 5, 5, 4, 4, 3, 3, 2, 5, 5, 4, 4, 3, 3, 2, 1, 1, 5, 5, 6, 6, 5, 4, 4, 3, 3, 2, 2, 1, -1};
float beat[] = {1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2};


const int serverWaitTime = 5;
const int frequency[] = {1, 523, 587, 659, 698, 784, 880, 988, 1047};
const int speaker = 9;
char BTread = 0;
char bpm = 60;

void setup() {
  for (int i = 1; i <= 9; ++i)
    pinMode( i, OUTPUT);
  Serial.begin(9600);
  LBTServer.begin((uint8_t*)serverName);
}

void loop() {
  if (!LBTServer.connected()) {
    Serial.println("===Disconnected!===");
    Serial.printf("[%s] is waiting for any client...\n", serverName);
    while (!LBTServer.accept(serverWaitTime))
      Serial.println(" ... ");
    Serial.println("===Connected!===");
    BTread = 0;
  }
  
  for (int i = 0; melody[i] != -1; ++i) {                      
    while (LBTServer.available() ) {
      BTread = LBTServer.read();
      if (BTread == 1) 
        Serial.println("Open");
      else if (BTread == 0) 
        Serial.println("Close");
      else {
        bpm = BTread;
        Serial.printf("bpm = %d\n", bpm);
      }
    }
    if (BTread == 0) 
      break;
    
    digitalWrite(melody[i], HIGH);
    playTone(frequency[melody[i]], (beat[i] * 60000 / bpm)-30);
    digitalWrite(melody[i], LOW);
    delay(30);
  }
  if (BTread)
    Serial.println("End of the song");
  delay(2000);
}


void playTone(int freq, int duration) {
  int halfPeriod = 1.0 / freq * 1000000 / 2;

  for (long i = 0; i < duration * 1000L; i += halfPeriod * 2) {
    digitalWrite(speaker, HIGH);
    delayMicroseconds(halfPeriod);

    digitalWrite(speaker, LOW);
    delayMicroseconds(halfPeriod);
  }
}
