/** @module keyboard */require( 'keyboard', function(exports, module) { var _intl_={"en":{},"fr":{}},_$=require("$").intl;function _(){return _$(_intl_, arguments);}
    "use strict";

var KEYS = {};

document.addEventListener("keydown", function(evt) {
    if ("éèàç".indexOf(evt.key) > -1) return;
    console.info(evt.key, evt.code);
    KEYS[evt.key] = true;
    KEYS[evt.code] = true;
});

document.addEventListener("keyup", function(evt) {
    delete KEYS[evt.key];
    delete KEYS[evt.code];
});


exports.test = function(code) {
    return (typeof KEYS[code] !== 'undefined');
};


  
module.exports._ = _;
/**
 * @module keyboard
 * @see module:$
 * @see module:keyboard

 */
});