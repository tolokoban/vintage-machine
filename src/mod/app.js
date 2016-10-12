"use strict";

var Repository = require("repository");
var Keyboard = require("keyboard");
var Kernel = require("kernel");
var Basic = require("basic");
var Asm = require("asm");

var basic = new Basic();


exports.start = function() {
    var img = new Image();
    img.src = "css/app/symbols.jpg";
    img.onload = function() {
        var canvas = document.getElementById( 'CANVAS' );
        var kernel = new Kernel( canvas, img );
        var code = Repository.load('sys.test');
        var basic = new Basic( code );
        var asm = new Asm( basic.asm(), kernel );
        kernel.render = function(time) {
            asm.next();
        };
    };
    img.onerror = function( err ) {
        console.error( err );
        console.error("Unable to load image `" + img.src + "`!");
    };
};
