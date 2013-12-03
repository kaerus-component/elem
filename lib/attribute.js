var Attribute = {

    attr: function(attr,val){
        if(val === undefined) return el.getAttribute(attr);
        if(val === null) el.removeAttribute(attr);
        else el.setAttribute(attr,val); 

        return this;
    },
    hasClass: function(cl){
        var classes = this.el.className.split(' ');
        return 0 <= classes.indexOf(cl);
    },
    addClass: function(cl){
        var classes;

        if(!this.el.className) this.el.className = cl;
        else if(!this.hasClass(cl)) this.el.className+= ' ' + cl;

        return this;
    },
    removeClass: function(cl){
        var classes = this.el.className.split(' '), i;
        if(0 <= (i = classes.indexOf(cl))){
            classes.splice(i,1);
            this.el.className = classes.join(' ');
        }

        return this;
    },
    toggleClass: function(cl){
        if(this.hasClass(cl)) this.removeClass(cl);
        else this.addClass(cl);
           
        return this;
    }
};

module.exports = Attribute;