#include <WiFi.h>
#include "configuration.h"
/*#include "boards_pinout.h"
#include "wifi_utils.h"
#include "display.h"
#include "utils.h"*/

extern Configuration    Config;

/*extern uint8_t          myWiFiAPIndex;
extern int              myWiFiAPSize;
extern WiFi_AP          *currentWiFi;
extern bool             backUpDigiMode;

bool        WiFiConnected       = false;
uint32_t    WiFiAutoAPTime      = millis();
bool        WiFiAutoAPStarted   = false;
uint32_t    previousWiFiMillis  = 0;
uint8_t     wifiCounter         = 0;
uint32_t    lastBackupDigiTime  = millis();*/

uint32_t    WiFiAutoAPTime      = millis();


namespace WIFI_Utils {

    void startAutoAP() {
        WiFi.mode(WIFI_MODE_NULL);
        WiFi.mode(WIFI_AP);
        WiFi.softAP("LoRaTracker-AP", Config.wifiAP.password);
        WiFiAutoAPTime = millis();
    }

    void killAutoAP() {
        WiFi.disconnect();
        WiFi.mode(WIFI_OFF);
    }

    /*void checkIfAutoAPShouldPowerOff() {
        if (WiFiAutoAPStarted && Config.wifiAutoAP.powerOff > 0) {
            if (WiFi.softAPgetStationNum() > 0) {
                WiFiAutoAPTime = 0;
            } else {
                if (WiFiAutoAPTime == 0) {
                    WiFiAutoAPTime = millis();
                } else if ((millis() - WiFiAutoAPTime) > Config.wifiAutoAP.powerOff * 60 * 1000) {
                    Serial.println("Stopping auto AP");

                    WiFiAutoAPStarted = false;
                    WiFi.softAPdisconnect(true);

                    Serial.println("Auto AP stopped (timeout)");
                }
            }
        }
    }*/

}