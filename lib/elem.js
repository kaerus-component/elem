

var Element = {
	css: require('./css'),
	data: require('./data'),
	event: require('./event'),
	query: require('./query'),
	content: require('./content'),
    attribute: require('./attribute')
};

var QS = ['querySelector', 'querySelectorAll'];

function element(el,sel,fil){
    var tmp, qs;

    if(typeof el === 'string'){
        tmp = sel;
        sel = el;
        el = tmp;

        if(typeof el === 'string'){
            tmp = fil;
            fil = el;
            el = tmp;
        }
    }

    qs = QS[fil ? 1 : 0];

    if(typeof sel === 'string') {
        if(el){
            if(el === window || el === document) el = undefined;
            else if(typeof el !== 'function') el = wrap(el);
        }

        el = Element.query(qs, el, sel);
    }

    return el ? wrap(el,fil) : undefined;
}          

function wrap(el,fil){
    if(!el || typeof el === 'function') return el;

    if(el instanceof NodeList){
        var w = [];
        var wrapper = (function(filter){
            if(filter && filter !== '*') {
                return function selector(e){
                    return wrap(Element.query('querySelectorAll',wrap(e),fil));
                }
            } 
            return wrap;
        })(fil);

        for(var i = 0, l = el.length; i < l; i++){
            w[i] = wrapper(el[i]);
        }

        return w;
    }

    function element(sel,qs){
        qs = QS[qs ? 1 : 0];

        if(sel) return wrap(Element.query(qs,element,sel));
        
        /* unwrap */
        return el;   
    }

    element.el = el;
    
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