Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb) {
        can.base.isFunc(cb) && cb(msg)
        function show(data, target) { var node
            switch (typeof data) {
                case "object": break
                case "string": can.page.Append(can, target, [{text: '"'+data+'"'}]); return
                default: can.page.Append(can, target, [{text: ''+data+''}]); return
            }

            if (can.base.isArray(data)) {
                can.page.Append(can, target, [{text: "["}])
                can.core.List(data, function(value, index) {
                    node = node || can.page.Append(can, target, [{view: "node"}]).node

                    sub = show(value, node);
                    (index < data.length-1) && can.page.Append(can, node, [{text: ","}])
                    can.page.Append(can, node, [{type: "br"}])
                })
                can.page.Append(can, target, [{text: "]"}])
                return node
            }

            can.page.Append(can, target, [{text: "{"}])
            var total = can.core.Item(data).length, count = 0
            can.core.Item(data, function(key, value) { var sub
                node = node || can.page.Append(can, target, [{view: "node"}]).node

                can.page.Append(can, node, [{text: '"'+key+'": ', onclick: function(event) {
                    sub && can.onmotion.toggle(can, sub)
                }}])

                sub = show(value, node);
                (++count < total) && can.page.Append(can, node, [{text: ","}])
                can.page.Append(can, node, [{type: "br"}])
            })
            can.page.Append(can, target, [{text: "}"}])
            return node
        }
        show(JSON.parse(msg.Result()), can._output)
    },
}, ["/plugin/local/wiki/json.css"])
Volcanos("onaction", {help: "组件菜单", list: ["全部展开", "全部折叠"],
    "全部展开": function(event, can) {
        can.page.Select(can, can._output, "div.node div.node", function(node) {
            can.page.Modify(can, node, {style: {display: "block"}})
        })
    },
    "全部折叠": function(event, can) {
        can.page.Select(can, can._output, "div.node div.node", function(node) {
            can.page.Modify(can, node, {style: {display: "none"}})
        })
    },
})
Volcanos("onexport", {help: "导出数据", list: []})


