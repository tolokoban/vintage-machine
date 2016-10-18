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


function Basic( code ) {
    this.clear();    
    if( typeof code === 'undefined' ) code = '';    
    this._code = code;
    var lex = new Lexer( code );
    while (lex.hasMoreCode()) {
        if (parse.call(this, lex, 'instruction', 'affectation')) continue;
        if (lex.hasMoreCode() && !lex.next('EOL')) {
            // ERROR.
            lex.fatal( "Caractère inattendu ! Je suis perdu..." );
        }
    }
    // Linkage: replace all the labels by their address.
    this._asm.forEach(function (itm, idx, asm) {
        if (Array.isArray(itm)) {
            asm[idx] = this._labels[itm[0]];
        }
    }, this);
}


/**
 * @return void
 */
Basic.prototype.asm = function() {
    return this._asm.slice();
};


/**
 * Reset the basic compiler.
 */
Basic.prototype.clear = function() {
    this._code = '';
    // ASM code before linkage.
    this._asm = [];
    // Labels are used for branching. This is a map between a label name and the positionin the ASM code.
    this._labels = {};
    this._labelId = 0;
    // Blocs nesting needs context to know (for instance) at which `FOR` belongs a `NEXT`. 
    this._context = [];
};


var PARSERS = {
    instruction: function( lex ) {
        var tkn = lex.next('INST');
        if (!tkn) return false;
        var ins = tkn.val.toUpperCase();
        switch (ins) {
        case "LOCATE": return parseArgs.call( this, lex, "LOCATE", 2);
        case "SPRITE": return parseArgs.call( this, lex, "SPRITE", 1, 1, 1);
        case "MOVE": return parseArgs.call( this, lex, "MOVE", 0, 320, 240);
        case "MOVER": return parseArgs.call( this, lex, "MOVER", 0, 16, 0);
        case "FRAME": return parseArgs.call( this, lex, "FRAME", 0, 1);
        case "POINT": return parseArgs.call( this, lex, "POINT", 2, ["pen0", Asm.GET]);
        case "TRI": return parseArgs.call( this, lex, "TRI", 0);
        case "TRIANGLE": return parseArgs.call( this, lex, "TRIANGLE", 0, 0,0,320,480,640,0);
        case "BOX": return parseFunc.call( this, lex, "BOX");
        case "PEN": return parseFunc.call( this, lex, "PEN");
        case "PEN0": return parseArgs.call( this, lex, "PEN0", 1);
        case "PEN1": return parseArgs.call( this, lex, "PEN1", 1);
        case "PEN2": return parseArgs.call( this, lex, "PEN2", 1);
        case "PEN3": return parseArgs.call( this, lex, "PEN3", 1);
        case "FOR": return parseFOR.call( this, lex );
        case "NEXT": return parseNEXT.call( this, lex );
        case "INK": return parseArgs.call( this, lex, "INK", 3, -1 );
        }

        lex.fatal(_('unknown-instr', tkn.val.toUpperCase()));
        return false;
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
        var tkn = lex.next('FUNC', 'NUM', 'STR', 'VAR', 'PAR_OPEN');
        if (tkn) {
            switch(tkn.id) {
            case 'NUM': this._asm.push( parseFloat( tkn.val ) ); return true;
            case 'HEX': return parseHexa.call( this, tkn.val );
            case 'STR': this._asm.push( parseString( tkn.val ) ); return true;
            case 'VAR': this._asm.push( tkn.val, Asm.GET ); return true;
            case 'FUNC': return parseFunc.call( 
                this, lex, tkn.val.substr(0, tkn.val.length - 1).toUpperCase() 
            );
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


function parseHexa( str ) {
    str = str.substr(1).toUpperCase();
    var hex = "0123456789ABCDEF";
    var val = 0;
    for (var i = 1; i < str.length; i++) {
        val = val * 16 + hex.indexOf( str.charAt(i) );        
    }
    this._asm.push( val );
}


/**
 * FOR $idx = 1 To 5
 *   $total = $total + $idx
 * NEXT
 * PRINT $total
 *----------------------------
 * :A  "$idx", 1, 5, 1, [:B], FOR
 *     "$total", "$total", GET, "$idx", GET, ADD, SET
 *     [:A], JPM
 * :B  "$total", GET, PRINT
 */
function parseFOR( lex ) {
    var tkn = lex.next('VAR');
    if (!tkn) lex.fatal(_('missing-var-after-for'));
    var name = tkn.val;
    if (!lex.next('EQUAL')) lex.fatal(_('missing-equal'));
    // Label of the FOR
    var labelA = this._labelId++;
    // Label of the NEXT
    var labelB = this._labelId++;
    this._asm.push( name, Asm.ERASE );
    this._labels[labelA] = this._asm.length;
    this._context.push({ type: "FOR", labelA: labelA, labelB: labelB });
    this._asm.push( name );
    // Lower bound
    if (!parse.call( this, lex, 'expression' )) lex.fatal(_('missing-expression'));
    // To.
    if (!lex.next('TO')) lex.fatal(_('missing-to'));
    // Upper bound
    if (!parse.call( this, lex, 'expression' )) lex.fatal(_('missing-expression'));
    // Optional STEP
    if (lex.next('STEP')) {
        if (!parse.call( this, lex, 'expression' )) lex.fatal(_('missing-expression'));        
    } else {
        // Default step is 1.
        this._asm.push( 1 );
    }
    if (!lex.next('EOL')) lex.fatal(_('expected-eol'));
    this._asm.push( [labelB], Asm.FOR );
    return true;
}


function parseNEXT( lex ) {
    var ctx = this._context.pop();
    if (!ctx) lex.fatal(_('unexpected-next'));
    if ( ctx.type == 'FOR' ) {
        this._asm.push( [ctx.labelA], Asm.JMP );
        this._labels[ctx.labelB] = this._asm.length;
    } else {
        lex.fatal(_('unexpected-next'));
    }
    return true;
}


function parseFunc( lex, func ) {
    if (typeof Asm[func] !== 'function') {
        lex.fatal(_("unknown-function", func));
    }
    var argsCount = 0;
    var tkn;
    while (parse.call(this, lex, 'expression')) {
        argsCount++;
        tkn = lex.next('COMMA', 'PAR_CLOSE', 'EOL');
        if (!tkn) lex.fatal(_('missing-par-close'));
        if (tkn.id != 'COMMA') break;
    }

    this._asm.push( argsCount, Asm[func] );
    return true;
}


function parseArgs( lex, instruction, mandatoryCount ) {
    var optionalCount = arguments.length - 3;
    var i, comma, commaIsMissing;
    for (i = 0; i < mandatoryCount + optionalCount; i++) {
        commaIsMissing = false;
        if (i > 0) {
            commaIsMissing = !lex.next('COMMA');
        }
        if (parse.call( this, lex, 'expression' )) {
            if (commaIsMissing) {
                // Two consecutive expressions without a separating comma.
                lex.fatal(_('mising-comma'));
            }
        } else {
            break;
        }
    }
    // Check if all the mandatory args have been passed.
    if (i < mandatoryCount) {
        lex.fatal(_('too-few-args', instruction, mandatoryCount) + "\n"
                  + _(instruction.toLowerCase()));
    }
    // Add optional arguments.
    var base = i - mandatoryCount;
    var arg;
    for (i = base; i < optionalCount; i++) {
        arg = arguments[3 + i];
        if (Array.isArray(arg)) this._asm.push.apply( this._asm, arg );
        else this._asm.push( arg );
    }
    if (!lex.next('EOL')) {
        lex.fatal(_('too-many-args', mandatoryCount, mandatoryCount + optionalCount)
                  + "\n" + _('instr-' + instruction));
    }
    this._asm.push( Asm[instruction] );
    return true;
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
