Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, conf, output, action, option, field) {output.innerHTML = "";
        function create(event, cmd) {
            if (!ui.name.value) {ui.name.focus(); can.user.toast("请输入群名"); return}

            var list = []
            can.page.Select(can, ui.list, "tr", function(item, index) {if (index > 0) {
                list.push(item.dataset.pod)
                list.push(item.dataset.key)
                list.push(item.dataset.index)
                list.push(item.dataset.help)
            }})

            var name = ui.name.value;
            switch (event.target.value) {
                case "创建应用": cmd = "spawn"; break
                case "追加应用": cmd = "append", name = can.Conf("storm"); break
            }

            can.run(event, [can.Conf("river"), cmd, name].concat(list), function(msg) {
                can.Hide(), can.Export(event, "update", "storm");
            })
        }

        can.page.AppendAction(can, field, [{type: "text", name: "pod"}])

        var device = can.page.Append(can, field, [{"view": ["device", "table"]}]).last
        var ui = can.page.Append(can, field, [{view: ["create"], list: [
            {input: "name", value: can.Conf("def_name"), title: "应用名称"},
            {button: ["创建应用", create]},
            {button: ["追加应用", create]},
            {name: "list", view: ["list", "table"], list: [
                {text: ["3. 已选命令列表", "caption"]},
                {row: ["ctx", "cmd", "name", "help"], sub: "th"},
            ]},
        ]}])
        can.device = device
        can.ui = ui
    },
    init: function(event, can, msg, key) {can.output.innerHTML = ""; can.Show(event, -100, -100);
        var table = can.page.Append(can, can.output, "table")

        can.page.Append(can, table, [{text: ["1. 选择用户节点 ->", "caption"]}])
        can.page.AppendTable(can, table, msg, ["type", "name", "user"], function(event, value, key, index, tr, td) {

            can.page.Select(can, table, "tr.select", function(item) {can.page.ClassList.del(can, item, "select")})
            can.page.ClassList.add(can, tr, "select")

            var node = msg.name[index];
            can.run(event, [can.Conf("river"), msg.user[index], node], function(com) {var list = com.Table()
                can.page.Appends(can, can.device, [{text: ["2. 选择模块命令 ->", "caption"]}])
                can.com = list, can.command = can.page.AppendTable(can, can.device, com, ["key", "index", "name", "help"], function(event, value, key, index, tr, td) {
                    var line = list[index];
                    line.pod = node;
                    var last = can.page.Append(can, can.ui.list, [{
                        row: [line.key, line.index, line.name, line.help], dataset: line,
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
    steam: function(event, can, value, key, field) {
        if (value == "create") {
            can.run(event, [can.Conf("river")], function(msg) {
                can.onimport.init(event, can, msg, key, field);
            });
        }
    },
    river: function(event, can, value, key, field) {if (value == "update") {return}
        can.Conf("river", value)
    },
    storm: function(event, can, value, key, field) {if (value == "update") {return}
        can.Conf("storm", value)
    },
})
Volcanos("onaction", {help: "组件交互", list: ["关闭", "刷新", {input: ["pod"]}, {input: ["cmd", function(event, can) {
}, function(event, can) {
    if (event.key == "Enter") {
        can.page.Select(can, can.command, "tr", function(tr, index) {
            if (index == 0) {return}
            if (!can.page.ClassList.has(can, tr, "hidden")) {
                tr.firstChild.click()
                event.target.value = ""
            }
        })
        return
    }
    can.page.Select(can, can.command, "tr", function(tr, index) {
        if (index == 0) {return}
        if (can.com[index-1].index.indexOf(event.target.value) > -1) {
            can.page.ClassList.del(can, tr, "hidden")
        } else {
            can.page.ClassList.add(can, tr, "hidden")
        }
    })
}]}],
    "关闭": function(event, can, meta, key, field) {
        can.Hide()
    },
    "刷新": function(event, can, meta, key, field) {
        can.Import(event, "create", "steam")
    },
})
Volcanos("onchoice", {help: "组件菜单", list: ["关闭", "刷新"]})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})

