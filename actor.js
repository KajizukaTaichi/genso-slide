const Look = Object.freeze({ Normal: "normal", Say: "say" });
const Position = Object.freeze({ Left: "left", Right: "right" });
const Charactor = Object.freeze({ Reimu: "reimu", Marisa: "marisa" });

class Actor {
    constructor(name, position) {
        // Set fields
        [this.name, this.position] = [name, position];

        // Element of the standing draw (立ち絵)
        this.draw = document.createElement("img");
        this.draw.src = image_url(this.name);

        // Setting CSS
        this.draw.style.position = "absolute";
        this.draw.style.height = "50vh";
        this.draw.style.zIndex = "999";
        this.draw.style.bottom = "0";
        this.draw.style[this.position] = "0";

        // Show to HTML
        document.body.appendChild(this.draw);
    }

    async say(audio_url) {
        this.sayInterval = setInterval(() => {
            const look = Object.values(Look)[Math.floor(Math.random() * 2)];
            this.draw.src = image_url(this.name, look);
        }, 100);
        await waitPlayAudio(audio_url);
        clearInterval(this.sayInterval);
        this.draw.src = image_url(this.name, Look.say);
    }
}

function waitPlayAudio(src) {
    return new Promise((resolve, reject) => {
        const audio = new Audio(src);
        audio.addEventListener("ended", () => resolve());
        audio.addEventListener("error", (e) => reject(e));
        audio.play().catch(reject);
    });
}

const image_url = (name, style = Look.Normal) =>
    `https://kajizukataichi.github.io/genso-slide/resource/${name}/${style}.jpg`;
