
var Emitter = require('emitter');

var Element = {
	css: require('./css'),
	data: require('./data'),
	event: require('./event'),
	query: require('./query'),
	content: require('./content')
};


function element(el,sel){
    if(typeof el === 'string') {
        el = Element.query('querySelector', sel ? wrap(sel) : undefined, el);
    } else if(typeof sel === 'string') {
        el = Element.query('querySelector', el ? wrap(el) : undefined, sel);
    }

    return el ? wrap(el) : undefined;
}

element.all = function(el,sel){
    if(typeof el === 'string') {
        el = Element.query('querySelectorAll', sel ? wrap(sel) : undefined, el);
    } else if(typeof sel === 'string') {
        el = Element.query('querySelectorAll', el ? wrap(el) : undefined, sel);
    }

    return el ? wrap(el) : undefined;
}          

function wrap(el){
    if(!el || typeof el === 'function') return el;

    if(el instanceof NodeList){
        var w = [];

        for(var i = 0, l = el.length; i < l; i++)
            w[i] = wrap(el[i]);

        return w;
    }

    var data = Element.data(el);

    function element(sel){
        if(sel) return wrap(Element.query('querySelector',element,sel));
        
        /* unwrap */
        return el;   
    }

    element.all = function(sel){
        if(sel) return wrap(Element.query('querySelectorAll',element,sel));

        return el;
    }

    element.el = el;

    element.id = el.id;
  
    element.guid = data.__id__;
    
    element.toString = function(format){
        return el.outerHTML;
    }

    element.attr = function(attr,val){
        if(val === undefined) return el.getAttribute(attr);

        if(val) el.setAttribute(attr,val);
        else el.removeAttribute(attr); 

        return this;
    }

    element.data = function(key,val){
        var data = Element.data(el);

        if(key === undefined) return data;
        if(val !== undefined) data[key] = val;

        return data[key];
    }

    for(var api in Element)
   		augment(element,Element[api]);
   	
    element.event = element.data('__event__',new Emitter());

    return element;
}

function augment(element,obj) {
    for(var o in obj)
        if(!element[o]) element[o] = obj[o];
}

module.exports = element;