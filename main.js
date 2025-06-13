let zIndex = 0;

const Look = Object.freeze({ Normal: "normal", Say: "say" });
const Position = Object.freeze({ Left: "left", Right: "right" });
const Charactor = Object.freeze({ Reimu: "reimu", Marisa: "marisa" });

const stage = document.getElementById("genso-stage");
stage.style.width = stage.getBoundingClientRect().width + "px";
stage.style.height = stage.getBoundingClientRect().height + "px";
stage.style.fontSize = stage.style.height;
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
        await waitPlayAudioWithMouthSync(audio_url, (isOpen) => {
            const look = isOpen ? Look.Say : Look.Normal;
            const zoom = isOpen ? "101%" : "100%";
            this.draw.src = image_url(this.name, look);
            this.draw.style.zoom = zoom;
        });
        clearInterval(this.sayInterval);
        this.draw.style.zoom = "100%";
        this.draw.src = image_url(this.name, Look.say);
    }
}

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

class Sprite {
    constructor(elm) {
        this.x = this.y = 0;
        [this.width, this.height] = [15, 10];
        this.set(elm);
    }
    set(elm) {
        if (this.elm !== undefined) this.elm.remove();
        this.elm = elm;

        this.elm.style.position = "absolute";
        this.elm.style.zIndex = zIndex++;

        this.locus(this.x, this.y);
        this.size(this.width, this.height);

        stage.appendChild(this.elm);
    }
    set x(value) {
        this.x = value;
        this.elm.style.left = fixLayoutX(this);
    }
    set y(value) {
        this.y = value;
        this.elm.style.top = fixLayoutY(this);
    }
    set width(value) {
        this.width = value;
        this.elm.style.width = value + "%";
        this.locus(this.x, this.y);
    }
    set height(value) {
        this.height = value;
        this.elm.style.height = value + "%";
        this.elm.style.fontSize = value * 0.5 + "%";
        this.locus(this.x, this.y);
    }
    async move({ x = 0, y = 0 }, time = 1000) {
        [this.x, this.y] = [this.x + x, this.y + y];
        const animation = this.elm.animate(
            [{ left: fixLayoutX(this), top: fixLayoutY(this) }],
            time,
        );
        await animation.finished;
        this.locus(x, y);
    }
    hide() {
        this.elm.style.display = "none";
    }
    show() {
        this.elm.style.display = "block";
    }
}

function text(text, { font = "Arial", color = "black", back = "white" } = {}) {
    const elm = document.createElement("p");
    elm.style.fontFamily = font;
    elm.style.color = color;
    elm.style.backgroundColor = back;
    elm.style.textAlign = "center";
    elm.style.display = "flex";
    elm.style.alignItems = "center";
    elm.style.justifyContent = "center";
    elm.style.padding = "1%";
    elm.style.margin = "0";
    elm.innerHTML = text;
    return elm;
}

function image(url, { size = 5 } = {}) {
    const elm = document.createElement("img");
    elm.style.height = size + "%";
    elm.style.margin = "0";
    elm.src = url;
    return elm;
}

/// === Helper functions ===

const fixLayout = (sprite, position, size) => {
    console.log(sprite);
    let value = sprite[position] - sprite[size] / 2;
    if (value < 0) value = 0;
    if (value > 100) value = sprite[size];
    return value + "%";
};
const fixLayoutX = (sprite) => fixLayout(sprite, "x", "width");
const fixLayoutY = (sprite) => fixLayout(sprite, "y", "height");

const image_url = (name, style = Look.Normal) =>
    `https://kajizukataichi.github.io/genso-slide/resource/${name}/${style}.jpg`;

async function waitPlayAudioWithMouthSync(audio_url, onMouthChange) {
    const audioCtx = new window.AudioContext();
    const response = await fetch(audio_url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;

    const analyser = audioCtx.createAnalyser();
    const gainNode = audioCtx.createGain();

    source.connect(gainNode).connect(analyser).connect(audioCtx.destination);
    analyser.fftSize = 512;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let playing = true;

    const updateMouth = () => {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        if (playing) {
            onMouthChange(volume > 30);
            requestAnimationFrame(updateMouth);
        }
    };

    updateMouth();
    source.start();

    await new Promise((resolve) => {
        source.onended = () => {
            playing = false;
            resolve();
        };
    });

    audioCtx.close();
}
