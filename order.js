var Config = {
    main: "chat", list: ["page/chat",
        "pane/Toast", "pane/Carte", "pane/Debug",
        "pane/Tutor", "pane/Favor", "pane/Login",

        "pane/Header",
        "pane/Ocean", "pane/River", "pane/Storm", "pane/Steam",
        "pane/Target", "pane/Source", "pane/Action",
        "pane/Footer",

        "plugin/state", "plugin/input", "plugin/table", "plugin/inner", "plugin/media",
    ],
    libs: ["lib/base", "lib/core", "lib/misc", "lib/page", "lib/user"],
    pane: [
        {group: "index", name: "Toast", pos: "float"},
        {group: "index", name: "Carte", pos: "float"},
        {group: "index", name: "Debug", pos: "float"},
        {group: "index", name: "Login", pos: "float"},
        {group: "index", name: "Favor", pos: "float"},
        {group: "index", name: "Tutor", pos: "float"},

        {group: "index", name: "Header", pos: "head",
            title: "github.com/shylinux/context",
            state: ["time", "user", "link"],
        },
        {group: "index", name: "Ocean", pos: "float", def_name: "meet"},
        {group: "index", name: "River", pos: "left"},
        {group: "index", name: "Storm", pos: "right"},
        {group: "index", name: "Steam", pos: "float", def_name: "miss"},

        {group: "index", name: "Target", pos: "top"},
        {group: "index", name: "Source", pos: "center"},
        {group: "index", name: "Action", pos: "bottom"},
        {group: "index", name: "Footer", pos: "foot",
            title: '<a href="mailto:shylinux@163.com">shylinux@163.com</a>',
            state: ["ntxt", "ncmd"],
        },

    ], layout: {list: ["工作", "办公", "聊天"], size: {
        "工作": {head: 30, foot: 30, left: 0, right: 100, bottom: -1, center: 0, top: 0},
        "办公": {head: 30, foot: 30, left: 100, right: 100, bottom: -1, center: 0, top: 0},
        "聊天": {head: 30, foot: 30, left: 100, right: 100, bottom: 300, center: 40, top: -2},
        "全屏": {head: 0, foot: 0, left: 0, right: 0, bottom: -1, center: 0, top: 0},
        }, border: 4,
    },
}
