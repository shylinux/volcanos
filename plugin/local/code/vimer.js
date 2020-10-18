Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.require(["/plugin/local/code/inner.js"], function(can) {
            can.onimport._init(can, msg, list, function() {
                var ui = can.page.Append(can, can.ui.profile, [
                    {view: ["editor", "input"], onkeydown: function(event) {
                        can.onkeymap.parse(event, can, "insert")
                        can.Timer(1, function() {
                            can.current.text(can.ui.editor.value)
                        })
                    }, onblur: function(event) {
                        can.current.text(can.ui.editor.value)
                    }, onclick: function(event) {
                        can.onkeymap._insert(can)
                    }},
                    {view: ["command", "input"], onkeydown: function(event) {
                        can.onkeymap.parse(event, can, "command")
                    }},
                ])

                can.ui.editor = ui.editor
                can.ui.command = ui.command
                can.onkeymap._init(can, "insert")
                typeof cb == "function" && cb()
            }, target)
        })
    },
}, ["/plugin/local/code/vimer.css"])
Volcanos("onkeymap", {help: "键盘交互", list: ["command", "normal", "insert"], _init: function(can, mode) {
        can.history = []
        can.core.List(can.onkeymap.list, function(item) { var engine = {}
            can.core.Item(can.onkeymap[item], function(key, cb) { var map = engine
                for (var i = key.length-1; i > -1; i--) {
                    map = map[key[i]] = i == 0? cb: (map[key[i]]||{})
                }
            }), can.onkeymap[item]._engine = engine
        })
        can.onkeymap._mode(can, mode||"normal")
    },
    _mode: function(can, value) { can.Status("模式", can.mode = value)
        can.page.Modify(can, can.ui.editor, {className: "editor "+can.mode})
        can.page.Modify(can, can.ui.command, {className: "command "+can.mode})
        return value
    },
    _command: function(can) { can.onkeymap._mode(can, "command")
        can.page.Modify(can, can.ui.command, {style: {
            position: "absolute", top: can.current.offset()+can.current.window()-can.current.height(),
        }})
        can.ui.command.focus()
    },
    _normal: function(can) { can.onkeymap._mode(can, "normal")
        can.ui.editor.focus()
    },
    _insert: function(can) { can.onkeymap._mode(can, "insert")
        can.ui.editor.focus()
    },

    _remote: function(event, can, key, arg, cb) {
        can.page.Modify(can, can.ui.display, {innerHTML: "", style: {display: "none"}})
        var msg = can.request(event); msg.Option("content", can.onexport.content(can))
        can.run(event, arg||["action", key, can.Option("path"), can.Option("file")], cb||function(msg) {
            (msg.Result() || msg.append && msg.append.length > 0) && can.page.Modify(can, can.ui.display, {innerHTML: "", style: {display: "block"}})
            can.onappend.table(can, can.ui.output, "table", msg, function(value, key, index) {
                return {text: [value, "td"]}
            })
            can.onappend.board(can, can.ui.output, "board", msg)
        }, true)
    },
    _engine: {
        e: function(event, can, line, ls) { can.onimport.tabview(can, can.Option("path"), ls[1]) },
        w: function(event, can) { can.onaction["保存"](event, can, "保存") },
        r: function(event, can) { can.onaction["运行"](event, can, "运行") },
    },

    parse: function(event, can, mode) {
        event.key.length == 1 && can.history.push(event.key); if (can.mode != mode) {
            event.stopPropagation(), event.preventDefault()
        }; can.mode != "command" && can.Status("按键", can.history.join(""))

        for (var pre = 0; pre < can.history.length; pre++) {
            if ("0" <= can.history[pre] && can.history[pre] <= "9") { continue } break
        }; can.count = parseInt(can.history.slice(0, pre).join(""))||1

        function repeat(cb, count) {
            for (var i = 1; i <= count; i++) { if (cb(event, can, count)) { break } }
            can.history.length > 0 && (can.lastcmd = can.history), can.history = []
            can.Status("按键", can.history.join(""))
        }

        var p = can.onsyntax[can.parse]
        var cb = (p && p.keymap || can.onkeymap[can.mode])[event.key]; if (typeof cb == "function") {
            return repeat(cb, can.count)
        }

        var map = can.onkeymap[can.mode]._engine; for (var i = can.history.length-1; i > pre-1; i--) {
            var cb = map[can.history[i]]; if (typeof cb == "function") {
                return repeat(cb, can.count)
            }; if (typeof cb == "object") { map = cb; continue }; break
        }
    },
    command: {
        Escape: function(event, can) {
            can.onkeymap._normal(can)
        },
        Enter: function(event, can) { var line = can.ui.command.value; var ls = can.core.Split(line, " ", ",", {simple: true})
            var cb = can.onkeymap._engine[ls[0]]; typeof cb == "function"? cb(event, can, line, ls):
                can.onkeymap._remote(event, can, line, ["action", "command"].concat(ls))
            can.onkeymap.command.Escape(event, can)
        },
        jk: function(event, can) { can.history = can.history.slice(0, -1)
            can.onkeymap.command.Enter(event, can)
        },
    },
    normal: {
        ":": function(event, can) {
            can.ui.command.value = ""
            can.onkeymap._command(can)
        },
        ".": function(event, can) {
            can.history = can.lastcmd
            can.onkeymap.parse({key: ""}, can, "normal")
        },

        h: function(event, can) {
            can.ui.editor.setSelectionnRange(can.ui.editor.selectionStart-1, can.ui.editor.selectionStart-1)
        },
        l: function(event, can) {
            can.ui.editor.setSelectionRange(can.ui.editor.selectionStart+1, can.ui.editor.selectionStart+1)
        },
        j: function(event, can) {
            can.onaction.selectLine(can, can.current.next())
            var pos = can.current.offset()+can.current.window()-can.ui.editor.offsetTop; if (pos < 5*can.current.height()) {
                can.current.scroll(0, can.current.height())
            }
        },
        k: function(event, can) {
            can.onaction.selectLine(can, can.current.prev())
            var pos = can.ui.editor.offsetTop-can.current.offset(); if (pos < can.current.height()*5) {
                can.current.scroll(0, -can.current.height())
            }
        },

        gg: function(event, can, count) { count = count || 1
            can.onaction.selectLine(can, count)
            var pos = can.current.offset()-can.ui.editor.offsetTop
            can.current.scroll(0, -(pos+can.current.height()*5))
            return true
        },
        G: function(event, can, count) { count = count > 1? count: can.max
            can.onaction.selectLine(can, count)
            var pos = can.current.offset()-can.ui.editor.offsetTop
            can.current.scroll(0, -(pos+can.current.height()*5))
            return true
        },
        zt: function(event, can, count) { count = count || 2
            var pos = can.current.offset()-can.ui.editor.offsetTop
            can.current.scroll(0, -(pos+can.current.height()*count))
            return true
        },
        zz: function(event, can, count) { count = count || 5
            var pos = can.current.offset()-can.ui.editor.offsetTop
            can.current.scroll(0, -(pos+can.current.height()*count))
            return true
        },
        zb: function(event, can, count) { count = count || 3
            var pos = can.current.offset()-can.ui.editor.offsetTop
            can.current.scroll(0, -(pos+can.current.window()-can.current.height()*count))
            return true
        },

        i: function(event, can) { can.onkeymap._insert(can)
        },
        I: function(event, can) { can.onkeymap._insert(can)
            can.ui.editor.setSelectionRange(0, 0)
        },
        a: function(event, can) { can.onkeymap._insert(can)
        },
        A: function(event, can) { can.onkeymap._insert(can)
            can.ui.editor.setSelectionRange(-1, -1)
        },
        o: function(event, can) { can.onkeymap._insert(can)
            can.onaction.selectLine(can, can.onkeymap.insertLine(can, "", can.current.next()))
        },
        O: function(event, can) { can.onkeymap._insert(can)
            can.onaction.selectLine(can, can.onkeymap.insertLine(can, "", can.current.target))
        },

        yy: function(event, can) { can.last = can.current.text() },
        dd: function(event, can) { can.last = can.current.text()
            var next = can.current.next()
            can.onkeymap.deleteLine(can, can.current.target)
            can.onaction.selectLine(can, next)
        },
        p: function(event, can) {
            can.onkeymap.insertLine(can, can.last, can.current.next())
        },
        P: function(event, can) {
            can.onkeymap.insertLine(can, can.last, can.current.target)
        },
    },
    insert: {
        Escape: function(event, can) { can.onkeymap._normal(can)
            can.onaction.modifyLine(can, can.current, can.ui.editor.value)
            event.stopPropagation(), event.preventDefault()
        },
        Enter: function(event, can) {
            var before = can.ui.editor.value.slice(0, event.target.selectionEnd)
            var left = can.ui.editor.value.slice(event.target.selectionEnd)
            can.current.text(before||"")
            can.onaction.selectLine(can, can.onkeymap.insertLine(can, left, can.current.next()))
            can.ui.editor && can.ui.editor.setSelectionRange(0, 0)
        },
        Backspace: function(event, can) {
            if (can.ui.editor.selectionStart > 0) { return }
            event.stopPropagation(), event.preventDefault()
            if (!can.current.prev()) { return }

            var rest = can.current.text()
            can.onaction.selectLine(can, can.current.prev())
            var pos = can.current.text().length

            rest = can.current.text()+rest
            can.ui.editor.value = rest
            can.current.text(rest)
            can.ui.editor.setSelectionRange(pos, pos)

            can.onkeymap.deleteLine(can, can.current.next())
        },
        ArrowDown: function(event, can) {
            can.onaction.selectLine(can, can.current.next())
            can.ui.editor.setSelectionRange(can.ui.editor.selectionStart, can.ui.editor.selectionEnd)
        },
        ArrowUp: function(event, can) {
            can.onaction.selectLine(can, can.current.prev())
            can.ui.editor.setSelectionRange(can.ui.editor.selectionStart, can.ui.editor.selectionEnd)
        },
        jk: function(event, can) {
            can.page.DelText(can.ui.editor, can.ui.editor.selectionStart-1, 1)
            can.onkeymap.insert.Escape(event, can)
        },
    },

    insertLine: function(can, value, before) {
        var line = can.onaction.appendLine(can, value)
        before && can.ui.content.insertBefore(line, before)
        can.onaction.rerankLine(can)
        return line
    },
    deleteLine: function(can, target) {
        can.page.Remove(can, target)
        can.onaction.rerankLine(can)
    },
})

