"use strict";

var WebGL = require("tfw.webgl");
var Keyboard = require("keyboard");
var VertexBuffer = require("vertex-buffer");

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
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    var renderer = new WebGL( canvas );
    var gl = renderer.gl;
    this._gl = gl;
    this._renderer = renderer;

    initPencils.call( this );
    initPalette.call( this );
    initFramebuffer.call( this );

    // Pencils texture.
    var texPencils = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texPencils);
    // No transparency on pencils.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 8, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, this._pencils);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Palette texture.
    var texPalette = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texPalette);
    // No transparency on palette.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 64, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, this._palette);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Palette Symbols.
    var texSymbols = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texSymbols);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, symbols);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this._texSymbols = texSymbols;

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
    // Program for displaying sprites.
    this._prgSprite = new WebGL.Program( gl, {
        vert: GLOBAL.vertSprite,
        frag: GLOBAL.fragSprite
    });

    // Array of vertices.
    this._arrVertices = new VertexBuffer();

    // Buffer for triangles vertices.
    this._bufVertexAttribs = gl.createBuffer();

    var bufRectangle = gl.createBuffer();
    var datRectangle = new Float32Array([
        0, 0, WIDTH, 0, 0, HEIGHT, WIDTH, HEIGHT
    ]);

    var that = this;

    this.stop = renderer.stop.bind( renderer );
    this.start = renderer.start.bind( renderer );
    
    renderer.start(function(time) {
        var debugMode = Keyboard.test("d");

        gl.viewport(0, 0, WIDTH, HEIGHT);
        if (typeof that._render === 'function') {
            // All user's operations are performed in the framebuffer.
            gl.bindFramebuffer( gl.FRAMEBUFFER, that._framebuffer );
            if (debugMode) gl.bindFramebuffer( gl.FRAMEBUFFER, null );
            //gl.viewport(0, 0, WIDTH << 1, HEIGHT << 1);
            gl.disable( gl.BLEND );
            gl.disable( gl.DEPTH_TEST );
            gl.colorMask( that._screen0, that._screen1, that._screen2, that._screen3 );
            // Do the user rendering.
            that._render( time, that );
        }
        if (debugMode) return;

        gl.bindFramebuffer( gl.FRAMEBUFFER, null );
        var prg = that._prgRender;
        prg.use();
        gl.colorMask( true, true, true, true );
        gl.disable( gl.BLEND );
        gl.disable( gl.DEPTH_TEST );
        gl.bindBuffer( gl.ARRAY_BUFFER, bufRectangle );
        gl.enableVertexAttribArray( prg.$attPosition );
        gl.vertexAttribPointer( prg.$attPosition, 2, gl.FLOAT, false, 0, 0 );
        gl.bufferData( gl.ARRAY_BUFFER, datRectangle, gl.STATIC_DRAW );

        prg.$uniTime = time;
        prg.$texSource = 0;
        prg.$texPalette = 1;

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture( gl.TEXTURE_2D, that._fbTexture );

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texPalette);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 64, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, that._palette);

        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    });

    this._render = function( ker, time ) {};

    // Getter/setter for the rendering function.
    Object.defineProperty( Kernel.prototype, 'render', {
        get: function() { return this._render; },
        set: function(v) { this._render = v; },
        configurable: true,
        enumerable: true
    });
}

module.exports = Kernel;


/**
 * Remove all the points.
 */
