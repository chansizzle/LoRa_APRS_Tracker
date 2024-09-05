#include <ArduinoJson.h>
#include "configuration.h"
//#include "ota_utils.h"
#include "web_utils.h"
#include "display.h"
#include "utils.h"

extern Configuration               Config;
extern uint32_t                    lastBeaconTx;
//extern std::vector<ReceivedPacket> receivedPackets;

extern const char web_index_html[] asm("_binary_data_embed_index_html_gz_start");
extern const char web_index_html_end[] asm("_binary_data_embed_index_html_gz_end");
extern const size_t web_index_html_len = web_index_html_end - web_index_html;

extern const char web_style_css[] asm("_binary_data_embed_style_css_gz_start");
extern const char web_style_css_end[] asm("_binary_data_embed_style_css_gz_end");
extern const size_t web_style_css_len = web_style_css_end - web_style_css;

extern const char web_script_js[] asm("_binary_data_embed_script_js_gz_start");
extern const char web_script_js_end[] asm("_binary_data_embed_script_js_gz_end");
extern const size_t web_script_js_len = web_script_js_end - web_script_js;

extern const char web_bootstrap_css[] asm("_binary_data_embed_bootstrap_css_gz_start");
extern const char web_bootstrap_css_end[] asm("_binary_data_embed_bootstrap_css_gz_end");
extern const size_t web_bootstrap_css_len = web_bootstrap_css_end - web_bootstrap_css;

extern const char web_bootstrap_js[] asm("_binary_data_embed_bootstrap_js_gz_start");
extern const char web_bootstrap_js_end[] asm("_binary_data_embed_bootstrap_js_gz_end");
extern const size_t web_bootstrap_js_len = web_bootstrap_js_end - web_bootstrap_js;

// Declare external symbols for the embedded image data
extern const unsigned char favicon_data[] asm("_binary_data_embed_favicon_png_gz_start");
extern const unsigned char favicon_data_end[] asm("_binary_data_embed_favicon_png_gz_end");
extern const size_t favicon_data_len = favicon_data_end - favicon_data;

namespace WEB_Utils {

    AsyncWebServer server(80);

    void handleNotFound(AsyncWebServerRequest *request) {
        AsyncWebServerResponse *response = request->beginResponse(404, "text/plain", "Not found");
        response->addHeader("Cache-Control", "max-age=3600");
        request->send(response);
    }

    void handleStatus(AsyncWebServerRequest *request) {
        request->send(200, "text/plain", "OK");
    }

    void handleHome(AsyncWebServerRequest *request) {
        //if(Config.webadmin.active && !request->authenticate(Config.webadmin.username.c_str(), Config.webadmin.password.c_str()))
        //    return request->requestAuthentication();

        AsyncWebServerResponse *response = request->beginResponse_P(200, "text/html", (const uint8_t*)web_index_html, web_index_html_len);
        response->addHeader("Content-Encoding", "gzip");
        request->send(response);
    }

    void handleFavicon(AsyncWebServerRequest *request) {
        AsyncWebServerResponse *response = request->beginResponse_P(200, "image/x-icon", (const uint8_t*)favicon_data, favicon_data_len);
        response->addHeader("Content-Encoding", "gzip");
        request->send(response);
    }

    void handleReadConfiguration(AsyncWebServerRequest *request) {
        //if(Config.webadmin.active && !request->authenticate(Config.webadmin.username.c_str(), Config.webadmin.password.c_str()))
        //    return request->requestAuthentication();

        File file = SPIFFS.open("/igate_conf.json");
        
        String fileContent;
        while(file.available()){
            fileContent += String((char)file.read());
        }

        request->send(200, "application/json", fileContent);
    }

    void handleReceivedPackets(AsyncWebServerRequest *request) {
        StaticJsonDocument<1536> data;

        /*for (int i = 0; i < receivedPackets.size(); i++) {
            data[i]["millis"] = receivedPackets[i].millis;
            data[i]["packet"] = receivedPackets[i].packet;
            data[i]["RSSI"] = receivedPackets[i].RSSI;
            data[i]["SNR"] = receivedPackets[i].SNR;
        }*/

        String buffer;

        serializeJson(data, buffer);

        request->send(200, "application/json", buffer);
    }

