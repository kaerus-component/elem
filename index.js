
if(!document.querySelector || !document.querySelectorAll) 
    throw new Error("Element querySelectors are not present");    

var Query = {
    one: function(root,selector){
        var ret, elem, id;

        if(root) {
            elem = root();
            id = elem.id;
            elem.id = 'guid' + root.guid;

            try {
                selector = '#' + elem.id + ' ' + selector;
                ret = document.querySelector(selector);
            } catch (e) {
                throw e;
            } finally {
                elem.id = id;
            }
        } else ret = document.querySelector(selector);

        if(!ret) return;

        return wrapElement(ret);
    },
    all: function(root,selector){
        var elems, elem, id;

        if(root){
            elem = root();
            id = elem.id;
            elem.id = 'guid' + root.guid;
            
            try {
                selector = '#' + elem.id + ' ' + selector;
                elems = document.querySelectorAll(selector);
            } catch (e) {
                throw e;
            } finally {
                elem.id = id;
            }  
        } else elems = document.querySelectorAll(selector);

        if(!elems.length) return;

        var ret = [];
    
        for(var i = 0, l = elems.length; i < l; i++ )
            ret[ret.length] = wrapElement(elems.item(i));

        return ret;
    }
};

var Data = {
    store: {},
    guid: 'data' + (new Date().getTime()),
    guidCounter: 1
}; 

function prepare(args){
    var elem, selector, i = 0, args = Array.prototype.slice.call(args);

    if(typeof args[0] === 'string' && args[1] === undefined) selector = args[i++];
    else {
        if(typeof args[i] === 'string') elem = args[i++];
        if(typeof args[i] === 'function') elem = wrapElement(args[i++]);
        if(typeof args[i] === 'object') elem = wrapElement(args[i++]);  
        if(typeof args[i] === 'string') selector = args[i++];
    }

    if(elem && !selector) return elem;

    if(!selector) throw TypeError("selector <string> missing");

    return [elem,selector];
}

function Elem(){
    var args = prepare(arguments);

    return Query.one.apply(null,args);
}

Elem.all = function(){
    var args = prepare(arguments);
    
    return Query.all.apply(null,args);
}          

function wrapElement(elem){
    if(typeof elem === 'function' && elem.name === 'element')
        return elem;

    var data = getData(elem);

    var wrapped = element.bind(elem);

    function element(selector){
        if(selector) 
            return Query.one(wrapped,selector);
        
        /* unwrapped */
        return elem;
    }

    /* todo: refactor */
    wrapped.guid = elem[Data.guid];

    wrapped.toString = function(format){
        return elem.innerHTML;
    }

    wrapped.html = function(content){
        if(content !== undefined)
            elem.innerHTML = content;

        return this;
    }

    wrapped.data = function(key,val){
        var data = getData(elem);

        if(val !== undefined) data[key] = val;

        return data[key];
    }

    return wrapped;
}

function extend(elem,obj) {
    for(var o in obj)
        if(!elem[o]) elem[o] = obj[o];
}

function getData(elem){
    var guid = elem[Data.guid];

    if(!guid){
        guid = elem[Data.guid] = Data.guidCounter++;
        Data.store[guid] = {};
    }

    return Data.store[guid];
}

function removedata(elem){
    var guid = elem[Data.guid];

    if(!guid) return;

    delete Data.store[guid];

    try {
        delete elem[Data.guid];
    } catch (e) {
        if(elem.removeAttribute){
            el.removeAttribute(Data.guid);
        }
    }
}   

module.exports = Elem;