"use strict";

var Keyboard = require("keyboard");
var Kernel = require("kernel");
var Asm = require("asm");

/*
var asm = new Asm( null,             [
    "idx", 3, Asm.SET,
    0,
    "idx", Asm.GET, Asm.ADD,
    "idx", Asm.DEC, -7, Asm.JGT
]);
debugger;
asm.next();
 */

exports.start = function() {
    var img = new Image();
    img.src = "css/app/symbols.jpg";
    img.onload = function() {
        var canvas = document.getElementById( 'CANVAS' );
        var kernel = new Kernel( canvas, img );
        var asm = new Asm( kernel, [
            "loop", 1000, Asm.SET,
            "color", 64, Asm.RND, Asm.MUL, Asm.SET,
            640, Asm.RND, Asm.MUL, 480, Asm.RND, Asm.MUL, "color", Asm.GET, Asm.POINT,
            640, Asm.RND, Asm.MUL, 480, Asm.RND, Asm.MUL, "color", Asm.GET, Asm.POINT,
            640, Asm.RND, Asm.MUL, 480, Asm.RND, Asm.MUL, "color", Asm.GET, Asm.POINT,
            1, Asm.FRAME,
            Asm.TRIANGLES, -37, Asm.JMP            
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
