Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, meta, list, cb, target) {
    },
})
Volcanos("onaction", {help: "交互数据", list: [],
    _init: function(can, msg, list, cb, target) {
        can.onexport._init(can, msg, list, cb, target)
    },
    cmd: function(can, msg, list, cb, target) {
        can.page.Select(can, can._target, "span.ncmd", function(item) {
            item.innerHTML = can.Conf("ncmd", parseInt(can.Conf("ncmd")||"0")+1+"")+""
        })
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    _init: function(can, msg, list, cb, target) {
        msg = can.request({}, {}), can.run(msg._event, [], function(msg) { can._output.innerHTML = "";
            can.core.List(msg.result, function(title) {
                can.page.Append(can, can._output, [{view: ["title", "div", title]}])
            })

            can.ui = can.page.Append(can, can._output, [{view: "state", list: can.core.List(can.Conf("state"), function(item) {
                return {view: "item", list: [{text: item}, {text: ": "}, {text: [can.Conf(item)||"", "span", item]}], click: function(event) {
                    can.onaction[item](event, can, item);
                }};
            }) }])
        })
    },
})

