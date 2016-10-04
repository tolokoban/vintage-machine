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
 * GET( name )
 * SET( name, value )
 */

// Every atomic instruction has a time cost.
// The cost allower between two requestAnimationFrames is `MAX_COST`.
var MAX_COST = 10000;


var Asm = function( kernel, code ) {
    this._kernel = kernel;
    this._code = code;
    this._cursor = 0;
    this._cost = 0;
    this._runtime = {
        stack: [],
        vars: {},
        lets: {}
    };
    
    Object.defineProperty( Asm.prototype, 'runtime', {
        get: function() { return this._runtime; },
        set: function(v) { this._runtime = v; },
        configurable: true,
        enumerable: true
    });
};

module.exports = Asm;

/**
 * @return void
 */
Asm.prototype.next = function( runtime ) {
    if( typeof runtime === 'undefined' ) runtime = this._runtime;
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
 * GET( name )
 * Return 0 for unexistant variables.
 */
Asm.GET = function() {
    var name = "" + this.pop();
    var value = this.runtime.lets[name];
    if (typeof value === 'undefined') {
        value = this.runtime.vars[name];
    }
    if( typeof value === 'undefined' ) value = 0;
    this.push( value );
    return 2;
};

/**
 * SET( name, value )
 */
Asm.SET = function() {
    var value = this.pop();
    var name = "" + this.pop();
    if (typeof this.runtime.lets[name] !== 'undefined') {
        this.runtime.lets[name] = value;
    } else {
        this.runtime.vars[name] = value;
    }
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
    if (b == 0) {
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
