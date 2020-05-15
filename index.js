var Config = {name: "demo", volcano: "/frame.js", iceberg: "/chat/", intshell: "plug.sh",
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
    ], main: {name: "Header", engine: "remote", list: []},
    list: ["/plugin/state.js", "/plugin/input.js", "/plugin/table.js",
        "/plugin/input/key",
        "/plugin/input/date",
        "/plugin/input/upload",
        "/plugin/input/province",
    ],
}

var Preload = Config.libs; Config.panes.forEach(function(pane) {
    Preload = Preload.concat(pane.list);
}); Preload = Preload.concat(Config.list)

Volcanos(Config.name, { _target: document.body, _follow: "demo",
    _head: document.head, _body: document.body,
    _width: window.innerWidth, _height: window.innerHeight,
}, Preload.concat(Config.volcano), function(can) { // 程序入口
    can.onaction._init(can, can.Conf(Config), [], function(msg) {
        console.log(can._root, can._name, "start", can, msg);
        can.Footer.onaction._init(can.Footer, msg);
    }, can._target)
})

