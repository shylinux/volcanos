Volcanos({name: "demo", iceberg: "http://localhost:9020/chat/", volcano: "/frame.js",
    libs: ["/lib/base.js", "/lib/core.js", "/lib/misc.js", "/lib/page.js", "/lib/user.js"], panels: [
        {name: "Header", help: "标题栏", pos: "head", state: ["time", "username"]},
        {name: "Search", help: "搜索框", pos: "auto"},
        {name: "River",  help: "群聊组", pos: "left", action: ["创建", "刷新"]},
        {name: "Action", help: "工作台", pos: "main"},
        {name: "Footer", help: "状态条", pos: "foot", state: ["ncmd"]},
    ], main: {name: "Header", engine: "remote", list: ["/publish/order.js"]}, plugin: [
        "/plugin/state.js", "/plugin/input.js", "/plugin/table.js",
    ],
})

