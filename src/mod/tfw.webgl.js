var BPE = (new Float32Array()).BYTES_PER_ELEMENT;


function Webgl(canvas, config) {
    Object.defineProperty( this, 'gl', {
        value: canvas.getContext('webgl', config) || canvas.getContext('experimental-webgl', config),
        writable: false,
        configurable: false,
        enumerable: true
    });
    Object.defineProperty( this, 'BPE', {
        value: BPE,
        writable: false,
        configurable: false,
        enumerable: true
    });

    this.render = function() {};
}

Webgl.prototype.createProgram = function(codes) {
    return new Program( this.gl, codes );
};

Webgl.prototype.start = function(renderingFunction) {
    if (typeof renderingFunction === 'function') {
        this.render = renderingFunction;
    }

    if (!this._animationIsOn) {
        var that = this;
        var rendering = function(time) {
            if (that._animationIsOn) {
                window.requestAnimationFrame( rendering );
            }
            that.render( time );
        };
        window.requestAnimationFrame( rendering );
        this._animationIsOn = true;
    }
};

Webgl.prototype.stop = function() {
    this._animationIsOn = false;
};

/**
 * @return void
 */
Webgl.prototype.createTextureForFB = function(width, height) {
    var gl = this.gl;
    var texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set up texture so we can render any size image and so we are
    // working with pixels.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, null);

    return texture;
};


/**
 * @return void
 */
Webgl.prototype.getDataFromImage = function( img ) {
    var w = img.width;
    var h = img.height;
    var canvas = document.createElement( 'canvas' );
    canvas.setAttribute( "width", w );
    canvas.setAttribute( "height", h );
    var ctx = canvas.getContext( "2d" );
    ctx.drawImage( img, 0, 0 );
    return ctx.getImageData( 0, 0, w, h ).data;
};



function Program(gl, codes) {
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, getVertexShader(gl, codes.vert || '//No Vertex Shader\n'));
    gl.attachShader(shaderProgram, getFragmentShader(gl, codes.frag || '//No Fragment Shader\n'));
    gl.linkProgram(shaderProgram);

    this.program = shaderProgram;
    Object.freeze( this.program );
    
    this.use = function() {
        gl.useProgram(shaderProgram);
    };
    this.use();

    var index, item;
    var attribs = {};
    var attribsCount = gl.getProgramParameter(shaderProgram, gl.ACTIVE_ATTRIBUTES);
    for (index = 0; index < attribsCount; index++) {
        item = gl.getActiveAttrib( shaderProgram, index );
        attribs[item.name] = gl.getAttribLocation(shaderProgram, item.name);
        this['$' + item.name] = gl.getAttribLocation(shaderProgram, item.name);
    }

    Object.freeze(attribs);
    this.attribs = attribs;
    var uniforms = {};
    var uniformsCount = gl.getProgramParameter(shaderProgram, gl.ACTIVE_UNIFORMS);
    for (index = 0; index < uniformsCount; index++) {
        item = gl.getActiveUniform( shaderProgram, index );
        uniforms[item.name] = gl.getUniformLocation(shaderProgram, item.name);
        Object.defineProperty(this, '$' + item.name, {
            set: createUniformSetter(gl, item, uniforms[item.name]),
            get: createUniformGetter(item),
            enumerable: true,
            configurable: true
        });
    }
    Object.freeze(uniforms);
    this.uniforms = uniforms;
}

function createUniformSetter(gl, item, nameGL) {
    var nameJS = '_$' + item.name;

    switch (item.type) {
    case gl.BYTE:
    case gl.UNSIGNED_BYTE:
    case gl.SHORT:
    case gl.UNSIGNED_SHORT:
    case gl.INT:
    case gl.UNSIGNED_INT:
    case gl.SAMPLER_2D:  // Used to set an index to a texture.
        if (item.size == 1) {
            return function(v) {
                gl.uniform1i(nameGL, v);
                this[nameJS] = v;
            };
        } else {
            return function(v) {
                gl.uniform1iv(nameGL, v);
                this[nameJS] = v;
            };
        }
        break;
    case gl.FLOAT:
        if (item.size == 1) {
            return function(v) {
                gl.uniform1f(nameGL, v);
                this[nameJS] = v;
            };
        } else {
            return function(v) {
                gl.uniform1fv(nameGL, v);
                this[nameJS] = v;
            };
        }
        break;
    }
}

function createUniformGetter(item) {
    var name = '_$' + item.name;
    return function() {
        return this[name];
    };
}


function getShader( type, gl, code ) {
    var shader = gl.createShader( type );
    gl.shaderSource( shader, code );
    gl.compileShader( shader );
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log( code );
        console.error("An error occurred compiling the shader: " + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function getFragmentShader( gl, code ) {
    return getShader( gl.FRAGMENT_SHADER, gl, code );
}

function getVertexShader( gl, code ) {
    return getShader( gl.VERTEX_SHADER, gl, code );
}


Webgl.Program = Program;
module.exports = Webgl;
