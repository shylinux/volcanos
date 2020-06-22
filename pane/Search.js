Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, meta, list, cb) {
        typeof cb == "function" && cb()
    },

    input: function(can, msg, cmd, cb) { can._output.innerHTML = ""
        can.ui = can.page.Append(can, can._output, [{view: "content"}, {view: "display"}])
        can.page.Modify(can, can._target, {style: {display: "block"}})

        can.page.Select(can, can._action, "input[name=word]", function(item) { item.value = cmd[0] })
        can.run({}, cmd, function(msg) {
            can.onappend.table(can, can.ui.content, "table", msg, function(value, key, index, line) {
                return {text: [value, "td"], onclick: function(event) {
                    can.run(event, [line.type, line.name, line.text], function(msg) {
                        can.ui.display.innerHTML = ""
                        can.onappend.table(can, can.ui.display, "table", msg)
                        can.onappend.board(can, can.ui.display, "board", msg)
                    })
                }}
                ca.run(event, [""])
            })
            can.onappend.board(can, can.ui.content, "board", msg)
        })
    },
})
Volcanos("onaction", {help: "交互操作", list: ["关闭", "清空", "下载", "渲染", "执行", "收藏", "搜索"], _init: function(can, msg, list, cb, target) {
        can.onexport._init(can, msg, list, cb, target)
    },
    "关闭": function(event, can, key) {
        can.page.Modify(can, can._target, {style: {display: "none"}})
    },
})
Volcanos("ondetail", {help: "交互菜单", list: ["共享", "更名", "删除"],
    "共享": function(event, can, value, sub) { var msg = sub.request(event)
    },
})
Volcanos("onexport", {help: "导出数据", list: [], _init: function(can, msg, list, cb, target) {
    },
})


