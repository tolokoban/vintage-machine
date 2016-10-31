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
 * Primitives are used with real  colors, except for the sprites which
 * contain up to 8 indexed colors to pick into the pencils palette.
 *
 *********************************************************************
 * Private variables
 *
 * _gl: webgl context.
 * _renderer: WebGL instance (from module `tfw.webgl`).
 * _prgTri: webgl program used for triangles drawing on framebuffer.
 */
function Kernel( canvas, symbols ) {
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    var renderer = new WebGL(canvas, {
        alpha: true,
        antialias: false,
        preserveDrawingBuffer: true
    });
    var gl = renderer.gl;
    this._gl = gl;
    this._renderer = renderer;

    initPencils.call( this );

    // Pencils texture.
    var texPencils = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texPencils);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 8, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, this._pencils);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this._texPencils = texPencils;

    // Palette Symbols.
    var texSymbols = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texSymbols);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE, symbols);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this._texSymbols = texSymbols;

    // Program for triangles and lines.
    this._prgTri = new WebGL.Program( gl, {
        vert: GLOBAL.vert,
        frag: GLOBAL.frag
    });
    // Program for disks.
    this._prgDisk = new WebGL.Program( gl, {
        vert: GLOBAL.vertDisk,
        frag: GLOBAL.fragDisk
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

    var that = this;

    this.stop = renderer.stop.bind( renderer );
    this.start = renderer.start.bind( renderer );

    renderer.start(function(time) {
        gl.colorMask( true, true, true, true );
        gl.bindFramebuffer( gl.FRAMEBUFFER, null );
        gl.viewport(0, 0, WIDTH, HEIGHT);
        if (typeof that._render === 'function') {
            // Do the user rendering.
            that._render( time, that );
        }
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
    color = this.expandColor( color );
    this._arrVertices.push( x, y,
                            color[0],
                            color[1],
                            color[2],
                            color[3] );
};

/**
 * Color is a number. Its hexadecimal representation helps to understand how channels are packed.
 * &FFF -> RGBA(255, 255, 255, 255)
 * &5FFF -> RGBA(255, 255, 255, 170)
 * &5F00 -> RGBA(255, 0, 0, 170)
 * &50F0 -> RGBA(0, 255, 0, 170)
 *
 * Eeach channel has a velue between 0 and 15 (F).
 * For R, G and B, the convertion consist in mulitplying by 17.
 * For A, the formula is: 255 - 17 * A.
 */
Kernel.prototype.expandColor = function( color ) {
    var b = 17 * (color & 15);
    color >>= 4;
    var g = 17 * (color & 15);
    color >>= 4;
    var r = 17 * (color & 15);
    color >>= 4;
    var a = 255 - 17 * color;

    return [r / 256, g / 256, b / 256, a / 256];
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
Kernel.prototype.sprite = function(layer, xs, ys, xd, yd, w, h, scaleX, scaleY, rotation) {
    if( typeof scaleX === 'undefined' ) scaleX = 1;
    if( typeof scaleY === 'undefined' ) scaleY = 1;
    if( typeof rotation === 'undefined' ) rotation = 0;
    if( typeof w === 'undefined' ) w = 16;
    if( typeof h === 'undefined' ) h = 16;

    var gl = this._gl;
    var prg = this._prgSprite;
    prg.use();

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // gl.ONE);

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

    prg.$texPencils = 1;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture( gl.TEXTURE_2D, this._texPencils );
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 8, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, this._pencils);

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
    //gl.disable(gl.BLEND);
};

var DISK = new Float32Array([ -1, -1, +1, -1, -1, +1, +1, +1 ]);
/**
 *
 */
Kernel.prototype.disk = function(x, y, rx, ry, ang, r, g, b, a) {
    var gl = this._gl;
    var prg = this._prgDisk;
    prg.use();

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // gl.ONE);

    prg.$uniX = x;
    prg.$uniY = y;
    prg.$uniW = rx;
    prg.$uniH = ry;
    prg.$uniR = r;
    prg.$uniG = g;
    prg.$uniB = b;
    prg.$uniA = a;

    gl.bindBuffer( gl.ARRAY_BUFFER, this._bufVertexAttribs );
    var datAttributes = DISK;
    gl.bufferData( gl.ARRAY_BUFFER, datAttributes, gl.STATIC_DRAW );
    var bpe = datAttributes.BYTES_PER_ELEMENT;
    var blockSize = 2 * bpe;
    // attPosition
    var attPosition = gl.getAttribLocation(prg.program, "attPosition");
    gl.enableVertexAttribArray(attPosition);
    gl.vertexAttribPointer(attPosition, 2, gl.FLOAT, false, blockSize, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

/**
 * @return void
 */
Kernel.prototype.pen = function( pencil, color ) {
    // Colors are stored in BYTE format : [0, 255].
    var arr = this._pencils;
    color = this.expandColor( color );
    color.forEach(function (channel, idx) {
        arr[4 * pencil + idx] = channel * 255;
    });
};

/**
 * @return void
 */
Kernel.prototype.blend = function(value) {
    var gl = this._gl;
    if (value) gl.enable(gl.BLEND);
    else gl.disable(gl.BLEND);
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
    var blockSize = 6 * bpe;
    // attPosition
    var attPosition = gl.getAttribLocation(prg.program, "attPosition");
    gl.enableVertexAttribArray(attPosition);
    gl.vertexAttribPointer(attPosition, 2, gl.FLOAT, false, blockSize, 0);
    // attColor
    var attColor = gl.getAttribLocation(prg.program, "attColor");
    gl.enableVertexAttribArray(attColor);
    gl.vertexAttribPointer(attColor, 4, gl.FLOAT, false, blockSize, 2 * bpe);

    gl.drawArrays(type, 0, this._arrVertices.length / 6);
    this.clearPoints();
}

/**
 * Pencils are the 8 pencils used for sprites.
 */
function initPencils() {
    this._pencils = new Uint8Array([
        0,   0,   0,   0,
        255, 255, 255, 255,
        255,   0,   0, 255,
        0, 255,   0, 255,
        0,   0, 255, 255,
        0, 255, 255, 255,
        255,   0, 255, 255,
        255, 255,   0, 255
    ]);
}
