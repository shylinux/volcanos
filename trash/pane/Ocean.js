Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, conf, output, action, option, field) {output.innerHTML = "";
        var ui = can.page.Append(can, field, [{view: ["create"], list: [
            {input: "name", value: can.Conf("def_name"), title: "群聊名称"},
            {button: ["创建群聊", function(event) {
                if (!ui.name.value) {ui.name.focus(); can.user.toast("请输入群名"); return}

                var list = can.page.Select(can, ui.list, "tr", function(item, index) {if (index > 0) {
                    return item.dataset.user
                }})
                if (list.length == 0) {can.user.toast("请添加组员"); return}

                can.run(event, ["spawn", ui.name.value].concat(list), function(msg) {
                    can.Hide(), can.Export(event, "update", "river");
                })
            }]}, {name: "list", view: ["list", "table"], list: [
                {text: ["2. 已选用户列表", "caption"]},
                {row: ["username", "usernode"], sub: "th"},
            ]},
        ]}])
        can.ui = ui
    },
    init: function(event, can, msg, key, field) {can.output.innerHTML = ""; can.Show(event, -100, -100);
        var table = can.page.Append(can, can.output, "table");
        can.page.Appends(can, table, [{text: ["1. 选择用户节点 ->", "caption"]}])

        can.page.AppendTable(can, table, msg, ["username", "usernode"], function(event, value, key, index, tr, td) {tr.className = "hidden";
            var uis = can.page.Append(can, can.ui.list, [{type: "tr", list: [
                {text: [msg["username"][index], "td"]},
                {text: [msg["usernode"][index], "td"]},
            ], dataset: {user: value}, click: function(event) {
                tr.className = "normal", can.page.Remove(can, uis.tr)
            }}])
        })
    },
    ocean: function(event, can, value, key, field) {
        if (value == "create") {can.Show(event);
            can.run(event, [], function(msg) {
                can.onimport.init(event, can, msg, key, field);
            });
        }
    },
})
Volcanos("onaction", {help: "组件交互", list: ["关闭", "刷新"],
    "关闭": function(event, can, meta, key, field) {
        can.Hide()
    },
    "刷新": function(event, can, meta, key, field) {
        can.Import(event, "create", "ocean")
    },
})
Volcanos("onchoice", {help: "组件菜单", list: ["关闭", "刷新"]})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})
