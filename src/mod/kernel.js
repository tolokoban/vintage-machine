"use strict";

var Keyboard = require("keyboard");


var WebGL = require("tfw.webgl");
var WIDTH = 640;
var HEIGHT = 480;

/**
 * @module kernel
 *
 * @description
 * Graphical unit is here.
 * All graphical  operations are made  in a FrameBuffer in  which each
 * channel represent one of the four available screens. The value in a
 * channel is  discretized to 64  to indicate  the index in  the color
 * palette.
 *
 *********************************************************************
 * Private variables
 *
 * _gl: webgl context.
 * _renderer: WebGL instance (from module `tfw.webgl`).
 * _prgTri: webgl program used for triangles drawing on framebuffer.
 * _prgRender: webgl program used for final rendering.
 * 
 * _screen0 {boolean}: enable/disable drawings on screen 0.
 * _screen1 {boolean}: enable/disable drawings on screen 1.
 * _screen2 {boolean}: enable/disable drawings on screen 2.
 * _screen3 {boolean}: enable/disable drawings on screen 3.
 */
function Kernel( canvas, symbols ) {
    var renderer = new WebGL( canvas );
    var gl = renderer.gl;
    this._gl = gl;
    this._renderer = renderer;

    initPalette.call( this );
    initFramebuffer.call( this );

    // We start with only the first screen (0) enabled.
    this._screen0 = true;
    this._screen1 = this._screen2 = this._screen3 = false;

    // Program for triangles and lines.
    this._prgTri = new WebGL.Program( gl, {
        vert: GLOBAL.vert,
        frag: GLOBAL.frag
    });
    // Program for finale rendering.
    this._prgRender = new WebGL.Program( gl, {
        vert: GLOBAL.vertRender,
        frag: GLOBAL.fragRender
    });

    // Array of vertices.
    this._arrVertices = [];

    // Buffer for triangles vertices.
    this._bufVertexAttribs = gl.createBuffer();

    var bufRectangle = gl.createBuffer();
    var datRectangle = new Float32Array([
        0, 0, WIDTH, 0, 0, HEIGHT, WIDTH, HEIGHT
    ]);

    var that = this;

    renderer.start(function(time) {
        var debugMode = Keyboard.test("d");

        gl.viewport(-WIDTH * 2, -HEIGHT * 2, WIDTH * 4, HEIGHT * 4);
        if (typeof that._render === 'function') {
            // All user's operations are performed in the framebuffer.
            gl.bindFramebuffer( gl.FRAMEBUFFER, that._framebuffer );
            if (debugMode) gl.bindFramebuffer( gl.FRAMEBUFFER, null );
            //gl.viewport(0, 0, WIDTH << 1, HEIGHT << 1);
            gl.disable( gl.BLEND );
            gl.disable( gl.DEPTH_TEST );
            gl.colorMask( that._screen0, that._screen1, that._screen2, that._screen3 );
            // Do the user rendering.
            that._render( that, time );
        }
        if (debugMode) return;

        gl.bindFramebuffer( gl.FRAMEBUFFER, null );
        //gl.viewport(0, 0, WIDTH << 1, HEIGHT << 1);
        var prg = that._prgRender;
        prg.use();
        gl.colorMask( true, true, true, true );
        gl.disable( gl.BLEND );
        gl.disable( gl.DEPTH_TEST );
        gl.bindBuffer( gl.ARRAY_BUFFER, bufRectangle );
        gl.enableVertexAttribArray( prg.$attPosition );
        gl.vertexAttribPointer( prg.$attPosition, 2, gl.FLOAT, false, 0, 0 );
        gl.bufferData( gl.ARRAY_BUFFER, datRectangle, gl.STATIC_DRAW );
        gl.bindTexture( gl.TEXTURE_2D, that._fbTexture );
        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    });

    this._render = function( ker, time ) {
        ker.screen( true, false, false, false );
        ker.clearPoints();
        ker.point( 0, 0, 1 );
        ker.point( WIDTH, HEIGHT, 20 );
        ker.point( 490, 200, 63 );
        ker.triangles();
        ker.screen( false, true, false, false );
        ker.point( 0, HEIGHT, 1 );
        ker.point( WIDTH, HEIGHT, 20 );
        ker.point( WIDTH, 0, 63 );
        ker.triangles();
        ker.screen( false, false, true, false );
        ker.point( WIDTH / 4, 0, 1 );
        ker.point( 320, HEIGHT, 63 );
        ker.point( 3 * WIDTH / 4, 0, 20 );
        ker.triangles();
        ker.screen( false, true, false, false );
        ker.point( WIDTH / 2, HEIGHT / 2, 32 );
        ker.point( 0, HEIGHT / 4, 32 );
        ker.point( WIDTH / 4, 0, 32 );
        ker.triangles();
    };
}

