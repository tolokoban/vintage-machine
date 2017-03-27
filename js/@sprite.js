/**********************************************************************
 require( 'require' )
 -----------------------------------------------------------------------
 @example

 var Path = require("node://path");  // Only in NodeJS/NW.js environment.
 var Button = require("tfw.button");

 **********************************************************************/

window.require = function() {
    var modules = {};
    var definitions = {};
    var nodejs_require = typeof window.require === 'function' ? window.require : null;

    var f = function(id, body) {
        if( id.substr( 0, 7 ) == 'node://' ) {
            // Calling for a NodeJS module.
            if( !nodejs_require ) {
                throw Error( "[require] NodeJS is not available to load module `" + id + "`!" );
            }
            return nodejs_require( id.substr( 7 ) );
        }

        if( typeof body === 'function' ) {
            definitions[id] = body;
            return;
        }
        var mod;
        body = definitions[id];
        if (typeof body === 'undefined') {
            var err = new Error("Required module is missing: " + id);   
            console.error(err.stack);
            throw err;
        }
        mod = modules[id];
        if (typeof mod === 'undefined') {
            mod = {exports: {}};
            var exports = mod.exports;
            body(f, mod, exports);
            modules[id] = mod.exports;
            mod = mod.exports;
            //console.log("Module initialized: " + id);
        }
        return mod;
    };
    return f;
}();
function addListener(e,l) {
    if (window.addEventListener) {
        window.addEventListener(e,l,false);
    } else {
        window.attachEvent('on' + e, l);
    }
};

