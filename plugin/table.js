Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        if (can.sup.onimport._process(can.sup, msg)) { return can.base.isFunc(cb) && cb(can, msg) }
        if (can.onimport._process(can, msg)) { return can.base.isFunc(cb) && cb(can, msg) }

        can.onmotion.clear(can)
        can.base.isFunc(cb) && cb(msg)

        can.page.Append(can, target, [can.onimport._control(can, msg)])
        can.onappend.table(can, msg, function(value, key, index, line, array) {
            return can.onimport._table(can, value, key, index, line, array, cb)
        })

        can.onappend.board(can, msg.Result())
        can.onmotion.story(can, can._output)
    },
    _table: function(can, value, key, index, line, array, cb) {
        return {text: [value, "td"], onclick: function(event) { var target = event.target
            if (target.tagName == "INPUT" && target.type == "button") { var msg = can.sup.request(event, can.Option())
                key == "value"? can.core.List(array, function(item, index) { msg.Option(item.key, item.value) }): msg.Option(line)
                return can.run(event, ["action", target.name], function(msg) { can.run() }, true)
            }

            if (can.sup.onaction.change(event, can.sup, key, value, function(msg) { can.onimport._init(can, msg, [], cb) }).length > 0) { return }

        }, ondblclick: function(event) {
            can.onmotion.modify(can, event.target, function(event, value, old) {
                var msg = can.sup.request(event, can.Option()); msg = can.sup.request(event, line)
                can.run(event, ["action", "modify", key == "value"? line.key||line.name: key, value], function(msg) { }, true)
            })
        }}
    },

    _process: function(can, msg) {
        return can.core.CallFunc([can.onimport, msg.Option("_process")], [can, msg])
    },

    _follow: function(can, msg) {
        if (msg.Option("cache.status") == "stop") { return can.user.toast(can, msg.Option("cache.action")+" done!")}

        can.page.Modify(can, can._output, {className: "code", style: {"max-height": 400, "display": "block"}})
        can.page.Append(can, can._output, [{text: msg.Result()}])
        can._output.scrollBy(0, 1000)

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
        can.onappend.table(can, msg, function(value, key, index, line, array) {
            return can.onimport._table(can, value, key, index, line, array)
        }, can._output)

        can.onappend.board(can, msg.Result(), can._output)
        can.onmotion.story(can, can._output)
        can.page.Modify(can, can._output, {style: {display: "block"}})
        return true
    },

    _control: function(can, msg) {
        var cb = can.onimport[msg.Option("_control")]
        return can.base.isFunc(cb) && cb(can, msg)
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

            {select: [["cache.field"].concat(msg["append"]||can.core.Split(msg.Option("fields"))), function(event) {
                can.run(event)
            }], _init: function(item) {
                item.value = msg.Option("cache.field") || item.value
            }, data: {"className": "args"}},


            {input: ["cache.value", function(event) {
                if (event.key == "Enter") {
                    can.page.Select(can, can._output, "tr", function(tr, index) {
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
