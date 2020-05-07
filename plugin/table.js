Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, msg, list, cb, target) { can._output.innerHTML = "";
        can.onappend.table(can, target, "table", msg)
        msg.result && can.page.AppendBoard(can, can._output, msg.result.join(""))
        return typeof cb == "function" && cb(msg)
    },
})
Volcanos("onaction", {help: "控件交互", list: [],
    onclick: function(event, can) {
        can.run(event, [], function() {})
    },
})



