Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, output, action, option, field) {output.innerHTML = "";
        var ui = can.page.Append(can, field, [{view: ["create"], list: [
            {input: ["name"], title: "群聊名称"},
            {button: ["创建群聊", function(event) {
                if (!ui.name.value) {ui.name.focus(); can.user.toast("请输入群名"); return}

                var list = can.page.Select(can, ui.list, "tr", function(item) {
                    return item.dataset.user
                })
                if (list.length == 0) {can.user.toast("请添加组员"); return}

                can.run(event, ["spawn", "", ui.name.value].concat(list), function(msg) {
                    can.Hide(), can.Export(event, "update", "river");
                })
            }]}, {name: "list", view: ["list", "table"], list: [{text: ["2. 已选用户列表", "caption"]}]},
        ]}])
        can.ui = ui
    },
    init: function(event, can, msg, key, output) {output.innerHTML = "";
        var table = can.page.Append(can, output, "table");
        can.page.Append(can, table, [{text: ["1. 选择用户节点 ->", "caption"]}])

        can.page.AppendTable(can, table, msg, ["key", "user.route"], function(event, value, key, index, tr, td) {
            tr.className = "hidden";
            var uis = kit.AppendChild(can.ui.list, [{type: "tr", list: [{text: [key, "td"]}, {text: [msg["user.route"][index], "td"]}], dataset: {user: key}, click: function(event) {
                tr.className = "normal", uis.last.parentNode.removeChild(uis.last)
            }}])
        })
    },
    ocean: function(event, can, value, key, output) {
        if (value == "create") {can.Show();
            can.run(event, [], function(msg) {
                can.onimport.init(event, can, msg, key, output);
            });
        }
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
Volcanos("ondetail", {help: "组件详情", list: ["共享"],
    "共享": function(event, can, line, key, target) {
        can.user.toast(can.user.Share(can, {river: line.key}), "共享链接", 10000)
    },
})
Volcanos("onexport", {help: "导出数据", list: []})

