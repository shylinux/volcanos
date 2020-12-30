Volcanos({name: "chat", iceberg: "/chat/", volcano: "/frame.js",
    libs: ["/lib/base.js", "/lib/core.js", "/lib/misc.js", "/lib/page.js", "/lib/user.js"], panes: [
        {name: "Action", help: "工作台", pos: "main"},
    ], main: {name: "Action", engine: "remote", list: ["/publish/order.js"]}, plugin: [
        "/plugin/state.js",
        "/plugin/input.js",
        "/plugin/table.js",
        "/plugin/input/key.js",
        "/plugin/input/date.js",
    ],
})
