/** @module help */require( 'help', function(exports, module) { var _intl_={"en":{},"fr":{}},_$=require("$").intl;function _(){return _$(_intl_, arguments);}
    "use strict";

var $ = require("dom");
var DB = require("tfw.data-binding");
var Marked = require("marked");
var HashWatcher = require("tfw.hash-watcher");


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
    var that = this;
    var elem = $.elem( this, 'div', 'help' );

    DB.propString( this, 'value' )(function(v) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "css/help/" + v + ".md", true);
        xhr.onload = function () {
            var text = xhr.responseText;
            toMarkDown.call( that, elem, text );
        };
        xhr.send(null);
    });

    opts = DB.extend({
        value: 'main'
    }, opts, this);

    HashWatcher(function(hash) {
        that.value = hash[0];
    });
};


module.exports = Help;


function toMarkDown( elem, text ) {
    var that = this;
    elem.innerHTML = Marked( text );
    var links = elem.querySelectorAll("a");
    var i, link;
    for (i=0; i<links.length; i++) {
        link = links[i];
        link.setAttribute("href", "#" + link.getAttribute("href"));
    }
}


  
module.exports._ = _;
/**
 * @module help
 * @see module:$
 * @see module:dom
 * @see module:help
 * @see module:marked
 * @see module:tfw.data-binding
 * @see module:tfw.hash-watcher

 */
});