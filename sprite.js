let zIndex = 0;

class Sprite {
    constructor(elm) {
        [this.x, this.y] = [0, 0];
        this.width = this.height = "max-content";
        this.set(elm);
    }
    set(elm) {
        if (this.elm !== undefined) this.elm.remove();
        this.elm = elm;

        this.elm.style.position = "absolute";
        this.elm.style.zIndex = zIndex++;

        this.elm.style.left = this.x;
        this.elm.style.top = this.y;

        this.elm.style.width = this.width;
        this.elm.style.height = this.height;

        document.body.appendChild(this.elm);
    }
    position(x, y) {
        [this.x, this.y] = [`${x}vw`, `${y}vh`];
        this.elm.style.left = this.x;
        this.elm.style.top = this.y;
    }
    size(x, y) {
        [this.width, this.height] = [x, y];
        this.elm.style.width = `${x}vw`;
        this.elm.style.height = `${y}vh`;
    }
    hide() {
        this.elm.style.display = "none";
    }
    show() {
        this.elm.style.display = "block";
    }
    remove() {
        this.elm.remove();
    }
}

function text(text, { size = 50, font = "Arial", color = "black" } = {}) {
    const elm = document.createElement("p");
    elm.style.fontSize = `${size}vh`;
    elm.style.fontFamily = font;
    elm.style.color = color;
    elm.style.padding = "1vh";
    elm.style.margin = "0";
    elm.innerHTML = text;
    return elm;
}

function image(url) {
    const elm = document.createElement("img");
    elm.style.padding = "10px";
    elm.style.margin = "0";
    elm.src = url;
    return elm;
}