module.exports = Kernel;


/**
 * Remove all the points.
 */
Kernel.prototype.clearPoints = function() {
    this._arrVertices = [];
};

/**
 * Add a new point to the buffer
 * @param {float} x - X coord, between 0 and 639.
 * @param {float} y - Y coord, between 0 and 479.
 * @param {float} color - Color, between 0 and 63.
 */
Kernel.prototype.point = function(x, y, color) {
    this._arrVertices.push( x, y, color );
};

/**
 * Draw triangles from points on the buffer.
 * @see point
 */
Kernel.prototype.triangles = function() {
    draw.call( this, this._gl.TRIANGLES );
};


/**
 * Specify on which screens the next operation will be applied.
 */
Kernel.prototype.screen = function(s0, s1, s2, s3) {
    this._screen0 = s0;
    this._screen1 = s1;
    this._screen2 = s2;
    this._screen3 = s3;
    this._gl.colorMask( s0, s1, s2, s3 );
};


/**
 * Push the vertices array to the graphic card.
 */
function draw( type ) {
    var gl = this._gl;
    var prg = this._prgTri;
    prg.use();
    gl.bindBuffer( gl.ARRAY_BUFFER, this._bufVertexAttribs );
    var datAttributes = new Float32Array( this._arrVertices );
    gl.bufferData( gl.ARRAY_BUFFER, datAttributes, gl.STATIC_DRAW );
    var bpe = datAttributes.BYTES_PER_ELEMENT;
    var blockSize = 3 * bpe;
    // attPosition
    var attPosition = gl.getAttribLocation(prg.program, "attPosition");
    gl.enableVertexAttribArray(attPosition);
    gl.vertexAttribPointer(attPosition, 2, gl.FLOAT, false, blockSize, 0);
    // attColor
    var attColor = gl.getAttribLocation(prg.program, "attColor");
    gl.enableVertexAttribArray(attColor);
    gl.vertexAttribPointer(attColor, 1, gl.FLOAT, false, blockSize, 2 * bpe);

    gl.drawArrays(type, 0, this._arrVertices.length / 3);
    this.clearPoints();
}

/**
 * Initialize the main palette of 64 colors.  We take only 4 levels in
 * each of the 3 channels (R, G and B).
 * The palette is stored in `this._palette` as a Float32Array and will
 * be used as a texture.
 */
function initPalette() {
    var palette = [];
    var r, g, b;
    var coeff = 1 / 3;
    for (r=0; r<4; r++) {
        for (g=0; g<4; g++) {
            for (b=0; b<4; b++) {
                palette.push(coeff * r, coeff * g, coeff * b, 1);
            }
        }
    }
    this._palette = new Float32Array( palette );
}


/**
 * Every user's operation  are performed in a framebuffer  which will be
 * transformed afterward using the palette.
 * This framebuffer is stored in `this._framebuffer`.
 */
function initFramebuffer() {
    var gl = this._gl;
    var texture = this._renderer.createTextureForFB( WIDTH, HEIGHT );
    var fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this._framebuffer = fb;
    this._fbTexture = texture;
}
