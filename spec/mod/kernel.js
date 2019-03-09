require("kernel",function(t,n,r){function i(t,n){t.width=f,t.height=_;var r=new u(t,{alpha:!0,antialias:!1,preserveDrawingBuffer:!0,premultipliedAlpha:!0}),e=r.gl;this._gl=e,this._renderer=r,o.call(this);var a=e.createTexture();e.bindTexture(e.TEXTURE_2D,a),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,8,1,0,e.RGBA,e.UNSIGNED_BYTE,this._pencils),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this._texPencils=a;var E=e.createTexture();e.bindTexture(e.TEXTURE_2D,E),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,256,256,0,e.RGBA,e.UNSIGNED_BYTE,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this._texSymbols=E,this._prgTri=new u.Program(e,{vert:s.vert,frag:s.frag}),this._prgDisk=new u.Program(e,{vert:s.vertDisk,frag:s.fragDisk}),this._prgSprite=new u.Program(e,{vert:s.vertSprite,frag:s.fragSprite}),this._arrVertices=new l,this._bufVertexAttribs=e.createBuffer();var c=this;this.stop=r.stop.bind(r),this.start=r.start.bind(r),r.start(function(t){e.colorMask(!0,!0,!0,!0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,f,_),"function"==typeof c._render&&c._render(t,c)}),this._render=function(t,n){},Object.defineProperty(i.prototype,"render",{get:function(){return this._render},set:function(t){this._render=t},configurable:!0,enumerable:!0})}function e(t){var n=this._gl,r=this._prgTri;r.use(),n.bindBuffer(n.ARRAY_BUFFER,this._bufVertexAttribs);var i=this._arrVertices.array;n.bufferData(n.ARRAY_BUFFER,i,n.STATIC_DRAW);var e=i.BYTES_PER_ELEMENT,o=6*e,a=n.getAttribLocation(r.program,"attPosition");n.enableVertexAttribArray(a),n.vertexAttribPointer(a,2,n.FLOAT,!1,o,0);var s=n.getAttribLocation(r.program,"attColor");n.enableVertexAttribArray(s),n.vertexAttribPointer(s,4,n.FLOAT,!1,o,2*e),n.drawArrays(t,0,this._arrVertices.length/6),this.clearPoints()}function o(){this._pencils=new Uint8Array([0,0,0,0,255,255,255,255,255,0,0,255,0,255,0,255,0,0,255,255,0,255,255,255,255,0,255,255,255,255,0,255])}var a=function(){function n(){return i(r,arguments)}var r={en:{},fr:{}},i=t("$").intl;return n.all=r,n}(),s={vert:"attribute vec2 attPosition;\nattribute vec4 attColor;\n\nconst float W = 2.0 / 640.0;\nconst float H = 2.0 / 480.0;\n\nvarying vec4 varColor;\n\nvoid main() {\n  varColor = attColor;\n  gl_Position = vec4( attPosition.x * W - 1.0, attPosition.y * H - 1.0, 0.0, 1.0 );\n}\n",frag:"precision mediump float;\n\nvarying vec4 varColor;\n\nvoid main() {\n  gl_FragColor = varColor;\n}\n",vertSprite:"// attPosition.x is +1 or -1\n// attPosition.y is +1 or -1\nattribute vec2 attPosition;\n\n// In Tlk-space: 640x480.\nuniform float uniDstW;\nuniform float uniDstH;\nuniform float uniCenterX;\nuniform float uniCenterY;\n\n\nconst float W = 2.0 / 640.0;\nconst float H = 2.0 / 480.0;\n\n\nvarying vec2 varUV;\n\n\nvoid main() {\n  float cx = uniCenterX * W - 1.0;\n  float cy = uniCenterY * H - 1.0;\n  float x = attPosition.x * uniDstW * W;\n  float y = attPosition.y * uniDstH * H;\n\n  gl_Position = vec4( cx + x, cy + y, 0.0, 1.0 );\n  varUV = vec2( attPosition.x + .5, attPosition.y + .5 );\n}\n",fragSprite:"precision mediump float;\n\n// The symbols' page.\nuniform sampler2D texSymbols;\n// The pencils used.\nuniform sampler2D texPencils;\n\n// Coords of the current pixel. (0,0) is le left bottom one and (1,1) is the upper right one.\nvarying vec2 varUV;\n\n// In pixels of the symbols' page.\nuniform float uniSrcX;\nuniform float uniSrcY;\nuniform float uniSrcW;\nuniform float uniSrcH;\n\nconst float UNIT = 1.0 / 256.0;\n\nvoid main() {\n  float x = ( varUV.x * uniSrcW + uniSrcX ) / 256.0;\n  float y = ( (1.0 - varUV.y) * uniSrcH + uniSrcY ) / 256.0;\n  float color = texture2D( texSymbols, vec2( x, y ) ).r;\n  // color is between 0 and 7 * UNIT.\n  // The palette index is coded on the RED composant of texPencils.\n  gl_FragColor = texture2D( texPencils, vec2(color * 32.0, .5) );\n}\n",vertDisk:"uniform float uniX;\nuniform float uniY;\n// Radius W and H.\nuniform float uniW;\nuniform float uniH;\n\nattribute vec2 attPosition;\n\nconst float W = 2.0 / 640.0;\nconst float H = 2.0 / 480.0;\n\nvarying vec2 varPosition;\nvarying float varRadius;\n\nvoid main() {\n  varPosition = attPosition;\n  float x = (uniX + attPosition.x * uniW) * W - 1.0;\n  float y = (uniY + attPosition.y * uniH) * H - 1.0;\n  varRadius = 1.0 * (1.0 / uniW + 1.0 / uniH);\n  gl_Position = vec4( x, y, 0.0, 1.0 );\n}\n",fragDisk:"precision mediump float;\n\nuniform float uniR;\nuniform float uniG;\nuniform float uniB;\nuniform float uniA;\nvarying vec2 varPosition;\nvarying float varRadius;\n\nvoid main() {\n  float radius = sqrt(varPosition.x * varPosition.x + varPosition.y * varPosition.y);\n  if (radius > 1.0) {\n    gl_FragColor = vec4(0.0,0.0,0.0,0.0);\n    return;\n  }\n  float alpha = uniA;\n  if (radius > 1.0 - varRadius) {\n    alpha *= (1.0 - radius) / varRadius;\n  }\n  gl_FragColor = vec4(uniR, uniG, uniB, alpha);\n}\n"},u=t("tfw.webgl"),l=(t("keyboard"),t("vertex-buffer")),f=640,_=480;n.exports=i,i.prototype.clearPoints=function(){this._arrVertices.reset()},i.prototype.point=function(t,n,r){r=this.expandColor(r),this._arrVertices.push(t,n,r[0],r[1],r[2],r[3])},i.prototype.expandColor=function(t){var n=17*(15&t);t>>=4;var r=17*(15&t);t>>=4;var i=17*(15&t);return t>>=4,[i/255,r/255,n/255,(255-17*t)/255]},i.prototype.triangles=function(){e.call(this,this._gl.TRIANGLES)},i.prototype.triStrip=function(){e.call(this,this._gl.TRIANGLE_STRIP)},i.prototype.triFan=function(){e.call(this,this._gl.TRIANGLE_FAN)};var E=new Float32Array([-.5,-.5,.5,-.5,-.5,.5,.5,.5]);i.prototype.sprite=function(t,n,r,i,e,o,a,s,u,l){void 0===s&&(s=1),void 0===u&&(u=1),void 0===l&&(l=0),void 0===o&&(o=16),void 0===a&&(a=16);var f=this._gl,_=this._prgSprite;_.use(),f.enable(f.BLEND),f.blendFunc(f.SRC_ALPHA,f.ONE_MINUS_SRC_ALPHA),_.$uniCenterX=i,_.$uniCenterY=e,_.$uniDstW=o,_.$uniDstH=a,_.$uniSrcX=n,_.$uniSrcY=r,_.$uniSrcW=o,_.$uniSrcH=a,_.$texSymbols=0,f.activeTexture(f.TEXTURE0),f.bindTexture(f.TEXTURE_2D,this._texSymbols),_.$texPencils=1,f.activeTexture(f.TEXTURE1),f.bindTexture(f.TEXTURE_2D,this._texPencils),f.texImage2D(f.TEXTURE_2D,0,f.RGBA,8,1,0,f.RGBA,f.UNSIGNED_BYTE,this._pencils),f.bindBuffer(f.ARRAY_BUFFER,this._bufVertexAttribs);var c=E;f.bufferData(f.ARRAY_BUFFER,c,f.STATIC_DRAW);var T=c.BYTES_PER_ELEMENT,v=2*T,R=f.getAttribLocation(_.program,"attPosition");f.enableVertexAttribArray(R),f.vertexAttribPointer(R,2,f.FLOAT,!1,v,0),f.drawArrays(f.TRIANGLE_STRIP,0,4)};var c=new Float32Array([-1,-1,1,-1,-1,1,1,1]);i.prototype.disk=function(t,n,r,i,e,o,a,s,u){var l=this._gl,f=this._prgDisk;f.use(),l.enable(l.BLEND),l.blendFunc(l.SRC_ALPHA,l.ONE_MINUS_SRC_ALPHA),f.$uniX=t,f.$uniY=n,f.$uniW=r,f.$uniH=i,f.$uniR=o,f.$uniG=a,f.$uniB=s,f.$uniA=u,l.bindBuffer(l.ARRAY_BUFFER,this._bufVertexAttribs);var _=c;l.bufferData(l.ARRAY_BUFFER,_,l.STATIC_DRAW);var E=_.BYTES_PER_ELEMENT,T=2*E,v=l.getAttribLocation(f.program,"attPosition");l.enableVertexAttribArray(v),l.vertexAttribPointer(v,2,l.FLOAT,!1,T,0),l.drawArrays(l.TRIANGLE_STRIP,0,4)},i.prototype.pen=function(t,n){var r=this._pencils;n=this.expandColor(n),n.forEach(function(n,i){r[4*t+i]=255*n})},i.prototype.blend=function(t){var n=this._gl;t?n.enable(n.BLEND):n.disable(n.BLEND)},n.exports._=a});
//# sourceMappingURL=kernel.js.map