#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>


static const uint8_t D0   = 16;
#include <Servo.h>
Servo myservo1;



const char *ssid = "treasuremango";

const char *password = "aaaabbbb";


ESP8266WebServer server(80);



void handleRoot() {
  server.send(200, "text/html", "<h1>You are connected</h1>");
}

void handleWhite() {
  server.send(204, "text/html", "<h1>turn on</h1>");
  myservo1.write(0);


  

}
void handleBlack() {
  server.send(204, "text/html", "<h1>turn off</h1>");
  myservo1.write(90);
 
 
}


void setup() {
  // put your setup code here, to run once:
  myservo1.attach(D0); 
  myservo1.write(90);
  delay(1000);
  Serial.begin(115200);
  Serial.println();
  Serial.print("Configuring access point...");
  /* You can remove the password parameter if you want the AP to be open. */
  WiFi.softAP(ssid, password);
  IPAddress myIP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(myIP);
  server.begin();
  server.on("/", handleRoot);
  server.on("/white",handleWhite);
  server.on("/black",handleBlack);
  Serial.println("HTTP server started");
}

void loop() {
  // put your main code here, to run repeatedly:
server.handleClient();
}
