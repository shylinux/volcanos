Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.onmotion.clear(can), can.base.isFunc(cb) && cb(msg)
        can.onappend.table(can, msg)
        can.onappend.board(can, msg.Result())
        can.onmotion.story.auto(can, target)
    },

    _process: function(can, msg) {
        if (msg.Option("sess.toast")) {
            can.user.toast(can, msg.Option("sess.toast"))
        }
        return can.core.CallFunc([can.onimport, msg.Option("_process")], [can, msg])
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
