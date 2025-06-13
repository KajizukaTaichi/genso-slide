# Genso Slide
JavaScriptでゆっくり動画が出来るスライド作成ライブラリです。

キャラクターの声の再生と音量に合わせた口パク、字幕やテロップ・画像を出せるスプライトなどを実装しています。
ちなみにサイズ指定の数値は基本的にビューポートです。

以下のコードの様に使います。このデモは [ここ](https://kajizukataichi.github.io/genso-slide/test) で公開されています。
```javascript
const marisa = new Actor(Charactor.Marisa, Position.Left);
const reimu = new Actor(Charactor.Reimu, Position.Right);

const sub = new Sprite(text("JSでゆっくり動画ができる！", { back: "lightblue" }));
sub.position(50, 50);
sub.size(50, 10);

const icon = new Sprite(image("image/icon.jpg"));
icon.position(30, 30);
icon.size(10, 15);

await icon.move(50, 30, 800);
await marisa.say("audio/voice_1.mp3");
sub.position(50, 40);
icon.hide();

sub.set(text("Genso Slide", { size: 10, font: "monospace" }));
await sleep(300);
await reimu.say("audio/voice_2.mp3");
```

名前の由来は、「Gentoo Linux」と「幻想郷」にインスパイアされています。

## ライセンス
GPLの下に提供される自由ソフトウェアです。
立ち絵は[dairi様](https://www.pixiv.net/users/4920496)のイラストを借用しております。