Kernel.prototype.clearPoints = function() {
    this._arrVertices.reset();
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
 * Draw triangles strips from points on the buffer.
 * @see point
 */
Kernel.prototype.triStrip = function() {
    draw.call( this, this._gl.TRIANGLE_STRIP );
};


/**
 * Draw triangles fans from points on the buffer.
 * @see point
 */
Kernel.prototype.triFan = function() {
    draw.call( this, this._gl.TRIANGLE_FAN );
};

var SQUARE = new Float32Array([ -.5, -.5, +.5, -.5, -.5, +.5, +.5, +.5 ]);
/**
 * @return void
 */
Kernel.prototype.sprite = function(layer, xs, ys, xd, yd, w, h) {
    if( typeof w === 'undefined' ) w = 16;
    if( typeof h === 'undefined' ) h = 16;

    var gl = this._gl;
    var prg = this._prgSprite;
    prg.use();

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // gl.ONE);

    gl.colorMask( this._screen0, this._screen1, this._screen2, this._screen3 );
    prg.$uniCenterX = xd;
    prg.$uniCenterY = yd;
    prg.$uniDstW = w;
    prg.$uniDstH = h;
    prg.$uniSrcX = xs;
    prg.$uniSrcY = ys;
    prg.$uniSrcW = w;
    prg.$uniSrcH = h;

    prg.$texSymbols = 0;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture( gl.TEXTURE_2D, this._texSymbols );

    gl.bindBuffer( gl.ARRAY_BUFFER, this._bufVertexAttribs );
    var datAttributes = SQUARE;
    gl.bufferData( gl.ARRAY_BUFFER, datAttributes, gl.STATIC_DRAW );
    var bpe = datAttributes.BYTES_PER_ELEMENT;
    var blockSize = 2 * bpe;
    // attPosition
    var attPosition = gl.getAttribLocation(prg.program, "attPosition");
    gl.enableVertexAttribArray(attPosition);
    gl.vertexAttribPointer(attPosition, 2, gl.FLOAT, false, blockSize, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.disable(gl.BLEND);
};


/**
 * @return void
 */
Kernel.prototype.pen = function( pencils ) {
    var arr = this._pencils;
    pencils.forEach(function (pen, idx) {
        arr[4 * idx] = pen;
    });
};


/**
 * @return void
 */
Kernel.prototype.ink = function( index, r1, g1, b1, r2, g2, b2 ) {
    this._palette[index * 4 + 0] = r1;
    this._palette[index * 4 + 1] = g1;
    this._palette[index * 4 + 2] = b1;
    this._palette[index * 4 + 256] = r2;
    this._palette[index * 4 + 257] = g2;
    this._palette[index * 4 + 258] = b2;
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

var HEXA = "0123456789abcdef";

/**
 * Color of the form "ff0" will be converted to [255,255,0].
 * Color of the form 48 will be converted to [48, 48, 48].
 */
function expandColor( value ) {
    if( Array.isArray( value )) return value;
    if ( typeof value === 'number' ) {
        value = Math.floor( value ) % 255;
        return [value, value, value];
    }
    value = value.trim().toLowerCase();
    var arr = [], c;
    for (var i=0 ; i<value.length ; i++) {
        c = HEXA.indexOf( value.charAt( i ) );
        if (c < 0) c = 0;
        arr.push(17 * c);
    }
    return arr;
}

/**
 * @return void
 */
Kernel.prototype.ink = function(index, color1, color2) {
    if( typeof index === 'undefined' ) index = 0;
    index = Math.floor( index ) % 64;
    if( typeof color2 === 'undefined' ) color2 = color1;

    color1 = expandColor( color1 );
    color2 = expandColor( color2 );

    var idx = index * 4;
    this._palette[idx++] = color1[0];
    this._palette[idx++] = color1[1];
    this._palette[idx]   = color1[2];
    idx = index * 4 + 64 * 4;
    this._palette[idx++] = color2[0];
    this._palette[idx++] = color2[1];
    this._palette[idx]   = color2[2];
};

/**
 * @param {number} period - from 0 to 4 seconds.
 */
Kernel.prototype.speedInk = function(index, period, shift) {
    if( typeof shift === 'undefined' ) shift = 0;
    period = clamp(Math.floor(60 * period), 0, 255);
    shift = clamp(Math.floor(60 * shift), 0, 255);
    this._palette[4 * index + 3] = period;
    this._palette[4 * index + 3 + 64 * 4] = shift;
};

function clamp(value, min, max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

/**
 * Push the vertices array to the graphic card.
 */
function draw( type ) {
    var gl = this._gl;
    var prg = this._prgTri;
    prg.use();
    gl.bindBuffer( gl.ARRAY_BUFFER, this._bufVertexAttribs );
    var datAttributes = this._arrVertices.array;
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
 * Pencils are the 8 pencils used for sprites.
 */
function initPencils() {
    this._pencils = new Uint8Array([
        0, 0, 0, 0,
        4, 0, 0, 0,
        8, 0, 0, 0,
        12, 0, 0, 0,
        16, 0, 0, 0,
        20, 0, 0, 0,
        24, 0, 0, 0,
        28, 0, 0, 0
    ]);
}


/**
 * Initialize the main palette of 64 colors.  We take only 4 levels in
 * each of the 3 channels (R, G and B).
 * The palette is stored in `this._palette` as a Float32Array and will
 * be used as a texture.
 */
function initPalette() {
    var i, j;
    
    this._palette = new Uint8Array(4 * 64 * 2);
    this._palette.fill( 240 );
    
    this.ink( 0, "000" );
    this.ink( 1, "fff" );
    this.ink( 2, "f00" );
    this.ink( 3, "0f0" );
    this.ink( 4, "00f" );
    this.ink( 5, "0ff" );
    this.ink( 6, "f0f" );
    this.ink( 7, "ff0" );

    this.ink( 8, "000" );

    this.ink( 32, "08f" );
    this.ink( 33, "80f" );
    this.ink( 34, "0f8" );
    this.ink( 35, "8f0" );
    this.ink( 36, "f08" );
    this.ink( 37, "f80" );
    this.ink( 38, "88f" );
    this.ink( 39, "8f8" );

    this.ink( 40, "048" );
    this.ink( 41, "408" );
    this.ink( 42, "084" );
    this.ink( 43, "480" );
    this.ink( 44, "804" );
    this.ink( 45, "840" );
    this.ink( 46, "448" );
    this.ink( 47, "484" );

    this.ink( 48, "f88" );
    this.ink( 49, "844" );
    this.ink( 50, "ff8" );
    this.ink( 51, "884" );
    this.ink( 52, "f8f" );
    this.ink( 53, "848" );
    this.ink( 54, "8ff" );
    this.ink( 55, "488" );

    for (i = 1 ; i < 8 ; i++) {
        for (j = 1 ; j < 4 ; j++) {
            this._palette[4*(i + 8 * j) + 0] = Math.floor( this._palette[4*i + 0] * (4 - j) * .25 );
            this._palette[4*(i + 8 * j) + 1] = Math.floor( this._palette[4*i + 1] * (4 - j) * .25 );
            this._palette[4*(i + 8 * j) + 2] = Math.floor( this._palette[4*i + 2] * (4 - j) * .25 );
        }
    }

    // By default, no color is blinking.
    for (i = 0; i < 64 ; i++) {
        j = 4 * i;
        this._palette[64 * 4 + j + 0] = this._palette[j + 0];
        this._palette[64 * 4 + j + 1] = this._palette[j + 1];
        this._palette[64 * 4 + j + 2] = this._palette[j + 2];
    }
    
    // Blinking colors.
    this.ink( 16, "000", "fff" );
    this.speedInk( 16, .5, .25 );
    this.ink( 24, "ff0", "00f" );
    

    console.info("[kernel] palette=...", this._palette);
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
