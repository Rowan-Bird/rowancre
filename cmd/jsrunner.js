/**
 *  jshint options  - JSRunner , jQuery , $ , forin
 */

;(function( JSRunner , $ ){
    'use strict';

    ///////////////  Adding Custom Functions into jQuery name space ////////////////
    (function(){
        $.fn.setCaret = function() {
            var range, selection;
            return this.each(function() {
                this.focus();
                if (document.createRange) { // web kit browsers , IE9+
                    range = document.createRange();//Create a range (a range is a like the selection but invisible)
                    range.selectNodeContents(this);//Select the entire contents of the element with the range
                    range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
                    selection = window.getSelection();//get the selection object (allows you to change selection)
                    selection.removeAllRanges();//remove any selections already made
                    selection.addRange(range);//make the range you have just created the visible selection
                } else if (document.selection) { // IE8 & lower
                    range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
                    range.moveToElementText(this);//Select the entire contents of the element with the range
                    range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
                    range.select();//Select the range (make it the visible selection
                }
            });
        };

        $.fn.addScroll = function( $ele , height ) {
            height = height - 100;
            if ($ele.height() > height ) {
                $ele.css ({
                    'height' :  height +'px',
                    'overflow-y' : 'auto',
                    'width' : this.width() + 20,
                })
            }else {
                $ele.css ({
                    'height' :  'auto',
                    'width' : 'auto',
                })
            }
        }

    })();

    ////////////////////////// End of Custom Funtions /////////////////////////

    JSRunner.Utils = (function(){

        function Utils(){}

        //arguments - [cbFun , params ]
        Utils.prototype.callBack = function(){
            if(typeof arguments[0] == "function"){
                arguments[0].apply(this , [arguments[1]]);
            }else{
                this.error('not valid function or function does not exist');
            }
        };

        Utils.prototype.findKey = function(event){
            return event.which || event.keyCode;
        };

        Utils.prototype.error = function(msg){
            throw new error(msg);
        };

        Utils.prototype.trim = function(str){
            return (str || "").replace(/^\s+|\s+$/g,"");
        };

        // arguments -  [tag , nameProp , class]
        Utils.prototype.appendItems = function(){
            var i = 0,len = this[arguments[1]].length,list = [];
            for (; i < len ; i++) {
                list[i] = '<'+arguments[0]+' class="'+arguments[2]+'">'+this[arguments[1]][i]+'</'+arguments[0]+'>';
            }
            return list.join('');
        };

        return Utils;

    })();

    // History scoped to the browser tab, if we close the tab history will expaire
    // if we need history to be alive even after reopend the tab then move to localStorage
    JSRunner.Historystore = (function(){

        function Historystore(){
            this.history = this.getHistory();
            this.historyLen = this.history.length;
        }

        Historystore.prototype.setHistory = function(){
            sessionStorage.setItem('history',JSON.stringify(this.history));
            this.historyLen = this.history.length;
        };

        Historystore.prototype.getHistory = function(){
            return JSON.parse(sessionStorage.getItem('history')) || [""];
        };

        Historystore.prototype.showHistory = function(){
            return this.getHistory().join('<br/>');
        };

        Historystore.prototype.clearHistory = function(){
            sessionStorage.removeItem('history');
        };

        return Historystore;

    })();

    JSRunner.Executecommand = (function(){

        Executecommand.prototype = new JSRunner.Historystore();

        function Executecommand(){
            this.customCommands = {
                history : function(){
                    return JSRunner.Historystore.prototype.showHistory.call(this);
                },
                clear : function(){
                    JSRunner.Historystore.prototype.clearHistory.call(this);
                }
            };
        }

        Executecommand.prototype.sendCommand = function( cmd ){
            //check for any predefined commands
            this.properties=[];
            this.properties.push('<span class="info">>>'+cmd+'</span>');
            if(cmd.substr(0,1) == ':'){
                if(this.customCommands.hasOwnProperty(cmd.substr(1))){
                    this.properties.push(this.customCommands[cmd.substr(1)].call(this));
                    return;
                }
            }
            this.history.push(cmd);
            this.setHistory();
            this.executeCommand(cmd);
            this.updateClass='';
        };

        Executecommand.prototype.executeCommand = function( cmd ){
            try{
                var opt = this.helperFrame.eval(cmd);
                this.updateClass = 'success';
            } catch (e){
                var opt = e.message;
                this.updateClass = 'error';
            }
            this.properties.push(this.stringify(opt));
        };

        //////////// below function definition/code  taken from the JSConsole ////////////
        //TODO : cleanup &  document code flow for others to understand
        Executecommand.prototype.stringify = function(o, simple, visited){
            var json = '', i, vi, type = '', parts = [], names = [], circular = false;
            visited = visited || [];

            //TODO : will be removed this nesting  , coz function definition will load into memory whenever we call parent method 'stringyfy'
            function sortci(a, b) {
                return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
            }

            try {
                type = ({}).toString.call(o);
            } catch (e) {
                type = '[object Object]';
            }

              // check for circular references
            for (vi = 0; vi < visited.length; vi++) {
                if (o === visited[vi]) {
                    circular = true;
                    break;
                }
            }

            // checking for the type of Object & stringify the object
            if (circular) {
                json = '[circular]';
            }else if (type == '[object String]') {
                json = '"' + o.replace(/"/g, '\\"') + '"';
            }else if (type == '[object Array]') {
                visited.push(o);
                json = '[';
                for (i = 0; i < o.length; i++) {
                    parts.push(this.stringify(o[i], simple, visited));
                }
                json += parts.join(', ') + ']';
                //json;
            }else if (type == '[object Object]') {
                visited.push(o);

                json = '{';
                for (i in o) {
                    names.push(i);
                }
                names.sort(sortci);
                for (i = 0; i < names.length; i++) {
                    parts.push( this.stringify(names[i], undefined, visited) + ': ' + this.stringify(o[ names[i] ], simple, visited) );
                }
                json += parts.join(', ') + '}';
            }else if (type == '[object Number]') {
                json = o+'';
            }else if (type == '[object Boolean]') {
                json = o ? 'true' : 'false';
            }else if (type == '[object Function]') {
                json = o.toString();
            }else if (o === null) {
                json = 'null';
            }else if (o === undefined) {
                json = 'undefined';
            }else if (simple === undefined) {
                visited.push(o);

                json = type + '{<br/>';
                for (i in o) {
                    names.push(i);
                }
                names.sort(sortci);
                for (i = 0; i < names.length; i++) {
                    parts.push(names[i] + ': ' + this.stringify(o[names[i]], true, visited));
                }
                json += parts.join(',<br/>') + '<br/>}';
            }else {
                try {
                    json = o+''; // should look like an object
                } catch (e) {}
            }
            return json;
        };

        return Executecommand;

    })();


    JSRunner.Scriptrunner = (function(){

        Scriptrunner.prototype = new JSRunner.Executecommand();

        function Scriptrunner(){
            // cached jQuery elements
            this.$command = $(arguments[0]);
            this.$commandTxt = $('#commandtxt');
            this.cacheProp={};
            this.propCounter=0;
            this.properties=[];
            this.$output = $('#output');
            this.$console=$('#console');
            this.$propListWrapper = $('#PropWrapper');
            this.$propList = $('#PropList');
            this.rejectKey = [35,38,39,40]; // rejeck key stroke onkeyup , if need more keep on add
            this.wHeight = $(window).height();
            // TODO : make it configurable way
            //cached helper iframe  window object
            this.helperFrame = document.getElementById("helperframe").contentWindow || document.getElementById("helperframe").contentDocument;
            // collect the window object from iframe not from top window
        }

        Scriptrunner.prototype.init = function(){
            var _this=this;
            this.$commandTxt.focus();
            // overwrite the helperFrame console - log & dir.. , otherwise command will execute in borwser console
            this.helperFrame.console.log = function() {
                var l = arguments.length, i = 0;
                for (; i < l; i++) {
                    _this.properties.push(_this.stringify(arguments[i], true));
                }
            };

            this.helperFrame.console.dir = function () {
                var l = arguments.length, i = 0;
                for (; i < l; i++) {
                    _this.properties.push(_this.stringify(arguments[i]));
                }
            };

            // update css for the consoleWrapper
            this.$console.css( 'height', this.wHeight - 40 );
            $('.rightpane').css( 'height', this.wHeight );

            // cache the props for later use
            this.getSuggestions( 'window' );
            this.events();
        };

        // register all events below , so that easiar to maintain all the listenrs
        Scriptrunner.prototype.events = function(){
            // event listener when user types in
            this.$command.on({
                keyup : $.proxy(this.autoPopulate , this) ,
                keydown : $.proxy(this.handleKeyStroke , this) ,
            }, "#commandtxt" );

            this.$command.on('click' , $.proxy(function(e){
                this.$commandTxt.focus();
            },this));
        };

        /**
         * handle keystokes pressed in
         * @param { Event } - e
         */
        Scriptrunner.prototype.handleKeyStroke = function( e ){
            var key = JSRunner.Utils.prototype.findKey.call('', e ),
            cmdTxt =  JSRunner.Utils.prototype.trim.call('',$(e.currentTarget).text()),
            len = this.properties.length;
            console.log(cmdTxt.length, len);

            if( cmdTxt.length > 0 && len > 0 && (key === 35 || key === 39)) {
                // collect text from suggest node & append text to main area
                // TODO : cache the 'suggest' node
                // TODO : document below query , others to understand
                this.$commandTxt
                    .data('txt',$('.autopop').text())
                    .next().html('')
                .end()
                    .append(function(){
                        return $(this).data('txt');
                    })
                    .setCaret()
                ;
                this.$propListWrapper.css({
                    'height':'auto',
                    'width' : 'auto',
                    });

                this.removeSuggestions();
                this.propCounter=0;
            }
            // if user pressed UP or BOTTOM , autopopulate back & forth
            else if( len > 1 && (key === 38 || key === 40) ){
                //TODO : clean up below code & check this logic with larger data set
                this.propCounter = this.counterPos( key );
                this.propCounter = (this.propCounter === len ) ? 0 : ((this.propCounter === -1) ?
                                    this.propCounter=len-1 : this.propCounter) ;
                this.$propList.find('li')
                              .css('background-color','')
                              .eq(this.propCounter)
                              .css('background-color','#ccc');
                $('.autopop').remove();
                this.appendProperty();
                e.preventDefault();
            }
            // if user pressed UP & BOTTOM key , traverse history if any
            else if( this.history.length > 0  && (key === 38 || key === 40)) {
                if(key == 38 && this.historyLen > 0) {
                    this.propCounter = --this.historyLen;
                } else if( key == 40 && this.historyLen < this.history.length-1) {
                    this.propCounter = ++this.historyLen;
                }
                //console.log(this.propCounter);
                this.$commandTxt
                    .text(this.history[this.propCounter])
                    .setCaret()
                ;
            }
            // if user press ENTER + SHIFT , let it go to next line for multiline code
            else if(key == 13 && e.shiftKey === true){} // TODO : add some defensive code
            // if user press ENTER , submit command to execute
            else if(key == 13 && cmdTxt.length !== 0){
                this.sendCommand(cmdTxt);
                // empty command text , set cursor position
                this.$commandTxt.text('').focus();
                this.printOutput();
                this.propCounter=0;
                e.preventDefault();
            }
        };

        /**
         * return the counterPostion for UP & BOTTOM key press
         */
        Scriptrunner.prototype.counterPos = function( key ) {
            return  (key === 40 ) ? this.propCounter=this.propCounter+1 : ((key === 38 ) ?
                                    this.propCounter=this.propCounter-1: this.propCounter) ;
        };

        /**
         * print executed code & output
         */
        Scriptrunner.prototype.printOutput = function(){
            var opt = JSRunner.Utils.prototype.appendItems.apply(this , ['li','properties',this.updateClass]);
            this.$output.prepend(opt);
            //update classes for appended li
            this.$output.find('li').eq(this.properties.length-1).addClass('last');
        };

        /**
         * auto populate properties based on input
         * @param { Event } - e
         */
        Scriptrunner.prototype.autoPopulate = function( e ){

            //e.preventDefault();
            // TODO : way i calling mehtods looks ugly & lengthy , make it simple
            var key = JSRunner.Utils.prototype.findKey.call('', e ),
            cmdTxt =  JSRunner.Utils.prototype.trim.call('',$(e.currentTarget).text());

            // Do early exit if there is no text typed in or pressed any of rejected Key set
            if(this.rejectKey.indexOf(key) !== -1 ) return;
            if( cmdTxt === '' ) {
              this.removeSuggestions();
              return;
            }
            this.propCounter=0;this.removeSuggestions();
            // format the text i.e
            // split the text with period , send the last part as needle
            var list = cmdTxt.split('.'),
            needle = list[list.length-1] ,
            Obj = list.slice(0,list.length-1).join('.') || 'window' ;
            //console.log(keyIn);
            this.needlen=needle.length;
            this.properties = this.getSuggestions( Obj , needle );

            // now got the props , lets auto populate
            // check length
            if(this.properties.length > 0) {
                // always append the first property
                this.appendProperty();
                if(this.properties.length > 1)
                this.$propList.html(JSRunner.Utils.prototype.appendItems.apply(this , ['li','properties','']));
                this.$propListWrapper
                    .find('li')
                    .eq(this.propCounter)
                    .css('background-color','#ccc')
                    .addScroll( this.$propListWrapper, this.wHeight )
                ;

            }
        };

        /**
         * Append property text to main command leaving needle text
         * also if user keydown non-printable keys - UP, BOTTOM
         */
        Scriptrunner.prototype.appendProperty = function(){
            this.$command.append($("<span>")
                                    .addClass("autopop")
                                    .text(this.properties[this.propCounter].slice(this.needlen,this.properties[this.propCounter].length))
                                );
        };

        /**
         * Pull Porperties based on params received by the request
         * @param { String } Obj - string to execute & pull props
         * @param { String } needle - string to filter already pulled props
         * @return { Array } props - properties
         */
        Scriptrunner.prototype.getSuggestions = function( Obj , needle ){
            // check properties cached or not , if not have it cached for later use
            //console.log(Obj, needle);
            var props = [];
            if( !this.cacheProp[Obj] ) {
                try {
                    var doc = this.helperFrame.eval(Obj);
                    for( var prop in doc ){
                        props.push(prop);
                    }
                    this.cacheProp[Obj] = props.sort();
                }catch(e){
                    this.cacheProp[Obj] = [];
                }

            }else if( needle ) {
                var i=0,len = this.cacheProp[Obj].length;//needlLen=needle.length;
                for( ; i < len ; i++ ){
                    if(this.cacheProp[Obj][i].indexOf(needle) === 0 ){
                        props.push(this.cacheProp[Obj][i]);
                    }
                }
            }else{
                props = this.cacheProp[Obj];
            }
            return props;
        };

        Scriptrunner.prototype.removeSuggestions = function() {
            //TODO : shoud be removed directly, don't find then remove
            this.$command.find('.autopop').remove();
            //reset populated list , just insert empty don't remove items
            this.$propList.html('');
        };

        return Scriptrunner;
    })();

})( window.JSRunner = window.JSRunner || {} , jQuery );

new JSRunner.Scriptrunner('#command').init();
