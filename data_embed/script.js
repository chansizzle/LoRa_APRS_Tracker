// Custom scripts

let currentSettings = null;

function backupSettings() {
    const data =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(currentSettings));
    const a = document.createElement("a");
    a.setAttribute("href", data);
    a.setAttribute("download", "trackerConfigurationBackup.json");
    a.click();
}

document.getElementById("backup").onclick = backupSettings;

document.getElementById("restore").onclick = function (e) {
    e.preventDefault();

    document.querySelector("input[type=file]").click();
};

document.querySelector("input[type=file]").onchange = function () {
    const files = document.querySelector("input[type=file]").files;

    if (!files.length) return;

    const file = files.item(0);

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
        const data = JSON.parse(reader.result);

        loadSettings(data);
    };
};

/***********************************************************************************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/

//  Display Script
const ecoModeCheckbox       = document.querySelector('input[name="display.ecoMode"]');
const timeoutInput          = document.querySelector('input[name="display.timeout"]');

ecoModeCheckbox.addEventListener("change", function () {
    timeoutInput.disabled   = this.checked;
});


//  Load from json all settings
function fetchSettings() {
    fetch("/configuration.json")
        .then((response) => response.json())
        .then((settings) => {
            loadSettings(settings);
        })
        .catch((err) => {
            console.error(err);
            alert(`Failed to load configuration`);
        });
}

function loadSettings(settings) {
    currentSettings = settings;

    // Display
    document.getElementById("display.showSymbol").checked               = settings.display.showSymbol;
    document.getElementById("display.ecoMode").checked                  = settings.display.ecoMode;
    document.getElementById("display.timeout").value                    = settings.display.timeout;
    document.getElementById("display.turn180").checked                  = settings.display.turn180;
    
    if (settings.display.ecoMode) {
        timeoutInput.disabled = false;
    }

    // WINLINK
    document.getElementById("winlink.password").value                   = settings.winlink.password || "NOPASS";


    // General
    /*document.getElementById("callsign").value                           = settings.callsign;
    document.getElementById("beacon.comment").value                     = settings.beacon.comment;
    document.getElementById("beacon.path").value                        = settings.beacon.path;
    document.getElementById("beacon.symbol").value                      = settings.beacon.symbol;
    document.getElementById("beacon.overlay").value                     = settings.beacon.overlay;
    document.getElementById("personalNote").value                       = settings.personalNote;
    document.getElementById("action.symbol").value                      = settings.beacon.overlay + settings.beacon.symbol;

    document.querySelector(".list-trackers").innerHTML                  = "";

    // Trackers? Networks
    const trackers = settings.beacon || [];
    const trackersContainer = document.querySelector(".list-trackers");

    let trackerCount = 0;

    trackers.forEach((tracker) => {
        const trackerElement = document.createElement("div");
        trackerElement.classList.add("row", "tracker", "border-bottom", "py-2");

        // Increment the name, id, and for attributes
        const attributeName = `beacons.${trackerCount}`;
        trackerElement.innerHTML = `
                  <div class="form-floating col-5 px-1 mb-2">
                    <input type="text" class="form-control form-control-sm" name="${attributeName}.callsign" id="${attributeName}.callsign" value="${beacon.callsign}">
                    <label for="${attributeName}.callsign">callsign</label>
                  </div>
                  <div class="form-floating col-5 px-1 mb-2">
                    <input type="text" class="form-control form-control-sm" name="${attributeName}.symbol" id="${attributeName}.symbol" value="${beacon.symbol}">
                    <label for="${attributeName}.symbol">symbol</label>
                  </div>
                  <div class="form-floating col-5 px-1 mb-2">
                    <input type="text" class="form-control form-control-sm" name="${attributeName}.overlay" id="${attributeName}.overlay" value="${beacon.overlay}">
                    <label for="${attributeName}.overlay">overlay</label>
                  </div>
                  <div class="form-floating col-5 px-1 mb-2">
                    <input type="text" class="form-control form-control-sm" name="${attributeName}.comment" id="${attributeName}.comment" value="${beacon.comment}">
                    <label for="${attributeName}.comment">comment</label>
                  </div>
                  <div class="form-floating col-5 px-1 mb-2">
                    <input type="text" class="form-control form-control-sm" name="${attributeName}.smartBeaconActive" id="${attributeName}.smartBeaconActive" value="${beacon.smartBeaconActive}">
                    <label for="${attributeName}.smartBeaconActive">smartBeaconActive</label>
                  </div>
                  <div class="form-floating col-5 px-1 mb-2">
                    <input type="text" class="form-control form-control-sm" name="${attributeName}.smartBeaconSetting" id="${attributeName}.smartBeaconSetting" value="${beacon.smartBeaconSetting}">
                    <label for="${attributeName}.smartBeaconSetting">smartBeaconSetting</label>
                  </div>
                  <div class="form-floating col-5 px-1 mb-2">
                    <input type="text" class="form-control form-control-sm" name="${attributeName}.micE" id="${attributeName}.micE" value="${beacon.micE}">
                    <label for="${attributeName}.micE">micE</label>
                  </div>
                  <div class="form-floating col-5 px-1 mb-2">
                    <input type="text" class="form-control form-control-sm" name="${attributeName}.gpsEcoMode" id="${attributeName}.gpsEcoMode" value="${beacon.gpsEcoMode}">
                    <label for="${attributeName}.gpsEcoMode">gpsEcoMode</label>
                  </div>
                  <div class="col-2 d-flex align-items-center justify-content-end">
                    <div class="btn-group" role="group">
                      <button type="button" class="btn btn-sm btn-danger" title="Delete" onclick="return this.parentNode.parentNode.parentNode.remove();"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
            </svg><span class="visually-hidden">Delete</span></button>
                    </div>
                  </div>
                `;
        trackersContainer.appendChild(trackerElement);
        trackerCount++;
    });

    // APRS-IS
    document.getElementById("aprs_is.active").checked                   = settings.aprs_is.active;
    document.getElementById("aprs_is.messagesToRF").checked             = settings.aprs_is.messagesToRF;
    document.getElementById("aprs_is.objectsToRF").checked              = settings.aprs_is.objectsToRF;
    document.getElementById("aprs_is.server").value                     = settings.aprs_is.server;
    document.getElementById("aprs_is.port").value                       = settings.aprs_is.port;
    document.getElementById("aprs_is.filter").value                     = settings.aprs_is.filter;
    document.getElementById("aprs_is.passcode").value                   = settings.aprs_is.passcode;

    // Beacon
    document.getElementById("beacon.latitude").value                    = settings.beacon.latitude;
    document.getElementById("beacon.longitude").value                   = settings.beacon.longitude;
    document.getElementById("beacon.interval").value                    = settings.beacon.interval;
    document.getElementById("other.rememberStationTime").value          = settings.other.rememberStationTime;   
    document.getElementById("beacon.sendViaAPRSIS").checked             = settings.beacon.sendViaAPRSIS;
    document.getElementById("beacon.sendViaRF").checked                 = settings.beacon.sendViaRF;

    // LoRa
    document.getElementById("lora.txFreq").value                        = settings.lora.txFreq;
    document.getElementById("lora.rxFreq").value                        = settings.lora.rxFreq;
    document.getElementById("lora.txActive").checked                    = settings.lora.txActive;
    document.getElementById("lora.rxActive").checked                    = settings.lora.rxActive;
    document.getElementById("lora.spreadingFactor").value               = settings.lora.spreadingFactor;
    document.getElementById("lora.signalBandwidth").value               = settings.lora.signalBandwidth;
    document.getElementById("lora.codingRate4").value                   = settings.lora.codingRate4;
    document.getElementById("lora.power").value                         = settings.lora.power;*/

    

    


    // TELEMETRY BME/WX
    /*document.getElementById("bme.active").checked                       = settings.bme.active;
    document.getElementById("bme.temperatureCorrection").value          = settings.bme.temperatureCorrection.toFixed(1);
    document.getElementById("bme.sendTelemetry").checked                = settings.bme.sendTelemetry;*/

    //updateImage();
    //refreshSpeedStandard();
    toggleFields();
}


