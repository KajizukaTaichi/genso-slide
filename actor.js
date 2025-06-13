const Look = Object.freeze({ Normal: "normal", Say: "say" });
const Position = Object.freeze({ Left: "left", Right: "right" });
const Charactor = Object.freeze({ Reimu: "reimu", Marisa: "marisa" });

class Actor {
    constructor(name, position) {
        // Set fields
        [this.name, this.position] = [name, position];

        this.draw = document.createElement("img");
        this.draw.src = image_url(this.name);

        this.draw.style.position = "absolute";
        this.draw.style.height = "50vh";
        this.draw.style.zIndex = "999";
        this.draw.style.bottom = "0";
        this.draw.style[this.position] = "0";

        document.body.appendChild(this.draw);
    }

    async say(audio_url) {
        await waitPlayAudioWithMouthSync(audio_url, (isOpen) => {
            const look = isOpen ? Look.Say : Look.Normal;
            this.draw.src = image_url(this.name, look);
            void this.draw.offsetHeight;
        });
        clearInterval(this.sayInterval);
        this.draw.src = image_url(this.name, Look.say);
    }
}

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

const image_url = (name, style = Look.Normal) =>
    `https://kajizukataichi.github.io/genso-slide/resource/${name}/${style}.jpg`;
