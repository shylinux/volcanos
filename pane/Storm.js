Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, meta, list, cb, target) {
    },
})
Volcanos("onaction", {help: "交互数据", list: [],
    _init: function(can, msg, list, cb, target) {
        can.onexport._init(can, msg, list, cb, target)
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    _init: function(can, msg, list, cb, target) { var key = "storm";
        if (Volcanos.meta.follow[can._root]) { debugger }
        can.run(msg._event, ["search", "River.onaction._init"], function(msg) {
            if (Volcanos.meta.follow[can._root]) { debugger }
            can.Cache(can.Conf("river"), can._output, can.Conf(key));
            var river = can.Conf("river", msg.Option("river"));
            console.log(can._root, can._name, "show", river);
            if (can.Conf(key, msg.Option(key, can.Cache(river, can._output)))) {
                typeof cb == "function" && cb (msg); return
            }

            msg = can.request({}, {}), can.run(msg._event, [river], function(msg) { can._output.innerHTML = "";
                if (Volcanos.meta.follow[can._root]) { debugger }
                var select; msg.Table(function(value, index, array) {
                    // 添加列表
                    var view = can.onappend.item(can, can._output, "item", value, function(event, item) {
                        // 左键点击
                        can.Conf(key, value.key); can.run(event, ["search", "Action.onaction._init"], function(msg) {
                        })
                    }, function(event, item) {
                        // 右键点击
                    });
                    if (index == 0 || [value.key, value.name].indexOf(can.user.Search(can, key)) > -1) {
                        msg.Option("storm", value.key)
                        select = view
                    }
                }); select && select.click();
                typeof cb == "function" && cb(msg)
            })
        })
    },
})
