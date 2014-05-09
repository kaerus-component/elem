function createElement(content){
    var el;

    if(typeof content === 'string'){
        el = document.createElement('div');
        el.innerHTML = content;
        el = el.childNodes[0];
    } else if(typeof content === 'function'){
        el = createElement(content());
    } else el = content;
    
    return el;     
}

module.exports = createElement;