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

var CONSTS = {
    NL: "\n",
    PI: Math.PI
};

var FIXED_ARGS = {
    ABS: 1,
    ASC: 1,
    COS: 1,
    IIF: 3,
    LEN: 1,
    NEG: 1,
    SHIFT: 1,
    SIN: 1,
    WAIT: 0
};


function Basic( code ) {
    this._id = 0;
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
Basic.prototype.nextID = function() {
    return this._id++;
};


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

/**
 * Create a new label name.
 */
Basic.prototype.newLabel = function() {
    return this._labelId++;
};

/**
 * Set a `label` at the current position.
 */
Basic.prototype.setLabel = function( label ) {
    this._labels[label] = this._asm.length;
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
        case "POINT": return parseArgs.call( this, lex, "POINT", 2, ["color", Asm.GET]);
        case "TRIS": return parseArgs.call( this, lex, "TRIS", 0);
        case "TRIANGLE": return parseArgs.call( this, lex, "TRIANGLE", 0, 0,0,320,480,640,0);
        case "DISK": return parseVarArgs.call( this, lex, "DISK");
        case "BOX": return parseVarArgs.call( this, lex, "BOX");
        case "CLS": return parseVarArgs.call( this, lex, "CLS");
        case "PEN": return parseVarArgs.call( this, lex, "PEN");
        case "PAPER": return parseArgs.call( this, lex, "PAPER", 0, 0xf000);
        case "FOR": return parseFOR.call( this, lex );
        case "NEXT": return parseNEXT.call( this, lex );
        case "INK": return parseArgs.call( this, lex, "INK", 3, -1 );
        case "PRINT": return parsePRINT.call( this, lex, "PRINT" );
        case "SPEAK": return parseArgs.call( this, lex, "SPEAK", 0, "Je suis TLK-74." );
        case "BACK": return parseArgs.call( this, lex, "BACK", 0, 0x007, 0 );
        case "DEBUGGER": return parseArgs.call( this, lex, "DEBUGGER", 0);
        }

        lex.fatal(_('unknown-instr', tkn.val.toUpperCase()));
        return false;
    },
    affectation: function( lex ) {
        var tkn = lex.next('VAR');
        if (!tkn) return false;
        var name = tkn.val;
        if (!lex.next('EQUAL')) {
            lex.fatal( _('missing-equal') );
        }
        if (!parse.call( this, lex, 'expression' )) lex.fatal(_('missing-expression'));
        this._asm.push( name, Asm.SET );
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
        var tkn = lex.next('FUNC', 'NUM', 'HEX', 'STR', 'VAR', 'PAR_OPEN', 'CONST');
        if (tkn) {
            switch(tkn.id) {
            case 'NUM': this._asm.push( parseFloat( tkn.val ) ); return true;
            case 'HEX': return parseHexa.call( this, tkn.val );
            case 'STR': this._asm.push( parseString( tkn.val ) ); return true;
            case 'VAR': this._asm.push( tkn.val, Asm.GET ); return true;
            case 'CONST':
                var cst = CONSTS[tkn.val.toUpperCase()];
                if (!cst) lex.fatal(_('unknown-const', tkn.val));
                if (!Array.isArray( cst )) this._asm.push( cst );
                else this._asm.push.apply( this._asm, cst );
                return true;
            case 'FUNC':
                var name = tkn.val.substr(0, tkn.val.length - 1).toUpperCase();
                var ret = parseFunc.call( this, lex, name, FIXED_ARGS[name] );
                if (!ret) return false;
                //if (name == 'WAIT') return parseFuncWAIT.call( this, lex );
                return true;
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
    for (var i = 0; i < str.length; i++) {
        val = (val << 4) + hex.indexOf( str.charAt(i) );
    }
    this._asm.push( val );
    return true;
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
 *
 * Il existe aussi la forme suivante :
 * FOR $c IN "Bonjour"
 *   PRINT $c + NL
 * NEXT
 *
 * FOR $c, $i IN "Bonjour"
 *   PEN COLOR($i % 16)
 *   PRINT $c + NL
 * NEXT
 */
function parseFOR( lex ) {
    var tkn = lex.next('VAR');
    if (!tkn) lex.fatal(_('missing-var-after-for'));
    var name = tkn.val;
    tkn = lex.next('EQUAL', 'IN', 'COMMA');
    if (!tkn) lex.fatal(_('missing-for-equal-or-to'));
    if (tkn.val == ',') {
        tkn = lex.next('VAR');
        if (!tkn) lex.fatal(_('missing-var-index-foreach', name));
        // Nom de la variable d'index pour le ForEach.
        var name2 = tkn.val;
        if (!lex.next('IN')) lex.fatal(_('missing-foreach-in'));
        return parseFORE.call( this, lex, name, name2 );
    }
    if (tkn.val == 'IN') return parseFORE.call( this, lex, name );

    // Label of the FOR
    var labelA = this.newLabel();
    // Label of the NEXT
    var labelB = this.newLabel();
    this._asm.push( name, Asm.ERASE );
    this.setLabel( labelA );
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

function parseFORE( lex, varChr, varIdx ) {
    if( typeof varIdx === 'undefined' ) varIdx = 'tmp' + this.nextID();

    var tkn = lex.next('VAR');
    if (!tkn) lex.fatal(_("missing-list-foreach"));
    var varLst = tkn.val;

    // Label of the FOR
    var labelA = this.newLabel();
    // Label of the NEXT
    var labelB = this.newLabel();

    this._asm.push( varIdx, Asm.ERASE );
    this.setLabel( labelA );
    this._context.push({ type: "FOR", labelA: labelA, labelB: labelB });
    this._asm.push( varChr, varIdx, varLst, [labelB], Asm.FORE );
    return true;
}

function parseNEXT( lex ) {
    var ctx = this._context.pop();
    if (!ctx) lex.fatal(_('unexpected-next'));
    if ( ctx.type == 'FOR' ) {
        this._asm.push( [ctx.labelA], Asm.JMP );
        this.setLabel( ctx.labelB );
    } else {
        lex.fatal(_('unexpected-next'));
    }
    return true;
}


/**
 * PRINT text[, pause]
 * If pause is  null, write at once. Otherwise, letters  will be drawn
 * one  after  the  over,  waiting  for  `pause`  frames  between  two
 * consecutive symbols.
 */
function parsePRINT( lex ) {
    if (!parse.call(this, lex, 'expression')) {
        lex.fatal(_('print-missing-arg'));
    }
    this._asm.push( "print.txt", Asm.SET );
    if (lex.next('COMMA')) {
        if (!parse.call(this, lex, 'expression')) {
            lex.fatal(_('print-missing-arg'));
        }
        this._asm.push( "print.frm", Asm.SET );
    } else {
        this._asm.push( 0, "print.frm", Asm.SET );
    }
    if (!lex.next('EOL')) {
        lex.fatal(_('expected-eol'));
    }

    var lblBegin = this.newLabel();
    var lblEnd = this.newLabel();

    this.setLabel( lblBegin );
    this._asm.push( "print.txt", Asm.GET, Asm.LEN, [lblEnd], Asm.JZE );
    this._asm.push( "print.txt", Asm.SHIFT, Asm.ASC, Asm.PRINTCHAR );
    this._asm.push( "print.frm", Asm.GET, Asm.FRAME );
    this._asm.push( [lblBegin], Asm.JMP );
    this.setLabel( lblEnd );

    return true;
}


function parseFunc( lex, func, fixedArgsCount ) {
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

    if (argsCount == 0) {
        if (!lex.next('PAR_CLOSE')) {
            lex.fatal(_('missing-par-close'));
        }
    }

    if (typeof fixedArgsCount === 'number') {
        if (fixedArgsCount != argsCount) {
            lex.fatal(_('fixed-args', func, fixedArgsCount, argsCount));
        }
    } else {
        // Les fonctions qui attendent un nombre variable d'arguments,
        // on besoin de connaitre ce nombre.
        this._asm.push( argsCount );
    }

    this._asm.push( Asm[func] );
    return true;
}


function parseVarArgs( lex, func ) {
    if (typeof Asm[func] !== 'function') {
        lex.fatal(_("unknown-instr", func));
    }
    var argsCount = 0;
    var tkn;
    while (parse.call(this, lex, 'expression')) {
        argsCount++;
        tkn = lex.next('COMMA', 'EOL');
        if (!tkn) lex.fatal(_('unexpected-token'));
        if (tkn.id != 'COMMA') break;
    }

    this._asm.push( argsCount, Asm[func] );
    return true;
}


function parseArgs( lex, instruction, mandatoryCount ) {
    var optionalCount = arguments.length - 3;
    if (mandatoryCount + optionalCount > 0) {
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
