 /*
        
     __|           
     _|    \   _` |
    ___|_| _|\__, |
             ____/ 

    Create by: ukungzulfah ( Eng Javascript Engine )
    
*/
!function(window,document,undefined){"use strict";function addServiceDataTransport(e){for(var t=!1,n=0;n<dataTransport.length;n++)if(dataTransport[n].url=e.url){t=!0;break}return t?getDataTransportByKeys(e.url):(dataTransport.push(e),getDataTransportByKeys(e.url))}function getDataTransportByKeys(e){for(var t={},n=0;n<dataTransport.length;n++)if(e===dataTransport[n].url){t=dataTransport[n].data;break}return t}function getRoute(){var e="",t=function(e){e=e.split("/");for(var t=[],n=0;n<e.length;n++)e[n]&&t.push(e[n]);return t},n=window.location.hash||"/";n=n.replace("#","");var a=!1;return $.each(dataRoute,function(o,r){if(!a)if(o===n)a=!0,e=o;else{var i=t(n),c=t(o);if(i.length>=c.length)for(var u=0;u<i.length;u++)i[u]!==c[u]&&"*"===c[u]&&(e||(e=o));else n+"*"===o&&(e=n+"*")}}),e}function goRoute(){var e=window.location.hash.replace("#",""),t=getRoute();if(!t)return!1;var n=dataRoute[t],a=(getArguments(n),n.apply(this,[e])),o=eng.ell("div").attr({controller:a.controller});$('[route="'+a.target+'"]').html(o),a.templateUrl&&$.ajax({url:a.templateUrl,type:a.method||"GET",data:a.data||{},success:function(e){o.html(e),dataController[a.controller].$root.route={},$.extend(dataController[a.controller].$root.route,a),eng.controller(a.controller,dataController[a.controller].callback)}})}function imReady(e){$(document).ready(e)}function _controller(e,t){var n=$("[controller='"+e+"']"),a=dataController[e]?dataController[e].$root:{};if(dataController[e]={callback:t,$root:a},!n.length)return!1;if(!isHtml(n))return console.log("Component failed"),!1;a.$get=function(e,t){var n=this;if(ajaxOnload){if("object"==typeof e){if(e.type="GET",e.target){var o=e.success||function(e){return e};e.success=null;var r=function(t){var t=o(t,a);$(e.target).html(t),setTimeout(function(){n.$reset($(e.target))})};e.success=r}$.ajax(e)}return!1}},a.$post=function(e,t){var n=this;if(ajaxOnload){if("object"==typeof e){if(e.type="POST",e.target){var o=e.success||function(e){return e};e.success=null;var r=function(t){var t=o(t,a);$(e.target).html(t),setTimeout(function(){n.$reset($(e.target))})};e.success=r}$.ajax(e)}return!1}};var o=getArguments(t),r=[],i=function(){return r=[],$.each(o,function(e,t){switch(t){case"$root":r.push(a);break;case"$filter":r.push(dataFilter);break;default:dataCollection[t]&&r.push(dataCollection[t]),dataConfig[t]&&r.push(dataConfig[t]),dataService[t]&&r.push(dataService[t]),dataModule[t]&&r.push(new dataModule[t](a)),dataFactory[t]&&r.push(applyFactoryInjectFunction(dataFactory[t],a))}}),r};i();var c=function(){i(),t.apply(a,r),setDocumentDirective(n,a),setTagDirectiveEvents(n,a);var e=getInitComponents(n,a);$.each(e,function(e,t){a[e]?t||(a[e]=t||a[e]):a[e]=t});var o=backupAttributesAndTextComponents(n);setDataComponentBackup(o,a),setElementModel(n,a),setDefaultEvent(n,a),setEventListener(n,a),a.watch=function(e,t){watchRoot[e]=t},EachData(n,a),a.$reload=function(){setElementModel(n,a),setDataComponentBackup(o,a),setTagDirectiveEvents(n,a),EachData(n,a)},a.$reset=function(e){var t=getInitComponents(e);$.extend(a,t);var n=backupAttributesAndTextComponents(e);$.each(n,function(e,t){o.push(t)}),setDataComponentBackup(o,a),setElementModel(e,a),setDefaultEvent(e,a),setEventListener(e,a),setDataComponentBackup(o,a)},a.$reload()};if(dataTransport.length){var u=function(e,t){if(e[t])switch(e[t].mode){case"getJSON":e[t].asLoad?u(e,t+1):(e[t].asLoad=!0,$.getJSON(e[t].url,function(n){e[t].data=n,u(e,t+1)}));break;case"get":$.ajax({type:"GET",url:e[t].url,data:e[t].dataSend||{},success:function(n){dataTransport[t].data=n,u(e,t+1)}});break;case"post":$.ajax({type:"POST",url:e[t].url,data:e[t].dataSend||{},success:function(n){dataTransport[t].data=n,u(e,t+1)}})}else ajaxOnload=!0,c()};u(dataTransport,0)}else ajaxOnload=!0,c();return a.tpl=function(e){var t=$('script[name="'+e+'"]')[0].innerHTML;return t?void $('[template="'+e+'"]').each(function(e,n){var o=ell("div").attr("eng-template","generate").append(t);$(n).html(o),a.$reset(o)}):!1},startup=!0,eng}function _config(e,t){return dataConfig[e]=t,eng}function _module(e,t){return dataModule[e]=t,eng}function _service(e,t){return dataService[e]=t(),eng}function _factory(e,t){return dataFactory[e]=t,eng}function _filter(e,t){return dataFilter[e]=t,eng}function _directive(e,t){return dataDirective[e]=t,eng}function _tagDirective(e,t){return dataTagDirective[e]=t,eng}function _template(e,t){return dataTemplate[e]=t,eng}function _defaultEvent(e,t){return defaultInputEvent[e]=t,eng}function _store(e,t){}function _collection(e,t){return dataCollection[e]=new Collection(t),eng}function _route(e,t){return dataRoute[e]=t,eng}function EachData(e,t){var n=function(e){if(e=$(e),e.attr("each")){var a=e.attr("each"),o=getCommandEach(a,t),r=function(){var n=getCommandEach(a,t);n.model&&(dataTableReady[n.model]=n.data.length),e.data("execute",!0);e.clone();e.empty();if(n.advance.sort){var o=codeRecognize(n.advance.sort,t),i=n.advance.sortBy;i?(i=codeRecognize(n.advance.sortBy,t),i&&(n.data=dataFilter.sorting(n.data,{sort:o,key:i}))):o?n.data.sort():n.data.sort().reverse(),t.watch(n.advance.sort,function(e){r()}),t.watch(n.advance.sortBy,function(e){r()})}n.advance.filter&&(n.data=filterEach(n.data,codeRecognize(n.advance.filter,t),n.isHtml),t.watch(n.advance.filter,function(e){r()})),n.val||(n.val=n.key,n.key="");var c=0;$.each(n.data,function(a,o){var r={};r[n.val]=o,r.$index=a,r[n.key||"$index"]=a,r.$num=c,r.isHtml=n.isHtml,n.isHtml&&(r[n.val]=$(o).clone()[0].outerHTML),bootEach(e.data("template-each"),r,e,t,n,a),c++}),n.advance.count&&(t[n.advance.count]=c),setTimeout(function(){t.$reset(e)})};e.data("execute")?o.model&&t[o.model]&&dataTableReady[o.model]!=t[o.model].length&&r():r()}else setTimeout(function(){$.each(e[0].childNodes,function(e,t){"#text"!==t.nodeName&&n(t)})})};n(e)}function bootEach(e,t,n,a,o,r){if(t.isHtml){var i=searchMagicQuout(e),c=inlineRecognize(e,i,t);n.append(c)}else{e=$(e),e.find("*").each(function(e,t){$(t).data("root",o.model)});var u=backupAttributesAndTextComponents(e);setDataComponentBackup(u,t),n.append(e),EachData(e,t)}}function getCommandEach(eachCommand,root){eachCommand=eachCommand.split("|");var commands=eachCommand[0].split(" in ");if(1===commands.length){var dataX=commands[0];commands[0]="keygen_"+parseInt(10*Math.random()),commands[1]=dataX}var dataBinding=commands[1].replace(/[ ]/g,""),args=commands[0].replace(/[\(\)]/g,""),keyArgs=0;if(args.indexOf(",")>0){var arrArgs=args.split(",");args=arrArgs[1],keyArgs=arrArgs[0]}var advanceCommands={};eachCommand[1]&&$.each(eachCommand[1].split(","),function(e,t){var n=t.split("="),a=n[0].replace(/[ ]/g,"");advanceCommands[a]=n[1].indexOf(["'",'"'])?n[1].replace(/[ ]/g,""):n[1]});var rootDataBinding=root;dataBinding.split(".").length>1&&dataBinding.indexOf("$")<0?$.each(dataBinding.split("."),function(e,t){rootDataBinding=rootDataBinding[t]}):rootDataBinding="undefined"==typeof root[dataBinding]?eval(dataBinding):""===root[dataBinding]?[]:root[dataBinding];var htmlEach=!1;if(dataBinding.indexOf("$")>=0&&(htmlEach=!0),keyArgs)args=args.replace(/[ ]/g,"");else if(args.indexOf(" ")>=0){var arrArgs=args.split(" "),newArgs=[];$.each(arrArgs,function(e,t){t&&newArgs.push(t)}),keyArgs=newArgs[0],args=newArgs[1]}var cmd={data:rootDataBinding,val:args,key:keyArgs,advance:advanceCommands,isHtml:htmlEach,model:dataBinding||""};return cmd}function filterEach(e,t,n){var a=e instanceof Array?[]:{};return $.each(e,function(o,r){var i=n?$(r).text():JSON.stringify(r);i.indexOf(t)>=0&&(e instanceof Array?a.push(r):a[o]=r)}),a}function setDocumentDirective(e,t){var n=function(a){if(a.tagName&&"script"===a.tagName.toLowerCase())return!1;if($(a).attr("controller")&&e!=a)return!1;if(a=$(a),dataDirective[a[0].localName]){var o=getALlAttributes(a);return dataDirective[a[0].localName](t,a,o)}$.each(a[0].attributes,function(e,n){if(dataDirective[n.nodeName]){var o=getALlAttributes(a);return dataDirective[n.nodeName](t,a,o)}}),"radio"===a[0].type&&a.attr("model")&&!a.attr("name")&&a.attr("name",a.attr("model")),$.each(a[0].childNodes,function(e,t){"#text"!==t.nodeName&&n(t)})};n(e)}function getInitComponents(nodes,root){function _getInitComponents(e){return e.tagName&&"script"===e.tagName.toLowerCase()?!1:$(e).attr("controller")&&nodes!=e?!1:(e=$(e),e.attr("each")?!1:void(e.data("record")||(e.data("record",!0),$.each(e,function(e,t){$.each(t.attributes,function(e,t){"init"===t.nodeName&&setupInit(t.nodeValue)}),$.each(t.childNodes,function(e,t){"#text"!==t.nodeName&&_getInitComponents(t)})}))))}function _setInitComponents(e){return e.tagName&&"script"===e.tagName.toLowerCase()?!1:(e=$(e),void $.each(e,function(t,n){if(defaultInputEvent[n.type]){if(n.attributes.model){var a=n.attributes.model.nodeValue,o=getElementValue(n);a.split(".").length>1||(o?dataInits[a]=o:dataInits[a]="")}}else if(n.attributes.model){var a=n.attributes.model.nodeValue;"view"===e[0].localName&&n.attributes.value?dataInits[a]=n.attributes.value.nodeValue:dataInits[a]=""}$.each(n.childNodes,function(e,t){"#text"!==t.nodeName&&_setInitComponents(t)})}))}var foundInit=[],dataInits={},setupInit=function(item){item=item.split("; ").join(";").split(";"),$.each(item,function(_i,_init){var parts=_init.split("="),key=parts[0],val=parts[1];if(key.indexOf(".")>0){var objPart=key.split("."),objGroup=[];$.each(objPart,function(e,t){objGroup.push(e===objPart.length-1?{name:t,value:JSON.parse(val)}:{name:t,value:{}})});var cmdEval="root";$.each(objGroup,function(e,t){cmdEval+=e===objGroup.length-1?"[ '"+t.name+"' ] = "+JSON.stringify(t.value):"[ '"+t.name+"' ]"}),eval(cmdEval)}else try{root[key]=JSON.parse(val)}catch(er){root[key]=eval(val)}})};return _getInitComponents(nodes),_setInitComponents(nodes),$.each(foundInit,function(e,t){setupInit()}),dataInits}function backupAttributesAndTextComponents(e){var t=[],n=function(a){return a.tagName&&"script"===a.tagName.toLowerCase()?!1:$(a).attr("controller")&&e!=a?!1:(a=$(a),void(a.attr("each")?a.data("template-each")||a.data("template-each",a.html()):$.each(a,function(e,a){var o=[],r=[];if($.each(a.childNodes,function(e,t){if("#text"===t.nodeName){var n=searchMagicQuout(t.nodeValue);n.length&&o.push({component:t,oldValue:t.nodeValue})}}),$.each(a.attributes,function(e,t){var n=searchMagicQuout(t.nodeValue);n.length&&r.push({component:t,oldValue:t.nodeValue})}),r.length||o.length){var i={attributes:r,textNode:o};$(a).data("attributes",r),$(a).data("textNode",o),t.push(i)}$.each(a.childNodes,function(e,t){"#text"!==t.nodeName&&n(t)})})))};return n(e),t}function setDataComponentBackup(e,t){$.each(e,function(e,n){$.each(n,function(e,n){$.each(n,function(e,n){var a=n.oldValue,o=n.component,r=searchMagicQuout(a),i=inlineRecognize(a,r,t);o.nodeValue=i})})})}function setEventListener(nodes,root){var getFN=function(e){e=e.substr(0,e.indexOf("("));var t=e.split(".");return e=t[0]},_setEventListener=function(dom){return dom.tagName&&"script"===dom.tagName.toLowerCase()?!1:$(dom).attr("controller")&&nodes!=dom?!1:(dom=$(dom),$.each(dom[0].attributes,function(i,item){eventListener.indexOf(item.nodeName)>=0&&dom[0].addEventListener(item.nodeName,function(e){(window[getFN(item.nodeValue)]instanceof Function||window[getFN(item.nodeValue)]instanceof Object)&&"function"!=typeof root[getFN(item.nodeValue)],e.root=root,root.$$event=e,root.$$this=dom[0];var ret,codes=item.nodeValue,cekFoo=getFunctionName(item.nodeValue);if("function"==typeof root[cekFoo])$.each(root,function(e,t){window[e]=t}),ret=eval("root."+codes),$.each(root,function(e,t){delete window[e]});else var ret=codeRecognize(item.nodeValue,root);delete root.$$event,delete root.$$this,root.$reload(),watchRoootSelector(root,watchRoot)})}),void $.each(dom[0].childNodes,function(e,t){"#text"!==t.nodeName&&_setEventListener(t)}))};_setEventListener(nodes)}function watchRoootSelector(e,t){var n=[];$.each(t,function(e,t){n.push(e)}),$.each(e,function(a,o){n.indexOf(a)>=0&&t[a](e[a])})}function setElementModel(e,t){var n=function(a){if(a.tagName&&"script"===a.tagName.toLowerCase())return!1;if($(a).attr("controller")&&e!=a)return!1;a=$(a);var o=a[0].nodeName.toLowerCase();if("view"===o){var r=a.attr("model"),i=a.attr("value");i!==t[r]&&i&&dataDirective.view(t,a,{})}"#text"!=o&&$.each(a[0].attributes,function(e,n){var o=n.nodeName;if("model"===o)if("string"==typeof n.nodeValue)if(n.nodeValue.indexOf(".")>0){var r=codeRecognize(n.nodeValue,t);setElementValue(a[0],r)}else{var r=codeRecognize(n.nodeValue,t);setElementValue(a[0],r)}else setElementValue(a[0],t[n.nodeValue])}),$.each(a[0].childNodes,function(e,t){"#text"!==t.nodeName&&n(t)})};n(e)}function setDefaultEvent(e,t){var n=function(t){if(t.tagName&&"script"===t.tagName.toLowerCase())return!1;if($(t).attr("controller")&&e!=t)return!1;t=$(t);var o=t[0].nodeName.toLowerCase();"#text"!=o&&$.each(t[0].attributes,function(e,n){var o=n.nodeName;"model"===o&&a(t[0],n.nodeValue)}),$.each(t[0].childNodes,function(e,t){"#text"!==t.nodeName&&n(t)})},a=function(e,n){var a=(e.nodeName.toLowerCase(),e.type),o=defaultInputEvent[a];o&&$.each(o,function(a,o){e.addEventListener(o,function(a){if("Control"===a.keyIdentifier||a.ctrlKey)return!1;var o=getElementValue(e);changeRootByEvents(o,n,t,e,a)})})};n(e)}function setTagDirectiveEvents(e,t){function n(a){return a.tagName&&"script"===a.tagName.toLowerCase()?!1:$(a).attr("controller")&&e!=a?!1:(a=$(a),$.each(a[0].attributes,function(e,n){if(n){var o=n.nodeName;if(dataTagDirective[o]){var r=codeRecognize(n.nodeValue,t)||n.nodeValue;dataTagDirective[o](r,t,a[0])}}}),void $.each(a[0].childNodes,function(e,t){"#text"!==t.nodeName&&n(t)}))}n(e)}function setElementValue(e,t){var n=e.nodeName.toLowerCase();switch(n){case"view":t&&$(e).attr("value",t);break;case"textarea":t&&$(e).val(t);break;case"select":t&&$(e).val(t);break;case"input":switch(e.type){case"radio":if($(e).attr("value")&&t){var a=e.attributes.name.nodeValue;$('input[name="'+a+'"][value="'+t+'"]')[0].checked=!0}break;case"checkbox":e.checked=t;break;case"range":$(e).val(t);break;default:$(e).val(t)}}}function getElementValue(e){var t=e.nodeName.toLowerCase();switch(t){case"textarea":return $(e).val();case"select":return $(e).val();case"input":switch(e.type){case"radio":return e.checked?e.value:$('input[name="'+e.attributes.name.nodeValue+'"][checked]').val();case"number":var n=e.value||0;return parseInt(n);case"checkbox":return e.checked;default:return $(e).val()}break;default:return $(e).val()}}function changeRootByEvents(value,modelName,root,ell,evt){modelName.indexOf(".")>0?(eval("root."+modelName+'= "'+value+'"'),root.$reload()):(root[modelName]=value,"function"==typeof watchRoot[modelName]&&watchRoot[modelName](value,ell,evt,modelName,root),root.$reload())}function searchMagicQuout(e){var t=[],n=e.split("^"),a=function(e){return e.replace(/[\r\n]/g,"")};return n.length>1&&$.each(n,function(e,n){if(e)if("("==n.charAt(0)){var o=[];n.replace(/[(*)]/g,function(e,t,n){o.push({index:t,chars:e,mode:")"==e?"close":"open"})});for(var r=0,i=0,c=0,u=0;u<o.length;u++){i++;var d=o[u].mode;if(i&&("open"===d&&r++,"close"===d&&r--,c=o[u].index,0===r))break}c++;var l=n.substr(0,c),s="-+/*?%".split("");if(s.indexOf(n.substr(c,1))>=0){var f=n.split(" ");t.push(a(f[0]))}else t.push(a(l))}else{var f=n.split(" ");t.push(a(f[0]))}}),t}function inlineRecognize(e,t,n){return $.each(t,function(t,a){var o=codeRecognize(a,n);e=e.replace("^"+a,o)}),e}function codeRecognize(code,root){if("("===code.charAt(0)&&(code=code.replace(/[\)\(]/g,"")),root[code])return root[code];var lineInCode=commandInCode(code);code=lineInCode[0];try{var result;return function(window){$.each(root,function(e,t){window[e]=t}),result=eval(code),$.each(root,function(e,t){root[e]=window[e],delete window[e]})}(window),lineInCode.length>1?filteringCodeResult(result,lineInCode.splice(1),root):result}catch(e){return""}}function commandInCode(e){if(e.indexOf("|")>=0){var t=e.split("|"),n=[];return $.each(t,function(e,t){if(e){var a=[],o=t.replace(/[\(\)]/g,""),r=o.split(" "),i=[];$.each(r,function(e,t){t&&i.push(t)}),a.push(i[0]);var c=i.splice(1),u=c.join(""),d=a[0]+" "+u;n.push(d)}else n.push(t.replace(/[\(]/g,""))}),n}return[e]}function filteringCodeResult(result,filters,root){filters=filters[0];var command={},filterName="";return $.each(filters.split(":"),function(i,item){if(i){var cfg=item.split("=");command[cfg[0]]=eval(cfg[1])}else filterName=item.replace(/[ ]/g,"")}),dataFilter[filterName]?dataFilter[filterName](result,command,root):result}function ell(e){var t=document.createElement(e);return $(t)}function isHtml(e){if("string"==typeof e){var t=$(e);return t[0].childNodes.length}return!0}function getArguments(e){var t=e.toString().replace(/[\r\n ]/g,"");return t=t.substr(t.indexOf("(")+1,t.indexOf(")")-(t.indexOf("(")+1)),t.split(",")}function applyFactoryInjectFunction(e,t){var n=getArguments(e),a=[];return $.each(n,function(e,n){switch(n){case"$root":a.push(t);break;case"$filter":a.push(dataFilter);break;default:dataCollection[n]&&a.push(dataCollection[n]),dataConfig[n]&&a.push(dataConfig[n]),dataService[n]&&a.push(dataService[n]),dataModule[n]&&a.push(new dataModule[n](t))}}),e.apply(this,a)}function getALlAttributes(e){var t={};return $.each($(e)[0].attributes,function(e,n){t[n.nodeName]=n.nodeValue}),t}function toInt(e){return parseInt(e)}function getFunctionName(e){return e=e.toString(),e.substr(0,e.indexOf("("))}function _setCookie(e,t,n){n=n||{};var a=function(e){return encodeURIComponent(e)},o=function(e){return a("object"==typeof e?JSON.stringify(e):String(e))};if("number"==typeof n.expires){var r=n.expires,i=n.expires=new Date;i.setTime(+i+864e5*r)}return document.cookie=[a(e),"=",o(t),n.expires?"; expires="+n.expires.toUTCString():"",n.path?"; path="+n.path:"",n.domain?"; domain="+n.domain:"",n.secure?"; secure":""].join("")}function _getCookie(e){for(var t,n=function(e){return decodeURIComponent(e)},a=document.cookie?document.cookie.split("; "):[],o=0;o<a.length;o++){var r=a[o].split("=");if(n(r[0])===e){t=r[1];break}}return t}function _removeCookie(e){return _getCookie(e)===undefined?!1:(_setCookie(e,"",{expires:-1}),_getCookie(e))}function Collection(e){this.structure=e||{},this.store=[],this.onChange=function(){}}function autoRun(){$(document).ready(function(){$("body").find("[controller]").each(function(e,t){var n=t.attributes.controller.nodeValue||"controller_"+Math.floor(1e4*Math.random());dataController[n]||($(t).attr("controller",n),eng.controller(n,function(){}))})})}var eng=window.eng||(window.eng={});eng.versions={number:"0.0.1",rev:"7-26-15"};var noCheck=["each","controller"],startup=!1,ajaxOnload=!1,notSet=["controller","model","each","init"],defaultInputEvent={text:["keyup"],search:["keyup","change"],email:["keyup"],url:["keyup"],radio:["change"],date:["change"],range:["mousemove","change"],number:["keyup","change"],checkbox:["click"],textarea:["keyup"],"select-one":["change"]},eventListener="abort,autocomplete,autocompleteerror,beforecopy,beforecut,beforepaste,blur,cancel,canplay,canplaythrough,change,click,close,contextmenu,copy,cuechange,cut,dblclick,drag,dragend,dragenter,dragleave,dragover,dragstart,drop,durationchange,emptied,ended,error,focus,input,invalid,keydown,keypress,keyup,load,loadeddata,loadedmetadata,loadstart,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,mousewheel,paste,pause,play,playing,progress,ratechange,reset,resize,scroll,search,seeked,seeking,select,selectstart,show,stalled,submit,suspend,timeupdate,toggle,volumechange,waiting,webkitfullscreenchange,webkitfullscreenerror,wheel".split(","),watchRoot={},dataController={},dataModule={},dataService={},dataFactory={},dataConfig={},dataFilter={},dataDirective={},dataTagDirective={},dataTemplate={},dataTransport=[],dataCollection={},dataStore={},dataRoute={};eng.getJSON=function(e){return addServiceDataTransport({mode:"getJSON",url:e,data:[],asLoad:!1})},window.onpopstate=goRoute,eng.controller=function(e,t){return imReady(function(){_controller(e,t)}),eng},eng.config=function(e,t){return _config(e,t)},eng.module=function(e,t){return _module(e,t)},eng.service=function(e,t){return _service(e,t)},eng.factory=function(e,t){return _factory(e,t)},eng.filter=function(e,t){return _filter(e,t)},eng.directive=function(e,t){return _directive(e,t)},eng.tagDirective=function(e,t){return _tagDirective(e,t)},eng.template=function(e,t){return _template(e,t)},eng.defaultEvent=function(e,t){return _template(e,t)},eng.store=function(e,t){return _store(e,t)},eng.collection=function(e,t){return _collection(e,t)},eng.route=function(e,t){return _route(e,t)};var dataTableReady={},dateFormat=function(){var e=/d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,t=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,n=/[^-+\dA-Z]/g,a=function(e,t){for(e=String(e),t=t||2;e.length<t;)e="0"+e;return e};return function(o,r,i){var c=dateFormat;if(1!=arguments.length||"[object String]"!=Object.prototype.toString.call(o)||/\d/.test(o)||(r=o,o=undefined),o=o?new Date(o):new Date,isNaN(o))throw SyntaxError("invalid date");r=String(c.masks[r]||r||c.masks["default"]),"UTC:"==r.slice(0,4)&&(r=r.slice(4),i=!0);var u=i?"getUTC":"get",d=o[u+"Date"](),l=o[u+"Day"](),s=o[u+"Month"](),f=o[u+"FullYear"](),m=o[u+"Hours"](),g=o[u+"Minutes"](),h=o[u+"Seconds"](),v=o[u+"Milliseconds"](),p=i?0:o.getTimezoneOffset(),$={d:d,dd:a(d),ddd:c.i18n.dayNames[l],dddd:c.i18n.dayNames[l+7],m:s+1,mm:a(s+1),mmm:c.i18n.monthNames[s],mmmm:c.i18n.monthNames[s+12],yy:String(f).slice(2),yyyy:f,h:m%12||12,hh:a(m%12||12),H:m,HH:a(m),M:g,MM:a(g),s:h,ss:a(h),l:a(v,3),L:a(v>99?Math.round(v/10):v),t:12>m?"a":"p",tt:12>m?"am":"pm",T:12>m?"A":"P",TT:12>m?"AM":"PM",Z:i?"UTC":(String(o).match(t)||[""]).pop().replace(n,""),o:(p>0?"-":"+")+a(100*Math.floor(Math.abs(p)/60)+Math.abs(p)%60,4),S:["th","st","nd","rd"][d%10>3?0:(d%100-d%10!=10)*d%10]};return r.replace(e,function(e){return e in $?$[e]:e.slice(1,e.length-1)})}}();dateFormat.masks={"default":"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",mediumDate:"mmm d, yyyy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",mediumTime:"h:MM:ss TT",longTime:"h:MM:ss TT Z",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"},dateFormat.i18n={dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"]},function(e){function t(){try{return i in e&&e[i]}catch(t){return!1}}function n(e){return e.replace(/^d/,"___$&").replace(f,"___")}var a,o={},r=e.document,i="localStorage",c="script";if(o.disabled=!1,o.version="0.0.1",o.set=function(e,t){},o.get=function(e,t){},o.has=function(e){return o.get(e)!==undefined},o.remove=function(e){},o.clear=function(){},o.transact=function(e,t,n){null==n&&(n=t,t=null),null==t&&(t={});var a=o.get(e,t);n(a),o.set(e,a)},o.getAll=function(){},o.forEach=function(){},o.serialize=function(e){return JSON.stringify(e)},o.deserialize=function(e){if("string"!=typeof e)return undefined;try{return JSON.parse(e)}catch(t){return e||undefined}},t())a=e[i],o.set=function(e,t){return t===undefined?o.remove(e):(a.setItem(e,o.serialize(t)),t)},o.get=function(e,t){var n=o.deserialize(a.getItem(e));return n===undefined?t:n},o.remove=function(e){a.removeItem(e)},o.clear=function(){a.clear()},o.getAll=function(){var e={};return o.forEach(function(t,n){e[t]=n}),e},o.forEach=function(e){for(var t=0;t<a.length;t++){var n=a.key(t);e(n,o.get(n))}};else if(r.documentElement.addBehavior){var u,d;try{d=new ActiveXObject("htmlfile"),d.open(),d.write("<"+c+">document.w=window</"+c+'><iframe src="/favicon.ico"></iframe>'),d.close(),u=d.w.frames[0].document,a=u.createElement("div")}catch(l){a=r.createElement("div"),u=r.body}var s=function(e){return function(){var t=Array.prototype.slice.call(arguments,0);t.unshift(a),u.appendChild(a),a.addBehavior("#default#userData"),a.load(i);var n=e.apply(o,t);return u.removeChild(a),n}},f=new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]","g");o.set=s(function(e,t,a){return t=n(t),a===undefined?o.remove(t):(e.setAttribute(t,o.serialize(a)),e.save(i),a)}),o.get=s(function(e,t,a){t=n(t);var r=o.deserialize(e.getAttribute(t));return r===undefined?a:r}),o.remove=s(function(e,t){t=n(t),e.removeAttribute(t),e.save(i)}),o.clear=s(function(e){var t=e.XMLDocument.documentElement.attributes;e.load(i);for(var n,a=0;n=t[a];a++)e.removeAttribute(n.name);e.save(i)}),o.getAll=function(e){var t={};return o.forEach(function(e,n){t[e]=n}),t},o.forEach=s(function(e,t){for(var n,a=e.XMLDocument.documentElement.attributes,r=0;n=a[r];++r)t(n.name,o.deserialize(e.getAttribute(n.name)))})}try{var m="__storejs__";o.set(m,m),o.get(m)!=m&&(o.disabled=!0),o.remove(m)}catch(l){o.disabled=!0}o.enabled=!o.disabled,"undefined"!=typeof module&&module.exports&&this.module!==module?module.exports=o:"function"==typeof define&&define.amd?define(o):dataStore.store=o}(Function("return this")()),eng.localStore={clearAll:dataStore.store.clear,set:dataStore.store.set,get:dataStore.store.get,getAll:dataStore.store.getAll,remove:dataStore.store.remove},Collection.prototype.insert=function(e){var t=this,n=Date.now()+""+parseInt(1e3*Math.random());n=parseInt(n.replace(".",""));var a=Date.now();if(e instanceof Array&&this.structure instanceof Object){var o={},r=0;$.each(this.structure,function(t,n){o[t]=typeof e[r]===n?e[r]:"",r++}),o.__id=n,o.__update=a,o.__create=a,this.store.push(o)}else $.each(e,function(e,n){t.structure[e]=n instanceof Object?"object":n.getType()}),e.__id=n,e.__update=a,e.__create=a,this.store.push(e);return this.onChange(),this},Collection.prototype.remove=function(e){var t=this,n=[];if("object"!=typeof e){var a;return $.each(this.store,function(t,n){n.__id==e.toString()&&(a=t)}),a>=0&&t.store.splice(a,1),this.onChange(),this}$.each(this.store,function(t,a){$.each(a,function(a,o){$.each(e,function(e,r){e==a&&r==o&&n.push(t)})})});var o=0;return $.each(n,function(e,n){t.store.splice(n-o,1),o++}),this.onChange(),this},Collection.prototype.get=function(e){var t=[];return"object"!=typeof e?($.each(this.store,function(n,a){a.__id==e&&t.push(a)}),t):($.each(this.store,function(n,a){$.each(a,function(n,o){$.each(e,function(e,r){e==n&&r==o&&t.push(a)})})}),t)},Collection.prototype.find=function(e){var t=[];return $.each(this.store,function(n,a){$.each(a,function(n,o){$.each(e,function(e,r){e==n&&o.indexOf(r)>=0&&t.push(a)})})}),t},Collection.prototype.set=function(e){var t=this,n={};return n.by=function(n){var a=t.get(n);return $.each(a,function(t,n){n.__update=Date.now(),$.extend(n,e)}),t.onChange(),a},n},eng.ell=ell,eng.setCookie=function(e,t,n){return _setCookie(e,t,n)},eng.getCookie=function(e){return _getCookie(e)},eng.removeCookie=function(e){return _removeCookie(e)},eng.filter("date",function(e,t){return dateFormat(new Date(e),t.format)}),eng.filter("upper",function(e){return e.toUpperCase()}),eng.filter("lower",function(e){return e.toLowerCase()}),eng.filter("ucfirst",function(e){return e.substr(0,1).toUpperCase()+e.substr(1,e.length).toLowerCase()}),eng.filter("sorting",function(e,t){var n=[],a=[],o={};return $.each(e,function(e,n){o[n[t.key]+"_"+e]=n,a.push(n[t.key]+"_"+e)}),t.sort?a.sort():a.sort().reverse(),$.each(a,function(e,t){n.push(o[t])}),n}),eng.filter("comma",function(e,t){return e/parseInt(t.decimal)}),eng.filter("toInt",function(e,t){return parseInt(e)}),eng.filter("src",function(e,t){var n=new FileReader;n.onload=function(){e.root[t.model]={src:n.result,info:e.target.files[0]},e.root.$reload()},n.readAsDataURL(e.target.files[0])}),eng.filter("mid",function(e,t){return e.substr(t.point1,t.point2)}),eng.filter("length",function(e,t){return e.length}),eng.filter("json",function(e,t){return JSON.stringify(e)}),eng.directive("drop-file",function(e,t,n){var a=n["drop-file"],o=$(t)[0];o.addEventListener("dragover",function(e){e.stopPropagation(),e.preventDefault()},!1),o.addEventListener("dragenter",function(e){e.stopPropagation(),e.preventDefault()},!1),o.addEventListener("drop",function(t){t.stopPropagation(),t.preventDefault();var n=t.dataTransfer,o=[];$.each(n.files,function(e,t){o.push(t)});var r=[],i=function(t){if(!t.length){var n=[];return $.each(r,function(e,t){n.push({src:t,file:o[e]})}),e[a](n),!1}var c=new FileReader;c.readAsDataURL(t[0]),c.onload=function(){r.push(c.result),i(t.splice(1))}};i(o)},!1)}),eng.directive("clone",function(e,t,n){var a=parseInt(n.clone);t.removeAttr("clone");for(var o=0;a-1>o;o++){var r=$(t).clone();r.insertAfter($(t))}}),eng.directive("checkbox",function(e,t,n){var a="id_"+Math.floor(1e4*Math.random()),o=ell("input").attr({type:"checkbox",model:n.model,id:a}),r=ell("label").attr("for",a).html(n.label);r.insertAfter($(t)),o.insertAfter($(t)),$(t).remove()});var localViewCache={};eng.directive("view",function(e,t,n){setTimeout(function(){var n=$(t).attr("value");if(n&&$(t).data("value")!==n){$(t).data("value",n);var a=$(t).attr("start");a&&codeRecognize(a,e);var o=$(t).attr("cache")||"";o=codeRecognize(o,e)||!1;var r=$(t).attr("local-cache")||"";if(r=codeRecognize(r,e)||!1,r&&localViewCache[n]){var i=localViewCache[n];return $(t).empty().append(i).data("record",!1),e.$reset(t),setTimeout(function(){var n=$(t).attr("success");n&&codeRecognize(n,e)}),!1}$.ajax({url:n,cache:o,success:function(a){localViewCache[n]=a,$(t).empty().append(a).data("record",!1),e.$reset(t),setTimeout(function(){var n=$(t).attr("success");n&&codeRecognize(n,e)})},error:function(){var n=$(t).attr("error");n&&codeRecognize(n,e)}})}})}),eng.directive("binding",function(e,t,n){$(t).html("^"+n.model)}),eng.tagDirective("show",function(e,t){$("[show]").each(function(e,n){var a=$(n).attr("show"),o=codeRecognize(a,t);o?$(n).show():$(n).hide()})}),eng.tagDirective("hide",function(e,t){$("[hide]").each(function(e,n){var a=$(n).attr("hide"),o=codeRecognize(a,t);o?$(n).hide():$(n).show()})}),eng.tagDirective("template",function(e,t,n){startup?t.tpl(e):setTimeout(function(){t.tpl(e)},100)}),eng.tagDirective("binding",function(e,t,n){var a=$(n).attr("binding"),o=codeRecognize(a,t);$(n).html(o)}),eng.tagDirective("_disabled",function(e,t,n){"boolean"==typeof e?e&&$(n).attr({disabled:!0}):$(n).removeAttr("disabled")}),eng.tagDirective("_checked",function(e,t,n){"boolean"==typeof e?e&&$(n).attr({checked:"checked"}):$(n).removeAttr("checked")}),eng.tagDirective("_readonly",function(e,t,n){"boolean"==typeof e?e&&$(n).attr({readonly:"readonly"}):$(n).removeAttr("readonly")}),$(document).ready(function(){autoRun(),goRoute()})}(window,document);
