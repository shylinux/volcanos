Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, meta, list, cb, output, action, option, field) { output.innerHTML = "";
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    river: function(event, can, key, cb) {
        if (can.Conf(key)) { cb(can.Conf(key)); return }

        can.run({}, [], function(msg) { msg.Table(function(value, index, array) {
            // 添加列表
            var view = can.onappend.item(can, can._output, "item", value, function(event, item) {
                // 左键点击
                can.page.Select(can, can._output, "div.item", function(item) {
                    can.page.ClassList.del(can, item, "select");
                }); can.page.ClassList.add(can, item, "select");

                can.Conf(key, value.key); can.run({}, ["search", "Action.onexport.action"], function(action) {
                    // 切换群组
                })
            }, function(event) {
                // 右键点击

            });

            if (index == 0 || [value.key, value.name].indexOf(can.user.Search(can, key)) > -1) {
                view.click()
            }
        }); cb(can.Conf(key)); })
    },
})

