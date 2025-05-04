"use strict";

var Asm = require("asm");

exports.onTest = function() {
  execAsm([
      "idx", 3, Asm.SET,         // 0   -
      0,                          // 3   0
      "idx", Asm.GET,             // 4   0, 10
      Asm.ADD,                    // 6   10
      "idx",                      // 7   10, "idx"
      "idx", Asm.GET, 1, Asm.SUB, // 8   10, "idx", 9
      Asm.SET,                    // 12  10
      "idx", Asm.GET,             // 13  10, 9
      4, Asm.JNZ                  // 15
  ]);
};


function execAsm( code ) {
  var asm = new Asm(code);
  asm.next();
  console.info("asm.runtime=", asm.runtime);
}
