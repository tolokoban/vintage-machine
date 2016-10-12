/** @module app */require( 'app', function(exports, module) { var _intl_={"en":{},"fr":{}},_$=require("$").intl;function _(){return _$(_intl_, arguments);}
    "use strict";

var Repository = require("repository");
var Keyboard = require("keyboard");
var Message = require("tfw.message");
var Kernel = require("kernel");
var Basic = require("basic");
var Asm = require("asm");
var $ = require("dom");



exports.start = function() {
    var codeEditor = document.getElementById('CODE');
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
        };

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
                    console.log(codeEditor.value);
                    bytecode = basic.asm();
                    console.log(bytecode);
                    asm = new Asm( bytecode, kernel );
                }
                catch (ex) {
                    $.addClass( document.body, 'show' );
                    Message.error( ex.msg );
                    console.log("Unexpected char: " + codeEditor.value.charCodeAt( ex.pos ));
                    codeEditor.focus();
                    codeEditor.selectionStart = ex.pos;
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


  
module.exports._ = _;
/**
 * @module app
 * @see module:$
 * @see module:app
 * @see module:asm
 * @see module:basic
 * @see module:dom
 * @see module:kernel
 * @see module:keyboard
 * @see module:repository
 * @see module:tfw.message

 */
});