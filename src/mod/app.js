"use strict";

var Keyboard = require("keyboard");
var Kernel = require("kernel");


exports.start = function() {
    var img = new Image();
    img.src = "css/app/symbols.jpg";
    img.onload = function() {
        var canvas = document.getElementById( 'CANVAS' );
        var kernel = new Kernel( canvas, img );
    };
};
