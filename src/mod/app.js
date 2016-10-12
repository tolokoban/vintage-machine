"use strict";

var Repository = require("repository");
var Keyboard = require("keyboard");
var Message = require("tfw.message");
var Kernel = require("kernel");
var Basic = require("basic");
var Asm = require("asm");
var $ = require("dom");



exports.start = function() {
    var codeEditor = document.getElementById('code');
    var img = new Image();
    img.src = "css/app/symbols.jpg";
    img.onload = function() {
        var canvas = document.getElementById( 'CANVAS' );
        var kernel = new Kernel( canvas, img );
        var code = Repository.load('sys.test');
        console.log(code);
        var basic = new Basic( code );
        var asm = new Asm( basic.asm(), kernel );
        kernel.render = function(time) {
            if (!asm.next()) {
                // If the program is over, we stop the rendering loop.
                //kernel.stop();   // If we stop, colors do not blink anymore.
            }
        };
        kernel.start();

        document.addEventListener('keydown', function(evt) {
            if (evt.key == 'F1') {
                $.toggleClass( document.body, 'show' );
                evt.preventDefault();
                evt.stopPropagation();
            }
            if (evt.key == 'F2') {
                try {
                    $.removeClass( document.body, 'show' );
                    basic = new Basic( codeEditor.value );
                    asm = new Asm( basic.asm(), kernel );
                    kernel.start();
                }
                catch (ex) {
                    Message.error( ex );
                }
                evt.preventDefault();
                evt.stopPropagation();
            }
        }, true);
    };
    img.onerror = function( err ) {
        console.error( err );
        console.error("Unable to load image `" + img.src + "`!");
    };
};
