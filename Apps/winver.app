function winver() {
            var node = document.getElementById("aboutwin");
            new WinBox({
                title: "About Windows",
                width: "423",
                height: "335",
                mount: node.cloneNode(true),
                id: "winver",
                    class: [
                        "no-min",
                        "no-max",
                        "no-full",
                        "no-resize",
                        "background"
                            ]
            });
            }