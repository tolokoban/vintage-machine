require("tfw.message",function(e,n){function t(){return i(s,arguments)}function o(e,n,t){function o(){l.removeClass(s,"show"),window.setTimeout(l.detach.bind(l,s),300),r.lastMsg=null}r.lastMsg&&(l.detach(r.lastMsg),r.lastMsg=null),"number"!=typeof t&&(t=5e3);var s=l.div("tfw-message",e,"theme-elevation-24");l.textOrHtml(s,n),r.lastMsg=s,document.body.appendChild(s);var i=window.setTimeout(o,t);window.setTimeout(function(){l.addClass(s,"show"),l.on(s,function(){o(),window.clearTimeout(i),r.lastMsg=null})})}var s={en:{}},i=require("$").intl,l=require("dom"),r={lastMsg:null};e.info=o.bind(null,"info"),e.error=o.bind(null,"error"),n.exports._=t});
//# sourceMappingURL=tfw.message.js.map