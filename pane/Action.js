const RIVER = "river", STORM = "storm"
Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        var river = can.Conf("river"), storm = can.Conf("storm")
        can._output.innerHTML = "", can.core.Next(msg.Table(), function(value, next) {
            value.feature = can.base.Obj(value.feature||value.meta||"{}", {})
            value.inputs = can.base.Obj(value.inputs||value.list||"[]", [])
            if (value.inputs.length > 0) {
                can.onimport._plugin(can, river, storm, value), next()
                return
            }

            can.run({}, ["action", "command", value.index || value.ctx+"."+value.cmd], function(msg) {
                value.feature = can.base.Obj(msg.meta&&msg.meta[0]||"{}", {})
                value.inputs = can.base.Obj(msg.list&&msg.list[0]||"[]", [])
                can.onimport._plugin(can, river, storm, value), next()
            })
        })
        typeof cb == "function" && cb(msg)
    },
    _plugin: function(can, river, storm, value) { value.name = value.name.split(" ")[0]
        value.action = value.id || value.index || value.key+"."+value.name
        value.width = can._target.offsetWidth
        value.type = "plugin"

        can.onappend._init(can, value, ["/plugin/state.js"], function(sub) {
            sub.run = function(event, cmds, cb, silent) { var msg = can.request(event); cmds = cmds || []
                return can.run(event, can.onengine[cmds[0]]? cmds: [river, storm, value.action].concat(cmds), function(msg) {
                    return typeof cb == "function" && cb(msg)
                }, silent)
            }
        }, can._output)
    },
})
Volcanos("onaction", {help: "交互操作", list: [], _init: function(can, msg, list, cb, target) {
        can.Cache(can.Conf("river")+"."+can.Conf("storm"), can._output, can._output.scrollTop+1)
        var river = can.Conf("river", msg.Option("river")), storm = can.Conf("storm", msg.Option("storm"))
        var position = can.Conf("action", msg.Option("action", can.Cache(river+"."+storm, can._output)||""))
        if (position) { can._output.scrollTo(0, position-1); return }

        can.run({}, [river, storm], function(msg) {
            can.onimport._init(can, msg, list, cb, target)
        })
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    args: function(can, msg, list, cb, target) {
        can.core.Next(can.page.Select(can, target, "div.output>fieldset.plugin>form.option"), function(item, next) {
            var list = can.page.Select(can, item, '.args', function(item) { return item.value||"" })
            item.dataset.args = JSON.stringify(list), cb(item, next)
        })
    },
})

