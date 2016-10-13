"use strict";

/**
 * @module editor
 *
 * @description
 * We use CodeMirror for syntax coloring, indentation and autocompletion.
 *
 * @example
 * var Editor = require('editor');
 * var editor = new Editor( document.getElementById('EDITOR') );
 * editor.value = 'PRINT "Hello World!"';
 */

var CodeMirror = require("codemirror");

//        {regex: /#[^\n\r]*/, token: "comment"},
//        {regex: /\$[a-z][a-z0-9_]*/i, token: "var"},
//        {regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string"}

function Editor( container ) {
    var editor = CodeMirror( container, {
        lineNumbers: true,
        mode: "basic"
    });

    Object.defineProperty( Editor.prototype, 'value', {
        get: function() { return editor.getValue(); },
        set: function(v) { editor.setValue( v ); },
        configurable: true,
        enumerable: true
    });
};


module.exports = Editor;
