function crashfdfdf() {
var node = document.getElementById("error2");
var audio = new Audio('Media/chord.wav');
audio.play();
new WinBox({
    title: "IE Error",
    x: "center",
    mount: node.cloneNode(true),
    y: "center",
    width: "384",
    height: "128",
        class: [
        "98",
        "no-close",
        "no-resize",
        "no-move",
        "no-max",
        "no-min"
    ]
});
};

  