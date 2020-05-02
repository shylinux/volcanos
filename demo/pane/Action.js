Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, meta, list, cb, target) {
    },
})
Volcanos("onaction", {help: "交互操作", list: [],
    _init: function(can, msg, list, cb, target) {
        can.onexport._init(can, msg, list, cb, target)
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    _init: function(can, msg, list, cb, target) { var key = "action";
        if (Volcanos.meta.follow[can._root]) { debugger }
        can.run(msg._event, ["search", "Storm.onaction._init"], function(msg) {
            if (Volcanos.meta.follow[can._root]) { debugger }
            can.Cache(can.Conf("river")+can.Conf("storm"), can._output, can.Conf(key));
            var river = can.Conf("river", msg.Option("river"));
            var storm = can.Conf("storm", msg.Option("storm"));
            console.log(can._root, can._name, "show", river, storm);
            if (can.Conf(key, msg.Option(key, can.Cache(river+"."+storm, can._output)))) {
                typeof cb == "function" && cb(msg); return
            }

            can.run(msg._event, [river, storm], function(msg) { can._output.innerHTML = "";
                if (Volcanos.meta.follow[can._root]) { debugger }
                msg.Table(function(value, index, array) {
                    // 添加列表
                    can.onappend._init(can, value, Config.libs.concat([value.display||"plugin/state.js"]), function(sub) {
                        sub.run = function(event, cmds, cb, silent) {
                            can.run(event, [river, storm, index].concat(cmds), cb, silent)
                        }
                    }, can._output)
                    can.Conf(key, "which")
                });
                msg.Option(key, can.Conf(key))
                typeof cb == "function" && cb(msg)
            })
        })
    },
})

