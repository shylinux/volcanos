Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        if (can.onimport._process(can, msg)) { return typeof cb == "function" && cb(can, msg) }
        if (can.sup.onimport._process(can.sup, msg)) { return typeof cb == "function" && cb(can, msg) }

        can.onmotion.clear(can)
        can.ui = can.onlayout.display(can)
        typeof cb == "function" && cb(msg)

        can.page.Append(can, can.ui.content, [can.onimport._control(can, msg)])
        can.onappend.table(can, "content", msg, function(value, key, index, line, array) {
            return can.onimport._table(can, value, key, index, line, array)
        }, can.ui.content)

        can.onappend.board(can, "content", msg.Result(), can.ui.display)
        can.onimport._board(can, msg)
    },
    _table: function(can, value, key, index, line, array) {
        return {text: [value, "td"], onclick: function(event) { var target = event.target
            if (target.tagName == "INPUT" && target.type == "button") { var msg = can.sup.request(event, can.Option())
                key == "value"? can.core.List(array, function(item, index) { msg.Option(item.key, item.value) }): msg.Option(line)
                return can.run(event, ["action", target.name], function(msg) { can.run() }, true)
            }
            can.sup.onaction.change(event, can.sup, key, value, function(msg) { can.onimport._init(can, msg) })

        }, ondblclick: function(event) {
            can.onmotion.modify(can, event.target, function(event, value, old) {
                var msg = can.sup.request(event, can.Option());
                can.run(event, ["action", "modify", key == "value"? line.key: key, value], function(msg) { }, true)
            })
        }, onmouseover: function(event) {
            can.user.toast(can, index+1+"/"+array.length)
        }}
    },
    _board: function(can, msg) {
        can.page.Select(can, can._output, ".story", function(item) { var data = item.dataset
            can.page.Modify(can, item, {style: can.base.Obj(data.style)})
            can.core.CallFunc(can.onimport[data.type], [can, data, item])
        })
    },
    spark: function(can, list, target) {
        if (list["name"] == "inner") {
            target.title = "点击复制", target.onclick = function(event) {
                can.user.copy(event, can, target.innerText)
            }
            return
        }
        can.page.Select(can, target, "span", function(item) {
            item.title = "点击复制", item.onclick = function(event) {
                can.user.copy(event, can, item.innerText)
            }
        })
    },
    _process: function(can, msg) {
        var cb = can.onimport[msg.Option("_process")]
        return typeof cb == "function" && cb(can, msg)
    },
    _follow: function(can, msg) {
        if (msg.Option("cache.status") == "stop") { return can.user.toast(can, msg.Option("cache.action")+" done!")}

        can.page.Modify(can, can.ui.display, {className: "code", style: {"max-height": 400}})
        can.page.Append(can, can.ui.display, [{text: msg.Result()}])
        can.ui.display.scrollBy(0, 1000)

        can.core.Timer(100, function() { var sub = can.request({})
            sub.Option("cache.hash", msg.Option("cache.hash"))
            sub.Option("cache.begin", msg.Option("cache.begin"))
            sub.Option("cache.limit", msg.Option("cache.limit"))
            can.run(sub._event, ["action", msg.Option("cache.action")], function(msg) {
                can.onimport._follow(can, msg)
            }, true)
        })
        return true
    },
    _inner: function(can, msg) {
        can.onappend.table(can, "content", msg, function(value, key, index, line, array) {
            return can.onimport._table(can, value, key, index, line, array)
        }, can.ui.display)

        can.onappend.board(can, "content", msg.Result(), can.ui.display)
        can.onimport._board(can, msg)
        return true
    },

    _control: function(can, msg) {
        var cb = can.onimport[msg.Option("_control")]
        return typeof cb == "function" && cb(can, msg)
    },
    _page: function(can, msg) { var ui = {}
        return {view: ["control", "div"], list: [
            {button: ["上一页", function(event) {
                ui.offend.value = parseInt(ui.offend.value||0) + parseInt(ui.limit.value)
                can.run(event)
            }]},

            {input: ["cache.offend", function(event) {
                event.key == "Enter" && can.run(event)
            }], style: {width: 50}, _init: function(item) {
                ui.offend = item, item.value = msg.Option("cache.offend")
            }, data: {"className": "args"}},

            {select: [["cache.limit", 10, 30, 100, 1000], function(event) {
                can.run(event)
            }], _init: function(item) {
                ui.limit = item, item.value = msg.Option("cache.limit")
            }, data: {"className": "args"}},

            {button: ["下一页", function(event) {
                ui.offend.value = parseInt(ui.offend.value||0) - parseInt(ui.limit.value)
                if (ui.offend.value < 0) {
                    ui.offend.value = 0 
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
                        if (event.target.value == "") { can.page.Modify(can, tr, {style: {"display": ""}}); return }
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

})
Volcanos("onaction", {help: "控件交互", list: []})
Volcanos("onexport", {help: "导出数据", list: []})
