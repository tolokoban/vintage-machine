"use strict";

var Keyboard = require("keyboard");
var Kernel = require("kernel");

/*
var Asm = require("asm");
var asm = new Asm( null, [[1,2], [3,4], Asm.ADD] );
debugger;
asm.next();
 */

exports.start = function() {
    var img = new Image();
    img.src = "css/app/symbols.jpg";
    img.onload = function() {
        var canvas = document.getElementById( 'CANVAS' );
        var kernel = new Kernel( canvas, img );
    };
    img.onerror = function( err ) {
        console.error( err );
        console.error("Unable to load image `" + img.src + "`!");
    };
};
