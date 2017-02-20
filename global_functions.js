var ERROR = "error";
var WARN = "warning";
var INFO = "info";

var log = function(type, message) {
    console.log("[" + type.toUpperCase() + "] " + JSON.stringify(message));
};

var info = function(message) { log(INFO, message); };
var warn = function(message) { log(WARN, message); };
var error = function(message) { log(ERROR, message); };

module.exports = {
    info: info,
    warn: warn,
    error: error
};