Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb) {
        can.onmotion.clear(can)
        can.onimport.data(can, can.base.Obj(msg.Result(), "{}"), can._output)
        can.base.isFunc(cb) && cb(msg)
    },
    data: function(can, data, target) {
        function show(data, target, index, total) { var list
            switch (typeof data) {
                case "object":
                    function wrap(begin, end, add, cb) {
                        can.page.Append(can, target, [{text: begin}])
                        add && can.page.Append(can, target, [{text: ["...", "span", "nonce"], onclick: function(event) {
                            list && can.onmotion.toggle(can, list)
                        }}]), cb()
                        can.page.Append(can, target, [{text: end}])
                    }
                    function _node() {
                        list = list || can.page.Append(can, target, [{view: "list"}]).list
                        return can.page.Append(can, list, [{view: "node"}]).node
                    }

                    if (can.base.isArray(data)) { // 数组
                        wrap("[", "]", data.length > 0, function() { can.core.List(data, function(value, index) { var node = _node()
                            show(value, node, index, data.length)
                        }) }); break
                    }

                    // 对象
                    var length = can.core.Item(data).length, count = 0
                    wrap("{", "}", length > 0, function() { can.core.Item(data, function(key, value) { var node = _node()
                        can.page.Append(can, node, [{text: ['"'+key+'"', "span", "key"], onclick: function(event) {
                            sub && can.onmotion.toggle(can, sub)
                        }}, {text: ': '}])
                        var sub = show(value, node, count++, length)
                    }) }); break
                case "string": /* 字串 */ can.page.Append(can, target, [{text: ['"'+data+'"', "span", "string"]}]); break
                default: /* 其它 */ can.page.Append(can, target, [{text: [''+data+'', "span", "const"]}])
            }

            (index < total-1) && can.page.Append(can, target, [{text: ","}])
            return list
        }; show(data, can.page.Append(can, target, [{view: "node"}]).node, 0, 0)
    },
}, ["/plugin/local/wiki/json.css"])
Volcanos("onaction", {help: "组件菜单", list: ["全部展开", "全部折叠"],
    "全部展开": function(event, can) {
        can.page.Select(can, can._output, "div.list div.list", function(list) {
            can.page.Modify(can, list, {style: {display: "block"}})
        })
    },
    "全部折叠": function(event, can) {
        can.page.Select(can, can._output, "div.list div.list", function(list) {
            can.page.Modify(can, list, {style: {display: "none"}})
        })
    },
})
Volcanos("onexport", {help: "导出数据", list: []})

