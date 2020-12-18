Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        typeof cb == "function" && cb(msg)
    },
    _table: function(can, msg, fields, search) {
        can.onappend.table(can, msg, can.ui.content, "table", function(value, key, index, line) {
            can.Status("count", index+1)

            return {text: [value, "td"], onclick: function(event) {
                if (line.type == "fieldset") {
                    can.page.Select(can, document.body, "fieldset.pane.Action fieldset.plugin>legend", function(item) {
                        if (item.innerHTML == line.name) {
                            var cb = can.page.Select(can, item.parentNode, "input.args")[0]
                            can.onmotion.hide(can)
                            cb && cb.focus()
                        }
                    })
                }

                can.page.Append(can, can.ui.table, [{td: can.core.List(fields, function(item) {
                    return line[item]
                }), data: {index: index}, onclick: function(event) {
                    can.page.Remove(can, event.target.parentNode)
                    can.Status("selected", can.page.Select(can, can.ui.table, "tr").length-1)
                }}])
                can.Status("selected", can.page.Select(can, can.ui.table, "tr").length-1)
            }}
        })
    },

    select: function(can, msg, cmd, cb) { can.onmotion.clear(can)
        var fields = (msg.Option("fields")||"pod,ctx,cmd,type,name,text").split(",")

        function search(word, cb) { cmd[1] = word
            if (word == "" && can.list && can.list[0] && can.list[0].type == "fieldset") {
                can.page.Select(can, document.body, "fieldset.pane.Action fieldset.plugin>legend", function(item) {
                    if (item.innerHTML == can.list[0].name) {
                        var cb = can.page.Select(can, item.parentNode, "input.args")[0]
                        can.onmotion.hide(can)
                        cb && cb.focus()
                    }
                })
                return
            }

            var msg = can.request({}, {fields: fields.join(",")})
            can.page.Select(can, document.body, "fieldset.pane.Action fieldset.plugin>legend", function(item) {
                if (item.innerHTML.indexOf(word) == -1) { return }

                can.core.List(fields, function(key) {
                    switch (key) {
                        case "type":
                            msg.Push(key, "fieldset")
                            break
                        case "name":
                            msg.Push(key, item.innerHTML)
                            break
                        default:
                            msg.Push(key, "")
                    }
                })
            })
            can.onmotion.clear(can, can.ui.content)
            can.run(msg._event, cmd, function(msg) {
                can.list = msg.Table()
                can.onimport._table(can, msg, fields, search)
                typeof cb == "function" && cb(msg)
            })
        }

        can.ui = can.page.Append(can, can._output, [
            {input: ["word", function(event) { var target = event.target
                can.onkeypop.input(event, can)
                if (event.key == "Escape") {
                    can.onmotion.hide(can)
                }

                if (event.key == "Enter") { search(event.target.value, function(msg) {
                    var list = can.page.Select(can, can.ui.content, "tr"); if (list.length == 2) {
                        list[1].firstChild.click(); event.target.setSelectionRange(0, -1)
                    }
                }) }
            }]},
            {view: "content"}, {view: "display", list: [{type: "table", list: [{th: fields}]}]},
        ])
        can.cb = function() {
            typeof cb == "function" && cb(can.page.Select(can, can.ui.display, "tr", function(tr) {
                return can.page.Select(can, tr, "td", function(td) { return td.innerHTML })
            }).slice(1)), can.onmotion.hide(can)
        }

        can.onmotion.show(can)
        can.ui.input.focus()
        search(cmd[1])
    },
})
Volcanos("onaction", {help: "交互操作", list: ["关闭", "清空", "完成"], _init: function(can, msg, list, cb, target) {
        can.onimport._init(can, msg, list, cb, can._output)
    },
    "关闭": function(event, can) { can.onmotion.hide(can) },
    "清空": function(event, can) { can.onmotion.clear(can) },
    "完成": function(event, can) { typeof can.cb == "function" && can.cb() },

    hide: function(can, msg, cmd, cb) { can.onmotion.hide(can) },
})
Volcanos("onexport", {help: "导出数据", list: ["selected", "count"]})

