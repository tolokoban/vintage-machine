/**********************************************************************
 require( 'require' )
 -----------------------------------------------------------------------
 @example

 var Path = require("node://path");  // Only in NodeJS/NW.js environment.
 var Button = require("tfw.button");

 **********************************************************************/

var require = function() {
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
            body(exports, mod);
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
require("$",function(n,a){n.config={name:"vintage-machine",description:"Virtual old-fashion machine to learn basic concepts of computer programming.",author:"tolokoban",version:"0.0.3",major:0,minor:0,revision:3,date:new Date(2016,9,18,19,44,1)};var o=null;n.lang=function(n){return void 0===n&&(window.localStorage&&(n=window.localStorage.getItem("Language")),n||(n=window.navigator.language,n||(n=window.navigator.browserLanguage,n||(n="fr"))),n=n.substr(0,2).toLowerCase()),o=n,window.localStorage&&window.localStorage.setItem("Language",n),n},n.intl=function(a,o){var r,t,e,i,g,l,u=a[n.lang()],c=o[0];if(!u)return c;if(r=u[c],!r)return c;if(o.length>1){for(t="",g=0,e=0;e<r.length;e++)i=r.charAt(e),"$"===i?(t+=r.substring(g,e),e++,l=r.charCodeAt(e)-48,t+=l<0||l>=o.length?"$"+r.charAt(e):o[l],g=e+1):"\\"===i&&(t+=r.substring(g,e),e++,t+=r.charAt(e),g=e+1);t+=r.substr(g),r=t}return r}});
//# sourceMappingURL=$.js.map
require("page.sprite",function(e,t){function r(){return b(g,arguments)}function o(){n(),document.addEventListener("keydown",function(e){switch(e.key.toUpperCase()){case"X":p();break;case"S":f();break;case"L":l();break;case"ARROWRIGHT":m.test("CONTROL")?(h=(h+1)%16,n()):a(E+1,I);break;case"ARROWLEFT":m.test("CONTROL")?(h=(h+15)%16,n()):a(E-1,I);break;case"ARROWDOWN":m.test("CONTROL")?(A=(A+1)%16,n()):a(E,I+1);break;case"ARROWUP":m.test("CONTROL")?(A=(A+15)%16,n()):a(E,I-1);break;case"1":case"2":case"3":case"4":case"5":case"6":case"7":i(16*h+E,16*A+I,C,parseInt(e.key)),a(E,I);break;case" ":i(16*h+E,16*A+I,C,0),a(E,I)}})}function n(){y.clearRect(0,0,O,T);var e,t;for(t=0;t<64;t++)for(e=0;e<64;e++)y.fillStyle=s(16*h+e,16*A+t),y.fillRect(1+e*k,1+t*k,k-1,k-1);for(y.strokeStyle="#f00",t=0;t<5;t++)y.moveTo(0,.5+16*t*k),y.lineTo(O,.5+16*t*k),y.stroke(),y.moveTo(.5+16*t*k,0),y.lineTo(.5+16*t*k,T),y.stroke();document.getElementById("pos").textContent=R[C]+R[h]+R[A]}function a(e,t){for(e%=64,t%=64;e<0;)e+=64;for(;t<0;)t+=64;E=e,I=t,d.style.left=E*k-1+"px",d.style.top=I*k-1+"px";for(var r=1;r<8;r++)if(m.test(""+r)){i(16*h+E,16*A+I,C,r);break}m.test(" ")&&i(16*h+E,16*A+I,C,0),y.fillStyle=s(16*h+e,16*A+t),y.fillRect(1+e*k,1+t*k,k-1,k-1)}function s(e,t,r){"undefined"==typeof r&&(r=C);var o=c(e,t,r),n=w[o];return"rgb("+n[0]+","+n[1]+","+n[2]+")"}function c(e,t,r){return 7&u[r+4*(e+256*t)]}function i(e,t,r,o){u[r+4*(e+256*t)]=7&o}function f(){console.info("[page.sprite.save] g_symbols=...",u);var e=new Blob([u],{type:"application/octet-binary"});console.info("[page.sprite] blob=...",e),v.saveAs(e,"symbols.arr")}function l(){var e=new Image;e.onload=function(){var t=document.createElement("canvas");t.width=t.height=256;var r=t.getContext("2d");r.drawImage(e,0,0);var o=r.getImageData(0,0,256,256),a=o.data;u=new Uint8Array(262144);for(var s=0;s<a.length;s+=4)u[s]=a[s]>127?1:0,u[s+1]=u[s+2]=u[s+3]=0;console.info("[page.sprite.load] g_symbols=...",u),n()},e.src="css/app/symbols.original.jpg"}function p(){var e,t,r,o,a,s;for(e=0;e<15;e++)for(t=e+1;t<16;t++)for(o=0;o<16;o++)for(r=0;r<16;r++)for(a=0;a<4;a++)s=u[4*(256*(16*e+o)+16*t+r)+a],u[4*(256*(16*e+o)+16*t+r)+a]=u[4*(256*(16*t+o)+16*e+r)+a],u[4*(256*(16*t+o)+16*e+r)+a]=s;n()}var u,y,d,g={en:{},fr:{}},b=require("$").intl,m=require("keyboard"),v=require("file"),R="0123456789ABCDEF",k=10,O=64*k+1,T=64*k+1,w=[[0,0,0],[255,255,255],[255,0,0],[0,255,0],[0,0,255],[255,255,0],[255,0,255],[0,255,255]],C=0,h=0,A=0,E=0,I=0;e.start=function(){d=document.getElementById("cursor");var e=document.getElementById("zoom");e.width=O,e.height=T,y=e.getContext("2d");var t=new XMLHttpRequest;t.open("GET","css/app/symbols.arr",!0),t.responseType="arraybuffer",t.onload=function(e){var r=t.response;r&&(u=new Uint8Array(r),console.info("[page.sprite.start] g_symbols=...",u),o())},t.send(null)},t.exports._=r});
//# sourceMappingURL=page.sprite.js.map
require("keyboard",function(e,n){function t(){return u(r,arguments)}var r={en:{},fr:{}},u=require("$").intl,o={},l=null,f=null;document.addEventListener("keydown",function(n){"éèàç".indexOf(n.key)>-1||(console.info(n.key,n.code),l=n.key.toUpperCase(),o[l]=!0,f=n.code.toUpperCase(),o[f]=!0,e.preventDefault&&n.preventDefault())}),document.addEventListener("keyup",function(n){delete o[n.key.toUpperCase()],delete o[n.code.toUpperCase()],e.preventDefault&&n.preventDefault()}),e.preventDefault=!1,e.test=function(e){return"undefined"!=typeof o[e.toUpperCase()]},e.last=function(){if(!l)return null;var e={key:l,code:f};return l=f=null,e},e.resetLast=function(){l=f=null},n.exports._=t});
//# sourceMappingURL=keyboard.js.map
require("file",function(e,t){function n(){return r(o,arguments)}var o={en:{},fr:{}},r=require("$").intl,i=i||"undefined"!=typeof navigator&&navigator.msSaveOrOpenBlob&&navigator.msSaveOrOpenBlob.bind(navigator)||function(e){"use strict";if("undefined"==typeof navigator||!/MSIE [1-9]\./.test(navigator.userAgent)){var t=e.document,n=function(){return e.URL||e.webkitURL||e},o=t.createElementNS("http://www.w3.org/1999/xhtml","a"),r="download"in o,i=function(n){var o=t.createEvent("MouseEvents");o.initMouseEvent("click",!0,!1,e,0,0,0,0,0,!1,!1,!1,!1,0,null),n.dispatchEvent(o)},a=e.webkitRequestFileSystem,c=e.requestFileSystem||a||e.mozRequestFileSystem,f=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},u="application/octet-stream",s=0,d=500,l=function(t){var o=function(){"string"==typeof t?n().revokeObjectURL(t):t.remove()};e.chrome?o():setTimeout(o,d)},v=function(e,t,n){t=[].concat(t);for(var o=t.length;o--;){var r=e["on"+t[o]];if("function"==typeof r)try{r.call(e,n||e)}catch(e){f(e)}}},p=function(t,f){var d,p,w,y=this,m=t.type,S=!1,h=function(){v(y,"writestart progress write writeend".split(" "))},O=function(){if(!S&&d||(d=n().createObjectURL(t)),p)p.location.href=d;else{var o=e.open(d,"_blank");void 0==o&&"undefined"!=typeof safari&&(e.location.href=d)}y.readyState=y.DONE,h(),l(d)},b=function(e){return function(){if(y.readyState!==y.DONE)return e.apply(this,arguments)}},E={create:!0,exclusive:!1};return y.readyState=y.INIT,f||(f="download"),r?(d=n().createObjectURL(t),o.href=d,o.download=f,i(o),y.readyState=y.DONE,h(),void l(d)):(/^\s*(?:text\/(?:plain|xml)|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type)&&(t=new Blob(["\ufeff",t],{type:t.type})),e.chrome&&m&&m!==u&&(w=t.slice||t.webkitSlice,t=w.call(t,0,t.size,u),S=!0),a&&"download"!==f&&(f+=".download"),(m===u||a)&&(p=e),c?(s+=t.size,void c(e.TEMPORARY,s,b(function(e){e.root.getDirectory("saved",E,b(function(e){var n=function(){e.getFile(f,E,b(function(e){e.createWriter(b(function(n){n.onwriteend=function(t){p.location.href=e.toURL(),y.readyState=y.DONE,v(y,"writeend",t),l(e)},n.onerror=function(){var e=n.error;e.code!==e.ABORT_ERR&&O()},"writestart progress write abort".split(" ").forEach(function(e){n["on"+e]=y["on"+e]}),n.write(t),y.abort=function(){n.abort(),y.readyState=y.DONE},y.readyState=y.WRITING}),O)}),O)};e.getFile(f,{create:!1},b(function(e){e.remove(),n()}),b(function(e){e.code===e.NOT_FOUND_ERR?n():O()}))}),O)}),O)):void O())},w=p.prototype,y=function(e,t){return new p(e,t)};return w.abort=function(){var e=this;e.readyState=e.DONE,v(e,"abort")},w.readyState=w.INIT=0,w.WRITING=1,w.DONE=2,w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null,y}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||this.content);t.exports.saveAs=i,t.exports._=n});
//# sourceMappingURL=file.js.map
