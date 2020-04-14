var Config = {iceberg: "", volcano: "/static/volcanos/",
    libs: ["lib/base", "lib/core", "lib/misc", "lib/page", "lib/user"],
    main: "chat", list: [
        "pane/float/Toast", "pane/float/Carte",

        "pane/Header",
        "pane/River", "pane/Storm",
        "pane/Target", "pane/Source", "pane/Action",
        "pane/Footer",
    ], pane: [
        {group: "index", name: "Header", pos: "head", state: ["time", "user", "link"], title: "github.com/shylinux/context"},
        {group: "index", name: "River", pos: "left"},
        {group: "index", name: "Storm", pos: "right"},

        {group: "index", name: "Target", pos: "top"},
        {group: "index", name: "Source", pos: "center"},
        {group: "index", name: "Action", pos: "bottom"},
        {group: "index", name: "Footer", pos: "foot", state: ["ntxt", "ncmd"], title: '<a href="mailto:shylinux@163.com">shylinux@163.com</a>'},
    ],
    title: "volcanos", topic: "black", layout: {def: "最大", list: ["最大"], size: {
        "最大": {head: 0, foot: 0, left: 0, right: 0, bottom: -1, center: 0, top: 0},
        }, border: 4,
    },
}
