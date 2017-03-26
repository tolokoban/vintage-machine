"use strict";

var Asm = require("asm");

exports.onTest = function() {
  execAsm([
      3, "idx", Asm.SET,          // 0
      0,                          // 3
      "idx", Asm.GET,             // 4
      Asm.ADD,                    // 6
      "idx", Asm.GET, 1, Asm.SUB, // 7
      "idx",                      // 11
      Asm.SET,                    // 12
      "idx", Asm.GET,             // 13
      4, Asm.JNZ                  // 15
  ]);
};


function execAsm( code ) {
  var asm = new Asm(code);
  asm.next();
  console.info("asm.runtime=", asm.runtime);
}
