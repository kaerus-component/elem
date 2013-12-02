var Css = {
    style: function(prop,val){
        if(prop === undefined) return this.el.style;

        if(typeof prop === 'string'){ 
            if(val === undefined) return this.el.style[prop];

            return this.el.style[prop] = val;
        } else if(typeof prop === 'function') prop.call(this,this.el.style);
        else if(typeof prop === 'object') for(var k in prop) this.el.style[k] = prop[k];
        
        return this;
    }
};

module.exports = Css;