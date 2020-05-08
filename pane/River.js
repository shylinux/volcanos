Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, meta, list, cb, target) {},
})
Volcanos("onaction", {help: "交互数据", list: [],
    _init: function(can, msg, list, cb, target) {
        can.onexport._init(can, msg, list, cb, target)
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    _init: function(can, msg, list, cb, target) { var key = "river";
        if (msg.Option(key, can.Conf(key))) { typeof cb == "function" && cb (msg); return }

        msg = can.request({}, {}), can.run(msg._event, [], function(msg) { can._output.innerHTML = ""; var select; msg.Table(function(value, index, array) {
            var view = can.onappend.item(can, can._output, "item", value, function(event, item) {
                // 左键点击
                can.Conf(key, value.key); can.run(event, ["search", "Storm.onaction._init"], function(action) { });
            }, function(event) {
                // 右键点击
            });
            if (index == 0 || [value.key, value.name].indexOf(can.user.Search(can, key)) > -1) {
                msg.Option(key, value.key), select = view
            }
        }); select && select.click(); typeof cb == "function" && cb(msg); })
    },
})

