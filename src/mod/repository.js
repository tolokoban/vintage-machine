"use strict";

var Storage = require("tfw.storage").local;


exports.load = function(name) {
    return (GLOBAL[name] || Storage.get("BASIC:" + name, '')).trim() + "\n";
};
