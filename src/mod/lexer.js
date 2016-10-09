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
    NUM: /^-?[0-9]+(\.[0-9]+)?/g,
    STR: /^"(\\"|[^"])*"/g,
    COLOR: /^:/g,
    BINOP: /^(>=|<=|<>|\*\*|[=%+*\/-])/g,
    PAR_OPEN: /^\(/g,
    PAR_CLOSE: /^\)/g,
    COMMA: /^,/g,
    FUNC: /^(cos|sin|rnd|max|min|abs|floor|ceil)/gi,
    INST: /^(disk|point|triangles)/gi
};

// All the possible tokens.
var ALL = (function() {
    var arr = [];
    for( var key in RX ) {
        arr.push( key );
    }
    return arr;
})();



function Lexer( code ) {
    this._code = code;
    this._cursor = 0;

}

/**
 * @return void
 */
Lexer.prototype.next = function(tokens) {
    if( typeof tokens === 'undefined' ) tokens = ALL.slice();
    if (!Array.isArray( tokens )) tokens = [tokens];

    ['SPC', 'DOTS', 'COM'].forEach(function (item) {
        if (tokens.indexOf( item ) == -1) {
            tokens.push( item );
        }
    });

    var code = this._code.substr( this._cursor );
    var id, rx, matcher;
    var i;
    var tkn;
    while (true) {
        tkn = null;
        for (i = 0 ; i < tokens.length ; i++) {
            id = tokens[i];
            rx = RX[("" + id).toUpperCase()];
            if (!rx) continue;
            // Reinit the cursor of the RegExp.
            rx.lastIndex = 0;
            matcher = rx.exec( code );
            if (matcher) {
                tkn = { id: id, val: matcher[0], pos: this._cursor };
                break;
            }
        }
        if (!tkn) return null;
        this._cursor += tkn.val.length;
        if (tkn.id != 'SPC' && tkn.id != 'DOTS' && tkn.id != 'COM') {
            return tkn;
        }
        code = this._code.substr( this._cursor );
    }
};


module.exports = Lexer;
