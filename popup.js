'use strict';

var inteval_key = "inteval";
var auto_refresh_key = "auto_refresh";

function updateToggleText(tab_id) {
  var ar_key = auto_refresh_key + tab_id;
  var btn_text = localStorage[ar_key] == "true" ? "Stop" : "Start";

  autoRefreshToggle.value = btn_text; 
}

function delayedReloadRecursive(tab_id) {
  var ar_key = auto_refresh_key + tab_id;
  var it_key = inteval_key + tab_id;

  if (localStorage[ar_key] == "true") {
    var inteval = Number(localStorage[it_key]);

    setTimeout(function() {
      chrome.tabs.reload(tab_id);
      delayedReloadRecursive(tab_id);
    }, inteval);
  }
}

intevalNumber.onchange = function(event) {
  if (event.target.value < 1) { event.target.value = 1; }
}

autoRefreshToggle.onclick = function(event) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var tab_id = tabs[0].id;
    var ar_key = auto_refresh_key + tab_id;
    var it_key = inteval_key + tab_id;

    if (localStorage[ar_key] == "true") {
      localStorage[ar_key] = "false";
      intevalNumber.disabled = false;
    } else {
      localStorage[ar_key] = "true";
      localStorage[it_key] = intevalNumber.value * 1000;
      intevalNumber.disabled = true;
      delayedReloadRecursive(tab_id);
    }

    updateToggleText(tab_id);
  });
};

// Per Tab Initialization
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var tab_id = tabs[0].id;
  var ar_key = auto_refresh_key + tab_id;
  var it_key = inteval_key + tab_id;

  if (!localStorage[ar_key]) {
    localStorage[ar_key] = false;
  }

  if (localStorage[it_key]) {
    intevalNumber.value = Number(localStorage[it_key]) / 1000;
  }

  updateToggleText(tab_id);
});