var Config = {
    main: "chat", list: ["page/chat",
        "pane/Toast", "pane/Carte", "pane/Debug", "pane/Login",

        "pane/Header",
        "pane/Ocean", "pane/River", "pane/Storm", "pane/Steam",
        "pane/Target", "pane/Source", "pane/Action",
        "pane/Footer",

        "plugin/state", "plugin/input", "plugin/table", "plugin/inner",
    ],
    libs: ["lib/base", "lib/core", "lib/misc", "lib/page", "lib/user"],
    pane: [
        {group: "index", name: "Toast", pos: "float"},
        {group: "index", name: "Carte", pos: "float"},
        {group: "index", name: "Debug", pos: "float"},
        {group: "index", name: "Login", pos: "float"},

        {group: "index", name: "Header", pos: "head"},
        {group: "index", name: "Ocean", pos: "float"},
        {group: "index", name: "River", pos: "left"},
        {group: "index", name: "Storm", pos: "right"},
        {group: "index", name: "Steam", pos: "float"},

        {group: "index", name: "Target", pos: "top"},
        {group: "index", name: "Source", pos: "center"},
        {group: "index", name: "Action", pos: "bottom"},
        {group: "index", name: "Footer", pos: "foot"},
    ],
    layout: {
        border: 4,
    },
}
