Volcanos({name: "demo", volcano: "/frame.js", iceberg: "/chat/", intshell: "plug.sh",
    libs: ["/lib/base", "/lib/core", "/lib/misc", "/lib/page", "/lib/user"], panes: [
        {type: "pane", name: "Action", help: "工作台", pos: "middle", list: ["/pane/Action.js", "/pane/Action.css"]},
    ], main: {name: "Action", engine: "remote", list: ["/publish/order.js"]}, plugin: [
        "/plugin/state.js",
        "/plugin/input.js",
        "/plugin/table.js",
        "/plugin/input/key",
        "/plugin/input/date",
        "/plugin/input/upload",
        "/plugin/input/province",
    ],
})
