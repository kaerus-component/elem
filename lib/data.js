
var DataStore = {
	id: 'data' + (new Date().getTime()),
	data: {}, 
	counter: 1 
}

function getData(el,getId){
    var id = el[DataStore.id] || createId(el);

    return DataStore.data[id];
}

function createId(el){
    var id = el[DataStore.id] = DataStore.counter++;
    DataStore.data[id] = Object.create(null);
    
    return id;    
}

function getId(el){
    return el[DataStore.id] || createId(el);
}

var Data = {
    data: function(key,val,proto){
        var data = getData(this.el);

        if(key === undefined) return data;
        else if(val === undefined) return data[key];
        
        if(val === null) delete data[key];
        else data[key] = clone(val,proto);

        return this;
    },
    guid: function(){
        return getId(this.el);
    }
};

function clone(from,to){
    if(typeof from !== 'object') return from;

    to = to ? to : Object.create(null);

    for(var key in from) to[key] = from[key];

    return to;
}

module.exports = Data;