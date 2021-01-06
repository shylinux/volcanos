Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.ui = can.page.Append(can, can._output, [
            {input: ["word", function(event) { can.onkeypop.input(event, can)
                if (event.key == "Escape") { can.onmotion.hide(can) }

                if (event.key == "Enter") { event.stopPropagation(), event.preventDefault()
                    if (event.ctrlKey && can.onaction.choice(event, can, 0)) { return }
                    can.input(event, event.target.value)
                }
            }]},
            {view: "content"}, {view: "display", list: [{type: "table"}]},
        ])
        typeof cb == "function" && cb(msg)
    },
    _table: function(can, msg, fields) { can.onmotion.clear(can, can.ui.content)
        var table = can.onappend.table(can, msg, can.ui.content, "table", function(value, key, index, line) {
            can.Status("count", index+1)
            return {text: [key == "text" && typeof line.text == "function" && line.text.help || value, "td"], onclick: function(event) {
                if (typeof line.text == "function") {
                    return can.onmotion.hide(can), line.text()
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

        fields.indexOf("ctx") > -1 && can.page.RangeTable(can, table, [fields.indexOf("ctx"),
            fields.indexOf("cmd"), fields.indexOf("type"), fields.indexOf("name")])

        can.page.Modify(can, can.ui.table, {style: {width: table.offsetWidth}})
    },
    _word: function(can, msg, cmds, fields) {
        var msg = can.request({}, {fields: fields.join(","), word: cmds})
        can.onengine.trigger(can, msg, "search")

        can.onmotion.clear(can, can.ui.content)
        can.run(msg._event, cmds, function(msg) { can.list = msg.Table()
            can.onimport._table(can, msg, fields)
        })
        can.ui.word.setSelectionRange(0, -1)
    },

    select: function(can, msg, cmds, cb) {
        var fields = (cmds[2]||msg.Option("fields")||"pod,ctx,cmd,type,name,text").split(",")
        can.page.Appends(can, can.ui.table, [{th: fields}]), can.cb = function() {
            typeof cb == "function" && cb(can.onexport.select(can)), can.onmotion.hide(can)
        }

        can.input = function(event, word) { cmds[1] = word
            can.onimport._word(can, msg, cmds, fields)
        }

        can.onmotion.show(can), can.ui.input.focus()
        can.onimport._word(can, msg, cmds, fields)
    },
})
Volcanos("onaction", {help: "交互操作", list: ["关闭", "清空", "完成"], _init: function(can, msg, list, cb, target) {
        can.onimport._init(can, msg, list, cb, can._output)
    },
    "关闭": function(event, can) { can.onmotion.hide(can) },
    "清空": function(event, can) { can.onmotion.clear(can, can.ui.table) },
    "完成": function(event, can) { typeof can.cb == "function" && can.cb() },

    choice: function(event, can, index) {
        if (can.list && can.list[index]) { can.onmotion.hide(can)
            if (typeof can.list[index].text == "function") {
                can.list[index].text()
            } else if (can.list[index].text.indexOf("http") == 0) {
                can.user.open(can.list[index].text)
            }
            return true
        }
        return false
    },
})
Volcanos("onexport", {help: "导出数据", list: ["selected", "count"],
    select: function(can) {
        can.page.Select(can, can.ui.display, "tr", function(tr) {
            return can.page.Select(can, tr, "td", function(td) { return td.innerHTML })
        }).slice(1)
    },
})

