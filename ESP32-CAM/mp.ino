#include "esp_camera.h"
#include <WiFi.h>
#include <HTTPClient.h>
#define LED_PIN 2
#define BUZZER_PIN 4
#define BUTTON_PIN 15
byte lbs = LOW;
byte ls = LOW;

#define CAMERA_MODEL_AI_THINKER // Has PSRAM

#include "camera_pins.h"

const char *ssid = "SriRev";
const char *password = "iclo4981";

void startCameraServer();
void setupLedFlash(int pin);
String cam_url = "";
int poleId = 1;
void setup() {
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  Serial.println();


  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);



  digitalWrite(LED_PIN, LOW);
  noTone(BUZZER_PIN);

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.frame_size = FRAMESIZE_UXGA;
  config.pixel_format = PIXFORMAT_RGB565;
  config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;
  config.fb_location = CAMERA_FB_IN_PSRAM;
  config.jpeg_quality = 12;
  config.fb_count = 1;


  if (config.pixel_format == PIXFORMAT_JPEG) {
    if (psramFound()) {
      config.jpeg_quality = 10;
      config.fb_count = 2;
      config.grab_mode = CAMERA_GRAB_LATEST;
    } else {
      config.frame_size = FRAMESIZE_SVGA;
      config.fb_location = CAMERA_FB_IN_DRAM;
    }
  } else {
    config.frame_size = FRAMESIZE_240X240;
#if CONFIG_IDF_TARGET_ESP32S3
    config.fb_count = 2;
#endif
  }

#if defined(CAMERA_MODEL_ESP_EYE)
  pinMode(13, INPUT_PULLUP);
  pinMode(14, INPUT_PULLUP);
#endif

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }

  sensor_t *s = esp_camera_sensor_get();
  if (s->id.PID == OV3660_PID) {
    s->set_vflip(s, 1);
    s->set_brightness(s, 1);
    s->set_saturation(s, -2);
  }

  if (config.pixel_format == PIXFORMAT_JPEG) {
    s->set_framesize(s, FRAMESIZE_QVGA);
  }

#if defined(CAMERA_MODEL_M5STACK_WIDE) || defined(CAMERA_MODEL_M5STACK_ESP32CAM)
  s->set_vflip(s, 1);
  s->set_hmirror(s, 1);
#endif

#if defined(CAMERA_MODEL_ESP32S3_EYE)
  s->set_vflip(s, 1);
#endif


#if defined(LED_GPIO_NUM)
  setupLedFlash(LED_GPIO_NUM);
#endif

  WiFi.begin(ssid, password);
  WiFi.setSleep(false);

  Serial.print("WiFi connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");

  startCameraServer();

  Serial.print("Camera Ready! Use 'http://");
  Serial.print(WiFi.localIP());
  cam_url = "http://" + WiFi.localIP().toString() + ":81/stream";
  Serial.println("' to connect");
  Serial.print("Generated camera URL: ");
  Serial.println(cam_url);
  updatePole();
}

void loop() {
  byte buttonState = digitalRead(BUTTON_PIN);
  if (buttonState != lbs) {
    lbs = buttonState;
    if (buttonState == LOW) {
      ls = (ls == HIGH) ? LOW : HIGH;
      digitalWrite(LED_PIN, ls);
      if (ls == HIGH) {
        sendAlert();
        Serial.println("Button pressed: Alert activated");
        delay(9000);
        sendUnAlert();
        digitalWrite(LED_PIN, LOW);
        Serial.println("Button released: Alert deactivated");
      }
    }
  }
  delay(100);
}

void updatePole() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin("https://fp-sos.onrender.com/api/update-pole"); // Set the API URL
    http.addHeader("Content-Type", "application/json"); // Set the content type to JSON

    // Create the JSON payload
    String payload = "{\"poleId\":" + String(poleId) + ",\"cameraUrl\":\"" + cam_url + "\"}";

    // Send the POST request
    int httpResponseCode = http.POST(payload);

    // Check the response
    if (httpResponseCode > 0) {
      Serial.printf("POST request sent. Response code: %d\n", httpResponseCode);
      String response = http.getString();
      Serial.println("Response: " + response);
    } else {
      Serial.printf("Error sending POST request: %s\n", http.errorToString(httpResponseCode).c_str());
    }

    http.end(); // Close the connection
  } else {
    Serial.println("WiFi not connected. Cannot send POST request.");
  }
}

void sendAlert() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    // Construct the URL dynamically with poleId
    String alert_url = "https://fp-sos.onrender.com/api/alert/" + String(poleId);

    http.begin(alert_url); // Set the GET request URL

    // Send the GET request
    int httpResponseCode = http.GET();

    // Check the response
    if (httpResponseCode > 0) {
      Serial.printf("GET request sent. Response code: %d\n", httpResponseCode);
      String response = http.getString();
      Serial.println("Response: " + response);
    } else {
      Serial.printf("Error sending GET request: %s\n", http.errorToString(httpResponseCode).c_str());
    }

    http.end(); // Close the connection
  } else {
    Serial.println("WiFi not connected. Cannot send GET request.");
  }
}
void sendUnAlert() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    // Construct the URL dynamically with poleId
    String un_alert_url = "https://fp-sos.onrender.com/api/un-alert/" + String(poleId);

    http.begin(un_alert_url); // Set the GET request URL

    // Send the GET request
    int httpResponseCode = http.GET();

    // Check the response
    if (httpResponseCode > 0) {
      Serial.printf("GET request sent. Response code: %d\n", httpResponseCode);
      String response = http.getString();
      Serial.println("Response: " + response);
    } else {
      Serial.printf("Error sending GET request: %s\n", http.errorToString(httpResponseCode).c_str());
    }

    http.end(); // Close the connection
  } else {
    Serial.println("WiFi not connected. Cannot send GET request.");
  }
}
