Volcanos({name: "chat", volcano: "/frame.js", iceberg: "/chat/", intshell: "plug.sh",
    libs: ["/lib/base", "/lib/core", "/lib/misc", "/lib/page", "/lib/user"], panes: [
        {name: "Header", help: "标题栏", pos: "head", state: ["time", "username"]},
        {name: "River",  help: "群聊组", pos: "left"},
        {name: "Action", help: "工作台", pos: "middle"},
        {name: "Search", help: "搜索框", pos: "float"},
        {name: "Footer", help: "状态条", pos: "foot", state: ["ncmd" ]},
    ], main: {name: "Header", engine: "remote", list: ["/publish/order.js"]}, plugin: [
        "/plugin/state.js",
        "/plugin/table.js",
        "/plugin/input.js",
        "/plugin/input/key",
        "/plugin/input/date",
        "/plugin/local/team/plan.js",
        "/plugin/local/wiki/draw.js",
        "/plugin/local/wiki/word.js",
        "/plugin/local/code/inner.js",
    ],
})
