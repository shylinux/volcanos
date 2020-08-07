Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.require(["/plugin/local/code/inner.js"], function(can) {
            can.onimport._init(can, msg, list, function() {
                // can.page.Modify(can, can._option, {style: {display: "none"}})
                var ui = can.page.Append(can, can._target, [
                    {view: ["editor", "input"], "rows": "1", onkeydown: function(event) {
                        can.onkeymap.parse(event, can, "insert"), can.Timer(10, function() {
                            can.onaction.modifyLine(can, can.current, can.editor.value)
                        })
                    }, onblur: function(event) {
                        can.onaction.modifyLine(can, can.current, can.editor.value)
                    }, onclick: function(event) {

                    }, ondblclick: function(event) {
                        can.onkeymap._mode(can, "insert")
                    }},
                    {view: ["command", "input"], onkeydown: function(event) {
                        can.onkeymap.parse(event, can, "command")
                    }},
                ])
                can.ui.editor = ui.editor
                can.ui.command = ui.command
                can.onkeymap._init(can, "normal")
                typeof cb == "function" && cb()
            }, target)
        })
    },
}, ["/plugin/local/code/vimer.css"])
Volcanos("onkeymap", {help: "键盘交互", list: ["command", "normal", "insert"], _init: function(can, mode) {
        can.page.Modify(can, can.ui.command, {style: {display: "none", width: can._target.offsetWidth-20+"px"}})

        can.history = [], can.editor = can.ui.editor
        can.core.List(can.onkeymap.list, function(item) { var engine = {}
            can.core.Item(can.onkeymap[item], function(key, cb) { var map = engine
                for (var i = key.length-1; i > -1; i--) {
                    map = map[key[i]] = i == 0? cb: (map[key[i]]||{})
                }
            }), can.onkeymap[item]._engine = engine
        }), can.onkeymap._mode(can, mode||"normal")
    },
    _mode: function(can, value) { can.Status("输入法", can.mode = value)
        can.page.Modify(can, can.ui.editor, {className: "editor "+can.mode, style: {display: "none"}})
        can.page.Modify(can, can.ui.command, {className: "command "+can.mode, style: {display: "none"}})
        return value
    },
    _command: function(can) { can.onkeymap._mode(can, "command")
        can.page.Modify(can, can.ui.command, {value: "", style: {display: "block"}})
        can.ui.command.focus()
    },
    _normal: function(can) { can.onkeymap._mode(can, "normal")
        can.page.Modify(can, can.ui.editor, {style: {display: "block"}})
        can.ui.editor.focus()
    },
    _insert: function(can) { can.onkeymap._mode(can, "insert")
        can.page.Modify(can, can.ui.editor, {style: {display: "block"}})
        can.ui.editor.focus()
    },

    _remote: function(event, can, key, arg, cb) {
        can.page.Modify(can, can.ui.display, {innerHTML: "", style: {display: "none"}})
        var msg = can.request(event); msg.Option("content", can.onexport.content(can))
        can.run(event, arg||["action", key, can.Option("path"), can.Option("file")], cb||function(msg) {
            (msg.Result() || msg.append && msg.append.length > 0) && can.page.Modify(can, can.ui.display, {innerHTML: "", style: {display: "block"}})
            can.onappend.table(can, can.ui.display, "table", msg)
            can.onappend.board(can, can.ui.display, "board", msg)
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
        }; can.mode != "command" && can.Status("输入值", can.history.join())

        for (var pre = 0; pre < can.history.length; pre++) {
            if ("0" <= can.history[pre] && can.history[pre] <= "9") { continue } break
        }; can.count = parseInt(can.history.slice(0, pre).join(""))||1

        function repeat(cb, count) {
            for (var i = 1; i <= count; i++) { if (cb(event, can, count)) { break } }; can.history = []
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
        Escape: function(event, can) { can.onkeymap._normal(can)
            can.current.click()
        },
        Enter: function(event, can) { var line = can.ui.command.value; var ls = can.core.Split(line, " ", ",", {simple: true})
            var cb = can.onkeymap._engine[ls[0]]; typeof cb == "function"? cb(event, can, line, ls):
                can.onkeymap._remote(event, can, line, ["action", "cmd"].concat(ls))
            can.onkeymap.command.Escape(event, can)
        },
        jk: function(event, can) { can.history = can.history.slice(0, -1)
            can.onkeymap.command.Enter(event, can)
        },
    },
    normal: {
        ":": function(event, can) { can.onkeymap._command(can) },

        h: function(event, can) {
            can.editor.setSelectionRange(can.editor.selectionStart-1, can.editor.selectionStart-1)
        },
        l: function(event, can) {
            can.editor.setSelectionRange(can.editor.selectionStart+1, can.editor.selectionStart+1)
        },
        j: function(event, can) { can.onaction.selectLine(can, can.current.nextSibling)
            var pos = can.current.offsetTop-can._target.scrollTop; if (pos > 22*15) {
                can._target.scrollBy(0, 22)
            }
        },
        k: function(event, can) { can.onaction.selectLine(can, can.current.previousSibling)
            var pos = can.current.offsetTop-can._target.scrollTop; if (pos < 22*5) {
                can._target.scrollBy(0, -22)
            }
        },

        gg: function(event, can, count) { count = count || 1
            can.onaction.selectLine(can, count - 1)
            can.current.scrollIntoView()
            can._target.scrollBy(0, -22*5)
            return true
        },
        G: function(event, can, count) { count = count || can.max
            can.onaction.selectLine(can, count - 1)
            can.current.scrollIntoView()
            if (count - can.max < -5) {
                can._target.scrollBy(0, -22*5)
            }
            return true
        },
        zt: function(event, can, count) { count = count || 2
            can.current.scrollIntoView()
            can._target.scrollBy(0, -22*count)
            return true
        },
        zz: function(event, can, count) { count = count || 5
            can.current.scrollIntoView()
            can._target.scrollBy(0, -22*count)
            return true
        },
        zb: function(event, can, count) { count = count || 3
            can._target.scrollBy(0, -(can._target.offsetHeight - (can.current.offsetTop - can._target.scrollTop))+22*count)
            return true
        },

        i: function(event, can) { can.onkeymap._insert(can)
        },
        I: function(event, can) { can.onkeymap._insert(can)
            can.editor.setSelectionRange(0, 0)
        },
        a: function(event, can) { can.onkeymap._insert(can)
        },
        A: function(event, can) { can.onkeymap._insert(can)
            can.editor.setSelectionRange(-1, -1)
        },
        o: function(event, can) { can.onkeymap._insert(can)
            can.onkeymap.insertLine(can, can.current).click()
        },
        O: function(event, can) { can.onkeymap._insert(can)
            can.onkeymap.insertLine(can, can.current, "", true).click()
        },

        yy: function(event, can) { can.last = can.current.innerText },
        dd: function(event, can) { can.last = can.current.innerText
            var next = can.current.nextSibling || can.current.previousSibling
            can.onkeymap.deleteLine(can, can.current)
            next.click()
        },
        p: function(event, can) {
            can.onkeymap.insertLine(can, can.current, can.last).click()
        },
        P: function(event, can) {
            can.onkeymap.insertLine(can, can.current, can.last, true).click()
        },
    },
    insert: {
        Escape: function(event, can) { can.onkeymap._normal(can)
            can.onaction.modifyLine(can, can.current, can.editor.value)
            event.stopPropagation(), event.preventDefault()
        },
        Enter: function(event, can) {
            can.onkeymap.insert.Escape(event, can)
            can.onkeymap.insertLine(can, can.current, "", event.shiftKey).click()
            can.onkeymap._insert(can)
        },
        Backspace: function(event, can) { if (can.editor.selectionStart > 0) { return }
            can.onkeymap.mergeLine(can, can.current.previousSibling).click()
            event.stopPropagation(), event.preventDefault()
        },
        ArrowDown: function(event, can) {
            can.onaction.selectLine(can, can.current.nextSibling)
        },
        ArrowUp: function(event, can) {
            can.onaction.selectLine(can, can.current.previousSibling)
        },
        jk: function(event, can) {
            can.page.DelText(can.editor, can.editor.selectionStart-1, 1)
            can.onkeymap.insert.Escape(event, can)
        },
    },

    insertLine: function(can, target, value, before) { var line = can.onaction.appendLine(can, value)
        can.ui.content.insertBefore(line, before && target || target.nextSibling)
        return line
    },
    deleteLine: function(can, target) { can.page.Remove(can, target)
        var ls = can.page.Select(can, can.ui.preview, "div.item")
        can.page.Remove(can, ls[ls.length-1]), can.max--
    },
    mergeLine: function(can, target) { if (!target) {return}
        can.onaction.modifyLine(can, target, target.innerHTML + target.nextSibling.innerHTML)
        can.onkeymap.deleteLine(can, target.nextSibling)
        return target
    },
})
