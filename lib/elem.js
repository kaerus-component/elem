

var Element = {
	css: require('./css'),
	data: require('./data'),
	event: require('./event'),
	query: require('./query'),
	content: require('./content'),
    attribute: require('./attribute')
};

var QS = ['querySelector', 'querySelectorAll'];

function element(sel,el,qs,pt){

    if(typeof el === 'boolean'){
        qs = el;
        el = pt;
    }

    qs = QS[qs ? 1 : 0];

    if(typeof el === 'string') {
        pt = sel;
        sel = el;
        el = pt;
    }

    if(el && typeof el !== 'function') el = wrap(el);

    if(typeof sel === 'string') {
        el = Element.query(qs, el, sel);
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

    function element(sel,qs){
        qs = QS[qs ? 1 : 0];

        if(sel) return wrap(Element.query(qs,element,sel));
        
        /* unwrap */
        return el;   
    }

    element.el = el;

    element.each = function(next,done){
        each(el,next,done);

        return element;
    }
    
    element.toString = function(format){
        return el.outerHTML;
    }

    for(var api in Element) augment(element,Element[api]);

    return element;
}

function augment(element,obj) {
    for(var o in obj) if(!element[o]) element[o] = obj[o];
}

module.exports = element;