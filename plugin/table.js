Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        if (can.onimport._process(can, msg)) {
            return typeof cb == "function" && cb(msg)
        }
        can.ui = can.page.Appends(can, target, [can.onimport._control(can, msg)].concat([
            {view: ["content", "div"]},
            {view: ["display", "pre"]},
        ]))

        var cmd = "", arg = ""
        can.onappend.table(can, msg, can.ui.content, "table", function(value, key, index, line, array) {
            if (key == "key") {
                switch (value) {
                    case "extra.cmd": cmd += line.value; break
                    case "extra.ctx": cmd = line.value + "." + cmd; break
                    case "extra.arg": arg = line.value; break
                }
            }
            return can.onimport._table(can, value, key, index, line, array)
        })

        cmd && can.onappend.plugin(can, {
            height: can.Conf("height"), width: can.Conf("width"), index: cmd, args: arg,
        }, function(sub) {
            sub.run = function(event, cmds, cb, silent) {
                var msg = can.request(event); can.core.List(msg["key"], function(key, index) {
                    msg.Option("list."+key, msg["value"][index])
                })
                can.run(event, ["action", "command", "run", cmd].concat(cmds), function(msg) {
                    typeof cb == "function" && cb(msg)
                }, true)
            }
        }, can.ui.display)

        can.onappend.board(can, msg, can.ui.display, "board")
        can.onimport._board(can, msg)
        return typeof cb == "function" && cb(msg)
    },
    _page: function(can, msg) {
        return {view: ["control", "div"], list: [
            {button: ["上一页", function(event) {
                can.ui["cache.offend"].value = parseInt(can.ui["cache.offend"].value||0) + parseInt(can.ui["cache.limit"].value)
                can.run(event)
            }]},

            {input: ["cache.offend", function(event) {
                event.key == "Enter" && can.run(event)
            }], style: {width: 50}, _init: function(item) {
                item.value = msg.Option("cache.offend")
            }, data: {"className": "args"}},

            {select: [["cache.limit", 10, 30, 100, 1000], function(event) {
                can.run(event)
            }], _init: function(item) {
                item.value = msg.Option("cache.limit")
            }, data: {"className": "args"}},

            {button: ["下一页", function(event) {
                can.ui["cache.offend"].value = parseInt(can.ui["cache.offend"].value||0) - parseInt(can.ui["cache.limit"].value)
                if (can.ui["cache.offend"].value < 0) {
                    can.ui["cache.offend"].value = 0 
                }
                can.run(event)
            }]},

            {select: [["cache.field"].concat(msg["append"]||can.core.Split(msg.Option("fields"), {simple: true})), function(event) {
                can.run(event)
            }], _init: function(item) {
                item.value = msg.Option("cache.field") || item.value
            }, data: {"className": "args"}},


            {input: ["cache.value", function(event) {
                if (event.key == "Enter") {
                    can.page.Select(can, can.ui.content, "tr", function(tr, index) {
                        if (event.target.value == "" && can.page.Modify(can, tr, {style: {"display": ""}})) { return }
                        index > 0 && can.page.Modify(can, tr, {style: {"display": "none"}})
                        can.page.Select(can, tr, "td", function(td, index) {
                            if (td.innerText.indexOf(event.target.value) > -1) {
                                can.page.Modify(can, tr, {style: {"display": ""}})
                            }
                        })
                    })
                }
            }], style: {width: 50}, _init: function(item) {
                item.value = msg.Option("cache.value")
            }, data: {"className": "args"}},
        ]}
    },
    _control: function(can, msg) {
        var cb = can.onimport[msg.Option("_control")]
        return typeof cb == "function" && cb(can, msg)
    },
    _table: function(can, value, key, index, line, array) {
        return {type: "td", inner: value, click: function(event) { var target = event.target
            if (target.tagName == "INPUT" && target.type == "button") { var msg = can.sup.request(event); msg.Option(can.Option())
                key == "value"? can.core.List(array, function(item, index) { msg.Option(item.key, item.value) }): msg.Option(line)

                var msg = can.request(event)
                msg.Option("action", target.name)
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
                var msg = can.sup.request(event); msg.Option(can.Option())
                if (can._msg.Option("modify.hold") == "true") {
                    if (can._msg.append.length == 2 && can._msg.append[0] == "key" && can._msg.append[1] == "value") {
                        can.core.List(can._msg.key, function(key, index) {
                            msg.Option(key, can._msg.value[index])
                        })
                    }
                    can.run(event, ["action", "modify"])
                    return
                }

                msg.Option(line)
                if (key == "value") { key = line.key }
                can.run(event, ["action", "modify", key, value], function(msg) { can.run({}) }, true)
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
    _follow: function(can, msg) {
        if (msg.Option("cache.status") == "stop") { return can.user.toast(can, msg.Option("cache.action")+" done!")}
        can.ui || (can.ui = can.page.Appends(can, can._target, [{view: ["content", "div"]}]))
        can.page.ClassList.add(can, can.ui.content, "code")
        can.page.Modify(can, can.ui.content, {style: {"max-height": 400}})
        can.page.Append(can, can.ui.content, [{text: msg.Result()}])
        can.ui.content.scrollBy(0, 1000)

        can.Timer(100, function() {
            var sub = can.request({})
            sub.Option("cache.hash", msg.Option("cache.hash"))
            sub.Option("cache.begin", msg.Option("cache.begin"))
            sub.Option("cache.limit", msg.Option("cache.limit"))
            can.run(sub._event, [msg.Option("cache.action")], function(msg) {
                can.onimport._follow(can, msg)
            }, true)
        })
        return true
    },
    _inner: function(can, msg) {
        can.onappend.table(can, msg, can.ui.display, "table", function(value, key, index, line, array) {
            return can.onimport._table(can, value, key, index, line, array)
        })

        can.onappend.board(can, msg, can.ui.display, "board")
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
        can.Timer(500, function(timer) {
            var sub = can.request({})
            sub.Option("_count", parseInt(msg.Option("_count"))-1)
            can.run(sub._event)
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
    getLocation: function(event, can, cmd) { var msg = can.request(can)
        can.user.agent.getLocation(function(res) {
            var arg = []; can.core.Item(res, function(key, value) { arg.push(key, value) })
            can.run(event, ["action", cmd].concat(arg))
        })
    },
    openLocation: function(event, can) { var msg = can.request(can)
        can.user.agent.openLocation(msg)
    },
    scanQRCode0: function(event, can) { var msg = can.request(can)
        can.user.agent.scanQRCode()
    },
    scanQRCode: function(event, can, cmd) { var msg = can.request(can)
        can.user.agent.scanQRCode(function(res) {
            var arg = []; can.core.Item(res, function(key, value) { arg.push(key, value) })
            can.run(event, ["action", cmd].concat(arg))
        })
    },

    "清空": function(event, can, name) { can._output.innerHTML = "" },
    "结束": function(event, can, name) { can.user.confirm("确定结束?") && can.run(event, ["action", name], function(msg) {
        can.run({})
    }, true) },
})
