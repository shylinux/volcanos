Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) { can._output.innerHTML = "";
        can.ui = can.page.Append(can, can._target, [
            {view: ["content", "div"]}, {view: ["display", "pre"]},
        ])
        can.onappend.table(can, can.ui.content, "table", msg)
        can.onappend.board(can, can.ui.display, "board", msg)
        var refresh = msg.Option("_refresh") || can.Conf("feature")["_refresh"] 
        refresh && can.Timer(refresh, function() {
            can.run({})
        })
        return typeof cb == "function" && cb(msg)
    },
})
Volcanos("onaction", {help: "控件交互", list: [],
    onclick: function(event, can) {
        can.run(event, [], function() {})
    },
})
Volcanos("ondetail", {help: "控件交互", list: ["编辑", "删除"],
    "编辑": function(event, can, key) {
        console.log(key)
    },
    "删除": function(event, can, key) {
        console.log(key)
    },
})


