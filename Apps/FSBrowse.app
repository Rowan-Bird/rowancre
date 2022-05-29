            function fserror() {
            var node = document.getElementById("derror");
            var audio = new Audio('Media/Windows XP Error.wav');
            audio.play();
            MonsterBrowser();
            new WinBox({
                title: "Error",
                width: "400",
                height: "130",
                id: "error",
                mount: node.cloneNode(true),
                x: "center",
                y: "center",
                modal: true,
                    class: [
                        "no-min",
                        "no-max",
                        "no-full",
                        "no-resize",
                        "background"
                            ]
            });
            }

function MonsterBrowser() {
            var node = document.getElementById("fileexplorer");
            new WinBox({
                title: "File System",
                width: "800",
                height: "550",
                mount: node.cloneNode(true),
                id: "FSexplr",
                    class: [
                        "background"
                            ]
            });
            }
            
