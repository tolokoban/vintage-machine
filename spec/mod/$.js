require("$",function(n,a){n.config={name:"vintage-machine",description:"Virtual old-fashion machine to learn basic concepts of computer programming.",author:"tolokoban",version:"0.0.5",major:0,minor:0,revision:5,date:new Date(2016,9,21,15,1,49)};var o=null;n.lang=function(n){return void 0===n&&(window.localStorage&&(n=window.localStorage.getItem("Language")),n||(n=window.navigator.language,n||(n=window.navigator.browserLanguage,n||(n="fr"))),n=n.substr(0,2).toLowerCase()),o=n,window.localStorage&&window.localStorage.setItem("Language",n),n},n.intl=function(a,o){var r,t,e,i,g,l,u=a[n.lang()],c=o[0];if(!u)return c;if(r=u[c],!r)return c;if(o.length>1){for(t="",g=0,e=0;e<r.length;e++)i=r.charAt(e),"$"===i?(t+=r.substring(g,e),e++,l=r.charCodeAt(e)-48,t+=l<0||l>=o.length?"$"+r.charAt(e):o[l],g=e+1):"\\"===i&&(t+=r.substring(g,e),e++,t+=r.charAt(e),g=e+1);t+=r.substr(g),r=t}return r}});
//# sourceMappingURL=$.js.map