var ajax = require('ajax'),
    script = require('script'),
    promise = require('micropromise'),
    createElement = require('./createElement');

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

    try {
      return el[method](selector);
    } catch (e) {
      throw e;
    } finally {
      el.id = id;
    }
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
            else if(typeof el !== 'function') el = wrapElement(el);
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
                };
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
};

for(var methods in Element)
    mixin(Element[methods],Elem.prototype);

function mixin(from,to) {
    for(var key in from) to[key] = from[key];
}

// Ajax helpers returning a promise
function promisedAjax(method,url,data,options){
    var p = new promise(), e, ct;

    options = options ? options : {};

    // set content-type based on extension
    // ajax defaults to 'application/javascript'
    if(!options["content-type"]){
        if((e = url.match(/(\.\w+)$/))){
            e = e[0].toLowerCase();
            switch(e){
                case ".html":
                case ".htm":
                    ct = "text/html";
                break;
            }

            if(ct) options["content-type"] = ct;
        }
    }
    // Resolved value/error is xhr response
    return ajax[method](url,options,data,p);
}
element.get = function(url,options){
    return promisedAjax('get',url,null,options);
};
element.post = function(url,data,options){
    return promisedAjax('post',url,data,options);
};
element.put = function(url,data,options){
    return promisedAjax('put',url,data,options);
};
element.patch = function(url,data,options){
    return promisedAjax('patch',url,data,options);
};
element.head = function(url,data,options){
    return promisedAjax('head',url,data,options);
};
element.delete = function(url,options){
    return promisedAjax('delete',url,null,options);
};

// Script loader helper
element.script = script;

module.exports = element;
