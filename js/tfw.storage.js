/** @module tfw.storage */require( 'tfw.storage', function(exports, module) { var _intl_={"en":{}},_$=require("$").intl;function _(){return _$(_intl_, arguments);}
    function load(storage) {
    return function(key, def) {
        var v = storage.getItem(key);
        if (v === null) {
            return def;
        }
        try {
            v = JSON.parse(v);
        }
        catch(ex) {}
        return v;
    };
}

function save(storage) {
    return function(key, val) {
        storage.setItem(key, JSON.stringify(val));
    };
}


exports.local = {
    get: load(window.localStorage),
    set: save(window.localStorage)
};

exports.session = {
    get: load(window.sessionStorage),
    set: save(window.sessionStorage)
};


  
module.exports._ = _;
/**
 * @module tfw.storage
 * @see module:$
 * @see module:tfw.storage

 */
});