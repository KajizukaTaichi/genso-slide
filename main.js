let zIndex = 0;

const Look = Object.freeze({ Normal: "normal", Say: "say" });
const Position = Object.freeze({ Left: "left", Right: "right" });
const Charactor = Object.freeze({ Reimu: "reimu", Marisa: "marisa" });

const stage = document.getElementById("genso-stage");
stage.style.width = stage.getBoundingClientRect().width + "px";
stage.style.height = stage.getBoundingClientRect().height + "px";
stage.style.fontSize = stage.getBoundingClientRect().height + "px";
stage.style.position = "relative";

class Actor {
    constructor(name, position) {
        [this.name, this.position] = [name, position];

        this.draw = document.createElement("img");
        this.draw.src = image_url(this.name);

        this.draw.style.minHeightheight = "50%";
        this.draw.style.position = "absolute";
        this.draw.style.height = "50%";
        this.draw.style.zIndex = "999";
        this.draw.style.bottom = "0";
        this.draw.style[this.position] = "0";

        stage.appendChild(this.draw);
    }

    async say(audio_url) {
        this.sayInterval = setInterval(() => {
            const isOpen = Math.floor(Math.random() * 2) != 0;
            const look = isOpen ? Look.Say : Look.Normal;
            const height = !isOpen ? "51vh" : "50vh";
            this.draw.src = image_url(this.name, look);
            this.draw.style.height = height;
        }, 100);
        await playAudio(audio_url);
        clearInterval(this.sayInterval);
        this.draw.src = image_url(this.name, Look.Normal);
    }
}

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

class Sprite {
    constructor(draw) {
        this.set(draw);
        this.x = this.y = 0;
        [this.width, this.height] = [15, 10];
    }

    set(draw) {
        if (this.draw !== undefined) this.draw.remove();
        this.draw = draw;

        this.draw.style.position = "absolute";
        this.draw.style.zIndex = zIndex++;

        stage.appendChild(this.draw);
    }

    set x(value) {
        this._x = value;
        this.draw.style.left = fixLayoutX(this);
    }

    set y(value) {
        this._y = value;
        this.draw.style.top = fixLayoutY(this);
    }

    set width(value) {
        this._width = value;
        this.draw.style.width = value + "%";
    }

    set height(value) {
        this._height = value;
        this.draw.style.height = value + "%";
        this.draw.style.fontSize = value * 0.5 + "%";
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    async move({ x = 0, y = 0 }, time = 1000) {
        [this._x, this._y] = [this.x + x, this.y + y];
        const animation = this.draw.animate(
            [{ left: fixLayoutX(this), top: fixLayoutY(this) }],
            time,
        );
        await animation.finished;
        [this.x, this.y] = [this._x, this._y];
    }

    hide() {
        this.draw.style.display = "none";
    }

    show() {
        this.draw.style.display = "block";
    }
}

function text(text, { font = "Arial", color = "black", back = "white" } = {}) {
    const draw = document.createElement("p");
    draw.style.fontFamily = font;
    draw.style.color = color;
    draw.style.backgroundColor = back;
    draw.style.textAlign = "center";
    draw.style.display = "flex";
    draw.style.alignItems = "center";
    draw.style.justifyContent = "center";
    draw.style.padding = "1%";
    draw.style.margin = "0";
    draw.innerHTML = text;
    return draw;
}

function image(url, { size = 5 } = {}) {
    const draw = document.createElement("img");
    draw.style.height = size + "%";
    draw.style.margin = "0";
    draw.src = url;
    return draw;
}

/// === Helper functions ===

const fixLayout = (sprite, position, size) => {
    let value = sprite[position] - sprite[size] / 2;
    if (value < 0) value = 0;
    if (value > 100) value = sprite[size];
    return value + "%";
};
const fixLayoutX = (sprite) => fixLayout(sprite, "x", "width");
const fixLayoutY = (sprite) => fixLayout(sprite, "y", "height");

const image_url = (name, style = Look.Normal) =>
    `https://kajizukataichi.github.io/genso-slide/resource/${name}/${style}.jpg`;

const playAudio = (src) =>
    new Promise((resolve, reject) => {
        const audio = new Audio(src);
        audio.addEventListener("ended", () => resolve());
        audio.addEventListener("error", (e) => reject(e));
        audio.play().catch(reject);
    });
