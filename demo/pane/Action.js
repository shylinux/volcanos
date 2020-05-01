Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, meta, list, cb, output, action, option, field) { output.innerHTML = "";
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    action: function(event, can, key, cb) {
        can.run(event, ["search", "River.onexport.river"], function(river) {
            can.run(event, ["search", "Storm.onexport.storm"], function(storm) {
                can.Cache(can.Conf("river")+can.Conf("storm"), can._output, true)
                if (can.Cache(can.Conf("river", river)+can.Conf("storm", storm), can._output)) {
                    // 缓存恢复
                    return
                }

                can.run(event, [river, storm], function(msg) { can._output.innerHTML = ""; msg.Table(function(value, index, array) {
                    can.onappend._init(can, value, Config.libs.concat([]), function(sub) {
                        sub.run = function(event, cmds, cb, silent) {
                            can.run(event, [river, storm, index].concat(cmds), cb, silent)
                        }
                        console.log("volcano", can._name, "plugin", sub._name)
                    }, can._output)
                }) })
            })
        })
    },
})

