function ctrl() {
            var node = document.getElementById("settings");
            new WinBox({
                title: "Control Panel",
                width: "404",
                height: "455",
                url: "Apps/img/icedog96.html",
                id: "ctrl",
                mount: node.cloneNode(true),
                    class: [
                        "background",
                        "no-min",
                        "no-max",
                        "no-full",
                        "no-resize",
                            ]
            });
            }