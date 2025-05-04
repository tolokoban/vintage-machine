"use strict";

/** @module lexer */require('lexer', function (require, module, exports) {
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
   * @module lexer
   *
   * @description
   * A lexer for the BASIC language.
   *
   * @example
   * var Lexer = require('lexer');
   * var tokens = Lexer.parse("DISK $cx + 320, $cy + 240, $rayon");
   */

  var RX = {
    SPC: /^[ \t]+/g,
    DOTS: /^\.\.\.[\n\r \t]+/g,
    COM: /^#[^\n\r]*[\n\r]+/g,
    //-----------------------------------
    EOL: /^[\n\r]+/g,
    VAR: /^\$[a-z0-9\._]+/gi,
    HEX: /^&[0-9a-f]+/gi,
    NUM: /^-?([0-9]+(\.[0-9]+)?|\.[0-9]+)/g,
    STR: /^"(\\"|[^"])*"/g,
    EQUAL: /^=/g,
    LABEL: /^:[a-z0-9_]+/g,
    COLON: /^:/g,
    BINOP: /^(and|or|xor|>=|<=|<>|\^|[=%+*\/<>-])/g,
    PAR_OPEN: /^\(/g,
    PAR_CLOSE: /^\)/g,
    COMMA: /^,/g,
    FUNC: /^[a-z]+\(/i,
    INST: /^[a-z][a-z_]*[0-9]*/gi,
    TO: /^to(?![a-z0-9])/i,
    IN: /^in(?![a-z0-9])/i,
    STEP: /^step(?![a-z0-9])/i,
    CONST: /^[a-z]+/i
  };

  // All the possible tokens.
  var ALL = function () {
    var arr = [];
    for (var key in RX) {
      arr.push(key);
    }
    return arr;
  }();
  function Lexer(code) {
    this._code = code;
    this._cursor = 0;
  }

  /**
   * @return `true` if there is more code to parse.
   */
  Lexer.prototype.hasMoreCode = function () {
    return this._cursor < this._code.length - 1;
  };

  /**
   * @return void
   */
  Lexer.prototype.fatal = function (msg) {
    var e = {
      pos: this._cursor,
      code: this._code,
      msg: msg
    };
    console.error(e);
    throw e;
  };

  /**
   * @return void
   */
  Lexer.prototype.next = function (tokens) {
    if (typeof tokens === 'undefined') tokens = ALL.slice();
    if (!Array.isArray(tokens)) tokens = [tokens];
    var i, arg;
    for (i = 1; i < arguments.length; i++) {
      arg = arguments[i];
      tokens.push(arg);
    }
    ['SPC', 'DOTS', 'COM'].forEach(function (item) {
      if (tokens.indexOf(item) == -1) {
        tokens.push(item);
      }
    });
    var code = this._code.substr(this._cursor);
    var id, rx, matcher;
    var tkn;
    while (true) {
      tkn = null;
      for (i = 0; i < tokens.length; i++) {
        id = tokens[i];
        rx = RX[("" + id).toUpperCase()];
        if (!rx) continue;
        // Reinit the cursor of the RegExp.
        rx.lastIndex = 0;
        matcher = rx.exec(code);
        if (matcher) {
          tkn = {
            id: id,
            val: matcher[0],
            pos: this._cursor
          };
          break;
        }
      }
      if (!tkn) return null;
      this._cursor += tkn.val.length;
      if (tkn.id != 'SPC' && tkn.id != 'DOTS' && tkn.id != 'COM') {
        return tkn;
      }
      code = this._code.substr(this._cursor);
    }
  };
  module.exports = Lexer;
  module.exports._ = _;
});