Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, cb, target) {
        can.require(["inner.js"], function(can) { can.onimport.inner_init(can, msg, function() {
            can.onkeymap._build(can), can.onimport._input(can), can.onkeymap._command(can), can.base.isFunc(cb) && cb(msg)
        }, target) }, function(can, name, sub) {
            name == chat.ONIMPORT && (can.onimport.inner_init = sub._init)
            name == chat.ONKEYMAP && (can.base.Copy(can.onkeymap._mode, sub._mode))
        })
    },
    _input: function(can) {
        can.ui.current = can.page.Append(can, can.ui.content.parentNode, [
            {view: ["current", html.INPUT], onkeydown: function(event) { if (event.metaKey) { return }
                can._keylist = can.onkeymap._parse(event, can, can.mode, can._keylist, can.ui.current)
                can.mode == "insert" && can.core.Timer(10, function() { can.current.text(can.ui.current.value) })
                can.mode == "normal" && can.Status("按键", can._keylist.join(""))
                can.mode == "normal" && can.onkeymap.prevent(event)
            }, onclick: function(event) { can.onkeymap._insert(event, can) }},
        ]).first
    },
}, [""])
Volcanos("onkeymap", {help: "键盘交互", list: [],
    _model: function(can, value) { can.Status("模式", can.mode = value)
        can.current && (can.ui.current.value = can.current.text())
        return can.page.Modify(can, can.ui.current, {className: "current"+ice.SP+can.mode}), value
    },
    _command: function(can) { can.onkeymap._model(can, "command")
        can.ui.current.blur()
    },
    _normal: function(can) { can.onkeymap._model(can, "normal")
        can.ui.current.focus(), can.ui.content.scrollLeft -= 10000
    },
    _insert: function(event, can) { can.onkeymap._model(can, "insert")
        can.ui.current.focus(), can.ui.content.scrollLeft -= 10000
        can.onkeymap.prevent(event)
    },

    _mode: {
        normal: {
            escape: function(event, can) { can.onkeymap._command(can) },

            H: function(event, can, target) { can.onaction.cursorMove(can, target, 0, 0) },
            h: function(event, can, target) { can.onaction.cursorMove(can, target, -1) },
            l: function(event, can, target) { can.onaction.cursorMove(can, target, 1) },
            L: function(event, can, target) { can.onaction.cursorMove(can, target, 0, -1) },
            j: function(event, can) { can.onaction.selectLine(event, can, can.current.next()) },
            k: function(event, can) { can.onaction.selectLine(event, can, can.current.prev()) },

            gg: function(event, can, target, count) { return can.onaction.selectLine(event, can, count||1), true },
            G: function(event, can, target, count) { return can.onaction.selectLine(event, can, count = count>1? count: can.max), true },

            zt: function(event, can, target, count) { 
                return can.current.scroll(can.current.scroll()-(count>1? count: 3)), true
            },
            zz: function(event, can, target, count) {
                return can.current.scroll(can.current.scroll()-(count = count>1? count: can.current.window()/2)), true
            },
            zb: function(event, can, target, count) {
                return can.current.scroll(can.current.scroll()-can.current.window()+(count>1? count: 5)), true
            },

            i: function(event, can) { can.onkeymap._insert(event, can) },
            I: function(event, can, target) { can.onkeymap._insert(event, can)
                can.onaction.cursorMove(can, target, 0, 0)
            },
            a: function(event, can, target) { can.onkeymap._insert(event, can)
                can.onaction.cursorMove(can, target, 1)
            },
            A: function(event, can, target) { can.onkeymap._insert(event, can)
                can.onaction.cursorMove(can, target, 0, -1)
            },
            o: function(event, can) { can.onkeymap._insert(event, can)
                can.onaction.selectLine(event, can, can.onaction.insertLine(can, "", can.current.next()))
            },
            O: function(event, can) { can.onkeymap._insert(event, can)
                can.onaction.selectLine(event, can, can.onaction.insertLine(can, "", can.current.line))
            },

            yy: function(event, can) { can._last_text = can.current.text() },
            dd: function(event, can) { can._last_text = can.current.text()
                var next = can.current.next(); can.onaction.deleteLine(can, can.current.line)
                can.onaction.selectLine(event, can, next)
            },
            p: function(event, can) { can.onaction.insertLine(can, can._last_text, can.current.next()) },
            P: function(event, can) { can.onaction.insertLine(can, can._last_text, can.current.line) },
        },
        insert: {
            jk: function(event, can, target) { can.onkeymap._normal(can),
                can.onkeymap.DelText(target, target.selectionStart-1, 1)
                can.current.text(can.ui.current.value)
            },
            Escape: function(event, can) { can.onkeymap._normal(can) },
            Enter: function(event, can, target) {
                can.onaction.selectLine(event, can, can.onaction.insertLine(can, can.onkeymap.DelText(target, target.selectionEnd), can.current.next()))
            },
            Backspace: function(event, can, target) {
                if (target.selectionStart > 0) { return }
                if (!can.current.prev()) { return }
                can.onkeymap.prevent(event)

                var rest = can.current.text()
                can.onaction.selectLine(event, can, can.current.prev())
                can.onaction.deleteLine(can, can.current.next())
                var pos = can.current.text().length

                can.ui.current.value = can.current.text()+rest
                can.onaction.cursorMove(can, can.ui.current, 0, pos)
            },
            ArrowDown: function(event, can) { can.onaction.selectLine(event, can, can.current.next()) },
            ArrowUp: function(event, can) { can.onaction.selectLine(event, can, can.current.prev()) },
        },
    }, _engine: {},
})
Volcanos("onaction", {help: "控件交互", list: [nfs.SAVE],
    save: function(event, can) { var msg = can.request(event, {content: can.onexport.content(can)})
        can.run(event, [ctx.ACTION, nfs.SAVE, can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
            can.user.toastSuccess(can)
        }, true)
    },

    _selectLine: function(event, can) {
        can.page.Select(can, can.current.line, "td.text", function(td) { can.current.line.appendChild(can.ui.current)
            can.page.Modify(can, can.ui.current, {style: kit.Dict(html.LEFT, td.offsetLeft-1, html.WIDTH,td.offsetWidth-12), value: td.innerText})
            if (event) { if (can.mode == "command") { can.onkeymap._insert(event, can) }
                can.ui.current.focus(), can.onaction.cursorMove(can, can.ui.current, 0, (event.offsetX)/13-1)
                can.ui.content.scrollLeft -= td.offsetLeft
            }
        })
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
    modifyLine: function(can, line, value) {
        can.page.Select(can, can.ui.content, html.TR, function(item, index) {
            if (item != line && index+1 != line) { return }
            can.page.Select(can, item, "td.text", function(item) {
                can.page.Appends(can, item, [can.onsyntax._parse(can, value)])
            })
        })
    },
    rerankLine: function(can, value) { can.max = 0
        can.page.Select(can, can.ui.content, html.TR, function(item, index) {
            can.max++, can.page.Select(can, item, "td.line", function(item) {
                item.innerText = index+1
            })
        })
    },
    cursorMove: function(can, target, count, begin) {
        begin != undefined && target.setSelectionRange(begin, begin)
        target.setSelectionRange(target.selectionStart+count, target.selectionStart+count)
    },
})
Volcanos("onexport", {help: "导出数据", list: ["文件数", "模式", "按键", "解析器", "文件名", "当前行", "跳转数"]})

