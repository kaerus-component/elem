
module.exports = (function(){
    var Event = require('event');

    var ElemEvent = { 
        delegate: function(ev,fn,cap){

            Event.delegate(this.el,ev,fn);        

            return this;
        }, 
        undelegate: function(ev,fn){

            Event.undelegate(this.el,ev,fn);

            return this; 
        }, 
        on: function(ev,fn,cap){

            Event.bind(this.el,ev,fn,cap);

            return this;
        },
        off: function(ev,fn){

            Event.unbind(this.el,ev,fn);

            return this;
        }
    };

    return ElemEvent;
})();
