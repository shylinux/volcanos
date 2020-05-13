Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, meta, list, cb, target) {},
})
Volcanos("onaction", {help: "交互操作", list: [],
    _init: function(can, msg, list, cb, target) {
        can.onexport._init(can, msg, list, cb, target)
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    _init: function(can, msg, list, cb, target) { var key = "action";
        can.run(msg._event, ["search", "Storm.onaction._init"], function(msg) {
            can.Cache(can.Conf("river")+"."+can.Conf("storm"), can._output, can._output.scrollTop+1);
            var river = can.Conf("river", msg.Option("river")), storm = can.Conf("storm", msg.Option("storm"));
            var position = can.Conf(key, msg.Option(key, can.Cache(river+"."+storm, can._output)));
            if (position) { can._output.scrollTo(0, position-1); typeof cb == "function" && cb(msg); return }

            var pod = can.user.Search(can, "pod"); msg = can.request({}, {});
            can.run(msg._event, [river, storm], function(msg) { can._output.innerHTML = ""; msg.Table(function(value, index, array) {
                // 添加插件
                can.onappend._init(can, value, Config.libs.concat(["plugin/state.js"]), function(sub) {
                    sub.run = function(event, cmds, cb, silent) {
                        // 插件回调
                        var msg = can.request(event); pod && msg.Option("pod", pod);
                        can.run(event, [river, storm, index].concat(cmds), function(msg) {
                            can.onappend.toast(can, "执行成功", value.name, 2000);
                            typeof cb == "function" && cb(msg)
                        }, silent);
                        can.run(msg._event, ["search", "Footer.onaction.cmd"])
                    }
                }, can._output);
            }); typeof cb == "function" && cb(msg); })
        });
    },
})

