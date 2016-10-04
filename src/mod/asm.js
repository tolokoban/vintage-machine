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
 * var globals = {
 *   stack: []
 * };
 * asm.next( globals )
 */


var Asm = function( kernel, code ) {
    this._kernel = kernel;
    this._code = code;
    this._cursor = 0;
};

/**
 * @return void
 */
Asm.prototype.next = function( globals ) {
    if( typeof globals === 'undefined' ) globals = {
        stack: []
    };
    this._globals = globals;
};

/**
 * @return void
 */
Asm.prototype.push = function(value) {
    if( typeof this._globals === 'undefined' ) this._globals = { stack: [] };
    this._globals.stack.push( value );
};


/**
 * Pop two numbers on the stack and push the addition of them.
 */
exports.ADD = function() {
    this.push( this.popAsNumber() + this.popAsNumber() );
};
