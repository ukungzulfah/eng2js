 /*
        
     __|           
     _|    \   _` |
    ___|_| _|\__, |
             ____/ 

    Create by: ukungzulfah ( Eng Javascript Engine )
    
*/
(function(window, document, undefined){'use strict';

    var eng = window.eng || (window.eng = {});
    
    eng.versions = {
        number: "0.0.1",
        rev: "7-26-15"
    };
    
    //[ SYSTEM CONFIGS ]
    /*
        Mencegah controller melakukan pengecekan di tag html ini
    */
    var noCheck = [ 'each', 'controller' ];
    var startup = false;
    var ajaxOnload = false;
    var notSet = [ 'controller', 'model', 'each', 'init' ];
    var defaultInputEvent = {
        text: [ "keyup" ],
        search: [ "keyup", "change" ],
        email: [ "keyup" ],
        url: [ "keyup" ],
        radio: [ "change" ],
        date: [ "change" ],
        range: [ "mousemove", "change" ],
        number: [ "keyup", "change" ],
        checkbox: [ "click" ],
        textarea: [ "keyup" ],
        "select-one": [ "change" ]
    };
    var eventListener = "abort,autocomplete,autocompleteerror,beforecopy,beforecut,beforepaste,blur,cancel,canplay,canplaythrough,change,click,close,contextmenu,copy,cuechange,cut,dblclick,drag,dragend,dragenter,dragleave,dragover,dragstart,drop,durationchange,emptied,ended,error,focus,input,invalid,keydown,keypress,keyup,load,loadeddata,loadedmetadata,loadstart,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,mousewheel,paste,pause,play,playing,progress,ratechange,reset,resize,scroll,search,seeked,seeking,select,selectstart,show,stalled,submit,suspend,timeupdate,toggle,volumechange,waiting,webkitfullscreenchange,webkitfullscreenerror,wheel".split(',');
    var watchRoot = {};
    var dataController = {};
    var dataModule = {};
    var dataService = {};
    var dataFactory = {};
    var dataConfig = {};
    var dataFilter = {};
    var dataDirective = {};
    var dataTagDirective = {};
    var dataTemplate = {};
    var dataTransport =[];
    var dataCollection = {};
    var dataStore = {};
    var dataRoute = {};
    
    // [ SERVICE FUNCTION AUTO-LOAD ]
    eng.getJSON = function(url){
        return addServiceDataTransport({
            mode: 'getJSON',
            url: url,
            data: [],
            asLoad: false
        });
    };
    function addServiceDataTransport(cfg){
        var found = false;
        for(var x=0; x<dataTransport.length; x++){
            if(dataTransport[x].url = cfg.url){
                found = true;
                break;
            }
        }
        if(!found){
            dataTransport.push(cfg);
            return getDataTransportByKeys( cfg.url );
        }else{
            return getDataTransportByKeys( cfg.url );
        }
    }
    function getDataTransportByKeys(key){
        var data = {};
        for(var x=0; x<dataTransport.length; x++){
            if(key === dataTransport[x].url){
                data = dataTransport[x].data;
                break;
            }
        }
        return data;
    }
    function getRoute(){
		var found = '';
		var fixSlash = function(a){
		    a = a.split('/');
		    var b = [];
		    for(var x=0; x<a.length; x++){
		        if( a[x] ){
		            b.push(a[x]);
		        }
		    }
		    return b;
		}
		var path_url = window.location.hash || '/';
		path_url = path_url.replace('#', '');
		var asFound = false;
		$.each(dataRoute, function(routers, evt){
		    if(!asFound){
		        if( routers === path_url ){
		            asFound = true;
		            found = routers;
		        }else{
    		        var _path_url = fixSlash(path_url);
    		        var _routers = fixSlash(routers);
    		        if(_path_url.length >= _routers.length){
    		            for(var x=0; x<_path_url.length; x++){
    		                if(_path_url[x] !== _routers[x]){
    		                    if(_routers[x] === '*'){
    		                        if(!found){
    		                            found = routers;
    		                        }
    		                    }
    		                }
    		            }
    		        }else{
    		            if(path_url+'*' === routers){
    		                found = path_url+'*';
    		            }
    		        }
		        }
		    }
		});
		return found;
    }
    function goRoute(){
        var hash = window.location.hash.replace('#', '');
        var routing = getRoute();
        if(!routing){ return false; }
        var callback = dataRoute[ routing ];
        var args = getArguments( callback );
        var ret = callback.apply( this, [ hash ]);
        var boxController = eng.ell('div').attr({ controller:ret.controller });
        $('[route="'+ ret.target +'"]').html( boxController );
        if(ret.templateUrl){
            $.ajax({
                url: ret.templateUrl,
                type: ret.method || 'GET',
                data: ret.data || {},
                success: function(tpl){
                    boxController.html( tpl );
                    dataController[ret.controller].$root.route = {};
                    $.extend(dataController[ret.controller].$root.route, ret);
                    eng.controller( ret.controller, dataController[ret.controller].callback );
                }
            });
        }else{
            //template mode
            
        }
    }
    window.onpopstate = goRoute;

    //[ CONTROLLER ]
    eng.controller = function(ctrlName, callback){
        imReady(function(){_controller(ctrlName, callback);});
        return eng;
    };
        function imReady(callback){
            $(document).ready(callback);
        }
        function _controller(ctrlName, callback){
            //check if ctrlName exists
            var nodes = $("[controller='"+ ctrlName +"']");
            var $root = (dataController[ctrlName]) ? dataController[ctrlName].$root : {};
            dataController[ctrlName] = {
                callback: callback,
                $root: $root
            };
            //hentikan jika controller html tidak ditemukan
            //controller hanya akan disimpan di backup data
            if(!nodes.length){ return false; }
            if(!isHtml(nodes)){  console.log("Component failed"); return false; }
            
            //mendapatkan data root
            //auto arguments
            $root.$get = function(url, data){
                var self = this;
                if(ajaxOnload){
                    if(typeof url === 'object'){
                        url.type = 'GET';
                        if(url.target){
                            var callback = url.success || function(x){return x;};
                            url.success = null;
                            var injects = function(result){
                                var result = callback( result, $root );
                                $(url.target).html( result );
                                setTimeout(function(){
                                    self.$reset( $(url.target) );
                                });
                            };
                            url.success = injects;
                        }
                        $.ajax(url);
                    }
                    return false;
                }
            };
            $root.$post = function(url, data){
                var self = this;
                if(ajaxOnload){
                    if(typeof url === 'object'){
                        url.type = 'POST';
                        if(url.target){
                            var callback = url.success || function(x){return x;};
                            url.success = null;
                            var injects = function(result){
                                var result = callback( result, $root );
                                $(url.target).html( result );
                                setTimeout(function(){
                                    self.$reset( $(url.target) );
                                });
                            };
                            url.success = injects;
                        }
                        $.ajax(url);
                    }
                    return false;
                }
            };
            
            //modul app
            var args = getArguments( callback );
            var realModul = [];
            
            //get modules service and factory events
            var getRealModul = function(){
                realModul = [];
                $.each(args, function( i, arg ){
                    switch(arg){
                        case '$root':
                            realModul.push( $root );
                            break;
                        case '$filter':
                            realModul.push( dataFilter );
                            break;
                        default:
                            if( dataCollection[arg] ){ realModul.push( dataCollection[arg] ); }
                            if( dataConfig[arg] ){ realModul.push( dataConfig[arg] ); }
                            if( dataService[arg] ){ realModul.push( dataService[arg] ); }
                            if( dataModule[arg] ){ realModul.push( new dataModule[arg]($root) ); }
                            if( dataFactory[arg] ){ realModul.push( applyFactoryInjectFunction(dataFactory[arg], $root) ); }
                            break;
                    }
                });
                return realModul;
            }
            getRealModul();
            
            //run it
            var self = this;
            var runIt = function(){
                getRealModul();
                callback.apply( $root, realModul );
                
                //directive stage
                //mengkonversi nilai directive ke html generatenya.
                setDocumentDirective( nodes, $root );
                
                //set Tag directive
                setTagDirectiveEvents( nodes, $root );
    
                //mengambil semua komponen init
                //masukan init ke dalam $root
                var inits = getInitComponents(nodes, $root);
                $.each(inits, function(i, item){
                    if($root[i]){
                        if(!item){
                            $root[i] = item || $root[i];
                        }
                    }else{
                        $root[i] = item;
                    }
                });
    
                //backup data attributes dan textNode
                /*
                    backup data attribute di element itu sendiri dengan menyimpanya di data
                    properti yang di backup
                    {
                        component: <component>,
                        oldValue: <value>
                    }
                    hanya membackup ellement yang memiliki magicQuote
                */
                var backupAttrib = backupAttributesAndTextComponents(nodes);
                
                //mengeset data component backup
                //atau digunakan apabila dokument diperbarui
                setDataComponentBackup(backupAttrib, $root);
    
                //mengeset component yang memiliki nilai model
                setElementModel(nodes, $root);
    
                //mengeset default actions <events>
                setDefaultEvent(nodes, $root);
    
                //set eventListener
                setEventListener( nodes, $root );
                
                //watch digunakan untuk memonitoring pergerakan / perubahan nilai model
                $root.watch = function(modelName, callback){
                    watchRoot[modelName] = callback;
                };
    
                //set each data
                EachData( nodes, $root );
                
                //reload activity
                $root.$reload = function(){
                    setElementModel(nodes, $root);
                    setDataComponentBackup(backupAttrib, $root);
                    setTagDirectiveEvents( nodes, $root );
                    EachData( nodes, $root );
                };
                
                //reset activity
                $root.$reset = function(dom){
                    var inits = getInitComponents( dom );
                    $.extend( $root, inits );
                    var backupAttribs = backupAttributesAndTextComponents(dom);
                    $.each(backupAttribs, function(i, item){ backupAttrib.push(item); })
                    setDataComponentBackup(backupAttrib, $root);
                    setElementModel(dom, $root);
                    setDefaultEvent(dom, $root);
                    setEventListener( dom, $root );
                    setDataComponentBackup(backupAttrib, $root);
                };
                $root.$reload();
            }
            
            //membuat data transport service
            if(dataTransport.length){
                var getTransports = function(dataTrs, index2){
                    if(dataTrs[index2]){
                        switch(dataTrs[index2].mode){
                            case 'getJSON':
                                if(!dataTrs[index2].asLoad){
                                    dataTrs[index2].asLoad = true;
                                    $.getJSON( dataTrs[index2].url, function(result){
                                        dataTrs[index2].data = result;
                                        getTransports(dataTrs, index2+1);
                                    });
                                }else{
                                    getTransports(dataTrs, index2+1);
                                }
                                break;
                            case 'get':
                                $.ajax({
                                    type: 'GET',
                                    url: dataTrs[index2].url,
                                    data: dataTrs[index2].dataSend || {},
                                    success: function( result ){
                                        dataTransport[index2].data = result;
                                        getTransports(dataTrs, index2+1);
                                    }
                                });
                                break;
                            case 'post':
                                $.ajax({
                                    type: 'POST',
                                    url: dataTrs[index2].url,
                                    data: dataTrs[index2].dataSend || {},
                                    success: function( result ){
                                        dataTransport[index2].data = result;
                                        getTransports(dataTrs, index2+1);
                                    }
                                });
                                break;
                        }
                    }else{
                        ajaxOnload = true;
                        runIt();
                    }
                };
                getTransports(dataTransport, 0);
            }else{
                ajaxOnload = true;
                runIt();
            }
            
            $root.tpl = function(templateName){
                var templates = $('script[name="template1"]')[0].innerHTML;
                if(!templates){ return false; }
                $('[template="'+ templateName +'"]').each(function(i, ells){
                    var elements = ell('div').attr('eng-template', 'generate').append( templates );
                    $(ells).html( elements );
                    $root.$reset( elements );
                });
            };
            startup = true;
            return eng;
        }
        
        
    //[ ADDITIONAL FUNCTION ]
    eng.config = function(configName, configurations){
        return _config( configName, configurations );
    };
        function _config(configName, configurations){
            dataConfig[configName] = configurations;
            return eng;
        }
    eng.module = function(modulName, callback){
        return _module(modulName, callback);
    };
        function _module(modulName, callback){
            dataModule[modulName] = callback;
            return eng;
        }
    eng.service = function(serviceName, callback){
        return _service(serviceName, callback);
    };
        function _service(serviceName, callback){
            dataService[serviceName] = callback();
            return eng;
        }
    eng.factory = function(factoryName, callback){
        return _factory(factoryName, callback);
    };
        function _factory(factoryName, callback){
            dataFactory[factoryName] = callback;
            return eng;
        }
    eng.filter = function(filterName, callback){
        return _filter(filterName, callback);
    };
        function _filter(filterName, callback){
            dataFilter[filterName] = callback;
            return eng;
        }
    eng.directive = function(directiveName, callback){
        return _directive(directiveName, callback);
    };
        function _directive(directiveName, callback){
            dataDirective[directiveName] = callback;
            return eng;
        }
    eng.tagDirective = function(tagDirectiveName, callback){
        return _tagDirective(tagDirectiveName, callback);
    };
        function _tagDirective(tagDirectiveName, callback){
            dataTagDirective[tagDirectiveName] = callback;
            return eng;
        }
    eng.template = function(templateName, callback){
        return _template(templateName, callback);
    };
        function _template(templateName, callback){
            dataTemplate[templateName] = callback;
            return eng;
        }
    eng.defaultEvent = function(eventName, callback){
        return _template(eventName, callback);
    };
        function _defaultEvent(eventName, callback){
            defaultInputEvent[eventName] = callback;
            return eng;
        }
    eng.store = function(storeName, initStore){
        return _store(storeName, initStore);
    };
        function _store(storeName, initStore){
            console.log( storeName, initStore );
        }
    eng.collection = function(collectionName, initCollection){
        return _collection( collectionName, initCollection );
    };
        function _collection( collectionName, initCollection ){
            dataCollection[ collectionName ] = new Collection(initCollection);
            return eng;
        }
    eng.route = function(routeUrl, callFunction){
        return _route(routeUrl, callFunction);
    };
        function _route(routeUrl, callFunction){
            dataRoute[ routeUrl ] = callFunction;
            return eng;
        }

    //[ SERVICE ]
    //EachData
    var dataTableReady = {};
    function EachData( nodes, root ){
        var _eachData = function(dom){
            dom = $(dom);
            if( dom.attr("each") ){
                var domCmd = dom.attr("each");
                var eachs = getCommandEach( domCmd, root );
                
                var runTables = function(){
                    console.log("runTables")
                    var each = getCommandEach( domCmd, root );
                    if(each.model){
                        dataTableReady[ each.model ] = each.data.length;
                    }
                    dom.data("execute", true);
                    var clone = dom.clone(); dom.empty();
                    var belumRunning = true;
                    
                    //jika ada perintah sort di each
                    if( each.advance.sort ){
                        var sort = codeRecognize(each.advance.sort, root);
                        var sortBy = each.advance.sortBy;
                        //jika data is array biasa maka sortBy akan diabaikan
                        if(sortBy){
                            sortBy = codeRecognize(each.advance.sortBy, root);
                            if(sortBy){
                                // sorting data berdasarkan keys
                                each.data = dataFilter.sorting(each.data, {sort:sort, key:sortBy});
                            }
                        }else{
                            if(sort){
                                each.data.sort();
                            }else{
                                each.data.sort().reverse();
                            }
                        }
                        root.watch( each.advance.sort, function(value){
                            runTables();
                        });
                        root.watch( each.advance.sortBy, function(value){
                            runTables();
                        });
                    }
                    
                    //jika ada perintah filter data di each
                    if(each.advance.filter){
                        each.data = filterEach( each.data, codeRecognize(each.advance.filter, root), each.isHtml);
                        //cek apakah filter model atau bukan, 
                        //jika ya maka lakukan update otomatis dengan watch
                        root.watch(each.advance.filter, function(value){
                            console.log("filter")
                            runTables();
                            //if(belumRunning){
                                //belumRunning = false;
                                //EachData(nodes, root);
                            //}
                        });
                    }
                    
                
                    //lempar operasi ke fungsi lain yang terpisah
                    var n=0;
                    $.each(each.data, function(i, item){
                        var dataBuild = {};
                        dataBuild[ each.val ] = item;
                        dataBuild[ '$index' ] = i;
                        dataBuild[ (each.key||'$index') ] = i;
                        dataBuild.$num = n;
                        dataBuild.isHtml = each.isHtml;
                        if(each.isHtml){
                            dataBuild[ each.val ] = $(item).clone()[0].outerHTML;
                        }
                        bootEach(dom.data("template-each"), dataBuild, dom, root, each, i);
                        n++;
                    });
                    
                    //jika ada permintaan informasi panjang di each
                    if(each.advance.count){ root[ each.advance.count ] = n; }
                    
                    setTimeout(function(){ root.$reset(dom); });
                }
                
                //menyimpan backup data tables 
                if( dom.data("execute") ){
                    if(eachs.model){
                        if(( root[eachs.model] )){
                            if(dataTableReady[eachs.model] != root[eachs.model].length){
                                runTables();
                            }
                        }
                    }
                }else{
                    runTables();
                }
                
            }else{
                setTimeout(function(){
                    $.each(dom[0].childNodes, function(i, item){
                    if(item.nodeName !== '#text'){
                        _eachData( item );
                    }
                });
                });
            }
        };
        _eachData( nodes );
    }
    function bootEach(copys, dataBuild, ori, root, each, index){
        if( !dataBuild.isHtml ){
            copys = $(copys);
            copys.find('*').each(function(i, item){
                $(item).data( 'root', each.model );
            });
            var attrib = backupAttributesAndTextComponents( copys );
            console.log( attrib );
            setDataComponentBackup( attrib, dataBuild );
            ori.append( copys );
            EachData( copys, dataBuild );
        }else{
            var listMagic = searchMagicQuout(copys);
            var res = inlineRecognize( copys, listMagic, dataBuild );
            ori.append( res );
        }
    }
    function getCommandEach( eachCommand, root ){
        eachCommand = eachCommand.split('|');
        var commands = eachCommand[0].split(' in ');
        if(commands.length === 1){
            var dataX = commands[0];
            commands[0] = "keygen_"+ parseInt(Math.random()*10);
            commands[1] = dataX;
        }
        var dataBinding = commands[1].replace(/[ ]/g, '');
        var args = commands[0].replace(/[\(\)]/g, '');
        var keyArgs=0;
        if(args.indexOf(',') > 0){
            var arrArgs = args.split(',');
            args = arrArgs[1];
            keyArgs = arrArgs[0];
        }
        //advance command filter sort etc

        var advanceCommands = {};
        if(eachCommand[1]){
            $.each(eachCommand[1].split(','), function(i, item){
                var part = item.split('=');
                var key = part[0].replace(/[ ]/g, '');
                advanceCommands[key] = part[1].indexOf([ "'", '"' ]) ? part[1].replace(/[ ]/g, '') : part[1];
            });
        }
        
        var rootDataBinding = root;
        if(dataBinding.split('.').length > 1 && dataBinding.indexOf('$') < 0){
            $.each(dataBinding.split('.'), function(i, item){
                rootDataBinding = rootDataBinding[item];
            });
        }else{
            if(typeof root[ dataBinding ] === 'undefined'){
                rootDataBinding = eval(dataBinding);
            }else{
                if(root[ dataBinding ] === ""){
                    rootDataBinding = [];
                }else{
                    rootDataBinding = root[ dataBinding ];
                }
            }
        }
        
        //apakah object yang dikirim html object atau bukan
        //kita cek dari perintah node
        var htmlEach = false;
        if(dataBinding.indexOf('$') >=0 ){
            htmlEach = true;
        }
        
        //diargument index dan value (key,val) mungkin lupa menulis koma
        if(!keyArgs){
            if( args.indexOf(' ')>=0){
                var arrArgs = args.split(' ');
                //memfilter variable kosong
                var newArgs = [];
                $.each(arrArgs, function(i, item){ if(item){ newArgs.push(item); } });
                keyArgs = newArgs[0];
                args = newArgs[1];
            }
        }else{
            args = args.replace(/[ ]/g, '');
        }
        
        var cmd = {
            data: rootDataBinding,
            val: args,
            key: keyArgs,
            advance: advanceCommands,
            isHtml: htmlEach,
            model: dataBinding || ''
        };
        return cmd;
    }
    function filterEach(data, _filter, isHtml){
        var newData = (data instanceof Array) ? [] : {};
        $.each(data, function(i, item){
            var txtItem = (isHtml) ? $(item).text() : JSON.stringify(item);
            if( txtItem.indexOf(_filter) >= 0 ){
                if(data instanceof Array){
                    newData.push( item );
                }else{
                    newData[i] = item;
                }
            }
        });
        return newData;
    }
    
    //[ CORE ENGINE ]
    //setDocumentDirective
    //untuk melengkapi dokument bisa ditambahkan defaultEvent lagi
    function setDocumentDirective(nodes, root){
        //mencari TAG-NAME atau ATTRIBUTE
        var searchDirective = function(dom){
            if(dom.tagName){ if(dom.tagName.toLowerCase() === 'script'){ return false; } }
            if( $(dom).attr('controller') && nodes != dom ){ return false; }
            dom = $(dom);
            
            //TAG
            if( dataDirective[dom[0].localName] ){
                var attrs = getALlAttributes( dom );
                return dataDirective[dom[0].localName](root, dom, attrs);
            }
            
            //ATTRIBUTES
            //mode attribute bisa juga komplit dengan nilai valuenya
            $.each(dom[0].attributes, function(i, item){
                if( dataDirective[item.nodeName] ){
                    var attrs = getALlAttributes( dom );
                    return dataDirective[item.nodeName](root, dom, attrs);
                }
            });
            
            // [ SPECIAL DIRECTION ]
            //auto radio name if model exists and name empty
            if(dom[0].type === 'radio'){
                if(dom.attr('model') && !dom.attr('name')){
                    dom.attr('name', dom.attr('model'));
                }
            }
            
            
            
            //next step ...
            $.each(dom[0].childNodes, function(i, item){
                if(item.nodeName !== '#text'){
                    searchDirective( item );
                }
            });
        }
        
        searchDirective(nodes);
    }
    //get init components
    function getInitComponents( nodes, root ){
        var foundInit = [];
        var dataInits = {};
        
        var setupInit = function( item ){
            item = item.split('; ').join(';').split(';');
            $.each(item, function(_i, _init){
                //memisahkan data init antara key dan val
                var parts = _init.split('='), key=parts[0], val=parts[1];
                //mengecek apakah key memiliki "."
                if( key.indexOf('.')>0 ){
                    //memecah parts
                    var objPart = key.split('.');
                    //kumpulkan semua object
                    var objGroup = [];
                    $.each(objPart, function(_i_, _item_){
                        if(_i_ === objPart.length-1){
                            objGroup.push({
                                name: _item_,
                                value: JSON.parse(val)
                            });
                        }else{
                            objGroup.push({
                                name: _item_,
                                value: {}
                            });
                        }
                    });
                    //join object
                    var cmdEval = 'root';
                    $.each(objGroup, function(_i_, _item_){
                        if(_i_ === objGroup.length-1){
                            cmdEval += "[ '"+_item_.name+"' ] = " + JSON.stringify(_item_.value);
                        }else{
                            cmdEval += "[ '"+_item_.name+"' ]";
                        }
                    });
                    eval( cmdEval );
                }else{
                    //normal init
                    try{
                        root[ key ] = JSON.parse( val );
                    }catch(er){
                        root[ key ] = eval( val );
                    }
                }
            });
        };
        
        function _getInitComponents(dom){
            if(dom.tagName){ if(dom.tagName.toLowerCase() === 'script'){ return false; } }
            if( $(dom).attr('controller') && nodes != dom ){ return false; }
            dom = $(dom);
            if(dom.attr('each')){ return false; }
            if(!dom.data('record')){
                dom.data( 'record', true );
                $.each(dom, function(i, item){
                    //get attribute item
                    $.each(item.attributes, function(_i, _item){
                        if(_item.nodeName === 'init'){
                            setupInit( _item.nodeValue );
                        }
                    });
                    
                    //next... get #text item.childNodes
                    $.each(item.childNodes, function(_i, _item){
                        if(_item.nodeName !== '#text'){
                            _getInitComponents( _item );
                        }
                    });
                });
            }
        }
        _getInitComponents(nodes);
        
        /**/
        function _setInitComponents(dom){
            if(dom.tagName){ if(dom.tagName.toLowerCase() === 'script'){ return false; } }
            dom = $(dom);
            $.each(dom, function(i, item){
                //get attribute item
                
                //mendapatkan nilai value dari element yang kebetulan inputan
                //dan memiliki attribute model
                if(defaultInputEvent[item.type]){
                    if(item.attributes.model){
                        var modelName = item.attributes.model.nodeValue;
                        //mengecek apakah di element sudah ada valuenya
                        //karena prioritas utama valuenya yang menempel pada element
                        var values = getElementValue(item);
                        //jika element ada maka root diganti
                        //jika element kosong maka root dikosongkan
                        if(modelName.split('.').length>1){
                            //no handler
                        }else{
                            if(values){ 
                                dataInits[modelName] = values;
                            }else{
                                dataInits[modelName] = '';
                            }
                        }
                    }
                }else{
                    if(item.attributes.model){
                        var modelName = item.attributes.model.nodeValue;
                        //set beberapa type seperti tag view
                        if(dom[0].localName === 'view'){
                            if(item.attributes.value){
                                dataInits[modelName] = item.attributes.value.nodeValue;
                            }else{
                                dataInits[modelName] = '';
                            }
                        }else{
                            dataInits[modelName] = '';
                        }
                    }
                }
                
                //next... get #text item.childNodes
                $.each(item.childNodes, function(_i, _item){
                    if(_item.nodeName !== '#text'){
                        _setInitComponents( _item );
                    }
                });
            });
        }
        _setInitComponents(nodes);
        
        $.each(foundInit, function(i, item){
            setupInit();
        });
        return dataInits;
    }
    //backup attribute dan text component
    function backupAttributesAndTextComponents( nodes ){
        var attrComponent = [];
        var _backupAttributesComponents = function(dom){
            if(dom.tagName){
                if(dom.tagName.toLowerCase() === 'script'){ return false; }
            }
            if( $(dom).attr('controller') && nodes != dom ){ return false; }
            dom = $(dom);
            if(!dom.attr('each')){
                $.each(dom, function(i, item){
                    var dataText = [], dataAttributes=[];
                    //backup childNodes #text yang ada dan menyimpanya di data
                    $.each(item.childNodes, function(_i, _item){
                        if(_item.nodeName === '#text'){
                            var cekMagic = searchMagicQuout(_item.nodeValue);
                            if(cekMagic.length){
                                dataText.push({
                                    component: _item,
                                    oldValue: _item.nodeValue
                                });
                            }
                        }
                    });
                    //backup attribute yang mengandung model
                    $.each(item.attributes, function(_i, _item){
                        var cekMagic = searchMagicQuout(_item.nodeValue);
                        if(cekMagic.length){
                            dataAttributes.push({
                                component: _item,
                                oldValue: _item.nodeValue
                            });
                        }
                    });
                    //menyatukan objectnya dan di kirim ke controller utama
                    if(dataAttributes.length || dataText.length){
                        var backup = {
                            attributes: dataAttributes,
                            textNode: dataText
                        };
                        $(item).data("attributes", dataAttributes);
                        $(item).data("textNode", dataText);
                        attrComponent.push( backup );
                    }
                    //next step
                    $.each(item.childNodes, function(_i, _item){
                        if(_item.nodeName !== '#text'){
                            _backupAttributesComponents( _item );
                        }
                    });
                });
            }else{
                if(!dom.data( 'template-each' )){
                    dom.data("template-each", dom.html());
                }
            }
        }
        _backupAttributesComponents(nodes);
        return attrComponent;
    }
    //set data component dari backup data
    function setDataComponentBackup( backupAttributes, root ){
        $.each(backupAttributes, function(i, item){
            //both data
            $.each(item, function(_i, _item){
                $.each(_item, function(_i_, _item_){
                    var command = _item_.oldValue;
                    var component = _item_.component;
                    var magic = searchMagicQuout( command );
                    var convert = inlineRecognize( command, magic, root );
                    component.nodeValue = convert;
                });
            });
        });
    }
    //set setEventListener
    function setEventListener( nodes, root ){

        var getFN = function(fn){
            fn = fn.substr(0, fn.indexOf('('));
            var rFn = fn.split('.');
            fn = rFn[0];
            return fn;
        };
        var _setEventListener = function(dom){
            if(dom.tagName){
                if(dom.tagName.toLowerCase() === 'script'){ return false; }
            }
            if( $(dom).attr('controller') && nodes != dom ){ return false; }
            dom = $(dom);

            //config event
            $.each(dom[0].attributes, function(i, item){
                if(eventListener.indexOf(item.nodeName) >= 0){
                    dom[0].addEventListener(item.nodeName, function(e){
                        if(    window[getFN(item.nodeValue)] instanceof Function 
                            || window[getFN(item.nodeValue)] instanceof Object
                        ){ 
                            if(typeof root[getFN(item.nodeValue)] !== 'function'){
                                console.log('window roots ' + getFN(item.nodeValue)); //return false; 
                            }
                        }
                        e.root = root;
                        root.$$event = e;  
                        root.$$this = dom[0];
                        
                        var ret;
                        var codes = item.nodeValue;
                        var cekFoo = getFunctionName(item.nodeValue);
                        if(typeof root[cekFoo] === 'function'){
                            $.each( root, function(i, k){ window[ i ] = k; });
                            ret = eval( "root." + codes );
                            $.each( root, function(i, k){
                                //root[i] = window[ i ];
                                delete window[ i ];
                            });
                        }else{
                            var ret = codeRecognize( item.nodeValue, root );
                        }
                        delete root.$$event; delete root.$$this;
                        //set watch automatic
                        //digunakan untuk update each
                        root.$reload();
                        watchRoootSelector(root, watchRoot);
                        //return false;
                    });
                }
            });

            //next step ...
            $.each(dom[0].childNodes, function(i, item){
                if(item.nodeName !== '#text'){
                    _setEventListener( item );
                }
            });
        };
        _setEventListener(nodes);
    }
    
    //otomatis watchroot
    function watchRoootSelector(root, watchRoot){
        var allWatch = [];
        $.each(watchRoot, function(i, item){ allWatch.push(i); });
        $.each(root, function(i, item){
            if(allWatch.indexOf(i) >= 0){
                watchRoot[i]( root[i] );
            }
        });
    }
    //set Element Model
    function setElementModel( nodes, root ){

        var _setElementModel = function(dom){
            if(dom.tagName){
                if(dom.tagName.toLowerCase() === 'script'){ return false; }
            }
            if( $(dom).attr('controller') && nodes != dom ){ return false; }
            dom = $(dom);
            var tagName = dom[0].nodeName.toLowerCase();
            
            //change view ellement
            if(tagName === 'view'){
                var modelView = dom.attr('model');
                var valueView = dom.attr('value');
                if( valueView !== root[modelView] ){
                    if(valueView){
                        dataDirective.view(root, dom, {});
                    }
                }
            }
            
            if(tagName != '#text'){
                $.each(dom[0].attributes, function(i, item){
                    var attr = item.nodeName;
                    if(attr === 'model'){
                        if(typeof item.nodeValue === 'string'){
                            if(item.nodeValue.indexOf('.')>0){
                                var value = codeRecognize(item.nodeValue, root);
                                setElementValue( dom[0], value );
                            }else{
                                var value = codeRecognize(item.nodeValue, root);
                                setElementValue( dom[0], value );
                            }
                        }else{
                            setElementValue( dom[0], root[item.nodeValue] );
                        }
                    }
                });
            }

            //next search item.childNodes
            $.each(dom[0].childNodes, function(i, item){
                if(item.nodeName !== '#text'){
                    _setElementModel( item );
                }
            });
        }

        //set default event
        /*
        var setDefaultEvent = function(ell, modelName){
            var tagName = ell.nodeName.toLowerCase();
            var type = ell.type;
            var events = defaultInputEvent[ type ];
            if(events){
                $.each(events, function(i, evt){
                    ell.addEventListener(evt, function(e){
                        var value = getElementValue(ell);
                        changeRootByEvents( value, modelName, root, ell, e );
                    });
                });
            }
        };
        */
        //run it ...
        _setElementModel(nodes);
    }
    //set default events
    function setDefaultEvent( nodes, root ){

        var _setDefaultEvent = function(dom){
            if(dom.tagName){
                if(dom.tagName.toLowerCase() === 'script'){ return false; }
            }
            if( $(dom).attr('controller') && nodes != dom ){ return false; }

            dom = $(dom);
            var tagName = dom[0].nodeName.toLowerCase();
            if(tagName != '#text'){
                $.each(dom[0].attributes, function(i, item){
                    var attr = item.nodeName;
                    if(attr === 'model'){
                        setEvents( dom[0], item.nodeValue )
                    }
                });
            }
            //next search item.childNodes
            $.each(dom[0].childNodes, function(i, item){
                if(item.nodeName !== '#text'){
                    _setDefaultEvent( item );
                }
            });
        }

        //set default event
        var setEvents = function(ell, modelName){
            var tagName = ell.nodeName.toLowerCase();
            var type = ell.type;
            var events = defaultInputEvent[ type ];
            if(events){
                $.each(events, function(i, evt){
                    ell.addEventListener(evt, function(e){
                        if(e.keyIdentifier === 'Control' || e.ctrlKey){ return false; }
                        var value = getElementValue(ell);
                        changeRootByEvents( value, modelName, root, ell, e );
                    });
                });
            }
        };

        //run it ...
        _setDefaultEvent(nodes);
    }
    //set tag directive
    function setTagDirectiveEvents( nodes, root ){
        //$.each(dataTagDirective, function(i, item){ item( i, $root ); });
        function _setTagDirectiveEvents(dom){
            if(dom.tagName){
                if(dom.tagName.toLowerCase() === 'script'){ return false; }
            }
            if( $(dom).attr('controller') && nodes != dom ){ return false; }
            dom = $(dom);
            $.each(dom[0].attributes, function(i, item){
                if(item){
                    var tagName = item.nodeName;
                    if(dataTagDirective[tagName]){
                        var command = codeRecognize(item.nodeValue, root) || item.nodeValue;
                        dataTagDirective[tagName]( command, root, dom[0] );
                    }
                }
            });
            
            //next...
            $.each(dom[0].childNodes, function(i, item){
                if(item.nodeName !== '#text'){
                    _setTagDirectiveEvents( item );
                }
            });
        }
        _setTagDirectiveEvents(nodes);
    }

    //[ SETTER GETER ELEMENT ]
    //set value by category
    function setElementValue(ell, value){
        var tagName = ell.nodeName.toLowerCase();
        switch(tagName){
            case "view":
                if(value){ $(ell).attr('value', value) }
                break;
            case "textarea":
                if(value){ $(ell).val( value ); }
                break;
            case "select":
                if(value){ $(ell).val( value ); }
                break;
            case "input":
                switch(ell.type){
                    case 'radio':
                        if($(ell).attr('value')){
                            if(value){
                                var name = ell.attributes.name.nodeValue;
                                $('input[name="'+ name +'"][value="'+ value +'"]')[0].checked = true;
                            }
                        }
                        break;
                    case 'checkbox':
                        ell.checked = value;
                        break;
                    case 'range':
                        $(ell).val( (value) );
                        break;
                    default:
                        $(ell).val( value );
                        break;
                }
                break;
        }
    }
    //get value by category
    function getElementValue(ell){
        var tagName = ell.nodeName.toLowerCase();
        switch(tagName){
            case "textarea":
                return $(ell).val();
                break;
            case "select":
                return $(ell).val();
                break;
            case "input":
                switch(ell.type){
                    case 'radio':
                        if(ell.checked){
                            return ell.value;
                        }else{
                            return $('input[name="'+ ell.attributes.name.nodeValue +'"][checked]').val();
                        }
                        break;
                    case 'number':
                        var vals = ell.value || 0;
                        return parseInt(vals);
                    case 'checkbox':
                        return ell.checked;
                    default:
                        return $(ell).val();
                }
                break;
            default:
                return $(ell).val();
                break;
        }
    }

    //[ AUTOMATIC SYSTEM ]
    function changeRootByEvents(value, modelName, root, ell, evt){
        if(modelName.indexOf('.')>0){
            eval( 'root.' + modelName + '= "' + value + '"' );
            root.$reload();
        }else{
            root[ modelName ] = value;
            if(typeof watchRoot[modelName] === 'function'){
                watchRoot[modelName]( value, ell, evt, modelName, root );
            }
            root.$reload();
        }
    }

    //[ MAGIC MECHINE ]
    function searchMagicQuout( lineText ){
        var found = [];
        //cek poin ^
        var point = lineText.split('^');

        var clearingCommands = function(command){
            return command.replace(/[\r\n]/g, '');
        };
        if(point.length > 1){
            $.each(point, function(i, item){
                if(i){
                    if(item.charAt(0) == '('){
                        var indexChar = [];
                        item.replace(/[(*)]/g, function( chars, index, text ){
                            indexChar.push({
                                index: index,
                                chars: chars,
                                mode: (chars==')')?'close':'open'
                            });
                        });
                        //console.log( "=>", indexChar );
                        //logical center
                        var mark = 0;
                        var run = 0;
                        var foundIndex = 0;

                        for( var x=0; x<indexChar.length; x++ ){
                            run++;
                            var mode = indexChar[x].mode;
                            if(run){
                                if(mode === 'open'){ mark++; }
                                if(mode === 'close'){ mark--; }
                                foundIndex = indexChar[x].index;
                                if(mark === 0){ break; }
                            }
                        }
                        foundIndex++;
                        var result = item.substr(0, foundIndex);

                        //check again if mode IF or Mathematic
                        var cekAgain = "-+/*?%".split('');
                        if( cekAgain.indexOf(item.substr(foundIndex, 1))>=0 ){
                            var spaceSplit = item.split(" ");
                            found.push( clearingCommands(spaceSplit[0]) );
                        }else{
                            found.push( clearingCommands(result) );
                        }
                    }else{
                        var spaceSplit = item.split(" ");
                        found.push( clearingCommands(spaceSplit[0]) );
                    }
                }
            });
        }
        
        
        return found;
    }
    function inlineRecognize( text, listMagic, data ){
        $.each(listMagic, function(i, item){
            var res = codeRecognize(item, data);
            text = text.replace( '^'+item, res );
        });
        return text;
    }
    function codeRecognize(code, root){
        //memfilter bila masih ada tanda kurung ( <arg name> )
        if(code.charAt(0) === '('){
            code = code.replace(/[\)\(]/g, '');
        }
        if( root[code] ){
            return root[code];
        }

        //kode terdapat expressi didalamnya
        //sanbox mode
        var lineInCode = commandInCode(code);
        code = lineInCode[0];
        try {
            var result;
            (function(window){
                $.each( root, function(i, k){ window[ i ] = k; });
                result = eval( code );
                $.each( root, function(i, k){
                    root[i] = window[ i ];
                    delete window[ i ];
                });
            })(window);
            if(lineInCode.length > 1){
                return filteringCodeResult(result, lineInCode.splice(1), root);
            }else{
                return result;
            }
        } catch (e) { 
            return '';
        }
    }
    function commandInCode(cmd){
        if( cmd.indexOf('|') >= 0 ){
            var cmds = cmd.split('|');
            var cmdFilterAdvance = [];
            $.each(cmds, function(i, item){
                if(i){
                    var combineKey = [];
                    var a = item.replace(/[\(\)]/g, '');
                    var b = a.split(' ');
                    //filter key empty
                    var c = [];
                    $.each(b, function(i2, val2){ if(val2){ c.push(val2); }});
                    combineKey.push(c[0]);
                    var d = c.splice(1);
                    var f = d.join("");
                    var keyFix = combineKey[0] +' '+ f;

                    cmdFilterAdvance.push(keyFix);
                }else{
                    cmdFilterAdvance.push(item.replace(/[\(]/g, ''));
                }
            });
            return cmdFilterAdvance;
        }else{
            return [cmd];
        }
    };
    function filteringCodeResult(result, filters, root){
        filters = filters[0];
        var command = {};
        var filterName = '';
        $.each(filters.split(':'), function(i, item){
            if(!i){
                filterName = item.replace(/[ ]/g, '');
            }else{
                var cfg = item.split('=');
                command[cfg[0]] = eval(cfg[1]);
            }
        });
        if( dataFilter[filterName] ){
            return dataFilter[filterName]( result, command, root );
        }else{
            return result;
        }
    }

    //[ HELPER FUNCTION ]
    function ell(node){
        var n = document.createElement(node);
        return $(n);
    }
    function isHtml(text){
        if(typeof text === 'string'){
            var node = $(text);
            return node[0].childNodes.length;
        }else{
            return true;
        }
    }
    function getArguments(foo){
        var a = foo.toString().replace(/[\r\n ]/g, '');
        a = a.substr( a.indexOf('(')+1, a.indexOf(')')-(a.indexOf('(')+1) );
        return a.split(',');
    }
    function applyFactoryInjectFunction(foo, root){
        var args = getArguments(foo);
        //search in both modul and service
        //modul instead
        var protoService = [];
        $.each(args, function(i, arg){
            switch(arg){
                case '$root':
                    protoService.push( root );
                    break
                case '$filter':
                    protoService.push( dataFilter );
                    break
                default:
                    if( dataCollection[arg] ){ protoService.push( dataCollection[arg] ); }
                    if( dataConfig[arg] ){ protoService.push( dataConfig[arg] ); }
                    if( dataService[arg] ){ protoService.push( dataService[arg] ); }
                    if( dataModule[arg] ){ protoService.push( new dataModule[arg](root) ); }
                    break
            }
        });
        return foo.apply(this, protoService);
    }
    function getALlAttributes(dom){
        var data = {};
        $.each( $(dom)[0].attributes, function(i, item){
            data[ item.nodeName ] = item.nodeValue;
        });
        return data;
    }
    function toInt(x){ return parseInt(x); }
    function getFunctionName(foo){
        foo = foo.toString();
        return foo.substr(0, foo.indexOf('('));
    }
    function _setCookie(key, value, options){
        options = options || {};
    	var encode = function(s){ return encodeURIComponent(s); }
	    var stringifyCookieValue = function(value){ 
	        return encode(typeof value === 'object' ? JSON.stringify(value) : String(value)); }
    
		if (typeof options.expires === 'number') {
			var days = options.expires, t = options.expires = new Date();
			t.setTime(+t + days * 864e+5);
		}
		return (document.cookie = [
			encode(key), 
			'=', 
			stringifyCookieValue(value),
			options.expires ? '; expires=' + options.expires.toUTCString() : '',
			options.path    ? '; path=' + options.path : '',
			options.domain  ? '; domain=' + options.domain : '',
			options.secure  ? '; secure' : ''
		].join(''));
    }
    function _getCookie(key){
        var result;
    	var decode = function(s){ return decodeURIComponent(s); };
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        for(var x=0; x<cookies.length; x++){
            var parts = cookies[x].split('=');
            if(decode(parts[0]) === key){
                result = parts[1];
                break;
            }
        }
		return result;
    }
    function _removeCookie(key){
    		if(_getCookie(key) === undefined){ return false; }
    		_setCookie(key, '', { expires:-1 });
    		return _getCookie(key);
        }
    var dateFormat = function () {
    	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
    		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
    		timezoneClip = /[^-+\dA-Z]/g,
    		pad = function (val, len) {
    			val = String(val);
    			len = len || 2;
    			while (val.length < len) val = "0" + val;
    			return val;
    		};
    
    	// Regexes and supporting functions are cached through closure
    	return function (date, mask, utc) {
    		var dF = dateFormat;
    
    		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
    		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
    			mask = date;
    			date = undefined;
    		}
    
    		// Passing date through Date applies Date.parse, if necessary
    		date = date ? new Date(date) : new Date;
    		if (isNaN(date)) throw SyntaxError("invalid date");
    
    		mask = String(dF.masks[mask] || mask || dF.masks["default"]);
    
    		// Allow setting the utc argument via the mask
    		if (mask.slice(0, 4) == "UTC:") {
    			mask = mask.slice(4);
    			utc = true;
    		}
    
    		var	_ = utc ? "getUTC" : "get",
    			d = date[_ + "Date"](),
    			D = date[_ + "Day"](),
    			m = date[_ + "Month"](),
    			y = date[_ + "FullYear"](),
    			H = date[_ + "Hours"](),
    			M = date[_ + "Minutes"](),
    			s = date[_ + "Seconds"](),
    			L = date[_ + "Milliseconds"](),
    			o = utc ? 0 : date.getTimezoneOffset(),
    			flags = {
    				d:    d,
    				dd:   pad(d),
    				ddd:  dF.i18n.dayNames[D],
    				dddd: dF.i18n.dayNames[D + 7],
    				m:    m + 1,
    				mm:   pad(m + 1),
    				mmm:  dF.i18n.monthNames[m],
    				mmmm: dF.i18n.monthNames[m + 12],
    				yy:   String(y).slice(2),
    				yyyy: y,
    				h:    H % 12 || 12,
    				hh:   pad(H % 12 || 12),
    				H:    H,
    				HH:   pad(H),
    				M:    M,
    				MM:   pad(M),
    				s:    s,
    				ss:   pad(s),
    				l:    pad(L, 3),
    				L:    pad(L > 99 ? Math.round(L / 10) : L),
    				t:    H < 12 ? "a"  : "p",
    				tt:   H < 12 ? "am" : "pm",
    				T:    H < 12 ? "A"  : "P",
    				TT:   H < 12 ? "AM" : "PM",
    				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
    				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
    				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
    			};
    
    		return mask.replace(token, function ($0) {
    			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    		});
    	};
    }();
        dateFormat.masks = {
        	"default":      "ddd mmm dd yyyy HH:MM:ss",
        	shortDate:      "m/d/yy",
        	mediumDate:     "mmm d, yyyy",
        	longDate:       "mmmm d, yyyy",
        	fullDate:       "dddd, mmmm d, yyyy",
        	shortTime:      "h:MM TT",
        	mediumTime:     "h:MM:ss TT",
        	longTime:       "h:MM:ss TT Z",
        	isoDate:        "yyyy-mm-dd",
        	isoTime:        "HH:MM:ss",
        	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
        	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
        };
        dateFormat.i18n = {
        	dayNames: [
        		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        	],
        	monthNames: [
        		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        	]
        };

    // [ DATA STORE ]
    (function(e) {
        function o() {
            try {
                return r in e && e[r]
            } catch (t) {
                return !1
            }
        }
        var t = {}, n = e.document, r = "localStorage", i = "script", s;
        t.disabled = !1, t.version = "0.0.1", t.set = function(e, t) {
        }, t.get = function(e, t) {
        }, t.has = function(e) {
            return t.get(e) !== undefined
        }, t.remove = function(e) {
        }, t.clear = function() {
        }, t.transact = function(e, n, r) {
            r == null && (r = n, n = null), n == null && (n = {});
            var i = t.get(e, n);
            r(i), t.set(e, i)
        }, t.getAll = function() {
        }, t.forEach = function() {
        }, t.serialize = function(e) {
            return JSON.stringify(e)
        }, t.deserialize = function(e) {
            if (typeof e != "string")
                return undefined;
            try {
                return JSON.parse(e)
            } catch (t) {
                return e || undefined
            }
        };
        if (o())
            s = e[r], t.set = function(e, n) {
                return n === undefined ? t.remove(e) : (s.setItem(e, t.serialize(n)), n)
            }, t.get = function(e, n) {
                var r = t.deserialize(s.getItem(e));
                return r === undefined ? n : r
            }, t.remove = function(e) {
                s.removeItem(e)
            }, t.clear = function() {
                s.clear()
            }, t.getAll = function() {
                var e = {};
                return t.forEach(function(t, n) {
                    e[t] = n
                }), e
            }, t.forEach = function(e) {
                for (var n = 0; n < s.length; n++) {
                    var r = s.key(n);
                    e(r, t.get(r))
                }
            };
        else if (n.documentElement.addBehavior) {
            var u, a;
            try {
                a = new ActiveXObject("htmlfile"), a.open(), a.write("<" + i + ">document.w=window</" + i + '><iframe src="/favicon.ico"></iframe>'), a.close(), u = a.w.frames[0].document, s = u.createElement("div")
            } catch (f) {
                s = n.createElement("div"), u = n.body
            }
            var l = function(e) {
                return function() {
                    var n = Array.prototype.slice.call(arguments, 0);
                    n.unshift(s), u.appendChild(s), s.addBehavior("#default#userData"), s.load(r);
                    var i = e.apply(t, n);
                    return u.removeChild(s), i
                }
            }, c = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
            function h(e) {
                return e.replace(/^d/, "___$&").replace(c, "___")
            }
            t.set = l(function(e, n, i) {
                return n = h(n), i === undefined ? t.remove(n) : (e.setAttribute(n, t.serialize(i)), e.save(r), i)
            }), t.get = l(function(e, n, r) {
                n = h(n);
                var i = t.deserialize(e.getAttribute(n));
                return i === undefined ? r : i
            }), t.remove = l(function(e, t) {
                t = h(t), e.removeAttribute(t), e.save(r)
            }), t.clear = l(function(e) {
                var t = e.XMLDocument.documentElement.attributes;
                e.load(r);
                for (var n = 0, i; i = t[n]; n++)
                    e.removeAttribute(i.name);
                e.save(r)
            }), t.getAll = function(e) {
                var n = {};
                return t.forEach(function(e, t) {
                    n[e] = t
                }), n
            }, t.forEach = l(function(e, n) {
                var r = e.XMLDocument.documentElement.attributes;
                for (var i = 0, s; s = r[i]; ++i)
                    n(s.name, t.deserialize(e.getAttribute(s.name)))
            })
        }
        try {
            var p = "__storejs__";
            t.set(p, p), t.get(p) != p && (t.disabled = !0), t.remove(p)
        } catch (f) {
            t.disabled = !0
        }
        t.enabled = !t.disabled, typeof module != "undefined" && module.exports && this.module !== module ? module.exports = t : typeof define == "function" && define.amd ? define(t) : dataStore.store = t
    })(Function("return this")())
    eng.localStore = {
        clearAll: dataStore.store.clear,
        set: dataStore.store.set,
        get: dataStore.store.get,
        getAll: dataStore.store.getAll,
        remove: dataStore.store.remove
    };
    
    // [ COLLECTION ]
    function Collection(structure){
        this.structure = structure || {};
        this.store = [];
        this.onChange = function(){};
    }
    Collection.prototype.insert = function(obj){
        var self = this;
        var id = Date.now() +""+ parseInt(Math.random()*1000);
        id = parseInt(id.replace('.', ''));
        var __create = Date.now();
        
        if(obj instanceof Array && this.structure instanceof Object){
            var objData = {}, i=0;
            $.each(this.structure, function(key, type){
                objData[key] = (typeof obj[i] === type)?obj[i]:"";
                i++;
            });
            objData.__id = id;
            objData.__update = __create;
            objData.__create = __create;
            this.store.push(objData);
        }else{
            $.each(obj, function(k, v){
                self.structure[k] = (v instanceof Object) ? 'object' : v.getType();
            });
            obj.__id = id;
            obj.__update = __create;
            obj.__create = __create;
            this.store.push(obj);
        }
        
        this.onChange();
        return this;
    };
    Collection.prototype.remove = function(obj){
        var self = this, ret = [];
        if(typeof obj != 'object'){
            var indexArray;
            $.each(this.store, function(i, store){
                if(store.__id == obj.toString()){
                    indexArray = i;
                }
            });
            if(indexArray >=0 ){
                self.store.splice(indexArray, 1);
            }
            this.onChange();
            return this;
        }
        
        $.each(this.store, function(i, store){
            $.each(store, function(key, value){
                $.each(obj, function(name, text){
                    if(name == key && text == value){
                        ret.push(i);
                    }
                });
            });
        });
        var runtime = 0;
        $.each(ret, function(i, index){
            self.store.splice(index-runtime, 1);
            runtime++;
        });
        
        this.onChange();
        return this;
    };
    Collection.prototype.get = function(obj){
        var self = this, ret = [];
        if(typeof obj != 'object'){
            $.each(this.store, function(i, store){
                if(store.__id == obj){
                    ret.push(store);
                }
            });
            return ret;
        }
        $.each(this.store, function(i, store){
            $.each(store, function(key, value){
                $.each(obj, function(name, text){
                    if(name == key && text == value){
                        ret.push( store );
                    }
                });
            });
        });
        return ret;
    };
    Collection.prototype.find = function(obj){
        var self = this, ret = [];
        $.each(this.store, function(i, store){
            $.each(store, function(key, value){
                $.each(obj, function(name, text){
                    if(name == key && (value.indexOf(text)>=0)){
                        ret.push( store );
                    }
                });
            });
        });
        return ret;
    };
    Collection.prototype.set = function(sourceUpdate){
        var self = this;
        var __setter = {};
        __setter.by = function(obj){
            var data = self.get(obj);
            $.each(data, function(i, item){
                item.__update = Date.now();
                $.extend(item, sourceUpdate);
            });
            self.onChange();
            return data;
        };
        return __setter;
    };
    
    //[PUBLIC FUNCTION]
    eng.ell = ell;
    eng.setCookie = function(key, value, options){
        return _setCookie( key, value, options );
    }
    eng.getCookie = function(key){
        return _getCookie(key);
    };
    eng.removeCookie = function(key){
        return _removeCookie(key);
    };
    
    //[ FILTER DEFAULT ]
    eng.filter('date', function(val, option){
        return dateFormat( new Date(val), option.format );
    });
    eng.filter('upper', function(v){ return v.toUpperCase() });
    eng.filter('lower', function(v){ return v.toLowerCase() });
    eng.filter('ucfirst', function(v){
        return v.substr(0, 1).toUpperCase() + v.substr(1, v.length).toLowerCase();
    });
    eng.filter('sorting', function(val, cfg){
        var newData = [], indexData = [], itemData = {};
        $.each(val, function(i, item){
            itemData[ item[cfg.key] +'_'+i ] = item;
            indexData.push( item[cfg.key] +'_'+i );
        });
        if(cfg.sort){
            indexData.sort();
        }else{
            indexData.sort().reverse();
        }
        
        //menyatukan kembali objectnya
        $.each(indexData, function(i, item){
            newData.push( itemData[item] );
        });
        return newData;
    });
    eng.filter('comma', function(v, cfg){
        return v/parseInt(cfg.decimal);
    });
    eng.filter('toInt', function(v, cfg){
        return parseInt(v);
    });
    eng.filter('src', function(e, cfg){
	    var file = new FileReader();
	    file.onload = function(){
	        e.root[cfg.model] = {
	            src: file.result,
	            info: e.target.files[0]
	        };
	        e.root.$reload();
	    };
	    file.readAsDataURL( e.target.files[0] );
    });
    eng.filter('mid', function(text, cfg){
        return text.substr( (cfg.point1), (cfg.point2) );
    });
    eng.filter('length', function(text, cfg){
        return text.length;
    });
    eng.filter('json', function(text, cfg){
        return JSON.stringify(text);
    });
    
    //[ DIRECTIVE DEFAULT ]
    eng.directive('drop-file', function(root, ell, attr){
        var handler = attr['drop-file'];
        var drop = $(ell)[0];
	    drop.addEventListener('dragover', function(e){ e.stopPropagation(); e.preventDefault(); }, false);
	    drop.addEventListener('dragenter', function(e){ e.stopPropagation(); e.preventDefault(); }, false);
	    drop.addEventListener('drop', function(e){ 
	    	e.stopPropagation(); e.preventDefault();
			var dt = e.dataTransfer;
			var allFiles = [];
			$.each(dt.files, function(i, item){ allFiles.push(item); });
			var dataFiles = [];
			var getFile = function(files){
			    if(!files.length){
			        var sendFiles = [];
			        $.each(dataFiles, function(i, item){
			            sendFiles.push({ src: item, file: allFiles[i] });
			        });
			        root[ handler ]( sendFiles );
			        return false;
			    }
			    var file = new FileReader();
			    file.readAsDataURL(files[0]);
			    file.onload = function(){
			        dataFiles.push(file.result);
			        getFile( files.splice(1) );
			    };
			}
			getFile(allFiles);
			
	    }, false);
    });
    eng.directive('clone', function(root, ell, attr){
        var clone = parseInt(attr.clone);
        ell.removeAttr('clone');
        for(var x=0; x<clone-1; x++){
            var domCLone = $(ell).clone();
            domCLone.insertAfter($(ell));
        }
    });
    eng.directive('checkbox', function(root, element, attr){
        var forId = "id_" + Math.floor( Math.random()*10000 );
        var input = ell('input').attr({ type:'checkbox', model:attr.model, id:forId });
        var label = ell('label').attr('for', forId).html( attr.label );
        label.insertAfter($(element));
        input.insertAfter($(element));
        $(element).remove();
    });
    var localViewCache = {};
    eng.directive('view', function(root, element, attr){
        setTimeout(function(){
            var urlValue = $(element).attr('value');
            if(urlValue){
                if( $(element).data('value') !== urlValue ){
                    $(element).data('value', urlValue); //memberikan tanda jangan di ulang
                    //events start pada saat ajax akan dimulai
                    var starts = $(element).attr('start');
                    if(starts){ codeRecognize( starts, root ); }
                    //option cache pada dokument
                    var cache = $(element).attr('cache')||'';
                    cache = codeRecognize(cache, root) || false;
                    //local view cache adalah kontent yang disimpan didalam object
                    //jika diatur nilainya true maka ajax tidak akan di exekusi
                    var localCache = $(element).attr('local-cache')||'';
                    localCache = codeRecognize(localCache, root) || false;
                    if(localCache){
                        if(localViewCache[urlValue]){
                            var result = localViewCache[urlValue];
                            $(element).empty().append(result).data('record', false);
                            root.$reset( element );
                            setTimeout(function(){
                                var successEvents = $(element).attr('success');
                                if(successEvents){
                                    codeRecognize( successEvents, root );
                                }
                            });
                            return false;
                        }
                    }
                    //metode ajax dijalankan
                    $.ajax({
                        url: urlValue,
                        cache: cache,
                        success: function(result){
                            localViewCache[urlValue] = result;
                            $(element).empty().append(result).data('record', false);
                            root.$reset( element );
                            setTimeout(function(){
                                var successEvents = $(element).attr('success');
                                if(successEvents){
                                    codeRecognize( successEvents, root );
                                }
                            });
                        },
                        error: function(){
                            var errors = $(element).attr('error');
                            if(errors){
                                codeRecognize( errors, root );
                            }
                        }
                    });
                }
            }
        });
    });
    eng.directive('binding', function(root, element, attr){
        $(element).html( '^'+attr.model );
    });
    
    //[ TAG DIRECTIVE DEFAULT ]
    eng.tagDirective('show', function(cmd, root){ 
        $('[show]').each(function(i, item){
            var command = $(item).attr('show');
            var varsCmd = codeRecognize(command, root);
            if(varsCmd){
                $(item).show();
            }else{
                $(item).hide();
            }
        });
    });
    eng.tagDirective('hide', function(cmd, root){ 
        $('[hide]').each(function(i, item){
            var command = $(item).attr('hide');
            var varsCmd = codeRecognize(command, root);
            if(varsCmd){
                $(item).hide();
            }else{
                $(item).show();
            }
        });
    });
    eng.tagDirective('template', function(cmd, root, element){
        if(startup){
            root.tpl( cmd );
        }else{
            setTimeout(function(){ root.tpl( cmd ); }, 100);
        }
    });
    eng.tagDirective('binding', function(cmd, root, element){
        var commands = $(element).attr('binding');
        var test = codeRecognize(commands, root);
        $(element).html( test );
    });
    eng.tagDirective('_disabled', function(value, root, ell){
        if(typeof value === 'boolean'){
            if(value){ $(ell).attr({ disabled:true }); }
        }else{
            $(ell).removeAttr('disabled');
        }
    });
    eng.tagDirective('_checked', function(value, root, ell){
        if(typeof value === 'boolean'){
            if(value){ $(ell).attr({ checked:'checked' }); }
        }else{
            $(ell).removeAttr('checked');
        }
    });
    eng.tagDirective('_readonly', function(value, root, ell){
        if(typeof value === 'boolean'){
            if(value){ $(ell).attr({ readonly:'readonly' }); }
        }else{
            $(ell).removeAttr('readonly');
        }
    });

    // [ STARUP ]
    function autoRun(){
        $(document).ready(function(){
            $('body').find('[controller]').each(function(i, item){
                var ctrlName = item.attributes.controller.nodeValue || 'controller_' + Math.floor( Math.random()*10000 );
                if(!dataController[ctrlName] ){
                    $(item).attr('controller', ctrlName);
                    eng.controller(ctrlName, function(){});
                }
            });
        });
    }
    $(document).ready(function(){
        autoRun();
        goRoute();
    });
})(window, document);
