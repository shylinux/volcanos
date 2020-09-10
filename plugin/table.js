Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        if (can.onimport._process(can, msg)) {
            return typeof cb == "function" && cb(msg)
        }

        can.ui = can.page.Appends(can, target, [
            {view: ["content", "div"]}, {view: ["display", "pre"]},
        ])
        can.onappend.table(can, can.ui.content, "table", msg, function(value, key, index, line, array) {
            return can.onimport._table(can, value, key, index, line, array)
        })

        can.onappend.board(can, can.ui.display, "board", msg)
        can.onimport._board(can, msg)
        return typeof cb == "function" && cb(msg)
    },
    _process: function(can, msg) {
        var process = msg.Option("_process") || can.Conf("feature")["_process"] 
        var cb = can.onaction[process]; typeof cb == "function" && cb(can, msg)
        return
        if (can.onimport._progress(can, msg)) {
            return true
        }; can.onimport._refresh(can, msg)
    },
    _progress: function(can, msg) {
        return
        var progress = msg.Option("_progress") || can.Conf("feature")["_progress"] 
        if (progress) {
            can.page.Select(can, can._output, "td", function(td) {
                if (td.innerText == msg.Option("name")) {
                    can.page.Modify(can, td, {style: {"background-color": "green"}})
                }
            })
            return true
        }
    },
    _refresh: function(can, msg) {
        var refresh = msg.Option("_refresh") || can.Conf("feature")["_refresh"] 
        can.Timer({interval: 500, length: parseInt(refresh)}, function(timer) {
            can.run({})
        })
    },
    _table: function(can, value, key, index, line, array) {
        return {type: "td", inner: value, click: function(event) {
            var target = event.target; if (target.tagName == "INPUT" && target.type == "button") {
                var msg = can.sup.request(event); msg.Option(can.Option()), msg.Option(line)
                var cb = can.onaction[target.value]; return typeof cb == "function"? cb(event, can, target.value): 
                    can.sup.onaction.input(event, can.sup, target.value, function(msg) { can.run({}) })
            }
            can.sup.onaction.change(event, can.sup, key, value, function(msg) {
                can.run(event)
            })

        }, ondblclick: function(event) {
            can.onmotion[value.indexOf("\n") >= 0 || event.ctrlKey? "modifys": "modify"](can, event.target, function(event, value, old) {
                var msg = can.sup.request(event); msg.Option(can.Option()), msg.Option(line)
                if (key == "value") { key = line.key }
                can.run(event, ["action", "编辑", key, value], function(msg) { can.run({}) }, true)
            })
        }, onmouseover: function(event) {
            can.user.toast(can, index+1+"/"+array.length)
        }}
    },
    _board: function(can, msg) {
        can.page.Select(can, can.ui.display, ".story", function(item) { var data = item.dataset
            var cb = can.onimport[data.type]; typeof cb == "function" && cb(can, data, item)
            can.page.Modify(can, item, {style: can.base.Obj(data.style)})
        })
    },

    spark: function(can, list, target) {
        if (list["name"] == "inner") {
            target.title = "点击复制", target.onclick = function(event) {
                can.user.copy(can, target.innerText)
            }
            return
        }
        can.page.Select(can, target, "span", function(item) {
            item.title = "点击复制", item.onclick = function(event) {
                can.user.copy(can, item.innerText)
            }
        })
    },
})
Volcanos("onaction", {help: "控件交互", list: [],
    "清空": function(event, can, name) { can._output.innerHTML = "" },
    "结束": function(event, can, name) { can.user.confirm("确定结束?") && can.run(event, ["action", name], function(msg) {
        can.run({})
    }, true) },
})
