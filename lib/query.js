
function Query(meth,el,sel){
    if(!el) return document[meth](sel);

    var e = el(), id = e.id;

    e.id = 'guid' + el.guid;

    sel = '#' + e.id + ' ' + sel;

    try { return e[meth](sel) } catch (err) { throw err } finally { e.id = id }    
}

module.exports = Query;