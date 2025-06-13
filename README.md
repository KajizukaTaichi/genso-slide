# Genso Slide
JavaScriptでゆっくり動画が出来るスライド作成ライブラリです。

キャラクターの立ち絵と音声の再生、その音量に合わせた口パクと強調、また字幕やテロップ・画像を表示できるスプライトなどを実装しています。
ちなみにサイズ指定の数値は基本的にビューポートです。

以下のコードの様に使います。このデモは [ここ](https://kajizukataichi.github.io/genso-slide/test) で公開されています。
```javascript
const marisa = new Actor(Charactor.Marisa, Position.Left);
const reimu = new Actor(Charactor.Reimu, Position.Right);

const js_icon = new Sprite(image("image/icon.jpg"));
js_icon.position(50, 0);
js_icon.size(10, 15);

js_icon.move(50, 30, 800);
await sleep(300);

const style = { back: "lightblue" };
const content = "JSでゆっくり動画ができる！";
const subtitle = new Sprite(text(content, style));
subtitle.position(50, 50);
subtitle.size(50, 10);

await marisa.say("audio/voice_1.mp3");
await reimu.say("audio/voice_2.mp3");

const textDecoration = { size: 10, font: "monospace" };
subtitle.set(text("Genso Slide", textDecoration));
subtitle.position(50, 40);
js_icon.hide();
```

名前の由来は、「Gentoo Linux」と「幻想郷」にインスパイアされています。

## ライセンス
GPLの下に提供される自由ソフトウェアです。
立ち絵は[dairi様](https://www.pixiv.net/users/4920496)のイラストを借用しております。
