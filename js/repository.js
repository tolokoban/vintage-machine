/** @module repository */require( 'repository', function(exports, module) { var _intl_={"en":{},"fr":{}},_$=require("$").intl;function _(){return _$(_intl_, arguments);}
 var GLOBAL = {
  "sys.startup": "PEN &FF0\r\nPRINT \"Bienvenue !  Je suis \", 1\r\nPEN &F70\r\nPRINT \"TLK-64\", 5\r\nPEN &FF0\r\nPRINT \", ton ordinateur personnel \", 1\r\nPEN &0F0\r\nPRINT \"SUPER RAPIDE !\"\r\nPEN &FF0\r\nLOCATE 0,4\r\nPRINT \"Appuie sur la touche \", 1\r\nPEN &FFF\r\nPRINT \"F1\"\r\nPEN &FF0\r\nPRINT \" pour commencer.\", 1\r\n",
  "sys.test": "# Programme de test.\r\n\r\n\r\nPEN 3\r\nTRIANGLE\r\n\r\n\r\n",
  "sys.hello-world": "PEN 7\r\nPRINT \"Bienvenue !  Je suis \", 1\r\nPEN 3\r\nPRINT \"TLK-64\", 5\r\nPEN 7\r\nPRINT \", ton ordinateur personnel.\", 1\r\nLOCATE 0,4\r\nPRINT \"Appuie sur la touche \", 1\r\nPEN 16\r\nPRINT \"F1\"\r\nPEN 7\r\nPRINT \" pour commencer.\", 1\r\n"};
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