var event = require('event');

var ElemEvent = { 
    add: function(ev,fn,cap){
        
        event.bind(this.el,ev,fn,cap);

        return this;
    }, 
    remove: function(ev,fn){

        event.unbind(this.el,ev,fn);

        return this; 
    }, 
    on: function(ev,fn){
        
        event.delegate(this.el,ev,fn);

        return this;
    },
    off: function(ev,fn){
        
        event.undelegate(this.el,ev,fn);

        return this;
    }
};

module.exports = ElemEvent;