/** @module repository */require( 'repository', function(exports, module) { var _intl_={"en":{},"fr":{}},_$=require("$").intl;function _(){return _$(_intl_, arguments);}
 var GLOBAL = {
  "sys.startup": "PEN &FF0\nPRINT \"Bienvenue !  Je suis \", 1\nPEN &F70\nPRINT \"TLK-74\", 5\nPEN &FF0\nPRINT \", ton ordinateur personnel \", 1\nPEN &0F0\nPRINT \"SUPER RAPIDE !\"\nPEN &FF0\n\n$r = 200\n$x = 320\n$y = $r\n$c0 = cos(0) * $r\n$s0 = sin(0) * $r\n$c1 = cos(120) * $r\n$s1 = sin(120) * $r\n$c2 = cos(240) * $r\n$s2 = sin(240) * $r\n\nPOINT $x, $y, &fff\nPOINT $x + $c0, $y + $s0, &f00\nPOINT $x + $c1, $y + $s1, &0f0\nTRIS\nPOINT $x - $c2, $y - $s2, &000\nPOINT $x + $c0, $y + $s0, &f00\nPOINT $x + $c1, $y + $s1, &0f0\nTRIS\n\nPOINT $x, $y, &fff\nPOINT $x + $c1, $y + $s1, &0f0\nPOINT $x + $c2, $y + $s2, &00f\nTRIS\nPOINT $x - $c0, $y - $s0, &000\nPOINT $x + $c1, $y + $s1, &0f0\nPOINT $x + $c2, $y + $s2, &00f\nTRIS\n\nPOINT $x, $y, &fff\nPOINT $x + $c2, $y + $s2, &00f\nPOINT $x + $c0, $y + $s0, &f00\nTRIS\nPOINT $x - $c1, $y - $s1, &000\nPOINT $x + $c2, $y + $s2, &00f\nPOINT $x + $c0, $y + $s0, &f00\nTRIS\n\nLOCATE 0,4\nPRINT \"Appuie sur la touche \", 1\nPEN &FFF\nPRINT \"F1\"\nPEN &FF0\nPRINT \" pour commencer.\", 1\n",
  "sys.test": "# Programme de test.\n\n\nPEN 3\nTRIANGLE\n\n\n",
  "sys.hello-world": "PEN 7\nPRINT \"Bienvenue !  Je suis \", 1\nPEN 3\nPRINT \"TLK-64\", 5\nPEN 7\nPRINT \", ton ordinateur personnel.\", 1\nLOCATE 0,4\nPRINT \"Appuie sur la touche \", 1\nPEN 16\nPRINT \"F1\"\nPEN 7\nPRINT \" pour commencer.\", 1\n"};
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