addListener(
    'DOMContentLoaded',
    function() {
        document.body.parentNode.$data = {};
        // Attach controllers.
        APP = require('page.sprite');
setTimeout(function (){if(typeof APP.start==='function')APP.start()});

    }
);
require("$",function(n,r,o){o.config={name:'"vintage-machine"',description:'"Virtual old-fashion machine to learn basic concepts of computer programming."',author:'"tolokoban"',version:'"0.0.8"',major:"0",minor:"0",revision:"8",date:"2017-03-27T13:52:35.000Z",consts:{}};var a=null;o.lang=function(n){return void 0===n&&(window.localStorage&&(n=window.localStorage.getItem("Language")),n||(n=window.navigator.language)||(n=window.navigator.browserLanguage)||(n="fr"),n=n.substr(0,2).toLowerCase()),a=n,window.localStorage&&window.localStorage.setItem("Language",n),n},o.intl=function(n,r){var a,t,e,i,g,l,u,c=n[o.lang()],s=r[0];for(u in n)break;if(!u)return s;if(!c&&!(c=n[u]))return s;if(a=c[s],a||(c=n[u],a=c[s]),!a)return s;if(r.length>1){for(t="",g=0,e=0;e<a.length;e++)i=a.charAt(e),"$"===i?(t+=a.substring(g,e),e++,l=a.charCodeAt(e)-48,l<0||l>=r.length?t+="$"+a.charAt(e):t+=r[l],g=e+1):"\\"===i&&(t+=a.substring(g,e),e++,t+=a.charAt(e),g=e+1);t+=a.substr(g),a=t}return a}});
//# sourceMappingURL=$.js.map
require("page.sprite",function(e,t,o){function n(){r(),document.addEventListener("keydown",function(e){switch(e.key.toUpperCase()){case"X":p();break;case"S":l();break;case"L":f();break;case"ARROWRIGHT":b.test("CONTROL")?C<12&&(C=(C+1)%16,r()):a(A+1,E);break;case"ARROWLEFT":b.test("CONTROL")?C>0&&(C=(C+15)%16,r()):a(A-1,E);break;case"ARROWDOWN":b.test("CONTROL")?h<12&&(h=(h+1)%16,r()):a(A,E+1);break;case"ARROWUP":b.test("CONTROL")?h>0&&(h=(h+15)%16,r()):a(A,E-1);break;case"1":case"2":case"3":case"4":case"5":case"6":case"7":i(16*C+A,16*h+E,w,parseInt(e.key)),a(A,E);break;case" ":i(16*C+A,16*h+E,w,0),a(A,E)}})}function r(){y.clearRect(0,0,k,O);var e,t;for(t=0;t<64;t++)for(e=0;e<64;e++)y.fillStyle=s(16*C+e,16*h+t),y.fillRect(1+e*R,1+t*R,R-1,R-1);for(y.strokeStyle="#f00",t=0;t<5;t++)y.moveTo(0,.5+16*t*R),y.lineTo(k,.5+16*t*R),y.stroke(),y.moveTo(.5+16*t*R,0),y.lineTo(.5+16*t*R,O),y.stroke();document.getElementById("pos").textContent=m[w]+m[C]+m[h]}function a(e,t){for(e%=64,t%=64;e<0;)e+=64;for(;t<0;)t+=64;A=e,E=t,d.style.left=A*R-1+"px",d.style.top=E*R-1+"px";for(var o=1;o<8;o++)if(b.test(""+o)){i(16*C+A,16*h+E,w,o);break}b.test(" ")&&i(16*C+A,16*h+E,w,0),y.fillStyle=s(16*C+e,16*h+t),y.fillRect(1+e*R,1+t*R,R-1,R-1)}function s(e,t,o){void 0===o&&(o=w);var n=c(e,t,o),r=T[n];return"rgb("+r[0]+","+r[1]+","+r[2]+")"}function c(e,t,o){return 7&u[o+4*(e+256*t)]}function i(e,t,o,n){u[o+4*(e+256*t)]=7&n}function l(){console.info("[page.sprite.save] g_symbols=...",u);var e=new Blob([u],{type:"application/octet-binary"});console.info("[page.sprite] blob=...",e),v.saveAs(e,"symbols.arr")}function f(){var e=new Image;e.onload=function(){var t=document.createElement("canvas");t.width=t.height=256;var o=t.getContext("2d");o.drawImage(e,0,0);var n=o.getImageData(0,0,256,256),a=n.data;u=new Uint8Array(262144);for(var s=0;s<a.length;s+=4)u[s]=a[s]>127?1:0,u[s+1]=u[s+2]=u[s+3]=0;console.info("[page.sprite.load] g_symbols=...",u),r()},e.src="css/app/symbols.original.jpg"}function p(){var e,t,o,n,a,s;for(e=0;e<15;e++)for(t=e+1;t<16;t++)for(n=0;n<16;n++)for(o=0;o<16;o++)for(a=0;a<4;a++)s=u[4*(256*(16*e+n)+16*t+o)+a],u[4*(256*(16*e+n)+16*t+o)+a]=u[4*(256*(16*t+n)+16*e+o)+a],u[4*(256*(16*t+n)+16*e+o)+a]=s;r()}var u,y,d,g=function(){function t(){return n(o,arguments)}var o={en:{},fr:{}},n=e("$").intl;return t.all=o,t}(),b=e("keyboard"),v=e("file"),m="0123456789ABCDEF",R=10,k=64*R+1,O=64*R+1,T=[[0,0,0],[255,255,255],[255,0,0],[0,255,0],[0,0,255],[255,255,0],[255,0,255],[0,255,255]],w=0,C=0,h=0,A=0,E=0;o.start=function(){d=document.getElementById("cursor");var e=document.getElementById("zoom");e.width=k,e.height=O,y=e.getContext("2d");var t=new XMLHttpRequest;t.open("GET","css/app/symbols.arr",!0),t.responseType="arraybuffer",t.onload=function(e){var o=t.response;o&&(u=new Uint8Array(o),console.info("[page.sprite.start] g_symbols=...",u),n())},t.send(null)},t.exports._=g});
//# sourceMappingURL=page.sprite.js.map
require("file",function(t,e,n){var o=function(){function e(){return o(n,arguments)}var n={en:{},fr:{}},o=t("$").intl;return e.all=n,e}(),r=r||"undefined"!=typeof navigator&&navigator.msSaveOrOpenBlob&&navigator.msSaveOrOpenBlob.bind(navigator)||function(t){"use strict";if("undefined"==typeof navigator||!/MSIE [1-9]\./.test(navigator.userAgent)){var e=t.document,n=function(){return t.URL||t.webkitURL||t},o=e.createElementNS("http://www.w3.org/1999/xhtml","a"),r="download"in o,i=function(n){var o=e.createEvent("MouseEvents");o.initMouseEvent("click",!0,!1,t,0,0,0,0,0,!1,!1,!1,!1,0,null),n.dispatchEvent(o)},a=t.webkitRequestFileSystem,c=t.requestFileSystem||a||t.mozRequestFileSystem,f=function(e){(t.setImmediate||t.setTimeout)(function(){throw e},0)},u=0,s=function(e){var o=function(){"string"==typeof e?n().revokeObjectURL(e):e.remove()};t.chrome?o():setTimeout(o,500)},l=function(t,e,n){e=[].concat(e);for(var o=e.length;o--;){var r=t["on"+e[o]];if("function"==typeof r)try{r.call(t,n||t)}catch(t){f(t)}}},d=function(e,f){var d,p,v,w=this,y=e.type,m=!1,S=function(){l(w,"writestart progress write writeend".split(" "))},h=function(){if(!m&&d||(d=n().createObjectURL(e)),p)p.location.href=d;else{void 0==t.open(d,"_blank")&&"undefined"!=typeof safari&&(t.location.href=d)}w.readyState=w.DONE,S(),s(d)},O=function(t){return function(){if(w.readyState!==w.DONE)return t.apply(this,arguments)}},b={create:!0,exclusive:!1};return w.readyState=w.INIT,f||(f="download"),r?(d=n().createObjectURL(e),o.href=d,o.download=f,i(o),w.readyState=w.DONE,S(),void s(d)):(/^\s*(?:text\/(?:plain|xml)|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)&&(e=new Blob(["\ufeff",e],{type:e.type})),t.chrome&&y&&"application/octet-stream"!==y&&(v=e.slice||e.webkitSlice,e=v.call(e,0,e.size,"application/octet-stream"),m=!0),a&&"download"!==f&&(f+=".download"),("application/octet-stream"===y||a)&&(p=t),c?(u+=e.size,void c(t.TEMPORARY,u,O(function(t){t.root.getDirectory("saved",b,O(function(t){var n=function(){t.getFile(f,b,O(function(t){t.createWriter(O(function(n){n.onwriteend=function(e){p.location.href=t.toURL(),w.readyState=w.DONE,l(w,"writeend",e),s(t)},n.onerror=function(){var t=n.error;t.code!==t.ABORT_ERR&&h()},"writestart progress write abort".split(" ").forEach(function(t){n["on"+t]=w["on"+t]}),n.write(e),w.abort=function(){n.abort(),w.readyState=w.DONE},w.readyState=w.WRITING}),h)}),h)};t.getFile(f,{create:!1},O(function(t){t.remove(),n()}),O(function(t){t.code===t.NOT_FOUND_ERR?n():h()}))}),h)}),h)):void h())},p=d.prototype,v=function(t,e){return new d(t,e)};return p.abort=function(){var t=this;t.readyState=t.DONE,l(t,"abort")},p.readyState=p.INIT=0,p.WRITING=1,p.DONE=2,p.error=p.onwritestart=p.onprogress=p.onwrite=p.onabort=p.onerror=p.onwriteend=null,v}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||this.content);e.exports.saveAs=r,e.exports._=o});
//# sourceMappingURL=file.js.map
require("keyboard",function(e,n,t){var r=function(){function n(){return r(t,arguments)}var t={en:{},fr:{}},r=e("$").intl;return n.all=t,n}(),o={},u=null,l=null;document.addEventListener("keydown",function(e){"áàâäéèêëíìîïóòôöúùûüç".indexOf(e.key)==-1&&(console.info(e.key,e.code,e.keyCode),u=e.key.toUpperCase(),o[u]=!0,l=e.code.toUpperCase(),o[l]=!0,t.preventDefault&&e.preventDefault())}),document.addEventListener("keyup",function(e){delete o[e.key.toUpperCase()],delete o[e.code.toUpperCase()],t.preventDefault&&e.preventDefault()}),t.preventDefault=!1,t.test=function(e){return void 0!==o[e.toUpperCase()]},t.last=function(){if(!u)return null;var e={key:u,code:l};return u=l=null,e},t.resetLast=function(){u=l=null},n.exports._=r});
//# sourceMappingURL=keyboard.js.map
