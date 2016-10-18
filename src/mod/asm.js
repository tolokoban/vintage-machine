"use strict";

var Keyboard = require("keyboard");

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
 * PEN[0-3]( color )
 * PEN( color1, [color2, color3, ..., color 7] )
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
var MAX_COST = 40000;
var PRECISION = 0.0000000001;


var Asm = function( bytecode, kernel, runtime ) {
    this._kernel = kernel;
    this._bytecode = bytecode;
    this._cursor = 0;
    this._cost = 0;
    this._runtime = runtime || {
        stack: [],
        // Vars are stored lowercase.
        vars: {
            pen: [0, 1, 2, 3, 4, 5, 6, 7],
            X: 0,
            Y: 0,
            SX: 1,
            SY: 1,
            R: 0,
            cursor: 1
        }
    };

    ['kernel', 'runtime'].forEach(function (name) {
        Object.defineProperty( Asm.prototype, name, {
            get: function() { return this['_' + name]; },
            set: function(v) { this['_' + name] = v; },
            configurable: true,
            enumerable: true
        });
    });
};

module.exports = Asm;


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
    if( !runtime ) runtime = this._runtime;
    else this._runtime = runtime;

    var cmd;
    while (this._cost < MAX_COST) {
        if (this._cursor >= this._bytecode.length) return false;
        cmd = this._bytecode[this._cursor++];
        if (typeof cmd === 'function') {
            this._cost += cmd.call( this );
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
    var x, y, w, h, count = this.popAsNumber();
    if (count == 0) {
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
    var color = this.get("pen")[1];
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
 * Substract 1 to the variable `name` and push the result on the stack.
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
 * PEN( color )
 */
Asm.PEN = function() {
    var count = this.popAsNumber();
    var pen = this.get( 'pen' );
    while (count --> 0) {
        pen[(count + 80001) % 8] = Math.floor(this.popAsNumber()) % 64;
    }
    if (this.kernel) this.kernel.pen( pen );
    return 1;
};

/**
 * PEN0( color )
 */
Asm.PEN0 = function() {
    var pen = this.get('pen');
    pen[0] = Math.floor( this.popAsNumber() ) % 64;
    if (this.kernel) this.kernel.pen( pen );
    return 1;
};

/**
 * PEN1( color )
 */
Asm.PEN1 = function() {
    var pen = this.get('pen');
    pen[1] = Math.floor( this.popAsNumber() ) % 64;
    if (this.kernel) this.kernel.pen( pen );
    return 1;
};

/**
 * PEN2( color )
 */
Asm.PEN2 = function() {
    var pen = this.get('pen');
    pen[2] = Math.floor( this.popAsNumber() ) % 64;
    if (this.kernel) this.kernel.pen( pen );
    return 1;
};

/**
 * PEN3( color )
 */
Asm.PEN3 = function() {
    var pen = this.get('pen');
    pen[3] = Math.floor( this.popAsNumber() ) % 64;
    if (this.kernel) this.kernel.pen( pen );
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
    return 2;
};

/**
 * SET( name, value )
 */
Asm.SET = function() {
    var value = this.pop();
    var name = "" + this.pop();
    this.set( name, value );
    return 3;
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
 * JGT( n, addr )
 * Jump to address `addr` if `n` is greater than zero.
 */
Asm.JGT = function() {
    var addr = this.popAsNumber();
    var n = this.popAsNumber();
    if (n > 0) {
        this._cursor = addr;
    }
    return 1;
};

/**
 * JLT( n, addr )
 * Jump to address `addr` if `n` is lower than zero.
 */
Asm.JLT = function() {
    var addr = this.popAsNumber();
    var n = this.popAsNumber();
    if (n < 0) {
        this._cursor = addr;
    }
    return 1;
};

/**
 * JGT( n, addr )
 * Jump to address `addr` if `n` is greater than zero.
 */
Asm.JGE = function() {
    var addr = this.popAsNumber();
    var n = this.popAsNumber();
    if (n >= 0) {
        this._cursor = addr;
    }
    return 1;
};

/**
 * JLT( n, addr )
 * Jump to address `addr` if `n` is lower than zero.
 */
Asm.JLE = function() {
    var addr = this.popAsNumber();
    var n = this.popAsNumber();
    if (n <= 0) {
        this._cursor = addr;
    }
    return 1;
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
    var a = this.pop();
    // Addnig to a string.
    if (typeof a === 'string') {
        b = '' + b;
        this.push( a + b );
        return a.length + b.length + 2;
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
Asm['?'] = function() {
    var count = this.popAsNumber();
    var b = this.pop();
    var a = this.pop();
    var cond = this.popAsNumber();
    if (cond == 0) this.push( b );
    else this.push( a );
    return 1;
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
