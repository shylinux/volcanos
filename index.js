_can_name = ""
Volcanos({name: "chat", iceberg: "/chat/", volcano: "/frame.js",
    libs: ["/lib/base.js", "/lib/core.js", "/lib/misc.js", "/lib/page.js", "/lib/user.js"], panes: [
        {name: "Header", help: "标题栏", pos: "head", state: ["time", "username"]},
        {name: "Search", help: "搜索框", pos: "float"},
        {name: "River",  help: "群聊组", pos: "left"},
        {name: "Action", help: "工作台", pos: "middle"},
        {name: "Footer", help: "状态条", pos: "foot", state: ["ncmd", "keys"]},
    ], main: {name: "Header", engine: "remote", list: ["/publish/order.js"]}, plugin: [
        "/plugin/state.js",
        "/plugin/input.js",
        "/plugin/table.js",
        "/plugin/input/key.js",
        "/plugin/input/date.js",
        "/plugin/local/team/plan.js",
        "/plugin/local/wiki/draw.js",
        "/plugin/local/wiki/word.js",
        "/plugin/local/code/vimer.js",
        "/plugin/local/code/inner.js",
        "/plugin/story/trend.js",
        "/plugin/story/spide.js",
    ],
})
