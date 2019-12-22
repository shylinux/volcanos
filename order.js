var Config = {context: "/chat/",
    main: "chat", list: ["page/chat",
        "pane/Toast", "pane/Tutor", "pane/Debug",
        "pane/Carte", "pane/Favor", "pane/Login",

        "pane/Header",
        "pane/Ocean", "pane/River", "pane/Storm", "pane/Steam",
        "pane/Target", "pane/Source", "pane/Action",
        "pane/Footer",

        "plugin/state", "plugin/input", "plugin/table", "plugin/inner", "plugin/media",
    ],
    libs: ["lib/base", "lib/core", "lib/misc", "lib/page", "lib/user"],
    pane: [
        {group: "index", name: "Toast", pos: "dialog", duration: 3000},
        {group: "index", name: "Tutor", pos: "dialog"},
        {group: "index", name: "Debug", pos: "dialog"},
        {group: "index", name: "Carte", pos: "dialog"},
        {group: "index", name: "Favor", pos: "dialog"},
        {group: "index", name: "Login", pos: "dialog"},

        {group: "index", name: "Header", pos: "head", state: ["time", "user", "link"], title: "github.com/shylinux/context"},
        {group: "index", name: "Ocean", pos: "dialog", def_name: "meet"},
        {group: "index", name: "River", pos: "left"},
        {group: "index", name: "Storm", pos: "right"},
        {group: "index", name: "Steam", pos: "dialog", def_name: "miss"},

        {group: "index", name: "Target", pos: "top"},
        {group: "index", name: "Source", pos: "center"},
        {group: "index", name: "Action", pos: "bottom"},
        {group: "index", name: "Footer", pos: "foot", state: ["ntxt", "ncmd"], title: '<a href="mailto:shylinux@163.com">shylinux@163.com</a>'},

    ], layout: {list: ["工作", "办公", "聊天"], size: {
        "工作": {head: 30, foot: 30, left: 0, right: 100, bottom: -1, center: 0, top: 0},
        "办公": {head: 30, foot: 30, left: 100, right: 100, bottom: -1, center: 0, top: 0},
        "聊天": {head: 30, foot: 30, left: 100, right: 100, bottom: 300, center: 40, top: -2},
        "全屏": {head: 0, foot: 0, left: 0, right: 0, bottom: -1, center: 0, top: 0},
        }, border: 4,
    },
}
