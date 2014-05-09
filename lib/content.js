var createElement = require('./createElement');

var Content = {
    append: function(content){
        var self = this;

        if(Array.isArray(content)){
            content.forEach(function(c){
                self.append(c);
            });

            return this;
        }

        var e = createElement(content);

        this.el.appendChild(e);

        return this;
    },

    prepend: function(content){
        var self = this;
        if(Array.isArray(content)){
            content.forEach(function(c){
                self.prepend(c);
            });

            return this;
        }

        var e = createElement(content);

        this.el.insertBefore(e,this.el.firstChild);

        return this;
    },

    text: function(content){
        if(content !== undefined)
            this.el.innerText = content;
        else return this.el.innerText;

        return this;        
    },

    html: function(content){
        if(content !== undefined)
            this.el.innerHTML = content;
        else return this.el.innerHTML;

        return this;
    },

    wrap: function(content){
        var e = createElement(content);

        e.appendChild(this.el);

        this.el.outerHTML = e.outerHTML;

        return this;
    }
};



module.exports = Content;