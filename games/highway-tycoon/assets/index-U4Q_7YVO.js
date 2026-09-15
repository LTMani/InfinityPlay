var Rv=Object.defineProperty;var Pv=(n,e,t)=>e in n?Rv(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var Z=(n,e,t)=>Pv(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();function Lv(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var h0={exports:{}},rc={},f0={exports:{}},Ze={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var co=Symbol.for("react.element"),Nv=Symbol.for("react.portal"),Iv=Symbol.for("react.fragment"),Dv=Symbol.for("react.strict_mode"),Uv=Symbol.for("react.profiler"),Fv=Symbol.for("react.provider"),Ov=Symbol.for("react.context"),kv=Symbol.for("react.forward_ref"),Bv=Symbol.for("react.suspense"),zv=Symbol.for("react.memo"),Vv=Symbol.for("react.lazy"),qf=Symbol.iterator;function Hv(n){return n===null||typeof n!="object"?null:(n=qf&&n[qf]||n["@@iterator"],typeof n=="function"?n:null)}var p0={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},m0=Object.assign,g0={};function Zs(n,e,t){this.props=n,this.context=e,this.refs=g0,this.updater=t||p0}Zs.prototype.isReactComponent={};Zs.prototype.setState=function(n,e){if(typeof n!="object"&&typeof n!="function"&&n!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,n,e,"setState")};Zs.prototype.forceUpdate=function(n){this.updater.enqueueForceUpdate(this,n,"forceUpdate")};function x0(){}x0.prototype=Zs.prototype;function yh(n,e,t){this.props=n,this.context=e,this.refs=g0,this.updater=t||p0}var Sh=yh.prototype=new x0;Sh.constructor=yh;m0(Sh,Zs.prototype);Sh.isPureReactComponent=!0;var Kf=Array.isArray,v0=Object.prototype.hasOwnProperty,Mh={current:null},_0={key:!0,ref:!0,__self:!0,__source:!0};function y0(n,e,t){var i,r={},s=null,a=null;if(e!=null)for(i in e.ref!==void 0&&(a=e.ref),e.key!==void 0&&(s=""+e.key),e)v0.call(e,i)&&!_0.hasOwnProperty(i)&&(r[i]=e[i]);var o=arguments.length-2;if(o===1)r.children=t;else if(1<o){for(var l=Array(o),c=0;c<o;c++)l[c]=arguments[c+2];r.children=l}if(n&&n.defaultProps)for(i in o=n.defaultProps,o)r[i]===void 0&&(r[i]=o[i]);return{$$typeof:co,type:n,key:s,ref:a,props:r,_owner:Mh.current}}function Gv(n,e){return{$$typeof:co,type:n.type,key:e,ref:n.ref,props:n.props,_owner:n._owner}}function wh(n){return typeof n=="object"&&n!==null&&n.$$typeof===co}function Wv(n){var e={"=":"=0",":":"=2"};return"$"+n.replace(/[=:]/g,function(t){return e[t]})}var Zf=/\/+/g;function Tc(n,e){return typeof n=="object"&&n!==null&&n.key!=null?Wv(""+n.key):e.toString(36)}function al(n,e,t,i,r){var s=typeof n;(s==="undefined"||s==="boolean")&&(n=null);var a=!1;if(n===null)a=!0;else switch(s){case"string":case"number":a=!0;break;case"object":switch(n.$$typeof){case co:case Nv:a=!0}}if(a)return a=n,r=r(a),n=i===""?"."+Tc(a,0):i,Kf(r)?(t="",n!=null&&(t=n.replace(Zf,"$&/")+"/"),al(r,e,t,"",function(c){return c})):r!=null&&(wh(r)&&(r=Gv(r,t+(!r.key||a&&a.key===r.key?"":(""+r.key).replace(Zf,"$&/")+"/")+n)),e.push(r)),1;if(a=0,i=i===""?".":i+":",Kf(n))for(var o=0;o<n.length;o++){s=n[o];var l=i+Tc(s,o);a+=al(s,e,t,l,r)}else if(l=Hv(n),typeof l=="function")for(n=l.call(n),o=0;!(s=n.next()).done;)s=s.value,l=i+Tc(s,o++),a+=al(s,e,t,l,r);else if(s==="object")throw e=String(n),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return a}function vo(n,e,t){if(n==null)return n;var i=[],r=0;return al(n,i,"","",function(s){return e.call(t,s,r++)}),i}function jv(n){if(n._status===-1){var e=n._result;e=e(),e.then(function(t){(n._status===0||n._status===-1)&&(n._status=1,n._result=t)},function(t){(n._status===0||n._status===-1)&&(n._status=2,n._result=t)}),n._status===-1&&(n._status=0,n._result=e)}if(n._status===1)return n._result.default;throw n._result}var xn={current:null},ol={transition:null},Xv={ReactCurrentDispatcher:xn,ReactCurrentBatchConfig:ol,ReactCurrentOwner:Mh};function S0(){throw Error("act(...) is not supported in production builds of React.")}Ze.Children={map:vo,forEach:function(n,e,t){vo(n,function(){e.apply(this,arguments)},t)},count:function(n){var e=0;return vo(n,function(){e++}),e},toArray:function(n){return vo(n,function(e){return e})||[]},only:function(n){if(!wh(n))throw Error("React.Children.only expected to receive a single React element child.");return n}};Ze.Component=Zs;Ze.Fragment=Iv;Ze.Profiler=Uv;Ze.PureComponent=yh;Ze.StrictMode=Dv;Ze.Suspense=Bv;Ze.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Xv;Ze.act=S0;Ze.cloneElement=function(n,e,t){if(n==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+n+".");var i=m0({},n.props),r=n.key,s=n.ref,a=n._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,a=Mh.current),e.key!==void 0&&(r=""+e.key),n.type&&n.type.defaultProps)var o=n.type.defaultProps;for(l in e)v0.call(e,l)&&!_0.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&o!==void 0?o[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=t;else if(1<l){o=Array(l);for(var c=0;c<l;c++)o[c]=arguments[c+2];i.children=o}return{$$typeof:co,type:n.type,key:r,ref:s,props:i,_owner:a}};Ze.createContext=function(n){return n={$$typeof:Ov,_currentValue:n,_currentValue2:n,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},n.Provider={$$typeof:Fv,_context:n},n.Consumer=n};Ze.createElement=y0;Ze.createFactory=function(n){var e=y0.bind(null,n);return e.type=n,e};Ze.createRef=function(){return{current:null}};Ze.forwardRef=function(n){return{$$typeof:kv,render:n}};Ze.isValidElement=wh;Ze.lazy=function(n){return{$$typeof:Vv,_payload:{_status:-1,_result:n},_init:jv}};Ze.memo=function(n,e){return{$$typeof:zv,type:n,compare:e===void 0?null:e}};Ze.startTransition=function(n){var e=ol.transition;ol.transition={};try{n()}finally{ol.transition=e}};Ze.unstable_act=S0;Ze.useCallback=function(n,e){return xn.current.useCallback(n,e)};Ze.useContext=function(n){return xn.current.useContext(n)};Ze.useDebugValue=function(){};Ze.useDeferredValue=function(n){return xn.current.useDeferredValue(n)};Ze.useEffect=function(n,e){return xn.current.useEffect(n,e)};Ze.useId=function(){return xn.current.useId()};Ze.useImperativeHandle=function(n,e,t){return xn.current.useImperativeHandle(n,e,t)};Ze.useInsertionEffect=function(n,e){return xn.current.useInsertionEffect(n,e)};Ze.useLayoutEffect=function(n,e){return xn.current.useLayoutEffect(n,e)};Ze.useMemo=function(n,e){return xn.current.useMemo(n,e)};Ze.useReducer=function(n,e,t){return xn.current.useReducer(n,e,t)};Ze.useRef=function(n){return xn.current.useRef(n)};Ze.useState=function(n){return xn.current.useState(n)};Ze.useSyncExternalStore=function(n,e,t){return xn.current.useSyncExternalStore(n,e,t)};Ze.useTransition=function(){return xn.current.useTransition()};Ze.version="18.3.1";f0.exports=Ze;var at=f0.exports;const vr=Lv(at);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var $v=at,Yv=Symbol.for("react.element"),qv=Symbol.for("react.fragment"),Kv=Object.prototype.hasOwnProperty,Zv=$v.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Qv={key:!0,ref:!0,__self:!0,__source:!0};function M0(n,e,t){var i,r={},s=null,a=null;t!==void 0&&(s=""+t),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(a=e.ref);for(i in e)Kv.call(e,i)&&!Qv.hasOwnProperty(i)&&(r[i]=e[i]);if(n&&n.defaultProps)for(i in e=n.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:Yv,type:n,key:s,ref:a,props:r,_owner:Zv.current}}rc.Fragment=qv;rc.jsx=M0;rc.jsxs=M0;h0.exports=rc;var m=h0.exports,Fu={},w0={exports:{}},Un={},E0={exports:{}},T0={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(n){function e(H,B){var j=H.length;H.push(B);e:for(;0<j;){var J=j-1>>>1,_e=H[J];if(0<r(_e,B))H[J]=B,H[j]=_e,j=J;else break e}}function t(H){return H.length===0?null:H[0]}function i(H){if(H.length===0)return null;var B=H[0],j=H.pop();if(j!==B){H[0]=j;e:for(var J=0,_e=H.length,Ae=_e>>>1;J<Ae;){var tt=2*(J+1)-1,je=H[tt],We=tt+1,K=H[We];if(0>r(je,j))We<_e&&0>r(K,je)?(H[J]=K,H[We]=j,J=We):(H[J]=je,H[tt]=j,J=tt);else if(We<_e&&0>r(K,j))H[J]=K,H[We]=j,J=We;else break e}}return B}function r(H,B){var j=H.sortIndex-B.sortIndex;return j!==0?j:H.id-B.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;n.unstable_now=function(){return s.now()}}else{var a=Date,o=a.now();n.unstable_now=function(){return a.now()-o}}var l=[],c=[],h=1,u=null,d=3,p=!1,g=!1,M=!1,x=typeof setTimeout=="function"?setTimeout:null,f=typeof clearTimeout=="function"?clearTimeout:null,v=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function E(H){for(var B=t(c);B!==null;){if(B.callback===null)i(c);else if(B.startTime<=H)i(c),B.sortIndex=B.expirationTime,e(l,B);else break;B=t(c)}}function S(H){if(M=!1,E(H),!g)if(t(l)!==null)g=!0,q(T);else{var B=t(c);B!==null&&$(S,B.startTime-H)}}function T(H,B){g=!1,M&&(M=!1,f(_),_=-1),p=!0;var j=d;try{for(E(B),u=t(l);u!==null&&(!(u.expirationTime>B)||H&&!I());){var J=u.callback;if(typeof J=="function"){u.callback=null,d=u.priorityLevel;var _e=J(u.expirationTime<=B);B=n.unstable_now(),typeof _e=="function"?u.callback=_e:u===t(l)&&i(l),E(B)}else i(l);u=t(l)}if(u!==null)var Ae=!0;else{var tt=t(c);tt!==null&&$(S,tt.startTime-B),Ae=!1}return Ae}finally{u=null,d=j,p=!1}}var b=!1,C=null,_=-1,A=5,L=-1;function I(){return!(n.unstable_now()-L<A)}function N(){if(C!==null){var H=n.unstable_now();L=H;var B=!0;try{B=C(!0,H)}finally{B?k():(b=!1,C=null)}}else b=!1}var k;if(typeof v=="function")k=function(){v(N)};else if(typeof MessageChannel<"u"){var D=new MessageChannel,V=D.port2;D.port1.onmessage=N,k=function(){V.postMessage(null)}}else k=function(){x(N,0)};function q(H){C=H,b||(b=!0,k())}function $(H,B){_=x(function(){H(n.unstable_now())},B)}n.unstable_IdlePriority=5,n.unstable_ImmediatePriority=1,n.unstable_LowPriority=4,n.unstable_NormalPriority=3,n.unstable_Profiling=null,n.unstable_UserBlockingPriority=2,n.unstable_cancelCallback=function(H){H.callback=null},n.unstable_continueExecution=function(){g||p||(g=!0,q(T))},n.unstable_forceFrameRate=function(H){0>H||125<H?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):A=0<H?Math.floor(1e3/H):5},n.unstable_getCurrentPriorityLevel=function(){return d},n.unstable_getFirstCallbackNode=function(){return t(l)},n.unstable_next=function(H){switch(d){case 1:case 2:case 3:var B=3;break;default:B=d}var j=d;d=B;try{return H()}finally{d=j}},n.unstable_pauseExecution=function(){},n.unstable_requestPaint=function(){},n.unstable_runWithPriority=function(H,B){switch(H){case 1:case 2:case 3:case 4:case 5:break;default:H=3}var j=d;d=H;try{return B()}finally{d=j}},n.unstable_scheduleCallback=function(H,B,j){var J=n.unstable_now();switch(typeof j=="object"&&j!==null?(j=j.delay,j=typeof j=="number"&&0<j?J+j:J):j=J,H){case 1:var _e=-1;break;case 2:_e=250;break;case 5:_e=1073741823;break;case 4:_e=1e4;break;default:_e=5e3}return _e=j+_e,H={id:h++,callback:B,priorityLevel:H,startTime:j,expirationTime:_e,sortIndex:-1},j>J?(H.sortIndex=j,e(c,H),t(l)===null&&H===t(c)&&(M?(f(_),_=-1):M=!0,$(S,j-J))):(H.sortIndex=_e,e(l,H),g||p||(g=!0,q(T))),H},n.unstable_shouldYield=I,n.unstable_wrapCallback=function(H){var B=d;return function(){var j=d;d=B;try{return H.apply(this,arguments)}finally{d=j}}}})(T0);E0.exports=T0;var Jv=E0.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var e_=at,Dn=Jv;function ae(n){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+n,t=1;t<arguments.length;t++)e+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+n+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var b0=new Set,Ba={};function Kr(n,e){Hs(n,e),Hs(n+"Capture",e)}function Hs(n,e){for(Ba[n]=e,n=0;n<e.length;n++)b0.add(e[n])}var Hi=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Ou=Object.prototype.hasOwnProperty,t_=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Qf={},Jf={};function n_(n){return Ou.call(Jf,n)?!0:Ou.call(Qf,n)?!1:t_.test(n)?Jf[n]=!0:(Qf[n]=!0,!1)}function i_(n,e,t,i){if(t!==null&&t.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:t!==null?!t.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function r_(n,e,t,i){if(e===null||typeof e>"u"||i_(n,e,t,i))return!0;if(i)return!1;if(t!==null)switch(t.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function vn(n,e,t,i,r,s,a){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=t,this.propertyName=n,this.type=e,this.sanitizeURL=s,this.removeEmptyString=a}var en={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){en[n]=new vn(n,0,!1,n,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var e=n[0];en[e]=new vn(e,1,!1,n[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(n){en[n]=new vn(n,2,!1,n.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){en[n]=new vn(n,2,!1,n,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){en[n]=new vn(n,3,!1,n.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(n){en[n]=new vn(n,3,!0,n,null,!1,!1)});["capture","download"].forEach(function(n){en[n]=new vn(n,4,!1,n,null,!1,!1)});["cols","rows","size","span"].forEach(function(n){en[n]=new vn(n,6,!1,n,null,!1,!1)});["rowSpan","start"].forEach(function(n){en[n]=new vn(n,5,!1,n.toLowerCase(),null,!1,!1)});var Eh=/[\-:]([a-z])/g;function Th(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var e=n.replace(Eh,Th);en[e]=new vn(e,1,!1,n,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var e=n.replace(Eh,Th);en[e]=new vn(e,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(n){var e=n.replace(Eh,Th);en[e]=new vn(e,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(n){en[n]=new vn(n,1,!1,n.toLowerCase(),null,!1,!1)});en.xlinkHref=new vn("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(n){en[n]=new vn(n,1,!1,n.toLowerCase(),null,!0,!0)});function bh(n,e,t,i){var r=en.hasOwnProperty(e)?en[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(r_(e,t,r,i)&&(t=null),i||r===null?n_(e)&&(t===null?n.removeAttribute(e):n.setAttribute(e,""+t)):r.mustUseProperty?n[r.propertyName]=t===null?r.type===3?!1:"":t:(e=r.attributeName,i=r.attributeNamespace,t===null?n.removeAttribute(e):(r=r.type,t=r===3||r===4&&t===!0?"":""+t,i?n.setAttributeNS(i,e,t):n.setAttribute(e,t))))}var $i=e_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,_o=Symbol.for("react.element"),ys=Symbol.for("react.portal"),Ss=Symbol.for("react.fragment"),Ch=Symbol.for("react.strict_mode"),ku=Symbol.for("react.profiler"),C0=Symbol.for("react.provider"),A0=Symbol.for("react.context"),Ah=Symbol.for("react.forward_ref"),Bu=Symbol.for("react.suspense"),zu=Symbol.for("react.suspense_list"),Rh=Symbol.for("react.memo"),ir=Symbol.for("react.lazy"),R0=Symbol.for("react.offscreen"),ep=Symbol.iterator;function ia(n){return n===null||typeof n!="object"?null:(n=ep&&n[ep]||n["@@iterator"],typeof n=="function"?n:null)}var Pt=Object.assign,bc;function ya(n){if(bc===void 0)try{throw Error()}catch(t){var e=t.stack.trim().match(/\n( *(at )?)/);bc=e&&e[1]||""}return`
`+bc+n}var Cc=!1;function Ac(n,e){if(!n||Cc)return"";Cc=!0;var t=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var i=c}Reflect.construct(n,[],e)}else{try{e.call()}catch(c){i=c}n.call(e.prototype)}else{try{throw Error()}catch(c){i=c}n()}}catch(c){if(c&&i&&typeof c.stack=="string"){for(var r=c.stack.split(`
`),s=i.stack.split(`
`),a=r.length-1,o=s.length-1;1<=a&&0<=o&&r[a]!==s[o];)o--;for(;1<=a&&0<=o;a--,o--)if(r[a]!==s[o]){if(a!==1||o!==1)do if(a--,o--,0>o||r[a]!==s[o]){var l=`
`+r[a].replace(" at new "," at ");return n.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",n.displayName)),l}while(1<=a&&0<=o);break}}}finally{Cc=!1,Error.prepareStackTrace=t}return(n=n?n.displayName||n.name:"")?ya(n):""}function s_(n){switch(n.tag){case 5:return ya(n.type);case 16:return ya("Lazy");case 13:return ya("Suspense");case 19:return ya("SuspenseList");case 0:case 2:case 15:return n=Ac(n.type,!1),n;case 11:return n=Ac(n.type.render,!1),n;case 1:return n=Ac(n.type,!0),n;default:return""}}function Vu(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case Ss:return"Fragment";case ys:return"Portal";case ku:return"Profiler";case Ch:return"StrictMode";case Bu:return"Suspense";case zu:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case A0:return(n.displayName||"Context")+".Consumer";case C0:return(n._context.displayName||"Context")+".Provider";case Ah:var e=n.render;return n=n.displayName,n||(n=e.displayName||e.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case Rh:return e=n.displayName||null,e!==null?e:Vu(n.type)||"Memo";case ir:e=n._payload,n=n._init;try{return Vu(n(e))}catch{}}return null}function a_(n){var e=n.type;switch(n.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=e.render,n=n.displayName||n.name||"",e.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Vu(e);case 8:return e===Ch?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function _r(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function P0(n){var e=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function o_(n){var e=P0(n)?"checked":"value",t=Object.getOwnPropertyDescriptor(n.constructor.prototype,e),i=""+n[e];if(!n.hasOwnProperty(e)&&typeof t<"u"&&typeof t.get=="function"&&typeof t.set=="function"){var r=t.get,s=t.set;return Object.defineProperty(n,e,{configurable:!0,get:function(){return r.call(this)},set:function(a){i=""+a,s.call(this,a)}}),Object.defineProperty(n,e,{enumerable:t.enumerable}),{getValue:function(){return i},setValue:function(a){i=""+a},stopTracking:function(){n._valueTracker=null,delete n[e]}}}}function yo(n){n._valueTracker||(n._valueTracker=o_(n))}function L0(n){if(!n)return!1;var e=n._valueTracker;if(!e)return!0;var t=e.getValue(),i="";return n&&(i=P0(n)?n.checked?"true":"false":n.value),n=i,n!==t?(e.setValue(n),!0):!1}function El(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function Hu(n,e){var t=e.checked;return Pt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:t??n._wrapperState.initialChecked})}function tp(n,e){var t=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;t=_r(e.value!=null?e.value:t),n._wrapperState={initialChecked:i,initialValue:t,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function N0(n,e){e=e.checked,e!=null&&bh(n,"checked",e,!1)}function Gu(n,e){N0(n,e);var t=_r(e.value),i=e.type;if(t!=null)i==="number"?(t===0&&n.value===""||n.value!=t)&&(n.value=""+t):n.value!==""+t&&(n.value=""+t);else if(i==="submit"||i==="reset"){n.removeAttribute("value");return}e.hasOwnProperty("value")?Wu(n,e.type,t):e.hasOwnProperty("defaultValue")&&Wu(n,e.type,_r(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(n.defaultChecked=!!e.defaultChecked)}function np(n,e,t){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+n._wrapperState.initialValue,t||e===n.value||(n.value=e),n.defaultValue=e}t=n.name,t!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,t!==""&&(n.name=t)}function Wu(n,e,t){(e!=="number"||El(n.ownerDocument)!==n)&&(t==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+t&&(n.defaultValue=""+t))}var Sa=Array.isArray;function Ds(n,e,t,i){if(n=n.options,e){e={};for(var r=0;r<t.length;r++)e["$"+t[r]]=!0;for(t=0;t<n.length;t++)r=e.hasOwnProperty("$"+n[t].value),n[t].selected!==r&&(n[t].selected=r),r&&i&&(n[t].defaultSelected=!0)}else{for(t=""+_r(t),e=null,r=0;r<n.length;r++){if(n[r].value===t){n[r].selected=!0,i&&(n[r].defaultSelected=!0);return}e!==null||n[r].disabled||(e=n[r])}e!==null&&(e.selected=!0)}}function ju(n,e){if(e.dangerouslySetInnerHTML!=null)throw Error(ae(91));return Pt({},e,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function ip(n,e){var t=e.value;if(t==null){if(t=e.children,e=e.defaultValue,t!=null){if(e!=null)throw Error(ae(92));if(Sa(t)){if(1<t.length)throw Error(ae(93));t=t[0]}e=t}e==null&&(e=""),t=e}n._wrapperState={initialValue:_r(t)}}function I0(n,e){var t=_r(e.value),i=_r(e.defaultValue);t!=null&&(t=""+t,t!==n.value&&(n.value=t),e.defaultValue==null&&n.defaultValue!==t&&(n.defaultValue=t)),i!=null&&(n.defaultValue=""+i)}function rp(n){var e=n.textContent;e===n._wrapperState.initialValue&&e!==""&&e!==null&&(n.value=e)}function D0(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Xu(n,e){return n==null||n==="http://www.w3.org/1999/xhtml"?D0(e):n==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var So,U0=function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,t,i,r){MSApp.execUnsafeLocalFunction(function(){return n(e,t,i,r)})}:n}(function(n,e){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=e;else{for(So=So||document.createElement("div"),So.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=So.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;e.firstChild;)n.appendChild(e.firstChild)}});function za(n,e){if(e){var t=n.firstChild;if(t&&t===n.lastChild&&t.nodeType===3){t.nodeValue=e;return}}n.textContent=e}var ba={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},l_=["Webkit","ms","Moz","O"];Object.keys(ba).forEach(function(n){l_.forEach(function(e){e=e+n.charAt(0).toUpperCase()+n.substring(1),ba[e]=ba[n]})});function F0(n,e,t){return e==null||typeof e=="boolean"||e===""?"":t||typeof e!="number"||e===0||ba.hasOwnProperty(n)&&ba[n]?(""+e).trim():e+"px"}function O0(n,e){n=n.style;for(var t in e)if(e.hasOwnProperty(t)){var i=t.indexOf("--")===0,r=F0(t,e[t],i);t==="float"&&(t="cssFloat"),i?n.setProperty(t,r):n[t]=r}}var c_=Pt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function $u(n,e){if(e){if(c_[n]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(ae(137,n));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(ae(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(ae(61))}if(e.style!=null&&typeof e.style!="object")throw Error(ae(62))}}function Yu(n,e){if(n.indexOf("-")===-1)return typeof e.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var qu=null;function Ph(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var Ku=null,Us=null,Fs=null;function sp(n){if(n=fo(n)){if(typeof Ku!="function")throw Error(ae(280));var e=n.stateNode;e&&(e=cc(e),Ku(n.stateNode,n.type,e))}}function k0(n){Us?Fs?Fs.push(n):Fs=[n]:Us=n}function B0(){if(Us){var n=Us,e=Fs;if(Fs=Us=null,sp(n),e)for(n=0;n<e.length;n++)sp(e[n])}}function z0(n,e){return n(e)}function V0(){}var Rc=!1;function H0(n,e,t){if(Rc)return n(e,t);Rc=!0;try{return z0(n,e,t)}finally{Rc=!1,(Us!==null||Fs!==null)&&(V0(),B0())}}function Va(n,e){var t=n.stateNode;if(t===null)return null;var i=cc(t);if(i===null)return null;t=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(n=n.type,i=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!i;break e;default:n=!1}if(n)return null;if(t&&typeof t!="function")throw Error(ae(231,e,typeof t));return t}var Zu=!1;if(Hi)try{var ra={};Object.defineProperty(ra,"passive",{get:function(){Zu=!0}}),window.addEventListener("test",ra,ra),window.removeEventListener("test",ra,ra)}catch{Zu=!1}function u_(n,e,t,i,r,s,a,o,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(t,c)}catch(h){this.onError(h)}}var Ca=!1,Tl=null,bl=!1,Qu=null,d_={onError:function(n){Ca=!0,Tl=n}};function h_(n,e,t,i,r,s,a,o,l){Ca=!1,Tl=null,u_.apply(d_,arguments)}function f_(n,e,t,i,r,s,a,o,l){if(h_.apply(this,arguments),Ca){if(Ca){var c=Tl;Ca=!1,Tl=null}else throw Error(ae(198));bl||(bl=!0,Qu=c)}}function Zr(n){var e=n,t=n;if(n.alternate)for(;e.return;)e=e.return;else{n=e;do e=n,e.flags&4098&&(t=e.return),n=e.return;while(n)}return e.tag===3?t:null}function G0(n){if(n.tag===13){var e=n.memoizedState;if(e===null&&(n=n.alternate,n!==null&&(e=n.memoizedState)),e!==null)return e.dehydrated}return null}function ap(n){if(Zr(n)!==n)throw Error(ae(188))}function p_(n){var e=n.alternate;if(!e){if(e=Zr(n),e===null)throw Error(ae(188));return e!==n?null:n}for(var t=n,i=e;;){var r=t.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){t=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===t)return ap(r),n;if(s===i)return ap(r),e;s=s.sibling}throw Error(ae(188))}if(t.return!==i.return)t=r,i=s;else{for(var a=!1,o=r.child;o;){if(o===t){a=!0,t=r,i=s;break}if(o===i){a=!0,i=r,t=s;break}o=o.sibling}if(!a){for(o=s.child;o;){if(o===t){a=!0,t=s,i=r;break}if(o===i){a=!0,i=s,t=r;break}o=o.sibling}if(!a)throw Error(ae(189))}}if(t.alternate!==i)throw Error(ae(190))}if(t.tag!==3)throw Error(ae(188));return t.stateNode.current===t?n:e}function W0(n){return n=p_(n),n!==null?j0(n):null}function j0(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var e=j0(n);if(e!==null)return e;n=n.sibling}return null}var X0=Dn.unstable_scheduleCallback,op=Dn.unstable_cancelCallback,m_=Dn.unstable_shouldYield,g_=Dn.unstable_requestPaint,Dt=Dn.unstable_now,x_=Dn.unstable_getCurrentPriorityLevel,Lh=Dn.unstable_ImmediatePriority,$0=Dn.unstable_UserBlockingPriority,Cl=Dn.unstable_NormalPriority,v_=Dn.unstable_LowPriority,Y0=Dn.unstable_IdlePriority,sc=null,yi=null;function __(n){if(yi&&typeof yi.onCommitFiberRoot=="function")try{yi.onCommitFiberRoot(sc,n,void 0,(n.current.flags&128)===128)}catch{}}var si=Math.clz32?Math.clz32:M_,y_=Math.log,S_=Math.LN2;function M_(n){return n>>>=0,n===0?32:31-(y_(n)/S_|0)|0}var Mo=64,wo=4194304;function Ma(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function Al(n,e){var t=n.pendingLanes;if(t===0)return 0;var i=0,r=n.suspendedLanes,s=n.pingedLanes,a=t&268435455;if(a!==0){var o=a&~r;o!==0?i=Ma(o):(s&=a,s!==0&&(i=Ma(s)))}else a=t&~r,a!==0?i=Ma(a):s!==0&&(i=Ma(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=t&16),e=n.entangledLanes,e!==0)for(n=n.entanglements,e&=i;0<e;)t=31-si(e),r=1<<t,i|=n[t],e&=~r;return i}function w_(n,e){switch(n){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function E_(n,e){for(var t=n.suspendedLanes,i=n.pingedLanes,r=n.expirationTimes,s=n.pendingLanes;0<s;){var a=31-si(s),o=1<<a,l=r[a];l===-1?(!(o&t)||o&i)&&(r[a]=w_(o,e)):l<=e&&(n.expiredLanes|=o),s&=~o}}function Ju(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function q0(){var n=Mo;return Mo<<=1,!(Mo&4194240)&&(Mo=64),n}function Pc(n){for(var e=[],t=0;31>t;t++)e.push(n);return e}function uo(n,e,t){n.pendingLanes|=e,e!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,e=31-si(e),n[e]=t}function T_(n,e){var t=n.pendingLanes&~e;n.pendingLanes=e,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=e,n.mutableReadLanes&=e,n.entangledLanes&=e,e=n.entanglements;var i=n.eventTimes;for(n=n.expirationTimes;0<t;){var r=31-si(t),s=1<<r;e[r]=0,i[r]=-1,n[r]=-1,t&=~s}}function Nh(n,e){var t=n.entangledLanes|=e;for(n=n.entanglements;t;){var i=31-si(t),r=1<<i;r&e|n[i]&e&&(n[i]|=e),t&=~r}}var ft=0;function K0(n){return n&=-n,1<n?4<n?n&268435455?16:536870912:4:1}var Z0,Ih,Q0,J0,eg,ed=!1,Eo=[],ur=null,dr=null,hr=null,Ha=new Map,Ga=new Map,sr=[],b_="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function lp(n,e){switch(n){case"focusin":case"focusout":ur=null;break;case"dragenter":case"dragleave":dr=null;break;case"mouseover":case"mouseout":hr=null;break;case"pointerover":case"pointerout":Ha.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ga.delete(e.pointerId)}}function sa(n,e,t,i,r,s){return n===null||n.nativeEvent!==s?(n={blockedOn:e,domEventName:t,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=fo(e),e!==null&&Ih(e)),n):(n.eventSystemFlags|=i,e=n.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),n)}function C_(n,e,t,i,r){switch(e){case"focusin":return ur=sa(ur,n,e,t,i,r),!0;case"dragenter":return dr=sa(dr,n,e,t,i,r),!0;case"mouseover":return hr=sa(hr,n,e,t,i,r),!0;case"pointerover":var s=r.pointerId;return Ha.set(s,sa(Ha.get(s)||null,n,e,t,i,r)),!0;case"gotpointercapture":return s=r.pointerId,Ga.set(s,sa(Ga.get(s)||null,n,e,t,i,r)),!0}return!1}function tg(n){var e=Dr(n.target);if(e!==null){var t=Zr(e);if(t!==null){if(e=t.tag,e===13){if(e=G0(t),e!==null){n.blockedOn=e,eg(n.priority,function(){Q0(t)});return}}else if(e===3&&t.stateNode.current.memoizedState.isDehydrated){n.blockedOn=t.tag===3?t.stateNode.containerInfo:null;return}}}n.blockedOn=null}function ll(n){if(n.blockedOn!==null)return!1;for(var e=n.targetContainers;0<e.length;){var t=td(n.domEventName,n.eventSystemFlags,e[0],n.nativeEvent);if(t===null){t=n.nativeEvent;var i=new t.constructor(t.type,t);qu=i,t.target.dispatchEvent(i),qu=null}else return e=fo(t),e!==null&&Ih(e),n.blockedOn=t,!1;e.shift()}return!0}function cp(n,e,t){ll(n)&&t.delete(e)}function A_(){ed=!1,ur!==null&&ll(ur)&&(ur=null),dr!==null&&ll(dr)&&(dr=null),hr!==null&&ll(hr)&&(hr=null),Ha.forEach(cp),Ga.forEach(cp)}function aa(n,e){n.blockedOn===e&&(n.blockedOn=null,ed||(ed=!0,Dn.unstable_scheduleCallback(Dn.unstable_NormalPriority,A_)))}function Wa(n){function e(r){return aa(r,n)}if(0<Eo.length){aa(Eo[0],n);for(var t=1;t<Eo.length;t++){var i=Eo[t];i.blockedOn===n&&(i.blockedOn=null)}}for(ur!==null&&aa(ur,n),dr!==null&&aa(dr,n),hr!==null&&aa(hr,n),Ha.forEach(e),Ga.forEach(e),t=0;t<sr.length;t++)i=sr[t],i.blockedOn===n&&(i.blockedOn=null);for(;0<sr.length&&(t=sr[0],t.blockedOn===null);)tg(t),t.blockedOn===null&&sr.shift()}var Os=$i.ReactCurrentBatchConfig,Rl=!0;function R_(n,e,t,i){var r=ft,s=Os.transition;Os.transition=null;try{ft=1,Dh(n,e,t,i)}finally{ft=r,Os.transition=s}}function P_(n,e,t,i){var r=ft,s=Os.transition;Os.transition=null;try{ft=4,Dh(n,e,t,i)}finally{ft=r,Os.transition=s}}function Dh(n,e,t,i){if(Rl){var r=td(n,e,t,i);if(r===null)zc(n,e,i,Pl,t),lp(n,i);else if(C_(r,n,e,t,i))i.stopPropagation();else if(lp(n,i),e&4&&-1<b_.indexOf(n)){for(;r!==null;){var s=fo(r);if(s!==null&&Z0(s),s=td(n,e,t,i),s===null&&zc(n,e,i,Pl,t),s===r)break;r=s}r!==null&&i.stopPropagation()}else zc(n,e,i,null,t)}}var Pl=null;function td(n,e,t,i){if(Pl=null,n=Ph(i),n=Dr(n),n!==null)if(e=Zr(n),e===null)n=null;else if(t=e.tag,t===13){if(n=G0(e),n!==null)return n;n=null}else if(t===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;n=null}else e!==n&&(n=null);return Pl=n,null}function ng(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(x_()){case Lh:return 1;case $0:return 4;case Cl:case v_:return 16;case Y0:return 536870912;default:return 16}default:return 16}}var lr=null,Uh=null,cl=null;function ig(){if(cl)return cl;var n,e=Uh,t=e.length,i,r="value"in lr?lr.value:lr.textContent,s=r.length;for(n=0;n<t&&e[n]===r[n];n++);var a=t-n;for(i=1;i<=a&&e[t-i]===r[s-i];i++);return cl=r.slice(n,1<i?1-i:void 0)}function ul(n){var e=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&e===13&&(n=13)):n=e,n===10&&(n=13),32<=n||n===13?n:0}function To(){return!0}function up(){return!1}function Fn(n){function e(t,i,r,s,a){this._reactName=t,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=a,this.currentTarget=null;for(var o in n)n.hasOwnProperty(o)&&(t=n[o],this[o]=t?t(s):s[o]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?To:up,this.isPropagationStopped=up,this}return Pt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var t=this.nativeEvent;t&&(t.preventDefault?t.preventDefault():typeof t.returnValue!="unknown"&&(t.returnValue=!1),this.isDefaultPrevented=To)},stopPropagation:function(){var t=this.nativeEvent;t&&(t.stopPropagation?t.stopPropagation():typeof t.cancelBubble!="unknown"&&(t.cancelBubble=!0),this.isPropagationStopped=To)},persist:function(){},isPersistent:To}),e}var Qs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Fh=Fn(Qs),ho=Pt({},Qs,{view:0,detail:0}),L_=Fn(ho),Lc,Nc,oa,ac=Pt({},ho,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Oh,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==oa&&(oa&&n.type==="mousemove"?(Lc=n.screenX-oa.screenX,Nc=n.screenY-oa.screenY):Nc=Lc=0,oa=n),Lc)},movementY:function(n){return"movementY"in n?n.movementY:Nc}}),dp=Fn(ac),N_=Pt({},ac,{dataTransfer:0}),I_=Fn(N_),D_=Pt({},ho,{relatedTarget:0}),Ic=Fn(D_),U_=Pt({},Qs,{animationName:0,elapsedTime:0,pseudoElement:0}),F_=Fn(U_),O_=Pt({},Qs,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),k_=Fn(O_),B_=Pt({},Qs,{data:0}),hp=Fn(B_),z_={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},V_={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},H_={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function G_(n){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(n):(n=H_[n])?!!e[n]:!1}function Oh(){return G_}var W_=Pt({},ho,{key:function(n){if(n.key){var e=z_[n.key]||n.key;if(e!=="Unidentified")return e}return n.type==="keypress"?(n=ul(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?V_[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Oh,charCode:function(n){return n.type==="keypress"?ul(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?ul(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),j_=Fn(W_),X_=Pt({},ac,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),fp=Fn(X_),$_=Pt({},ho,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Oh}),Y_=Fn($_),q_=Pt({},Qs,{propertyName:0,elapsedTime:0,pseudoElement:0}),K_=Fn(q_),Z_=Pt({},ac,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),Q_=Fn(Z_),J_=[9,13,27,32],kh=Hi&&"CompositionEvent"in window,Aa=null;Hi&&"documentMode"in document&&(Aa=document.documentMode);var ey=Hi&&"TextEvent"in window&&!Aa,rg=Hi&&(!kh||Aa&&8<Aa&&11>=Aa),pp=" ",mp=!1;function sg(n,e){switch(n){case"keyup":return J_.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function ag(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var Ms=!1;function ty(n,e){switch(n){case"compositionend":return ag(e);case"keypress":return e.which!==32?null:(mp=!0,pp);case"textInput":return n=e.data,n===pp&&mp?null:n;default:return null}}function ny(n,e){if(Ms)return n==="compositionend"||!kh&&sg(n,e)?(n=ig(),cl=Uh=lr=null,Ms=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return rg&&e.locale!=="ko"?null:e.data;default:return null}}var iy={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function gp(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e==="input"?!!iy[n.type]:e==="textarea"}function og(n,e,t,i){k0(i),e=Ll(e,"onChange"),0<e.length&&(t=new Fh("onChange","change",null,t,i),n.push({event:t,listeners:e}))}var Ra=null,ja=null;function ry(n){vg(n,0)}function oc(n){var e=Ts(n);if(L0(e))return n}function sy(n,e){if(n==="change")return e}var lg=!1;if(Hi){var Dc;if(Hi){var Uc="oninput"in document;if(!Uc){var xp=document.createElement("div");xp.setAttribute("oninput","return;"),Uc=typeof xp.oninput=="function"}Dc=Uc}else Dc=!1;lg=Dc&&(!document.documentMode||9<document.documentMode)}function vp(){Ra&&(Ra.detachEvent("onpropertychange",cg),ja=Ra=null)}function cg(n){if(n.propertyName==="value"&&oc(ja)){var e=[];og(e,ja,n,Ph(n)),H0(ry,e)}}function ay(n,e,t){n==="focusin"?(vp(),Ra=e,ja=t,Ra.attachEvent("onpropertychange",cg)):n==="focusout"&&vp()}function oy(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return oc(ja)}function ly(n,e){if(n==="click")return oc(e)}function cy(n,e){if(n==="input"||n==="change")return oc(e)}function uy(n,e){return n===e&&(n!==0||1/n===1/e)||n!==n&&e!==e}var li=typeof Object.is=="function"?Object.is:uy;function Xa(n,e){if(li(n,e))return!0;if(typeof n!="object"||n===null||typeof e!="object"||e===null)return!1;var t=Object.keys(n),i=Object.keys(e);if(t.length!==i.length)return!1;for(i=0;i<t.length;i++){var r=t[i];if(!Ou.call(e,r)||!li(n[r],e[r]))return!1}return!0}function _p(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function yp(n,e){var t=_p(n);n=0;for(var i;t;){if(t.nodeType===3){if(i=n+t.textContent.length,n<=e&&i>=e)return{node:t,offset:e-n};n=i}e:{for(;t;){if(t.nextSibling){t=t.nextSibling;break e}t=t.parentNode}t=void 0}t=_p(t)}}function ug(n,e){return n&&e?n===e?!0:n&&n.nodeType===3?!1:e&&e.nodeType===3?ug(n,e.parentNode):"contains"in n?n.contains(e):n.compareDocumentPosition?!!(n.compareDocumentPosition(e)&16):!1:!1}function dg(){for(var n=window,e=El();e instanceof n.HTMLIFrameElement;){try{var t=typeof e.contentWindow.location.href=="string"}catch{t=!1}if(t)n=e.contentWindow;else break;e=El(n.document)}return e}function Bh(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e&&(e==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||e==="textarea"||n.contentEditable==="true")}function dy(n){var e=dg(),t=n.focusedElem,i=n.selectionRange;if(e!==t&&t&&t.ownerDocument&&ug(t.ownerDocument.documentElement,t)){if(i!==null&&Bh(t)){if(e=i.start,n=i.end,n===void 0&&(n=e),"selectionStart"in t)t.selectionStart=e,t.selectionEnd=Math.min(n,t.value.length);else if(n=(e=t.ownerDocument||document)&&e.defaultView||window,n.getSelection){n=n.getSelection();var r=t.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!n.extend&&s>i&&(r=i,i=s,s=r),r=yp(t,s);var a=yp(t,i);r&&a&&(n.rangeCount!==1||n.anchorNode!==r.node||n.anchorOffset!==r.offset||n.focusNode!==a.node||n.focusOffset!==a.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),n.removeAllRanges(),s>i?(n.addRange(e),n.extend(a.node,a.offset)):(e.setEnd(a.node,a.offset),n.addRange(e)))}}for(e=[],n=t;n=n.parentNode;)n.nodeType===1&&e.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof t.focus=="function"&&t.focus(),t=0;t<e.length;t++)n=e[t],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var hy=Hi&&"documentMode"in document&&11>=document.documentMode,ws=null,nd=null,Pa=null,id=!1;function Sp(n,e,t){var i=t.window===t?t.document:t.nodeType===9?t:t.ownerDocument;id||ws==null||ws!==El(i)||(i=ws,"selectionStart"in i&&Bh(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),Pa&&Xa(Pa,i)||(Pa=i,i=Ll(nd,"onSelect"),0<i.length&&(e=new Fh("onSelect","select",null,e,t),n.push({event:e,listeners:i}),e.target=ws)))}function bo(n,e){var t={};return t[n.toLowerCase()]=e.toLowerCase(),t["Webkit"+n]="webkit"+e,t["Moz"+n]="moz"+e,t}var Es={animationend:bo("Animation","AnimationEnd"),animationiteration:bo("Animation","AnimationIteration"),animationstart:bo("Animation","AnimationStart"),transitionend:bo("Transition","TransitionEnd")},Fc={},hg={};Hi&&(hg=document.createElement("div").style,"AnimationEvent"in window||(delete Es.animationend.animation,delete Es.animationiteration.animation,delete Es.animationstart.animation),"TransitionEvent"in window||delete Es.transitionend.transition);function lc(n){if(Fc[n])return Fc[n];if(!Es[n])return n;var e=Es[n],t;for(t in e)if(e.hasOwnProperty(t)&&t in hg)return Fc[n]=e[t];return n}var fg=lc("animationend"),pg=lc("animationiteration"),mg=lc("animationstart"),gg=lc("transitionend"),xg=new Map,Mp="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Mr(n,e){xg.set(n,e),Kr(e,[n])}for(var Oc=0;Oc<Mp.length;Oc++){var kc=Mp[Oc],fy=kc.toLowerCase(),py=kc[0].toUpperCase()+kc.slice(1);Mr(fy,"on"+py)}Mr(fg,"onAnimationEnd");Mr(pg,"onAnimationIteration");Mr(mg,"onAnimationStart");Mr("dblclick","onDoubleClick");Mr("focusin","onFocus");Mr("focusout","onBlur");Mr(gg,"onTransitionEnd");Hs("onMouseEnter",["mouseout","mouseover"]);Hs("onMouseLeave",["mouseout","mouseover"]);Hs("onPointerEnter",["pointerout","pointerover"]);Hs("onPointerLeave",["pointerout","pointerover"]);Kr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Kr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Kr("onBeforeInput",["compositionend","keypress","textInput","paste"]);Kr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Kr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Kr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var wa="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),my=new Set("cancel close invalid load scroll toggle".split(" ").concat(wa));function wp(n,e,t){var i=n.type||"unknown-event";n.currentTarget=t,f_(i,e,void 0,n),n.currentTarget=null}function vg(n,e){e=(e&4)!==0;for(var t=0;t<n.length;t++){var i=n[t],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var a=i.length-1;0<=a;a--){var o=i[a],l=o.instance,c=o.currentTarget;if(o=o.listener,l!==s&&r.isPropagationStopped())break e;wp(r,o,c),s=l}else for(a=0;a<i.length;a++){if(o=i[a],l=o.instance,c=o.currentTarget,o=o.listener,l!==s&&r.isPropagationStopped())break e;wp(r,o,c),s=l}}}if(bl)throw n=Qu,bl=!1,Qu=null,n}function St(n,e){var t=e[ld];t===void 0&&(t=e[ld]=new Set);var i=n+"__bubble";t.has(i)||(_g(e,n,2,!1),t.add(i))}function Bc(n,e,t){var i=0;e&&(i|=4),_g(t,n,i,e)}var Co="_reactListening"+Math.random().toString(36).slice(2);function $a(n){if(!n[Co]){n[Co]=!0,b0.forEach(function(t){t!=="selectionchange"&&(my.has(t)||Bc(t,!1,n),Bc(t,!0,n))});var e=n.nodeType===9?n:n.ownerDocument;e===null||e[Co]||(e[Co]=!0,Bc("selectionchange",!1,e))}}function _g(n,e,t,i){switch(ng(e)){case 1:var r=R_;break;case 4:r=P_;break;default:r=Dh}t=r.bind(null,e,t,n),r=void 0,!Zu||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?n.addEventListener(e,t,{capture:!0,passive:r}):n.addEventListener(e,t,!0):r!==void 0?n.addEventListener(e,t,{passive:r}):n.addEventListener(e,t,!1)}function zc(n,e,t,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var a=i.tag;if(a===3||a===4){var o=i.stateNode.containerInfo;if(o===r||o.nodeType===8&&o.parentNode===r)break;if(a===4)for(a=i.return;a!==null;){var l=a.tag;if((l===3||l===4)&&(l=a.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;a=a.return}for(;o!==null;){if(a=Dr(o),a===null)return;if(l=a.tag,l===5||l===6){i=s=a;continue e}o=o.parentNode}}i=i.return}H0(function(){var c=s,h=Ph(t),u=[];e:{var d=xg.get(n);if(d!==void 0){var p=Fh,g=n;switch(n){case"keypress":if(ul(t)===0)break e;case"keydown":case"keyup":p=j_;break;case"focusin":g="focus",p=Ic;break;case"focusout":g="blur",p=Ic;break;case"beforeblur":case"afterblur":p=Ic;break;case"click":if(t.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=dp;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=I_;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=Y_;break;case fg:case pg:case mg:p=F_;break;case gg:p=K_;break;case"scroll":p=L_;break;case"wheel":p=Q_;break;case"copy":case"cut":case"paste":p=k_;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=fp}var M=(e&4)!==0,x=!M&&n==="scroll",f=M?d!==null?d+"Capture":null:d;M=[];for(var v=c,E;v!==null;){E=v;var S=E.stateNode;if(E.tag===5&&S!==null&&(E=S,f!==null&&(S=Va(v,f),S!=null&&M.push(Ya(v,S,E)))),x)break;v=v.return}0<M.length&&(d=new p(d,g,null,t,h),u.push({event:d,listeners:M}))}}if(!(e&7)){e:{if(d=n==="mouseover"||n==="pointerover",p=n==="mouseout"||n==="pointerout",d&&t!==qu&&(g=t.relatedTarget||t.fromElement)&&(Dr(g)||g[Gi]))break e;if((p||d)&&(d=h.window===h?h:(d=h.ownerDocument)?d.defaultView||d.parentWindow:window,p?(g=t.relatedTarget||t.toElement,p=c,g=g?Dr(g):null,g!==null&&(x=Zr(g),g!==x||g.tag!==5&&g.tag!==6)&&(g=null)):(p=null,g=c),p!==g)){if(M=dp,S="onMouseLeave",f="onMouseEnter",v="mouse",(n==="pointerout"||n==="pointerover")&&(M=fp,S="onPointerLeave",f="onPointerEnter",v="pointer"),x=p==null?d:Ts(p),E=g==null?d:Ts(g),d=new M(S,v+"leave",p,t,h),d.target=x,d.relatedTarget=E,S=null,Dr(h)===c&&(M=new M(f,v+"enter",g,t,h),M.target=E,M.relatedTarget=x,S=M),x=S,p&&g)t:{for(M=p,f=g,v=0,E=M;E;E=ts(E))v++;for(E=0,S=f;S;S=ts(S))E++;for(;0<v-E;)M=ts(M),v--;for(;0<E-v;)f=ts(f),E--;for(;v--;){if(M===f||f!==null&&M===f.alternate)break t;M=ts(M),f=ts(f)}M=null}else M=null;p!==null&&Ep(u,d,p,M,!1),g!==null&&x!==null&&Ep(u,x,g,M,!0)}}e:{if(d=c?Ts(c):window,p=d.nodeName&&d.nodeName.toLowerCase(),p==="select"||p==="input"&&d.type==="file")var T=sy;else if(gp(d))if(lg)T=cy;else{T=oy;var b=ay}else(p=d.nodeName)&&p.toLowerCase()==="input"&&(d.type==="checkbox"||d.type==="radio")&&(T=ly);if(T&&(T=T(n,c))){og(u,T,t,h);break e}b&&b(n,d,c),n==="focusout"&&(b=d._wrapperState)&&b.controlled&&d.type==="number"&&Wu(d,"number",d.value)}switch(b=c?Ts(c):window,n){case"focusin":(gp(b)||b.contentEditable==="true")&&(ws=b,nd=c,Pa=null);break;case"focusout":Pa=nd=ws=null;break;case"mousedown":id=!0;break;case"contextmenu":case"mouseup":case"dragend":id=!1,Sp(u,t,h);break;case"selectionchange":if(hy)break;case"keydown":case"keyup":Sp(u,t,h)}var C;if(kh)e:{switch(n){case"compositionstart":var _="onCompositionStart";break e;case"compositionend":_="onCompositionEnd";break e;case"compositionupdate":_="onCompositionUpdate";break e}_=void 0}else Ms?sg(n,t)&&(_="onCompositionEnd"):n==="keydown"&&t.keyCode===229&&(_="onCompositionStart");_&&(rg&&t.locale!=="ko"&&(Ms||_!=="onCompositionStart"?_==="onCompositionEnd"&&Ms&&(C=ig()):(lr=h,Uh="value"in lr?lr.value:lr.textContent,Ms=!0)),b=Ll(c,_),0<b.length&&(_=new hp(_,n,null,t,h),u.push({event:_,listeners:b}),C?_.data=C:(C=ag(t),C!==null&&(_.data=C)))),(C=ey?ty(n,t):ny(n,t))&&(c=Ll(c,"onBeforeInput"),0<c.length&&(h=new hp("onBeforeInput","beforeinput",null,t,h),u.push({event:h,listeners:c}),h.data=C))}vg(u,e)})}function Ya(n,e,t){return{instance:n,listener:e,currentTarget:t}}function Ll(n,e){for(var t=e+"Capture",i=[];n!==null;){var r=n,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=Va(n,t),s!=null&&i.unshift(Ya(n,s,r)),s=Va(n,e),s!=null&&i.push(Ya(n,s,r))),n=n.return}return i}function ts(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function Ep(n,e,t,i,r){for(var s=e._reactName,a=[];t!==null&&t!==i;){var o=t,l=o.alternate,c=o.stateNode;if(l!==null&&l===i)break;o.tag===5&&c!==null&&(o=c,r?(l=Va(t,s),l!=null&&a.unshift(Ya(t,l,o))):r||(l=Va(t,s),l!=null&&a.push(Ya(t,l,o)))),t=t.return}a.length!==0&&n.push({event:e,listeners:a})}var gy=/\r\n?/g,xy=/\u0000|\uFFFD/g;function Tp(n){return(typeof n=="string"?n:""+n).replace(gy,`
`).replace(xy,"")}function Ao(n,e,t){if(e=Tp(e),Tp(n)!==e&&t)throw Error(ae(425))}function Nl(){}var rd=null,sd=null;function ad(n,e){return n==="textarea"||n==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var od=typeof setTimeout=="function"?setTimeout:void 0,vy=typeof clearTimeout=="function"?clearTimeout:void 0,bp=typeof Promise=="function"?Promise:void 0,_y=typeof queueMicrotask=="function"?queueMicrotask:typeof bp<"u"?function(n){return bp.resolve(null).then(n).catch(yy)}:od;function yy(n){setTimeout(function(){throw n})}function Vc(n,e){var t=e,i=0;do{var r=t.nextSibling;if(n.removeChild(t),r&&r.nodeType===8)if(t=r.data,t==="/$"){if(i===0){n.removeChild(r),Wa(e);return}i--}else t!=="$"&&t!=="$?"&&t!=="$!"||i++;t=r}while(t);Wa(e)}function fr(n){for(;n!=null;n=n.nextSibling){var e=n.nodeType;if(e===1||e===3)break;if(e===8){if(e=n.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return n}function Cp(n){n=n.previousSibling;for(var e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="$"||t==="$!"||t==="$?"){if(e===0)return n;e--}else t==="/$"&&e++}n=n.previousSibling}return null}var Js=Math.random().toString(36).slice(2),xi="__reactFiber$"+Js,qa="__reactProps$"+Js,Gi="__reactContainer$"+Js,ld="__reactEvents$"+Js,Sy="__reactListeners$"+Js,My="__reactHandles$"+Js;function Dr(n){var e=n[xi];if(e)return e;for(var t=n.parentNode;t;){if(e=t[Gi]||t[xi]){if(t=e.alternate,e.child!==null||t!==null&&t.child!==null)for(n=Cp(n);n!==null;){if(t=n[xi])return t;n=Cp(n)}return e}n=t,t=n.parentNode}return null}function fo(n){return n=n[xi]||n[Gi],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function Ts(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(ae(33))}function cc(n){return n[qa]||null}var cd=[],bs=-1;function wr(n){return{current:n}}function Mt(n){0>bs||(n.current=cd[bs],cd[bs]=null,bs--)}function _t(n,e){bs++,cd[bs]=n.current,n.current=e}var yr={},un=wr(yr),wn=wr(!1),Hr=yr;function Gs(n,e){var t=n.type.contextTypes;if(!t)return yr;var i=n.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in t)r[s]=e[s];return i&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=e,n.__reactInternalMemoizedMaskedChildContext=r),r}function En(n){return n=n.childContextTypes,n!=null}function Il(){Mt(wn),Mt(un)}function Ap(n,e,t){if(un.current!==yr)throw Error(ae(168));_t(un,e),_t(wn,t)}function yg(n,e,t){var i=n.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return t;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(ae(108,a_(n)||"Unknown",r));return Pt({},t,i)}function Dl(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||yr,Hr=un.current,_t(un,n),_t(wn,wn.current),!0}function Rp(n,e,t){var i=n.stateNode;if(!i)throw Error(ae(169));t?(n=yg(n,e,Hr),i.__reactInternalMemoizedMergedChildContext=n,Mt(wn),Mt(un),_t(un,n)):Mt(wn),_t(wn,t)}var Ii=null,uc=!1,Hc=!1;function Sg(n){Ii===null?Ii=[n]:Ii.push(n)}function wy(n){uc=!0,Sg(n)}function Er(){if(!Hc&&Ii!==null){Hc=!0;var n=0,e=ft;try{var t=Ii;for(ft=1;n<t.length;n++){var i=t[n];do i=i(!0);while(i!==null)}Ii=null,uc=!1}catch(r){throw Ii!==null&&(Ii=Ii.slice(n+1)),X0(Lh,Er),r}finally{ft=e,Hc=!1}}return null}var Cs=[],As=0,Ul=null,Fl=0,zn=[],Vn=0,Gr=null,Ui=1,Fi="";function Lr(n,e){Cs[As++]=Fl,Cs[As++]=Ul,Ul=n,Fl=e}function Mg(n,e,t){zn[Vn++]=Ui,zn[Vn++]=Fi,zn[Vn++]=Gr,Gr=n;var i=Ui;n=Fi;var r=32-si(i)-1;i&=~(1<<r),t+=1;var s=32-si(e)+r;if(30<s){var a=r-r%5;s=(i&(1<<a)-1).toString(32),i>>=a,r-=a,Ui=1<<32-si(e)+r|t<<r|i,Fi=s+n}else Ui=1<<s|t<<r|i,Fi=n}function zh(n){n.return!==null&&(Lr(n,1),Mg(n,1,0))}function Vh(n){for(;n===Ul;)Ul=Cs[--As],Cs[As]=null,Fl=Cs[--As],Cs[As]=null;for(;n===Gr;)Gr=zn[--Vn],zn[Vn]=null,Fi=zn[--Vn],zn[Vn]=null,Ui=zn[--Vn],zn[Vn]=null}var In=null,Nn=null,Tt=!1,ni=null;function wg(n,e){var t=Wn(5,null,null,0);t.elementType="DELETED",t.stateNode=e,t.return=n,e=n.deletions,e===null?(n.deletions=[t],n.flags|=16):e.push(t)}function Pp(n,e){switch(n.tag){case 5:var t=n.type;return e=e.nodeType!==1||t.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(n.stateNode=e,In=n,Nn=fr(e.firstChild),!0):!1;case 6:return e=n.pendingProps===""||e.nodeType!==3?null:e,e!==null?(n.stateNode=e,In=n,Nn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(t=Gr!==null?{id:Ui,overflow:Fi}:null,n.memoizedState={dehydrated:e,treeContext:t,retryLane:1073741824},t=Wn(18,null,null,0),t.stateNode=e,t.return=n,n.child=t,In=n,Nn=null,!0):!1;default:return!1}}function ud(n){return(n.mode&1)!==0&&(n.flags&128)===0}function dd(n){if(Tt){var e=Nn;if(e){var t=e;if(!Pp(n,e)){if(ud(n))throw Error(ae(418));e=fr(t.nextSibling);var i=In;e&&Pp(n,e)?wg(i,t):(n.flags=n.flags&-4097|2,Tt=!1,In=n)}}else{if(ud(n))throw Error(ae(418));n.flags=n.flags&-4097|2,Tt=!1,In=n}}}function Lp(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;In=n}function Ro(n){if(n!==In)return!1;if(!Tt)return Lp(n),Tt=!0,!1;var e;if((e=n.tag!==3)&&!(e=n.tag!==5)&&(e=n.type,e=e!=="head"&&e!=="body"&&!ad(n.type,n.memoizedProps)),e&&(e=Nn)){if(ud(n))throw Eg(),Error(ae(418));for(;e;)wg(n,e),e=fr(e.nextSibling)}if(Lp(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(ae(317));e:{for(n=n.nextSibling,e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="/$"){if(e===0){Nn=fr(n.nextSibling);break e}e--}else t!=="$"&&t!=="$!"&&t!=="$?"||e++}n=n.nextSibling}Nn=null}}else Nn=In?fr(n.stateNode.nextSibling):null;return!0}function Eg(){for(var n=Nn;n;)n=fr(n.nextSibling)}function Ws(){Nn=In=null,Tt=!1}function Hh(n){ni===null?ni=[n]:ni.push(n)}var Ey=$i.ReactCurrentBatchConfig;function la(n,e,t){if(n=t.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(t._owner){if(t=t._owner,t){if(t.tag!==1)throw Error(ae(309));var i=t.stateNode}if(!i)throw Error(ae(147,n));var r=i,s=""+n;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(a){var o=r.refs;a===null?delete o[s]:o[s]=a},e._stringRef=s,e)}if(typeof n!="string")throw Error(ae(284));if(!t._owner)throw Error(ae(290,n))}return n}function Po(n,e){throw n=Object.prototype.toString.call(e),Error(ae(31,n==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":n))}function Np(n){var e=n._init;return e(n._payload)}function Tg(n){function e(f,v){if(n){var E=f.deletions;E===null?(f.deletions=[v],f.flags|=16):E.push(v)}}function t(f,v){if(!n)return null;for(;v!==null;)e(f,v),v=v.sibling;return null}function i(f,v){for(f=new Map;v!==null;)v.key!==null?f.set(v.key,v):f.set(v.index,v),v=v.sibling;return f}function r(f,v){return f=xr(f,v),f.index=0,f.sibling=null,f}function s(f,v,E){return f.index=E,n?(E=f.alternate,E!==null?(E=E.index,E<v?(f.flags|=2,v):E):(f.flags|=2,v)):(f.flags|=1048576,v)}function a(f){return n&&f.alternate===null&&(f.flags|=2),f}function o(f,v,E,S){return v===null||v.tag!==6?(v=qc(E,f.mode,S),v.return=f,v):(v=r(v,E),v.return=f,v)}function l(f,v,E,S){var T=E.type;return T===Ss?h(f,v,E.props.children,S,E.key):v!==null&&(v.elementType===T||typeof T=="object"&&T!==null&&T.$$typeof===ir&&Np(T)===v.type)?(S=r(v,E.props),S.ref=la(f,v,E),S.return=f,S):(S=xl(E.type,E.key,E.props,null,f.mode,S),S.ref=la(f,v,E),S.return=f,S)}function c(f,v,E,S){return v===null||v.tag!==4||v.stateNode.containerInfo!==E.containerInfo||v.stateNode.implementation!==E.implementation?(v=Kc(E,f.mode,S),v.return=f,v):(v=r(v,E.children||[]),v.return=f,v)}function h(f,v,E,S,T){return v===null||v.tag!==7?(v=zr(E,f.mode,S,T),v.return=f,v):(v=r(v,E),v.return=f,v)}function u(f,v,E){if(typeof v=="string"&&v!==""||typeof v=="number")return v=qc(""+v,f.mode,E),v.return=f,v;if(typeof v=="object"&&v!==null){switch(v.$$typeof){case _o:return E=xl(v.type,v.key,v.props,null,f.mode,E),E.ref=la(f,null,v),E.return=f,E;case ys:return v=Kc(v,f.mode,E),v.return=f,v;case ir:var S=v._init;return u(f,S(v._payload),E)}if(Sa(v)||ia(v))return v=zr(v,f.mode,E,null),v.return=f,v;Po(f,v)}return null}function d(f,v,E,S){var T=v!==null?v.key:null;if(typeof E=="string"&&E!==""||typeof E=="number")return T!==null?null:o(f,v,""+E,S);if(typeof E=="object"&&E!==null){switch(E.$$typeof){case _o:return E.key===T?l(f,v,E,S):null;case ys:return E.key===T?c(f,v,E,S):null;case ir:return T=E._init,d(f,v,T(E._payload),S)}if(Sa(E)||ia(E))return T!==null?null:h(f,v,E,S,null);Po(f,E)}return null}function p(f,v,E,S,T){if(typeof S=="string"&&S!==""||typeof S=="number")return f=f.get(E)||null,o(v,f,""+S,T);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case _o:return f=f.get(S.key===null?E:S.key)||null,l(v,f,S,T);case ys:return f=f.get(S.key===null?E:S.key)||null,c(v,f,S,T);case ir:var b=S._init;return p(f,v,E,b(S._payload),T)}if(Sa(S)||ia(S))return f=f.get(E)||null,h(v,f,S,T,null);Po(v,S)}return null}function g(f,v,E,S){for(var T=null,b=null,C=v,_=v=0,A=null;C!==null&&_<E.length;_++){C.index>_?(A=C,C=null):A=C.sibling;var L=d(f,C,E[_],S);if(L===null){C===null&&(C=A);break}n&&C&&L.alternate===null&&e(f,C),v=s(L,v,_),b===null?T=L:b.sibling=L,b=L,C=A}if(_===E.length)return t(f,C),Tt&&Lr(f,_),T;if(C===null){for(;_<E.length;_++)C=u(f,E[_],S),C!==null&&(v=s(C,v,_),b===null?T=C:b.sibling=C,b=C);return Tt&&Lr(f,_),T}for(C=i(f,C);_<E.length;_++)A=p(C,f,_,E[_],S),A!==null&&(n&&A.alternate!==null&&C.delete(A.key===null?_:A.key),v=s(A,v,_),b===null?T=A:b.sibling=A,b=A);return n&&C.forEach(function(I){return e(f,I)}),Tt&&Lr(f,_),T}function M(f,v,E,S){var T=ia(E);if(typeof T!="function")throw Error(ae(150));if(E=T.call(E),E==null)throw Error(ae(151));for(var b=T=null,C=v,_=v=0,A=null,L=E.next();C!==null&&!L.done;_++,L=E.next()){C.index>_?(A=C,C=null):A=C.sibling;var I=d(f,C,L.value,S);if(I===null){C===null&&(C=A);break}n&&C&&I.alternate===null&&e(f,C),v=s(I,v,_),b===null?T=I:b.sibling=I,b=I,C=A}if(L.done)return t(f,C),Tt&&Lr(f,_),T;if(C===null){for(;!L.done;_++,L=E.next())L=u(f,L.value,S),L!==null&&(v=s(L,v,_),b===null?T=L:b.sibling=L,b=L);return Tt&&Lr(f,_),T}for(C=i(f,C);!L.done;_++,L=E.next())L=p(C,f,_,L.value,S),L!==null&&(n&&L.alternate!==null&&C.delete(L.key===null?_:L.key),v=s(L,v,_),b===null?T=L:b.sibling=L,b=L);return n&&C.forEach(function(N){return e(f,N)}),Tt&&Lr(f,_),T}function x(f,v,E,S){if(typeof E=="object"&&E!==null&&E.type===Ss&&E.key===null&&(E=E.props.children),typeof E=="object"&&E!==null){switch(E.$$typeof){case _o:e:{for(var T=E.key,b=v;b!==null;){if(b.key===T){if(T=E.type,T===Ss){if(b.tag===7){t(f,b.sibling),v=r(b,E.props.children),v.return=f,f=v;break e}}else if(b.elementType===T||typeof T=="object"&&T!==null&&T.$$typeof===ir&&Np(T)===b.type){t(f,b.sibling),v=r(b,E.props),v.ref=la(f,b,E),v.return=f,f=v;break e}t(f,b);break}else e(f,b);b=b.sibling}E.type===Ss?(v=zr(E.props.children,f.mode,S,E.key),v.return=f,f=v):(S=xl(E.type,E.key,E.props,null,f.mode,S),S.ref=la(f,v,E),S.return=f,f=S)}return a(f);case ys:e:{for(b=E.key;v!==null;){if(v.key===b)if(v.tag===4&&v.stateNode.containerInfo===E.containerInfo&&v.stateNode.implementation===E.implementation){t(f,v.sibling),v=r(v,E.children||[]),v.return=f,f=v;break e}else{t(f,v);break}else e(f,v);v=v.sibling}v=Kc(E,f.mode,S),v.return=f,f=v}return a(f);case ir:return b=E._init,x(f,v,b(E._payload),S)}if(Sa(E))return g(f,v,E,S);if(ia(E))return M(f,v,E,S);Po(f,E)}return typeof E=="string"&&E!==""||typeof E=="number"?(E=""+E,v!==null&&v.tag===6?(t(f,v.sibling),v=r(v,E),v.return=f,f=v):(t(f,v),v=qc(E,f.mode,S),v.return=f,f=v),a(f)):t(f,v)}return x}var js=Tg(!0),bg=Tg(!1),Ol=wr(null),kl=null,Rs=null,Gh=null;function Wh(){Gh=Rs=kl=null}function jh(n){var e=Ol.current;Mt(Ol),n._currentValue=e}function hd(n,e,t){for(;n!==null;){var i=n.alternate;if((n.childLanes&e)!==e?(n.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),n===t)break;n=n.return}}function ks(n,e){kl=n,Gh=Rs=null,n=n.dependencies,n!==null&&n.firstContext!==null&&(n.lanes&e&&(Mn=!0),n.firstContext=null)}function $n(n){var e=n._currentValue;if(Gh!==n)if(n={context:n,memoizedValue:e,next:null},Rs===null){if(kl===null)throw Error(ae(308));Rs=n,kl.dependencies={lanes:0,firstContext:n}}else Rs=Rs.next=n;return e}var Ur=null;function Xh(n){Ur===null?Ur=[n]:Ur.push(n)}function Cg(n,e,t,i){var r=e.interleaved;return r===null?(t.next=t,Xh(e)):(t.next=r.next,r.next=t),e.interleaved=t,Wi(n,i)}function Wi(n,e){n.lanes|=e;var t=n.alternate;for(t!==null&&(t.lanes|=e),t=n,n=n.return;n!==null;)n.childLanes|=e,t=n.alternate,t!==null&&(t.childLanes|=e),t=n,n=n.return;return t.tag===3?t.stateNode:null}var rr=!1;function $h(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Ag(n,e){n=n.updateQueue,e.updateQueue===n&&(e.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function ki(n,e){return{eventTime:n,lane:e,tag:0,payload:null,callback:null,next:null}}function pr(n,e,t){var i=n.updateQueue;if(i===null)return null;if(i=i.shared,rt&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Wi(n,t)}return r=i.interleaved,r===null?(e.next=e,Xh(i)):(e.next=r.next,r.next=e),i.interleaved=e,Wi(n,t)}function dl(n,e,t){if(e=e.updateQueue,e!==null&&(e=e.shared,(t&4194240)!==0)){var i=e.lanes;i&=n.pendingLanes,t|=i,e.lanes=t,Nh(n,t)}}function Ip(n,e){var t=n.updateQueue,i=n.alternate;if(i!==null&&(i=i.updateQueue,t===i)){var r=null,s=null;if(t=t.firstBaseUpdate,t!==null){do{var a={eventTime:t.eventTime,lane:t.lane,tag:t.tag,payload:t.payload,callback:t.callback,next:null};s===null?r=s=a:s=s.next=a,t=t.next}while(t!==null);s===null?r=s=e:s=s.next=e}else r=s=e;t={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},n.updateQueue=t;return}n=t.lastBaseUpdate,n===null?t.firstBaseUpdate=e:n.next=e,t.lastBaseUpdate=e}function Bl(n,e,t,i){var r=n.updateQueue;rr=!1;var s=r.firstBaseUpdate,a=r.lastBaseUpdate,o=r.shared.pending;if(o!==null){r.shared.pending=null;var l=o,c=l.next;l.next=null,a===null?s=c:a.next=c,a=l;var h=n.alternate;h!==null&&(h=h.updateQueue,o=h.lastBaseUpdate,o!==a&&(o===null?h.firstBaseUpdate=c:o.next=c,h.lastBaseUpdate=l))}if(s!==null){var u=r.baseState;a=0,h=c=l=null,o=s;do{var d=o.lane,p=o.eventTime;if((i&d)===d){h!==null&&(h=h.next={eventTime:p,lane:0,tag:o.tag,payload:o.payload,callback:o.callback,next:null});e:{var g=n,M=o;switch(d=e,p=t,M.tag){case 1:if(g=M.payload,typeof g=="function"){u=g.call(p,u,d);break e}u=g;break e;case 3:g.flags=g.flags&-65537|128;case 0:if(g=M.payload,d=typeof g=="function"?g.call(p,u,d):g,d==null)break e;u=Pt({},u,d);break e;case 2:rr=!0}}o.callback!==null&&o.lane!==0&&(n.flags|=64,d=r.effects,d===null?r.effects=[o]:d.push(o))}else p={eventTime:p,lane:d,tag:o.tag,payload:o.payload,callback:o.callback,next:null},h===null?(c=h=p,l=u):h=h.next=p,a|=d;if(o=o.next,o===null){if(o=r.shared.pending,o===null)break;d=o,o=d.next,d.next=null,r.lastBaseUpdate=d,r.shared.pending=null}}while(!0);if(h===null&&(l=u),r.baseState=l,r.firstBaseUpdate=c,r.lastBaseUpdate=h,e=r.shared.interleaved,e!==null){r=e;do a|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);jr|=a,n.lanes=a,n.memoizedState=u}}function Dp(n,e,t){if(n=e.effects,e.effects=null,n!==null)for(e=0;e<n.length;e++){var i=n[e],r=i.callback;if(r!==null){if(i.callback=null,i=t,typeof r!="function")throw Error(ae(191,r));r.call(i)}}}var po={},Si=wr(po),Ka=wr(po),Za=wr(po);function Fr(n){if(n===po)throw Error(ae(174));return n}function Yh(n,e){switch(_t(Za,e),_t(Ka,n),_t(Si,po),n=e.nodeType,n){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Xu(null,"");break;default:n=n===8?e.parentNode:e,e=n.namespaceURI||null,n=n.tagName,e=Xu(e,n)}Mt(Si),_t(Si,e)}function Xs(){Mt(Si),Mt(Ka),Mt(Za)}function Rg(n){Fr(Za.current);var e=Fr(Si.current),t=Xu(e,n.type);e!==t&&(_t(Ka,n),_t(Si,t))}function qh(n){Ka.current===n&&(Mt(Si),Mt(Ka))}var Ct=wr(0);function zl(n){for(var e=n;e!==null;){if(e.tag===13){var t=e.memoizedState;if(t!==null&&(t=t.dehydrated,t===null||t.data==="$?"||t.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Gc=[];function Kh(){for(var n=0;n<Gc.length;n++)Gc[n]._workInProgressVersionPrimary=null;Gc.length=0}var hl=$i.ReactCurrentDispatcher,Wc=$i.ReactCurrentBatchConfig,Wr=0,Rt=null,zt=null,Xt=null,Vl=!1,La=!1,Qa=0,Ty=0;function rn(){throw Error(ae(321))}function Zh(n,e){if(e===null)return!1;for(var t=0;t<e.length&&t<n.length;t++)if(!li(n[t],e[t]))return!1;return!0}function Qh(n,e,t,i,r,s){if(Wr=s,Rt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,hl.current=n===null||n.memoizedState===null?Ry:Py,n=t(i,r),La){s=0;do{if(La=!1,Qa=0,25<=s)throw Error(ae(301));s+=1,Xt=zt=null,e.updateQueue=null,hl.current=Ly,n=t(i,r)}while(La)}if(hl.current=Hl,e=zt!==null&&zt.next!==null,Wr=0,Xt=zt=Rt=null,Vl=!1,e)throw Error(ae(300));return n}function Jh(){var n=Qa!==0;return Qa=0,n}function pi(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Xt===null?Rt.memoizedState=Xt=n:Xt=Xt.next=n,Xt}function Yn(){if(zt===null){var n=Rt.alternate;n=n!==null?n.memoizedState:null}else n=zt.next;var e=Xt===null?Rt.memoizedState:Xt.next;if(e!==null)Xt=e,zt=n;else{if(n===null)throw Error(ae(310));zt=n,n={memoizedState:zt.memoizedState,baseState:zt.baseState,baseQueue:zt.baseQueue,queue:zt.queue,next:null},Xt===null?Rt.memoizedState=Xt=n:Xt=Xt.next=n}return Xt}function Ja(n,e){return typeof e=="function"?e(n):e}function jc(n){var e=Yn(),t=e.queue;if(t===null)throw Error(ae(311));t.lastRenderedReducer=n;var i=zt,r=i.baseQueue,s=t.pending;if(s!==null){if(r!==null){var a=r.next;r.next=s.next,s.next=a}i.baseQueue=r=s,t.pending=null}if(r!==null){s=r.next,i=i.baseState;var o=a=null,l=null,c=s;do{var h=c.lane;if((Wr&h)===h)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),i=c.hasEagerState?c.eagerState:n(i,c.action);else{var u={lane:h,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(o=l=u,a=i):l=l.next=u,Rt.lanes|=h,jr|=h}c=c.next}while(c!==null&&c!==s);l===null?a=i:l.next=o,li(i,e.memoizedState)||(Mn=!0),e.memoizedState=i,e.baseState=a,e.baseQueue=l,t.lastRenderedState=i}if(n=t.interleaved,n!==null){r=n;do s=r.lane,Rt.lanes|=s,jr|=s,r=r.next;while(r!==n)}else r===null&&(t.lanes=0);return[e.memoizedState,t.dispatch]}function Xc(n){var e=Yn(),t=e.queue;if(t===null)throw Error(ae(311));t.lastRenderedReducer=n;var i=t.dispatch,r=t.pending,s=e.memoizedState;if(r!==null){t.pending=null;var a=r=r.next;do s=n(s,a.action),a=a.next;while(a!==r);li(s,e.memoizedState)||(Mn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),t.lastRenderedState=s}return[s,i]}function Pg(){}function Lg(n,e){var t=Rt,i=Yn(),r=e(),s=!li(i.memoizedState,r);if(s&&(i.memoizedState=r,Mn=!0),i=i.queue,ef(Dg.bind(null,t,i,n),[n]),i.getSnapshot!==e||s||Xt!==null&&Xt.memoizedState.tag&1){if(t.flags|=2048,eo(9,Ig.bind(null,t,i,r,e),void 0,null),Yt===null)throw Error(ae(349));Wr&30||Ng(t,e,r)}return r}function Ng(n,e,t){n.flags|=16384,n={getSnapshot:e,value:t},e=Rt.updateQueue,e===null?(e={lastEffect:null,stores:null},Rt.updateQueue=e,e.stores=[n]):(t=e.stores,t===null?e.stores=[n]:t.push(n))}function Ig(n,e,t,i){e.value=t,e.getSnapshot=i,Ug(e)&&Fg(n)}function Dg(n,e,t){return t(function(){Ug(e)&&Fg(n)})}function Ug(n){var e=n.getSnapshot;n=n.value;try{var t=e();return!li(n,t)}catch{return!0}}function Fg(n){var e=Wi(n,1);e!==null&&ai(e,n,1,-1)}function Up(n){var e=pi();return typeof n=="function"&&(n=n()),e.memoizedState=e.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ja,lastRenderedState:n},e.queue=n,n=n.dispatch=Ay.bind(null,Rt,n),[e.memoizedState,n]}function eo(n,e,t,i){return n={tag:n,create:e,destroy:t,deps:i,next:null},e=Rt.updateQueue,e===null?(e={lastEffect:null,stores:null},Rt.updateQueue=e,e.lastEffect=n.next=n):(t=e.lastEffect,t===null?e.lastEffect=n.next=n:(i=t.next,t.next=n,n.next=i,e.lastEffect=n)),n}function Og(){return Yn().memoizedState}function fl(n,e,t,i){var r=pi();Rt.flags|=n,r.memoizedState=eo(1|e,t,void 0,i===void 0?null:i)}function dc(n,e,t,i){var r=Yn();i=i===void 0?null:i;var s=void 0;if(zt!==null){var a=zt.memoizedState;if(s=a.destroy,i!==null&&Zh(i,a.deps)){r.memoizedState=eo(e,t,s,i);return}}Rt.flags|=n,r.memoizedState=eo(1|e,t,s,i)}function Fp(n,e){return fl(8390656,8,n,e)}function ef(n,e){return dc(2048,8,n,e)}function kg(n,e){return dc(4,2,n,e)}function Bg(n,e){return dc(4,4,n,e)}function zg(n,e){if(typeof e=="function")return n=n(),e(n),function(){e(null)};if(e!=null)return n=n(),e.current=n,function(){e.current=null}}function Vg(n,e,t){return t=t!=null?t.concat([n]):null,dc(4,4,zg.bind(null,e,n),t)}function tf(){}function Hg(n,e){var t=Yn();e=e===void 0?null:e;var i=t.memoizedState;return i!==null&&e!==null&&Zh(e,i[1])?i[0]:(t.memoizedState=[n,e],n)}function Gg(n,e){var t=Yn();e=e===void 0?null:e;var i=t.memoizedState;return i!==null&&e!==null&&Zh(e,i[1])?i[0]:(n=n(),t.memoizedState=[n,e],n)}function Wg(n,e,t){return Wr&21?(li(t,e)||(t=q0(),Rt.lanes|=t,jr|=t,n.baseState=!0),e):(n.baseState&&(n.baseState=!1,Mn=!0),n.memoizedState=t)}function by(n,e){var t=ft;ft=t!==0&&4>t?t:4,n(!0);var i=Wc.transition;Wc.transition={};try{n(!1),e()}finally{ft=t,Wc.transition=i}}function jg(){return Yn().memoizedState}function Cy(n,e,t){var i=gr(n);if(t={lane:i,action:t,hasEagerState:!1,eagerState:null,next:null},Xg(n))$g(e,t);else if(t=Cg(n,e,t,i),t!==null){var r=mn();ai(t,n,i,r),Yg(t,e,i)}}function Ay(n,e,t){var i=gr(n),r={lane:i,action:t,hasEagerState:!1,eagerState:null,next:null};if(Xg(n))$g(e,r);else{var s=n.alternate;if(n.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var a=e.lastRenderedState,o=s(a,t);if(r.hasEagerState=!0,r.eagerState=o,li(o,a)){var l=e.interleaved;l===null?(r.next=r,Xh(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}t=Cg(n,e,r,i),t!==null&&(r=mn(),ai(t,n,i,r),Yg(t,e,i))}}function Xg(n){var e=n.alternate;return n===Rt||e!==null&&e===Rt}function $g(n,e){La=Vl=!0;var t=n.pending;t===null?e.next=e:(e.next=t.next,t.next=e),n.pending=e}function Yg(n,e,t){if(t&4194240){var i=e.lanes;i&=n.pendingLanes,t|=i,e.lanes=t,Nh(n,t)}}var Hl={readContext:$n,useCallback:rn,useContext:rn,useEffect:rn,useImperativeHandle:rn,useInsertionEffect:rn,useLayoutEffect:rn,useMemo:rn,useReducer:rn,useRef:rn,useState:rn,useDebugValue:rn,useDeferredValue:rn,useTransition:rn,useMutableSource:rn,useSyncExternalStore:rn,useId:rn,unstable_isNewReconciler:!1},Ry={readContext:$n,useCallback:function(n,e){return pi().memoizedState=[n,e===void 0?null:e],n},useContext:$n,useEffect:Fp,useImperativeHandle:function(n,e,t){return t=t!=null?t.concat([n]):null,fl(4194308,4,zg.bind(null,e,n),t)},useLayoutEffect:function(n,e){return fl(4194308,4,n,e)},useInsertionEffect:function(n,e){return fl(4,2,n,e)},useMemo:function(n,e){var t=pi();return e=e===void 0?null:e,n=n(),t.memoizedState=[n,e],n},useReducer:function(n,e,t){var i=pi();return e=t!==void 0?t(e):e,i.memoizedState=i.baseState=e,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:e},i.queue=n,n=n.dispatch=Cy.bind(null,Rt,n),[i.memoizedState,n]},useRef:function(n){var e=pi();return n={current:n},e.memoizedState=n},useState:Up,useDebugValue:tf,useDeferredValue:function(n){return pi().memoizedState=n},useTransition:function(){var n=Up(!1),e=n[0];return n=by.bind(null,n[1]),pi().memoizedState=n,[e,n]},useMutableSource:function(){},useSyncExternalStore:function(n,e,t){var i=Rt,r=pi();if(Tt){if(t===void 0)throw Error(ae(407));t=t()}else{if(t=e(),Yt===null)throw Error(ae(349));Wr&30||Ng(i,e,t)}r.memoizedState=t;var s={value:t,getSnapshot:e};return r.queue=s,Fp(Dg.bind(null,i,s,n),[n]),i.flags|=2048,eo(9,Ig.bind(null,i,s,t,e),void 0,null),t},useId:function(){var n=pi(),e=Yt.identifierPrefix;if(Tt){var t=Fi,i=Ui;t=(i&~(1<<32-si(i)-1)).toString(32)+t,e=":"+e+"R"+t,t=Qa++,0<t&&(e+="H"+t.toString(32)),e+=":"}else t=Ty++,e=":"+e+"r"+t.toString(32)+":";return n.memoizedState=e},unstable_isNewReconciler:!1},Py={readContext:$n,useCallback:Hg,useContext:$n,useEffect:ef,useImperativeHandle:Vg,useInsertionEffect:kg,useLayoutEffect:Bg,useMemo:Gg,useReducer:jc,useRef:Og,useState:function(){return jc(Ja)},useDebugValue:tf,useDeferredValue:function(n){var e=Yn();return Wg(e,zt.memoizedState,n)},useTransition:function(){var n=jc(Ja)[0],e=Yn().memoizedState;return[n,e]},useMutableSource:Pg,useSyncExternalStore:Lg,useId:jg,unstable_isNewReconciler:!1},Ly={readContext:$n,useCallback:Hg,useContext:$n,useEffect:ef,useImperativeHandle:Vg,useInsertionEffect:kg,useLayoutEffect:Bg,useMemo:Gg,useReducer:Xc,useRef:Og,useState:function(){return Xc(Ja)},useDebugValue:tf,useDeferredValue:function(n){var e=Yn();return zt===null?e.memoizedState=n:Wg(e,zt.memoizedState,n)},useTransition:function(){var n=Xc(Ja)[0],e=Yn().memoizedState;return[n,e]},useMutableSource:Pg,useSyncExternalStore:Lg,useId:jg,unstable_isNewReconciler:!1};function ei(n,e){if(n&&n.defaultProps){e=Pt({},e),n=n.defaultProps;for(var t in n)e[t]===void 0&&(e[t]=n[t]);return e}return e}function fd(n,e,t,i){e=n.memoizedState,t=t(i,e),t=t==null?e:Pt({},e,t),n.memoizedState=t,n.lanes===0&&(n.updateQueue.baseState=t)}var hc={isMounted:function(n){return(n=n._reactInternals)?Zr(n)===n:!1},enqueueSetState:function(n,e,t){n=n._reactInternals;var i=mn(),r=gr(n),s=ki(i,r);s.payload=e,t!=null&&(s.callback=t),e=pr(n,s,r),e!==null&&(ai(e,n,r,i),dl(e,n,r))},enqueueReplaceState:function(n,e,t){n=n._reactInternals;var i=mn(),r=gr(n),s=ki(i,r);s.tag=1,s.payload=e,t!=null&&(s.callback=t),e=pr(n,s,r),e!==null&&(ai(e,n,r,i),dl(e,n,r))},enqueueForceUpdate:function(n,e){n=n._reactInternals;var t=mn(),i=gr(n),r=ki(t,i);r.tag=2,e!=null&&(r.callback=e),e=pr(n,r,i),e!==null&&(ai(e,n,i,t),dl(e,n,i))}};function Op(n,e,t,i,r,s,a){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(i,s,a):e.prototype&&e.prototype.isPureReactComponent?!Xa(t,i)||!Xa(r,s):!0}function qg(n,e,t){var i=!1,r=yr,s=e.contextType;return typeof s=="object"&&s!==null?s=$n(s):(r=En(e)?Hr:un.current,i=e.contextTypes,s=(i=i!=null)?Gs(n,r):yr),e=new e(t,s),n.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=hc,n.stateNode=e,e._reactInternals=n,i&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=r,n.__reactInternalMemoizedMaskedChildContext=s),e}function kp(n,e,t,i){n=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(t,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(t,i),e.state!==n&&hc.enqueueReplaceState(e,e.state,null)}function pd(n,e,t,i){var r=n.stateNode;r.props=t,r.state=n.memoizedState,r.refs={},$h(n);var s=e.contextType;typeof s=="object"&&s!==null?r.context=$n(s):(s=En(e)?Hr:un.current,r.context=Gs(n,s)),r.state=n.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(fd(n,e,s,t),r.state=n.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&hc.enqueueReplaceState(r,r.state,null),Bl(n,t,r,i),r.state=n.memoizedState),typeof r.componentDidMount=="function"&&(n.flags|=4194308)}function $s(n,e){try{var t="",i=e;do t+=s_(i),i=i.return;while(i);var r=t}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:n,source:e,stack:r,digest:null}}function $c(n,e,t){return{value:n,source:null,stack:t??null,digest:e??null}}function md(n,e){try{console.error(e.value)}catch(t){setTimeout(function(){throw t})}}var Ny=typeof WeakMap=="function"?WeakMap:Map;function Kg(n,e,t){t=ki(-1,t),t.tag=3,t.payload={element:null};var i=e.value;return t.callback=function(){Wl||(Wl=!0,Td=i),md(n,e)},t}function Zg(n,e,t){t=ki(-1,t),t.tag=3;var i=n.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;t.payload=function(){return i(r)},t.callback=function(){md(n,e)}}var s=n.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(t.callback=function(){md(n,e),typeof i!="function"&&(mr===null?mr=new Set([this]):mr.add(this));var a=e.stack;this.componentDidCatch(e.value,{componentStack:a!==null?a:""})}),t}function Bp(n,e,t){var i=n.pingCache;if(i===null){i=n.pingCache=new Ny;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(t)||(r.add(t),n=Xy.bind(null,n,e,t),e.then(n,n))}function zp(n){do{var e;if((e=n.tag===13)&&(e=n.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return n;n=n.return}while(n!==null);return null}function Vp(n,e,t,i,r){return n.mode&1?(n.flags|=65536,n.lanes=r,n):(n===e?n.flags|=65536:(n.flags|=128,t.flags|=131072,t.flags&=-52805,t.tag===1&&(t.alternate===null?t.tag=17:(e=ki(-1,1),e.tag=2,pr(t,e,1))),t.lanes|=1),n)}var Iy=$i.ReactCurrentOwner,Mn=!1;function pn(n,e,t,i){e.child=n===null?bg(e,null,t,i):js(e,n.child,t,i)}function Hp(n,e,t,i,r){t=t.render;var s=e.ref;return ks(e,r),i=Qh(n,e,t,i,s,r),t=Jh(),n!==null&&!Mn?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~r,ji(n,e,r)):(Tt&&t&&zh(e),e.flags|=1,pn(n,e,i,r),e.child)}function Gp(n,e,t,i,r){if(n===null){var s=t.type;return typeof s=="function"&&!uf(s)&&s.defaultProps===void 0&&t.compare===null&&t.defaultProps===void 0?(e.tag=15,e.type=s,Qg(n,e,s,i,r)):(n=xl(t.type,null,i,e,e.mode,r),n.ref=e.ref,n.return=e,e.child=n)}if(s=n.child,!(n.lanes&r)){var a=s.memoizedProps;if(t=t.compare,t=t!==null?t:Xa,t(a,i)&&n.ref===e.ref)return ji(n,e,r)}return e.flags|=1,n=xr(s,i),n.ref=e.ref,n.return=e,e.child=n}function Qg(n,e,t,i,r){if(n!==null){var s=n.memoizedProps;if(Xa(s,i)&&n.ref===e.ref)if(Mn=!1,e.pendingProps=i=s,(n.lanes&r)!==0)n.flags&131072&&(Mn=!0);else return e.lanes=n.lanes,ji(n,e,r)}return gd(n,e,t,i,r)}function Jg(n,e,t){var i=e.pendingProps,r=i.children,s=n!==null?n.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},_t(Ls,Pn),Pn|=t;else{if(!(t&1073741824))return n=s!==null?s.baseLanes|t:t,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:n,cachePool:null,transitions:null},e.updateQueue=null,_t(Ls,Pn),Pn|=n,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:t,_t(Ls,Pn),Pn|=i}else s!==null?(i=s.baseLanes|t,e.memoizedState=null):i=t,_t(Ls,Pn),Pn|=i;return pn(n,e,r,t),e.child}function ex(n,e){var t=e.ref;(n===null&&t!==null||n!==null&&n.ref!==t)&&(e.flags|=512,e.flags|=2097152)}function gd(n,e,t,i,r){var s=En(t)?Hr:un.current;return s=Gs(e,s),ks(e,r),t=Qh(n,e,t,i,s,r),i=Jh(),n!==null&&!Mn?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~r,ji(n,e,r)):(Tt&&i&&zh(e),e.flags|=1,pn(n,e,t,r),e.child)}function Wp(n,e,t,i,r){if(En(t)){var s=!0;Dl(e)}else s=!1;if(ks(e,r),e.stateNode===null)pl(n,e),qg(e,t,i),pd(e,t,i,r),i=!0;else if(n===null){var a=e.stateNode,o=e.memoizedProps;a.props=o;var l=a.context,c=t.contextType;typeof c=="object"&&c!==null?c=$n(c):(c=En(t)?Hr:un.current,c=Gs(e,c));var h=t.getDerivedStateFromProps,u=typeof h=="function"||typeof a.getSnapshotBeforeUpdate=="function";u||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==i||l!==c)&&kp(e,a,i,c),rr=!1;var d=e.memoizedState;a.state=d,Bl(e,i,a,r),l=e.memoizedState,o!==i||d!==l||wn.current||rr?(typeof h=="function"&&(fd(e,t,h,i),l=e.memoizedState),(o=rr||Op(e,t,o,i,d,l,c))?(u||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(e.flags|=4194308)):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),a.props=i,a.state=l,a.context=c,i=o):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{a=e.stateNode,Ag(n,e),o=e.memoizedProps,c=e.type===e.elementType?o:ei(e.type,o),a.props=c,u=e.pendingProps,d=a.context,l=t.contextType,typeof l=="object"&&l!==null?l=$n(l):(l=En(t)?Hr:un.current,l=Gs(e,l));var p=t.getDerivedStateFromProps;(h=typeof p=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==u||d!==l)&&kp(e,a,i,l),rr=!1,d=e.memoizedState,a.state=d,Bl(e,i,a,r);var g=e.memoizedState;o!==u||d!==g||wn.current||rr?(typeof p=="function"&&(fd(e,t,p,i),g=e.memoizedState),(c=rr||Op(e,t,c,i,d,g,l)||!1)?(h||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(i,g,l),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(i,g,l)),typeof a.componentDidUpdate=="function"&&(e.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof a.componentDidUpdate!="function"||o===n.memoizedProps&&d===n.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===n.memoizedProps&&d===n.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=g),a.props=i,a.state=g,a.context=l,i=c):(typeof a.componentDidUpdate!="function"||o===n.memoizedProps&&d===n.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===n.memoizedProps&&d===n.memoizedState||(e.flags|=1024),i=!1)}return xd(n,e,t,i,s,r)}function xd(n,e,t,i,r,s){ex(n,e);var a=(e.flags&128)!==0;if(!i&&!a)return r&&Rp(e,t,!1),ji(n,e,s);i=e.stateNode,Iy.current=e;var o=a&&typeof t.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,n!==null&&a?(e.child=js(e,n.child,null,s),e.child=js(e,null,o,s)):pn(n,e,o,s),e.memoizedState=i.state,r&&Rp(e,t,!0),e.child}function tx(n){var e=n.stateNode;e.pendingContext?Ap(n,e.pendingContext,e.pendingContext!==e.context):e.context&&Ap(n,e.context,!1),Yh(n,e.containerInfo)}function jp(n,e,t,i,r){return Ws(),Hh(r),e.flags|=256,pn(n,e,t,i),e.child}var vd={dehydrated:null,treeContext:null,retryLane:0};function _d(n){return{baseLanes:n,cachePool:null,transitions:null}}function nx(n,e,t){var i=e.pendingProps,r=Ct.current,s=!1,a=(e.flags&128)!==0,o;if((o=a)||(o=n!==null&&n.memoizedState===null?!1:(r&2)!==0),o?(s=!0,e.flags&=-129):(n===null||n.memoizedState!==null)&&(r|=1),_t(Ct,r&1),n===null)return dd(e),n=e.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?(e.mode&1?n.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(a=i.children,n=i.fallback,s?(i=e.mode,s=e.child,a={mode:"hidden",children:a},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=a):s=mc(a,i,0,null),n=zr(n,i,t,null),s.return=e,n.return=e,s.sibling=n,e.child=s,e.child.memoizedState=_d(t),e.memoizedState=vd,n):nf(e,a));if(r=n.memoizedState,r!==null&&(o=r.dehydrated,o!==null))return Dy(n,e,a,i,o,r,t);if(s){s=i.fallback,a=e.mode,r=n.child,o=r.sibling;var l={mode:"hidden",children:i.children};return!(a&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=xr(r,l),i.subtreeFlags=r.subtreeFlags&14680064),o!==null?s=xr(o,s):(s=zr(s,a,t,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,a=n.child.memoizedState,a=a===null?_d(t):{baseLanes:a.baseLanes|t,cachePool:null,transitions:a.transitions},s.memoizedState=a,s.childLanes=n.childLanes&~t,e.memoizedState=vd,i}return s=n.child,n=s.sibling,i=xr(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=t),i.return=e,i.sibling=null,n!==null&&(t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)),e.child=i,e.memoizedState=null,i}function nf(n,e){return e=mc({mode:"visible",children:e},n.mode,0,null),e.return=n,n.child=e}function Lo(n,e,t,i){return i!==null&&Hh(i),js(e,n.child,null,t),n=nf(e,e.pendingProps.children),n.flags|=2,e.memoizedState=null,n}function Dy(n,e,t,i,r,s,a){if(t)return e.flags&256?(e.flags&=-257,i=$c(Error(ae(422))),Lo(n,e,a,i)):e.memoizedState!==null?(e.child=n.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=mc({mode:"visible",children:i.children},r,0,null),s=zr(s,r,a,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&js(e,n.child,null,a),e.child.memoizedState=_d(a),e.memoizedState=vd,s);if(!(e.mode&1))return Lo(n,e,a,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var o=i.dgst;return i=o,s=Error(ae(419)),i=$c(s,i,void 0),Lo(n,e,a,i)}if(o=(a&n.childLanes)!==0,Mn||o){if(i=Yt,i!==null){switch(a&-a){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|a)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Wi(n,r),ai(i,n,r,-1))}return cf(),i=$c(Error(ae(421))),Lo(n,e,a,i)}return r.data==="$?"?(e.flags|=128,e.child=n.child,e=$y.bind(null,n),r._reactRetry=e,null):(n=s.treeContext,Nn=fr(r.nextSibling),In=e,Tt=!0,ni=null,n!==null&&(zn[Vn++]=Ui,zn[Vn++]=Fi,zn[Vn++]=Gr,Ui=n.id,Fi=n.overflow,Gr=e),e=nf(e,i.children),e.flags|=4096,e)}function Xp(n,e,t){n.lanes|=e;var i=n.alternate;i!==null&&(i.lanes|=e),hd(n.return,e,t)}function Yc(n,e,t,i,r){var s=n.memoizedState;s===null?n.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:t,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=t,s.tailMode=r)}function ix(n,e,t){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(pn(n,e,i.children,t),i=Ct.current,i&2)i=i&1|2,e.flags|=128;else{if(n!==null&&n.flags&128)e:for(n=e.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&Xp(n,t,e);else if(n.tag===19)Xp(n,t,e);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break e;for(;n.sibling===null;){if(n.return===null||n.return===e)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}i&=1}if(_t(Ct,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(t=e.child,r=null;t!==null;)n=t.alternate,n!==null&&zl(n)===null&&(r=t),t=t.sibling;t=r,t===null?(r=e.child,e.child=null):(r=t.sibling,t.sibling=null),Yc(e,!1,r,t,s);break;case"backwards":for(t=null,r=e.child,e.child=null;r!==null;){if(n=r.alternate,n!==null&&zl(n)===null){e.child=r;break}n=r.sibling,r.sibling=t,t=r,r=n}Yc(e,!0,t,null,s);break;case"together":Yc(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function pl(n,e){!(e.mode&1)&&n!==null&&(n.alternate=null,e.alternate=null,e.flags|=2)}function ji(n,e,t){if(n!==null&&(e.dependencies=n.dependencies),jr|=e.lanes,!(t&e.childLanes))return null;if(n!==null&&e.child!==n.child)throw Error(ae(153));if(e.child!==null){for(n=e.child,t=xr(n,n.pendingProps),e.child=t,t.return=e;n.sibling!==null;)n=n.sibling,t=t.sibling=xr(n,n.pendingProps),t.return=e;t.sibling=null}return e.child}function Uy(n,e,t){switch(e.tag){case 3:tx(e),Ws();break;case 5:Rg(e);break;case 1:En(e.type)&&Dl(e);break;case 4:Yh(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;_t(Ol,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(_t(Ct,Ct.current&1),e.flags|=128,null):t&e.child.childLanes?nx(n,e,t):(_t(Ct,Ct.current&1),n=ji(n,e,t),n!==null?n.sibling:null);_t(Ct,Ct.current&1);break;case 19:if(i=(t&e.childLanes)!==0,n.flags&128){if(i)return ix(n,e,t);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),_t(Ct,Ct.current),i)break;return null;case 22:case 23:return e.lanes=0,Jg(n,e,t)}return ji(n,e,t)}var rx,yd,sx,ax;rx=function(n,e){for(var t=e.child;t!==null;){if(t.tag===5||t.tag===6)n.appendChild(t.stateNode);else if(t.tag!==4&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return;t=t.return}t.sibling.return=t.return,t=t.sibling}};yd=function(){};sx=function(n,e,t,i){var r=n.memoizedProps;if(r!==i){n=e.stateNode,Fr(Si.current);var s=null;switch(t){case"input":r=Hu(n,r),i=Hu(n,i),s=[];break;case"select":r=Pt({},r,{value:void 0}),i=Pt({},i,{value:void 0}),s=[];break;case"textarea":r=ju(n,r),i=ju(n,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(n.onclick=Nl)}$u(t,i);var a;t=null;for(c in r)if(!i.hasOwnProperty(c)&&r.hasOwnProperty(c)&&r[c]!=null)if(c==="style"){var o=r[c];for(a in o)o.hasOwnProperty(a)&&(t||(t={}),t[a]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(Ba.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in i){var l=i[c];if(o=r!=null?r[c]:void 0,i.hasOwnProperty(c)&&l!==o&&(l!=null||o!=null))if(c==="style")if(o){for(a in o)!o.hasOwnProperty(a)||l&&l.hasOwnProperty(a)||(t||(t={}),t[a]="");for(a in l)l.hasOwnProperty(a)&&o[a]!==l[a]&&(t||(t={}),t[a]=l[a])}else t||(s||(s=[]),s.push(c,t)),t=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,o=o?o.__html:void 0,l!=null&&o!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(Ba.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&St("scroll",n),s||o===l||(s=[])):(s=s||[]).push(c,l))}t&&(s=s||[]).push("style",t);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};ax=function(n,e,t,i){t!==i&&(e.flags|=4)};function ca(n,e){if(!Tt)switch(n.tailMode){case"hidden":e=n.tail;for(var t=null;e!==null;)e.alternate!==null&&(t=e),e=e.sibling;t===null?n.tail=null:t.sibling=null;break;case"collapsed":t=n.tail;for(var i=null;t!==null;)t.alternate!==null&&(i=t),t=t.sibling;i===null?e||n.tail===null?n.tail=null:n.tail.sibling=null:i.sibling=null}}function sn(n){var e=n.alternate!==null&&n.alternate.child===n.child,t=0,i=0;if(e)for(var r=n.child;r!==null;)t|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=n,r=r.sibling;else for(r=n.child;r!==null;)t|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=n,r=r.sibling;return n.subtreeFlags|=i,n.childLanes=t,e}function Fy(n,e,t){var i=e.pendingProps;switch(Vh(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return sn(e),null;case 1:return En(e.type)&&Il(),sn(e),null;case 3:return i=e.stateNode,Xs(),Mt(wn),Mt(un),Kh(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(n===null||n.child===null)&&(Ro(e)?e.flags|=4:n===null||n.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,ni!==null&&(Ad(ni),ni=null))),yd(n,e),sn(e),null;case 5:qh(e);var r=Fr(Za.current);if(t=e.type,n!==null&&e.stateNode!=null)sx(n,e,t,i,r),n.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(ae(166));return sn(e),null}if(n=Fr(Si.current),Ro(e)){i=e.stateNode,t=e.type;var s=e.memoizedProps;switch(i[xi]=e,i[qa]=s,n=(e.mode&1)!==0,t){case"dialog":St("cancel",i),St("close",i);break;case"iframe":case"object":case"embed":St("load",i);break;case"video":case"audio":for(r=0;r<wa.length;r++)St(wa[r],i);break;case"source":St("error",i);break;case"img":case"image":case"link":St("error",i),St("load",i);break;case"details":St("toggle",i);break;case"input":tp(i,s),St("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},St("invalid",i);break;case"textarea":ip(i,s),St("invalid",i)}$u(t,s),r=null;for(var a in s)if(s.hasOwnProperty(a)){var o=s[a];a==="children"?typeof o=="string"?i.textContent!==o&&(s.suppressHydrationWarning!==!0&&Ao(i.textContent,o,n),r=["children",o]):typeof o=="number"&&i.textContent!==""+o&&(s.suppressHydrationWarning!==!0&&Ao(i.textContent,o,n),r=["children",""+o]):Ba.hasOwnProperty(a)&&o!=null&&a==="onScroll"&&St("scroll",i)}switch(t){case"input":yo(i),np(i,s,!0);break;case"textarea":yo(i),rp(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=Nl)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{a=r.nodeType===9?r:r.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=D0(t)),n==="http://www.w3.org/1999/xhtml"?t==="script"?(n=a.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof i.is=="string"?n=a.createElement(t,{is:i.is}):(n=a.createElement(t),t==="select"&&(a=n,i.multiple?a.multiple=!0:i.size&&(a.size=i.size))):n=a.createElementNS(n,t),n[xi]=e,n[qa]=i,rx(n,e,!1,!1),e.stateNode=n;e:{switch(a=Yu(t,i),t){case"dialog":St("cancel",n),St("close",n),r=i;break;case"iframe":case"object":case"embed":St("load",n),r=i;break;case"video":case"audio":for(r=0;r<wa.length;r++)St(wa[r],n);r=i;break;case"source":St("error",n),r=i;break;case"img":case"image":case"link":St("error",n),St("load",n),r=i;break;case"details":St("toggle",n),r=i;break;case"input":tp(n,i),r=Hu(n,i),St("invalid",n);break;case"option":r=i;break;case"select":n._wrapperState={wasMultiple:!!i.multiple},r=Pt({},i,{value:void 0}),St("invalid",n);break;case"textarea":ip(n,i),r=ju(n,i),St("invalid",n);break;default:r=i}$u(t,r),o=r;for(s in o)if(o.hasOwnProperty(s)){var l=o[s];s==="style"?O0(n,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&U0(n,l)):s==="children"?typeof l=="string"?(t!=="textarea"||l!=="")&&za(n,l):typeof l=="number"&&za(n,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Ba.hasOwnProperty(s)?l!=null&&s==="onScroll"&&St("scroll",n):l!=null&&bh(n,s,l,a))}switch(t){case"input":yo(n),np(n,i,!1);break;case"textarea":yo(n),rp(n);break;case"option":i.value!=null&&n.setAttribute("value",""+_r(i.value));break;case"select":n.multiple=!!i.multiple,s=i.value,s!=null?Ds(n,!!i.multiple,s,!1):i.defaultValue!=null&&Ds(n,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(n.onclick=Nl)}switch(t){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return sn(e),null;case 6:if(n&&e.stateNode!=null)ax(n,e,n.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(ae(166));if(t=Fr(Za.current),Fr(Si.current),Ro(e)){if(i=e.stateNode,t=e.memoizedProps,i[xi]=e,(s=i.nodeValue!==t)&&(n=In,n!==null))switch(n.tag){case 3:Ao(i.nodeValue,t,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&Ao(i.nodeValue,t,(n.mode&1)!==0)}s&&(e.flags|=4)}else i=(t.nodeType===9?t:t.ownerDocument).createTextNode(i),i[xi]=e,e.stateNode=i}return sn(e),null;case 13:if(Mt(Ct),i=e.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(Tt&&Nn!==null&&e.mode&1&&!(e.flags&128))Eg(),Ws(),e.flags|=98560,s=!1;else if(s=Ro(e),i!==null&&i.dehydrated!==null){if(n===null){if(!s)throw Error(ae(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(ae(317));s[xi]=e}else Ws(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;sn(e),s=!1}else ni!==null&&(Ad(ni),ni=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=t,e):(i=i!==null,i!==(n!==null&&n.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(n===null||Ct.current&1?Vt===0&&(Vt=3):cf())),e.updateQueue!==null&&(e.flags|=4),sn(e),null);case 4:return Xs(),yd(n,e),n===null&&$a(e.stateNode.containerInfo),sn(e),null;case 10:return jh(e.type._context),sn(e),null;case 17:return En(e.type)&&Il(),sn(e),null;case 19:if(Mt(Ct),s=e.memoizedState,s===null)return sn(e),null;if(i=(e.flags&128)!==0,a=s.rendering,a===null)if(i)ca(s,!1);else{if(Vt!==0||n!==null&&n.flags&128)for(n=e.child;n!==null;){if(a=zl(n),a!==null){for(e.flags|=128,ca(s,!1),i=a.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=t,t=e.child;t!==null;)s=t,n=i,s.flags&=14680066,a=s.alternate,a===null?(s.childLanes=0,s.lanes=n,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=a.childLanes,s.lanes=a.lanes,s.child=a.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=a.memoizedProps,s.memoizedState=a.memoizedState,s.updateQueue=a.updateQueue,s.type=a.type,n=a.dependencies,s.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t=t.sibling;return _t(Ct,Ct.current&1|2),e.child}n=n.sibling}s.tail!==null&&Dt()>Ys&&(e.flags|=128,i=!0,ca(s,!1),e.lanes=4194304)}else{if(!i)if(n=zl(a),n!==null){if(e.flags|=128,i=!0,t=n.updateQueue,t!==null&&(e.updateQueue=t,e.flags|=4),ca(s,!0),s.tail===null&&s.tailMode==="hidden"&&!a.alternate&&!Tt)return sn(e),null}else 2*Dt()-s.renderingStartTime>Ys&&t!==1073741824&&(e.flags|=128,i=!0,ca(s,!1),e.lanes=4194304);s.isBackwards?(a.sibling=e.child,e.child=a):(t=s.last,t!==null?t.sibling=a:e.child=a,s.last=a)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Dt(),e.sibling=null,t=Ct.current,_t(Ct,i?t&1|2:t&1),e):(sn(e),null);case 22:case 23:return lf(),i=e.memoizedState!==null,n!==null&&n.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?Pn&1073741824&&(sn(e),e.subtreeFlags&6&&(e.flags|=8192)):sn(e),null;case 24:return null;case 25:return null}throw Error(ae(156,e.tag))}function Oy(n,e){switch(Vh(e),e.tag){case 1:return En(e.type)&&Il(),n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 3:return Xs(),Mt(wn),Mt(un),Kh(),n=e.flags,n&65536&&!(n&128)?(e.flags=n&-65537|128,e):null;case 5:return qh(e),null;case 13:if(Mt(Ct),n=e.memoizedState,n!==null&&n.dehydrated!==null){if(e.alternate===null)throw Error(ae(340));Ws()}return n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 19:return Mt(Ct),null;case 4:return Xs(),null;case 10:return jh(e.type._context),null;case 22:case 23:return lf(),null;case 24:return null;default:return null}}var No=!1,ln=!1,ky=typeof WeakSet=="function"?WeakSet:Set,Ee=null;function Ps(n,e){var t=n.ref;if(t!==null)if(typeof t=="function")try{t(null)}catch(i){Lt(n,e,i)}else t.current=null}function Sd(n,e,t){try{t()}catch(i){Lt(n,e,i)}}var $p=!1;function By(n,e){if(rd=Rl,n=dg(),Bh(n)){if("selectionStart"in n)var t={start:n.selectionStart,end:n.selectionEnd};else e:{t=(t=n.ownerDocument)&&t.defaultView||window;var i=t.getSelection&&t.getSelection();if(i&&i.rangeCount!==0){t=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{t.nodeType,s.nodeType}catch{t=null;break e}var a=0,o=-1,l=-1,c=0,h=0,u=n,d=null;t:for(;;){for(var p;u!==t||r!==0&&u.nodeType!==3||(o=a+r),u!==s||i!==0&&u.nodeType!==3||(l=a+i),u.nodeType===3&&(a+=u.nodeValue.length),(p=u.firstChild)!==null;)d=u,u=p;for(;;){if(u===n)break t;if(d===t&&++c===r&&(o=a),d===s&&++h===i&&(l=a),(p=u.nextSibling)!==null)break;u=d,d=u.parentNode}u=p}t=o===-1||l===-1?null:{start:o,end:l}}else t=null}t=t||{start:0,end:0}}else t=null;for(sd={focusedElem:n,selectionRange:t},Rl=!1,Ee=e;Ee!==null;)if(e=Ee,n=e.child,(e.subtreeFlags&1028)!==0&&n!==null)n.return=e,Ee=n;else for(;Ee!==null;){e=Ee;try{var g=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(g!==null){var M=g.memoizedProps,x=g.memoizedState,f=e.stateNode,v=f.getSnapshotBeforeUpdate(e.elementType===e.type?M:ei(e.type,M),x);f.__reactInternalSnapshotBeforeUpdate=v}break;case 3:var E=e.stateNode.containerInfo;E.nodeType===1?E.textContent="":E.nodeType===9&&E.documentElement&&E.removeChild(E.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(ae(163))}}catch(S){Lt(e,e.return,S)}if(n=e.sibling,n!==null){n.return=e.return,Ee=n;break}Ee=e.return}return g=$p,$p=!1,g}function Na(n,e,t){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&n)===n){var s=r.destroy;r.destroy=void 0,s!==void 0&&Sd(e,t,s)}r=r.next}while(r!==i)}}function fc(n,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var t=e=e.next;do{if((t.tag&n)===n){var i=t.create;t.destroy=i()}t=t.next}while(t!==e)}}function Md(n){var e=n.ref;if(e!==null){var t=n.stateNode;switch(n.tag){case 5:n=t;break;default:n=t}typeof e=="function"?e(n):e.current=n}}function ox(n){var e=n.alternate;e!==null&&(n.alternate=null,ox(e)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(e=n.stateNode,e!==null&&(delete e[xi],delete e[qa],delete e[ld],delete e[Sy],delete e[My])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function lx(n){return n.tag===5||n.tag===3||n.tag===4}function Yp(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||lx(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function wd(n,e,t){var i=n.tag;if(i===5||i===6)n=n.stateNode,e?t.nodeType===8?t.parentNode.insertBefore(n,e):t.insertBefore(n,e):(t.nodeType===8?(e=t.parentNode,e.insertBefore(n,t)):(e=t,e.appendChild(n)),t=t._reactRootContainer,t!=null||e.onclick!==null||(e.onclick=Nl));else if(i!==4&&(n=n.child,n!==null))for(wd(n,e,t),n=n.sibling;n!==null;)wd(n,e,t),n=n.sibling}function Ed(n,e,t){var i=n.tag;if(i===5||i===6)n=n.stateNode,e?t.insertBefore(n,e):t.appendChild(n);else if(i!==4&&(n=n.child,n!==null))for(Ed(n,e,t),n=n.sibling;n!==null;)Ed(n,e,t),n=n.sibling}var Kt=null,ti=!1;function Zi(n,e,t){for(t=t.child;t!==null;)cx(n,e,t),t=t.sibling}function cx(n,e,t){if(yi&&typeof yi.onCommitFiberUnmount=="function")try{yi.onCommitFiberUnmount(sc,t)}catch{}switch(t.tag){case 5:ln||Ps(t,e);case 6:var i=Kt,r=ti;Kt=null,Zi(n,e,t),Kt=i,ti=r,Kt!==null&&(ti?(n=Kt,t=t.stateNode,n.nodeType===8?n.parentNode.removeChild(t):n.removeChild(t)):Kt.removeChild(t.stateNode));break;case 18:Kt!==null&&(ti?(n=Kt,t=t.stateNode,n.nodeType===8?Vc(n.parentNode,t):n.nodeType===1&&Vc(n,t),Wa(n)):Vc(Kt,t.stateNode));break;case 4:i=Kt,r=ti,Kt=t.stateNode.containerInfo,ti=!0,Zi(n,e,t),Kt=i,ti=r;break;case 0:case 11:case 14:case 15:if(!ln&&(i=t.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,a=s.destroy;s=s.tag,a!==void 0&&(s&2||s&4)&&Sd(t,e,a),r=r.next}while(r!==i)}Zi(n,e,t);break;case 1:if(!ln&&(Ps(t,e),i=t.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=t.memoizedProps,i.state=t.memoizedState,i.componentWillUnmount()}catch(o){Lt(t,e,o)}Zi(n,e,t);break;case 21:Zi(n,e,t);break;case 22:t.mode&1?(ln=(i=ln)||t.memoizedState!==null,Zi(n,e,t),ln=i):Zi(n,e,t);break;default:Zi(n,e,t)}}function qp(n){var e=n.updateQueue;if(e!==null){n.updateQueue=null;var t=n.stateNode;t===null&&(t=n.stateNode=new ky),e.forEach(function(i){var r=Yy.bind(null,n,i);t.has(i)||(t.add(i),i.then(r,r))})}}function Kn(n,e){var t=e.deletions;if(t!==null)for(var i=0;i<t.length;i++){var r=t[i];try{var s=n,a=e,o=a;e:for(;o!==null;){switch(o.tag){case 5:Kt=o.stateNode,ti=!1;break e;case 3:Kt=o.stateNode.containerInfo,ti=!0;break e;case 4:Kt=o.stateNode.containerInfo,ti=!0;break e}o=o.return}if(Kt===null)throw Error(ae(160));cx(s,a,r),Kt=null,ti=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(c){Lt(r,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)ux(e,n),e=e.sibling}function ux(n,e){var t=n.alternate,i=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(Kn(e,n),di(n),i&4){try{Na(3,n,n.return),fc(3,n)}catch(M){Lt(n,n.return,M)}try{Na(5,n,n.return)}catch(M){Lt(n,n.return,M)}}break;case 1:Kn(e,n),di(n),i&512&&t!==null&&Ps(t,t.return);break;case 5:if(Kn(e,n),di(n),i&512&&t!==null&&Ps(t,t.return),n.flags&32){var r=n.stateNode;try{za(r,"")}catch(M){Lt(n,n.return,M)}}if(i&4&&(r=n.stateNode,r!=null)){var s=n.memoizedProps,a=t!==null?t.memoizedProps:s,o=n.type,l=n.updateQueue;if(n.updateQueue=null,l!==null)try{o==="input"&&s.type==="radio"&&s.name!=null&&N0(r,s),Yu(o,a);var c=Yu(o,s);for(a=0;a<l.length;a+=2){var h=l[a],u=l[a+1];h==="style"?O0(r,u):h==="dangerouslySetInnerHTML"?U0(r,u):h==="children"?za(r,u):bh(r,h,u,c)}switch(o){case"input":Gu(r,s);break;case"textarea":I0(r,s);break;case"select":var d=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var p=s.value;p!=null?Ds(r,!!s.multiple,p,!1):d!==!!s.multiple&&(s.defaultValue!=null?Ds(r,!!s.multiple,s.defaultValue,!0):Ds(r,!!s.multiple,s.multiple?[]:"",!1))}r[qa]=s}catch(M){Lt(n,n.return,M)}}break;case 6:if(Kn(e,n),di(n),i&4){if(n.stateNode===null)throw Error(ae(162));r=n.stateNode,s=n.memoizedProps;try{r.nodeValue=s}catch(M){Lt(n,n.return,M)}}break;case 3:if(Kn(e,n),di(n),i&4&&t!==null&&t.memoizedState.isDehydrated)try{Wa(e.containerInfo)}catch(M){Lt(n,n.return,M)}break;case 4:Kn(e,n),di(n);break;case 13:Kn(e,n),di(n),r=n.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(af=Dt())),i&4&&qp(n);break;case 22:if(h=t!==null&&t.memoizedState!==null,n.mode&1?(ln=(c=ln)||h,Kn(e,n),ln=c):Kn(e,n),di(n),i&8192){if(c=n.memoizedState!==null,(n.stateNode.isHidden=c)&&!h&&n.mode&1)for(Ee=n,h=n.child;h!==null;){for(u=Ee=h;Ee!==null;){switch(d=Ee,p=d.child,d.tag){case 0:case 11:case 14:case 15:Na(4,d,d.return);break;case 1:Ps(d,d.return);var g=d.stateNode;if(typeof g.componentWillUnmount=="function"){i=d,t=d.return;try{e=i,g.props=e.memoizedProps,g.state=e.memoizedState,g.componentWillUnmount()}catch(M){Lt(i,t,M)}}break;case 5:Ps(d,d.return);break;case 22:if(d.memoizedState!==null){Zp(u);continue}}p!==null?(p.return=d,Ee=p):Zp(u)}h=h.sibling}e:for(h=null,u=n;;){if(u.tag===5){if(h===null){h=u;try{r=u.stateNode,c?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(o=u.stateNode,l=u.memoizedProps.style,a=l!=null&&l.hasOwnProperty("display")?l.display:null,o.style.display=F0("display",a))}catch(M){Lt(n,n.return,M)}}}else if(u.tag===6){if(h===null)try{u.stateNode.nodeValue=c?"":u.memoizedProps}catch(M){Lt(n,n.return,M)}}else if((u.tag!==22&&u.tag!==23||u.memoizedState===null||u===n)&&u.child!==null){u.child.return=u,u=u.child;continue}if(u===n)break e;for(;u.sibling===null;){if(u.return===null||u.return===n)break e;h===u&&(h=null),u=u.return}h===u&&(h=null),u.sibling.return=u.return,u=u.sibling}}break;case 19:Kn(e,n),di(n),i&4&&qp(n);break;case 21:break;default:Kn(e,n),di(n)}}function di(n){var e=n.flags;if(e&2){try{e:{for(var t=n.return;t!==null;){if(lx(t)){var i=t;break e}t=t.return}throw Error(ae(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(za(r,""),i.flags&=-33);var s=Yp(n);Ed(n,s,r);break;case 3:case 4:var a=i.stateNode.containerInfo,o=Yp(n);wd(n,o,a);break;default:throw Error(ae(161))}}catch(l){Lt(n,n.return,l)}n.flags&=-3}e&4096&&(n.flags&=-4097)}function zy(n,e,t){Ee=n,dx(n)}function dx(n,e,t){for(var i=(n.mode&1)!==0;Ee!==null;){var r=Ee,s=r.child;if(r.tag===22&&i){var a=r.memoizedState!==null||No;if(!a){var o=r.alternate,l=o!==null&&o.memoizedState!==null||ln;o=No;var c=ln;if(No=a,(ln=l)&&!c)for(Ee=r;Ee!==null;)a=Ee,l=a.child,a.tag===22&&a.memoizedState!==null?Qp(r):l!==null?(l.return=a,Ee=l):Qp(r);for(;s!==null;)Ee=s,dx(s),s=s.sibling;Ee=r,No=o,ln=c}Kp(n)}else r.subtreeFlags&8772&&s!==null?(s.return=r,Ee=s):Kp(n)}}function Kp(n){for(;Ee!==null;){var e=Ee;if(e.flags&8772){var t=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:ln||fc(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!ln)if(t===null)i.componentDidMount();else{var r=e.elementType===e.type?t.memoizedProps:ei(e.type,t.memoizedProps);i.componentDidUpdate(r,t.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&Dp(e,s,i);break;case 3:var a=e.updateQueue;if(a!==null){if(t=null,e.child!==null)switch(e.child.tag){case 5:t=e.child.stateNode;break;case 1:t=e.child.stateNode}Dp(e,a,t)}break;case 5:var o=e.stateNode;if(t===null&&e.flags&4){t=o;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&t.focus();break;case"img":l.src&&(t.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var h=c.memoizedState;if(h!==null){var u=h.dehydrated;u!==null&&Wa(u)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(ae(163))}ln||e.flags&512&&Md(e)}catch(d){Lt(e,e.return,d)}}if(e===n){Ee=null;break}if(t=e.sibling,t!==null){t.return=e.return,Ee=t;break}Ee=e.return}}function Zp(n){for(;Ee!==null;){var e=Ee;if(e===n){Ee=null;break}var t=e.sibling;if(t!==null){t.return=e.return,Ee=t;break}Ee=e.return}}function Qp(n){for(;Ee!==null;){var e=Ee;try{switch(e.tag){case 0:case 11:case 15:var t=e.return;try{fc(4,e)}catch(l){Lt(e,t,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){Lt(e,r,l)}}var s=e.return;try{Md(e)}catch(l){Lt(e,s,l)}break;case 5:var a=e.return;try{Md(e)}catch(l){Lt(e,a,l)}}}catch(l){Lt(e,e.return,l)}if(e===n){Ee=null;break}var o=e.sibling;if(o!==null){o.return=e.return,Ee=o;break}Ee=e.return}}var Vy=Math.ceil,Gl=$i.ReactCurrentDispatcher,rf=$i.ReactCurrentOwner,jn=$i.ReactCurrentBatchConfig,rt=0,Yt=null,kt=null,Jt=0,Pn=0,Ls=wr(0),Vt=0,to=null,jr=0,pc=0,sf=0,Ia=null,yn=null,af=0,Ys=1/0,Ni=null,Wl=!1,Td=null,mr=null,Io=!1,cr=null,jl=0,Da=0,bd=null,ml=-1,gl=0;function mn(){return rt&6?Dt():ml!==-1?ml:ml=Dt()}function gr(n){return n.mode&1?rt&2&&Jt!==0?Jt&-Jt:Ey.transition!==null?(gl===0&&(gl=q0()),gl):(n=ft,n!==0||(n=window.event,n=n===void 0?16:ng(n.type)),n):1}function ai(n,e,t,i){if(50<Da)throw Da=0,bd=null,Error(ae(185));uo(n,t,i),(!(rt&2)||n!==Yt)&&(n===Yt&&(!(rt&2)&&(pc|=t),Vt===4&&ar(n,Jt)),Tn(n,i),t===1&&rt===0&&!(e.mode&1)&&(Ys=Dt()+500,uc&&Er()))}function Tn(n,e){var t=n.callbackNode;E_(n,e);var i=Al(n,n===Yt?Jt:0);if(i===0)t!==null&&op(t),n.callbackNode=null,n.callbackPriority=0;else if(e=i&-i,n.callbackPriority!==e){if(t!=null&&op(t),e===1)n.tag===0?wy(Jp.bind(null,n)):Sg(Jp.bind(null,n)),_y(function(){!(rt&6)&&Er()}),t=null;else{switch(K0(i)){case 1:t=Lh;break;case 4:t=$0;break;case 16:t=Cl;break;case 536870912:t=Y0;break;default:t=Cl}t=_x(t,hx.bind(null,n))}n.callbackPriority=e,n.callbackNode=t}}function hx(n,e){if(ml=-1,gl=0,rt&6)throw Error(ae(327));var t=n.callbackNode;if(Bs()&&n.callbackNode!==t)return null;var i=Al(n,n===Yt?Jt:0);if(i===0)return null;if(i&30||i&n.expiredLanes||e)e=Xl(n,i);else{e=i;var r=rt;rt|=2;var s=px();(Yt!==n||Jt!==e)&&(Ni=null,Ys=Dt()+500,Br(n,e));do try{Wy();break}catch(o){fx(n,o)}while(!0);Wh(),Gl.current=s,rt=r,kt!==null?e=0:(Yt=null,Jt=0,e=Vt)}if(e!==0){if(e===2&&(r=Ju(n),r!==0&&(i=r,e=Cd(n,r))),e===1)throw t=to,Br(n,0),ar(n,i),Tn(n,Dt()),t;if(e===6)ar(n,i);else{if(r=n.current.alternate,!(i&30)&&!Hy(r)&&(e=Xl(n,i),e===2&&(s=Ju(n),s!==0&&(i=s,e=Cd(n,s))),e===1))throw t=to,Br(n,0),ar(n,i),Tn(n,Dt()),t;switch(n.finishedWork=r,n.finishedLanes=i,e){case 0:case 1:throw Error(ae(345));case 2:Nr(n,yn,Ni);break;case 3:if(ar(n,i),(i&130023424)===i&&(e=af+500-Dt(),10<e)){if(Al(n,0)!==0)break;if(r=n.suspendedLanes,(r&i)!==i){mn(),n.pingedLanes|=n.suspendedLanes&r;break}n.timeoutHandle=od(Nr.bind(null,n,yn,Ni),e);break}Nr(n,yn,Ni);break;case 4:if(ar(n,i),(i&4194240)===i)break;for(e=n.eventTimes,r=-1;0<i;){var a=31-si(i);s=1<<a,a=e[a],a>r&&(r=a),i&=~s}if(i=r,i=Dt()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*Vy(i/1960))-i,10<i){n.timeoutHandle=od(Nr.bind(null,n,yn,Ni),i);break}Nr(n,yn,Ni);break;case 5:Nr(n,yn,Ni);break;default:throw Error(ae(329))}}}return Tn(n,Dt()),n.callbackNode===t?hx.bind(null,n):null}function Cd(n,e){var t=Ia;return n.current.memoizedState.isDehydrated&&(Br(n,e).flags|=256),n=Xl(n,e),n!==2&&(e=yn,yn=t,e!==null&&Ad(e)),n}function Ad(n){yn===null?yn=n:yn.push.apply(yn,n)}function Hy(n){for(var e=n;;){if(e.flags&16384){var t=e.updateQueue;if(t!==null&&(t=t.stores,t!==null))for(var i=0;i<t.length;i++){var r=t[i],s=r.getSnapshot;r=r.value;try{if(!li(s(),r))return!1}catch{return!1}}}if(t=e.child,e.subtreeFlags&16384&&t!==null)t.return=e,e=t;else{if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function ar(n,e){for(e&=~sf,e&=~pc,n.suspendedLanes|=e,n.pingedLanes&=~e,n=n.expirationTimes;0<e;){var t=31-si(e),i=1<<t;n[t]=-1,e&=~i}}function Jp(n){if(rt&6)throw Error(ae(327));Bs();var e=Al(n,0);if(!(e&1))return Tn(n,Dt()),null;var t=Xl(n,e);if(n.tag!==0&&t===2){var i=Ju(n);i!==0&&(e=i,t=Cd(n,i))}if(t===1)throw t=to,Br(n,0),ar(n,e),Tn(n,Dt()),t;if(t===6)throw Error(ae(345));return n.finishedWork=n.current.alternate,n.finishedLanes=e,Nr(n,yn,Ni),Tn(n,Dt()),null}function of(n,e){var t=rt;rt|=1;try{return n(e)}finally{rt=t,rt===0&&(Ys=Dt()+500,uc&&Er())}}function Xr(n){cr!==null&&cr.tag===0&&!(rt&6)&&Bs();var e=rt;rt|=1;var t=jn.transition,i=ft;try{if(jn.transition=null,ft=1,n)return n()}finally{ft=i,jn.transition=t,rt=e,!(rt&6)&&Er()}}function lf(){Pn=Ls.current,Mt(Ls)}function Br(n,e){n.finishedWork=null,n.finishedLanes=0;var t=n.timeoutHandle;if(t!==-1&&(n.timeoutHandle=-1,vy(t)),kt!==null)for(t=kt.return;t!==null;){var i=t;switch(Vh(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&Il();break;case 3:Xs(),Mt(wn),Mt(un),Kh();break;case 5:qh(i);break;case 4:Xs();break;case 13:Mt(Ct);break;case 19:Mt(Ct);break;case 10:jh(i.type._context);break;case 22:case 23:lf()}t=t.return}if(Yt=n,kt=n=xr(n.current,null),Jt=Pn=e,Vt=0,to=null,sf=pc=jr=0,yn=Ia=null,Ur!==null){for(e=0;e<Ur.length;e++)if(t=Ur[e],i=t.interleaved,i!==null){t.interleaved=null;var r=i.next,s=t.pending;if(s!==null){var a=s.next;s.next=r,i.next=a}t.pending=i}Ur=null}return n}function fx(n,e){do{var t=kt;try{if(Wh(),hl.current=Hl,Vl){for(var i=Rt.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Vl=!1}if(Wr=0,Xt=zt=Rt=null,La=!1,Qa=0,rf.current=null,t===null||t.return===null){Vt=1,to=e,kt=null;break}e:{var s=n,a=t.return,o=t,l=e;if(e=Jt,o.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,h=o,u=h.tag;if(!(h.mode&1)&&(u===0||u===11||u===15)){var d=h.alternate;d?(h.updateQueue=d.updateQueue,h.memoizedState=d.memoizedState,h.lanes=d.lanes):(h.updateQueue=null,h.memoizedState=null)}var p=zp(a);if(p!==null){p.flags&=-257,Vp(p,a,o,s,e),p.mode&1&&Bp(s,c,e),e=p,l=c;var g=e.updateQueue;if(g===null){var M=new Set;M.add(l),e.updateQueue=M}else g.add(l);break e}else{if(!(e&1)){Bp(s,c,e),cf();break e}l=Error(ae(426))}}else if(Tt&&o.mode&1){var x=zp(a);if(x!==null){!(x.flags&65536)&&(x.flags|=256),Vp(x,a,o,s,e),Hh($s(l,o));break e}}s=l=$s(l,o),Vt!==4&&(Vt=2),Ia===null?Ia=[s]:Ia.push(s),s=a;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var f=Kg(s,l,e);Ip(s,f);break e;case 1:o=l;var v=s.type,E=s.stateNode;if(!(s.flags&128)&&(typeof v.getDerivedStateFromError=="function"||E!==null&&typeof E.componentDidCatch=="function"&&(mr===null||!mr.has(E)))){s.flags|=65536,e&=-e,s.lanes|=e;var S=Zg(s,o,e);Ip(s,S);break e}}s=s.return}while(s!==null)}gx(t)}catch(T){e=T,kt===t&&t!==null&&(kt=t=t.return);continue}break}while(!0)}function px(){var n=Gl.current;return Gl.current=Hl,n===null?Hl:n}function cf(){(Vt===0||Vt===3||Vt===2)&&(Vt=4),Yt===null||!(jr&268435455)&&!(pc&268435455)||ar(Yt,Jt)}function Xl(n,e){var t=rt;rt|=2;var i=px();(Yt!==n||Jt!==e)&&(Ni=null,Br(n,e));do try{Gy();break}catch(r){fx(n,r)}while(!0);if(Wh(),rt=t,Gl.current=i,kt!==null)throw Error(ae(261));return Yt=null,Jt=0,Vt}function Gy(){for(;kt!==null;)mx(kt)}function Wy(){for(;kt!==null&&!m_();)mx(kt)}function mx(n){var e=vx(n.alternate,n,Pn);n.memoizedProps=n.pendingProps,e===null?gx(n):kt=e,rf.current=null}function gx(n){var e=n;do{var t=e.alternate;if(n=e.return,e.flags&32768){if(t=Oy(t,e),t!==null){t.flags&=32767,kt=t;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{Vt=6,kt=null;return}}else if(t=Fy(t,e,Pn),t!==null){kt=t;return}if(e=e.sibling,e!==null){kt=e;return}kt=e=n}while(e!==null);Vt===0&&(Vt=5)}function Nr(n,e,t){var i=ft,r=jn.transition;try{jn.transition=null,ft=1,jy(n,e,t,i)}finally{jn.transition=r,ft=i}return null}function jy(n,e,t,i){do Bs();while(cr!==null);if(rt&6)throw Error(ae(327));t=n.finishedWork;var r=n.finishedLanes;if(t===null)return null;if(n.finishedWork=null,n.finishedLanes=0,t===n.current)throw Error(ae(177));n.callbackNode=null,n.callbackPriority=0;var s=t.lanes|t.childLanes;if(T_(n,s),n===Yt&&(kt=Yt=null,Jt=0),!(t.subtreeFlags&2064)&&!(t.flags&2064)||Io||(Io=!0,_x(Cl,function(){return Bs(),null})),s=(t.flags&15990)!==0,t.subtreeFlags&15990||s){s=jn.transition,jn.transition=null;var a=ft;ft=1;var o=rt;rt|=4,rf.current=null,By(n,t),ux(t,n),dy(sd),Rl=!!rd,sd=rd=null,n.current=t,zy(t),g_(),rt=o,ft=a,jn.transition=s}else n.current=t;if(Io&&(Io=!1,cr=n,jl=r),s=n.pendingLanes,s===0&&(mr=null),__(t.stateNode),Tn(n,Dt()),e!==null)for(i=n.onRecoverableError,t=0;t<e.length;t++)r=e[t],i(r.value,{componentStack:r.stack,digest:r.digest});if(Wl)throw Wl=!1,n=Td,Td=null,n;return jl&1&&n.tag!==0&&Bs(),s=n.pendingLanes,s&1?n===bd?Da++:(Da=0,bd=n):Da=0,Er(),null}function Bs(){if(cr!==null){var n=K0(jl),e=jn.transition,t=ft;try{if(jn.transition=null,ft=16>n?16:n,cr===null)var i=!1;else{if(n=cr,cr=null,jl=0,rt&6)throw Error(ae(331));var r=rt;for(rt|=4,Ee=n.current;Ee!==null;){var s=Ee,a=s.child;if(Ee.flags&16){var o=s.deletions;if(o!==null){for(var l=0;l<o.length;l++){var c=o[l];for(Ee=c;Ee!==null;){var h=Ee;switch(h.tag){case 0:case 11:case 15:Na(8,h,s)}var u=h.child;if(u!==null)u.return=h,Ee=u;else for(;Ee!==null;){h=Ee;var d=h.sibling,p=h.return;if(ox(h),h===c){Ee=null;break}if(d!==null){d.return=p,Ee=d;break}Ee=p}}}var g=s.alternate;if(g!==null){var M=g.child;if(M!==null){g.child=null;do{var x=M.sibling;M.sibling=null,M=x}while(M!==null)}}Ee=s}}if(s.subtreeFlags&2064&&a!==null)a.return=s,Ee=a;else e:for(;Ee!==null;){if(s=Ee,s.flags&2048)switch(s.tag){case 0:case 11:case 15:Na(9,s,s.return)}var f=s.sibling;if(f!==null){f.return=s.return,Ee=f;break e}Ee=s.return}}var v=n.current;for(Ee=v;Ee!==null;){a=Ee;var E=a.child;if(a.subtreeFlags&2064&&E!==null)E.return=a,Ee=E;else e:for(a=v;Ee!==null;){if(o=Ee,o.flags&2048)try{switch(o.tag){case 0:case 11:case 15:fc(9,o)}}catch(T){Lt(o,o.return,T)}if(o===a){Ee=null;break e}var S=o.sibling;if(S!==null){S.return=o.return,Ee=S;break e}Ee=o.return}}if(rt=r,Er(),yi&&typeof yi.onPostCommitFiberRoot=="function")try{yi.onPostCommitFiberRoot(sc,n)}catch{}i=!0}return i}finally{ft=t,jn.transition=e}}return!1}function em(n,e,t){e=$s(t,e),e=Kg(n,e,1),n=pr(n,e,1),e=mn(),n!==null&&(uo(n,1,e),Tn(n,e))}function Lt(n,e,t){if(n.tag===3)em(n,n,t);else for(;e!==null;){if(e.tag===3){em(e,n,t);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(mr===null||!mr.has(i))){n=$s(t,n),n=Zg(e,n,1),e=pr(e,n,1),n=mn(),e!==null&&(uo(e,1,n),Tn(e,n));break}}e=e.return}}function Xy(n,e,t){var i=n.pingCache;i!==null&&i.delete(e),e=mn(),n.pingedLanes|=n.suspendedLanes&t,Yt===n&&(Jt&t)===t&&(Vt===4||Vt===3&&(Jt&130023424)===Jt&&500>Dt()-af?Br(n,0):sf|=t),Tn(n,e)}function xx(n,e){e===0&&(n.mode&1?(e=wo,wo<<=1,!(wo&130023424)&&(wo=4194304)):e=1);var t=mn();n=Wi(n,e),n!==null&&(uo(n,e,t),Tn(n,t))}function $y(n){var e=n.memoizedState,t=0;e!==null&&(t=e.retryLane),xx(n,t)}function Yy(n,e){var t=0;switch(n.tag){case 13:var i=n.stateNode,r=n.memoizedState;r!==null&&(t=r.retryLane);break;case 19:i=n.stateNode;break;default:throw Error(ae(314))}i!==null&&i.delete(e),xx(n,t)}var vx;vx=function(n,e,t){if(n!==null)if(n.memoizedProps!==e.pendingProps||wn.current)Mn=!0;else{if(!(n.lanes&t)&&!(e.flags&128))return Mn=!1,Uy(n,e,t);Mn=!!(n.flags&131072)}else Mn=!1,Tt&&e.flags&1048576&&Mg(e,Fl,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;pl(n,e),n=e.pendingProps;var r=Gs(e,un.current);ks(e,t),r=Qh(null,e,i,n,r,t);var s=Jh();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,En(i)?(s=!0,Dl(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,$h(e),r.updater=hc,e.stateNode=r,r._reactInternals=e,pd(e,i,n,t),e=xd(null,e,i,!0,s,t)):(e.tag=0,Tt&&s&&zh(e),pn(null,e,r,t),e=e.child),e;case 16:i=e.elementType;e:{switch(pl(n,e),n=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=Ky(i),n=ei(i,n),r){case 0:e=gd(null,e,i,n,t);break e;case 1:e=Wp(null,e,i,n,t);break e;case 11:e=Hp(null,e,i,n,t);break e;case 14:e=Gp(null,e,i,ei(i.type,n),t);break e}throw Error(ae(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ei(i,r),gd(n,e,i,r,t);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ei(i,r),Wp(n,e,i,r,t);case 3:e:{if(tx(e),n===null)throw Error(ae(387));i=e.pendingProps,s=e.memoizedState,r=s.element,Ag(n,e),Bl(e,i,null,t);var a=e.memoizedState;if(i=a.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=$s(Error(ae(423)),e),e=jp(n,e,i,t,r);break e}else if(i!==r){r=$s(Error(ae(424)),e),e=jp(n,e,i,t,r);break e}else for(Nn=fr(e.stateNode.containerInfo.firstChild),In=e,Tt=!0,ni=null,t=bg(e,null,i,t),e.child=t;t;)t.flags=t.flags&-3|4096,t=t.sibling;else{if(Ws(),i===r){e=ji(n,e,t);break e}pn(n,e,i,t)}e=e.child}return e;case 5:return Rg(e),n===null&&dd(e),i=e.type,r=e.pendingProps,s=n!==null?n.memoizedProps:null,a=r.children,ad(i,r)?a=null:s!==null&&ad(i,s)&&(e.flags|=32),ex(n,e),pn(n,e,a,t),e.child;case 6:return n===null&&dd(e),null;case 13:return nx(n,e,t);case 4:return Yh(e,e.stateNode.containerInfo),i=e.pendingProps,n===null?e.child=js(e,null,i,t):pn(n,e,i,t),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ei(i,r),Hp(n,e,i,r,t);case 7:return pn(n,e,e.pendingProps,t),e.child;case 8:return pn(n,e,e.pendingProps.children,t),e.child;case 12:return pn(n,e,e.pendingProps.children,t),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,a=r.value,_t(Ol,i._currentValue),i._currentValue=a,s!==null)if(li(s.value,a)){if(s.children===r.children&&!wn.current){e=ji(n,e,t);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var o=s.dependencies;if(o!==null){a=s.child;for(var l=o.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=ki(-1,t&-t),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var h=c.pending;h===null?l.next=l:(l.next=h.next,h.next=l),c.pending=l}}s.lanes|=t,l=s.alternate,l!==null&&(l.lanes|=t),hd(s.return,t,e),o.lanes|=t;break}l=l.next}}else if(s.tag===10)a=s.type===e.type?null:s.child;else if(s.tag===18){if(a=s.return,a===null)throw Error(ae(341));a.lanes|=t,o=a.alternate,o!==null&&(o.lanes|=t),hd(a,t,e),a=s.sibling}else a=s.child;if(a!==null)a.return=s;else for(a=s;a!==null;){if(a===e){a=null;break}if(s=a.sibling,s!==null){s.return=a.return,a=s;break}a=a.return}s=a}pn(n,e,r.children,t),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,ks(e,t),r=$n(r),i=i(r),e.flags|=1,pn(n,e,i,t),e.child;case 14:return i=e.type,r=ei(i,e.pendingProps),r=ei(i.type,r),Gp(n,e,i,r,t);case 15:return Qg(n,e,e.type,e.pendingProps,t);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ei(i,r),pl(n,e),e.tag=1,En(i)?(n=!0,Dl(e)):n=!1,ks(e,t),qg(e,i,r),pd(e,i,r,t),xd(null,e,i,!0,n,t);case 19:return ix(n,e,t);case 22:return Jg(n,e,t)}throw Error(ae(156,e.tag))};function _x(n,e){return X0(n,e)}function qy(n,e,t,i){this.tag=n,this.key=t,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Wn(n,e,t,i){return new qy(n,e,t,i)}function uf(n){return n=n.prototype,!(!n||!n.isReactComponent)}function Ky(n){if(typeof n=="function")return uf(n)?1:0;if(n!=null){if(n=n.$$typeof,n===Ah)return 11;if(n===Rh)return 14}return 2}function xr(n,e){var t=n.alternate;return t===null?(t=Wn(n.tag,e,n.key,n.mode),t.elementType=n.elementType,t.type=n.type,t.stateNode=n.stateNode,t.alternate=n,n.alternate=t):(t.pendingProps=e,t.type=n.type,t.flags=0,t.subtreeFlags=0,t.deletions=null),t.flags=n.flags&14680064,t.childLanes=n.childLanes,t.lanes=n.lanes,t.child=n.child,t.memoizedProps=n.memoizedProps,t.memoizedState=n.memoizedState,t.updateQueue=n.updateQueue,e=n.dependencies,t.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},t.sibling=n.sibling,t.index=n.index,t.ref=n.ref,t}function xl(n,e,t,i,r,s){var a=2;if(i=n,typeof n=="function")uf(n)&&(a=1);else if(typeof n=="string")a=5;else e:switch(n){case Ss:return zr(t.children,r,s,e);case Ch:a=8,r|=8;break;case ku:return n=Wn(12,t,e,r|2),n.elementType=ku,n.lanes=s,n;case Bu:return n=Wn(13,t,e,r),n.elementType=Bu,n.lanes=s,n;case zu:return n=Wn(19,t,e,r),n.elementType=zu,n.lanes=s,n;case R0:return mc(t,r,s,e);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case C0:a=10;break e;case A0:a=9;break e;case Ah:a=11;break e;case Rh:a=14;break e;case ir:a=16,i=null;break e}throw Error(ae(130,n==null?n:typeof n,""))}return e=Wn(a,t,e,r),e.elementType=n,e.type=i,e.lanes=s,e}function zr(n,e,t,i){return n=Wn(7,n,i,e),n.lanes=t,n}function mc(n,e,t,i){return n=Wn(22,n,i,e),n.elementType=R0,n.lanes=t,n.stateNode={isHidden:!1},n}function qc(n,e,t){return n=Wn(6,n,null,e),n.lanes=t,n}function Kc(n,e,t){return e=Wn(4,n.children!==null?n.children:[],n.key,e),e.lanes=t,e.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},e}function Zy(n,e,t,i,r){this.tag=e,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Pc(0),this.expirationTimes=Pc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Pc(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function df(n,e,t,i,r,s,a,o,l){return n=new Zy(n,e,t,o,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Wn(3,null,null,e),n.current=s,s.stateNode=n,s.memoizedState={element:i,isDehydrated:t,cache:null,transitions:null,pendingSuspenseBoundaries:null},$h(s),n}function Qy(n,e,t){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ys,key:i==null?null:""+i,children:n,containerInfo:e,implementation:t}}function yx(n){if(!n)return yr;n=n._reactInternals;e:{if(Zr(n)!==n||n.tag!==1)throw Error(ae(170));var e=n;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(En(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(ae(171))}if(n.tag===1){var t=n.type;if(En(t))return yg(n,t,e)}return e}function Sx(n,e,t,i,r,s,a,o,l){return n=df(t,i,!0,n,r,s,a,o,l),n.context=yx(null),t=n.current,i=mn(),r=gr(t),s=ki(i,r),s.callback=e??null,pr(t,s,r),n.current.lanes=r,uo(n,r,i),Tn(n,i),n}function gc(n,e,t,i){var r=e.current,s=mn(),a=gr(r);return t=yx(t),e.context===null?e.context=t:e.pendingContext=t,e=ki(s,a),e.payload={element:n},i=i===void 0?null:i,i!==null&&(e.callback=i),n=pr(r,e,a),n!==null&&(ai(n,r,a,s),dl(n,r,a)),a}function $l(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function tm(n,e){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var t=n.retryLane;n.retryLane=t!==0&&t<e?t:e}}function hf(n,e){tm(n,e),(n=n.alternate)&&tm(n,e)}function Jy(){return null}var Mx=typeof reportError=="function"?reportError:function(n){console.error(n)};function ff(n){this._internalRoot=n}xc.prototype.render=ff.prototype.render=function(n){var e=this._internalRoot;if(e===null)throw Error(ae(409));gc(n,e,null,null)};xc.prototype.unmount=ff.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var e=n.containerInfo;Xr(function(){gc(null,n,null,null)}),e[Gi]=null}};function xc(n){this._internalRoot=n}xc.prototype.unstable_scheduleHydration=function(n){if(n){var e=J0();n={blockedOn:null,target:n,priority:e};for(var t=0;t<sr.length&&e!==0&&e<sr[t].priority;t++);sr.splice(t,0,n),t===0&&tg(n)}};function pf(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function vc(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function nm(){}function eS(n,e,t,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var c=$l(a);s.call(c)}}var a=Sx(e,i,n,0,null,!1,!1,"",nm);return n._reactRootContainer=a,n[Gi]=a.current,$a(n.nodeType===8?n.parentNode:n),Xr(),a}for(;r=n.lastChild;)n.removeChild(r);if(typeof i=="function"){var o=i;i=function(){var c=$l(l);o.call(c)}}var l=df(n,0,!1,null,null,!1,!1,"",nm);return n._reactRootContainer=l,n[Gi]=l.current,$a(n.nodeType===8?n.parentNode:n),Xr(function(){gc(e,l,t,i)}),l}function _c(n,e,t,i,r){var s=t._reactRootContainer;if(s){var a=s;if(typeof r=="function"){var o=r;r=function(){var l=$l(a);o.call(l)}}gc(e,a,n,r)}else a=eS(t,e,n,r,i);return $l(a)}Z0=function(n){switch(n.tag){case 3:var e=n.stateNode;if(e.current.memoizedState.isDehydrated){var t=Ma(e.pendingLanes);t!==0&&(Nh(e,t|1),Tn(e,Dt()),!(rt&6)&&(Ys=Dt()+500,Er()))}break;case 13:Xr(function(){var i=Wi(n,1);if(i!==null){var r=mn();ai(i,n,1,r)}}),hf(n,1)}};Ih=function(n){if(n.tag===13){var e=Wi(n,134217728);if(e!==null){var t=mn();ai(e,n,134217728,t)}hf(n,134217728)}};Q0=function(n){if(n.tag===13){var e=gr(n),t=Wi(n,e);if(t!==null){var i=mn();ai(t,n,e,i)}hf(n,e)}};J0=function(){return ft};eg=function(n,e){var t=ft;try{return ft=n,e()}finally{ft=t}};Ku=function(n,e,t){switch(e){case"input":if(Gu(n,t),e=t.name,t.type==="radio"&&e!=null){for(t=n;t.parentNode;)t=t.parentNode;for(t=t.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<t.length;e++){var i=t[e];if(i!==n&&i.form===n.form){var r=cc(i);if(!r)throw Error(ae(90));L0(i),Gu(i,r)}}}break;case"textarea":I0(n,t);break;case"select":e=t.value,e!=null&&Ds(n,!!t.multiple,e,!1)}};z0=of;V0=Xr;var tS={usingClientEntryPoint:!1,Events:[fo,Ts,cc,k0,B0,of]},ua={findFiberByHostInstance:Dr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},nS={bundleType:ua.bundleType,version:ua.version,rendererPackageName:ua.rendererPackageName,rendererConfig:ua.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:$i.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=W0(n),n===null?null:n.stateNode},findFiberByHostInstance:ua.findFiberByHostInstance||Jy,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Do=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Do.isDisabled&&Do.supportsFiber)try{sc=Do.inject(nS),yi=Do}catch{}}Un.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=tS;Un.createPortal=function(n,e){var t=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!pf(e))throw Error(ae(200));return Qy(n,e,null,t)};Un.createRoot=function(n,e){if(!pf(n))throw Error(ae(299));var t=!1,i="",r=Mx;return e!=null&&(e.unstable_strictMode===!0&&(t=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=df(n,1,!1,null,null,t,!1,i,r),n[Gi]=e.current,$a(n.nodeType===8?n.parentNode:n),new ff(e)};Un.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var e=n._reactInternals;if(e===void 0)throw typeof n.render=="function"?Error(ae(188)):(n=Object.keys(n).join(","),Error(ae(268,n)));return n=W0(e),n=n===null?null:n.stateNode,n};Un.flushSync=function(n){return Xr(n)};Un.hydrate=function(n,e,t){if(!vc(e))throw Error(ae(200));return _c(null,n,e,!0,t)};Un.hydrateRoot=function(n,e,t){if(!pf(n))throw Error(ae(405));var i=t!=null&&t.hydratedSources||null,r=!1,s="",a=Mx;if(t!=null&&(t.unstable_strictMode===!0&&(r=!0),t.identifierPrefix!==void 0&&(s=t.identifierPrefix),t.onRecoverableError!==void 0&&(a=t.onRecoverableError)),e=Sx(e,null,n,1,t??null,r,!1,s,a),n[Gi]=e.current,$a(n),i)for(n=0;n<i.length;n++)t=i[n],r=t._getVersion,r=r(t._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[t,r]:e.mutableSourceEagerHydrationData.push(t,r);return new xc(e)};Un.render=function(n,e,t){if(!vc(e))throw Error(ae(200));return _c(null,n,e,!1,t)};Un.unmountComponentAtNode=function(n){if(!vc(n))throw Error(ae(40));return n._reactRootContainer?(Xr(function(){_c(null,null,n,!1,function(){n._reactRootContainer=null,n[Gi]=null})}),!0):!1};Un.unstable_batchedUpdates=of;Un.unstable_renderSubtreeIntoContainer=function(n,e,t,i){if(!vc(t))throw Error(ae(200));if(n==null||n._reactInternals===void 0)throw Error(ae(38));return _c(n,e,t,!1,i)};Un.version="18.3.1-next-f1338f8080-20240426";function wx(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(wx)}catch(n){console.error(n)}}wx(),w0.exports=Un;var iS=w0.exports,im=iS;Fu.createRoot=im.createRoot,Fu.hydrateRoot=im.hydrateRoot;const Zc={DRIVEWAY:{id:"DRIVEWAY",type:"DRIVEWAY",name:"Asphalt Driveway",category:"INFRASTRUCTURE",cost:50,dailyUpkeep:1,width:1,height:1,description:"Paved access route for vehicles entering and moving inside the rest stop.",unlockLevel:1,color:"#334155",secondaryColor:"#64748b"},PARKING_CAR:{id:"PARKING_CAR",type:"PARKING_CAR",name:"Standard Parking Bay",category:"INFRASTRUCTURE",cost:120,dailyUpkeep:2,width:1,height:1,description:"Designated parking bay for standard sedans, SUVs, and passenger cars.",unlockLevel:1,color:"#1e293b",secondaryColor:"#facc15"},PARKING_TRUCK:{id:"PARKING_TRUCK",type:"PARKING_TRUCK",name:"Semi-Truck Long Bay",category:"INFRASTRUCTURE",cost:250,dailyUpkeep:5,width:2,height:1,description:"Oversized reinforced parking spot designed for 18-wheelers and tour buses.",unlockLevel:1,color:"#1e293b",secondaryColor:"#38bdf8"},PUMP_ISLAND:{id:"PUMP_ISLAND",type:"PUMP_ISLAND",name:"Dual Fuel Dispenser",category:"PETROL",cost:2500,dailyUpkeep:25,width:2,height:1,description:"High-speed dual dispenser supplying Regular 87 and Premium 93 octane fuels.",unlockLevel:1,color:"#f59e0b",secondaryColor:"#ef4444",capacity:2},DIESEL_ISLAND:{id:"DIESEL_ISLAND",type:"PUMP_ISLAND",name:"Ultra High-Flow Diesel",category:"PETROL",cost:4500,dailyUpkeep:40,width:2,height:2,description:"Heavy-duty commercial diesel pump with satellite nozzle for commercial freight trucks.",unlockLevel:2,color:"#10b981",secondaryColor:"#059669",capacity:2},EV_STATION:{id:"EV_STATION",type:"EV_STATION",name:"350kW DC Fast Supercharger",category:"PETROL",cost:3800,dailyUpkeep:30,width:1,height:1,description:"Ultra-fast electric vehicle charger attracting high-net-worth EV travelers.",unlockLevel:2,color:"#06b6d4",secondaryColor:"#38bdf8",capacity:1},MOTEL_ROOM:{id:"MOTEL_ROOM",type:"MOTEL_ROOM",name:"Classic Motel Suite",category:"HOSPITALITY",cost:5e3,dailyUpkeep:35,width:2,height:2,description:"Comfortable air-conditioned motel room for weary roadtrippers and family travelers.",unlockLevel:1,color:"#8b5cf6",secondaryColor:"#c084fc",capacity:1},MOTEL_CABIN:{id:"MOTEL_CABIN",type:"MOTEL_CABIN",name:"Soundproof Trucker Cabin",category:"HOSPITALITY",cost:3500,dailyUpkeep:20,width:1,height:2,description:"Acoustically isolated private sleeper pod with blackout blinds and heavy-duty mattress.",unlockLevel:1,color:"#6366f1",secondaryColor:"#818cf8",capacity:1},CONVENIENCE_STORE:{id:"CONVENIENCE_STORE",type:"CONVENIENCE_STORE",name:"24/7 Oasis Mart",category:"COMMERCIAL",cost:6e3,dailyUpkeep:50,width:3,height:2,description:"Snacks, hot coffee bar, energy drinks, lottery tickets, and car accessories.",unlockLevel:1,color:"#10b981",secondaryColor:"#34d399",capacity:8},DINER:{id:"DINER",type:"DINER",name:"Route Highway Diner",category:"COMMERCIAL",cost:9500,dailyUpkeep:80,width:3,height:3,description:"Iconic chrome diner serving hot burgers, pancake stacks, and bottomless black coffee.",unlockLevel:2,color:"#ef4444",secondaryColor:"#f87171",capacity:12},CAR_WASH:{id:"CAR_WASH",type:"CAR_WASH",name:"Express Tunnel Car Wash",category:"COMMERCIAL",cost:7200,dailyUpkeep:60,width:2,height:3,description:"Touchless automated wash tunnel that leaves highway grime behind.",unlockLevel:3,color:"#0284c7",secondaryColor:"#38bdf8",capacity:2},RESTROOM:{id:"RESTROOM",type:"RESTROOM",name:"Sanitary Restroom Facility",category:"COMMERCIAL",cost:1800,dailyUpkeep:15,width:1,height:1,description:"Essential high-volume restrooms. Keeping these clean is crucial for your reputation rating!",unlockLevel:1,color:"#059669",secondaryColor:"#6ee7b7",capacity:4},BILLBOARD:{id:"BILLBOARD",type:"BILLBOARD",name:"Neon Highway Megaboard",category:"DECOR",cost:3e3,dailyUpkeep:25,width:1,height:1,description:"Illuminated billboard visible from 5 miles out, boosting customer highway turn-in rate by +25%.",unlockLevel:1,color:"#ec4899",secondaryColor:"#f43f5e"},TREE:{id:"TREE",type:"TREE",name:"Landscaped Oasis Palms",category:"DECOR",cost:150,dailyUpkeep:2,width:1,height:1,description:"Pleasant shade trees improving overall customer satisfaction and park ambiance.",unlockLevel:1,color:"#15803d",secondaryColor:"#22c55e"}},rm=[{id:"route_66_revival",name:"Route 66 Neon Revival",subtitle:"The Classic Desert Dustbowl",description:"Transform an abandoned Route 66 junction into the premier modern rest stop for truckers and adventurous tourists.",initialCash:0,highwaySpeedLimit:75,trafficVolumeRate:1,mapWidth:28,mapHeight:28,weatherPattern:"DESERT",objectives:[{id:"build_pumps",description:"Build at least 2 Dual Fuel Dispensers",target:2,current:0,completed:!1},{id:"build_motel",description:"Construct at least 3 Motel Rooms or Trucker Cabins",target:3,current:0,completed:!1},{id:"serve_customers",description:"Service 50 Highway Customers",target:50,current:0,completed:!1},{id:"reputation",description:"Achieve a 4.0 Star Rating or higher",target:4,current:2.5,completed:!1}]},{id:"interstate_freight_corridor",name:"Interstate Big-Rig Corridor",subtitle:"Heavy Freight Logistics Hub",description:"A relentless artery of heavy commercial freight. Diesel supplies and soundproof sleeper cabins will drive maximum profit.",initialCash:0,highwaySpeedLimit:65,trafficVolumeRate:1.5,mapWidth:32,mapHeight:32,weatherPattern:"TEMPERATE",objectives:[{id:"diesel_pumps",description:"Build 3 Commercial Diesel Islands",target:3,current:0,completed:!1},{id:"trucker_cabins",description:"Build 5 Soundproof Trucker Cabins",target:5,current:0,completed:!1},{id:"diner_built",description:"Construct the Highway Diner & Grill",target:1,current:0,completed:!1},{id:"revenue_target",description:"Earn $10,000 in net profits",target:1e4,current:0,completed:!1}]},{id:"infinite_sandbox",name:"Billionaire Highway Sandbox",subtitle:"Unlimited Creative Expansion",description:"Uncapped capital, all technologies unlocked from the start, and zero debt. Build the ultimate mega-oasis.",initialCash:5e5,highwaySpeedLimit:80,trafficVolumeRate:1.8,mapWidth:36,mapHeight:36,weatherPattern:"COASTAL",objectives:[{id:"grand_oasis",description:"Construct over 20 commercial and hospitality buildings",target:20,current:0,completed:!1}]}];class rS{constructor(){Z(this,"listeners",new Map)}on(e,t){return this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(t),()=>{var i;(i=this.listeners.get(e))==null||i.delete(t)}}emit(e,t){const i=this.listeners.get(e);i&&i.forEach(r=>{try{r(t)}catch(s){console.error(`Error in event listener for ${e}:`,s)}})}clear(){this.listeners.clear()}}const Sn=new rS;class sS{constructor(){Z(this,"ctx",null);Z(this,"isMuted",!1);Z(this,"masterVolume",.5)}initContext(){if(!(typeof window>"u")){if(!this.ctx){const e=window.AudioContext||window.webkitAudioContext;e&&(this.ctx=new e)}this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}}toggleMute(){return this.isMuted=!this.isMuted,this.isMuted}getIsMuted(){return this.isMuted}setVolume(e){this.masterVolume=Math.max(0,Math.min(1,e))}playCashSound(){if(this.isMuted||(this.initContext(),!this.ctx))return;const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createOscillator(),r=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(987.77,e),t.frequency.setValueAtTime(1318.51,e+.08),i.type="triangle",i.frequency.setValueAtTime(1975.53,e+.08),r.gain.setValueAtTime(0,e),r.gain.linearRampToValueAtTime(.3*this.masterVolume,e+.02),r.gain.exponentialRampToValueAtTime(.001,e+.35),t.connect(r),i.connect(r),r.connect(this.ctx.destination),t.start(e),i.start(e+.08),t.stop(e+.35),i.stop(e+.35)}playPumpSound(){if(this.isMuted||(this.initContext(),!this.ctx))return;const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="square",t.frequency.setValueAtTime(320,e),t.frequency.exponentialRampToValueAtTime(80,e+.06),i.gain.setValueAtTime(.15*this.masterVolume,e),i.gain.exponentialRampToValueAtTime(.001,e+.06),t.connect(i),i.connect(this.ctx.destination),t.start(e),t.stop(e+.06)}playBellSound(){if(this.isMuted||(this.initContext(),!this.ctx))return;const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(1760,e),i.gain.setValueAtTime(.25*this.masterVolume,e),i.gain.exponentialRampToValueAtTime(.001,e+.5),t.connect(i),i.connect(this.ctx.destination),t.start(e),t.stop(e+.5)}playClickSound(){if(this.isMuted||(this.initContext(),!this.ctx))return;const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(600,e),t.frequency.exponentialRampToValueAtTime(400,e+.04),i.gain.setValueAtTime(.1*this.masterVolume,e),i.gain.exponentialRampToValueAtTime(.001,e+.04),t.connect(i),i.connect(this.ctx.destination),t.start(e),t.stop(e+.04)}playFanfare(){if(this.isMuted||(this.initContext(),!this.ctx))return;const e=[523.25,659.25,783.99,1046.5],t=this.ctx.currentTime;e.forEach((i,r)=>{const s=this.ctx.createOscillator(),a=this.ctx.createGain();s.type="triangle",s.frequency.setValueAtTime(i,t+r*.1),a.gain.setValueAtTime(0,t+r*.1),a.gain.linearRampToValueAtTime(.2*this.masterVolume,t+r*.1+.02),a.gain.exponentialRampToValueAtTime(.001,t+r*.1+.3),s.connect(a),a.connect(this.ctx.destination),s.start(t+r*.1),s.stop(t+r*.1+.3)})}playHornSound(){if(this.isMuted||(this.initContext(),!this.ctx))return;const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createOscillator(),r=this.ctx.createGain();t.type="sawtooth",i.type="sawtooth",t.frequency.setValueAtTime(440,e),i.frequency.setValueAtTime(554.37,e),r.gain.setValueAtTime(.08*this.masterVolume,e),r.gain.exponentialRampToValueAtTime(.001,e+.2),t.connect(r),i.connect(r),r.connect(this.ctx.destination),t.start(e),i.start(e),t.stop(e+.2),i.stop(e+.2)}playDemolishSound(){if(this.isMuted||(this.initContext(),!this.ctx))return;const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sawtooth",t.frequency.setValueAtTime(140,e),t.frequency.exponentialRampToValueAtTime(30,e+.25),i.gain.setValueAtTime(.25*this.masterVolume,e),i.gain.exponentialRampToValueAtTime(.001,e+.25),t.connect(i),i.connect(this.ctx.destination),t.start(e),t.stop(e+.25)}playErrorSound(){if(this.isMuted||(this.initContext(),!this.ctx))return;const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sawtooth",t.frequency.setValueAtTime(160,e),t.frequency.setValueAtTime(120,e+.08),i.gain.setValueAtTime(.15*this.masterVolume,e),i.gain.exponentialRampToValueAtTime(.001,e+.2),t.connect(i),i.connect(this.ctx.destination),t.start(e),t.stop(e+.2)}}const me=new sS;class aS{constructor(){Z(this,"tanks",{REGULAR:{type:"REGULAR",currentLiters:12e3,maxCapacityLiters:25e3,costPerLiterWholesale:.85,retailPricePerLiter:1.45,reorderThreshold:4e3,autoReorder:!0,orderPending:!1},PREMIUM:{type:"PREMIUM",currentLiters:6e3,maxCapacityLiters:15e3,costPerLiterWholesale:1.05,retailPricePerLiter:1.85,reorderThreshold:2500,autoReorder:!0,orderPending:!1},DIESEL:{type:"DIESEL",currentLiters:18e3,maxCapacityLiters:4e4,costPerLiterWholesale:.95,retailPricePerLiter:1.65,reorderThreshold:8e3,autoReorder:!0,orderPending:!1},ELECTRIC:{type:"ELECTRIC",currentLiters:1e3,maxCapacityLiters:1e3,costPerLiterWholesale:.12,retailPricePerLiter:.45,reorderThreshold:0,autoReorder:!1,orderPending:!1}});Z(this,"crudeOilMarketIndex",80);Z(this,"marketTimer",0)}update(e){if(this.marketTimer+=e,this.marketTimer>=30){this.marketTimer=0;const t=(Math.random()-.49)*2;this.crudeOilMarketIndex=Math.max(45,Math.min(140,this.crudeOilMarketIndex+t));const i=this.crudeOilMarketIndex/80;this.tanks.REGULAR.costPerLiterWholesale=+(.85*i).toFixed(2),this.tanks.PREMIUM.costPerLiterWholesale=+(1.05*i).toFixed(2),this.tanks.DIESEL.costPerLiterWholesale=+(.95*i).toFixed(2)}}dispenseFuel(e,t){const i=this.tanks[e];if(!i)return{litersDispensed:0,costToCustomer:0};if(e==="ELECTRIC"){const o=t*i.retailPricePerLiter;return{litersDispensed:t,costToCustomer:+o.toFixed(2)}}const r=i.currentLiters,s=Math.min(r,t);i.currentLiters-=s,i.currentLiters<i.reorderThreshold&&!i.orderPending&&(i.autoReorder?this.triggerReorder(e):Sn.emit("LOW_FUEL_WARNING",{fuelType:e,remaining:i.currentLiters}));const a=+(s*i.retailPricePerLiter).toFixed(2);return{litersDispensed:s,costToCustomer:a}}triggerReorder(e){const t=this.tanks[e];if(!t||t.orderPending||e==="ELECTRIC")return null;const i=t.maxCapacityLiters-t.currentLiters;if(i<=500)return null;t.orderPending=!0;const r=+(i*t.costPerLiterWholesale).toFixed(2);return setTimeout(()=>{t.currentLiters=t.maxCapacityLiters,t.orderPending=!1,me.playPumpSound(),Sn.emit("FLOATING_TEXT",{text:`⛽ Tanker Refilled: +${Math.round(i)}L ${e}`,x:0,y:0,color:"#10b981"})},8e3),{orderedLiters:i,wholesaleCost:r}}setRetailPrice(e,t){this.tanks[e]&&(this.tanks[e].retailPricePerLiter=Math.max(.1,+t.toFixed(2)))}toggleAutoReorder(e){return this.tanks[e]&&e!=="ELECTRIC"?(this.tanks[e].autoReorder=!this.tanks[e].autoReorder,this.tanks[e].autoReorder):!1}getCrudeOilPrice(){return+this.crudeOilMarketIndex.toFixed(2)}}class oS{constructor(){Z(this,"nightlyRateStandard",85);Z(this,"nightlyRateCabin",55)}findAvailableRoom(e,t){const i=t?"MOTEL_CABIN":"MOTEL_ROOM",r=t?"MOTEL_ROOM":"MOTEL_CABIN";let s=e.find(a=>a.type===i&&a.active&&a.roomStatus==="VACANT_CLEAN");return s||(s=e.find(a=>a.type===r&&a.active&&a.roomStatus==="VACANT_CLEAN")),s||null}checkIn(e,t,i,r){e.roomStatus="OCCUPIED",e.currentOccupantId=t,e.occupiedUntil=r+i;const s=e.type==="MOTEL_CABIN"?this.nightlyRateCabin:this.nightlyRateStandard;return e.revenueTotal+=s,me.playBellSound(),Sn.emit("ROOM_BOOKED",{roomId:e.id,customerId:t,rate:s,roomType:e.type}),s}updateRooms(e,t,i,r=1,s=1){e.forEach(a=>{a.type!=="MOTEL_ROOM"&&a.type!=="MOTEL_CABIN"||(a.roomStatus==="OCCUPIED"&&a.occupiedUntil&&t>=a.occupiedUntil&&(a.roomStatus="VACANT_DIRTY",a.currentOccupantId=void 0,a.occupiedUntil=void 0),a.roomStatus==="VACANT_DIRTY"&&i&&(a.condition=(a.condition||80)+10*r*s,a.condition>=100&&(a.condition=100,a.roomStatus="VACANT_CLEAN",Sn.emit("ROOM_CLEANED",{roomId:a.id}))))})}getStats(e){let t=0,i=0,r=0,s=0;return e.forEach(a=>{(a.type==="MOTEL_ROOM"||a.type==="MOTEL_CABIN")&&(t++,a.roomStatus==="OCCUPIED"?i++:a.roomStatus==="VACANT_DIRTY"?r++:a.roomStatus==="VACANT_CLEAN"&&s++)}),{totalRooms:t,occupiedRooms:i,dirtyRooms:r,cleanVacantRooms:s,nightlyRateStandard:this.nightlyRateStandard,nightlyRateCabin:this.nightlyRateCabin}}}class lS{constructor(){Z(this,"storeInventory",100);Z(this,"avgStoreTicket",14.5);Z(this,"avgDinerMealPrice",22);Z(this,"carWashPrice",18);Z(this,"storeRevenue",0);Z(this,"dinerRevenue",0);Z(this,"carWashRevenue",0)}visitStore(e,t){if(this.storeInventory<=5)return 0;const i=t>60?1.5:1,r=+(this.avgStoreTicket*i).toFixed(2);return this.storeInventory=Math.max(0,this.storeInventory-1.2),this.storeRevenue+=r,e.revenueTotal+=r,me.playCashSound(),Sn.emit("STORE_PURCHASE",{storeId:e.id,amount:r}),r}visitDiner(e,t){const i=Math.max(1,t),r=+(this.avgDinerMealPrice*i).toFixed(2);return this.dinerRevenue+=r,e.revenueTotal+=r,me.playCashSound(),Sn.emit("MEAL_SERVED",{dinerId:e.id,amount:r}),r}visitCarWash(e){const t=this.carWashPrice;return this.carWashRevenue+=t,e.revenueTotal+=t,me.playCashSound(),t}restockStore(){const t=+((100-this.storeInventory)*12).toFixed(2);return this.storeInventory=100,t}getMetrics(){return{storeRevenue:+this.storeRevenue.toFixed(2),dinerRevenue:+this.dinerRevenue.toFixed(2),carWashRevenue:+this.carWashRevenue.toFixed(2),storeInventoryLevel:Math.round(this.storeInventory)}}}const Ua={PUMP_ATTENDANT:{title:"Pump Attendant",defaultSalary:16,description:"Speeds up refueling and prevents fuel spills."},HOUSEKEEPER:{title:"Housekeeper",defaultSalary:18,description:"Cleans dirty motel rooms and trucker cabins, readying them for guests."},CASHIER:{title:"QuickMart Cashier",defaultSalary:15,description:"Speeds up convenience store checkout and keeps shelves organized."},COOK:{title:"Short-Order Cook",defaultSalary:22,description:"Cooks meals at the highway diner, reducing customer wait times."},MECHANIC:{title:"Service Mechanic",defaultSalary:28,description:"Repairs broken dispensers and maintains car wash machinery."},SECURITY:{title:"Highway Security Guard",defaultSalary:20,description:"Prevents noise complaints in the sleep area and improves safety score."}},sm=["Jack","Sarah","Carlos","Dave","Elena","Marcus","Chloe","Liam","Maya","Tyler","Brenda","Ray"],am=["Miller","Johnson","Rodriguez","Smith","Chang","Kowalski","Davis","Walker","O'Connor","Patel"];class cS{constructor(){Z(this,"staff",[]);this.hireStaff("PUMP_ATTENDANT","DAY"),this.hireStaff("HOUSEKEEPER","DAY")}hireStaff(e,t="DAY"){const i=Ua[e],r=`${sm[Math.floor(Math.random()*sm.length)]} ${am[Math.floor(Math.random()*am.length)]}`,a={id:`staff_${Date.now()}_${Math.floor(Math.random()*1e3)}`,name:r,role:e,salaryPerHour:i.defaultSalary,skill:Math.floor(Math.random()*4)+4,stamina:100,morale:85,shift:t,isWorking:!0,hireDate:Date.now()};return this.staff.push(a),a}fireStaff(e){const t=this.staff.findIndex(i=>i.id===e);return t!==-1?(this.staff.splice(t,1),!0):!1}setSalary(e,t){const i=this.staff.find(r=>r.id===e);if(i){i.salaryPerHour=Math.max(10,Math.min(60,t));const r=Ua[i.role].defaultSalary,s=i.salaryPerHour/r;i.morale=Math.min(100,Math.max(20,Math.round(s*80)))}}getHourlySalariesTotal(){return this.staff.reduce((e,t)=>e+t.salaryPerHour,0)}hasActiveHousekeeper(){return this.staff.some(e=>e.role==="HOUSEKEEPER"&&e.isWorking)}getHousekeepingSpeedMultiplier(){const e=this.staff.filter(i=>i.role==="HOUSEKEEPER"&&i.isWorking);if(e.length===0)return 0;const t=e.reduce((i,r)=>i+r.skill,0)/e.length;return e.length*(.8+t*.1)}getPumpSpeedMultiplier(){const e=this.staff.filter(t=>t.role==="PUMP_ATTENDANT"&&t.isWorking);return e.length===0?1:1+e.length*.25}}class uS{constructor(e=0){Z(this,"cash",0);Z(this,"totalRevenue",0);Z(this,"totalExpenses",0);Z(this,"records",[]);Z(this,"activeLoans",[]);this.cash=e}recordTransaction(e,t,i,r,s){this.cash+=t,t>0?(this.totalRevenue+=t,Sn.emit("CASH_EARNED",{amount:t,category:e})):this.totalExpenses+=Math.abs(t);const a={timestamp:Date.now(),day:r,hour:s,category:e,amount:t,description:i};this.records.unshift(a),this.records.length>300&&this.records.pop()}canAfford(e){return this.cash>=e}takeLoan(e,t,i,r){if(this.activeLoans.length>=3)return!1;const s=t*(1+i),a=+(s/r).toFixed(2),o={id:`loan_${Date.now()}`,name:e,principal:t,remainingBalance:s,dailyInterestRate:i/r,dailyPayment:a};return this.activeLoans.push(o),this.recordTransaction("SERVICES",t,`Bank Loan Principal: ${e}`,1,12),!0}processDailyLoanPayments(e){for(let t=this.activeLoans.length-1;t>=0;t--){const i=this.activeLoans[t],r=Math.min(i.remainingBalance,i.dailyPayment);this.recordTransaction("LOAN_INTEREST",-r,`Loan Installment: ${i.name}`,e,0),i.remainingBalance-=r,i.remainingBalance<=.01&&this.activeLoans.splice(t,1)}}getDailyNetProfit(e){return this.records.filter(t=>t.day===e).reduce((t,i)=>t+i.amount,0)}getCategoryBreakdown(e){const t={};return this.records.filter(i=>i.day===e).forEach(i=>{t[i.category]||(t[i.category]={income:0,expense:0}),i.amount>0?t[i.category].income+=i.amount:t[i.category].expense+=Math.abs(i.amount)}),t}}const om=["Hank","Evelyn","Chet","Mona","Donovan","Jolene","Gus","Wanda","Travis","Loretta","Vince","Brenda","Sal","Misty"],lm=["#ef4444","#3b82f6","#10b981","#f59e0b","#8b5cf6","#64748b","#ffffff","#1e293b","#ec4899"],dS=["Cheapest diesel on Route 66! Restrooms were sparkling clean.","That diner pancake stack saved my life after a 12-hour haul.","Quiet cabins, blackout curtains, slept like a baby. 10/10 trucker stop.","Ultra fast EV charger, grab a hot coffee while you charge.","Awesome stop! Gas pump was super fast and friendly staff.","Great atmosphere, nice lighting at night, felt very safe."],hS=["Waited 15 minutes for a fuel dispenser! Need more pumps.","Fuel prices are highway robbery! Bring down the rates.","Dirty motel room! Housekeeper didn't restock the towels.","Store was out of coffee and energy drinks. Very disappointed.","Long line for the restroom, dirty floors."];class cm{static createRandomVehicle(e,t,i){const r=["SEDAN","SEDAN","SUV","SUV","SPORTS_CAR","SEMI_TRUCK","SEMI_TRUCK","REEFER_TRUCK","CAMPER_RV","ELECTRIC_CAR","MOTORCYCLE"],s=r[Math.floor(Math.random()*r.length)],a=lm[Math.floor(Math.random()*lm.length)],o=om[Math.floor(Math.random()*om.length)];let l="REGULAR",c=55,h=1;switch(s){case"SEMI_TRUCK":case"REEFER_TRUCK":l="DIESEL",c=400,h=1;break;case"ELECTRIC_CAR":l="ELECTRIC",c=80,h=Math.floor(Math.random()*3)+1;break;case"SPORTS_CAR":l="PREMIUM",c=65,h=1+(Math.random()>.5?1:0);break;case"SUV":case"CAMPER_RV":l=Math.random()>.4?"REGULAR":"DIESEL",c=s==="CAMPER_RV"?120:75,h=Math.floor(Math.random()*4)+1;break;case"TOUR_BUS":l="DIESEL",c=350,h=25;break;default:l="REGULAR",c=50,h=Math.floor(Math.random()*3)+1;break}const u=Math.floor(Math.random()*65)+10,d=Math.floor(Math.random()*80)+15,p=Math.floor(Math.random()*85)+10,g=Math.floor(Math.random()*70)+10,M=Math.floor(Math.random()*300)+60;return{id:`veh_${Date.now()}_${Math.floor(Math.random()*1e4)}`,vehicleClass:s,color:a,fuelType:l,fuelLevel:u,fuelCapacityLiters:c,driverName:o,passengers:h,fatigue:d,hunger:p,bladder:g,cash:M,patience:100,x:e,y:t,targetX:e,targetY:t,speed:.12+Math.random()*.04,heading:0,lane:i,state:"HIGHWAY_APPROACH",stateTimer:0,path:[],pathIndex:0,hasStopped:!1,spentTotal:0}}static generateReview(e,t,i,r){const s=t?dS:hS,a=s[Math.floor(Math.random()*s.length)],o=t?Math.random()>.3?5:4:Math.random()>.4?2:1,l=[];return e.fuelType==="DIESEL"&&l.push("fuel"),e.fatigue>60&&l.push("sleep"),e.hunger>60&&l.push("food"),l.push("speed"),{id:`rev_${Date.now()}_${Math.floor(Math.random()*1e3)}`,author:`${e.driverName} (${e.vehicleClass.replace("_"," ")})`,vehicleClass:e.vehicleClass,stars:o,text:a,day:i,hour:r,tags:l}}}class fS{constructor(){Z(this,"highwayY",3);Z(this,"offRampEntrance",{x:5,y:3});Z(this,"offRampExit",{x:6,y:6});Z(this,"onRampEntrance",{x:22,y:6});Z(this,"onRampHighwayMerge",{x:24,y:3})}generatePathToBuilding(e){const t=[];t.push({x:5,y:3}),t.push({x:5,y:4}),t.push({x:6,y:5}),t.push({x:6,y:6});const i=6,r=Math.round(e.x),s=Math.round(e.y);if(r>i)for(let a=i+1;a<=r;a++)t.push({x:a,y:6});else if(r<i)for(let a=i-1;a>=r;a--)t.push({x:a,y:6});if(s>6)for(let a=7;a<=s;a++)t.push({x:r,y:a});else if(s<6)for(let a=5;a>=s;a--)t.push({x:r,y:a});return t.push({x:r,y:s}),t}generatePathToExit(e,t){const i=[],r=Math.max(0,Math.min(35,Math.round(e))),s=Math.max(0,Math.min(35,Math.round(t))),a=this.onRampEntrance.x;if(s>6)for(let o=s-1;o>=6;o--)i.push({x:r,y:o});else if(s<6)for(let o=s+1;o<=6;o++)i.push({x:r,y:o});if(r<a)for(let o=r+1;o<=a;o++)i.push({x:o,y:6});else if(r>a)for(let o=r-1;o>=a;o--)i.push({x:o,y:6});return i.push({x:22,y:6}),i.push({x:23,y:5}),i.push({x:23,y:4}),i.push({x:24,y:3}),i}}class pS{constructor(){Z(this,"vehicles",[]);Z(this,"highway",new fS);Z(this,"spawnTimer",0);Z(this,"totalServicedCount",0)}updateSpawning(e,t,i=1,r=!1){this.spawnTimer+=e;const s=Math.max(.6,2/i);if(this.spawnTimer>=s){this.spawnTimer=0;const a=Math.random()>.5?2:3,o=cm.createRandomVehicle(0,a,a);r&&(o.fatigue=Math.min(100,o.fatigue+15)),this.vehicles.push(o)}}updateVehicles(e,t,i,r,s,a,o,l,c){for(let h=this.vehicles.length-1;h>=0;h--){const u=this.vehicles[h];switch(u.state){case"HIGHWAY_APPROACH":{u.x+=u.speed*(e*60),u.x>=3.5&&u.x<=5.5&&!u.hasStopped?u.state="DECIDING_EXIT":u.x>36&&this.vehicles.splice(h,1);break}case"DECIDING_EXIT":{const d=u.fuelLevel<40,p=u.fatigue>65,g=u.hunger>65;if(d||p||g||Math.random()<.25){let x=null;if(d&&(x=t.find(f=>(f.type==="PUMP_ISLAND"||u.fuelType==="ELECTRIC"&&f.type==="EV_STATION")&&f.active)||null),!x&&p&&(x=r.findAvailableRoom(t,u.vehicleClass==="SEMI_TRUCK"||u.vehicleClass==="REEFER_TRUCK")),!x&&(g||Math.random()>.5)&&(x=t.find(f=>(f.type==="CONVENIENCE_STORE"||f.type==="DINER")&&f.active)||null),x){u.targetBuildingId=x.id,u.path=this.highway.generatePathToBuilding(x),u.pathIndex=0,u.state="ENTERING_RAMP",u.hasStopped=!0;break}}u.state="HIGHWAY_APPROACH";break}case"ENTERING_RAMP":{if(u.pathIndex<u.path.length){const d=u.path[u.pathIndex],p=d.x-u.x,g=d.y-u.y,M=Math.sqrt(p*p+g*g);M<.3?u.pathIndex++:(u.x+=p/M*u.speed*(e*50),u.y+=g/M*u.speed*(e*50))}else{const d=t.find(p=>p.id===u.targetBuildingId);if(!d){u.state="DRIVING_TO_EXIT",u.path=this.highway.generatePathToExit(u.x,u.y),u.pathIndex=0;break}if(d.type==="PUMP_ISLAND"||d.type==="EV_STATION")u.state="REFUELING",u.stateTimer=4,me.playPumpSound();else if(d.type==="MOTEL_ROOM"||d.type==="MOTEL_CABIN"){u.state="AT_MOTEL",u.stateTimer=8;const p=r.checkIn(d,u.id,8,l);u.spentTotal+=p,a.recordTransaction("MOTEL",p,`Room Stay: ${u.driverName}`,o,l)}else if(d.type==="CONVENIENCE_STORE"){u.state="SHOPPING",u.stateTimer=3.5;const p=s.visitStore(d,u.hunger);u.spentTotal+=p,a.recordTransaction("STORE",p,`Oasis Mart: ${u.driverName}`,o,l)}else if(d.type==="DINER"){u.state="EATING",u.stateTimer=5;const p=s.visitDiner(d,u.passengers);u.spentTotal+=p,a.recordTransaction("DINER",p,`Highway Diner: ${u.driverName}`,o,l)}else u.state="PARKED",u.stateTimer=3}break}case"REFUELING":{if(u.stateTimer-=e,u.stateTimer<=0){const d=Math.round(u.fuelCapacityLiters*((100-u.fuelLevel)/100)),{litersDispensed:p,costToCustomer:g}=i.dispenseFuel(u.fuelType,d);u.fuelLevel=100,u.spentTotal+=g,a.recordTransaction("FUEL",g,`Fuel Sold: ${u.driverName} (${p}L ${u.fuelType})`,o,l),me.playCashSound(),Sn.emit("FLOATING_TEXT",{text:`+$${g.toFixed(2)}`,x:u.x,y:u.y,color:"#34d399"}),u.state="DRIVING_TO_EXIT",u.path=this.highway.generatePathToExit(u.x,u.y),u.pathIndex=0,this.totalServicedCount++}break}case"AT_MOTEL":{u.stateTimer-=e,u.stateTimer<=0&&(u.fatigue=0,Sn.emit("FLOATING_TEXT",{text:"Well Rested! ⭐",x:u.x,y:u.y,color:"#a855f7"}),u.state="DRIVING_TO_EXIT",u.path=this.highway.generatePathToExit(u.x,u.y),u.pathIndex=0,this.totalServicedCount++);break}case"SHOPPING":case"EATING":case"PARKED":{u.stateTimer-=e,u.stateTimer<=0&&(u.hunger=10,u.state="DRIVING_TO_EXIT",u.path=this.highway.generatePathToExit(u.x,u.y),u.pathIndex=0,this.totalServicedCount++);break}case"DRIVING_TO_EXIT":{if(u.pathIndex<u.path.length){const d=u.path[u.pathIndex],p=d.x-u.x,g=d.y-u.y,M=Math.sqrt(p*p+g*g);M<.3?u.pathIndex++:(u.x+=p/M*u.speed*(e*50),u.y+=g/M*u.speed*(e*50))}else{u.state="HIGHWAY_LEAVE",u.lane=3,u.y=3;const d=cm.generateReview(u,!0,o,l);c(d)}break}case"HIGHWAY_LEAVE":{u.x+=u.speed*(e*60),u.x>38&&this.vehicles.splice(h,1);break}}}}}function mS(){const n=[];for(let e=1;e<=100;e++){let t=`Level ${e}: Highway Milestone`,i="Expanding travel oasis throughput and services",r=Math.round(350*Math.pow(e,1.35)/50)*50;e===1&&(r=450),e===100&&(r=0);let s="CUSTOMERS_SERVED",a=Math.round(e*12),o=`Serve at least ${a} highway customers`,l=[`Increased Highway Customer Flow (+${e*2}%)`];e<=5?e===1?(t="Level 1: Solitary Roadside Pump",i="Basic gasoline dispenser serving highway pass-through traffic",s="CUSTOMERS_SERVED",a=0,o="Initial starter fuel pump",l=["Regular Gasoline Pump","Direct Cash Receipts"]):e===2?(t="Level 2: Dual Fuel Nozzle Post",i="Increased pumping speed and customer capacity",s="CUSTOMERS_SERVED",a=4,o="Serve at least 4 highway customers",l=["Pump Speed Boost +20%","Reduced Wait Times"]):e===3?(t="Level 3: Lighted Canopy Shell",i="Illuminated modern canopy providing shade and weather cover",s="FUEL_CAPACITY",a=2,o="Upgrade Fuel Capacity to Level 2",l=["Overhead Weather Canopy","Night Lighting"]):e===4?(t="Level 4: High-Throughput Fuel Island",i="Additional pump nozzles for passenger sedans",s="CUSTOMERS_SERVED",a=15,o="Serve at least 15 highway vehicles",l=["+2 Fuel Dispensers","Dual-Side Pumping"]):e===5&&(t="Level 5: Roadside Air & Water Bay",i="Tire inflation and windshield squeegee stations",s="FUEL_CAPACITY",a=3,o="Upgrade Fuel Capacity to Level 3",l=["Free Air Station","Customer Satisfaction +15%"]):e<=20?e===6?(t="Level 6: North Land Acquisition",i="Acquire adjacent northern acreage to construct commercial truck lanes",s="LAND_PARCELS",a=1,o="Purchase North Expansion Land Plot",l=["North Land Parcel Access","Truck Lane Prep"]):e===7?(t="Level 7: Commercial 18-Wheeler Diesel Lane",i="Heavy-duty high-speed diesel lanes set 35m deep for semi-trucks",s="FUEL_CAPACITY",a=4,o="Upgrade Fuel Capacity to Level 4 (Diesel)",l=["18-Wheeler Semi-Truck Access","Commercial Diesel Berths"]):e===8?(t="Level 8: 350kW DC Ultra-Fast EV Hub",i="High-output electric vehicle charging pedestals with cyan illumination",s="CUSTOMERS_SERVED",a=45,o="Serve 45 highway customers",l=["350kW EV Superchargers","Electric Vehicle Traffic"]):e===12?(t="Level 12: Dual Commercial Freight Corridors",i="Expanded drive-through diesel berths with zero service road overlap",s="FUEL_CAPACITY",a=5,o="Upgrade Fuel Capacity to Level 5",l=["+2 High-Speed Diesel Lanes","DEF Additive Pumps"]):e===16?(t="Level 16: Automated Wholesale Tanker Logistics",i="Bulk underground fuel storage tanks and lower supply pricing",s="CUSTOMERS_SERVED",a=110,o="Serve 110 highway vehicles",l=["50,000L Fuel Reserves","Bulk Fuel Discount"]):e===20?(t="Level 20: Interstate Freight Logistics Junction",i="Fleet accounts and commercial trucking contracts",s="LAND_PARCELS",a=2,o="Purchase East Commercial Land Plot",l=["East Expansion Parcel","Commercial Fleet Traffic"]):(t=`Level ${e}: Freight Corridor Optimization Stage ${e-5}`,s="CUSTOMERS_SERVED",a=e*14,o=`Serve ${a} highway vehicles`):e<=45?e===21?(t="Level 21: QuickMart Express Store Opening",i="Full 24/7 convenience store with fresh snacks, drinks, and coffee",s="STORE_CAPACITY",a=1,o="Construct & Stock QuickMart Store (Capacity Lvl 1)",l=["24/7 Oasis QuickMart","Retail Merchandising Revenue"]):e===25?(t="Level 25: Artisan Bean-to-Cup Coffee Bar",i="Espresso machines and premium hot roast station",s="STORE_CAPACITY",a=2,o="Upgrade Store Capacity to Level 2",l=["Gourmet Coffee Bar","High-Margin Snack Sales"]):e===30?(t="Level 30: Chilled Beverage Caves & Grab-and-Go",i="Walk-in beverage cooler and fresh artisan deli sandwiches",s="STORE_CAPACITY",a=3,o="Upgrade Store Capacity to Level 3",l=["Cold Drink Cave","Fresh Deli Counter"]):e===35?(t="Level 35: Roadside Souvenirs & Travel Essentials",i="Route 66 memorabilia, electronics chargers, and local gifts",s="CUSTOMERS_SERVED",a=320,o="Serve 320 highway visitors",l=["Gift & Souvenir Aisle","+35% Retail Margin"]):e===40?(t="Level 40: Fast-Flow Dual Checkout Registers",i="Rapid POS checkout terminals eliminating customer store queues",s="STORE_CAPACITY",a=4,o="Upgrade Store Capacity to Level 4",l=["Dual POS Registers","Zero Store Checkout Queues"]):e===45?(t="Level 45: Commercial Trucker Travel Mart",i="Heavy-duty trucking hardware, logbooks, and CB radio gear",s="REPUTATION",a=4.2,o="Achieve 4.2+ Star Customer Rating",l=["Trucker Hardware Section","Store Patronage +40%"]):(t=`Level ${e}: Retail Market Expansion Step ${e-20}`,s="STORE_CAPACITY",a=Math.min(5,Math.floor(e/10)),o=`Store Capacity Level ${a}+ and ${e*12} customers`):e<=65?e===46?(t="Level 46: Route 66 Diner Grand Opening",i="Classic Americana diner serving hot burgers, shakes, and steaks",s="CUSTOMERS_SERVED",a=500,o="Serve 500 total highway customers",l=["Route 66 Diner Kitchen","Restaurant Meal Revenue"]):e===50?(t="Level 50: Outdoor Patio & Umbrella Seating",i="Sunlit outdoor dining area for scenic highway views",s="REPUTATION",a=4.4,o="Achieve 4.4+ Star Reputation",l=["Patio Umbrella Dining Tables","Food Capacity +50%"]):e===55?(t="Level 55: High-Output Commercial Kitchen",i="Stainless steel commercial fryers and artisan burger prep line",s="STORE_CAPACITY",a=5,o="Upgrade Store & Food Capacity to Level 5",l=["Gourmet Kitchen Prep","Diner Peak Rush Handling"]):e===60?(t="Level 60: South Truck Logistics Lot Acquisition",i="Acquire southern territory to construct overnight motel and rest park",s="LAND_PARCELS",a=3,o="Purchase South Logistics Land Plot",l=["South Land Parcel","Motel & Park Prep"]):e===65?(t="Level 65: 24/7 All-Day Breakfast & Bakery",i="Fresh hot donuts, pies, and endless hot skillet breakfasts",s="CUSTOMERS_SERVED",a=850,o="Serve 850 highway travelers",l=["24/7 Bakery Display","Breakfast Rush Bonuses"]):(t=`Level ${e}: Food Service Elevation Phase ${e-45}`,s="CUSTOMERS_SERVED",a=e*16,o=`Serve ${a} hungry travelers`):e<=85?e===66?(t="Level 66: Highway Motel Lodge Opening",i="Modern 2-story guest suites with comfortable king beds and hot showers",s="MOTEL_CAPACITY",a=1,o="Construct & Open Motel Suites (Motel Lvl 1)",l=["2-Story Motel Suites","High-Yield Room Bookings"]):e===70?(t="Level 70: Soundproof Trucker Sleeper Cabins",i="Heavy acoustic insulation cabins giving long-haul truckers quiet rest",s="MOTEL_CAPACITY",a=2,o="Upgrade Motel Capacity to Level 2",l=["Soundproof Sleeper Cabins","Long-Haul Trucker Bookings"]):e===75?(t="Level 75: Landscaped Oasis Rest Park",i="Lush grass lawn, shade trees, picnic benches, and pet relief areas",s="REPUTATION",a=4.6,o="Achieve 4.6+ Star Customer Reputation",l=["Rest Park & Shade Trees","Family Traveler Boost +30%"]):e===80?(t="Level 80: Deep East Resort Land Acquisition",i="Acquire fourth acreage parcel for mega luxury expansion",s="LAND_PARCELS",a=4,o="Purchase Deep East Land Parcel",l=["Deep East Acreage","Resort Amenities Access"]):e===85?(t="Level 85: Luxury Executive Motel Suites",i="Jacuzzi suites, premium bedding, and 24-hour room service",s="MOTEL_CAPACITY",a=4,o="Upgrade Motel Capacity to Level 4",l=["Executive Penthouse Suites","$250/Night VIP Rates"]):(t=`Level ${e}: Hospitality Excellence Phase ${e-65}`,s="MOTEL_CAPACITY",a=Math.min(5,Math.floor((e-60)/5)),o=`Motel Capacity Level ${a}+ and ${e*18} guests`):e===86?(t="Level 86: 6-Lane Highway Arterial Expansion",i="Expand the single arterial highway into a 6-lane interstate superhighway",s="HIGHWAY_LANES",a=6,o="Expand Highway to 6 Full Lanes",l=["6-Lane Interstate Highway","Traffic Throughput +50%"]):e===90?(t="Level 90: High-Speed Flyover Toll & Express Slipways",i="Flyover ramps providing zero-stop entry into the travel center",s="CUSTOMERS_SERVED",a=1800,o="Serve 1,800 highway travelers",l=["Express Off-Ramp Flyover","Zero-Congestion Inflow"]):e===95?(t="Level 95: Automated Touchless Tunnel Car Wash",i="High-pressure wash bay with foam cannon and ceramic wax polish",s="REPUTATION",a=4.85,o="Achieve 4.85+ Star Customer Reputation",l=["Tunnel Car Wash","Automated Wash Revenue"]):e===100?(t="Level 100: Grand Continental Highway Travel Oasis",i="The ultimate 5-Star travel destination across the transcontinental corridor",s="CUSTOMERS_SERVED",a=2500,o="Serve 2,500 total highway travelers",l=["Master Highway Tycoon Trophy","Unlimited Customer Capacity","VIP Diamond Concierge","5-Star Transcontinental Prestige"]):(t=`Level ${e}: Super-Oasis Infrastructure Stage ${e-85}`,s="CUSTOMERS_SERVED",a=e*22,o=`Serve ${a} travelers across the corridor`),n.push({level:e,name:t,subtitle:i,upgradeCost:r,requiredDev:{type:s,value:a,label:o},unlockedFeatures:l})}return n}const gS=mS(),Qc="HIGHWAY_OASIS_TYCOON_SAVE_V2",Jc=gS;class Ex{constructor(e="route_66_revival"){Z(this,"scenario");Z(this,"buildings",[]);Z(this,"fuelStorage",new aS);Z(this,"roomManager",new oS);Z(this,"storeManager",new lS);Z(this,"staffManager",new cS);Z(this,"economy");Z(this,"vehicleManager",new pS);Z(this,"day",1);Z(this,"hour",8);Z(this,"minute",0);Z(this,"gameSpeed",1);Z(this,"tickAccumulator",0);Z(this,"plazaLevel",1);Z(this,"fuelCapacityLevel",1);Z(this,"storeCapacityLevel",1);Z(this,"motelCapacityLevel",1);Z(this,"purchasedParcels",new Set);Z(this,"highwayLanesLevel",4);Z(this,"totalCustomersServed",0);Z(this,"reputationStars",3.8);Z(this,"reviews",[]);Z(this,"unlockedTechIds",new Set);const t=rm.find(i=>i.id===e)||rm[0];this.scenario=t,this.economy=new uS(t.initialCash),this.setupInitialBuildings(),this.loadFromStorage()}setupInitialBuildings(){this.buildings.length>0||(this.buildBuilding("PUMP_ISLAND",10,8,!0),this.buildBuilding("EV_STATION",14,8,!0),this.buildBuilding("MOTEL_ROOM",17,10,!0),this.buildBuilding("CONVENIENCE_STORE",11,12,!0))}buildBuilding(e,t,i,r=!1){const s=Zc[e];if(!s||!r&&!this.economy.canAfford(s.cost)||this.buildings.some(l=>t<l.x+l.width&&t+s.width>l.x&&i<l.y+l.height&&i+s.height>l.y))return!1;r||(this.economy.recordTransaction("CONSTRUCTION",-s.cost,`Constructed ${s.name}`,this.day,this.hour),me.playCashSound());const o={id:`bld_${Date.now()}_${Math.floor(Math.random()*1e3)}`,defId:e,type:s.type,x:t,y:i,width:s.width,height:s.height,level:1,condition:100,active:!0,revenueTotal:0,roomStatus:s.type==="MOTEL_ROOM"||s.type==="MOTEL_CABIN"?"VACANT_CLEAN":void 0};return this.buildings.push(o),this.checkObjectives(),!0}demolishBuilding(e){const t=this.buildings.findIndex(a=>a.id===e);if(t===-1)return!1;const i=this.buildings[t],r=Zc[i.defId],s=r?Math.round(r.cost*.4):0;return this.buildings.splice(t,1),s>0&&this.economy.recordTransaction("CONSTRUCTION",s,`Demolition Salvage: ${r.name}`,this.day,this.hour),me.playCashSound(),!0}tick(e){if(this.gameSpeed===0)return;const t=e*this.gameSpeed;if(this.tickAccumulator+=t,this.tickAccumulator>=1){const a=Math.floor(this.tickAccumulator);for(this.tickAccumulator-=a,this.minute+=a;this.minute>=60;)this.minute-=60,this.hour++,this.onHourPassed(),this.hour>=24&&(this.hour=0,this.day++,this.onDayPassed())}this.fuelStorage.update(t);const i=this.staffManager.hasActiveHousekeeper(),r=this.staffManager.getHousekeepingSpeedMultiplier();this.roomManager.updateRooms(this.buildings,this.hour,i,r,t);const s=this.buildings.some(a=>a.type==="BILLBOARD"&&a.active);this.vehicleManager.updateSpawning(t,this.scenario.mapWidth,this.scenario.trafficVolumeRate,s),this.vehicleManager.updateVehicles(t,this.buildings,this.fuelStorage,this.roomManager,this.storeManager,this.economy,this.day,this.hour,a=>this.addReview(a)),this.checkObjectives()}onHourPassed(){const e=this.staffManager.getHourlySalariesTotal();e>0&&this.economy.recordTransaction("SALARIES",-e,"Hourly Staff Payroll",this.day,this.hour);const i=this.unlockedTechIds.has("SOLAR_CANOPY")?.5:1;let r=0;this.buildings.forEach(s=>{const a=Zc[s.defId];a&&(r+=a.dailyUpkeep/24*i)}),r>0&&this.economy.recordTransaction("UPKEEP",-Math.round(r),"Facility Power & Utilities",this.day,this.hour)}onDayPassed(){this.economy.processDailyLoanPayments(this.day),this.saveToStorage()}addReview(e){this.reviews.unshift(e),this.reviews.length>50&&this.reviews.pop();const t=this.reviews.reduce((i,r)=>i+r.stars,0)/this.reviews.length;this.reputationStars=+t.toFixed(1)}checkObjectives(){this.scenario.objectives.forEach(e=>{e.completed||(e.id==="build_pumps"?e.current=this.buildings.filter(t=>t.type==="PUMP_ISLAND").length:e.id==="build_motel"||e.id==="trucker_cabins"?e.current=this.buildings.filter(t=>t.type==="MOTEL_ROOM"||t.type==="MOTEL_CABIN").length:e.id==="serve_customers"?e.current=this.vehicleManager.totalServicedCount:e.id==="reputation"?e.current=this.reputationStars:e.id==="diner_built"?e.current=this.buildings.filter(t=>t.type==="DINER").length:e.id==="revenue_target"&&(e.current=this.economy.totalRevenue),e.current>=e.target&&(e.completed=!0,me.playFanfare(),Sn.emit("FLOATING_TEXT",{text:`🎉 Objective Completed: ${e.description}!`,x:15,y:8,color:"#fbbf24"})))})}unlockTech(e,t){return!this.economy.canAfford(t)||this.unlockedTechIds.has(e)?!1:(this.economy.recordTransaction("SERVICES",-t,`R&D Tech: ${e}`,this.day,this.hour),this.unlockedTechIds.add(e),me.playFanfare(),!0)}getCurrentLevelConfig(){return Jc.find(e=>e.level===this.plazaLevel)||Jc[0]}getNextLevelConfig(){return Jc.find(e=>e.level===this.plazaLevel+1)||null}checkDevelopmentPrerequisite(e){const t=e.requiredDev;switch(t.type){case"FUEL_CAPACITY":return{met:this.fuelCapacityLevel>=t.value,details:`Fuel Capacity: ${this.fuelCapacityLevel}/${t.value}`};case"STORE_CAPACITY":return{met:this.storeCapacityLevel>=t.value,details:`Store Capacity: ${this.storeCapacityLevel}/${t.value}`};case"MOTEL_CAPACITY":return{met:this.motelCapacityLevel>=t.value,details:`Motel Capacity: ${this.motelCapacityLevel}/${t.value}`};case"LAND_PARCELS":return{met:this.purchasedParcels.size>=t.value,details:`Land Plots: ${this.purchasedParcels.size}/${t.value}`};case"CUSTOMERS_SERVED":return{met:this.totalCustomersServed>=t.value,details:`Customers Served: ${this.totalCustomersServed}/${t.value}`};case"HIGHWAY_LANES":return{met:this.highwayLanesLevel>=t.value,details:`Highway Lanes: ${this.highwayLanesLevel}/${t.value}`};case"REPUTATION":return{met:this.reputationStars>=t.value,details:`Reputation: ${this.reputationStars.toFixed(1)}★ / ${t.value.toFixed(1)}★`};default:return{met:!0,details:""}}}canUpgradePlazaLevel(){const e=this.getNextLevelConfig();if(!e)return{eligible:!1,reason:"Maximum Level Reached"};if(this.economy.cash<e.upgradeCost)return{eligible:!1,reason:`Need $${(e.upgradeCost-this.economy.cash).toLocaleString()} more cash`};const t=this.checkDevelopmentPrerequisite(e);return t.met?{eligible:!0}:{eligible:!1,reason:`Must develop plaza: ${e.requiredDev.label} (${t.details})`}}upgradePlazaLevel(){if(!this.canUpgradePlazaLevel().eligible)return!1;const t=this.getNextLevelConfig();return this.economy.recordTransaction("CONSTRUCTION",-t.upgradeCost,`Plaza Upgraded to ${t.name}`,this.day,this.hour),this.plazaLevel+=1,this.reputationStars=Math.min(5,this.reputationStars+.05),me.playFanfare(),Sn.emit("PLAZA_LEVEL_UPGRADED",{level:this.plazaLevel}),!0}getParcelCost(e){switch(e){case"plot_north":return 3500;case"plot_east":return 8e3;case"plot_south":return 15e3;case"plot_deep_east":return 28e3;default:return 5e3}}buyLandParcel(e){if(this.purchasedParcels.has(e))return!1;const t=this.getParcelCost(e);return this.economy.cash<t?!1:(this.economy.recordTransaction("CONSTRUCTION",-t,`Purchased Land Parcel (${e})`,this.day,this.hour),this.purchasedParcels.add(e),me.playCashSound(),Sn.emit("LAND_PARCEL_PURCHASED",{parcelId:e}),!0)}upgradeHighwayLanes(){if(this.highwayLanesLevel>=6)return!1;const e=45e3;return this.economy.cash<e?!1:(this.economy.recordTransaction("CONSTRUCTION",-e,"Expanded Interstate Highway to 6 Lanes",this.day,this.hour),this.highwayLanesLevel=6,me.playFanfare(),Sn.emit("HIGHWAY_LANES_UPGRADED",{lanes:6}),!0)}recordCustomerServed(e,t="Fueling Customer"){this.totalCustomersServed+=1,this.economy.recordTransaction("FUEL",e,t,this.day,this.hour)}upgradeFacilityCapacity(e){let t=1200;return e==="FUEL"&&(t=1200*this.fuelCapacityLevel),e==="SHOP"&&(t=1500*this.storeCapacityLevel),e==="MOTEL"&&(t=2e3*this.motelCapacityLevel),this.economy.cash<t?!1:(this.economy.recordTransaction("CONSTRUCTION",-t,`Upgraded ${e} Capacity`,this.day,this.hour),e==="FUEL"&&(this.fuelCapacityLevel+=1),e==="SHOP"&&(this.storeCapacityLevel+=1),e==="MOTEL"&&(this.motelCapacityLevel+=1),me.playCashSound(),Sn.emit("CAPACITY_UPGRADED",{category:e}),!0)}saveToStorage(){try{const e={day:this.day,hour:this.hour,cash:this.economy.cash,buildings:this.buildings,reputationStars:this.reputationStars,unlockedTechIds:Array.from(this.unlockedTechIds),scenarioId:this.scenario.id};localStorage.setItem(Qc,JSON.stringify(e))}catch(e){console.warn("Unable to auto-save to localStorage",e)}}loadFromStorage(){try{const e=localStorage.getItem(Qc);if(!e)return!1;const t=JSON.parse(e);return this.day=t.day||1,this.hour=t.hour||8,this.economy.cash=t.cash||this.scenario.initialCash,Array.isArray(t.buildings)&&t.buildings.length>0&&(this.buildings=t.buildings),this.reputationStars=t.reputationStars||3.8,Array.isArray(t.unlockedTechIds)&&(this.unlockedTechIds=new Set(t.unlockedTechIds)),!0}catch{return!1}}resetGame(){localStorage.removeItem(Qc),window.location.reload()}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const mf="186",xS=0,um=1,vS=2,vl=1,Tx=2,Ea=3,$r=0,bn=1,Di=2,Bi=0,Fa=1,dm=2,hm=3,fm=4,_S=5,_s=100,yS=101,SS=102,MS=103,wS=104,ES=200,TS=201,bS=202,CS=203,bx=204,Cx=205,AS=206,RS=207,PS=208,LS=209,NS=210,IS=211,DS=212,US=213,FS=214,Rd=0,Pd=1,Ld=2,no=3,Nd=4,Id=5,Dd=6,Ud=7,Ax=0,OS=1,kS=2,Mi=0,Rx=1,Px=2,Lx=3,Nx=4,Ix=5,Dx=6,Ux=7,Fx=300,Yr=301,qs=302,eu=303,tu=304,yc=306,Fd=1e3,Oi=1001,Od=1002,Zt=1003,BS=1004,Uo=1005,Qt=1006,nu=1007,Or=1008,Ln=1009,Ox=1010,kx=1011,io=1012,gf=1013,wi=1014,vi=1015,Ei=1016,xf=1017,vf=1018,ro=1020,Bx=35902,zx=35899,Vx=1021,Hx=1022,ri=1023,Xi=1026,kr=1027,Gx=1028,_f=1029,qr=1030,yf=1031,Sf=1033,_l=33776,yl=33777,Sl=33778,Ml=33779,kd=35840,Bd=35841,zd=35842,Vd=35843,Hd=36196,Gd=37492,Wd=37496,jd=37488,Xd=37489,Yl=37490,$d=37491,Yd=37808,qd=37809,Kd=37810,Zd=37811,Qd=37812,Jd=37813,eh=37814,th=37815,nh=37816,ih=37817,rh=37818,sh=37819,ah=37820,oh=37821,lh=36492,ch=36494,uh=36495,dh=36283,hh=36284,ql=36285,fh=36286,zS=3200,ph=0,VS=1,or="",Bn="srgb",Kl="srgb-linear",Zl="linear",dt="srgb",iu=7680,HS=519,GS=512,WS=513,jS=514,Mf=515,XS=516,$S=517,wf=518,YS=519,Wx=35044,pm="300 es",_i=2e3,so=2001;function qS(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Ql(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function KS(){const n=Ql("canvas");return n.style.display="block",n}const mm={};function Jl(...n){const e="THREE."+n.shift();console.log(e,...n)}function jx(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Fe(...n){n=jx(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function nt(...n){n=jx(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function zs(...n){const e=n.join(" ");e in mm||(mm[e]=!0,Fe(...n))}function ZS(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}const QS={[Rd]:Pd,[Ld]:Dd,[Nd]:Ud,[no]:Id,[Pd]:Rd,[Dd]:Ld,[Ud]:Nd,[Id]:no};class Qr{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const an=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let gm=1234567;const Oa=Math.PI/180,ao=180/Math.PI;function zi(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(an[n&255]+an[n>>8&255]+an[n>>16&255]+an[n>>24&255]+"-"+an[e&255]+an[e>>8&255]+"-"+an[e>>16&15|64]+an[e>>24&255]+"-"+an[t&63|128]+an[t>>8&255]+"-"+an[t>>16&255]+an[t>>24&255]+an[i&255]+an[i>>8&255]+an[i>>16&255]+an[i>>24&255]).toLowerCase()}function $e(n,e,t){return Math.max(e,Math.min(t,n))}function Ef(n,e){return(n%e+e)%e}function JS(n,e,t,i,r){return i+(n-e)*(r-i)/(t-e)}function eM(n,e,t){return n!==e?(t-n)/(e-n):0}function ka(n,e,t){return(1-t)*n+t*e}function tM(n,e,t,i){return ka(n,e,1-Math.exp(-t*i))}function nM(n,e=1){return e-Math.abs(Ef(n,e*2)-e)}function iM(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function rM(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function sM(n,e){return n+Math.floor(Math.random()*(e-n+1))}function aM(n,e){return n+Math.random()*(e-n)}function oM(n){return n*(.5-Math.random())}function lM(n){n!==void 0&&(gm=n);let e=gm+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function cM(n){return n*Oa}function uM(n){return n*ao}function dM(n){return n>0&&Number.isInteger(n)&&2**Math.round(Math.log2(n))===n}function hM(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function fM(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function pM(n,e,t,i,r){const s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+i)/2),h=a((e+i)/2),u=s((e-i)/2),d=a((e-i)/2),p=s((i-e)/2),g=a((i-e)/2);switch(r){case"XYX":n.set(o*h,l*u,l*d,o*c);break;case"YZY":n.set(l*d,o*h,l*u,o*c);break;case"ZXZ":n.set(l*u,l*d,o*h,o*c);break;case"XZX":n.set(o*h,l*g,l*p,o*c);break;case"YXY":n.set(l*p,o*h,l*g,o*c);break;case"ZYZ":n.set(l*g,l*p,o*h,o*c);break;default:Fe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function ii(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:case Uint8ClampedArray:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function ht(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Ns={DEG2RAD:Oa,RAD2DEG:ao,generateUUID:zi,clamp:$e,euclideanModulo:Ef,mapLinear:JS,inverseLerp:eM,lerp:ka,damp:tM,pingpong:nM,smoothstep:iM,smootherstep:rM,randInt:sM,randFloat:aM,randFloatSpread:oM,seededRandom:lM,degToRad:cM,radToDeg:uM,isPowerOfTwo:dM,ceilPowerOfTwo:hM,floorPowerOfTwo:fM,setQuaternionFromProperEuler:pM,normalize:ht,denormalize:ii},Df=class Df{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos($e(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Df.prototype.isVector2=!0;let ke=Df;class ea{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,a,o){let l=i[r+0],c=i[r+1],h=i[r+2],u=i[r+3],d=s[a+0],p=s[a+1],g=s[a+2],M=s[a+3];if(u!==M||l!==d||c!==p||h!==g){let x=l*d+c*p+h*g+u*M;x<0&&(d=-d,p=-p,g=-g,M=-M,x=-x);let f=1-o;if(x<.9995){const v=Math.acos(x),E=Math.sin(v);f=Math.sin(f*v)/E,o=Math.sin(o*v)/E,l=l*f+d*o,c=c*f+p*o,h=h*f+g*o,u=u*f+M*o}else{l=l*f+d*o,c=c*f+p*o,h=h*f+g*o,u=u*f+M*o;const v=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=v,c*=v,h*=v,u*=v}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,r,s,a){const o=i[r],l=i[r+1],c=i[r+2],h=i[r+3],u=s[a],d=s[a+1],p=s[a+2],g=s[a+3];return e[t]=o*g+h*u+l*p-c*d,e[t+1]=l*g+h*d+c*u-o*p,e[t+2]=c*g+h*p+o*d-l*u,e[t+3]=h*g-o*u-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(r/2),u=o(s/2),d=l(i/2),p=l(r/2),g=l(s/2);switch(a){case"XYZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"YXZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"ZXY":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"ZYX":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"YZX":this._x=d*h*u+c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u-d*p*g;break;case"XZY":this._x=d*h*u-c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u+d*p*g;break;default:Fe("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=i+o+u;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-l)*p,this._y=(s-c)*p,this._z=(a-r)*p}else if(i>o&&i>u){const p=2*Math.sqrt(1+i-o-u);this._w=(h-l)/p,this._x=.25*p,this._y=(r+a)/p,this._z=(s+c)/p}else if(o>u){const p=2*Math.sqrt(1+o-i-u);this._w=(s-c)/p,this._x=(r+a)/p,this._y=.25*p,this._z=(l+h)/p}else{const p=2*Math.sqrt(1+u-i-o);this._w=(a-r)/p,this._x=(s+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs($e(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+a*o+r*c-s*l,this._y=r*h+a*l+s*o-i*c,this._z=s*h+a*c+i*l-r*o,this._w=a*h-i*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,r=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,r=-r,s=-s,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Uf=class Uf{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(xm.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(xm.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*i),h=2*(o*t-s*r),u=2*(s*i-a*t);return this.x=t+l*c+a*u-o*h,this.y=i+l*h+o*c-s*u,this.z=r+l*u+s*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ru.copy(this).projectOnVector(e),this.sub(ru)}reflect(e){return this.sub(ru.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos($e(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Uf.prototype.isVector3=!0;let R=Uf;const ru=new R,xm=new ea,Ff=class Ff{constructor(e,t,i,r,s,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,l,c)}set(e,t,i,r,s,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=r,h[2]=o,h[3]=t,h[4]=s,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],u=i[7],d=i[2],p=i[5],g=i[8],M=r[0],x=r[3],f=r[6],v=r[1],E=r[4],S=r[7],T=r[2],b=r[5],C=r[8];return s[0]=a*M+o*v+l*T,s[3]=a*x+o*E+l*b,s[6]=a*f+o*S+l*C,s[1]=c*M+h*v+u*T,s[4]=c*x+h*E+u*b,s[7]=c*f+h*S+u*C,s[2]=d*M+p*v+g*T,s[5]=d*x+p*E+g*b,s[8]=d*f+p*S+g*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-i*s*h+i*o*l+r*s*c-r*a*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*s,p=c*s-a*l,g=t*u+i*d+r*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/g;return e[0]=u*M,e[1]=(r*c-h*i)*M,e[2]=(o*i-r*a)*M,e[3]=d*M,e[4]=(h*t-r*l)*M,e[5]=(r*s-o*t)*M,e[6]=p*M,e[7]=(i*l-c*t)*M,e[8]=(a*t-i*s)*M,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return zs("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(su.makeScale(e,t)),this}rotate(e){return zs("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(su.makeRotation(-e)),this}translate(e,t){return zs("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(su.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Ff.prototype.isMatrix3=!0;let ze=Ff;const su=new ze,vm=new ze().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),_m=new ze().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function mM(){const n={enabled:!0,workingColorSpace:Kl,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===dt&&(r.r=Vi(r.r),r.g=Vi(r.g),r.b=Vi(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===dt&&(r.r=Vs(r.r),r.g=Vs(r.g),r.b=Vs(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===or?Zl:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return zs("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return zs("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Kl]:{primaries:e,whitePoint:i,transfer:Zl,toXYZ:vm,fromXYZ:_m,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Bn},outputColorSpaceConfig:{drawingBufferColorSpace:Bn}},[Bn]:{primaries:e,whitePoint:i,transfer:dt,toXYZ:vm,fromXYZ:_m,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Bn}}}),n}const et=mM();function Vi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Vs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let ns;class gM{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{ns===void 0&&(ns=Ql("canvas")),ns.width=e.width,ns.height=e.height;const r=ns.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=ns}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ql("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=Vi(s[a]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Vi(t[i]/255)*255):t[i]=Vi(t[i]);return{data:t,width:e.width,height:e.height}}else return Fe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let xM=0;class Tf{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:xM++}),this.uuid=zi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(au(r[a].image)):s.push(au(r[a]))}else s=au(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function au(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?gM.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Fe("Texture: Unable to serialize Texture."),{})}let vM=0;const ou=new R;class cn extends Qr{constructor(e=cn.DEFAULT_IMAGE,t=cn.DEFAULT_MAPPING,i=Oi,r=Oi,s=Qt,a=Or,o=ri,l=Ln,c=cn.DEFAULT_ANISOTROPY,h=or){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:vM++}),this.uuid=zi(),this.name="",this.source=new Tf(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ke(0,0),this.repeat=new ke(1,1),this.center=new ke(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ze,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(ou).x}get height(){return this.source.getSize(ou).y}get depth(){return this.source.getSize(ou).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Fe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Fe(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Fx)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Fd:e.x=e.x-Math.floor(e.x);break;case Oi:e.x=e.x<0?0:1;break;case Od:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Fd:e.y=e.y-Math.floor(e.y);break;case Oi:e.y=e.y<0?0:1;break;case Od:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}cn.DEFAULT_IMAGE=null;cn.DEFAULT_MAPPING=Fx;cn.DEFAULT_ANISOTROPY=1;const Of=class Of{constructor(e=0,t=0,i=0,r=1){this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*i+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],p=l[5],g=l[9],M=l[2],x=l[6],f=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-M)<.01&&Math.abs(g-x)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+M)<.1&&Math.abs(g+x)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const E=(c+1)/2,S=(p+1)/2,T=(f+1)/2,b=(h+d)/4,C=(u+M)/4,_=(g+x)/4;return E>S&&E>T?E<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(E),r=b/i,s=C/i):S>T?S<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),i=b/r,s=_/r):T<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(T),i=C/s,r=_/s),this.set(i,r,s,t),this}let v=Math.sqrt((x-g)*(x-g)+(u-M)*(u-M)+(d-h)*(d-h));return Math.abs(v)<.001&&(v=1),this.x=(x-g)/v,this.y=(u-M)/v,this.z=(d-h)/v,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this.w=$e(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this.w=$e(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Of.prototype.isVector4=!0;let At=Of;class _M extends Qr{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Qt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new At(0,0,e,t),this.scissorTest=!1,this.viewport=new At(0,0,e,t),this.textures=[];const r={width:e,height:t,depth:i.depth},s=new cn(r),a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Qt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new Tf(r)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class oi extends _M{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Xx extends cn{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Zt,this.minFilter=Zt,this.wrapR=Oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class yM extends cn{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Zt,this.minFilter=Zt,this.wrapR=Oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const ic=class ic{constructor(e,t,i,r,s,a,o,l,c,h,u,d,p,g,M,x){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,l,c,h,u,d,p,g,M,x)}set(e,t,i,r,s,a,o,l,c,h,u,d,p,g,M,x){const f=this.elements;return f[0]=e,f[4]=t,f[8]=i,f[12]=r,f[1]=s,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=h,f[10]=u,f[14]=d,f[3]=p,f[7]=g,f[11]=M,f[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ic().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,r=1/is.setFromMatrixColumn(e,0).length(),s=1/is.setFromMatrixColumn(e,1).length(),a=1/is.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),h=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){const d=a*h,p=a*u,g=o*h,M=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=p+g*c,t[5]=d-M*c,t[9]=-o*l,t[2]=M-d*c,t[6]=g+p*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*h,p=l*u,g=c*h,M=c*u;t[0]=d+M*o,t[4]=g*o-p,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=p*o-g,t[6]=M+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*h,p=l*u,g=c*h,M=c*u;t[0]=d-M*o,t[4]=-a*u,t[8]=g+p*o,t[1]=p+g*o,t[5]=a*h,t[9]=M-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*h,p=a*u,g=o*h,M=o*u;t[0]=l*h,t[4]=g*c-p,t[8]=d*c+M,t[1]=l*u,t[5]=M*c+d,t[9]=p*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,p=a*c,g=o*l,M=o*c;t[0]=l*h,t[4]=M-d*u,t[8]=g*u+p,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=p*u+g,t[10]=d-M*u}else if(e.order==="XZY"){const d=a*l,p=a*c,g=o*l,M=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+M,t[5]=a*h,t[9]=p*u-g,t[2]=g*u-p,t[6]=o*h,t[10]=M*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(SM,e,MM)}lookAt(e,t,i){const r=this.elements;return An.subVectors(e,t),An.lengthSq()===0&&(An.z=1),An.normalize(),Qi.crossVectors(i,An),Qi.lengthSq()===0&&(Math.abs(i.z)===1?An.x+=1e-4:An.z+=1e-4,An.normalize(),Qi.crossVectors(i,An)),Qi.normalize(),Fo.crossVectors(An,Qi),r[0]=Qi.x,r[4]=Fo.x,r[8]=An.x,r[1]=Qi.y,r[5]=Fo.y,r[9]=An.y,r[2]=Qi.z,r[6]=Fo.z,r[10]=An.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],u=i[5],d=i[9],p=i[13],g=i[2],M=i[6],x=i[10],f=i[14],v=i[3],E=i[7],S=i[11],T=i[15],b=r[0],C=r[4],_=r[8],A=r[12],L=r[1],I=r[5],N=r[9],k=r[13],D=r[2],V=r[6],q=r[10],$=r[14],H=r[3],B=r[7],j=r[11],J=r[15];return s[0]=a*b+o*L+l*D+c*H,s[4]=a*C+o*I+l*V+c*B,s[8]=a*_+o*N+l*q+c*j,s[12]=a*A+o*k+l*$+c*J,s[1]=h*b+u*L+d*D+p*H,s[5]=h*C+u*I+d*V+p*B,s[9]=h*_+u*N+d*q+p*j,s[13]=h*A+u*k+d*$+p*J,s[2]=g*b+M*L+x*D+f*H,s[6]=g*C+M*I+x*V+f*B,s[10]=g*_+M*N+x*q+f*j,s[14]=g*A+M*k+x*$+f*J,s[3]=v*b+E*L+S*D+T*H,s[7]=v*C+E*I+S*V+T*B,s[11]=v*_+E*N+S*q+T*j,s[15]=v*A+E*k+S*$+T*J,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],p=e[14],g=e[3],M=e[7],x=e[11],f=e[15],v=l*p-c*d,E=o*p-c*u,S=o*d-l*u,T=a*p-c*h,b=a*d-l*h,C=a*u-o*h;return t*(M*v-x*E+f*S)-i*(g*v-x*T+f*b)+r*(g*E-M*T+f*C)-s*(g*S-M*b+x*C)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-i*(s*h-o*l)+r*(s*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],p=e[11],g=e[12],M=e[13],x=e[14],f=e[15],v=t*o-i*a,E=t*l-r*a,S=t*c-s*a,T=i*l-r*o,b=i*c-s*o,C=r*c-s*l,_=h*M-u*g,A=h*x-d*g,L=h*f-p*g,I=u*x-d*M,N=u*f-p*M,k=d*f-p*x,D=v*k-E*N+S*I+T*L-b*A+C*_;if(D===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const V=1/D;return e[0]=(o*k-l*N+c*I)*V,e[1]=(r*N-i*k-s*I)*V,e[2]=(M*C-x*b+f*T)*V,e[3]=(d*b-u*C-p*T)*V,e[4]=(l*L-a*k-c*A)*V,e[5]=(t*k-r*L+s*A)*V,e[6]=(x*S-g*C-f*E)*V,e[7]=(h*C-d*S+p*E)*V,e[8]=(a*N-o*L+c*_)*V,e[9]=(i*L-t*N-s*_)*V,e[10]=(g*b-M*S+f*v)*V,e[11]=(u*S-h*b-p*v)*V,e[12]=(o*A-a*I-l*_)*V,e[13]=(t*I-i*A+r*_)*V,e[14]=(M*E-g*T-x*v)*V,e[15]=(h*T-u*E+d*v)*V,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,h=s*o;return this.set(c*a+i,c*o-r*l,c*l+r*o,0,c*o+r*l,h*o+i,h*l-r*a,0,c*l-r*o,h*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,h=a+a,u=o+o,d=s*c,p=s*h,g=s*u,M=a*h,x=a*u,f=o*u,v=l*c,E=l*h,S=l*u,T=i.x,b=i.y,C=i.z;return r[0]=(1-(M+f))*T,r[1]=(p+S)*T,r[2]=(g-E)*T,r[3]=0,r[4]=(p-S)*b,r[5]=(1-(d+f))*b,r[6]=(x+v)*b,r[7]=0,r[8]=(g+E)*C,r[9]=(x-v)*C,r[10]=(1-(d+M))*C,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];const s=this.determinantAffine();if(s===0)return i.set(1,1,1),t.identity(),this;let a=is.set(r[0],r[1],r[2]).length();const o=is.set(r[4],r[5],r[6]).length(),l=is.set(r[8],r[9],r[10]).length();s<0&&(a=-a),Zn.copy(this);const c=1/a,h=1/o,u=1/l;return Zn.elements[0]*=c,Zn.elements[1]*=c,Zn.elements[2]*=c,Zn.elements[4]*=h,Zn.elements[5]*=h,Zn.elements[6]*=h,Zn.elements[8]*=u,Zn.elements[9]*=u,Zn.elements[10]*=u,t.setFromRotationMatrix(Zn),i.x=a,i.y=o,i.z=l,this}makePerspective(e,t,i,r,s,a,o=_i,l=!1){const c=this.elements,h=2*s/(t-e),u=2*s/(i-r),d=(t+e)/(t-e),p=(i+r)/(i-r);let g,M;if(l)g=s/(a-s),M=a*s/(a-s);else if(o===_i)g=-(a+s)/(a-s),M=-2*a*s/(a-s);else if(o===so)g=-a/(a-s),M=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=M,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,r,s,a,o=_i,l=!1){const c=this.elements,h=2/(t-e),u=2/(i-r),d=-(t+e)/(t-e),p=-(i+r)/(i-r);let g,M;if(l)g=1/(a-s),M=a/(a-s);else if(o===_i)g=-2/(a-s),M=-(a+s)/(a-s);else if(o===so)g=-1/(a-s),M=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=M,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};ic.prototype.isMatrix4=!0;let wt=ic;const is=new R,Zn=new wt,SM=new R(0,0,0),MM=new R(1,1,1),Qi=new R,Fo=new R,An=new R,ym=new wt,Sm=new ea;class Sr{constructor(e=0,t=0,i=0,r=Sr.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],h=r[9],u=r[2],d=r[6],p=r[10];switch(t){case"XYZ":this._y=Math.asin($e(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-$e(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin($e(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-$e(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin($e(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-$e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,p),this._y=0);break;default:Fe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return ym.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ym,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Sm.setFromEuler(this),this.setFromQuaternion(Sm,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Sr.DEFAULT_ORDER="XYZ";class bf{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let wM=0;const Mm=new R,rs=new ea,Ci=new wt,Oo=new R,da=new R,EM=new R,TM=new ea,wm=new R(1,0,0),Em=new R(0,1,0),Tm=new R(0,0,1),bm={type:"added"},bM={type:"removed"},ss={type:"childadded",child:null},lu={type:"childremoved",child:null};class qt extends Qr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:wM++}),this.uuid=zi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=qt.DEFAULT_UP.clone();const e=new R,t=new Sr,i=new ea,r=new R(1,1,1);function s(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new wt},normalMatrix:{value:new ze}}),this.matrix=new wt,this.matrixWorld=new wt,this.matrixAutoUpdate=qt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=qt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new bf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return rs.setFromAxisAngle(e,t),this.quaternion.multiply(rs),this}rotateOnWorldAxis(e,t){return rs.setFromAxisAngle(e,t),this.quaternion.premultiply(rs),this}rotateX(e){return this.rotateOnAxis(wm,e)}rotateY(e){return this.rotateOnAxis(Em,e)}rotateZ(e){return this.rotateOnAxis(Tm,e)}translateOnAxis(e,t){return Mm.copy(e).applyQuaternion(this.quaternion),this.position.add(Mm.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(wm,e)}translateY(e){return this.translateOnAxis(Em,e)}translateZ(e){return this.translateOnAxis(Tm,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ci.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Oo.copy(e):Oo.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),da.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ci.lookAt(da,Oo,this.up):Ci.lookAt(Oo,da,this.up),this.quaternion.setFromRotationMatrix(Ci),r&&(Ci.extractRotation(r.matrixWorld),rs.setFromRotationMatrix(Ci),this.quaternion.premultiply(rs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(nt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(bm),ss.child=e,this.dispatchEvent(ss),ss.child=null):nt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(bM),lu.child=e,this.dispatchEvent(lu),lu.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ci.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ci.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ci),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(bm),ss.child=e,this.dispatchEvent(ss),ss.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(da,e,EM),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(da,TM,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*i-s[8]*r,s[13]+=i-s[1]*t-s[5]*i-s[9]*r,s[14]+=r-s[2]*t-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),p=a(e.animations),g=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=r,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}qt.DEFAULT_UP=new R(0,1,0);qt.DEFAULT_MATRIX_AUTO_UPDATE=!0;qt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Oe extends qt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const CM={type:"move"};class cu{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Oe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Oe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Oe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const M of e.hand.values()){const x=t.getJointPose(M,i),f=this._getHandJoint(c,M);x!==null&&(f.matrix.fromArray(x.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=x.radius),f.visible=x!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,g=.005;c.inputState.pinching&&d>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(CM)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Oe;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const $x={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ji={h:0,s:0,l:0},ko={h:0,s:0,l:0};function uu(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Ke{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Bn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,et.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=et.workingColorSpace){return this.r=e,this.g=t,this.b=i,et.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=et.workingColorSpace){if(e=Ef(e,1),t=$e(t,0,1),i=$e(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,a=2*i-s;this.r=uu(a,s,e+1/3),this.g=uu(a,s,e),this.b=uu(a,s,e-1/3)}return et.colorSpaceToWorking(this,r),this}setStyle(e,t=Bn){function i(s){s!==void 0&&parseFloat(s)<1&&Fe("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Fe("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);Fe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Bn){const i=$x[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Fe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Vi(e.r),this.g=Vi(e.g),this.b=Vi(e.b),this}copyLinearToSRGB(e){return this.r=Vs(e.r),this.g=Vs(e.g),this.b=Vs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Bn){return et.workingToColorSpace(on.copy(this),e),Math.round($e(on.r*255,0,255))*65536+Math.round($e(on.g*255,0,255))*256+Math.round($e(on.b*255,0,255))}getHexString(e=Bn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=et.workingColorSpace){et.workingToColorSpace(on.copy(this),t);const i=on.r,r=on.g,s=on.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case i:l=(r-s)/u+(r<s?6:0);break;case r:l=(s-i)/u+2;break;case s:l=(i-r)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=et.workingColorSpace){return et.workingToColorSpace(on.copy(this),t),e.r=on.r,e.g=on.g,e.b=on.b,e}getStyle(e=Bn){et.workingToColorSpace(on.copy(this),e);const t=on.r,i=on.g,r=on.b;return e!==Bn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Ji),this.setHSL(Ji.h+e,Ji.s+t,Ji.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Ji),e.getHSL(ko);const i=ka(Ji.h,ko.h,t),r=ka(Ji.s,ko.s,t),s=ka(Ji.l,ko.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const on=new Ke;Ke.NAMES=$x;class Cf{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ke(e),this.density=t}clone(){return new Cf(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class AM extends qt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Sr,this.environmentIntensity=1,this.environmentRotation=new Sr,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Qn=new R,Ai=new R,du=new R,Ri=new R,as=new R,os=new R,Cm=new R,hu=new R,fu=new R,pu=new R,mu=new At,gu=new At,xu=new At;class Gn{constructor(e=new R,t=new R,i=new R){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),Qn.subVectors(e,t),r.cross(Qn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){Qn.subVectors(r,t),Ai.subVectors(i,t),du.subVectors(e,t);const a=Qn.dot(Qn),o=Qn.dot(Ai),l=Qn.dot(du),c=Ai.dot(Ai),h=Ai.dot(du),u=a*c-o*o;if(u===0)return s.set(0,0,0),null;const d=1/u,p=(c*l-o*h)*d,g=(a*h-o*l)*d;return s.set(1-p-g,g,p)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Ri)===null?!1:Ri.x>=0&&Ri.y>=0&&Ri.x+Ri.y<=1}static getInterpolation(e,t,i,r,s,a,o,l){return this.getBarycoord(e,t,i,r,Ri)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Ri.x),l.addScaledVector(a,Ri.y),l.addScaledVector(o,Ri.z),l)}static getInterpolatedAttribute(e,t,i,r,s,a){return mu.setScalar(0),gu.setScalar(0),xu.setScalar(0),mu.fromBufferAttribute(e,t),gu.fromBufferAttribute(e,i),xu.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(mu,s.x),a.addScaledVector(gu,s.y),a.addScaledVector(xu,s.z),a}static isFrontFacing(e,t,i,r){return Qn.subVectors(i,t),Ai.subVectors(e,t),Qn.cross(Ai).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Qn.subVectors(this.c,this.b),Ai.subVectors(this.a,this.b),Qn.cross(Ai).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Gn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Gn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return Gn.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return Gn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Gn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let a,o;as.subVectors(r,i),os.subVectors(s,i),hu.subVectors(e,i);const l=as.dot(hu),c=os.dot(hu);if(l<=0&&c<=0)return t.copy(i);fu.subVectors(e,r);const h=as.dot(fu),u=os.dot(fu);if(h>=0&&u<=h)return t.copy(r);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(i).addScaledVector(as,a);pu.subVectors(e,s);const p=as.dot(pu),g=os.dot(pu);if(g>=0&&p<=g)return t.copy(s);const M=p*c-l*g;if(M<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(i).addScaledVector(os,o);const x=h*g-p*u;if(x<=0&&u-h>=0&&p-g>=0)return Cm.subVectors(s,r),o=(u-h)/(u-h+(p-g)),t.copy(r).addScaledVector(Cm,o);const f=1/(x+M+d);return a=M*f,o=d*f,t.copy(i).addScaledVector(as,a).addScaledVector(os,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class mo{constructor(e=new R(1/0,1/0,1/0),t=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Jn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Jn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Jn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Jn):Jn.fromBufferAttribute(s,a),Jn.applyMatrix4(e.matrixWorld),this.expandByPoint(Jn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Bo.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Bo.copy(i.boundingBox)),Bo.applyMatrix4(e.matrixWorld),this.union(Bo)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Jn),Jn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ha),zo.subVectors(this.max,ha),ls.subVectors(e.a,ha),cs.subVectors(e.b,ha),us.subVectors(e.c,ha),er.subVectors(cs,ls),tr.subVectors(us,cs),br.subVectors(ls,us);let t=[0,-er.z,er.y,0,-tr.z,tr.y,0,-br.z,br.y,er.z,0,-er.x,tr.z,0,-tr.x,br.z,0,-br.x,-er.y,er.x,0,-tr.y,tr.x,0,-br.y,br.x,0];return!vu(t,ls,cs,us,zo)||(t=[1,0,0,0,1,0,0,0,1],!vu(t,ls,cs,us,zo))?!1:(Vo.crossVectors(er,tr),t=[Vo.x,Vo.y,Vo.z],vu(t,ls,cs,us,zo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Jn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Jn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Pi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Pi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Pi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Pi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Pi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Pi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Pi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Pi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Pi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Pi=[new R,new R,new R,new R,new R,new R,new R,new R],Jn=new R,Bo=new mo,ls=new R,cs=new R,us=new R,er=new R,tr=new R,br=new R,ha=new R,zo=new R,Vo=new R,Cr=new R;function vu(n,e,t,i,r){for(let s=0,a=n.length-3;s<=a;s+=3){Cr.fromArray(n,s);const o=r.x*Math.abs(Cr.x)+r.y*Math.abs(Cr.y)+r.z*Math.abs(Cr.z),l=e.dot(Cr),c=t.dot(Cr),h=i.dot(Cr);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Ot=new R,Ho=new ke;let RM=0;class Xn extends Qr{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:RM++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Wx,this.updateRanges=[],this.gpuType=vi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ho.fromBufferAttribute(this,t),Ho.applyMatrix3(e),this.setXY(t,Ho.x,Ho.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Ot.fromBufferAttribute(this,t),Ot.applyMatrix3(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Ot.fromBufferAttribute(this,t),Ot.applyMatrix4(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Ot.fromBufferAttribute(this,t),Ot.applyNormalMatrix(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Ot.fromBufferAttribute(this,t),Ot.transformDirection(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=ii(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=ht(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ii(t,this.array)),t}setX(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ii(t,this.array)),t}setY(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ii(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ii(t,this.array)),t}setW(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),i=ht(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),i=ht(i,this.array),r=ht(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),i=ht(i,this.array),r=ht(r,this.array),s=ht(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class Yx extends Xn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class qx extends Xn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class gn extends Xn{constructor(e,t,i){super(new Float32Array(e),t,i)}}const PM=new mo,fa=new R,_u=new R;class Af{constructor(e=new R,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):PM.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;fa.subVectors(e,this.center);const t=fa.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(fa,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(_u.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(fa.copy(e.center).add(_u)),this.expandByPoint(fa.copy(e.center).sub(_u))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let LM=0;const kn=new wt,yu=new qt,ds=new R,Rn=new mo,pa=new mo,jt=new R;class Cn extends Qr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:LM++}),this.uuid=zi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(qS(e)?qx:Yx)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new ze().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return kn.makeRotationFromQuaternion(e),this.applyMatrix4(kn),this}rotateX(e){return kn.makeRotationX(e),this.applyMatrix4(kn),this}rotateY(e){return kn.makeRotationY(e),this.applyMatrix4(kn),this}rotateZ(e){return kn.makeRotationZ(e),this.applyMatrix4(kn),this}translate(e,t,i){return kn.makeTranslation(e,t,i),this.applyMatrix4(kn),this}scale(e,t,i){return kn.makeScale(e,t,i),this.applyMatrix4(kn),this}lookAt(e){return yu.lookAt(e),yu.updateMatrix(),this.applyMatrix4(yu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ds).negate(),this.translate(ds.x,ds.y,ds.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new gn(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&Fe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new mo);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){nt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];Rn.setFromBufferAttribute(s),this.morphTargetsRelative?(jt.addVectors(this.boundingBox.min,Rn.min),this.boundingBox.expandByPoint(jt),jt.addVectors(this.boundingBox.max,Rn.max),this.boundingBox.expandByPoint(jt)):(this.boundingBox.expandByPoint(Rn.min),this.boundingBox.expandByPoint(Rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&nt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Af);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){nt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(e){const i=this.boundingSphere.center;if(Rn.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];pa.setFromBufferAttribute(o),this.morphTargetsRelative?(jt.addVectors(Rn.min,pa.min),Rn.expandByPoint(jt),jt.addVectors(Rn.max,pa.max),Rn.expandByPoint(jt)):(Rn.expandByPoint(pa.min),Rn.expandByPoint(pa.max))}Rn.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)jt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(jt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)jt.fromBufferAttribute(o,c),l&&(ds.fromBufferAttribute(e,c),jt.add(ds)),r=Math.max(r,i.distanceToSquared(jt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&nt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){nt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new Xn(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let _=0;_<i.count;_++)o[_]=new R,l[_]=new R;const c=new R,h=new R,u=new R,d=new ke,p=new ke,g=new ke,M=new R,x=new R;function f(_,A,L){c.fromBufferAttribute(i,_),h.fromBufferAttribute(i,A),u.fromBufferAttribute(i,L),d.fromBufferAttribute(s,_),p.fromBufferAttribute(s,A),g.fromBufferAttribute(s,L),h.sub(c),u.sub(c),p.sub(d),g.sub(d);const I=1/(p.x*g.y-g.x*p.y);isFinite(I)&&(M.copy(h).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(I),x.copy(u).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(I),o[_].add(M),o[A].add(M),o[L].add(M),l[_].add(x),l[A].add(x),l[L].add(x))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let _=0,A=v.length;_<A;++_){const L=v[_],I=L.start,N=L.count;for(let k=I,D=I+N;k<D;k+=3)f(e.getX(k+0),e.getX(k+1),e.getX(k+2))}const E=new R,S=new R,T=new R,b=new R;function C(_){T.fromBufferAttribute(r,_),b.copy(T);const A=o[_];E.copy(A),E.sub(T.multiplyScalar(T.dot(A))).normalize(),S.crossVectors(b,A);const I=S.dot(l[_])<0?-1:1;a.setXYZW(_,E.x,E.y,E.z,I)}for(let _=0,A=v.length;_<A;++_){const L=v[_],I=L.start,N=L.count;for(let k=I,D=I+N;k<D;k+=3)C(e.getX(k+0)),C(e.getX(k+1)),C(e.getX(k+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new Xn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);const r=new R,s=new R,a=new R,o=new R,l=new R,c=new R,h=new R,u=new R;if(e)for(let d=0,p=e.count;d<p;d+=3){const g=e.getX(d+0),M=e.getX(d+1),x=e.getX(d+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,M),a.fromBufferAttribute(t,x),h.subVectors(a,s),u.subVectors(r,s),h.cross(u),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,M),c.fromBufferAttribute(i,x),o.add(h),l.add(h),c.add(h),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(M,l.x,l.y,l.z),i.setXYZ(x,c.x,c.y,c.z)}else for(let d=0,p=t.count;d<p;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,s),u.subVectors(r,s),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)jt.fromBufferAttribute(e,t),jt.normalize(),e.setXYZ(t,jt.x,jt.y,jt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h);let p=0,g=0;for(let M=0,x=l.length;M<x;M++){o.isInterleavedBufferAttribute?p=l[M]*o.data.stride+o.offset:p=l[M]*h;for(let f=0;f<h;f++)d[g++]=c[p++]}return new Xn(d,h,u)}if(this.index===null)return Fe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Cn,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,i);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let h=0,u=c.length;h<u;h++){const d=c[h],p=e(d,i);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const p=c[u];h.push(p.toJSON(e.data))}h.length>0&&(r[l]=h,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const c in r){const h=r[c];this.setAttribute(c,h.clone(t))}const s=e.morphAttributes;for(const c in s){const h=[],u=s[c];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class NM{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Wx,this.updateRanges=[],this.version=0,this.uuid=zi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[i+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=zi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=zi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));const t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}}const hn=new R;class ec{constructor(e,t,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)hn.fromBufferAttribute(this,t),hn.applyMatrix4(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)hn.fromBufferAttribute(this,t),hn.applyNormalMatrix(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)hn.fromBufferAttribute(this,t),hn.transformDirection(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=ii(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=ht(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=ii(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=ii(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=ii(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=ii(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),i=ht(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),i=ht(i,this.array),r=ht(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),i=ht(i,this.array),r=ht(r,this.array),s=ht(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){Jl("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new Xn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new ec(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Jl("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const Su=new R,IM=new R,DM=new ze;class mi{constructor(e=new R(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Su.subVectors(i,t).cross(IM.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const r=e.delta(Su),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||DM.getNormalMatrix(e),r=this.coplanarPoint(Su).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let UM=0;class ta extends Qr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:UM++}),this.uuid=zi(),this.name="",this.type="Material",this.blending=Fa,this.side=$r,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=bx,this.blendDst=Cx,this.blendEquation=_s,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ke(0,0,0),this.blendAlpha=0,this.depthFunc=no,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=HS,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=iu,this.stencilZFail=iu,this.stencilZPass=iu,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Fe(`Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Fe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector2&&i&&i.isVector2||r&&r.isEuler&&i&&i.isEuler||r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ke().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new mi().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new ke().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ke().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class tc extends ta{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ke(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let hs;const ma=new R,fs=new R,ps=new R,ms=new ke,ga=new ke,Kx=new wt,Go=new R,xa=new R,Wo=new R,Am=new ke,Mu=new ke,Rm=new ke;class mh extends qt{constructor(e=new tc){if(super(),this.isSprite=!0,this.type="Sprite",hs===void 0){hs=new Cn;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new NM(t,5);hs.setIndex([0,1,2,0,2,3]),hs.setAttribute("position",new ec(i,3,0,!1)),hs.setAttribute("uv",new ec(i,2,3,!1))}this.geometry=hs,this.material=e,this.center=new ke(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&nt('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),fs.setFromMatrixScale(this.matrixWorld),Kx.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),ps.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&fs.multiplyScalar(-ps.z);const i=this.material.rotation;let r,s;i!==0&&(s=Math.cos(i),r=Math.sin(i));const a=this.center;jo(Go.set(-.5,-.5,0),ps,a,fs,r,s),jo(xa.set(.5,-.5,0),ps,a,fs,r,s),jo(Wo.set(.5,.5,0),ps,a,fs,r,s),Am.set(0,0),Mu.set(1,0),Rm.set(1,1);let o=e.ray.intersectTriangle(Go,xa,Wo,!1,ma);if(o===null&&(jo(xa.set(-.5,.5,0),ps,a,fs,r,s),Mu.set(0,1),o=e.ray.intersectTriangle(Go,Wo,xa,!1,ma),o===null))return;const l=e.ray.origin.distanceTo(ma);l<e.near||l>e.far||t.push({distance:l,point:ma.clone(),uv:Gn.getInterpolation(ma,Go,xa,Wo,Am,Mu,Rm,new ke),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function jo(n,e,t,i,r,s){ms.subVectors(n,t).addScalar(.5).multiply(i),r!==void 0?(ga.x=s*ms.x-r*ms.y,ga.y=r*ms.x+s*ms.y):ga.copy(ms),n.copy(e),n.x+=ga.x,n.y+=ga.y,n.applyMatrix4(Kx)}const Li=new R,wu=new R,Xo=new R,$o=new R;class Zx{constructor(e=new R,t=new R(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Li)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Li.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Li.copy(this.origin).addScaledVector(this.direction,t),Li.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){wu.copy(e).add(t).multiplyScalar(.5),Xo.copy(t).sub(e).normalize(),$o.copy(this.origin).sub(wu);const s=e.distanceTo(t)*.5,a=-this.direction.dot(Xo),o=$o.dot(this.direction),l=-$o.dot(Xo),c=$o.lengthSq(),h=Math.abs(1-a*a);let u,d,p,g;if(h>0)if(u=a*l-o,d=a*o-l,g=s*h,u>=0)if(d>=-g)if(d<=g){const M=1/h;u*=M,d*=M,p=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=s,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;else d=-s,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-a*s+o)),d=u>0?-s:Math.min(Math.max(-s,-l),s),p=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-s,-l),s),p=d*(d+2*l)+c):(u=Math.max(0,-(a*s+o)),d=u>0?s:Math.min(Math.max(-s,-l),s),p=-u*u+d*(d+2*l)+c);else d=a>0?-s:s,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(wu).addScaledVector(Xo,d),p}intersectSphere(e,t){if(e.radius<0)return null;Li.subVectors(e.center,this.origin);const i=Li.dot(this.direction),r=Li.dot(Li)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),h>=0?(s=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(s=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,Li)!==null}intersectTriangle(e,t,i,r,s){const a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,u=e.x-a.x,d=e.y-a.y,p=e.z-a.z,g=t.x-a.x,M=t.y-a.y,x=t.z-a.z,f=i.x-a.x,v=i.y-a.y,E=i.z-a.z,S=Math.abs(l),T=Math.abs(c),b=Math.abs(h);let C,_,A,L,I,N,k,D,V,q,$,H;if(S>=T&&S>=b?(A=l,N=u,V=g,H=f,l>=0?(C=c,_=h,L=d,I=p,k=M,D=x,q=v,$=E):(C=h,_=c,L=p,I=d,k=x,D=M,q=E,$=v)):T>=b?(A=c,N=d,V=M,H=v,c>=0?(C=h,_=l,L=p,I=u,k=x,D=g,q=E,$=f):(C=l,_=h,L=u,I=p,k=g,D=x,q=f,$=E)):(A=h,N=p,V=x,H=E,h>=0?(C=l,_=c,L=u,I=d,k=g,D=M,q=f,$=v):(C=c,_=l,L=d,I=u,k=M,D=g,q=v,$=f)),A===0)return null;const B=C/A,j=_/A,J=1/A,_e=L-B*N,Ae=I-j*N,tt=k-B*V,je=D-j*V,We=q-B*H,K=$-j*H,re=We*je-K*tt,Te=_e*K-Ae*We,Be=tt*Ae-je*_e;if(r){if(re<0||Te<0||Be<0)return null}else if((re<0||Te<0||Be<0)&&(re>0||Te>0||Be>0))return null;const Me=re+Te+Be;if(Me===0)return null;const Xe=J*(re*N+Te*V+Be*H);return(Me>0?Xe<0:Xe>0)?null:this.at(Xe/Me,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Nt extends ta{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sr,this.combine=Ax,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Pm=new wt,Ar=new Zx,Yo=new Af,Lm=new R,qo=new R,Ko=new R,Zo=new R,Eu=new R,Qo=new R,Nm=new R,Jo=new R;class ne extends qt{constructor(e=new Cn,t=new Nt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Qo.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=o[l],u=s[l];h!==0&&(Eu.fromBufferAttribute(u,e),a?Qo.addScaledVector(Eu,h):Qo.addScaledVector(Eu.sub(t),h))}t.add(Qo)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Yo.copy(i.boundingSphere),Yo.applyMatrix4(s),Ar.copy(e.ray).recast(e.near),!(Yo.containsPoint(Ar.origin)===!1&&(Ar.intersectSphere(Yo,Lm)===null||Ar.origin.distanceToSquared(Lm)>(e.far-e.near)**2))&&(Pm.copy(s).invert(),Ar.copy(e.ray).applyMatrix4(Pm),!(i.boundingBox!==null&&Ar.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Ar)))}_computeIntersections(e,t,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,M=d.length;g<M;g++){const x=d[g],f=a[x.materialIndex],v=Math.max(x.start,p.start),E=Math.min(o.count,Math.min(x.start+x.count,p.start+p.count));for(let S=v,T=E;S<T;S+=3){const b=o.getX(S),C=o.getX(S+1),_=o.getX(S+2);r=el(this,f,e,i,c,h,u,b,C,_),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=x.materialIndex,t.push(r))}}else{const g=Math.max(0,p.start),M=Math.min(o.count,p.start+p.count);for(let x=g,f=M;x<f;x+=3){const v=o.getX(x),E=o.getX(x+1),S=o.getX(x+2);r=el(this,a,e,i,c,h,u,v,E,S),r&&(r.faceIndex=Math.floor(x/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,M=d.length;g<M;g++){const x=d[g],f=a[x.materialIndex],v=Math.max(x.start,p.start),E=Math.min(l.count,Math.min(x.start+x.count,p.start+p.count));for(let S=v,T=E;S<T;S+=3){const b=S,C=S+1,_=S+2;r=el(this,f,e,i,c,h,u,b,C,_),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=x.materialIndex,t.push(r))}}else{const g=Math.max(0,p.start),M=Math.min(l.count,p.start+p.count);for(let x=g,f=M;x<f;x+=3){const v=x,E=x+1,S=x+2;r=el(this,a,e,i,c,h,u,v,E,S),r&&(r.faceIndex=Math.floor(x/3),t.push(r))}}}}function FM(n,e,t,i,r,s,a,o){let l;if(e.side===bn?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,e.side===$r,o),l===null)return null;Jo.copy(o),Jo.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Jo);return c<t.near||c>t.far?null:{distance:c,point:Jo.clone(),object:n}}function el(n,e,t,i,r,s,a,o,l,c){n.getVertexPosition(o,qo),n.getVertexPosition(l,Ko),n.getVertexPosition(c,Zo);const h=FM(n,e,t,i,qo,Ko,Zo,Nm);if(h){const u=new R;Gn.getBarycoord(Nm,qo,Ko,Zo,u),r&&(h.uv=Gn.getInterpolatedAttribute(r,o,l,c,u,new ke)),s&&(h.uv1=Gn.getInterpolatedAttribute(s,o,l,c,u,new ke)),a&&(h.normal=Gn.getInterpolatedAttribute(a,o,l,c,u,new R),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new R,materialIndex:0};Gn.getNormal(qo,Ko,Zo,d.normal),h.face=d,h.barycoord=u}return h}class OM extends cn{constructor(e=null,t=1,i=1,r,s,a,o,l,c=Zt,h=Zt,u,d){super(null,a,o,l,c,h,r,s,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Rr=new Af,kM=new ke(.5,.5),tl=new R;class Rf{constructor(e=new mi,t=new mi,i=new mi,r=new mi,s=new mi,a=new mi){this.planes=[e,t,i,r,s,a]}set(e,t,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=_i,i=!1){const r=this.planes,s=e.elements,a=s[0],o=s[1],l=s[2],c=s[3],h=s[4],u=s[5],d=s[6],p=s[7],g=s[8],M=s[9],x=s[10],f=s[11],v=s[12],E=s[13],S=s[14],T=s[15];if(r[0].setComponents(c-a,p-h,f-g,T-v).normalize(),r[1].setComponents(c+a,p+h,f+g,T+v).normalize(),r[2].setComponents(c+o,p+u,f+M,T+E).normalize(),r[3].setComponents(c-o,p-u,f-M,T-E).normalize(),i)r[4].setComponents(l,d,x,S).normalize(),r[5].setComponents(c-l,p-d,f-x,T-S).normalize();else if(r[4].setComponents(c-l,p-d,f-x,T-S).normalize(),t===_i)r[5].setComponents(c+l,p+d,f+x,T+S).normalize();else if(t===so)r[5].setComponents(l,d,x,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Rr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Rr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Rr)}intersectsSprite(e){Rr.center.set(0,0,0);const t=kM.distanceTo(e.center);return Rr.radius=.7071067811865476+t,Rr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Rr)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(tl.x=r.normal.x>0?e.max.x:e.min.x,tl.y=r.normal.y>0?e.max.y:e.min.y,tl.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(tl)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Qx extends cn{constructor(e=[],t=Yr,i,r,s,a,o,l,c,h){super(e,t,i,r,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Jx extends cn{constructor(e,t,i,r,s,a,o,l,c){super(e,t,i,r,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class oo extends cn{constructor(e,t,i=wi,r,s,a,o=Zt,l=Zt,c,h=Xi,u=1){if(h!==Xi&&h!==kr)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:u};super(d,r,s,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Tf(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class BM extends oo{constructor(e,t=wi,i=Yr,r,s,a=Zt,o=Zt,l,c=Xi){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,i,r,s,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class ev extends cn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Pe extends Cn{constructor(e=1,t=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],h=[],u=[];let d=0,p=0;g("z","y","x",-1,-1,i,t,e,a,s,0),g("z","y","x",1,-1,i,t,-e,a,s,1),g("x","z","y",1,1,e,i,t,r,a,2),g("x","z","y",1,-1,e,i,-t,r,a,3),g("x","y","z",1,-1,e,t,i,r,s,4),g("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new gn(c,3)),this.setAttribute("normal",new gn(h,3)),this.setAttribute("uv",new gn(u,2));function g(M,x,f,v,E,S,T,b,C,_,A){const L=S/C,I=T/_,N=S/2,k=T/2,D=b/2,V=C+1,q=_+1;let $=0,H=0;const B=new R;for(let j=0;j<q;j++){const J=j*I-k;for(let _e=0;_e<V;_e++){const Ae=_e*L-N;B[M]=Ae*v,B[x]=J*E,B[f]=D,c.push(B.x,B.y,B.z),B[M]=0,B[x]=0,B[f]=b>0?1:-1,h.push(B.x,B.y,B.z),u.push(_e/C),u.push(1-j/_),$+=1}}for(let j=0;j<_;j++)for(let J=0;J<C;J++){const _e=d+J+V*j,Ae=d+J+V*(j+1),tt=d+(J+1)+V*(j+1),je=d+(J+1)+V*j;l.push(_e,Ae,je),l.push(Ae,tt,je),H+=6}o.addGroup(p,H,A),p+=H,d+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Pe(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class $t extends Cn{constructor(e=1,t=1,i=1,r=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const h=[],u=[],d=[],p=[];let g=0;const M=[],x=i/2;let f=0;v(),a===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(h),this.setAttribute("position",new gn(u,3)),this.setAttribute("normal",new gn(d,3)),this.setAttribute("uv",new gn(p,2));function v(){const S=new R,T=new R;let b=0;const C=(t-e)/i;for(let _=0;_<=s;_++){const A=[],L=_/s,I=L*(t-e)+e;for(let N=0;N<=r;N++){const k=N/r,D=k*l+o,V=Math.sin(D),q=Math.cos(D);T.x=I*V,T.y=-L*i+x,T.z=I*q,u.push(T.x,T.y,T.z),S.set(V,C,q).normalize(),d.push(S.x,S.y,S.z),p.push(k,1-L),A.push(g++)}M.push(A)}for(let _=0;_<r;_++)for(let A=0;A<s;A++){const L=M[A][_],I=M[A+1][_],N=M[A+1][_+1],k=M[A][_+1];(e>0||A!==0)&&(h.push(L,I,k),b+=3),(t>0||A!==s-1)&&(h.push(I,N,k),b+=3)}c.addGroup(f,b,0),f+=b}function E(S){const T=g,b=new ke,C=new R;let _=0;const A=S===!0?e:t,L=S===!0?1:-1;for(let N=1;N<=r;N++)u.push(0,x*L,0),d.push(0,L,0),p.push(.5,.5),g++;const I=g;for(let N=0;N<=r;N++){const D=N/r*l+o,V=Math.cos(D),q=Math.sin(D);C.x=A*q,C.y=x*L,C.z=A*V,u.push(C.x,C.y,C.z),d.push(0,L,0),b.x=V*.5+.5,b.y=q*.5*L+.5,p.push(b.x,b.y),g++}for(let N=0;N<r;N++){const k=T+N,D=I+N;S===!0?h.push(D,D+1,k):h.push(D+1,D,k),_+=3}c.addGroup(f,_,S===!0?1:2),f+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $t(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Vr extends $t{constructor(e=1,t=1,i=32,r=1,s=!1,a=0,o=Math.PI*2){super(0,e,t,i,r,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Vr(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class zM{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Fe("Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,r=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),s+=i.distanceTo(r),t.push(s),r=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let r=0;const s=i.length;let a;t?a=t:a=e*i[s-1];let o=0,l=s-1,c;for(;o<=l;)if(r=Math.floor(o+(l-o)/2),c=i[r]-a,c<0)o=r+1;else if(c>0)l=r-1;else{l=r;break}if(r=l,i[r]===a)return r/(s-1);const h=i[r],d=i[r+1]-h,p=(a-h)/d;return(r+p)/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);const a=this.getPoint(r),o=this.getPoint(s),l=t||(a.isVector2?new ke:new R);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new R,r=[],s=[],a=[],o=new R,l=new wt;for(let p=0;p<=e;p++){const g=p/e;r[p]=this.getTangentAt(g,new R)}s[0]=new R,a[0]=new R;let c=Number.MAX_VALUE;const h=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);h<=c&&(c=h,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),d<=c&&i.set(0,0,1),o.crossVectors(r[0],i).normalize(),s[0].crossVectors(r[0],o),a[0].crossVectors(r[0],s[0]);for(let p=1;p<=e;p++){if(s[p]=s[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(r[p-1],r[p]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos($e(r[p-1].dot(r[p]),-1,1));s[p].applyMatrix4(l.makeRotationAxis(o,g))}a[p].crossVectors(r[p],s[p])}if(t===!0){let p=Math.acos($e(s[0].dot(s[e]),-1,1));p/=e,r[0].dot(o.crossVectors(s[0],s[e]))>0&&(p=-p);for(let g=1;g<=e;g++)s[g].applyMatrix4(l.makeRotationAxis(r[g],p*g)),a[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}function Pf(){let n=0,e=0,t=0,i=0;function r(s,a,o,l){n=s,e=o,t=-3*s+3*a-2*o-l,i=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){r(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,h,u){let d=(a-s)/c-(o-s)/(c+h)+(o-a)/h,p=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,p*=h,r(a,o,d,p)},calc:function(s){const a=s*s,o=a*s;return n+e*s+t*a+i*o}}}const Im=new R,Dm=new R,Tu=new Pf,bu=new Pf,Cu=new Pf;class Au extends zM{constructor(e=[],t=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=r}getPoint(e,t=new R){const i=t,r=this.points,s=r.length,a=(s-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:l===0&&o===s-1&&(o=s-2,l=1);let c,h;this.closed||o>0?c=r[(o-1)%s]:(Dm.subVectors(r[0],r[1]).add(r[0]),c=Dm);const u=r[o%s],d=r[(o+1)%s];if(this.closed||o+2<s?h=r[(o+2)%s]:(Im.subVectors(r[s-1],r[s-2]).add(r[s-1]),h=Im),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),p),M=Math.pow(u.distanceToSquared(d),p),x=Math.pow(d.distanceToSquared(h),p);M<1e-4&&(M=1),g<1e-4&&(g=M),x<1e-4&&(x=M),Tu.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,M,x),bu.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,M,x),Cu.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,M,x)}else this.curveType==="catmullrom"&&(Tu.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),bu.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Cu.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return i.set(Tu.calc(l),bu.calc(l),Cu.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new R().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}class ct extends Cn{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(i),l=Math.floor(r),c=o+1,h=l+1,u=e/o,d=t/l,p=[],g=[],M=[],x=[];for(let f=0;f<h;f++){const v=f*d-a;for(let E=0;E<c;E++){const S=E*u-s;g.push(S,-v,0),M.push(0,0,1),x.push(E/o),x.push(1-f/l)}}for(let f=0;f<l;f++)for(let v=0;v<o;v++){const E=v+c*f,S=v+c*(f+1),T=v+1+c*(f+1),b=v+1+c*f;p.push(E,S,b),p.push(S,T,b)}this.setIndex(p),this.setAttribute("position",new gn(g,3)),this.setAttribute("normal",new gn(M,3)),this.setAttribute("uv",new gn(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ct(e.width,e.height,e.widthSegments,e.heightSegments)}}class Ir extends Cn{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new R,d=new R,p=[],g=[],M=[],x=[];for(let f=0;f<=i;f++){const v=[],E=f/i,S=a+E*o,T=e*Math.cos(S),b=Math.sqrt(e*e-T*T);let C=0;f===0&&a===0?C=.5/t:f===i&&l===Math.PI&&(C=-.5/t);for(let _=0;_<=t;_++){const A=_/t,L=r+A*s;u.x=-b*Math.cos(L),u.y=T,u.z=b*Math.sin(L),g.push(u.x,u.y,u.z),d.copy(u).normalize(),M.push(d.x,d.y,d.z),x.push(A+C,1-E),v.push(c++)}h.push(v)}for(let f=0;f<i;f++)for(let v=0;v<t;v++){const E=h[f][v+1],S=h[f][v],T=h[f+1][v],b=h[f+1][v+1];(f!==0||a>0)&&p.push(E,S,b),(f!==i-1||l<Math.PI)&&p.push(S,T,b)}this.setIndex(p),this.setAttribute("position",new gn(g,3)),this.setAttribute("normal",new gn(M,3)),this.setAttribute("uv",new gn(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ir(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}function Ks(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];if(Um(r))r.isRenderTargetTexture?(Fe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone();else if(Array.isArray(r))if(Um(r[0])){const s=[];for(let a=0,o=r.length;a<o;a++)s[a]=r[a].clone();e[t][i]=s}else e[t][i]=r.slice();else e[t][i]=r}}return e}function fn(n){const e={};for(let t=0;t<n.length;t++){const i=Ks(n[t]);for(const r in i)e[r]=i[r]}return e}function Um(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function VM(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function tv(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:et.workingColorSpace}const HM={clone:Ks,merge:fn};var GM=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,WM=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ti extends ta{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=GM,this.fragmentShader=WM,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ks(e.uniforms),this.uniformsGroups=VM(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const r=e.uniforms[i];switch(this.uniforms[i]={},r.type){case"t":this.uniforms[i].value=t[r.value]||null;break;case"c":this.uniforms[i].value=new Ke().setHex(r.value);break;case"v2":this.uniforms[i].value=new ke().fromArray(r.value);break;case"v3":this.uniforms[i].value=new R().fromArray(r.value);break;case"v4":this.uniforms[i].value=new At().fromArray(r.value);break;case"m3":this.uniforms[i].value=new ze().fromArray(r.value);break;case"m4":this.uniforms[i].value=new wt().fromArray(r.value);break;default:this.uniforms[i].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class jM extends Ti{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class xe extends ta{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ke(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ph,this.normalScale=new ke(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sr,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class XM extends ta{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=zS,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class $M extends ta{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class nv extends qt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ke(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class YM extends nv{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(qt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ke(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Ru=new wt,Fm=new R,Om=new R;class qM{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ke(512,512),this.mapType=Ln,this.map=null,this.mapPass=null,this.matrix=new wt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Rf,this._frameExtents=new ke(1,1),this._viewportCount=1,this._viewports=[new At(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;Fm.setFromMatrixPosition(e.matrixWorld),t.position.copy(Fm),Om.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Om),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,i,r){Ru.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(Ru,e.coordinateSystem,e.reversedDepth);const s=this._frameExtents,a=r?r.z/s.x:1,o=r?r.w/s.y:1,l=r?r.x/s.x:0,c=r?r.y/s.y:0;e.coordinateSystem===so||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Ru)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const nl=new R,il=new ea,hi=new R;class iv extends qt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new wt,this.projectionMatrix=new wt,this.projectionMatrixInverse=new wt,this.coordinateSystem=_i,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(nl,il,hi),hi.x===1&&hi.y===1&&hi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(nl,il,hi.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(nl,il,hi),hi.x===1&&hi.y===1&&hi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(nl,il,hi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const nr=new R,km=new ke,Bm=new ke;class Hn extends iv{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ao*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Oa*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ao*2*Math.atan(Math.tan(Oa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){nr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(nr.x,nr.y).multiplyScalar(-e/nr.z),nr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(nr.x,nr.y).multiplyScalar(-e/nr.z)}getViewSize(e,t){return this.getViewBounds(e,km,Bm),t.subVectors(Bm,km)}setViewOffset(e,t,i,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Oa*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,t-=a.offsetY*i/c,r*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Lf extends iv{constructor(e=-1,t=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class KM extends qM{constructor(){super(new Lf(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ZM extends nv{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(qt.DEFAULT_UP),this.updateMatrix(),this.target=new qt,this.shadow=new KM}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}const gs=-90,xs=1;class QM extends qt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Hn(gs,xs,e,t);r.layers=this.layers,this.add(r);const s=new Hn(gs,xs,e,t);s.layers=this.layers,this.add(s);const a=new Hn(gs,xs,e,t);a.layers=this.layers,this.add(a);const o=new Hn(gs,xs,e,t);o.layers=this.layers,this.add(o);const l=new Hn(gs,xs,e,t);l.layers=this.layers,this.add(l);const c=new Hn(gs,xs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===_i)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===so)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const M=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let x=!1;e.isWebGLRenderer===!0?x=e.state.buffers.depth.getReversed():x=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),x&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(i,1,r),x&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,r),x&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,r),x&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,r),x&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.generateMipmaps=M,e.setRenderTarget(i,5,r),x&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,p),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class JM extends Hn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const zm=new wt;class rv{constructor(e,t,i=0,r=1/0){this.ray=new Zx(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new bf,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):nt("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return zm.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(zm),this}intersectObject(e,t=!0,i=[]){return gh(e,this,i,t),i.sort(Vm),i}intersectObjects(e,t=!0,i=[]){for(let r=0,s=e.length;r<s;r++)gh(e[r],this,i,t);return i.sort(Vm),i}}function Vm(n,e){return n.distance-e.distance}function gh(n,e,t,i){let r=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(r=!1),r===!0&&i===!0){const s=n.children;for(let a=0,o=s.length;a<o;a++)gh(s[a],e,t,!0)}}const kf=class kf{constructor(e,t,i,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,r){const s=this.elements;return s[0]=e,s[2]=t,s[1]=i,s[3]=r,this}};kf.prototype.isMatrix2=!0;let Hm=kf;function Gm(n,e,t,i){const r=e1(i);switch(t){case Vx:return n*e;case Gx:return n*e/r.components*r.byteLength;case _f:return n*e/r.components*r.byteLength;case qr:return n*e*2/r.components*r.byteLength;case yf:return n*e*2/r.components*r.byteLength;case Hx:return n*e*3/r.components*r.byteLength;case ri:return n*e*4/r.components*r.byteLength;case Sf:return n*e*4/r.components*r.byteLength;case _l:case yl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Sl:case Ml:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Bd:case Vd:return Math.max(n,16)*Math.max(e,8)/4;case kd:case zd:return Math.max(n,8)*Math.max(e,8)/2;case Hd:case Gd:case jd:case Xd:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Wd:case Yl:case $d:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Yd:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case qd:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Kd:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Zd:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Qd:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Jd:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case eh:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case th:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case nh:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case ih:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case rh:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case sh:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case ah:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case oh:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case lh:case ch:case uh:return Math.ceil(n/4)*Math.ceil(e/4)*16;case dh:case hh:return Math.ceil(n/4)*Math.ceil(e/4)*8;case ql:case fh:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function e1(n){switch(n){case Ln:case Ox:return{byteLength:1,components:1};case io:case kx:case Ei:return{byteLength:2,components:1};case xf:case vf:return{byteLength:2,components:4};case wi:case gf:case vi:return{byteLength:4,components:1};case Bx:case zx:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:mf}}));typeof window<"u"&&(window.__THREE__?Fe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=mf);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function sv(){let n=null,e=!1,t=null,i=null;function r(s,a){i=n.requestAnimationFrame(r),t(s,a)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function t1(n){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),o.onUploadCallback();let p;if(c instanceof Float32Array)p=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=n.SHORT;else if(c instanceof Uint32Array)p=n.UNSIGNED_INT;else if(c instanceof Int32Array)p=n.INT;else if(c instanceof Int8Array)p=n.BYTE;else if(c instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){const h=l.array,u=l.updateRanges;if(n.bindBuffer(c,o),u.length===0)n.bufferSubData(c,0,h);else{u.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<u.length;p++){const g=u[d],M=u[p];M.start<=g.start+g.count+1?g.count=Math.max(g.count,M.start+M.count-g.start):(++d,u[d]=M)}u.length=d+1;for(let p=0,g=u.length;p<g;p++){const M=u[p];n.bufferSubData(c,M.start*h.BYTES_PER_ELEMENT,h,M.start,M.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}var n1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,i1=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,r1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,s1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,a1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,o1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,l1=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,c1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,u1=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,d1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,h1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,f1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,p1=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,m1=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,g1=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,x1=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,v1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,_1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,y1=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,S1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,M1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,w1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,E1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,T1=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,b1=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,C1=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,A1=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,R1=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,P1=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,L1=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,N1="gl_FragColor = linearToOutputTexel( gl_FragColor );",I1=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,D1=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,U1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,F1=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,O1=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,k1=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,B1=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,z1=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,V1=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,H1=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,G1=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,W1=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,j1=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,X1=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,$1=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Y1=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,q1=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,K1=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Z1=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Q1=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,J1=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,ew=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,tw=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,nw=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,iw=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,rw=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,sw=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,aw=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ow=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,lw=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,cw=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,uw=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,dw=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,hw=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fw=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,pw=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,mw=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,gw=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,xw=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,vw=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,_w=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,yw=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Sw=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Mw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ww=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ew=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Tw=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,bw=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Cw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Aw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Rw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Pw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Lw=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Nw=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Iw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Dw=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Uw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Fw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ow=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,kw=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Bw=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,zw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Vw=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Hw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Gw=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Ww=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,jw=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Xw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,$w=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Yw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,qw=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Kw=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Zw=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Qw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Jw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,eE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,tE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const nE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,iE=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,rE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,sE=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,aE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,oE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lE=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,cE=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,uE=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,dE=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,hE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,fE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pE=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,mE=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,gE=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,xE=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vE=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_E=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yE=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,SE=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ME=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,wE=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,EE=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,TE=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bE=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,CE=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,AE=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,RE=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,PE=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,LE=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,NE=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,IE=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,DE=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,UE=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ge={alphahash_fragment:n1,alphahash_pars_fragment:i1,alphamap_fragment:r1,alphamap_pars_fragment:s1,alphatest_fragment:a1,alphatest_pars_fragment:o1,aomap_fragment:l1,aomap_pars_fragment:c1,batching_pars_vertex:u1,batching_vertex:d1,begin_vertex:h1,beginnormal_vertex:f1,bsdfs:p1,iridescence_fragment:m1,bumpmap_pars_fragment:g1,clipping_planes_fragment:x1,clipping_planes_pars_fragment:v1,clipping_planes_pars_vertex:_1,clipping_planes_vertex:y1,color_fragment:S1,color_pars_fragment:M1,color_pars_vertex:w1,color_vertex:E1,common:T1,cube_uv_reflection_fragment:b1,defaultnormal_vertex:C1,displacementmap_pars_vertex:A1,displacementmap_vertex:R1,emissivemap_fragment:P1,emissivemap_pars_fragment:L1,colorspace_fragment:N1,colorspace_pars_fragment:I1,envmap_fragment:D1,envmap_common_pars_fragment:U1,envmap_pars_fragment:F1,envmap_pars_vertex:O1,envmap_physical_pars_fragment:Y1,envmap_vertex:k1,fog_vertex:B1,fog_pars_vertex:z1,fog_fragment:V1,fog_pars_fragment:H1,gradientmap_pars_fragment:G1,lightmap_pars_fragment:W1,lights_lambert_fragment:j1,lights_lambert_pars_fragment:X1,lights_pars_begin:$1,lights_toon_fragment:q1,lights_toon_pars_fragment:K1,lights_phong_fragment:Z1,lights_phong_pars_fragment:Q1,lights_physical_fragment:J1,lights_physical_pars_fragment:ew,lights_fragment_begin:tw,lights_fragment_maps:nw,lights_fragment_end:iw,lightprobes_pars_fragment:rw,logdepthbuf_fragment:sw,logdepthbuf_pars_fragment:aw,logdepthbuf_pars_vertex:ow,logdepthbuf_vertex:lw,map_fragment:cw,map_pars_fragment:uw,map_particle_fragment:dw,map_particle_pars_fragment:hw,metalnessmap_fragment:fw,metalnessmap_pars_fragment:pw,morphinstance_vertex:mw,morphcolor_vertex:gw,morphnormal_vertex:xw,morphtarget_pars_vertex:vw,morphtarget_vertex:_w,normal_fragment_begin:yw,normal_fragment_maps:Sw,normal_pars_fragment:Mw,normal_pars_vertex:ww,normal_vertex:Ew,normalmap_pars_fragment:Tw,clearcoat_normal_fragment_begin:bw,clearcoat_normal_fragment_maps:Cw,clearcoat_pars_fragment:Aw,iridescence_pars_fragment:Rw,opaque_fragment:Pw,packing:Lw,premultiplied_alpha_fragment:Nw,project_vertex:Iw,dithering_fragment:Dw,dithering_pars_fragment:Uw,roughnessmap_fragment:Fw,roughnessmap_pars_fragment:Ow,shadowmap_pars_fragment:kw,shadowmap_pars_vertex:Bw,shadowmap_vertex:zw,shadowmask_pars_fragment:Vw,skinbase_vertex:Hw,skinning_pars_vertex:Gw,skinning_vertex:Ww,skinnormal_vertex:jw,specularmap_fragment:Xw,specularmap_pars_fragment:$w,tonemapping_fragment:Yw,tonemapping_pars_fragment:qw,transmission_fragment:Kw,transmission_pars_fragment:Zw,uv_pars_fragment:Qw,uv_pars_vertex:Jw,uv_vertex:eE,worldpos_vertex:tE,background_vert:nE,background_frag:iE,backgroundCube_vert:rE,backgroundCube_frag:sE,cube_vert:aE,cube_frag:oE,depth_vert:lE,depth_frag:cE,distance_vert:uE,distance_frag:dE,equirect_vert:hE,equirect_frag:fE,linedashed_vert:pE,linedashed_frag:mE,meshbasic_vert:gE,meshbasic_frag:xE,meshlambert_vert:vE,meshlambert_frag:_E,meshmatcap_vert:yE,meshmatcap_frag:SE,meshnormal_vert:ME,meshnormal_frag:wE,meshphong_vert:EE,meshphong_frag:TE,meshphysical_vert:bE,meshphysical_frag:CE,meshtoon_vert:AE,meshtoon_frag:RE,points_vert:PE,points_frag:LE,shadow_vert:NE,shadow_frag:IE,sprite_vert:DE,sprite_frag:UE},pe={common:{diffuse:{value:new Ke(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ze}},envmap:{envMap:{value:null},envMapRotation:{value:new ze},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ze},normalScale:{value:new ke(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ke(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new R},probesMax:{value:new R},probesResolution:{value:new R}},points:{diffuse:{value:new Ke(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0},uvTransform:{value:new ze}},sprite:{diffuse:{value:new Ke(16777215)},opacity:{value:1},center:{value:new ke(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}}},gi={basic:{uniforms:fn([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.fog]),vertexShader:Ge.meshbasic_vert,fragmentShader:Ge.meshbasic_frag},lambert:{uniforms:fn([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new Ke(0)},envMapIntensity:{value:1}}]),vertexShader:Ge.meshlambert_vert,fragmentShader:Ge.meshlambert_frag},phong:{uniforms:fn([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new Ke(0)},specular:{value:new Ke(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphong_vert,fragmentShader:Ge.meshphong_frag},standard:{uniforms:fn([pe.common,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.roughnessmap,pe.metalnessmap,pe.fog,pe.lights,{emissive:{value:new Ke(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag},toon:{uniforms:fn([pe.common,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.gradientmap,pe.fog,pe.lights,{emissive:{value:new Ke(0)}}]),vertexShader:Ge.meshtoon_vert,fragmentShader:Ge.meshtoon_frag},matcap:{uniforms:fn([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,{matcap:{value:null}}]),vertexShader:Ge.meshmatcap_vert,fragmentShader:Ge.meshmatcap_frag},points:{uniforms:fn([pe.points,pe.fog]),vertexShader:Ge.points_vert,fragmentShader:Ge.points_frag},dashed:{uniforms:fn([pe.common,pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ge.linedashed_vert,fragmentShader:Ge.linedashed_frag},depth:{uniforms:fn([pe.common,pe.displacementmap]),vertexShader:Ge.depth_vert,fragmentShader:Ge.depth_frag},normal:{uniforms:fn([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,{opacity:{value:1}}]),vertexShader:Ge.meshnormal_vert,fragmentShader:Ge.meshnormal_frag},sprite:{uniforms:fn([pe.sprite,pe.fog]),vertexShader:Ge.sprite_vert,fragmentShader:Ge.sprite_frag},background:{uniforms:{uvTransform:{value:new ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ge.background_vert,fragmentShader:Ge.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ze}},vertexShader:Ge.backgroundCube_vert,fragmentShader:Ge.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ge.cube_vert,fragmentShader:Ge.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ge.equirect_vert,fragmentShader:Ge.equirect_frag},distance:{uniforms:fn([pe.common,pe.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ge.distance_vert,fragmentShader:Ge.distance_frag},shadow:{uniforms:fn([pe.lights,pe.fog,{color:{value:new Ke(0)},opacity:{value:1}}]),vertexShader:Ge.shadow_vert,fragmentShader:Ge.shadow_frag}};gi.physical={uniforms:fn([gi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ze},clearcoatNormalScale:{value:new ke(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ze},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ze},sheen:{value:0},sheenColor:{value:new Ke(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ze},transmissionSamplerSize:{value:new ke},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ze},attenuationDistance:{value:0},attenuationColor:{value:new Ke(0)},specularColor:{value:new Ke(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ze},anisotropyVector:{value:new ke},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ze}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag};const rl={r:0,b:0,g:0},FE=new wt,av=new ze;av.set(-1,0,0,0,1,0,0,0,1);function OE(n,e,t,i,r,s){const a=new Ke(0);let o=r===!0?0:1,l,c,h=null,u=0,d=null;function p(v){let E=v.isScene===!0?v.background:null;if(E&&E.isTexture){const S=v.backgroundBlurriness>0;E=e.get(E,S)}return E}function g(v){let E=!1;const S=p(v);S===null?x(a,o):S&&S.isColor&&(x(S,1),E=!0);const T=n.xr.getEnvironmentBlendMode();T==="additive"?t.buffers.color.setClear(0,0,0,1,s):T==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(n.autoClear||E)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function M(v,E){const S=p(E);S&&(S.isCubeTexture||S.mapping===yc)?(c===void 0&&(c=new ne(new Pe(1,1,1),new Ti({name:"BackgroundCubeMaterial",uniforms:Ks(gi.backgroundCube.uniforms),vertexShader:gi.backgroundCube.vertexShader,fragmentShader:gi.backgroundCube.fragmentShader,side:bn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(T,b,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=S,c.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(FE.makeRotationFromEuler(E.backgroundRotation)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(av),c.material.toneMapped=et.getTransfer(S.colorSpace)!==dt,(h!==S||u!==S.version||d!==n.toneMapping)&&(c.material.needsUpdate=!0,h=S,u=S.version,d=n.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null)):S&&S.isTexture&&(l===void 0&&(l=new ne(new ct(2,2),new Ti({name:"BackgroundMaterial",uniforms:Ks(gi.background.uniforms),vertexShader:gi.background.vertexShader,fragmentShader:gi.background.fragmentShader,side:$r,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=S,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.toneMapped=et.getTransfer(S.colorSpace)!==dt,S.matrixAutoUpdate===!0&&S.updateMatrix(),l.material.uniforms.uvTransform.value.copy(S.matrix),(h!==S||u!==S.version||d!==n.toneMapping)&&(l.material.needsUpdate=!0,h=S,u=S.version,d=n.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function x(v,E){v.getRGB(rl,tv(n)),t.buffers.color.setClear(rl.r,rl.g,rl.b,E,s)}function f(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,E=1){a.set(v),o=E,x(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(v){o=v,x(a,o)},render:g,addToRenderList:M,dispose:f}}function kE(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=d(null);let s=r,a=!1;function o(I,N,k,D,V){let q=!1;const $=u(I,D,k,N);s!==$&&(s=$,c(s.object)),q=p(I,D,k,V),q&&g(I,D,k,V),V!==null&&e.update(V,n.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,S(I,N,k,D),V!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function l(){return n.createVertexArray()}function c(I){return n.bindVertexArray(I)}function h(I){return n.deleteVertexArray(I)}function u(I,N,k,D){const V=D.wireframe===!0;let q=i[N.id];q===void 0&&(q={},i[N.id]=q);const $=I.isInstancedMesh===!0?I.id:0;let H=q[$];H===void 0&&(H={},q[$]=H);let B=H[k.id];B===void 0&&(B={},H[k.id]=B);let j=B[V];return j===void 0&&(j=d(l()),B[V]=j),j}function d(I){const N=[],k=[],D=[];for(let V=0;V<t;V++)N[V]=0,k[V]=0,D[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:k,attributeDivisors:D,object:I,attributes:{},index:null}}function p(I,N,k,D){const V=s.attributes,q=N.attributes;let $=0;const H=k.getAttributes();for(const B in H)if(H[B].location>=0){const J=V[B];let _e=q[B];if(_e===void 0&&(B==="instanceMatrix"&&I.instanceMatrix&&(_e=I.instanceMatrix),B==="instanceColor"&&I.instanceColor&&(_e=I.instanceColor)),J===void 0||J.attribute!==_e||_e&&J.data!==_e.data)return!0;$++}return s.attributesNum!==$||s.index!==D}function g(I,N,k,D){const V={},q=N.attributes;let $=0;const H=k.getAttributes();for(const B in H)if(H[B].location>=0){let J=q[B];J===void 0&&(B==="instanceMatrix"&&I.instanceMatrix&&(J=I.instanceMatrix),B==="instanceColor"&&I.instanceColor&&(J=I.instanceColor));const _e={};_e.attribute=J,J&&J.data&&(_e.data=J.data),V[B]=_e,$++}s.attributes=V,s.attributesNum=$,s.index=D}function M(){const I=s.newAttributes;for(let N=0,k=I.length;N<k;N++)I[N]=0}function x(I){f(I,0)}function f(I,N){const k=s.newAttributes,D=s.enabledAttributes,V=s.attributeDivisors;k[I]=1,D[I]===0&&(n.enableVertexAttribArray(I),D[I]=1),V[I]!==N&&(n.vertexAttribDivisor(I,N),V[I]=N)}function v(){const I=s.newAttributes,N=s.enabledAttributes;for(let k=0,D=N.length;k<D;k++)N[k]!==I[k]&&(n.disableVertexAttribArray(k),N[k]=0)}function E(I,N,k,D,V,q,$){$===!0?n.vertexAttribIPointer(I,N,k,V,q):n.vertexAttribPointer(I,N,k,D,V,q)}function S(I,N,k,D){M();const V=D.attributes,q=k.getAttributes(),$=N.defaultAttributeValues;for(const H in q){const B=q[H];if(B.location>=0){let j=V[H];if(j===void 0&&(H==="instanceMatrix"&&I.instanceMatrix&&(j=I.instanceMatrix),H==="instanceColor"&&I.instanceColor&&(j=I.instanceColor)),j!==void 0){const J=j.normalized,_e=j.itemSize,Ae=e.get(j);if(Ae===void 0)continue;const tt=Ae.buffer,je=Ae.type,We=Ae.bytesPerElement,K=je===n.INT||je===n.UNSIGNED_INT||j.gpuType===gf;if(j.isInterleavedBufferAttribute){const re=j.data,Te=re.stride,Be=j.offset;if(re.isInstancedInterleavedBuffer){for(let Me=0;Me<B.locationSize;Me++)f(B.location+Me,re.meshPerAttribute);I.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let Me=0;Me<B.locationSize;Me++)x(B.location+Me);n.bindBuffer(n.ARRAY_BUFFER,tt);for(let Me=0;Me<B.locationSize;Me++)E(B.location+Me,_e/B.locationSize,je,J,Te*We,(Be+_e/B.locationSize*Me)*We,K)}else{if(j.isInstancedBufferAttribute){for(let re=0;re<B.locationSize;re++)f(B.location+re,j.meshPerAttribute);I.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let re=0;re<B.locationSize;re++)x(B.location+re);n.bindBuffer(n.ARRAY_BUFFER,tt);for(let re=0;re<B.locationSize;re++)E(B.location+re,_e/B.locationSize,je,J,_e*We,_e/B.locationSize*re*We,K)}}else if($!==void 0){const J=$[H];if(J!==void 0)switch(J.length){case 2:n.vertexAttrib2fv(B.location,J);break;case 3:n.vertexAttrib3fv(B.location,J);break;case 4:n.vertexAttrib4fv(B.location,J);break;default:n.vertexAttrib1fv(B.location,J)}}}}v()}function T(){A();for(const I in i){const N=i[I];for(const k in N){const D=N[k];for(const V in D){const q=D[V];for(const $ in q)h(q[$].object),delete q[$];delete D[V]}}delete i[I]}}function b(I){if(i[I.id]===void 0)return;const N=i[I.id];for(const k in N){const D=N[k];for(const V in D){const q=D[V];for(const $ in q)h(q[$].object),delete q[$];delete D[V]}}delete i[I.id]}function C(I){for(const N in i){const k=i[N];for(const D in k){const V=k[D];if(V[I.id]===void 0)continue;const q=V[I.id];for(const $ in q)h(q[$].object),delete q[$];delete V[I.id]}}}function _(I){for(const N in i){const k=i[N],D=I.isInstancedMesh===!0?I.id:0,V=k[D];if(V!==void 0){for(const q in V){const $=V[q];for(const H in $)h($[H].object),delete $[H];delete V[q]}delete k[D],Object.keys(k).length===0&&delete i[N]}}}function A(){L(),a=!0,s!==r&&(s=r,c(s.object))}function L(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:A,resetDefaultState:L,dispose:T,releaseStatesOfGeometry:b,releaseStatesOfObject:_,releaseStatesOfProgram:C,initAttributes:M,enableAttribute:x,disableUnusedAttributes:v}}function BE(n,e,t){let i;function r(l){i=l}function s(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function a(l,c,h){h!==0&&(n.drawArraysInstanced(i,l,c,h),t.update(c,i,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let d=0;for(let p=0;p<h;p++)d+=c[p];t.update(d,i,1)}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o}function zE(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(C){return!(C!==ri&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const _=C===Ei&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Ln&&C!==vi&&!_&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function l(C){if(C==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Fe("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&Fe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=n.getParameter(n.MAX_TEXTURE_SIZE),x=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),f=n.getParameter(n.MAX_VERTEX_ATTRIBS),v=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),E=n.getParameter(n.MAX_VARYING_VECTORS),S=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),T=n.getParameter(n.MAX_SAMPLES),b=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:M,maxCubemapSize:x,maxAttributes:f,maxVertexUniforms:v,maxVaryings:E,maxFragmentUniforms:S,maxSamples:T,samples:b}}function VE(n){const e=this;let t=null,i=0,r=!1,s=!1;const a=new mi,o=new ze,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const p=u.length!==0||d||i!==0||r;return r=d,i=u.length,p},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,p){const g=u.clippingPlanes,M=u.clipIntersection,x=u.clipShadows,f=n.get(u);if(!r||g===null||g.length===0||s&&!x)s?h(null):c();else{const v=s?0:i,E=v*4;let S=f.clippingState||null;l.value=S,S=h(g,d,E,p);for(let T=0;T!==E;++T)S[T]=t[T];f.clippingState=S,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(u,d,p,g){const M=u!==null?u.length:0;let x=null;if(M!==0){if(x=l.value,g!==!0||x===null){const f=p+M*4,v=d.matrixWorldInverse;o.getNormalMatrix(v),(x===null||x.length<f)&&(x=new Float32Array(f));for(let E=0,S=p;E!==M;++E,S+=4)a.copy(u[E]).applyMatrix4(v,o),a.normal.toArray(x,S),x[S+3]=a.constant}l.value=x,l.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,x}}const Is=4,HE=6,GE=20,WE=256,va=new Lf,Wm=new Ke;let Pu=null,Lu=0,Nu=0,Iu=!1;const jE=new R,Pr=new R;class jm{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,r=100,s={}){const{size:a=256,position:o=jE}=s;Pu=this._renderer.getRenderTarget(),Lu=this._renderer.getActiveCubeFace(),Nu=this._renderer.getActiveMipmapLevel(),Iu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ym(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=$m(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Pu,Lu,Nu),this._renderer.xr.enabled=Iu,e.scissorTest=!1,vs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Yr||e.mapping===qs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Pu=this._renderer.getRenderTarget(),Lu=this._renderer.getActiveCubeFace(),Nu=this._renderer.getActiveMipmapLevel(),Iu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Qt,minFilter:Qt,generateMipmaps:!1,type:Ei,format:ri,colorSpace:Kl,depthBuffer:!1},r=Xm(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Xm(e,t,i);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=XE(s)),this._blurMaterial=YE(s,e,t),this._ggxMaterial=$E(s,e,t)}return r}_compileMaterial(e){const t=new ne(new Cn,e);this._renderer.compile(t,va)}_sceneToCubeUV(e,t,i,r,s){const l=new Hn(90,1,t,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,p=u.toneMapping;u.getClearColor(Wm),u.toneMapping=Mi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(r),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ne(new Pe,new Nt({name:"PMREM.Background",side:bn,depthWrite:!1,depthTest:!1})));const M=this._backgroundBox,x=M.material;let f=!1;const v=e.background;v?v.isColor&&(x.color.copy(v),e.background=null,f=!0):(x.color.copy(Wm),f=!0);for(let E=0;E<6;E++){const S=E%3;S===0?(l.up.set(0,c[E],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+h[E],s.y,s.z)):S===1?(l.up.set(0,0,c[E]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+h[E],s.z)):(l.up.set(0,c[E],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+h[E]));const T=this._cubeSize;vs(r,S*T,E>2?T:0,T,T),u.setRenderTarget(r),f&&u.render(M,l),u.render(e,l)}u.toneMapping=p,u.autoClear=d,e.background=v}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===Yr||e.mapping===qs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ym()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=$m());const s=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;const o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;vs(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,va)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=i}_applyGGXFilter(e,t,i){const r=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const l=a.uniforms,c=i/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),d=c*1.25,p=u*d,{_lodMax:g}=this,M=this._sizeLods[i],x=3*M*(i>g-Is?i-g+Is:0),f=4*(this._cubeSize-M);l.envMap.value=e.texture,l.roughness.value=p,l.mipInt.value=g-t,vs(s,x,f,3*M,2*M),r.setRenderTarget(s),r.render(o,va),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=g-i,vs(e,x,f,3*M,2*M),r.setRenderTarget(e),r.render(o,va)}_blur(e,t,i,r){const s=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,s,t,i,a),this._blurPass(s,e,i,i,a)}_blurPass(e,t,i,r,s){const a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[r];l.material=o;const c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=s,c.mipInt.value=this._lodMax-i;const h=this._sizeLods[r],u=3*h*(r>this._lodMax-Is?r-this._lodMax+Is:0),d=4*(this._cubeSize-h);vs(t,u,d,3*h,2*h),a.setRenderTarget(t),a.render(l,va)}}function XE(n){const e=[],t=[];let i=n;const r=n-Is+1+HE;for(let s=0;s<r;s++){const a=Math.pow(2,i);e.push(a);const o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],u=6,d=6,p=3,g=new Float32Array(p*d*u),M=new Float32Array(p*d*u);for(let f=0;f<u;f++){const v=f%3*2/3-1,E=f>2?0:-1,S=[v,E,0,v+2/3,E,0,v+2/3,E+1,0,v,E,0,v+2/3,E+1,0,v,E+1,0];g.set(S,p*d*f);for(let T=0;T<d;T++){const b=h[T*2]*2-1,C=h[T*2+1]*2-1;f===0?Pr.set(1,C,b):f===1?Pr.set(-b,1,-C):f===2?Pr.set(-b,C,1):f===3?Pr.set(-1,C,-b):f===4?Pr.set(-b,-1,C):Pr.set(b,C,-1),Pr.toArray(M,(f*d+T)*p)}}const x=new Cn;x.setAttribute("position",new Xn(g,p)),x.setAttribute("outputDirection",new Xn(M,p)),t.push(new ne(x,null)),i>Is&&i--}return{lodMeshes:t,sizeLods:e}}function Xm(n,e,t){const i=new oi(n,e,t);return i.texture.mapping=yc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function vs(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function $E(n,e,t){return new Ti({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:WE,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Sc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Bi,depthTest:!1,depthWrite:!1})}function YE(n,e,t){return new Ti({name:"SphericalGaussianBlur",defines:{SAMPLES:GE,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Sc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Bi,depthTest:!1,depthWrite:!1})}function $m(){return new Ti({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Sc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Bi,depthTest:!1,depthWrite:!1})}function Ym(){return new Ti({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Sc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Bi,depthTest:!1,depthWrite:!1})}function Sc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class ov extends oi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Qx(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Pe(5,5,5),s=new Ti({name:"CubemapFromEquirect",uniforms:Ks(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:bn,blending:Bi});s.uniforms.tEquirect.value=t;const a=new ne(r,s),o=t.minFilter;return t.minFilter===Or&&(t.minFilter=Qt),new QM(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,r);e.setRenderTarget(s)}}function qE(n){let e=new WeakMap,t=new WeakMap,i=null;function r(d,p=!1){return d==null?null:p?a(d):s(d)}function s(d){if(d&&d.isTexture){const p=d.mapping;if(p===eu||p===tu)if(e.has(d)){const g=e.get(d).texture;return o(g,d.mapping)}else{const g=d.image;if(g&&g.height>0){const M=new ov(g.height);return M.fromEquirectangularTexture(n,d),e.set(d,M),d.addEventListener("dispose",c),o(M.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){const p=d.mapping,g=p===eu||p===tu,M=p===Yr||p===qs;if(g||M){let x=t.get(d);const f=x!==void 0?x.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==f)return i===null&&(i=new jm(n)),x=g?i.fromEquirectangular(d,x):i.fromCubemap(d,x),x.texture.pmremVersion=d.pmremVersion,t.set(d,x),x.texture;if(x!==void 0)return x.texture;{const v=d.image;return g&&v&&v.height>0||M&&v&&l(v)?(i===null&&(i=new jm(n)),x=g?i.fromEquirectangular(d):i.fromCubemap(d),x.texture.pmremVersion=d.pmremVersion,t.set(d,x),d.addEventListener("dispose",h),x.texture):null}}}return d}function o(d,p){return p===eu?d.mapping=Yr:p===tu&&(d.mapping=qs),d}function l(d){let p=0;const g=6;for(let M=0;M<g;M++)d[M]!==void 0&&p++;return p===g}function c(d){const p=d.target;p.removeEventListener("dispose",c);const g=e.get(p);g!==void 0&&(e.delete(p),g.dispose())}function h(d){const p=d.target;p.removeEventListener("dispose",h);const g=t.get(p);g!==void 0&&(t.delete(p),g.dispose())}function u(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:u}}function KE(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const r=n.getExtension(i);return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&zs("WebGLRenderer: "+i+" extension not supported."),r}}}function ZE(n,e,t,i){const r={},s=new WeakMap;function a(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete r[d.id];const p=s.get(d);p&&(e.remove(p),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return r[d.id]===!0||(d.addEventListener("dispose",a),r[d.id]=!0,t.memory.geometries++),d}function l(u){const d=u.attributes;for(const p in d)e.update(d[p],n.ARRAY_BUFFER)}function c(u){const d=[],p=u.index,g=u.attributes.position;let M=0;if(g===void 0)return;if(p!==null){const v=p.array;M=p.version;for(let E=0,S=v.length;E<S;E+=3){const T=v[E+0],b=v[E+1],C=v[E+2];d.push(T,b,b,C,C,T)}}else{const v=g.array;M=g.version;for(let E=0,S=v.length/3-1;E<S;E+=3){const T=E+0,b=E+1,C=E+2;d.push(T,b,b,C,C,T)}}const x=new(g.count>=65535?qx:Yx)(d,1);x.version=M;const f=s.get(u);f&&e.remove(f),s.set(u,x)}function h(u){const d=s.get(u);if(d){const p=u.index;p!==null&&d.version<p.version&&c(u)}else c(u);return s.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function QE(n,e,t){let i;function r(u){i=u}let s,a;function o(u){s=u.type,a=u.bytesPerElement}function l(u,d){n.drawElements(i,d,s,u*a),t.update(d,i,1)}function c(u,d,p){p!==0&&(n.drawElementsInstanced(i,d,s,u*a,p),t.update(d,i,p))}function h(u,d,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,s,u,0,p);let M=0;for(let x=0;x<p;x++)M+=d[x];t.update(M,i,1)}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function JE(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(s/3);break;case n.LINES:t.lines+=o*(s/2);break;case n.LINE_STRIP:t.lines+=o*(s-1);break;case n.LINE_LOOP:t.lines+=o*s;break;case n.POINTS:t.points+=o*s;break;default:nt("WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function eT(n,e,t){const i=new WeakMap,r=new At;function s(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=i.get(o);if(d===void 0||d.count!==u){let L=function(){_.dispose(),i.delete(o),o.removeEventListener("dispose",L)};var p=L;d!==void 0&&d.texture.dispose();const g=o.morphAttributes.position!==void 0,M=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],v=o.morphAttributes.normal||[],E=o.morphAttributes.color||[];let S=0;g===!0&&(S=1),M===!0&&(S=2),x===!0&&(S=3);let T=o.attributes.position.count*S,b=1;T>e.maxTextureSize&&(b=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);const C=new Float32Array(T*b*4*u),_=new Xx(C,T,b,u);_.type=vi,_.needsUpdate=!0;const A=S*4;for(let I=0;I<u;I++){const N=f[I],k=v[I],D=E[I],V=T*b*4*I;for(let q=0;q<N.count;q++){const $=q*A;g===!0&&(r.fromBufferAttribute(N,q),C[V+$+0]=r.x,C[V+$+1]=r.y,C[V+$+2]=r.z,C[V+$+3]=0),M===!0&&(r.fromBufferAttribute(k,q),C[V+$+4]=r.x,C[V+$+5]=r.y,C[V+$+6]=r.z,C[V+$+7]=0),x===!0&&(r.fromBufferAttribute(D,q),C[V+$+8]=r.x,C[V+$+9]=r.y,C[V+$+10]=r.z,C[V+$+11]=D.itemSize===4?r.w:1)}}d={count:u,texture:_,size:new ke(T,b)},i.set(o,d),o.addEventListener("dispose",L)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let g=0;for(let x=0;x<c.length;x++)g+=c[x];const M=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(n,"morphTargetBaseInfluence",M),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function tT(n,e,t,i,r){let s=new WeakMap;function a(c){const h=r.render.frame,u=c.geometry,d=e.get(c,u);if(s.get(d)!==h&&(e.update(d),s.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const p=c.skeleton;s.get(p)!==h&&(p.update(),s.set(p,h))}return d}function o(){s=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const nT={[Rx]:"LINEAR_TONE_MAPPING",[Px]:"REINHARD_TONE_MAPPING",[Lx]:"CINEON_TONE_MAPPING",[Nx]:"ACES_FILMIC_TONE_MAPPING",[Dx]:"AGX_TONE_MAPPING",[Ux]:"NEUTRAL_TONE_MAPPING",[Ix]:"CUSTOM_TONE_MAPPING"};function iT(n,e,t,i,r,s){const a=new oi(e,t,{type:n,depthBuffer:r,stencilBuffer:s,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null;const c=new Cn;c.setAttribute("position",new gn([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new gn([0,2,0,0,2,0],2));const h=new jM({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new ne(c,h),d=new Lf(-1,1,1,-1,0,1);let p=null,g=null,M=!1,x,f=null,v=[],E=!1;this.setSize=function(S,T){a.setSize(S,T),o!==null&&o.setSize(S,T),l!==null&&l.setSize(S,T);for(let b=0;b<v.length;b++){const C=v[b];C.setSize&&C.setSize(S,T)}},this.setEffects=function(S){v=S,E=v.length>0&&v[0].isRenderPass===!0;const T=a.width,b=a.height;v.length>0&&o===null&&(o=new oi(T,b,{type:Ei,depthBuffer:!1,stencilBuffer:!1}),l=new oi(T,b,{type:Ei,depthBuffer:!1,stencilBuffer:!1}));for(let C=0;C<v.length;C++){const _=v[C];_.setSize&&_.setSize(T,b)}},this.begin=function(S,T){if(M||S.toneMapping===Mi&&v.length===0)return!1;if(f=T,T!==null){const b=T.width,C=T.height;(a.width!==b||a.height!==C)&&this.setSize(b,C)}return E===!1&&S.setRenderTarget(a),x=S.toneMapping,S.toneMapping=Mi,!0},this.hasRenderPass=function(){return E},this.end=function(S,T){S.toneMapping=x,M=!0;let b=a,C=o;for(let _=0;_<v.length;_++){const A=v[_];A.enabled!==!1&&(A.render(S,C,b,T),A.needsSwap!==!1&&(b=C,C=C===o?l:o))}if(p!==S.outputColorSpace||g!==S.toneMapping){p=S.outputColorSpace,g=S.toneMapping,h.defines={},et.getTransfer(p)===dt&&(h.defines.SRGB_TRANSFER="");const _=nT[g];_&&(h.defines[_]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=b.texture,S.setRenderTarget(f),S.render(u,d),f=null,M=!1},this.isCompositing=function(){return M},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}const lv=new cn,xh=new oo(1,1),cv=new Xx,uv=new yM,dv=new Qx,qm=[],Km=[],Zm=new Float32Array(16),Qm=new Float32Array(9),Jm=new Float32Array(4);function na(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=qm[r];if(s===void 0&&(s=new Float32Array(r),qm[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(s,o)}return s}function Ht(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Gt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Mc(n,e){let t=Km[e];t===void 0&&(t=new Int32Array(e),Km[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function rT(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function sT(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ht(t,e))return;n.uniform2fv(this.addr,e),Gt(t,e)}}function aT(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ht(t,e))return;n.uniform3fv(this.addr,e),Gt(t,e)}}function oT(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ht(t,e))return;n.uniform4fv(this.addr,e),Gt(t,e)}}function lT(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ht(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Gt(t,e)}else{if(Ht(t,i))return;Jm.set(i),n.uniformMatrix2fv(this.addr,!1,Jm),Gt(t,i)}}function cT(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ht(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Gt(t,e)}else{if(Ht(t,i))return;Qm.set(i),n.uniformMatrix3fv(this.addr,!1,Qm),Gt(t,i)}}function uT(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ht(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Gt(t,e)}else{if(Ht(t,i))return;Zm.set(i),n.uniformMatrix4fv(this.addr,!1,Zm),Gt(t,i)}}function dT(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function hT(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ht(t,e))return;n.uniform2iv(this.addr,e),Gt(t,e)}}function fT(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ht(t,e))return;n.uniform3iv(this.addr,e),Gt(t,e)}}function pT(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ht(t,e))return;n.uniform4iv(this.addr,e),Gt(t,e)}}function mT(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function gT(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ht(t,e))return;n.uniform2uiv(this.addr,e),Gt(t,e)}}function xT(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ht(t,e))return;n.uniform3uiv(this.addr,e),Gt(t,e)}}function vT(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ht(t,e))return;n.uniform4uiv(this.addr,e),Gt(t,e)}}function _T(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(xh.compareFunction=t.isReversedDepthBuffer()?wf:Mf,s=xh):s=lv,t.setTexture2D(e||s,r)}function yT(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||uv,r)}function ST(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||dv,r)}function MT(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||cv,r)}function wT(n){switch(n){case 5126:return rT;case 35664:return sT;case 35665:return aT;case 35666:return oT;case 35674:return lT;case 35675:return cT;case 35676:return uT;case 5124:case 35670:return dT;case 35667:case 35671:return hT;case 35668:case 35672:return fT;case 35669:case 35673:return pT;case 5125:return mT;case 36294:return gT;case 36295:return xT;case 36296:return vT;case 35678:case 36198:case 36298:case 36306:case 35682:return _T;case 35679:case 36299:case 36307:return yT;case 35680:case 36300:case 36308:case 36293:return ST;case 36289:case 36303:case 36311:case 36292:return MT}}function ET(n,e){n.uniform1fv(this.addr,e)}function TT(n,e){const t=na(e,this.size,2);n.uniform2fv(this.addr,t)}function bT(n,e){const t=na(e,this.size,3);n.uniform3fv(this.addr,t)}function CT(n,e){const t=na(e,this.size,4);n.uniform4fv(this.addr,t)}function AT(n,e){const t=na(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function RT(n,e){const t=na(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function PT(n,e){const t=na(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function LT(n,e){n.uniform1iv(this.addr,e)}function NT(n,e){n.uniform2iv(this.addr,e)}function IT(n,e){n.uniform3iv(this.addr,e)}function DT(n,e){n.uniform4iv(this.addr,e)}function UT(n,e){n.uniform1uiv(this.addr,e)}function FT(n,e){n.uniform2uiv(this.addr,e)}function OT(n,e){n.uniform3uiv(this.addr,e)}function kT(n,e){n.uniform4uiv(this.addr,e)}function BT(n,e,t){const i=this.cache,r=e.length,s=Mc(t,r);Ht(i,s)||(n.uniform1iv(this.addr,s),Gt(i,s));let a;this.type===n.SAMPLER_2D_SHADOW?a=xh:a=lv;for(let o=0;o!==r;++o)t.setTexture2D(e[o]||a,s[o])}function zT(n,e,t){const i=this.cache,r=e.length,s=Mc(t,r);Ht(i,s)||(n.uniform1iv(this.addr,s),Gt(i,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||uv,s[a])}function VT(n,e,t){const i=this.cache,r=e.length,s=Mc(t,r);Ht(i,s)||(n.uniform1iv(this.addr,s),Gt(i,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||dv,s[a])}function HT(n,e,t){const i=this.cache,r=e.length,s=Mc(t,r);Ht(i,s)||(n.uniform1iv(this.addr,s),Gt(i,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||cv,s[a])}function GT(n){switch(n){case 5126:return ET;case 35664:return TT;case 35665:return bT;case 35666:return CT;case 35674:return AT;case 35675:return RT;case 35676:return PT;case 5124:case 35670:return LT;case 35667:case 35671:return NT;case 35668:case 35672:return IT;case 35669:case 35673:return DT;case 5125:return UT;case 36294:return FT;case 36295:return OT;case 36296:return kT;case 35678:case 36198:case 36298:case 36306:case 35682:return BT;case 35679:case 36299:case 36307:return zT;case 35680:case 36300:case 36308:case 36293:return VT;case 36289:case 36303:case 36311:case 36292:return HT}}class WT{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=wT(t.type)}}class jT{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=GT(t.type)}}class XT{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],i)}}}const Du=/(\w+)(\])?(\[|\.)?/g;function e0(n,e){n.seq.push(e),n.map[e.id]=e}function $T(n,e,t){const i=n.name,r=i.length;for(Du.lastIndex=0;;){const s=Du.exec(i),a=Du.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){e0(t,c===void 0?new WT(o,n,e):new jT(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new XT(o),e0(t,u)),t=u}}}class wl{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);$T(o,l,this)}const r=[],s=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(a):s.push(a);r.length>0&&(this.seq=r.concat(s))}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&i.push(a)}return i}}function t0(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const YT=37297;let qT=0;function KT(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const n0=new ze;function ZT(n){et._getMatrix(n0,et.workingColorSpace,n);const e=`mat3( ${n0.elements.map(t=>t.toFixed(4))} )`;switch(et.getTransfer(n)){case Zl:return[e,"LinearTransferOETF"];case dt:return[e,"sRGBTransferOETF"];default:return Fe("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function i0(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),s=(n.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+KT(n.getShaderSource(e),o)}else return s}function QT(n,e){const t=ZT(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const JT={[Rx]:"Linear",[Px]:"Reinhard",[Lx]:"Cineon",[Nx]:"ACESFilmic",[Dx]:"AgX",[Ux]:"Neutral",[Ix]:"Custom"};function eb(n,e){const t=JT[e];return t===void 0?(Fe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const sl=new R;function tb(){et.getLuminanceCoefficients(sl);const n=sl.x.toFixed(4),e=sl.y.toFixed(4),t=sl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function nb(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ta).join(`
`)}function ib(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function rb(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),a=s.name;let o=1;s.type===n.FLOAT_MAT2&&(o=2),s.type===n.FLOAT_MAT3&&(o=3),s.type===n.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Ta(n){return n!==""}function r0(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function s0(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const sb=/^[ \t]*#include +<([\w\d./]+)>/gm;function vh(n){return n.replace(sb,ob)}const ab=new Map;function ob(n,e){let t=Ge[e];if(t===void 0){const i=ab.get(e);if(i!==void 0)t=Ge[i],Fe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return vh(t)}const lb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function a0(n){return n.replace(lb,cb)}function cb(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function o0(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const ub={[vl]:"SHADOWMAP_TYPE_PCF",[Ea]:"SHADOWMAP_TYPE_VSM"};function db(n){return ub[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const hb={[Yr]:"ENVMAP_TYPE_CUBE",[qs]:"ENVMAP_TYPE_CUBE",[yc]:"ENVMAP_TYPE_CUBE_UV"};function fb(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":hb[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const pb={[qs]:"ENVMAP_MODE_REFRACTION"};function mb(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":pb[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const gb={[Ax]:"ENVMAP_BLENDING_MULTIPLY",[OS]:"ENVMAP_BLENDING_MIX",[kS]:"ENVMAP_BLENDING_ADD"};function xb(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":gb[n.combine]||"ENVMAP_BLENDING_NONE"}function vb(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function _b(n,e,t,i){const r=n.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=db(t),c=fb(t),h=mb(t),u=xb(t),d=vb(t),p=nb(t),g=ib(s),M=r.createProgram();let x,f,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ta).join(`
`),x.length>0&&(x+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ta).join(`
`),f.length>0&&(f+=`
`)):(x=[o0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ta).join(`
`),f=[o0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Mi?"#define TONE_MAPPING":"",t.toneMapping!==Mi?Ge.tonemapping_pars_fragment:"",t.toneMapping!==Mi?eb("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ge.colorspace_pars_fragment,QT("linearToOutputTexel",t.outputColorSpace),tb(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ta).join(`
`)),a=vh(a),a=r0(a,t),a=s0(a,t),o=vh(o),o=r0(o,t),o=s0(o,t),a=a0(a),o=a0(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,x=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,f=["#define varying in",t.glslVersion===pm?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===pm?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const E=v+x+a,S=v+f+o,T=t0(r,r.VERTEX_SHADER,E),b=t0(r,r.FRAGMENT_SHADER,S);r.attachShader(M,T),r.attachShader(M,b),t.index0AttributeName!==void 0?r.bindAttribLocation(M,0,t.index0AttributeName):t.hasPositionAttribute===!0&&r.bindAttribLocation(M,0,"position"),r.linkProgram(M);function C(I){if(n.debug.checkShaderErrors){const N=r.getProgramInfoLog(M)||"",k=r.getShaderInfoLog(T)||"",D=r.getShaderInfoLog(b)||"",V=N.trim(),q=k.trim(),$=D.trim();let H=!0,B=!0;if(r.getProgramParameter(M,r.LINK_STATUS)===!1)if(H=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,M,T,b);else{const j=i0(r,T,"vertex"),J=i0(r,b,"fragment");nt("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(M,r.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+V+`
`+j+`
`+J)}else V!==""?Fe("WebGLProgram: Program Info Log:",V):(q===""||$==="")&&(B=!1);B&&(I.diagnostics={runnable:H,programLog:V,vertexShader:{log:q,prefix:x},fragmentShader:{log:$,prefix:f}})}r.deleteShader(T),r.deleteShader(b),_=new wl(r,M),A=rb(r,M)}let _;this.getUniforms=function(){return _===void 0&&C(this),_};let A;this.getAttributes=function(){return A===void 0&&C(this),A};let L=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=r.getProgramParameter(M,YT)),L},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=qT++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=T,this.fragmentShader=b,this}let yb=0;class Sb{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(i)===!1&&(r.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Mb(e),t.set(e,i)),i}}class Mb{constructor(e){this.id=yb++,this.code=e,this.usedTimes=0}}function wb(n){return n===qr||n===Yl||n===ql}function Eb(n,e,t,i,r,s){const a=new bf,o=new Sb,l=new Set,c=[],h=new Map,u=i.logarithmicDepthBuffer;let d=i.precision;const p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(_){return l.add(_),_===0?"uv":`uv${_}`}function M(_,A,L,I,N,k){const D=I.fog,V=N.geometry,q=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?I.environment:null,$=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,H=e.get(_.envMap||q,$),B=H&&H.mapping===yc?H.image.height:null,j=p[_.type];_.precision!==null&&(d=i.getMaxPrecision(_.precision),d!==_.precision&&Fe("WebGLProgram.getParameters:",_.precision,"not supported, using",d,"instead."));const J=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,_e=J!==void 0?J.length:0;let Ae=0;V.morphAttributes.position!==void 0&&(Ae=1),V.morphAttributes.normal!==void 0&&(Ae=2),V.morphAttributes.color!==void 0&&(Ae=3);let tt,je,We,K;if(j){const xt=gi[j];tt=xt.vertexShader,je=xt.fragmentShader}else{tt=_.vertexShader,je=_.fragmentShader;const xt=o.getVertexShaderStage(_),ot=o.getFragmentShaderStage(_);o.update(_,xt,ot),We=xt.id,K=ot.id}const re=n.getRenderTarget(),Te=n.state.buffers.depth.getReversed(),Be=N.isInstancedMesh===!0,Me=N.isBatchedMesh===!0,Xe=!!_.map,Bt=!!_.matcap,Ye=!!H,st=!!_.aoMap,gt=!!_.lightMap,Je=!!_.bumpMap&&_.wireframe===!1,Et=!!_.normalMap,Wt=!!_.displacementMap,_n=!!_.emissiveMap,bt=!!_.metalnessMap,Ut=!!_.roughnessMap,O=_.anisotropy>0,tn=_.clearcoat>0,ut=_.dispersion>0,P=_.retroreflectivity>0,y=_.iridescence>0,z=_.sheen>0,X=_.transmission>0,Q=O&&!!_.anisotropyMap,oe=tn&&!!_.clearcoatMap,le=tn&&!!_.clearcoatNormalMap,ee=tn&&!!_.clearcoatRoughnessMap,ie=y&&!!_.iridescenceMap,ce=y&&!!_.iridescenceThicknessMap,Ne=z&&!!_.sheenColorMap,fe=z&&!!_.sheenRoughnessMap,ue=!!_.specularMap,Ie=!!_.specularColorMap,Ue=!!_.specularIntensityMap,Ve=X&&!!_.transmissionMap,F=X&&!!_.thicknessMap,de=!!_.gradientMap,te=!!_.alphaMap,he=_.alphaTest>0,ye=!!_.alphaHash,se=!!_.extensions;let De=Mi;_.toneMapped&&(re===null||re.isXRRenderTarget===!0)&&(De=n.toneMapping);const Re={shaderID:j,shaderType:_.type,shaderName:_.name,vertexShader:tt,fragmentShader:je,defines:_.defines,customVertexShaderID:We,customFragmentShaderID:K,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:d,batching:Me,batchingColor:Me&&N._colorsTexture!==null,instancing:Be,instancingColor:Be&&N.instanceColor!==null,instancingMorph:Be&&N.morphTexture!==null,outputColorSpace:re===null?n.outputColorSpace:re.isXRRenderTarget===!0?re.texture.colorSpace:et.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Xe,matcap:Bt,envMap:Ye,envMapMode:Ye&&H.mapping,envMapCubeUVHeight:B,aoMap:st,lightMap:gt,bumpMap:Je,normalMap:Et,displacementMap:Wt,emissiveMap:_n,normalMapObjectSpace:Et&&_.normalMapType===VS,normalMapTangentSpace:Et&&_.normalMapType===ph,packedNormalMap:Et&&_.normalMapType===ph&&wb(_.normalMap.format),metalnessMap:bt,roughnessMap:Ut,anisotropy:O,anisotropyMap:Q,clearcoat:tn,clearcoatMap:oe,clearcoatNormalMap:le,clearcoatRoughnessMap:ee,dispersion:ut,retroreflection:P,iridescence:y,iridescenceMap:ie,iridescenceThicknessMap:ce,sheen:z,sheenColorMap:Ne,sheenRoughnessMap:fe,specularMap:ue,specularColorMap:Ie,specularIntensityMap:Ue,transmission:X,transmissionMap:Ve,thicknessMap:F,gradientMap:de,opaque:_.transparent===!1&&_.blending===Fa&&_.alphaToCoverage===!1,alphaMap:te,alphaTest:he,alphaHash:ye,combine:_.combine,mapUv:Xe&&g(_.map.channel),aoMapUv:st&&g(_.aoMap.channel),lightMapUv:gt&&g(_.lightMap.channel),bumpMapUv:Je&&g(_.bumpMap.channel),normalMapUv:Et&&g(_.normalMap.channel),displacementMapUv:Wt&&g(_.displacementMap.channel),emissiveMapUv:_n&&g(_.emissiveMap.channel),metalnessMapUv:bt&&g(_.metalnessMap.channel),roughnessMapUv:Ut&&g(_.roughnessMap.channel),anisotropyMapUv:Q&&g(_.anisotropyMap.channel),clearcoatMapUv:oe&&g(_.clearcoatMap.channel),clearcoatNormalMapUv:le&&g(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ee&&g(_.clearcoatRoughnessMap.channel),iridescenceMapUv:ie&&g(_.iridescenceMap.channel),iridescenceThicknessMapUv:ce&&g(_.iridescenceThicknessMap.channel),sheenColorMapUv:Ne&&g(_.sheenColorMap.channel),sheenRoughnessMapUv:fe&&g(_.sheenRoughnessMap.channel),specularMapUv:ue&&g(_.specularMap.channel),specularColorMapUv:Ie&&g(_.specularColorMap.channel),specularIntensityMapUv:Ue&&g(_.specularIntensityMap.channel),transmissionMapUv:Ve&&g(_.transmissionMap.channel),thicknessMapUv:F&&g(_.thicknessMap.channel),alphaMapUv:te&&g(_.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(Et||O),vertexNormals:!!V.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!V.attributes.uv&&(Xe||te),fog:!!D,useFog:_.fog===!0,fogExp2:!!D&&D.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||V.attributes.normal===void 0&&Et===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Te,skinning:N.isSkinnedMesh===!0,hasPositionAttribute:V.attributes.position!==void 0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:_e,morphTextureStride:Ae,numSunLights:A.sun.length,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numSunLightShadows:A.sunShadowMap.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:k.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:_.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:De,decodeVideoTexture:Xe&&_.map.isVideoTexture===!0&&et.getTransfer(_.map.colorSpace)===dt,decodeVideoTextureEmissive:_n&&_.emissiveMap.isVideoTexture===!0&&et.getTransfer(_.emissiveMap.colorSpace)===dt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Di,flipSided:_.side===bn,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:se&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(se&&_.extensions.multiDraw===!0||Me)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Re.vertexUv1s=l.has(1),Re.vertexUv2s=l.has(2),Re.vertexUv3s=l.has(3),l.clear(),Re}function x(_){const A=[];if(_.shaderID?A.push(_.shaderID):(A.push(_.customVertexShaderID),A.push(_.customFragmentShaderID)),_.defines!==void 0)for(const L in _.defines)A.push(L),A.push(_.defines[L]);return _.isRawShaderMaterial===!1&&(f(A,_),v(A,_),A.push(n.outputColorSpace)),A.push(_.customProgramCacheKey),A.join()}function f(_,A){_.push(A.precision),_.push(A.outputColorSpace),_.push(A.envMapMode),_.push(A.envMapCubeUVHeight),_.push(A.mapUv),_.push(A.alphaMapUv),_.push(A.lightMapUv),_.push(A.aoMapUv),_.push(A.bumpMapUv),_.push(A.normalMapUv),_.push(A.displacementMapUv),_.push(A.emissiveMapUv),_.push(A.metalnessMapUv),_.push(A.roughnessMapUv),_.push(A.anisotropyMapUv),_.push(A.clearcoatMapUv),_.push(A.clearcoatNormalMapUv),_.push(A.clearcoatRoughnessMapUv),_.push(A.iridescenceMapUv),_.push(A.iridescenceThicknessMapUv),_.push(A.sheenColorMapUv),_.push(A.sheenRoughnessMapUv),_.push(A.specularMapUv),_.push(A.specularColorMapUv),_.push(A.specularIntensityMapUv),_.push(A.transmissionMapUv),_.push(A.thicknessMapUv),_.push(A.combine),_.push(A.fogExp2),_.push(A.sizeAttenuation),_.push(A.morphTargetsCount),_.push(A.morphAttributeCount),_.push(A.numSunLights),_.push(A.numDirLights),_.push(A.numPointLights),_.push(A.numSpotLights),_.push(A.numSpotLightMaps),_.push(A.numHemiLights),_.push(A.numRectAreaLights),_.push(A.numSunLightShadows),_.push(A.numDirLightShadows),_.push(A.numPointLightShadows),_.push(A.numSpotLightShadows),_.push(A.numSpotLightShadowsWithMaps),_.push(A.numLightProbes),_.push(A.shadowMapType),_.push(A.toneMapping),_.push(A.numClippingPlanes),_.push(A.numClipIntersection),_.push(A.depthPacking)}function v(_,A){a.disableAll(),A.instancing&&a.enable(0),A.instancingColor&&a.enable(1),A.instancingMorph&&a.enable(2),A.matcap&&a.enable(3),A.envMap&&a.enable(4),A.normalMapObjectSpace&&a.enable(5),A.normalMapTangentSpace&&a.enable(6),A.clearcoat&&a.enable(7),A.iridescence&&a.enable(8),A.alphaTest&&a.enable(9),A.vertexColors&&a.enable(10),A.vertexAlphas&&a.enable(11),A.vertexUv1s&&a.enable(12),A.vertexUv2s&&a.enable(13),A.vertexUv3s&&a.enable(14),A.vertexTangents&&a.enable(15),A.anisotropy&&a.enable(16),A.alphaHash&&a.enable(17),A.batching&&a.enable(18),A.dispersion&&a.enable(19),A.retroreflection&&a.enable(24),A.batchingColor&&a.enable(20),A.gradientMap&&a.enable(21),A.packedNormalMap&&a.enable(22),A.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),A.fog&&a.enable(0),A.useFog&&a.enable(1),A.flatShading&&a.enable(2),A.logarithmicDepthBuffer&&a.enable(3),A.reversedDepthBuffer&&a.enable(4),A.skinning&&a.enable(5),A.morphTargets&&a.enable(6),A.morphNormals&&a.enable(7),A.morphColors&&a.enable(8),A.premultipliedAlpha&&a.enable(9),A.shadowMapEnabled&&a.enable(10),A.doubleSided&&a.enable(11),A.flipSided&&a.enable(12),A.useDepthPacking&&a.enable(13),A.dithering&&a.enable(14),A.transmission&&a.enable(15),A.sheen&&a.enable(16),A.opaque&&a.enable(17),A.pointsUvs&&a.enable(18),A.decodeVideoTexture&&a.enable(19),A.decodeVideoTextureEmissive&&a.enable(20),A.alphaToCoverage&&a.enable(21),A.numLightProbeGrids>0&&a.enable(22),A.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function E(_){const A=p[_.type];let L;if(A){const I=gi[A];L=HM.clone(I.uniforms)}else L=_.uniforms;return L}function S(_,A){let L=h.get(A);return L!==void 0?++L.usedTimes:(L=new _b(n,A,_,r),c.push(L),h.set(A,L)),L}function T(_){if(--_.usedTimes===0){const A=c.indexOf(_);c[A]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function b(_){o.remove(_)}function C(){o.dispose()}return{getParameters:M,getProgramCacheKey:x,getUniforms:E,acquireProgram:S,releaseProgram:T,releaseShaderCache:b,programs:c,dispose:C}}function Tb(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function r(a,o,l){n.get(a)[o]=l}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function bb(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function l0(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function c0(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function a(d){let p=0;return d.isInstancedMesh&&(p+=2),d.isSkinnedMesh&&(p+=1),p}function o(d,p,g,M,x,f){let v=n[e];return v===void 0?(v={id:d.id,object:d,geometry:p,material:g,materialVariant:a(d),groupOrder:M,renderOrder:d.renderOrder,z:x,group:f},n[e]=v):(v.id=d.id,v.object=d,v.geometry=p,v.material=g,v.materialVariant=a(d),v.groupOrder=M,v.renderOrder=d.renderOrder,v.z=x,v.group=f),e++,v}function l(d,p,g,M,x,f,v){v.reversedDepth===!0&&(x=-x);const E=o(d,p,g,M,x,f);g.transmission>0?i.push(E):g.transparent===!0?r.push(E):t.push(E)}function c(d,p,g,M,x,f){const v=o(d,p,g,M,x,f);g.transmission>0?i.unshift(v):g.transparent===!0?r.unshift(v):t.unshift(v)}function h(d,p){t.length>1&&t.sort(d||bb),i.length>1&&i.sort(p||l0),r.length>1&&r.sort(p||l0)}function u(){for(let d=e,p=n.length;d<p;d++){const g=n[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:l,unshift:c,finish:u,sort:h}}function Cb(){let n=new WeakMap;function e(i,r){const s=n.get(i);let a;return s===void 0?(a=new c0,n.set(i,[a])):r>=s.length?(a=new c0,s.push(a)):a=s[r],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function Ab(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new R,color:new Ke};break;case"SpotLight":t={position:new R,direction:new R,color:new Ke,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new R,color:new Ke,distance:0,decay:0};break;case"HemisphereLight":t={direction:new R,skyColor:new Ke,groundColor:new Ke};break;case"RectAreaLight":t={color:new Ke,position:new R,halfWidth:new R,halfHeight:new R};break}return n[e.id]=t,t}}}function Rb(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ke};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ke};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ke,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Pb=0;function Lb(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Nb(n){const e=new Ab,t=Rb(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new R);const r=new R,s=new wt,a=new wt;function o(c){let h=0,u=0,d=0;for(let N=0;N<9;N++)i.probe[N].set(0,0,0);let p=0,g=0,M=0,x=0,f=0,v=0,E=0,S=0,T=0,b=0,C=0,_=0,A=0,L=0;c.sort(Lb);for(let N=0,k=c.length;N<k;N++){const D=c[N],V=D.color,q=D.intensity,$=D.distance;let H=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===qr?H=D.shadow.map.texture:H=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)h+=V.r*q,u+=V.g*q,d+=V.b*q;else if(D.isLightProbe){for(let B=0;B<9;B++)i.probe[B].addScaledVector(D.sh.coefficients[B],q);L++}else if(D.isSunLight){const B=e.get(D);if(B.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const j=D.shadow,J=t.get(D);J.shadowIntensity=j.intensity,J.shadowBias=j.bias,J.shadowNormalBias=j.normalBias,J.shadowRadius=j.radius,J.shadowMapSize.copy(j.mapSize).multiply(j.getFrameExtents()),i.sunShadow[g]=J,i.sunShadowMap[g]=H;const _e=j.getViewportCount();for(let Ae=0;Ae<_e;Ae++)i.sunShadowMatrix[M+Ae]=j.getMatrix(Ae),i.sunShadowCascade[M+Ae]=j._cascadeData[Ae];M+=_e,g++}i.sun[p]=B,p++}else if(D.isDirectionalLight){const B=e.get(D);if(B.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const j=D.shadow,J=t.get(D);J.shadowIntensity=j.intensity,J.shadowBias=j.bias,J.shadowNormalBias=j.normalBias,J.shadowRadius=j.radius,J.shadowMapSize=j.mapSize,i.directionalShadow[x]=J,i.directionalShadowMap[x]=H,i.directionalShadowMatrix[x]=D.shadow.matrix,T++}i.directional[x]=B,x++}else if(D.isSpotLight){const B=e.get(D);B.position.setFromMatrixPosition(D.matrixWorld),B.color.copy(V).multiplyScalar(q),B.distance=$,B.coneCos=Math.cos(D.angle),B.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),B.decay=D.decay,i.spot[v]=B;const j=D.shadow;if(D.map&&(i.spotLightMap[_]=D.map,_++,j.updateMatrices(D),D.castShadow&&A++),i.spotLightMatrix[v]=j.matrix,D.castShadow){const J=t.get(D);J.shadowIntensity=j.intensity,J.shadowBias=j.bias,J.shadowNormalBias=j.normalBias,J.shadowRadius=j.radius,J.shadowMapSize=j.mapSize,i.spotShadow[v]=J,i.spotShadowMap[v]=H,C++}v++}else if(D.isRectAreaLight){const B=e.get(D);B.color.copy(V).multiplyScalar(q),B.halfWidth.set(D.width*.5,0,0),B.halfHeight.set(0,D.height*.5,0),i.rectArea[E]=B,E++}else if(D.isPointLight){const B=e.get(D);if(B.color.copy(D.color).multiplyScalar(D.intensity),B.distance=D.distance,B.decay=D.decay,D.castShadow){const j=D.shadow,J=t.get(D);J.shadowIntensity=j.intensity,J.shadowBias=j.bias,J.shadowNormalBias=j.normalBias,J.shadowRadius=j.radius,J.shadowMapSize=j.mapSize,J.shadowCameraNear=j.camera.near,J.shadowCameraFar=j.camera.far,i.pointShadow[f]=J,i.pointShadowMap[f]=H,i.pointShadowMatrix[f]=D.shadow.matrix,b++}i.point[f]=B,f++}else if(D.isHemisphereLight){const B=e.get(D);B.skyColor.copy(D.color).multiplyScalar(q),B.groundColor.copy(D.groundColor).multiplyScalar(q),i.hemi[S]=B,S++}}E>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=pe.LTC_FLOAT_1,i.rectAreaLTC2=pe.LTC_FLOAT_2):(i.rectAreaLTC1=pe.LTC_HALF_1,i.rectAreaLTC2=pe.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;const I=i.hash;(I.sunLength!==p||I.directionalLength!==x||I.pointLength!==f||I.spotLength!==v||I.rectAreaLength!==E||I.hemiLength!==S||I.numSunShadows!==g||I.numDirectionalShadows!==T||I.numPointShadows!==b||I.numSpotShadows!==C||I.numSpotMaps!==_||I.numLightProbes!==L)&&(i.sun.length=p,i.directional.length=x,i.spot.length=v,i.rectArea.length=E,i.point.length=f,i.hemi.length=S,i.sunShadow.length=g,i.sunShadowMap.length=g,i.sunShadowMatrix.length=M,i.sunShadowCascade.length=M,i.directionalShadow.length=T,i.directionalShadowMap.length=T,i.directionalShadowMatrix.length=T,i.pointShadow.length=b,i.pointShadowMap.length=b,i.pointShadowMatrix.length=b,i.spotShadow.length=C,i.spotShadowMap.length=C,i.spotLightMatrix.length=C+_-A,i.spotLightMap.length=_,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=L,I.sunLength=p,I.directionalLength=x,I.pointLength=f,I.spotLength=v,I.rectAreaLength=E,I.hemiLength=S,I.numSunShadows=g,I.numDirectionalShadows=T,I.numPointShadows=b,I.numSpotShadows=C,I.numSpotMaps=_,I.numLightProbes=L,i.version=Pb++)}function l(c,h){let u=0,d=0,p=0,g=0,M=0,x=0;const f=h.matrixWorldInverse;for(let v=0,E=c.length;v<E;v++){const S=c[v];if(S.isSunLight){const T=i.sun[u];T.direction.setFromMatrixPosition(S.matrixWorld),T.direction.transformDirection(f),u++}else if(S.isDirectionalLight){const T=i.directional[d];T.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(f),d++}else if(S.isSpotLight){const T=i.spot[g];T.position.setFromMatrixPosition(S.matrixWorld),T.position.applyMatrix4(f),T.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(f),g++}else if(S.isRectAreaLight){const T=i.rectArea[M];T.position.setFromMatrixPosition(S.matrixWorld),T.position.applyMatrix4(f),a.identity(),s.copy(S.matrixWorld),s.premultiply(f),a.extractRotation(s),T.halfWidth.set(S.width*.5,0,0),T.halfHeight.set(0,S.height*.5,0),T.halfWidth.applyMatrix4(a),T.halfHeight.applyMatrix4(a),M++}else if(S.isPointLight){const T=i.point[p];T.position.setFromMatrixPosition(S.matrixWorld),T.position.applyMatrix4(f),p++}else if(S.isHemisphereLight){const T=i.hemi[x];T.direction.setFromMatrixPosition(S.matrixWorld),T.direction.transformDirection(f),x++}}}return{setup:o,setupView:l,state:i}}function u0(n){const e=new Nb(n),t=[],i=[],r=[];function s(d){u.camera=d,t.length=0,i.length=0,r.length=0}function a(d){t.push(d)}function o(d){i.push(d)}function l(d){r.push(d)}function c(){e.setup(t)}function h(d){e.setupView(t,d)}const u={lightsArray:t,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:u,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function Ib(n){let e=new WeakMap;function t(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new u0(n),e.set(r,[o])):s>=a.length?(o=new u0(n),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const Db=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ub=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Fb=[new R(1,0,0),new R(-1,0,0),new R(0,1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1)],Ob=[new R(0,-1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1),new R(0,-1,0),new R(0,-1,0)],d0=new wt,_a=new R,Uu=new R;function kb(n,e,t){let i=new Rf;const r=new ke,s=new ke,a=new At,o=new XM,l=new $M,c={},h=t.maxTextureSize,u={[$r]:bn,[bn]:$r,[Di]:Di},d=new Ti({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ke},radius:{value:4}},vertexShader:Db,fragmentShader:Ub}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const g=new Cn;g.setAttribute("position",new Xn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new ne(g,d),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=vl;let f=this.type;this.render=function(b,C,_){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||b.length===0)return;this.type===Tx&&(Fe("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=vl);const A=n.getRenderTarget(),L=n.getActiveCubeFace(),I=n.getActiveMipmapLevel(),N=n.state;N.setBlending(Bi),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const k=f!==this.type;k&&C.traverse(function(D){D.material&&(Array.isArray(D.material)?D.material.forEach(V=>V.needsUpdate=!0):D.material.needsUpdate=!0)});for(let D=0,V=b.length;D<V;D++){const q=b[D],$=q.shadow;if($===void 0){Fe("WebGLShadowMap:",q,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;r.copy($.mapSize);const H=$.getFrameExtents();r.multiply(H),s.copy($.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/H.x),r.x=s.x*H.x,$.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/H.y),r.y=s.y*H.y,$.mapSize.y=s.y));const B=n.state.buffers.depth.getReversed();if($.camera._reversedDepth=B,$.map===null||k===!0){if($.map!==null&&($.map.depthTexture!==null&&($.map.depthTexture.dispose(),$.map.depthTexture=null),$.map.dispose()),this.type===Ea){if(q.isPointLight){Fe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}$.map=new oi(r.x,r.y,{format:qr,type:Ei,minFilter:Qt,magFilter:Qt,generateMipmaps:!1}),$.map.texture.name=q.name+".shadowMap",$.map.depthTexture=new oo(r.x,r.y,vi),$.map.depthTexture.name=q.name+".shadowMapDepth",$.map.depthTexture.format=Xi,$.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=Zt,$.map.depthTexture.magFilter=Zt}else q.isPointLight?($.map=new ov(r.x),$.map.depthTexture=new BM(r.x,wi)):($.map=new oi(r.x,r.y),$.map.depthTexture=new oo(r.x,r.y,wi)),$.map.depthTexture.name=q.name+".shadowMap",$.map.depthTexture.format=Xi,this.type===vl?($.map.depthTexture.compareFunction=B?wf:Mf,$.map.depthTexture.minFilter=Qt,$.map.depthTexture.magFilter=Qt):($.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=Zt,$.map.depthTexture.magFilter=Zt);$.camera.updateProjectionMatrix()}$.map.isWebGLCubeRenderTarget!==!0&&($.map.width!==r.x||$.map.height!==r.y)&&$.map.setSize(r.x,r.y);const j=$.map.isWebGLCubeRenderTarget?6:$.getViewportCount();q.isPointLight!==!0&&$.updateMatrices(q,_);for(let J=0;J<j;J++){const _e=$.getCamera(J);if(q.isPointLight){const Ae=$.camera,tt=$.matrix,je=q.distance||Ae.far;je!==Ae.far&&(Ae.far=je,Ae.updateProjectionMatrix()),_a.setFromMatrixPosition(q.matrixWorld),Ae.position.copy(_a),Uu.copy(Ae.position),Uu.add(Fb[J]),Ae.up.copy(Ob[J]),Ae.lookAt(Uu),Ae.updateMatrixWorld(),tt.makeTranslation(-_a.x,-_a.y,-_a.z),d0.multiplyMatrices(Ae.projectionMatrix,Ae.matrixWorldInverse),$._frustum.setFromProjectionMatrix(d0,Ae.coordinateSystem,Ae.reversedDepth)}if($.map.isWebGLCubeRenderTarget)n.setRenderTarget($.map,J),n.clear();else{J===0&&(n.setRenderTarget($.map),n.clear());const Ae=$.getViewport(J);a.set(s.x*Ae.x,s.y*Ae.y,s.x*Ae.z,s.y*Ae.w),N.viewport(a)}i=$.getFrustum(J),S(C,_,_e,q,this.type)}$.isPointLightShadow!==!0&&this.type===Ea&&v($,_),$.needsUpdate=!1}f=this.type,x.needsUpdate=!1,n.setRenderTarget(A,L,I)};function v(b,C){const _=e.update(M);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,p.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),b.mapPass===null?b.mapPass=new oi(r.x,r.y,{format:qr,type:Ei}):(b.mapPass.width!==b.map.width||b.mapPass.height!==b.map.height)&&b.mapPass.setSize(b.map.width,b.map.height),d.uniforms.shadow_pass.value=b.map.depthTexture,d.uniforms.resolution.value.set(b.map.width,b.map.height),d.uniforms.radius.value=b.radius,n.setRenderTarget(b.mapPass),n.clear(),n.renderBufferDirect(C,null,_,d,M,null),p.uniforms.shadow_pass.value=b.mapPass.texture,p.uniforms.resolution.value.set(b.map.width,b.map.height),p.uniforms.radius.value=b.radius,n.setRenderTarget(b.map),n.clear(),n.renderBufferDirect(C,null,_,p,M,null)}function E(b,C,_,A){let L=null;const I=_.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(I!==void 0)L=I;else if(L=_.isPointLight===!0?l:o,n.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const N=L.uuid,k=C.uuid;let D=c[N];D===void 0&&(D={},c[N]=D);let V=D[k];V===void 0&&(V=L.clone(),D[k]=V,C.addEventListener("dispose",T)),L=V}if(L.visible=C.visible,L.wireframe=C.wireframe,A===Ea?L.side=C.shadowSide!==null?C.shadowSide:C.side:L.side=C.shadowSide!==null?C.shadowSide:u[C.side],L.alphaMap=C.alphaMap,L.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,L.map=C.map,L.clipShadows=C.clipShadows,L.clippingPlanes=C.clippingPlanes,L.clipIntersection=C.clipIntersection,L.displacementMap=C.displacementMap,L.displacementScale=C.displacementScale,L.displacementBias=C.displacementBias,L.wireframeLinewidth=C.wireframeLinewidth,L.linewidth=C.linewidth,_.isPointLight===!0&&L.isMeshDistanceMaterial===!0){const N=n.properties.get(L);N.light=_}return L}function S(b,C,_,A,L){if(b.visible===!1)return;if(b.layers.test(C.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&L===Ea)&&(!b.frustumCulled||b.intersectsFrustum(i))){b.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,b.matrixWorld);const k=e.update(b),D=b.material;if(Array.isArray(D)){const V=k.groups;for(let q=0,$=V.length;q<$;q++){const H=V[q],B=D[H.materialIndex];if(B&&B.visible){const j=E(b,B,A,L);b.onBeforeShadow(n,b,C,_,k,j,H),n.renderBufferDirect(_,null,k,j,b,H),b.onAfterShadow(n,b,C,_,k,j,H)}}}else if(D.visible){const V=E(b,D,A,L);b.onBeforeShadow(n,b,C,_,k,V,null),n.renderBufferDirect(_,null,k,V,b,null),b.onAfterShadow(n,b,C,_,k,V,null)}}const N=b.children;for(let k=0,D=N.length;k<D;k++)S(N[k],C,_,A,L)}function T(b){b.target.removeEventListener("dispose",T);for(const _ in c){const A=c[_],L=b.target.uuid;L in A&&(A[L].dispose(),delete A[L])}}}function Bb(n,e){function t(){let F=!1;const de=new At;let te=null;const he=new At(0,0,0,0);return{setMask:function(ye){te!==ye&&!F&&(n.colorMask(ye,ye,ye,ye),te=ye)},setLocked:function(ye){F=ye},setClear:function(ye,se,De,Re,xt){xt===!0&&(ye*=Re,se*=Re,De*=Re),de.set(ye,se,De,Re),he.equals(de)===!1&&(n.clearColor(ye,se,De,Re),he.copy(de))},reset:function(){F=!1,te=null,he.set(-1,0,0,0)}}}function i(){let F=!1,de=!1,te=null,he=null,ye=null;return{setReversed:function(se){if(de!==se){const De=e.get("EXT_clip_control");se?De.clipControlEXT(De.LOWER_LEFT_EXT,De.ZERO_TO_ONE_EXT):De.clipControlEXT(De.LOWER_LEFT_EXT,De.NEGATIVE_ONE_TO_ONE_EXT),de=se;const Re=ye;ye=null,this.setClear(Re)}},getReversed:function(){return de},setTest:function(se){se?re(n.DEPTH_TEST):Te(n.DEPTH_TEST)},setMask:function(se){te!==se&&!F&&(n.depthMask(se),te=se)},setFunc:function(se){if(de&&(se=QS[se]),he!==se){switch(se){case Rd:n.depthFunc(n.NEVER);break;case Pd:n.depthFunc(n.ALWAYS);break;case Ld:n.depthFunc(n.LESS);break;case no:n.depthFunc(n.LEQUAL);break;case Nd:n.depthFunc(n.EQUAL);break;case Id:n.depthFunc(n.GEQUAL);break;case Dd:n.depthFunc(n.GREATER);break;case Ud:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}he=se}},setLocked:function(se){F=se},setClear:function(se){ye!==se&&(ye=se,de&&(se=1-se),n.clearDepth(se))},reset:function(){F=!1,te=null,he=null,ye=null,de=!1}}}function r(){let F=!1,de=null,te=null,he=null,ye=null,se=null,De=null,Re=null,xt=null;return{setTest:function(ot){F||(ot?re(n.STENCIL_TEST):Te(n.STENCIL_TEST))},setMask:function(ot){de!==ot&&!F&&(n.stencilMask(ot),de=ot)},setFunc:function(ot,qn,ci){(te!==ot||he!==qn||ye!==ci)&&(n.stencilFunc(ot,qn,ci),te=ot,he=qn,ye=ci)},setOp:function(ot,qn,ci){(se!==ot||De!==qn||Re!==ci)&&(n.stencilOp(ot,qn,ci),se=ot,De=qn,Re=ci)},setLocked:function(ot){F=ot},setClear:function(ot){xt!==ot&&(n.clearStencil(ot),xt=ot)},reset:function(){F=!1,de=null,te=null,he=null,ye=null,se=null,De=null,Re=null,xt=null}}}const s=new t,a=new i,o=new r,l=new WeakMap,c=new WeakMap;let h={},u={},d={},p=new WeakMap,g=[],M=null,x=!1,f=null,v=null,E=null,S=null,T=null,b=null,C=null,_=new Ke(0,0,0),A=0,L=!1,I=null,N=null,k=null,D=null,V=null;const q=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let $=!1,H=0;const B=n.getParameter(n.VERSION);B.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(B)[1]),$=H>=1):B.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),$=H>=2);let j=null,J={};const _e=n.getParameter(n.SCISSOR_BOX),Ae=n.getParameter(n.VIEWPORT),tt=new At().fromArray(_e),je=new At().fromArray(Ae);function We(F,de,te,he){const ye=new Uint8Array(4),se=n.createTexture();n.bindTexture(F,se),n.texParameteri(F,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(F,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let De=0;De<te;De++)F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY?n.texImage3D(de,0,n.RGBA,1,1,he,0,n.RGBA,n.UNSIGNED_BYTE,ye):n.texImage2D(de+De,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ye);return se}const K={};K[n.TEXTURE_2D]=We(n.TEXTURE_2D,n.TEXTURE_2D,1),K[n.TEXTURE_CUBE_MAP]=We(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),K[n.TEXTURE_2D_ARRAY]=We(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),K[n.TEXTURE_3D]=We(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),re(n.DEPTH_TEST),a.setFunc(no),Je(!1),Et(um),re(n.CULL_FACE),st(Bi);function re(F){h[F]!==!0&&(n.enable(F),h[F]=!0)}function Te(F){h[F]!==!1&&(n.disable(F),h[F]=!1)}function Be(F,de){return d[F]!==de?(n.bindFramebuffer(F,de),d[F]=de,F===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=de),F===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=de),!0):!1}function Me(F,de){let te=g,he=!1;if(F){te=p.get(de),te===void 0&&(te=[],p.set(de,te));const ye=F.textures;if(te.length!==ye.length||te[0]!==n.COLOR_ATTACHMENT0){for(let se=0,De=ye.length;se<De;se++)te[se]=n.COLOR_ATTACHMENT0+se;te.length=ye.length,he=!0}}else te[0]!==n.BACK&&(te[0]=n.BACK,he=!0);he&&n.drawBuffers(te)}function Xe(F){return M!==F?(n.useProgram(F),M=F,!0):!1}const Bt={[_s]:n.FUNC_ADD,[yS]:n.FUNC_SUBTRACT,[SS]:n.FUNC_REVERSE_SUBTRACT};Bt[MS]=n.MIN,Bt[wS]=n.MAX;const Ye={[ES]:n.ZERO,[TS]:n.ONE,[bS]:n.SRC_COLOR,[bx]:n.SRC_ALPHA,[NS]:n.SRC_ALPHA_SATURATE,[PS]:n.DST_COLOR,[AS]:n.DST_ALPHA,[CS]:n.ONE_MINUS_SRC_COLOR,[Cx]:n.ONE_MINUS_SRC_ALPHA,[LS]:n.ONE_MINUS_DST_COLOR,[RS]:n.ONE_MINUS_DST_ALPHA,[IS]:n.CONSTANT_COLOR,[DS]:n.ONE_MINUS_CONSTANT_COLOR,[US]:n.CONSTANT_ALPHA,[FS]:n.ONE_MINUS_CONSTANT_ALPHA};function st(F,de,te,he,ye,se,De,Re,xt,ot){if(F===Bi){x===!0&&(Te(n.BLEND),x=!1);return}if(x===!1&&(re(n.BLEND),x=!0),F!==_S){if(F!==f||ot!==L){if((v!==_s||T!==_s)&&(n.blendEquation(n.FUNC_ADD),v=_s,T=_s),ot)switch(F){case Fa:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case dm:n.blendFunc(n.ONE,n.ONE);break;case hm:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case fm:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:nt("WebGLState: Invalid blending: ",F);break}else switch(F){case Fa:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case dm:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case hm:nt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case fm:nt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:nt("WebGLState: Invalid blending: ",F);break}E=null,S=null,b=null,C=null,_.set(0,0,0),A=0,f=F,L=ot}return}ye=ye||de,se=se||te,De=De||he,(de!==v||ye!==T)&&(n.blendEquationSeparate(Bt[de],Bt[ye]),v=de,T=ye),(te!==E||he!==S||se!==b||De!==C)&&(n.blendFuncSeparate(Ye[te],Ye[he],Ye[se],Ye[De]),E=te,S=he,b=se,C=De),(Re.equals(_)===!1||xt!==A)&&(n.blendColor(Re.r,Re.g,Re.b,xt),_.copy(Re),A=xt),f=F,L=!1}function gt(F,de){F.side===Di?Te(n.CULL_FACE):re(n.CULL_FACE);let te=F.side===bn;de&&(te=!te),Je(te),F.blending===Fa&&F.transparent===!1?st(Bi):st(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),s.setMask(F.colorWrite);const he=F.stencilWrite;o.setTest(he),he&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),_n(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?re(n.SAMPLE_ALPHA_TO_COVERAGE):Te(n.SAMPLE_ALPHA_TO_COVERAGE)}function Je(F){I!==F&&(F?n.frontFace(n.CW):n.frontFace(n.CCW),I=F)}function Et(F){F!==xS?(re(n.CULL_FACE),F!==N&&(F===um?n.cullFace(n.BACK):F===vS?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Te(n.CULL_FACE),N=F}function Wt(F){F!==k&&($&&n.lineWidth(F),k=F)}function _n(F,de,te){F?(re(n.POLYGON_OFFSET_FILL),(D!==de||V!==te)&&(D=de,V=te,a.getReversed()&&(de=-de),n.polygonOffset(de,te))):Te(n.POLYGON_OFFSET_FILL)}function bt(F){F?re(n.SCISSOR_TEST):Te(n.SCISSOR_TEST)}function Ut(F){F===void 0&&(F=n.TEXTURE0+q-1),j!==F&&(n.activeTexture(F),j=F)}function O(F,de,te){te===void 0&&(j===null?te=n.TEXTURE0+q-1:te=j);let he=J[te];he===void 0&&(he={type:void 0,texture:void 0},J[te]=he),(he.type!==F||he.texture!==de)&&(j!==te&&(n.activeTexture(te),j=te),n.bindTexture(F,de||K[F]),he.type=F,he.texture=de)}function tn(){const F=J[j];F!==void 0&&F.type!==void 0&&(n.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function ut(){try{n.compressedTexImage2D(...arguments)}catch(F){nt("WebGLState:",F)}}function P(){try{n.compressedTexImage3D(...arguments)}catch(F){nt("WebGLState:",F)}}function y(){try{n.texSubImage2D(...arguments)}catch(F){nt("WebGLState:",F)}}function z(){try{n.texSubImage3D(...arguments)}catch(F){nt("WebGLState:",F)}}function X(){try{n.compressedTexSubImage2D(...arguments)}catch(F){nt("WebGLState:",F)}}function Q(){try{n.compressedTexSubImage3D(...arguments)}catch(F){nt("WebGLState:",F)}}function oe(){try{n.texStorage2D(...arguments)}catch(F){nt("WebGLState:",F)}}function le(){try{n.texStorage3D(...arguments)}catch(F){nt("WebGLState:",F)}}function ee(){try{n.texImage2D(...arguments)}catch(F){nt("WebGLState:",F)}}function ie(){try{n.texImage3D(...arguments)}catch(F){nt("WebGLState:",F)}}function ce(F){return u[F]!==void 0?u[F]:n.getParameter(F)}function Ne(F,de){u[F]!==de&&(n.pixelStorei(F,de),u[F]=de)}function fe(F){tt.equals(F)===!1&&(n.scissor(F.x,F.y,F.z,F.w),tt.copy(F))}function ue(F){je.equals(F)===!1&&(n.viewport(F.x,F.y,F.z,F.w),je.copy(F))}function Ie(F,de){let te=c.get(de);te===void 0&&(te=new WeakMap,c.set(de,te));let he=te.get(F);he===void 0&&(he=n.getUniformBlockIndex(de,F.name),te.set(F,he))}function Ue(F,de){const he=c.get(de).get(F);l.get(de)!==he&&(n.uniformBlockBinding(de,he,F.__bindingPointIndex),l.set(de,he))}function Ve(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),h={},u={},j=null,J={},d={},p=new WeakMap,g=[],M=null,x=!1,f=null,v=null,E=null,S=null,T=null,b=null,C=null,_=new Ke(0,0,0),A=0,L=!1,I=null,N=null,k=null,D=null,V=null,tt.set(0,0,n.canvas.width,n.canvas.height),je.set(0,0,n.canvas.width,n.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:re,disable:Te,bindFramebuffer:Be,drawBuffers:Me,useProgram:Xe,setBlending:st,setMaterial:gt,setFlipSided:Je,setCullFace:Et,setLineWidth:Wt,setPolygonOffset:_n,setScissorTest:bt,activeTexture:Ut,bindTexture:O,unbindTexture:tn,compressedTexImage2D:ut,compressedTexImage3D:P,texImage2D:ee,texImage3D:ie,pixelStorei:Ne,getParameter:ce,updateUBOMapping:Ie,uniformBlockBinding:Ue,texStorage2D:oe,texStorage3D:le,texSubImage2D:y,texSubImage3D:z,compressedTexSubImage2D:X,compressedTexSubImage3D:Q,scissor:fe,viewport:ue,reset:Ve}}function zb(n,e,t,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ke,h=new WeakMap,u=new Set;let d;const p=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function M(P,y){return g?new OffscreenCanvas(P,y):Ql("canvas")}function x(P,y,z){let X=1;const Q=ut(P);if((Q.width>z||Q.height>z)&&(X=z/Math.max(Q.width,Q.height)),X<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const oe=Math.floor(X*Q.width),le=Math.floor(X*Q.height);d===void 0&&(d=M(oe,le));const ee=y?M(oe,le):d;return ee.width=oe,ee.height=le,ee.getContext("2d").drawImage(P,0,0,oe,le),Fe("WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+oe+"x"+le+")."),ee}else return"data"in P&&Fe("WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),P;return P}function f(P){return P.generateMipmaps}function v(P){n.generateMipmap(P)}function E(P){return P.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?n.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function S(P,y,z,X,Q,oe=!1){if(P!==null){if(n[P]!==void 0)return n[P];Fe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let le;X&&(le=e.get("EXT_texture_norm16"),le||Fe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ee=y;if(y===n.RED&&(z===n.FLOAT&&(ee=n.R32F),z===n.HALF_FLOAT&&(ee=n.R16F),z===n.UNSIGNED_BYTE&&(ee=n.R8),z===n.UNSIGNED_SHORT&&le&&(ee=le.R16_EXT),z===n.SHORT&&le&&(ee=le.R16_SNORM_EXT)),y===n.RED_INTEGER&&(z===n.UNSIGNED_BYTE&&(ee=n.R8UI),z===n.UNSIGNED_SHORT&&(ee=n.R16UI),z===n.UNSIGNED_INT&&(ee=n.R32UI),z===n.BYTE&&(ee=n.R8I),z===n.SHORT&&(ee=n.R16I),z===n.INT&&(ee=n.R32I)),y===n.RG&&(z===n.FLOAT&&(ee=n.RG32F),z===n.HALF_FLOAT&&(ee=n.RG16F),z===n.UNSIGNED_BYTE&&(ee=n.RG8),z===n.UNSIGNED_SHORT&&le&&(ee=le.RG16_EXT),z===n.SHORT&&le&&(ee=le.RG16_SNORM_EXT)),y===n.RG_INTEGER&&(z===n.UNSIGNED_BYTE&&(ee=n.RG8UI),z===n.UNSIGNED_SHORT&&(ee=n.RG16UI),z===n.UNSIGNED_INT&&(ee=n.RG32UI),z===n.BYTE&&(ee=n.RG8I),z===n.SHORT&&(ee=n.RG16I),z===n.INT&&(ee=n.RG32I)),y===n.RGB_INTEGER&&(z===n.UNSIGNED_BYTE&&(ee=n.RGB8UI),z===n.UNSIGNED_SHORT&&(ee=n.RGB16UI),z===n.UNSIGNED_INT&&(ee=n.RGB32UI),z===n.BYTE&&(ee=n.RGB8I),z===n.SHORT&&(ee=n.RGB16I),z===n.INT&&(ee=n.RGB32I)),y===n.RGBA_INTEGER&&(z===n.UNSIGNED_BYTE&&(ee=n.RGBA8UI),z===n.UNSIGNED_SHORT&&(ee=n.RGBA16UI),z===n.UNSIGNED_INT&&(ee=n.RGBA32UI),z===n.BYTE&&(ee=n.RGBA8I),z===n.SHORT&&(ee=n.RGBA16I),z===n.INT&&(ee=n.RGBA32I)),y===n.RGB&&(z===n.UNSIGNED_SHORT&&le&&(ee=le.RGB16_EXT),z===n.SHORT&&le&&(ee=le.RGB16_SNORM_EXT),z===n.UNSIGNED_INT_5_9_9_9_REV&&(ee=n.RGB9_E5),z===n.UNSIGNED_INT_10F_11F_11F_REV&&(ee=n.R11F_G11F_B10F)),y===n.RGBA){const ie=oe?Zl:et.getTransfer(Q);z===n.FLOAT&&(ee=n.RGBA32F),z===n.HALF_FLOAT&&(ee=n.RGBA16F),z===n.UNSIGNED_BYTE&&(ee=ie===dt?n.SRGB8_ALPHA8:n.RGBA8),z===n.UNSIGNED_SHORT&&le&&(ee=le.RGBA16_EXT),z===n.SHORT&&le&&(ee=le.RGBA16_SNORM_EXT),z===n.UNSIGNED_SHORT_4_4_4_4&&(ee=n.RGBA4),z===n.UNSIGNED_SHORT_5_5_5_1&&(ee=n.RGB5_A1)}return(ee===n.R16F||ee===n.R32F||ee===n.RG16F||ee===n.RG32F||ee===n.RGBA16F||ee===n.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function T(P,y){let z;return P?y===null||y===wi||y===ro?z=n.DEPTH24_STENCIL8:y===vi?z=n.DEPTH32F_STENCIL8:y===io&&(z=n.DEPTH24_STENCIL8,Fe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===wi||y===ro?z=n.DEPTH_COMPONENT24:y===vi?z=n.DEPTH_COMPONENT32F:y===io&&(z=n.DEPTH_COMPONENT16),z}function b(P,y){return f(P)===!0||P.isFramebufferTexture&&P.minFilter!==Zt&&P.minFilter!==Qt?Math.log2(Math.max(y.width,y.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?y.mipmaps.length:1}function C(P){const y=P.target;y.removeEventListener("dispose",C),A(y),y.isVideoTexture&&h.delete(y),y.isHTMLTexture&&u.delete(y)}function _(P){const y=P.target;y.removeEventListener("dispose",_),I(y)}function A(P){const y=i.get(P);if(y.__webglInit===void 0)return;const z=P.source,X=p.get(z);if(X){const Q=X[y.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&L(P),Object.keys(X).length===0&&p.delete(z)}i.remove(P)}function L(P){const y=i.get(P);n.deleteTexture(y.__webglTexture);const z=P.source,X=p.get(z);delete X[y.__cacheKey],a.memory.textures--}function I(P){const y=i.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),i.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(y.__webglFramebuffer[X]))for(let Q=0;Q<y.__webglFramebuffer[X].length;Q++)n.deleteFramebuffer(y.__webglFramebuffer[X][Q]);else n.deleteFramebuffer(y.__webglFramebuffer[X]);y.__webglDepthbuffer&&n.deleteRenderbuffer(y.__webglDepthbuffer[X])}else{if(Array.isArray(y.__webglFramebuffer))for(let X=0;X<y.__webglFramebuffer.length;X++)n.deleteFramebuffer(y.__webglFramebuffer[X]);else n.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&n.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&n.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let X=0;X<y.__webglColorRenderbuffer.length;X++)y.__webglColorRenderbuffer[X]&&n.deleteRenderbuffer(y.__webglColorRenderbuffer[X]);y.__webglDepthRenderbuffer&&n.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const z=P.textures;for(let X=0,Q=z.length;X<Q;X++){const oe=i.get(z[X]);oe.__webglTexture&&(n.deleteTexture(oe.__webglTexture),a.memory.textures--),i.remove(z[X])}i.remove(P)}let N=0;function k(){N=0}function D(){return N}function V(P){N=P}function q(){const P=N;return P>=r.maxTextures&&Fe("WebGLTextures: Trying to use "+(P+1)+" texture units while this GPU supports only "+r.maxTextures),N+=1,P}function $(P){const y=[];return y.push(P.wrapS),y.push(P.wrapT),y.push(P.wrapR||0),y.push(P.magFilter),y.push(P.minFilter),y.push(P.anisotropy),y.push(P.internalFormat),y.push(P.format),y.push(P.type),y.push(P.generateMipmaps),y.push(P.premultiplyAlpha),y.push(P.flipY),y.push(P.unpackAlignment),y.push(P.colorSpace),y.join()}function H(P,y){const z=i.get(P);if(P.isVideoTexture&&O(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&z.__version!==P.version){const X=P.image;if(X===null)Fe("WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)Fe("WebGLRenderer: Texture marked for update but image is incomplete");else{Te(z,P,y);return}}else P.isExternalTexture&&(z.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,z.__webglTexture,n.TEXTURE0+y)}function B(P,y){const z=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&z.__version!==P.version){Te(z,P,y);return}else P.isExternalTexture&&(z.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,z.__webglTexture,n.TEXTURE0+y)}function j(P,y){const z=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&z.__version!==P.version){Te(z,P,y);return}t.bindTexture(n.TEXTURE_3D,z.__webglTexture,n.TEXTURE0+y)}function J(P,y){const z=i.get(P);if(P.isCubeDepthTexture!==!0&&P.version>0&&z.__version!==P.version){Be(z,P,y);return}t.bindTexture(n.TEXTURE_CUBE_MAP,z.__webglTexture,n.TEXTURE0+y)}const _e={[Fd]:n.REPEAT,[Oi]:n.CLAMP_TO_EDGE,[Od]:n.MIRRORED_REPEAT},Ae={[Zt]:n.NEAREST,[BS]:n.NEAREST_MIPMAP_NEAREST,[Uo]:n.NEAREST_MIPMAP_LINEAR,[Qt]:n.LINEAR,[nu]:n.LINEAR_MIPMAP_NEAREST,[Or]:n.LINEAR_MIPMAP_LINEAR},tt={[GS]:n.NEVER,[YS]:n.ALWAYS,[WS]:n.LESS,[Mf]:n.LEQUAL,[jS]:n.EQUAL,[wf]:n.GEQUAL,[XS]:n.GREATER,[$S]:n.NOTEQUAL};function je(P,y){if(y.type===vi&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===Qt||y.magFilter===nu||y.magFilter===Uo||y.magFilter===Or||y.minFilter===Qt||y.minFilter===nu||y.minFilter===Uo||y.minFilter===Or)&&Fe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(P,n.TEXTURE_WRAP_S,_e[y.wrapS]),n.texParameteri(P,n.TEXTURE_WRAP_T,_e[y.wrapT]),(P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY)&&n.texParameteri(P,n.TEXTURE_WRAP_R,_e[y.wrapR]),n.texParameteri(P,n.TEXTURE_MAG_FILTER,Ae[y.magFilter]),n.texParameteri(P,n.TEXTURE_MIN_FILTER,Ae[y.minFilter]),y.compareFunction&&(n.texParameteri(P,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(P,n.TEXTURE_COMPARE_FUNC,tt[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===Zt||y.minFilter!==Uo&&y.minFilter!==Or||y.type===vi&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||i.get(y).__currentAnisotropy){const z=e.get("EXT_texture_filter_anisotropic");n.texParameterf(P,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,r.getMaxAnisotropy())),i.get(y).__currentAnisotropy=y.anisotropy}}}function We(P,y){let z=!1;P.__webglInit===void 0&&(P.__webglInit=!0,y.addEventListener("dispose",C));const X=y.source;let Q=p.get(X);Q===void 0&&(Q={},p.set(X,Q));const oe=$(y);if(oe!==P.__cacheKey){Q[oe]===void 0&&(Q[oe]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,z=!0),Q[oe].usedTimes++;const le=Q[P.__cacheKey];le!==void 0&&(Q[P.__cacheKey].usedTimes--,le.usedTimes===0&&L(y)),P.__cacheKey=oe,P.__webglTexture=Q[oe].texture}return z}function K(P,y,z){return Math.floor(Math.floor(P/z)/y)}function re(P,y,z,X){const oe=P.updateRanges;if(oe.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,y.width,y.height,z,X,y.data);else{oe.sort((Ne,fe)=>Ne.start-fe.start);let le=0;for(let Ne=1;Ne<oe.length;Ne++){const fe=oe[le],ue=oe[Ne],Ie=fe.start+fe.count,Ue=K(ue.start,y.width,4),Ve=K(fe.start,y.width,4);ue.start<=Ie+1&&Ue===Ve&&K(ue.start+ue.count-1,y.width,4)===Ue?fe.count=Math.max(fe.count,ue.start+ue.count-fe.start):(++le,oe[le]=ue)}oe.length=le+1;const ee=t.getParameter(n.UNPACK_ROW_LENGTH),ie=t.getParameter(n.UNPACK_SKIP_PIXELS),ce=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,y.width);for(let Ne=0,fe=oe.length;Ne<fe;Ne++){const ue=oe[Ne],Ie=Math.floor(ue.start/4),Ue=Math.ceil(ue.count/4),Ve=Ie%y.width,F=Math.floor(Ie/y.width),de=Ue,te=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,Ve),t.pixelStorei(n.UNPACK_SKIP_ROWS,F),t.texSubImage2D(n.TEXTURE_2D,0,Ve,F,de,te,z,X,y.data)}P.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,ee),t.pixelStorei(n.UNPACK_SKIP_PIXELS,ie),t.pixelStorei(n.UNPACK_SKIP_ROWS,ce)}}function Te(P,y,z){let X=n.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(X=n.TEXTURE_2D_ARRAY),y.isData3DTexture&&(X=n.TEXTURE_3D);const Q=We(P,y),oe=y.source;t.bindTexture(X,P.__webglTexture,n.TEXTURE0+z);const le=i.get(oe);if(oe.version!==le.__version||Q===!0){if(t.activeTexture(n.TEXTURE0+z),(typeof ImageBitmap<"u"&&y.image instanceof ImageBitmap)===!1){const te=et.getPrimaries(et.workingColorSpace),he=y.colorSpace===or?null:et.getPrimaries(y.colorSpace),ye=y.colorSpace===or||te===he?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,y.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ye)}t.pixelStorei(n.UNPACK_ALIGNMENT,y.unpackAlignment);let ie=x(y.image,!1,r.maxTextureSize);ie=tn(y,ie);const ce=s.convert(y.format,y.colorSpace),Ne=s.convert(y.type);let fe=S(y.internalFormat,ce,Ne,y.normalized,y.colorSpace,y.isVideoTexture);je(X,y);let ue;const Ie=y.mipmaps,Ue=y.isVideoTexture!==!0,Ve=le.__version===void 0||Q===!0,F=oe.dataReady,de=b(y,ie);if(y.isDepthTexture)fe=T(y.format===kr,y.type),Ve&&(Ue?t.texStorage2D(n.TEXTURE_2D,1,fe,ie.width,ie.height):t.texImage2D(n.TEXTURE_2D,0,fe,ie.width,ie.height,0,ce,Ne,null));else if(y.isDataTexture)if(Ie.length>0){Ue&&Ve&&t.texStorage2D(n.TEXTURE_2D,de,fe,Ie[0].width,Ie[0].height);for(let te=0,he=Ie.length;te<he;te++)ue=Ie[te],Ue?F&&t.texSubImage2D(n.TEXTURE_2D,te,0,0,ue.width,ue.height,ce,Ne,ue.data):t.texImage2D(n.TEXTURE_2D,te,fe,ue.width,ue.height,0,ce,Ne,ue.data);y.generateMipmaps=!1}else Ue?(Ve&&t.texStorage2D(n.TEXTURE_2D,de,fe,ie.width,ie.height),F&&re(y,ie,ce,Ne)):t.texImage2D(n.TEXTURE_2D,0,fe,ie.width,ie.height,0,ce,Ne,ie.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){Ue&&Ve&&t.texStorage3D(n.TEXTURE_2D_ARRAY,de,fe,Ie[0].width,Ie[0].height,ie.depth);for(let te=0,he=Ie.length;te<he;te++)if(ue=Ie[te],y.format!==ri)if(ce!==null)if(Ue){if(F)if(y.layerUpdates.size>0){const ye=Gm(ue.width,ue.height,y.format,y.type);for(const se of y.layerUpdates){const De=ue.data.subarray(se*ye/ue.data.BYTES_PER_ELEMENT,(se+1)*ye/ue.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,te,0,0,se,ue.width,ue.height,1,ce,De)}}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,te,0,0,0,ue.width,ue.height,ie.depth,ce,ue.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,te,fe,ue.width,ue.height,ie.depth,0,ue.data,0,0);else Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ue?F&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,te,0,0,0,ue.width,ue.height,ie.depth,ce,Ne,ue.data):t.texImage3D(n.TEXTURE_2D_ARRAY,te,fe,ue.width,ue.height,ie.depth,0,ce,Ne,ue.data);y.layerUpdates.size>0&&y.clearLayerUpdates()}else{Ue&&Ve&&t.texStorage2D(n.TEXTURE_2D,de,fe,Ie[0].width,Ie[0].height);for(let te=0,he=Ie.length;te<he;te++)ue=Ie[te],y.format!==ri?ce!==null?Ue?F&&t.compressedTexSubImage2D(n.TEXTURE_2D,te,0,0,ue.width,ue.height,ce,ue.data):t.compressedTexImage2D(n.TEXTURE_2D,te,fe,ue.width,ue.height,0,ue.data):Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ue?F&&t.texSubImage2D(n.TEXTURE_2D,te,0,0,ue.width,ue.height,ce,Ne,ue.data):t.texImage2D(n.TEXTURE_2D,te,fe,ue.width,ue.height,0,ce,Ne,ue.data)}else if(y.isDataArrayTexture)if(Ue){if(Ve&&t.texStorage3D(n.TEXTURE_2D_ARRAY,de,fe,ie.width,ie.height,ie.depth),F)if(y.layerUpdates.size>0){const te=Gm(ie.width,ie.height,y.format,y.type);for(const he of y.layerUpdates){const ye=ie.data.subarray(he*te/ie.data.BYTES_PER_ELEMENT,(he+1)*te/ie.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,he,ie.width,ie.height,1,ce,Ne,ye)}y.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ie.width,ie.height,ie.depth,ce,Ne,ie.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,fe,ie.width,ie.height,ie.depth,0,ce,Ne,ie.data);else if(y.isData3DTexture)Ue?(Ve&&t.texStorage3D(n.TEXTURE_3D,de,fe,ie.width,ie.height,ie.depth),F&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ie.width,ie.height,ie.depth,ce,Ne,ie.data)):t.texImage3D(n.TEXTURE_3D,0,fe,ie.width,ie.height,ie.depth,0,ce,Ne,ie.data);else if(y.isFramebufferTexture){if(Ve)if(Ue)t.texStorage2D(n.TEXTURE_2D,de,fe,ie.width,ie.height);else{let te=ie.width,he=ie.height;for(let ye=0;ye<de;ye++)t.texImage2D(n.TEXTURE_2D,ye,fe,te,he,0,ce,Ne,null),te>>=1,he>>=1}}else if(y.isHTMLTexture){if("texElementImage2D"in n){const te=n.canvas;if(te.hasAttribute("layoutsubtree")||te.setAttribute("layoutsubtree","true"),ie.parentNode!==te){te.appendChild(ie),u.add(y),te.onpaint=he=>{const ye=he.changedElements;for(const se of u)ye.includes(se.image)&&(se.needsUpdate=!0)},te.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,ie);else{const ye=n.RGBA,se=n.RGBA,De=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,ye,se,De,ie)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(Ie.length>0){if(Ue&&Ve){const te=ut(Ie[0]);t.texStorage2D(n.TEXTURE_2D,de,fe,te.width,te.height)}for(let te=0,he=Ie.length;te<he;te++)ue=Ie[te],Ue?F&&t.texSubImage2D(n.TEXTURE_2D,te,0,0,ce,Ne,ue):t.texImage2D(n.TEXTURE_2D,te,fe,ce,Ne,ue);y.generateMipmaps=!1}else if(Ue){if(Ve){const te=ut(ie);t.texStorage2D(n.TEXTURE_2D,de,fe,te.width,te.height)}F&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ce,Ne,ie)}else t.texImage2D(n.TEXTURE_2D,0,fe,ce,Ne,ie);f(y)&&v(X),le.__version=oe.version,y.onUpdate&&y.onUpdate(y)}P.__version=y.version}function Be(P,y,z){if(y.image.length!==6)return;const X=We(P,y),Q=y.source;t.bindTexture(n.TEXTURE_CUBE_MAP,P.__webglTexture,n.TEXTURE0+z);const oe=i.get(Q);if(Q.version!==oe.__version||X===!0){t.activeTexture(n.TEXTURE0+z);const le=et.getPrimaries(et.workingColorSpace),ee=y.colorSpace===or?null:et.getPrimaries(y.colorSpace),ie=y.colorSpace===or||le===ee?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,y.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,y.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ie);const ce=y.isCompressedTexture||y.image[0].isCompressedTexture,Ne=y.image[0]&&y.image[0].isDataTexture,fe=[];for(let se=0;se<6;se++)!ce&&!Ne?fe[se]=x(y.image[se],!0,r.maxCubemapSize):fe[se]=Ne?y.image[se].image:y.image[se],fe[se]=tn(y,fe[se]);const ue=fe[0],Ie=s.convert(y.format,y.colorSpace),Ue=s.convert(y.type),Ve=S(y.internalFormat,Ie,Ue,y.normalized,y.colorSpace),F=y.isVideoTexture!==!0,de=oe.__version===void 0||X===!0,te=Q.dataReady;let he=b(y,ue);je(n.TEXTURE_CUBE_MAP,y);let ye;if(ce){F&&de&&t.texStorage2D(n.TEXTURE_CUBE_MAP,he,Ve,ue.width,ue.height);for(let se=0;se<6;se++){ye=fe[se].mipmaps;for(let De=0;De<ye.length;De++){const Re=ye[De];y.format!==ri?Ie!==null?F?te&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,De,0,0,Re.width,Re.height,Ie,Re.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,De,Ve,Re.width,Re.height,0,Re.data):Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,De,0,0,Re.width,Re.height,Ie,Ue,Re.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,De,Ve,Re.width,Re.height,0,Ie,Ue,Re.data)}}}else{if(ye=y.mipmaps,F&&de){ye.length>0&&he++;const se=ut(fe[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,he,Ve,se.width,se.height)}for(let se=0;se<6;se++)if(Ne){F?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,fe[se].width,fe[se].height,Ie,Ue,fe[se].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,Ve,fe[se].width,fe[se].height,0,Ie,Ue,fe[se].data);for(let De=0;De<ye.length;De++){const xt=ye[De].image[se].image;F?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,De+1,0,0,xt.width,xt.height,Ie,Ue,xt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,De+1,Ve,xt.width,xt.height,0,Ie,Ue,xt.data)}}else{F?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,Ie,Ue,fe[se]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,Ve,Ie,Ue,fe[se]);for(let De=0;De<ye.length;De++){const Re=ye[De];F?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,De+1,0,0,Ie,Ue,Re.image[se]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+se,De+1,Ve,Ie,Ue,Re.image[se])}}}f(y)&&v(n.TEXTURE_CUBE_MAP),oe.__version=Q.version,y.onUpdate&&y.onUpdate(y)}P.__version=y.version}function Me(P,y,z,X,Q,oe){const le=s.convert(z.format,z.colorSpace),ee=s.convert(z.type),ie=S(z.internalFormat,le,ee,z.normalized,z.colorSpace),ce=i.get(y),Ne=i.get(z);if(Ne.__renderTarget=y,!ce.__hasExternalTextures){const fe=Math.max(1,y.width>>oe),ue=Math.max(1,y.height>>oe);Q===n.TEXTURE_3D||Q===n.TEXTURE_2D_ARRAY?t.texImage3D(Q,oe,ie,fe,ue,y.depth,0,le,ee,null):t.texImage2D(Q,oe,ie,fe,ue,0,le,ee,null)}t.bindFramebuffer(n.FRAMEBUFFER,P),Ut(y)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,X,Q,Ne.__webglTexture,0,bt(y)):(Q===n.TEXTURE_2D||Q>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,X,Q,Ne.__webglTexture,oe),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Xe(P,y,z){if(n.bindRenderbuffer(n.RENDERBUFFER,P),y.depthBuffer){const X=y.depthTexture,Q=X&&X.isDepthTexture?X.type:null,oe=T(y.stencilBuffer,Q),le=y.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;Ut(y)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,bt(y),oe,y.width,y.height):z?n.renderbufferStorageMultisample(n.RENDERBUFFER,bt(y),oe,y.width,y.height):n.renderbufferStorage(n.RENDERBUFFER,oe,y.width,y.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,le,n.RENDERBUFFER,P)}else{const X=y.textures;for(let Q=0;Q<X.length;Q++){const oe=X[Q],le=s.convert(oe.format,oe.colorSpace),ee=s.convert(oe.type),ie=S(oe.internalFormat,le,ee,oe.normalized,oe.colorSpace);Ut(y)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,bt(y),ie,y.width,y.height):z?n.renderbufferStorageMultisample(n.RENDERBUFFER,bt(y),ie,y.width,y.height):n.renderbufferStorage(n.RENDERBUFFER,ie,y.width,y.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Bt(P,y,z){const X=y.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,P),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const Q=i.get(y.depthTexture);if(Q.__renderTarget=y,(!Q.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),X){if(Q.__webglInit===void 0&&(Q.__webglInit=!0,y.depthTexture.addEventListener("dispose",C)),Q.__webglTexture===void 0){Q.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,Q.__webglTexture),je(n.TEXTURE_CUBE_MAP,y.depthTexture);const ce=s.convert(y.depthTexture.format),Ne=s.convert(y.depthTexture.type);let fe;y.depthTexture.format===Xi?fe=n.DEPTH_COMPONENT24:y.depthTexture.format===kr&&(fe=n.DEPTH24_STENCIL8);for(let ue=0;ue<6;ue++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,fe,y.width,y.height,0,ce,Ne,null)}}else H(y.depthTexture,0);const oe=Q.__webglTexture,le=bt(y),ee=X?n.TEXTURE_CUBE_MAP_POSITIVE_X+z:n.TEXTURE_2D,ie=y.depthTexture.format===kr?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(y.depthTexture.format===Xi)Ut(y)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ie,ee,oe,0,le):n.framebufferTexture2D(n.FRAMEBUFFER,ie,ee,oe,0);else if(y.depthTexture.format===kr)Ut(y)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ie,ee,oe,0,le):n.framebufferTexture2D(n.FRAMEBUFFER,ie,ee,oe,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Ye(P){const y=i.get(P),z=P.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==P.depthTexture){const X=P.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),X){const Q=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,X.removeEventListener("dispose",Q)};X.addEventListener("dispose",Q),y.__depthDisposeCallback=Q}y.__boundDepthTexture=X}if(P.depthTexture&&!y.__autoAllocateDepthBuffer)if(z)for(let X=0;X<6;X++)Bt(y.__webglFramebuffer[X],P,X);else{const X=P.texture.mipmaps;X&&X.length>0?Bt(y.__webglFramebuffer[0],P,0):Bt(y.__webglFramebuffer,P,0)}else if(z){y.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(n.FRAMEBUFFER,y.__webglFramebuffer[X]),y.__webglDepthbuffer[X]===void 0)y.__webglDepthbuffer[X]=n.createRenderbuffer(),Xe(y.__webglDepthbuffer[X],P,!1);else{const Q=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,oe=y.__webglDepthbuffer[X];n.bindRenderbuffer(n.RENDERBUFFER,oe),n.framebufferRenderbuffer(n.FRAMEBUFFER,Q,n.RENDERBUFFER,oe)}}else{const X=P.texture.mipmaps;if(X&&X.length>0?t.bindFramebuffer(n.FRAMEBUFFER,y.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=n.createRenderbuffer(),Xe(y.__webglDepthbuffer,P,!1);else{const Q=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,oe=y.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,oe),n.framebufferRenderbuffer(n.FRAMEBUFFER,Q,n.RENDERBUFFER,oe)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function st(P,y,z){const X=i.get(P);y!==void 0&&Me(X.__webglFramebuffer,P,P.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),z!==void 0&&Ye(P)}function gt(P){const y=P.texture,z=i.get(P),X=i.get(y);P.addEventListener("dispose",_);const Q=P.textures,oe=P.isWebGLCubeRenderTarget===!0,le=Q.length>1;if(le||(X.__webglTexture===void 0&&(X.__webglTexture=n.createTexture()),X.__version=y.version,a.memory.textures++),oe){z.__webglFramebuffer=[];for(let ee=0;ee<6;ee++)if(y.mipmaps&&y.mipmaps.length>0){z.__webglFramebuffer[ee]=[];for(let ie=0;ie<y.mipmaps.length;ie++)z.__webglFramebuffer[ee][ie]=n.createFramebuffer()}else z.__webglFramebuffer[ee]=n.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){z.__webglFramebuffer=[];for(let ee=0;ee<y.mipmaps.length;ee++)z.__webglFramebuffer[ee]=n.createFramebuffer()}else z.__webglFramebuffer=n.createFramebuffer();if(le)for(let ee=0,ie=Q.length;ee<ie;ee++){const ce=i.get(Q[ee]);ce.__webglTexture===void 0&&(ce.__webglTexture=n.createTexture(),a.memory.textures++)}if(P.samples>0&&Ut(P)===!1){z.__webglMultisampledFramebuffer=n.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let ee=0;ee<Q.length;ee++){const ie=Q[ee];z.__webglColorRenderbuffer[ee]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,z.__webglColorRenderbuffer[ee]);const ce=s.convert(ie.format,ie.colorSpace),Ne=s.convert(ie.type),fe=S(ie.internalFormat,ce,Ne,ie.normalized,ie.colorSpace,P.isXRRenderTarget===!0),ue=bt(P);n.renderbufferStorageMultisample(n.RENDERBUFFER,ue,fe,P.width,P.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ee,n.RENDERBUFFER,z.__webglColorRenderbuffer[ee])}n.bindRenderbuffer(n.RENDERBUFFER,null),P.depthBuffer&&(z.__webglDepthRenderbuffer=n.createRenderbuffer(),Xe(z.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(oe){t.bindTexture(n.TEXTURE_CUBE_MAP,X.__webglTexture),je(n.TEXTURE_CUBE_MAP,y);for(let ee=0;ee<6;ee++)if(y.mipmaps&&y.mipmaps.length>0)for(let ie=0;ie<y.mipmaps.length;ie++)Me(z.__webglFramebuffer[ee][ie],P,y,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ie);else Me(z.__webglFramebuffer[ee],P,y,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0);f(y)&&v(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(le){for(let ee=0,ie=Q.length;ee<ie;ee++){const ce=Q[ee],Ne=i.get(ce);let fe=n.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(fe=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(fe,Ne.__webglTexture),je(fe,ce),Me(z.__webglFramebuffer,P,ce,n.COLOR_ATTACHMENT0+ee,fe,0),f(ce)&&v(fe)}t.unbindTexture()}else{let ee=n.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(ee=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ee,X.__webglTexture),je(ee,y),y.mipmaps&&y.mipmaps.length>0)for(let ie=0;ie<y.mipmaps.length;ie++)Me(z.__webglFramebuffer[ie],P,y,n.COLOR_ATTACHMENT0,ee,ie);else Me(z.__webglFramebuffer,P,y,n.COLOR_ATTACHMENT0,ee,0);f(y)&&v(ee),t.unbindTexture()}P.depthBuffer&&Ye(P)}function Je(P){const y=P.textures;for(let z=0,X=y.length;z<X;z++){const Q=y[z];if(f(Q)){const oe=E(P),le=i.get(Q).__webglTexture;t.bindTexture(oe,le),v(oe),t.unbindTexture()}}}const Et=[],Wt=[];function _n(P){if(P.samples>0){if(Ut(P)===!1){const y=P.textures,z=P.width,X=P.height;let Q=n.COLOR_BUFFER_BIT;const oe=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,le=i.get(P),ee=y.length>1;if(ee)for(let ce=0;ce<y.length;ce++)t.bindFramebuffer(n.FRAMEBUFFER,le.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ce,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,le.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ce,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,le.__webglMultisampledFramebuffer);const ie=P.texture.mipmaps;ie&&ie.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,le.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,le.__webglFramebuffer);for(let ce=0;ce<y.length;ce++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(Q|=n.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(Q|=n.STENCIL_BUFFER_BIT)),ee){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,le.__webglColorRenderbuffer[ce]);const Ne=i.get(y[ce]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ne,0)}n.blitFramebuffer(0,0,z,X,0,0,z,X,Q,n.NEAREST),l===!0&&(Et.length=0,Wt.length=0,Et.push(n.COLOR_ATTACHMENT0+ce),P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&(Et.push(oe),Wt.push(oe),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Wt)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Et))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ee)for(let ce=0;ce<y.length;ce++){t.bindFramebuffer(n.FRAMEBUFFER,le.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ce,n.RENDERBUFFER,le.__webglColorRenderbuffer[ce]);const Ne=i.get(y[ce]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,le.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ce,n.TEXTURE_2D,Ne,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,le.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&l){const y=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[y])}}}function bt(P){return Math.min(r.maxSamples,P.samples)}function Ut(P){const y=i.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function O(P){const y=a.render.frame;h.get(P)!==y&&(h.set(P,y),P.update())}function tn(P,y){const z=P.colorSpace,X=P.format,Q=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||z!==Kl&&z!==or&&(et.getTransfer(z)===dt?(X!==ri||Q!==Ln)&&Fe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):nt("WebGLTextures: Unsupported texture color space:",z)),y}function ut(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=q,this.resetTextureUnits=k,this.getTextureUnits=D,this.setTextureUnits=V,this.setTexture2D=H,this.setTexture2DArray=B,this.setTexture3D=j,this.setTextureCube=J,this.rebindTextures=st,this.setupRenderTarget=gt,this.updateRenderTargetMipmap=Je,this.updateMultisampleRenderTarget=_n,this.setupDepthRenderbuffer=Ye,this.setupFrameBufferTexture=Me,this.useMultisampledRTT=Ut,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Vb(n,e){function t(i,r=or){let s;const a=et.getTransfer(r);if(i===Ln)return n.UNSIGNED_BYTE;if(i===xf)return n.UNSIGNED_SHORT_4_4_4_4;if(i===vf)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Bx)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===zx)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Ox)return n.BYTE;if(i===kx)return n.SHORT;if(i===io)return n.UNSIGNED_SHORT;if(i===gf)return n.INT;if(i===wi)return n.UNSIGNED_INT;if(i===vi)return n.FLOAT;if(i===Ei)return n.HALF_FLOAT;if(i===Vx)return n.ALPHA;if(i===Hx)return n.RGB;if(i===ri)return n.RGBA;if(i===Xi)return n.DEPTH_COMPONENT;if(i===kr)return n.DEPTH_STENCIL;if(i===Gx)return n.RED;if(i===_f)return n.RED_INTEGER;if(i===qr)return n.RG;if(i===yf)return n.RG_INTEGER;if(i===Sf)return n.RGBA_INTEGER;if(i===_l||i===yl||i===Sl||i===Ml)if(a===dt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===_l)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===yl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Sl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ml)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===_l)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===yl)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Sl)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ml)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===kd||i===Bd||i===zd||i===Vd)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===kd)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Bd)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===zd)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Vd)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Hd||i===Gd||i===Wd||i===jd||i===Xd||i===Yl||i===$d)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Hd||i===Gd)return a===dt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Wd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===jd)return s.COMPRESSED_R11_EAC;if(i===Xd)return s.COMPRESSED_SIGNED_R11_EAC;if(i===Yl)return s.COMPRESSED_RG11_EAC;if(i===$d)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Yd||i===qd||i===Kd||i===Zd||i===Qd||i===Jd||i===eh||i===th||i===nh||i===ih||i===rh||i===sh||i===ah||i===oh)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Yd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===qd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Kd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Zd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Qd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Jd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===eh)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===th)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===nh)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===ih)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===rh)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===sh)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===ah)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===oh)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===lh||i===ch||i===uh)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===lh)return a===dt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ch)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===uh)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===dh||i===hh||i===ql||i===fh)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===dh)return s.COMPRESSED_RED_RGTC1_EXT;if(i===hh)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ql)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===fh)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ro?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const Hb=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Gb=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Wb{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new ev(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Ti({vertexShader:Hb,fragmentShader:Gb,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ne(new ct(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class jb extends Qr{constructor(e,t){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,p=null,g=null;const M=typeof XRWebGLBinding<"u",x=new Wb,f={},v=t.getContextAttributes();let E=null,S=null;const T=[],b=[],C=new ke;let _=null,A=null;const L=new Hn;L.viewport=new At;const I=new Hn;I.viewport=new At;const N=[L,I],k=new JM;let D=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let re=T[K];return re===void 0&&(re=new cu,T[K]=re),re.getTargetRaySpace()},this.getControllerGrip=function(K){let re=T[K];return re===void 0&&(re=new cu,T[K]=re),re.getGripSpace()},this.getHand=function(K){let re=T[K];return re===void 0&&(re=new cu,T[K]=re),re.getHandSpace()};function q(K){const re=b.indexOf(K.inputSource);if(re===-1)return;const Te=T[re];Te!==void 0&&(Te.update(K.inputSource,K.frame,c||a),Te.dispatchEvent({type:K.type,data:K.inputSource}))}function $(){r.removeEventListener("select",q),r.removeEventListener("selectstart",q),r.removeEventListener("selectend",q),r.removeEventListener("squeeze",q),r.removeEventListener("squeezestart",q),r.removeEventListener("squeezeend",q),r.removeEventListener("end",$),r.removeEventListener("inputsourceschange",H);for(let K=0;K<T.length;K++){const re=b[K];re!==null&&(b[K]=null,T[K].disconnect(re))}D=null,V=null,x.reset();for(const K in f)delete f[K];if(e.setRenderTarget(E),p=null,d=null,u=null,r=null,S=null,We.stop(),i.isPresenting=!1,e.setPixelRatio(_),e.setSize(C.width,C.height,!1),A!==null){const K=A.camera;K.fov=A.fov,K.zoom=A.zoom,K.updateProjectionMatrix(),A=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){s=K,i.isPresenting===!0&&Fe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,i.isPresenting===!0&&Fe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u===null&&M&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(K){if(r=K,r!==null){if(E=e.getRenderTarget(),r.addEventListener("select",q),r.addEventListener("selectstart",q),r.addEventListener("selectend",q),r.addEventListener("squeeze",q),r.addEventListener("squeezestart",q),r.addEventListener("squeezeend",q),r.addEventListener("end",$),r.addEventListener("inputsourceschange",H),v.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(C),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let Te=null,Be=null,Me=null;v.depth&&(Me=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Te=v.stencil?kr:Xi,Be=v.stencil?ro:wi);const Xe={colorFormat:t.RGBA8,depthFormat:Me,scaleFactor:s};u=this.getBinding(),d=u.createProjectionLayer(Xe),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),S=new oi(d.textureWidth,d.textureHeight,{format:ri,type:Ln,depthTexture:new oo(d.textureWidth,d.textureHeight,Be,void 0,void 0,void 0,void 0,void 0,void 0,Te),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{const Te={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,t,Te),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new oi(p.framebufferWidth,p.framebufferHeight,{format:ri,type:Ln,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),We.setContext(r),We.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function H(K){for(let re=0;re<K.removed.length;re++){const Te=K.removed[re],Be=b.indexOf(Te);Be>=0&&(b[Be]=null,T[Be].disconnect(Te))}for(let re=0;re<K.added.length;re++){const Te=K.added[re];let Be=b.indexOf(Te);if(Be===-1){for(let Xe=0;Xe<T.length;Xe++)if(Xe>=b.length){b.push(Te),Be=Xe;break}else if(b[Xe]===null){b[Xe]=Te,Be=Xe;break}if(Be===-1)break}const Me=T[Be];Me&&Me.connect(Te)}}const B=new R,j=new R;function J(K,re,Te){B.setFromMatrixPosition(re.matrixWorld),j.setFromMatrixPosition(Te.matrixWorld);const Be=B.distanceTo(j),Me=re.projectionMatrix.elements,Xe=Te.projectionMatrix.elements,Bt=Me[14]/(Me[10]-1),Ye=Me[14]/(Me[10]+1),st=(Me[9]+1)/Me[5],gt=(Me[9]-1)/Me[5],Je=(Me[8]-1)/Me[0],Et=(Xe[8]+1)/Xe[0],Wt=Bt*Je,_n=Bt*Et,bt=Be/(-Je+Et),Ut=bt*-Je;if(re.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(Ut),K.translateZ(bt),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),Me[10]===-1)K.projectionMatrix.copy(re.projectionMatrix),K.projectionMatrixInverse.copy(re.projectionMatrixInverse);else{const O=Bt+bt,tn=Ye+bt,ut=Wt-Ut,P=_n+(Be-Ut),y=st*Ye/tn*O,z=gt*Ye/tn*O;K.projectionMatrix.makePerspective(ut,P,y,z,O,tn),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function _e(K,re){re===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(re.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(r===null)return;let re=K.near,Te=K.far;x.texture!==null&&(x.depthNear>0&&(re=x.depthNear),x.depthFar>0&&(Te=x.depthFar)),k.near=I.near=L.near=re,k.far=I.far=L.far=Te,(D!==k.near||V!==k.far)&&(r.updateRenderState({depthNear:k.near,depthFar:k.far}),D=k.near,V=k.far),k.layers.mask=K.layers.mask|6,L.layers.mask=k.layers.mask&-5,I.layers.mask=k.layers.mask&-3;const Be=K.parent,Me=k.cameras;_e(k,Be);for(let Xe=0;Xe<Me.length;Xe++)_e(Me[Xe],Be);Me.length===2?J(k,L,I):k.projectionMatrix.copy(L.projectionMatrix),A===null&&K.isPerspectiveCamera&&(A={camera:K,fov:K.fov,zoom:K.zoom}),Ae(K,k,Be)};function Ae(K,re,Te){Te===null?K.matrix.copy(re.matrixWorld):(K.matrix.copy(Te.matrixWorld),K.matrix.invert(),K.matrix.multiply(re.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(re.projectionMatrix),K.projectionMatrixInverse.copy(re.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=ao*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(K){l=K,d!==null&&(d.fixedFoveation=K),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=K)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(k)},this.getCameraTexture=function(K){return f[K]};let tt=null;function je(K,re){if(h=re.getViewerPose(c||a),g=re,h!==null){const Te=h.views;p!==null&&(e.setRenderTargetFramebuffer(S,p.framebuffer),e.setRenderTarget(S));let Be=!1;Te.length!==k.cameras.length&&(k.cameras.length=0,Be=!0);for(let Ye=0;Ye<Te.length;Ye++){const st=Te[Ye];let gt=null;if(p!==null)gt=p.getViewport(st);else{const Et=u.getViewSubImage(d,st);gt=Et.viewport,Ye===0&&(e.setRenderTargetTextures(S,Et.colorTexture,Et.depthStencilTexture),e.setRenderTarget(S))}let Je=N[Ye];Je===void 0&&(Je=new Hn,Je.layers.enable(Ye),Je.viewport=new At,N[Ye]=Je),Je.matrix.fromArray(st.transform.matrix),Je.matrix.decompose(Je.position,Je.quaternion,Je.scale),Je.projectionMatrix.fromArray(st.projectionMatrix),Je.projectionMatrixInverse.copy(Je.projectionMatrix).invert(),Je.viewport.set(gt.x,gt.y,gt.width,gt.height),Ye===0&&(k.matrix.copy(Je.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),Be===!0&&k.cameras.push(Je)}const Me=r.enabledFeatures;if(Me&&Me.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&M){u=i.getBinding();const Ye=u.getDepthInformation(Te[0]);Ye&&Ye.isValid&&Ye.texture&&x.init(Ye,r.renderState)}if(Me&&Me.includes("camera-access")&&M){e.state.unbindTexture(),u=i.getBinding();for(let Ye=0;Ye<Te.length;Ye++){const st=Te[Ye].camera;if(st){let gt=f[st];gt||(gt=new ev,f[st]=gt);const Je=u.getCameraImage(st);gt.sourceTexture=Je}}}}for(let Te=0;Te<T.length;Te++){const Be=b[Te],Me=T[Te];Be!==null&&Me!==void 0&&Me.update(Be,re,c||a)}tt&&tt(K,re),re.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:re}),g=null}const We=new sv;We.setAnimationLoop(je),this.setAnimationLoop=function(K){tt=K},this.dispose=function(){}}}const Xb=new wt,hv=new ze;hv.set(-1,0,0,0,1,0,0,0,1);function $b(n,e){function t(x,f){x.matrixAutoUpdate===!0&&x.updateMatrix(),f.value.copy(x.matrix)}function i(x,f){f.color.getRGB(x.fogColor.value,tv(n)),f.isFog?(x.fogNear.value=f.near,x.fogFar.value=f.far):f.isFogExp2&&(x.fogDensity.value=f.density)}function r(x,f,v,E,S){f.isNodeMaterial?f.uniformsNeedUpdate=!1:f.isMeshBasicMaterial?s(x,f):f.isMeshLambertMaterial?(s(x,f),f.envMap&&(x.envMapIntensity.value=f.envMapIntensity)):f.isMeshToonMaterial?(s(x,f),u(x,f)):f.isMeshPhongMaterial?(s(x,f),h(x,f),f.envMap&&(x.envMapIntensity.value=f.envMapIntensity)):f.isMeshStandardMaterial?(s(x,f),d(x,f),f.isMeshPhysicalMaterial&&p(x,f,S)):f.isMeshMatcapMaterial?(s(x,f),g(x,f)):f.isMeshDepthMaterial?s(x,f):f.isMeshDistanceMaterial?(s(x,f),M(x,f)):f.isMeshNormalMaterial?s(x,f):f.isLineBasicMaterial?(a(x,f),f.isLineDashedMaterial&&o(x,f)):f.isPointsMaterial?l(x,f,v,E):f.isSpriteMaterial?c(x,f):f.isShadowMaterial?(x.color.value.copy(f.color),x.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(x,f){x.opacity.value=f.opacity,f.color&&x.diffuse.value.copy(f.color),f.emissive&&x.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(x.map.value=f.map,t(f.map,x.mapTransform)),f.alphaMap&&(x.alphaMap.value=f.alphaMap,t(f.alphaMap,x.alphaMapTransform)),f.bumpMap&&(x.bumpMap.value=f.bumpMap,t(f.bumpMap,x.bumpMapTransform),x.bumpScale.value=f.bumpScale,f.side===bn&&(x.bumpScale.value*=-1)),f.normalMap&&(x.normalMap.value=f.normalMap,t(f.normalMap,x.normalMapTransform),x.normalScale.value.copy(f.normalScale),f.side===bn&&x.normalScale.value.negate()),f.displacementMap&&(x.displacementMap.value=f.displacementMap,t(f.displacementMap,x.displacementMapTransform),x.displacementScale.value=f.displacementScale,x.displacementBias.value=f.displacementBias),f.emissiveMap&&(x.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,x.emissiveMapTransform)),f.specularMap&&(x.specularMap.value=f.specularMap,t(f.specularMap,x.specularMapTransform)),f.alphaTest>0&&(x.alphaTest.value=f.alphaTest);const v=e.get(f),E=v.envMap,S=v.envMapRotation;E&&(x.envMap.value=E,x.envMapRotation.value.setFromMatrix4(Xb.makeRotationFromEuler(S)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&x.envMapRotation.value.premultiply(hv),x.reflectivity.value=f.reflectivity,x.ior.value=f.ior,x.refractionRatio.value=f.refractionRatio),f.lightMap&&(x.lightMap.value=f.lightMap,x.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,x.lightMapTransform)),f.aoMap&&(x.aoMap.value=f.aoMap,x.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,x.aoMapTransform))}function a(x,f){x.diffuse.value.copy(f.color),x.opacity.value=f.opacity,f.map&&(x.map.value=f.map,t(f.map,x.mapTransform))}function o(x,f){x.dashSize.value=f.dashSize,x.totalSize.value=f.dashSize+f.gapSize,x.scale.value=f.scale}function l(x,f,v,E){x.diffuse.value.copy(f.color),x.opacity.value=f.opacity,x.size.value=f.size*v,x.scale.value=E*.5,f.map&&(x.map.value=f.map,t(f.map,x.uvTransform)),f.alphaMap&&(x.alphaMap.value=f.alphaMap,t(f.alphaMap,x.alphaMapTransform)),f.alphaTest>0&&(x.alphaTest.value=f.alphaTest)}function c(x,f){x.diffuse.value.copy(f.color),x.opacity.value=f.opacity,x.rotation.value=f.rotation,f.map&&(x.map.value=f.map,t(f.map,x.mapTransform)),f.alphaMap&&(x.alphaMap.value=f.alphaMap,t(f.alphaMap,x.alphaMapTransform)),f.alphaTest>0&&(x.alphaTest.value=f.alphaTest)}function h(x,f){x.specular.value.copy(f.specular),x.shininess.value=Math.max(f.shininess,1e-4)}function u(x,f){f.gradientMap&&(x.gradientMap.value=f.gradientMap)}function d(x,f){x.metalness.value=f.metalness,f.metalnessMap&&(x.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,x.metalnessMapTransform)),x.roughness.value=f.roughness,f.roughnessMap&&(x.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,x.roughnessMapTransform)),f.envMap&&(x.envMapIntensity.value=f.envMapIntensity)}function p(x,f,v){x.ior.value=f.ior,f.sheen>0&&(x.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),x.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(x.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,x.sheenColorMapTransform)),f.sheenRoughnessMap&&(x.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,x.sheenRoughnessMapTransform))),f.clearcoat>0&&(x.clearcoat.value=f.clearcoat,x.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(x.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,x.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(x.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===bn&&x.clearcoatNormalScale.value.negate())),f.dispersion>0&&(x.dispersion.value=f.dispersion),f.retroreflectivity>0&&(x.retroreflectivity.value=f.retroreflectivity),f.iridescence>0&&(x.iridescence.value=f.iridescence,x.iridescenceIOR.value=f.iridescenceIOR,x.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(x.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,x.iridescenceMapTransform)),f.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),f.transmission>0&&(x.transmission.value=f.transmission,x.transmissionSamplerMap.value=v.texture,x.transmissionSamplerSize.value.set(v.width,v.height),f.transmissionMap&&(x.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,x.transmissionMapTransform)),x.thickness.value=f.thickness,f.thicknessMap&&(x.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=f.attenuationDistance,x.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(x.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(x.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=f.specularIntensity,x.specularColor.value.copy(f.specularColor),f.specularColorMap&&(x.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,x.specularColorMapTransform)),f.specularIntensityMap&&(x.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,x.specularIntensityMapTransform))}function g(x,f){f.matcap&&(x.matcap.value=f.matcap)}function M(x,f){const v=e.get(f).light;x.referencePosition.value.setFromMatrixPosition(v.matrixWorld),x.nearDistance.value=v.shadow.camera.near,x.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function Yb(n,e,t,i){let r={},s={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,T){const b=T.program;i.uniformBlockBinding(S,b)}function c(S,T){let b=r[S.id];b===void 0&&(x(S),b=h(S),r[S.id]=b,S.addEventListener("dispose",v));const C=T.program;i.updateUBOMapping(S,C);const _=e.render.frame;s[S.id]!==_&&(d(S),s[S.id]=_)}function h(S){const T=u();S.__bindingPointIndex=T;const b=n.createBuffer(),C=S.__size,_=S.usage;return n.bindBuffer(n.UNIFORM_BUFFER,b),n.bufferData(n.UNIFORM_BUFFER,C,_),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,T,b),b}function u(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return nt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(S){const T=r[S.id],b=S.uniforms,C=S.__cache;n.bindBuffer(n.UNIFORM_BUFFER,T);for(let _=0,A=b.length;_<A;_++){const L=b[_];if(Array.isArray(L))for(let I=0,N=L.length;I<N;I++)p(L[I],_,I,C);else p(L,_,0,C)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(S,T,b,C){if(M(S,T,b,C)===!0){const _=S.__offset,A=S.value;if(Array.isArray(A)){let L=0;for(let I=0;I<A.length;I++){const N=A[I],k=f(N);g(N,S.__data,L),typeof N!="number"&&typeof N!="boolean"&&!N.isMatrix3&&!ArrayBuffer.isView(N)&&(L+=k.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(A,S.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,_,S.__data)}}function g(S,T,b){typeof S=="number"||typeof S=="boolean"?T[0]=S:S.isMatrix3?(T[0]=S.elements[0],T[1]=S.elements[1],T[2]=S.elements[2],T[3]=0,T[4]=S.elements[3],T[5]=S.elements[4],T[6]=S.elements[5],T[7]=0,T[8]=S.elements[6],T[9]=S.elements[7],T[10]=S.elements[8],T[11]=0):ArrayBuffer.isView(S)?T.set(new S.constructor(S.buffer,S.byteOffset,T.length)):S.toArray(T,b)}function M(S,T,b,C){const _=S.value,A=T+"_"+b;if(C[A]===void 0)return typeof _=="number"||typeof _=="boolean"?C[A]=_:ArrayBuffer.isView(_)?C[A]=_.slice():C[A]=_.clone(),!0;{const L=C[A];if(typeof _=="number"||typeof _=="boolean"){if(L!==_)return C[A]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(L.equals(_)===!1)return L.copy(_),!0}}return!1}function x(S){const T=S.uniforms;let b=0;const C=16;for(let A=0,L=T.length;A<L;A++){const I=Array.isArray(T[A])?T[A]:[T[A]];for(let N=0,k=I.length;N<k;N++){const D=I[N],V=Array.isArray(D.value)?D.value:[D.value];for(let q=0,$=V.length;q<$;q++){const H=V[q],B=f(H),j=b%C,J=j%B.boundary,_e=j+J;b+=J,_e!==0&&C-_e<B.storage&&(b+=C-_e),D.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=b,b+=B.storage}}}const _=b%C;return _>0&&(b+=C-_),S.__size=b,S.__cache={},this}function f(S){const T={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(T.boundary=4,T.storage=4):S.isVector2?(T.boundary=8,T.storage=8):S.isVector3||S.isColor?(T.boundary=16,T.storage=12):S.isVector4?(T.boundary=16,T.storage=16):S.isMatrix3?(T.boundary=48,T.storage=48):S.isMatrix4?(T.boundary=64,T.storage=64):S.isTexture?Fe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(S)?(T.boundary=16,T.storage=S.byteLength):Fe("WebGLRenderer: Unsupported uniform value type.",S),T}function v(S){const T=S.target;T.removeEventListener("dispose",v);const b=a.indexOf(T.__bindingPointIndex);a.splice(b,1),n.deleteBuffer(r[T.id]),delete r[T.id],delete s[T.id]}function E(){for(const S in r)n.deleteBuffer(r[S]);a=[],r={},s={}}return{bind:l,update:c,dispose:E}}const qb=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let fi=null;function Kb(){return fi===null&&(fi=new OM(qb,16,16,qr,Ei),fi.name="DFG_LUT",fi.minFilter=Qt,fi.magFilter=Qt,fi.wrapS=Oi,fi.wrapT=Oi,fi.generateMipmaps=!1,fi.needsUpdate=!0),fi}class Zb{constructor(e={}){const{canvas:t=KS(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:p=Ln}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=a;const M=p,x=new Set([Sf,yf,_f]),f=new Set([Ln,wi,io,ro,xf,vf]),v=new Uint32Array(4),E=new Int32Array(4),S=new R;let T=null,b=null;const C=[],_=[];let A=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Mi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const L=this;let I=!1,N=null,k=null,D=null,V=null;this._outputColorSpace=Bn;let q=0,$=0,H=null,B=-1,j=null;const J=new At,_e=new At;let Ae=null;const tt=new Ke(0);let je=0,We=t.width,K=t.height,re=1,Te=null,Be=null;const Me=new At(0,0,We,K),Xe=new At(0,0,We,K);let Bt=!1;const Ye=new Rf;let st=!1,gt=!1;const Je=new wt,Et=new R,Wt=new At,_n={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let bt=!1;function Ut(){return H===null?re:1}let O=i;function tn(w,U){return t.getContext(w,U)}let ut,P,y,z,X,Q,oe,le,ee,ie,ce,Ne,fe,ue,Ie,Ue,Ve,F,de,te,he,ye,se;try{const w={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${mf}`),t.addEventListener("webglcontextlost",xt,!1),t.addEventListener("webglcontextrestored",ot,!1),t.addEventListener("webglcontextcreationerror",qn,!1),O===null){const U="webgl2";if(O=tn(U,w),O===null)throw tn(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}De()}catch(w){throw t.removeEventListener("webglcontextlost",xt,!1),t.removeEventListener("webglcontextrestored",ot,!1),t.removeEventListener("webglcontextcreationerror",qn,!1),nt("WebGLRenderer: "+w.message),w}function De(){ut=new KE(O),ut.init(),he=new Vb(O,ut),P=new zE(O,ut,e,he),y=new Bb(O,ut),P.reversedDepthBuffer&&d&&y.buffers.depth.setReversed(!0),k=O.createFramebuffer(),D=O.createFramebuffer(),V=O.createFramebuffer(),z=new JE(O),X=new Tb,Q=new zb(O,ut,y,X,P,he,z),oe=new qE(L),le=new t1(O),ye=new kE(O,le),ee=new ZE(O,le,z,ye),ie=new tT(O,ee,le,ye,z),F=new eT(O,P,Q),Ie=new VE(X),ce=new Eb(L,oe,ut,P,ye,Ie),Ne=new $b(L,X),fe=new Cb,ue=new Ib(ut),Ve=new OE(L,oe,y,ie,g,l),Ue=new kb(L,ie,P),se=new Yb(O,z,P,y),de=new BE(O,ut,z),te=new QE(O,ut,z),z.programs=ce.programs,L.capabilities=P,L.extensions=ut,L.properties=X,L.renderLists=fe,L.shadowMap=Ue,L.state=y,L.info=z}M!==Ln&&(A=new iT(M,t.width,t.height,o,r,s));const Re=new jb(L,O);this.xr=Re,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const w=ut.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=ut.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return re},this.setPixelRatio=function(w){w!==void 0&&(re=w,this.setSize(We,K,!1))},this.getSize=function(w){return w.set(We,K)},this.setSize=function(w,U,Y=!0){if(Re.isPresenting){Fe("WebGLRenderer: Can't change size while VR device is presenting.");return}We=w,K=U,t.width=Math.floor(w*re),t.height=Math.floor(U*re),Y===!0&&(t.style.width=w+"px",t.style.height=U+"px"),A!==null&&A.setSize(t.width,t.height),this.setViewport(0,0,w,U)},this.getDrawingBufferSize=function(w){return w.set(We*re,K*re).floor()},this.setDrawingBufferSize=function(w,U,Y){We=w,K=U,re=Y,t.width=Math.floor(w*Y),t.height=Math.floor(U*Y),this.setViewport(0,0,w,U)},this.setEffects=function(w){if(M===Ln){nt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(w){for(let U=0;U<w.length;U++)if(w[U].isOutputPass===!0){Fe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(w||[])},this.getCurrentViewport=function(w){return w.copy(J)},this.getViewport=function(w){return w.copy(Me)},this.setViewport=function(w,U,Y,G){w.isVector4?Me.set(w.x,w.y,w.z,w.w):Me.set(w,U,Y,G),y.viewport(J.copy(Me).multiplyScalar(re).round())},this.getScissor=function(w){return w.copy(Xe)},this.setScissor=function(w,U,Y,G){w.isVector4?Xe.set(w.x,w.y,w.z,w.w):Xe.set(w,U,Y,G),y.scissor(_e.copy(Xe).multiplyScalar(re).round())},this.getScissorTest=function(){return Bt},this.setScissorTest=function(w){y.setScissorTest(Bt=w)},this.setOpaqueSort=function(w){Te=w},this.setTransparentSort=function(w){Be=w},this.getClearColor=function(w){return w.copy(Ve.getClearColor())},this.setClearColor=function(){Ve.setClearColor(...arguments)},this.getClearAlpha=function(){return Ve.getClearAlpha()},this.setClearAlpha=function(){Ve.setClearAlpha(...arguments)},this.clear=function(w=!0,U=!0,Y=!0){let G=0;if(w){let W=!1;if(H!==null){const ve=H.texture.format;W=x.has(ve)}if(W){const ve=H.texture.type,we=f.has(ve),ge=Ve.getClearColor(),be=Ve.getClearAlpha(),Le=ge.r,He=ge.g,qe=ge.b;we?(v[0]=Le,v[1]=He,v[2]=qe,v[3]=be,O.clearBufferuiv(O.COLOR,0,v)):(E[0]=Le,E[1]=He,E[2]=qe,E[3]=be,O.clearBufferiv(O.COLOR,0,E))}else G|=O.COLOR_BUFFER_BIT}U&&(G|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&(G|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&O.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(w){w.setRenderer(this),N=w},this.dispose=function(){t.removeEventListener("webglcontextlost",xt,!1),t.removeEventListener("webglcontextrestored",ot,!1),t.removeEventListener("webglcontextcreationerror",qn,!1),Ve.dispose(),fe.dispose(),ue.dispose(),X.dispose(),oe.dispose(),ie.dispose(),ye.dispose(),se.dispose(),ce.dispose(),Re.dispose(),Re.removeEventListener("sessionstart",zf),Re.removeEventListener("sessionend",Vf),Tr.stop()};function xt(w){w.preventDefault(),Jl("WebGLRenderer: Context Lost."),I=!0}function ot(){Jl("WebGLRenderer: Context Restored."),I=!1;const w=z.autoReset,U=Ue.enabled,Y=Ue.autoUpdate,G=Ue.needsUpdate,W=Ue.type;De(),z.autoReset=w,Ue.enabled=U,Ue.autoUpdate=Y,Ue.needsUpdate=G,Ue.type=W}function qn(w){nt("WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function ci(w){const U=w.target;U.removeEventListener("dispose",ci),Mv(U)}function Mv(w){wv(w),X.remove(w)}function wv(w){const U=X.get(w).programs;U!==void 0&&(U.forEach(function(Y){ce.releaseProgram(Y)}),w.isShaderMaterial&&ce.releaseShaderCache(w))}this.renderBufferDirect=function(w,U,Y,G,W,ve){U===null&&(U=_n);const we=W.isMesh&&W.matrixWorld.determinantAffine()<0,ge=bv(w,U,Y,G,W);y.setMaterial(G,we);let be=Y.index,Le=1;if(G.wireframe===!0){if(be=ee.getWireframeAttribute(Y),be===void 0)return;Le=2}const He=Y.drawRange,qe=Y.attributes.position;let Ce=He.start*Le,lt=(He.start+He.count)*Le;ve!==null&&(Ce=Math.max(Ce,ve.start*Le),lt=Math.min(lt,(ve.start+ve.count)*Le)),be!==null?(Ce=Math.max(Ce,0),lt=Math.min(lt,be.count)):qe!=null&&(Ce=Math.max(Ce,0),lt=Math.min(lt,qe.count));const Ft=lt-Ce;if(Ft<0||Ft===1/0)return;ye.setup(W,G,ge,Y,be);let yt,mt=de;if(be!==null&&(yt=le.get(be),mt=te,mt.setIndex(yt)),W.isMesh)G.wireframe===!0?(y.setLineWidth(G.wireframeLinewidth*Ut()),mt.setMode(O.LINES)):mt.setMode(O.TRIANGLES);else if(W.isLine){let nn=G.linewidth;nn===void 0&&(nn=1),y.setLineWidth(nn*Ut()),W.isLineSegments?mt.setMode(O.LINES):W.isLineLoop?mt.setMode(O.LINE_LOOP):mt.setMode(O.LINE_STRIP)}else W.isPoints?mt.setMode(O.POINTS):W.isSprite&&mt.setMode(O.TRIANGLES);if(W.isBatchedMesh)if(ut.get("WEBGL_multi_draw"))mt.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const nn=W._multiDrawStarts,Se=W._multiDrawCounts,dn=W._multiDrawCount,it=be?le.get(be).bytesPerElement:1,On=X.get(G).currentProgram.getUniforms();for(let ui=0;ui<dn;ui++)On.setValue(O,"_gl_DrawID",ui),mt.render(nn[ui]/it,Se[ui])}else if(W.isInstancedMesh)mt.renderInstances(Ce,Ft,W.count);else if(Y.isInstancedBufferGeometry){const nn=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,Se=Math.min(Y.instanceCount,nn);mt.renderInstances(Ce,Ft,Se)}else mt.render(Ce,Ft)};function Bf(w,U,Y,G){N!==null&&w.isNodeMaterial&&N.setObject(G,w),st===!0&&Ie.setState(w,Y,!1),w.transparent===!0&&w.side===Di&&w.forceSinglePass===!1?(w.side=bn,w.needsUpdate=!0,xo(w,U,G),w.side=$r,w.needsUpdate=!0,xo(w,U,G),w.side=Di):xo(w,U,G)}this.compile=function(w,U,Y=null){Y===null&&(Y=w),N!==null&&N.renderStart(w,U,Y),b=ue.get(Y),b.init(U),_.push(b),Y.traverseVisible(function(W){W.isLight&&W.layers.test(U.layers)&&(b.pushLight(W),W.castShadow&&b.pushShadow(W))}),w!==Y&&w.traverseVisible(function(W){W.isLight&&W.layers.test(U.layers)&&(b.pushLight(W),W.castShadow&&b.pushShadow(W))}),b.setupLights(),N!==null&&N.updateLights(b.state.lightsArray),gt=this.localClippingEnabled,st=Ie.init(this.clippingPlanes,gt),st===!0&&Ie.setGlobalState(this.clippingPlanes,U),N!==null&&Ue.render(b.state.shadowsArray,Y,U);const G=new Set;return w.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const ve=W.material;if(ve)if(Array.isArray(ve))for(let we=0;we<ve.length;we++){const ge=ve[we];Bf(ge,Y,U,W),G.add(ge)}else Bf(ve,Y,U,W),G.add(ve)}),b=_.pop(),N!==null&&N.renderEnd(),G},this.compileAsync=function(w,U,Y=null){const G=this.compile(w,U,Y);return new Promise(W=>{function ve(){if(G.forEach(function(we){const be=X.get(we).currentProgram;(be===void 0||be.isReady())&&G.delete(we)}),G.size===0){W(w);return}setTimeout(ve,10)}ut.get("KHR_parallel_shader_compile")!==null?ve():setTimeout(ve,10)})};let wc=null;function Ev(w){wc&&wc(w)}function zf(){Tr.stop()}function Vf(){Tr.start()}const Tr=new sv;Tr.setAnimationLoop(Ev),typeof self<"u"&&Tr.setContext(self),this.setAnimationLoop=function(w){wc=w,Re.setAnimationLoop(w),w===null?Tr.stop():Tr.start()},Re.addEventListener("sessionstart",zf),Re.addEventListener("sessionend",Vf),this.render=function(w,U){if(U!==void 0&&U.isCamera!==!0){nt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;N!==null&&N.renderStart(w,U);const Y=Re.enabled===!0&&Re.isPresenting===!0,G=A!==null&&(H===null||Y)&&A.begin(L,H);if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),Re.enabled===!0&&Re.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(Re.cameraAutoUpdate===!0&&Re.updateCamera(U),U=Re.getCamera()),w.isScene===!0&&w.onBeforeRender(L,w,U,H),b=ue.get(w,_.length),b.init(U),b.state.textureUnits=Q.getTextureUnits(),_.push(b),Je.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Ye.setFromProjectionMatrix(Je,_i,U.reversedDepth),gt=this.localClippingEnabled,st=Ie.init(this.clippingPlanes,gt),T=fe.get(w,C.length),T.init(),C.push(T),Re.enabled===!0&&Re.isPresenting===!0){const we=L.xr.getDepthSensingMesh();we!==null&&Ec(we,U,-1/0,L.sortObjects)}Ec(w,U,0,L.sortObjects),T.finish(),N!==null&&N.updateLights(b.state.lightsArray),L.sortObjects===!0&&T.sort(Te,Be),bt=Re.enabled===!1||Re.isPresenting===!1||Re.hasDepthSensing()===!1,bt&&Ve.addToRenderList(T,w),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),st===!0&&Ie.beginShadows();const W=b.state.shadowsArray;if(Ue.render(W,w,U),st===!0&&Ie.endShadows(),(G&&A.hasRenderPass())===!1){const we=T.opaque,ge=T.transmissive;if(b.setupLights(),U.isArrayCamera){const be=U.cameras;if(ge.length>0)for(let Le=0,He=be.length;Le<He;Le++){const qe=be[Le];Gf(we,ge,w,qe)}bt&&Ve.render(w);for(let Le=0,He=be.length;Le<He;Le++){const qe=be[Le];Hf(T,w,qe,qe.viewport)}}else ge.length>0&&Gf(we,ge,w,U),bt&&Ve.render(w),Hf(T,w,U)}H!==null&&$===0&&(Q.updateMultisampleRenderTarget(H),Q.updateRenderTargetMipmap(H)),G&&A.end(L),w.isScene===!0&&w.onAfterRender(L,w,U),ye.resetDefaultState(),B=-1,j=null,_.pop(),_.length>0?(b=_[_.length-1],Q.setTextureUnits(b.state.textureUnits),st===!0&&Ie.setGlobalState(L.clippingPlanes,b.state.camera)):b=null,C.pop(),C.length>0?T=C[C.length-1]:T=null,N!==null&&N.renderEnd()};function Ec(w,U,Y,G){if(w.visible===!1)return;if(w.layers.test(U.layers)){if(w.isGroup)Y=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(U);else if(w.isLightProbeGrid)b.pushLightProbeGrid(w);else if(w.isLight)b.pushLight(w),w.castShadow&&b.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||w.intersectsFrustum(Ye)){G&&Wt.setFromMatrixPosition(w.matrixWorld).applyMatrix4(Je);const we=ie.update(w),ge=w.material;ge.visible&&T.push(w,we,ge,Y,Wt.z,null,U)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||w.intersectsFrustum(Ye))){const we=ie.update(w),ge=w.material;if(G&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Wt.copy(w.boundingSphere.center)):(we.boundingSphere===null&&we.computeBoundingSphere(),Wt.copy(we.boundingSphere.center)),Wt.applyMatrix4(w.matrixWorld).applyMatrix4(Je)),Array.isArray(ge)){const be=we.groups;for(let Le=0,He=be.length;Le<He;Le++){const qe=be[Le],Ce=ge[qe.materialIndex];Ce&&Ce.visible&&T.push(w,we,Ce,Y,Wt.z,qe,U)}}else ge.visible&&T.push(w,we,ge,Y,Wt.z,null,U)}}const ve=w.children;for(let we=0,ge=ve.length;we<ge;we++)Ec(ve[we],U,Y,G)}function Hf(w,U,Y,G){const{opaque:W,transmissive:ve,transparent:we}=w;b.setupLightsView(Y),st===!0&&Ie.setGlobalState(L.clippingPlanes,Y),G&&y.viewport(J.copy(G)),W.length>0&&go(W,U,Y),ve.length>0&&go(ve,U,Y),we.length>0&&go(we,U,Y),y.buffers.depth.setTest(!0),y.buffers.depth.setMask(!0),y.buffers.color.setMask(!0),y.setPolygonOffset(!1)}function Gf(w,U,Y,G){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[G.id]===void 0){const Ce=ut.has("EXT_color_buffer_half_float")||ut.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[G.id]=new oi(1,1,{generateMipmaps:!0,type:Ce?Ei:Ln,minFilter:Or,samples:Math.max(4,P.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:et.workingColorSpace})}const ve=b.state.transmissionRenderTarget[G.id],we=G.viewport||J;ve.setSize(we.z*L.transmissionResolutionScale,we.w*L.transmissionResolutionScale);const ge=L.getRenderTarget(),be=L.getActiveCubeFace(),Le=L.getActiveMipmapLevel();L.setRenderTarget(ve),L.getClearColor(tt),je=L.getClearAlpha(),je<1&&L.setClearColor(16777215,.5),L.clear(),bt&&Ve.render(Y);const He=L.toneMapping;L.toneMapping=Mi;const qe=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),b.setupLightsView(G),st===!0&&Ie.setGlobalState(L.clippingPlanes,G),go(w,Y,G),Q.updateMultisampleRenderTarget(ve),Q.updateRenderTargetMipmap(ve),ut.has("WEBGL_multisampled_render_to_texture")===!1){let Ce=!1;for(let lt=0,Ft=U.length;lt<Ft;lt++){const yt=U[lt],{object:mt,geometry:nn,material:Se,group:dn}=yt;if(Se.side===Di&&mt.layers.test(G.layers)){const it=Se.side;Se.side=bn,Se.needsUpdate=!0,Wf(mt,Y,G,nn,Se,dn),Se.side=it,Se.needsUpdate=!0,Ce=!0}}Ce===!0&&(Q.updateMultisampleRenderTarget(ve),Q.updateRenderTargetMipmap(ve))}L.setRenderTarget(ge,be,Le),L.setClearColor(tt,je),qe!==void 0&&(G.viewport=qe),L.toneMapping=He}function go(w,U,Y){const G=U.isScene===!0?U.overrideMaterial:null;for(let W=0,ve=w.length;W<ve;W++){const we=w[W],{object:ge,geometry:be,group:Le}=we;let He=we.material;He.allowOverride===!0&&G!==null&&(He=G),ge.layers.test(Y.layers)&&Wf(ge,U,Y,be,He,Le)}}function Wf(w,U,Y,G,W,ve){N!==null&&W.isNodeMaterial&&N.setObject(w,W),w.onBeforeRender(L,U,Y,G,W,ve),w.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),W.onBeforeRender(L,U,Y,G,w,ve),W.transparent===!0&&W.side===Di&&W.forceSinglePass===!1?(W.side=bn,W.needsUpdate=!0,L.renderBufferDirect(Y,U,G,W,w,ve),W.side=$r,W.needsUpdate=!0,L.renderBufferDirect(Y,U,G,W,w,ve),W.side=Di):L.renderBufferDirect(Y,U,G,W,w,ve),w.onAfterRender(L,U,Y,G,W,ve)}function xo(w,U,Y){U.isScene!==!0&&(U=_n);const G=X.get(w),W=b.state.lights,ve=b.state.shadowsArray,we=W.state.version,ge=ce.getParameters(w,W.state,ve,U,Y,b.state.lightProbeGridArray),be=ce.getProgramCacheKey(ge);let Le=G.programs;G.environment=w.isMeshStandardMaterial||w.isMeshLambertMaterial||w.isMeshPhongMaterial?U.environment:null,G.fog=U.fog;const He=w.isMeshStandardMaterial||w.isMeshLambertMaterial&&!w.envMap||w.isMeshPhongMaterial&&!w.envMap;G.envMap=oe.get(w.envMap||G.environment,He),G.envMapRotation=G.environment!==null&&w.envMap===null?U.environmentRotation:w.envMapRotation,Le===void 0&&(w.addEventListener("dispose",ci),Le=new Map,G.programs=Le);let qe=Le.get(be);if(qe!==void 0){if(G.currentProgram===qe&&G.lightsStateVersion===we)return Xf(w,ge),qe}else ge.uniforms=ce.getUniforms(w),N!==null&&w.isNodeMaterial&&N.build(w,Y,ge),w.onBeforeCompile(ge,L),qe=ce.acquireProgram(ge,be),Le.set(be,qe),G.uniforms=ge.uniforms;const Ce=G.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Ce.clippingPlanes=Ie.uniform),Xf(w,ge),G.needsLights=Av(w),G.lightsStateVersion=we,G.needsLights&&(Ce.ambientLightColor.value=W.state.ambient,Ce.lightProbe.value=W.state.probe,Ce.sunLights.value=W.state.sun,Ce.sunLightShadows.value=W.state.sunShadow,Ce.directionalLights.value=W.state.directional,Ce.directionalLightShadows.value=W.state.directionalShadow,Ce.spotLights.value=W.state.spot,Ce.spotLightShadows.value=W.state.spotShadow,Ce.rectAreaLights.value=W.state.rectArea,Ce.ltc_1.value=W.state.rectAreaLTC1,Ce.ltc_2.value=W.state.rectAreaLTC2,Ce.pointLights.value=W.state.point,Ce.pointLightShadows.value=W.state.pointShadow,Ce.hemisphereLights.value=W.state.hemi,Ce.sunShadowMatrix.value=W.state.sunShadowMatrix,Ce.sunShadowCascade.value=W.state.sunShadowCascade,Ce.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Ce.spotLightMatrix.value=W.state.spotLightMatrix,Ce.spotLightMap.value=W.state.spotLightMap,Ce.pointShadowMatrix.value=W.state.pointShadowMatrix),G.lightProbeGrid=b.state.lightProbeGridArray.length>0,G.currentProgram=qe,G.uniformsList=null,qe}function jf(w){if(w.uniformsList===null){const U=w.currentProgram.getUniforms();w.uniformsList=wl.seqWithValue(U.seq,w.uniforms)}return w.uniformsList}function Xf(w,U){const Y=X.get(w);Y.outputColorSpace=U.outputColorSpace,Y.batching=U.batching,Y.batchingColor=U.batchingColor,Y.instancing=U.instancing,Y.instancingColor=U.instancingColor,Y.instancingMorph=U.instancingMorph,Y.skinning=U.skinning,Y.morphTargets=U.morphTargets,Y.morphNormals=U.morphNormals,Y.morphColors=U.morphColors,Y.morphTargetsCount=U.morphTargetsCount,Y.numClippingPlanes=U.numClippingPlanes,Y.numIntersection=U.numClipIntersection,Y.vertexAlphas=U.vertexAlphas,Y.vertexTangents=U.vertexTangents,Y.toneMapping=U.toneMapping}function Tv(w,U){if(w.length===0)return null;if(w.length===1)return w[0].texture!==null?w[0]:null;S.setFromMatrixPosition(U.matrixWorld);for(let Y=0,G=w.length;Y<G;Y++){const W=w[Y];if(W.texture!==null&&W.boundingBox.containsPoint(S))return W}return null}function bv(w,U,Y,G,W){U.isScene!==!0&&(U=_n),Q.resetTextureUnits();const ve=U.fog,we=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?U.environment:null,ge=H===null?L.outputColorSpace:H.isXRRenderTarget===!0?H.texture.colorSpace:et.workingColorSpace,be=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,Le=oe.get(G.envMap||we,be),He=G.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,qe=!!Y.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Ce=!!Y.morphAttributes.position,lt=!!Y.morphAttributes.normal,Ft=!!Y.morphAttributes.color;let yt=Mi;G.toneMapped&&(H===null||H.isXRRenderTarget===!0)&&(yt=L.toneMapping);const mt=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,nn=mt!==void 0?mt.length:0,Se=X.get(G),dn=b.state.lights;if(st===!0&&(gt===!0||w!==j)){const vt=w===j&&G.id===B;Ie.setState(G,w,vt)}let it=!1;G.version===Se.__version?(Se.needsLights&&Se.lightsStateVersion!==dn.state.version||Se.outputColorSpace!==ge||W.isBatchedMesh&&Se.batching===!1||!W.isBatchedMesh&&Se.batching===!0||W.isBatchedMesh&&Se.batchingColor===!0&&W._colorsTexture===null||W.isBatchedMesh&&Se.batchingColor===!1&&W._colorsTexture!==null||W.isInstancedMesh&&Se.instancing===!1||!W.isInstancedMesh&&Se.instancing===!0||W.isSkinnedMesh&&Se.skinning===!1||!W.isSkinnedMesh&&Se.skinning===!0||W.isInstancedMesh&&Se.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&Se.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&Se.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&Se.instancingMorph===!1&&W.morphTexture!==null||Se.envMap!==Le||G.fog===!0&&Se.fog!==ve||Se.numClippingPlanes!==void 0&&(Se.numClippingPlanes!==Ie.numPlanes||Se.numIntersection!==Ie.numIntersection)||Se.vertexAlphas!==He||Se.vertexTangents!==qe||Se.morphTargets!==Ce||Se.morphNormals!==lt||Se.morphColors!==Ft||Se.toneMapping!==yt||Se.morphTargetsCount!==nn||!!Se.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(it=!0):(it=!0,Se.__version=G.version);let On=Se.currentProgram;it===!0&&(On=xo(G,U,W),N&&G.isNodeMaterial&&N.onUpdateProgram(G,On,Se));let ui=!1,Yi=!1,Jr=!1;const pt=On.getUniforms(),It=Se.uniforms;if(y.useProgram(On.program)&&(ui=!0,Yi=!0,Jr=!0),G.id!==B&&(B=G.id,Yi=!0),Se.needsLights){const vt=Tv(b.state.lightProbeGridArray,W);Se.lightProbeGrid!==vt&&(Se.lightProbeGrid=vt,Yi=!0)}if(ui||j!==w){y.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),pt.setValue(O,"projectionMatrix",w.projectionMatrix),pt.setValue(O,"viewMatrix",w.matrixWorldInverse);const Ki=pt.map.cameraPosition;Ki!==void 0&&Ki.setValue(O,Et.setFromMatrixPosition(w.matrixWorld)),P.logarithmicDepthBuffer&&pt.setValue(O,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&pt.setValue(O,"isOrthographic",w.isOrthographicCamera===!0),j!==w&&(j=w,Yi=!0,Jr=!0)}if(Se.needsLights&&(dn.state.sunShadowMap.length>0&&pt.setValue(O,"sunShadowMap",dn.state.sunShadowMap,Q),dn.state.directionalShadowMap.length>0&&pt.setValue(O,"directionalShadowMap",dn.state.directionalShadowMap,Q),dn.state.spotShadowMap.length>0&&pt.setValue(O,"spotShadowMap",dn.state.spotShadowMap,Q),dn.state.pointShadowMap.length>0&&pt.setValue(O,"pointShadowMap",dn.state.pointShadowMap,Q)),W.isSkinnedMesh){pt.setOptional(O,W,"bindMatrix"),pt.setOptional(O,W,"bindMatrixInverse");const vt=W.skeleton;vt&&(vt.boneTexture===null&&vt.computeBoneTexture(),pt.setValue(O,"boneTexture",vt.boneTexture,Q))}W.isBatchedMesh&&(pt.setOptional(O,W,"batchingTexture"),pt.setValue(O,"batchingTexture",W._matricesTexture,Q),pt.setOptional(O,W,"batchingIdTexture"),pt.setValue(O,"batchingIdTexture",W._indirectTexture,Q),pt.setOptional(O,W,"batchingColorTexture"),W._colorsTexture!==null&&pt.setValue(O,"batchingColorTexture",W._colorsTexture,Q));const qi=Y.morphAttributes;if((qi.position!==void 0||qi.normal!==void 0||qi.color!==void 0)&&F.update(W,Y,On),(Yi||Se.receiveShadow!==W.receiveShadow)&&(Se.receiveShadow=W.receiveShadow,pt.setValue(O,"receiveShadow",W.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&U.environment!==null&&(It.envMapIntensity.value=U.environmentIntensity),It.dfgLUT!==void 0&&(It.dfgLUT.value=Kb()),Yi){if(pt.setValue(O,"toneMappingExposure",L.toneMappingExposure),Se.needsLights&&Cv(It,Jr),ve&&G.fog===!0&&Ne.refreshFogUniforms(It,ve),Ne.refreshMaterialUniforms(It,G,re,K,b.state.transmissionRenderTarget[w.id]),Se.needsLights&&Se.lightProbeGrid){const vt=Se.lightProbeGrid;It.probesSH.value=vt.texture,It.probesMin.value.copy(vt.boundingBox.min),It.probesMax.value.copy(vt.boundingBox.max),It.probesResolution.value.copy(vt.resolution)}wl.upload(O,jf(Se),It,Q)}if(G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(wl.upload(O,jf(Se),It,Q),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&pt.setValue(O,"center",W.center),pt.setValue(O,"modelViewMatrix",W.modelViewMatrix),pt.setValue(O,"normalMatrix",W.normalMatrix),pt.setValue(O,"modelMatrix",W.matrixWorld),G.uniformsGroups!==void 0){const vt=G.uniformsGroups;for(let Ki=0,es=vt.length;Ki<es;Ki++){const Yf=vt[Ki];se.update(Yf,On),se.bind(Yf,On)}}return On}function Cv(w,U){w.ambientLightColor.needsUpdate=U,w.lightProbe.needsUpdate=U,w.sunLights.needsUpdate=U,w.sunLightShadows.needsUpdate=U,w.directionalLights.needsUpdate=U,w.directionalLightShadows.needsUpdate=U,w.pointLights.needsUpdate=U,w.pointLightShadows.needsUpdate=U,w.spotLights.needsUpdate=U,w.spotLightShadows.needsUpdate=U,w.rectAreaLights.needsUpdate=U,w.hemisphereLights.needsUpdate=U}function Av(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return q},this.getActiveMipmapLevel=function(){return $},this.getRenderTarget=function(){return H},this.setRenderTargetTextures=function(w,U,Y){const G=X.get(w);G.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),X.get(w.texture).__webglTexture=U,X.get(w.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:Y,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,U){const Y=X.get(w);Y.__webglFramebuffer=U,Y.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(w,U=0,Y=0){H=w,q=U,$=Y;let G=null,W=!1,ve=!1;if(w){const ge=X.get(w);if(ge.__useDefaultFramebuffer!==void 0){y.bindFramebuffer(O.FRAMEBUFFER,ge.__webglFramebuffer),J.copy(w.viewport),_e.copy(w.scissor),Ae=w.scissorTest,y.viewport(J),y.scissor(_e),y.setScissorTest(Ae),B=-1;return}else if(ge.__webglFramebuffer===void 0)Q.setupRenderTarget(w);else if(ge.__hasExternalTextures)Q.rebindTextures(w,X.get(w.texture).__webglTexture,X.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const He=w.depthTexture;if(ge.__boundDepthTexture!==He){if(He!==null&&X.has(He)&&(w.width!==He.image.width||w.height!==He.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Q.setupDepthRenderbuffer(w)}}const be=w.texture;(be.isData3DTexture||be.isDataArrayTexture||be.isCompressedArrayTexture)&&(ve=!0);const Le=X.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Le[U])?G=Le[U][Y]:G=Le[U],W=!0):w.samples>0&&Q.useMultisampledRTT(w)===!1?G=X.get(w).__webglMultisampledFramebuffer:Array.isArray(Le)?G=Le[Y]:G=Le,J.copy(w.viewport),_e.copy(w.scissor),Ae=w.scissorTest}else J.copy(Me).multiplyScalar(re).floor(),_e.copy(Xe).multiplyScalar(re).floor(),Ae=Bt;if(Y!==0&&(G=k),y.bindFramebuffer(O.FRAMEBUFFER,G)&&y.drawBuffers(w,G),y.viewport(J),y.scissor(_e),y.setScissorTest(Ae),W){const ge=X.get(w.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+U,ge.__webglTexture,Y)}else if(ve){const ge=U;for(let be=0;be<w.textures.length;be++){const Le=X.get(w.textures[be]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+be,Le.__webglTexture,Y,ge)}}else if(w!==null&&Y!==0){const ge=X.get(w.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,ge.__webglTexture,Y)}B=-1};function $f(w){const U=X.get(w);return(U.__readFormat!==w.format||U.__readType!==w.type)&&(U.__readFormat=w.format,U.__readType=w.type,U.__formatReadable=P.textureFormatReadable(w.format),U.__typeReadable=P.textureTypeReadable(w.type)),U}this.readRenderTargetPixels=function(w,U,Y,G,W,ve,we,ge=0){if(!(w&&w.isWebGLRenderTarget)){nt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let be=X.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&we!==void 0&&(be=be[we]),be){y.bindFramebuffer(O.FRAMEBUFFER,be);try{const Le=w.textures[ge],He=Le.format,qe=Le.type;w.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+ge);const Ce=$f(Le);if(Ce.__formatReadable===!1){nt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ce.__typeReadable===!1){nt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=w.width-G&&Y>=0&&Y<=w.height-W&&O.readPixels(U,Y,G,W,he.convert(He),he.convert(qe),ve)}finally{const Le=H!==null?X.get(H).__webglFramebuffer:null;y.bindFramebuffer(O.FRAMEBUFFER,Le)}}},this.readRenderTargetPixelsAsync=async function(w,U,Y,G,W,ve,we,ge=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let be=X.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&we!==void 0&&(be=be[we]),be)if(U>=0&&U<=w.width-G&&Y>=0&&Y<=w.height-W){y.bindFramebuffer(O.FRAMEBUFFER,be);const Le=w.textures[ge],He=Le.format,qe=Le.type;w.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+ge);const Ce=$f(Le);if(Ce.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ce.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const lt=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,lt),O.bufferData(O.PIXEL_PACK_BUFFER,ve.byteLength,O.STREAM_READ),O.readPixels(U,Y,G,W,he.convert(He),he.convert(qe),0),O.bindBuffer(O.PIXEL_PACK_BUFFER,null);const Ft=H!==null?X.get(H).__webglFramebuffer:null;y.bindFramebuffer(O.FRAMEBUFFER,Ft);const yt=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await ZS(O,yt,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,lt),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,ve),O.bindBuffer(O.PIXEL_PACK_BUFFER,null),O.deleteBuffer(lt),O.deleteSync(yt),ve}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,U=null,Y=0){const G=Math.pow(2,-Y),W=Math.floor(w.image.width*G),ve=Math.floor(w.image.height*G),we=U!==null?U.x:0,ge=U!==null?U.y:0;Q.setTexture2D(w,0),O.copyTexSubImage2D(O.TEXTURE_2D,Y,0,0,we,ge,W,ve),y.unbindTexture()},this.copyTextureToTexture=function(w,U,Y=null,G=null,W=0,ve=0){let we,ge,be,Le,He,qe,Ce,lt,Ft;const yt=w.isCompressedTexture?w.mipmaps[ve]:w.image;if(Y!==null)we=Y.max.x-Y.min.x,ge=Y.max.y-Y.min.y,be=Y.isBox3?Y.max.z-Y.min.z:1,Le=Y.min.x,He=Y.min.y,qe=Y.isBox3?Y.min.z:0;else{const It=Math.pow(2,-W);we=Math.floor(yt.width*It),ge=Math.floor(yt.height*It),w.isDataArrayTexture?be=yt.depth:w.isData3DTexture?be=Math.floor(yt.depth*It):be=1,Le=0,He=0,qe=0}G!==null?(Ce=G.x,lt=G.y,Ft=G.z):(Ce=0,lt=0,Ft=0);const mt=he.convert(U.format),nn=he.convert(U.type);let Se;U.isData3DTexture?(Q.setTexture3D(U,0),Se=O.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(Q.setTexture2DArray(U,0),Se=O.TEXTURE_2D_ARRAY):(Q.setTexture2D(U,0),Se=O.TEXTURE_2D),y.activeTexture(O.TEXTURE0),y.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,U.flipY),y.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),y.pixelStorei(O.UNPACK_ALIGNMENT,U.unpackAlignment);const dn=y.getParameter(O.UNPACK_ROW_LENGTH),it=y.getParameter(O.UNPACK_IMAGE_HEIGHT),On=y.getParameter(O.UNPACK_SKIP_PIXELS),ui=y.getParameter(O.UNPACK_SKIP_ROWS),Yi=y.getParameter(O.UNPACK_SKIP_IMAGES);y.pixelStorei(O.UNPACK_ROW_LENGTH,yt.width),y.pixelStorei(O.UNPACK_IMAGE_HEIGHT,yt.height),y.pixelStorei(O.UNPACK_SKIP_PIXELS,Le),y.pixelStorei(O.UNPACK_SKIP_ROWS,He),y.pixelStorei(O.UNPACK_SKIP_IMAGES,qe);const Jr=w.isDataArrayTexture||w.isData3DTexture,pt=U.isDataArrayTexture||U.isData3DTexture;if(w.isDepthTexture){const It=X.get(w),qi=X.get(U),vt=X.get(It.__renderTarget),Ki=X.get(qi.__renderTarget);y.bindFramebuffer(O.READ_FRAMEBUFFER,vt.__webglFramebuffer),y.bindFramebuffer(O.DRAW_FRAMEBUFFER,Ki.__webglFramebuffer);for(let es=0;es<be;es++)Jr&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,X.get(w).__webglTexture,W,qe+es),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,X.get(U).__webglTexture,ve,Ft+es)),O.blitFramebuffer(Le,He,we,ge,Ce,lt,we,ge,O.DEPTH_BUFFER_BIT,O.NEAREST);y.bindFramebuffer(O.READ_FRAMEBUFFER,null),y.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(W!==0||w.isRenderTargetTexture||X.has(w)){const It=X.get(w),qi=X.get(U);y.bindFramebuffer(O.READ_FRAMEBUFFER,D),y.bindFramebuffer(O.DRAW_FRAMEBUFFER,V);for(let vt=0;vt<be;vt++)Jr?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,It.__webglTexture,W,qe+vt):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,It.__webglTexture,W),pt?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,qi.__webglTexture,ve,Ft+vt):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,qi.__webglTexture,ve),W!==0?O.blitFramebuffer(Le,He,we,ge,Ce,lt,we,ge,O.COLOR_BUFFER_BIT,O.NEAREST):pt?O.copyTexSubImage3D(Se,ve,Ce,lt,Ft+vt,Le,He,we,ge):O.copyTexSubImage2D(Se,ve,Ce,lt,Le,He,we,ge);y.bindFramebuffer(O.READ_FRAMEBUFFER,null),y.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else pt?w.isDataTexture||w.isData3DTexture?O.texSubImage3D(Se,ve,Ce,lt,Ft,we,ge,be,mt,nn,yt.data):U.isCompressedArrayTexture?O.compressedTexSubImage3D(Se,ve,Ce,lt,Ft,we,ge,be,mt,yt.data):O.texSubImage3D(Se,ve,Ce,lt,Ft,we,ge,be,mt,nn,yt):w.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,ve,Ce,lt,we,ge,mt,nn,yt.data):w.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,ve,Ce,lt,yt.width,yt.height,mt,yt.data):O.texSubImage2D(O.TEXTURE_2D,ve,Ce,lt,we,ge,mt,nn,yt);y.pixelStorei(O.UNPACK_ROW_LENGTH,dn),y.pixelStorei(O.UNPACK_IMAGE_HEIGHT,it),y.pixelStorei(O.UNPACK_SKIP_PIXELS,On),y.pixelStorei(O.UNPACK_SKIP_ROWS,ui),y.pixelStorei(O.UNPACK_SKIP_IMAGES,Yi),ve===0&&U.generateMipmaps&&O.generateMipmap(Se),y.unbindTexture()},this.initRenderTarget=function(w){X.get(w).__webglFramebuffer===void 0&&Q.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?Q.setTextureCube(w,0):w.isData3DTexture?Q.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?Q.setTexture2DArray(w,0):Q.setTexture2D(w,0),y.unbindTexture()},this.resetState=function(){q=0,$=0,H=null,y.reset(),ye.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return _i}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=et._getDrawingBufferColorSpace(e),t.unpackColorSpace=et._getUnpackColorSpace()}}class Qb{constructor(){Z(this,"group",new Oe);Z(this,"drivewaysGroup",new Oe);Z(this,"extraLanesGroup",new Oe);Z(this,"highwayCurve");Z(this,"offRampCurve");Z(this,"plazaReturnCurve");this.group.add(this.drivewaysGroup),this.group.add(this.extraLanesGroup),this.highwayCurve=new Au([new R(-18,.05,-450),new R(-18,.05,-300),new R(-18,.05,-160),new R(-18,.05,0),new R(-18,.05,160),new R(-18,.05,300),new R(-18,.05,450)]),this.offRampCurve=new Au([new R(-13,.05,-165),new R(-9,.05,-140),new R(-3,.05,-118),new R(2,.05,-100),new R(5,.05,-85),new R(5,.05,-40),new R(5,.05,15),new R(5,.05,75),new R(5,.05,125)]),this.plazaReturnCurve=new Au([new R(5,.05,125),new R(2,.05,145),new R(-3,.05,165),new R(-9,.05,185),new R(-13,.05,205)]),this.buildGroundHighway(),this.buildPlazaRoadways(),this.buildParkingLots(),this.buildCrosswalks(),this.buildRoadMarkingsAndArrows()}buildGroundHighway(){const i=new ct(22,900),r=new xe({color:1976635,roughness:.85,metalness:.1}),s=new ne(i,r);s.rotation.x=-Math.PI/2,s.position.set(-18,.04,0),s.receiveShadow=!0,this.group.add(s);for(const a of[-.3,.3]){const o=new ct(.25,900),l=new Nt({color:16436245}),c=new ne(o,l);c.rotation.x=-Math.PI/2,c.position.set(-18+a,.06,0),this.group.add(c)}for(const a of[-23.5,-12.5])for(let o=-440;o<440;o+=9){const l=new ct(.3,4.2),c=new Nt({color:16777215}),h=new ne(l,c);h.rotation.x=-Math.PI/2,h.position.set(a,.06,o),this.group.add(h)}for(const a of[-28.8,-7.2]){const o=new ct(.28,900),l=new Nt({color:14870768}),c=new ne(o,l);c.rotation.x=-Math.PI/2,c.position.set(a,.06,0),this.group.add(c)}}buildPlazaRoadways(){const i=new xe({color:1976635,roughness:.88}),r=new ct(11,220),s=new ne(r,i);s.rotation.x=-Math.PI/2,s.position.set(5,.04,20),s.receiveShadow=!0,this.group.add(s);const a=new Cn,o=new Float32Array([-7.2,.04,-165,-7.2,.04,-85,10.5,.04,-85,-7.2,.04,-165,10.5,.04,-85,-.5,.04,-85,-13,.04,-165,-7.2,.04,-165,-.5,.04,-125]);a.setAttribute("position",new Xn(o,3)),a.computeVertexNormals();const l=new ne(a,i);l.receiveShadow=!0,this.group.add(l);const c=new Cn,h=new Float32Array([-.5,.04,125,10.5,.04,125,-7.2,.04,205,-.5,.04,125,-7.2,.04,205,-7.2,.04,125,-7.2,.04,205,-13,.04,205,-7.2,.04,150]);c.setAttribute("position",new Xn(h,3)),c.computeVertexNormals();const u=new ne(c,i);u.receiveShadow=!0,this.group.add(u);const d=new xe({color:14870768,roughness:.9});[{z:-15,length:30},{z:45,length:24}].forEach(g=>{const M=new ne(new Pe(.8,.22,g.length),d);M.position.set(11,.11,g.z),M.receiveShadow=!0,this.group.add(M)});for(let g=-80;g<120;g+=6){const M=new ct(.3,3.2),x=new Nt({color:16777215}),f=new ne(M,x);f.rotation.x=-Math.PI/2,f.position.set(5,.06,g),this.group.add(f)}}buildParkingLots(){const i=new ct(12,80),r=new xe({color:1976635,roughness:.9}),s=new ne(i,r);s.rotation.x=-Math.PI/2,s.position.set(17,.045,45),s.receiveShadow=!0,this.group.add(s);const a=new Nt({color:16777215}),o=5.5;for(let l=10;l<80;l+=4.5){const c=new ct(.2,o),h=new ne(c,a);h.rotation.x=-Math.PI/2,h.rotation.z=Math.PI/6,h.position.set(17,.06,l),this.group.add(h)}}buildCrosswalks(){const e=new Nt({color:16777215});[-45,15,75].forEach(i=>{for(let r=.5;r<=9.5;r+=1.2){const s=new ct(.65,3.8),a=new ne(s,e);a.rotation.x=-Math.PI/2,a.position.set(r,.06,i),this.group.add(a)}})}buildRoadMarkingsAndArrows(){const e=new Nt({color:16777215});for(const i of[-300,-180,-60,60,180,300]){const r=new ct(.7,2.8),s=new ne(r,e);s.rotation.x=-Math.PI/2,s.position.set(-13,.06,i),this.group.add(s);const a=new Vr(1,1.6,3),o=new ne(a,e);o.rotation.x=-Math.PI/2,o.position.set(-13,.06,i+1.8),this.group.add(o)}const t=new ne(new ct(.7,2.5),e);t.rotation.x=-Math.PI/2,t.rotation.z=-Math.PI/4,t.position.set(-11.5,.06,-150),this.group.add(t)}addDriveway(e,t,i,r){const s=i-e,a=r-t,o=Math.sqrt(s*s+a*a),l=Math.atan2(s,a),c=new ct(5,o),h=new xe({color:1976635,roughness:.88}),u=new ne(c,h);u.rotation.x=-Math.PI/2,u.rotation.z=-l,u.position.set((e+i)/2,.05,(t+r)/2),u.receiveShadow=!0,this.drivewaysGroup.add(u)}setHighwayLanes(e){if(e<6||this.extraLanesGroup.children.length>0)return;const t=6,i=900,r=new xe({color:1976635,roughness:.85});for(const s of[-32,-4]){const a=new ct(t,i),o=new ne(a,r);o.rotation.x=-Math.PI/2,o.position.set(s,.042,0),o.receiveShadow=!0,this.extraLanesGroup.add(o)}}}class Jb{constructor(){Z(this,"group",new Oe);Z(this,"dynamicGroup",new Oe);Z(this,"placedMeshes",new Map);Z(this,"zone1GasGroup",new Oe);Z(this,"zone1DieselAndEVGroup",new Oe);Z(this,"zone2StoreGroup",new Oe);Z(this,"zone3RestGroup",new Oe);Z(this,"zone2LockBanner",null);Z(this,"zone3LockBanner",null);Z(this,"landParcelsGroup",new Oe);Z(this,"parcelMeshes",new Map);Z(this,"currentLevel",1);this.group.add(this.dynamicGroup),this.group.add(this.zone1GasGroup),this.group.add(this.zone1DieselAndEVGroup),this.group.add(this.zone2StoreGroup),this.group.add(this.zone3RestGroup),this.group.add(this.landParcelsGroup),this.buildLandParcels();const e=this.createPumpIslandMesh(new R(22,0,-60),!1);this.zone1GasGroup.add(e);const t=this.createTruckDieselCanopyMesh(new R(39.5,0,-60)),i=this.createEVStationMesh(new R(22,0,-35));this.zone1DieselAndEVGroup.add(t),this.zone1DieselAndEVGroup.add(i);const r=this.createStoreMesh(new R(35,0,5)),s=this.createDinerMesh(new R(35,0,28));this.zone2StoreGroup.add(r),this.zone2StoreGroup.add(s);const a=this.buildRestParkGroup(new R(35,0,52)),o=this.createMotelRoomMesh(new R(35,0,75),!1),l=this.createMotelRoomMesh(new R(42,0,102),!0);this.zone3RestGroup.add(a),this.zone3RestGroup.add(o),this.zone3RestGroup.add(l),this.zone2LockBanner=this.createLockBannerMesh(new R(32,0,15),"ZONE 2: STORE & FOOD (Unlocks at Level 3)"),this.zone3LockBanner=this.createLockBannerMesh(new R(32,0,80),"ZONE 3: MOTEL & REST AREA (Unlocks at Level 4)"),this.group.add(this.zone2LockBanner),this.group.add(this.zone3LockBanner),this.buildRoadsideBillboard(new R(-8,0,-110)),this.setPlazaLevel(1)}setPlazaLevel(e){this.currentLevel=e,this.zone1GasGroup.visible=!0,this.zone1DieselAndEVGroup.visible=e>=2,this.zone2StoreGroup.visible=e>=3,this.zone2LockBanner&&(this.zone2LockBanner.visible=e<3),this.zone3RestGroup.visible=e>=4,this.zone3LockBanner&&(this.zone3LockBanner.visible=e<4)}addPlacedBuilding(e,t,i,r){this.placedMeshes.has(e)&&this.removePlacedBuilding(e);const s=new R(i,0,r),a=this.generateMeshForDef(t,s);return a.name=e,this.dynamicGroup.add(a),this.placedMeshes.set(e,a),a}removePlacedBuilding(e){const t=this.placedMeshes.get(e);t&&(this.dynamicGroup.remove(t),this.placedMeshes.delete(e))}generateMeshForDef(e,t){switch(e){case"PUMP_ISLAND":return this.createPumpIslandMesh(t,!1);case"DIESEL_ISLAND":return this.createPumpIslandMesh(t,!0);case"EV_STATION":return this.createEVStationMesh(t);case"CONVENIENCE_STORE":return this.createStoreMesh(t);case"DINER":return this.createDinerMesh(t);case"MOTEL_ROOM":return this.createMotelRoomMesh(t,!1);case"MOTEL_CABIN":return this.createMotelRoomMesh(t,!0);case"CAR_WASH":return this.createCarWashMesh(t);case"RESTROOM":return this.createRestroomMesh(t);case"BILLBOARD":return this.createBillboardMesh(t);case"TREE":return this.createPalmTreeMesh(t);case"PARKING_CAR":return this.createParkingBayMesh(t,!1);case"PARKING_TRUCK":return this.createParkingBayMesh(t,!0);case"DRIVEWAY":return this.createDrivewayPadMesh(t);default:return this.createGenericBuildingMesh(t,6583435)}}createPumpIslandMesh(e,t){const i=new Oe,r=t?366185:14427686,s=new ne(new ct(16,18),new xe({color:1976635,roughness:.9}));s.rotation.x=-Math.PI/2,s.position.y=.05,s.receiveShadow=!0,i.add(s);const a=new ne(new Pe(5.5,.5,12),new xe({color:9741240,roughness:.7}));a.position.y=.25,a.receiveShadow=!0,i.add(a);const o=new ne(new Pe(5.8,.25,12.4),new xe({color:15381256,roughness:.5}));o.position.y=.12,i.add(o);for(const u of[-3.5,3.5]){const d=new ne(new Pe(1.6,3.4,2.2),new xe({color:1976635,roughness:.5}));d.position.set(0,1.95,u),d.castShadow=!0,i.add(d);const p=new ne(new Pe(1.65,1,1.6),new Nt({color:t?1096065:16096779}));p.position.set(0,2.6,u),i.add(p)}const l=new xe({color:16317180,metalness:.6,roughness:.3});for(const u of[-2.4,2.4])for(const d of[-5,5]){const p=new ne(new $t(.28,.28,9,16),l);p.position.set(u,4.5,d),p.castShadow=!0,i.add(p)}const c=new ne(new Pe(11,1.4,16),new xe({color:r,roughness:.4}));c.position.y=9.7,c.castShadow=!0,i.add(c);const h=new ne(new Pe(11.3,.6,16.3),new xe({color:16317180,roughness:.3}));return h.position.y=9.7,i.add(h),i.position.copy(e),i}createEVStationMesh(e){const t=new Oe,i=new ne(new ct(8,10),new xe({color:417606,roughness:.8}));i.rotation.x=-Math.PI/2,i.position.y=.06,i.receiveShadow=!0,t.add(i);for(const r of[-2.2,2.2]){const s=new ne(new Pe(.8,3.2,1),new xe({color:16317180,roughness:.3}));s.position.set(r,1.6,-3.8),s.castShadow=!0,t.add(s);const a=new ne(new $t(.2,.2,.7,16),new Nt({color:440020}));a.rotation.z=Math.PI/2,a.position.set(r,2.2,-3.8),t.add(a)}return t.position.copy(e),t}createStoreMesh(e){const t=new Oe,i=new ne(new Pe(16,6.5,14),new xe({color:1976635,roughness:.8}));i.position.y=3.25,i.castShadow=!0,i.receiveShadow=!0,t.add(i);const r=new ne(new Pe(16.3,1.8,14.3),new xe({color:440020,roughness:.3}));r.position.y=5.8,t.add(r);const s=new ne(new Pe(13,3.8,.2),new xe({color:3718648,metalness:.8,roughness:.1,transparent:!0,opacity:.8}));return s.position.set(0,2.4,7.15),t.add(s),t.position.copy(e),t}createDinerMesh(e){const t=new Oe,i=new ne(new Pe(15,5.8,14),new xe({color:14078929,roughness:.75}));i.position.y=2.9,i.castShadow=!0,i.receiveShadow=!0,t.add(i);const r=new ne(new Vr(12.8,4.2,4),new xe({color:14427686,roughness:.4}));r.position.y=7.8,r.rotation.y=Math.PI/4,r.castShadow=!0,t.add(r);const s=new ne(new Pe(11,3.2,.2),new xe({color:3718648,metalness:.8,roughness:.1,transparent:!0,opacity:.75}));return s.position.set(0,2.8,7.12),t.add(s),t.position.copy(e),t}createMotelRoomMesh(e,t){const i=new Oe,r=t?6514417:4674921,s=new ne(new Pe(12,7.5,12),new xe({color:r,roughness:.8}));s.position.y=3.75,s.castShadow=!0,s.receiveShadow=!0,i.add(s);const a=new ne(new Pe(1.4,2.8,.2),new xe({color:14251782,roughness:.4}));a.position.set(0,1.6,6.12),i.add(a);const o=new ne(new Pe(.3,.3,.2),new Nt({color:16707722}));return o.position.set(1.4,2.5,6.15),i.add(o),i.position.copy(e),i}createCarWashMesh(e){const t=new Oe,i=new ne(new Pe(10,6.5,16),new xe({color:165063,roughness:.4}));i.position.y=3.25,i.castShadow=!0,t.add(i);const r=new ne(new Pe(7,5,16.5),new xe({color:988970,roughness:.9}));return r.position.y=2.8,t.add(r),t.position.copy(e),t}createRestroomMesh(e){const t=new Oe,i=new ne(new Pe(8,4.8,8),new xe({color:366185,roughness:.8}));i.position.y=2.4,i.castShadow=!0,t.add(i);const r=new ne(new ct(1.8,1.2),new Nt({color:16777215}));return r.position.set(0,3.2,4.05),t.add(r),t.position.copy(e),t}createBillboardMesh(e){const t=new Oe;for(const s of[-3.2,3.2]){const a=new ne(new $t(.28,.28,10,16),new xe({color:4674921,metalness:.7}));a.position.set(s,5,0),a.castShadow=!0,t.add(a)}const i=new ne(new Pe(11,5.8,.6),new xe({color:988970}));i.position.set(0,10.5,0),i.castShadow=!0,t.add(i);const r=new ne(new ct(10.4,5.2),new Nt({color:14251782}));return r.position.set(0,10.5,.32),t.add(r),t.position.copy(e),t}createPalmTreeMesh(e){const t=new Oe,i=new ne(new $t(.3,.5,6,8),new xe({color:7877903,roughness:.9}));i.position.y=3,i.castShadow=!0,t.add(i);for(let r=0;r<6;r++){const s=new ne(new Vr(1.6,4,4),new xe({color:1409085,roughness:.8}));s.rotation.z=Math.PI/3,s.rotation.y=r*Math.PI/3,s.position.set(0,6,0),s.castShadow=!0,t.add(s)}return t.position.copy(e),t}createParkingBayMesh(e,t){const i=new Oe,r=t?6:4.2,s=t?14:7,a=new ne(new ct(r,s),new xe({color:1976635,roughness:.9}));a.rotation.x=-Math.PI/2,a.position.y=.06,a.receiveShadow=!0,i.add(a);const o=new Nt({color:16777215});for(const l of[-r/2+.15,r/2-.15]){const c=new ne(new ct(.2,s),o);c.rotation.x=-Math.PI/2,c.position.set(l,.08,0),i.add(c)}return i.position.copy(e),i}createDrivewayPadMesh(e){const t=new Oe,i=new ne(new ct(6,6),new xe({color:1976635,roughness:.88}));return i.rotation.x=-Math.PI/2,i.position.y=.07,i.receiveShadow=!0,t.add(i),t.position.copy(e),t}createGenericBuildingMesh(e,t){const i=new Oe,r=new ne(new Pe(8,5,8),new xe({color:t,roughness:.7}));return r.position.y=2.5,r.castShadow=!0,i.add(r),i.position.copy(e),i}buildRedRoofDiner(e){const t=this.createDinerMesh(e);this.group.add(t)}buildOpenAirGasStation(e){const t=this.createPumpIslandMesh(e,!1);this.group.add(t)}buildQuickMartStore(e){const t=this.createStoreMesh(e);this.group.add(t)}buildMotelLodge(e){const t=this.createMotelRoomMesh(e,!1);this.group.add(t)}buildTruckerCabins(e){const t=this.createMotelRoomMesh(e,!0);this.group.add(t);const i=this.createMotelRoomMesh(new R(e.x,e.y,e.z+14),!0);this.group.add(i)}createTruckDieselCanopyMesh(e){const t=new Oe,i=new ne(new ct(20,32),new xe({color:1976635,roughness:.9}));i.rotation.x=-Math.PI/2,i.position.y=.05,i.receiveShadow=!0,t.add(i);for(const o of[-4,4]){const l=new ne(new Pe(3.5,.45,18),new xe({color:9741240,roughness:.7}));l.position.set(o,.22,0),l.receiveShadow=!0,t.add(l);const c=new ne(new Pe(3.7,.25,18.4),new xe({color:15381256,roughness:.5}));c.position.set(o,.12,0),t.add(c);for(const h of[-4.5,4.5]){const u=new ne(new Pe(1.5,3.8,2),new xe({color:417606,roughness:.5}));u.position.set(o,2.1,h),u.castShadow=!0,t.add(u);const d=new ne(new Pe(1.52,.9,1.4),new Nt({color:1096065}));d.position.set(o,2.8,h),t.add(d)}}const r=new xe({color:16317180,metalness:.6,roughness:.3});for(const o of[-7.5,7.5])for(const l of[-10,10]){const c=new ne(new $t(.35,.35,11,16),r);c.position.set(o,5.5,l),c.castShadow=!0,t.add(c)}const s=new ne(new Pe(18,1.6,26),new xe({color:292951,roughness:.4}));s.position.y=11.5,s.castShadow=!0,t.add(s);const a=new ne(new Pe(18.4,.7,26.4),new xe({color:16317180,roughness:.3}));return a.position.y=11.5,t.add(a),t.position.copy(e),t}buildRestParkGroup(e){const t=new Oe,i=new ne(new ct(24,20),new xe({color:2278750,roughness:.95}));i.rotation.x=-Math.PI/2,i.position.y=.04,i.receiveShadow=!0,t.add(i);const r=new xe({color:9584654,roughness:.8});for(const o of[-6,5]){const l=new ne(new Pe(4,.9,2),r);l.position.set(0,.45,o),l.castShadow=!0,t.add(l)}const s=this.createPalmTreeMesh(new R(-7,0,-5)),a=this.createPalmTreeMesh(new R(7,0,6));return t.add(s),t.add(a),t.position.copy(e),t}createLockBannerMesh(e,t){const i=new Oe,r=new xe({color:6583435,roughness:.8});for(const g of[-6,6]){const M=new ne(new $t(.3,.35,4,16),r);M.position.set(g,2,0),M.castShadow=!0,i.add(M)}const s=new Pe(13,3.2,.4),a=new xe({color:988970,roughness:.7}),o=new ne(s,a);o.position.set(0,3.5,0),i.add(o);const l=new Pe(13.3,.4,.42),c=new Nt({color:16096779}),h=new ne(l,c);h.position.set(0,4.9,0);const u=new ne(l,c);u.position.set(0,2.1,0),i.add(h),i.add(u);const d=new Vr(.5,1.4,8),p=new xe({color:16347926,roughness:.4});for(let g=-7;g<=7;g+=3.5){const M=new ne(d,p);M.position.set(g,.7,1.5),M.castShadow=!0,i.add(M)}return i.position.copy(e),i}buildRoadsideBillboard(e){const t=this.createBillboardMesh(e);t.rotation.y=-Math.PI/8,this.group.add(t)}buildEVParkingStalls(e){const t=this.createEVStationMesh(e);this.group.add(t)}buildLandParcels(){[{id:"plot_north",name:"North Commercial Acreage",x:40,z:-105,w:34,d:38},{id:"plot_east",name:"East Highway Retail Strip",x:65,z:-15,w:28,d:90},{id:"plot_south",name:"South Logistics Truck Terminal",x:40,z:145,w:34,d:38},{id:"plot_deep_east",name:"Deep East Resort & Oasis Park",x:65,z:85,w:28,d:90}].forEach(t=>{const i=new Oe;i.position.set(t.x,0,t.z);const r=new Pe(t.w,.1,t.d),s=new Nt({color:16498468,wireframe:!0}),a=new ne(r,s);a.position.y=.05,i.add(a);const o=new xe({color:11817737,roughness:.8});for(const x of[-t.w/2,t.w/2])for(const f of[-t.d/2,t.d/2]){const v=new ne(new $t(.2,.25,2.2,8),o);v.position.set(x,1.1,f),v.castShadow=!0,i.add(v)}const l=new Oe;l.position.set(t.x,0,t.z);const c=new ct(t.w,t.d),h=new xe({color:1976635,roughness:.88}),u=new ne(c,h);u.rotation.x=-Math.PI/2,u.position.y=.045,u.receiveShadow=!0,l.add(u);const d=new xe({color:15381256,roughness:.6}),p=new Pe(t.w,.18,.4),g=new ne(p,d);g.position.set(0,.09,-t.d/2);const M=new ne(p,d);M.position.set(0,.09,t.d/2),l.add(g),l.add(M),l.visible=!1,this.landParcelsGroup.add(i),this.landParcelsGroup.add(l),this.parcelMeshes.set(t.id,{unownedMesh:i,ownedMesh:l})})}updatePurchasedParcels(e){this.parcelMeshes.forEach((t,i)=>{const r=e.has(i);t.unownedMesh.visible=!r,t.ownedMesh.visible=r})}}class eC{constructor(e,t,i,r){Z(this,"group",new Oe);Z(this,"cars",[]);Z(this,"floatingTexts",[]);Z(this,"spawnTimer",0);Z(this,"tankerTimer",0);Z(this,"roadways");Z(this,"bayManager");Z(this,"pedestrianController");Z(this,"engine",null);Z(this,"carColors",[15485081,165063,14427686,16096779,1096065,16317180,1976635]);this.roadways=e,this.bayManager=t,this.pedestrianController=i,this.engine=r||null,this.spawnCar(.12,15485081,!1,2.5),this.spawnCar(.45,165063,!1,-2.5),this.spawnCar(.72,16317180,!0,2.5),this.spawnStarterParkedCar("fuel_pump_1",165063,!1),this.spawnStarterParkedCar("diner_stall_1",14427686,!1),this.spawnStarterParkedCar("motel_stall_1",16096779,!1)}setEngine(e){this.engine=e}getCarFollowingSpeedMultiplier(e){let t=1/0;for(const s of this.cars)if(s!==e&&s.state!=="PARKED"){if(s.curve===e.curve){if(Math.abs(s.laneOffset-e.laneOffset)<2.2){const o=s.progress-e.progress;if(o>0&&o<.28){const l=e.mesh.position.distanceTo(s.mesh.position);l<t&&(t=l)}}}else if((e.state==="OFF_RAMP"||e.state==="QUEUED")&&(s.state==="OFF_RAMP"||s.state==="QUEUED"||s.state==="APPROACHING_BAY")){const a=s.mesh.position.z-e.mesh.position.z,o=Math.abs(s.mesh.position.x-e.mesh.position.x);if(a>0&&a<35&&o<5){const l=Math.sqrt(o*o+a*a);l<t&&(t=l)}}}const i=e.isTruck?22:14,r=e.isTruck?11:7;if(t<r)return 0;if(t<i){const s=(t-r)/(i-r);return Math.max(.05,s*s)}return 1}update(e,t){if(this.spawnTimer+=e,this.spawnTimer>=3.2&&(this.spawnTimer=0,this.cars.length<16)){const i=Math.random()>.65,r=this.carColors[Math.floor(Math.random()*this.carColors.length)],s=Math.random()>.4?2.5:-2.5;!this.cars.some(o=>o.curve===this.roadways.highwayCurve&&o.progress<.08&&Math.abs(o.laneOffset-s)<2)&&this.spawnCar(0,r,i,s)}this.tankerTimer+=e,this.tankerTimer>=50&&(this.tankerTimer=0,this.spawnFuelTankerTruck());for(let i=this.cars.length-1;i>=0;i--){const r=this.cars[i],s=this.getCarFollowingSpeedMultiplier(r);if(r.state==="HIGHWAY"){r.progress+=r.speed*s*e;const a=this.engine?this.engine.plazaLevel:1;if(!r.isTanker&&r.laneOffset>0&&r.progress>=.29&&r.progress<=.34&&(!r.isTruck||a>=2)&&Math.random()<.5){r.state="OFF_RAMP",r.curve=this.roadways.offRampCurve,r.progress=0,r.speed=.036,r.laneOffset=0;const l=Math.random();r.isTruck?r.desiredCategory=a>=4&&l<.35?"PARKING":"FUEL":a===1?r.desiredCategory="FUEL":a===2?r.desiredCategory=l<.65?"FUEL":"EV":a===3?l<.4?r.desiredCategory="FUEL":l<.55?r.desiredCategory="EV":l<.78?r.desiredCategory="SHOP":r.desiredCategory="DINER":l<.3?r.desiredCategory="FUEL":l<.45?r.desiredCategory="EV":l<.65?r.desiredCategory="SHOP":l<.82?r.desiredCategory="DINER":r.desiredCategory="MOTEL"}if(r.progress>=1){this.removeCar(i);continue}this.updateCurveTransform(r)}else if(r.state==="OFF_RAMP"){if(r.progress+=r.speed*s*e,!r.assignedBay&&r.progress>=.3){const a=this.engine?this.engine.plazaLevel:1,o=this.bayManager.requestBay(r.desiredCategory,r.id,a,r.isTruck);o?r.assignedBay=o:(r.state="QUEUED",r.queueSprite||(r.queueSprite=this.pedestrianController.createStatusSprite("⏳ Waiting (Bays Full)"),r.queueSprite.position.set(0,3.8,0),r.mesh.add(r.queueSprite)))}if(r.assignedBay){const a=r.curve.getPointAt(Math.min(1,r.progress));if(a.distanceTo(r.assignedBay.approachPoint)<4.5||a.z>=r.assignedBay.approachPoint.z){r.state="APPROACHING_BAY",r.transitionStart=a.clone(),r.transitionEnd=r.assignedBay.position.clone(),r.transitionProgress=0,r.transitionStartRot=r.mesh.rotation.y,r.transitionEndRot=r.assignedBay.rotationY;continue}}if(r.progress>=1){r.state="RETURN",r.curve=this.roadways.plazaReturnCurve,r.progress=0,r.speed=.042;continue}this.updateCurveTransform(r)}else if(r.state==="QUEUED"){r.progress+=r.speed*.25*s*e,this.updateCurveTransform(r);const a=this.engine?this.engine.plazaLevel:1,o=this.bayManager.requestBay(r.desiredCategory,r.id,a,r.isTruck);o?(r.assignedBay=o,r.state="OFF_RAMP",r.queueSprite&&(r.mesh.remove(r.queueSprite),r.queueSprite=void 0)):r.progress>=.95&&(r.queueSprite&&(r.mesh.remove(r.queueSprite),r.queueSprite=void 0),r.state="RETURN",r.curve=this.roadways.plazaReturnCurve,r.progress=0,r.speed=.042)}else if(r.state==="APPROACHING_BAY"){r.transitionProgress+=e*.45;const a=Math.min(1,r.transitionProgress),o=a*a*(3-2*a);r.mesh.position.lerpVectors(r.transitionStart,r.transitionEnd,o),r.mesh.position.y=.05,r.mesh.rotation.y=Ns.lerp(r.transitionStartRot,r.transitionEndRot,o),r.mesh.rotation.x=0,r.mesh.rotation.z=0,r.transitionProgress>=1&&r.assignedBay&&(r.state="PARKED",r.serviceTime=r.assignedBay.dwellTime,r.mesh.position.copy(r.assignedBay.position),r.mesh.rotation.set(0,r.assignedBay.rotationY,0),this.pedestrianController.spawnCustomer(r.id,r.assignedBay))}else if(r.state==="PARKED")r.serviceTime-=e,r.serviceTime<=0&&r.assignedBay&&(this.cars.some(o=>(o.state==="OFF_RAMP"||o.state==="QUEUED")&&Math.abs(o.mesh.position.z-r.assignedBay.exitPoint.z)<11)||(this.processTransaction(r.assignedBay.category,r.isTruck,r.mesh.position),r.state="PULLING_OUT",r.transitionStart=r.assignedBay.position.clone(),r.transitionEnd=r.assignedBay.exitPoint.clone(),r.transitionProgress=0,r.transitionStartRot=r.mesh.rotation.y,r.transitionEndRot=0,this.bayManager.releaseBay(r.assignedBay.id),r.assignedBay=null));else if(r.state==="PULLING_OUT"){r.transitionProgress+=e*.45;const a=Math.min(1,r.transitionProgress),o=a*a*(3-2*a);r.mesh.position.lerpVectors(r.transitionStart,r.transitionEnd,o),r.mesh.position.y=.05,r.mesh.rotation.y=Ns.lerp(r.transitionStartRot,r.transitionEndRot,o),r.transitionProgress>=1&&(r.state="RETURN",r.curve=this.roadways.plazaReturnCurve,r.progress=0,r.speed=.042,r.laneOffset=0)}else if(r.state==="RETURN"){let a=!1;if(r.progress>=.82&&(a=this.cars.some(o=>o.state==="HIGHWAY"&&Math.abs(o.mesh.position.x- -13)<4&&o.mesh.position.z>140&&o.mesh.position.z<205)),a||(r.progress+=r.speed*s*e),r.progress>=1){r.state="HIGHWAY",r.curve=this.roadways.highwayCurve,r.progress=.73,r.speed=.028,r.laneOffset=2.5;continue}this.updateCurveTransform(r)}}for(let i=this.floatingTexts.length-1;i>=0;i--){const r=this.floatingTexts[i];r.timer+=e;const s=r.timer/r.maxTimer;r.sprite.position.y=r.initialY+s*4.5,r.sprite.material.opacity=Math.max(0,1-s),r.timer>=r.maxTimer&&(this.group.remove(r.sprite),this.floatingTexts.splice(i,1))}}processTransaction(e,t,i){if(!this.engine)return;this.engine.totalCustomersServed+=1;let r=0,s="";if(e==="FUEL"){const a=t?160:50,o=t?"DIESEL":"REGULAR";r=Math.round(a*1.48),s=`+$${r}.00 ⛽`,this.engine.fuelStorage.dispenseFuel(o,a),this.engine.economy.recordTransaction("FUEL",r,`Fuel Dispensed: ${a}L (${o})`,this.engine.day,this.engine.hour),me.playCashSound()}else e==="EV"?(r=35,s=`+$${r}.00 ⚡`,this.engine.economy.recordTransaction("FUEL",r,"350kW Fast EV Charge",this.engine.day,this.engine.hour),me.playCashSound()):e==="DINER"?(r=t?54:38,s=`+$${r}.00 🍔`,this.engine.economy.recordTransaction("DINER",r,"Diner Meals & Shakes",this.engine.day,this.engine.hour),me.playCashSound()):e==="SHOP"?(r=24,s=`+$${r}.00 🛒`,this.engine.economy.recordTransaction("STORE",r,"QuickMart Snacks & Coffee",this.engine.day,this.engine.hour),me.playCashSound()):e==="MOTEL"&&(r=95,s=`+$${r}.00 🏨`,this.engine.economy.recordTransaction("MOTEL",r,"Motel Rest Room Night",this.engine.day,this.engine.hour),me.playCashSound());r>0&&this.spawnFloatingCashText(i,s)}spawnFloatingCashText(e,t){if(typeof document>"u")return;const i=document.createElement("canvas");i.width=300,i.height=80;const r=i.getContext("2d");if(!r)return;r.fillStyle="rgba(6, 78, 59, 0.92)",r.strokeStyle="#34d399",r.lineWidth=4,r.beginPath(),r.roundRect(8,8,284,64,20),r.fill(),r.stroke(),r.fillStyle="#6ee7b7",r.font='900 32px "Plus Jakarta Sans", sans-serif',r.textAlign="center",r.textBaseline="middle",r.fillText(t,150,40);const s=new Jx(i),a=new tc({map:s,depthTest:!1}),o=new mh(a);o.scale.set(4.8,1.3,1),o.position.set(e.x,e.y+2.5,e.z),this.group.add(o),this.floatingTexts.push({sprite:o,timer:0,maxTimer:1.8,initialY:e.y+2.5})}spawnFuelTankerTruck(){const e=this.createFuelTankerMesh(),i={id:`tanker_${Date.now()}`,mesh:e,curve:this.roadways.highwayCurve,progress:0,speed:.04,isTruck:!0,isTanker:!0,color:14870768,state:"HIGHWAY",serviceTime:0,laneOffset:2.5,assignedBay:null,desiredCategory:"FUEL",transitionStart:new R,transitionEnd:new R,transitionProgress:0,transitionStartRot:0,transitionEndRot:0};e.position.copy(i.curve.getPointAt(0)),this.group.add(e),this.cars.push(i)}updateCurveTransform(e){const t=Math.min(1,Math.max(0,e.progress)),i=e.curve.getPointAt(t),r=e.curve.getTangentAt(t).normalize(),s=new R(-r.z,0,r.x).normalize(),a=i.clone().addScaledVector(s,e.laneOffset);a.y=.05,e.mesh.position.copy(a);const o=Math.atan2(r.x,r.z);e.mesh.rotation.set(0,o,0,"YXZ")}spawnStarterParkedCar(e,t,i){const r=this.bayManager.getBay(e);if(!r)return;const s=i?this.create3DTruck(t):this.create3DCar(t);s.position.copy(r.position),s.rotation.set(0,r.rotationY,0),this.group.add(s);const a=`car_starter_${e}`;r.occupiedBy=a;const o={id:a,mesh:s,curve:this.roadways.offRampCurve,progress:0,speed:.04,isTruck:i,color:t,state:"PARKED",serviceTime:r.dwellTime*.7,laneOffset:0,assignedBay:r,desiredCategory:r.category,transitionStart:r.position.clone(),transitionEnd:r.position.clone(),transitionProgress:1,transitionStartRot:r.rotationY,transitionEndRot:r.rotationY};this.cars.push(o),this.pedestrianController.spawnCustomer(a,r)}spawnCar(e,t,i,r){const s=i?this.create3DTruck(t):this.create3DCar(t),o={id:`car_${Date.now()}_${Math.floor(Math.random()*1e3)}`,mesh:s,curve:this.roadways.highwayCurve,progress:e,speed:i?.024:.032,isTruck:i,color:t,state:"HIGHWAY",serviceTime:0,laneOffset:r,assignedBay:null,desiredCategory:"FUEL",transitionStart:new R,transitionEnd:new R,transitionProgress:0,transitionStartRot:0,transitionEndRot:0},l=o.curve.getPointAt(e);s.position.copy(l),this.group.add(s),this.cars.push(o)}removeCar(e){const t=this.cars[e];t.assignedBay&&this.bayManager.releaseBay(t.assignedBay.id),this.pedestrianController.removeCustomerByVehicle(t.id),t.queueSprite&&t.mesh.remove(t.queueSprite),this.group.remove(t.mesh),this.cars.splice(e,1)}create3DCar(e){const t=new Oe,i=new Pe(3.5,1.1,7),r=new xe({color:e,roughness:.2,metalness:.45}),s=new ne(i,r);s.position.y=.85,s.castShadow=!0,t.add(s);const a=new Pe(3.4,.5,.7),o=new xe({color:988970,roughness:.8}),l=new ne(a,o);l.position.set(0,.55,3.5),t.add(l);const c=new Pe(2.9,1,3.8),h=new xe({color:165063,roughness:.1,metalness:.85}),u=new ne(c,h);u.position.set(0,1.9,-.3),u.castShadow=!0,t.add(u);const d=new Pe(2.86,.14,3.6),p=new ne(d,r);p.position.set(0,2.45,-.3),t.add(p);const g=new Pe(.65,.3,.15),M=new Nt({color:16707722}),x=new ne(g,M);x.position.set(-1.15,.95,3.52);const f=x.clone();f.position.x=1.15,t.add(x),t.add(f);const v=new Pe(.7,.3,.15),E=new Nt({color:15680580}),S=new ne(v,E);S.position.set(-1.15,1,-3.52);const T=S.clone();T.position.x=1.15,t.add(S),t.add(T);const b=new $t(.65,.65,.45,16),C=new xe({color:988970,roughness:.85}),_=new $t(.42,.42,.47,12),A=new xe({color:14870768,metalness:.85,roughness:.15});return[{x:-1.78,z:2.1},{x:1.78,z:2.1},{x:-1.78,z:-2.1},{x:1.78,z:-2.1}].forEach(I=>{const N=new Oe,k=new ne(b,C);k.rotation.z=Math.PI/2;const D=new ne(_,A);D.rotation.z=Math.PI/2,N.add(k),N.add(D),N.position.set(I.x,.65,I.z),N.castShadow=!0,t.add(N)}),t}create3DTruck(e){const t=new Oe,i=new Pe(4,4.4,5.8),r=new xe({color:e,roughness:.3,metalness:.35}),s=new ne(i,r);s.position.set(0,2.7,5.2),s.castShadow=!0,t.add(s);const a=new Pe(2.6,2.2,.3),o=new xe({color:14870768,metalness:.95,roughness:.1}),l=new ne(a,o);l.position.set(0,1.9,8.12),t.add(l);const c=new Pe(3.4,1.4,.2),h=new xe({color:3718648,roughness:.1,metalness:.8}),u=new ne(c,h);u.position.set(0,3.8,8.11),t.add(u);const d=new $t(.14,.14,5.2,12);for(const b of[-1.9,1.9]){const C=new ne(d,o);C.position.set(b,4.2,2.6),t.add(C)}const p=new Pe(4.2,5.4,14.5),g=new xe({color:16317180,roughness:.45,metalness:.1}),M=new ne(p,g);M.position.set(0,3.6,-5.2),M.castShadow=!0,t.add(M);const x=new Pe(3.9,5,.2),f=new xe({color:9741240,metalness:.6}),v=new ne(x,f);v.position.set(0,3.6,-12.46),t.add(v);const E=new $t(.75,.75,.55,16),S=new xe({color:988970,roughness:.9});return[6.8,4,2,-9.5,-11.5].forEach(b=>{for(const C of[-1.95,1.95]){const _=new ne(E,S);_.rotation.z=Math.PI/2,_.position.set(C,.75,b),_.castShadow=!0,t.add(_)}}),t}createFuelTankerMesh(){const e=new Oe,t=new Pe(4,4.4,5.8),i=new xe({color:14427686,roughness:.3}),r=new ne(t,i);r.position.set(0,2.7,5.2),r.castShadow=!0,e.add(r);const s=new $t(2.1,2.1,14.2,24),a=new xe({color:14870768,metalness:.9,roughness:.15}),o=new ne(s,a);o.rotation.x=Math.PI/2,o.position.set(0,3.5,-5.2),o.castShadow=!0,e.add(o);const l=new ct(1.8,1.8),c=new Nt({color:15680580}),h=new ne(l,c);h.rotation.y=-Math.PI/2,h.rotation.z=Math.PI/4,h.position.set(-2.15,3.5,-5.2),e.add(h);const u=new $t(.75,.75,.55,16),d=new xe({color:988970,roughness:.9});return[6.8,4,2,-9.5,-11.5].forEach(g=>{for(const M of[-1.95,1.95]){const x=new ne(u,d);x.rotation.z=Math.PI/2,x.position.set(M,.75,g),x.castShadow=!0,e.add(x)}}),e}}class tC{constructor(){Z(this,"bays",[]);Z(this,"waitingQueues",new Map);this.waitingQueues.set("FUEL",[]),this.waitingQueues.set("EV",[]),this.waitingQueues.set("DINER",[]),this.waitingQueues.set("SHOP",[]),this.waitingQueues.set("MOTEL",[]),this.waitingQueues.set("PARKING",[]),this.initializeBays()}initializeBays(){this.bays.push({id:"fuel_pump_1",category:"FUEL",name:"Fuel Pump #1 (Regular 87)",position:new R(22,.08,-65),rotationY:0,approachPoint:new R(5,.08,-80),exitPoint:new R(5,.08,-50),occupiedBy:null,dwellTime:5.5}),this.bays.push({id:"fuel_pump_2",category:"FUEL",name:"Fuel Pump #2 (Premium 93)",position:new R(22,.08,-55),rotationY:0,approachPoint:new R(5,.08,-72),exitPoint:new R(5,.08,-42),occupiedBy:null,dwellTime:5.5}),this.bays.push({id:"fuel_pump_3",category:"FUEL",name:"Commercial Diesel Lane #1",position:new R(36,.08,-65),rotationY:0,approachPoint:new R(5,.08,-85),exitPoint:new R(5,.08,-45),occupiedBy:null,dwellTime:6.5}),this.bays.push({id:"fuel_pump_4",category:"FUEL",name:"Commercial Diesel Lane #2",position:new R(43,.08,-65),rotationY:0,approachPoint:new R(5,.08,-85),exitPoint:new R(5,.08,-45),occupiedBy:null,dwellTime:6.5});for(let e=0;e<3;e++){const t=-38+e*5.5;this.bays.push({id:`ev_stall_${e+1}`,category:"EV",name:`350kW EV Charger #${e+1}`,position:new R(22,.08,t),rotationY:0,approachPoint:new R(5,.08,t-7),exitPoint:new R(5,.08,t+7),occupiedBy:null,dwellTime:6.5})}for(let e=0;e<3;e++){const t=-2+e*6;this.bays.push({id:`shop_stall_${e+1}`,category:"SHOP",name:`QuickMart Express #${e+1}`,position:new R(22,.08,t),rotationY:0,approachPoint:new R(5,.08,t-7),exitPoint:new R(5,.08,t+7),occupiedBy:null,dwellTime:5})}for(let e=0;e<3;e++){const t=22+e*6;this.bays.push({id:`diner_stall_${e+1}`,category:"DINER",name:`Diner Parking Stall #${e+1}`,position:new R(22,.08,t),rotationY:0,approachPoint:new R(5,.08,t-7),exitPoint:new R(5,.08,t+7),occupiedBy:null,dwellTime:6.5})}for(let e=0;e<3;e++){const t=65+e*6.5;this.bays.push({id:`motel_stall_${e+1}`,category:"MOTEL",name:`Motel Room Bay #${e+1}`,position:new R(22,.08,t),rotationY:0,approachPoint:new R(5,.08,t-7),exitPoint:new R(5,.08,t+7),occupiedBy:null,dwellTime:8})}this.bays.push({id:"trucker_rest_1",category:"PARKING",name:"Rig Overnight Berth #1",position:new R(38,.08,95),rotationY:0,approachPoint:new R(5,.08,78),exitPoint:new R(5,.08,118),occupiedBy:null,dwellTime:8.5}),this.bays.push({id:"trucker_rest_2",category:"PARKING",name:"Rig Overnight Berth #2",position:new R(46,.08,95),rotationY:0,approachPoint:new R(5,.08,78),exitPoint:new R(5,.08,118),occupiedBy:null,dwellTime:8.5})}requestBay(e,t,i=1,r=!1){if(e==="EV"&&i<2||r&&i<2||(e==="SHOP"||e==="DINER")&&i<3||(e==="MOTEL"||e==="PARKING")&&i<4)return null;let s=this.bays.filter(o=>o.category===e&&o.occupiedBy===null);if(r?s=s.filter(o=>o.position.x>=34):s=s.filter(o=>o.position.x<=32),s.length>0){const o=s[0];return o.occupiedBy=t,o}const a=this.waitingQueues.get(e);return a&&!a.includes(t)&&a.push(t),null}releaseBay(e){const t=this.bays.find(r=>r.id===e);if(!t)return;t.occupiedBy=null;const i=this.waitingQueues.get(t.category);if(i&&i.length>0){const r=i.shift();r&&(t.occupiedBy=r)}}getBay(e){return this.bays.find(t=>t.id===e)}getOccupancyCount(e){const t=this.bays.filter(r=>r.category===e);return{occupied:t.filter(r=>r.occupiedBy!==null).length,total:t.length}}isCategoryFull(e){const t=this.getOccupancyCount(e);return t.occupied>=t.total}getTotalStats(){const e=this.bays.length,t=this.bays.filter(r=>r.occupiedBy!==null).length;let i=0;return this.waitingQueues.forEach(r=>{i+=r.length}),{occupied:t,total:e,queued:i}}}class nC{constructor(){Z(this,"group",new Oe);Z(this,"pedestrians",[]);Z(this,"ambientHumans",[]);Z(this,"skinTones",[15843965,14724201,13010498,13935475,9262372]);Z(this,"hairColors",[1976635,7877903,14251782,988970,4674921]);Z(this,"shirtColors",[15680580,2450411,366185,14251782,8141549,14362487,4674921,165063]);Z(this,"pantsColors",[1976635,3359061,1981023,4868682,3878948]);this.spawnAmbientHumans()}spawnAmbientHumans(){const e=this.createHumanFigure(16436245,!0);e.group.position.set(20,.05,-58),e.group.rotation.y=Math.PI/4,this.group.add(e.group),this.ambientHumans.push({mesh:e.group,legL:e.legL,legR:e.legR,armL:e.armL,armR:e.armR,isSitting:!1,isWalking:!1,progress:0,direction:1});const t=this.createHumanFigure(16347926,!0);t.group.position.set(38,.05,-62),t.group.rotation.y=-Math.PI/4,this.group.add(t.group),this.ambientHumans.push({mesh:t.group,legL:t.legL,legR:t.legR,armL:t.armL,armR:t.armR,isSitting:!1,isWalking:!1,progress:0,direction:1});const i=this.createHumanFigure(15680580,!1);i.group.position.set(34,.45,27.5),i.group.rotation.y=Math.PI/2,i.legL.rotation.x=Math.PI/2,i.legR.rotation.x=Math.PI/2,this.group.add(i.group),this.ambientHumans.push({mesh:i.group,isSitting:!0,isWalking:!1,progress:0,direction:1});const r=this.createHumanFigure(165063,!1);r.group.position.set(36,.45,27.5),r.group.rotation.y=-Math.PI/2,r.legL.rotation.x=Math.PI/2,r.legR.rotation.x=Math.PI/2,this.group.add(r.group),this.ambientHumans.push({mesh:r.group,isSitting:!0,isWalking:!1,progress:0,direction:1});const s=this.createHumanFigure(366185,!1);this.group.add(s.group),this.ambientHumans.push({mesh:s.group,legL:s.legL,legR:s.legR,armL:s.armL,armR:s.armR,isSitting:!1,isWalking:!0,walkStart:new R(11,.05,-10),walkEnd:new R(11,.05,50),progress:.2,direction:1});const a=this.createHumanFigure(8141549,!1);a.group.position.set(35,.45,52),a.legL.rotation.x=Math.PI/2,a.legR.rotation.x=Math.PI/2,this.group.add(a.group),this.ambientHumans.push({mesh:a.group,isSitting:!0,isWalking:!1,progress:0,direction:1})}spawnCustomer(e,t){const i=this.shirtColors[Math.floor(Math.random()*this.shirtColors.length)],{group:r,legL:s,legR:a,armL:o,armR:l,torso:c}=this.createHumanFigure(i,!1),h=t.position.clone();h.x-=1.6,h.y=.05;const u=t.position.clone();u.y=.05,t.category==="FUEL"?u.x=t.position.x>25?t.position.x-2.2:t.position.x+2.2:t.category==="EV"?u.x+=1.8:t.category==="DINER"?u.set(28,.05,28):t.category==="SHOP"?u.set(28,.05,5):t.category==="MOTEL"?u.set(28,.05,75):u.set(26,.05,Math.min(105,Math.max(52,t.position.z))),r.position.copy(h),this.group.add(r);const d=this.getInitialStatusText(t.category),p=this.createStatusSprite(d);p.position.set(0,2.7,0),r.add(p);const g={id:`cust_${Date.now()}_${Math.floor(Math.random()*1e3)}`,vehicleId:e,mesh:r,statusSprite:p,bay:t,state:"WALKING_TO_SERVICE",progress:0,timer:0,walkTime:1.8,startPos:h,targetPos:u,legL:s,legR:a,armL:o,armR:l,torso:c};return this.pedestrians.push(g),g}update(e,t){for(let r=this.pedestrians.length-1;r>=0;r--){const s=this.pedestrians[r];if(s.state==="WALKING_TO_SERVICE"){s.progress+=e/s.walkTime;const a=Math.min(1,s.progress);s.mesh.position.lerpVectors(s.startPos,s.targetPos,a);const o=new R().subVectors(s.targetPos,s.startPos).normalize();o.lengthSq()>.001&&(s.mesh.rotation.y=Math.atan2(o.x,o.z)),this.animateLimbs(s,!0),s.progress>=1&&(s.state="SERVICING",s.timer=Math.max(1.5,s.bay.dwellTime-3.2),this.resetLimbs(s),this.updateSpriteText(s.statusSprite,this.getServicingStatusText(s.bay.category)))}else if(s.state==="SERVICING")s.timer-=e,s.armR.rotation.x=Math.sin(performance.now()*.005)*.15-.3,s.timer<=0&&(s.state="WALKING_BACK",s.progress=0,this.updateSpriteText(s.statusSprite,"👍 Satisfied"));else if(s.state==="WALKING_BACK"){s.progress+=e/s.walkTime;const a=Math.min(1,s.progress);s.mesh.position.lerpVectors(s.targetPos,s.startPos,a);const o=new R().subVectors(s.startPos,s.targetPos).normalize();o.lengthSq()>.001&&(s.mesh.rotation.y=Math.atan2(o.x,o.z)),this.animateLimbs(s,!0),s.progress>=1&&(s.state="DONE",this.group.remove(s.mesh),this.pedestrians.splice(r,1))}}const i=performance.now()*.007;for(const r of this.ambientHumans)if(r.isWalking&&r.walkStart&&r.walkEnd&&r.legL&&r.legR&&r.armL&&r.armR){r.progress+=e*.12*r.direction,r.progress>=1?(r.progress=1,r.direction=-1):r.progress<=0&&(r.progress=0,r.direction=1),r.mesh.position.lerpVectors(r.walkStart,r.walkEnd,r.progress);const s=r.direction>0?0:Math.PI;r.mesh.rotation.y=s;const a=Math.sin(i)*.5;r.legL.rotation.x=a,r.legR.rotation.x=-a,r.armL.rotation.x=-a*.7,r.armR.rotation.x=a*.7}}removeCustomerByVehicle(e){for(let t=this.pedestrians.length-1;t>=0;t--)this.pedestrians[t].vehicleId===e&&(this.group.remove(this.pedestrians[t].mesh),this.pedestrians.splice(t,1))}createHumanFigure(e,t=!1){const i=new Oe,r=this.skinTones[Math.floor(Math.random()*this.skinTones.length)],s=this.hairColors[Math.floor(Math.random()*this.hairColors.length)],a=t?1976635:this.pantsColors[Math.floor(Math.random()*this.pantsColors.length)],o=new xe({color:r,roughness:.6}),l=new xe({color:s,roughness:.8}),c=new xe({color:e,roughness:.5}),h=new xe({color:a,roughness:.7}),u=new xe({color:988970,roughness:.9}),d=new Ir(.24,16,16),p=new ne(d,o);if(p.position.y=1.76,p.scale.set(1,1.15,1),p.castShadow=!0,i.add(p),t||Math.random()<.6){const D=new xe({color:t?16347926:s,roughness:.8}),V=new ne(new Ir(.26,12,12),D);V.position.set(0,1.84,0),V.scale.set(1.02,.6,1.02),i.add(V);const q=new ne(new Pe(.32,.04,.22),D);q.position.set(0,1.82,.25),i.add(q)}else{const D=new ne(new Ir(.26,14,14),l);D.position.set(0,1.84,-.04),D.scale.set(1.02,.75,1.04),i.add(D)}const g=new ne(new $t(.09,.11,.16,12),o);g.position.y=1.52,i.add(g);const M=new Pe(.56,.74,.32),x=new ne(M,c);if(x.position.y=1.12,x.castShadow=!0,i.add(x),t){const D=new xe({color:14870768,metalness:.8,roughness:.2});for(const V of[1.22,1.02]){const q=new ne(new Pe(.58,.06,.34),D);q.position.set(0,V,0),i.add(q)}}const f=new ne(new Pe(.57,.08,.33),new xe({color:988970,roughness:.8}));f.position.y=.74,i.add(f);const v=new Oe;v.position.set(-.16,.7,0);const E=new ne(new Pe(.22,.7,.24),h);E.position.y=-.35,E.castShadow=!0,v.add(E);const S=new ne(new Pe(.22,.12,.34),u);S.position.set(0,-.68,.05),S.castShadow=!0,v.add(S),i.add(v);const T=new Oe;T.position.set(.16,.7,0);const b=new ne(new Pe(.22,.7,.24),h);b.position.y=-.35,b.castShadow=!0,T.add(b);const C=new ne(new Pe(.22,.12,.34),u);C.position.set(0,-.68,.05),C.castShadow=!0,T.add(C),i.add(T);const _=new Oe;_.position.set(-.36,1.4,0);const A=new ne(new Pe(.16,.6,.18),c);A.position.y=-.3,A.castShadow=!0,_.add(A);const L=new ne(new Ir(.08,8,8),o);L.position.set(0,-.64,0),_.add(L),i.add(_);const I=new Oe;I.position.set(.36,1.4,0);const N=new ne(new Pe(.16,.6,.18),c);N.position.y=-.3,N.castShadow=!0,I.add(N);const k=new ne(new Ir(.08,8,8),o);return k.position.set(0,-.64,0),I.add(k),i.add(I),{group:i,legL:v,legR:T,armL:_,armR:I,torso:x}}animateLimbs(e,t){if(!t){this.resetLimbs(e);return}const i=performance.now()*.009,r=Math.sin(i)*.55;e.legL.rotation.x=r,e.legR.rotation.x=-r,e.armL.rotation.x=-r*.75,e.armR.rotation.x=r*.75,e.torso.position.y=1.12+Math.abs(Math.sin(i*2))*.04}resetLimbs(e){e.legL.rotation.x=0,e.legR.rotation.x=0,e.armL.rotation.x=0,e.armR.rotation.x=0,e.torso.position.y=1.12}createStatusSprite(e){if(typeof document>"u"){const o=new tc,l=new mh(o);return l.scale.set(4.2,1.05,1),l}const t=document.createElement("canvas");t.width=384,t.height=96;const i=t.getContext("2d");this.drawSpriteCanvas(i,t.width,t.height,e);const r=new Jx(t);r.minFilter=Qt;const s=new tc({map:r,transparent:!0,depthTest:!1}),a=new mh(s);return a.scale.set(3.8,.95,1),a}updateSpriteText(e,t){if(typeof document>"u")return;const i=e.material;if(i.map&&i.map.image){const r=i.map.image,s=r.getContext("2d");this.drawSpriteCanvas(s,r.width,r.height,t),i.map.needsUpdate=!0}}drawSpriteCanvas(e,t,i,r){e.clearRect(0,0,t,i),e.fillStyle="rgba(15, 23, 42, 0.88)",e.strokeStyle="#38bdf8",e.lineWidth=4,this.roundRect(e,6,6,t-12,i-12,22),e.fill(),e.stroke(),e.font='bold 36px "Segoe UI", sans-serif',e.fillStyle="#ffffff",e.textAlign="center",e.textBaseline="middle",e.fillText(r,t/2,i/2)}roundRect(e,t,i,r,s,a){e.beginPath(),e.moveTo(t+a,i),e.lineTo(t+r-a,i),e.quadraticCurveTo(t+r,i,t+r,i+a),e.lineTo(t+r,i+s-a),e.quadraticCurveTo(t+r,i+s,t+r-a,i+s),e.lineTo(t+a,i+s),e.quadraticCurveTo(t,i+s,t,i+s-a),e.lineTo(t,i+a),e.quadraticCurveTo(t,i,t+a,i),e.closePath()}getInitialStatusText(e){switch(e){case"FUEL":return"⛽ Fueling Up";case"EV":return"⚡ Charging EV";case"DINER":return"🍔 Getting Food";case"SHOP":return"🛒 QuickMart Run";case"MOTEL":return"🏨 Checking In";default:return"🚶 Strolling"}}getServicingStatusText(e){switch(e){case"FUEL":return"⛽ Pumping Fuel";case"EV":return"⚡ 350kW Charging";case"DINER":return"🍔 Eating Lunch";case"SHOP":return"☕ Coffee & Snacks";case"MOTEL":return"🛏️ Resting in Room";default:return"🌲 In Rest Park"}}}class iC{constructor(e,t,i,r,s,a){Z(this,"raycaster",new rv);Z(this,"mouse",new ke);Z(this,"groundPlane",new mi(new R(0,1,0),0));Z(this,"previewMesh",new Oe);Z(this,"previewBox");Z(this,"activeDef",null);Z(this,"isDemolishMode",!1);Z(this,"camera");Z(this,"scene");Z(this,"engine");Z(this,"plazaBuildings");Z(this,"roadways");Z(this,"bayManager");this.camera=e,this.scene=t,this.engine=i,this.plazaBuildings=r,this.roadways=s,this.bayManager=a;const o=new Pe(8,4,8),l=new Nt({color:2278750,transparent:!0,opacity:.5,wireframe:!0});this.previewBox=new ne(o,l),this.previewMesh.add(this.previewBox),this.previewMesh.visible=!1,this.scene.add(this.previewMesh),this.syncInitialPlacedBuildings()}syncInitialPlacedBuildings(){this.engine.buildings.forEach(e=>{const t=(e.x-10)*4+25,i=(e.y-10)*4+10;this.plazaBuildings.addPlacedBuilding(e.id,e.defId,t,i)})}setActiveDef(e){if(this.activeDef=e,this.previewMesh.visible=e!==null&&!this.isDemolishMode,e){const t=e.width*4.5,i=e.height*4.5;this.previewBox.scale.set(t/8,1,i/8)}}setDemolishMode(e){this.isDemolishMode=e,e&&this.setActiveDef(null)}handlePointerMove(e,t){if(!this.activeDef&&!this.isDemolishMode){this.previewMesh.visible=!1;return}const i=t.getBoundingClientRect();this.mouse.x=(e.clientX-i.left)/i.width*2-1,this.mouse.y=-((e.clientY-i.top)/i.height)*2+1,this.raycaster.setFromCamera(this.mouse,this.camera);const r=new R;if(this.raycaster.ray.intersectPlane(this.groundPlane,r)&&this.activeDef){const a=Math.round(r.x/4)*4,o=Math.round(r.z/4)*4,l=Math.max(12,Math.min(60,a)),c=Math.max(-90,Math.min(120,o));this.previewMesh.position.set(l,2,c),this.previewMesh.visible=!0;const h=this.engine.economy.cash>=this.activeDef.cost;this.previewBox.material.color.setHex(h?2278750:15680580)}}handleClick(e,t){const i=t.getBoundingClientRect();if(this.mouse.x=(e.clientX-i.left)/i.width*2-1,this.mouse.y=-((e.clientY-i.top)/i.height)*2+1,this.raycaster.setFromCamera(this.mouse,this.camera),this.isDemolishMode){const r=this.raycaster.intersectObjects(this.plazaBuildings.dynamicGroup.children,!0);if(r.length>0){let s=r[0].object;for(;s&&s.parent!==this.plazaBuildings.dynamicGroup;)s=s.parent;if(s&&s.name){const a=s.name;return this.engine.demolishBuilding(a),this.plazaBuildings.removePlacedBuilding(a),me.playDemolishSound(),!0}}return!1}if(this.activeDef){const r=new R;if(this.raycaster.ray.intersectPlane(this.groundPlane,r)){const a=Math.round(r.x/4)*4,o=Math.round(r.z/4)*4,l=Math.max(12,Math.min(60,a)),c=Math.max(-90,Math.min(120,o)),h=Math.round((l-25)/4)+10,u=Math.round((c-10)/4)+10;if(this.engine.buildBuilding(this.activeDef.id,h,u)){const p=this.engine.buildings[this.engine.buildings.length-1];return this.plazaBuildings.addPlacedBuilding(p.id,this.activeDef.id,l,c),this.roadways.addDriveway(5,c,l,c),this.registerDynamicBay(p.id,this.activeDef.id,l,c),me.playCashSound(),!0}}}return!1}registerDynamicBay(e,t,i,r){t==="PUMP_ISLAND"||t==="DIESEL_ISLAND"?this.bayManager.bays.push({id:`dyn_pump_${e}`,category:"FUEL",name:`Expanded Fuel Island (${i}, ${r})`,position:new R(i,.08,r),rotationY:0,approachPoint:new R(5,.08,r-8),exitPoint:new R(5,.08,r+8),occupiedBy:null,dwellTime:5.5}):t==="EV_STATION"?this.bayManager.bays.push({id:`dyn_ev_${e}`,category:"EV",name:`Expanded EV Station (${i}, ${r})`,position:new R(i,.08,r),rotationY:Math.PI/2,approachPoint:new R(5,.08,r-6),exitPoint:new R(5,.08,r+6),occupiedBy:null,dwellTime:6.5}):t==="DINER"?this.bayManager.bays.push({id:`dyn_diner_${e}`,category:"DINER",name:`Expanded Diner Bay (${i}, ${r})`,position:new R(i,.08,r-4),rotationY:Math.PI/2,approachPoint:new R(5,.08,r-8),exitPoint:new R(5,.08,r+8),occupiedBy:null,dwellTime:7}):t==="CONVENIENCE_STORE"?this.bayManager.bays.push({id:`dyn_shop_${e}`,category:"SHOP",name:`Expanded Store Bay (${i}, ${r})`,position:new R(i,.08,r),rotationY:Math.PI/2,approachPoint:new R(5,.08,r-6),exitPoint:new R(5,.08,r+6),occupiedBy:null,dwellTime:5}):t==="MOTEL_ROOM"||t==="MOTEL_CABIN"?this.bayManager.bays.push({id:`dyn_motel_${e}`,category:"MOTEL",name:`Expanded Motel Bay (${i}, ${r})`,position:new R(i,.08,r),rotationY:Math.PI/2,approachPoint:new R(5,.08,r-6),exitPoint:new R(5,.08,r+8),occupiedBy:null,dwellTime:8}):(t==="PARKING_CAR"||t==="PARKING_TRUCK")&&this.bayManager.bays.push({id:`dyn_parking_${e}`,category:"PARKING",name:`Expanded Parking Stall (${i}, ${r})`,position:new R(i,.08,r),rotationY:0,approachPoint:new R(5,.08,r-6),exitPoint:new R(5,.08,r+6),occupiedBy:null,dwellTime:6})}}class rC{constructor(e,t){Z(this,"scene");Z(this,"camera");Z(this,"renderer");Z(this,"roadways");Z(this,"buildings");Z(this,"vehicleController");Z(this,"bayManager");Z(this,"pedestrianController");Z(this,"buildingPlacer");Z(this,"engine",null);Z(this,"isMouseDown",!1);Z(this,"isRightMouseDown",!1);Z(this,"previousMousePosition",{x:0,y:0});Z(this,"DEFAULT_TARGET",new R(15,0,-25));Z(this,"DEFAULT_RADIUS",95);Z(this,"DEFAULT_THETA",-Math.PI*.65);Z(this,"DEFAULT_PHI",Math.PI/3.3);Z(this,"cameraTarget",this.DEFAULT_TARGET.clone());Z(this,"cameraRadius",this.DEFAULT_RADIUS);Z(this,"cameraTheta",this.DEFAULT_THETA);Z(this,"cameraPhi",this.DEFAULT_PHI);Z(this,"targetCameraTarget",this.DEFAULT_TARGET.clone());Z(this,"targetCameraRadius",this.DEFAULT_RADIUS);Z(this,"targetCameraTheta",this.DEFAULT_THETA);Z(this,"targetCameraPhi",this.DEFAULT_PHI);Z(this,"onSelectFacility");this.engine=t||null,this.renderer=new Zb({canvas:e,antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Tx,this.scene=new AM,this.scene.background=new Ke(8246268),this.scene.fog=new Cf(12248829,.0012),this.camera=new Hn(45,window.innerWidth/window.innerHeight,.5,2e3),this.updateCameraPosition(),this.setupLighting(),this.buildSpaciousEnvironment(),this.bayManager=new tC,this.pedestrianController=new nC,this.scene.add(this.pedestrianController.group),this.roadways=new Qb,this.scene.add(this.roadways.group),this.buildings=new Jb,this.scene.add(this.buildings.group),this.vehicleController=new eC(this.roadways,this.bayManager,this.pedestrianController,t),this.scene.add(this.vehicleController.group),this.buildingPlacer=new iC(this.camera,this.scene,t||new Ex,this.buildings,this.roadways,this.bayManager),this.setupMouseControls(e)}setupLighting(){const e=new YM(16777215,8843180,.95);this.scene.add(e);const t=new ZM(16772565,1.4);t.position.set(-90,180,-60),t.castShadow=!0,t.shadow.mapSize.width=2048,t.shadow.mapSize.height=2048,t.shadow.camera.near=10,t.shadow.camera.far=600,t.shadow.camera.left=-220,t.shadow.camera.right=220,t.shadow.camera.top=220,t.shadow.camera.bottom=-220,this.scene.add(t)}buildSpaciousEnvironment(){const e=new ct(600,600,32,32),t=new xe({color:3462041,roughness:.95,metalness:.05}),i=new ne(e,t);i.rotation.x=-Math.PI/2,i.position.set(0,0,0),i.receiveShadow=!0,this.scene.add(i);const r=new ct(74,250),s=new xe({color:3359061,roughness:.9}),a=new ne(r,s);a.rotation.x=-Math.PI/2,a.position.set(30,.02,20),a.receiveShadow=!0,this.scene.add(a),this.buildPerimeterTrees()}buildPerimeterTrees(){const e=new Oe,t=new xe({color:7877903,roughness:.9}),i=new xe({color:1409085,roughness:.85}),r=(s,a,o=1)=>{const l=new Oe,c=new ne(new $t(.35*o,.5*o,4*o,8),t);c.position.y=2*o,c.castShadow=!0,l.add(c);for(let h=0;h<3;h++){const u=(2.2-h*.5)*o,d=3*o,p=new ne(new Vr(u,d,8),i);p.position.y=(3.5+h*1.8)*o,p.castShadow=!0,l.add(p)}l.position.set(s,0,a),e.add(l)};for(let s=-200;s<=200;s+=18)r(-45+Math.sin(s)*4,s,1.2+Math.cos(s)*.2),r(-60+Math.cos(s)*5,s+6,1.4);for(let s=-180;s<=180;s+=20)r(75+Math.sin(s)*4,s,1.3),r(90+Math.cos(s)*6,s+8,1.5);for(let s=-30;s<=70;s+=15)r(s,-160+Math.sin(s)*5,1.3),r(s,180+Math.cos(s)*5,1.3);this.scene.add(e)}updateCameraPosition(){const e=this.cameraTarget.x+this.cameraRadius*Math.sin(this.cameraPhi)*Math.sin(this.cameraTheta),t=this.cameraTarget.y+this.cameraRadius*Math.cos(this.cameraPhi),i=this.cameraTarget.z+this.cameraRadius*Math.sin(this.cameraPhi)*Math.cos(this.cameraTheta);this.camera.position.set(e,t,i),this.camera.lookAt(this.cameraTarget)}setupMouseControls(e){e.addEventListener("mousedown",t=>{t.button===0?this.isMouseDown=!0:t.button===2&&(this.isRightMouseDown=!0),this.previousMousePosition={x:t.clientX,y:t.clientY}}),window.addEventListener("mousemove",t=>{this.buildingPlacer.handlePointerMove(t,e);const i=t.clientX-this.previousMousePosition.x,r=t.clientY-this.previousMousePosition.y;if(this.previousMousePosition={x:t.clientX,y:t.clientY},this.isMouseDown)this.targetCameraTheta-=i*.005,this.targetCameraPhi=Math.max(.12,Math.min(Math.PI/2.05,this.targetCameraPhi+r*.005));else if(this.isRightMouseDown){const s=new R;this.camera.getWorldDirection(s),s.y=0,s.normalize();const a=new R().crossVectors(s,new R(0,1,0)).normalize();this.targetCameraTarget.addScaledVector(a,-i*.22),this.targetCameraTarget.addScaledVector(s,r*.22)}}),e.addEventListener("click",t=>{var l,c,h;if(this.buildingPlacer.activeDef||this.buildingPlacer.isDemolishMode){this.buildingPlacer.handleClick(t,e);return}const i=e.getBoundingClientRect(),r=new ke((t.clientX-i.left)/i.width*2-1,-((t.clientY-i.top)/i.height)*2+1),s=new rv;s.setFromCamera(r,this.camera);const a=new R,o=new mi(new R(0,1,0),0);s.ray.intersectPlane(o,a)&&a.x>8&&a.x<65&&(a.z<-20?(l=this.onSelectFacility)==null||l.call(this,"FUEL"):a.z>=-20&&a.z<45?(c=this.onSelectFacility)==null||c.call(this,"SHOP"):(h=this.onSelectFacility)==null||h.call(this,"MOTEL"))}),window.addEventListener("mouseup",()=>{this.isMouseDown=!1,this.isRightMouseDown=!1}),e.addEventListener("wheel",t=>{t.preventDefault();const i=t.deltaY>0?1.12:.88;this.targetCameraRadius=Math.max(30,Math.min(300,this.targetCameraRadius*i))},{passive:!1}),e.addEventListener("contextmenu",t=>t.preventDefault())}handleResize(){this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight)}render(e){const t=Math.min(1,e*7.5);this.cameraTarget.lerp(this.targetCameraTarget,t),this.cameraRadius=Ns.lerp(this.cameraRadius,this.targetCameraRadius,t),this.cameraTheta=Ns.lerp(this.cameraTheta,this.targetCameraTheta,t),this.cameraPhi=Ns.lerp(this.cameraPhi,this.targetCameraPhi,t),this.updateCameraPosition(),this.engine&&this.buildings.currentLevel!==this.engine.plazaLevel&&this.buildings.setPlazaLevel(this.engine.plazaLevel),this.engine&&(this.buildings.updatePurchasedParcels(this.engine.purchasedParcels),this.roadways.setHighwayLanes(this.engine.highwayLanesLevel)),this.vehicleController.update(e,this.camera),this.pedestrianController.update(e,this.camera),this.renderer.render(this.scene,this.camera)}setCameraPreset(e){e==="OVERVIEW"?(this.targetCameraTarget.set(16,0,10),this.targetCameraRadius=135,this.targetCameraTheta=-Math.PI*.65,this.targetCameraPhi=Math.PI/3.2):e==="FUEL"?(this.targetCameraTarget.set(22,0,-55),this.targetCameraRadius=65,this.targetCameraTheta=-Math.PI*.65,this.targetCameraPhi=Math.PI/3.5):e==="STORE"?(this.targetCameraTarget.set(32,0,15),this.targetCameraRadius=65,this.targetCameraTheta=-Math.PI*.65,this.targetCameraPhi=Math.PI/3.5):e==="MOTEL"&&(this.targetCameraTarget.set(32,0,75),this.targetCameraRadius=70,this.targetCameraTheta=-Math.PI*.65,this.targetCameraPhi=Math.PI/3.5)}rotateCamera(e){this.targetCameraTheta+=Ns.degToRad(e)}zoomCamera(e){this.targetCameraRadius=Math.max(30,Math.min(300,this.targetCameraRadius*e))}resetToPhotoView(){this.targetCameraTarget.copy(this.DEFAULT_TARGET),this.targetCameraRadius=this.DEFAULT_RADIUS,this.targetCameraTheta=this.DEFAULT_THETA,this.targetCameraPhi=this.DEFAULT_PHI}destroy(){this.renderer.dispose()}}/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sC=n=>n.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),fv=(...n)=>n.filter((e,t,i)=>!!e&&i.indexOf(e)===t).join(" ");/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var aC={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oC=at.forwardRef(({color:n="currentColor",size:e=24,strokeWidth:t=2,absoluteStrokeWidth:i,className:r="",children:s,iconNode:a,...o},l)=>at.createElement("svg",{ref:l,...aC,width:e,height:e,stroke:n,strokeWidth:i?Number(t)*24/Number(e):t,className:fv("lucide",r),...o},[...a.map(([c,h])=>at.createElement(c,h)),...Array.isArray(s)?s:[s]]));/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qe=(n,e)=>{const t=at.forwardRef(({className:i,...r},s)=>at.createElement(oC,{ref:s,iconNode:e,className:fv(`lucide-${sC(n)}`,i),...r}));return t.displayName=`${n}`,t};/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lC=Qe("ArrowUpRight",[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nc=Qe("Bed",[["path",{d:"M2 4v16",key:"vw9hq8"}],["path",{d:"M2 8h18a2 2 0 0 1 2 2v10",key:"1dgv2r"}],["path",{d:"M2 17h20",key:"18nfp3"}],["path",{d:"M6 8v9",key:"1yriud"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cC=Qe("Building2",[["path",{d:"M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z",key:"1b4qmf"}],["path",{d:"M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2",key:"i71pzd"}],["path",{d:"M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2",key:"10jefs"}],["path",{d:"M10 6h4",key:"1itunk"}],["path",{d:"M10 10h4",key:"tcdvrf"}],["path",{d:"M10 14h4",key:"kelpxr"}],["path",{d:"M10 18h4",key:"1ulq68"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uC=Qe("ChartColumn",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dC=Qe("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hC=Qe("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pv=Qe("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mv=Qe("CircleArrowUp",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m16 12-4-4-4 4",key:"177agl"}],["path",{d:"M12 16V8",key:"1sbj14"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nf=Qe("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fC=Qe("Circle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pC=Qe("Compass",[["path",{d:"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",key:"9ktpf1"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gv=Qe("Cpu",[["rect",{width:"16",height:"16",x:"4",y:"4",rx:"2",key:"14l7u7"}],["rect",{width:"6",height:"6",x:"9",y:"9",rx:"1",key:"5aljv4"}],["path",{d:"M15 2v2",key:"13l42r"}],["path",{d:"M15 20v2",key:"15mkzm"}],["path",{d:"M2 15h2",key:"1gxd5l"}],["path",{d:"M2 9h2",key:"1bbxkp"}],["path",{d:"M20 15h2",key:"19e6y8"}],["path",{d:"M20 9h2",key:"19tzq7"}],["path",{d:"M9 2v2",key:"165o2o"}],["path",{d:"M9 20v2",key:"i2bqo8"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xv=Qe("DollarSign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lo=Qe("Fuel",[["line",{x1:"3",x2:"15",y1:"22",y2:"22",key:"xegly4"}],["line",{x1:"4",x2:"14",y1:"9",y2:"9",key:"xcnuvu"}],["path",{d:"M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18",key:"16j0yd"}],["path",{d:"M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5",key:"7cu91f"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mC=Qe("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gC=Qe("MessageSquare",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vv=Qe("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xC=Qe("Navigation",[["polygon",{points:"3 11 22 2 13 21 11 13 3 11",key:"1ltx0t"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vC=Qe("Pause",[["rect",{x:"14",y:"4",width:"4",height:"16",rx:"1",key:"zuxfzm"}],["rect",{x:"6",y:"4",width:"4",height:"16",rx:"1",key:"1okwgv"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _C=Qe("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _v=Qe("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yC=Qe("RotateCw",[["path",{d:"M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8",key:"1p45f6"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const SC=Qe("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _h=Qe("Star",[["polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",key:"8f66p6"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const MC=Qe("Store",[["path",{d:"m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7",key:"ztvudi"}],["path",{d:"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8",key:"1b2hhj"}],["path",{d:"M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4",key:"2ebpfo"}],["path",{d:"M2 7h20",key:"1fcdvo"}],["path",{d:"M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7",key:"6c3vgh"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wC=Qe("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yv=Qe("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const If=Qe("Trophy",[["path",{d:"M6 9H4.5a2.5 2.5 0 0 1 0-5H6",key:"17hqa7"}],["path",{d:"M18 9h1.5a2.5 2.5 0 0 0 0-5H18",key:"lmptdp"}],["path",{d:"M4 22h16",key:"57wxv0"}],["path",{d:"M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22",key:"1nw9bq"}],["path",{d:"M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22",key:"1np0yb"}],["path",{d:"M18 2H6v7a6 6 0 0 0 12 0V2Z",key:"u46fv3"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const EC=Qe("Truck",[["path",{d:"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",key:"wrbu53"}],["path",{d:"M15 18H9",key:"1lyqi6"}],["path",{d:"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",key:"lysw3i"}],["circle",{cx:"17",cy:"18",r:"2",key:"332jqn"}],["circle",{cx:"7",cy:"18",r:"2",key:"19iecd"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const TC=Qe("UserPlus",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvyxn"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sv=Qe("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bC=Qe("Utensils",[["path",{d:"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2",key:"cjf0a3"}],["path",{d:"M7 2v20",key:"1473qp"}],["path",{d:"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7",key:"j28e5"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const CC=Qe("Volume2",[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["path",{d:"M16 9a5 5 0 0 1 0 6",key:"1q6k2b"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728",key:"ijwkga"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const AC=Qe("VolumeX",[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["line",{x1:"22",x2:"16",y1:"9",y2:"15",key:"1ewh16"}],["line",{x1:"16",x2:"22",y1:"9",y2:"15",key:"5ykzw1"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bi=Qe("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const RC=Qe("ZoomIn",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"11",x2:"11",y1:"8",y2:"14",key:"1vmskp"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const PC=Qe("ZoomOut",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]]),LC=({engine:n,bayStats:e,onResetCamera:t,onOpenFuel:i,onOpenMotel:r,onOpenStaff:s,onOpenFinance:a,onOpenTechTree:o,onOpenReviews:l,onOpenObjectives:c})=>{const[,h]=vr.useReducer(S=>S+1,0),[u,d]=vr.useState(me.getIsMuted()),p=S=>{n.gameSpeed=S,me.playClickSound(),h()},g=()=>{const S=me.toggleMute();d(S),h()},M=n.hour.toString().padStart(2,"0"),x=n.minute.toString().padStart(2,"0"),f=n.hour<6||n.hour>=20,v=n.fuelStorage.tanks.REGULAR,E=Math.round(v.currentLiters/v.maxCapacityLiters*100);return m.jsxs("header",{className:"fixed top-0 left-0 right-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 py-2 flex items-center justify-between gap-3 shadow-2xl",children:[m.jsxs("div",{className:"flex items-center gap-2.5 shrink-0",children:[m.jsxs("div",{className:"relative flex flex-col items-center justify-center w-10 h-10 bg-gradient-to-b from-blue-700 to-blue-900 border-2 border-white rounded-t-xl rounded-b-2xl shadow-lg shadow-blue-950/80",children:[m.jsx("div",{className:"w-full bg-red-600 text-[7px] font-black text-center text-white uppercase tracking-tighter leading-none py-0.5 rounded-t-lg",children:"INTERSTATE"}),m.jsx("span",{className:"text-white font-black text-xs font-['Chakra_Petch'] leading-none mt-0.5",children:"66"})]}),m.jsxs("div",{children:[m.jsxs("div",{className:"flex items-center gap-2",children:[m.jsxs("h1",{className:"text-xs sm:text-sm font-black tracking-wider uppercase font-['Chakra_Petch'] text-white",children:["Highway Oasis ",m.jsx("span",{className:"text-amber-400",children:"Plaza"})]}),m.jsxs("span",{className:"text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 flex items-center gap-1",children:[m.jsx("span",{children:"★"}),m.jsxs("span",{children:["LVL ",n.plazaLevel]})]})]}),m.jsxs("p",{className:"text-[10px] text-slate-400 font-medium hidden sm:block",children:[n.scenario.name," • Milepost 142.8"]})]})]}),m.jsxs("div",{className:"flex items-center gap-2 shrink-0",children:[m.jsxs("div",{className:"flex items-center gap-2 bg-slate-900/90 border border-emerald-500/40 px-3 py-1.5 rounded-xl shadow-inner shadow-emerald-950/40",children:[m.jsx("div",{className:"w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/40",children:m.jsx(xv,{className:"w-3.5 h-3.5"})}),m.jsxs("div",{children:[m.jsx("span",{className:"text-[8px] uppercase font-bold tracking-widest text-slate-400 block leading-none",children:"Operating Funds"}),m.jsxs("span",{className:"text-sm sm:text-base font-black font-mono text-emerald-400 leading-tight",children:["$",n.economy.cash.toLocaleString()]})]})]}),m.jsxs("div",{className:"flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/90 px-2.5 py-1.5 rounded-xl",children:[m.jsx("span",{className:"text-sm",children:f?"🌙":"☀️"}),m.jsxs("div",{children:[m.jsxs("span",{className:"text-[8px] uppercase font-bold tracking-widest text-slate-400 block leading-none",children:["Day ",n.day]}),m.jsxs("span",{className:"text-xs sm:text-sm font-black font-mono text-slate-200 leading-tight",children:[M,":",x]})]})]}),e&&m.jsxs("div",{className:`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition ${e.queued>0?"bg-amber-500/15 border-amber-500/60 shadow-lg shadow-amber-950/40 animate-pulse":"bg-slate-900/90 border-slate-700/90"}`,children:[m.jsx("span",{className:"text-sm",children:e.queued>0?"⚠️":"🅿️"}),m.jsxs("div",{children:[m.jsx("span",{className:"text-[8px] uppercase font-bold tracking-widest text-slate-400 block leading-none",children:"Bays"}),m.jsxs("span",{className:`text-xs font-black font-mono leading-tight ${e.queued>0?"text-amber-400":"text-slate-200"}`,children:[e.occupied,"/",e.total," ",e.queued>0?`(${e.queued} Q)`:""]})]})]}),m.jsxs("div",{className:"flex items-center bg-slate-900 rounded-xl p-0.5 border border-slate-800",children:[m.jsx("button",{onClick:()=>p(0),className:`p-1.5 rounded-lg text-xs transition ${n.gameSpeed===0?"bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30":"text-slate-400 hover:text-white"}`,title:"Pause Simulation (Space)",children:m.jsx(vC,{className:"w-3 h-3"})}),m.jsx("button",{onClick:()=>p(1),className:`px-2 py-1 rounded-lg text-xs font-bold font-mono transition ${n.gameSpeed===1?"bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30":"text-slate-400 hover:text-white"}`,title:"Normal Speed 1x (Key 1)",children:"1x"}),m.jsx("button",{onClick:()=>p(2),className:`px-2 py-1 rounded-lg text-xs font-bold font-mono transition ${n.gameSpeed===2?"bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30":"text-slate-400 hover:text-white"}`,title:"Fast Speed 2x (Key 2)",children:"2x"}),m.jsx("button",{onClick:()=>p(5),className:`px-2 py-1 rounded-lg text-xs font-bold font-mono transition ${n.gameSpeed===5?"bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30":"text-slate-400 hover:text-white"}`,title:"Hyper Speed 5x (Key 5)",children:"5x"})]}),m.jsxs("button",{onClick:l,className:"flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 px-2.5 py-1.5 rounded-xl transition shadow-md",title:"Customer Reviews & Rating",children:[m.jsx(_h,{className:"w-3.5 h-3.5 fill-amber-400 text-amber-400"}),m.jsx("span",{className:"text-xs sm:text-sm font-bold text-amber-400 font-mono",children:n.reputationStars}),m.jsxs("span",{className:"text-[10px] text-slate-400 font-medium hidden sm:inline",children:["(",n.reviews.length,")"]})]})]}),m.jsxs("div",{className:"flex items-center gap-1.5 shrink-0",children:[m.jsxs("div",{className:"flex items-center gap-1 bg-slate-900/70 p-0.5 rounded-xl border border-slate-800/80",children:[m.jsxs("button",{onClick:i,className:"flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition",title:"Fuel Storage & Tank Management",children:[m.jsx(lo,{className:"w-3 h-3"}),m.jsx("span",{className:"hidden lg:inline",children:"Fuel"}),m.jsxs("span",{className:"text-[9px] px-1 py-0.2 rounded bg-amber-500/20 font-mono",children:[E,"%"]})]}),m.jsxs("button",{onClick:r,className:"flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold transition",title:"Motel Rooms & Housekeeping",children:[m.jsx(nc,{className:"w-3 h-3"}),m.jsx("span",{className:"hidden lg:inline",children:"Motel"})]}),m.jsxs("button",{onClick:s,className:"flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold transition",title:"Staff Hiring & Wages",children:[m.jsx(Sv,{className:"w-3 h-3"}),m.jsx("span",{className:"hidden lg:inline",children:"Staff"}),m.jsx("span",{className:"text-[9px] px-1 py-0.2 rounded bg-blue-500/20 font-mono",children:n.staffManager.staff.length})]})]}),m.jsxs("div",{className:"flex items-center gap-1 bg-slate-900/70 p-0.5 rounded-xl border border-slate-800/80",children:[m.jsxs("button",{onClick:a,className:"flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition",title:"Financial Ledger & Income Statement",children:[m.jsx(yv,{className:"w-3 h-3"}),m.jsx("span",{className:"hidden xl:inline",children:"Ledger"})]}),m.jsxs("button",{onClick:o,className:"flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition",title:"Research & Technology",children:[m.jsx(gv,{className:"w-3 h-3"}),m.jsx("span",{className:"hidden xl:inline",children:"R&D"})]}),m.jsxs("button",{onClick:c,className:"flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-bold transition",title:"Milestone Goals & Objectives",children:[m.jsx(If,{className:"w-3 h-3"}),m.jsx("span",{className:"hidden xl:inline",children:"Goals"})]})]}),m.jsxs("div",{className:"flex items-center gap-1 pl-1 border-l border-slate-800",children:[m.jsx("button",{onClick:g,className:"p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition",title:u?"Unmute Sound":"Mute Sound",children:u?m.jsx(AC,{className:"w-3.5 h-3.5 text-red-400"}):m.jsx(CC,{className:"w-3.5 h-3.5 text-slate-200"})}),m.jsx("button",{onClick:()=>{confirm("Reset scenario and start over?")&&n.resetGame()},className:"p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 transition",title:"Reset Scenario",children:m.jsx(_v,{className:"w-3.5 h-3.5"})})]})]})]})},NC=({engine:n,playerCash:e})=>{const[t,i]=at.useState(!1),r=n.plazaLevel,s=n.getCurrentLevelConfig(),a=n.getNextLevelConfig(),o=n.canUpgradePlazaLevel(),l=a?n.checkDevelopmentPrerequisite(a):{met:!0,details:""},c=()=>{n.upgradePlazaLevel()?me.playFanfare():me.playErrorSound()},h=a&&a.upgradeCost>0?Math.min(100,Math.round(e/a.upgradeCost*100)):100;return m.jsx("div",{className:"fixed bottom-3 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1.5 max-w-3xl w-full px-4 select-none pointer-events-auto",children:m.jsxs("div",{className:"w-full bg-slate-950/90 backdrop-blur-xl border border-slate-700/80 shadow-2xl rounded-2xl p-3 flex flex-col gap-2.5",children:[m.jsxs("div",{className:"flex items-center justify-between gap-3",children:[m.jsxs("div",{className:"flex items-center gap-3",children:[m.jsxs("div",{className:"w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-600/10 border border-amber-400/60 flex flex-col items-center justify-center text-amber-400 font-black shadow-lg",children:[m.jsx("span",{className:"text-[9px] uppercase tracking-tighter text-amber-300",children:"LVL"}),m.jsx("span",{className:"text-base leading-none",children:r})]}),m.jsxs("div",{children:[m.jsxs("div",{className:"flex items-center gap-2",children:[m.jsx("h3",{className:"text-sm font-black text-white tracking-wide",children:s.name}),m.jsx("span",{className:"text-[10px] font-bold text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded-full",children:"100 Levels"})]}),m.jsx("p",{className:"text-xs text-slate-400 truncate max-w-sm hidden sm:block",children:s.subtitle})]})]}),m.jsxs("div",{className:"flex items-center gap-2",children:[a?m.jsxs("button",{onClick:c,disabled:!o.eligible,className:`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${o.eligible?"bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black shadow-amber-500/30 animate-pulse":"bg-slate-900 border border-slate-700/80 text-slate-500 cursor-not-allowed"}`,children:[m.jsx(mv,{className:"w-4 h-4"}),m.jsx("span",{children:o.eligible?`Level Up ($${a.upgradeCost.toLocaleString()})`:`Lvl ${a.level} Locked`})]}):m.jsxs("div",{className:"px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-bold flex items-center gap-1",children:[m.jsx(If,{className:"w-4 h-4"}),m.jsx("span",{children:"Max Level 100"})]}),m.jsx("button",{onClick:()=>i(!t),className:"p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition",title:"Toggle Level Details",children:t?m.jsx(dC,{className:"w-4 h-4"}):m.jsx(hC,{className:"w-4 h-4"})})]})]}),a&&m.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-900/80 border border-slate-800/80 rounded-xl p-2 text-xs",children:[m.jsxs("div",{className:"flex flex-col gap-1",children:[m.jsxs("div",{className:"flex items-center justify-between text-[11px]",children:[m.jsxs("span",{className:"flex items-center gap-1 font-bold text-slate-300",children:[m.jsx(xv,{className:"w-3 h-3 text-emerald-400"}),m.jsx("span",{children:"Required Cash:"})]}),m.jsxs("span",{className:e>=a.upgradeCost?"text-emerald-400 font-bold":"text-slate-400",children:["$",e.toLocaleString()," / $",a.upgradeCost.toLocaleString()]})]}),m.jsx("div",{className:"w-full h-1.5 bg-slate-800 rounded-full overflow-hidden",children:m.jsx("div",{className:"h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300",style:{width:`${h}%`}})})]}),m.jsxs("div",{className:"flex flex-col gap-1",children:[m.jsxs("div",{className:"flex items-center justify-between text-[11px]",children:[m.jsxs("span",{className:"flex items-center gap-1 font-bold text-slate-300",children:[m.jsx(cC,{className:"w-3 h-3 text-cyan-400"}),m.jsx("span",{children:"Development Goal:"})]}),m.jsx("span",{className:l.met?"text-cyan-400 font-bold":"text-amber-400",children:l.details})]}),m.jsxs("div",{className:"flex items-center gap-1 text-[10px] text-slate-400 truncate",children:[l.met?m.jsx(Nf,{className:"w-3 h-3 text-cyan-400 flex-shrink-0"}):m.jsx(pv,{className:"w-3 h-3 text-amber-400 flex-shrink-0"}),m.jsx("span",{className:"truncate",children:a.requiredDev.label})]})]})]}),t&&m.jsxs("div",{className:"pt-2 border-t border-slate-800 flex flex-col gap-2 text-xs",children:[m.jsxs("div",{className:"flex items-center justify-between text-slate-400 text-[11px]",children:[m.jsx("span",{className:"font-bold text-slate-300",children:"Current Level Unlocked Features:"}),m.jsx("span",{className:"text-[10px] text-amber-400/90 font-mono",children:"Tip: Facility upgrades pop up directly in the 3D world"})]}),m.jsx("div",{className:"flex flex-wrap gap-1.5",children:s.unlockedFeatures.map((u,d)=>m.jsxs("span",{className:"px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[11px] flex items-center gap-1",children:[m.jsx(SC,{className:"w-2.5 h-2.5 text-amber-400"}),m.jsx("span",{children:u})]},d))})]})]})})},IC=({engine:n,threeScene:e,onOpenFacilityInspector:t})=>{const[i,r]=at.useState(null),[s,a]=at.useState(null),o=at.useRef();if(at.useEffect(()=>{const h=()=>{var S,T,b;if(!e||!e.camera){o.current=requestAnimationFrame(h);return}const u=e.camera,d=n.economy.cash;n.plazaLevel;const p=n.getNextLevelConfig(),g=[],M=((S=e.bayManager.waitingQueues.get("FUEL"))==null?void 0:S.length)||0,x=((T=e.bayManager.waitingQueues.get("SHOP"))==null?void 0:T.length)||0,f=((b=e.bayManager.waitingQueues.get("MOTEL"))==null?void 0:b.length)||0;if(M>0){const C=1200*n.fuelCapacityLevel;g.push({id:`fuel_urgent_${n.fuelCapacityLevel}`,worldPos:new R(22,7.5,-60),type:"FUEL",title:"🚨 PUMPS FULL! +2 Dispensers",subtitle:`${M} cars waiting! Expand throughput`,cost:C,isUrgent:!0,canAfford:d>=C,priority:1,accentColor:"amber",onAction:()=>{n.upgradeFacilityCapacity("FUEL")?(me.playCashSound(),a(null)):(me.playErrorSound(),t==null||t("FUEL"))}})}else if(x>0){const C=1500*n.storeCapacityLevel;g.push({id:`store_urgent_${n.storeCapacityLevel}`,worldPos:new R(35,7.5,5),type:"SHOP",title:"🚨 STORE FULL! Expand Shelves",subtitle:`${x} customers waiting!`,cost:C,isUrgent:!0,canAfford:d>=C,priority:1,accentColor:"cyan",onAction:()=>{n.upgradeFacilityCapacity("SHOP")?(me.playCashSound(),a(null)):(me.playErrorSound(),t==null||t("SHOP"))}})}else if(f>0){const C=2e3*n.motelCapacityLevel;g.push({id:`motel_urgent_${n.motelCapacityLevel}`,worldPos:new R(35,9.5,75),type:"MOTEL",title:"🚨 NO VACANCY! Add Suites",subtitle:`${f} drivers need sleep!`,cost:C,isUrgent:!0,canAfford:d>=C,priority:1,accentColor:"purple",onAction:()=>{n.upgradeFacilityCapacity("MOTEL")?(me.playCashSound(),a(null)):(me.playErrorSound(),t==null||t("MOTEL"))}})}if(p&&n.canUpgradePlazaLevel().eligible&&g.push({id:`lvl_ready_${p.level}`,worldPos:new R(12,6.5,-25),type:"LEVEL_UP",title:`⭐ LEVEL UP to Level ${p.level}`,subtitle:p.name,cost:p.upgradeCost,canAfford:!0,priority:2,accentColor:"gold",onAction:()=>{n.upgradePlazaLevel()?(me.playFanfare(),a(null)):me.playErrorSound()}}),p){const C=p.requiredDev;if(C.type==="FUEL_CAPACITY"&&n.fuelCapacityLevel<C.value){const _=1200*n.fuelCapacityLevel;d>=_&&g.push({id:`req_fuel_${n.fuelCapacityLevel}`,worldPos:new R(22,7.5,-60),type:"FUEL",title:`⛽ Upgrade Pumps (Lvl ${n.fuelCapacityLevel+1})`,subtitle:`Requirement for Level ${p.level}`,cost:_,canAfford:!0,priority:3,accentColor:"amber",onAction:()=>{n.upgradeFacilityCapacity("FUEL")?(me.playCashSound(),a(null)):me.playErrorSound()}})}else if(C.type==="STORE_CAPACITY"&&n.storeCapacityLevel<C.value){const _=1500*n.storeCapacityLevel;d>=_&&g.push({id:`req_store_${n.storeCapacityLevel}`,worldPos:new R(35,7.5,5),type:"SHOP",title:`🏪 Expand Store (Lvl ${n.storeCapacityLevel+1})`,subtitle:`Requirement for Level ${p.level}`,cost:_,canAfford:!0,priority:3,accentColor:"cyan",onAction:()=>{n.upgradeFacilityCapacity("SHOP")?(me.playCashSound(),a(null)):me.playErrorSound()}})}else C.type==="LAND_PARCELS"&&!n.purchasedParcels.has("plot_north")&&d>=3500&&g.push({id:"req_plot_north",worldPos:new R(40,3.5,-105),type:"PARCEL",title:"🗺️ BUY NORTH COMMERCIAL LAND",subtitle:`Requirement for Level ${p.level}`,cost:3500,canAfford:!0,priority:3,accentColor:"emerald",onAction:()=>{n.buyLandParcel("plot_north")?(me.playCashSound(),a(null)):me.playErrorSound()}})}g.sort((C,_)=>C.priority-_.priority);const v=g.find(C=>C.id!==s)||null;if(!v){r(null),o.current=requestAnimationFrame(h);return}const E=v.worldPos.clone();if(E.project(u),E.z>-1&&E.z<1){const C=(E.x*.5+.5)*window.innerWidth,_=(-(E.y*.5)+.5)*window.innerHeight;C>=20&&C<=window.innerWidth-20&&_>=20&&_<=window.innerHeight-20?r({...v,screenX:C,screenY:_}):r(null)}else r(null);o.current=requestAnimationFrame(h)};return o.current=requestAnimationFrame(h),()=>{o.current&&cancelAnimationFrame(o.current)}},[n,e,s,t]),!i)return null;const l=i.accentColor==="gold",c=i.isUrgent;return m.jsx("div",{className:"absolute inset-0 pointer-events-none z-30 overflow-hidden select-none",children:m.jsxs("div",{style:{transform:`translate3d(${i.screenX}px, ${i.screenY}px, 0) translate(-50%, -100%)`,willChange:"transform"},className:"absolute pointer-events-auto transition-transform duration-75 ease-out pb-2 group",children:[m.jsxs("div",{className:"flex items-center gap-1",children:[m.jsxs("button",{onClick:h=>{h.stopPropagation(),i.onAction()},className:`flex items-center gap-3 px-4 py-2.5 rounded-2xl border-2 backdrop-blur-xl transition-all duration-200 shadow-2xl transform hover:scale-105 active:scale-95 ${c?"bg-gradient-to-r from-red-600/95 to-amber-600/95 border-amber-300 text-white shadow-red-950/80 animate-bounce":l?"bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 border-yellow-100 text-slate-950 font-black shadow-yellow-500/40 animate-pulse ring-4 ring-yellow-400/40":"bg-slate-950/90 hover:bg-slate-900 border-amber-400/80 text-white shadow-black/80 hover:border-amber-300"}`,children:[m.jsxs("div",{className:"flex flex-col text-left",children:[m.jsxs("div",{className:"flex items-center gap-2 font-black text-xs sm:text-sm tracking-wide",children:[m.jsx("span",{children:i.title}),m.jsx(lC,{className:"w-4 h-4 text-white drop-shadow"})]}),i.subtitle&&m.jsx("span",{className:`text-[10px] font-medium opacity-90 ${l?"text-slate-900":"text-slate-300"}`,children:i.subtitle})]}),i.cost>0&&m.jsxs("span",{className:`px-2.5 py-1 rounded-xl text-xs font-black border ${l?"bg-slate-950 text-amber-300 border-slate-800":"bg-amber-500/20 text-amber-300 border-amber-500/40"}`,children:["$",i.cost.toLocaleString()]})]}),m.jsx("button",{onClick:h=>{h.stopPropagation(),a(i.id)},className:"w-6 h-6 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition",title:"Dismiss notification",children:m.jsx(bi,{className:"w-3.5 h-3.5"})})]}),m.jsx("div",{className:`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] mx-auto -mt-0.5 filter drop-shadow ${l?"border-t-yellow-400":c?"border-t-red-500":"border-t-amber-400"}`})]})})},DC=({facilityType:n,engine:e,onClose:t})=>{if(!n)return null;const i=e.economy.cash;let r="",s=m.jsx(lo,{className:"w-5 h-5 text-amber-400"}),a=1,o=1200,l="",c="",h=()=>{};n==="FUEL"?(r="Fuel Pumps & Commercial Lanes",s=m.jsx(lo,{className:"w-5 h-5 text-amber-400"}),a=e.fuelCapacityLevel,o=1200*a,l=`${a*2} Regular & Commercial Diesel Dispensers`,c="+2 Additional High-Flow Fuel Dispensers & Faster Service",h=()=>{e.upgradeFacilityCapacity("FUEL")?me.playCashSound():me.playErrorSound()}):n==="SHOP"?(r="Oasis QuickMart & Route 66 Diner",s=m.jsx(MC,{className:"w-5 h-5 text-cyan-400"}),a=e.storeCapacityLevel,o=1500*a,l=`Level ${a} Merchandising Shelves & Dining Patio`,c="+Expanded Beverage Coolers, Snack Aisles & Patio Seating",h=()=>{e.upgradeFacilityCapacity("SHOP")?me.playCashSound():me.playErrorSound()}):n==="MOTEL"&&(r="Highway Motel Suites & Sleeper Cabins",s=m.jsx(nc,{className:"w-5 h-5 text-purple-400"}),a=e.motelCapacityLevel,o=2e3*a,l=`Level ${a} Soundproof Guest Suites & Trucker Cabins`,c="+Additional Deluxe Rooms & Soundproof Overnight Suites",h=()=>{e.upgradeFacilityCapacity("MOTEL")?me.playCashSound():me.playErrorSound()});const u=i>=o;return m.jsxs("div",{className:"fixed bottom-20 right-4 z-40 w-80 bg-slate-950/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 select-none text-white animate-in slide-in-from-right-4 duration-200",children:[m.jsxs("div",{className:"flex items-center justify-between pb-2 border-b border-slate-800",children:[m.jsxs("div",{className:"flex items-center gap-2.5",children:[m.jsx("div",{className:"w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner",children:s}),m.jsxs("div",{children:[m.jsx("h4",{className:"text-xs font-black tracking-wide text-slate-100",children:r}),m.jsxs("span",{className:"text-[10px] text-amber-400 font-bold",children:["Capacity Level ",a]})]})]}),m.jsx("button",{onClick:t,className:"p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition",title:"Close",children:m.jsx(bi,{className:"w-4 h-4"})})]}),m.jsxs("div",{className:"bg-slate-900/80 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-1.5 text-xs",children:[m.jsxs("div",{className:"flex items-center justify-between text-[11px] text-slate-400",children:[m.jsx("span",{children:"Current Setup:"}),m.jsx("span",{className:"font-bold text-slate-200",children:l})]}),m.jsxs("div",{className:"flex items-center justify-between text-[11px] text-slate-400",children:[m.jsx("span",{children:"Upgrade Perk:"}),m.jsx("span",{className:"font-bold text-emerald-400 text-[10px] truncate max-w-[150px]",children:c})]})]}),m.jsxs("button",{onClick:h,disabled:!u,className:`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-between transition shadow-lg ${u?"bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black shadow-amber-500/20 active:scale-98":"bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed"}`,children:[m.jsxs("span",{className:"flex items-center gap-1.5",children:[m.jsx(mv,{className:"w-4 h-4"}),m.jsxs("span",{children:["Upgrade Capacity (Lvl ",a+1,")"]})]}),m.jsxs("span",{className:"font-mono text-xs",children:["$",o.toLocaleString()]})]})]})},UC=({onPreset:n,onRotate:e,onZoom:t,onReset:i})=>{const[r,s]=at.useState("FUEL"),a=o=>{s(o),n(o)};return m.jsxs("div",{className:"fixed bottom-4 left-4 z-40 flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 p-1.5 rounded-2xl shadow-2xl select-none",children:[m.jsxs("div",{className:"flex items-center gap-1 bg-slate-900/80 rounded-xl p-1 border border-slate-800",children:[m.jsxs("button",{onClick:()=>a("OVERVIEW"),className:`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${r==="OVERVIEW"?"bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30":"text-slate-400 hover:text-white"}`,title:"Full Travel Plaza Overview",children:[m.jsx("span",{children:"🌐"}),m.jsx("span",{className:"hidden sm:inline text-[11px]",children:"Overview"})]}),m.jsxs("button",{onClick:()=>a("FUEL"),className:`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${r==="FUEL"?"bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30":"text-slate-400 hover:text-white"}`,title:"Focus on Fuel Station & Commercial Lanes",children:[m.jsx("span",{children:"⛽"}),m.jsx("span",{className:"hidden sm:inline text-[11px]",children:"Fuel"})]}),m.jsxs("button",{onClick:()=>a("STORE"),className:`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${r==="STORE"?"bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30":"text-slate-400 hover:text-white"}`,title:"Focus on QuickMart Store & Diner",children:[m.jsx("span",{children:"🏪"}),m.jsx("span",{className:"hidden sm:inline text-[11px]",children:"Store"})]}),m.jsxs("button",{onClick:()=>a("MOTEL"),className:`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${r==="MOTEL"?"bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30":"text-slate-400 hover:text-white"}`,title:"Focus on Motel Lodge & Rest Park",children:[m.jsx("span",{children:"🏨"}),m.jsx("span",{className:"hidden sm:inline text-[11px]",children:"Motel"})]})]}),m.jsxs("div",{className:"flex items-center gap-1 pl-1 border-l border-slate-800",children:[m.jsx("button",{onClick:()=>t(.85),className:"p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition",title:"Zoom In",children:m.jsx(RC,{className:"w-3.5 h-3.5"})}),m.jsx("button",{onClick:()=>t(1.15),className:"p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition",title:"Zoom Out",children:m.jsx(PC,{className:"w-3.5 h-3.5"})}),m.jsx("button",{onClick:()=>e(30),className:"p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition",title:"Rotate Left 30°",children:m.jsx(_v,{className:"w-3.5 h-3.5"})}),m.jsx("button",{onClick:()=>e(-30),className:"p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition",title:"Rotate Right 30°",children:m.jsx(yC,{className:"w-3.5 h-3.5"})}),m.jsx("button",{onClick:i,className:"p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 transition",title:"Reset Front View",children:m.jsx(pC,{className:"w-3.5 h-3.5"})})]})]})},FC=({vehicle:n,onClose:e})=>{if(!n)return null;const t={HIGHWAY_APPROACH:"Cruising Interstate 66 Highway",DECIDING_EXIT:"Evaluating Exit 142 Ramp",ENTERING_RAMP:"Exiting via Deceleration Off-Ramp",QUEUING_FOR_PUMP:"Queuing for Fuel Dispenser",REFUELING:"Refueling at Pump Island",AT_MOTEL:"Sleeping in Motel Suite",SHOPPING:"Browsing Oasis QuickMart",EATING:"Dining at Highway Grill",PARKED:"Resting in Commercial Parking Bay",DRIVING_TO_EXIT:"Navigating to On-Ramp",HIGHWAY_LEAVE:"Merging onto Interstate Traffic"},i=r=>{switch(r){case"SEMI_TRUCK":case"REEFER_TRUCK":return"🚛 18-Wheeler Semi-Truck";case"CAMPER_RV":return"🚐 Class-A Motorhome RV";case"ELECTRIC_CAR":return"⚡ Electric Sedan (BEV)";case"SPORTS_CAR":return"🏎️ High-Performance Coupe";case"SUV":return"🚙 4x4 Sport Utility Vehicle";case"MOTORCYCLE":return"🏍️ Cruiser Motorcycle";case"TOUR_BUS":return"🚌 Commercial Highway Coach";default:return"🚗 Midsize Sedan"}};return m.jsxs("div",{className:"fixed top-20 right-4 z-40 w-88 bg-slate-950/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-right-4",children:[m.jsxs("div",{className:"flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3",children:[m.jsxs("div",{className:"flex items-center gap-3",children:[m.jsx("div",{className:"w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg border border-white/20",style:{backgroundColor:n.color},children:"🧑‍✈️"}),m.jsxs("div",{children:[m.jsx("h3",{className:"font-black text-sm text-white font-['Chakra_Petch'] leading-tight",children:n.driverName}),m.jsx("span",{className:"text-[10px] text-amber-400 font-medium",children:i(n.vehicleClass)})]})]}),m.jsx("button",{onClick:()=>{me.playClickSound(),e()},className:"p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition",children:m.jsx(bi,{className:"w-4 h-4"})})]}),m.jsxs("div",{className:"bg-slate-900/90 rounded-xl p-3 mb-3 border border-slate-800 shadow-inner",children:[m.jsxs("div",{className:"flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 mb-1",children:[m.jsxs("span",{className:"flex items-center gap-1",children:[m.jsx(xC,{className:"w-3 h-3 text-sky-400"})," Current Action"]}),m.jsx("span",{className:"font-mono text-emerald-400 font-bold",children:n.speed>.05?"IN TRANSIT":"STATIONARY"})]}),m.jsx("span",{className:"text-xs font-bold text-amber-300 font-['Chakra_Petch'] block leading-snug",children:t[n.state]||n.state})]}),m.jsxs("div",{className:"space-y-2.5 mb-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80",children:[m.jsxs("div",{children:[m.jsxs("div",{className:"flex justify-between text-[11px] mb-1",children:[m.jsxs("span",{className:"text-slate-300 flex items-center gap-1.5 font-medium",children:[m.jsx(lo,{className:"w-3.5 h-3.5 text-amber-400"}),"Tank Level (",n.fuelType,")"]}),m.jsxs("span",{className:"font-mono font-bold text-slate-200",children:[Math.round(n.fuelLevel),"%"]})]}),m.jsx("div",{className:"w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800",children:m.jsx("div",{className:`h-full transition-all ${n.fuelLevel<25?"bg-red-500":"bg-amber-500"}`,style:{width:`${n.fuelLevel}%`}})})]}),m.jsxs("div",{children:[m.jsxs("div",{className:"flex justify-between text-[11px] mb-1",children:[m.jsxs("span",{className:"text-slate-300 flex items-center gap-1.5 font-medium",children:[m.jsx(vv,{className:"w-3.5 h-3.5 text-purple-400"}),"Fatigue & Drowsiness"]}),m.jsxs("span",{className:"font-mono font-bold text-slate-200",children:[Math.round(n.fatigue),"%"]})]}),m.jsx("div",{className:"w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800",children:m.jsx("div",{className:`h-full transition-all ${n.fatigue>70?"bg-red-500":"bg-purple-500"}`,style:{width:`${n.fatigue}%`}})})]}),m.jsxs("div",{children:[m.jsxs("div",{className:"flex justify-between text-[11px] mb-1",children:[m.jsxs("span",{className:"text-slate-300 flex items-center gap-1.5 font-medium",children:[m.jsx(bC,{className:"w-3.5 h-3.5 text-emerald-400"}),"Hunger & Appetite"]}),m.jsxs("span",{className:"font-mono font-bold text-slate-200",children:[Math.round(n.hunger),"%"]})]}),m.jsx("div",{className:"w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800",children:m.jsx("div",{className:"h-full bg-emerald-500 transition-all",style:{width:`${n.hunger}%`}})})]})]}),m.jsxs("div",{className:"flex justify-between items-center bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs",children:[m.jsxs("div",{children:[m.jsx("span",{className:"text-[10px] text-slate-400 uppercase font-bold block",children:"Plaza Spend"}),m.jsxs("span",{className:"font-mono font-black text-sm text-emerald-400",children:["$",n.spentTotal.toFixed(2)]})]}),m.jsxs("div",{className:"text-right",children:[m.jsx("span",{className:"text-[10px] text-slate-400 uppercase font-bold block",children:"Driver Wallet"}),m.jsxs("span",{className:"font-mono text-slate-300 font-bold",children:["$",n.cash.toFixed(0)]})]})]})]})},OC=({fuelStorage:n,isOpen:e,onClose:t})=>{const[,i]=vr.useReducer(l=>l+1,0);if(!e)return null;const r=(l,c)=>{const h=n.tanks[l].retailPricePerLiter;n.setRetailPrice(l,h+c),me.playClickSound(),i()},s=l=>{n.triggerReorder(l),me.playPumpSound(),i()},a=l=>{n.toggleAutoReorder(l),me.playClickSound(),i()},o={REGULAR:{octane:"87 UNLEADED",subtitle:"Standard Gasoline for Passenger Sedans & Compacts",badgeBg:"bg-amber-500 text-slate-950",badgeText:"87"},PREMIUM:{octane:"93 V-POWER",subtitle:"High-Octane Formula for Sports Cars & Luxury SUVs",badgeBg:"bg-red-600 text-white",badgeText:"93"},DIESEL:{octane:"ULTRA-LOW DIESEL #2",subtitle:"High-Torque Commercial Fuel for 18-Wheelers & Reefers",badgeBg:"bg-emerald-600 text-white",badgeText:"DIESEL"},ELECTRIC:{octane:"350kW DC FAST",subtitle:"Ultra-High Voltage Direct Current CCS & NACS Supercharging",badgeBg:"bg-cyan-500 text-slate-950",badgeText:"⚡ 350kW"}};return m.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4",children:m.jsxs("div",{className:"bg-slate-900 border border-amber-500/50 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200",children:[m.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950",children:[m.jsxs("div",{className:"flex items-center gap-3",children:[m.jsx("div",{className:"p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30",children:m.jsx(lo,{className:"w-6 h-6"})}),m.jsxs("div",{children:[m.jsx("h2",{className:"text-xl font-black font-['Chakra_Petch'] text-white tracking-wide",children:"Underground Fuel Terminal & Octane Pricing"}),m.jsxs("div",{className:"flex items-center gap-2 text-xs text-slate-400",children:[m.jsxs("span",{className:"flex items-center gap-1 text-emerald-400 font-mono font-bold",children:[m.jsx(uC,{className:"w-3.5 h-3.5"})," Crude Oil WTI: $",n.getCrudeOilPrice(),"/barrel"]}),m.jsx("span",{children:"• Wholesale Fuel Logistics"})]})]})]}),m.jsx("button",{onClick:()=>{me.playClickSound(),t()},className:"p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition",children:m.jsx(bi,{className:"w-5 h-5"})})]}),m.jsx("div",{className:"p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[75vh] overflow-y-auto",children:["REGULAR","PREMIUM","DIESEL","ELECTRIC"].map(l=>{const c=n.tanks[l],h=Math.round(c.currentLiters/c.maxCapacityLiters*100),u=l==="ELECTRIC",d=o[l];return m.jsxs("div",{className:"bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between shadow-lg",children:[m.jsxs("div",{children:[m.jsx("div",{className:"flex items-start justify-between mb-2",children:m.jsxs("div",{className:"flex items-center gap-2.5",children:[m.jsx("div",{className:`px-2.5 py-1 rounded-md font-black text-xs tracking-tight shadow-md ${d.badgeBg}`,children:d.badgeText}),m.jsxs("div",{children:[m.jsx("h3",{className:"font-black text-sm text-white font-['Chakra_Petch']",children:d.octane}),m.jsx("p",{className:"text-[10px] text-slate-400 leading-tight line-clamp-1",children:d.subtitle})]})]})}),m.jsxs("div",{className:"space-y-1 mb-3 pt-1",children:[m.jsxs("div",{className:"flex justify-between text-[11px] font-mono",children:[m.jsx("span",{className:"text-slate-400",children:"UST Tank Inventory:"}),m.jsx("span",{className:`font-bold ${h<25?"text-red-400":"text-slate-200"}`,children:u?"Continuous Grid Power":`${c.currentLiters.toLocaleString()}L / ${c.maxCapacityLiters.toLocaleString()}L (${h}%)`})]}),m.jsx("div",{className:"w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-700/80 p-0.5",children:m.jsx("div",{className:`h-full rounded-full transition-all duration-300 ${l==="REGULAR"?"bg-amber-500":l==="PREMIUM"?"bg-red-500":l==="DIESEL"?"bg-emerald-500":"bg-cyan-500"}`,style:{width:`${h}%`}})})]}),m.jsxs("div",{className:"grid grid-cols-2 gap-2 text-xs bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 mb-3",children:[m.jsxs("div",{children:[m.jsx("span",{className:"text-slate-400 text-[10px] block font-medium",children:"Wholesale Rack:"}),m.jsxs("span",{className:"font-mono text-slate-200 font-bold",children:["$",c.costPerLiterWholesale.toFixed(2)," / ",u?"kWh":"L"]})]}),m.jsxs("div",{children:[m.jsx("span",{className:"text-slate-400 text-[10px] block font-medium",children:"Plaza Retail Margin:"}),m.jsxs("span",{className:"font-mono text-emerald-400 font-bold",children:["$",c.retailPricePerLiter.toFixed(2)," / ",u?"kWh":"L"]})]})]})]}),m.jsxs("div",{className:"space-y-2 pt-2 border-t border-slate-700/70",children:[m.jsxs("div",{className:"flex items-center justify-between",children:[m.jsx("span",{className:"text-xs text-slate-300 font-medium",children:"Retail Price Adjustment:"}),m.jsxs("div",{className:"flex items-center gap-1.5",children:[m.jsx("button",{onClick:()=>r(l,-.05),className:"px-2.5 py-1 bg-slate-750 hover:bg-slate-700 text-white rounded-lg text-xs font-bold font-mono transition",children:"-$0.05"}),m.jsx("button",{onClick:()=>r(l,.05),className:"px-2.5 py-1 bg-slate-750 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs font-bold font-mono transition",children:"+$0.05"})]})]}),!u&&m.jsxs("div",{className:"flex items-center justify-between pt-1",children:[m.jsxs("button",{onClick:()=>a(l),className:`text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium transition ${c.autoReorder?"bg-emerald-500/20 text-emerald-300 border border-emerald-500/40":"bg-slate-700 text-slate-400"}`,children:[m.jsx(_C,{className:"w-3 h-3"}),"Auto-Refill: ",c.autoReorder?"ACTIVE":"OFF"]}),m.jsxs("button",{onClick:()=>s(l),disabled:c.orderPending||h>90,className:"text-xs px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black font-['Chakra_Petch'] rounded-lg flex items-center gap-1.5 transition shadow-md",children:[m.jsx(EC,{className:"w-3.5 h-3.5"}),c.orderPending?"Tanker In Route...":"Dispatch Tanker"]})]})]})]},l)})}),m.jsxs("div",{className:"px-6 py-3.5 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center",children:[m.jsx("span",{children:"💡 Real-World Tip: Truckers buy 150+ liters of Diesel per fill! Keep diesel margins competitive to attract fleets."}),m.jsx("button",{onClick:()=>{me.playClickSound(),t()},className:"px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition",children:"Confirm & Close"})]})]})})},kC=({roomManager:n,buildings:e,hasHousekeepers:t,isOpen:i,onClose:r})=>{const[,s]=vr.useReducer(l=>l+1,0);if(!i)return null;const a=n.getStats(e),o=(l,c)=>{l==="STANDARD"?n.nightlyRateStandard=Math.max(20,Math.min(250,n.nightlyRateStandard+c)):n.nightlyRateCabin=Math.max(15,Math.min(180,n.nightlyRateCabin+c)),me.playClickSound(),s()};return m.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4",children:m.jsxs("div",{className:"bg-slate-900 border border-purple-500/40 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200",children:[m.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80",children:[m.jsxs("div",{className:"flex items-center gap-3",children:[m.jsx("div",{className:"p-2.5 rounded-xl bg-purple-500/20 text-purple-400",children:m.jsx(nc,{className:"w-6 h-6"})}),m.jsxs("div",{children:[m.jsx("h2",{className:"text-xl font-bold font-['Chakra_Petch'] text-white",children:"Highway Motel & Trucker Sleeper Cabins"}),m.jsx("p",{className:"text-xs text-slate-400",children:"Hospitality Operations, Cleanliness Turnover & Night Rates"})]})]}),m.jsx("button",{onClick:()=>{me.playClickSound(),r()},className:"p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition",children:m.jsx(bi,{className:"w-5 h-5"})})]}),!t&&m.jsxs("div",{className:"mx-6 mt-4 p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl flex items-center gap-3 text-xs text-amber-300",children:[m.jsx(pv,{className:"w-5 h-5 flex-shrink-0 text-amber-400"}),m.jsxs("span",{children:[m.jsx("strong",{children:"Warning:"})," You have no housekeepers on staff! Dirty rooms will remain uncleaned and cannot be rented out until you hire housekeeping staff in the HR panel."]})]}),m.jsxs("div",{className:"p-6 space-y-6 max-h-[75vh] overflow-y-auto",children:[m.jsxs("div",{className:"grid grid-cols-4 gap-3 text-center",children:[m.jsxs("div",{className:"bg-slate-800/60 border border-slate-700 p-3 rounded-xl",children:[m.jsx("span",{className:"text-xs text-slate-400 block mb-1",children:"Total Rooms"}),m.jsx("span",{className:"text-xl font-bold text-white font-mono",children:a.totalRooms})]}),m.jsxs("div",{className:"bg-slate-800/60 border border-slate-700 p-3 rounded-xl",children:[m.jsx("span",{className:"text-xs text-slate-400 block mb-1",children:"Occupied"}),m.jsx("span",{className:"text-xl font-bold text-purple-400 font-mono",children:a.occupiedRooms})]}),m.jsxs("div",{className:"bg-slate-800/60 border border-slate-700 p-3 rounded-xl",children:[m.jsx("span",{className:"text-xs text-slate-400 block mb-1",children:"Vacant Clean"}),m.jsx("span",{className:"text-xl font-bold text-emerald-400 font-mono",children:a.cleanVacantRooms})]}),m.jsxs("div",{className:"bg-slate-800/60 border border-slate-700 p-3 rounded-xl",children:[m.jsx("span",{className:"text-xs text-slate-400 block mb-1",children:"Dirty / Turn"}),m.jsx("span",{className:"text-xl font-bold text-amber-400 font-mono",children:a.dirtyRooms})]})]}),m.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[m.jsxs("div",{className:"bg-slate-800/40 border border-slate-700 p-4 rounded-xl",children:[m.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[m.jsx(nc,{className:"w-5 h-5 text-purple-400"}),m.jsx("span",{className:"font-bold text-sm text-purple-300 font-['Chakra_Petch']",children:"Classic Motel Suites"})]}),m.jsx("p",{className:"text-xs text-slate-400 mb-3",children:"Used by family roadtrippers, vacationers, and tourists."}),m.jsxs("div",{className:"flex items-center justify-between bg-slate-900/80 p-3 rounded-lg",children:[m.jsxs("div",{children:[m.jsx("span",{className:"text-xs text-slate-400 block",children:"Nightly Rate:"}),m.jsxs("span",{className:"text-lg font-bold font-mono text-emerald-400",children:["$",n.nightlyRateStandard]})]}),m.jsxs("div",{className:"flex gap-2",children:[m.jsx("button",{onClick:()=>o("STANDARD",-5),className:"px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold text-xs",children:"-$5"}),m.jsx("button",{onClick:()=>o("STANDARD",5),className:"px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold text-xs",children:"+$5"})]})]})]}),m.jsxs("div",{className:"bg-slate-800/40 border border-slate-700 p-4 rounded-xl",children:[m.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[m.jsx(vv,{className:"w-5 h-5 text-indigo-400"}),m.jsx("span",{className:"font-bold text-sm text-indigo-300 font-['Chakra_Petch']",children:"Soundproof Trucker Cabins"})]}),m.jsx("p",{className:"text-xs text-slate-400 mb-3",children:"High-demand sleeper pods favored by long-haul freight drivers."}),m.jsxs("div",{className:"flex items-center justify-between bg-slate-900/80 p-3 rounded-lg",children:[m.jsxs("div",{children:[m.jsx("span",{className:"text-xs text-slate-400 block",children:"Nightly Rate:"}),m.jsxs("span",{className:"text-lg font-bold font-mono text-emerald-400",children:["$",n.nightlyRateCabin]})]}),m.jsxs("div",{className:"flex gap-2",children:[m.jsx("button",{onClick:()=>o("CABIN",-5),className:"px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold text-xs",children:"-$5"}),m.jsx("button",{onClick:()=>o("CABIN",5),className:"px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold text-xs",children:"+$5"})]})]})]})]})]}),m.jsxs("div",{className:"px-6 py-3 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center",children:[m.jsx("span",{children:"💡 Tip: Sleepers check out in the morning. Fast housekeepers keep occupancy revenue continuous!"}),m.jsx("button",{onClick:()=>{me.playClickSound(),r()},className:"px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg text-xs transition",children:"Done"})]})]})})},BC=({staffManager:n,isOpen:e,onClose:t})=>{const[,i]=vr.useReducer(l=>l+1,0);if(!e)return null;const r=l=>{n.hireStaff(l),me.playCashSound(),i()},s=l=>{n.fireStaff(l),me.playClickSound(),i()},a=(l,c)=>{const h=n.staff.find(u=>u.id===l);h&&(n.setSalary(l,h.salaryPerHour+c),me.playClickSound(),i())},o=n.getHourlySalariesTotal();return m.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4",children:m.jsxs("div",{className:"bg-slate-900 border border-blue-500/40 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200",children:[m.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80",children:[m.jsxs("div",{className:"flex items-center gap-3",children:[m.jsx("div",{className:"p-2.5 rounded-xl bg-blue-500/20 text-blue-400",children:m.jsx(Sv,{className:"w-6 h-6"})}),m.jsxs("div",{children:[m.jsx("h2",{className:"text-xl font-bold font-['Chakra_Petch'] text-white",children:"Human Resources & Staff Roster"}),m.jsxs("p",{className:"text-xs text-slate-400",children:["Total Payroll: $",o,"/hr • ",n.staff.length," Active Employees"]})]})]}),m.jsx("button",{onClick:()=>{me.playClickSound(),t()},className:"p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition",children:m.jsx(bi,{className:"w-5 h-5"})})]}),m.jsxs("div",{className:"p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[75vh] overflow-y-auto",children:[m.jsxs("div",{className:"lg:col-span-2 space-y-3",children:[m.jsxs("h3",{className:"text-xs font-bold uppercase text-slate-400 font-['Chakra_Petch'] mb-2",children:["Current Employees (",n.staff.length,")"]}),n.staff.length===0?m.jsx("div",{className:"p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl",children:"No staff currently hired. Select a role on the right to hire."}):n.staff.map(l=>{const c=Ua[l.role];return m.jsxs("div",{className:"bg-slate-800/60 border border-slate-700/80 rounded-xl p-3.5 flex items-center justify-between",children:[m.jsxs("div",{children:[m.jsxs("div",{className:"flex items-center gap-2",children:[m.jsx("span",{className:"font-bold text-sm text-white",children:l.name}),m.jsx("span",{className:"text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-medium",children:c.title})]}),m.jsxs("div",{className:"flex items-center gap-4 text-xs text-slate-400 mt-1",children:[m.jsxs("span",{children:["Skill: ⭐ ",l.skill,"/10"]}),m.jsxs("span",{children:["Morale: ",l.morale,"%"]}),m.jsxs("span",{className:"text-emerald-400 font-mono font-bold",children:["$",l.salaryPerHour,"/hr"]})]})]}),m.jsxs("div",{className:"flex items-center gap-2",children:[m.jsxs("div",{className:"flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-700",children:[m.jsx("button",{onClick:()=>a(l.id,-1),className:"px-2 py-1 text-slate-400 hover:text-white text-xs font-bold",title:"Decrease wage",children:"-$1"}),m.jsx("button",{onClick:()=>a(l.id,1),className:"px-2 py-1 text-emerald-400 hover:text-emerald-300 text-xs font-bold",title:"Give raise",children:"+$1"})]}),m.jsx("button",{onClick:()=>s(l.id),className:"p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition",title:"Fire employee",children:m.jsx(wC,{className:"w-4 h-4"})})]})]},l.id)})]}),m.jsxs("div",{className:"space-y-3",children:[m.jsx("h3",{className:"text-xs font-bold uppercase text-slate-400 font-['Chakra_Petch'] mb-2",children:"Hire New Roles"}),Object.keys(Ua).map(l=>{const c=Ua[l];return m.jsxs("div",{className:"bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 flex flex-col justify-between",children:[m.jsxs("div",{className:"mb-2",children:[m.jsxs("div",{className:"flex items-center justify-between",children:[m.jsx("span",{className:"font-bold text-xs text-slate-200",children:c.title}),m.jsxs("span",{className:"text-xs text-emerald-400 font-mono font-bold",children:["$",c.defaultSalary,"/hr"]})]}),m.jsx("p",{className:"text-[11px] text-slate-400 mt-1 leading-snug",children:c.description})]}),m.jsxs("button",{onClick:()=>r(l),className:"w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition",children:[m.jsx(TC,{className:"w-3.5 h-3.5"}),"Hire Candidate"]})]},l)})]})]}),m.jsxs("div",{className:"px-6 py-3 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center",children:[m.jsx("span",{children:"💡 Tip: Fair wages keep morale high, boosting speed and customer satisfaction scores!"}),m.jsx("button",{onClick:()=>{me.playClickSound(),t()},className:"px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg text-xs transition",children:"Done"})]})]})})},zC=({economy:n,currentDay:e,isOpen:t,onClose:i})=>{const[,r]=vr.useReducer(l=>l+1,0);if(!t)return null;const s=(l,c)=>{n.takeLoan(c,l,.08,14)&&(me.playCashSound(),r())},a=n.getDailyNetProfit(e),o=n.getCategoryBreakdown(e);return m.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4",children:m.jsxs("div",{className:"bg-slate-900 border border-emerald-500/40 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200",children:[m.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80",children:[m.jsxs("div",{className:"flex items-center gap-3",children:[m.jsx("div",{className:"p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400",children:m.jsx(yv,{className:"w-6 h-6"})}),m.jsxs("div",{children:[m.jsx("h2",{className:"text-xl font-bold font-['Chakra_Petch'] text-white",children:"Financial Ledger & Bank Loans"}),m.jsxs("p",{className:"text-xs text-slate-400",children:["Current Capital: ",m.jsxs("span",{className:"text-emerald-400 font-bold font-mono",children:["$",n.cash.toLocaleString()]})," • Day ",e," Net:",m.jsx("span",{className:`font-mono font-bold ml-1 ${a>=0?"text-emerald-400":"text-red-400"}`,children:a>=0?`+$${a.toFixed(2)}`:`-$${Math.abs(a).toFixed(2)}`})]})]})]}),m.jsx("button",{onClick:()=>{me.playClickSound(),i()},className:"p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition",children:m.jsx(bi,{className:"w-5 h-5"})})]}),m.jsxs("div",{className:"p-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[75vh] overflow-y-auto",children:[m.jsxs("div",{className:"space-y-4",children:[m.jsxs("h3",{className:"text-xs font-bold uppercase text-slate-400 font-['Chakra_Petch']",children:["Day ",e," Income / Expense"]}),m.jsxs("div",{className:"bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 space-y-2 text-xs",children:[Object.entries(o).map(([l,c])=>m.jsxs("div",{className:"flex justify-between items-center py-1 border-b border-slate-800",children:[m.jsx("span",{className:"text-slate-300 font-medium",children:l}),m.jsxs("div",{className:"text-right font-mono",children:[c.income>0&&m.jsxs("span",{className:"text-emerald-400 block",children:["+$",c.income.toFixed(2)]}),c.expense>0&&m.jsxs("span",{className:"text-red-400 block",children:["-$",c.expense.toFixed(2)]})]})]},l)),Object.keys(o).length===0&&m.jsx("p",{className:"text-slate-500 text-center py-4",children:"No transactions recorded yet today."})]}),m.jsx("h3",{className:"text-xs font-bold uppercase text-slate-400 font-['Chakra_Petch'] pt-2",children:"Commercial Credit Lines"}),m.jsxs("div",{className:"space-y-2",children:[m.jsxs("button",{onClick:()=>s(15e3,"Small Business Line"),disabled:n.activeLoans.length>=3,className:"w-full p-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-xl border border-slate-700 text-left transition",children:[m.jsxs("div",{className:"flex justify-between items-center text-xs font-bold text-white",children:[m.jsx("span",{children:"$15,000 Working Capital"}),m.jsx("span",{className:"text-amber-400 font-mono",children:"8% Int."})]}),m.jsx("p",{className:"text-[11px] text-slate-400 mt-0.5",children:"14-day repayment schedule"})]}),m.jsxs("button",{onClick:()=>s(4e4,"Highway Expansion Facility"),disabled:n.activeLoans.length>=3,className:"w-full p-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-xl border border-slate-700 text-left transition",children:[m.jsxs("div",{className:"flex justify-between items-center text-xs font-bold text-white",children:[m.jsx("span",{children:"$40,000 Highway Facility"}),m.jsx("span",{className:"text-amber-400 font-mono",children:"8% Int."})]}),m.jsx("p",{className:"text-[11px] text-slate-400 mt-0.5",children:"14-day repayment schedule"})]})]})]}),m.jsxs("div",{className:"md:col-span-2 space-y-2",children:[m.jsx("h3",{className:"text-xs font-bold uppercase text-slate-400 font-['Chakra_Petch']",children:"Live Transaction Stream"}),m.jsx("div",{className:"bg-slate-950/60 border border-slate-800 rounded-xl p-3 max-h-96 overflow-y-auto space-y-2 font-mono text-xs",children:n.records.slice(0,40).map((l,c)=>m.jsxs("div",{className:"flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800/80",children:[m.jsxs("div",{className:"flex items-center gap-2",children:[m.jsxs("span",{className:"text-slate-500 text-[10px]",children:["D",l.day," ",l.hour,":00"]}),m.jsx("span",{className:"text-slate-200 text-xs truncate max-w-xs",children:l.description})]}),m.jsx("span",{className:`font-bold ${l.amount>=0?"text-emerald-400":"text-red-400"}`,children:l.amount>=0?`+$${l.amount.toFixed(2)}`:`-$${Math.abs(l.amount).toFixed(2)}`})]},c))})]})]}),m.jsxs("div",{className:"px-6 py-3 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center",children:[m.jsx("span",{children:"💡 Tip: Take loans early to expand pumps and cabins, accelerating daily cashflow."}),m.jsx("button",{onClick:()=>{me.playClickSound(),i()},className:"px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg text-xs transition",children:"Done"})]})]})})},VC=[{id:"HIGH_FLOW_NOZZLES",name:"High-Flow Dispenser Nozzles",cost:3e3,category:"EFFICIENCY",description:"Increases fuel pump transfer rate by +40%, cutting queue times significantly.",unlocked:!1,prerequisites:[],effectDescription:"+40% Refueling Speed"},{id:"AUTOMATED_BILLING",name:"Pay-at-the-Pump Terminals",cost:4500,category:"EFFICIENCY",description:"Drivers can tap-and-pay directly at pumps, freeing cashiers to service store customers.",unlocked:!1,prerequisites:["HIGH_FLOW_NOZZLES"],effectDescription:"Customers pay instantly at pumps"},{id:"MEMO_FOAM_MATTRESSES",name:"Orthopedic Sleep Beds",cost:5e3,category:"LUXURY",description:"Upgrades motel beds to NASA-grade memory foam, boosting motel guest satisfaction by +35%.",unlocked:!1,prerequisites:[],effectDescription:"+35% Motel Satisfaction & +$15/night room rate"},{id:"EXPRESS_CHECKOUT",name:"Self-Service Mart Kiosks",cost:6500,category:"EFFICIENCY",description:"Reduces convenience store checkout queues by 50% through automated scanning.",unlocked:!1,prerequisites:["AUTOMATED_BILLING"],effectDescription:"Doubles Store Checkout Capacity"},{id:"ROADSIDE_MEGA_NEON",name:"10-Mile Radar Neon Beacon",cost:8e3,category:"MARKETING",description:"Draws weary cross-country long-haulers off the interstate even in poor weather.",unlocked:!1,prerequisites:[],effectDescription:"+30% Highway Exit Traffic Volume"},{id:"SOLAR_CANOPY",name:"Solar Canopy Microgrid",cost:12e3,category:"CAPACITY",description:"Rooftop photovoltaic arrays power all EV stations and lower daily electricity upkeep by 50%.",unlocked:!1,prerequisites:["AUTOMATED_BILLING"],effectDescription:"-50% Daily Building Utility Upkeep"}],HC=({engine:n,isOpen:e,onClose:t})=>{const[,i]=vr.useReducer(s=>s+1,0);if(!e)return null;const r=(s,a)=>{n.unlockTech(s,a)&&i()};return m.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4",children:m.jsxs("div",{className:"bg-slate-900 border border-cyan-500/40 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200",children:[m.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80",children:[m.jsxs("div",{className:"flex items-center gap-3",children:[m.jsx("div",{className:"p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400",children:m.jsx(gv,{className:"w-6 h-6"})}),m.jsxs("div",{children:[m.jsx("h2",{className:"text-xl font-bold font-['Chakra_Petch'] text-white",children:"R&D Technology Tree"}),m.jsx("p",{className:"text-xs text-slate-400",children:"Unlock Automation, Throughput Upgrades & Solar Microgrids"})]})]}),m.jsx("button",{onClick:()=>{me.playClickSound(),t()},className:"p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition",children:m.jsx(bi,{className:"w-5 h-5"})})]}),m.jsx("div",{className:"p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[75vh] overflow-y-auto",children:VC.map(s=>{const a=n.unlockedTechIds.has(s.id),o=n.economy.canAfford(s.cost),l=s.prerequisites.every(h=>n.unlockedTechIds.has(h)),c=!a&&o&&l;return m.jsxs("div",{className:`p-4 rounded-xl border flex flex-col justify-between transition ${a?"bg-emerald-950/20 border-emerald-500/40":l?"bg-slate-800/60 border-slate-700":"bg-slate-950/40 border-slate-800 opacity-60"}`,children:[m.jsxs("div",{children:[m.jsxs("div",{className:"flex items-center justify-between mb-1.5",children:[m.jsx("span",{className:"font-bold text-sm text-white font-['Chakra_Petch']",children:s.name}),a?m.jsxs("span",{className:"flex items-center gap-1 text-xs text-emerald-400 font-bold",children:[m.jsx(Nf,{className:"w-4 h-4"})," Active"]}):l?m.jsxs("span",{className:"text-xs font-mono font-bold text-amber-400",children:["$",s.cost.toLocaleString()]}):m.jsxs("span",{className:"flex items-center gap-1 text-xs text-slate-500",children:[m.jsx(mC,{className:"w-3.5 h-3.5"})," Locked"]})]}),m.jsx("p",{className:"text-xs text-slate-400 mb-2",children:s.description}),m.jsxs("div",{className:"inline-block px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[11px] font-medium mb-3",children:["⚡ ",s.effectDescription]})]}),!a&&m.jsx("button",{onClick:()=>r(s.id,s.cost),disabled:!c,className:`w-full py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${c?"bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20":"bg-slate-800 text-slate-500 cursor-not-allowed"}`,children:l?o?`Unlock Upgrade ($${s.cost.toLocaleString()})`:"Insufficient Funds":"Requires Prior Technology"})]},s.id)})}),m.jsxs("div",{className:"px-6 py-3 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center",children:[m.jsx("span",{children:"💡 Solar Canopies cut your building electrical bills in half forever!"}),m.jsx("button",{onClick:()=>{me.playClickSound(),t()},className:"px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg text-xs transition",children:"Done"})]})]})})},GC=({reviews:n,reputationStars:e,isOpen:t,onClose:i})=>t?m.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4",children:m.jsxs("div",{className:"bg-slate-900 border border-yellow-500/40 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200",children:[m.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80",children:[m.jsxs("div",{className:"flex items-center gap-3",children:[m.jsx("div",{className:"p-2.5 rounded-xl bg-yellow-500/20 text-yellow-400",children:m.jsx(gC,{className:"w-6 h-6"})}),m.jsxs("div",{children:[m.jsx("h2",{className:"text-xl font-bold font-['Chakra_Petch'] text-white",children:"HighwayYelp Traveler Reviews"}),m.jsxs("div",{className:"flex items-center gap-1.5 text-xs text-slate-400",children:[m.jsxs("span",{className:"font-bold text-yellow-400 flex items-center gap-0.5",children:[m.jsx(_h,{className:"w-3.5 h-3.5 fill-yellow-400"})," ",e," / 5.0"]}),m.jsxs("span",{children:["• Based on ",n.length," traveler opinions"]})]})]})]}),m.jsx("button",{onClick:()=>{me.playClickSound(),i()},className:"p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition",children:m.jsx(bi,{className:"w-5 h-5"})})]}),m.jsx("div",{className:"p-6 space-y-3 max-h-[75vh] overflow-y-auto",children:n.length===0?m.jsx("div",{className:"p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl",children:"No reviews left by highway travelers yet. Customers will leave feedback as they refuel, sleep, and visit stores."}):n.map(r=>m.jsxs("div",{className:"bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-1.5",children:[m.jsxs("div",{className:"flex items-center justify-between",children:[m.jsx("span",{className:"font-bold text-sm text-slate-200",children:r.author}),m.jsx("div",{className:"flex items-center text-yellow-400",children:Array.from({length:5}).map((s,a)=>m.jsx(_h,{className:`w-3.5 h-3.5 ${a<r.stars?"fill-yellow-400":"text-slate-600"}`},a))})]}),m.jsxs("p",{className:"text-xs text-slate-300 italic",children:['"',r.text,'"']}),m.jsxs("div",{className:"flex gap-1.5 pt-1",children:[r.tags.map(s=>m.jsxs("span",{className:"text-[10px] px-2 py-0.5 rounded bg-slate-700/80 text-slate-400 uppercase font-mono",children:["#",s]},s)),m.jsxs("span",{className:"text-[10px] text-slate-500 ml-auto font-mono",children:["Day ",r.day," • ",r.hour,":00"]})]})]},r.id))}),m.jsxs("div",{className:"px-6 py-3 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center",children:[m.jsx("span",{children:"💡 Maintain clean rooms and fast queues to keep your Yelp score above 4.0!"}),m.jsx("button",{onClick:()=>{me.playClickSound(),i()},className:"px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg text-xs transition",children:"Done"})]})]})}):null,WC=({scenario:n,isOpen:e,onClose:t})=>e?m.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4",children:m.jsxs("div",{className:"bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200",children:[m.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80",children:[m.jsxs("div",{className:"flex items-center gap-3",children:[m.jsx("div",{className:"p-2.5 rounded-xl bg-amber-500/20 text-amber-400",children:m.jsx(If,{className:"w-6 h-6"})}),m.jsxs("div",{children:[m.jsx("h2",{className:"text-xl font-bold font-['Chakra_Petch'] text-white",children:n.name}),m.jsx("p",{className:"text-xs text-slate-400",children:n.subtitle})]})]}),m.jsx("button",{onClick:()=>{me.playClickSound(),t()},className:"p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition",children:m.jsx(bi,{className:"w-5 h-5"})})]}),m.jsxs("div",{className:"p-6 space-y-4 max-h-[75vh] overflow-y-auto",children:[m.jsx("p",{className:"text-sm text-slate-300 leading-relaxed bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/60",children:n.description}),m.jsx("h3",{className:"text-xs font-bold uppercase text-slate-400 font-['Chakra_Petch'] pt-2",children:"Mission Objectives"}),m.jsx("div",{className:"space-y-2.5",children:n.objectives.map(i=>{const r=Math.min(100,Math.round(i.current/i.target*100));return m.jsxs("div",{className:`p-3 rounded-xl border ${i.completed?"bg-emerald-950/20 border-emerald-500/40":"bg-slate-800/40 border-slate-700/60"}`,children:[m.jsxs("div",{className:"flex items-center justify-between mb-1.5",children:[m.jsxs("div",{className:"flex items-center gap-2",children:[i.completed?m.jsx(Nf,{className:"w-4 h-4 text-emerald-400"}):m.jsx(fC,{className:"w-4 h-4 text-slate-500"}),m.jsx("span",{className:`text-xs font-bold ${i.completed?"text-emerald-300":"text-slate-200"}`,children:i.description})]}),m.jsxs("span",{className:"text-xs font-mono text-slate-400",children:[i.current," / ",i.target]})]}),m.jsx("div",{className:"w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800",children:m.jsx("div",{className:`h-full ${i.completed?"bg-emerald-500":"bg-amber-500"} transition-all`,style:{width:`${r}%`}})})]},i.id)})})]}),m.jsxs("div",{className:"px-6 py-3 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center",children:[m.jsx("span",{children:"Complete all objectives to secure your franchise dominance!"}),m.jsx("button",{onClick:()=>{me.playClickSound(),t()},className:"px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg text-xs transition",children:"Close"})]})]})}):null;function jC(){var I;const n=at.useRef(null),e=at.useRef(null),t=at.useRef(null);e.current||(e.current=new Ex);const i=e.current,[,r]=at.useState(0),[s,a]=at.useState(null),[o,l]=at.useState(!1),[c,h]=at.useState(null),[u,d]=at.useState(null),[p,g]=at.useState(!1),[M,x]=at.useState(!1),[f,v]=at.useState(!1),[E,S]=at.useState(!1),[T,b]=at.useState(!1),[C,_]=at.useState(!1),[A,L]=at.useState(!1);return at.useEffect(()=>{const N=n.current;if(!N)return;const k=new rC(N,i);k.onSelectFacility=B=>{d(B)},t.current=k;const D=()=>{k.handleResize()};window.addEventListener("resize",D);let V=performance.now(),q,$=0;const H=B=>{const j=Math.min(.08,(B-V)/1e3);V=B,i.tick(j),k.render(j),$+=j,$>=.25&&($=0,r(J=>J+1)),q=requestAnimationFrame(H)};return q=requestAnimationFrame(H),()=>{cancelAnimationFrame(q),window.removeEventListener("resize",D),k.destroy()}},[i]),at.useEffect(()=>{var N;(N=t.current)!=null&&N.buildingPlacer&&(t.current.buildingPlacer.setActiveDef(s),t.current.buildingPlacer.setDemolishMode(o))},[s,o]),at.useEffect(()=>{const N=k=>{k.key==="Escape"?(a(null),l(!1),h(null),me.playClickSound()):k.key===" "?(i.gameSpeed=i.gameSpeed===0?1:0,me.playClickSound()):k.key==="1"?(i.gameSpeed=1,me.playClickSound()):k.key==="2"?(i.gameSpeed=2,me.playClickSound()):k.key==="5"&&(i.gameSpeed=5,me.playClickSound())};return window.addEventListener("keydown",N),()=>window.removeEventListener("keydown",N)},[i]),m.jsxs("div",{className:"relative w-screen h-screen overflow-hidden bg-slate-950 font-['Plus_Jakarta_Sans'] select-none",children:[m.jsx("canvas",{ref:n,className:"block w-full h-full cursor-grab active:cursor-grabbing"}),m.jsx(IC,{engine:i,threeScene:t.current,onOpenFacilityInspector:N=>d(N)}),m.jsx(DC,{facilityType:u,engine:i,onClose:()=>d(null)}),m.jsx(UC,{onPreset:N=>{var k;return(k=t.current)==null?void 0:k.setCameraPreset(N)},onRotate:N=>{var k;return(k=t.current)==null?void 0:k.rotateCamera(N)},onZoom:N=>{var k;return(k=t.current)==null?void 0:k.zoomCamera(N)},onReset:()=>{var N;return(N=t.current)==null?void 0:N.resetToPhotoView()}}),m.jsx(LC,{engine:i,bayStats:(I=t.current)==null?void 0:I.bayManager.getTotalStats(),onResetCamera:()=>{var N;return(N=t.current)==null?void 0:N.resetToPhotoView()},onOpenFuel:()=>g(!0),onOpenMotel:()=>x(!0),onOpenStaff:()=>v(!0),onOpenFinance:()=>S(!0),onOpenTechTree:()=>b(!0),onOpenReviews:()=>_(!0),onOpenObjectives:()=>L(!0)}),m.jsx(NC,{engine:i,playerCash:i.economy.cash}),m.jsx(FC,{vehicle:c,onClose:()=>h(null)}),m.jsx(OC,{fuelStorage:i.fuelStorage,isOpen:p,onClose:()=>g(!1)}),m.jsx(kC,{roomManager:i.roomManager,buildings:i.buildings,hasHousekeepers:i.staffManager.hasActiveHousekeeper(),isOpen:M,onClose:()=>x(!1)}),m.jsx(BC,{staffManager:i.staffManager,isOpen:f,onClose:()=>v(!1)}),m.jsx(zC,{economy:i.economy,currentDay:i.day,isOpen:E,onClose:()=>S(!1)}),m.jsx(HC,{engine:i,isOpen:T,onClose:()=>b(!1)}),m.jsx(GC,{reviews:i.reviews,reputationStars:i.reputationStars,isOpen:C,onClose:()=>_(!1)}),m.jsx(WC,{scenario:i.scenario,isOpen:A,onClose:()=>L(!1)})]})}Fu.createRoot(document.getElementById("root")).render(m.jsx(vr.StrictMode,{children:m.jsx(jC,{})}));
