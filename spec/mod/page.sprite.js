require("page.sprite",function(e,t,o){function n(){r(),document.addEventListener("keydown",function(e){switch(e.key.toUpperCase()){case"X":p();break;case"S":l();break;case"L":f();break;case"ARROWRIGHT":b.test("CONTROL")?C<12&&(C=(C+1)%16,r()):a(A+1,E);break;case"ARROWLEFT":b.test("CONTROL")?C>0&&(C=(C+15)%16,r()):a(A-1,E);break;case"ARROWDOWN":b.test("CONTROL")?h<12&&(h=(h+1)%16,r()):a(A,E+1);break;case"ARROWUP":b.test("CONTROL")?h>0&&(h=(h+15)%16,r()):a(A,E-1);break;case"1":case"2":case"3":case"4":case"5":case"6":case"7":i(16*C+A,16*h+E,w,parseInt(e.key)),a(A,E);break;case" ":i(16*C+A,16*h+E,w,0),a(A,E)}})}function r(){y.clearRect(0,0,k,O);var e,t;for(t=0;t<64;t++)for(e=0;e<64;e++)y.fillStyle=s(16*C+e,16*h+t),y.fillRect(1+e*R,1+t*R,R-1,R-1);for(y.strokeStyle="#f00",t=0;t<5;t++)y.moveTo(0,.5+16*t*R),y.lineTo(k,.5+16*t*R),y.stroke(),y.moveTo(.5+16*t*R,0),y.lineTo(.5+16*t*R,O),y.stroke();document.getElementById("pos").textContent=m[w]+m[C]+m[h]}function a(e,t){for(e%=64,t%=64;e<0;)e+=64;for(;t<0;)t+=64;A=e,E=t,d.style.left=A*R-1+"px",d.style.top=E*R-1+"px";for(var o=1;o<8;o++)if(b.test(""+o)){i(16*C+A,16*h+E,w,o);break}b.test(" ")&&i(16*C+A,16*h+E,w,0),y.fillStyle=s(16*C+e,16*h+t),y.fillRect(1+e*R,1+t*R,R-1,R-1)}function s(e,t,o){void 0===o&&(o=w);var n=c(e,t,o),r=T[n];return"rgb("+r[0]+","+r[1]+","+r[2]+")"}function c(e,t,o){return 7&u[o+4*(e+256*t)]}function i(e,t,o,n){u[o+4*(e+256*t)]=7&n}function l(){console.info("[page.sprite.save] g_symbols=...",u);var e=new Blob([u],{type:"application/octet-binary"});console.info("[page.sprite] blob=...",e),v.saveAs(e,"symbols.arr")}function f(){var e=new Image;e.onload=function(){var t=document.createElement("canvas");t.width=t.height=256;var o=t.getContext("2d");o.drawImage(e,0,0);var n=o.getImageData(0,0,256,256),a=n.data;u=new Uint8Array(262144);for(var s=0;s<a.length;s+=4)u[s]=a[s]>127?1:0,u[s+1]=u[s+2]=u[s+3]=0;console.info("[page.sprite.load] g_symbols=...",u),r()},e.src="css/app/symbols.original.jpg"}function p(){var e,t,o,n,a,s;for(e=0;e<15;e++)for(t=e+1;t<16;t++)for(n=0;n<16;n++)for(o=0;o<16;o++)for(a=0;a<4;a++)s=u[4*(256*(16*e+n)+16*t+o)+a],u[4*(256*(16*e+n)+16*t+o)+a]=u[4*(256*(16*t+n)+16*e+o)+a],u[4*(256*(16*t+n)+16*e+o)+a]=s;r()}var u,y,d,g=function(){function t(){return n(o,arguments)}var o={en:{},fr:{}},n=e("$").intl;return t.all=o,t}(),b=e("keyboard"),v=e("file"),m="0123456789ABCDEF",R=10,k=64*R+1,O=64*R+1,T=[[0,0,0],[255,255,255],[255,0,0],[0,255,0],[0,0,255],[255,255,0],[255,0,255],[0,255,255]],w=0,C=0,h=0,A=0,E=0;o.start=function(){d=document.getElementById("cursor");var e=document.getElementById("zoom");e.width=k,e.height=O,y=e.getContext("2d");var t=new XMLHttpRequest;t.open("GET","css/app/symbols.arr",!0),t.responseType="arraybuffer",t.onload=function(e){var o=t.response;o&&(u=new Uint8Array(o),console.info("[page.sprite.start] g_symbols=...",u),n())},t.send(null)},t.exports._=g});
//# sourceMappingURL=page.sprite.js.map