/** @module asm */require( 'asm', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
    "use strict";

var Keyboard = require("keyboard");
var Speak = require("speak");

/**
 * @module asm
 *
 * @description
 * This is the internal assembly language of the Tlk-64 computer.
 *
 * The bytecode is an array. Each element which is a function is executed,
 * the others are just pushed on the execution stack.
 *
 * @example
 * var Asm = require('asm');
 * var asm = new Asm( kernel, bytecode );
 * var runtime = {
 *   stack: []
 * };
 * asm.next( runtime )
 *
 * =========================================================
 * ERASE( var )
 * FOR( var, a, b, step, jmp )
 * PEN( color1, [color2, color3, ..., color 7] )
 * PAPER( color0 )
 * AND( a, b )
 * OR( a, b )
 * XOR( a, b )
 * ADD( a, b )
 * SUB( a, b )
 * MUL( a, b )
 * DIV( a, b )
 * ABS( a )
 * NEG( a )
 * JMP( addr )
 * JZE( n, addr )
 * JNZ( n, addr )
 * JGT( n, addr )
 * JLT( n, addr )
 * JGE( n, addr )
 * JLE( n, addr )
 * GET( name ) -> valut
 * SET( name, value )
 * LET( name )
 * RND() -> number
 * DEC( name ) -> number
 * POINT( x, y, color )
 * TRIS()
 * TRIANGLE( x1, y1, x2, y2, x3, y3 )
 * BOX( x, y, w, h )
 * FRAME( n )
 * KEY( id )
 */

// Every atomic instruction has a time cost.
// The cost allower between two requestAnimationFrames is `MAX_COST`.
var MAX_COST = 80000;
var PRECISION = 0.0000000001;


var Asm = function( bytecode, kernel, runtime ) {
    var that = this;

    this._bytecode = bytecode;
    this._cursor = 0;
    this._cost = 0;
    this.runtime = runtime || {
        stack: [],
        // Vars are stored lowercase.
        vars: {
            pen: [0xF000, 0xFFF, 0xF00, 0x0F0, 0x00F, 0x0FF, 0xF0F, 0xFF0],
            x: 8,
            y: 472,
            sx: 1,
            sy: 1,
            r: 0,
            cursor: 1
        }
    };
    Object.defineProperty( Asm.prototype, 'kernel', {
        get: function() { return this._kernel; },
        set: function(v) {
            this._kernel = v;
            that.runtime.vars.pen.forEach(function (color, pencil) {
                v.pen( pencil, color );
            });
        },
        configurable: true,
        enumerable: true
    });
    if (typeof kernel !== 'undefined') this.kernel = kernel;
};

module.exports = Asm;


Asm.prototype.printChar = function(code) {
    var x = this.get("X");
    var y = this.get("Y");
    if (code == 10) {
        // New line.
        this.set("X", 8);
        y -= this.get("SY") * 16;
        if (y < 0) y += 480;
        this.set("Y", y);
        return;
    }

    if ("^~°`´¨".indexOf(String.fromCharCode(code)) != -1) {
        // This is an accent, we should go back.
        x -= this.get("SX") * 16;
        if (x < 0) {
            x += 640;
            y += this.get("SY") * 16;
            if (y > 479) y -= 480;
            this.set("y", y);
        }
        this.set("x", x);
    }

    var i = (code & 15) << 4;
    code >>= 4;
    var j = (code & 15) << 4;
    code >>= 4;
    var layer = code;

    this.kernel.sprite(
        layer, i, j,
        x, y, 16, 16,
        this.get("SX"), this.get("SY"), this.get("R")
    );

    x += this.get("SX") * 16;
    if (x > 639) {
        this.set("x", x - 640);
        y -= this.get("SY") * 16;
        if (y < 0) y += 480;
        this.set("y", y);
    } else {
        this.set("X", x);
    }
};

/**
 * @return void
 */
Asm.prototype.reset = function() {
    this._cost = 0;
    this._cursor = 0;
};


/**
 * @return void
 */
Asm.prototype.next = function( runtime ) {
    if( !runtime ) runtime = this.runtime;
    else this.runtime = runtime;

    var cmd, cost;
    while (this._cost < MAX_COST) {
        if (this._cursor >= this._bytecode.length) return false;
        cmd = this._bytecode[this._cursor++];
        if (typeof cmd === 'function') {
            cost = parseInt(cmd.call( this ));
            if (isNaN( cost )) cost = 0;
            this._cost += cost;
        } else {
            this._cost++;
            this.push( cmd );
        }
    }
    this._cost -= MAX_COST;

    return true;
};

/**
 * @return void
 */
Asm.prototype.push = function(value) {
    this._cost++;
    this.runtime.stack.push( value );
};

Asm.prototype.pop = function(value) {
    if( this.runtime.stack.length == 0 ) return undefined;
    this._cost++;
    return this.runtime.stack.pop();
};

/**
 * @return void
 */
Asm.prototype.exists = function(name) {
    return typeof this.runtime.vars[('' + name).trim().toLowerCase()] !== 'undefined';
};

/**
 * Pop a value from the stack and convert it into a number.
 * If such a conversion is impossible, return 0.
 */
Asm.prototype.popAsNumber = function() {
    this._cost++;
    var v = parseFloat(this.pop() || 0);
    if (isNaN(v)) return 0;
    return v;
};

/**
 * Les appels de fonctions se font  en plaçant les arguments ainsi que
 * le nombre d'arguments  sur la pile.  `popArgs`  retourne un tableau
 * avec  les  arguments  dans  l'ordre,  en  ignorant  si  besoin  les
 * arguments en trop.
 */
Asm.prototype.popArgs = function( maxCount ) {
    if( typeof maxCount === 'undefined' ) maxCount = Number.MAX_VALUE;
    maxCount = Math.max( 0, Math.floor( maxCount ) );
    var count = this.popAsNumber();
    while (count > maxCount) {
        // On ignore les arguments en trop.
        this.pop();
        count--;
    }
    var args = [];
    while (count --> 0) {
        args.unshift( this.pop() );
    }
    return args;
};


/**
 * Read a variable.
 */
Asm.prototype.get = function( name ) {
    name = '' + name;
    var v = this.runtime.vars[name.trim().toLowerCase()];
    if( typeof v === 'undefined' ) v = 0;
    this._cost += 2;
    return v;
};

/**
 * Read a variable.
 */
Asm.prototype.set = function( name, value ) {
    name = '' + name;
    this.runtime.vars[name.trim().toLowerCase()] = value;
    this._cost += 3;
};

/**
 * Read a variable.
 */
Asm.prototype.erase = function( name ) {
    name = '' + name;
    delete this.runtime.vars[name.trim().toLowerCase()];
};

/**
 * Read a variable converted into a number.
 */
Asm.prototype.getAsNumber = function( name ) {
    name = '' + name;
    var v = parseFloat(this.runtime.vars[name.trim().toLowerCase()]);
    if (isNaN(v)) return 0;
    return v;
};


Asm.prototype.isNumber = function( v ) {
    if (typeof v === 'number') return true;
    var n = parseFloat( v );
    return isNaN( n ) ? false : true;
};

Asm.prototype.asNumber = function( v ) {
    if (typeof v === 'number') return v;
    var n = parseFloat( v );
    return isNaN( n ) ? 0 : n;
};

/**
 * @return void
 */
Asm.prototype.skipFrame = function( nbFrames ) {
    if( typeof nbFrames === 'undefined' ) nbFrames = 1;
    this._cost = MAX_COST * nbFrames;
    return 0;
};

Asm.SPEAK = function() {
    var txt = "" + this.pop();
    Speak.speak( txt );
    return 10;
};

/**
 * LEN( str )
 */
Asm.LEN = function() {
    var arg = this.pop();
    var result = 0;
    if (Array.isArray( arg ) || typeof arg === 'string') result = arg.length;
    else if (typeof arg === 'number') result = ("" + arg).length;
    this.push( result );
    return 1;
};

/**
 * COLOR( val ) : gris
 * COLOR( val, alpha )
 * COLOR( red, green, blue )
 * COLOR( red, green, blue, alpha )
 *
 * Values between 0 and 15.
 */
Asm.COLOR = function() {
    var args = this.popArgs(4);
    args.map(function(itm) {
        var v = parseInt(itm);
        if (isNaN(v)) v = 0;
        v %= 16;
        while (v < 0) v += 16;
        return v;
    });

    var color = 0;
    switch( args.length ) {
    case 1:
        color = args[0] * 0x111;
        break;
    case 2:
        color = args[0] * 0x111 + (15 - args[3]) * 0x1000;
        break;
    case 3:
        color = args[0] * 0x100 + args[1] * 0x10 + args[2];
        break;
    case 4:
        color = args[0] * 0x100 + args[1] * 0x10 + args[2] + (15 - args[3]) * 0x1000;;
        break;
    }

    this.push( color );
    return 1;
};

/**
 * DISK( radius )
 * DISK( rx, ry )
 */
Asm.DISK = function() {
    var x = this.get("x");
    var y = this.get("y");
    var pen = this.get("pen")[1];
    var color = this.kernel.expandColor(pen);
    var args = this.popArgs(3);
    var rx = 100;
    var ry = 100;
    var ang = 0;
    if (args.length == 1) {
        rx = parseFloat(args[0]);
        ry = rx;
    }
    else if (args.length == 2) {
        rx = parseFloat(args[0]);
        ry = parseFloat(args[1]);
    }
    else if (args.length == 3) {
        rx = parseFloat(args[0]);
        ry = parseFloat(args[1]);
        ang = parseFloat(args[2]);
    }
    this.kernel.disk( x, y, rx, ry, ang, color[0], color[1], color[2], color[3] );
    return rx * ry / 256;
};

/**
 * COS( ang )
 * Angles in degree.
 */
Asm.COS = function() {
    var ang = this.popAsNumber() * Math.PI / 180;
    this.push( Math.cos(ang) );
    return 15;
};

/**
 * SIN( ang )
 * Angles in degree.
 */
Asm.SIN = function() {
    var ang = this.popAsNumber() * Math.PI / 180;
    this.push( Math.sin(ang) );
    return 15;
};

/**
 * ASC( str )
 */
Asm.ASC = function() {
    var arg = this.pop();
    if (typeof arg === 'number' || typeof arg === 'string') {
        var c = ("" + arg).charCodeAt(0);
        this.push( c );
    } else {
        this.push( 0 );
    }
    return 0;
};

/**
 * CHR( code, ... )
 */
Asm.CHR = function() {
    var arg = this.popArgs();
    var txt = '';
    arg.forEach(function (code) {
        txt += String.fromCharCode(parseInt( code ) || 0);
    });
    this.push( txt );
    return 0;
};

/**
 * SHIFT( $var )
 */
Asm.SHIFT = function() {
    var varName = "" + this.pop();
    var value = this.get(varName);
    if (Array.isArray( value )) {
        if (value.length > 0) {
            this.push( value .shift() );
            this.set( varName, value );
        } else {
            this.push( 0 );
        }
    }
    else {
        value = "" + value;
        this.push( value.charAt(0) );
        this.set( varName, value.substr( 1 ) );
    }
    return 1;
};

/**
 * FRAME( n )
 * Just wait for the next `n` frames.
 */
Asm.FRAME = function() {
    var framesCount = this.popAsNumber();
    if (framesCount < 1) return 0;
    return MAX_COST * framesCount - this._cost;
};

/**
 * INK( index, color1, color2 )
 */
Asm.INK = function() {
    var color2 = Math.floor( this.popAsNumber() );
    var color1 = Math.floor( this.popAsNumber() );
    var index = Math.floor( this.popAsNumber() ) % 64;
    if (color2 == -1) color2 = color1;
    var b2 = color2 % 16;
    color2 >>= 4;
    var g2 = color2 % 16;
    color2 >>= 4;
    var r2 = color2 % 16;
    var b1 = color1 % 16;
    color1 >>= 4;
    var g1 = color1 % 16;
    color1 >>= 4;
    var r1 = color1 % 16;
    if (this.kernel) this.kernel.ink( index, r1, g1, b1, r2, g2, b2 );
    return 1;
};

/**
 * POINT( x, y color )
 */
Asm.POINT = function() {
    var color = this.popAsNumber();
    var y = this.popAsNumber();
    var x = this.popAsNumber();
    if (this.kernel) {
        this.kernel.point( x, y, color );
    }
    return 5;
};

/**
 * TRIS()
 */
Asm.TRIS = function() {
    if (this.kernel) {
        this.kernel.triangles();
    }
    return 10;
};

/**
 * TRIANGLE( x1, y1, x2, y2, x3, y3 )
 */
Asm.TRIANGLE = function() {
    var y3 = this.popAsNumber();
    var x3 = this.popAsNumber();
    var y2 = this.popAsNumber();
    var x2 = this.popAsNumber();
    var y1 = this.popAsNumber();
    var x1 = this.popAsNumber();
    var color = this.get("pen")[1];
    if (this.kernel) {
        this.kernel.point( x1, y1, color );
        this.kernel.point( x2, y2, color );
        this.kernel.point( x3, y3, color );
        this.kernel.triangles();
    }
    return 25;
};

/**
 * BOX()
 * BOX( size )
 * BOX( w, h )
 * BOX( x, y, size )
 * BOX( x, y, w, h )
 */
Asm.BOX = function() {
    return box.call( this, this.get("pen")[1]);
};
/**
 * CLS()
 * CLS( size )
 * CLS( w, h )
 * CLS( x, y, size )
 * CLS( x, y, w, h )
 */
Asm.CLS = function() {
    this.kernel.blend( false );
    var cost = box.call( this, this.get("pen")[0]);
    this.kernel.blend( true );
    return cost;
};

/**
 * BACK( color )
 * Chnge la couleur de l'arrière plan.
 */
Asm.BACK = function() {
  var duration = this.popAsNumber();
  var colorIdx = this.popAsNumber();
  var color = this.kernel.expandColor( colorIdx );
  document.body.style.transition = "background " + duration + "ms";
  document.body.style.background = "rgb(" +
      color[0]*255 + "," +
      color[1]*255 + "," +
      color[2]*255 + ")";
};

function box(color) {
    var x, y, w, h, count = this.popAsNumber();
    if (count === 0) {
        x = 0;
        y = 0;
        w = 640;
        h = 480;
    }
    else if (count == 1) {
        w = this.popAsNumber();
        h = w;
        x = this.get("X") - w/2;
        y = this.get("Y") - h/2;
    }
    else if (count == 2) {
        h = this.popAsNumber();
        w = this.popAsNumber();
        x = this.get("X") - w/2;
        y = this.get("Y") - h/2;
    }
    else if (count == 3) {
        h = this.popAsNumber();
        w = h;
        y = this.popAsNumber();
        x = this.popAsNumber();
    }
    else {
        while (count --> 4) {
            this.pop();
        }
        h = this.popAsNumber();
        w = this.popAsNumber();
        y = this.popAsNumber();
        x = this.popAsNumber();
    }
    if (this.kernel) {
        this.kernel.point( x, y, color );
        this.kernel.point( x + w, y, color );
        this.kernel.point( x, y + h, color );
        this.kernel.point( x + w, y + h, color );
        this.kernel.triStrip();
    }
    return w * h / 256;
};

/**
 * RND([a[,b]])
 * Push a random number between 0.0 and 1.0.
 */
Asm.RND = function() {
    var count = this.popAsNumber();
    if (count == 0) this.push( Math.random() );
    else {
        var a = this.popAsNumber();
        if (count == 1) this.push( Math.ceil( Math.random() * a ) );
        else {
            var b = this.popAsNumber();
            if (b < a) {
                var tmp = a;
                a = b;
                b = tmp;
            }
            this.push( Math.floor( a + Math.random() * (1 + b - a) ) );
            while (count > 2) {
                this.pop();
                count--;
            }
        }
    }
    return 2;
};

/**
 * Attend qu'une touche soit frappée et place sa KEY sur la pile.
 */
Asm.WAIT = function() {
    var last = Keyboard.last();
    if (!last) {
        // Wait a frame an loop.
        this._cursor--;
        return MAX_COST - this._cost;
    }

    this.push( last.key );
    return 0;
};


Asm.ASK = function() {
    ask.call(this);
};


Asm.ASKNUM = function() {
    ask.call(this, function(key) {
        return "0123456789.-".indexOf( key ) != -1;
    }, function(val) {
        return parseFloat(val);
    });
};

/**
 * Displays a cursor at a text position.
 */
function showCursor(x, y, color) {
    this.kernel.blend( false );
    this.kernel.point( x-8, y-8, color );
    this.kernel.point( x+8, y-8, color );
    this.kernel.point( x-8, y+8, color );
    this.kernel.point( x+8, y+8, color );
    this.kernel.triStrip();
    this.kernel.blend( true );
}

function ask(filter, converter) {
    if( typeof filter === 'undefined' ) filter = function() { return true; };
    if( typeof converter === 'undefined' ) converter = function(v) { return v; };

    if (this.get("ask.txt") === 0) {
        this.set("ask.txt", '');
        this.set("ask.cursor", Date.now());
        var args = this.popArgs();
        var msg = args.join("\n");
        for (var k = 0; k < msg.length; k++) {
            this.printChar(msg.charCodeAt(k));
        }
        // Wait a frame and loop.
        this._cursor--;
        return this.skipFrame();
    }

    // Display cursor.
    var x = this.get('x');
    var y = this.get('y');
    var sx = this.get('sx');
    var sy = this.get('sy');
    var time = (Date.now() - this.get('ask.cursor')) % 1000;
    var pen = this.get('pen');
    var color = pen[time < 500 ? 1 : 0];
    showCursor.call(this, x, y, color);

    var last = Keyboard.last();
    if (!last) {
        // Wait a frame and loop.
        this._cursor--;
        return this.skipFrame();
    }

    var key = last.key;
    if (key.length == 1 && filter(key)) {
        // C'est un caractère à écrire.
        if (!Keyboard.test("SHIFT")) key = key.toLowerCase();
        this.set("ask.txt", this.get("ask.txt") + key);
        var asc = key.charCodeAt(0);
        color = pen[0];
        showCursor.call( this, x, y, color );
        this.kernel.sprite(0, 16 * (asc % 16), 16 * Math.floor( asc / 16 ),
                           this.get("X"), this.get("Y"),
                           16, 16, 1, 1, 0);
        x = this.get("X") + 16;
        if (x > 639) {
            x -= 640;
            this.set("Y", this.get("Y") - 16);
        }
        this.set("X", x);
    } else if (key == 'BACKSPACE' && this.get('ask.txt').length > 0) {
        color = pen[0];
        showCursor.call( this, x, y, color );
        var txt = this.get('ask.txt');
        this.set('ask.txt', txt.substr(0, txt.length - 1));
        x = this.get("X") - 16;
        if (x < 0) {
            x += 640;
            y = this.get('Y') + 16;
            if (y > 479) {
                y -= 480;
                this.set('Y', y);
            }
        }
        this.set("X", x);
    } else if (key == 'ENTER') {
        color = pen[0];
        showCursor.call( this, x, y, color );
        this.push(converter(this.get("ask.txt")));
        this.set("X", 8);
        this.set("Y", this.get("Y") - 16);
        this.set("ask.txt", 0);
        return 0;
    }
    this._cursor--;
    return this.skipFrame();
};

/**
 * DEC( name )
 * Substract 1 to the variable `name` and push the result on the stack.
 * Usefull for loops.
 */
Asm.DEC = function() {
    var name = "" + this.pop();
    var val = this.get( name ) - 1;
    this.set( name, val );
    this.push( val );
    return 1;
};

/**
 * INC( name )
 * Add 1 to the variable `name` and push the result on the stack.
 * Usefull for loops.
 */
Asm.INC = function() {
    var name = "" + this.pop();
    var val = this.get( name ) + 1;
    this.set( name, val );
    this.push( val );
    return 1;
};

/**
 * VARADD( name, value )
 * Add `value` to the variable `name` and push the result on the stack.
 */
Asm.VARADD = function() {
    var name = "" + this.pop();
    var value = this.pop();
    var out = this.get( name );
    if (Array.isArray( out )) {
        if (Array.isArray( value )) {
            // L'ajout de deux tableaux force la concaténation des deux.
            out.push.apply( out, value );
        } else {
            // Sinon, on ajoute l'élément à la fin du tableau.
            out.push( value );
        }
    }
    else {
        out += value;
    }
    this.set( name, out );
    this.push( out );
    return 1;
};

/**
 * PEN( color )
 */
Asm.PEN = function() {
    var pen = this.get('pen');
    var count = this.popAsNumber();
    var color, idx;
    while (count --> 0) {
        color = Math.abs(Math.floor(this.popAsNumber()));
        idx = count & 7;
        this.kernel.pen(idx + 1, color);
        pen[idx + 1] = color;
    }
    return 7;
};

/**
 * PAPER( color )
 * Equivalent to PEN0( color )
 */
Asm.PAPER = function() {
    var pen = this.get('pen');
    var color = Math.floor(this.popAsNumber());
    this.kernel.pen(0, color);
    pen[0] = color;
    return 1;
};

/**
 * GET( name )
 * Return 0 for unexistant variables.
 */
Asm.GET = function() {
    var name = "" + this.pop();
    var value = this.get(name);
    this.push( value );
    return 0;
};

/**
 * SET( value, name )
 */
Asm.SET = function() {
    var name = "" + this.pop();
    var value = this.pop();
    this.set( name, value );
    return 0;
};

/**
 * JMP( addr )
 * Jump to address `addr`.
 */
Asm.JMP = function() {
    var addr = this.popAsNumber();
    this._cursor = addr;
    return 1;
};

/**
 * JZE( n, addr )
 * Jump to address `addr` if `n` is zero.
 */
Asm.JZE = function() {
    var addr = this.popAsNumber();
    var n = this.popAsNumber();
    if (n == 0) {
        this._cursor = addr;
    }
    return 1;
};

/**
 * JNZ( n, addr )
 * Jump to address `addr` if `n` is NOT zero.
 */
Asm.JNZ = function() {
    var addr = this.popAsNumber();
    var n = this.popAsNumber();
    if (n != 0) {
        this._cursor = addr;
    }
    return 1;
};

/**
 * JGT( a, b, addr )
 * Jump to address `addr` if `a` is greater than `b`.
 */
Asm.JGT = function() {
    var addr = this.popAsNumber();
    var b = this.popAsNumber();
    var a = this.popAsNumber();
    if (a > b) {
        this._cursor = addr;
    }
    return 0;
};

/**
 * JLT( a, b, addr )
 * Jump to address `addr` if `a` is lower than `b`.
 */
Asm.JLT = function() {
    var addr = this.popAsNumber();
    var b = this.popAsNumber();
    var a = this.popAsNumber();
    if (a < b) {
        this._cursor = addr;
    }
    return 0;
};

/**
 * JGT( a, b, addr )
 * Jump to address `addr` if `a` is greater or equal than `b`.
 */
Asm.JGE = function() {
    var addr = this.popAsNumber();
    var b = this.popAsNumber();
    var a = this.popAsNumber();
    if (a >= b) {
        this._cursor = addr;
    }
    return 0;
};

/**
 * JLE( a, b, addr )
 * Jump to address `addr` if `a` is lower or equal than `b`.
 */
Asm.JLE = function() {
    var addr = this.popAsNumber();
    var b = this.popAsNumber();
    var a = this.popAsNumber();
    if (a <= b) {
        this._cursor = addr;
    }
    return 0;
};

Asm.DEBUGGER = function() {
    debugger;
    return 0;
};

/**
 * ABS(a) -> Math.abs( a )
 * Absolute value of `a`.
 */
Asm.ABS = function() {
    this.push( Math.abs( this.popAsNumber() ) );
    return 0;
};

/**
 * NEG(a) -> -a
 * Negate the value of `a`.
 */
Asm.NEG = function() {
    this.push( - this.popAsNumber() );
    return 0;
};

/**
 * Pop two numbers on the stack and push the addition of them.
 */
Asm.ADD = function() {
    var b = this.pop();
    if( typeof b === 'undefined' ) {
      this.push( 0 );
      return;
    }
    var a = this.pop();
    if( typeof a === 'undefined' ) {
      this.push( b );
      return;
    }
    // Adding to an array: concat/push.
    if (Array.isArray( a )) {
        if (Array.isArray( b )) {
            a.push.apply( a, b );
            this.push( a );
            this._cost += b.length;
        } else {
            a.push( b );
            this.push( a );
        }
        return 1;
    }
    // Adding to a string means concatenate into a string.
    if ( isNaN(a) || isNaN(b) ) {
        a = '' + a;
        b = '' + b;
        this.push( a + b );
        return a.length + b.length + 2;
    }
    // Adding to a number.
    this.push( this.asNumber( a ) + this.asNumber( b ) );
    return 1;
};

/**
 * Pop two numbers on the stack and push the multiplication of them.
 */
Asm.MUL = function() {
    this.push( this.popAsNumber() * this.popAsNumber() );
    return 2;
};

/**
 * Pop two numbers on the stack and push the division of them.
 */
Asm.DIV = function() {
    var b = this.popAsNumber();
    var a = this.popAsNumber();
    if (a == 0) {
        this.push(0);
        return 0;
    }
    // Protection against division by zero
    if (Math.abs(b) < PRECISION) {
        this.push( a >= 0 ? Number.MAX_VALUE : -Number.MAX_VALUE );
        return 1;
    }
    this.push( a / b );
    return 4;
};

/**
 * Pop two numbers on the stack and push the substraction of them.
 */
Asm.SUB = function() {
    this.push( - this.popAsNumber() + this.popAsNumber() );
    return 1;
};

/**
 * Pop 2 numbers and push AND of them.
 */
Asm.AND = function() {
    var b = this.popAsNumber();
    var a = this.popAsNumber();
    var c = 1;
    if (a == 0) c = 0;
    else if (b == 0) c = 0;
    this.push( c );
    return 1;
};

/**
 * Pop 2 numbers and push OR of them.
 */
Asm.OR = function() {
    var b = this.popAsNumber();
    var a = this.popAsNumber();
    var c = 0;
    if (a != 0) c = 1;
    else if (b != 0) c = 1;
    this.push( c );
    return 1;
};

/**
 * Pop 2 numbers and push XOR of them.
 */
Asm.XOR = function() {
    var b = this.popAsNumber() && 1;
    var a = this.popAsNumber() && 1;
    var c = 0;
    if (a != 0) c = 1;
    else if (b != 0) c = 1;
    this.push( c );
    return 1;
};

/**
 * Pop 2 values and push 1 if `a` >= `b`.
 */
Asm.GEQ = function() {
    var b = this.pop();
    var a = this.pop();
    this.push( a >= b ? 1 : 0 );
    return 1;
};

/**
 * Pop 2 values and push 1 if `a` <= `b`.
 */
Asm.LEQ = function() {
    var b = this.pop();
    var a = this.pop();
    this.push( a <= b ? 1 : 0 );
    return 1;
};

/**
 * Pop 2 values and push 1 if `a` > `b`.
 */
Asm.GT = function() {
    var b = this.pop();
    var a = this.pop();
    this.push( a > b ? 1 : 0 );
    return 1;
};

/**
 * Pop 2 values and push 1 if `a` < `b`.
 */
Asm.LT = function() {
    var b = this.pop();
    var a = this.pop();
    this.push( a < b ? 1 : 0 );
    return 1;
};

/**
 * Pop 2 numbers and push the modulo of a by b.
 * If `b` is null, the result is 0.
 */
Asm.MOD = function() {
    var b = this.popAsNumber();
    var a = this.popAsNumber();
    if (Math.abs(b) < PRECISION) this.push( 0 );
    else {
        var c = a % b;
        if (c < 0) c += b;
        this.push( c );
    }
    return 1;
};

/**
 * Pop 2 numbers and push the expoential of a by b.
 */
Asm.EXP = function() {
    var b = this.popAsNumber();
    var a = this.popAsNumber();
    this.push( Math.pow(a, b) );
    return 15;
};

/**
 * Pop 2 values and push 1 if they are equal, 0 otherwise.
 */
Asm.EQ = function() {
    var b = this.pop();
    var a = this.pop();
    this.push( a == b ? 1 : 0 );
    return 1;
};

/**
 * Pop 2 values and push 1 if they are NOT equal, 0 otherwise.
 */
Asm.NEQ = function() {
    var b = this.pop();
    var a = this.pop();
    this.push( a != b ? 1 : 0 );
    return 1;
};

/**
 * ERASE( var )
 * Erase the variable `var`.
 */
Asm.ERASE = function() {
    var name = this.pop();
    delete this.erase(name);
    return 0;
};

/**
 * KEY( id )
 * @return 1 if the key `id` is currently pressed.
 */
Asm.KEY = function() {
    var count = this.popAsNumber();
    if (count == 0) {
        this.push( 0 );
        return 0;
    }

    var result = 1;
    while (count --> 0) {
        var id = "" + this.pop();
        if (!Keyboard.test( id )) result = 0;
    }
    this.push( result );
    return 1;
};

/**
 * ?( cond, true-value, false-value )
 */
Asm.IIF = function() {
    var falseVal = this.pop();
    var trueVal = this.pop();
    var cond = this.popAsNumber();
    if (cond == 0) this.push( falseVal );
    else this.push( trueVal );
    return 0;
};

/**
 * FORE( varItem, varIndex, varList, jmp )
 */
Asm.FORE = function() {
    var jmp = this.popAsNumber();
    var varLst = "" + this.pop();
    var varIdx = "" + this.pop();
    var varChr = "" + this.pop();
    var lst = this.get(varLst);
    var idx = parseInt(this.get(varIdx));
    if (isNaN(idx)) idx = 0;
    var chr = this.get(varChr);
    var len = lst ? lst.length || 0 : 0;
    if (idx >= len) {
        this._cursor = jmp;
        return 1;
    }
    if (typeof lst === 'string') {
        this.set(varChr, lst.charAt(idx));
    } else {
        this.set(varChr, lst[idx]);
    }
    this.set(varIdx, idx + 1);
    return 3;
};

/**
 * FOR( var, a, b, step, jmp )
 */
Asm.FOR = function() {
    var jmp = Math.floor(this.popAsNumber());
    var step = this.popAsNumber();
    var b = this.popAsNumber();
    var a = this.popAsNumber();
    var c;
    var name = this.pop().toLowerCase();
    if (this.exists( name )) {
        c = this.getAsNumber(name) + step;

    } else {
        c = a;
    }
    this.set(name, c);
    a = Math.min(a, b);
    b = Math.max(a, b);
    if (c < a || c > b) {
        // Out of range, then jump.
        this._cursor = jmp;
    }
    return 5;
};

/**
 * LOCATE( col, row )
 */
Asm.LOCATE = function() {
    var row = Math.floor(this.popAsNumber()) % 30;
    while( row < 0 ) row += 30;
    var col = Math.floor(this.popAsNumber()) % 40;
    while( col < 0 ) row += 40;
    this.set("X", (col << 4) + 8);
    this.set("Y", 480 - ((row << 4) + 8));
    return 0;
};

/**
 * MOVE( x, y )
 */
Asm.MOVE = function() {
    var y = Math.floor(this.popAsNumber());
    var x = Math.floor(this.popAsNumber());
    this.set("X", x);
    this.set("Y", y);
    return 0;
};

/**
 * MOVER( x, y )
 * More relative.
 */
Asm.MOVER = function() {
    var y = Math.floor(this.popAsNumber());
    var x = Math.floor(this.popAsNumber());
    this.set("X", x + this.get("X"));
    this.set("Y", y + this.get("Y"));
    return 0;
};

/**
 * SPRITE( index[, width, height] )
 */
Asm.SPRITE = function() {
    var h = this.popAsNumber();
    var w = this.popAsNumber();
    var idx = this.popAsNumber();
    if (this.kernel) {
        var x = (idx & 15) << 4;
        idx >>= 4;
        var y = (idx & 15) << 4;
        idx >>= 4;
        var layer = idx;
        this.kernel.sprite(
            layer, x, y,
            this.get("X"), this.get("Y"), w << 4, h << 4,
            this.get("SX"), this.get("SY"), this.get("R") );
    }
    return 3*w*h;
};

/**
 * PRINTCHAR( code )
 * Print the char from its code. Then, push the cursor forward.
 * For special chars, get back to previous char : ^"`´~°
 */
Asm.PRINTCHAR = function() {
    var code = Math.floor(this.popAsNumber());
    this.printChar( code );
    return 1;
};


  
module.exports._ = _;
/**
 * @module asm
 * @see module:$
 * @see module:keyboard
 * @see module:speak

 */
});