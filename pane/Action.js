Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, meta, list, cb, target) { },
})
Volcanos("onaction", {help: "交互操作", list: [],
    _init: function(can, msg, list, cb, target) {
        can.onexport._init(can, msg, list, cb, target)
    },
})
Volcanos("ondetail", {help: "交互菜单", list: ["共享", "更名", "删除"],
    "共享": function(event, can, value, sub) {
        console.log(sub.Option())
        var msg = sub.request(event)
        msg.Option("pod", can.user.Search(can, "pod"))
        msg.Option("name", value.name)
        msg.Option("node", value.pod)
        msg.Option("group", value.group)
        msg.Option("index", value.index)
        msg.Option("args", value.args)
        msg.Option("value", JSON.stringify(sub.Option()))
        msg.Option("storm", can.Conf("storm"))
        msg.Option("river", can.Conf("river"))
        can.onappend.share(can, msg)
    },
})
Volcanos("onexport", {help: "导出数据", list: [], _init: function(can, msg, list, cb, target) { var key = "action";
        can.Cache(can.Conf("river")+"."+can.Conf("storm"), can._output, can._output.scrollTop+1);
        var river = can.Conf("river", msg.Option("river")), storm = can.Conf("storm", msg.Option("storm"));
        var position = can.Conf(key, msg.Option(key, can.Cache(river+"."+storm, can._output)||""));
        if (position) { can._output.scrollTo(0, position-1); return }

        msg.Clear("option"), can.run(msg._event, [river, storm], function(sup) { can._output.innerHTML = ""; sup.Table(function(value, index, array) {
            value.inputs = can.base.Obj(value.inputs, []), value.inputs.length == 0 && (value.inputs = [
                {type: "text", name: "name", action: "auto"},
                {type: "button", name: "查看", action: "auto"},
                {type: "button", name: "返回"},
            ]);
            value.width = can._target.offsetWidth
            value.height = can._target.offsetHeight
            can.onappend._init(can, value, Volcanos.meta.libs.concat(["/plugin/state.js"]), function(sub) {
                sub.run = function(event, cmds, cb, silent) { var msg = can.request(event)
                    can.Conf("active", sub.Option())
                    can.Conf("action", value.name)
                    // console.log(event, sub, msg)
                    // 插件回调
                    //
                    return can.run(event, can.onengine[cmds[0]]? cmds: [river, storm, index].concat(cmds), function(msg) {
                        can.run(msg._event, ["search", "Footer.onaction.ncmd"]);
                        can.onappend.toast(can, "执行成功", value.name, 2000);
                        typeof cb == "function" && cb(msg)
                    }, silent)
                }
                sub._target.oncontextmenu = function(event) {
                    can.onappend.carte(can, can.ondetail, can.ondetail.list, function(event, item, meta) {
                        // 菜单命令
                        meta[item] && meta[item](event, can, value, sub)
                    })
                }
            }, can._output);
        }) })
    },
    key: function(can, msg) { msg.Option("active", can.Conf("action"))
        can.core.Item(can.Conf("active"), msg.Option)
    },
    left: function(can) {
        return can._target.offsetLeft
    },
    top: function(can) {
        return can._target.offsetTop
    },
})

