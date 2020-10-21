Volcanos("onimport", {help: "导入数据", list: [], _merge: function(can, sub) {
        can.onimport.inner_init = sub._init
    }, _init: function(can, msg, list, cb, target) {
        can.require(["/plugin/local/code/inner.js"], function(can) {
            can.onimport.inner_init(can, msg, list, function() {
                var ui = can.page.Append(can, can.ui.profile, [
                    {view: ["editor", "input"], onkeydown: function(event) {
                        can.onkeymap.parse(event, can, "insert")
                        can.Timer(1, function() {
                            can.current.text(can.ui.editor.value)
                        })
                    }, onfocus: function(event) {
                        can.current.scroll(-1000, 0)
                    }, onblur: function(event) {
                        can.current.text(can.ui.editor.value)
                    }, onclick: function(event) {
                        can.onkeymap._insert(can)
                    }},
                    {view: ["command", "input"], onkeydown: function(event) {
                        can.onkeymap.parse(event, can, "command")
                    }},
                ]); can.core.Copy(can.ui, ui, "editor", "command")

                var ui = can.page.Append(can, target, [
                    {view: "display", style: {display: "none"}, list: [
                        {view: "action", list: [
                            {input: ["cmd", function(event) {
                                can.onkeymap.parse(event, can, "command")
                            }], value: "", onfocus: function(event) {
                                event.target.setSelectionRange(0, -1)
                            }},
                            {button: ["执行", function(event) {
                                can.onkeymap.command.Enter(event, can, can.ui.cmd.value)
                            }]},
                            {button: ["关闭", function(event) {
                                can.page.Modify(can, can.ui.display, {style: {display: "none"}})
                            } ]},
                        ]},
                        {view: "output", style: {"max-height": 160}},
                    ]},
                ]); can.core.Copy(can.ui, ui, "display", "output", "cmd")

                typeof cb == "function" && cb()
                can.keylist = [], can.onkeymap._init(can, "insert")
            }, target)
        })
    },
}, ["/plugin/local/code/vimer.css"])
Volcanos("onaction", {help: "控件交互", list: [],
    save: function(event, can) {
        var msg = can.request(event); msg.Option("content", can.onexport.content(can))
        can.run(event, ["action", "save", can.parse, can.Option("file"), can.Option("path")], function(msg) {
            can.user.toast(can, "保存成功")
        }, true)
    },
    display: function(event, can) {
        can.page.Toggle(can, can.ui.display, function() {
            // can.onimport.project(can, can.Option("path"))
        })
    },
})
Volcanos("onkeymap", {help: "键盘交互", list: ["command", "normal", "insert"], _init: function(can, mode) {
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
        if (can.ui.display.style.display == "none") {
            can.page.Modify(can, can.ui.command, {style: {
                display: "", position: "absolute", top: can.current.offset()+can.current.window()-can.current.height(),
            }})
            can.ui.command.focus()
        } else {
            can.ui.cmd.focus()
        }
    },
    _normal: function(can) { can.onkeymap._mode(can, "normal")
        can.ui.editor.focus()
    },
    _insert: function(can) { can.onkeymap._mode(can, "insert")
        can.ui.editor.focus()
    },

    _remote: function(event, can, key, arg, cb) {
        var toast = can.user.toast(can, "执行中...", key, 1000000)
        var msg = can.request(event); msg.Option("content", can.onexport.content(can))
        can.run(event, arg||["action", key, can.parse, can.Option("file"), can.Option("path")], cb||function(msg) {
            toast.Close()

            can.ui.output.innerHTML = ""
            can.onappend.table(can, msg, can.ui.output, "table", function(value, key, index) {
                return {text: [value, "td"]}
            })
            can.onappend.board(can, msg, can.ui.output, "board")
        }, true)
    },
    _engine: {
        e: function(event, can, line, ls) { can.onimport.tabview(can, can.Option("path"), ls[1]) },
        p: function(event, can) { can.onaction.project(event, can) },
        q: function(event, can) { can.onaction.display(event, can) },
        w: function(event, can) { can.onaction.save(event, can) },
    },

    parse: function(event, can, mode) {
        event.key.length == 1 && can.keylist.push(event.key); if (can.mode != mode) {
            event.stopPropagation(), event.preventDefault()
        }; can.mode != "command" && can.Status("按键", can.keylist.join(""))

        for (var pre = 0; pre < can.keylist.length; pre++) {
            if ("0" <= can.keylist[pre] && can.keylist[pre] <= "9") { continue } break
        }; can.count = parseInt(can.keylist.slice(0, pre).join(""))||1

        function repeat(cb, count) {
            for (var i = 1; i <= count; i++) { if (cb(event, can, count)) { break } }
            can.keylist.length > 0 && (can.lastcmd = can.keylist), can.keylist = []
            can.Status("按键", can.keylist.join(""))
        }

        var p = can.onsyntax[can.parse]
        var cb = (p && p.keymap || can.onkeymap[can.mode])[event.key]; if (typeof cb == "function") {
            return repeat(cb, can.count)
        }

        var map = can.onkeymap[can.mode]._engine; for (var i = can.keylist.length-1; i > pre-1; i--) {
            var cb = map[can.keylist[i]]; if (typeof cb == "function") {
                return repeat(cb, can.count)
            }; if (typeof cb == "object") { map = cb; continue }; break
        }
    },
    command: {
        Escape: function(event, can) {
            can.page.Modify(can, can.ui.command, {style: {display: "none"}, value: ""})
            can.onkeymap._normal(can)
        },
        Enter: function(event, can) { var line = can.ui.command.value || can.ui.cmd.value ; var ls = can.core.Split(line, " ", ",", {simple: true})
            var cb = can.onkeymap._engine[ls[0]]; typeof cb == "function"? cb(event, can, line, ls):
                can.onkeymap._remote(event, can, line, ["action", "command"].concat(ls))

            can.page.Modify(can, can.ui.command, {style: {display: "none"}, value: ""})
            can.page.Modify(can, can.ui.display, {style: {display: ""}})
            can.ui.cmd.value = line, can.ui.cmd.focus()
            can.ui.cmd.setSelectionRange(0, -1)
            can.ui.output.innerHTML = ""
        },
        jk: function(event, can) { can.keylist = can.keylist.slice(0, -1)
            can.onkeymap.command.Enter(event, can)
        },
    },
    normal: {
        ":": function(event, can) {
            can.ui.command.value = ""
            can.onkeymap._command(can)
        },
        ".": function(event, can) {
            can.keylist = can.lastcmd
            can.onkeymap.parse({key: ""}, can, "normal")
        },

        H: function(event, can) {
            can.ui.editor.setSelectionRange(0, 0)
        },
        h: function(event, can) {
            can.ui.editor.setSelectionRange(can.ui.editor.selectionStart-1, can.ui.editor.selectionStart-1)
        },
        l: function(event, can) {
            can.ui.editor.setSelectionRange(can.ui.editor.selectionStart+1, can.ui.editor.selectionStart+1)
        },
        L: function(event, can) {
            can.ui.editor.setSelectionRange(-1, -1)
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

    selectLine: function(can, line, item) {
        can.page.Modify(can, can.ui.editor, {className: "editor "+can.mode, value: item.innerText, style: {
            height: item.offsetHeight, width: item.offsetWidth,
            left: item.offsetLeft, top: item.offsetTop,
        }})
        can.page.Modify(can, can.ui.command, {className: "command "+can.mode, value: item.innerText, style: {
            height: item.offsetHeight, width: item.offsetWidth,
            left: item.offsetLeft, top: item.offsetTop + can.ui.profile.offsetHeight-100,
        }})
    },
    insertLine: function(can, value, before) {
        var line = can.onaction.appendLine(can, value)
        before && can.ui.content.insertBefore(line, before)
        can.onaction.rerankLine(can)
        return line
    },
    deleteLine: function(can, line) {
        can.page.Remove(can, line)
        can.onaction.rerankLine(can)
    },
})
Volcanos("onexport", {help: "导出数据", list: ["模式", "按键", "解析器", "文件名", "当前行", "跳转数", "标签数"],
})
