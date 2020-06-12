Volcanos({name: "demo", volcano: "/frame.js", iceberg: "/chat/", intshell: "plug.sh",
    libs: ["/lib/base", "/lib/core", "/lib/misc", "/lib/page", "/lib/user"], panes: [
        {type: "pane", name: "Header", help: "标题栏", pos: "head", list: ["/pane/Header.js", "/pane/Header.css"], state: [
            "time", "username",
        ]},
        {type: "pane", name: "River",  help: "群聊组", pos: "left", list: ["/pane/River.js", "/pane/River.css"]},
        {type: "pane", name: "Storm",  help: "应用流", pos: "right", list: ["/pane/Storm.js", "/pane/Storm.css"]},
        {type: "pane", name: "Action", help: "工作台", pos: "middle", list: ["/pane/Action.js", "/pane/Action.css"]},
        {type: "pane", name: "Footer", help: "状态条", pos: "foot", list: ["/pane/Footer.js", "/pane/Footer.css"], state: [
            "ncmd",
        ]},
    ], main: {name: "Header", engine: "remote", list: ["/publish/order.js"]}, plugin: [
        "/plugin/state.js", "/plugin/input.js", "/plugin/table.js",
        "/plugin/input/key", "/plugin/input/date",
    ],
})
