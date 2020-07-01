Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, meta, list, cb, target) {
    },
})
Volcanos("onaction", {help: "交互操作", list: ["创建", "刷新"], _init: function(can, msg, list, cb, target) {
        can.onexport._init(can, msg, list, cb, target)
    },
    create: function(can) {
        can.user.input(event, can, [["type", "public", "protected", "private"], "name", "text"], function(event, button, meta, list) {
            can.run(event, [can.Conf("river"), can.Conf("storm"), "action", "create"].concat(list), function(msg) {
                can.user.Search(can, {"river": can.Conf("river"), "storm": msg.Result()})
            })
            return true
        })
    },
    "创建": function(event, can) {
        can.onaction.create(can)
    },
    "刷新": function(event, can) {
        can.user.Search(can, {"river": can.Conf("river"), "storm": can.Conf("storm")})
    },
})
Volcanos("ondetail", {help: "交互菜单", list: ["添加工具", "重命名", "共享", "删除"],
    "添加工具": function(event, can, value) {
        can.run(event, ["search", "Search.onimport.select", "command", "", ""], function(list) {
            var args = []; can.core.List(list, function(item) {
                args = args.concat([item[0], item[5], item[4], ""])
            })
            can.run(event, [can.Conf("river"), can.Conf("storm"), "action", "tool"].concat(args), function(msg) {
                can.user.Search(can, {"river": can.Conf("river"), "storm": can.Conf("storm")})
            })
        })
    },
    "重命名": function(event, can, value) {
        can.user.input(event, can, ["name"], function(event, button, meta, list) {
            can.run(event, [can.Conf("river"), value.key, "action", "rename", meta.name], function(msg) {
                can.user.Search(can, {"river": can.Conf("river"), "storm": can.Conf("storm")})
            })
            return true
        })
    },
    "共享": function(event, can, value) {
        can.user.input(event, can, ["name"], function(event, button, meta, list) {
            var msg = can.request(event)
            can.user.share(can, msg, [can.Conf("river"), value.key, "action", "share", meta.name])
            return true
        })
    },
    "删除": function(event, can, value) {
        can.run(event, [can.Conf("river"), value.key, "action", "remove"], function(msg) {
            can.user.Search(can, {"river": can.Conf("river")})
        })
    },
})
Volcanos("onexport", {help: "导出数据", list: [], _init: function(can, msg, list, cb, target) { var key = "storm"
        can.Cache(can.Conf("river"), can._output, can.Conf(key))
        var river = can.Conf("river", msg.Option("river"))
        if (msg.Option(key, can.Conf(key, can.Cache(river, can._output)||""))) {
            return can.run(msg._event, ["search", "Action.onaction._init"])
        }

        can.run(msg._event, [river], function(sup) { can._output.innerHTML = ""; var select; sup.Table(function(value, index, array) {
            var view = can.onappend.item(can, can._output, "item", value, function(event, item) { var msg = can.request(event, {_msg: sup})
                // 左键点击
                msg.Option("river", river)
                msg.Option(key, can.Conf(key, value.key)), can.run(event, ["search", "Action.onaction._init"])
            }, function(event, item) {
                // 右键点击
                can.onappend.menu(can, msg, value)
            })

            if (index == 0 || [value.key, value.name].indexOf(can.user.Search(can, key)) > -1) {
                select = view
                if (!value.count) {
                    can.ondetail["添加工具"]({}, can, value)
                }
            }
        }); select && select.click() })
    },
    key: function(can, msg) { msg.Option("storm", can.Conf("storm")) },
})

