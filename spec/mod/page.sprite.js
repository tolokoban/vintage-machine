require("page.sprite",function(e,t){function r(){return b(g,arguments)}function o(){n(),document.addEventListener("keydown",function(e){switch(e.key.toUpperCase()){case"X":p();break;case"S":f();break;case"L":l();break;case"ARROWRIGHT":m.test("CONTROL")?h<12&&(h=(h+1)%16,n()):a(E+1,I);break;case"ARROWLEFT":m.test("CONTROL")?h>0&&(h=(h+15)%16,n()):a(E-1,I);break;case"ARROWDOWN":m.test("CONTROL")?A<12&&(A=(A+1)%16,n()):a(E,I+1);break;case"ARROWUP":m.test("CONTROL")?A>0&&(A=(A+15)%16,n()):a(E,I-1);break;case"1":case"2":case"3":case"4":case"5":case"6":case"7":i(16*h+E,16*A+I,C,parseInt(e.key)),a(E,I);break;case" ":i(16*h+E,16*A+I,C,0),a(E,I)}})}function n(){y.clearRect(0,0,O,T);var e,t;for(t=0;t<64;t++)for(e=0;e<64;e++)y.fillStyle=s(16*h+e,16*A+t),y.fillRect(1+e*k,1+t*k,k-1,k-1);for(y.strokeStyle="#f00",t=0;t<5;t++)y.moveTo(0,.5+16*t*k),y.lineTo(O,.5+16*t*k),y.stroke(),y.moveTo(.5+16*t*k,0),y.lineTo(.5+16*t*k,T),y.stroke();document.getElementById("pos").textContent=R[C]+R[h]+R[A]}function a(e,t){for(e%=64,t%=64;e<0;)e+=64;for(;t<0;)t+=64;E=e,I=t,d.style.left=E*k-1+"px",d.style.top=I*k-1+"px";for(var r=1;r<8;r++)if(m.test(""+r)){i(16*h+E,16*A+I,C,r);break}m.test(" ")&&i(16*h+E,16*A+I,C,0),y.fillStyle=s(16*h+e,16*A+t),y.fillRect(1+e*k,1+t*k,k-1,k-1)}function s(e,t,r){"undefined"==typeof r&&(r=C);var o=c(e,t,r),n=w[o];return"rgb("+n[0]+","+n[1]+","+n[2]+")"}function c(e,t,r){return 7&u[r+4*(e+256*t)]}function i(e,t,r,o){u[r+4*(e+256*t)]=7&o}function f(){console.info("[page.sprite.save] g_symbols=...",u);var e=new Blob([u],{type:"application/octet-binary"});console.info("[page.sprite] blob=...",e),v.saveAs(e,"symbols.arr")}function l(){var e=new Image;e.onload=function(){var t=document.createElement("canvas");t.width=t.height=256;var r=t.getContext("2d");r.drawImage(e,0,0);var o=r.getImageData(0,0,256,256),a=o.data;u=new Uint8Array(262144);for(var s=0;s<a.length;s+=4)u[s]=a[s]>127?1:0,u[s+1]=u[s+2]=u[s+3]=0;console.info("[page.sprite.load] g_symbols=...",u),n()},e.src="css/app/symbols.original.jpg"}function p(){var e,t,r,o,a,s;for(e=0;e<15;e++)for(t=e+1;t<16;t++)for(o=0;o<16;o++)for(r=0;r<16;r++)for(a=0;a<4;a++)s=u[4*(256*(16*e+o)+16*t+r)+a],u[4*(256*(16*e+o)+16*t+r)+a]=u[4*(256*(16*t+o)+16*e+r)+a],u[4*(256*(16*t+o)+16*e+r)+a]=s;n()}var u,y,d,g={en:{},fr:{}},b=require("$").intl,m=require("keyboard"),v=require("file"),R="0123456789ABCDEF",k=10,O=64*k+1,T=64*k+1,w=[[0,0,0],[255,255,255],[255,0,0],[0,255,0],[0,0,255],[255,255,0],[255,0,255],[0,255,255]],C=0,h=0,A=0,E=0,I=0;e.start=function(){d=document.getElementById("cursor");var e=document.getElementById("zoom");e.width=O,e.height=T,y=e.getContext("2d");var t=new XMLHttpRequest;t.open("GET","css/app/symbols.arr",!0),t.responseType="arraybuffer",t.onload=function(e){var r=t.response;r&&(u=new Uint8Array(r),console.info("[page.sprite.start] g_symbols=...",u),o())},t.send(null)},t.exports._=r});
//# sourceMappingURL=page.sprite.js.map