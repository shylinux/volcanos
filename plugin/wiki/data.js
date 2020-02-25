Volcanos("onimport", {help: "导入数据", list: [],
    init: function(can, msg, cb, output, action, option) {output.innerHTML = "";
        can.table = can.page.AppendTable(can, output, msg, msg.append, function(event, value, key, index, tr, td) {
            can.Export(event, value, key)
        }, function(event, value, key, index, tr, td) {
            can.user.carte(event, shy("上下文菜单", can.ondetail, can.ondetail.list, function(event, cmd, meta) {var cb = meta[cmd];
                var sub = can.Event(event);
                msg.append.forEach(function(key) {sub.Option(key, msg[key][index].trim())})

                typeof cb == "function"? cb(event, can, msg, index, key, cmd, td, tr):
                    (cb = can.onchoice[cmd], typeof cb == "function")? cb(event, can, msg, index, key, cmd, td, tr):
                    (cb = can.onaction[cmd], typeof cb == "function")? cb(event, can, msg, index, key, cmd, td, tr):
                    can.run(event, ["action", typeof cb == "string"? cb: cmd, key, value.trim(), msg.Ids(index)], function(msg) {
                        can.user.toast(msg.Result())
                    }, true)
            }))
        });
    },
})
Volcanos("onfigure", {help: "组件菜单", list: ["保存", "求和"],
    "求和": function(event, can, res, td, index) {
        res[index] = parseInt(td.innerText) + (res[index]||0);
    },
    "最大": function(event, can, res, td, index) {
        var n = parseInt(td.innerText);
        n > (res[index]||-10000) && (res[index] = n);
    },
    "最小": function(event, can, res, td, index) {
        var n = parseInt(td.innerText);
        n < (res[index]||10000) && (res[index] = n);
    },
    "平均": function(event, can, res, td, ncol, cols, rows, nrow) {
        res[ncol] = parseInt(td.innerText) + (res[ncol]||0);
        if (nrow == rows.length - 1) {
            res[ncol] = res[ncol] / nrow
        }
    },
})
Volcanos("onaction", {help: "组件菜单", list: ["保存", ["mode", "正常", "块选", "反选", "多选", "拖动", "编辑"], "求和", "最大", "最小", "平均"],
    "正常": function(event, can, msg, cmd, target) {
        cmd && can.Action("mode", cmd)
        can.page.Select(can, can.table, "tr", function(item) {
            item.setAttribute("contenteditable", false)
            item.setAttribute("draggable", false)
            item.onmouseenter = null
            item.onclick = null
        })
    },
    "块选": function(event, can, msg, cmd, target) {
        cmd && can.Action("mode", cmd)
        can.page.Select(can, can.table, "tr", function(item) {
            item.onmouseenter = function() {
                can.page.ClassList.add(can, item, "select")
            }
        })
    },
    "反选": function(event, can, msg, cmd, target) {
        cmd && can.Action("mode", cmd)
        can.page.Select(can, can.table, "tr", function(item) {
            item.onmouseenter = function() {
                can.page.ClassList.del(can, item, "select")
            }
        })
    },
    "多选": function(event, can, msg, cmd, target) {
        cmd && can.Action("mode", cmd)
        can.page.Select(can, can.table, "tr", function(item) {
            item.onclick = function() {
                can.page.ClassList.neg(can, item, "select")
            }
        })
    },
    "拖动": function(event, can, msg, cmd, target) {
        can.onaction["正常"](event, can, msg, cmd, target)
        can.page.Select(can, can.table, "tr", function(item) {
            item.setAttribute("draggable", true)
            item.ondragstart = function(event) {can.drag = item}
            item.ondragover = function(event) {
                event.preventDefault(),
                    can.page.ClassList.add(can, item, "over")}
            item.ondragleave = function(event) {
                    can.page.ClassList.del(can, item, "over")
            }
            item.ondrop = function(event) {event.preventDefault()
                can.table.insertBefore(can.drag, item)
            }
        })
    },
    "编辑": function(event, can, msg, cmd, target) {
        cmd && can.Action("mode", cmd)
        can.page.Select(can, can.table, "tr", function(item) {
            item.setAttribute("contenteditable", true)
        })
    },
    "保存": function(event, can, msg, cmd, target) {
        can.run(event, ["action", cmd, can.Option("path"), can.page.Select(can, target, "tr", function(tr) {
            return can.page.Select(can, tr, "th,td", function(td) {return td.innerHTML}).join(",")
        }).join("\n")], function() {
            can.user.toast("保存成功")
        }, true)
    },

    show: function(event, can, msg, cmd, target) {
        var res = {};
        var method = can.onfigure[cmd];
        var mul = "tr" + (can.Action("mode") == "正常"? "": ".select");


        can.page.Select(can, can.table, mul, function(tr, nrow, rows) {
            (mul != "tr" || nrow > 0) && can.page.Select(can, tr, "td", function(td, ncol, cols) {
                method && method(event, can, res, td, ncol, cols, rows, nrow)
            })
        });
        can.page.Append(can, can.target, [{type: "table", list: [{type: "tr", list: can.core.Item(res, function(key, value) {
            return {text: [value, "td"]}
        }).concat([{text: [cmd, "td"]}])}]}]);
    },
    "求和": function(event, can, msg, cmd, target) {
        can.onaction.show(event, can, msg, cmd, target)
    },
    "最大": function(event, can, msg, cmd, target) {
        can.onaction.show(event, can, msg, cmd, target)
    },
    "最小": function(event, can, msg, cmd, target) {
        can.onaction.show(event, can, msg, cmd, target)
    },
    "平均": function(event, can, msg, cmd, target) {
        can.onaction.show(event, can, msg, cmd, target)
    },
})
Volcanos("onchoice", {help: "组件交互", list: ["保存", "块选", "反选", "求和"]})
Volcanos("ondetail", {help: "组件详情", list: ["复制", "块选", "反选", "编辑", "删除"],
    "复制": function(event, can, msg, index, key, cmd, td, tr) {
        var end = can.page.Append(can, can.table, [{type: "tr", list: can.page.Select(can, tr, "td", function(item) {
            return {text: [item.innerHTML, "td"]}
        })}]).tr
        can.table.insertBefore(end, tr)
    },
    "删除": function(event, can, msg, index, key, cmd, td, tr) {
        can.page.Remove(can, tr)
    },
})
Volcanos("onstatus", {help: "组件状态", list: []})
Volcanos("onexport", {help: "导出数据", list: []})

