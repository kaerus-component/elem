
var DataStore = {
	id: 'data' + (new Date().getTime()),
	data: {}, 
	counter: 1 
}

function Data(el){
    var id = el[DataStore.id];

    if(!id){
        id = el[DataStore.id] = DataStore.counter++;
        DataStore.data[id] = Object.create(null);
        DataStore.data[id].__id__ = id;
    }

    return DataStore.data[id];
}

module.exports = Data;