function toggleFields() {
    const ecoModeCheckbox       = document.querySelector('input[name="display.ecoMode"]');
    const timeoutInput          = document.getElementById("display.timeout");
    //timeoutInput.disabled       = settings.display.alwaysOn;

    ecoModeCheckbox.addEventListener("change", function () {
        timeoutInput.disabled   = this.checked;
    });


    /*const sendExternalVoltageCheckbox = document.querySelector(
        'input[name="battery.sendExternalVoltage"]'
    );
    const externalVoltagePinInput = document.querySelector(
        'input[name="battery.externalVoltagePin"]'
    );

    externalVoltagePinInput.disabled = !sendExternalVoltageCheckbox.checked;
    voltageDividerR1.disabled = !sendExternalVoltageCheckbox.checked;
    voltageDividerR2.disabled = !sendExternalVoltageCheckbox.checked;

    const WebadminCheckbox = document.querySelector(
        'input[name="webadmin.active"]'
    );

    const WebadminUsername = document.querySelector(
        'input[name="webadmin.username"]'
    );

    const WebadminPassword = document.querySelector(
        'input[name="webadmin.password"]'
    );
    WebadminUsername.disabled = !WebadminCheckbox.checked;
    WebadminPassword.disabled = !WebadminCheckbox.checked;*/
}

