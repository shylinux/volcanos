Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, msg, list, cb, target) { can._output.innerHTML = "";
        can.onappend.table(can, target, "table", msg)
        can.onappend.board(can, target, "board", msg)
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

