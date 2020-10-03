Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        if (can.onimport._process(can, msg)) {
            return typeof cb == "function" && cb(msg)
        }

        can.ui = can.page.Appends(can, target, [can.onimport._control(can, msg)].concat([
            {view: ["content", "div"]},
            {view: ["display", "pre"]},
        ]))
        can.onappend.table(can, can.ui.content, "table", msg, function(value, key, index, line, array) {
            return can.onimport._table(can, value, key, index, line, array)
        })

        can.onappend.board(can, can.ui.display, "board", msg)
        can.onimport._board(can, msg)
        return typeof cb == "function" && cb(msg)
    },
    _control: function(can, msg) {
        return msg.Option("_control") == "page" && {view: ["control", "div"], list: [
            {button: ["上一页", function(event) {
                if (can.ui["cache.begin"].value == "") {
                    can.ui["cache.begin"].value = msg.Option("cache.count") - can.ui["cache.limit"].value
                }
                can.ui["cache.begin"].value = can.ui["cache.begin"].value - can.ui["cache.limit"].value 
                if (can.ui["cache.begin"].value < 0) { can.ui["cache.begin"].value = 0}
                can.run(event)
            }]},

            {input: ["cache.begin", function(event) {
                event.key == "Enter" && can.run(event)
            }], style: {width: 50}, _init: function(item) {
                item.value = msg.Option("cache.begin")
            }, data: {"className": "args"}},

            {select: [["cache.limit", 10, 30, 100, 1000], function(event) {
                can.run(event)
            }], _init: function(item) {
                item.value = msg.Option("cache.limit")
            }, data: {"className": "args"}},

            {button: ["下一页", function(event) {
                can.ui["cache.begin"].value = parseInt(can.ui["cache.begin"].value||parseInt(m.Option("cache.count"))-parseInt(can.ui["cache.limit"].value)) + parseInt(can.ui["cache.limit"].value)
                if (can.ui["cache.begin"].value != "" && parseInt(can.ui["cache.begin"].value) < parseInt(msg.Option("cache.count"))) { can.ui["cache.begin"].value = msg.Option("cache.count") }
                can.run(event)
            }]},

            {select: [["cache.field"].concat(msg["append"]||can.core.Split(msg.Option("fields"), {simple: true})), function(event) {
                can.run(event)
            }], _init: function(item) {
                item.value = msg.Option("cache.field") || item.value
            }, data: {"className": "args"}},


            {input: ["cache.value", function(event) {
                event.key == "Enter" && can.run(event)
            }], style: {width: 50}, _init: function(item) {
                item.value = msg.Option("cache.value")
            }, data: {"className": "args"}},
        ]}
    },
    _table: function(can, value, key, index, line, array) {
        return {type: "td", inner: value, click: function(event) { var target = event.target
            if (target.tagName == "INPUT" && target.type == "button") { var msg = can.sup.request(event)
                msg.Option(can.Option()); if (key == "value") {
                    can.core.List(array, function(item, index) {
                        msg.Option(item.key, item.value)
                    })
                } else {
                    msg.Option(line)
                }

                var cb = can.onaction[target.name]; return typeof cb == "function"? cb(event, can, target.name): 
                    can.sup.onaction.input(event, can.sup, target.name, function(msg) {
                        can.user.toast(can, msg.Result())
                        if (can.onimport._process(can, msg)) {
                            return typeof cb == "function" && cb(msg)
                        }
                        can.run({})
                    })
            } else {
                can.sup.onaction.change(event, can.sup, key, value, function(msg) {
                    can.run(event)
                })
            }
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
    _process: function(can, msg) {
        var process = msg.Option("_process") || can.Conf("feature")["_process"] 
        var cb = can.onimport[process]; return typeof cb == "function" && cb(can, msg)
    },
    _inner: function(can, msg) {
        can.onappend.board(can, can.ui.display, "board", msg)
        can.onimport._board(can, msg)
        return true
    },
    _field: function(can, msg) {
        msg.Table(function(value) {
            value.inputs = can.base.Obj(msg.list&&msg.list[0]||"[]", [])
            value.feature = can.base.Obj(msg.meta&&msg.meta[0]||"{}", {})
            value.name && can.onappend._init(can, value, Volcanos.meta.libs.concat(["/plugin/state.js"]), function(sub) {
                sub.run = function(event, cmds, cb, silent) {
                    can.run(event, (msg["_prefix"]||[]).concat(cmds), cb, true)
                }
            }, can._output)
        })
        return true
    },
    _refresh: function(can, msg) {
        var refresh = msg.Option("_refresh") || can.Conf("feature")["_refresh"] 
        can.Timer({interval: 500, length: parseInt(refresh)}, function(timer) {
            can.run({})
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
