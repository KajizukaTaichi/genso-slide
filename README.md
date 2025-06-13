# Genso Slide
JSでゆっくり動画で出来るスライド作成ライブラリです。<br>
キャラクターの声の再生と口パク、字幕や画像を出せるスプライトなどを実装しています。

以下のコードの様に使います。このデモは [ここ](https://kajizukataichi.github.io/genso-slide/test) で公開されています。
```javascript
const marisa = new Actor(Charactor.Marisa, Position.Left);
const reimu = new Actor(Charactor.Reimu, Position.Right);
const sub = new Sprite(text("JSでゆっくり動画ができる！"));
sub.position(30, 50);

await marisa.say("a.mp3");
sub.set(text("Genso Slide", { size: 100, font: "monospace" }));
await sleep(300);

await reimu.say("b.mp3");
sub.hide();
```

名前の由来は、「Gentoo Linux」と「幻想郷」にインスパイアされています。

## ライセンス
GPLの元に提供される自由ソフトウェアです。
立ち絵は[dairi様](https://www.pixiv.net/users/4920496)のイラストを借用しております。