    void handleWriteConfiguration(AsyncWebServerRequest *request) {
        Serial.println("Got new config from www");

        //Config.wifiAP.active  // esto no va en la pagina
        Config.wifiAP.password              = request->getParam("wifiAPpassword", true)->value();

        int beaconsTotal                    = request->getParam("beacons", true)->value().toInt();

        Config.beacons = {};
        for (int i = 0; i < beaconsTotal; i++) {
            Beacon beacon;
            beacon.callsign                 = request->getParam("callsign", true)->value();
            beacon.symbol                   = request->getParam("symbol", true)->value();
            beacon.overlay                  = request->getParam("overlay", true)->value();
            beacon.comment                  = request->getParam("callsign", true)->value();
            beacon.smartBeaconActive        = request->hasParam("smartBeaconActive", true);
            beacon.smartBeaconSetting       = request->getParam("smartBeaconSetting", true)->value();               = 
            beacon.micE                     = request->getParam("micE", true)->value();
            beacon.gpsEcoMode               = request->hasParam("gpsEcoMode", true);
            Config.beacons.push_back(beacon);
        }

        Config.display.ecoMode                  = request->hasParam("display.ecoMode", true);
        if (Config.display.ecoMode) {
            Config.display.timeout              = request->getParam("display.timeout", true)->value().toInt();
        }
        Config.display.turn180                  = request->hasParam("display.turn180", true);
        Config.display.showSymbol               = request->hasParam("display.showSymbol", true);

        Config.winlink.password                 = request->getParam("winlink.password", true)->value();

        Config.bme.active                       = request->hasParam("bme.active", true);
        Config.bme.temperatureCorrection        = request->getParam("bme.temperatureCorrection", true)->value().toFloat();
        Config.bme.sendTelemetry                = request->hasParam("bme.sendTelemetry", true);

        Config.notification.ledTx               = request->hasParam("notification.ledTx", true);
        Config.notification.ledTxPin            = request->getParam("notification.ledTxPin", true)->value().toInt();
        Config.notification.ledMessage          = request->hasParam("notification.ledMessage", true);
        Config.notification.ledMessagePin       = request->getParam("notification.ledMessagePin", true)->value().toInt();
        Config.notification.ledFlashlight       = request->hasParam("notification.ledFlashlight", true);
        Config.notification.ledFlashlightPin    = request->getParam("notification.ledFlashlightPin", true)->value().toInt();
        Config.notification.buzzerActive        = request->hasParam("notification.buzzerActive", true);
        Config.notification.buzzerPinTone       = request->getParam("notification.buzzerPinTone", true)->value().toInt();
        Config.notification.buzzerPinVcc        = request->getParam("notification.buzzerPinVcc", true)->value().toInt();
        Config.notification.bootUpBeep          = request->hasParam("notification.bootUpBeep", true);
        Config.notification.txBeep              = request->hasParam("notification.txBeep", true);
        Config.notification.messageRxBeep       = request->hasParam("notification.messageRxBeep", true);
        Config.notification.stationBeep         = request->hasParam("notification.stationBeep", true);
        Config.notification.lowBatteryBeep      = request->hasParam("notification.lowBatteryBeep", true);
        Config.notification.shutDownBeep        = request->hasParam("notification.shutDownBeep", true);


        /*
        Config.loramodule.txFreq            = request->getParam("lora.txFreq", true)->value().toInt();
        Config.loramodule.rxFreq            = request->getParam("lora.rxFreq", true)->value().toInt();
        Config.loramodule.spreadingFactor   = request->getParam("lora.spreadingFactor", true)->value().toInt();
        Config.loramodule.signalBandwidth   = request->getParam("lora.signalBandwidth", true)->value().toInt();
        Config.loramodule.codingRate4       = request->getParam("lora.codingRate4", true)->value().toInt();
        Config.loramodule.power             = request->getParam("lora.power", true)->value().toInt();
        Config.loramodule.txActive          = request->hasParam("lora.txActive", true);
        Config.loramodule.rxActive          = request->hasParam("lora.rxActive", true);
        */

        Config.ptt.active                       = request->hasParam("ptt.active", true);
        Config.ptt.io_pin                       = request->getParam("ptt.io_pin", true)->value().toInt();
        Config.ptt.preDelay                     = request->getParam("ptt.preDelay", true)->value().toInt();
        Config.ptt.postDelay                    = request->getParam("ptt.postDelay", true)->value().toInt();
        Config.ptt.reverse                      = request->hasParam("ptt.reverse", true);

        Config.simplifiedTrackerMode            = request->hasParam("other.simplifiedTrackerMode", true);
        Config.sendCommentAfterXBeacons         = request->getParam("other.sendCommentAfterXBeacons", true)->value().toInt();
        Config.path                             = request->getParam("other.path", true)->value();
        Config.nonSmartBeaconRate               = request->getParam("other.nonSmartBeaconRate", true)->value().toInt();
        Config.rememberStationTime              = request->getParam("other.rememberStationTime", true)->value().toInt();
        Config.maxDistanceToTracker             = request->getParam("other.maxDistanceToTracker", true)->value().toInt();
        Config.standingUpdateTime               = request->getParam("other.standingUpdateTime", true)->value().toInt();
        Config.sendAltitude                     = request->hasParam("other.sendAltitude", true);
        Config.sendBatteryInfo                  = request->hasParam("other.sendBatteryInfo", true);
        Config.bluetoothType                    = request->getParam("other.bluetoothType", true)->value().toInt();
        Config.bluetoothActive                  = request->hasParam("other.bluetoothActive", true);
        Config.disableGPS                       = request->hasParam("other.disableGPS", true);

        Config.writeFile();

        AsyncWebServerResponse *response    = request->beginResponse(302, "text/html", "");
        response->addHeader("Location", "/");
        request->send(response);
        displayToggle(false);
        ESP.restart();
    }

