"use strict";

var Keyboard = require("keyboard");
var Kernel = require("kernel");
var Basic = require("basic");
var Asm = require("asm");

var basic = new Basic();

function check(code, expectedResult) {
    var basic = new Basic();
    basic.add( "$result=" + code + "\n");
    var result;
    try {
        var asm = new Asm( basic.asm() );
        while (asm.next());
        console.info("[app] asm.runtime=...", asm.runtime);
        result = asm.runtime.vars['$result'];
    }
    catch (ex) {
        result = ex;
    }
    if (result != expectedResult) {
        console.log("Expression: " + code);
        console.log("Expected:   " + expectedResult);
        console.log("But got:    " + result);
    }
}
debugger;
check("(2*3)+1", 28);



exports.start = function() {
    var img = new Image();
    img.src = "css/app/symbols.jpg";
    img.onload = function() {
        var canvas = document.getElementById( 'CANVAS' );
        var kernel = new Kernel( canvas, img );
        var asm = new Asm( [
            "loop", 64, Asm.SET,
            "color", "loop", Asm.GET, Asm.SET,
            640, Asm.RND, Asm.MUL, 480, Asm.RND, Asm.MUL, "color", Asm.GET, Asm.POINT,
            640, Asm.RND, Asm.MUL, 480, Asm.RND, Asm.MUL, "color", Asm.GET, Asm.POINT,
            640, Asm.RND, Asm.MUL, 480, Asm.RND, Asm.MUL, "color", Asm.GET, Asm.POINT,
            Asm.TRIANGLES,
            1, Asm.FRAME,
            "loop", Asm.DEC, -38, Asm.JGT
        ]);
        asm.kernel = kernel;
        kernel.render = function(time) {
            asm.next();
        };
    };
    img.onerror = function( err ) {
        console.error( err );
        console.error("Unable to load image `" + img.src + "`!");
    };
};
