var event = require('event');

var ElemEvent = { 
    delegate: function(ev,fn,cap){

        event.delegate(this.el,ev,fn);        

        return this;
    }, 
    undelegate: function(ev,fn){

        event.undelegate(this.el,ev,fn);

        return this; 
    }, 
    on: function(ev,fn,cap){

        event.bind(this.el,ev,fn,cap);

        return this;
    },
    off: function(ev,fn){

        event.unbind(this.el,ev,fn);

        return this;
    }
};

module.exports = ElemEvent;