var Attribute = {

    attr: function(attr,val){
        if(val === undefined) return el.getAttribute(attr);

        if(val) el.setAttribute(attr,val);
        else el.removeAttribute(attr); 

        return this;
    }
};

module.exports = Attribute;