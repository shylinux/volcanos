Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, meta, list, cb, target) { },
})
Volcanos("onaction", {help: "交互数据", list: [],
    _init: function(can, msg, list, cb, target) {
        can.onexport._init(can, msg, list, cb, target)
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    _init: function(can, msg, list, cb, target) { var key = "river";
        can.run(msg._event, [], function(sup) { can._output.innerHTML = ""; var select; sup.Table(function(value, index, array) {
            var view = can.onappend.item(can, can._output, "item", value, function(event, item) { var msg = can.request(event, {_msg: sup});
                // 左键点击
                msg.Option(key, can.Conf(key, value.key)), can.run(event, ["search", "Storm.onaction._init"]);
            }, function(event) {
                // 右键点击
            });

            if (index == 0 || [value.key, value.name].indexOf(can.user.Search(can, key)) > -1) {
                select = view
            }
        }); select && select.click(); typeof cb == "function" && cb(sup); })
    },
})

