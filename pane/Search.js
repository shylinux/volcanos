Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.ui = can.page.Append(can, can._output, [
            {input: ["word", function(event) { can.onkeypop.input(event, can)
                if (event.key == "Escape") { can.onmotion.hide(can) }

                if (event.key == "Enter") { event.stopPropagation(), event.preventDefault()
                    if (event.ctrlKey && can.onaction.select(event, can, 0)) { return }
                    can.input(event, event.target.value)
                }
            }]},
            {view: "content"}, {view: ["display", "table"]}, {view: "preview"},
        ]), typeof cb == "function" && cb(msg)
    },
    _table: function(can, msg, fields) { can.onmotion.clear(can, can.ui.content)
        can.onappend.table(can, msg, function(value, key, index, line) { can.Status("count", index+1)
            return {text: [key == "text" && typeof line.text == "function" && line.text.help || value, "td"], onclick: function(event) {
                if (event.shiftKey) { var msg = can.request(event, line)
                    return can.onappend.plugin(can, {index: line.ctx+"."+line.cmd}, function(sub) {
                        sub.run = function(event, cmds, cb) {
                            can.run(event, ["action", "command", "run", meta.index].concat(cmds), function(msg) {
                                typeof cb == "function" && cb(msg)
                            })
                        }
                    }, can.ui.preview)
                }
                if (line.ctx == "web.chat" && line.cmd == "/search") {
                    return can.onimport.select(can, msg, [line.type, line.name, line.text], can.cb)
                }
                if (typeof line.text == "function") {
                    return can.onmotion.hide(can), line.text(event)
                }

                can.page.Append(can, can.ui.display, [{td: can.core.List(fields, function(item) {
                    return line[item]
                }), data: {index: index}, onclick: function(event) {
                    can.page.Remove(can, event.target.parentNode)
                    can.Status("selected", can.page.Select(can, can.ui.display, "tr").length-1)
                }}]), can.Status("selected", can.page.Select(can, can.ui.display, "tr").length-1)
            }}
        }, can.ui.content, [fields.indexOf("pod"), fields.indexOf("ctx"), fields.indexOf("cmd"),
            fields.indexOf("type"), fields.indexOf("name"), fields.indexOf("text")])

    },
    _word: function(can, msg, cmds, fields) {
        msg = can.request({}, {fields: fields.join(","), word: cmds})
        can.onengine.signal(can, "search", msg)

        can.run(msg._event, cmds, function(msg) { can.list = msg.Table()
            can.onimport._table(can, msg, fields)
        })
        can.ui.word.setSelectionRange(0, -1)
    },

    select: function(can, msg, cmds, cb) { can.ui.word.value = cmds[1]
        var fields = (cmds[2]||msg.Option("fields")||"pod,ctx,cmd,type,name,text").split(",")
        can.page.Appends(can, can.ui.display, [{th: fields}]), can.cb = function() {
            typeof cb == "function" && cb(can.onexport.select(can)), can.onmotion.hide(can)
        }

        can.run({}, ["search", "Header.onexport.height"], function(res) {
            can.page.Modify(can, can._target, {style: {top: res}})
        })
        can.run({}, ["search", "River.onexport.width"], function(res) {
            can.page.Modify(can, can._target, {style: {left: res}})
        })

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
    "清空": function(event, can) { can.onmotion.clear(can, can.ui.display),  can.onmotion.clear(can, can.ui.display) },
    "完成": function(event, can) { typeof can.cb == "function" && can.cb() },

    select: function(event, can, index) {
        if (can.list && can.list[index]) { can.onmotion.hide(can)
            if (typeof can.list[index].text == "function") {
                can.list[index].text(event)
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
        return can.page.Select(can, can.ui.display, "tr", function(tr) {
            return can.page.Select(can, tr, "td", function(td) { return td.innerHTML })
        }).slice(1)
    },
})

