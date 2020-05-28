Volcanos("onimport", {help: "导入数据", _init: function(can, msg, list, cb, target) { target.innerHTML = "";
        can.onappend.table(can, target, "table", msg);

        can.ui = can.page.Append(can, target, [{view: ["editor", "textarea"], onkeydown: function(event) {
            (can.onkeymap[can.mode][event.key]||function() {})(event, can)
        }, onkeyup: function(event) {

        }, onblur: function(event) {
            can.onaction.modifyLine(can, can.current, can.editor.value)
        }}, {view: "lineno", style: {width: "30px"}}, {view: "content", style: {"margin-left": "30px"}}, ]);

        can.max = 0, can.ls = msg.Result().split("\n");
        can.editor = can.ui.editor, can.mode = "modify";
        can.core.List(can.ls, function(item) { can.onaction.appendLine(can, item) });
        return typeof cb == "function" && cb(msg);
    },
}, ["/plugin/inner.css"])
Volcanos("onkeymap", {help: "键盘交互", list: ["modify", "normal"],
    modify: {
        ArrowDown: function(event, can) {
            can.onaction.selectLine(can, can.current.nextSibling)
        },
        ArrowUp: function(event, can) {
            can.onaction.selectLine(can, can.current.previousSibling)
        },
        Enter: function(event, can) {
            can.onaction.modifyLine(can, can.current, can.editor.value)
            can.onaction.insertLine(can, can.current, event.shiftKey).click()
            event.stopPropagation()
            event.preventDefault()
        },
        Backspace: function(event, can) {
            can.editor.selectionStart == 0 && can.onaction.mergeLine(can, can.current.previousSibling).click()
        },
    },
})
Volcanos("onaction", {help: "控件交互", list: ["保存", "提交"],
    modifyLine: function(can, target, value) {
        target.innerHTML = value
    },
    deleteLine: function(can, target) {
        can.page.Remove(can, target)
    },
    selectLine: function(can, target) {
        can.page.Select(can, can.ui.content, "pre.item", function(item, index) {
            if (item != target && index != target) { return }
            can.Status("当前行", index+1) && can.page.Select(can, can.ui.lineno, "div.item", function(item, i) {
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
        can.page.Append(can, can.ui.lineno, [{view: ["item", "div", can.Status("总行数", index+1)], onclick: function(event) {
            can.onaction.selectLine(can, index)
        }}])
        return can.page.Append(can, can.ui.content, [{view: ["item", "pre", value||""], onclick: function(event) {
            can.onaction.selectLine(can, event.target)
        }}]).last
    },
    insertLine: function(can, target, before) {
        var line = can.onaction.appendLine(can)
        can.ui.content.insertBefore(line, before && target || target.nextSibling)
        return line
    },
    mergeLine: function(can, target) {
        can.ondetail.modifyLine(can, target, target.innerHTML + target.nextSibling.innerHTML);
        can.ondetail.deleteLine(can, target.nextSibling);
        return target
    },

    remote: function(event, can, msg, key) {
        msg = can.request(event), msg.Option("content", can.onexport.content(can))
        can.run(event, ["action", key, can.Option("path")], function(res) {
        }, true)
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
        can.onaction.insertLine(can, can.current, true)
    },
    "添加行": function(event, can, msg) {
        can.onaction.insertLine(can, can.current, false)
    },
    "追加行": function(event, can, msg) {
        can.onaction.appendLine(can)
    },
})
Volcanos("onexport", {help: "导出数据", list: ["当前行", "总行数"],
    content: function(can) {
        return can.page.Select(can, can._output, "div.content>pre.item", function(item) {
            return can.current == item? can.editor.value: item.innerText
        }).join("\n")
    },
})