/***********************************************************************************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/

function showToast(message) {
    const el = document.querySelector('#toast');

    el.querySelector('.toast-body').innerHTML = message;

    (new bootstrap.Toast(el)).show();
}

document.getElementById('send-beacon').addEventListener('click', function (e) {
    e.preventDefault();

    fetch("/action?type=send-beacon", { method: "POST" });

    showToast("Your beacon will be sent in a moment. <br> <u>This action will be ignored if you have APRSIS and LoRa TX disabled!</u>");
});

document.getElementById('reboot').addEventListener('click', function (e) {
    e.preventDefault();

    fetch("/action?type=reboot", { method: "POST" });

    showToast("Your device will be rebooted in a while");
});

const bmeCheckbox = document.querySelector("input[name='bme.active']");



/*document.querySelector(".new button").addEventListener("click", function () {
    const trackersContainer = document.querySelector(".list-trackers");

    let trackerCount = document.querySelectorAll(".tracker").length;

    const trackerElement = document.createElement("div");

    trackerElement.classList.add("row", "tracker", "border-bottom", "py-2");

    // Increment the name, id, and for attributes
    const attributeName = `beacons.${trackerCount}`;
    trackerElement.innerHTML = `
                  <div class="form-floating col-5 px-1 mb-2">
                    <input type="text" class="form-control form-control-sm" name="${attributeName}.callsign" id="${attributeName}.callsign" value="${beacon.callsign}">
                    <label for="${attributeName}.callsign">callsign</label>
                  </div>
                  <div class="form-floating col-5 px-1 mb-2">
                    <input type="text" class="form-control form-control-sm" name="${attributeName}.symbol" id="${attributeName}.symbol" value="${beacon.symbol}">
                    <label for="${attributeName}.symbol">symbol</label>
                  </div>
                  <div class="form-floating col-5 px-1 mb-2">
                    <input type="text" class="form-control form-control-sm" name="${attributeName}.overlay" id="${attributeName}.overlay" value="${beacon.overlay}">
                    <label for="${attributeName}.overlay">overlay</label>
                  </div>
                  <div class="form-floating col-5 px-1 mb-2">
                    <input type="text" class="form-control form-control-sm" name="${attributeName}.comment" id="${attributeName}.comment" value="${beacon.comment}">
                    <label for="${attributeName}.comment">comment</label>
                  </div>
                  <div class="form-floating col-5 px-1 mb-2">
                    <input type="text" class="form-control form-control-sm" name="${attributeName}.smartBeaconActive" id="${attributeName}.smartBeaconActive" value="${beacon.smartBeaconActive}">
                    <label for="${attributeName}.smartBeaconActive">smartBeaconActive</label>
                  </div>
                  <div class="form-floating col-5 px-1 mb-2">
                    <input type="text" class="form-control form-control-sm" name="${attributeName}.smartBeaconSetting" id="${attributeName}.smartBeaconSetting" value="${beacon.smartBeaconSetting}">
                    <label for="${attributeName}.smartBeaconSetting">smartBeaconSetting</label>
                  </div>
                  <div class="form-floating col-5 px-1 mb-2">
                    <input type="text" class="form-control form-control-sm" name="${attributeName}.micE" id="${attributeName}.micE" value="${beacon.micE}">
                    <label for="${attributeName}.micE">micE</label>
                  </div>
                  <div class="form-floating col-5 px-1 mb-2">
                    <input type="text" class="form-control form-control-sm" name="${attributeName}.gpsEcoMode" id="${attributeName}.gpsEcoMode" value="${beacon.gpsEcoMode}">
                    <label for="${attributeName}.gpsEcoMode">gpsEcoMode</label>
                  </div>
                  <div class="col-2 d-flex align-items-center justify-content-end">
                    <div class="btn-group" role="group">
                      <button type="button" class="btn btn-sm btn-danger" title="Delete" onclick="return this.parentNode.parentNode.parentNode.remove();"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
            </svg><span class="visually-hidden">Delete</span></button>
                    </div>
                  </div>
                `;
    trackersContainer.appendChild(trackerElement);

    trackerCount++;

    // Add the new network element to the end of the document
    document.querySelector(".new").before(trackerElement);
});*/

