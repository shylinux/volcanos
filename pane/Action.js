(function() { const RIVER = "river", STORM = "storm", ACTION = "action"
Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can._target.ontouchstart = function(event) {
            can.run({}, ["search", "River.onmotion.hidden"])
        }
        var river = can.Conf(RIVER), storm = can.Conf(STORM)
        can.onmotion.clear(can), can.core.Next(msg.Table(), function(value, next) {
            value.feature = can.base.Obj(value.feature||value.meta||"{}", {})
            value.inputs = can.base.Obj(value.inputs||value.list||"[]", [])

            value.inputs.length == 0? can.run({}, ["action", "command", value.index || value.ctx+"."+value.cmd], function(msg) {
                value.feature = can.base.Obj(msg.meta&&msg.meta[0]||"{}", {})
                value.inputs = can.base.Obj(msg.list&&msg.list[0]||"[]", [])

                can.onimport._plugin(can, target, river, storm, value), next()
            }): (can.onimport._plugin(can, target, river, storm, value), next())
        })
        typeof cb == "function" && cb(msg)
    },
    _plugin: function(can, target, river, storm, value) { value.name = value.name.split(" ")[0]
        value.action = value.id || value.index || value.key+"."+value.name
        value.width = can._target.offsetWidth
        value.type = "plugin"

        // 添加插件
        can.onappend._init(can, value, ["/plugin/state.js"], function(plugin) {
            can._plugins = (can._plugins||[]).concat([plugin])
            plugin.run = function(event, cmds, cb, silent) { var msg = plugin.request(event); cmds = cmds || []
                can.run(event, can.onengine[cmds[0]]? cmds: [river, storm, value.action].concat(cmds), function(msg) {
                    typeof cb == "function" && cb(msg)
                }, silent)
            }
        }, target)
    },
})
Volcanos("onengine", {help: "解析引擎", list: [],
    engine: function(event, can, msg, pane, cmds, cb) {
        var river = can.onengine.river[cmds[0]]
        var storm = river && river.storm[cmds[1]]
        if (!storm || cmds.length != 2) { return false }

        if (storm.index) {
            can.misc.Run(event, can, {names: pane._name}, ["action", "command"].concat(storm.index), cb)
        } else {
            can.core.List(storm.action, function(value) {
                msg.Push("name", value.name||"")
                msg.Push("help", value.help||"")
                msg.Push("inputs", JSON.stringify(value.inputs||[]))
                msg.Push("feature", JSON.stringify(value.feature||{}))
                msg.Push("index", value.index||"")
                msg.Push("args", value.args||"[]")
            }), typeof cb == "function" && cb(msg)
        }
        return true
    },
})
Volcanos("onaction", {help: "交互操作", list: [], _init: function(can, msg, list, cb, target) {
        can.onengine.listen(can, "storm.select", function(msg, river, storm) {
            can.page.Cache(can.Conf(RIVER)+"."+can.Conf(STORM), can._output, can._output.scrollTop+1)
            can.Conf(RIVER, river), can.Conf(STORM, storm)

            var position = can.page.Cache(river+"."+storm, can._output)
            if (position) { can._output.scrollTo(0, position-1); return }

            can.run({}, [river, storm], function(msg) {
                can.onimport._init(can, msg, list, cb, can._output)
            })
        })
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    args: function(can, msg, list, cb, target) {
        can.core.Next(can.page.Select(can, target, "fieldset.plugin>form.option"), function(item, next) {
            var list = can.page.Select(can, item, '.args', function(item) { return item.value||"" })
            item.dataset.args = JSON.stringify(list), cb(item, next)
        })
    },
})
})()
