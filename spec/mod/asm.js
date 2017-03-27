require("asm",function(t,s){function r(){return n(p,arguments)}function e(t){var s,r,e,i,h=this.popAsNumber();if(0==h)s=0,r=0,e=640,i=480;else if(1==h)e=this.popAsNumber(),i=e,s=this.get("X")-e/2,r=this.get("Y")-i/2;else if(2==h)i=this.popAsNumber(),e=this.popAsNumber(),s=this.get("X")-e/2,r=this.get("Y")-i/2;else if(3==h)i=this.popAsNumber(),e=i,r=this.popAsNumber(),s=this.popAsNumber();else{for(;h-- >4;)this.pop();i=this.popAsNumber(),e=this.popAsNumber(),r=this.popAsNumber(),s=this.popAsNumber()}return this.kernel&&(this.kernel.point(s,r,t),this.kernel.point(s+e,r,t),this.kernel.point(s,r+i,t),this.kernel.point(s+e,r+i,t),this.kernel.triStrip()),e*i/256}function i(t,s,r){this.kernel.blend(!1),this.kernel.point(t-8,s-8,r),this.kernel.point(t+8,s-8,r),this.kernel.point(t-8,s+8,r),this.kernel.point(t+8,s+8,r),this.kernel.triStrip(),this.kernel.blend(!0)}function h(t,s){if("undefined"==typeof t&&(t=function(){return!0}),"undefined"==typeof s&&(s=function(t){return t}),0===this.get("ask.txt")){this.set("ask.txt",""),this.set("ask.cursor",Date.now());for(var r=this.popArgs(),e=r.join("\n"),h=0;h<e.length;h++)this.printChar(e.charCodeAt(h));return this._cursor--,this.skipFrame()}var p=this.get("x"),n=this.get("y"),u=(this.get("sx"),this.get("sy"),(Date.now()-this.get("ask.cursor"))%1e3),a=this.get("pen"),f=a[u<500?1:0];i.call(this,p,n,f);var c=o.last();if(!c)return this._cursor--,this.skipFrame();var A=c.key;if(1==A.length&&t(A)){o.test("SHIFT")||(A=A.toLowerCase()),this.set("ask.txt",this.get("ask.txt")+A);var m=A.charCodeAt(0);f=a[0],i.call(this,p,n,f),this.kernel.sprite(0,16*(m%16),16*Math.floor(m/16),this.get("X"),this.get("Y"),16,16,1,1,0),p=this.get("X")+16,p>639&&(p-=640,this.set("Y",this.get("Y")-16)),this.set("X",p)}else if("BACKSPACE"==A&&this.get("ask.txt").length>0){f=a[0],i.call(this,p,n,f);var l=this.get("ask.txt");this.set("ask.txt",l.substr(0,l.length-1)),p=this.get("X")-16,p<0&&(p+=640,n=this.get("Y")+16,n>479&&(n-=480,this.set("Y",n))),this.set("X",p)}else if("ENTER"==A)return f=a[0],i.call(this,p,n,f),this.push(s(this.get("ask.txt"))),this.set("X",8),this.set("Y",this.get("Y")-16),this.set("ask.txt",0),0;return this._cursor--,this.skipFrame()}var p={en:{},fr:{}},n=require("$").intl,o=require("keyboard"),u=require("speak"),a=4e4,f=1e-10,c=function(t,s,r){var e=this;this._bytecode=t,this._cursor=0,this._cost=0,this.runtime=r||{stack:[],vars:{pen:[61440,4095,3840,240,15,255,3855,4080],x:8,y:472,sx:1,sy:1,r:0,cursor:1}},Object.defineProperty(c.prototype,"kernel",{get:function(){return this._kernel},set:function(t){this._kernel=t,e.runtime.vars.pen.forEach(function(s,r){t.pen(r,s)})},configurable:!0,enumerable:!0}),"undefined"!=typeof s&&(this.kernel=s)};s.exports=c,c.prototype.printChar=function(t){var s=this.get("X"),r=this.get("Y");if(10==t)return this.set("X",8),r-=16*this.get("SY"),r<0&&(r+=480),void this.set("Y",r);"^~°`´¨".indexOf(String.fromCharCode(t))!=-1&&(s-=16*this.get("SX"),s<0&&(s+=640,r+=16*this.get("SY"),r>479&&(r-=480),this.set("y",r)),this.set("x",s));var e=(15&t)<<4;t>>=4;var i=(15&t)<<4;t>>=4;var h=t;this.kernel.sprite(h,e,i,s,r,16,16,this.get("SX"),this.get("SY"),this.get("R")),s+=16*this.get("SX"),s>639?(this.set("x",s-640),r-=16*this.get("SY"),r<0&&(r+=480),this.set("y",r)):this.set("X",s)},c.prototype.reset=function(){this._cost=0,this._cursor=0},c.prototype.next=function(t){t?this.runtime=t:t=this.runtime;for(var s,r;this._cost<a;){if(this._cursor>=this._bytecode.length)return!1;s=this._bytecode[this._cursor++],"function"==typeof s?(r=parseInt(s.call(this)),isNaN(r)&&(r=0),this._cost+=r):(this._cost++,this.push(s))}return this._cost-=a,!0},c.prototype.push=function(t){this._cost++,this.runtime.stack.push(t)},c.prototype.pop=function(t){return this._cost++,this.runtime.stack.pop()},c.prototype.exists=function(t){return"undefined"!=typeof this.runtime.vars[(""+t).trim().toLowerCase()]},c.prototype.popAsNumber=function(){this._cost++;var t=parseFloat(this.pop()||0);return isNaN(t)?0:t},c.prototype.popArgs=function(t){"undefined"==typeof t&&(t=Number.MAX_VALUE),t=Math.max(0,Math.floor(t));for(var s=this.popAsNumber();s>t;)this.pop(),s--;for(var r=[];s-- >0;)r.unshift(this.pop());return r},c.prototype.get=function(t){t=""+t;var s=this.runtime.vars[t.trim().toLowerCase()];return"undefined"==typeof s&&(s=0),this._cost+=2,s},c.prototype.set=function(t,s){t=""+t,this.runtime.vars[t.trim().toLowerCase()]=s,this._cost+=3},c.prototype.erase=function(t){t=""+t,delete this.runtime.vars[t.trim().toLowerCase()]},c.prototype.getAsNumber=function(t){t=""+t;var s=parseFloat(this.runtime.vars[t.trim().toLowerCase()]);return isNaN(s)?0:s},c.prototype.isNumber=function(t){if("number"==typeof t)return!0;var s=parseFloat(t);return!isNaN(s)},c.prototype.asNumber=function(t){if("number"==typeof t)return t;var s=parseFloat(t);return isNaN(s)?0:s},c.prototype.skipFrame=function(t){return"undefined"==typeof t&&(t=1),this._cost=a*t,0},c.SPEAK=function(){var t=""+this.pop();return u.speak(t),10},c.LEN=function(){var t=this.pop(),s=0;return Array.isArray(t)||"string"==typeof t?s=t.length:"number"==typeof t&&(s=(""+t).length),this.push(s),1},c.COLOR=function(){var t=this.popArgs(4);t.map(function(t){var s=parseInt(t);for(isNaN(s)&&(s=0),s%=16;s<0;)s+=16;return s});var s=0;switch(t.length){case 1:s=273*t[0];break;case 2:s=273*t[0]+4096*(15-t[3]);break;case 3:s=256*t[0]+16*t[1]+t[2];break;case 4:s=256*t[0]+16*t[1]+t[2]+4096*(15-t[3])}return this.push(s),1},c.DISK=function(){var t=this.get("x"),s=this.get("y"),r=this.get("pen")[1],e=this.kernel.expandColor(r),i=this.popArgs(3),h=100,p=100,n=0;return 1==i.length?(h=parseFloat(i[0]),p=h):2==i.length?(h=parseFloat(i[0]),p=parseFloat(i[1])):3==i.length&&(h=parseFloat(i[0]),p=parseFloat(i[1]),n=parseFloat(i[2])),this.kernel.disk(t,s,h,p,n,e[0],e[1],e[2],e[3]),h*p/256},c.COS=function(){var t=this.popAsNumber()*Math.PI/180;return this.push(Math.cos(t)),15},c.SIN=function(){var t=this.popAsNumber()*Math.PI/180;return this.push(Math.sin(t)),15},c.ASC=function(){var t=this.pop();if("number"==typeof t||"string"==typeof t){var s=(""+t).charCodeAt(0);this.push(s)}else this.push(0);return 0},c.CHR=function(){var t=this.popArgs(),s="";return t.forEach(function(t){s+=String.fromCharCode(parseInt(t)||0)}),this.push(s),0},c.SHIFT=function(){var t=""+this.pop(),s=this.get(t);return Array.isArray(s)?s.length>0?(this.push(s.shift()),this.set(t,s)):this.push(0):(s=""+s,this.push(s.charAt(0)),this.set(t,s.substr(1))),1},c.FRAME=function(){var t=this.popAsNumber();return t<1?0:a*t-this._cost},c.INK=function(){var t=Math.floor(this.popAsNumber()),s=Math.floor(this.popAsNumber()),r=Math.floor(this.popAsNumber())%64;t==-1&&(t=s);var e=t%16;t>>=4;var i=t%16;t>>=4;var h=t%16,p=s%16;s>>=4;var n=s%16;s>>=4;var o=s%16;return this.kernel&&this.kernel.ink(r,o,n,p,h,i,e),1},c.POINT=function(){var t=this.popAsNumber(),s=this.popAsNumber(),r=this.popAsNumber();return this.kernel&&this.kernel.point(r,s,t),5},c.TRIS=function(){return this.kernel&&this.kernel.triangles(),10},c.TRIANGLE=function(){var t=this.popAsNumber(),s=this.popAsNumber(),r=this.popAsNumber(),e=this.popAsNumber(),i=this.popAsNumber(),h=this.popAsNumber(),p=this.get("pen")[1];return this.kernel&&(this.kernel.point(h,i,p),this.kernel.point(e,r,p),this.kernel.point(s,t,p),this.kernel.triangles()),25},c.BOX=function(){return e.call(this,this.get("pen")[1])},c.CLS=function(){this.kernel.blend(!1);var t=e.call(this,this.get("pen")[0]);return this.kernel.blend(!0),t},c.BACK=function(){var t=this.popAsNumber(),s=this.kernel.expandColor(this.popAsNumber());document.body.style.transition="background "+t+"ms",document.body.style.background="rgb("+16*s[0]+","+16*s[1]+","+16*s[2]+")"},c.RND=function(){var t=this.popAsNumber();if(0==t)this.push(Math.random());else{var s=this.popAsNumber();if(1==t)this.push(Math.ceil(Math.random()*s));else{var r=this.popAsNumber();if(r<s){var e=s;s=r,r=e}for(this.push(Math.floor(s+Math.random()*(1+r-s)));t>2;)this.pop(),t--}}return 2},c.WAIT=function(){var t=o.last();return t?(this.push(t.key),0):(this._cursor--,a-this._cost)},c.ASK=function(){h.call(this)},c.ASKNUM=function(){h.call(this,function(t){return"0123456789.-".indexOf(t)!=-1},function(t){return parseFloat(t)})},c.DEC=function(){var t=""+this.pop(),s=this.get(t)-1;return this.set(t,s),this.push(s),1},c.INC=function(){var t=""+this.pop(),s=this.get(t)+1;return this.set(t,s),this.push(s),1},c.VARADD=function(){var t=""+this.pop(),s=this.pop(),r=this.get(t);return Array.isArray(r)?Array.isArray(s)?r.push.apply(r,s):r.push(s):r+=s,this.set(t,r),this.push(r),1},c.PEN=function(){for(var t,s,r=this.get("pen"),e=this.popAsNumber();e-- >0;)t=Math.floor(this.popAsNumber()),s=(e+8000001)%8,this.kernel.pen(s,t),r[s]=t;return 7},c.PAPER=function(){var t=this.get("pen"),s=Math.floor(this.popAsNumber());return this.kernel.pen(0,s),t[0]=s,1},c.GET=function(){var t=""+this.pop(),s=this.get(t);return this.push(s),0},c.SET=function(){var t=""+this.pop(),s=this.pop();return this.set(t,s),0},c.JMP=function(){var t=this.popAsNumber();return this._cursor=t,1},c.JZE=function(){var t=this.popAsNumber(),s=this.popAsNumber();return 0==s&&(this._cursor=t),1},c.JNZ=function(){var t=this.popAsNumber(),s=this.popAsNumber();return 0!=s&&(this._cursor=t),1},c.JGT=function(){var t=this.popAsNumber(),s=this.popAsNumber(),r=this.popAsNumber();return r>s&&(this._cursor=t),0},c.JLT=function(){var t=this.popAsNumber(),s=this.popAsNumber(),r=this.popAsNumber();return r<s&&(this._cursor=t),0},c.JGE=function(){var t=this.popAsNumber(),s=this.popAsNumber(),r=this.popAsNumber();return r>=s&&(this._cursor=t),0},c.JLE=function(){var t=this.popAsNumber(),s=this.popAsNumber(),r=this.popAsNumber();return r<=s&&(this._cursor=t),0},c.DEBUGGER=function(){return 0},c.ABS=function(){return this.push(Math.abs(this.popAsNumber())),0},c.NEG=function(){return this.push(-this.popAsNumber()),0},c.ADD=function(){var t=this.pop(),s=this.pop();return"string"==typeof s||"string"==typeof t?(s=""+s,t=""+t,this.push(s+t),s.length+t.length+2):Array.isArray(s)?(Array.isArray(t)?(s.push.apply(s,t),this.push(s),this._cost+=t.length):(s.push(t),this.push(s)),1):(this.push(this.asNumber(s)+this.asNumber(t)),1)},c.MUL=function(){return this.push(this.popAsNumber()*this.popAsNumber()),2},c.DIV=function(){var t=this.popAsNumber(),s=this.popAsNumber();return 0==s?(this.push(0),0):Math.abs(t)<f?(this.push(s>=0?Number.MAX_VALUE:-Number.MAX_VALUE),1):(this.push(s/t),4)},c.SUB=function(){return this.push(-this.popAsNumber()+this.popAsNumber()),1},c.AND=function(){var t=this.popAsNumber(),s=this.popAsNumber(),r=1;return 0==s?r=0:0==t&&(r=0),this.push(r),1},c.OR=function(){var t=this.popAsNumber(),s=this.popAsNumber(),r=0;return 0!=s?r=1:0!=t&&(r=1),this.push(r),1},c.XOR=function(){var t=this.popAsNumber()&&1,s=this.popAsNumber()&&1,r=0;return 0!=s?r=1:0!=t&&(r=1),this.push(r),1},c.GEQ=function(){var t=this.pop(),s=this.pop();return this.push(s>=t?1:0),1},c.LEQ=function(){var t=this.pop(),s=this.pop();return this.push(s<=t?1:0),1},c.GT=function(){var t=this.pop(),s=this.pop();return this.push(s>t?1:0),1},c.LT=function(){var t=this.pop(),s=this.pop();return this.push(s<t?1:0),1},c.MOD=function(){var t=this.popAsNumber(),s=this.popAsNumber();if(Math.abs(t)<f)this.push(0);else{var r=s%t;r<0&&(r+=t),this.push(r)}return 1},c.EXP=function(){var t=this.popAsNumber(),s=this.popAsNumber();return this.push(Math.pow(s,t)),15},c.EQ=function(){var t=this.pop(),s=this.pop();return this.push(s==t?1:0),1},c.NEQ=function(){var t=this.pop(),s=this.pop();return this.push(s!=t?1:0),1},c.ERASE=function(){var t=this.pop();return delete this.erase(t),0},c.KEY=function(){var t=this.popAsNumber();if(0==t)return this.push(0),0;for(var s=1;t-- >0;){var r=""+this.pop();o.test(r)||(s=0)}return this.push(s),1},c.IIF=function(){var t=this.pop(),s=this.pop(),r=this.popAsNumber();return 0==r?this.push(t):this.push(s),0},c.FORE=function(){var t=this.popAsNumber(),s=""+this.pop(),r=""+this.pop(),e=""+this.pop(),i=this.get(s),h=parseInt(this.get(r));isNaN(h)&&(h=0);var p=(this.get(e),i?i.length||0:0);return h>=p?(this._cursor=t,1):("string"==typeof i?this.set(e,i.charAt(h)):this.set(e,i[h]),this.set(r,h+1),3)},c.FOR=function(){var t,s=Math.floor(this.popAsNumber()),r=this.popAsNumber(),e=this.popAsNumber(),i=this.popAsNumber(),h=this.pop().toLowerCase();return t=this.exists(h)?this.getAsNumber(h)+r:i,this.set(h,t),i=Math.min(i,e),e=Math.max(i,e),(t<i||t>e)&&(this._cursor=s),5},c.LOCATE=function(){for(var t=Math.floor(this.popAsNumber())%30;t<0;)t+=30;for(var s=Math.floor(this.popAsNumber())%40;s<0;)t+=40;return this.set("X",(s<<4)+8),this.set("Y",480-((t<<4)+8)),0},c.MOVE=function(){var t=Math.floor(this.popAsNumber()),s=Math.floor(this.popAsNumber());return this.set("X",s),this.set("Y",t),0},c.MOVER=function(){var t=Math.floor(this.popAsNumber()),s=Math.floor(this.popAsNumber());return this.set("X",s+this.get("X")),this.set("Y",t+this.get("Y")),0},c.SPRITE=function(){var t=this.popAsNumber(),s=this.popAsNumber(),r=this.popAsNumber();if(this.kernel){var e=(15&r)<<4;r>>=4;var i=(15&r)<<4;r>>=4;var h=r;this.kernel.sprite(h,e,i,this.get("X"),this.get("Y"),s<<4,t<<4,this.get("SX"),this.get("SY"),this.get("R"))}return 3*s*t},c.PRINTCHAR=function(){var t=Math.floor(this.popAsNumber());return this.printChar(t),1},s.exports._=r});
//# sourceMappingURL=asm.js.map