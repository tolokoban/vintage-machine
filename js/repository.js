/** @module repository */require( 'repository', function(exports, module) { var _intl_={"en":{},"fr":{}},_$=require("$").intl;function _(){return _$(_intl_, arguments);}
 var GLOBAL = {
  "sys.startup": "PEN &FF0\r\nPRINT \"Bienvenue !  Je suis \", 1\r\nPEN &F70\r\nPRINT \"TLK-74\", 5\r\nPEN &FF0\r\nPRINT \", ton ordinateur personnel \", 1\r\nPEN &0F0\r\nPRINT \"SUPER RAPIDE !\"\r\nPEN &FF0\r\n\r\n$r = 200\r\n$x = 320\r\n$y = $r\r\n$c0 = cos(0) * $r\r\n$s0 = sin(0) * $r\r\n$c1 = cos(120) * $r\r\n$s1 = sin(120) * $r\r\n$c2 = cos(240) * $r\r\n$s2 = sin(240) * $r\r\n\r\nPOINT $x, $y, &fff\r\nPOINT $x + $c0, $y + $s0, &f00\r\nPOINT $x + $c1, $y + $s1, &0f0\r\nTRIS\r\nPOINT $x - $c2, $y - $s2, &000\r\nPOINT $x + $c0, $y + $s0, &f00\r\nPOINT $x + $c1, $y + $s1, &0f0\r\nTRIS\r\n\r\nPOINT $x, $y, &fff\r\nPOINT $x + $c1, $y + $s1, &0f0\r\nPOINT $x + $c2, $y + $s2, &00f\r\nTRIS\r\nPOINT $x - $c0, $y - $s0, &000\r\nPOINT $x + $c1, $y + $s1, &0f0\r\nPOINT $x + $c2, $y + $s2, &00f\r\nTRIS\r\n\r\nPOINT $x, $y, &fff\r\nPOINT $x + $c2, $y + $s2, &00f\r\nPOINT $x + $c0, $y + $s0, &f00\r\nTRIS\r\nPOINT $x - $c1, $y - $s1, &000\r\nPOINT $x + $c2, $y + $s2, &00f\r\nPOINT $x + $c0, $y + $s0, &f00\r\nTRIS\r\n\r\nLOCATE 0,4\r\nPRINT \"Appuie sur la touche \", 1\r\nPEN &FFF\r\nPRINT \"F1\"\r\nPEN &FF0\r\nPRINT \" pour commencer.\", 1\r\n",
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