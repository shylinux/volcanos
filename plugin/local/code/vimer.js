Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.require(["/plugin/local/code/inner.js"], function(can) {
            can.onimport.inner_init(can, msg, list, function() {
                can.onimport._input(can), can.onimport._output(can)
                can.keylist = [], can.onkeymap._init(can, "insert")
                can.base.isFunc(cb) && cb(msg)
            }, target)
        }, function(can, name, sub) {
            sub._name == "onimport" && (can.onimport.inner_init = sub._init)
        })
    },
    _input: function(can) {
        var ui = can.page.Append(can, can.ui.content.parentNode, [
            {view: ["current", "input"], onkeydown: function(event) {
                can.onkeymap.parse(event, can, "insert")
                can.core.Timer(10, function() {
                    can.current.text(can.ui.current.value)
                })
            }, onblur: function(event) {
                can.current.text(can.ui.current.value)
            }, onfocus: function(event) {
                can._output.scrollLeft += -1000

                can.current.scroll(-1000, 0)
            }, onclick: function(event) {
                can.onkeymap._insert(can)
            }},

            {view: ["command", "input"], onkeydown: function(event) {
                can.onkeymap.parse(event, can, "command")
            }, onfocus: function(event) {
                can._output.scrollLeft += -1000
                can.current.scroll(-1000, 0)
            }},
        ]); can.base.Copy(can.ui, ui, "current", "command")
    },
    _output: function(can) {
        var ui = can.page.Appends(can, can.ui.display, [
            {view: "action", list: [
                {input: ["cmd", function(event) {
                    can.onkeymap.parse(event, can, "command")
                }], value: "", onfocus: function(event) {
                    event.target.setSelectionRange(0, -1)
                    can.onkeymap._command(can)
                }},
                {button: ["执行", function(event) {
                    can.onkeymap.command.Enter(event, can, can.ui.cmd.value)
                }]},
                {button: ["清空", function(event) {
                    can.onmotion.clear(can, ui.output)
                } ]},
                {button: ["关闭", function(event) {
                    can.onmotion.hidden(can, can.ui.display)
                } ]},
            ]}, {view: "output"},
        ]); can.base.Copy(can.ui, ui, "output", "cmd")
    },
}, ["/plugin/local/code/vimer.css"])
Volcanos("onkeymap", {help: "键盘交互", list: ["command", "normal", "insert"], _init: function(can, mode) {
        can.core.List(can.onkeymap.list, function(item) { var engine = {}
            can.core.Item(can.onkeymap[item], function(key, cb) { var map = engine
                for (var i = key.length-1; i > -1; i--) {
                    map = map[key[i]] = i == 0? cb: (map[key[i]]||{})
                }
            }), can.onkeymap[item]._engine = engine
        }), can.onkeymap._mode(can, mode||"normal")
    },
    _mode: function(can, value) { can.Status("模式", can.mode = value)
        can.page.Modify(can, can.ui.current, {className: "current "+can.mode})
        can.page.Modify(can, can.ui.command, {className: "command "+can.mode})
        return value
    },
    _command: function(can) { can.onkeymap._mode(can, "command")
        if (can.ui.display.style.display == "none") {
            can.page.Modify(can, can.ui.command, {style: {display: ""}})
            can.ui.command.focus()
        } else {
            can.page.Modify(can, can.ui.display, {style: {display: "block"}})
            can.ui.cmd.focus()
        }
    },
    _normal: function(can) { can.onkeymap._mode(can, "normal")
        can.ui.current.focus()
    },
    _insert: function(can) { can.onkeymap._mode(can, "insert")
        can.ui.current.focus()
    },

    _remote: function(event, can, key, arg, cb) { can.request(event, {_toast: "执行中..."})
        can.run(event, arg||["action", key, can.parse, can.Option("file"), can.Option("path")], cb||function(msg) {
            can.onappend.table(can, msg, function(value, key, index) { return {text: [value, "td"]} }, can.ui.output)
            can.onappend.board(can, msg.Result(), can.ui.output)
        }, true)
    },
    _engine: {
        e: function(event, can, line, ls) { can.onimport.tabview(can, can.Option("path"), ls[1]) },
        p: function(event, can) { can.onaction["项目"](event, can) },
        q: function(event, can) { can.onmotion.hidden(can, can.ui.display) },
        w: function(event, can) { can.onaction.save(event, can) },
    },

    parse: function(event, can, mode) {
        can.keylist.push(event.key); if (can.mode != mode) {
            event.stopPropagation(), event.preventDefault()
        }; can.mode == "normal" && can.Status("按键", can.keylist.join(""))

        for (var pre = 0; pre < can.keylist.length; pre++) {
            if ("0" <= can.keylist[pre] && can.keylist[pre] <= "9") { continue } break
        }; can.count = parseInt(can.keylist.slice(0, pre).join(""))||1

        function repeat(cb, count) {
            for (var i = 1; i <= count; i++) { if (cb(event, can, count)) { break } }
            can.keylist.length > 0 && (can.lastcmd = can.keylist), can.keylist = []
            can.Status("按键", can.keylist.join(""))
        }

        var p = can.onsyntax[can.parse]
        var cb = (p && p.keymap || can.onkeymap[can.mode])[event.key]; if (can.base.isFunc(cb)) {
            return repeat(cb, can.count)
        }

        var map = can.onkeymap[can.mode]._engine; for (var i = can.keylist.length-1; i > pre-1; i--) {
            var cb = map[can.keylist[i]]; if (can.base.isFunc(cb)) {
                return repeat(cb, can.count)
            }; if (typeof cb == "object") { map = cb; continue }; break
        }
    },
    command: {
        Escape: function(event, can) { can.onkeymap._normal(can) },
        Enter: function(event, can) { can.onmotion.hidden(can, can.ui.command)
            can.page.Modify(can, can.ui.display, {style: {display: "block"}})
            var line = can.ui.command.value || can.ui.cmd.value
            can.ui.cmd.value = line, can.ui.cmd.focus()
            can.ui.cmd.setSelectionRange(0, -1)
            can.ui.command.value = ""

            can.onmotion.clear(can, can.ui.output)
            var ls = can.core.Split(line, " ", ",")
            var cb = can.onkeymap._engine[ls[0]]; if (can.base.isFunc(cb)) {
                can.onmotion.hidden(can, can.ui.display)
                can.onkeymap._normal(can)
                cb(event, can, line, ls)
            } else {
                can.onkeymap._remote(event, can, line, [ctx.ACTION, "engine"].concat(ls))
            }
        },
        jk: function(event, can) { can.keylist = can.keylist.slice(0, -1)
            can.onkeymap.command.Enter(event, can)
        },
    },
    normal: {
        ":": function(event, can) {
            can.onkeymap._command(can)
            can.ui.command.value = ""
        },
        ".": function(event, can) {
            can.keylist = can.lastcmd
            can.onkeymap.parse({key: ""}, can, "normal")
        },

        H: function(event, can) {
            can.ui.current.setSelectionRange(0, 0)
        },
        h: function(event, can) {
            can.ui.current.setSelectionRange(can.ui.current.selectionStart-1, can.ui.current.selectionStart-1)
        },
        l: function(event, can) {
            can.ui.current.setSelectionRange(can.ui.current.selectionStart+1, can.ui.current.selectionStart+1)
        },
        L: function(event, can) {
            can.ui.current.setSelectionRange(-1, -1)
        },
        j: function(event, can) {
            can.onaction.selectLine(can, can.current.next())
        },
        k: function(event, can) {
            can.onaction.selectLine(can, can.current.prev())
        },

        gg: function(event, can, count) { count = count || 1
            can.onaction.selectLine(can, count)
            var pos = can.current.offset()-can.ui.current.offsetTop
            can.current.scroll(0, -(pos+can.current.height()*5))
            return true
        },
        G: function(event, can, count) { count = count > 1? count: can.max
            can.onaction.selectLine(can, count)
            var pos = can.current.offset()-can.ui.current.offsetTop
            can.current.scroll(0, -(pos+can.current.height()*5))
            return true
        },
        zt: function(event, can, count) { count = count || 2
            var pos = can.current.offset()-can.ui.current.offsetTop
            can.current.scroll(0, -(pos+can.current.height()*count))
            return true
        },
        zz: function(event, can, count) { count = count || 5
            var pos = can.current.offset()-can.ui.current.offsetTop
            can.current.scroll(0, -(pos+can.current.height()*count))
            return true
        },
        zb: function(event, can, count) { count = count || 3
            var pos = can.current.offset()-can.ui.current.offsetTop
            can.current.scroll(0, -(pos+can.current.window()-can.current.height()*count))
            return true
        },

        i: function(event, can) { can.onkeymap._insert(can)
        },
        I: function(event, can) { can.onkeymap._insert(can)
            can.ui.current.setSelectionRange(0, 0)
        },
        a: function(event, can) { can.onkeymap._insert(can)
        },
        A: function(event, can) { can.onkeymap._insert(can)
            can.ui.current.setSelectionRange(-1, -1)
        },
        o: function(event, can) { can.onkeymap._insert(can)
            can.onaction.selectLine(can, can.onkeymap.insertLine(can, "", can.current.next()))
        },
        O: function(event, can) { can.onkeymap._insert(can)
            can.onaction.selectLine(can, can.onkeymap.insertLine(can, "", can.current.line))
        },

        yy: function(event, can) { can.last = can.current.text() },
        dd: function(event, can) { can.last = can.current.text()
            var next = can.current.next()
            can.onkeymap.deleteLine(can, can.current.line)
            can.onaction.selectLine(can, next)
        },
        p: function(event, can) {
            can.onkeymap.insertLine(can, can.last, can.current.next())
        },
        P: function(event, can) {
            can.onkeymap.insertLine(can, can.last, can.current.line)
        },
    },
    insert: {
        Escape: function(event, can) { can.onkeymap._normal(can)
            can.onaction.modifyLine(can, can.current, can.ui.current.value)
            event.stopPropagation(), event.preventDefault()
        },
        Enter: function(event, can) {
            var before = can.ui.current.value.slice(0, event.target.selectionEnd)
            var left = can.ui.current.value.slice(event.target.selectionEnd)
            can.current.text(before||"")
            can.onaction.selectLine(can, can.onkeymap.insertLine(can, left, can.current.next()))
            can.ui.current && can.ui.current.setSelectionRange(0, 0)
        },
        Backspace: function(event, can) {
            if (can.ui.current.selectionStart > 0) { return }
            event.stopPropagation(), event.preventDefault()
            if (!can.current.prev()) { return }

            var rest = can.current.text()
            can.onaction.selectLine(can, can.current.prev())
            var pos = can.current.text().length

            rest = can.current.text()+rest
            can.ui.current.value = rest
            can.current.text(rest)
            can.ui.current.setSelectionRange(pos, pos)

            can.onkeymap.deleteLine(can, can.current.next())
        },
        ArrowDown: function(event, can) {
            can.onaction.selectLine(can, can.current.next())
            can.ui.current.setSelectionRange(can.ui.current.selectionStart, can.ui.current.selectionEnd)
        },
        ArrowUp: function(event, can) {
            can.onaction.selectLine(can, can.current.prev())
            can.ui.current.setSelectionRange(can.ui.current.selectionStart, can.ui.current.selectionEnd)
        },
        jk: function(event, can) {
            can.onkeypop.DelText(can.ui.current, can.ui.current.selectionStart-1, 1)
            can.onkeymap.insert.Escape(event, can)
        },
    },

    selectLine: function(can) { var line = can.current.line
        can.page.Select(can, can.current.line, "td.text", function(item) { line = item })
        can.page.Modify(can, can.ui.current, {className: "current "+can.mode, value: can.current.text(), style: {
            left: line.offsetLeft, top: line.offsetTop-can.current.offset()-2,
            height: line.offsetHeight, width: line.offsetWidth
        }})
        // can.ui.current.focus()
        can.ui.current.setSelectionRange(event.offsetX/13, event.offsetX/13)
        can.page.Modify(can, can.ui.command, {className: "command "+can.mode})
    },
    insertLine: function(can, value, before) {
        var line = can.onaction.appendLine(can, value)
        before && can.ui.content.insertBefore(line, before)
        return can.onaction.rerankLine(can), line
    },
    deleteLine: function(can, line) {
        can.page.Remove(can, line)
        can.onaction.rerankLine(can)
    },
})
Volcanos("onaction", {help: "控件交互", list: ["项目", "autogen"],
    save: function(event, can) { var msg = can.request(event, {content: can.onexport.content(can)})
        can.run(event, [ctx.ACTION, "save", can.parse, can.Option("file"), can.Option("path")], function(msg) {
            can.user.toast(can, "保存成功")
        }, true)
    },
})
Volcanos("onexport", {help: "导出数据", list: ["文件数", "模式", "按键", "解析器", "文件名", "当前行", "跳转数"]})
