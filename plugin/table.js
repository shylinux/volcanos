Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        if (msg.Option("_progress")) {
            // 异步进度
            can.page.Select(can, can._output, "td", function(td) {
                if (td.innerText == msg.Option("name")) {
                    can.page.Modify(can, td, {style: {
                        "background-color": "green",
                    }})
                }
            })
            return
        }

        // 自动刷新
        var refresh = msg.Option("_refresh") || can.Conf("feature")["_refresh"] 
        refresh && can.Timer(refresh, function() { can.run({}) })

        // 展示数据
        can.ui = can.page.Appends(can, can._target, [
            {view: ["content", "div"]}, {view: ["display", "pre"]},
        ])
        can.onappend.table(can, can.ui.content, "table", msg)
        can.onappend.board(can, can.ui.display, "board", msg)
        return typeof cb == "function" && cb(msg)
    },
})
Volcanos("onaction", {help: "控件交互", list: [],
    onclick: function(event, can) {
        can.run(event, [], function() {})
    },
})
