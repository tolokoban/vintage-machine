"use strict";

var $ = require("dom");
var DB = require("tfw.data-binding");

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
    elem.innerHTML = text;
}
