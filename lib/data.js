
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
    DataStore.data[id].__id__ = id;
    
    return id;    
}

function getId(el){
    return el[DataStore.id] || createId(el);
}

var Data = {
    data: function(key,val){
        var data = getData(this.el);

        if(key === undefined) return data;
        if(val === null) delete data[key];
        if(val === undefined) data[key] = val;

        return data[key];
    },
    guid: function(){
        return getId(this.el);
    }
};

module.exports = Data;