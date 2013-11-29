/* require shims */
require('./shims/querySelector.js');

var Event = require('event'),
    Emitter = require('emitter');


function query(meth,el,sel){
    if(!el) return document[meth](sel);

    var e = el(), id = e.id;

    e.id = 'guid' + el.guid;

    sel = '#' + e.id + ' ' + sel;
        
    try { return e[meth](sel) } catch (err) { throw err } finally { e.id = id }    
}

var Data = {
    store: {},
    guid: 'data' + (new Date().getTime()),
    guidCounter: 1
}; 

function element(el,sel){
    if(typeof el === 'string') {
        el = query('querySelector', sel, el);
    } else if(typeof sel === 'string') {
        el = query('querySelector', wrap(el), sel);
    }

    return el ? wrap(el) : undefined;
}

element.all = function(el,sel){
     if(typeof el === 'string') {
        el = query('querySelectorAll', sel, el);
    } else if(typeof sel === 'string') {
        el = query('querySelectorAll', el, sel);
    }

    el = query('querySelectorAll',wrap(el),sel);

    return el ? wrap(el) : undefined;
}          

var event_methods = { 
    on: function(ev,fn){
        ev = ev.split(' ');
        
        var i = ev.length;
        
        while(1 < i--) this.on(ev[i],fn);
        
        ev = ev[0];  
        
        this.event.on(ev,fn);

        Event.add(this.el,ev,onEvent);

        return this;
    }, 
    off: function(ev,fn){
        ev = ev.split(' ');

        var i = ev.length;
        
        while(1 < i--) this.remove(ev[i],fn);
        
        ev = ev[0];

        if(!this.event.off(ev,fn).hasListeners(ev))
            Event.remove(this.el,ev,onEvent);

        return this; 
    }, 
    delegate: function(ev,fn){
        Event.add(document,ev,onDelegate,true);

        var guid = this.guid;

        Event.on(ev+'>'+guid,fn);

        return this;
    },
    undelegate: function(ev,fn){
        var guid = this.guid;

        if(guid) {
            Event.off(ev+'>'+guid,fn);
        }

        return this;
    }
};

function onEvent(event) {
    event = Event.normalize(event);
    element(this).event.emit(event.type,event);
}

function onDelegate(event) {
    var guid = element(this).guid;
    event = Event.normalize(event);
    Event.emit(event.type+'>'+guid,event);
}

function wrap(el){
    if(!el || typeof el === 'function') return el;

    if(el instanceof NodeList){
        var w = [];

        for(var i = 0, l = el.length; i < l; i++)
            w[i] = wrap(el[i]);

        return w;
    }

    var data = getData(el);

    /* todo: refactor these out */

    function element(sel){
        if(sel) return query('querySelector',element,sel);
        
        /* unwrap */
        return el;   
    }


/*
        element = (function(context,handler){
            var curry = [].slice.call(arguments,2);
            return function(){
                var args = [].slice.call(arguments).concat(curry);
                return handler.apply(context,args);
            }
        }(el,proxy,data));
*/

    element.el = el;
  
    element.guid = element.el[Data.guid];

    element.toString = function(format){
        return el.outerHTML;
    }

    element.html = function(content){
        if(content !== undefined)
            el.innerHTML = content;
        else return el.innerHTML;

        return this;
    }

    element.text = function(content){
        if(content !== undefined)
            el.innerText = content;
        else return el.innerText;

        return this;        
    }

    element.data = function(key,val){
        var data = getData(el);

        if(key === undefined) return data;
        if(val !== undefined) data[key] = val;

        return data[key];
    }

    element.append = function(content){

        if(Array.isArray(content)){
            content.forEach(function(c){
                element.append(c);
            });

            return this;
        }

        var e = createElement(content);
   
        el.appendChild(e);

        return this;
    }

    element.prepend = function(content){
        
        if(Array.isArray(content)){
            content.forEach(function(c){
                element.prepend(c);
            });

            return this;
        }

        var e = createElement(content);

        el.insertBefore(e,el.firstChild);

        return this;
    }

    element.event = element.data('__event__');

    augment(element,event_methods);

    return element;
}

function createElement(content){
    var el;

    if(typeof content === 'string'){
        el = document.createElement('div');
        el.innerHTML = content;
        el = el.firstChild;
    } else if(typeof content === 'function'){
        el = createElement(content());
    } else el = content;
    
    return el;     
}

function augment(el,obj) {
    for(var o in obj)
        if(!el[o]) el[o] = obj[o];
}

function getData(el){
    var guid = el[Data.guid];

    if(!guid){
        guid = el[Data.guid] = Data.guidCounter++;
        Data.store[guid] = {__event__: new Emitter()};
    }

    return Data.store[guid];
}

function removedata(el){
    var guid = el[Data.guid];

    if(!guid) return;

    delete Data.store[guid];

    try {
        delete el[Data.guid];
    } catch (err) {
        if(el.removeAttribute){
            el.removeAttribute(Data.guid);
        }
    }
}  


module.exports = element;