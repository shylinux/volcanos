Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, meta, list, cb, target) {
    },
})
Volcanos("onaction", {help: "控件交互", list: [], _init: function(can, msg, list, cb, target) {
        can.onexport._init(can, msg, list, cb, target)
    },
})
Volcanos("ondetail", {help: "菜单交互", list: ["添加用户", "重命名", "删除"], _init: function(can, msg, list, cb, target) {
        can.onexport._init(can, msg, list, cb, target)
    },
    "添加用户": function(event, can, river, button) {
        console.log(river, button)
    },
    "重命名": function(event, can, river, button) {
        console.log(river, button)
    },
    "删除": function(event, can, river, button) {
        console.log(river, button)
    },
})
Volcanos("onexport", {help: "导出数据", list: [], _init: function(can, msg, list, cb, target) { var key = "river";
        can.run({}, [], function(sup) { can._output.innerHTML = ""; var select; sup.Table(function(value, index, array) {
            var view = can.onappend.item(can, can._output, "item", value, function(event, item) { var msg = can.request(event, {_msg: sup});
                // 左键点击
                msg.Option(key, can.Conf(key, value.key)), can.run(event, ["search", "Storm.onaction._init"]);
            }, function(event) {
                // 右键点击
                can.onappend.menu(can, msg, value)
            });

            if (index == 0 || [value.key, value.name].indexOf(can.user.Search(can, key)) > -1) {
                select = view
            }
        }); select && select.click(); typeof cb == "function" && cb(sup); })
    },
    key: function(can, msg) { msg.Option("river", can.Conf("river")) },
})