    void handleAction(AsyncWebServerRequest *request) {
        String type = request->getParam("type", false)->value();

        if (type == "send-beacon") {
            lastBeaconTx = 0;

            request->send(200, "text/plain", "Beacon will be sent in a while");
        } else if (type == "reboot") {
            displayToggle(false);
            ESP.restart();
        } else {
            request->send(404, "text/plain", "Not Found");
        }
    }

    void handleStyle(AsyncWebServerRequest *request) {
        AsyncWebServerResponse *response = request->beginResponse_P(200, "text/css", (const uint8_t*)web_style_css, web_style_css_len);
        response->addHeader("Content-Encoding", "gzip");
        request->send(response);
    }

    void handleScript(AsyncWebServerRequest *request) {
        AsyncWebServerResponse *response = request->beginResponse_P(200, "text/javascript", (const uint8_t*)web_script_js, web_script_js_len);
        response->addHeader("Content-Encoding", "gzip");
        request->send(response);
    }

    void handleBootstrapStyle(AsyncWebServerRequest *request) {
        AsyncWebServerResponse *response = request->beginResponse_P(200, "text/css", (const uint8_t*)web_bootstrap_css, web_bootstrap_css_len);
        response->addHeader("Content-Encoding", "gzip");
        response->addHeader("Cache-Control", "max-age=3600");
        request->send(response);
    }

    void handleBootstrapScript(AsyncWebServerRequest *request) {
        AsyncWebServerResponse *response = request->beginResponse_P(200, "text/javascript", (const uint8_t*)web_bootstrap_js, web_bootstrap_js_len);
        response->addHeader("Content-Encoding", "gzip");
        response->addHeader("Cache-Control", "max-age=3600");
        request->send(response);
    }

    void setup() {
        server.on("/", HTTP_GET, handleHome);
        server.on("/status", HTTP_GET, handleStatus);
        server.on("/received-packets.json", HTTP_GET, handleReceivedPackets);
        server.on("/configuration.json", HTTP_GET, handleReadConfiguration);
        server.on("/configuration.json", HTTP_POST, handleWriteConfiguration);
        server.on("/action", HTTP_POST, handleAction);
        server.on("/style.css", HTTP_GET, handleStyle);
        server.on("/script.js", HTTP_GET, handleScript);
        server.on("/bootstrap.css", HTTP_GET, handleBootstrapStyle);
        server.on("/bootstrap.js", HTTP_GET, handleBootstrapScript);
        server.on("/favicon.png", HTTP_GET, handleFavicon);

        //OTA_Utils::setup(&server); // Include OTA Updater for WebServer

        server.onNotFound(handleNotFound);

        server.begin();
    }

}