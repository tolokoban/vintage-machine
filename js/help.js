/** @module help */require( 'help', function(exports, module) { var _intl_={"en":{},"fr":{}},_$=require("$").intl;function _(){return _$(_intl_, arguments);}
    "use strict";

var $ = require("dom");
var DB = require("tfw.data-binding");
var Marked = require("marked");

Marked.setOptions(
    {
        // Git Flavoured Markdown.
        gfm: true,
        // Use tables.
        tables: true
        /*
         highlight: function (code, lang) {
         return Highlight.parseCode(code, lang, libs);
         }
         */
    }
);


/**
 * @class Help
 *
 * Arguments:
 * * __visible__ {boolean}: Visibility of the component.
 *
 * @example
 * var Help = require("help");
 * var instance = new Help({visible: false});
 */
var Help = function(opts) {
    var elem = $.elem( this, 'div', 'help' );

    DB.propString( this, 'value' )(function(v) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "css/help/" + v + ".md", true);
        xhr.onload = function () {
            var text = xhr.responseText;
            toMarkDown( elem, text );
        };
        xhr.send(null);
    });

    opts = DB.extend({
        value: 'main'
    }, opts, this);
};


module.exports = Help;


function toMarkDown( elem, text ) {
    elem.innerHTML = Marked( text );
}


  
module.exports._ = _;
/**
 * @module help
 * @see module:$
 * @see module:dom
 * @see module:help
 * @see module:marked
 * @see module:tfw.data-binding

 */
});