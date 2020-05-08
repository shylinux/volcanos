Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, meta, list, cb, target) {},
})
Volcanos("onaction", {help: "交互操作", list: [],
    _init: function(can, msg, list, cb, target) {
        can.onexport._init(can, msg, list, cb, target)
    },
})
Volcanos("ondetail", {help: "交互菜单", list: ["共享", "更名", "删除"],
    _init: function(can, msg, list, cb, target) {
        can.onexport._init(can, msg, list, cb, target)
    },
    "共享": function(event, can, value) {
        can.onappend.share(can, {river: can.Conf("river"), storm: can.Conf("storm")})
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    _init: function(can, msg, list, cb, target) { var key = "storm";
        can.run(msg._event, ["search", "River.onaction._init"], function(msg) {
            can.Cache(can.Conf("river"), can._output, can.Conf(key));
            var river = can.Conf("river", msg.Option("river"));
            if (can.Conf(key, msg.Option(key, can.Cache(river, can._output)))) { typeof cb == "function" && cb (msg); return }

            msg = can.request({}, {}), can.run(msg._event, [river], function(msg) { can._output.innerHTML = ""; var select; msg.Table(function(value, index, array) {
                var view = can.onappend.item(can, can._output, "item", value, function(event, item) {
                    // 左键点击
                    can.Conf(key, value.key); can.run(event, ["search", "Action.onaction._init"], function(msg) {})
                }, function(event, item) {
                    // 右键点击
                    can.onappend.carte(can, can.ondetail, can.ondetail.list, function(event, item, meta) {
                        meta[item] && meta[item](event, can, value)
                        console.log(item)
                    })
                });

                if (index == 0 || [value.key, value.name].indexOf(can.user.Search(can, key)) > -1) {
                    msg.Option(key, value.key), select = view
                }
            }); select && select.click(); typeof cb == "function" && cb(msg); })
        })
    },
})

