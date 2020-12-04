Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, meta, list, cb) {
        typeof cb == "function" && cb()
    },

    input: function(can, msg, cmd, cb) { can._output.innerHTML = ""
        can.cb = cb
        can.ui = can.page.Append(can, can._output, [{view: "content"}, {view: "display"}])
        can.page.Modify(can, can._target, {style: {display: "block"}})

        can.page.Select(can, can._action, "input[name=word]", function(item) { item.value = cmd[1] })
        var msg = can.request({})
        can.run(msg._event, ["search", "River.onexport.key"])

        can.run(msg._event, cmd, function(msg) {
            can.onappend.table(can, msg, can.ui.content, "table", function(value, key, index, line) {
                return {text: [value, "td"], onclick: function(event) {
                    can.Status("index", index)
                    can.Status("value", value)
                    can.run(event, ["render", line.type, line.name, line.text], function(msg) {
                        can.ui.display.innerHTML = ""
                        can.onappend.table(can, msg, can.ui.display, "table")
                        can.onappend.board(can, msg, can.ui.display, "board")
                    })
                }}
                ca.run(event, [""])
            })

            can.Status("count", msg.append && msg.append[0] && msg[msg.append[0]].length || 0)
            can.onappend.board(can, msg, can.ui.content, "board")
        })
    },

    active: function(can, msg, cmd, cb) { can._output.innerHTML = ""
        function search(word) { cmd[1] = word || ""
            var ev = {}; var res = can.request(ev); res.Copy(msg)
            can.run(ev, cmd, function(res) { can.ui.content.innerHTML = ""
                can.onappend.table(can, res, can.ui.content, "table", function(value, key, index, line) {
                    can.Status("count", index+1)
                    return {text: [value, "td"], onclick: function(event) {
                        typeof cb == "function" && cb(line)
                        can.Status("index", index)
                        can.Status("value", value)
                    }}
                })
            })
        }

        can.ui = can.page.Append(can, can._output, [
            {input: ["word", function(event) {
                if (event.key == "Enter") {
                    search(event.target.value)
                }
            }], value: cmd[1]||""},
            {view: "content"},
        ])
        can.page.Modify(can, can._target, {style: {display: "block"}})
        can.ui.input.focus()
        search(cmd[1])
    },

    select: function(can, msg, cmd, cb) { can._output.innerHTML = ""
        var fields = (msg.Option("fields")||"pod,ctx,cmd,type,name,text").split(",")

        function search(word, cb) { cmd[1] = word
            var msg = can.request({})
            msg.Option("fields", fields.join(","))
            can.run(msg._event, cmd, function(msg) { can.ui.content.innerHTML = ""
                can.onappend.table(can, msg, can.ui.content, "table", function(value, key, index, line) {
                    can.Status("count", index+1)
                    return {text: [value, "td"], onclick: function(event) {
                        can.Status("index", index)
                        can.Status("value", value)

                        can.page.Append(can, can.ui.table, [{td: can.core.List(fields, function(item) {
                            return line[item]
                        }), data: {index: index}, onclick: function(event) {
                            can.page.Remove(can, event.target.parentNode)
                        }}])
                    }}
                })
                typeof cb == "function" && cb(msg)
            })
        }

        can.cb = function() {
            typeof cb == "function" && cb(can.page.Select(can, can.ui.display, "tr", function(tr) {
                return can.page.Select(can, tr, "td", function(td) { return td.innerHTML })
            }).slice(1))
            can.onaction.close(can)
        }, can.ui = can.page.Append(can, can._output, [
            {input: ["word", function(event) {
                if (event.key == "Enter") { search(event.target.value, function(msg) {
                    var list = can.page.Select(can, can.ui.content, "tr"); if (list.length == 2) {
                        list[1].firstChild.click(); event.target.setSelectionRange(0, -1)
                    }
                }) }
            }]},
            {view: "content"}, {view: "display", list: [{type: "table", list: [{th: fields}]}]},
        ])
        can.page.Modify(can, can._target, {style: {display: "block"}})
        can.ui.input.focus()
        search(cmd[1])
    },
})
Volcanos("onaction", {help: "交互操作", list: ["关闭", "清空", "完成"], _init: function(can, msg, list, cb, target) {
        can.onexport._init(can, msg, list, cb, target)
    },
    close: function(can) {
        can.page.Modify(can, can._target, {style: {display: "none"}})
    },
    "关闭": function(event, can, key) {
        can.onaction.close(can)
    },
    "清空": function(event, can, key) {
        can._output.innerHTML = ""
    },
    "完成": function(event, can, key) { can.cb && can.cb() },
})
Volcanos("ondetail", {help: "交互菜单", list: ["共享", "更名", "删除"],
    "共享": function(event, can, value, sub) { var msg = sub.request(event)
    },
})
Volcanos("onexport", {help: "导出数据", list: ["count", "index", "value"], _init: function(can, msg, list, cb, target) {
    },
})

