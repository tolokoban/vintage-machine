"use strict";

require("font.josefin");

var Repository = require("repository");
var Keyboard = require("keyboard");
var Storage = require("tfw.storage").local;
var Message = require("tfw.message");
var Kernel = require("kernel");
var Editor = require("editor");
var Basic = require("basic");
var Wdg = require("x-widget").getById;
var Asm = require("asm");
var $ = require("dom");

// Mettre en langue française.
require('$').lang( 'fr' );

var g_asm;
var g_kernel;
var g_codeEditor;

exports.start = function() {
    g_codeEditor = new Editor( document.getElementById('CODE') );
    g_codeEditor.value = Storage.get( 'default-code', Repository.load("sys.hello-world") );
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
        g_kernel = new Kernel( canvas, new Uint8Array(arrayBuffer) );
        var code = Repository.load('sys.startup');
        console.log(code);
        var basic = new Basic( code );
        var bytecode = basic.asm();
        g_asm = new Asm( bytecode, g_kernel );
        g_kernel.render = function(time) {
            // Never stop the render loop. Otherwise, colors will stop blinking.
            g_asm.next();
            Keyboard.resetLast();
        };

        document.addEventListener('keydown', function(evt) {
            if (evt.key == 'F1') {
                toggleMonitorEditor();
                evt.preventDefault();
                evt.stopPropagation();
            }
            if (evt.key == 'F4') {
                compileAndRun();
                evt.preventDefault();
                evt.stopPropagation();
            }
        }, true);
        $.on(document.getElementById('F1'), toggleMonitorEditor);
        $.on(document.getElementById('F4'), compileAndRun);
        $.on(document.getElementById('index'), function() {
            Wdg('HELP').value = 'index';
        });
    };
    xhr.send( null );
};

exports.pasteCode = function( code ) {
    g_codeEditor.value = code;
};

function compileAndRun() {
    try {
        $.removeClass( document.body, 'show' );
        Keyboard.preventDefault = true;
        var code = g_codeEditor.value;
        Storage.set('default-code', code);
        var basic = new Basic( "CLS\n" + code );
        console.log(g_codeEditor.value);
        var bytecode = basic.asm();
        console.log(bytecode);
        g_asm = new Asm( bytecode, g_kernel );
    }
    catch (ex) {
        Keyboard.preventDefault = false;
        $.addClass( document.body, 'show' );
        console.error( ex );
        Message.error( ex.msg );
        console.log("Unexpected char: " + g_codeEditor.value.charCodeAt( ex.pos ));
        g_codeEditor.focus( ex.pos );
    }
}

function toggleMonitorEditor() {
    if ($.hasClass( document.body, 'show' )) {
        $.removeClass( document.body, 'show' );
        Keyboard.preventDefault = true;
    } else {
        $.addClass( document.body, 'show' );
        Keyboard.preventDefault = false;
    }
}
