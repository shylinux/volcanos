Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        typeof cb == "function" && cb(msg)
    },
    _table: function(can, msg, fields, search) {
        can.onappend.table(can, msg, can.ui.content, "table", function(value, key, index, line) {
            can.Status("count", index+1)

            return {text: [key == "text" && typeof line.text == "function" && line.text.help || value, "td"], onclick: function(event) {
                if (typeof line.text == "function") {
                    can.onmotion.hide(can)
                    line.text()
                    return
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

    select: function(can, msg, cmds, cb) { can.onmotion.clear(can)
        var fields = (msg.Option("fields")||"pod,ctx,cmd,type,name,text").split(",")

        function search(word, cb) { cmds[1] = word
            if (word == "" && can.list && can.list[0] && typeof can.list[0].text == "function") {
                can.onmotion.hide(can)
                can.list[0].text()
                return
            }

            var msg = can.request({}, {fields: fields.join(","), word: cmds})
            can.onengine.trigger(can, msg, "search")

            can.onmotion.clear(can, can.ui.content)
            can.run(msg._event, cmds, function(msg) {
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
        search(cmds[1])
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

