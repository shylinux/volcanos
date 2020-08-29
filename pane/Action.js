Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, meta, list, cb, target) {
        typeof cb == "function" && cb()
    },
})
Volcanos("onaction", {help: "交互操作", list: [], _init: function(can, msg, list, cb, target) {
        can.onexport._init(can, msg, list, cb, target)
    },

    add_plugin: function(can, river, storm, value) {
        if (can.user.Search(can, "river") == river && can.user.Search(can, "storm") == storm && can.user.Search(can, "active") == value.name) {
            value.args = can.core.List(value.inputs, function(item) {
                if (item._input == "text" || item._input == "select") {
                    return can.user.Search(can, item.name) || item.value
                }
            })
        }
        value.name && can.onappend._init(can, value, Volcanos.meta.libs.concat(["/plugin/state.js"]), function(sub) {
            sub._legend.onclick = function(event) {
                var opt = {pod: can.user.Search(can, "pod"), river: river, storm: storm, active: value.name}
                can.core.Item(sub.Option(), function(key, value) { opt[key] = value })
                location.href = can.user.Share(can, opt, true)

            }
            sub.run = function(event, cmds, cb, silent) { var msg = can.request(event)
                var _action = msg.Option("_action")
                can.Conf("active", sub.Option())
                can.Conf("action", value.name)
                can.Conf("current", sub)
                // 插件回调
                //
                return can.run(event, can.onengine[cmds[0]]? cmds: [river, storm, value.action].concat(cmds), function(msg) {
                    can.run(msg._event, ["search", "Footer.onaction.ncmd"])
                    typeof cb == "function" && cb(msg)
                    if (msg.Option("_progress")) {
                        if (msg.Append("count") != msg.Append("total")) {
                            can.user.toast(can, {
                                text: "执行进度: "+msg.Append("count")+"/"+msg.Append("total")+"\n"+msg.Append("name"),
                                title: value.name,
                                duration: 1100,
                                progress: parseInt(msg.Append("count"))*100/parseInt(msg.Append("total")),
                            })
                            can.Timer(1000, function() {
                                var res = can.request({})
                                res.Option("_action", _action)
                                res.Option("_progress", msg.Option("_progress"))
                                sub.run(res._event, cmds, cb, silent)
                            })
                            return
                        }
                    }
                    can.user.toast(can, "执行成功", value.name, 400)
                }, silent)
            }
            sub._target.oncontextmenu = function(event) {
                can.user.carte(can, can.ondetail, can.ondetail.list, function(event, item, meta) {
                    // 菜单命令
                    meta[item] && meta[item](event, can, value, sub)
                })
            }
        }, can._output)
    },
})
Volcanos("ondetail", {help: "交互菜单", list: ["共享", "更名", "删除"],
    "共享": function(event, can, value, sub) { var msg = sub.request(event)
        var list = [can.Conf("river"), can.Conf("storm"), "share", value.name, value.help]
        list = list.concat([
            value.pod||can.user.Search(can, "pod")||"", value.group||"", value.index, JSON.stringify(can.core.Item(sub.Option(), function(key, value) { return value })),
            JSON.stringify(sub.Option())
        ])
        can.user.share(can, msg, list)
    },
})
Volcanos("onexport", {help: "导出数据", list: [], _init: function(can, msg, list, cb, target) { var key = "action"
        can.Cache(can.Conf("river")+"."+can.Conf("storm"), can._output, can._output.scrollTop+1)
        var river = can.Conf("river", msg.Option("river")), storm = can.Conf("storm", msg.Option("storm")||"main")
        var position = can.Conf(key, msg.Option(key, can.Cache(river+"."+storm, can._output)||""))
        if (position) { can._output.scrollTo(0, position-1); return }

        msg.Clear("option"), can.run(msg._event, [river, storm], function(sup) { can._output.innerHTML = ""
            can.core.Next(sup.Table(), function(value, next) {
                value.inputs = can.base.Obj(value.inputs||"[]", [])
                value.height = can._target.offsetHeight
                value.width = can._target.offsetWidth

                if (value.inputs.length == 0) {
                    can.run({}, [river, storm, "action", "command", value.index], function(msg) {
                        value.inputs = can.base.Obj(msg.list&&msg.list[0]||"[]", [])
                        // value.feature = value.feature||can.base.Obj(msg.meta&&msg.meta[0]||"{}", {})
                        value.feature = can.base.Obj(msg.meta&&msg.meta[0]||"{}", {})
                        can.onaction.add_plugin(can, river, storm, value), next()
                    })
                    return
                }
                can.onaction.add_plugin(can, river, storm, value), next()
            })
        })
    },
    key: function(can, msg) { msg.Option("active", can.Conf("action"))
        can.core.Item(can.Conf("active"), msg.Option)
        can.core.List(can.Conf("current")._outputs, function(item) {
            item.onexport && item.onexport.key && item.onexport.key(item, msg)
        })
    },
    left: function(can) {
        return can._target.offsetLeft
    },
    top: function(can) {
        return can._target.offsetTop
    },
})

