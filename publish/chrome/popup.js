Volcanos({name: "demo", volcano: "/frame.js", iceberg: "http://localhost:9020/chat/", intshell: "plug.sh",
    libs: ["/lib/base", "/lib/core", "/lib/misc", "/lib/page", "/lib/user"], panes: [
        {name: "Header", help: "标题栏", pos: "head", state: ["time", "username"]},
        {name: "River",  help: "群聊组", pos: "left"},
        {name: "Action", help: "工作台", pos: "main"},
        {name: "Search", help: "搜索框", pos: "float"},
        {name: "Footer", help: "状态条", pos: "foot", state: ["ncmd" ]},
    ], main: {name: "Header", engine: "remote", list: ["/publish/order.js"]}, plugin: [
        "/plugin/state.js", "/plugin/input.js", "/plugin/table.js",
    ],
})

