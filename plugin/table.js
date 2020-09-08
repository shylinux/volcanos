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
        var i = 0; refresh && can.Timer(refresh, function(timer) {
            if (i > 100) { timer.stop = true} else { can.run({}) }
        })

        // 展示数据
        can.ui = can.page.Appends(can, can._target, [
            {view: ["content", "div"]}, {view: ["display", "pre"]},
        ])
        can.onappend.table(can, can.ui.content, "table", msg)
        can.onappend.board(can, can.ui.display, "board", msg)

        can.page.Select(can, target, ".story", function(item) { var data = item.dataset
            can.page.Modify(can, item, {style: can.base.Obj(data.style)})
            var cb = can.onimport[data.type]; typeof cb == "function" && cb(can, data, item)
        })
        return typeof cb == "function" && cb(msg)
    },
    spark: function(can, list, target) {
        if (list["name"] == "inner") {
            target.title = "点击复制"
            target.onclick = function(event) {
                can.user.copy(can, target.innerText)
            }
            return
        }
        can.page.Select(can, target, "span", function(item) {
            item.title = "点击复制"
            item.onclick = function(event) {
                can.user.copy(can, item.innerText)
            }
        })
    },
})
Volcanos("onaction", {help: "控件交互", list: [],
    onclick: function(event, can) {
        can.run(event, [], function() {})
    },
})
