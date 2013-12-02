
function Query(method,element,selector){
    if(!element) return document[method](selector);

    var el = element(), id = el.id;

    el.id = 'guid' + element.guid;

    selector = '#' + el.id + ' ' + selector;

    try { return el[method](selector) } catch (e) { throw e } finally { el.id = id }    
}

module.exports = Query;