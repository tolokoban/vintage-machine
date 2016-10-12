/** @module repository */require( 'repository', function(exports, module) { var _intl_={"en":{},"fr":{}},_$=require("$").intl;function _(){return _$(_intl_, arguments);}
 var GLOBAL = {
  "sys.test": "# Programme de test.\r\n\r\n\r\nPEN 3\r\nTRIANGLE\r\n\r\n\r\n"};
  "use strict";

var Storage = require("tfw.storage").local;


exports.load = function(name) {
    return (GLOBAL[name] || Storage.get("BASIC:" + name, '')).trim() + "\n";
};


  
module.exports._ = _;
/**
 * @module repository
 * @see module:$
 * @see module:repository
 * @see module:tfw.storage

 */
});