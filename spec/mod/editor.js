"use strict";

/** @module editor */require('editor', function (require, module, exports) {
  var _ = function () {
    var D = {
        "en": {},
        "fr": {}
      },
      X = require("$").intl;
    function _() {
      return X(D, arguments);
    }
    _.all = D;
    return _;
  }();
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
  var RX_LETTER = /[a-z]/i;
  var RX_ID = /[a-z0-9_]/i;
  var RX_DIGIT = /[0-9]/;
  var RX_HEXA = /[0-9a-f]/i;
  var RX_SYM = /[+*\/%,()=<>-]/;
  CodeMirror.defineMode('basic', function (cfg, modeCfg) {
    return {
      //-----------------------
      startState: function startState() {
        return {};
      },
      //---------------------------------
      token: function token(stream, state) {
        var _char;
        var escape;
        // Skip white spaces.
        if (stream.eatSpace()) return "text";
        if (stream.eat('#')) {
          stream.skipToEnd();
          return "comment";
        }
        if (stream.eat('&')) {
          if (stream.eatWhile(RX_HEXA)) {
            return 'number';
          } else {
            return 'error';
          }
        }
        if (stream.eat('$')) {
          stream.eatWhile(RX_ID);
          return "variable";
        }
        if (stream.eat('"')) {
          escape = false;
          for (;;) {
            _char = stream.next();
            if (!_char) return "error";
            if (escape) continue;
            if (_char == '\\') {
              escape = true;
            } else if (_char == '"') {
              return "string";
            }
          }
        }
        if (stream.eat(RX_LETTER)) {
          stream.eatWhile(RX_ID);
          return 'keyword';
        }
        if (stream.eatWhile(RX_DIGIT)) return 'number';
        if (stream.eatWhile(RX_SYM)) return 'text';
        if (stream.eat('...')) return 'text';
        // Error.
        stream.next();
        return "error";
      }
    };
  });
  //        {regex: /#[^\n\r]*/, token: "comment"},
  //        {regex: /\$[a-z][a-z0-9_]*/i, token: "var"},
  //        {regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string"}

  function Editor(container) {
    var editor = CodeMirror(container, {
      lineNumbers: true,
      mode: "basic"
    });
    editor.setSize('100%', '100%');
    this.focus = function (pos) {
      editor.focus();
      if (typeof pos === 'number') {
        // Convert position into (line, ch).
        var lines = editor.getValue().substr(0, pos).split('\n');
        var line = lines.length - 1;
        var ch = lines.pop().length;
        editor.setCursor(line, ch);
      }
    };
    Object.defineProperty(Editor.prototype, 'value', {
      get: function get() {
        return editor.getValue();
      },
      set: function set(v) {
        editor.setValue(v);
      },
      configurable: true,
      enumerable: true
    });
  }
  ;
  module.exports = Editor;
  module.exports._ = _;
});