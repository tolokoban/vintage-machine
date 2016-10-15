"use strict";

var Repository = require("repository");
var Keyboard = require("keyboard");
var Storage = require("tfw.storage").local;
var Message = require("tfw.message");
var Kernel = require("kernel");
var Editor = require("editor");
var Basic = require("basic");
var Asm = require("asm");
var $ = require("dom");

// Mettre en langue française.
require('$').lang( 'fr' );


exports.start = function() {
    var codeEditor = new Editor( document.getElementById('CODE') );
    codeEditor.value = Storage.get( 'default-code', Repository.load("sys.hello-world") );
    var img = new Image();
    img.src = "css/app/symbols.jpg";
    img.onload = function() {
        var canvas = document.getElementById( 'CANVAS' );
        var kernel = new Kernel( canvas, img );
        var code = Repository.load('sys.test');
        console.log(code);
        var basic = new Basic( code );
        var bytecode = basic.asm();
        var asm = new Asm( bytecode, kernel );
        kernel.render = function(time) {
            // Never stop the render loop. Otherwise, colors will stop blinking.
            asm.next();
            kernel.sprite(0, 0, 0, 320, 240, 256, 256);
        };

        document.addEventListener('keydown', function(evt) {
            if (evt.key == 'F1') {
                if ($.hasClass( document.body, 'show' )) {
                    $.removeClass( document.body, 'show' );
                    Keyboard.preventDefault = true;
                } else {
                    $.addClass( document.body, 'show' );
                    Keyboard.preventDefault = false;
                }
                evt.preventDefault();
                evt.stopPropagation();
            }
            if (evt.key == 'F2') {
                try {
                    $.removeClass( document.body, 'show' );
                    Keyboard.preventDefault = true;
                    code = codeEditor.value;
                    Storage.set('default-code', code);
                    basic = new Basic( code );
                    console.log(codeEditor.value);
                    bytecode = basic.asm();
                    console.log(bytecode);
                    asm = new Asm( bytecode, kernel );
                }
                catch (ex) {
                    Keyboard.preventDefault = false;
                    $.addClass( document.body, 'show' );
                    Message.error( ex.msg );
                    console.log("Unexpected char: " + codeEditor.value.charCodeAt( ex.pos ));
                    codeEditor.focus( ex.pos );
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
