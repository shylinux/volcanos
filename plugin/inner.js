Volcanos("onimport", {help: "导入数据", _init: function(can, msg, list, cb, target) { target.innerHTML = "";
        can.onappend.table(can, target, "table", msg);

        can.history = []
        can.ui = can.page.Append(can, target, [{view: ["editor", "textarea"], onkeydown: function(event) {
            can.history.push(event.key); if (can.mode == "normal") {
                event.stopPropagation()
                event.preventDefault()
            }

            can.Status("输入值", can.history.join())
            var cb = can.onkeymap[can.mode][event.key]
            if (typeof cb == "function") { can.history = []; return cb(event, can) }

            var map = can.onkeymap[can.mode]._engine
            for (var i = can.history.length-1; i > -1; i--) {
                var pos = map[can.history[i]]
                if (typeof pos == "object") { map = pos; continue }
                if (typeof pos == "function") { pos(event, can); can.history = [] } break
            }
        }, onkeyup: function(event) {

        }, onblur: function(event) {
            can.onaction.modifyLine(can, can.current, can.editor.value)
        }}, {view: "lineno", style: {width: "30px"}}, {view: "content", style: {"margin-left": "30px"}}, ]);

        can.core.List(can.onkeymap.list, function(item) { var engine = {};
            can.core.Item(can.onkeymap[item], function(key, cb) { var map = engine;
                for (var i = key.length-1; i > -1; i--) {
                    map = map[key[i]] = i == 0? cb: (map[key[i]]||{});
                }
            })
            can.onkeymap[item]._engine = engine
        })
        console.log(can.onkeymap)

        can.editor = can.ui.editor, can.max = 0, can.ls = msg.Result().split("\n");
        can.core.List(can.ls, function(item) { can.onaction.appendLine(can, item) });
        can.Timer(100, function() {
            can.onaction.selectLine(can, 0);
            can.onaction.mode(null, can, null, "normal");
            can.Status("文件名", can.Option("path"))
            can.Status("解析器", "go")
        })
        return typeof cb == "function" && cb(msg);
    },
}, ["/plugin/inner.css"])
Volcanos("onsyntax", {help: "语法高亮", list: ["normal", "insert"],
    go: {
        line: function(can, line) {
            var keyword = {
                "package": "keyword",
                "import": "keyword",
                "func": "keyword",
            }
            can.core.List(can.core.Split(line), function(item) { var p = keyword[item];
                if (typeof item == "object") {
                    item.type == "str" && (line = line.replace(item.text, '<span class="string">'+item.text+'</span>'))
                } else {
                    p && (line = line.replace(item, '<span class="'+p+'">'+item+'</span>'))
                }
            })
            return line
        },
    },
})
Volcanos("onkeymap", {help: "键盘交互", list: ["normal", "insert"],
    normal: {
        ":w": function(event, can) {
            can.onaction.remote(event, can, null, "保存")
        },
        h: function(event, can) {
            can.editor.setSelectionRange(can.editor.selectionStart-1, can.editor.selectionStart-1)
        },
        l: function(event, can) {
            can.editor.setSelectionRange(can.editor.selectionStart+1, can.editor.selectionStart+1)
        },
        j: function(event, can) {
            can.onaction.selectLine(can, can.current.nextSibling)
        },
        k: function(event, can) {
            can.onaction.selectLine(can, can.current.previousSibling)
        },

        r: function(event, can) {
            can.run(event)
        },
        i: function(event, can) {
            can.onaction.mode(event, can, null, "insert")
        },
        O: function(event, can) {
            can.onaction.mode(event, can, null, "insert")
            can.onaction.insertLine(can, can.current, "", true).click()
        },
        o: function(event, can) {
            can.onaction.mode(event, can, null, "insert")
            can.onaction.insertLine(can, can.current).click()
        },
        yy: function(event, can) {
            can.last = can.current.innerText
        },
        dd: function(event, can) {
            can.last = can.current.innerText
            var next = can.current.nextSibling || can.current.previousSibling
            can.onaction.deleteLine(can, can.current)
            next.click()
        },
        p: function(event, can) {
            can.onaction.insertLine(can, can.current, can.last).click()
        },
        P: function(event, can) {
            can.onaction.insertLine(can, can.current, can.last, true).click()
        },
    },
    insert: {
        ArrowDown: function(event, can) {
            can.onaction.selectLine(can, can.current.nextSibling)
        },
        ArrowUp: function(event, can) {
            can.onaction.selectLine(can, can.current.previousSibling)
        },
        Escape: function(event, can) {
            can.onaction.modifyLine(can, can.current, can.editor.value)
            can.onaction.mode(event, can, null, "normal")
        },
        Enter: function(event, can) {
            can.onaction.modifyLine(can, can.current, can.editor.value)
            can.onaction.insertLine(can, can.current, "", event.shiftKey).click()
            event.stopPropagation()
            event.preventDefault()
        },
        Backspace: function(event, can) {
            can.editor.selectionStart == 0 && can.onaction.mergeLine(can, can.current.previousSibling).click()
        },
        jk: function(event, can) {
            can.page.DelText(can.editor, can.editor.selectionStart-1, 1)

            can.onaction.modifyLine(can, can.current, can.editor.value)
            can.onaction.mode(event, can, null, "normal")
            event.stopPropagation()
            event.preventDefault()
        },
    },
})
Volcanos("onaction", {help: "控件交互", list: ["保存", "提交", ["mode", "normal", "insert"]],
    modifyLine: function(can, target, value) {
        value = can.onsyntax.go.line(can, value)
        target.innerHTML = value
    },
    deleteLine: function(can, target) {
        can.page.Remove(can, target)

        var ls = can.page.Select(can, can.ui.lineno, "div.item")
        can.page.Remove(can, ls[ls.length-1])
        // can.max--
    },
    selectLine: function(can, target) { if (!target) { return }
        can.page.Select(can, can.ui.content, "pre.item", function(item, index) {
            if (item != target && index != target) { return }
            target = item, can.Status("当前行", can.onexport.position(can, index)), can.page.Select(can, can.ui.lineno, "div.item", function(item, i) {
                can.page.ClassList.del(can, item, "select")
                index == i && can.page.ClassList.add(can, item, "select")
            })
        })

        can.current = target, can.page.Modify(can, can.editor, {value: can.current.innerText, style: {
            height: target.offsetHeight+"px", width: target.offsetWidth+"px",
            top: (target.offsetTop-can._output.offsetTop)+"px",
        }}), can.editor.focus();
    },
    appendLine: function(can, value) { var index = can.max++;
        can.page.Append(can, can.ui.lineno, [{view: ["item", "div", index+1], onclick: function(event) {
            can.onaction.selectLine(can, index)
        }}])
        value = can.onsyntax.go.line(can, value)
        return can.page.Append(can, can.ui.content, [{view: ["item", "pre", value||""], onclick: function(event) {
            can.onaction.selectLine(can, event.target)
        }}]).last
    },
    insertLine: function(can, target, value, before) {
        var line = can.onaction.appendLine(can, value)
        can.ui.content.insertBefore(line, before && target || target.nextSibling)
        return line
    },
    mergeLine: function(can, target) { if (!target) {return}
        can.onaction.modifyLine(can, target, target.innerHTML + target.nextSibling.innerHTML);
        can.onaction.deleteLine(can, target.nextSibling);
        return target
    },

    remote: function(event, can, msg, key) {
        msg = can.request(event), msg.Option("content", can.onexport.content(can))
        can.run(event, ["action", key, can.Option("path")], function(res) {
        }, true)
    },

    mode: function(event, can, msg, value) {
        can.Action("mode", can.mode = value)
        can.Status("输入法", can.mode)
        return value
    },
    "保存": function(event, can, msg) {
        can.onaction.remote(event, can, msg, "保存")
    },
    "提交": function(event, can, msg) {
        can.onaction.remote(event, can, msg, "提交")
    },
})
Volcanos("ondetail", {help: "菜单交互", list: ["删除行", "合并行", "插入行", "添加行", "追加行"],
    "删除行": function(event, can, msg) {
        can.onaction.delteLine(can, can.current)
    },
    "合并行": function(event, can, msg) {
        can.onaction.mergeLine(can, can.current)
    },
    "插入行": function(event, can, msg) {
        can.onaction.insertLine(can, can.current, "", true)
    },
    "添加行": function(event, can, msg) {
        can.onaction.insertLine(can, can.current)
    },
    "追加行": function(event, can, msg) {
        can.onaction.appendLine(can)
    },
})
Volcanos("onexport", {help: "导出数据", list: ["输入法", "输入值", "文件名", "解析器", "当前行"],
    content: function(can) {
        return can.page.Select(can, can._output, "div.content>pre.item", function(item) {
            return can.current == item? can.editor.value: item.innerText
        }).join("\n")
    },
    position: function(can, index) {
        return parseInt((index+1)*100/can.max)+"%"+" = "+(index+1)+"/"+can.max
    },
})
