Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, conf, output, action, option, field) {output.innerHTML = "";
        var device = can.page.Append(can, field, [{"view": ["device", "table"]}]).last
        var ui = can.page.Append(can, field, [{view: ["create"], list: [
            {input: "name", value: can.Conf("def_name"), title: "应用名称"}, {button: ["创建应用", function(event) {
                if (!ui.name.value) {ui.name.focus(); can.user.toast("请输入群名"); return}

                var list = []
                can.page.Select(can, ui.list, "tr", function(item) {
                    list.push(item.dataset.pod)
                    list.push(item.dataset.group)
                    list.push(item.dataset.index)
                    list.push(item.dataset.name)
                })

                can.run(event, [can.Conf("river"), "spawn", ui.name.value].concat(list), function(msg) {
                    can.Hide(), can.Export(event, "update", "ocean");
                })
            }]}, {name: "list", view: ["list", "table"], list: [{text: ["3. 已选命令列表", "caption"]}]},
        ]}])
        can.device = device
        can.ui = ui
    },
    init: function(event, can, msg, key, output) {output.innerHTML = ""; can.Show(event, -100, -100);
        var table = can.page.Append(can, output, "table")

        can.page.Append(can, table, [{text: ["1. 选择用户节点 ->", "caption"]}])
        can.page.AppendTable(can, table, msg, ["user", "node"], function(event, value, key, index, tr, td) {

            can.page.Select(can, table, "tr.select", function(item) {can.page.ClassList.del(can, item, "select")})
            can.page.ClassList.add(can, tr, "select")

            var node = msg.node[index];
            can.run(event, [can.Conf("river"), msg.user[index], node], function(com) {
                can.page.Appends(can, can.device, [{text: ["2. 选择模块命令 ->", "caption"]}])
                can.page.AppendTable(can, can.device, com, ["key", "index", "name", "help"], function(event, value, key, index, tr, td) {

                    var last = can.page.Append(can, can.ui.list, [{
                        row: [com.key[index], com.index[index], com.name[index], com.help[index]],
                        dataset: {pod: node, group: com.key[index], index: com.index[index], name: com.name[index]},
                        click: function(event) {last.parentNode.removeChild(last)},
                    }]).first

                }, function(event, value, key, index, tr, td) {
                    can.user.carte(event, shy(can.ondetail, can.ondetail.list, function(event, key, meta) {
                        meta[key](event, can, com, value, key, index, td)
                    }))
                })
            })
        }), table.querySelector("td").click()
    },
    steam: function(event, can, value, key, output) {
        if (value == "create") {
            can.run(event, [can.Conf("river")], function(msg) {
                can.onimport.init(event, can, msg, key, output);
            });
        }
    },
    river: function(event, can, value, key, output) {
        if (value == "update") {return}
        can.Conf("river", value)
    },
})
Volcanos("onaction", {help: "组件交互", list: ["关闭", "刷新"],
    "关闭": function(event, can, meta, key, output) {
        can.Hide()
    },
    "刷新": function(event, can, meta, key, output) {
        can.run(event, [], function(msg) {
            can.onimport.init(event, can, msg, key, output)
        })
    },
})
Volcanos("onchoice", {help: "组件菜单", list: ["关闭", "刷新"],
    "关闭": function(event, can, msg, key, target) {
        can.onaction[key](event, can, key, can.output)
    },
    "刷新": function(event, can, msg, key, target) {
        can.onaction[key](event, can, key, can.output)
    },
})
Volcanos("ondetail", {help: "组件详情", list: ["创建", "删除", "共享"],
    "创建": function(event, can, msg, value, key, index, td) {
        can.run(event, [can.Conf("river"), "spawn", msg.key[index]], function(msg) {
            can.Hide(), can.Export(event, "update", "storm");
        })
    },
    "共享": function(event, can, msg, value, key, index, td) {
        can.user.toast(can.user.Share(can, {storm: line.key}), "共享链接", 10000)
    },
})
Volcanos("onexport", {help: "导出数据", list: []})

