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
            
