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
    _init: function(can, msg, list, cb, target) { var key = "river";
        if (Volcanos.meta.follow[can._root]) { debugger }
        if (msg.Option(key, can.Conf(key))) {
            typeof cb == "function" && cb (msg); return
        }

        can.run(msg._event, [], function(msg) { can._output.innerHTML = "";
            if (Volcanos.meta.follow[can._root]) { debugger }
            var select; msg.Table(function(value, index, array) {
                // 添加列表
                var view = can.onappend.item(can, can._output, "item", value, function(event, item) {
                    // 左键点击
                    can.Conf(key, value.key); can.run(event, ["search", "Storm.onaction._init"], function(action) {
                        // 切换群组
                    });
                }, function(event) {
                    // 右键点击
                });
                if (index == 0 || [value.key, value.name].indexOf(can.user.Search(can, key)) > -1) {
                    select = view
                }
            }); select.click();
            typeof cb == "function" && cb(msg)
        })
    },
})

