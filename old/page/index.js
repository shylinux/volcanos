var Config = {iceberg: "/chat/", volcano: "",
    libs: ["lib/base", "lib/core", "lib/misc", "lib/page", "lib/user"],
    main: "chat", list: [
        "page/chat",
        "pane/float/Toast", "pane/float/Carte",
        "pane/float/Tutor", "pane/float/Debug",
        "pane/float/Login", "pane/float/Favor",

        "pane/Header",
        "pane/River", "pane/Storm",
        "pane/Target", "pane/Source", "pane/Action",
        "pane/Ocean", "pane/Steam",
        "pane/Footer",

        "plugin/state", "plugin/table", "plugin/input",
        "plugin/input/date", "plugin/input/key",
    ], pane: [
        {group: "index", name: "Toast", path: "float/", pos: "dialog", duration: 3000},
        {group: "index", name: "Carte", path: "float/", pos: "dialog"},
        {group: "index", name: "Tutor", path: "float/", pos: "dialog"},
        {group: "index", name: "Debug", path: "float/", pos: "dialog"},
        {group: "index", name: "Login", path: "float/", pos: "dialog"},
        {group: "index", name: "Favor", path: "float/", pos: "dialog"},

        {group: "index", name: "Header", pos: "head", state: ["time", "user", "link"]},
        {group: "index", name: "River", pos: "left"},
        {group: "index", name: "Storm", pos: "right"},

        {group: "index", name: "Target", pos: "top"},
        {group: "index", name: "Source", pos: "center"},
        {group: "index", name: "Action", pos: "bottom"},

        {group: "index", name: "Ocean", pos: "dialog", def_name: "meet"},
        {group: "index", name: "Steam", pos: "dialog", def_name: "miss"},
        {group: "index", name: "Footer", pos: "foot", state: ["ntxt", "ncmd"]},

    ], title: "volcanos", topic: "black", layout: {def: "工作", list: ["工作", "办公", "聊天"], size: {
        "最大": {head: 0, foot: 0, left: 0, right: 0, bottom: -1, center: 0, top: 0},
        "工作": {head: 30, foot: 30, left: 0, right: 100, bottom: -1, center: 0, top: 0},
        "办公": {head: 30, foot: 30, left: 100, right: 100, bottom: -1, center: 0, top: 0},
        "聊天": {head: 30, foot: 30, left: 100, right: 100, bottom: 300, center: 40, top: -2},
        "最长": {head: 30, foot: 30, left: 0, right: 0, bottom: -2, center: 0, top: 0},
        "全屏": {head: 0, foot: 0, left: 0, right: 0, bottom: -1, center: 0, top: 0},
        }, border: 4,
    }, scroll: {line: 100},
}
