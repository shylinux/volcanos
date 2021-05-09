Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.onmotion.clear(can, can.ui.content)
        var table = can.onappend.table(can, msg, function(value, key, index, line) { can.Status("count", index+1)
            return {text: [key == "text" && can.base.isFunc(line.text) && line.text.help || value, "td"], onclick: function(event) {
                can.onaction[can.type == "*"||event.ctrlKey? "plugin": "select"](event, can, index) 
            }}
        }, can.ui.content, can.core.List((msg.Option("sort")||"ctx,cmd,type,name,text").split(","), function(item) {
            return list.indexOf(item)
        })); table && can.page.Modify(can, can.ui.display, {style: {width: table.offsetWidth}})
    },
    _word: function(can, msg, cmds, fields) { can.type = cmds[0]
        var sub = can.request({}, {word: cmds, fields: fields.join(","), sort: msg.Option("sort"), index: msg.Option("index")})
        can.onengine.signal(can, "search", sub)

        can.run(sub._event, cmds, function(sub) { can.list = sub.Table()
            can.onimport._init(can, sub, fields)
        }), can.ui.word.setSelectionRange(0, -1)

        can.onmotion.show(can), can.ui.input.focus()
    },

    select: function(can, msg, cmds, cb) { can.ui.word.value = cmds[1]
        var fields = (cmds[2]||msg.Option("fields")||"ctx,cmd,type,name,text").split(",")
        can.page.Appends(can, can.ui.display, [{th: fields}]), can.cb = function() {
            can.base.isFunc(cb) && cb(can.onexport.select(can)), can.onmotion.hide(can)
        }

        can.input = function(event, word) { cmds[1] = word||cmds[1]
            can.onimport._word(can, msg, cmds, fields)
        }, can.onimport._word(can, msg, cmds, fields)

        can.search(["Action.onexport.size"], function(msg, top, left, width, height) {
            can.page.Modify(can, can._output, {style: {"max-width": width, "max-height": height-75}})
            can.page.Modify(can, can._target, {style: {top: top, left: left}})
        } )
    },
})
Volcanos("onaction", {help: "交互操作", list: ["关闭", "清空", "完成"], _init: function(can, msg, list, cb, target) {
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
        ]), can.base.isFunc(cb) && cb(msg)
    },
    "关闭": function(event, can) { can.onmotion.hide(can) },
    "清空": function(event, can) { can.onmotion.clear(can, can.ui.preview) },
    "完成": function(event, can) { can.base.isFunc(can.cb) && can.cb() },

    select: function(event, can, index) {

        // if (line.ctx == "web.chat" && line.cmd == "/search") {
        //     return can.onimport.select(can, msg, [line.type, line.name, line.text], can.cb)
        // }

        if (can.list && can.list[index]) {
            var text = can.list[index].text || ""
            if (can.base.isFunc(text)) {
                can.list[index].text(event)
            } else { var line = can.list[index]
                var fields = can.page.Select(can, can.ui.display, "th", function(item) { return item.innerText })
                can.page.Append(can, can.ui.display, [{td: can.core.List(fields, function(item) {
                    return line[item]
                }), data: {index: index}, onclick: function(event) {
                    can.page.Remove(can, event.target.parentNode)
                    can.Status("selected", can.page.Select(can, can.ui.display, "tr").length-1)
                }}]), can.Status("selected", can.page.Select(can, can.ui.display, "tr").length-1)
                return false
            }
            can.onmotion.hide(can)
            return true
        }
        return false
    },

    plugin: function(event, can, index) { var line = can.list[index]
        var cmd = line.cmd == "command"? can.core.Keys(line.text, line.name): can.core.Keys(line.ctx, line.cmd)

        can.onappend.plugin(can, {type: "plugin", index: cmd||msg.Option("index"), option: line}, function(sub, meta) {
            sub.run = function(event, cmds, cb) { var msg = can.request(event, line)
                can.run(event, ["action", "command", "run", meta.index].concat(cmds), function(msg) {
                    can.base.isFunc(cb) && cb(msg)
                })
            }

            sub.page.Modify(sub, sub._legend, {
                onmouseenter: function(event) {
                    Volcanos.meta.data.menu && sub.page.Remove(sub, Volcanos.meta.data.menu.first)
                    Volcanos.meta.data.menu = sub.user.carte(event, sub, can.ondetail, can.ondetail.list)

                    sub.page.Modify(sub, Volcanos.meta.data.menu.first, {style: {
                        left: event.target.offsetLeft+can.run(event, ["search", "River.onexport.width"])+10,
                        top: event.target.offsetTop-(can.user.isMobile? can._target.parentNode.parentNode.scrollTop: can._output.scrollTop)+event.target.offsetHeight+can.run(event, ["search", "Header.onexport.height"])+32,
                    }})
                },
            })
        }, can.ui.preview)
    },
})
Volcanos("ondetail", {help: "交互操作", list: ["删除"], _init: function(can, msg, list, cb, target) {
    },
    "删除": function(event, sub) {
        sub.page.Remove(sub, sub._target)
    },
})
Volcanos("onexport", {help: "导出数据", list: ["selected", "count"],
    select: function(can) {
        return can.page.Select(can, can.ui.display, "tr", function(tr) {
            return can.page.Select(can, tr, "td", function(td) { return td.innerHTML })
        }).slice(1)
    },
})

