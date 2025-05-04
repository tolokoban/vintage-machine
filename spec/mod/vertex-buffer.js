"use strict";

/** @module vertex-buffer */require('vertex-buffer', function (require, module, exports) {
  var _ = function () {
    var D = {
        "en": {},
        "fr": {}
      },
      X = require("$").intl;
    function _() {
      return X(D, arguments);
    }
    _.all = D;
    return _;
  }();
  "use strict";

  /**
   * @module vertex-buffer
   *
   * @description
   * 
   *
   * @example
   * var mod = require('vertex-buffer');
   */
  var Prop = require("properties");
  function VertexBuffer(capacity) {
    var that = this;
    if (typeof capacity === 'undefined') capacity = 1024;
    var arr = new Float32Array(capacity);
    this._arr = arr;
    Prop.readonly(this, 'capacity', capacity);
    Prop.readonly(this, 'array', function () {
      return arr.slice(0, this._cursor);
    });
    this._cursor = 0;
    Prop.readonly(this, 'length', function () {
      return that._cursor;
    });
  }

  /**
   * Push as many floats as you need to this buffer.
   * @return `true` if there is space left in the buffer.
   */
  VertexBuffer.prototype.push = function () {
    var i, arg;
    for (i = 0; i < arguments.length; i++) {
      arg = arguments[i];
      if (this._cursor >= this.capacity) return false;
      this._arr[this._cursor++] = arg;
    }
    return true;
  };

  /**
   * @return void
   */
  VertexBuffer.prototype.reset = function () {
    this._cursor = 0;
  };
  module.exports = VertexBuffer;
  module.exports._ = _;
});