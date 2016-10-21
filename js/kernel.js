/** @module kernel */require( 'kernel', function(exports, module) { var _intl_={"en":{},"fr":{}},_$=require("$").intl;function _(){return _$(_intl_, arguments);}
 var GLOBAL = {
  "vert": "attribute vec2 attPosition;\nattribute vec4 attColor;\n\nconst float W = 2.0 / 640.0;\nconst float H = 2.0 / 480.0;\n\nvarying vec4 varColor;\n\nvoid main() {\n  varColor = attColor;\n  gl_Position = vec4( attPosition.x * W - 1.0, attPosition.y * H - 1.0, 0.0, 1.0 );\n}\n",
  "frag": "precision mediump float;\n\nvarying vec4 varColor;\n\nvoid main() {\n  gl_FragColor = varColor;\n}\n",
  "vertSprite": "// attPosition.x is +1 or -1\n// attPosition.y is +1 or -1\nattribute vec2 attPosition;\n\n// In Tlk-space: 640x480.\nuniform float uniDstW;\nuniform float uniDstH;\nuniform float uniCenterX;\nuniform float uniCenterY;\n\n\nconst float W = 2.0 / 640.0;\nconst float H = 2.0 / 480.0;\n\n\nvarying vec2 varUV;\n\n\nvoid main() {\n  float cx = uniCenterX * W - 1.0;\n  float cy = uniCenterY * H - 1.0;\n  float x = attPosition.x * uniDstW * W;\n  float y = attPosition.y * uniDstH * H;\n\n  gl_Position = vec4( cx + x, cy + y, 0.0, 1.0 );\n  varUV = vec2( attPosition.x + .5, attPosition.y + .5 );\n}\n",
  "fragSprite": "precision mediump float;\n\n// The symbols' page.\nuniform sampler2D texSymbols;\n// The pencils used.\nuniform sampler2D texPencils;\n\n// Coords of the current pixel. (0,0) is le left bottom one and (1,1) is the upper right one.\nvarying vec2 varUV;\n\n// In pixels of the symbols' page.\nuniform float uniSrcX;\nuniform float uniSrcY;\nuniform float uniSrcW;\nuniform float uniSrcH;\n\nconst float UNIT = 1.0 / 256.0;\n\nvoid main() {\n  float x = ( varUV.x * uniSrcW + uniSrcX ) / 256.0;\n  float y = ( (1.0 - varUV.y) * uniSrcH + uniSrcY ) / 256.0;\n  float color = texture2D( texSymbols, vec2( x, y ) ).r;\n  // color is between 0 and 7 * UNIT.\n  if (color < UNIT) {\n    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n  } else {\n  // The palette index is coded on the RED composant of texPencils.\n    gl_FragColor = texture2D( texPencils, vec2(color * 32.0, .5) );\n  }\n}\n\n"};
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
    // No transparency on pencils.
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

        /*
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
*/
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
                            color[0] / 256,
                            color[1] / 256,
                            color[2] / 256,
                            color[3] / 256 );
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

    return [r, g, b, a];
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


/**
 * @return void
 */
Kernel.prototype.pen = function( pencil, color ) {
    var arr = this._pencils;
    color = this.expandColor( color );
    color.forEach(function (channel, idx) {
        arr[4 * pencil + idx] = channel;
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

    //gl.disable(gl.BLEND);
    
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


  
module.exports._ = _;
/**
 * @module kernel
 * @see module:$
 * @see module:kernel
 * @see module:keyboard
 * @see module:tfw.webgl
 * @see module:vertex-buffer

 */
});