"use strict";

/**
 * @module asm
 *
 * @description
 * This is the internal assembly language of the Tlk-64 computer.
 *
 * The code is an array. Each element which is a function is executed,
 * the others are just pushed on the execution stack.
 * 
 * @example
 * var Asm = require('asm');
 * var asm = new Asm( kernel, code );
 * var runtime = {
 *   stack: []
 * };
 * asm.next( runtime )
 *
 * =========================================================
 * ERASE( var )
 * FOR( var, a, b, step, jmp )
 * PEN[0-3]( color )
 * AND( a, b )
 * OR( a, b )
 * XOR( a, b )
 * ADD( a, b )
 * SUB( a, b )
 * MUL( a, b )
 * DIV( a, b )
 * ABS( a )
 * NEG( a )
 * JMP( delta )
 * JZE( n, delta )
 * JNZ( n, delta )
 * JGT( n, delta )
 * JLT( n, delta )
 * JGE( n, delta )
 * JLE( n, delta )
 * GET( name ) -> valut
 * SET( name, value )
 * LET( name )
 * RND() -> number
 * DEC( name ) -> number
 * POINT( x, y, color )
 * TRIANGLE()
 * FRAME( n )
 */

// Every atomic instruction has a time cost.
// The cost allower between two requestAnimationFrames is `MAX_COST`.
var MAX_COST = 10000;
var PRECISION = 0.0000000001;


var Asm = function( code, kernel, runtime ) {
    this._kernel = kernel;
    this._code = code;
    this._cursor = 0;
    this._cost = 0;
    this._runtime = runtime || {
        stack: [],
        // Vars are stored lowercase.
        vars: {
            pen0: 0,
            pen1: 1,
            pen2: 2,
            pen3: 3,
            locateX: 0,
            locateY: 0,
            cursor: 1
        },
        lets: {}
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
Asm.prototype.next = function( runtime ) {
    if( !runtime ) runtime = this._runtime;
    else this._runtime = runtime;

    var cmd;
    while (this._cost < MAX_COST) {
        if (this._cursor >= this._code.length) return false;
        cmd = this._code[this._cursor++];
        if (typeof cmd === 'function') {
            this._cost += cmd.call( this );
        } else {
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
    var v = this.runtime.vars[name.trim().toLowerCase()];
    if( typeof v === 'undefined' ) v = 0;
    return v;
};

/**
 * Read a variable.
 */
Asm.prototype.set = function( name, value ) {
    this.runtime.vars[name.trim().toLowerCase()] = value;
};

/**
 * Read a variable.
 */
Asm.prototype.erase = function( name ) {
    delete this.runtime.vars[name.trim().toLowerCase()];
};

/**
 * Read a variable converted into a number.
 */
Asm.prototype.getAsNumber = function( name ) {
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
 * TRIANGLE()
 */
Asm.TRIANGLE = function() {
    if (this.kernel) {
        this.kernel.triangles();
    }
    return 10;
};

/**
 * RND()
 * Push a random number between 0.0 and 1.0.
 */
Asm.RND = function() {
    this.push( Math.random() );
    return 2;
};

/**
 * DEC( name )
 * Substract 1 to the variable `name` and push the result on the stack.
 * Usefull for loops.
 */
Asm.DEC = function() {
    var name = "" + this.pop();
    var value;
    if (typeof this.runtime.lets[name] !== 'undefined') {
        value = parseFloat(this.runtime.lets[name]);
        if (isNaN( value )) value = 0;
        value--;
        this.runtime.lets[name] = value;
    } else {
        value = this.getAsNumber(name);
        value--;
        this.set(name, value);
    }
    this.push( value );
    return 2;
};

/**
 * PEN( color )
 */
Asm.PEN = function() {
    var color = this.popAsNumber();
    this.set('pen0', Math.floor(color) );
    return 0;
};

/**
 * PEN0( color )
 */
Asm.PEN0 = function() {
    var color = this.popAsNumber();
    this.set('pen0', Math.floor(color) );
    return 0;
};

/**
 * PEN1( color )
 */
Asm.PEN1 = function() {
    var color = this.popAsNumber();
    this.set('pen1', Math.floor(color) );
    return 0;
};

/**
 * PEN2( color )
 */
Asm.PEN2 = function() {
    var color = this.popAsNumber();
    this.set('pen2', Math.floor(color) );
    return 0;
};

/**
 * PEN3( color )
 */
Asm.PEN3 = function() {
    var color = this.popAsNumber();
    this.set('pen3', Math.floor(color) );
    return 0;
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
 * JMP( delta )
 * Jump of `delta` instructions.
 */
Asm.JMP = function() {
    var delta = this.popAsNumber();
    this._cursor = Math.max( 0, this._cursor + delta );
    return 1;
};

/**
 * JZE( n, delta )
 * Jump of `delta` if `n` is zero.
 */
Asm.JZE = function() {
    var delta = this.popAsNumber();
    var n = this.popAsNumber();
    if (n == 0) {
        this._cursor = Math.max( 0, this._cursor + delta );
    }
    return 1;
};

/**
 * JNZ( n, delta )
 * Jump of `delta` if `n` is NOT zero.
 */
Asm.JNZ = function() {
    var delta = this.popAsNumber();
    var n = this.popAsNumber();
    if (n != 0) {
        this._cursor = Math.max( 0, this._cursor + delta );
    }
    return 1;
};

/**
 * JGT( n, delta )
 * Jump of `delta` if `n` is greater than zero.
 */
Asm.JGT = function() {
    var delta = this.popAsNumber();
    var n = this.popAsNumber();
    if (n > 0) {
        this._cursor = Math.max( 0, this._cursor + delta );
    }
    return 1;
};

/**
 * JLT( n, delta )
 * Jump of `delta` if `n` is lower than zero.
 */
Asm.JLT = function() {
    var delta = this.popAsNumber();
    var n = this.popAsNumber();
    if (n < 0) {
        this._cursor = Math.max( 0, this._cursor + delta );
    }
    return 1;
};

/**
 * JGT( n, delta )
 * Jump of `delta` if `n` is greater than zero.
 */
Asm.JGE = function() {
    var delta = this.popAsNumber();
    var n = this.popAsNumber();
    if (n >= 0) {
        this._cursor = Math.max( 0, this._cursor + delta );
    }
    return 1;
};

/**
 * JLT( n, delta )
 * Jump of `delta` if `n` is lower than zero.
 */
Asm.JLE = function() {
    var delta = this.popAsNumber();
    var n = this.popAsNumber();
    if (n <= 0) {
        this._cursor = Math.max( 0, this._cursor + delta );
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
    else this.push( a % b );
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
 * FOR( var, a, b, step, jmp )
 */
Asm.FOR = function() {
    var jmp = Math.floor(this.popAsNumber());
    var step = this.popAsNumber();
    var b = this.popAsNumber();
    var a = this.popAsNumber();
    var name = this.pop().toLowerCase();
    a = Math.min(a, b);
    b = Math.max(a, b);
    var c = this.getAsNumber(name);
};
