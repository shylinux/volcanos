var Config = {
    main: "chat", list: [
        "page/chat",
        "pane/Toast", "pane/Carte", "pane/Debug",
        "pane/River", "pane/Storm", "pane/Action",
        "pane/Ocean", "pane/Steam",
        "plugin/state", "plugin/input", "plugin/table", "plugin/inner",
    ],
    libs: ["lib/base", "lib/core", "lib/misc", "lib/page", "lib/user"],
    pane: [
        {group: "index", name: "Toast"},
        {group: "index", name: "Carte"},
        {group: "index", name: "Debug"},

        {group: "index", name: "River"},
        {group: "index", name: "Storm"},
        {group: "index", name: "Action"},

        {group: "index", name: "Steam"},
        {group: "index", name: "Ocean"},
    ],
}
