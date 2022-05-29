function calc() {
            var node = document.getElementById("error");
            var audio = new Audio('/Media/Windows XP Critical Stop.wav');
            audio.play();
            new WinBox({
                title: "Error",
                width: "400",
                height: "130",
                id: "error",
                mount: node.cloneNode(true),
                x: "center",
                y: "center",
                    class: [
                        "no-min",
                        "no-max",
                        "no-full",
                        "no-resize",
                        "background"
                            ]
            });
            }