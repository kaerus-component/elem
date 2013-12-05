

var Element = {
	css: require('./css'),
	data: require('./data'),
	event: require('./event'),
	content: require('./content'),
    attribute: require('./attribute')
};

var QS = ['querySelector', 'querySelectorAll'];

function query(method,element,selector){
    if(!element) return document[method](selector);

    var el = element(), id = el.id;

    el.id = 'guid' + element.guid();

    selector = '#' + el.id + ' ' + selector;

    try { return el[method](selector) } catch (e) { throw e } finally { el.id = id }    
}

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

        el = query(qs, el, sel);

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
                    return nodelistSelect(query('querySelectorAll',wrapElement(el),sel));
                }
            } 
            return wrapElement;
        })();

    for(var i = 0, l = nodes.length; i < l; i++) array[i] = wrapper(nodes[i]);

    return array;
}

function wrapElement(el){
    if(!el || typeof el === 'function' || Array.isArray(el)) return el;

    function element(sel){
        if(sel) return wrapElement(query('querySelector',element,sel));
        
        /* unwrap */
        return el;   
    }
    
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