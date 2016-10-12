"use strict";

var KEYS = {};

document.addEventListener("keydown", function(evt) {
    if ("éèàç".indexOf(evt.key) > -1) return;
    console.info(evt.key, evt.code);
    KEYS[evt.key.toUpperCase()] = true;
    KEYS[evt.code.toUpperCase()] = true;
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
