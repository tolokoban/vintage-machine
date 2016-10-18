"use strict";

var KEYS = {};
var LAST_KEY = null;
var LAST_CODE = null;

document.addEventListener("keydown", function(evt) {
    if ("éèàç".indexOf(evt.key) > -1) return;
    console.info(evt.key, evt.code);
    LAST_KEY = evt.key.toUpperCase();
    KEYS[LAST_KEY] = true;
    LAST_CODE = evt.code.toUpperCase();
    KEYS[LAST_CODE] = true;
    if (exports.preventDefault) evt.preventDefault();
});

document.addEventListener("keyup", function(evt) {
    delete KEYS[evt.key.toUpperCase()];
    delete KEYS[evt.code.toUpperCase()];
    if (exports.preventDefault) evt.preventDefault();
});

exports.preventDefault = false;

exports.test = function(code) {
    return (typeof KEYS[code.toUpperCase()] !== 'undefined');
};

exports.last = function() {
    if (!LAST_KEY) return null;
    var ret = { key: LAST_KEY, code: LAST_CODE };
    LAST_KEY = LAST_CODE = null;
    return ret;
};

exports.resetLast = function() {
    LAST_KEY = LAST_CODE = null;
};
