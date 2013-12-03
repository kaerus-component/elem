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
        var classes = this.el.className.split(' ');
        if(classes.indexOf(cl) < 0)
            this.el.className = classes.concat(cl).join(' ');
    },
    removeClass: function(cl){
        var classes = this.el.className.split(' '), i;
        if(0 <= (i = classes.indexOf(cl)))
            this.el.className = classes.splice(i,1).join(' ');
    },
    toggleClass: function(cl){
        var classes = this.el.className.split(' ');
        if(classes.indexOf(cl) < 0)
            this.el.className = classes.concat(cl).join(' ');
        else this.el.className = classes.splice(i,1).join(' ');
    }
};

module.exports = Attribute;