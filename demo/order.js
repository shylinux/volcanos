var Config = { volcano: "frame.js", iceberg: "/chat/", intshell: "plug.sh",
    libs: ["lib/base", "lib/core", "lib/misc", "lib/page", "lib/user"], panes: [
        {type: "pane", pos: "head", name: "Header", help: "标题栏", list: ["pane/Header.js", "pane/Header.css"], state: ["time"]},
        {type: "pane", pos: "left", name: "River", help: "群聊", list: ["frame.js", "pane/River.js", "pane/River.css"]},
        {type: "pane", pos: "right", name: "Storm", help: "应用", list: ["frame.js", "pane/Storm.js", "pane/Storm.css"]},
        {type: "pane", pos: "middle", name: "Action", help: "工作台", list: ["frame.js", "pane/Action.js", "pane/Action.css"]},
        {type: "pane", pos: "foot", name: "Footer", help: "状态栏", list: ["pane/Footer.js", "pane/Footer.css"]},
    ],
}
var Preload = []; Config.panes.forEach(function(pane) {
    Preload = Preload.concat(pane.list);
})

Preload = Preload.concat(["plugin/input.js"])
