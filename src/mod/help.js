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
};


module.exports = Help;


function toMarkDown( elem, text ) {
    var that = this;
    elem.innerHTML = Marked( text );
    var links = elem.querySelectorAll("a");
    var i, link;
    for (i=0; i<links.length; i++) {
        link = links[i];
        link.setAttribute("data-page", link.getAttribute("href"));
        link.setAttribute("href", "#");
        $.on(link, gotoPage(link, that));
    }
}

function gotoPage( link, help ) {
    return function() {
        var href = link.getAttribute("data-page");
        help.value = href;
    };
}
