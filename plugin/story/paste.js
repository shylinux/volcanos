Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) { can._output.innerHTML = "";
        can.ui = can.page.Append(can, can._target, [
            {view: ["content", "div"]}, {view: ["display", "pre"]},
        ])
        can.onappend.table(can, "content", msg, null, can.ui.content)
        can.onappend.board(can, "content", msg.Result(), can.ui.display)
        return typeof cb == "function" && cb(msg)
    },
})
Volcanos("onaction", {help: "控件交互", list: [],
    "添加": function(event, can) {
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

