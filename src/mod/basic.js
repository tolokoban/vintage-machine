"use strict";

/**
 * @module basic
 *
 * @description
 * Compiler for the Basic language.
 *
 * @example
 * var mod = require('basic');
 */
var Asm = require("asm");
var Lexer = require("lexer");


var BINOP = {
    and: Asm.AND,
    or: Asm.OR,
    xor: Asm.XOR,
    '>=': Asm.GEQ,
    '<=': Asm.LEQ,
    '<>': Asm.NEQ,
    '^': Asm.EXP,
    '=': Asm.EQ,
    '%': Asm.MOD,
    '+': Asm.ADD,
    '*': Asm.MUL,
    '/': Asm.DIV,
    '-': Asm.SUB,
    '<': Asm.LT,
    '>': Asm.GT
};

function Basic() {
    this.clear();
    
}


/**
 * @return void
 */
Basic.prototype.asm = function() {
    return this._asm.slice();
};


/**
 * @return void
 */
Basic.prototype.add = function( code ) {
    var lex = new Lexer( code );
    while (lex.hasMoreCode()) {
        if (parse.call(this, lex, 'instruction', 'affectation')) break;
        // ERROR.
        lex.fatal( "???" );
    }
};


/**
 * Reset the basic compiler.
 */
Basic.prototype.clear = function() {
    this._code = '';
    this._asm = [];
};


var PARSERS = {
    instruction: function( lex ) {
        var tkn = lex.next('INST');
        if (!tkn) return false;
        
    },
    affectation: function( lex ) {
        var tkn = lex.next('VAR');
        if (!tkn) return false;
        var name = tkn.val;
        this._asm.push( name );
        if (!lex.next('EQUAL')) {
            lex.fatal( _('missing-equal') );
        }
        if (!parse.call( this, lex, 'expression' )) lex.fatal(_('missing-expression'));
        this._asm.push( Asm.SET );
        return true;
    },
    expression: function( lex ) {
        if (!parse.call( this, lex, 'atom' )) return false;
        var tkn = lex.next('BINOP');
        if (tkn) {
            if (!parse.call( this, lex, 'expression' )) {
                lex.fatal(_('missing-expression-after', tkn.val));
            }
            this._asm.push( BINOP[tkn.val] );
        }
        return true;
    },
    atom: function( lex ) {
        var tkn = lex.next('NUM', 'STR', 'VAR', 'PAR_OPEN');
        if (tkn) {
            switch(tkn.id) {
            case 'NUM': this._asm.push( parseFloat( tkn.val ) ); return true;
            case 'STR': this._asm.push( parseString( tkn.val ) ); return true;
            case 'VAR': this._asm.push( tkn.val, Asm.GET ); return true;
            case 'PAR_OPEN':
                parse.call( this, lex, 'expression' );
                tkn = lex.next('PAR_CLOSE');
                if (!tkn) lex.fatal(_('missing-par-close'));
                return true;
            }
        }
        return false;
    }
};


function parse( lex ) {
    var i, parser;
    for (i = 1 ; i < arguments.length ; i++) {
        parser = PARSERS[arguments[i].toLowerCase()];
        if (!parser) throw Error("Unknonw parser: \"" + arguments[i] + "\"!");
        if (parser.call( this, lex )) return true;
    }
    return false;
}


function parseString( str ) {
    // Remove surrounding double quotes.
    str = str.substr( 1, str.length - 2 );
    var out = '';
    var lastIndex = 0;
    var mode = 0;
    var c;
    for (var index = 0; index < str.length; index++) {
        c = str.charAt( index );
        if (mode == 0) {
            if (c == '\\') {
                out += str.substr( lastIndex );
                mode = 1;
            }
        } else {
            // Escape mode.
            if (c == 'n') {
                out += "\n";
            } else if (c == 't') {
                out += "\t";
            } else {
                out += c;
            }
            lastIndex = index + 1;               
            mode = 1;
        }
    }
    out += str.substr( lastIndex );
    return out;
}


module.exports = Basic;
