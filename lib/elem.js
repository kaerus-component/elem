

var Element = {
	css: require('./css'),
	data: require('./data'),
	event: require('./event'),
	query: require('./query'),
	content: require('./content'),
    attribute: require('./attribute')
};

var QS = ['querySelector', 'querySelectorAll'];

function element(el,sel,filter){
    var tmp, qs;

    if(typeof el === 'string'){
        tmp = sel;
        sel = el;
        el = tmp;

        if(typeof el === 'string'){
            tmp = filter;
            filter = el;
            el = tmp;
        }
    }

    qs = QS[filter ? 1 : 0];

    if(typeof sel === 'string') {
        if(el){
            if(el === window || el === document) el = undefined;
            else if(!(el instanceof Elem)) el = wrapElement(el);
        }

        el = Element.query(qs, el, sel);

        if(el instanceof NodeList){
            return nodelistSelect(el,filter);
        }
    }

    return wrapElement(el);
}   

function nodelistSelect(nodes,sel){
    var array = [], 
        wrapper = (function(){
            if(sel && sel !== '*') {
                return function selector(el){
                    return nodelistSelect(Element.query('querySelectorAll',wrapElement(el),sel));
                }
            } 
            return wrapElement;
        })();

    for(var i = 0, l = nodes.length; i < l; i++) array[i] = wrapper(nodes[i]);

    return array;
}

function wrapElement(el){
    if(!el || el instanceof Elem || Array.isArray(el)) return el;

    function element(sel,qs){
        qs = QS[qs ? 1 : 0];

        if(sel) return wrapElement(Element.query(qs,element,sel));
        
        /* unwrap */
        return el;   
    }
    
    /* todo: store instance of Elem in cache and get it from there */
    mixin(new Elem(el),element);

    return element;
}

function Elem(el){
    this.el = el;
}

Elem.prototype.toString = function(){
    return this.el.outerHTML;
}

for(var methods in Element) 
    mixin(Element[methods],Elem.prototype);

function mixin(from,to) {
    for(var key in from) to[key] = from[key];
}

module.exports = element;