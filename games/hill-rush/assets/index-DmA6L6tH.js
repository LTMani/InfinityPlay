(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))p(n);new MutationObserver(n=>{for(const t of n)if(t.type==="childList")for(const s of t.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&p(s)}).observe(document,{childList:!0,subtree:!0});function c(n){const t={};return n.integrity&&(t.integrity=n.integrity),n.referrerPolicy&&(t.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?t.credentials="include":n.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function p(n){if(n.ep)return;n.ep=!0;const t=c(n);fetch(n.href,t)}})();var ne=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function De(I){return I&&I.__esModule&&Object.prototype.hasOwnProperty.call(I,"default")?I.default:I}var Se={exports:{}};/*!
 * matter-js 0.19.0 by @liabru
 * http://brm.io/matter-js/
 * License MIT
 * 
 * The MIT License (MIT)
 * 
 * Copyright (c) Liam Brummitt and contributors.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */(function(I,e){(function(p,n){I.exports=n()})(ne,function(){return function(c){var p={};function n(t){if(p[t])return p[t].exports;var s=p[t]={i:t,l:!1,exports:{}};return c[t].call(s.exports,s,s.exports,n),s.l=!0,s.exports}return n.m=c,n.c=p,n.d=function(t,s,r){n.o(t,s)||Object.defineProperty(t,s,{enumerable:!0,get:r})},n.r=function(t){typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,s){if(s&1&&(t=n(t)),s&8||s&4&&typeof t=="object"&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),s&2&&typeof t!="string")for(var a in t)n.d(r,a,function(u){return t[u]}.bind(null,a));return r},n.n=function(t){var s=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(s,"a",s),s},n.o=function(t,s){return Object.prototype.hasOwnProperty.call(t,s)},n.p="",n(n.s=20)}([function(c,p){var n={};c.exports=n,function(){n._baseDelta=1e3/60,n._nextId=0,n._seed=0,n._nowStartTime=+new Date,n._warnedOnce={},n._decomp=null,n.extend=function(s,r){var a,u;typeof r=="boolean"?(a=2,u=r):(a=1,u=!0);for(var o=a;o<arguments.length;o++){var f=arguments[o];if(f)for(var h in f)u&&f[h]&&f[h].constructor===Object&&(!s[h]||s[h].constructor===Object)?(s[h]=s[h]||{},n.extend(s[h],u,f[h])):s[h]=f[h]}return s},n.clone=function(s,r){return n.extend({},r,s)},n.keys=function(s){if(Object.keys)return Object.keys(s);var r=[];for(var a in s)r.push(a);return r},n.values=function(s){var r=[];if(Object.keys){for(var a=Object.keys(s),u=0;u<a.length;u++)r.push(s[a[u]]);return r}for(var o in s)r.push(s[o]);return r},n.get=function(s,r,a,u){r=r.split(".").slice(a,u);for(var o=0;o<r.length;o+=1)s=s[r[o]];return s},n.set=function(s,r,a,u,o){var f=r.split(".").slice(u,o);return n.get(s,r,0,-1)[f[f.length-1]]=a,a},n.shuffle=function(s){for(var r=s.length-1;r>0;r--){var a=Math.floor(n.random()*(r+1)),u=s[r];s[r]=s[a],s[a]=u}return s},n.choose=function(s){return s[Math.floor(n.random()*s.length)]},n.isElement=function(s){return typeof HTMLElement<"u"?s instanceof HTMLElement:!!(s&&s.nodeType&&s.nodeName)},n.isArray=function(s){return Object.prototype.toString.call(s)==="[object Array]"},n.isFunction=function(s){return typeof s=="function"},n.isPlainObject=function(s){return typeof s=="object"&&s.constructor===Object},n.isString=function(s){return toString.call(s)==="[object String]"},n.clamp=function(s,r,a){return s<r?r:s>a?a:s},n.sign=function(s){return s<0?-1:1},n.now=function(){if(typeof window<"u"&&window.performance){if(window.performance.now)return window.performance.now();if(window.performance.webkitNow)return window.performance.webkitNow()}return Date.now?Date.now():new Date-n._nowStartTime},n.random=function(s,r){return s=typeof s<"u"?s:0,r=typeof r<"u"?r:1,s+t()*(r-s)};var t=function(){return n._seed=(n._seed*9301+49297)%233280,n._seed/233280};n.colorToNumber=function(s){return s=s.replace("#",""),s.length==3&&(s=s.charAt(0)+s.charAt(0)+s.charAt(1)+s.charAt(1)+s.charAt(2)+s.charAt(2)),parseInt(s,16)},n.logLevel=1,n.log=function(){console&&n.logLevel>0&&n.logLevel<=3&&console.log.apply(console,["matter-js:"].concat(Array.prototype.slice.call(arguments)))},n.info=function(){console&&n.logLevel>0&&n.logLevel<=2&&console.info.apply(console,["matter-js:"].concat(Array.prototype.slice.call(arguments)))},n.warn=function(){console&&n.logLevel>0&&n.logLevel<=3&&console.warn.apply(console,["matter-js:"].concat(Array.prototype.slice.call(arguments)))},n.warnOnce=function(){var s=Array.prototype.slice.call(arguments).join(" ");n._warnedOnce[s]||(n.warn(s),n._warnedOnce[s]=!0)},n.deprecated=function(s,r,a){s[r]=n.chain(function(){n.warnOnce("🔅 deprecated 🔅",a)},s[r])},n.nextId=function(){return n._nextId++},n.indexOf=function(s,r){if(s.indexOf)return s.indexOf(r);for(var a=0;a<s.length;a++)if(s[a]===r)return a;return-1},n.map=function(s,r){if(s.map)return s.map(r);for(var a=[],u=0;u<s.length;u+=1)a.push(r(s[u]));return a},n.topologicalSort=function(s){var r=[],a=[],u=[];for(var o in s)!a[o]&&!u[o]&&n._topologicalSort(o,a,u,s,r);return r},n._topologicalSort=function(s,r,a,u,o){var f=u[s]||[];a[s]=!0;for(var h=0;h<f.length;h+=1){var i=f[h];a[i]||r[i]||n._topologicalSort(i,r,a,u,o)}a[s]=!1,r[s]=!0,o.push(s)},n.chain=function(){for(var s=[],r=0;r<arguments.length;r+=1){var a=arguments[r];a._chained?s.push.apply(s,a._chained):s.push(a)}var u=function(){for(var o,f=new Array(arguments.length),h=0,i=arguments.length;h<i;h++)f[h]=arguments[h];for(h=0;h<s.length;h+=1){var l=s[h].apply(o,f);typeof l<"u"&&(o=l)}return o};return u._chained=s,u},n.chainPathBefore=function(s,r,a){return n.set(s,r,n.chain(a,n.get(s,r)))},n.chainPathAfter=function(s,r,a){return n.set(s,r,n.chain(n.get(s,r),a))},n.setDecomp=function(s){n._decomp=s},n.getDecomp=function(){var s=n._decomp;try{!s&&typeof window<"u"&&(s=window.decomp),!s&&typeof ne<"u"&&(s=ne.decomp)}catch{s=null}return s}}()},function(c,p){var n={};c.exports=n,function(){n.create=function(t){var s={min:{x:0,y:0},max:{x:0,y:0}};return t&&n.update(s,t),s},n.update=function(t,s,r){t.min.x=1/0,t.max.x=-1/0,t.min.y=1/0,t.max.y=-1/0;for(var a=0;a<s.length;a++){var u=s[a];u.x>t.max.x&&(t.max.x=u.x),u.x<t.min.x&&(t.min.x=u.x),u.y>t.max.y&&(t.max.y=u.y),u.y<t.min.y&&(t.min.y=u.y)}r&&(r.x>0?t.max.x+=r.x:t.min.x+=r.x,r.y>0?t.max.y+=r.y:t.min.y+=r.y)},n.contains=function(t,s){return s.x>=t.min.x&&s.x<=t.max.x&&s.y>=t.min.y&&s.y<=t.max.y},n.overlaps=function(t,s){return t.min.x<=s.max.x&&t.max.x>=s.min.x&&t.max.y>=s.min.y&&t.min.y<=s.max.y},n.translate=function(t,s){t.min.x+=s.x,t.max.x+=s.x,t.min.y+=s.y,t.max.y+=s.y},n.shift=function(t,s){var r=t.max.x-t.min.x,a=t.max.y-t.min.y;t.min.x=s.x,t.max.x=s.x+r,t.min.y=s.y,t.max.y=s.y+a}}()},function(c,p){var n={};c.exports=n,function(){n.create=function(t,s){return{x:t||0,y:s||0}},n.clone=function(t){return{x:t.x,y:t.y}},n.magnitude=function(t){return Math.sqrt(t.x*t.x+t.y*t.y)},n.magnitudeSquared=function(t){return t.x*t.x+t.y*t.y},n.rotate=function(t,s,r){var a=Math.cos(s),u=Math.sin(s);r||(r={});var o=t.x*a-t.y*u;return r.y=t.x*u+t.y*a,r.x=o,r},n.rotateAbout=function(t,s,r,a){var u=Math.cos(s),o=Math.sin(s);a||(a={});var f=r.x+((t.x-r.x)*u-(t.y-r.y)*o);return a.y=r.y+((t.x-r.x)*o+(t.y-r.y)*u),a.x=f,a},n.normalise=function(t){var s=n.magnitude(t);return s===0?{x:0,y:0}:{x:t.x/s,y:t.y/s}},n.dot=function(t,s){return t.x*s.x+t.y*s.y},n.cross=function(t,s){return t.x*s.y-t.y*s.x},n.cross3=function(t,s,r){return(s.x-t.x)*(r.y-t.y)-(s.y-t.y)*(r.x-t.x)},n.add=function(t,s,r){return r||(r={}),r.x=t.x+s.x,r.y=t.y+s.y,r},n.sub=function(t,s,r){return r||(r={}),r.x=t.x-s.x,r.y=t.y-s.y,r},n.mult=function(t,s){return{x:t.x*s,y:t.y*s}},n.div=function(t,s){return{x:t.x/s,y:t.y/s}},n.perp=function(t,s){return s=s===!0?-1:1,{x:s*-t.y,y:s*t.x}},n.neg=function(t){return{x:-t.x,y:-t.y}},n.angle=function(t,s){return Math.atan2(s.y-t.y,s.x-t.x)},n._temp=[n.create(),n.create(),n.create(),n.create(),n.create(),n.create()]}()},function(c,p,n){var t={};c.exports=t;var s=n(2),r=n(0);(function(){t.create=function(a,u){for(var o=[],f=0;f<a.length;f++){var h=a[f],i={x:h.x,y:h.y,index:f,body:u,isInternal:!1};o.push(i)}return o},t.fromPath=function(a,u){var o=/L?\s*([-\d.e]+)[\s,]*([-\d.e]+)*/ig,f=[];return a.replace(o,function(h,i,l){f.push({x:parseFloat(i),y:parseFloat(l)})}),t.create(f,u)},t.centre=function(a){for(var u=t.area(a,!0),o={x:0,y:0},f,h,i,l=0;l<a.length;l++)i=(l+1)%a.length,f=s.cross(a[l],a[i]),h=s.mult(s.add(a[l],a[i]),f),o=s.add(o,h);return s.div(o,6*u)},t.mean=function(a){for(var u={x:0,y:0},o=0;o<a.length;o++)u.x+=a[o].x,u.y+=a[o].y;return s.div(u,a.length)},t.area=function(a,u){for(var o=0,f=a.length-1,h=0;h<a.length;h++)o+=(a[f].x-a[h].x)*(a[f].y+a[h].y),f=h;return u?o/2:Math.abs(o)/2},t.inertia=function(a,u){for(var o=0,f=0,h=a,i,l,d=0;d<h.length;d++)l=(d+1)%h.length,i=Math.abs(s.cross(h[l],h[d])),o+=i*(s.dot(h[l],h[l])+s.dot(h[l],h[d])+s.dot(h[d],h[d])),f+=i;return u/6*(o/f)},t.translate=function(a,u,o){o=typeof o<"u"?o:1;var f=a.length,h=u.x*o,i=u.y*o,l;for(l=0;l<f;l++)a[l].x+=h,a[l].y+=i;return a},t.rotate=function(a,u,o){if(u!==0){var f=Math.cos(u),h=Math.sin(u),i=o.x,l=o.y,d=a.length,g,v,b,M;for(M=0;M<d;M++)g=a[M],v=g.x-i,b=g.y-l,g.x=i+(v*f-b*h),g.y=l+(v*h+b*f);return a}},t.contains=function(a,u){for(var o=u.x,f=u.y,h=a.length,i=a[h-1],l,d=0;d<h;d++){if(l=a[d],(o-i.x)*(l.y-i.y)+(f-i.y)*(i.x-l.x)>0)return!1;i=l}return!0},t.scale=function(a,u,o,f){if(u===1&&o===1)return a;f=f||t.centre(a);for(var h,i,l=0;l<a.length;l++)h=a[l],i=s.sub(h,f),a[l].x=f.x+i.x*u,a[l].y=f.y+i.y*o;return a},t.chamfer=function(a,u,o,f,h){typeof u=="number"?u=[u]:u=u||[8],o=typeof o<"u"?o:-1,f=f||2,h=h||14;for(var i=[],l=0;l<a.length;l++){var d=a[l-1>=0?l-1:a.length-1],g=a[l],v=a[(l+1)%a.length],b=u[l<u.length?l:u.length-1];if(b===0){i.push(g);continue}var M=s.normalise({x:g.y-d.y,y:d.x-g.x}),k=s.normalise({x:v.y-g.y,y:g.x-v.x}),m=Math.sqrt(2*Math.pow(b,2)),x=s.mult(r.clone(M),b),S=s.normalise(s.mult(s.add(M,k),.5)),y=s.sub(g,s.mult(S,m)),w=o;o===-1&&(w=Math.pow(b,.32)*1.75),w=r.clamp(w,f,h),w%2===1&&(w+=1);for(var C=Math.acos(s.dot(M,k)),T=C/w,P=0;P<w;P++)i.push(s.add(s.rotate(x,T*P),y))}return i},t.clockwiseSort=function(a){var u=t.mean(a);return a.sort(function(o,f){return s.angle(u,o)-s.angle(u,f)}),a},t.isConvex=function(a){var u=0,o=a.length,f,h,i,l;if(o<3)return null;for(f=0;f<o;f++)if(h=(f+1)%o,i=(f+2)%o,l=(a[h].x-a[f].x)*(a[i].y-a[h].y),l-=(a[h].y-a[f].y)*(a[i].x-a[h].x),l<0?u|=1:l>0&&(u|=2),u===3)return!1;return u!==0?!0:null},t.hull=function(a){var u=[],o=[],f,h;for(a=a.slice(0),a.sort(function(i,l){var d=i.x-l.x;return d!==0?d:i.y-l.y}),h=0;h<a.length;h+=1){for(f=a[h];o.length>=2&&s.cross3(o[o.length-2],o[o.length-1],f)<=0;)o.pop();o.push(f)}for(h=a.length-1;h>=0;h-=1){for(f=a[h];u.length>=2&&s.cross3(u[u.length-2],u[u.length-1],f)<=0;)u.pop();u.push(f)}return u.pop(),o.pop(),u.concat(o)}})()},function(c,p,n){var t={};c.exports=t;var s=n(3),r=n(2),a=n(7),u=n(0),o=n(1),f=n(11);(function(){t._timeCorrection=!0,t._inertiaScale=4,t._nextCollidingGroupId=1,t._nextNonCollidingGroupId=-1,t._nextCategory=1,t._baseDelta=1e3/60,t.create=function(i){var l={id:u.nextId(),type:"body",label:"Body",parts:[],plugin:{},angle:0,vertices:s.fromPath("L 0 0 L 40 0 L 40 40 L 0 40"),position:{x:0,y:0},force:{x:0,y:0},torque:0,positionImpulse:{x:0,y:0},constraintImpulse:{x:0,y:0,angle:0},totalContacts:0,speed:0,angularSpeed:0,velocity:{x:0,y:0},angularVelocity:0,isSensor:!1,isStatic:!1,isSleeping:!1,motion:0,sleepThreshold:60,density:.001,restitution:0,friction:.1,frictionStatic:.5,frictionAir:.01,collisionFilter:{category:1,mask:4294967295,group:0},slop:.05,timeScale:1,render:{visible:!0,opacity:1,strokeStyle:null,fillStyle:null,lineWidth:null,sprite:{xScale:1,yScale:1,xOffset:0,yOffset:0}},events:null,bounds:null,chamfer:null,circleRadius:0,positionPrev:null,anglePrev:0,parent:null,axes:null,area:0,mass:0,inertia:0,deltaTime:16.666666666666668,_original:null},d=u.extend(l,i);return h(d,i),d},t.nextGroup=function(i){return i?t._nextNonCollidingGroupId--:t._nextCollidingGroupId++},t.nextCategory=function(){return t._nextCategory=t._nextCategory<<1,t._nextCategory};var h=function(i,l){l=l||{},t.set(i,{bounds:i.bounds||o.create(i.vertices),positionPrev:i.positionPrev||r.clone(i.position),anglePrev:i.anglePrev||i.angle,vertices:i.vertices,parts:i.parts||[i],isStatic:i.isStatic,isSleeping:i.isSleeping,parent:i.parent||i}),s.rotate(i.vertices,i.angle,i.position),f.rotate(i.axes,i.angle),o.update(i.bounds,i.vertices,i.velocity),t.set(i,{axes:l.axes||i.axes,area:l.area||i.area,mass:l.mass||i.mass,inertia:l.inertia||i.inertia});var d=i.isStatic?"#14151f":u.choose(["#f19648","#f5d259","#f55a3c","#063e7b","#ececd1"]),g=i.isStatic?"#555":"#ccc",v=i.isStatic&&i.render.fillStyle===null?1:0;i.render.fillStyle=i.render.fillStyle||d,i.render.strokeStyle=i.render.strokeStyle||g,i.render.lineWidth=i.render.lineWidth||v,i.render.sprite.xOffset+=-(i.bounds.min.x-i.position.x)/(i.bounds.max.x-i.bounds.min.x),i.render.sprite.yOffset+=-(i.bounds.min.y-i.position.y)/(i.bounds.max.y-i.bounds.min.y)};t.set=function(i,l,d){var g;typeof l=="string"&&(g=l,l={},l[g]=d);for(g in l)if(Object.prototype.hasOwnProperty.call(l,g))switch(d=l[g],g){case"isStatic":t.setStatic(i,d);break;case"isSleeping":a.set(i,d);break;case"mass":t.setMass(i,d);break;case"density":t.setDensity(i,d);break;case"inertia":t.setInertia(i,d);break;case"vertices":t.setVertices(i,d);break;case"position":t.setPosition(i,d);break;case"angle":t.setAngle(i,d);break;case"velocity":t.setVelocity(i,d);break;case"angularVelocity":t.setAngularVelocity(i,d);break;case"speed":t.setSpeed(i,d);break;case"angularSpeed":t.setAngularSpeed(i,d);break;case"parts":t.setParts(i,d);break;case"centre":t.setCentre(i,d);break;default:i[g]=d}},t.setStatic=function(i,l){for(var d=0;d<i.parts.length;d++){var g=i.parts[d];g.isStatic=l,l?(g._original={restitution:g.restitution,friction:g.friction,mass:g.mass,inertia:g.inertia,density:g.density,inverseMass:g.inverseMass,inverseInertia:g.inverseInertia},g.restitution=0,g.friction=1,g.mass=g.inertia=g.density=1/0,g.inverseMass=g.inverseInertia=0,g.positionPrev.x=g.position.x,g.positionPrev.y=g.position.y,g.anglePrev=g.angle,g.angularVelocity=0,g.speed=0,g.angularSpeed=0,g.motion=0):g._original&&(g.restitution=g._original.restitution,g.friction=g._original.friction,g.mass=g._original.mass,g.inertia=g._original.inertia,g.density=g._original.density,g.inverseMass=g._original.inverseMass,g.inverseInertia=g._original.inverseInertia,g._original=null)}},t.setMass=function(i,l){var d=i.inertia/(i.mass/6);i.inertia=d*(l/6),i.inverseInertia=1/i.inertia,i.mass=l,i.inverseMass=1/i.mass,i.density=i.mass/i.area},t.setDensity=function(i,l){t.setMass(i,l*i.area),i.density=l},t.setInertia=function(i,l){i.inertia=l,i.inverseInertia=1/i.inertia},t.setVertices=function(i,l){l[0].body===i?i.vertices=l:i.vertices=s.create(l,i),i.axes=f.fromVertices(i.vertices),i.area=s.area(i.vertices),t.setMass(i,i.density*i.area);var d=s.centre(i.vertices);s.translate(i.vertices,d,-1),t.setInertia(i,t._inertiaScale*s.inertia(i.vertices,i.mass)),s.translate(i.vertices,i.position),o.update(i.bounds,i.vertices,i.velocity)},t.setParts=function(i,l,d){var g;for(l=l.slice(0),i.parts.length=0,i.parts.push(i),i.parent=i,g=0;g<l.length;g++){var v=l[g];v!==i&&(v.parent=i,i.parts.push(v))}if(i.parts.length!==1){if(d=typeof d<"u"?d:!0,d){var b=[];for(g=0;g<l.length;g++)b=b.concat(l[g].vertices);s.clockwiseSort(b);var M=s.hull(b),k=s.centre(M);t.setVertices(i,M),s.translate(i.vertices,k)}var m=t._totalProperties(i);i.area=m.area,i.parent=i,i.position.x=m.centre.x,i.position.y=m.centre.y,i.positionPrev.x=m.centre.x,i.positionPrev.y=m.centre.y,t.setMass(i,m.mass),t.setInertia(i,m.inertia),t.setPosition(i,m.centre)}},t.setCentre=function(i,l,d){d?(i.positionPrev.x+=l.x,i.positionPrev.y+=l.y,i.position.x+=l.x,i.position.y+=l.y):(i.positionPrev.x=l.x-(i.position.x-i.positionPrev.x),i.positionPrev.y=l.y-(i.position.y-i.positionPrev.y),i.position.x=l.x,i.position.y=l.y)},t.setPosition=function(i,l,d){var g=r.sub(l,i.position);d?(i.positionPrev.x=i.position.x,i.positionPrev.y=i.position.y,i.velocity.x=g.x,i.velocity.y=g.y,i.speed=r.magnitude(g)):(i.positionPrev.x+=g.x,i.positionPrev.y+=g.y);for(var v=0;v<i.parts.length;v++){var b=i.parts[v];b.position.x+=g.x,b.position.y+=g.y,s.translate(b.vertices,g),o.update(b.bounds,b.vertices,i.velocity)}},t.setAngle=function(i,l,d){var g=l-i.angle;d?(i.anglePrev=i.angle,i.angularVelocity=g,i.angularSpeed=Math.abs(g)):i.anglePrev+=g;for(var v=0;v<i.parts.length;v++){var b=i.parts[v];b.angle+=g,s.rotate(b.vertices,g,i.position),f.rotate(b.axes,g),o.update(b.bounds,b.vertices,i.velocity),v>0&&r.rotateAbout(b.position,g,i.position,b.position)}},t.setVelocity=function(i,l){var d=i.deltaTime/t._baseDelta;i.positionPrev.x=i.position.x-l.x*d,i.positionPrev.y=i.position.y-l.y*d,i.velocity.x=(i.position.x-i.positionPrev.x)/d,i.velocity.y=(i.position.y-i.positionPrev.y)/d,i.speed=r.magnitude(i.velocity)},t.getVelocity=function(i){var l=t._baseDelta/i.deltaTime;return{x:(i.position.x-i.positionPrev.x)*l,y:(i.position.y-i.positionPrev.y)*l}},t.getSpeed=function(i){return r.magnitude(t.getVelocity(i))},t.setSpeed=function(i,l){t.setVelocity(i,r.mult(r.normalise(t.getVelocity(i)),l))},t.setAngularVelocity=function(i,l){var d=i.deltaTime/t._baseDelta;i.anglePrev=i.angle-l*d,i.angularVelocity=(i.angle-i.anglePrev)/d,i.angularSpeed=Math.abs(i.angularVelocity)},t.getAngularVelocity=function(i){return(i.angle-i.anglePrev)*t._baseDelta/i.deltaTime},t.getAngularSpeed=function(i){return Math.abs(t.getAngularVelocity(i))},t.setAngularSpeed=function(i,l){t.setAngularVelocity(i,u.sign(t.getAngularVelocity(i))*l)},t.translate=function(i,l,d){t.setPosition(i,r.add(i.position,l),d)},t.rotate=function(i,l,d,g){if(!d)t.setAngle(i,i.angle+l,g);else{var v=Math.cos(l),b=Math.sin(l),M=i.position.x-d.x,k=i.position.y-d.y;t.setPosition(i,{x:d.x+(M*v-k*b),y:d.y+(M*b+k*v)},g),t.setAngle(i,i.angle+l,g)}},t.scale=function(i,l,d,g){var v=0,b=0;g=g||i.position;for(var M=0;M<i.parts.length;M++){var k=i.parts[M];s.scale(k.vertices,l,d,g),k.axes=f.fromVertices(k.vertices),k.area=s.area(k.vertices),t.setMass(k,i.density*k.area),s.translate(k.vertices,{x:-k.position.x,y:-k.position.y}),t.setInertia(k,t._inertiaScale*s.inertia(k.vertices,k.mass)),s.translate(k.vertices,{x:k.position.x,y:k.position.y}),M>0&&(v+=k.area,b+=k.inertia),k.position.x=g.x+(k.position.x-g.x)*l,k.position.y=g.y+(k.position.y-g.y)*d,o.update(k.bounds,k.vertices,i.velocity)}i.parts.length>1&&(i.area=v,i.isStatic||(t.setMass(i,i.density*v),t.setInertia(i,b))),i.circleRadius&&(l===d?i.circleRadius*=l:i.circleRadius=null)},t.update=function(i,l){l=(typeof l<"u"?l:1e3/60)*i.timeScale;var d=l*l,g=t._timeCorrection?l/(i.deltaTime||l):1,v=1-i.frictionAir*(l/u._baseDelta),b=(i.position.x-i.positionPrev.x)*g,M=(i.position.y-i.positionPrev.y)*g;i.velocity.x=b*v+i.force.x/i.mass*d,i.velocity.y=M*v+i.force.y/i.mass*d,i.positionPrev.x=i.position.x,i.positionPrev.y=i.position.y,i.position.x+=i.velocity.x,i.position.y+=i.velocity.y,i.deltaTime=l,i.angularVelocity=(i.angle-i.anglePrev)*v*g+i.torque/i.inertia*d,i.anglePrev=i.angle,i.angle+=i.angularVelocity;for(var k=0;k<i.parts.length;k++){var m=i.parts[k];s.translate(m.vertices,i.velocity),k>0&&(m.position.x+=i.velocity.x,m.position.y+=i.velocity.y),i.angularVelocity!==0&&(s.rotate(m.vertices,i.angularVelocity,i.position),f.rotate(m.axes,i.angularVelocity),k>0&&r.rotateAbout(m.position,i.angularVelocity,i.position,m.position)),o.update(m.bounds,m.vertices,i.velocity)}},t.updateVelocities=function(i){var l=t._baseDelta/i.deltaTime,d=i.velocity;d.x=(i.position.x-i.positionPrev.x)*l,d.y=(i.position.y-i.positionPrev.y)*l,i.speed=Math.sqrt(d.x*d.x+d.y*d.y),i.angularVelocity=(i.angle-i.anglePrev)*l,i.angularSpeed=Math.abs(i.angularVelocity)},t.applyForce=function(i,l,d){var g={x:l.x-i.position.x,y:l.y-i.position.y};i.force.x+=d.x,i.force.y+=d.y,i.torque+=g.x*d.y-g.y*d.x},t._totalProperties=function(i){for(var l={mass:0,area:0,inertia:0,centre:{x:0,y:0}},d=i.parts.length===1?0:1;d<i.parts.length;d++){var g=i.parts[d],v=g.mass!==1/0?g.mass:1;l.mass+=v,l.area+=g.area,l.inertia+=g.inertia,l.centre=r.add(l.centre,r.mult(g.position,v))}return l.centre=r.div(l.centre,l.mass),l}})()},function(c,p,n){var t={};c.exports=t;var s=n(0);(function(){t.on=function(r,a,u){for(var o=a.split(" "),f,h=0;h<o.length;h++)f=o[h],r.events=r.events||{},r.events[f]=r.events[f]||[],r.events[f].push(u);return u},t.off=function(r,a,u){if(!a){r.events={};return}typeof a=="function"&&(u=a,a=s.keys(r.events).join(" "));for(var o=a.split(" "),f=0;f<o.length;f++){var h=r.events[o[f]],i=[];if(u&&h)for(var l=0;l<h.length;l++)h[l]!==u&&i.push(h[l]);r.events[o[f]]=i}},t.trigger=function(r,a,u){var o,f,h,i,l=r.events;if(l&&s.keys(l).length>0){u||(u={}),o=a.split(" ");for(var d=0;d<o.length;d++)if(f=o[d],h=l[f],h){i=s.clone(u,!1),i.name=f,i.source=r;for(var g=0;g<h.length;g++)h[g].apply(r,[i])}}}})()},function(c,p,n){var t={};c.exports=t;var s=n(5),r=n(0),a=n(1),u=n(4);(function(){t.create=function(o){return r.extend({id:r.nextId(),type:"composite",parent:null,isModified:!1,bodies:[],constraints:[],composites:[],label:"Composite",plugin:{},cache:{allBodies:null,allConstraints:null,allComposites:null}},o)},t.setModified=function(o,f,h,i){if(o.isModified=f,f&&o.cache&&(o.cache.allBodies=null,o.cache.allConstraints=null,o.cache.allComposites=null),h&&o.parent&&t.setModified(o.parent,f,h,i),i)for(var l=0;l<o.composites.length;l++){var d=o.composites[l];t.setModified(d,f,h,i)}},t.add=function(o,f){var h=[].concat(f);s.trigger(o,"beforeAdd",{object:f});for(var i=0;i<h.length;i++){var l=h[i];switch(l.type){case"body":if(l.parent!==l){r.warn("Composite.add: skipped adding a compound body part (you must add its parent instead)");break}t.addBody(o,l);break;case"constraint":t.addConstraint(o,l);break;case"composite":t.addComposite(o,l);break;case"mouseConstraint":t.addConstraint(o,l.constraint);break}}return s.trigger(o,"afterAdd",{object:f}),o},t.remove=function(o,f,h){var i=[].concat(f);s.trigger(o,"beforeRemove",{object:f});for(var l=0;l<i.length;l++){var d=i[l];switch(d.type){case"body":t.removeBody(o,d,h);break;case"constraint":t.removeConstraint(o,d,h);break;case"composite":t.removeComposite(o,d,h);break;case"mouseConstraint":t.removeConstraint(o,d.constraint);break}}return s.trigger(o,"afterRemove",{object:f}),o},t.addComposite=function(o,f){return o.composites.push(f),f.parent=o,t.setModified(o,!0,!0,!1),o},t.removeComposite=function(o,f,h){var i=r.indexOf(o.composites,f);if(i!==-1&&t.removeCompositeAt(o,i),h)for(var l=0;l<o.composites.length;l++)t.removeComposite(o.composites[l],f,!0);return o},t.removeCompositeAt=function(o,f){return o.composites.splice(f,1),t.setModified(o,!0,!0,!1),o},t.addBody=function(o,f){return o.bodies.push(f),t.setModified(o,!0,!0,!1),o},t.removeBody=function(o,f,h){var i=r.indexOf(o.bodies,f);if(i!==-1&&t.removeBodyAt(o,i),h)for(var l=0;l<o.composites.length;l++)t.removeBody(o.composites[l],f,!0);return o},t.removeBodyAt=function(o,f){return o.bodies.splice(f,1),t.setModified(o,!0,!0,!1),o},t.addConstraint=function(o,f){return o.constraints.push(f),t.setModified(o,!0,!0,!1),o},t.removeConstraint=function(o,f,h){var i=r.indexOf(o.constraints,f);if(i!==-1&&t.removeConstraintAt(o,i),h)for(var l=0;l<o.composites.length;l++)t.removeConstraint(o.composites[l],f,!0);return o},t.removeConstraintAt=function(o,f){return o.constraints.splice(f,1),t.setModified(o,!0,!0,!1),o},t.clear=function(o,f,h){if(h)for(var i=0;i<o.composites.length;i++)t.clear(o.composites[i],f,!0);return f?o.bodies=o.bodies.filter(function(l){return l.isStatic}):o.bodies.length=0,o.constraints.length=0,o.composites.length=0,t.setModified(o,!0,!0,!1),o},t.allBodies=function(o){if(o.cache&&o.cache.allBodies)return o.cache.allBodies;for(var f=[].concat(o.bodies),h=0;h<o.composites.length;h++)f=f.concat(t.allBodies(o.composites[h]));return o.cache&&(o.cache.allBodies=f),f},t.allConstraints=function(o){if(o.cache&&o.cache.allConstraints)return o.cache.allConstraints;for(var f=[].concat(o.constraints),h=0;h<o.composites.length;h++)f=f.concat(t.allConstraints(o.composites[h]));return o.cache&&(o.cache.allConstraints=f),f},t.allComposites=function(o){if(o.cache&&o.cache.allComposites)return o.cache.allComposites;for(var f=[].concat(o.composites),h=0;h<o.composites.length;h++)f=f.concat(t.allComposites(o.composites[h]));return o.cache&&(o.cache.allComposites=f),f},t.get=function(o,f,h){var i,l;switch(h){case"body":i=t.allBodies(o);break;case"constraint":i=t.allConstraints(o);break;case"composite":i=t.allComposites(o).concat(o);break}return i?(l=i.filter(function(d){return d.id.toString()===f.toString()}),l.length===0?null:l[0]):null},t.move=function(o,f,h){return t.remove(o,f),t.add(h,f),o},t.rebase=function(o){for(var f=t.allBodies(o).concat(t.allConstraints(o)).concat(t.allComposites(o)),h=0;h<f.length;h++)f[h].id=r.nextId();return o},t.translate=function(o,f,h){for(var i=h?t.allBodies(o):o.bodies,l=0;l<i.length;l++)u.translate(i[l],f);return o},t.rotate=function(o,f,h,i){for(var l=Math.cos(f),d=Math.sin(f),g=i?t.allBodies(o):o.bodies,v=0;v<g.length;v++){var b=g[v],M=b.position.x-h.x,k=b.position.y-h.y;u.setPosition(b,{x:h.x+(M*l-k*d),y:h.y+(M*d+k*l)}),u.rotate(b,f)}return o},t.scale=function(o,f,h,i,l){for(var d=l?t.allBodies(o):o.bodies,g=0;g<d.length;g++){var v=d[g],b=v.position.x-i.x,M=v.position.y-i.y;u.setPosition(v,{x:i.x+b*f,y:i.y+M*h}),u.scale(v,f,h)}return o},t.bounds=function(o){for(var f=t.allBodies(o),h=[],i=0;i<f.length;i+=1){var l=f[i];h.push(l.bounds.min,l.bounds.max)}return a.create(h)}})()},function(c,p,n){var t={};c.exports=t;var s=n(4),r=n(5),a=n(0);(function(){t._motionWakeThreshold=.18,t._motionSleepThreshold=.08,t._minBias=.9,t.update=function(u,o){for(var f=o/a._baseDelta,h=t._motionSleepThreshold,i=0;i<u.length;i++){var l=u[i],d=s.getSpeed(l),g=s.getAngularSpeed(l),v=d*d+g*g;if(l.force.x!==0||l.force.y!==0){t.set(l,!1);continue}var b=Math.min(l.motion,v),M=Math.max(l.motion,v);l.motion=t._minBias*b+(1-t._minBias)*M,l.sleepThreshold>0&&l.motion<h?(l.sleepCounter+=1,l.sleepCounter>=l.sleepThreshold/f&&t.set(l,!0)):l.sleepCounter>0&&(l.sleepCounter-=1)}},t.afterCollisions=function(u){for(var o=t._motionSleepThreshold,f=0;f<u.length;f++){var h=u[f];if(h.isActive){var i=h.collision,l=i.bodyA.parent,d=i.bodyB.parent;if(!(l.isSleeping&&d.isSleeping||l.isStatic||d.isStatic)&&(l.isSleeping||d.isSleeping)){var g=l.isSleeping&&!l.isStatic?l:d,v=g===l?d:l;!g.isStatic&&v.motion>o&&t.set(g,!1)}}}},t.set=function(u,o){var f=u.isSleeping;o?(u.isSleeping=!0,u.sleepCounter=u.sleepThreshold,u.positionImpulse.x=0,u.positionImpulse.y=0,u.positionPrev.x=u.position.x,u.positionPrev.y=u.position.y,u.anglePrev=u.angle,u.speed=0,u.angularSpeed=0,u.motion=0,f||r.trigger(u,"sleepStart")):(u.isSleeping=!1,u.sleepCounter=0,f&&r.trigger(u,"sleepEnd"))}})()},function(c,p,n){var t={};c.exports=t;var s=n(3),r=n(9);(function(){var a=[],u={overlap:0,axis:null},o={overlap:0,axis:null};t.create=function(f,h){return{pair:null,collided:!1,bodyA:f,bodyB:h,parentA:f.parent,parentB:h.parent,depth:0,normal:{x:0,y:0},tangent:{x:0,y:0},penetration:{x:0,y:0},supports:[]}},t.collides=function(f,h,i){if(t._overlapAxes(u,f.vertices,h.vertices,f.axes),u.overlap<=0||(t._overlapAxes(o,h.vertices,f.vertices,h.axes),o.overlap<=0))return null;var l=i&&i.table[r.id(f,h)],d;l?d=l.collision:(d=t.create(f,h),d.collided=!0,d.bodyA=f.id<h.id?f:h,d.bodyB=f.id<h.id?h:f,d.parentA=d.bodyA.parent,d.parentB=d.bodyB.parent),f=d.bodyA,h=d.bodyB;var g;u.overlap<o.overlap?g=u:g=o;var v=d.normal,b=d.supports,M=g.axis,k=M.x,m=M.y;k*(h.position.x-f.position.x)+m*(h.position.y-f.position.y)<0?(v.x=k,v.y=m):(v.x=-k,v.y=-m),d.tangent.x=-v.y,d.tangent.y=v.x,d.depth=g.overlap,d.penetration.x=v.x*d.depth,d.penetration.y=v.y*d.depth;var x=t._findSupports(f,h,v,1),S=0;if(s.contains(f.vertices,x[0])&&(b[S++]=x[0]),s.contains(f.vertices,x[1])&&(b[S++]=x[1]),S<2){var y=t._findSupports(h,f,v,-1);s.contains(h.vertices,y[0])&&(b[S++]=y[0]),S<2&&s.contains(h.vertices,y[1])&&(b[S++]=y[1])}return S===0&&(b[S++]=x[0]),b.length=S,d},t._overlapAxes=function(f,h,i,l){var d=h.length,g=i.length,v=h[0].x,b=h[0].y,M=i[0].x,k=i[0].y,m=l.length,x=Number.MAX_VALUE,S=0,y,w,C,T,P,E;for(P=0;P<m;P++){var B=l[P],A=B.x,R=B.y,L=v*A+b*R,H=M*A+k*R,V=L,O=H;for(E=1;E<d;E+=1)T=h[E].x*A+h[E].y*R,T>V?V=T:T<L&&(L=T);for(E=1;E<g;E+=1)T=i[E].x*A+i[E].y*R,T>O?O=T:T<H&&(H=T);if(w=V-H,C=O-L,y=w<C?w:C,y<x&&(x=y,S=P,y<=0))break}f.axis=l[S],f.overlap=x},t._projectToAxis=function(f,h,i){for(var l=h[0].x*i.x+h[0].y*i.y,d=l,g=1;g<h.length;g+=1){var v=h[g].x*i.x+h[g].y*i.y;v>d?d=v:v<l&&(l=v)}f.min=l,f.max=d},t._findSupports=function(f,h,i,l){var d=h.vertices,g=d.length,v=f.position.x,b=f.position.y,M=i.x*l,k=i.y*l,m=Number.MAX_VALUE,x,S,y,w,C;for(C=0;C<g;C+=1)S=d[C],w=M*(v-S.x)+k*(b-S.y),w<m&&(m=w,x=S);return y=d[(g+x.index-1)%g],m=M*(v-y.x)+k*(b-y.y),S=d[(x.index+1)%g],M*(v-S.x)+k*(b-S.y)<m?(a[0]=x,a[1]=S,a):(a[0]=x,a[1]=y,a)}})()},function(c,p,n){var t={};c.exports=t;var s=n(16);(function(){t.create=function(r,a){var u=r.bodyA,o=r.bodyB,f={id:t.id(u,o),bodyA:u,bodyB:o,collision:r,contacts:[],activeContacts:[],separation:0,isActive:!0,confirmedActive:!0,isSensor:u.isSensor||o.isSensor,timeCreated:a,timeUpdated:a,inverseMass:0,friction:0,frictionStatic:0,restitution:0,slop:0};return t.update(f,r,a),f},t.update=function(r,a,u){var o=r.contacts,f=a.supports,h=r.activeContacts,i=a.parentA,l=a.parentB,d=i.vertices.length;r.isActive=!0,r.timeUpdated=u,r.collision=a,r.separation=a.depth,r.inverseMass=i.inverseMass+l.inverseMass,r.friction=i.friction<l.friction?i.friction:l.friction,r.frictionStatic=i.frictionStatic>l.frictionStatic?i.frictionStatic:l.frictionStatic,r.restitution=i.restitution>l.restitution?i.restitution:l.restitution,r.slop=i.slop>l.slop?i.slop:l.slop,a.pair=r,h.length=0;for(var g=0;g<f.length;g++){var v=f[g],b=v.body===i?v.index:d+v.index,M=o[b];M?h.push(M):h.push(o[b]=s.create(v))}},t.setActive=function(r,a,u){a?(r.isActive=!0,r.timeUpdated=u):(r.isActive=!1,r.activeContacts.length=0)},t.id=function(r,a){return r.id<a.id?"A"+r.id+"B"+a.id:"A"+a.id+"B"+r.id}})()},function(c,p,n){var t={};c.exports=t;var s=n(3),r=n(2),a=n(7),u=n(1),o=n(11),f=n(0);(function(){t._warming=.4,t._torqueDampen=1,t._minLength=1e-6,t.create=function(h){var i=h;i.bodyA&&!i.pointA&&(i.pointA={x:0,y:0}),i.bodyB&&!i.pointB&&(i.pointB={x:0,y:0});var l=i.bodyA?r.add(i.bodyA.position,i.pointA):i.pointA,d=i.bodyB?r.add(i.bodyB.position,i.pointB):i.pointB,g=r.magnitude(r.sub(l,d));i.length=typeof i.length<"u"?i.length:g,i.id=i.id||f.nextId(),i.label=i.label||"Constraint",i.type="constraint",i.stiffness=i.stiffness||(i.length>0?1:.7),i.damping=i.damping||0,i.angularStiffness=i.angularStiffness||0,i.angleA=i.bodyA?i.bodyA.angle:i.angleA,i.angleB=i.bodyB?i.bodyB.angle:i.angleB,i.plugin={};var v={visible:!0,lineWidth:2,strokeStyle:"#ffffff",type:"line",anchors:!0};return i.length===0&&i.stiffness>.1?(v.type="pin",v.anchors=!1):i.stiffness<.9&&(v.type="spring"),i.render=f.extend(v,i.render),i},t.preSolveAll=function(h){for(var i=0;i<h.length;i+=1){var l=h[i],d=l.constraintImpulse;l.isStatic||d.x===0&&d.y===0&&d.angle===0||(l.position.x+=d.x,l.position.y+=d.y,l.angle+=d.angle)}},t.solveAll=function(h,i){for(var l=f.clamp(i/f._baseDelta,0,1),d=0;d<h.length;d+=1){var g=h[d],v=!g.bodyA||g.bodyA&&g.bodyA.isStatic,b=!g.bodyB||g.bodyB&&g.bodyB.isStatic;(v||b)&&t.solve(h[d],l)}for(d=0;d<h.length;d+=1)g=h[d],v=!g.bodyA||g.bodyA&&g.bodyA.isStatic,b=!g.bodyB||g.bodyB&&g.bodyB.isStatic,!v&&!b&&t.solve(h[d],l)},t.solve=function(h,i){var l=h.bodyA,d=h.bodyB,g=h.pointA,v=h.pointB;if(!(!l&&!d)){l&&!l.isStatic&&(r.rotate(g,l.angle-h.angleA,g),h.angleA=l.angle),d&&!d.isStatic&&(r.rotate(v,d.angle-h.angleB,v),h.angleB=d.angle);var b=g,M=v;if(l&&(b=r.add(l.position,g)),d&&(M=r.add(d.position,v)),!(!b||!M)){var k=r.sub(b,M),m=r.magnitude(k);m<t._minLength&&(m=t._minLength);var x=(m-h.length)/m,S=h.stiffness>=1||h.length===0,y=S?h.stiffness*i:h.stiffness*i*i,w=h.damping*i,C=r.mult(k,x*y),T=(l?l.inverseMass:0)+(d?d.inverseMass:0),P=(l?l.inverseInertia:0)+(d?d.inverseInertia:0),E=T+P,B,A,R,L,H;if(w>0){var V=r.create();R=r.div(k,m),H=r.sub(d&&r.sub(d.position,d.positionPrev)||V,l&&r.sub(l.position,l.positionPrev)||V),L=r.dot(R,H)}l&&!l.isStatic&&(A=l.inverseMass/T,l.constraintImpulse.x-=C.x*A,l.constraintImpulse.y-=C.y*A,l.position.x-=C.x*A,l.position.y-=C.y*A,w>0&&(l.positionPrev.x-=w*R.x*L*A,l.positionPrev.y-=w*R.y*L*A),B=r.cross(g,C)/E*t._torqueDampen*l.inverseInertia*(1-h.angularStiffness),l.constraintImpulse.angle-=B,l.angle-=B),d&&!d.isStatic&&(A=d.inverseMass/T,d.constraintImpulse.x+=C.x*A,d.constraintImpulse.y+=C.y*A,d.position.x+=C.x*A,d.position.y+=C.y*A,w>0&&(d.positionPrev.x+=w*R.x*L*A,d.positionPrev.y+=w*R.y*L*A),B=r.cross(v,C)/E*t._torqueDampen*d.inverseInertia*(1-h.angularStiffness),d.constraintImpulse.angle+=B,d.angle+=B)}}},t.postSolveAll=function(h){for(var i=0;i<h.length;i++){var l=h[i],d=l.constraintImpulse;if(!(l.isStatic||d.x===0&&d.y===0&&d.angle===0)){a.set(l,!1);for(var g=0;g<l.parts.length;g++){var v=l.parts[g];s.translate(v.vertices,d),g>0&&(v.position.x+=d.x,v.position.y+=d.y),d.angle!==0&&(s.rotate(v.vertices,d.angle,l.position),o.rotate(v.axes,d.angle),g>0&&r.rotateAbout(v.position,d.angle,l.position,v.position)),u.update(v.bounds,v.vertices,l.velocity)}d.angle*=t._warming,d.x*=t._warming,d.y*=t._warming}}},t.pointAWorld=function(h){return{x:(h.bodyA?h.bodyA.position.x:0)+(h.pointA?h.pointA.x:0),y:(h.bodyA?h.bodyA.position.y:0)+(h.pointA?h.pointA.y:0)}},t.pointBWorld=function(h){return{x:(h.bodyB?h.bodyB.position.x:0)+(h.pointB?h.pointB.x:0),y:(h.bodyB?h.bodyB.position.y:0)+(h.pointB?h.pointB.y:0)}}})()},function(c,p,n){var t={};c.exports=t;var s=n(2),r=n(0);(function(){t.fromVertices=function(a){for(var u={},o=0;o<a.length;o++){var f=(o+1)%a.length,h=s.normalise({x:a[f].y-a[o].y,y:a[o].x-a[f].x}),i=h.y===0?1/0:h.x/h.y;i=i.toFixed(3).toString(),u[i]=h}return r.values(u)},t.rotate=function(a,u){if(u!==0)for(var o=Math.cos(u),f=Math.sin(u),h=0;h<a.length;h++){var i=a[h],l;l=i.x*o-i.y*f,i.y=i.x*f+i.y*o,i.x=l}}})()},function(c,p,n){var t={};c.exports=t;var s=n(3),r=n(0),a=n(4),u=n(1),o=n(2);(function(){t.rectangle=function(f,h,i,l,d){d=d||{};var g={label:"Rectangle Body",position:{x:f,y:h},vertices:s.fromPath("L 0 0 L "+i+" 0 L "+i+" "+l+" L 0 "+l)};if(d.chamfer){var v=d.chamfer;g.vertices=s.chamfer(g.vertices,v.radius,v.quality,v.qualityMin,v.qualityMax),delete d.chamfer}return a.create(r.extend({},g,d))},t.trapezoid=function(f,h,i,l,d,g){g=g||{},d*=.5;var v=(1-d*2)*i,b=i*d,M=b+v,k=M+b,m;d<.5?m="L 0 0 L "+b+" "+-l+" L "+M+" "+-l+" L "+k+" 0":m="L 0 0 L "+M+" "+-l+" L "+k+" 0";var x={label:"Trapezoid Body",position:{x:f,y:h},vertices:s.fromPath(m)};if(g.chamfer){var S=g.chamfer;x.vertices=s.chamfer(x.vertices,S.radius,S.quality,S.qualityMin,S.qualityMax),delete g.chamfer}return a.create(r.extend({},x,g))},t.circle=function(f,h,i,l,d){l=l||{};var g={label:"Circle Body",circleRadius:i};d=d||25;var v=Math.ceil(Math.max(10,Math.min(d,i)));return v%2===1&&(v+=1),t.polygon(f,h,v,i,r.extend({},g,l))},t.polygon=function(f,h,i,l,d){if(d=d||{},i<3)return t.circle(f,h,l,d);for(var g=2*Math.PI/i,v="",b=g*.5,M=0;M<i;M+=1){var k=b+M*g,m=Math.cos(k)*l,x=Math.sin(k)*l;v+="L "+m.toFixed(3)+" "+x.toFixed(3)+" "}var S={label:"Polygon Body",position:{x:f,y:h},vertices:s.fromPath(v)};if(d.chamfer){var y=d.chamfer;S.vertices=s.chamfer(S.vertices,y.radius,y.quality,y.qualityMin,y.qualityMax),delete d.chamfer}return a.create(r.extend({},S,d))},t.fromVertices=function(f,h,i,l,d,g,v,b){var M=r.getDecomp(),k,m,x,S,y,w,C,T,P,E,B;for(k=!!(M&&M.quickDecomp),l=l||{},x=[],d=typeof d<"u"?d:!1,g=typeof g<"u"?g:.01,v=typeof v<"u"?v:10,b=typeof b<"u"?b:.01,r.isArray(i[0])||(i=[i]),E=0;E<i.length;E+=1)if(w=i[E],S=s.isConvex(w),y=!S,y&&!k&&r.warnOnce("Bodies.fromVertices: Install the 'poly-decomp' library and use Common.setDecomp or provide 'decomp' as a global to decompose concave vertices."),S||!k)S?w=s.clockwiseSort(w):w=s.hull(w),x.push({position:{x:f,y:h},vertices:w});else{var A=w.map(function(z){return[z.x,z.y]});M.makeCCW(A),g!==!1&&M.removeCollinearPoints(A,g),b!==!1&&M.removeDuplicatePoints&&M.removeDuplicatePoints(A,b);var R=M.quickDecomp(A);for(C=0;C<R.length;C++){var L=R[C],H=L.map(function(z){return{x:z[0],y:z[1]}});v>0&&s.area(H)<v||x.push({position:s.centre(H),vertices:H})}}for(C=0;C<x.length;C++)x[C]=a.create(r.extend(x[C],l));if(d){var V=5;for(C=0;C<x.length;C++){var O=x[C];for(T=C+1;T<x.length;T++){var N=x[T];if(u.overlaps(O.bounds,N.bounds)){var W=O.vertices,U=N.vertices;for(P=0;P<O.vertices.length;P++)for(B=0;B<N.vertices.length;B++){var G=o.magnitudeSquared(o.sub(W[(P+1)%W.length],U[B])),$=o.magnitudeSquared(o.sub(W[P],U[(B+1)%U.length]));G<V&&$<V&&(W[P].isInternal=!0,U[B].isInternal=!0)}}}}}return x.length>1?(m=a.create(r.extend({parts:x.slice(0)},l)),a.setPosition(m,{x:f,y:h}),m):x[0]}})()},function(c,p,n){var t={};c.exports=t;var s=n(0),r=n(8);(function(){t.create=function(a){var u={bodies:[],pairs:null};return s.extend(u,a)},t.setBodies=function(a,u){a.bodies=u.slice(0)},t.clear=function(a){a.bodies=[]},t.collisions=function(a){var u=[],o=a.pairs,f=a.bodies,h=f.length,i=t.canCollide,l=r.collides,d,g;for(f.sort(t._compareBoundsX),d=0;d<h;d++){var v=f[d],b=v.bounds,M=v.bounds.max.x,k=v.bounds.max.y,m=v.bounds.min.y,x=v.isStatic||v.isSleeping,S=v.parts.length,y=S===1;for(g=d+1;g<h;g++){var w=f[g],C=w.bounds;if(C.min.x>M)break;if(!(k<C.min.y||m>C.max.y)&&!(x&&(w.isStatic||w.isSleeping))&&i(v.collisionFilter,w.collisionFilter)){var T=w.parts.length;if(y&&T===1){var P=l(v,w,o);P&&u.push(P)}else for(var E=S>1?1:0,B=T>1?1:0,A=E;A<S;A++)for(var R=v.parts[A],b=R.bounds,L=B;L<T;L++){var H=w.parts[L],C=H.bounds;if(!(b.min.x>C.max.x||b.max.x<C.min.x||b.max.y<C.min.y||b.min.y>C.max.y)){var P=l(R,H,o);P&&u.push(P)}}}}}return u},t.canCollide=function(a,u){return a.group===u.group&&a.group!==0?a.group>0:(a.mask&u.category)!==0&&(u.mask&a.category)!==0},t._compareBoundsX=function(a,u){return a.bounds.min.x-u.bounds.min.x}})()},function(c,p,n){var t={};c.exports=t;var s=n(0);(function(){t.create=function(r){var a={};return r||s.log("Mouse.create: element was undefined, defaulting to document.body","warn"),a.element=r||document.body,a.absolute={x:0,y:0},a.position={x:0,y:0},a.mousedownPosition={x:0,y:0},a.mouseupPosition={x:0,y:0},a.offset={x:0,y:0},a.scale={x:1,y:1},a.wheelDelta=0,a.button=-1,a.pixelRatio=parseInt(a.element.getAttribute("data-pixel-ratio"),10)||1,a.sourceEvents={mousemove:null,mousedown:null,mouseup:null,mousewheel:null},a.mousemove=function(u){var o=t._getRelativeMousePosition(u,a.element,a.pixelRatio),f=u.changedTouches;f&&(a.button=0,u.preventDefault()),a.absolute.x=o.x,a.absolute.y=o.y,a.position.x=a.absolute.x*a.scale.x+a.offset.x,a.position.y=a.absolute.y*a.scale.y+a.offset.y,a.sourceEvents.mousemove=u},a.mousedown=function(u){var o=t._getRelativeMousePosition(u,a.element,a.pixelRatio),f=u.changedTouches;f?(a.button=0,u.preventDefault()):a.button=u.button,a.absolute.x=o.x,a.absolute.y=o.y,a.position.x=a.absolute.x*a.scale.x+a.offset.x,a.position.y=a.absolute.y*a.scale.y+a.offset.y,a.mousedownPosition.x=a.position.x,a.mousedownPosition.y=a.position.y,a.sourceEvents.mousedown=u},a.mouseup=function(u){var o=t._getRelativeMousePosition(u,a.element,a.pixelRatio),f=u.changedTouches;f&&u.preventDefault(),a.button=-1,a.absolute.x=o.x,a.absolute.y=o.y,a.position.x=a.absolute.x*a.scale.x+a.offset.x,a.position.y=a.absolute.y*a.scale.y+a.offset.y,a.mouseupPosition.x=a.position.x,a.mouseupPosition.y=a.position.y,a.sourceEvents.mouseup=u},a.mousewheel=function(u){a.wheelDelta=Math.max(-1,Math.min(1,u.wheelDelta||-u.detail)),u.preventDefault()},t.setElement(a,a.element),a},t.setElement=function(r,a){r.element=a,a.addEventListener("mousemove",r.mousemove),a.addEventListener("mousedown",r.mousedown),a.addEventListener("mouseup",r.mouseup),a.addEventListener("mousewheel",r.mousewheel),a.addEventListener("DOMMouseScroll",r.mousewheel),a.addEventListener("touchmove",r.mousemove),a.addEventListener("touchstart",r.mousedown),a.addEventListener("touchend",r.mouseup)},t.clearSourceEvents=function(r){r.sourceEvents.mousemove=null,r.sourceEvents.mousedown=null,r.sourceEvents.mouseup=null,r.sourceEvents.mousewheel=null,r.wheelDelta=0},t.setOffset=function(r,a){r.offset.x=a.x,r.offset.y=a.y,r.position.x=r.absolute.x*r.scale.x+r.offset.x,r.position.y=r.absolute.y*r.scale.y+r.offset.y},t.setScale=function(r,a){r.scale.x=a.x,r.scale.y=a.y,r.position.x=r.absolute.x*r.scale.x+r.offset.x,r.position.y=r.absolute.y*r.scale.y+r.offset.y},t._getRelativeMousePosition=function(r,a,u){var o=a.getBoundingClientRect(),f=document.documentElement||document.body.parentNode||document.body,h=window.pageXOffset!==void 0?window.pageXOffset:f.scrollLeft,i=window.pageYOffset!==void 0?window.pageYOffset:f.scrollTop,l=r.changedTouches,d,g;return l?(d=l[0].pageX-o.left-h,g=l[0].pageY-o.top-i):(d=r.pageX-o.left-h,g=r.pageY-o.top-i),{x:d/(a.clientWidth/(a.width||a.clientWidth)*u),y:g/(a.clientHeight/(a.height||a.clientHeight)*u)}}})()},function(c,p,n){var t={};c.exports=t;var s=n(0);(function(){t._registry={},t.register=function(r){if(t.isPlugin(r)||s.warn("Plugin.register:",t.toString(r),"does not implement all required fields."),r.name in t._registry){var a=t._registry[r.name],u=t.versionParse(r.version).number,o=t.versionParse(a.version).number;u>o?(s.warn("Plugin.register:",t.toString(a),"was upgraded to",t.toString(r)),t._registry[r.name]=r):u<o?s.warn("Plugin.register:",t.toString(a),"can not be downgraded to",t.toString(r)):r!==a&&s.warn("Plugin.register:",t.toString(r),"is already registered to different plugin object")}else t._registry[r.name]=r;return r},t.resolve=function(r){return t._registry[t.dependencyParse(r).name]},t.toString=function(r){return typeof r=="string"?r:(r.name||"anonymous")+"@"+(r.version||r.range||"0.0.0")},t.isPlugin=function(r){return r&&r.name&&r.version&&r.install},t.isUsed=function(r,a){return r.used.indexOf(a)>-1},t.isFor=function(r,a){var u=r.for&&t.dependencyParse(r.for);return!r.for||a.name===u.name&&t.versionSatisfies(a.version,u.range)},t.use=function(r,a){if(r.uses=(r.uses||[]).concat(a||[]),r.uses.length===0){s.warn("Plugin.use:",t.toString(r),"does not specify any dependencies to install.");return}for(var u=t.dependencies(r),o=s.topologicalSort(u),f=[],h=0;h<o.length;h+=1)if(o[h]!==r.name){var i=t.resolve(o[h]);if(!i){f.push("❌ "+o[h]);continue}t.isUsed(r,i.name)||(t.isFor(i,r)||(s.warn("Plugin.use:",t.toString(i),"is for",i.for,"but installed on",t.toString(r)+"."),i._warned=!0),i.install?i.install(r):(s.warn("Plugin.use:",t.toString(i),"does not specify an install function."),i._warned=!0),i._warned?(f.push("🔶 "+t.toString(i)),delete i._warned):f.push("✅ "+t.toString(i)),r.used.push(i.name))}f.length>0&&s.info(f.join("  "))},t.dependencies=function(r,a){var u=t.dependencyParse(r),o=u.name;if(a=a||{},!(o in a)){r=t.resolve(r)||r,a[o]=s.map(r.uses||[],function(h){t.isPlugin(h)&&t.register(h);var i=t.dependencyParse(h),l=t.resolve(h);return l&&!t.versionSatisfies(l.version,i.range)?(s.warn("Plugin.dependencies:",t.toString(l),"does not satisfy",t.toString(i),"used by",t.toString(u)+"."),l._warned=!0,r._warned=!0):l||(s.warn("Plugin.dependencies:",t.toString(h),"used by",t.toString(u),"could not be resolved."),r._warned=!0),i.name});for(var f=0;f<a[o].length;f+=1)t.dependencies(a[o][f],a);return a}},t.dependencyParse=function(r){if(s.isString(r)){var a=/^[\w-]+(@(\*|[\^~]?\d+\.\d+\.\d+(-[0-9A-Za-z-+]+)?))?$/;return a.test(r)||s.warn("Plugin.dependencyParse:",r,"is not a valid dependency string."),{name:r.split("@")[0],range:r.split("@")[1]||"*"}}return{name:r.name,range:r.range||r.version}},t.versionParse=function(r){var a=/^(\*)|(\^|~|>=|>)?\s*((\d+)\.(\d+)\.(\d+))(-[0-9A-Za-z-+]+)?$/;a.test(r)||s.warn("Plugin.versionParse:",r,"is not a valid version or range.");var u=a.exec(r),o=Number(u[4]),f=Number(u[5]),h=Number(u[6]);return{isRange:!!(u[1]||u[2]),version:u[3],range:r,operator:u[1]||u[2]||"",major:o,minor:f,patch:h,parts:[o,f,h],prerelease:u[7],number:o*1e8+f*1e4+h}},t.versionSatisfies=function(r,a){a=a||"*";var u=t.versionParse(a),o=t.versionParse(r);if(u.isRange){if(u.operator==="*"||r==="*")return!0;if(u.operator===">")return o.number>u.number;if(u.operator===">=")return o.number>=u.number;if(u.operator==="~")return o.major===u.major&&o.minor===u.minor&&o.patch>=u.patch;if(u.operator==="^")return u.major>0?o.major===u.major&&o.number>=u.number:u.minor>0?o.minor===u.minor&&o.patch>=u.patch:o.patch===u.patch}return r===a||r==="*"}})()},function(c,p){var n={};c.exports=n,function(){n.create=function(t){return{vertex:t,normalImpulse:0,tangentImpulse:0}}}()},function(c,p,n){var t={};c.exports=t;var s=n(7),r=n(18),a=n(13),u=n(19),o=n(5),f=n(6),h=n(10),i=n(0),l=n(4);(function(){t.create=function(d){d=d||{};var g={positionIterations:6,velocityIterations:4,constraintIterations:2,enableSleeping:!1,events:[],plugin:{},gravity:{x:0,y:1,scale:.001},timing:{timestamp:0,timeScale:1,lastDelta:0,lastElapsed:0}},v=i.extend(g,d);return v.world=d.world||f.create({label:"World"}),v.pairs=d.pairs||u.create(),v.detector=d.detector||a.create(),v.grid={buckets:[]},v.world.gravity=v.gravity,v.broadphase=v.grid,v.metrics={},v},t.update=function(d,g){var v=i.now(),b=d.world,M=d.detector,k=d.pairs,m=d.timing,x=m.timestamp,S;g=typeof g<"u"?g:i._baseDelta,g*=m.timeScale,m.timestamp+=g,m.lastDelta=g;var y={timestamp:m.timestamp,delta:g};o.trigger(d,"beforeUpdate",y);var w=f.allBodies(b),C=f.allConstraints(b);for(b.isModified&&(a.setBodies(M,w),f.setModified(b,!1,!1,!0)),d.enableSleeping&&s.update(w,g),t._bodiesApplyGravity(w,d.gravity),g>0&&t._bodiesUpdate(w,g),h.preSolveAll(w),S=0;S<d.constraintIterations;S++)h.solveAll(C,g);h.postSolveAll(w),M.pairs=d.pairs;var T=a.collisions(M);u.update(k,T,x),d.enableSleeping&&s.afterCollisions(k.list),k.collisionStart.length>0&&o.trigger(d,"collisionStart",{pairs:k.collisionStart});var P=i.clamp(20/d.positionIterations,0,1);for(r.preSolvePosition(k.list),S=0;S<d.positionIterations;S++)r.solvePosition(k.list,g,P);for(r.postSolvePosition(w),h.preSolveAll(w),S=0;S<d.constraintIterations;S++)h.solveAll(C,g);for(h.postSolveAll(w),r.preSolveVelocity(k.list),S=0;S<d.velocityIterations;S++)r.solveVelocity(k.list,g);return t._bodiesUpdateVelocities(w),k.collisionActive.length>0&&o.trigger(d,"collisionActive",{pairs:k.collisionActive}),k.collisionEnd.length>0&&o.trigger(d,"collisionEnd",{pairs:k.collisionEnd}),t._bodiesClearForces(w),o.trigger(d,"afterUpdate",y),d.timing.lastElapsed=i.now()-v,d},t.merge=function(d,g){if(i.extend(d,g),g.world){d.world=g.world,t.clear(d);for(var v=f.allBodies(d.world),b=0;b<v.length;b++){var M=v[b];s.set(M,!1),M.id=i.nextId()}}},t.clear=function(d){u.clear(d.pairs),a.clear(d.detector)},t._bodiesClearForces=function(d){for(var g=d.length,v=0;v<g;v++){var b=d[v];b.force.x=0,b.force.y=0,b.torque=0}},t._bodiesApplyGravity=function(d,g){var v=typeof g.scale<"u"?g.scale:.001,b=d.length;if(!(g.x===0&&g.y===0||v===0))for(var M=0;M<b;M++){var k=d[M];k.isStatic||k.isSleeping||(k.force.y+=k.mass*g.y*v,k.force.x+=k.mass*g.x*v)}},t._bodiesUpdate=function(d,g){for(var v=d.length,b=0;b<v;b++){var M=d[b];M.isStatic||M.isSleeping||l.update(M,g)}},t._bodiesUpdateVelocities=function(d){for(var g=d.length,v=0;v<g;v++)l.updateVelocities(d[v])}})()},function(c,p,n){var t={};c.exports=t;var s=n(3),r=n(0),a=n(1);(function(){t._restingThresh=2,t._restingThreshTangent=Math.sqrt(6),t._positionDampen=.9,t._positionWarming=.8,t._frictionNormalMultiplier=5,t._frictionMaxStatic=Number.MAX_VALUE,t.preSolvePosition=function(u){var o,f,h,i=u.length;for(o=0;o<i;o++)f=u[o],f.isActive&&(h=f.activeContacts.length,f.collision.parentA.totalContacts+=h,f.collision.parentB.totalContacts+=h)},t.solvePosition=function(u,o,f){var h,i,l,d,g,v,b,M,k=t._positionDampen*(f||1),m=r.clamp(o/r._baseDelta,0,1),x=u.length;for(h=0;h<x;h++)i=u[h],!(!i.isActive||i.isSensor)&&(l=i.collision,d=l.parentA,g=l.parentB,v=l.normal,i.separation=v.x*(g.positionImpulse.x+l.penetration.x-d.positionImpulse.x)+v.y*(g.positionImpulse.y+l.penetration.y-d.positionImpulse.y));for(h=0;h<x;h++)i=u[h],!(!i.isActive||i.isSensor)&&(l=i.collision,d=l.parentA,g=l.parentB,v=l.normal,M=i.separation-i.slop*m,(d.isStatic||g.isStatic)&&(M*=2),d.isStatic||d.isSleeping||(b=k/d.totalContacts,d.positionImpulse.x+=v.x*M*b,d.positionImpulse.y+=v.y*M*b),g.isStatic||g.isSleeping||(b=k/g.totalContacts,g.positionImpulse.x-=v.x*M*b,g.positionImpulse.y-=v.y*M*b))},t.postSolvePosition=function(u){for(var o=t._positionWarming,f=u.length,h=s.translate,i=a.update,l=0;l<f;l++){var d=u[l],g=d.positionImpulse,v=g.x,b=g.y,M=d.velocity;if(d.totalContacts=0,v!==0||b!==0){for(var k=0;k<d.parts.length;k++){var m=d.parts[k];h(m.vertices,g),i(m.bounds,m.vertices,M),m.position.x+=v,m.position.y+=b}d.positionPrev.x+=v,d.positionPrev.y+=b,v*M.x+b*M.y<0?(g.x=0,g.y=0):(g.x*=o,g.y*=o)}}},t.preSolveVelocity=function(u){var o=u.length,f,h;for(f=0;f<o;f++){var i=u[f];if(!(!i.isActive||i.isSensor)){var l=i.activeContacts,d=l.length,g=i.collision,v=g.parentA,b=g.parentB,M=g.normal,k=g.tangent;for(h=0;h<d;h++){var m=l[h],x=m.vertex,S=m.normalImpulse,y=m.tangentImpulse;if(S!==0||y!==0){var w=M.x*S+k.x*y,C=M.y*S+k.y*y;v.isStatic||v.isSleeping||(v.positionPrev.x+=w*v.inverseMass,v.positionPrev.y+=C*v.inverseMass,v.anglePrev+=v.inverseInertia*((x.x-v.position.x)*C-(x.y-v.position.y)*w)),b.isStatic||b.isSleeping||(b.positionPrev.x-=w*b.inverseMass,b.positionPrev.y-=C*b.inverseMass,b.anglePrev-=b.inverseInertia*((x.x-b.position.x)*C-(x.y-b.position.y)*w))}}}}},t.solveVelocity=function(u,o){var f=o/r._baseDelta,h=f*f,i=h*f,l=-t._restingThresh*f,d=t._restingThreshTangent,g=t._frictionNormalMultiplier*f,v=t._frictionMaxStatic,b=u.length,M,k,m,x;for(m=0;m<b;m++){var S=u[m];if(!(!S.isActive||S.isSensor)){var y=S.collision,w=y.parentA,C=y.parentB,T=w.velocity,P=C.velocity,E=y.normal.x,B=y.normal.y,A=y.tangent.x,R=y.tangent.y,L=S.activeContacts,H=L.length,V=1/H,O=w.inverseMass+C.inverseMass,N=S.friction*S.frictionStatic*g;for(T.x=w.position.x-w.positionPrev.x,T.y=w.position.y-w.positionPrev.y,P.x=C.position.x-C.positionPrev.x,P.y=C.position.y-C.positionPrev.y,w.angularVelocity=w.angle-w.anglePrev,C.angularVelocity=C.angle-C.anglePrev,x=0;x<H;x++){var W=L[x],U=W.vertex,G=U.x-w.position.x,$=U.y-w.position.y,z=U.x-C.position.x,j=U.y-C.position.y,Y=T.x-$*w.angularVelocity,Ie=T.y+G*w.angularVelocity,Ae=P.x-j*C.angularVelocity,Be=P.y+z*C.angularVelocity,oe=Y-Ae,le=Ie-Be,ie=E*oe+B*le,K=A*oe+R*le,he=S.separation+ie,se=Math.min(he,1);se=he<0?0:se;var ce=se*N;K<-ce||K>ce?(k=K>0?K:-K,M=S.friction*(K>0?1:-1)*i,M<-k?M=-k:M>k&&(M=k)):(M=K,k=v);var de=G*B-$*E,ue=z*B-j*E,fe=V/(O+w.inverseInertia*de*de+C.inverseInertia*ue*ue),_=(1+S.restitution)*ie*fe;if(M*=fe,ie<l)W.normalImpulse=0;else{var Le=W.normalImpulse;W.normalImpulse+=_,W.normalImpulse>0&&(W.normalImpulse=0),_=W.normalImpulse-Le}if(K<-d||K>d)W.tangentImpulse=0;else{var Re=W.tangentImpulse;W.tangentImpulse+=M,W.tangentImpulse<-k&&(W.tangentImpulse=-k),W.tangentImpulse>k&&(W.tangentImpulse=k),M=W.tangentImpulse-Re}var ee=E*_+A*M,te=B*_+R*M;w.isStatic||w.isSleeping||(w.positionPrev.x+=ee*w.inverseMass,w.positionPrev.y+=te*w.inverseMass,w.anglePrev+=(G*te-$*ee)*w.inverseInertia),C.isStatic||C.isSleeping||(C.positionPrev.x-=ee*C.inverseMass,C.positionPrev.y-=te*C.inverseMass,C.anglePrev-=(z*te-j*ee)*C.inverseInertia)}}}}})()},function(c,p,n){var t={};c.exports=t;var s=n(9),r=n(0);(function(){t.create=function(a){return r.extend({table:{},list:[],collisionStart:[],collisionActive:[],collisionEnd:[]},a)},t.update=function(a,u,o){var f=a.list,h=f.length,i=a.table,l=u.length,d=a.collisionStart,g=a.collisionEnd,v=a.collisionActive,b,M,k,m;for(d.length=0,g.length=0,v.length=0,m=0;m<h;m++)f[m].confirmedActive=!1;for(m=0;m<l;m++)b=u[m],k=b.pair,k?(k.isActive?v.push(k):d.push(k),s.update(k,b,o),k.confirmedActive=!0):(k=s.create(b,o),i[k.id]=k,d.push(k),f.push(k));var x=[];for(h=f.length,m=0;m<h;m++)k=f[m],k.confirmedActive||(s.setActive(k,!1,o),g.push(k),!k.collision.bodyA.isSleeping&&!k.collision.bodyB.isSleeping&&x.push(m));for(m=0;m<x.length;m++)M=x[m]-m,k=f[M],f.splice(M,1),delete i[k.id]},t.clear=function(a){return a.table={},a.list.length=0,a.collisionStart.length=0,a.collisionActive.length=0,a.collisionEnd.length=0,a}})()},function(c,p,n){var t=c.exports=n(21);t.Axes=n(11),t.Bodies=n(12),t.Body=n(4),t.Bounds=n(1),t.Collision=n(8),t.Common=n(0),t.Composite=n(6),t.Composites=n(22),t.Constraint=n(10),t.Contact=n(16),t.Detector=n(13),t.Engine=n(17),t.Events=n(5),t.Grid=n(23),t.Mouse=n(14),t.MouseConstraint=n(24),t.Pair=n(9),t.Pairs=n(19),t.Plugin=n(15),t.Query=n(25),t.Render=n(26),t.Resolver=n(18),t.Runner=n(27),t.SAT=n(28),t.Sleeping=n(7),t.Svg=n(29),t.Vector=n(2),t.Vertices=n(3),t.World=n(30),t.Engine.run=t.Runner.run,t.Common.deprecated(t.Engine,"run","Engine.run ➤ use Matter.Runner.run(engine) instead")},function(c,p,n){var t={};c.exports=t;var s=n(15),r=n(0);(function(){t.name="matter-js",t.version="0.19.0",t.uses=[],t.used=[],t.use=function(){s.use(t,Array.prototype.slice.call(arguments))},t.before=function(a,u){return a=a.replace(/^Matter./,""),r.chainPathBefore(t,a,u)},t.after=function(a,u){return a=a.replace(/^Matter./,""),r.chainPathAfter(t,a,u)}})()},function(c,p,n){var t={};c.exports=t;var s=n(6),r=n(10),a=n(0),u=n(4),o=n(12),f=a.deprecated;(function(){t.stack=function(h,i,l,d,g,v,b){for(var M=s.create({label:"Stack"}),k=h,m=i,x,S=0,y=0;y<d;y++){for(var w=0,C=0;C<l;C++){var T=b(k,m,C,y,x,S);if(T){var P=T.bounds.max.y-T.bounds.min.y,E=T.bounds.max.x-T.bounds.min.x;P>w&&(w=P),u.translate(T,{x:E*.5,y:P*.5}),k=T.bounds.max.x+g,s.addBody(M,T),x=T,S+=1}else k+=g}m+=w+v,k=h}return M},t.chain=function(h,i,l,d,g,v){for(var b=h.bodies,M=1;M<b.length;M++){var k=b[M-1],m=b[M],x=k.bounds.max.y-k.bounds.min.y,S=k.bounds.max.x-k.bounds.min.x,y=m.bounds.max.y-m.bounds.min.y,w=m.bounds.max.x-m.bounds.min.x,C={bodyA:k,pointA:{x:S*i,y:x*l},bodyB:m,pointB:{x:w*d,y:y*g}},T=a.extend(C,v);s.addConstraint(h,r.create(T))}return h.label+=" Chain",h},t.mesh=function(h,i,l,d,g){var v=h.bodies,b,M,k,m,x;for(b=0;b<l;b++){for(M=1;M<i;M++)k=v[M-1+b*i],m=v[M+b*i],s.addConstraint(h,r.create(a.extend({bodyA:k,bodyB:m},g)));if(b>0)for(M=0;M<i;M++)k=v[M+(b-1)*i],m=v[M+b*i],s.addConstraint(h,r.create(a.extend({bodyA:k,bodyB:m},g))),d&&M>0&&(x=v[M-1+(b-1)*i],s.addConstraint(h,r.create(a.extend({bodyA:x,bodyB:m},g)))),d&&M<i-1&&(x=v[M+1+(b-1)*i],s.addConstraint(h,r.create(a.extend({bodyA:x,bodyB:m},g))))}return h.label+=" Mesh",h},t.pyramid=function(h,i,l,d,g,v,b){return t.stack(h,i,l,d,g,v,function(M,k,m,x,S,y){var w=Math.min(d,Math.ceil(l/2)),C=S?S.bounds.max.x-S.bounds.min.x:0;if(!(x>w)){x=w-x;var T=x,P=l-1-x;if(!(m<T||m>P)){y===1&&u.translate(S,{x:(m+(l%2===1?1:-1))*C,y:0});var E=S?m*C:0;return b(h+E+m*g,k,m,x,S,y)}}})},t.newtonsCradle=function(h,i,l,d,g){for(var v=s.create({label:"Newtons Cradle"}),b=0;b<l;b++){var M=1.9,k=o.circle(h+b*(d*M),i+g,d,{inertia:1/0,restitution:1,friction:0,frictionAir:1e-4,slop:1}),m=r.create({pointA:{x:h+b*(d*M),y:i},bodyB:k});s.addBody(v,k),s.addConstraint(v,m)}return v},f(t,"newtonsCradle","Composites.newtonsCradle ➤ moved to newtonsCradle example"),t.car=function(h,i,l,d,g){var v=u.nextGroup(!0),b=20,M=-l*.5+b,k=l*.5-b,m=0,x=s.create({label:"Car"}),S=o.rectangle(h,i,l,d,{collisionFilter:{group:v},chamfer:{radius:d*.5},density:2e-4}),y=o.circle(h+M,i+m,g,{collisionFilter:{group:v},friction:.8}),w=o.circle(h+k,i+m,g,{collisionFilter:{group:v},friction:.8}),C=r.create({bodyB:S,pointB:{x:M,y:m},bodyA:y,stiffness:1,length:0}),T=r.create({bodyB:S,pointB:{x:k,y:m},bodyA:w,stiffness:1,length:0});return s.addBody(x,S),s.addBody(x,y),s.addBody(x,w),s.addConstraint(x,C),s.addConstraint(x,T),x},f(t,"car","Composites.car ➤ moved to car example"),t.softBody=function(h,i,l,d,g,v,b,M,k,m){k=a.extend({inertia:1/0},k),m=a.extend({stiffness:.2,render:{type:"line",anchors:!1}},m);var x=t.stack(h,i,l,d,g,v,function(S,y){return o.circle(S,y,M,k)});return t.mesh(x,l,d,b,m),x.label="Soft Body",x},f(t,"softBody","Composites.softBody ➤ moved to softBody and cloth examples")})()},function(c,p,n){var t={};c.exports=t;var s=n(9),r=n(0),a=r.deprecated;(function(){t.create=function(u){var o={buckets:{},pairs:{},pairsList:[],bucketWidth:48,bucketHeight:48};return r.extend(o,u)},t.update=function(u,o,f,h){var i,l,d,g=f.world,v=u.buckets,b,M,k=!1;for(i=0;i<o.length;i++){var m=o[i];if(!(m.isSleeping&&!h)&&!(g.bounds&&(m.bounds.max.x<g.bounds.min.x||m.bounds.min.x>g.bounds.max.x||m.bounds.max.y<g.bounds.min.y||m.bounds.min.y>g.bounds.max.y))){var x=t._getRegion(u,m);if(!m.region||x.id!==m.region.id||h){(!m.region||h)&&(m.region=x);var S=t._regionUnion(x,m.region);for(l=S.startCol;l<=S.endCol;l++)for(d=S.startRow;d<=S.endRow;d++){M=t._getBucketId(l,d),b=v[M];var y=l>=x.startCol&&l<=x.endCol&&d>=x.startRow&&d<=x.endRow,w=l>=m.region.startCol&&l<=m.region.endCol&&d>=m.region.startRow&&d<=m.region.endRow;!y&&w&&w&&b&&t._bucketRemoveBody(u,b,m),(m.region===x||y&&!w||h)&&(b||(b=t._createBucket(v,M)),t._bucketAddBody(u,b,m))}m.region=x,k=!0}}}k&&(u.pairsList=t._createActivePairsList(u))},a(t,"update","Grid.update ➤ replaced by Matter.Detector"),t.clear=function(u){u.buckets={},u.pairs={},u.pairsList=[]},a(t,"clear","Grid.clear ➤ replaced by Matter.Detector"),t._regionUnion=function(u,o){var f=Math.min(u.startCol,o.startCol),h=Math.max(u.endCol,o.endCol),i=Math.min(u.startRow,o.startRow),l=Math.max(u.endRow,o.endRow);return t._createRegion(f,h,i,l)},t._getRegion=function(u,o){var f=o.bounds,h=Math.floor(f.min.x/u.bucketWidth),i=Math.floor(f.max.x/u.bucketWidth),l=Math.floor(f.min.y/u.bucketHeight),d=Math.floor(f.max.y/u.bucketHeight);return t._createRegion(h,i,l,d)},t._createRegion=function(u,o,f,h){return{id:u+","+o+","+f+","+h,startCol:u,endCol:o,startRow:f,endRow:h}},t._getBucketId=function(u,o){return"C"+u+"R"+o},t._createBucket=function(u,o){var f=u[o]=[];return f},t._bucketAddBody=function(u,o,f){var h=u.pairs,i=s.id,l=o.length,d;for(d=0;d<l;d++){var g=o[d];if(!(f.id===g.id||f.isStatic&&g.isStatic)){var v=i(f,g),b=h[v];b?b[2]+=1:h[v]=[f,g,1]}}o.push(f)},t._bucketRemoveBody=function(u,o,f){var h=u.pairs,i=s.id,l;o.splice(r.indexOf(o,f),1);var d=o.length;for(l=0;l<d;l++){var g=h[i(f,o[l])];g&&(g[2]-=1)}},t._createActivePairsList=function(u){var o,f=u.pairs,h=r.keys(f),i=h.length,l=[],d;for(d=0;d<i;d++)o=f[h[d]],o[2]>0?l.push(o):delete f[h[d]];return l}})()},function(c,p,n){var t={};c.exports=t;var s=n(3),r=n(7),a=n(14),u=n(5),o=n(13),f=n(10),h=n(6),i=n(0),l=n(1);(function(){t.create=function(d,g){var v=(d?d.mouse:null)||(g?g.mouse:null);v||(d&&d.render&&d.render.canvas?v=a.create(d.render.canvas):g&&g.element?v=a.create(g.element):(v=a.create(),i.warn("MouseConstraint.create: options.mouse was undefined, options.element was undefined, may not function as expected")));var b=f.create({label:"Mouse Constraint",pointA:v.position,pointB:{x:0,y:0},length:.01,stiffness:.1,angularStiffness:1,render:{strokeStyle:"#90EE90",lineWidth:3}}),M={type:"mouseConstraint",mouse:v,element:null,body:null,constraint:b,collisionFilter:{category:1,mask:4294967295,group:0}},k=i.extend(M,g);return u.on(d,"beforeUpdate",function(){var m=h.allBodies(d.world);t.update(k,m),t._triggerEvents(k)}),k},t.update=function(d,g){var v=d.mouse,b=d.constraint,M=d.body;if(v.button===0){if(b.bodyB)r.set(b.bodyB,!1),b.pointA=v.position;else for(var k=0;k<g.length;k++)if(M=g[k],l.contains(M.bounds,v.position)&&o.canCollide(M.collisionFilter,d.collisionFilter))for(var m=M.parts.length>1?1:0;m<M.parts.length;m++){var x=M.parts[m];if(s.contains(x.vertices,v.position)){b.pointA=v.position,b.bodyB=d.body=M,b.pointB={x:v.position.x-M.position.x,y:v.position.y-M.position.y},b.angleB=M.angle,r.set(M,!1),u.trigger(d,"startdrag",{mouse:v,body:M});break}}}else b.bodyB=d.body=null,b.pointB=null,M&&u.trigger(d,"enddrag",{mouse:v,body:M})},t._triggerEvents=function(d){var g=d.mouse,v=g.sourceEvents;v.mousemove&&u.trigger(d,"mousemove",{mouse:g}),v.mousedown&&u.trigger(d,"mousedown",{mouse:g}),v.mouseup&&u.trigger(d,"mouseup",{mouse:g}),a.clearSourceEvents(g)}})()},function(c,p,n){var t={};c.exports=t;var s=n(2),r=n(8),a=n(1),u=n(12),o=n(3);(function(){t.collides=function(f,h){for(var i=[],l=h.length,d=f.bounds,g=r.collides,v=a.overlaps,b=0;b<l;b++){var M=h[b],k=M.parts.length,m=k===1?0:1;if(v(M.bounds,d))for(var x=m;x<k;x++){var S=M.parts[x];if(v(S.bounds,d)){var y=g(S,f);if(y){i.push(y);break}}}}return i},t.ray=function(f,h,i,l){l=l||1e-100;for(var d=s.angle(h,i),g=s.magnitude(s.sub(h,i)),v=(i.x+h.x)*.5,b=(i.y+h.y)*.5,M=u.rectangle(v,b,g,l,{angle:d}),k=t.collides(M,f),m=0;m<k.length;m+=1){var x=k[m];x.body=x.bodyB=x.bodyA}return k},t.region=function(f,h,i){for(var l=[],d=0;d<f.length;d++){var g=f[d],v=a.overlaps(g.bounds,h);(v&&!i||!v&&i)&&l.push(g)}return l},t.point=function(f,h){for(var i=[],l=0;l<f.length;l++){var d=f[l];if(a.contains(d.bounds,h))for(var g=d.parts.length===1?0:1;g<d.parts.length;g++){var v=d.parts[g];if(a.contains(v.bounds,h)&&o.contains(v.vertices,h)){i.push(d);break}}}return i}})()},function(c,p,n){var t={};c.exports=t;var s=n(4),r=n(0),a=n(6),u=n(1),o=n(5),f=n(2),h=n(14);(function(){var i,l;typeof window<"u"&&(i=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||function(m){window.setTimeout(function(){m(r.now())},1e3/60)},l=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.msCancelAnimationFrame),t._goodFps=30,t._goodDelta=1e3/60,t.create=function(m){var x={engine:null,element:null,canvas:null,mouse:null,frameRequestId:null,timing:{historySize:60,delta:0,deltaHistory:[],lastTime:0,lastTimestamp:0,lastElapsed:0,timestampElapsed:0,timestampElapsedHistory:[],engineDeltaHistory:[],engineElapsedHistory:[],elapsedHistory:[]},options:{width:800,height:600,pixelRatio:1,background:"#14151f",wireframeBackground:"#14151f",hasBounds:!!m.bounds,enabled:!0,wireframes:!0,showSleeping:!0,showDebug:!1,showStats:!1,showPerformance:!1,showBounds:!1,showVelocity:!1,showCollisions:!1,showSeparations:!1,showAxes:!1,showPositions:!1,showAngleIndicator:!1,showIds:!1,showVertexNumbers:!1,showConvexHulls:!1,showInternalEdges:!1,showMousePosition:!1}},S=r.extend(x,m);return S.canvas&&(S.canvas.width=S.options.width||S.canvas.width,S.canvas.height=S.options.height||S.canvas.height),S.mouse=m.mouse,S.engine=m.engine,S.canvas=S.canvas||v(S.options.width,S.options.height),S.context=S.canvas.getContext("2d"),S.textures={},S.bounds=S.bounds||{min:{x:0,y:0},max:{x:S.canvas.width,y:S.canvas.height}},S.controller=t,S.options.showBroadphase=!1,S.options.pixelRatio!==1&&t.setPixelRatio(S,S.options.pixelRatio),r.isElement(S.element)&&S.element.appendChild(S.canvas),S},t.run=function(m){(function x(S){m.frameRequestId=i(x),d(m,S),t.world(m,S),(m.options.showStats||m.options.showDebug)&&t.stats(m,m.context,S),(m.options.showPerformance||m.options.showDebug)&&t.performance(m,m.context,S)})()},t.stop=function(m){l(m.frameRequestId)},t.setPixelRatio=function(m,x){var S=m.options,y=m.canvas;x==="auto"&&(x=b(y)),S.pixelRatio=x,y.setAttribute("data-pixel-ratio",x),y.width=S.width*x,y.height=S.height*x,y.style.width=S.width+"px",y.style.height=S.height+"px"},t.lookAt=function(m,x,S,y){y=typeof y<"u"?y:!0,x=r.isArray(x)?x:[x],S=S||{x:0,y:0};for(var w={min:{x:1/0,y:1/0},max:{x:-1/0,y:-1/0}},C=0;C<x.length;C+=1){var T=x[C],P=T.bounds?T.bounds.min:T.min||T.position||T,E=T.bounds?T.bounds.max:T.max||T.position||T;P&&E&&(P.x<w.min.x&&(w.min.x=P.x),E.x>w.max.x&&(w.max.x=E.x),P.y<w.min.y&&(w.min.y=P.y),E.y>w.max.y&&(w.max.y=E.y))}var B=w.max.x-w.min.x+2*S.x,A=w.max.y-w.min.y+2*S.y,R=m.canvas.height,L=m.canvas.width,H=L/R,V=B/A,O=1,N=1;V>H?N=V/H:O=H/V,m.options.hasBounds=!0,m.bounds.min.x=w.min.x,m.bounds.max.x=w.min.x+B*O,m.bounds.min.y=w.min.y,m.bounds.max.y=w.min.y+A*N,y&&(m.bounds.min.x+=B*.5-B*O*.5,m.bounds.max.x+=B*.5-B*O*.5,m.bounds.min.y+=A*.5-A*N*.5,m.bounds.max.y+=A*.5-A*N*.5),m.bounds.min.x-=S.x,m.bounds.max.x-=S.x,m.bounds.min.y-=S.y,m.bounds.max.y-=S.y,m.mouse&&(h.setScale(m.mouse,{x:(m.bounds.max.x-m.bounds.min.x)/m.canvas.width,y:(m.bounds.max.y-m.bounds.min.y)/m.canvas.height}),h.setOffset(m.mouse,m.bounds.min))},t.startViewTransform=function(m){var x=m.bounds.max.x-m.bounds.min.x,S=m.bounds.max.y-m.bounds.min.y,y=x/m.options.width,w=S/m.options.height;m.context.setTransform(m.options.pixelRatio/y,0,0,m.options.pixelRatio/w,0,0),m.context.translate(-m.bounds.min.x,-m.bounds.min.y)},t.endViewTransform=function(m){m.context.setTransform(m.options.pixelRatio,0,0,m.options.pixelRatio,0,0)},t.world=function(m,x){var S=r.now(),y=m.engine,w=y.world,C=m.canvas,T=m.context,P=m.options,E=m.timing,B=a.allBodies(w),A=a.allConstraints(w),R=P.wireframes?P.wireframeBackground:P.background,L=[],H=[],V,O={timestamp:y.timing.timestamp};if(o.trigger(m,"beforeRender",O),m.currentBackground!==R&&k(m,R),T.globalCompositeOperation="source-in",T.fillStyle="transparent",T.fillRect(0,0,C.width,C.height),T.globalCompositeOperation="source-over",P.hasBounds){for(V=0;V<B.length;V++){var N=B[V];u.overlaps(N.bounds,m.bounds)&&L.push(N)}for(V=0;V<A.length;V++){var W=A[V],U=W.bodyA,G=W.bodyB,$=W.pointA,z=W.pointB;U&&($=f.add(U.position,W.pointA)),G&&(z=f.add(G.position,W.pointB)),!(!$||!z)&&(u.contains(m.bounds,$)||u.contains(m.bounds,z))&&H.push(W)}t.startViewTransform(m),m.mouse&&(h.setScale(m.mouse,{x:(m.bounds.max.x-m.bounds.min.x)/m.options.width,y:(m.bounds.max.y-m.bounds.min.y)/m.options.height}),h.setOffset(m.mouse,m.bounds.min))}else H=A,L=B,m.options.pixelRatio!==1&&m.context.setTransform(m.options.pixelRatio,0,0,m.options.pixelRatio,0,0);!P.wireframes||y.enableSleeping&&P.showSleeping?t.bodies(m,L,T):(P.showConvexHulls&&t.bodyConvexHulls(m,L,T),t.bodyWireframes(m,L,T)),P.showBounds&&t.bodyBounds(m,L,T),(P.showAxes||P.showAngleIndicator)&&t.bodyAxes(m,L,T),P.showPositions&&t.bodyPositions(m,L,T),P.showVelocity&&t.bodyVelocity(m,L,T),P.showIds&&t.bodyIds(m,L,T),P.showSeparations&&t.separations(m,y.pairs.list,T),P.showCollisions&&t.collisions(m,y.pairs.list,T),P.showVertexNumbers&&t.vertexNumbers(m,L,T),P.showMousePosition&&t.mousePosition(m,m.mouse,T),t.constraints(H,T),P.hasBounds&&t.endViewTransform(m),o.trigger(m,"afterRender",O),E.lastElapsed=r.now()-S},t.stats=function(m,x,S){for(var y=m.engine,w=y.world,C=a.allBodies(w),T=0,P=55,E=44,B=0,A=0,R=0;R<C.length;R+=1)T+=C[R].parts.length;var L={Part:T,Body:C.length,Cons:a.allConstraints(w).length,Comp:a.allComposites(w).length,Pair:y.pairs.list.length};x.fillStyle="#0e0f19",x.fillRect(B,A,P*5.5,E),x.font="12px Arial",x.textBaseline="top",x.textAlign="right";for(var H in L){var V=L[H];x.fillStyle="#aaa",x.fillText(H,B+P,A+8),x.fillStyle="#eee",x.fillText(V,B+P,A+26),B+=P}},t.performance=function(m,x){var S=m.engine,y=m.timing,w=y.deltaHistory,C=y.elapsedHistory,T=y.timestampElapsedHistory,P=y.engineDeltaHistory,E=y.engineElapsedHistory,B=S.timing.lastDelta,A=g(w),R=g(C),L=g(P),H=g(E),V=g(T),O=V/A||0,N=1e3/A||0,W=4,U=12,G=60,$=34,z=10,j=69;x.fillStyle="#0e0f19",x.fillRect(0,50,U*4+G*5+22,$),t.status(x,z,j,G,W,w.length,Math.round(N)+" fps",N/t._goodFps,function(Y){return w[Y]/A-1}),t.status(x,z+U+G,j,G,W,P.length,B.toFixed(2)+" dt",t._goodDelta/B,function(Y){return P[Y]/L-1}),t.status(x,z+(U+G)*2,j,G,W,E.length,H.toFixed(2)+" ut",1-H/t._goodFps,function(Y){return E[Y]/H-1}),t.status(x,z+(U+G)*3,j,G,W,C.length,R.toFixed(2)+" rt",1-R/t._goodFps,function(Y){return C[Y]/R-1}),t.status(x,z+(U+G)*4,j,G,W,T.length,O.toFixed(2)+" x",O*O*O,function(Y){return(T[Y]/w[Y]/O||0)-1})},t.status=function(m,x,S,y,w,C,T,P,E){m.strokeStyle="#888",m.fillStyle="#444",m.lineWidth=1,m.fillRect(x,S+7,y,1),m.beginPath(),m.moveTo(x,S+7-w*r.clamp(.4*E(0),-2,2));for(var B=0;B<y;B+=1)m.lineTo(x+B,S+7-(B<C?w*r.clamp(.4*E(B),-2,2):0));m.stroke(),m.fillStyle="hsl("+r.clamp(25+95*P,0,120)+",100%,60%)",m.fillRect(x,S-7,4,4),m.font="12px Arial",m.textBaseline="middle",m.textAlign="right",m.fillStyle="#eee",m.fillText(T,x+y,S-5)},t.constraints=function(m,x){for(var S=x,y=0;y<m.length;y++){var w=m[y];if(!(!w.render.visible||!w.pointA||!w.pointB)){var C=w.bodyA,T=w.bodyB,P,E;if(C?P=f.add(C.position,w.pointA):P=w.pointA,w.render.type==="pin")S.beginPath(),S.arc(P.x,P.y,3,0,2*Math.PI),S.closePath();else{if(T?E=f.add(T.position,w.pointB):E=w.pointB,S.beginPath(),S.moveTo(P.x,P.y),w.render.type==="spring")for(var B=f.sub(E,P),A=f.perp(f.normalise(B)),R=Math.ceil(r.clamp(w.length/5,12,20)),L,H=1;H<R;H+=1)L=H%2===0?1:-1,S.lineTo(P.x+B.x*(H/R)+A.x*L*4,P.y+B.y*(H/R)+A.y*L*4);S.lineTo(E.x,E.y)}w.render.lineWidth&&(S.lineWidth=w.render.lineWidth,S.strokeStyle=w.render.strokeStyle,S.stroke()),w.render.anchors&&(S.fillStyle=w.render.strokeStyle,S.beginPath(),S.arc(P.x,P.y,3,0,2*Math.PI),S.arc(E.x,E.y,3,0,2*Math.PI),S.closePath(),S.fill())}}},t.bodies=function(m,x,S){var y=S;m.engine;var w=m.options,C=w.showInternalEdges||!w.wireframes,T,P,E,B;for(E=0;E<x.length;E++)if(T=x[E],!!T.render.visible){for(B=T.parts.length>1?1:0;B<T.parts.length;B++)if(P=T.parts[B],!!P.render.visible){if(w.showSleeping&&T.isSleeping?y.globalAlpha=.5*P.render.opacity:P.render.opacity!==1&&(y.globalAlpha=P.render.opacity),P.render.sprite&&P.render.sprite.texture&&!w.wireframes){var A=P.render.sprite,R=M(m,A.texture);y.translate(P.position.x,P.position.y),y.rotate(P.angle),y.drawImage(R,R.width*-A.xOffset*A.xScale,R.height*-A.yOffset*A.yScale,R.width*A.xScale,R.height*A.yScale),y.rotate(-P.angle),y.translate(-P.position.x,-P.position.y)}else{if(P.circleRadius)y.beginPath(),y.arc(P.position.x,P.position.y,P.circleRadius,0,2*Math.PI);else{y.beginPath(),y.moveTo(P.vertices[0].x,P.vertices[0].y);for(var L=1;L<P.vertices.length;L++)!P.vertices[L-1].isInternal||C?y.lineTo(P.vertices[L].x,P.vertices[L].y):y.moveTo(P.vertices[L].x,P.vertices[L].y),P.vertices[L].isInternal&&!C&&y.moveTo(P.vertices[(L+1)%P.vertices.length].x,P.vertices[(L+1)%P.vertices.length].y);y.lineTo(P.vertices[0].x,P.vertices[0].y),y.closePath()}w.wireframes?(y.lineWidth=1,y.strokeStyle="#bbb",y.stroke()):(y.fillStyle=P.render.fillStyle,P.render.lineWidth&&(y.lineWidth=P.render.lineWidth,y.strokeStyle=P.render.strokeStyle,y.stroke()),y.fill())}y.globalAlpha=1}}},t.bodyWireframes=function(m,x,S){var y=S,w=m.options.showInternalEdges,C,T,P,E,B;for(y.beginPath(),P=0;P<x.length;P++)if(C=x[P],!!C.render.visible)for(B=C.parts.length>1?1:0;B<C.parts.length;B++){for(T=C.parts[B],y.moveTo(T.vertices[0].x,T.vertices[0].y),E=1;E<T.vertices.length;E++)!T.vertices[E-1].isInternal||w?y.lineTo(T.vertices[E].x,T.vertices[E].y):y.moveTo(T.vertices[E].x,T.vertices[E].y),T.vertices[E].isInternal&&!w&&y.moveTo(T.vertices[(E+1)%T.vertices.length].x,T.vertices[(E+1)%T.vertices.length].y);y.lineTo(T.vertices[0].x,T.vertices[0].y)}y.lineWidth=1,y.strokeStyle="#bbb",y.stroke()},t.bodyConvexHulls=function(m,x,S){var y=S,w,C,T;for(y.beginPath(),C=0;C<x.length;C++)if(w=x[C],!(!w.render.visible||w.parts.length===1)){for(y.moveTo(w.vertices[0].x,w.vertices[0].y),T=1;T<w.vertices.length;T++)y.lineTo(w.vertices[T].x,w.vertices[T].y);y.lineTo(w.vertices[0].x,w.vertices[0].y)}y.lineWidth=1,y.strokeStyle="rgba(255,255,255,0.2)",y.stroke()},t.vertexNumbers=function(m,x,S){var y=S,w,C,T;for(w=0;w<x.length;w++){var P=x[w].parts;for(T=P.length>1?1:0;T<P.length;T++){var E=P[T];for(C=0;C<E.vertices.length;C++)y.fillStyle="rgba(255,255,255,0.2)",y.fillText(w+"_"+C,E.position.x+(E.vertices[C].x-E.position.x)*.8,E.position.y+(E.vertices[C].y-E.position.y)*.8)}}},t.mousePosition=function(m,x,S){var y=S;y.fillStyle="rgba(255,255,255,0.8)",y.fillText(x.position.x+"  "+x.position.y,x.position.x+5,x.position.y-5)},t.bodyBounds=function(m,x,S){var y=S;m.engine;var w=m.options;y.beginPath();for(var C=0;C<x.length;C++){var T=x[C];if(T.render.visible)for(var P=x[C].parts,E=P.length>1?1:0;E<P.length;E++){var B=P[E];y.rect(B.bounds.min.x,B.bounds.min.y,B.bounds.max.x-B.bounds.min.x,B.bounds.max.y-B.bounds.min.y)}}w.wireframes?y.strokeStyle="rgba(255,255,255,0.08)":y.strokeStyle="rgba(0,0,0,0.1)",y.lineWidth=1,y.stroke()},t.bodyAxes=function(m,x,S){var y=S;m.engine;var w=m.options,C,T,P,E;for(y.beginPath(),T=0;T<x.length;T++){var B=x[T],A=B.parts;if(B.render.visible)if(w.showAxes)for(P=A.length>1?1:0;P<A.length;P++)for(C=A[P],E=0;E<C.axes.length;E++){var R=C.axes[E];y.moveTo(C.position.x,C.position.y),y.lineTo(C.position.x+R.x*20,C.position.y+R.y*20)}else for(P=A.length>1?1:0;P<A.length;P++)for(C=A[P],E=0;E<C.axes.length;E++)y.moveTo(C.position.x,C.position.y),y.lineTo((C.vertices[0].x+C.vertices[C.vertices.length-1].x)/2,(C.vertices[0].y+C.vertices[C.vertices.length-1].y)/2)}w.wireframes?(y.strokeStyle="indianred",y.lineWidth=1):(y.strokeStyle="rgba(255, 255, 255, 0.4)",y.globalCompositeOperation="overlay",y.lineWidth=2),y.stroke(),y.globalCompositeOperation="source-over"},t.bodyPositions=function(m,x,S){var y=S;m.engine;var w=m.options,C,T,P,E;for(y.beginPath(),P=0;P<x.length;P++)if(C=x[P],!!C.render.visible)for(E=0;E<C.parts.length;E++)T=C.parts[E],y.arc(T.position.x,T.position.y,3,0,2*Math.PI,!1),y.closePath();for(w.wireframes?y.fillStyle="indianred":y.fillStyle="rgba(0,0,0,0.5)",y.fill(),y.beginPath(),P=0;P<x.length;P++)C=x[P],C.render.visible&&(y.arc(C.positionPrev.x,C.positionPrev.y,2,0,2*Math.PI,!1),y.closePath());y.fillStyle="rgba(255,165,0,0.8)",y.fill()},t.bodyVelocity=function(m,x,S){var y=S;y.beginPath();for(var w=0;w<x.length;w++){var C=x[w];if(C.render.visible){var T=s.getVelocity(C);y.moveTo(C.position.x,C.position.y),y.lineTo(C.position.x+T.x,C.position.y+T.y)}}y.lineWidth=3,y.strokeStyle="cornflowerblue",y.stroke()},t.bodyIds=function(m,x,S){var y=S,w,C;for(w=0;w<x.length;w++)if(x[w].render.visible){var T=x[w].parts;for(C=T.length>1?1:0;C<T.length;C++){var P=T[C];y.font="12px Arial",y.fillStyle="rgba(255,255,255,0.5)",y.fillText(P.id,P.position.x+10,P.position.y-10)}}},t.collisions=function(m,x,S){var y=S,w=m.options,C,T,P,E;for(y.beginPath(),P=0;P<x.length;P++)if(C=x[P],!!C.isActive)for(T=C.collision,E=0;E<C.activeContacts.length;E++){var B=C.activeContacts[E],A=B.vertex;y.rect(A.x-1.5,A.y-1.5,3.5,3.5)}for(w.wireframes?y.fillStyle="rgba(255,255,255,0.7)":y.fillStyle="orange",y.fill(),y.beginPath(),P=0;P<x.length;P++)if(C=x[P],!!C.isActive&&(T=C.collision,C.activeContacts.length>0)){var R=C.activeContacts[0].vertex.x,L=C.activeContacts[0].vertex.y;C.activeContacts.length===2&&(R=(C.activeContacts[0].vertex.x+C.activeContacts[1].vertex.x)/2,L=(C.activeContacts[0].vertex.y+C.activeContacts[1].vertex.y)/2),T.bodyB===T.supports[0].body||T.bodyA.isStatic===!0?y.moveTo(R-T.normal.x*8,L-T.normal.y*8):y.moveTo(R+T.normal.x*8,L+T.normal.y*8),y.lineTo(R,L)}w.wireframes?y.strokeStyle="rgba(255,165,0,0.7)":y.strokeStyle="orange",y.lineWidth=1,y.stroke()},t.separations=function(m,x,S){var y=S,w=m.options,C,T,P,E,B;for(y.beginPath(),B=0;B<x.length;B++)if(C=x[B],!!C.isActive){T=C.collision,P=T.bodyA,E=T.bodyB;var A=1;!E.isStatic&&!P.isStatic&&(A=.5),E.isStatic&&(A=0),y.moveTo(E.position.x,E.position.y),y.lineTo(E.position.x-T.penetration.x*A,E.position.y-T.penetration.y*A),A=1,!E.isStatic&&!P.isStatic&&(A=.5),P.isStatic&&(A=0),y.moveTo(P.position.x,P.position.y),y.lineTo(P.position.x+T.penetration.x*A,P.position.y+T.penetration.y*A)}w.wireframes?y.strokeStyle="rgba(255,165,0,0.5)":y.strokeStyle="orange",y.stroke()},t.inspector=function(m,x){m.engine;var S=m.selected,y=m.render,w=y.options,C;if(w.hasBounds){var T=y.bounds.max.x-y.bounds.min.x,P=y.bounds.max.y-y.bounds.min.y,E=T/y.options.width,B=P/y.options.height;x.scale(1/E,1/B),x.translate(-y.bounds.min.x,-y.bounds.min.y)}for(var A=0;A<S.length;A++){var R=S[A].data;switch(x.translate(.5,.5),x.lineWidth=1,x.strokeStyle="rgba(255,165,0,0.9)",x.setLineDash([1,2]),R.type){case"body":C=R.bounds,x.beginPath(),x.rect(Math.floor(C.min.x-3),Math.floor(C.min.y-3),Math.floor(C.max.x-C.min.x+6),Math.floor(C.max.y-C.min.y+6)),x.closePath(),x.stroke();break;case"constraint":var L=R.pointA;R.bodyA&&(L=R.pointB),x.beginPath(),x.arc(L.x,L.y,10,0,2*Math.PI),x.closePath(),x.stroke();break}x.setLineDash([]),x.translate(-.5,-.5)}m.selectStart!==null&&(x.translate(.5,.5),x.lineWidth=1,x.strokeStyle="rgba(255,165,0,0.6)",x.fillStyle="rgba(255,165,0,0.1)",C=m.selectBounds,x.beginPath(),x.rect(Math.floor(C.min.x),Math.floor(C.min.y),Math.floor(C.max.x-C.min.x),Math.floor(C.max.y-C.min.y)),x.closePath(),x.stroke(),x.fill(),x.translate(-.5,-.5)),w.hasBounds&&x.setTransform(1,0,0,1,0,0)};var d=function(m,x){var S=m.engine,y=m.timing,w=y.historySize,C=S.timing.timestamp;y.delta=x-y.lastTime||t._goodDelta,y.lastTime=x,y.timestampElapsed=C-y.lastTimestamp||0,y.lastTimestamp=C,y.deltaHistory.unshift(y.delta),y.deltaHistory.length=Math.min(y.deltaHistory.length,w),y.engineDeltaHistory.unshift(S.timing.lastDelta),y.engineDeltaHistory.length=Math.min(y.engineDeltaHistory.length,w),y.timestampElapsedHistory.unshift(y.timestampElapsed),y.timestampElapsedHistory.length=Math.min(y.timestampElapsedHistory.length,w),y.engineElapsedHistory.unshift(S.timing.lastElapsed),y.engineElapsedHistory.length=Math.min(y.engineElapsedHistory.length,w),y.elapsedHistory.unshift(y.lastElapsed),y.elapsedHistory.length=Math.min(y.elapsedHistory.length,w)},g=function(m){for(var x=0,S=0;S<m.length;S+=1)x+=m[S];return x/m.length||0},v=function(m,x){var S=document.createElement("canvas");return S.width=m,S.height=x,S.oncontextmenu=function(){return!1},S.onselectstart=function(){return!1},S},b=function(m){var x=m.getContext("2d"),S=window.devicePixelRatio||1,y=x.webkitBackingStorePixelRatio||x.mozBackingStorePixelRatio||x.msBackingStorePixelRatio||x.oBackingStorePixelRatio||x.backingStorePixelRatio||1;return S/y},M=function(m,x){var S=m.textures[x];return S||(S=m.textures[x]=new Image,S.src=x,S)},k=function(m,x){var S=x;/(jpg|gif|png)$/.test(x)&&(S="url("+x+")"),m.canvas.style.background=S,m.canvas.style.backgroundSize="contain",m.currentBackground=x}})()},function(c,p,n){var t={};c.exports=t;var s=n(5),r=n(17),a=n(0);(function(){var u,o;if(typeof window<"u"&&(u=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame,o=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.msCancelAnimationFrame),!u){var f;u=function(h){f=setTimeout(function(){h(a.now())},1e3/60)},o=function(){clearTimeout(f)}}t.create=function(h){var i={fps:60,deltaSampleSize:60,counterTimestamp:0,frameCounter:0,deltaHistory:[],timePrev:null,frameRequestId:null,isFixed:!1,enabled:!0},l=a.extend(i,h);return l.delta=l.delta||1e3/l.fps,l.deltaMin=l.deltaMin||1e3/l.fps,l.deltaMax=l.deltaMax||1e3/(l.fps*.5),l.fps=1e3/l.delta,l},t.run=function(h,i){return typeof h.positionIterations<"u"&&(i=h,h=t.create()),function l(d){h.frameRequestId=u(l),d&&h.enabled&&t.tick(h,i,d)}(),h},t.tick=function(h,i,l){var d=i.timing,g;h.isFixed?g=h.delta:(g=l-h.timePrev||h.delta,h.timePrev=l,h.deltaHistory.push(g),h.deltaHistory=h.deltaHistory.slice(-h.deltaSampleSize),g=Math.min.apply(null,h.deltaHistory),g=g<h.deltaMin?h.deltaMin:g,g=g>h.deltaMax?h.deltaMax:g,h.delta=g);var v={timestamp:d.timestamp};s.trigger(h,"beforeTick",v),h.frameCounter+=1,l-h.counterTimestamp>=1e3&&(h.fps=h.frameCounter*((l-h.counterTimestamp)/1e3),h.counterTimestamp=l,h.frameCounter=0),s.trigger(h,"tick",v),s.trigger(h,"beforeUpdate",v),r.update(i,g),s.trigger(h,"afterUpdate",v),s.trigger(h,"afterTick",v)},t.stop=function(h){o(h.frameRequestId)},t.start=function(h,i){t.run(h,i)}})()},function(c,p,n){var t={};c.exports=t;var s=n(8),r=n(0),a=r.deprecated;(function(){t.collides=function(u,o){return s.collides(u,o)},a(t,"collides","SAT.collides ➤ replaced by Collision.collides")})()},function(c,p,n){var t={};c.exports=t,n(1);var s=n(0);(function(){t.pathToVertices=function(r,a){typeof window<"u"&&!("SVGPathSeg"in window)&&s.warn("Svg.pathToVertices: SVGPathSeg not defined, a polyfill is required.");var u,o,f,h,i,l,d,g,v,b,M=[],k,m,x=0,S=0,y=0;a=a||15;var w=function(T,P,E){var B=E%2===1&&E>1;if(!v||T!=v.x||P!=v.y){v&&B?(k=v.x,m=v.y):(k=0,m=0);var A={x:k+T,y:m+P};(B||!v)&&(v=A),M.push(A),S=k+T,y=m+P}},C=function(T){var P=T.pathSegTypeAsLetter.toUpperCase();if(P!=="Z"){switch(P){case"M":case"L":case"T":case"C":case"S":case"Q":S=T.x,y=T.y;break;case"H":S=T.x;break;case"V":y=T.y;break}w(S,y,T.pathSegType)}};for(t._svgPathToAbsolute(r),f=r.getTotalLength(),l=[],u=0;u<r.pathSegList.numberOfItems;u+=1)l.push(r.pathSegList.getItem(u));for(d=l.concat();x<f;){if(b=r.getPathSegAtLength(x),i=l[b],i!=g){for(;d.length&&d[0]!=i;)C(d.shift());g=i}switch(i.pathSegTypeAsLetter.toUpperCase()){case"C":case"T":case"S":case"Q":case"A":h=r.getPointAtLength(x),w(h.x,h.y,0);break}x+=a}for(u=0,o=d.length;u<o;++u)C(d[u]);return M},t._svgPathToAbsolute=function(r){for(var a,u,o,f,h,i,l=r.pathSegList,d=0,g=0,v=l.numberOfItems,b=0;b<v;++b){var M=l.getItem(b),k=M.pathSegTypeAsLetter;if(/[MLHVCSQTA]/.test(k))"x"in M&&(d=M.x),"y"in M&&(g=M.y);else switch("x1"in M&&(o=d+M.x1),"x2"in M&&(h=d+M.x2),"y1"in M&&(f=g+M.y1),"y2"in M&&(i=g+M.y2),"x"in M&&(d+=M.x),"y"in M&&(g+=M.y),k){case"m":l.replaceItem(r.createSVGPathSegMovetoAbs(d,g),b);break;case"l":l.replaceItem(r.createSVGPathSegLinetoAbs(d,g),b);break;case"h":l.replaceItem(r.createSVGPathSegLinetoHorizontalAbs(d),b);break;case"v":l.replaceItem(r.createSVGPathSegLinetoVerticalAbs(g),b);break;case"c":l.replaceItem(r.createSVGPathSegCurvetoCubicAbs(d,g,o,f,h,i),b);break;case"s":l.replaceItem(r.createSVGPathSegCurvetoCubicSmoothAbs(d,g,h,i),b);break;case"q":l.replaceItem(r.createSVGPathSegCurvetoQuadraticAbs(d,g,o,f),b);break;case"t":l.replaceItem(r.createSVGPathSegCurvetoQuadraticSmoothAbs(d,g),b);break;case"a":l.replaceItem(r.createSVGPathSegArcAbs(d,g,M.r1,M.r2,M.angle,M.largeArcFlag,M.sweepFlag),b);break;case"z":case"Z":d=a,g=u;break}(k=="M"||k=="m")&&(a=d,u=g)}}})()},function(c,p,n){var t={};c.exports=t;var s=n(6);n(0),function(){t.create=s.create,t.add=s.add,t.remove=s.remove,t.clear=s.clear,t.addComposite=s.addComposite,t.addBody=s.addBody,t.addConstraint=s.addConstraint}()}])})})(Se);var He=Se.exports;const D=De(He);var F=(I=>(I.MENU="MENU",I.PLAYING="PLAYING",I.PAUSED="PAUSED",I.CRASHED="CRASHED",I.GAME_OVER="GAME_OVER",I))(F||{});class We{lastTime=0;rafId=null;running=!1;update;render;constructor(e,c){this.update=e,this.render=c}start(){this.running||(this.running=!0,this.lastTime=0,this.rafId=window.requestAnimationFrame(this.tick))}stop(){this.running=!1,this.rafId!==null&&(window.cancelAnimationFrame(this.rafId),this.rafId=null)}get isRunning(){return this.running}tick=e=>{if(!this.running)return;this.lastTime===0&&(this.lastTime=e);let c=e-this.lastTime;this.lastTime=e,c>1e3&&(c=1e3),this.update(c/1e3),this.render(),this.rafId=window.requestAnimationFrame(this.tick)}}class Fe{engine=null;world=null;constructor(){}init(){this.engine===null&&(this.engine=D.Engine.create(),this.world=this.engine.world,this.world.gravity.y=1)}getEngine(){return this.engine}getWorld(){return this.world}add(e){this.world!==null&&e.length>0&&D.World.add(this.world,e)}remove(e){this.world!==null&&e.length>0&&D.World.remove(this.world,e)}clear(){this.world!==null&&D.World.clear(this.world,!1)}update(e){if(this.engine===null)return;const c=Math.max(1,Math.min(1e3,Math.round(e*1e3)));D.Engine.update(this.engine,c)}destroy(){this.clear(),this.engine=null,this.world=null}}class Ve{body=null;head=null;headConstraint=null;frontWheel=null;rearWheel=null;frontStrut=null;frontArm=null;rearStrut=null;rearArm=null;width;height;wheelRadius;acceleration;maxSpeed;airControlTorque;fuelCapacity;fuelConsumption;vehicleType;fuel;isAirborne=!1;airborneTimer=0;accumulatedRotation=0;lastAngle=0;flipsCounted=0;pendingStunts=[];headTouchedGround=!1;upsideDownTimer=0;jumpCooldown=0;constructor(e){this.width=e.width,this.height=e.height,this.wheelRadius=e.wheelRadius,this.acceleration=e.acceleration,this.maxSpeed=e.maxSpeed,this.airControlTorque=e.airControlTorque,this.fuelCapacity=e.fuelCapacity,this.fuelConsumption=e.fuelConsumption,this.fuel=e.fuelCapacity,this.vehicleType=e.vehicleType??"starter",this.build(e)}build(e){const c=e.width/2,p=e.height/2;this.body=D.Bodies.rectangle(e.x,e.y,e.width,e.height,{density:e.density,friction:.2,frictionAir:.015,frictionStatic:.6,restitution:.05,slop:.01,label:"vehicle_chassis",chamfer:{radius:8}}),D.Body.setInertia(this.body,this.body.inertia*2.5);const n=8;this.head=D.Bodies.circle(e.x-c*.1,e.y-p-n*.9,n,{density:e.density*.2,friction:.1,frictionAir:.01,restitution:.2,label:"driver_head"}),this.headConstraint=D.Constraint.create({bodyA:this.body,bodyB:this.head,pointA:{x:-c*.1,y:-p-n*.7},pointB:{x:0,y:0},length:0,stiffness:.9,render:{visible:!1}});const t=p+this.wheelRadius*.55,s=c*.72,r=-c*.72,a=e.springStiffness??.28;this.frontWheel=D.Bodies.circle(e.x+s,e.y+t,this.wheelRadius,{density:e.density*2.5,friction:1.2,frictionAir:.005,frictionStatic:1.4,restitution:.02,slop:.01,label:"wheel_front"}),this.rearWheel=D.Bodies.circle(e.x+r,e.y+t,this.wheelRadius,{density:e.density*2.5,friction:1.2,frictionAir:.005,frictionStatic:1.4,restitution:.02,slop:.01,label:"wheel_rear"}),this.frontStrut=D.Constraint.create({bodyA:this.body,bodyB:this.frontWheel,pointA:{x:s,y:0},pointB:{x:0,y:0},length:t,stiffness:a,damping:.32,render:{visible:!1}});const u=p*.7,o=s*.25,f=Math.hypot(s-o,t-u);this.frontArm=D.Constraint.create({bodyA:this.body,bodyB:this.frontWheel,pointA:{x:o,y:u},pointB:{x:0,y:0},length:f,stiffness:.9,damping:.2,render:{visible:!1}}),this.rearStrut=D.Constraint.create({bodyA:this.body,bodyB:this.rearWheel,pointA:{x:r,y:0},pointB:{x:0,y:0},length:t,stiffness:a,damping:.32,render:{visible:!1}});const h=r*.25,i=Math.hypot(r-h,t-u);this.rearArm=D.Constraint.create({bodyA:this.body,bodyB:this.rearWheel,pointA:{x:h,y:u},pointB:{x:0,y:0},length:i,stiffness:.9,damping:.2,render:{visible:!1}})}getBody(){return this.body}getFrontWheel(){return this.frontWheel}getRearWheel(){return this.rearWheel}getBodies(){const e=[];return this.body&&e.push(this.body),this.head&&e.push(this.head),this.frontWheel&&e.push(this.frontWheel),this.rearWheel&&e.push(this.rearWheel),e}getConstraints(){const e=[];return this.frontStrut&&e.push(this.frontStrut),this.frontArm&&e.push(this.frontArm),this.rearStrut&&e.push(this.rearStrut),this.rearArm&&e.push(this.rearArm),this.headConstraint&&e.push(this.headConstraint),e}addTo(e){const c=this.getBodies(),p=this.getConstraints();c.length>0&&D.World.add(e,c),p.length>0&&D.World.add(e,p)}removeFrom(e){const c=this.getBodies(),p=this.getConstraints();p.length>0&&D.World.remove(e,p),c.length>0&&D.World.remove(e,c)}getPosition(){return this.body?{x:this.body.position.x,y:this.body.position.y}:{x:0,y:0}}getVelocity(){return this.body?{x:this.body.velocity.x,y:this.body.velocity.y}:{x:0,y:0}}getSpeed(){return this.body?Math.hypot(this.body.velocity.x,this.body.velocity.y):0}grounded=!0;isOnGround(e){if(!this.body||!this.frontWheel||!this.rearWheel)return!1;if(e){const c=e(this.frontWheel.position.x),p=e(this.rearWheel.position.x),n=this.frontWheel.position.y-c,t=this.rearWheel.position.y-p,s=-(this.wheelRadius+14),r=n>=s,a=t>=s;return this.grounded=r||a,this.grounded}return this.grounded}hasFuel(){return this.fuel>0}getFuel(){return this.fuel}getFuelRatio(){return this.fuelCapacity<=0?0:this.fuel/this.fuelCapacity}addFuel(e){this.fuel=Math.min(this.fuelCapacity,this.fuel+e)}consumeFuel(e){this.fuel>0&&(this.fuel=Math.max(0,this.fuel-this.fuelConsumption*e))}accelerate(e){if(!this.hasFuel()||!this.frontWheel||!this.rearWheel||!this.body)return;const c=e?1:-1,p=c*(this.maxSpeed/this.wheelRadius),n=this.grounded,t=.065*(this.acceleration/.0035);e?(this.rearWheel.angularVelocity<p&&D.Body.setAngularVelocity(this.rearWheel,Math.min(p,this.rearWheel.angularVelocity+t)),this.frontWheel.angularVelocity<p&&D.Body.setAngularVelocity(this.frontWheel,Math.min(p,this.frontWheel.angularVelocity+t*.95))):(this.rearWheel.angularVelocity>p&&D.Body.setAngularVelocity(this.rearWheel,Math.max(p,this.rearWheel.angularVelocity-t)),this.frontWheel.angularVelocity>p&&D.Body.setAngularVelocity(this.frontWheel,Math.max(p,this.frontWheel.angularVelocity-t*.95)));const s=this.body.angle,r=this.acceleration*(n?3:.4),a={x:this.body.position.x,y:this.body.position.y+this.height*.25};D.Body.applyForce(this.body,a,{x:Math.cos(s)*r*c,y:Math.sin(s)*r*c}),this.consumeFuel(1/60)}jump(){if(!this.body||!this.frontWheel||!this.rearWheel||!this.grounded||this.jumpCooldown>0)return!1;this.jumpCooldown=.35;const e=-10.5;return D.Body.setVelocity(this.body,{x:this.body.velocity.x,y:Math.min(e,this.body.velocity.y-8)}),D.Body.setVelocity(this.frontWheel,{x:this.frontWheel.velocity.x,y:Math.min(e,this.frontWheel.velocity.y-8)}),D.Body.setVelocity(this.rearWheel,{x:this.rearWheel.velocity.x,y:Math.min(e,this.rearWheel.velocity.y-8)}),this.grounded=!1,!0}applyAirControl(e){if(!this.body||this.grounded)return;const c=e*this.airControlTorque,p=this.body.angularVelocity+c*.3,n=3.8;D.Body.setAngularVelocity(this.body,Math.max(-n,Math.min(n,p)))}update(e,c){if(!this.body)return;this.jumpCooldown>0&&(this.jumpCooldown=Math.max(0,this.jumpCooldown-e));const p=this.body.angle,n=this.isOnGround(c);if(n){D.Body.setAngularVelocity(this.body,this.body.angularVelocity*.88);const r=this.getSpeed(),u=(8e-4+Math.min(1.8,r/18)*6e-4)*this.body.mass;D.Body.applyForce(this.body,this.body.position,{x:0,y:u})}if(n){if(this.isAirborne){if(this.airborneTimer>=1.2){const r=Math.floor(this.airborneTimer*100);this.pendingStunts.push({type:"AIR_TIME",text:`AIR TIME ${this.airborneTimer.toFixed(1)}s! +${r}`,score:r,coins:5})}this.isAirborne=!1,this.airborneTimer=0,this.accumulatedRotation=0,this.flipsCounted=0}}else if(!this.isAirborne)this.isAirborne=!0,this.airborneTimer=0,this.accumulatedRotation=0,this.lastAngle=p,this.flipsCounted=0;else{this.airborneTimer+=e;const r=p-this.lastAngle;this.accumulatedRotation+=r,this.lastAngle=p,this.accumulatedRotation>Math.PI*1.8*(this.flipsCounted+1)?(this.flipsCounted++,this.pendingStunts.push({type:"FRONTFLIP",text:"FRONTFLIP! +25 🪙",score:250,coins:25})):this.accumulatedRotation<-Math.PI*1.8*(this.flipsCounted+1)&&(this.flipsCounted++,this.pendingStunts.push({type:"BACKFLIP",text:"BACKFLIP! +30 🪙",score:300,coins:30}))}const t=Math.abs(this.body.angle%(Math.PI*2));t>Math.PI*.65&&t<Math.PI*1.35&&n?this.upsideDownTimer+=e:this.upsideDownTimer=0}popStunts(){const e=[...this.pendingStunts];return this.pendingStunts=[],e}getAngle(){return this.body?this.body.angle:0}isHeadHit(){return this.headTouchedGround}isCrashed(){return this.headTouchedGround||this.upsideDownTimer>=.35||!this.hasFuel()&&this.getSpeed()<.2}onHeadHit(){this.headTouchedGround=!0}render(e,c,p){!this.body||!this.frontWheel||!this.rearWheel||(e.save(),e.translate(-c,-p),this.renderSuspension(e),this.renderWheel(e,this.rearWheel),this.renderWheel(e,this.frontWheel),e.save(),e.translate(this.body.position.x,this.body.position.y),e.rotate(this.body.angle),this.renderChassis(e),this.renderDriver(e),e.restore(),e.restore())}renderSuspension(e){if(!this.body||!this.frontWheel||!this.rearWheel)return;e.save(),e.strokeStyle="#ffd700",e.lineWidth=3,e.lineCap="round";const c=D.Vector.rotate({x:this.width*.36,y:0},this.body.angle),p={x:this.body.position.x+c.x,y:this.body.position.y+c.y};this.drawSpring(e,p.x,p.y,this.frontWheel.position.x,this.frontWheel.position.y);const n=D.Vector.rotate({x:-this.width*.36,y:0},this.body.angle),t={x:this.body.position.x+n.x,y:this.body.position.y+n.y};this.drawSpring(e,t.x,t.y,this.rearWheel.position.x,this.rearWheel.position.y),e.restore()}drawSpring(e,c,p,n,t){e.beginPath(),e.moveTo(c,p);const s=n-c,r=t-p,a=Math.hypot(s,r),u=5;for(let o=1;o<=u;o++){const f=o/(u+1),h=c+s*f,i=p+r*f,l=(o%2===0?1:-1)*4,d=-r/a,g=s/a;e.lineTo(h+d*l,i+g*l)}e.lineTo(n,t),e.stroke()}renderWheel(e,c){e.save(),e.translate(c.position.x,c.position.y),e.rotate(c.angle);const p=this.wheelRadius;e.fillStyle="#1e1e24",e.beginPath(),e.arc(0,0,p,0,Math.PI*2),e.fill(),e.fillStyle="#111115";const n=10;for(let s=0;s<n;s++){const r=Math.PI*2*s/n;e.fillRect(Math.cos(r)*(p-3)-2,Math.sin(r)*(p-3)-2,4,4)}const t=p*.65;e.fillStyle="#4a4a5a",e.beginPath(),e.arc(0,0,t,0,Math.PI*2),e.fill(),e.strokeStyle=this.vehicleType==="speedster"?"#00d2ff":"#ff6b35",e.lineWidth=2.5,e.beginPath();for(let s=0;s<5;s++){const r=Math.PI*2*s/5;e.moveTo(0,0),e.lineTo(Math.cos(r)*t,Math.sin(r)*t)}e.stroke(),e.fillStyle="#ffd700",e.beginPath(),e.arc(0,0,p*.22,0,Math.PI*2),e.fill(),e.restore()}renderChassis(e){const c=this.width,p=this.height;this.vehicleType==="speedster"?(e.fillStyle="#00d2ff",e.beginPath(),e.moveTo(-c*.5,p*.35),e.lineTo(-c*.45,-p*.1),e.lineTo(-c*.1,-p*.45),e.lineTo(c*.25,-p*.45),e.lineTo(c*.45,0),e.lineTo(c*.5,p*.35),e.closePath(),e.fill(),e.strokeStyle="#ffffff",e.lineWidth=2,e.stroke(),e.fillStyle="#ff007f",e.fillRect(-c*.45,-p*.05,c*.9,4),e.fillStyle="rgba(10, 15, 35, 0.85)",e.beginPath(),e.moveTo(-c*.1,-p*.4),e.lineTo(c*.2,-p*.4),e.lineTo(c*.35,-p*.05),e.lineTo(-c*.15,-p*.05),e.closePath(),e.fill(),e.strokeStyle="#ffffff",e.lineWidth=3,e.beginPath(),e.moveTo(-c*.45,-p*.1),e.lineTo(-c*.5,-p*.45),e.lineTo(-c*.35,-p*.45),e.stroke()):this.vehicleType==="heavy"?(e.fillStyle="#e63946",e.beginPath(),e.roundRect(-c*.48,-p*.45,c*.96,p*.8,6),e.fill(),e.strokeStyle="#ffffff",e.lineWidth=2,e.stroke(),e.fillStyle="#1d3557",e.fillRect(-c*.1,-p*.85,c*.45,p*.45),e.strokeStyle="#ffffff",e.strokeRect(-c*.1,-p*.85,c*.45,p*.45),e.fillStyle="#a8dadc",e.fillRect(0,-p*.8,c*.3,p*.35),e.fillStyle="#ffd700",e.fillRect(c*.42,-p*.3,5,8),e.strokeStyle="#cccccc",e.lineWidth=4,e.beginPath(),e.moveTo(-c*.2,-p*.45),e.lineTo(-c*.25,-p*.9),e.lineTo(-c*.32,-p*.95),e.stroke()):(e.fillStyle="#ff6b35",e.beginPath(),e.moveTo(-c*.45,p*.35),e.lineTo(-c*.4,-p*.2),e.lineTo(-c*.1,-p*.5),e.lineTo(c*.2,-p*.5),e.lineTo(c*.45,0),e.lineTo(c*.48,p*.35),e.closePath(),e.fill(),e.strokeStyle="#ffffff",e.lineWidth=2,e.stroke(),e.strokeStyle="#ffffff",e.lineWidth=2.5,e.beginPath(),e.moveTo(-c*.35,-p*.15),e.lineTo(-c*.08,-p*.7),e.lineTo(c*.18,-p*.7),e.lineTo(c*.35,0),e.stroke(),e.fillStyle="rgba(160, 224, 255, 0.7)",e.beginPath(),e.moveTo(c*.02,-p*.65),e.lineTo(c*.16,-p*.65),e.lineTo(c*.32,-p*.05),e.lineTo(c*.05,-p*.05),e.closePath(),e.fill(),e.fillStyle="#ffd700",e.beginPath(),e.arc(c*.44,-p*.05,5,0,Math.PI*2),e.fill())}renderDriver(e){const c=this.width,p=this.height;e.fillStyle="#2b2d42",e.beginPath(),e.arc(0,-p*.2,10,0,Math.PI*2),e.fill(),e.fillStyle="#ffd700",e.beginPath(),e.arc(2,-p*.55,9,0,Math.PI*2),e.fill(),e.strokeStyle="#333333",e.lineWidth=1.5,e.stroke(),e.fillStyle="#111111",e.fillRect(4,-p*.58,6,4),e.strokeStyle="#ffffff",e.lineWidth=2,e.beginPath(),e.moveTo(0,-p*.15),e.lineTo(c*.18,-p*.25),e.stroke()}destroy(){this.frontStrut=null,this.frontArm=null,this.rearStrut=null,this.rearArm=null,this.headConstraint=null,this.frontWheel=null,this.rearWheel=null,this.head=null,this.body=null}}class Oe{segmentSize;amplitude;minHeight;seed;extendScreens;getSegmentSize(){return this.segmentSize}surfacePoints=[];totalWidth=0;groundY=0;screenHeight=600;chunks=new Map;chunkSize;renderDistance;cullDistance;terrainColor;grassColor;surfaceColor;biomeId="countryside";constructor(e={}){this.segmentSize=e.segmentSize??30,this.amplitude=e.amplitude??140,this.minHeight=e.minHeight??220,this.seed=e.seed??1337,this.extendScreens=e.extendScreens??3,this.chunkSize=Math.max(this.segmentSize*10,300),this.renderDistance=this.chunkSize*5,this.cullDistance=this.chunkSize*7,this.terrainColor=e.terrainColor??"#6b4e2e",this.grassColor=e.grassColor??"#52b744",this.surfaceColor=e.surfaceColor??"#419435"}generate(e,c){this.screenHeight=Math.max(500,c),this.totalWidth=Math.max(this.segmentSize*2,Math.round(e*this.extendScreens)),this.groundY=this.screenHeight+800,this.surfacePoints=[],this.chunks.clear();const p=Math.ceil(this.totalWidth/this.chunkSize)+4;for(let n=-2;n<p;n++)this.generateChunk(n);this.rebuildSurfacePoints()}generateChunk(e){if(this.chunks.has(e))return;const c=e*this.chunkSize,p=this.chunkSize+this.segmentSize,n=c+p,t=[],s=Math.ceil(p/this.segmentSize);for(let u=0;u<=s;u++){const o=c+u*this.segmentSize;o<=n&&t.push({x:o,y:this.calcSurfaceY(o)})}const r=[],a=100;for(let u=0;u<t.length-1;u++){const o=t[u],f=t[u+1],h=f.x-o.x,i=f.y-o.y,l=Math.hypot(h,i)+8,d=Math.atan2(i,h),g=-Math.sin(d),v=Math.cos(d),b=(o.x+f.x)/2+g*(a/2),M=(o.y+f.y)/2+v*(a/2),k=D.Bodies.rectangle(b,M,l,a,{isStatic:!0,angle:d,friction:.95,frictionStatic:1.2,restitution:.05,slop:.01,chamfer:{radius:2},label:"ground"});r.push(k)}this.chunks.set(e,{chunkIndex:e,startX:c,points:t,bodies:r})}update(e,c=0,p=0){const n={addedBodies:[],removedBodies:[]};if(p===0)return n;const t=c-this.cullDistance,s=c+p+this.renderDistance,r=Math.floor(t/this.chunkSize)-1,a=Math.ceil(s/this.chunkSize)+1;for(let o=r;o<=a;o++)if(!(o<-3)&&!this.chunks.has(o)){this.generateChunk(o);const f=this.chunks.get(o);if(f)for(const h of f.bodies)n.addedBodies.push(h)}const u=[];for(const[o,f]of this.chunks){const h=f.startX+this.chunkSize;(o<-3&&h<c-this.cullDistance||o>0&&(h<c-this.cullDistance||f.startX>c+p+this.renderDistance))&&u.push(o)}for(const o of u){const f=this.chunks.get(o);if(f){for(const h of f.bodies)n.removedBodies.push(h);this.chunks.delete(o)}}return(n.addedBodies.length>0||n.removedBodies.length>0)&&this.rebuildSurfacePoints(),n}rebuildSurfacePoints(){this.surfacePoints=[];const e=Array.from(this.chunks.keys()).sort((p,n)=>p-n),c=new Set;for(const p of e){const n=this.chunks.get(p);if(n)for(const t of n.points){const s=Math.round(t.x/this.segmentSize);c.has(s)||(c.add(s),this.surfacePoints.push(t))}}}calcSurfaceY(e){const c=Math.min(this.screenHeight*.72,this.screenHeight-this.minHeight*.8);if(e<400)return c;const p=Math.min(1,(e-400)/300);let n=0;n+=Math.sin(e*.0018+this.seed)*(this.amplitude*.55),n+=Math.sin(e*.0042+this.seed*2.3)*(this.amplitude*.3),n+=Math.sin(e*.009+this.seed*5.7)*(this.amplitude*.15),n+=Math.sin(e*.018+this.seed*8.1)*(this.amplitude*.06);const t=e%1400/1400;if(t>.65&&t<.85){const s=Math.sin((t-.65)/.2*Math.PI);n-=s*(this.amplitude*.6)}return c-n*p}getSurfacePoints(){return this.surfacePoints}surfaceYAt(e){return this.calcSurfaceY(e)}getGroundY(){return this.groundY}getTotalWidth(){return this.totalWidth}getTerrainColor(){return this.terrainColor}getGrassColor(){return this.grassColor}getSurfaceColor(){return this.surfaceColor}getBiomeId(){return this.biomeId}createBodies(){const e=[];for(const c of this.chunks.values())e.push(...c.bodies);return e}setBiome(e){this.amplitude=e.terrain.amplitude,this.minHeight=e.terrain.minHeight,this.seed=e.terrain.seed,this.extendScreens=e.terrain.extendScreens,this.terrainColor=e.terrain.terrainColor,this.grassColor=e.terrain.grassColor,this.surfaceColor=e.terrain.surfaceColor,this.biomeId=e.id}destroy(){this.surfacePoints=[],this.chunks.clear(),this.totalWidth=0,this.groundY=0}}class Ge{keys=new Set;handleKeyDown;handleKeyUp;handleBlur;handleVisibilityChange;constructor(){this.handleKeyDown=e=>{this.keys.add(e.code),e.key&&(this.keys.add(e.key.toLowerCase()),this.keys.add(e.key))},this.handleKeyUp=e=>{this.keys.delete(e.code),e.key&&(this.keys.delete(e.key.toLowerCase()),this.keys.delete(e.key))},this.handleBlur=()=>{this.clear()},this.handleVisibilityChange=()=>{document.hidden&&this.clear()},window.addEventListener("keydown",this.handleKeyDown),window.addEventListener("keyup",this.handleKeyUp),window.addEventListener("blur",this.handleBlur),window.addEventListener("focus",this.handleBlur),document.addEventListener("visibilitychange",this.handleVisibilityChange)}isAccelerating(){return this.keys.has("KeyD")||this.keys.has("ArrowRight")||this.keys.has("d")||this.keys.has("D")}isBraking(){return this.keys.has("KeyA")||this.keys.has("ArrowLeft")||this.keys.has("a")||this.keys.has("A")}isJumping(){return this.keys.has("KeyW")||this.keys.has("ArrowUp")||this.keys.has("Space")||this.keys.has("w")||this.keys.has("W")||this.keys.has(" ")}clear(){this.keys.clear()}destroy(){window.removeEventListener("keydown",this.handleKeyDown),window.removeEventListener("keyup",this.handleKeyUp),window.removeEventListener("blur",this.handleBlur),window.removeEventListener("focus",this.handleBlur),document.removeEventListener("visibilitychange",this.handleVisibilityChange),this.clear()}}class ze{x=0;y=0;zoom=1;targetZoom=1;followSpeed;offsetX;constructor(e){this.followSpeed=e.followSpeed,this.offsetX=e.offsetX}follow(e,c=0,p=0){const n=Math.min(180,p*8),t=e-this.offsetX+n;this.x+=(t-this.x)*this.followSpeed;const s=c-320;this.y+=(s-this.y)*(this.followSpeed*.7),this.targetZoom=Math.max(.85,1-p/30*.15),this.zoom+=(this.targetZoom-this.zoom)*.05}setImmediate(e,c=0){this.x=e-this.offsetX,this.y=c-320,this.zoom=1}getX(){return this.x}getY(){return this.y}getZoom(){return this.zoom}destroy(){}}class Ue{body=null;_value;radius;animTimer=Math.random()*100;constructor(e){this._value=e.value,this.radius=e.radius,this.body=D.Bodies.circle(e.x,e.y,e.radius,{isStatic:!0,isSensor:!0,density:e.density,friction:0,frictionAir:0,frictionStatic:0,restitution:0,label:"coin"})}getBody(){return this.body}getValue(){return this._value}getX(){return this.body?this.body.position.x:0}getY(){return this.body?this.body.position.y:0}addTo(e){this.body&&D.World.add(e,this.body)}removeFrom(e){this.body&&D.World.remove(e,this.body)}render(e,c,p){if(!this.body)return;this.animTimer+=.08;const n=this.body.position.x,t=this.body.position.y+Math.sin(this.animTimer)*3,s=Math.cos(this.animTimer);e.save(),e.translate(-c,-p),e.translate(n,t),e.fillStyle="#e5a700",e.beginPath(),e.ellipse(0,0,Math.max(1,Math.abs(s)*this.radius),this.radius,0,0,Math.PI*2),e.fill(),e.fillStyle="#ffd700",e.beginPath(),e.ellipse(0,0,Math.max(1,Math.abs(s)*(this.radius-2)),this.radius-2,0,0,Math.PI*2),e.fill(),Math.abs(s)>.4&&(e.fillStyle="#b27b00",e.beginPath(),e.arc(0,0,(this.radius-4)*Math.abs(s),0,Math.PI*2),e.fill(),e.fillStyle="#ffffff",e.fillRect(-1.5*s,-4,3*s,8)),e.restore()}destroy(){this.body=null}}class Ne{config;coins=new Map;spawnedSlots=new Set;world;segmentSize;collisionHandler=null;engine=null;onCoinCollected=null;constructor(e,c,p){this.config=e,this.world=c,this.segmentSize=p}getWorld(){return this.world}spawnCoins(e,c){const p=Math.ceil((e+this.config.coinSpacing*6)/this.config.coinSpacing);for(let n=1;n<=p;n++)this.spawnSlot(n,c)}update(e,c,p){const n=e-400,t=e+c+800,s=Math.max(1,Math.floor(n/this.config.coinSpacing)),r=Math.ceil(t/this.config.coinSpacing);for(let u=s;u<=r;u++)this.spawnedSlots.has(u)||this.spawnSlot(u,p);const a=e-800;for(const[u,o]of this.coins)o.getX()<a&&(o.removeFrom(this.world),o.destroy(),this.coins.delete(u))}spawnSlot(e,c){this.spawnedSlots.add(e);const p=e*this.config.coinSpacing,n=e%3;if(n===0)for(let t=-25;t<=25;t+=25){const s=p+t,a=c(s)-this.config.aboveSurface;this.createCoin(s,a)}else if(n===1)for(let t=0;t<4;t++){const s=p+t*30-45,r=c(s),a=Math.sin(t/3*Math.PI)*45,u=r-this.config.aboveSurface-a;this.createCoin(s,u)}else{const s=c(p)-this.config.aboveSurface;this.createCoin(p,s)}}createCoin(e,c){const p=`${Math.round(e)}_${Math.round(c)}`;if(this.coins.has(p))return;const n=new Ue({x:e,y:c,radius:this.config.coinRadius,value:this.config.coinValue,segmentSize:this.segmentSize,density:this.config.coinDensity});n.addTo(this.world),this.coins.set(p,n)}setupCollisionDetection(e,c){this.engine=e,this.onCoinCollected=c,this.collisionHandler=p=>{const n=p.pairs;for(const t of n){const s=t.bodyA,r=t.bodyB,a=s.label==="coin",u=r.label==="coin";if(!a&&!u)continue;const o=a?s:r,f=a?r:s;if(!(f.label!=="vehicle_chassis"&&f.label!=="wheel_front"&&f.label!=="wheel_rear"&&f.label!=="driver_head")){for(const[h,i]of this.coins)if(i.getBody()===o){this.onCoinCollected&&this.onCoinCollected(i,f),i.removeFrom(this.world),i.destroy(),this.coins.delete(h);break}}}},D.Events.on(e,"collisionStart",this.collisionHandler)}getCoins(){return Array.from(this.coins.values())}getCount(){return this.coins.size}render(e,c,p){for(const n of this.coins.values())n.render(e,c,p)}destroy(){this.engine&&this.collisionHandler&&D.Events.off(this.engine,"collisionStart",this.collisionHandler),this.collisionHandler=null,this.onCoinCollected=null,this.engine=null;for(const e of this.coins.values())e.removeFrom(this.world),e.destroy();this.coins.clear(),this.spawnedSlots.clear()}}class Ye{body=null;amount;animTimer=Math.random()*100;constructor(e){this.amount=e.amount,this.body=D.Bodies.circle(e.x,e.y,e.radius*1.5,{isStatic:!0,isSensor:!0,label:"fuel"})}getBody(){return this.body}getAmount(){return this.amount}getX(){return this.body?this.body.position.x:0}getY(){return this.body?this.body.position.y:0}addTo(e){this.body&&D.World.add(e,this.body)}removeFrom(e){this.body&&D.World.remove(e,this.body)}render(e,c,p){if(!this.body)return;this.animTimer+=.06;const n=this.body.position.x,t=this.body.position.y+Math.sin(this.animTimer)*5;e.save(),e.translate(-c,-p),e.translate(n,t);const s=e.createRadialGradient(0,0,8,0,0,24);s.addColorStop(0,"rgba(255, 60, 60, 0.6)"),s.addColorStop(1,"rgba(255, 60, 60, 0)"),e.fillStyle=s,e.beginPath(),e.arc(0,0,24,0,Math.PI*2),e.fill(),e.fillStyle="#e62222",e.beginPath(),e.roundRect(-10,-12,20,24,3),e.fill(),e.strokeStyle="#ffffff",e.lineWidth=1.5,e.stroke(),e.fillStyle="#b31414",e.fillRect(-6,-16,12,4),e.fillStyle="#ffd700",e.fillRect(4,-18,5,5),e.fillStyle="#ffffff",e.font='bold 8px "Segoe UI", sans-serif',e.textAlign="center",e.textBaseline="middle",e.fillText("GAS",0,0),e.restore()}destroy(){this.body=null}}class $e{config;fuels=new Map;spawnedSlots=new Set;world;segmentSize;collisionHandler=null;engine=null;onFuelCollected=null;constructor(e,c,p){this.config=e,this.world=c,this.segmentSize=p}spawnFuels(e,c){const p=Math.ceil((e+this.config.fuelSpacing*4)/this.config.fuelSpacing);for(let n=1;n<=p;n++)this.spawnSlot(n,c)}update(e,c,p){const n=e-400,t=e+c+800,s=Math.max(1,Math.floor(n/this.config.fuelSpacing)),r=Math.ceil(t/this.config.fuelSpacing);for(let u=s;u<=r;u++)this.spawnedSlots.has(u)||this.spawnSlot(u,p);const a=e-800;for(const[u,o]of this.fuels)o.getX()<a&&(o.removeFrom(this.world),o.destroy(),this.fuels.delete(u))}spawnSlot(e,c){this.spawnedSlots.add(e);const p=e*this.config.fuelSpacing,t=c(p)-this.config.aboveSurface-5,s=new Ye({x:p,y:t,radius:this.config.fuelRadius,amount:this.config.fuelAmount,segmentSize:this.segmentSize});s.addTo(this.world),this.fuels.set(e,s)}setupCollisionDetection(e,c){this.engine=e,this.onFuelCollected=c,this.collisionHandler=p=>{const n=p.pairs;for(const t of n){const s=t.bodyA,r=t.bodyB,a=s.label==="fuel",u=r.label==="fuel";if(!a&&!u)continue;const o=a?s:r,f=a?r:s;if(!(f.label!=="vehicle_chassis"&&f.label!=="wheel_front"&&f.label!=="wheel_rear"&&f.label!=="driver_head")){for(const[h,i]of this.fuels)if(i.getBody()===o){this.onFuelCollected&&this.onFuelCollected(i,f),i.removeFrom(this.world),i.destroy(),this.fuels.delete(h);break}}}},D.Events.on(e,"collisionStart",this.collisionHandler)}getFuels(){return Array.from(this.fuels.values())}getCount(){return this.fuels.size}render(e,c,p){for(const n of this.fuels.values())n.render(e,c,p)}destroy(){this.engine&&this.collisionHandler&&D.Events.off(this.engine,"collisionStart",this.collisionHandler),this.collisionHandler=null,this.onFuelCollected=null,this.engine=null;for(const e of this.fuels.values())e.removeFrom(this.world),e.destroy();this.fuels.clear(),this.spawnedSlots.clear()}}class Xe{config;startPositionX=0;maxPositionX=0;distance=0;coinScore=0;totalScore=0;bestDistance=0;bestScore=0;constructor(e){this.config=e,this.bestDistance=this.loadBest("bestDistance",0),this.bestScore=this.loadBest(this.config.bestDistanceKey,0)}setStartPosition(e){this.startPositionX=e,this.maxPositionX=e,this.distance=0}updatePosition(e){e>this.maxPositionX&&(this.maxPositionX=e),this.distance=Math.max(0,Math.floor((this.maxPositionX-this.startPositionX)/10)),this.recalculateScore(),this.updateBest()}addCoins(e){this.coinScore+=e*this.config.coinValue,this.recalculateScore(),this.updateBest()}recalculateScore(){this.totalScore=this.distance*this.config.distanceWeight+this.coinScore}updateBest(){this.distance>this.bestDistance&&(this.bestDistance=this.distance,this.saveBest("bestDistance",this.bestDistance)),this.totalScore>this.bestScore&&(this.bestScore=this.totalScore,this.saveBest(this.config.bestDistanceKey,this.bestScore))}loadBest(e,c){if(typeof localStorage>"u")return c;try{const p=localStorage.getItem(e);if(p===null)return c;const n=parseFloat(p);return isNaN(n)?c:n}catch{return c}}saveBest(e,c){if(!(typeof localStorage>"u"))try{localStorage.setItem(e,c.toString())}catch{}}getDistance(){return this.distance}getScore(){return this.totalScore}getCoinScore(){return this.coinScore}getBestDistance(){return this.bestDistance}getBestScore(){return this.bestScore}getMaxPositionX(){return this.maxPositionX}reset(){this.maxPositionX=this.startPositionX,this.distance=0,this.coinScore=0,this.totalScore=0}destroy(){}}class je{container;dataProvider;runCoinElement;totalCoinElement;distanceElement;scoreElement;fuelFillElement;fuelTextElement;fuelContainer;speedElement;pauseButton;muteButton;onPauseClick;onMuteToggleClick;constructor(e,c){this.dataProvider=c;const p=document.getElementById(e.containerId);if(!(p instanceof HTMLElement))throw new Error(`[Hill Rush] #${e.containerId} element was not found.`);this.container=document.createElement("div"),this.container.className="hill-rush-hud",this.container.innerHTML=`
      <div class="hill-rush-hud-top">
        <!-- Left Stats Badges -->
        <div class="hill-rush-hud-stats">
          <!-- Level Coins Collected Badge -->
          <div class="hill-rush-badge hill-rush-badge-run-coins">
            <span class="hill-rush-badge-icon">🪙</span>
            <div class="hill-rush-badge-content">
              <span class="hill-rush-badge-label">LEVEL COINS</span>
              <span class="hill-rush-badge-value" id="hr-run-coins">+0</span>
            </div>
          </div>
          <!-- Total Banked Coins Badge -->
          <div class="hill-rush-badge hill-rush-badge-total-coins">
            <span class="hill-rush-badge-icon">🏦</span>
            <div class="hill-rush-badge-content">
              <span class="hill-rush-badge-label">TOTAL BANK</span>
              <span class="hill-rush-badge-value" id="hr-total-coins">0</span>
            </div>
          </div>
          <!-- Distance Badge -->
          <div class="hill-rush-badge hill-rush-badge-distance">
            <span class="hill-rush-badge-icon">🏁</span>
            <div class="hill-rush-badge-content">
              <span class="hill-rush-badge-label">DISTANCE</span>
              <span class="hill-rush-badge-value"><span id="hr-distance">0</span>m</span>
            </div>
          </div>
          <!-- Score Badge -->
          <div class="hill-rush-badge hill-rush-badge-score">
            <span class="hill-rush-badge-icon">⭐</span>
            <div class="hill-rush-badge-content">
              <span class="hill-rush-badge-label">SCORE</span>
              <span class="hill-rush-badge-value" id="hr-score">0</span>
            </div>
          </div>
        </div>

        <!-- Center Fuel Gauge -->
        <div class="hill-rush-fuel-gauge" id="hr-fuel-gauge">
          <div class="hill-rush-fuel-header">
            <span class="hill-rush-fuel-icon">⛽</span>
            <span class="hill-rush-fuel-label">FUEL</span>
            <span class="hill-rush-fuel-pct" id="hr-fuel-pct">100%</span>
          </div>
          <div class="hill-rush-fuel-track">
            <div class="hill-rush-fuel-fill" id="hr-fuel-fill"></div>
          </div>
        </div>

        <!-- Right Action Buttons -->
        <div class="hill-rush-hud-actions">
          <button class="hill-rush-hud-btn hill-rush-mute-btn" id="hr-mute-btn" title="Toggle Sound">
            🔊
          </button>
          <button class="hill-rush-hud-btn hill-rush-pause-btn" id="hr-pause-btn" title="Pause Game">
            ⏸️
          </button>
        </div>
      </div>

      <!-- Bottom Speedometer Gauge -->
      <div class="hill-rush-hud-bottom">
        <div class="hill-rush-speed-gauge">
          <span class="hill-rush-speed-val" id="hr-speed">0</span>
          <span class="hill-rush-speed-unit">KM/H</span>
        </div>
      </div>
    `,p.appendChild(this.container),this.runCoinElement=this.container.querySelector("#hr-run-coins"),this.totalCoinElement=this.container.querySelector("#hr-total-coins"),this.distanceElement=this.container.querySelector("#hr-distance"),this.scoreElement=this.container.querySelector("#hr-score"),this.fuelFillElement=this.container.querySelector("#hr-fuel-fill"),this.fuelTextElement=this.container.querySelector("#hr-fuel-pct"),this.fuelContainer=this.container.querySelector("#hr-fuel-gauge"),this.speedElement=this.container.querySelector("#hr-speed"),this.pauseButton=this.container.querySelector("#hr-pause-btn"),this.muteButton=this.container.querySelector("#hr-mute-btn"),this.onPauseClick=()=>this.dataProvider.onPause(),this.onMuteToggleClick=()=>{this.dataProvider.onMuteToggle(),this.updateMuteIcon()},this.pauseButton.addEventListener("click",this.onPauseClick),this.muteButton.addEventListener("click",this.onMuteToggleClick),this.updateMuteIcon(),this.injectStyles()}updateMuteIcon(){const e=this.dataProvider.isMuted();this.muteButton.textContent=e?"🔇":"🔊"}update(){const e=Math.floor(this.dataProvider.getRunCoins());this.runCoinElement.textContent=`+${e.toLocaleString()}`,this.totalCoinElement.textContent=Math.floor(this.dataProvider.getCoinCount()).toLocaleString(),this.distanceElement.textContent=Math.floor(this.dataProvider.getDistance()).toLocaleString(),this.scoreElement.textContent=Math.floor(this.dataProvider.getScore()).toLocaleString();const c=Math.floor(this.dataProvider.getSpeed()*3.6*2.2);this.speedElement.textContent=c.toString();const p=Math.max(0,Math.min(1,this.dataProvider.getFuelRatio())),n=Math.round(p*100);this.fuelFillElement.style.width=`${n}%`,this.fuelTextElement.textContent=`${n}%`,p<.25?(this.fuelFillElement.style.background="linear-gradient(90deg, #ff1a1a, #ff5500)",this.fuelContainer.classList.add("low-fuel")):p<.5?(this.fuelFillElement.style.background="linear-gradient(90deg, #ffaa00, #ffd700)",this.fuelContainer.classList.remove("low-fuel")):(this.fuelFillElement.style.background="linear-gradient(90deg, #00d2ff, #00ff88)",this.fuelContainer.classList.remove("low-fuel")),this.updateMuteIcon()}hide(){this.container.style.display="none"}show(){this.container.style.display=""}destroy(){this.pauseButton.removeEventListener("click",this.onPauseClick),this.muteButton.removeEventListener("click",this.onMuteToggleClick),this.container.parentElement&&this.container.parentElement.removeChild(this.container)}injectStyles(){if(document.getElementById("hill-rush-hud-styles"))return;const e=document.createElement("style");e.id="hill-rush-hud-styles",e.textContent=`
      .hill-rush-hud {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 100;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 16px 20px;
        box-sizing: border-box;
        font-family: "Segoe UI", -apple-system, sans-serif;
      }
      .hill-rush-hud-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        width: 100%;
      }
      .hill-rush-hud-stats {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }
      .hill-rush-badge {
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(15, 20, 35, 0.75);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 6px 14px;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
      }
      .hill-rush-badge-icon {
        font-size: 18px;
      }
      .hill-rush-badge-content {
        display: flex;
        flex-direction: column;
      }
      .hill-rush-badge-label {
        font-size: 9px;
        font-weight: 700;
        color: #94a3b8;
        letter-spacing: 1px;
      }
      .hill-rush-badge-value {
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
        text-shadow: 0 1px 3px rgba(0,0,0,0.5);
      }
      .hill-rush-badge-run-coins .hill-rush-badge-value {
        color: #ffd700;
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
      }
      .hill-rush-badge-total-coins .hill-rush-badge-value {
        color: #38bdf8;
      }

      /* Fuel Gauge */
      .hill-rush-fuel-gauge {
        display: flex;
        flex-direction: column;
        gap: 4px;
        background: rgba(15, 20, 35, 0.75);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 8px 16px;
        border-radius: 12px;
        width: 180px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        transition: border-color 0.3s, transform 0.3s;
      }
      .hill-rush-fuel-gauge.low-fuel {
        border-color: #ff3333;
        animation: fuelPulse 0.8s infinite alternate;
      }
      @keyframes fuelPulse {
        from { transform: scale(1); box-shadow: 0 0 10px rgba(255,0,0,0.4); }
        to { transform: scale(1.05); box-shadow: 0 0 20px rgba(255,0,0,0.8); }
      }
      .hill-rush-fuel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .hill-rush-fuel-label {
        font-size: 10px;
        font-weight: 700;
        color: #cbd5e1;
        letter-spacing: 1px;
      }
      .hill-rush-fuel-pct {
        font-size: 12px;
        font-weight: 800;
        color: #ffffff;
      }
      .hill-rush-fuel-track {
        width: 100%;
        height: 10px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .hill-rush-fuel-fill {
        height: 100%;
        width: 100%;
        border-radius: 6px;
        background: linear-gradient(90deg, #00d2ff, #00ff88);
        transition: width 0.2s ease;
      }

      /* Actions */
      .hill-rush-hud-actions {
        display: flex;
        gap: 8px;
      }
      .hill-rush-hud-btn {
        pointer-events: auto;
        background: rgba(15, 20, 35, 0.75);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.25);
        border-radius: 12px;
        font-size: 16px;
        padding: 8px 12px;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
      .hill-rush-hud-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }

      /* Bottom Speedometer */
      .hill-rush-hud-bottom {
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
      }
      .hill-rush-speed-gauge {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: rgba(15, 20, 35, 0.6);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        padding: 6px 16px;
        border-radius: 16px;
      }
      .hill-rush-speed-val {
        font-size: 26px;
        font-weight: 900;
        color: #00f0ff;
        line-height: 1;
        text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
      }
      .hill-rush-speed-unit {
        font-size: 9px;
        font-weight: 800;
        color: #94a3b8;
        letter-spacing: 1px;
      }
    `,document.head.appendChild(e)}}class Ke{container;dataProvider;playBtn;trackBtn;garageBtn;missionsBtn;constructor(e,c){this.dataProvider=c;const p=document.getElementById(e.containerId);if(!(p instanceof HTMLElement))throw new Error(`[Hill Rush] #${e.containerId} element was not found.`);this.container=document.createElement("div"),this.container.className="hill-rush-main-menu",this.container.innerHTML=`
      <div class="hill-rush-menu-backdrop">
        <div class="hill-rush-menu-content">
          <!-- Game Title Banner -->
          <div class="hill-rush-title-group">
            <span class="hill-rush-title-tag">🏁 ARCADE RACING</span>
            <h1 class="hill-rush-menu-title">HILL RUSH</h1>
            <p class="hill-rush-menu-tagline">Conquer extreme terrain, perform insane stunts & upgrade your ride!</p>
          </div>

          <!-- Stats Cards -->
          <div class="hill-rush-menu-stats">
            <div class="hill-rush-menu-stat-card">
              <span class="hill-rush-stat-icon">🏆</span>
              <span class="hill-rush-stat-label">BEST DISTANCE</span>
              <span class="hill-rush-stat-val" id="hr-menu-best-distance">0m</span>
            </div>
            <div class="hill-rush-menu-stat-card">
              <span class="hill-rush-stat-icon">⭐</span>
              <span class="hill-rush-stat-label">BEST SCORE</span>
              <span class="hill-rush-stat-val" id="hr-menu-best-score">0</span>
            </div>
          </div>

          <!-- Main Actions -->
          <div class="hill-rush-menu-actions">
            <button class="hill-rush-primary-btn hill-rush-play-btn">
              <span class="btn-glow"></span>
              <span class="btn-text">▶ PLAY NOW</span>
            </button>
            <div class="hill-rush-secondary-actions">
              <button class="hill-rush-secondary-btn hill-rush-garage-btn">
                <span>🚗 GARAGE</span>
              </button>
              <button class="hill-rush-secondary-btn hill-rush-track-btn">
                <span>🗺️ TRACKS</span>
              </button>
              <button class="hill-rush-secondary-btn hill-rush-missions-btn">
                <span>🎯 MISSIONS</span>
              </button>
            </div>
          </div>

          <!-- Controls Reminder -->
          <div class="hill-rush-controls-bar">
            <div class="control-key-item">
              <span class="key-badge">D / →</span>
              <span class="key-action">Gas / Accelerate</span>
            </div>
            <div class="control-key-item">
              <span class="key-badge">A / ←</span>
              <span class="key-action">Brake / Reverse / Tilt</span>
            </div>
            <div class="control-key-item">
              <span class="key-badge">Touch</span>
              <span class="key-action">On-screen Gas & Brake</span>
            </div>
          </div>
        </div>
      </div>
    `,p.appendChild(this.container),this.playBtn=this.container.querySelector(".hill-rush-play-btn"),this.trackBtn=this.container.querySelector(".hill-rush-track-btn"),this.garageBtn=this.container.querySelector(".hill-rush-garage-btn"),this.missionsBtn=this.container.querySelector(".hill-rush-missions-btn"),this.playBtn.addEventListener("click",()=>this.dataProvider.onPlay()),this.trackBtn.addEventListener("click",()=>this.dataProvider.onTrack()),this.garageBtn.addEventListener("click",()=>this.dataProvider.onGarage()),this.missionsBtn.addEventListener("click",()=>this.dataProvider.onMissions()),this.injectStyles(),this.update()}update(){const e=this.container.querySelector("#hr-menu-best-distance"),c=this.container.querySelector("#hr-menu-best-score");e&&(e.textContent=`${Math.floor(this.dataProvider.getBestDistance()).toLocaleString()}m`),c&&(c.textContent=Math.floor(this.dataProvider.getBestScore()).toLocaleString())}show(){this.container.style.display="",this.update()}hide(){this.container.style.display="none"}destroy(){this.container.parentElement&&this.container.parentElement.removeChild(this.container)}injectStyles(){if(document.getElementById("hill-rush-main-menu-styles"))return;const e=document.createElement("style");e.id="hill-rush-main-menu-styles",e.textContent=`
      .hill-rush-main-menu {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200;
        font-family: "Segoe UI", -apple-system, sans-serif;
        background: radial-gradient(circle at center, rgba(20, 25, 50, 0.6) 0%, rgba(5, 5, 15, 0.85) 100%);
      }
      .hill-rush-menu-backdrop {
        max-width: 580px;
        width: 90%;
        margin: auto;
      }
      .hill-rush-menu-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        padding: 40px 32px;
        background: rgba(18, 24, 44, 0.85);
        backdrop-filter: blur(20px);
        border: 2px solid rgba(255, 255, 255, 0.15);
        border-radius: 28px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 210, 255, 0.2);
        text-align: center;
      }
      .hill-rush-title-group {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
      }
      .hill-rush-title-tag {
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 2px;
        color: #00d2ff;
        background: rgba(0, 210, 255, 0.15);
        padding: 4px 12px;
        border-radius: 20px;
        border: 1px solid rgba(0, 210, 255, 0.3);
      }
      .hill-rush-menu-title {
        font-size: 54px;
        font-weight: 900;
        margin: 0;
        background: linear-gradient(135deg, #ffffff 0%, #ffd700 50%, #ff6b35 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 10px 30px rgba(255, 107, 53, 0.4);
        letter-spacing: 2px;
      }
      .hill-rush-menu-tagline {
        font-size: 13px;
        color: #94a3b8;
        margin: 0;
        max-width: 420px;
      }
      .hill-rush-menu-stats {
        display: flex;
        gap: 16px;
        width: 100%;
      }
      .hill-rush-menu-stat-card {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 12px;
        background: rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
      }
      .hill-rush-stat-icon {
        font-size: 20px;
      }
      .hill-rush-stat-label {
        font-size: 10px;
        font-weight: 700;
        color: #64748b;
        letter-spacing: 1px;
      }
      .hill-rush-stat-val {
        font-size: 20px;
        font-weight: 800;
        color: #ffffff;
      }
      .hill-rush-menu-actions {
        display: flex;
        flex-direction: column;
        gap: 14px;
        width: 100%;
      }
      .hill-rush-primary-btn {
        position: relative;
        overflow: hidden;
        padding: 16px 32px;
        font-size: 22px;
        font-weight: 900;
        color: #ffffff;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        border: 2px solid #34d399;
        border-radius: 16px;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
        transition: all 0.25s ease;
        letter-spacing: 1px;
      }
      .hill-rush-primary-btn:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 12px 32px rgba(16, 185, 129, 0.6);
        background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
      }
      .hill-rush-primary-btn:active {
        transform: translateY(0) scale(0.99);
      }
      .hill-rush-secondary-actions {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
      }
      .hill-rush-secondary-btn {
        padding: 12px 14px;
        font-size: 13px;
        font-weight: 700;
        color: #e2e8f0;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .hill-rush-secondary-btn:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: #00d2ff;
        color: #ffffff;
        transform: translateY(-2px);
      }
      .hill-rush-controls-bar {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        justify-content: center;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 16px;
        width: 100%;
      }
      .control-key-item {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .key-badge {
        font-size: 11px;
        font-weight: 800;
        color: #ffd700;
        background: rgba(255, 215, 0, 0.15);
        border: 1px solid rgba(255, 215, 0, 0.3);
        padding: 3px 8px;
        border-radius: 6px;
      }
      .key-action {
        font-size: 11px;
        color: #94a3b8;
      }
    `,document.head.appendChild(e)}}class qe{container;dataProvider;resumeBtn;restartBtn;mainMenuBtn;constructor(e,c){this.dataProvider=c;const p=document.getElementById(e.containerId);if(!(p instanceof HTMLElement))throw new Error(`[Hill Rush] #${e.containerId} element was not found.`);this.container=document.createElement("div"),this.container.className="hill-rush-pause-menu",this.container.innerHTML=`
      <div class="hill-rush-pause-backdrop">
        <div class="hill-rush-pause-modal">
          <span class="pause-icon">⏸️</span>
          <h1 class="hill-rush-pause-title">GAME PAUSED</h1>
          <p class="hill-rush-pause-sub">Take a breath and get ready to continue</p>
          <div class="hill-rush-pause-actions">
            <button class="hill-rush-pause-action hill-rush-resume-btn">
              ▶ RESUME RACE
            </button>
            <button class="hill-rush-pause-action hill-rush-restart-btn">
              🔄 RESTART RUN
            </button>
            <button class="hill-rush-pause-action hill-rush-main-menu-btn">
              🏠 MAIN MENU
            </button>
          </div>
        </div>
      </div>
    `,p.appendChild(this.container),this.resumeBtn=this.container.querySelector(".hill-rush-resume-btn"),this.restartBtn=this.container.querySelector(".hill-rush-restart-btn"),this.mainMenuBtn=this.container.querySelector(".hill-rush-main-menu-btn"),this.resumeBtn.addEventListener("click",()=>this.dataProvider.onResume()),this.restartBtn.addEventListener("click",()=>this.dataProvider.onRestart()),this.mainMenuBtn.addEventListener("click",()=>this.dataProvider.onMainMenu()),this.injectStyles()}show(){this.container.style.display=""}hide(){this.container.style.display="none"}destroy(){this.container.parentElement&&this.container.parentElement.removeChild(this.container)}injectStyles(){if(document.getElementById("hill-rush-pause-menu-styles"))return;const e=document.createElement("style");e.id="hill-rush-pause-menu-styles",e.textContent=`
      .hill-rush-pause-menu {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 200;
        font-family: "Segoe UI", -apple-system, sans-serif;
      }
      .hill-rush-pause-backdrop {
        width: 100%;
        height: 100%;
        background: rgba(5, 8, 20, 0.85);
        backdrop-filter: blur(16px);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .hill-rush-pause-modal {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        padding: 36px 48px;
        background: rgba(18, 24, 44, 0.9);
        border: 2px solid rgba(255, 255, 255, 0.15);
        border-radius: 24px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
        text-align: center;
        max-width: 420px;
        width: 90%;
        box-sizing: border-box;
      }
      .pause-icon {
        font-size: 36px;
      }
      .hill-rush-pause-title {
        font-size: 32px;
        font-weight: 900;
        color: #ffffff;
        margin: 0;
        letter-spacing: 1px;
      }
      .hill-rush-pause-sub {
        font-size: 13px;
        color: #94a3b8;
        margin: 0;
      }
      .hill-rush-pause-actions {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
        margin-top: 10px;
      }
      .hill-rush-pause-action {
        padding: 14px 20px;
        font-size: 15px;
        font-weight: 800;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;
        letter-spacing: 0.5px;
      }
      .hill-rush-resume-btn {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        border: 1px solid #34d399;
        color: #ffffff;
        box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
      }
      .hill-rush-resume-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
      }
      .hill-rush-restart-btn {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #ffd700;
      }
      .hill-rush-restart-btn:hover {
        background: rgba(255, 255, 255, 0.15);
        color: #ffffff;
        transform: translateY(-2px);
      }
      .hill-rush-main-menu-btn {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #94a3b8;
      }
      .hill-rush-main-menu-btn:hover {
        background: rgba(255, 68, 68, 0.2);
        border-color: #ff4444;
        color: #ffffff;
        transform: translateY(-2px);
      }
    `,document.head.appendChild(e)}}const q=[{id:"starter",name:"Hill Buggy",description:"Classic 4x4 off-roader with great hill climbing balance and forgiving suspension.",category:"4x4 Classic",color:"#ff6b35",accentColor:"#ffd700",wheelColor:"#222222",previewSVG:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50" fill="none">
      <!-- Buggy Chassis -->
      <path d="M15 32 L20 20 L40 12 L70 12 L85 24 L90 32 Z" fill="#ff6b35" stroke="#ffffff" stroke-width="2"/>
      <path d="M42 14 L68 14 L68 24 L35 24 Z" fill="#a0e0ff" opacity="0.8" stroke="#ffffff" stroke-width="1.5"/>
      <!-- Roll Cage -->
      <path d="M25 20 L40 12 L70 12 L80 24" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Driver -->
      <circle cx="50" cy="18" r="5" fill="#ffdd55" stroke="#333" stroke-width="1.5"/>
      <!-- Wheels -->
      <circle cx="28" cy="38" r="11" fill="#222222" stroke="#ffffff" stroke-width="2"/>
      <circle cx="28" cy="38" r="5" fill="#ff6b35"/>
      <circle cx="76" cy="38" r="11" fill="#222222" stroke="#ffffff" stroke-width="2"/>
      <circle cx="76" cy="38" r="5" fill="#ff6b35"/>
    </svg>`,config:{vehicleType:"starter",width:72,height:28,density:.003,wheelRadius:16,acceleration:.0055,maxSpeed:21,airControlTorque:.05,fuelCapacity:100,fuelConsumption:7,springStiffness:.22}},{id:"speedster",name:"Turbo Racer",description:"Aerodynamic speed demon engineered for massive air time, insane speed, and rapid flips.",category:"Supercar",color:"#00d2ff",accentColor:"#ff007f",wheelColor:"#111111",previewSVG:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50" fill="none">
      <!-- Speedster Body -->
      <path d="M10 32 L18 24 L45 16 L75 16 L92 26 L96 32 Z" fill="#00d2ff" stroke="#ffffff" stroke-width="2"/>
      <!-- Cockpit & Windshield -->
      <path d="M42 17 L68 17 L72 25 L32 25 Z" fill="#111122" stroke="#00f0ff" stroke-width="1.5"/>
      <!-- Spoiler -->
      <path d="M12 24 L8 14 L22 14" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Racing Stripe -->
      <path d="M18 24 L92 26" stroke="#ff007f" stroke-width="3"/>
      <!-- Wheels -->
      <circle cx="26" cy="36" r="12" fill="#111111" stroke="#00d2ff" stroke-width="2"/>
      <circle cx="26" cy="36" r="4" fill="#ffffff"/>
      <circle cx="78" cy="36" r="12" fill="#111111" stroke="#00d2ff" stroke-width="2"/>
      <circle cx="78" cy="36" r="4" fill="#ffffff"/>
    </svg>`,config:{vehicleType:"speedster",width:76,height:22,density:.0028,wheelRadius:14,acceleration:.007,maxSpeed:25,airControlTorque:.06,fuelCapacity:85,fuelConsumption:9.5,springStiffness:.26}},{id:"heavy",name:"Monster Crusher",description:"Unstoppable high-clearance truck with colossal tires that rolls over any steep hill with ease.",category:"Monster Truck",color:"#e63946",accentColor:"#f1faee",wheelColor:"#1a1a1a",previewSVG:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50" fill="none">
      <!-- Monster Body -->
      <path d="M12 26 L18 12 L50 8 L72 8 L85 16 L92 26 Z" fill="#e63946" stroke="#ffffff" stroke-width="2"/>
      <rect x="52" y="10" width="18" height="10" rx="2" fill="#a8dadc" stroke="#ffffff" stroke-width="1.5"/>
      <!-- Shocks/Chassis Lift -->
      <line x1="26" y1="26" x2="26" y2="34" stroke="#ffd700" stroke-width="3"/>
      <line x1="74" y1="26" x2="74" y2="34" stroke="#ffd700" stroke-width="3"/>
      <!-- Giant Wheels -->
      <circle cx="26" cy="36" r="16" fill="#1a1a1a" stroke="#ffffff" stroke-width="2.5"/>
      <circle cx="26" cy="36" r="7" fill="#e63946"/>
      <circle cx="74" cy="36" r="16" fill="#1a1a1a" stroke="#ffffff" stroke-width="2.5"/>
      <circle cx="74" cy="36" r="7" fill="#e63946"/>
    </svg>`,config:{vehicleType:"heavy",width:80,height:32,density:.0042,wheelRadius:20,acceleration:.006,maxSpeed:18,airControlTorque:.04,fuelCapacity:130,fuelConsumption:6.5,springStiffness:.18}}],be="hill-rush-selected-vehicle";function Ze(){return typeof localStorage>"u"?null:localStorage.getItem(be)}function ge(I){typeof localStorage>"u"||localStorage.setItem(be,I)}function Je(I){if(I){const e=q.find(c=>c.id===I);if(e)return e}return q[0]}const Ce=[{id:"engine",name:"Engine",description:"Increases acceleration and top speed with smooth progressive throttle.",maxLevel:5,costPerLevel:[20,40,60,80,100],effect:(I,e)=>({...e,acceleration:e.acceleration*(1+I*.12),maxSpeed:e.maxSpeed*(1+I*.08)})},{id:"tires",name:"Tires",description:"Improves wheel grip, traction, and uphill climbing stability.",maxLevel:5,costPerLevel:[15,30,45,60,75],effect:(I,e)=>({...e,acceleration:e.acceleration*(1+I*.05),airControlTorque:e.airControlTorque*(1+I*.04)})},{id:"suspension",name:"Suspension",description:"Improves shock absorption, landing stability, and chassis dampening.",maxLevel:5,costPerLevel:[25,50,75,100,125],effect:(I,e)=>({...e,springStiffness:(e.springStiffness??.28)*(1+I*.06),airControlTorque:e.airControlTorque*(1+I*.05)})},{id:"fuel_tank",name:"Fuel Tank",description:"Increases fuel capacity and improves mileage.",maxLevel:5,costPerLevel:[10,20,30,40,50],effect:(I,e)=>({...e,fuelCapacity:e.fuelCapacity*(1+I*.2),fuelConsumption:e.fuelConsumption*(1-I*.04)})}],we="hill-rush-upgrade-levels",Me="hill-rush-coin-balance",re={engine:0,tires:0,suspension:0,fuel_tank:0};function ae(){if(typeof localStorage>"u")return{...re};try{const I=localStorage.getItem(we);if(!I)return{...re};const e=JSON.parse(I);return{engine:e.engine??0,tires:e.tires??0,suspension:e.suspension??0,fuel_tank:e.fuel_tank??0}}catch{return{...re}}}function Qe(I){if(!(typeof localStorage>"u"))try{localStorage.setItem(we,JSON.stringify(I))}catch{}}function X(){if(typeof localStorage>"u")return 0;try{const I=localStorage.getItem(Me);if(!I)return 0;const e=parseInt(I,10);return isNaN(e)?0:e}catch{return 0}}function Q(I){if(!(typeof localStorage>"u"))try{localStorage.setItem(Me,I.toString())}catch{}}function _e(I){const e=ae();let c={...I};for(const p of Ce){const n=e[p.id];n>0&&(c=p.effect(n,c))}return c}class et{container;dataProvider;selectedId;upgradeLevels;coinBalance;cardContainer;previewContainer;nameElement;descElement;coinBalanceElement;upgradesContainer;backBtn;playBtn;constructor(e,c){this.dataProvider=c,this.selectedId=Ze()??q[0].id,this.upgradeLevels=ae(),this.coinBalance=X();const p=document.getElementById(e.containerId);if(!(p instanceof HTMLElement))throw new Error(`[Hill Rush] #${e.containerId} element was not found.`);this.container=document.createElement("div"),this.container.className="hill-rush-garage",this.container.innerHTML=`
      <div class="hill-rush-garage-modal">
        <!-- Header -->
        <div class="hill-rush-garage-header">
          <div>
            <h1 class="hill-rush-garage-title">🚗 VEHICLE GARAGE</h1>
            <p class="hill-rush-garage-subtitle">Customize, tune and upgrade your racing machines</p>
          </div>
          <div class="hill-rush-wallet-badge">
            <span class="wallet-icon">🪙</span>
            <div class="wallet-info">
              <span class="wallet-label">BALANCE</span>
              <span class="wallet-amount" id="hr-garage-coins">${this.coinBalance.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <!-- Vehicle Showcase -->
        <div class="hill-rush-garage-showcase">
          <div class="hill-rush-preview-box">
            <div class="hill-rush-preview-svg" id="hr-garage-svg"></div>
            <div class="hill-rush-preview-meta">
              <h2 class="hill-rush-preview-name" id="hr-garage-name">Hill Buggy</h2>
              <p class="hill-rush-preview-desc" id="hr-garage-desc"></p>
            </div>
          </div>
          <!-- Vehicle Selector List -->
          <div class="hill-rush-vehicle-cards" id="hr-garage-cards"></div>
        </div>

        <!-- Upgrades Grid -->
        <div class="hill-rush-upgrades-section">
          <h3 class="hill-rush-section-title">PERFORMANCE TUNING</h3>
          <div class="hill-rush-upgrade-grid" id="hr-upgrade-list"></div>
        </div>

        <!-- Footer Actions -->
        <div class="hill-rush-garage-footer">
          <button class="hill-rush-garage-back-btn">← Back to Menu</button>
          <button class="hill-rush-garage-play-btn">▶ Race with this Vehicle</button>
        </div>
      </div>
    `,p.appendChild(this.container),this.previewContainer=this.container.querySelector("#hr-garage-svg"),this.nameElement=this.container.querySelector("#hr-garage-name"),this.descElement=this.container.querySelector("#hr-garage-desc"),this.coinBalanceElement=this.container.querySelector("#hr-garage-coins"),this.cardContainer=this.container.querySelector("#hr-garage-cards"),this.upgradesContainer=this.container.querySelector("#hr-upgrade-list"),this.backBtn=this.container.querySelector(".hill-rush-garage-back-btn"),this.playBtn=this.container.querySelector(".hill-rush-garage-play-btn"),this.backBtn.addEventListener("click",()=>this.dataProvider.onBack()),this.playBtn.addEventListener("click",()=>{ge(this.selectedId),Q(this.coinBalance),this.dataProvider.onPlay()}),this.renderCards(),this.renderPreview(),this.renderUpgrades(),this.injectStyles()}getSelectedVehicleId(){return this.selectedId}renderCards(){this.cardContainer.innerHTML="";for(const e of q){const c=document.createElement("button"),p=e.id===this.selectedId;c.className=`hill-rush-vcard ${p?"selected":""}`,c.innerHTML=`
        <div class="vcard-svg">${e.previewSVG}</div>
        <div class="vcard-info">
          <span class="vcard-tag">${e.category}</span>
          <span class="vcard-name">${e.name}</span>
        </div>
      `,c.addEventListener("click",()=>{this.selectedId=e.id,ge(this.selectedId),this.renderCards(),this.renderPreview()}),this.cardContainer.appendChild(c)}}renderPreview(){const e=q.find(c=>c.id===this.selectedId)??q[0];this.previewContainer.innerHTML=e.previewSVG,this.nameElement.textContent=e.name,this.descElement.textContent=e.description}renderUpgrades(){this.upgradesContainer.innerHTML="";for(const e of Ce){const c=this.upgradeLevels[e.id],p=c>=e.maxLevel,n=c<e.maxLevel?e.costPerLevel[c]:0,t=!p&&this.coinBalance>=n;let s="";for(let u=1;u<=e.maxLevel;u++)s+=`<span class="upgrade-pip ${u<=c?"active":""}"></span>`;const r=document.createElement("div");r.className="hill-rush-upgrade-card",r.innerHTML=`
        <div class="upgrade-card-header">
          <div class="upgrade-title-group">
            <span class="upgrade-name">${e.name}</span>
            <span class="upgrade-desc">${e.description}</span>
          </div>
          <div class="upgrade-pips">${s}</div>
        </div>
        <button class="upgrade-buy-btn ${p?"maxed":""} ${t?"":"disabled"}">
          ${p?"MAX LEVEL":`UPGRADE • 🪙 ${n}`}
        </button>
      `;const a=r.querySelector(".upgrade-buy-btn");p||!t?a.disabled=!0:a.addEventListener("click",()=>{this.purchaseUpgrade(e)}),this.upgradesContainer.appendChild(r)}}purchaseUpgrade(e){const c=this.upgradeLevels[e.id];if(c>=e.maxLevel)return;const p=e.costPerLevel[c];this.coinBalance<p||(this.coinBalance-=p,this.upgradeLevels[e.id]=c+1,Qe(this.upgradeLevels),Q(this.coinBalance),this.coinBalanceElement.textContent=this.coinBalance.toLocaleString(),this.renderUpgrades(),this.dataProvider.onCoinCountChange(this.coinBalance))}show(){this.upgradeLevels=ae(),this.coinBalance=X(),this.coinBalanceElement.textContent=this.coinBalance.toLocaleString(),this.container.style.display="",this.renderCards(),this.renderPreview(),this.renderUpgrades()}hide(){this.container.style.display="none"}destroy(){this.container.parentElement&&this.container.parentElement.removeChild(this.container)}injectStyles(){if(document.getElementById("hill-rush-garage-styles"))return;const e=document.createElement("style");e.id="hill-rush-garage-styles",e.textContent=`
      .hill-rush-garage {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200;
        font-family: "Segoe UI", -apple-system, sans-serif;
        background: radial-gradient(circle at center, rgba(20, 25, 50, 0.7) 0%, rgba(5, 5, 15, 0.9) 100%);
      }
      .hill-rush-garage-modal {
        display: flex;
        flex-direction: column;
        gap: 20px;
        max-width: 820px;
        width: 92%;
        max-height: 90vh;
        overflow-y: auto;
        padding: 32px;
        background: rgba(18, 24, 44, 0.9);
        backdrop-filter: blur(20px);
        border: 2px solid rgba(255, 255, 255, 0.15);
        border-radius: 24px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
        box-sizing: border-box;
      }
      .hill-rush-garage-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding-bottom: 16px;
      }
      .hill-rush-garage-title {
        font-size: 28px;
        font-weight: 800;
        color: #ffffff;
        margin: 0;
      }
      .hill-rush-garage-subtitle {
        font-size: 13px;
        color: #94a3b8;
        margin: 4px 0 0 0;
      }
      .hill-rush-wallet-badge {
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(255, 215, 0, 0.15);
        border: 1px solid rgba(255, 215, 0, 0.3);
        padding: 8px 16px;
        border-radius: 14px;
      }
      .wallet-icon {
        font-size: 24px;
      }
      .wallet-info {
        display: flex;
        flex-direction: column;
      }
      .wallet-label {
        font-size: 9px;
        font-weight: 800;
        color: #ffd700;
        letter-spacing: 1px;
      }
      .wallet-amount {
        font-size: 18px;
        font-weight: 800;
        color: #ffffff;
      }

      /* Showcase */
      .hill-rush-garage-showcase {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
      .hill-rush-preview-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 20px;
        text-align: center;
      }
      .hill-rush-preview-svg {
        width: 140px;
        height: 70px;
      }
      .hill-rush-preview-svg svg {
        width: 100%;
        height: 100%;
      }
      .hill-rush-preview-name {
        font-size: 20px;
        font-weight: 800;
        color: #ffffff;
        margin: 8px 0 4px 0;
      }
      .hill-rush-preview-desc {
        font-size: 12px;
        color: #94a3b8;
        margin: 0;
      }

      .hill-rush-vehicle-cards {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .hill-rush-vcard {
        display: flex;
        align-items: center;
        gap: 14px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 12px;
        padding: 10px 14px;
        cursor: pointer;
        transition: all 0.2s;
        text-align: left;
      }
      .hill-rush-vcard:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.3);
      }
      .hill-rush-vcard.selected {
        background: rgba(0, 210, 255, 0.15);
        border-color: #00d2ff;
        box-shadow: 0 0 16px rgba(0, 210, 255, 0.3);
      }
      .vcard-svg {
        width: 60px;
        height: 30px;
        flex-shrink: 0;
      }
      .vcard-svg svg {
        width: 100%;
        height: 100%;
      }
      .vcard-info {
        display: flex;
        flex-direction: column;
      }
      .vcard-tag {
        font-size: 9px;
        font-weight: 700;
        color: #00d2ff;
        letter-spacing: 1px;
      }
      .vcard-name {
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
      }

      /* Upgrades */
      .hill-rush-section-title {
        font-size: 14px;
        font-weight: 800;
        color: #94a3b8;
        letter-spacing: 1px;
        margin: 0 0 12px 0;
      }
      .hill-rush-upgrade-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .hill-rush-upgrade-card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 10px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 14px;
        padding: 12px 14px;
      }
      .upgrade-name {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
      }
      .upgrade-desc {
        font-size: 11px;
        color: #94a3b8;
        display: block;
        margin-top: 2px;
      }
      .upgrade-pips {
        display: flex;
        gap: 4px;
        margin-top: 6px;
      }
      .upgrade-pip {
        width: 12px;
        height: 6px;
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.2);
      }
      .upgrade-pip.active {
        background: #ffd700;
        box-shadow: 0 0 6px rgba(255, 215, 0, 0.6);
      }
      .upgrade-buy-btn {
        padding: 8px 12px;
        font-size: 12px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        border: 1px solid #34d399;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .upgrade-buy-btn:hover:not(.disabled):not(.maxed) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
      }
      .upgrade-buy-btn.disabled {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.1);
        color: #64748b;
        cursor: not-allowed;
      }
      .upgrade-buy-btn.maxed {
        background: rgba(255, 215, 0, 0.15);
        border-color: rgba(255, 215, 0, 0.3);
        color: #ffd700;
        cursor: default;
      }

      /* Footer */
      .hill-rush-garage-footer {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 16px;
      }
      .hill-rush-garage-back-btn {
        padding: 12px 20px;
        font-size: 14px;
        font-weight: 700;
        color: #cbd5e1;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .hill-rush-garage-back-btn:hover {
        background: rgba(255, 255, 255, 0.15);
        color: #ffffff;
      }
      .hill-rush-garage-play-btn {
        padding: 12px 28px;
        font-size: 15px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(135deg, #00d2ff 0%, #0077ff 100%);
        border: 1px solid #00f0ff;
        border-radius: 12px;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(0, 210, 255, 0.4);
        transition: all 0.2s;
      }
      .hill-rush-garage-play-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 210, 255, 0.6);
      }
    `,document.head.appendChild(e)}}const J=[{id:"countryside",name:"Countryside",description:"Rolling green hills and gentle terrain.",locked:!1,previewColor:"#4ca84c",terrain:{segmentSize:32,amplitude:120,minHeight:50,seed:1337,extendScreens:2.5,terrainColor:"#7a5c3a",grassColor:"#4ca84c",surfaceColor:"#5a4230"}},{id:"desert",name:"Desert",description:"Sandy dunes and harsh terrain.",locked:!1,previewColor:"#c2b280",terrain:{segmentSize:40,amplitude:150,minHeight:40,seed:4242,extendScreens:2.5,terrainColor:"#c2b280",grassColor:"#a0794c",surfaceColor:"#8c7853"}},{id:"snow",name:"Snow",description:"Icy hills and snow-covered terrain.",locked:!1,previewColor:"#a0d8f0",terrain:{segmentSize:35,amplitude:100,minHeight:60,seed:8888,extendScreens:2.5,terrainColor:"#a0d8f0",grassColor:"#e0f0ff",surfaceColor:"#7090a0"}},{id:"neon_city",name:"Neon City",description:"Cyberpunk streets and neon-lit terrain.",locked:!1,previewColor:"#ff00ff",terrain:{segmentSize:30,amplitude:80,minHeight:50,seed:9999,extendScreens:2.5,terrainColor:"#1a1a2e",grassColor:"#ff00ff",surfaceColor:"#16213e"}}],ke="hill-rush-selected-biome";function Pe(){if(typeof localStorage>"u")return null;try{const I=localStorage.getItem(ke);return I&&J.find(c=>c.id===I)?I:null}catch{return null}}function pe(I){if(!(typeof localStorage>"u"))try{localStorage.setItem(ke,I)}catch{}}function me(I){if(I){const e=J.find(c=>c.id===I);if(e)return e}return J.find(e=>e.id==="countryside")??J[0]}class tt{container;dataProvider;selectedId;cardContainer;backBtn;playBtn;constructor(e,c){this.dataProvider=c,this.selectedId=Pe()??"countryside";const p=document.getElementById(e.containerId);if(!(p instanceof HTMLElement))throw new Error(`[Hill Rush] #${e.containerId} element was not found.`);this.container=document.createElement("div"),this.container.className="hill-rush-track-selection",this.container.innerHTML=`
      <div class="hill-rush-track-modal">
        <div class="hill-rush-track-header">
          <h1 class="hill-rush-track-title">🗺️ SELECT TRACK</h1>
          <p class="hill-rush-track-desc">Pick your destination and master unique hill terrains</p>
        </div>
        <div class="hill-rush-track-grid" id="hr-track-cards"></div>
        <div class="hill-rush-track-footer">
          <button class="hill-rush-track-btn hill-rush-back-btn">← Back to Menu</button>
          <button class="hill-rush-track-btn hill-rush-play-btn">▶ Start Race</button>
        </div>
      </div>
    `,p.appendChild(this.container),this.cardContainer=this.container.querySelector("#hr-track-cards"),this.backBtn=this.container.querySelector(".hill-rush-back-btn"),this.playBtn=this.container.querySelector(".hill-rush-play-btn"),this.backBtn.addEventListener("click",()=>this.dataProvider.onBack()),this.playBtn.addEventListener("click",()=>{pe(this.selectedId),this.dataProvider.onPlay()}),this.renderCards(),this.injectStyles()}getSelectedBiomeId(){return this.selectedId}renderCards(){this.cardContainer.innerHTML="";const e={countryside:"🌲",desert:"🏜️",snow:"❄️",neon_city:"🌆"},c={countryside:"EASY • ROLLING HILLS",desert:"MEDIUM • STEEP DUNES",snow:"HARD • SLIPPERY SLOPES",neon_city:"EXPERT • JUMP RAMPS"};for(const p of J){const n=document.createElement("button"),t=p.id===this.selectedId;n.className=`hill-rush-track-card ${t?"selected":""} ${p.locked?"locked":""}`,n.innerHTML=`
        <div class="track-card-preview" style="background: ${p.previewColor}">
          <span class="track-card-icon">${e[p.id]||"🏁"}</span>
        </div>
        <div class="track-card-content">
          <span class="track-card-diff">${c[p.id]||"NORMAL"}</span>
          <span class="track-card-name">${p.name}</span>
          <span class="track-card-info">${p.description}</span>
        </div>
        ${p.locked?'<span class="track-locked-badge">🔒 LOCKED</span>':""}
      `,p.locked||n.addEventListener("click",()=>{this.selectedId=p.id,pe(this.selectedId),this.renderCards()}),this.cardContainer.appendChild(n)}}show(){this.container.style.display="",this.renderCards()}hide(){this.container.style.display="none"}destroy(){this.container.parentElement&&this.container.parentElement.removeChild(this.container)}injectStyles(){if(document.getElementById("hill-rush-track-selection-styles"))return;const e=document.createElement("style");e.id="hill-rush-track-selection-styles",e.textContent=`
      .hill-rush-track-selection {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(20, 25, 50, 0.7) 0%, rgba(5, 5, 15, 0.9) 100%);
        z-index: 200;
        font-family: "Segoe UI", -apple-system, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .hill-rush-track-modal {
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding: 36px;
        background: rgba(18, 24, 44, 0.9);
        backdrop-filter: blur(20px);
        border: 2px solid rgba(255, 255, 255, 0.15);
        border-radius: 24px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
        max-width: 780px;
        width: 92%;
        box-sizing: border-box;
      }
      .hill-rush-track-header {
        text-align: center;
      }
      .hill-rush-track-title {
        font-size: 32px;
        font-weight: 900;
        color: #ffffff;
        margin: 0;
      }
      .hill-rush-track-desc {
        font-size: 13px;
        color: #94a3b8;
        margin: 4px 0 0 0;
      }
      .hill-rush-track-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      .hill-rush-track-card {
        display: flex;
        gap: 14px;
        padding: 14px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 16px;
        cursor: pointer;
        transition: all 0.2s;
        text-align: left;
        position: relative;
        overflow: hidden;
      }
      .hill-rush-track-card:hover:not(.locked) {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
      }
      .hill-rush-track-card.selected {
        background: rgba(0, 210, 255, 0.15);
        border-color: #00d2ff;
        box-shadow: 0 0 20px rgba(0, 210, 255, 0.3);
      }
      .track-card-preview {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      .track-card-icon {
        font-size: 28px;
      }
      .track-card-content {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .track-card-diff {
        font-size: 9px;
        font-weight: 800;
        color: #00d2ff;
        letter-spacing: 1px;
      }
      .track-card-name {
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
      }
      .track-card-info {
        font-size: 11px;
        color: #94a3b8;
      }
      .hill-rush-track-footer {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 16px;
      }
      .hill-rush-track-btn {
        padding: 12px 24px;
        font-size: 15px;
        font-weight: 800;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .hill-rush-back-btn {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #cbd5e1;
      }
      .hill-rush-back-btn:hover {
        background: rgba(255, 255, 255, 0.15);
        color: #ffffff;
      }
      .hill-rush-play-btn {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        border: 1px solid #34d399;
        color: #ffffff;
        box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
      }
      .hill-rush-play-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(16, 185, 129, 0.6);
      }
    `,document.head.appendChild(e)}}class it{container;dataProvider;missionManager;listContainer;backBtn;headerCoinsEl;claimAllBtn;constructor(e,c,p){this.dataProvider=c,this.missionManager=p;const n=document.getElementById(e.containerId);if(!(n instanceof HTMLElement))throw new Error(`[Hill Rush] #${e.containerId} element was not found.`);this.container=document.createElement("div"),this.container.className="hill-rush-missions",this.container.innerHTML=`
      <div class="hill-rush-missions-modal">
        <div class="hill-rush-missions-header">
          <div class="header-top-row">
            <h1 class="hill-rush-missions-title">🎯 RACING MISSIONS</h1>
            <div class="missions-bank-badge">
              <span class="bank-icon">🪙</span>
              <span class="bank-value" id="hr-missions-bank-coins">0</span>
            </div>
          </div>
          <p class="hill-rush-missions-desc">Complete challenges to claim instant coin rewards and unlock higher tier missions!</p>
          <div class="claim-all-container" style="display: none;">
            <button class="hill-rush-claim-all-btn" id="hr-claim-all-btn">
              🎁 CLAIM ALL REWARDS (+0 🪙)
            </button>
          </div>
        </div>
        <div class="hill-rush-missions-list" id="hr-missions-list"></div>
        <div class="hill-rush-missions-footer">
          <button class="hill-rush-missions-back-btn">← Back to Menu</button>
        </div>
      </div>
    `,n.appendChild(this.container),this.listContainer=this.container.querySelector("#hr-missions-list"),this.backBtn=this.container.querySelector(".hill-rush-missions-back-btn"),this.headerCoinsEl=this.container.querySelector("#hr-missions-bank-coins"),this.claimAllBtn=this.container.querySelector("#hr-claim-all-btn"),this.backBtn.addEventListener("click",()=>this.dataProvider.onBack()),this.claimAllBtn.addEventListener("click",()=>this.handleClaimAll()),this.renderMissions(),this.injectStyles()}show(){this.container.style.display="",this.renderMissions()}hide(){this.container.style.display="none"}destroy(){this.container.parentElement&&this.container.parentElement.removeChild(this.container)}handleClaim(e){const c=this.missionManager.claimMission(e);c.success&&(this.dataProvider.onClaim?.(c.reward,c.totalCoins),this.renderMissions(),this.showClaimAnimation(`+${c.reward} 🪙 CLAIMED!`))}handleClaimAll(){const e=this.missionManager.claimAll();e.claimedCount>0&&(this.dataProvider.onClaim?.(e.totalReward,e.newTotalCoins),this.renderMissions(),this.showClaimAnimation(`+${e.totalReward} 🪙 ALL REWARDS CLAIMED!`))}showClaimAnimation(e){const c=document.createElement("div");c.className="missions-claim-toast",c.textContent=e,this.container.appendChild(c),setTimeout(()=>{c.classList.add("fade-out"),setTimeout(()=>c.remove(),400)},1800)}renderMissions(){this.listContainer.innerHTML="",this.headerCoinsEl.textContent=Math.floor(this.dataProvider.getCoinCount()).toLocaleString();const e=this.missionManager.getActiveMissions();let c=0,p=0;for(const t of e){const s=this.missionManager.isCompleted(t.category),r=this.missionManager.getProgress(t.category),a=Math.min(100,Math.round(r/t.target*100));s&&(c+=t.reward,p++);const u=document.createElement("div");if(u.className=`hill-rush-mission-item ${s?"ready-to-claim":""}`,u.innerHTML=`
        <div class="mission-icon-box">
          ${s?"🎁":t.icon}
        </div>
        <div class="hill-rush-mission-info">
          <div class="mission-title-row">
            <span class="hill-rush-mission-title">${t.title}</span>
            <span class="mission-tier-badge">TIER ${t.tier}</span>
          </div>
          <div class="hill-rush-mission-desc">${t.description}</div>
          <div class="hill-rush-mission-progress">
            <div class="hill-rush-progress-bar">
              <div class="hill-rush-progress-fill ${s?"fill-complete":""}" style="width: ${a}%"></div>
            </div>
            <span class="hill-rush-progress-text">${Math.floor(r).toLocaleString()} / ${t.target.toLocaleString()}</span>
          </div>
        </div>
        <div class="mission-action-box">
          ${s?`<button class="mission-claim-btn" data-category="${t.category}">
                  🎁 CLAIM +${t.reward} 🪙
                </button>`:`<div class="mission-reward-badge">
                  <span>🪙 +${t.reward}</span>
                </div>`}
        </div>
      `,s){const o=u.querySelector(".mission-claim-btn");o&&o.addEventListener("click",()=>this.handleClaim(t.category))}this.listContainer.appendChild(u)}const n=this.container.querySelector(".claim-all-container");n&&(p>1?(n.style.display="block",this.claimAllBtn.textContent=`🎁 CLAIM ALL REWARDS (+${c} 🪙)`):n.style.display="none")}injectStyles(){if(document.getElementById("hill-rush-missions-styles"))return;const e=document.createElement("style");e.id="hill-rush-missions-styles",e.textContent=`
      .hill-rush-missions {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(20, 25, 50, 0.75) 0%, rgba(5, 5, 15, 0.92) 100%);
        z-index: 200;
        font-family: "Segoe UI", -apple-system, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .hill-rush-missions-modal {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 28px;
        background: rgba(18, 24, 44, 0.92);
        backdrop-filter: blur(20px);
        border: 2px solid rgba(255, 255, 255, 0.15);
        border-radius: 24px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 210, 255, 0.15);
        max-width: 740px;
        width: 92%;
        max-height: 90vh;
        box-sizing: border-box;
      }
      .hill-rush-missions-header {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .header-top-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .hill-rush-missions-title {
        font-size: 26px;
        font-weight: 900;
        color: #ffffff;
        margin: 0;
      }
      .missions-bank-badge {
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(255, 215, 0, 0.15);
        border: 1px solid rgba(255, 215, 0, 0.3);
        padding: 6px 14px;
        border-radius: 20px;
        font-weight: 800;
        color: #ffd700;
        font-size: 15px;
      }
      .hill-rush-missions-desc {
        font-size: 13px;
        color: #94a3b8;
        margin: 0;
      }
      .claim-all-container {
        margin-top: 4px;
      }
      .hill-rush-claim-all-btn {
        width: 100%;
        padding: 12px;
        font-size: 15px;
        font-weight: 900;
        color: #ffffff;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        border: 2px solid #34d399;
        border-radius: 14px;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
        transition: all 0.2s ease;
        animation: claimPulse 1.2s infinite alternate;
      }
      .hill-rush-claim-all-btn:hover {
        transform: scale(1.02);
        box-shadow: 0 6px 25px rgba(16, 185, 129, 0.7);
      }
      @keyframes claimPulse {
        from { transform: scale(1); }
        to { transform: scale(1.02); }
      }
      .hill-rush-missions-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        overflow-y: auto;
        padding-right: 6px;
        max-height: 52vh;
      }
      .hill-rush-mission-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 14px 18px;
        background: rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        transition: all 0.2s;
      }
      .hill-rush-mission-item.ready-to-claim {
        border-color: #ffd700;
        background: rgba(255, 215, 0, 0.08);
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.15);
      }
      .mission-icon-box {
        font-size: 28px;
      }
      .hill-rush-mission-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .mission-title-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .hill-rush-mission-title {
        font-size: 15px;
        font-weight: 800;
        color: #ffffff;
      }
      .mission-tier-badge {
        font-size: 9px;
        font-weight: 800;
        color: #00d2ff;
        background: rgba(0, 210, 255, 0.15);
        border: 1px solid rgba(0, 210, 255, 0.3);
        padding: 2px 6px;
        border-radius: 6px;
        letter-spacing: 0.5px;
      }
      .hill-rush-mission-desc {
        font-size: 12px;
        color: #94a3b8;
      }
      .hill-rush-mission-progress {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 4px;
      }
      .hill-rush-progress-bar {
        flex: 1;
        height: 8px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 4px;
        overflow: hidden;
      }
      .hill-rush-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #00d2ff, #00ff88);
        border-radius: 4px;
        transition: width 0.3s ease;
      }
      .hill-rush-progress-fill.fill-complete {
        background: linear-gradient(90deg, #ffd700, #ffaa00);
      }
      .hill-rush-progress-text {
        font-size: 11px;
        font-weight: 700;
        color: #cbd5e1;
        min-width: 80px;
        text-align: right;
      }
      .mission-action-box {
        display: flex;
        align-items: center;
      }
      .mission-reward-badge {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #cbd5e1;
        font-size: 13px;
        font-weight: 800;
        padding: 8px 14px;
        border-radius: 12px;
        white-space: nowrap;
      }
      .mission-claim-btn {
        background: linear-gradient(135deg, #ffd700 0%, #ff9900 100%);
        border: 2px solid #ffffff;
        color: #000000;
        font-size: 13px;
        font-weight: 900;
        padding: 8px 16px;
        border-radius: 12px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(255, 215, 0, 0.5);
        transition: all 0.2s ease;
        white-space: nowrap;
        animation: claimPulse 0.9s infinite alternate;
      }
      .mission-claim-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(255, 215, 0, 0.8);
      }
      .missions-claim-toast {
        position: absolute;
        top: 24px;
        background: rgba(16, 185, 129, 0.95);
        color: #ffffff;
        font-weight: 900;
        font-size: 18px;
        padding: 12px 24px;
        border-radius: 16px;
        border: 2px solid #ffffff;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
        animation: toastIn 0.3s ease;
        z-index: 300;
      }
      .missions-claim-toast.fade-out {
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.4s ease;
      }
      @keyframes toastIn {
        from { transform: translateY(-30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .hill-rush-missions-footer {
        display: flex;
        justify-content: flex-start;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 14px;
      }
      .hill-rush-missions-back-btn {
        padding: 10px 20px;
        font-size: 14px;
        font-weight: 700;
        color: #cbd5e1;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .hill-rush-missions-back-btn:hover {
        background: rgba(255, 255, 255, 0.15);
        color: #ffffff;
      }
    `,document.head.appendChild(e)}}class st{container;gasBtn;brakeBtn;jumpBtn;gasPressed=!1;brakePressed=!1;jumpPressed=!1;boundHandleTouchStart;boundHandleTouchEnd;boundHandleMouseDown;boundHandleMouseUp;boundHandleContextMenu;isTouchDevice;constructor(e,c){this.boundHandleTouchStart=this.handleTouchStart.bind(this),this.boundHandleTouchEnd=this.handleTouchEnd.bind(this),this.boundHandleMouseDown=this.handleMouseDown.bind(this),this.boundHandleMouseUp=this.handleMouseUp.bind(this),this.boundHandleContextMenu=t=>t.preventDefault(),this.isTouchDevice="ontouchstart"in window||navigator.maxTouchPoints>0;const p=document.getElementById(e.containerId);if(!(p instanceof HTMLElement))throw new Error(`[Hill Rush] #${e.containerId} element was not found.`);this.container=document.createElement("div"),this.container.className="hill-rush-touch-controls",this.container.innerHTML=`
      <div class="hill-rush-pedal-group">
        <button class="hill-rush-pedal hill-rush-pedal-brake" id="hr-touch-brake">
          <span class="pedal-icon">◀</span>
          <span class="pedal-label">BRAKE</span>
        </button>
        <button class="hill-rush-pedal hill-rush-pedal-jump" id="hr-touch-jump">
          <span class="pedal-icon">▲</span>
          <span class="pedal-label">JUMP</span>
        </button>
        <button class="hill-rush-pedal hill-rush-pedal-gas" id="hr-touch-gas">
          <span class="pedal-icon">▶</span>
          <span class="pedal-label">GAS</span>
        </button>
      </div>
    `,p.appendChild(this.container),this.gasBtn=this.container.querySelector("#hr-touch-gas"),this.brakeBtn=this.container.querySelector("#hr-touch-brake"),this.jumpBtn=this.container.querySelector("#hr-touch-jump");const n=t=>{t.addEventListener("touchstart",this.boundHandleTouchStart,{passive:!1}),t.addEventListener("touchend",this.boundHandleTouchEnd),t.addEventListener("touchcancel",this.boundHandleTouchEnd),t.addEventListener("mousedown",this.boundHandleMouseDown),t.addEventListener("mouseup",this.boundHandleMouseUp),t.addEventListener("mouseleave",this.boundHandleMouseUp),t.addEventListener("contextmenu",this.boundHandleContextMenu)};n(this.gasBtn),n(this.brakeBtn),n(this.jumpBtn),window.addEventListener("touchend",this.boundHandleTouchEnd),window.addEventListener("touchcancel",this.boundHandleTouchEnd),window.addEventListener("mouseup",this.boundHandleMouseUp),window.addEventListener("blur",()=>this.reset()),this.updateVisibility(),this.injectStyles()}isAccelerating(){return this.gasPressed}isBraking(){return this.brakePressed}isJumping(){return this.jumpPressed}reset(){this.gasPressed=!1,this.brakePressed=!1,this.jumpPressed=!1,this.gasBtn.classList.remove("active"),this.brakeBtn.classList.remove("active"),this.jumpBtn.classList.remove("active")}show(){this.isTouchDevice&&(this.container.style.display="flex")}hide(){this.container.style.display="none",this.reset()}destroy(){window.removeEventListener("touchend",this.boundHandleTouchEnd),window.removeEventListener("touchcancel",this.boundHandleTouchEnd),window.removeEventListener("mouseup",this.boundHandleMouseUp),this.container.parentElement&&this.container.parentElement.removeChild(this.container)}handleTouchStart(e){e.preventDefault();const c=e.currentTarget;c===this.gasBtn?(this.gasPressed=!0,this.gasBtn.classList.add("active")):c===this.brakeBtn?(this.brakePressed=!0,this.brakeBtn.classList.add("active")):c===this.jumpBtn&&(this.jumpPressed=!0,this.jumpBtn.classList.add("active"))}handleTouchEnd(e){const c=e.currentTarget;c===this.gasBtn?(this.gasPressed=!1,this.gasBtn.classList.remove("active")):c===this.brakeBtn?(this.brakePressed=!1,this.brakeBtn.classList.remove("active")):c===this.jumpBtn&&(this.jumpPressed=!1,this.jumpBtn.classList.remove("active"))}handleMouseDown(e){e.preventDefault();const c=e.currentTarget;c===this.gasBtn?(this.gasPressed=!0,this.gasBtn.classList.add("active")):c===this.brakeBtn?(this.brakePressed=!0,this.brakeBtn.classList.add("active")):c===this.jumpBtn&&(this.jumpPressed=!0,this.jumpBtn.classList.add("active"))}handleMouseUp(e){const c=e.currentTarget;c===this.gasBtn?(this.gasPressed=!1,this.gasBtn.classList.remove("active")):c===this.brakeBtn?(this.brakePressed=!1,this.brakeBtn.classList.remove("active")):c===this.jumpBtn&&(this.jumpPressed=!1,this.jumpBtn.classList.remove("active"))}updateVisibility(){this.isTouchDevice?this.container.style.display="flex":this.container.style.display="none"}injectStyles(){if(document.getElementById("hill-rush-touch-controls-styles"))return;const e=document.createElement("style");e.id="hill-rush-touch-controls-styles",e.textContent=`
      .hill-rush-touch-controls {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 120px;
        display: none;
        align-items: center;
        justify-content: space-between;
        padding: 16px 24px;
        box-sizing: border-box;
        pointer-events: none;
        z-index: 150;
      }
      .hill-rush-pedal-group {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
      .hill-rush-pedal {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        width: 120px;
        height: 80px;
        background: rgba(18, 24, 44, 0.75);
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.25);
        border-radius: 20px;
        pointer-events: auto;
        user-select: none;
        -webkit-user-select: none;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        transition: transform 0.1s, background-color 0.1s;
      }
      .hill-rush-pedal-brake {
        border-color: rgba(255, 68, 68, 0.4);
      }
      .hill-rush-pedal-jump {
        border-color: rgba(0, 210, 255, 0.4);
        width: 100px;
      }
      .hill-rush-pedal-gas {
        border-color: rgba(16, 185, 129, 0.4);
      }
      .hill-rush-pedal-brake.active {
        background: rgba(255, 68, 68, 0.4);
        border-color: #ff4444;
        transform: scale(0.95);
        box-shadow: 0 0 20px rgba(255, 68, 68, 0.6);
      }
      .hill-rush-pedal-jump.active {
        background: rgba(0, 210, 255, 0.4);
        border-color: #00d2ff;
        transform: scale(0.95);
        box-shadow: 0 0 20px rgba(0, 210, 255, 0.6);
      }
      .hill-rush-pedal-gas.active {
        background: rgba(16, 185, 129, 0.4);
        border-color: #10b981;
        transform: scale(0.95);
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.6);
      }
      .pedal-icon {
        font-size: 20px;
        color: #ffffff;
      }
      .pedal-label {
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 1.5px;
        color: #ffffff;
      }
    `,document.head.appendChild(e)}}const nt={distance:{icon:"🏎️",tiers:[{title:"Explorer I",description:"Drive 500 meters total",target:500,reward:50},{title:"Explorer II",description:"Drive 1,200 meters total",target:1200,reward:80},{title:"Road Master III",description:"Drive 2,500 meters total",target:2500,reward:140},{title:"Highway Legend IV",description:"Drive 5,000 meters total",target:5e3,reward:250},{title:"Endless Voyager V",description:"Drive 10,000 meters total",target:1e4,reward:500}]},coins:{icon:"🪙",tiers:[{title:"Coin Grabber I",description:"Collect 30 coins total",target:30,reward:40},{title:"Coin Hunter II",description:"Collect 80 coins total",target:80,reward:90},{title:"Treasure Seeker III",description:"Collect 180 coins total",target:180,reward:160},{title:"Gold Baron IV",description:"Collect 350 coins total",target:350,reward:280},{title:"Tycoon V",description:"Collect 750 coins total",target:750,reward:550}]},fuel:{icon:"⛽",tiers:[{title:"Fuel Saver I",description:"Collect 3 gas canisters",target:3,reward:35},{title:"Pit Stop Pro II",description:"Collect 8 gas canisters",target:8,reward:80},{title:"Tank Filler III",description:"Collect 18 gas canisters",target:18,reward:150},{title:"Fuel Maestro IV",description:"Collect 35 gas canisters",target:35,reward:260}]},score:{icon:"⭐",tiers:[{title:"Score Rookie I",description:"Reach a score of 2,000",target:2e3,reward:50},{title:"High Roller II",description:"Reach a score of 5,000",target:5e3,reward:100},{title:"Score Champion III",description:"Reach a score of 12,000",target:12e3,reward:200},{title:"Arcade God IV",description:"Reach a score of 30,000",target:3e4,reward:400}]},no_crash_distance:{icon:"🛡️",tiers:[{title:"Safe Driver I",description:"Drive 300m in one run without crashing",target:300,reward:60},{title:"Iron Wheels II",description:"Drive 700m in one run without crashing",target:700,reward:130},{title:"Survivor III",description:"Drive 1,500m in one run without crashing",target:1500,reward:250},{title:"Invincible IV",description:"Drive 3,000m in one run without crashing",target:3e3,reward:450}]},stunts:{icon:"🦘",tiers:[{title:"Acrobat I",description:"Perform 2 mid-air flips",target:2,reward:50},{title:"Daredevil II",description:"Perform 5 mid-air flips",target:5,reward:110},{title:"Stunt Master III",description:"Perform 12 mid-air flips",target:12,reward:220},{title:"Aerial Virtuoso IV",description:"Perform 25 mid-air flips",target:25,reward:400}]}},Z=["distance","coins","fuel","score","no_crash_distance","stunts"];function ve(I,e){const c=nt[I],p=c.tiers.length;if(e<p){const o=c.tiers[e];return{id:`${I}_tier_${e+1}`,category:I,tier:e+1,title:o.title,description:o.description,target:o.target,reward:o.reward,icon:c.icon}}const n=c.tiers[p-1],t=e-p+1,s=Math.pow(1.6,t),r=Math.pow(1.45,t),a=Math.round(n.target*s/100)*100,u=Math.round(n.reward*r/10)*10;return{id:`${I}_tier_${e+1}`,category:I,tier:e+1,title:`${I.toUpperCase()} MASTER Tier ${e+1}`,description:`Complete ${a.toLocaleString()} ${I} challenge`,target:a,reward:u,icon:c.icon}}const Te="hill-rush-missions-state-v3";function rt(){if(typeof localStorage>"u")return{categoryTiers:{},categoryProgress:{},claimedMissionIds:[]};try{const I=localStorage.getItem(Te);if(!I)return{categoryTiers:{},categoryProgress:{},claimedMissionIds:[]};const e=JSON.parse(I);return{categoryTiers:e.categoryTiers??{},categoryProgress:e.categoryProgress??{},claimedMissionIds:e.claimedMissionIds??[]}}catch{return{categoryTiers:{},categoryProgress:{},claimedMissionIds:[]}}}function at(I){if(!(typeof localStorage>"u"))try{localStorage.setItem(Te,JSON.stringify(I))}catch{}}class ot{categoryTiers=new Map;categoryProgress=new Map;claimedMissions=new Set;onMissionCompleted;onMissionClaimed;constructor(e={}){this.onMissionCompleted=e.onMissionCompleted,this.onMissionClaimed=e.onMissionClaimed;const c=rt();for(const p of c.claimedMissionIds)this.claimedMissions.add(p);for(const p of Z)this.categoryTiers.set(p,c.categoryTiers[p]??0),this.categoryProgress.set(p,c.categoryProgress[p]??0)}save(){const e={},c={};for(const[p,n]of this.categoryTiers)e[p]=n;for(const[p,n]of this.categoryProgress)c[p]=n;at({categoryTiers:e,categoryProgress:c,claimedMissionIds:Array.from(this.claimedMissions)})}getActiveMissions(){const e=[];for(const c of Z){const p=this.categoryTiers.get(c)??0;e.push(ve(c,p))}return e}getProgress(e){return this.categoryProgress.get(e)??0}isCompleted(e){const c=this.getCurrentMission(e);return this.getProgress(e)>=c.target}getCurrentMission(e){const c=this.categoryTiers.get(e)??0;return ve(e,c)}hasUnclaimed(){for(const e of Z)if(this.isCompleted(e))return!0;return!1}getUnclaimedCount(){let e=0;for(const c of Z)this.isCompleted(c)&&e++;return e}updateDistance(e){this.addProgress("distance",e,!1)}updateCoins(e){this.addProgress("coins",e,!1)}updateFuelPickups(e){this.addProgress("fuel",e,!0)}updateScore(e){this.addProgress("score",e,!1)}updateNoCrashDistance(e){this.addProgress("no_crash_distance",e,!1)}updateStunts(e){this.addProgress("stunts",e,!0)}onCrash(){this.isCompleted("no_crash_distance")||(this.categoryProgress.set("no_crash_distance",0),this.save())}addProgress(e,c,p){const n=this.getCurrentMission(e),t=this.categoryProgress.get(e)??0,s=p?t+c:Math.max(t,c),r=t>=n.target,a=s>=n.target;this.categoryProgress.set(e,s),this.save(),!r&&a&&this.onMissionCompleted?.(n,n.reward)}claimMission(e){const c=this.getCurrentMission(e);if(this.getProgress(e)<c.target)return{success:!1,reward:0,totalCoins:X()};const n=c.reward;this.claimedMissions.add(c.id);const s=X()+n;Q(s);const r=this.categoryTiers.get(e)??0;return this.categoryTiers.set(e,r+1),this.categoryProgress.set(e,0),this.save(),this.onMissionClaimed?.(c,n,s),{success:!0,reward:n,totalCoins:s}}claimAll(){let e=0,c=0;for(const p of Z)if(this.isCompleted(p)){const n=this.claimMission(p);n.success&&(e+=n.reward,c++)}return{totalReward:e,claimedCount:c,newTotalCoins:X()}}}const Ee="hill-rush-muted";function lt(){if(typeof localStorage>"u")return!1;try{return localStorage.getItem(Ee)==="true"}catch{return!1}}function ht(I){if(!(typeof localStorage>"u"))try{localStorage.setItem(Ee,I?"true":"false")}catch{}}class ct{ctx=null;muted;engineOsc=null;engineGain=null;engineFilter=null;enginePlaying=!1;musicPlaying=!1;musicTimer=null;onMuteChange;constructor(e={}){this.muted=lt(),this.onMuteChange=e.onMuteChange??(()=>{})}ensureContext(){if(this.ctx)return this.ctx.state==="suspended"&&this.ctx.resume(),this.ctx;try{const e=window.AudioContext||window.webkitAudioContext;return this.ctx=new e,this.ctx}catch{return null}}resume(){this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}setMuted(e){this.muted=e,ht(e),this.onMuteChange(e),e&&(this.stopEngine(),this.stopMusic())}isMuted(){return this.muted}startEngine(e=0){if(this.muted)return;const c=this.ensureContext();if(c)if(!this.enginePlaying||!this.engineOsc){this.stopEngine();const p=c.createOscillator(),n=c.createOscillator(),t=c.createGain(),s=c.createBiquadFilter();s.type="lowpass",s.frequency.value=250+e*500,s.Q.value=2,p.type="sawtooth",p.frequency.value=45+e*90,n.type="triangle",n.frequency.value=(45+e*90)*.5,t.gain.value=.05,p.connect(s),n.connect(s),s.connect(t),t.connect(c.destination),p.start(),n.start(),this.engineOsc=p,this.engineGain=t,this.engineFilter=s,this.enginePlaying=!0}else this.updateEngine(e)}updateEngine(e){if(!this.enginePlaying||!this.engineOsc||!this.engineFilter||!this.ctx)return;const c=45+Math.min(1.5,Math.max(0,e))*95;this.engineOsc.frequency.setTargetAtTime(c,this.ctx.currentTime,.05),this.engineFilter.frequency.setTargetAtTime(250+e*550,this.ctx.currentTime,.05)}stopEngine(){if(this.engineOsc){try{this.engineOsc.stop()}catch{}this.engineOsc.disconnect(),this.engineOsc=null}this.engineGain&&(this.engineGain.disconnect(),this.engineGain=null),this.engineFilter&&(this.engineFilter.disconnect(),this.engineFilter=null),this.enginePlaying=!1}startMusic(){if(this.muted||this.musicPlaying||!this.ensureContext())return;this.musicPlaying=!0;const c=[330,392,440,523,440,392,330,294,330,392,440,587,523,440,392,440];let p=0;const n=()=>{if(!this.musicPlaying||!this.ctx||this.muted)return;const t=c[p%c.length];this.playTone(t,.16,"sine",.02),p%2===0&&this.playTone(t*.25,.3,"triangle",.03),p++,this.musicTimer=setTimeout(n,220)};n()}stopMusic(){this.musicPlaying=!1,this.musicTimer&&(clearTimeout(this.musicTimer),this.musicTimer=null)}playCoin(){this.muted||(this.playTone(987,.08,"sine",.08),setTimeout(()=>this.playTone(1318,.12,"triangle",.09),50))}playFuel(){this.muted||(this.playTone(523,.06,"triangle",.08),setTimeout(()=>this.playTone(659,.06,"triangle",.08),50),setTimeout(()=>this.playTone(784,.08,"sine",.1),100),setTimeout(()=>this.playTone(1046,.15,"sine",.12),150))}playStunt(){this.muted||(this.playTone(587,.08,"sine",.1),setTimeout(()=>this.playTone(740,.08,"sine",.1),70),setTimeout(()=>this.playTone(880,.16,"triangle",.12),140))}playCrash(){this.muted||(this.playNoise(.4,.25),this.playTone(60,.4,"sawtooth",.2))}playJump(){this.muted||(this.playTone(280,.08,"triangle",.12),setTimeout(()=>this.playTone(440,.12,"sine",.12),40),setTimeout(()=>this.playTone(660,.16,"sine",.1),90))}playClick(){this.muted||this.playTone(1200,.03,"sine",.06)}playMissionComplete(){this.muted||(this.playTone(523,.1,"sine",.1),setTimeout(()=>this.playTone(659,.1,"sine",.1),100),setTimeout(()=>this.playTone(784,.12,"sine",.1),200),setTimeout(()=>this.playTone(1046,.25,"triangle",.15),300))}playTone(e,c,p,n){if(this.muted)return;const t=this.ensureContext();if(t)try{const s=t.createOscillator(),r=t.createGain();s.type=p,s.frequency.setValueAtTime(e,t.currentTime),r.gain.setValueAtTime(n,t.currentTime),r.gain.exponentialRampToValueAtTime(1e-4,t.currentTime+c),s.connect(r),r.connect(t.destination),s.start(t.currentTime),s.stop(t.currentTime+c)}catch{}}playNoise(e,c){if(this.muted)return;const p=this.ensureContext();if(p)try{const n=Math.floor(p.sampleRate*e),t=p.createBuffer(1,n,p.sampleRate),s=t.getChannelData(0);for(let o=0;o<n;o++)s[o]=Math.random()*2-1;const r=p.createBufferSource(),a=p.createGain(),u=p.createBiquadFilter();r.buffer=t,u.type="lowpass",u.frequency.setValueAtTime(450,p.currentTime),u.frequency.linearRampToValueAtTime(80,p.currentTime+e),a.gain.setValueAtTime(c,p.currentTime),a.gain.exponentialRampToValueAtTime(.001,p.currentTime+e),r.connect(u),u.connect(a),a.connect(p.destination),r.start(p.currentTime),r.stop(p.currentTime+e)}catch{}}destroy(){this.stopEngine(),this.stopMusic(),this.ctx&&(this.ctx.close(),this.ctx=null)}}class dt{clouds=[];constructor(){this.initClouds()}initClouds(){this.clouds=[];for(let e=0;e<12;e++)this.clouds.push({x:Math.random()*2400,y:40+Math.random()*160,size:25+Math.random()*35,speed:.15+Math.random()*.25})}render(e,c,p,n,t,s){const r=Math.max(100,c),a=Math.max(100,p);e.save(),this.renderSky(e,r,a,s),this.renderCelestial(e,r,a,n,s),this.renderAtmosphere(e,r,a,n,s),this.renderFarLayer(e,r,a,n,t,s),this.renderMidLayer(e,r,a,n,t,s),e.restore()}renderSky(e,c,p,n){const t=e.createLinearGradient(0,0,0,p);switch(n.id){case"desert":t.addColorStop(0,"#ff5e36"),t.addColorStop(.35,"#ffa834"),t.addColorStop(.7,"#f9d77e"),t.addColorStop(1,"#c29758");break;case"snow":t.addColorStop(0,"#4a709c"),t.addColorStop(.4,"#7faad4"),t.addColorStop(.8,"#cde2f5"),t.addColorStop(1,"#eef6fc");break;case"neon_city":t.addColorStop(0,"#080417"),t.addColorStop(.4,"#160b33"),t.addColorStop(.75,"#2c1254"),t.addColorStop(1,"#0f0826");break;case"countryside":default:t.addColorStop(0,"#1e88e5"),t.addColorStop(.4,"#42a5f5"),t.addColorStop(.75,"#90caf9"),t.addColorStop(1,"#e3f2fd");break}e.fillStyle=t,e.fillRect(0,0,c,p)}renderCelestial(e,c,p,n,t){const s=(c*.75-n*.02)%(c+200),r=s<-100?s+c+200:s,a=90;if(e.save(),t.id==="neon_city"){const u=e.createRadialGradient(r,a,10,r,a,90);u.addColorStop(0,"rgba(255, 0, 150, 0.9)"),u.addColorStop(.5,"rgba(0, 255, 255, 0.4)"),u.addColorStop(1,"rgba(0, 0, 0, 0)"),e.fillStyle=u,e.beginPath(),e.arc(r,a,90,0,Math.PI*2),e.fill(),e.fillStyle="#ff007f",e.beginPath(),e.arc(r,a,40,0,Math.PI*2),e.fill(),e.fillStyle="rgba(10, 5, 25, 0.85)";for(let o=a-40;o<=a+40;o+=8)e.fillRect(r-45,o,90,2)}else if(t.id==="snow"){const u=e.createRadialGradient(r,a,15,r,a,100);u.addColorStop(0,"rgba(255, 255, 255, 0.95)"),u.addColorStop(.3,"rgba(220, 240, 255, 0.5)"),u.addColorStop(1,"rgba(220, 240, 255, 0)"),e.fillStyle=u,e.beginPath(),e.arc(r,a,100,0,Math.PI*2),e.fill(),e.fillStyle="#ffffff",e.beginPath(),e.arc(r,a,32,0,Math.PI*2),e.fill()}else if(t.id==="desert"){const u=e.createRadialGradient(r,a,20,r,a,140);u.addColorStop(0,"rgba(255, 240, 180, 0.95)"),u.addColorStop(.4,"rgba(255, 140, 40, 0.5)"),u.addColorStop(1,"rgba(255, 80, 20, 0)"),e.fillStyle=u,e.beginPath(),e.arc(r,a,140,0,Math.PI*2),e.fill(),e.fillStyle="#fff8db",e.beginPath(),e.arc(r,a,44,0,Math.PI*2),e.fill()}else{const u=e.createRadialGradient(r,a,20,r,a,120);u.addColorStop(0,"rgba(255, 255, 210, 0.95)"),u.addColorStop(.35,"rgba(255, 215, 0, 0.45)"),u.addColorStop(1,"rgba(255, 215, 0, 0)"),e.fillStyle=u,e.beginPath(),e.arc(r,a,120,0,Math.PI*2),e.fill(),e.fillStyle="#fff375",e.beginPath(),e.arc(r,a,38,0,Math.PI*2),e.fill()}e.restore()}renderAtmosphere(e,c,p,n,t){if(t.id==="neon_city"){e.save();const s=42;for(let r=0;r<40;r++){const a=(r*137.5+s)*19%c,u=(r*93.7+s)*11%(p*.5),o=r%3===0?2:1;e.fillStyle=r%2===0?"rgba(0, 255, 255, 0.8)":"rgba(255, 0, 255, 0.8)",e.beginPath(),e.arc(a,u,o,0,Math.PI*2),e.fill()}e.restore();return}e.save();for(const s of this.clouds){s.x+=s.speed,s.x>c+2400&&(s.x=-200);const r=(s.x-n*.05)%(c+400),a=r<-200?r+c+400:r;this.drawCloud(e,a,s.y,s.size,t)}e.restore()}drawCloud(e,c,p,n,t){e.save(),t.id==="desert"?e.fillStyle="rgba(255, 235, 210, 0.4)":t.id==="snow"?e.fillStyle="rgba(235, 245, 255, 0.75)":e.fillStyle="rgba(255, 255, 255, 0.8)",e.beginPath(),e.arc(c,p,n*.6,0,Math.PI*2),e.arc(c+n*.45,p-n*.2,n*.7,0,Math.PI*2),e.arc(c+n*.95,p,n*.6,0,Math.PI*2),e.arc(c+n*.45,p+n*.1,n*.5,0,Math.PI*2),e.fill(),e.restore()}renderFarLayer(e,c,p,n,t,s){e.save();const r=p*.65,a=n*.08;if(s.id==="neon_city"){e.fillStyle="#120826";const u=80,o=Math.floor(a/u)-1,f=o+Math.ceil(c/u)+2;for(let h=o;h<=f;h++){const i=h*u-a,l=120+(Math.sin(h*12.3)+1)*.5*160;e.fillRect(i,r-l,u-4,l+300),e.fillStyle=h%3===0?"rgba(0, 255, 255, 0.3)":"rgba(255, 0, 180, 0.25)";for(let d=r-l+15;d<r-10;d+=18)for(let g=i+8;g<i+u-12;g+=16)(h+d+g)%2===0&&e.fillRect(g,d,8,10);e.fillStyle="#120826"}}else{let u="#6ca0dc";s.id==="desert"&&(u="#d48b52"),s.id==="snow"&&(u="#95b8d1"),e.fillStyle=u,e.beginPath(),e.moveTo(0,p);const o=60;for(let f=0;f<=c+o;f+=o){const h=f+a,i=r-120-Math.sin(h*.002)*90-Math.cos(h*.005)*45;e.lineTo(f,i)}if(e.lineTo(c,p),e.closePath(),e.fill(),s.id==="snow"||s.id==="countryside"){e.fillStyle="rgba(255, 255, 255, 0.6)",e.beginPath();for(let f=0;f<=c+o;f+=o){const h=f+a,i=r-120-Math.sin(h*.002)*90-Math.cos(h*.005)*45;i<r-160&&(e.lineTo(f,i),e.lineTo(f+o*.5,i+25),e.lineTo(f-o*.5,i+25))}e.fill()}}e.restore()}renderMidLayer(e,c,p,n,t,s){e.save();const r=p*.75,a=n*.2;if(s.id==="neon_city"){e.fillStyle="#1c0d3a";const u=60,o=Math.floor(a/u)-1,f=o+Math.ceil(c/u)+2;for(let h=o;h<=f;h++){const i=h*u-a,l=80+(Math.sin(h*7.7)+1)*.5*110;e.fillRect(i,r-l,u-2,l+300),e.strokeStyle=h%2===0?"#ff007f":"#00f0ff",e.lineWidth=2,e.strokeRect(i,r-l,u-2,4)}}else{let u="#4b8b3b";s.id==="desert"&&(u="#c27d42"),s.id==="snow"&&(u="#b8d5e5"),e.fillStyle=u,e.beginPath(),e.moveTo(0,p);const o=40;for(let f=0;f<=c+o;f+=o){const h=f+a,i=r-60-Math.sin(h*.004)*50-Math.cos(h*.01)*20;e.lineTo(f,i)}e.lineTo(c,p),e.closePath(),e.fill()}e.restore()}}class ut{particles=[];floatingTexts=[];emitTireDust(e,c,p="#d4b08c",n=2){for(let t=0;t<n;t++){const s=Math.PI+(Math.random()-.5)*.8,r=1+Math.random()*3;this.particles.push({x:e+(Math.random()-.5)*6,y:c+(Math.random()-.5)*4,vx:Math.cos(s)*r,vy:Math.sin(s)*r-.5,radius:3+Math.random()*4,color:p,alpha:.7,life:0,maxLife:20+Math.random()*15,decay:.035,shape:"circle"})}}emitCoinSparkle(e,c){const p=["#ffd700","#fff375","#ffffff","#ffaa00"];for(let n=0;n<16;n++){const t=Math.PI*2*n/16+(Math.random()-.5)*.2,s=2+Math.random()*4;this.particles.push({x:e,y:c,vx:Math.cos(t)*s,vy:Math.sin(t)*s-1,radius:2+Math.random()*3,color:p[Math.floor(Math.random()*p.length)],alpha:1,life:0,maxLife:25+Math.random()*10,decay:.04,shape:"spark"})}}emitFuelPickup(e,c){const p=["#00f0ff","#39ff14","#ffffff","#00aaff"];for(let n=0;n<20;n++){const t=Math.random()*Math.PI*2,s=2.5+Math.random()*4;this.particles.push({x:e,y:c,vx:Math.cos(t)*s,vy:Math.sin(t)*s-1.5,radius:3+Math.random()*3,color:p[Math.floor(Math.random()*p.length)],alpha:1,life:0,maxLife:30,decay:.035,shape:"circle"})}}emitCrashExplosion(e,c){const p=["#ff4400","#ffaa00","#ffff00","#333333","#666666"];for(let n=0;n<45;n++){const t=Math.random()*Math.PI*2,s=2+Math.random()*7;this.particles.push({x:e,y:c,vx:Math.cos(t)*s,vy:Math.sin(t)*s-2,radius:3+Math.random()*6,color:p[Math.floor(Math.random()*p.length)],alpha:1,life:0,maxLife:35+Math.random()*20,decay:.025,shape:Math.random()>.4?"circle":"square"})}}addFloatingText(e,c,p,n="#ffd700",t=20){this.floatingTexts.push({x:e,y:c,vy:-1.8,text:p,color:n,fontSize:t,alpha:1,life:0,maxLife:60})}update(){for(let e=this.particles.length-1;e>=0;e--){const c=this.particles[e];c.x+=c.vx,c.y+=c.vy,c.vy+=.08,c.alpha-=c.decay,c.life++,(c.alpha<=0||c.life>=c.maxLife)&&this.particles.splice(e,1)}for(let e=this.floatingTexts.length-1;e>=0;e--){const c=this.floatingTexts[e];c.y+=c.vy,c.life++,c.life>c.maxLife*.6&&(c.alpha-=1/(c.maxLife*.4)),(c.alpha<=0||c.life>=c.maxLife)&&this.floatingTexts.splice(e,1)}}render(e,c,p){e.save(),e.translate(-c,-p);for(const n of this.particles)e.save(),e.globalAlpha=Math.max(0,n.alpha),e.fillStyle=n.color,n.shape==="spark"?(e.beginPath(),e.arc(n.x,n.y,n.radius,0,Math.PI*2),e.fill(),e.strokeStyle=n.color,e.lineWidth=1,e.beginPath(),e.moveTo(n.x-n.radius*2,n.y),e.lineTo(n.x+n.radius*2,n.y),e.moveTo(n.x,n.y-n.radius*2),e.lineTo(n.x,n.y+n.radius*2),e.stroke()):n.shape==="square"?e.fillRect(n.x-n.radius,n.y-n.radius,n.radius*2,n.radius*2):(e.beginPath(),e.arc(n.x,n.y,n.radius,0,Math.PI*2),e.fill()),e.restore();for(const n of this.floatingTexts)e.save(),e.globalAlpha=Math.max(0,n.alpha),e.font=`900 ${n.fontSize}px "Segoe UI", sans-serif`,e.textAlign="center",e.textBaseline="middle",e.strokeStyle="rgba(0, 0, 0, 0.85)",e.lineWidth=4,e.strokeText(n.text,n.x,n.y),e.fillStyle=n.color,e.fillText(n.text,n.x,n.y),e.restore();e.restore()}clear(){this.particles=[],this.floatingTexts=[]}}const ft=3,ye=64,gt=.08,pt=260,mt=10,xe=1,vt=0,yt=240,xt=55,St=12,bt=50,Ct=900,wt=60,Mt=1,kt="hill-rush-best-score",Pt=350;class Tt{canvas;ctx;dpr;loop;state;displayWidth=0;displayHeight=0;physics;vehicle=null;terrain;input;camera;background;particles;coinManager=null;fuelManager=null;scoreTracker;coinCount=0;runCoins=0;lastRunCoins=0;hud=null;mainMenu=null;pauseMenu=null;garage=null;trackSelection=null;trackSelectionOpen=!1;garageOpen=!1;currentBiome;crashTime=0;crashed=!1;missionManager;missions=null;missionsOpen=!1;touchControls=null;soundManager;engineRunning=!1;terrainGeneratedForWidth=0;terrainGeneratedForHeight=0;onResize;onKeyDown;onCanvasClick;constructor(e){this.canvas=e;const c=e.getContext("2d");if(!c)throw new Error("[Hill Rush] Could not acquire a 2D rendering context from the canvas.");this.ctx=c,this.dpr=Math.max(1,window.devicePixelRatio||1),this.state=F.MENU,this.physics=new Fe,this.terrain=new Oe({extendScreens:ft}),this.input=new Ge,this.camera=new ze({followSpeed:gt,offsetX:pt}),this.background=new dt,this.particles=new ut,this.scoreTracker=new Xe({coinValue:xe,distanceWeight:Mt,bestDistanceKey:kt}),this.onResize=this.handleResize.bind(this),this.loop=new We(this.update,this.render),this.onKeyDown=this.handleKeyDown.bind(this),this.onCanvasClick=this.handleCanvasClick.bind(this),this.currentBiome=me(Pe()),this.terrain.setBiome(this.currentBiome),this.soundManager=new ct({onMuteChange:()=>{this.hud&&this.hud.update()}}),this.initMissions(),this.init(),this.spawnVehicle(),this.initCoins(),this.initFuels(),this.initHUD(),this.initMainMenu(),this.initPauseMenu(),this.initGarage(),this.initTrackSelection(),this.initTouchControls(),this.updateUIVisibility()}init(){this.physics.init(),this.handleResize(),this.setupHeadCollisionDetection(),window.addEventListener("resize",this.onResize),window.addEventListener("keydown",this.onKeyDown),this.canvas.addEventListener("click",this.onCanvasClick)}setupHeadCollisionDetection(){const e=this.physics.getEngine();e&&D.Events.on(e,"collisionStart",c=>{if(!(this.state!==F.PLAYING||this.crashed))for(const p of c.pairs){const n=p.bodyA.label==="driver_head",t=p.bodyB.label==="driver_head",s=p.bodyA.label==="ground",r=p.bodyB.label==="ground";if(n&&r||t&&s){this.vehicle&&this.vehicle.onHeadHit(),this.triggerCrash("DRIVER DOWN! 💥");break}}})}triggerCrash(e="CRASHED! 💥"){if(!this.crashed){if(this.crashed=!0,this.crashTime=0,this.lastRunCoins=this.runCoins,this.soundManager.stopEngine(),this.engineRunning=!1,this.soundManager.stopMusic(),this.soundManager.playCrash(),this.vehicle){const c=this.vehicle.getPosition();this.particles.emitCrashExplosion(c.x,c.y),this.particles.addFloatingText(c.x,c.y-45,e,"#ff3333",30),this.runCoins>0&&this.particles.addFloatingText(c.x,c.y-80,`+${this.runCoins} 🪙 LEVEL COINS SAVED!`,"#ffd700",24)}this.missionManager&&this.missionManager.onCrash()}}initCoins(){const e=this.physics.getWorld(),c=this.physics.getEngine();e===null||c===null||(this.coinManager=new Ne({coinRadius:mt,coinValue:xe,coinDensity:vt,coinSpacing:yt,aboveSurface:xt},e,this.terrain.getSegmentSize()),this.coinManager.spawnCoins(this.displayWidth,p=>this.terrain.surfaceYAt(p)),this.coinManager.setupCollisionDetection(c,p=>{const n=p.getValue();this.coinCount+=n,this.runCoins+=n,this.scoreTracker.addCoins(n),this.soundManager.playCoin(),this.particles.emitCoinSparkle(p.getX(),p.getY()),this.particles.addFloatingText(p.getX(),p.getY()-15,`+${n} 🪙`,"#ffd700",18),this.missionManager&&(this.missionManager.updateCoins(this.coinCount),this.missionManager.updateScore(this.scoreTracker.getScore()))}))}initFuels(){const e=this.physics.getWorld(),c=this.physics.getEngine();e===null||c===null||(this.fuelManager=new $e({fuelRadius:St,fuelAmount:bt,fuelSpacing:Ct,aboveSurface:wt},e,this.terrain.getSegmentSize()),this.fuelManager.spawnFuels(this.displayWidth,p=>this.terrain.surfaceYAt(p)),this.fuelManager.setupCollisionDetection(c,p=>{this.vehicle&&this.vehicle.addFuel(p.getAmount()),this.soundManager.playFuel(),this.particles.emitFuelPickup(p.getX(),p.getY()),this.particles.addFloatingText(p.getX(),p.getY()-20,"GAS FULL! ⛽","#00f0ff",22),this.missionManager&&this.missionManager.updateFuelPickups(1)}))}spawnVehicle(){const c=this.terrain.surfaceYAt(200),p=Je(this.garage?.getSelectedVehicleId()??null),n=_e(p.config),t=c-n.wheelRadius-n.height*.5-15;this.vehicle=new Ve({x:200,y:t,...n});const s=this.physics.getWorld();s!==null&&this.vehicle.addTo(s),this.scoreTracker.setStartPosition(200),this.camera.setImmediate(200,t)}initHUD(){this.hud=new je({containerId:"game-container"},{getRunCoins:()=>this.runCoins,getCoinCount:()=>this.coinCount,getDistance:()=>this.scoreTracker.getDistance(),getScore:()=>this.scoreTracker.getScore(),getBestScore:()=>this.scoreTracker.getBestScore(),getBestDistance:()=>this.scoreTracker.getBestDistance(),getFuelRatio:()=>this.getFuelRatio(),getSpeed:()=>this.vehicle?.getSpeed()??0,onPause:()=>{this.state===F.PLAYING?(this.setGameState(F.PAUSED),this.soundManager.stopEngine(),this.engineRunning=!1):this.state===F.PAUSED&&this.setGameState(F.PLAYING)},onMuteToggle:()=>{this.soundManager.setMuted(!this.soundManager.isMuted()),this.engineRunning=!1},isMuted:()=>this.soundManager.isMuted()})}initMainMenu(){this.mainMenu=new Ke({containerId:"game-container"},{getBestScore:()=>this.scoreTracker.getBestScore(),getBestDistance:()=>this.scoreTracker.getBestDistance(),onPlay:()=>{this.soundManager.playClick(),this.soundManager.resume(),this.setGameState(F.PLAYING),this.start()},onGarage:()=>{this.soundManager.playClick(),this.garageOpen=!0,this.updateUIVisibility()},onTrack:()=>{this.soundManager.playClick(),this.trackSelectionOpen=!0,this.updateUIVisibility()},onMissions:()=>{this.soundManager.playClick(),this.missionsOpen=!0,this.updateUIVisibility()}})}initGarage(){this.syncCoinsToStorage(),this.garage=new et({containerId:"game-container"},{onBack:()=>{this.soundManager.playClick(),this.syncCoinsToStorage(),this.garageOpen=!1,this.updateUIVisibility()},onPlay:()=>{this.soundManager.playClick(),this.syncCoinsFromStorage(),this.garageOpen=!1,this.resetRun(),this.setGameState(F.PLAYING),this.start()},onCoinCountChange:e=>{this.coinCount=e,Q(e)},getCoinCount:()=>this.coinCount}),this.garage.hide()}initTrackSelection(){this.trackSelection=new tt({containerId:"game-container"},{onBack:()=>{this.soundManager.playClick(),this.trackSelectionOpen=!1,this.updateUIVisibility()},onPlay:()=>{this.soundManager.playClick(),this.trackSelection&&(this.currentBiome=me(this.trackSelection.getSelectedBiomeId()),this.terrain.setBiome(this.currentBiome)),this.trackSelectionOpen=!1,this.resetRun(),this.setGameState(F.PLAYING),this.start()}}),this.trackSelection.hide()}initMissions(){this.missionManager=new ot({onMissionCompleted:(e,c)=>{this.soundManager.playMissionComplete(),this.particles.addFloatingText(this.vehicle?.getPosition().x??this.camera.getX()+300,(this.vehicle?.getPosition().y??300)-60,`🎯 ${e.title}! +${c} 🪙`,"#ffd700",26)},onMissionClaimed:(e,c,p)=>{this.coinCount=p,this.soundManager.playCoin(),this.soundManager.playMissionComplete(),this.hud&&this.hud.update()}}),this.missions=new it({containerId:"game-container"},{onBack:()=>{this.soundManager.playClick(),this.missionsOpen=!1,this.updateUIVisibility()},onClaim:(e,c)=>{this.coinCount=c,this.soundManager.playCoin(),this.soundManager.playMissionComplete(),this.hud&&this.hud.update()},getCoinCount:()=>X()},this.missionManager),this.missions.hide()}initTouchControls(){this.touchControls=new st({containerId:"game-container"},{isPlaying:()=>this.state===F.PLAYING}),this.touchControls.hide()}initPauseMenu(){this.pauseMenu=new qe({containerId:"game-container"},{onResume:()=>{this.soundManager.playClick(),this.setGameState(F.PLAYING)},onRestart:()=>{this.soundManager.playClick(),this.restart()},onMainMenu:()=>{this.soundManager.playClick(),this.soundManager.stopEngine(),this.soundManager.stopMusic(),this.engineRunning=!1,this.setGameState(F.MENU),this.resetRun()}}),this.pauseMenu.hide()}updateUIVisibility(){this.state===F.MENU?(this.hud&&this.hud.hide(),this.pauseMenu&&this.pauseMenu.hide(),this.touchControls&&this.touchControls.hide(),this.garageOpen?(this.garage&&this.garage.show(),this.mainMenu&&this.mainMenu.hide(),this.trackSelection&&this.trackSelection.hide(),this.missions&&this.missions.hide()):this.trackSelectionOpen?(this.trackSelection&&this.trackSelection.show(),this.mainMenu&&this.mainMenu.hide(),this.garage&&this.garage.hide(),this.missions&&this.missions.hide()):this.missionsOpen?(this.missions&&this.missions.show(),this.mainMenu&&this.mainMenu.hide(),this.garage&&this.garage.hide(),this.trackSelection&&this.trackSelection.hide()):(this.mainMenu&&this.mainMenu.show(),this.garage&&this.garage.hide(),this.trackSelection&&this.trackSelection.hide(),this.missions&&this.missions.hide())):this.state===F.PLAYING?(this.mainMenu&&this.mainMenu.hide(),this.garage&&this.garage.hide(),this.trackSelection&&this.trackSelection.hide(),this.missions&&this.missions.hide(),this.pauseMenu&&this.pauseMenu.hide(),this.hud&&(this.hud.show(),this.hud.update()),this.touchControls&&this.touchControls.show()):this.state===F.PAUSED?(this.mainMenu&&this.mainMenu.hide(),this.garage&&this.garage.hide(),this.trackSelection&&this.trackSelection.hide(),this.missions&&this.missions.hide(),this.hud&&this.hud.hide(),this.touchControls&&this.touchControls.hide(),this.pauseMenu&&this.pauseMenu.show()):this.state===F.GAME_OVER&&(this.mainMenu&&this.mainMenu.hide(),this.garage&&this.garage.hide(),this.trackSelection&&this.trackSelection.hide(),this.missions&&this.missions.hide(),this.hud&&this.hud.hide(),this.pauseMenu&&this.pauseMenu.hide(),this.touchControls&&this.touchControls.hide())}start(){this.loop.isRunning||this.loop.start()}stop(){if(this.loop.stop(),window.removeEventListener("resize",this.onResize),window.removeEventListener("keydown",this.onKeyDown),this.canvas.removeEventListener("click",this.onCanvasClick),this.terrain.destroy(),this.vehicle){const e=this.physics.getWorld();e!==null&&this.vehicle.removeFrom(e),this.vehicle.destroy(),this.vehicle=null}this.input.destroy(),this.camera.destroy(),this.particles.clear(),this.coinManager&&(this.coinManager.destroy(),this.coinManager=null),this.fuelManager&&(this.fuelManager.destroy(),this.fuelManager=null),this.hud&&(this.hud.destroy(),this.hud=null),this.mainMenu&&(this.mainMenu.destroy(),this.mainMenu=null),this.pauseMenu&&(this.pauseMenu.destroy(),this.pauseMenu=null),this.garage&&(this.garage.destroy(),this.garage=null),this.trackSelection&&(this.trackSelection.destroy(),this.trackSelection=null),this.missions&&(this.missions.destroy(),this.missions=null),this.touchControls&&(this.touchControls.destroy(),this.touchControls=null),this.soundManager&&this.soundManager.destroy(),this.scoreTracker.destroy(),this.physics.destroy()}setGameState(e){this.state=e,this.updateUIVisibility()}getGameState(){return this.state}getScore(){return this.scoreTracker.getScore()}getDistance(){return this.scoreTracker.getDistance()}getCoinCount(){return this.coinCount}getBestScore(){return this.scoreTracker.getBestScore()}getBestDistance(){return this.scoreTracker.getBestDistance()}getFuelRatio(){return this.vehicle?this.vehicle.getFuelRatio():1}syncCoinsToStorage(){if(this.runCoins>0){this.lastRunCoins=this.runCoins;const e=X();Q(e+this.runCoins),this.coinCount=X()}}syncCoinsFromStorage(){this.coinCount=X(),this.runCoins=0,this.lastRunCoins=0}resetRun(){this.crashed=!1,this.crashTime=0,this.garageOpen=!1,this.trackSelectionOpen=!1,this.missionsOpen=!1,this.syncCoinsToStorage(),this.runCoins=0,this.lastRunCoins=0,this.scoreTracker.reset(),this.particles.clear(),this.input.clear(),this.touchControls?.reset(),this.coinCount=X(),this.coinManager&&(this.coinManager.destroy(),this.coinManager=null),this.fuelManager&&(this.fuelManager.destroy(),this.fuelManager=null);const e=this.physics.getWorld();e!==null&&this.vehicle&&(this.vehicle.removeFrom(e),this.vehicle.destroy(),this.vehicle=null),this.spawnVehicle(),this.physics.getEngine()!==null&&e!==null&&(this.initCoins(),this.initFuels()),this.hud&&this.hud.destroy(),this.initHUD(),this.updateUIVisibility()}handleKeyDown(e){this.state===F.MENU&&e.code==="Enter"?(this.setGameState(F.PLAYING),this.start()):this.state===F.PAUSED&&e.code==="Enter"?this.setGameState(F.PLAYING):this.state===F.GAME_OVER&&(e.code==="Enter"||e.code==="Space")&&this.restart()}handleCanvasClick(e){if(this.state===F.GAME_OVER){const c=this.canvas.getBoundingClientRect(),p=e.clientX-c.left,n=e.clientY-c.top,t=this.displayWidth/2,s=this.displayHeight/2;p>=t-110&&p<=t+110&&n>=s+115&&n<=s+165?(this.soundManager.playClick(),this.restart()):p>=t-110&&p<=t+110&&n>=s+175&&n<=s+220&&(this.soundManager.playClick(),this.setGameState(F.MENU),this.resetRun())}}handleResize(){const e=this.canvas.getBoundingClientRect(),c=Math.round(e.width),p=Math.round(e.height),n=c>0?c:window.innerWidth,t=p>0?p:window.innerHeight;this.displayWidth=n,this.displayHeight=t;const s=Math.max(1,Math.round(n*this.dpr)),r=Math.max(1,Math.round(t*this.dpr));(this.canvas.width!==s||this.canvas.height!==r)&&(this.canvas.width=s,this.canvas.height=r),this.applyTransform();const a=Math.abs(n-this.terrainGeneratedForWidth)>ye,u=Math.abs(t-this.terrainGeneratedForHeight)>ye;(a||u)&&(this.terrainGeneratedForWidth=n,this.terrainGeneratedForHeight=t,this.regenerateTerrain())}regenerateTerrain(){this.physics.clear(),this.terrain.destroy(),this.terrain.generate(this.displayWidth,this.displayHeight);const e=this.terrain.createBodies();if(this.physics.add(e),this.coinManager&&(this.coinManager.destroy(),this.coinManager=null),this.initCoins(),this.fuelManager&&(this.fuelManager.destroy(),this.fuelManager=null),this.initFuels(),this.vehicle){const c=this.physics.getWorld();c!==null&&this.vehicle.addTo(c)}}updateTerrainChunks(){const e=this.terrain.update(0,this.camera.getX(),this.displayWidth);this.physics.getWorld()!==null&&(e.addedBodies.length>0&&this.physics.add(e.addedBodies),e.removedBodies.length>0&&this.physics.remove(e.removedBodies))}applyTransform(){this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0)}update=e=>{if(this.state===F.PLAYING){if(this.vehicle&&!this.crashed){const c=o=>this.terrain.surfaceYAt(o);this.vehicle.update(e,c);const p=this.vehicle.popStunts();for(const o of p){this.scoreTracker.addCoins(o.coins),this.coinCount+=o.coins,this.runCoins+=o.coins,this.soundManager.playStunt(),this.soundManager.playCoin();const f=this.vehicle.getPosition();this.particles.emitCoinSparkle(f.x,f.y),this.particles.addFloatingText(f.x,f.y-45,o.text,"#ffd700",26),this.missionManager&&(this.missionManager.updateCoins(this.coinCount),this.missionManager.updateScore(this.scoreTracker.getScore()),this.missionManager.updateStunts(1)),this.hud&&this.hud.update()}const n=this.input.isAccelerating()||this.touchControls?.isAccelerating(),t=this.input.isBraking()||this.touchControls?.isBraking(),s=this.input.isJumping()||this.touchControls?.isJumping(),r=this.vehicle.isOnGround(c);if(s&&r&&this.vehicle.jump()){this.soundManager.playJump();const f=this.vehicle.getPosition(),h=this.vehicle.getFrontWheel(),i=this.vehicle.getRearWheel();i&&this.particles.emitTireDust(i.position.x,i.position.y+10,this.terrain.getSurfaceColor(),4),h&&this.particles.emitTireDust(h.position.x,h.position.y+10,this.terrain.getSurfaceColor(),4),this.particles.addFloatingText(f.x,f.y-45,"HOP! 🦘","#00f0ff",24)}if(n){this.vehicle.accelerate(!0),r||this.vehicle.applyAirControl(1);const o=this.vehicle.getRearWheel();o&&r&&this.particles.emitTireDust(o.position.x,o.position.y+10,this.terrain.getSurfaceColor(),2)}if(t){this.vehicle.accelerate(!1),r||this.vehicle.applyAirControl(-1);const o=this.vehicle.getFrontWheel();o&&r&&this.particles.emitTireDust(o.position.x,o.position.y+10,this.terrain.getSurfaceColor(),1)}const a=this.vehicle.getSpeed(),u=a/15;n||t||a>1?(this.engineRunning?this.soundManager.updateEngine(u):(this.soundManager.startEngine(u),this.engineRunning=!0),this.soundManager.startMusic()):this.engineRunning&&a<.2?(this.soundManager.stopEngine(),this.engineRunning=!1):this.engineRunning&&this.soundManager.updateEngine(u)}if(this.physics.update(e),this.particles.update(),this.vehicle){const c=this.vehicle.getPosition(),p=this.vehicle.getSpeed();this.camera.follow(c.x,c.y,p),this.scoreTracker.updatePosition(c.x),this.missionManager&&(this.missionManager.updateDistance(this.scoreTracker.getDistance()),this.missionManager.updateScore(this.scoreTracker.getScore()),this.crashed||this.missionManager.updateNoCrashDistance(this.scoreTracker.getDistance()))}this.updateTerrainChunks(),this.coinManager&&this.coinManager.update(this.camera.getX(),this.displayWidth,c=>this.terrain.surfaceYAt(c)),this.fuelManager&&this.fuelManager.update(this.camera.getX(),this.displayWidth,c=>this.terrain.surfaceYAt(c)),this.vehicle&&this.vehicle.isCrashed()&&(this.crashed?(this.crashTime+=e*1e3,this.crashTime>=Pt&&(this.setGameState(F.GAME_OVER),this.syncCoinsToStorage())):this.triggerCrash(this.vehicle.isHeadHit()?"DRIVER DOWN! 💥":"CRASHED! 💥"))}else this.particles.update()};render=()=>{this.applyTransform(),this.ctx.clearRect(0,0,this.displayWidth,this.displayHeight);const e=this.camera.getX(),c=this.camera.getY();this.background.render(this.ctx,this.displayWidth,this.displayHeight,e,c,this.currentBiome),this.renderTerrain(),this.renderMilestones(),this.coinManager&&this.coinManager.render(this.ctx,e,c),this.fuelManager&&this.fuelManager.render(this.ctx,e,c),this.vehicle&&this.vehicle.render(this.ctx,e,c),this.particles.render(this.ctx,e,c),this.state===F.PLAYING&&this.hud?this.hud.update():this.state===F.GAME_OVER&&this.renderGameOver()};renderTerrain(){const e=this.terrain.getSurfacePoints();if(e.length===0)return;const c=this.terrain.getGroundY(),p=this.camera.getX(),n=this.camera.getY();this.ctx.save(),this.ctx.translate(-p,-n),this.ctx.beginPath(),this.ctx.moveTo(e[0].x,e[0].y);for(let r=1;r<e.length;r++)this.ctx.lineTo(e[r].x,e[r].y);this.ctx.lineTo(e[e.length-1].x,c),this.ctx.lineTo(e[0].x,c),this.ctx.closePath();const t=this.ctx.createLinearGradient(0,this.displayHeight*.4,0,this.displayHeight*1.5),s=this.terrain.getBiomeId();if(s==="desert"?(t.addColorStop(0,"#d49b58"),t.addColorStop(.3,"#ba7f3c"),t.addColorStop(1,"#593717")):s==="snow"?(t.addColorStop(0,"#e8f4fc"),t.addColorStop(.2,"#8faec7"),t.addColorStop(1,"#2b4357")):s==="neon_city"?(t.addColorStop(0,"#160d2b"),t.addColorStop(.4,"#0d071a"),t.addColorStop(1,"#030208")):(t.addColorStop(0,"#6b4a2e"),t.addColorStop(.35,"#523720"),t.addColorStop(1,"#24170d")),this.ctx.fillStyle=t,this.ctx.fill(),this.ctx.strokeStyle=this.terrain.getGrassColor(),this.ctx.lineWidth=10,this.ctx.lineCap="round",this.ctx.lineJoin="round",this.ctx.stroke(),this.ctx.strokeStyle=this.terrain.getSurfaceColor(),this.ctx.lineWidth=2.5,this.ctx.stroke(),s==="countryside"){this.ctx.fillStyle="#388e3c";for(let r=0;r<e.length;r+=3){const a=e[r];this.ctx.fillRect(a.x-2,a.y-12,3,8),this.ctx.fillRect(a.x+3,a.y-10,2,6)}}this.ctx.restore()}renderMilestones(){const e=this.camera.getX(),c=this.camera.getY(),p=e-100,n=e+this.displayWidth+100,t=100,s=t*10,r=200,a=Math.max(1,Math.floor((p-r)/s)),u=Math.ceil((n-r)/s);this.ctx.save(),this.ctx.translate(-e,-c);const o=["#ffd700","#00d2ff","#ff007f","#00ff88","#ff9900","#a855f7"];for(let f=a;f<=u;f++){const h=f*t,i=r+f*s,l=this.terrain.surfaceYAt(i),d=h%500===0,g=d?66:54;this.ctx.fillStyle="#ffffff",this.ctx.fillRect(i-2,l-g,4,g),this.ctx.fillStyle="#ffd700",this.ctx.beginPath(),this.ctx.arc(i,l-g,d?5.5:4,0,Math.PI*2),this.ctx.fill();const v=(f-1)%o.length;this.ctx.fillStyle=d?"#ffd700":o[v];const b=d?56:48,M=d?28:22;this.ctx.beginPath(),this.ctx.moveTo(i+2,l-g),this.ctx.lineTo(i+2+b,l-g+M/2),this.ctx.lineTo(i+2,l-g+M),this.ctx.closePath(),this.ctx.fill(),this.ctx.strokeStyle="rgba(255, 255, 255, 0.85)",this.ctx.lineWidth=1.5,this.ctx.stroke(),this.ctx.fillStyle=d?"#000000":"#ffffff",this.ctx.font=`bold ${d?12:11}px "Segoe UI", -apple-system, sans-serif`,this.ctx.fillText(`${h}m`,i+5,l-g+M/2+4)}this.ctx.restore()}renderGameOver(){if(this.state!==F.GAME_OVER)return;this.ctx.save(),this.ctx.fillStyle="rgba(5, 8, 20, 0.85)",this.ctx.fillRect(0,0,this.displayWidth,this.displayHeight);const e=this.displayWidth/2,c=this.displayHeight/2;this.ctx.fillStyle="rgba(18, 24, 44, 0.95)",this.ctx.strokeStyle="rgba(255, 255, 255, 0.2)",this.ctx.lineWidth=2,this.ctx.beginPath(),this.ctx.roundRect(e-240,c-220,480,460,24),this.ctx.fill(),this.ctx.stroke(),this.ctx.textAlign="center",this.ctx.textBaseline="middle",this.ctx.fillStyle="#ff4444",this.ctx.font='900 36px "Segoe UI", sans-serif',this.ctx.fillText("RACE OVER",e,c-170);const p=Math.floor(this.getScore()),n=Math.floor(this.getDistance()),t=Math.floor(this.getBestScore()),s=p>=t&&p>0,r=this.lastRunCoins>0?this.lastRunCoins:this.runCoins;s&&(this.ctx.fillStyle="#ffd700",this.ctx.font='bold 14px "Segoe UI", sans-serif',this.ctx.fillText("🌟 NEW RECORD! 🌟",e,c-130)),this.ctx.font='600 16px "Segoe UI", sans-serif',this.ctx.fillStyle="#94a3b8";const a=(u,o,f,h="#ffffff")=>{this.ctx.textAlign="left",this.ctx.fillStyle="#94a3b8",this.ctx.fillText(u,e-180,f),this.ctx.textAlign="right",this.ctx.fillStyle=h,this.ctx.font='bold 18px "Segoe UI", sans-serif',this.ctx.fillText(o,e+180,f),this.ctx.font='600 16px "Segoe UI", sans-serif'};a("Distance Traveled:",`${n.toLocaleString()}m`,c-85,"#00d2ff"),a("Level Coins Earned:",`+${r.toLocaleString()} 🪙`,c-50,"#ffd700"),a("Total Run Score:",`${p.toLocaleString()}`,c-15,"#ffffff"),a("All-Time Best Distance:",`${Math.floor(this.getBestDistance()).toLocaleString()}m`,c+20,"#94a3b8"),a("Total Coins Banked:",`${this.coinCount.toLocaleString()} 🪙`,c+55,"#38bdf8"),this.ctx.fillStyle="#10b981",this.ctx.beginPath(),this.ctx.roundRect(e-110,c+115,220,48,12),this.ctx.fill(),this.ctx.strokeStyle="#34d399",this.ctx.lineWidth=1.5,this.ctx.stroke(),this.ctx.textAlign="center",this.ctx.fillStyle="#ffffff",this.ctx.font='bold 18px "Segoe UI", sans-serif',this.ctx.fillText("🔄 RACE AGAIN",e,c+139),this.ctx.fillStyle="rgba(255, 255, 255, 0.08)",this.ctx.beginPath(),this.ctx.roundRect(e-110,c+175,220,42,10),this.ctx.fill(),this.ctx.strokeStyle="rgba(255, 255, 255, 0.15)",this.ctx.stroke(),this.ctx.fillStyle="#cbd5e1",this.ctx.font='bold 14px "Segoe UI", sans-serif',this.ctx.fillText("🏠 MAIN MENU",e,c+196),this.ctx.restore()}restart(){this.crashed=!1,this.crashTime=0,this.resetRun(),this.setGameState(F.PLAYING),this.start()}}typeof CanvasRenderingContext2D<"u"&&!CanvasRenderingContext2D.prototype.roundRect&&(CanvasRenderingContext2D.prototype.roundRect=function(I,e,c,p,n=0){const t=typeof n=="number"?n:(Array.isArray(n)?n[0]:0)||0,s=Math.min(t,Math.abs(c)/2,Math.abs(p)/2);return this.moveTo(I+s,e),this.arcTo(I+c,e,I+c,e+p,s),this.arcTo(I+c,e+p,I,e+p,s),this.arcTo(I,e+p,I,e,s),this.arcTo(I,e,I+c,e,s),this.closePath(),this});window.addEventListener("DOMContentLoaded",()=>{const I=document.getElementById("game-container");if(!(I instanceof HTMLElement))throw new Error("[Hill Rush] #game-container element was not found in the document.");const e=I.querySelector("#game-canvas");if(!(e instanceof HTMLCanvasElement))throw new Error("[Hill Rush] #game-canvas element was not found in the document.");try{new Tt(e).start()}catch(c){console.error("[Hill Rush Startup Error]:",c)}});
