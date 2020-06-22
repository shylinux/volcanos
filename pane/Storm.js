Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, meta, list, cb, target) {
    },
})
Volcanos("onaction", {help: "交互操作", list: [], _init: function(can, msg, list, cb, target) {
        can.onexport._init(can, msg, list, cb, target)
    },
})
Volcanos("ondetail", {help: "交互菜单", list: ["共享", "更名", "删除"],
    "共享": function(event, can, value) {
        var msg = can.request(event)
        msg.Option("name", "storm")
        msg.Option("storm", can.Conf("storm"))
        msg.Option("river", can.Conf("river"))
        can.onappend.share(can, msg)
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

            if (index == 0 || [value.key, value.name].indexOf(can.user.Search(can, key)) > -1) { select = view }
        }); select && select.click() })
    },
    key: function(can, msg) { msg.Option("storm", can.Conf("storm")) },
})

