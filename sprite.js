let zIndex = 0;

class Sprite {
    constructor(elm) {
        this.x = this.y = 0;
        [this.width, this.height] = [150, 100];
        console.log(elm.offsetHeight);
        this.set(elm);
    }
    set(elm) {
        if (this.elm !== undefined) this.elm.remove();
        this.elm = elm;

        this.elm.style.position = "absolute";
        this.elm.style.zIndex = zIndex++;

        this.elm.style.left = `${fixLayoutX(this)}vw`;
        this.elm.style.top = `${fixLayoutY(this)}vh`;

        this.elm.style.width = `${this.width}vw`;
        this.elm.style.height = `${this.height}vh`;

        document.body.appendChild(this.elm);
    }
    position(x, y) {
        [this.x, this.y] = [x, y];
        console.log(this.x, this.width, fixLayoutX(this));
        this.elm.style.left = `${fixLayoutX(this)}vw`;
        this.elm.style.top = `${fixLayoutY(this)}vh`;
    }
    async move(x, y, time = 1000) {
        const animation = this.elm.animate(
            [{ left: `${fixLayoutX(this)}vw`, top: `${fixLayoutY(this)}vh` }],
            time,
        );
        await animation.finished;
        this.position(x, y);
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
}

function text(
    text,
    { size = 5, font = "Arial", color = "black", back = "white" } = {},
) {
    const elm = document.createElement("p");
    elm.style.fontSize = `${size}vh`;
    elm.style.fontFamily = font;
    elm.style.color = color;
    elm.style.backgroundColor = back;
    elm.style.padding = "1vh";
    elm.style.margin = "0";
    elm.innerHTML = text;
    return elm;
}

function image(url, { size = 5 } = {}) {
    const elm = document.createElement("img");
    elm.style.height = `${size}vh`;
    elm.style.padding = "1vh";
    elm.style.margin = "0";
    elm.src = url;
    return elm;
}

const fixLayoutX = (sprite) => sprite.x + sprite.width / 2;
const fixLayoutY = (sprite) => sprite.y + sprite.height / 2;