/*document
    .getElementById("action.symbol")
    .addEventListener("change", function () {
        const value = document.getElementById("action.symbol").value;

        document.getElementById("beacon.overlay").value = value[0];
        document.getElementById("beacon.symbol").value = value[1];

        updateImage();
    });*/

/*const speedStandards = {
    300: [125, 5, 12],
    244: [125, 6, 12],
    209: [125, 7, 12],
    183: [125, 8, 12],
    610: [125, 8, 10],
    1200: [125, 7, 9],
};*/

/*function refreshSpeedStandard() {
    const bw = Number(document.getElementById("lora.signalBandwidth").value);
    const cr4 = Number(document.getElementById("lora.codingRate4").value);
    const sf = Number(document.getElementById("lora.spreadingFactor").value);

    let found = false;

    for (const speed in speedStandards) {
        const standard = speedStandards[speed];

        if (standard[0] !== bw / 1000) continue;
        if (standard[1] !== cr4) continue;
        if (standard[2] !== sf) continue;

        document.getElementById("action.speed").value = speed;
        found = true;

        break;
    }

    if (!found) {
        document.getElementById("action.speed").value = "";
    }
}*/

/*document
    .getElementById("lora.signalBandwidth")
    .addEventListener("focusout", refreshSpeedStandard);
document
    .getElementById("lora.codingRate4")
    .addEventListener("focusout", refreshSpeedStandard);
document
    .getElementById("lora.spreadingFactor")
    .addEventListener("focusout", refreshSpeedStandard);

document.getElementById("action.speed").addEventListener("change", function () {
    const speed = document.getElementById("action.speed").value;

    if (speed !== "") {
        const value = speedStandards[Number(speed)];

        const bw = value[0];
        const cr4 = value[1];
        const sf = value[2];

        document.getElementById("lora.signalBandwidth").value = bw * 1000;
        document.getElementById("lora.codingRate4").value = cr4;
        document.getElementById("lora.spreadingFactor").value = sf;
    }
});*/

const form = document.querySelector("form");

const saveModal = new bootstrap.Modal(document.getElementById("saveModal"), {
    backdrop: "static",
    keyboard: false,
});

const savedModal = new bootstrap.Modal(
    document.getElementById("savedModal"),
    {}
);

function checkConnection() {
    const controller = new AbortController();

    setTimeout(() => controller.abort(), 2000);

    fetch("/status?_t=" + Date.now(), { signal: controller.signal })
        .then(() => {
            saveModal.hide();

            savedModal.show();

            setTimeout(function () {
                savedModal.hide();
            }, 3000);

            fetchSettings();
        })
        .catch((err) => {
            setTimeout(checkConnection, 0);
        });
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    document.getElementById("beacons").value =
        document.querySelectorAll(".tracker").length;

    fetch(form.action, {
        method: form.method,
        body: new FormData(form),
    });

    saveModal.show();

    setTimeout(checkConnection, 2000);
});

fetchSettings();

/*function loadReceivedPackets(packets) {
    if (packets) {
        document.querySelector('#received-packets tbody').innerHTML = '';

        const container = document.querySelector("#received-packets tbody");

        container.innerHTML = '';

        const date = new Date();

        packets.forEach((packet) => {
            const element = document.createElement("tr");

            date.setTime(packet.millis);

            const p = date.toUTCString().split(' ')
        
            element.innerHTML = `
                        <td>${p[p.length-2]}</td>
                        <td>${packet.packet}</td>
                        <td>${packet.RSSI}</td>
                        <td>${packet.SNR}</td>
                    `;

            container.appendChild(element);
        })
    }

    setTimeout(fetchReceivedPackets, 15000);
}

function fetchReceivedPackets() {
    fetch("/received-packets.json")
    .then((response) => response.json())
    .then((packets) => {
        loadReceivedPackets(packets);
    })
    .catch((err) => {
        console.error(err);

        console.error(`Failed to load received packets`);
    });
}

document.querySelector('a[href="/received-packets"]').addEventListener('click', function (e) {
    e.preventDefault();

    document.getElementById('received-packets').classList.remove('d-none');
    document.getElementById('configuration').classList.add('d-none');
    
    document.querySelector('button[type=submit]').remove();

    fetchReceivedPackets();
})*/