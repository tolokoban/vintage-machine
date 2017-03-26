/** @module properties */require( 'properties', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
    "use strict";

/**
 * Helper to create a read only property.
 */
exports.readonly = function( owner, name, value ) {
    if (typeof value === 'function') {
        Object.defineProperty( owner, name, {
            get: value,
            set: function() {
                console.error("[properties] Property `" + name + "` is readonly!");
            },
            configurable: true,
            enumerable: true
        });
    } else {
        Object.defineProperty( owner, name, {
            value: value,
            writable: false,
            configurable: true,
            enumerable: true
        });
    }
};


  
module.exports._ = _;
/**
 * @module properties
 * @see module:$

 */
});