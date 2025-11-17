const CHECK_URL = "http://192.168.4.1/ping";  // replace with your server
const TIMEOUT_MS = 5000;                       // 5s timeout
const TARGET_URL = "http://192.168.4.1/";      // target webpage when connected

async function checkConnection() {
  const statusEl = document.getElementById("status");
  const loadingEl = document.getElementById("loading");
  statusEl.textContent = "Checking connection...";
  loadingEl.style.display = "inline";
  document.getElementById("wifi-info").style.display = "none";
  document.getElementById("success-info").style.display = "none";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(CHECK_URL, {
      method: "GET",
      cache: "no-cache",
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (response.ok) {
      loadingEl.style.display = "none";
      showSuccessInfo();
      return;
    }
  } catch (e) {
    // fetch failed or timed out
  }

  clearTimeout(timeout);
  loadingEl.style.display = "none";
  showWifiInfo();
}

function showWifiInfo() {
  document.getElementById("status").textContent = "Not connected to the required network ✖";
  document.getElementById("wifi-info").style.display = "block";
}

function showSuccessInfo() {
  document.getElementById("status").textContent = "Connected to the correct network ✔";
  document.getElementById("success-info").style.display = "block";
}

function goToWebsite() {
  window.location.href = TARGET_URL;
}

function openWifiSettings() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;

  if (/android/i.test(ua)) {
    try {
      window.location.href = "intent:#Intent;action=android.settings.WIFI_SETTINGS;end;";
    } catch (e) {
      alert("Cannot open Wi-Fi settings on this Android device.");
    }
  } else if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
    alert("iOS does not allow opening Wi-Fi settings from a webpage. Please open Settings → Wi-Fi manually.");
  } else {
    alert("Cannot open Wi-Fi settings automatically on this device. Please open Wi-Fi settings manually.");
  }
}

// Run the initial check on page load
checkConnection();