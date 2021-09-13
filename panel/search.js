Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.onmotion.clear(can, can.ui.content)
        var table = can.onappend.table(can, msg, function(value, key, index, line, array) { can.Status("count", index+1)
            return {text: [key == "text" && can.base.isFunc(line.text) && line.text.help || value, "td"], onclick: function(event) {
                can.onaction[can.type == "*"||event.ctrlKey? "plugin": "select"](event, can, index) 
            }}
        }, can.ui.content, can.core.List((msg.Option("sort")||"ctx,cmd,type,name,text").split(","), function(item) {
            return list.indexOf(item)
        })); table && can.page.Modify(can, can.ui.display, {style: {width: table.offsetWidth}})

        if (msg.Length() == 1) {
            can.page.Select(can, table, "td")[0].click()
        }
    },
    _word: function(can, msg, cmds, fields) { can.type = cmds[0]
        var res = can.request({}, {word: cmds, fields: fields.join(","), sort: msg.Option("sort"), index: msg.Option("index"), river: msg.Option("river")})

        if (cmds[1] == "clear") { can.onaction["清空"]({}, can); return }
        can.onengine.signal(can, "onsearch", res)
        can.run(res._event, cmds, function(res) {
            can.list = res.Table()
            can.onimport._init(can, res, fields)
        }), can.ui.word.setSelectionRange(0, -1)

        can.onmotion.show(can), can.ui.input.focus()
    },

    select: function(can, msg, cmds, cb) { can.ui.word.value = cmds[1]
        var fields = (cmds[2]||msg.Option(ice.MSG_FIELDS)||"ctx,cmd,type,name,text").split(",")
        can.page.Appends(can, can.ui.display, [{th: fields}]), can.cb = function() {
            can.base.isFunc(cb) && cb(can.onexport.select(can)), can.onmotion.hide(can)
        }

        can.input = function(event, word) { cmds[1] = word||cmds[1]
            can.onimport._word(can, msg, cmds, fields)
        }, can.onimport._word(can, msg, cmds, fields)

        can.search(event, ["Action.onexport.size"], function(msg, top, left, width, height) {
            can.page.Modify(can, can._output, {style: {"max-width": width, "max-height": height-75}})
            can.page.Modify(can, can._target, {style: {top: top, left: left}})
        } )
    },
})
Volcanos("onaction", {help: "交互操作", list: ["关闭", "清空", "完成"], _init: function(can, meta, list, cb, target) {
        can.base.isFunc(cb) && cb()
    },
    onlogin: function(can, msg) {
        can.onappend._action(can, can.Conf("action")||can.onaction.list)
        can.ui = can.page.Append(can, can._output, [
            {input: ["word", function(event) { can.onkeypop.input(event, can)
                if (event.key == "Escape") { can.onmotion.hide(can) }

                if (event.key == "Enter") { event.stopPropagation(), event.preventDefault()
                    if (event.shiftKey) {
                        var first = can.page.Select(can, can.ui.content, "tr")[1]
                        return can.onaction[can.type == "*"? "plugin": "select"](event, can, first.dataset.index)
                    }
                    if (event.ctrlKey) { return can.onaction["完成"](event, can) }
                    can.input(event, event.target.value)
                }
            }]},
            {view: "content"}, {view: ["display", "table"]}, {view: "preview"},
        ])
        can.page.ClassList.add(can, can.ui.display, "content")
    },
    "关闭": function(event, can) { can.onmotion.hide(can) },
    "清空": function(event, can) { can.onmotion.clear(can, can.ui.preview) },
    "完成": function(event, can) { can.base.isFunc(can.cb) && can.cb() },

    select: function(event, can, index) { var line = can.list[index]
        if (can.base.isFunc(line.text)) { return can.onmotion.hide(can), line.text(event) }

        if (line.ctx == "web.chat" && line.cmd == "/search") {
            return can.onimport.select(can, msg, [line.type, line.name, line.text], can.cb)
        }

        var fields = can.page.Select(can, can.ui.display, "th", function(item) { return item.innerText })
        can.page.Append(can, can.ui.display, [{td: can.core.List(fields, function(item) {
            return line[item]
        }), data: {index: index}, onclick: function(event) { can.page.Remove(can, event.target.parentNode)
            can.Status("selected", can.page.Select(can, can.ui.display, "tr").length-1)
        }}]), can.Status("selected", can.page.Select(can, can.ui.display, "tr").length-1)
    },

    plugin: function(event, can, index) { var line = can.list[index]
        if (can.base.isFunc(line.text)) { return can.onmotion.hide(can), line.text(event) }

        var cmd = line.cmd == "command"? can.core.Keys(line.text, line.name): can.core.Keys(line.ctx, line.cmd)
        can.onappend.plugin(can, {type: "plugin", index: cmd||msg.Option("index")}, function(sub, meta) {
            can.search({}, "Action.onexport.size", function(msg, width) {
                sub.Conf("width", width-60)
            })
            sub.run = function(event, cmds, cb) { var msg = can.request(event, line)
                can.run(event, can.misc.Concat([ctx.ACTION, cli.RUN, meta.index], cmds), cb)
            }
        }, can.ui.preview)
    },
})
Volcanos("onexport", {help: "导出数据", list: ["selected", "count"],
    select: function(can) {
        return can.page.Select(can, can.ui.display, "tr", function(tr) {
            return can.page.Select(can, tr, "td", function(td) { return td.innerHTML })
        }).slice(1)
    },
})

