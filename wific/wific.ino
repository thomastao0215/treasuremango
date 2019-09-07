static const uint8_t D0   = 16;
#include <Servo.h>
Servo myservo1;

int i = 0;


#include <ESP8266WiFi.h>
/* 依赖 PubSubClient 2.4.0 */
#include <PubSubClient.h>
/* 依赖 ArduinoJson 5.13.4 */
#include <ArduinoJson.h>

#define SENSOR_PIN    13

/* 连接您的WIFI SSID和密码 */
#define WIFI_SSID "iPhone"       //  "路由器SSID"
#define WIFI_PASSWD "maosijie"     //  "密码"


/* 设备证书信息*/
#define PRODUCT_KEY  "a1za3DKdGMM"     // "替换为设备的ProductKey"
#define DEVICE_NAME "GARBAGE"       //"替换为设备的DeviceName"
#define DEVICE_SECRET "hghk4UVK306jF9VSwbbLf7IB09grmi6B"//     "替换为设备的DeviceSecret"
#define REGION_ID "cn-shanghai"    //     "替换为设备所在地域ID如cn-shanghai"

/* 线上环境域名和端口号，不需要改 */
#define MQTT_SERVER       PRODUCT_KEY ".iot-as-mqtt." REGION_ID ".aliyuncs.com"
#define MQTT_PORT         1883
#define MQTT_USRNAME      DEVICE_NAME "&" PRODUCT_KEY

#define CLIENT_ID         "esp8266|securemode=3,timestamp=1234567890,signmethod=hmacsha1|"
// MQTT连接报文参数,请参见MQTT-TCP连接通信文档，文档地址：https://help.aliyun.com/document_detail/73742.html
// 加密明文是参数和对应的值（clientIdesp8266deviceName${deviceName}productKey${productKey}timestamp1234567890）按字典顺序拼接
// 密钥是设备的DeviceSecret
#define MQTT_PASSWD       "f1ef80ee8add322c519a5a6bec326dc499f8****"

#define ALINK_BODY_FORMAT         "{\"id\":\"123\",\"version\":\"1.0\",\"method\":\"thing.event.property.post\",\"params\":%s}"
#define ALINK_TOPIC_PROP_POST     "/sys/" PRODUCT_KEY "/" DEVICE_NAME "/thing/event/property/post"

unsigned long lastMs = 0;
WiFiClient espClient;
PubSubClient  client(espClient);


void callback(char *topic, byte *payload, unsigned int length)
{
    Serial.print("Message arrived [");
    Serial.print(topic);
    Serial.print("] ");
    payload[length] = '\0';
    Serial.println((char *)payload);


}


void wifiInit()
{
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWD);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.println("WiFi not Connect");
    }

    Serial.println("Connected to AP");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());


Serial.print("espClient [");


    client.setServer(MQTT_SERVER, MQTT_PORT);   /* 连接WiFi之后，连接MQTT服务器 */
    client.setCallback(callback);
}


void mqttCheckConnect()
{
    while (!client.connected())
    {
        Serial.println("Connecting to MQTT Server ...");
        if (client.connect(CLIENT_ID, MQTT_USRNAME, MQTT_PASSWD))

        {

            Serial.println("MQTT Connected!");

        }
        else
        {
            Serial.print("MQTT Connect err:");
            Serial.println(client.state());
            delay(5000);
        }
    }
}


void mqttIntervalPost()
{
    char param[32];
    char jsonBuf[128];

    sprintf(param, "{\"idle\":%d}", digitalRead(13));
    sprintf(jsonBuf, ALINK_BODY_FORMAT, param);
    Serial.println(jsonBuf);
    boolean d = client.publish(ALINK_TOPIC_PROP_POST, jsonBuf);
    Serial.print("publish:0 失败;1成功");
    Serial.println(d);
}


void setup() 
{

    pinMode(SENSOR_PIN,  INPUT);
    myservo1.attach(D0); 
    myservo1.write(0);
    /* initialize serial for debugging */
    Serial.begin(115200);
    Serial.println("Demo Start");

    wifiInit();
}


// the loop function runs over and over again forever
void loop()
{
    if (millis() - lastMs >= 5000)
    {
        lastMs = millis();
        mqttCheckConnect(); 

        /* 上报消息心跳周期 */
        mqttIntervalPost();
    }

    client.loop();
    if (digitalRead(SENSOR_PIN) == HIGH){
    Serial.println("Motion detected!");
    delay(2000);
      }
    else {
    Serial.println("Motion absent!");
    delay(2000);
  }

}

void switchs(int i){
  if(i==0){
    myservo1.write(0);
  }
  else{
    myservo1.write(90);
  }
}
