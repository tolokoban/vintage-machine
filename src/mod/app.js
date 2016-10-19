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
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "css/app/symbols.arr", true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function (oEvent) {
        var arrayBuffer = xhr.response;
        if (!arrayBuffer) {
            console.error("Unable to load `symbols.arr`!");
            return;
        }
        var canvas = document.getElementById( 'CANVAS' );
        var kernel = new Kernel( canvas, new Uint8Array(arrayBuffer) );
        var code = Repository.load('sys.startup');
        console.log(code);
        var basic = new Basic( code );
        var bytecode = basic.asm();
        var asm = new Asm( bytecode, kernel );
        kernel.render = function(time) {
            // Never stop the render loop. Otherwise, colors will stop blinking.
            asm.next();
            Keyboard.resetLast();
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
                    console.error( ex );
                    Message.error( ex.msg );
                    console.log("Unexpected char: " + codeEditor.value.charCodeAt( ex.pos ));
                    codeEditor.focus( ex.pos );
                }
                evt.preventDefault();
                evt.stopPropagation();
            }
        }, true);
    };
    xhr.send( null );
};
