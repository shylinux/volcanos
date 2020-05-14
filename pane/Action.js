Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, meta, list, cb, target) { },
})
Volcanos("onaction", {help: "交互操作", list: [],
    _init: function(can, msg, list, cb, target) {
        can.onexport._init(can, msg, list, cb, target)
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    _init: function(can, msg, list, cb, target) { var key = "action";
        can.Cache(can.Conf("river")+"."+can.Conf("storm"), can._output, can._output.scrollTop+1);
        var river = can.Conf("river", msg.Option("river")), storm = can.Conf("storm", msg.Option("storm"));
        var position = can.Conf(key, msg.Option(key, can.Cache(river+"."+storm, can._output)));
        if (position) { can._output.scrollTo(0, position-1); return }

        msg.Clear("option"), can.run(msg._event, [river, storm], function(sup) { can._output.innerHTML = ""; sup.Table(function(value, index, array) {
            value.inputs = can.base.Obj(value.inputs, [])
            value.inputs.length == 0 && (value.inputs = [{type: "text"}, {type: "button", name: "查看"}])
            can.onappend._init(can, value, Config.libs.concat(["plugin/state.js"]), function(sub) {
                sub.run = function(event, cmds, cb, silent) { var msg = can.request(event, {_msg: sup});
                    // 插件回调
                    can.run(event, [river, storm, index].concat(cmds), function(msg) {
                        can.run(msg._event, ["search", "Footer.onaction.ncmd"]);
                        can.onappend.toast(can, "执行成功", value.name, 2000);
                        typeof cb == "function" && cb(msg)
                    }, silent);
                }
            }, can._output);
        }) })
    },
})

