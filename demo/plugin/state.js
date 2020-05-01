Volcanos("onimport", {help: "导入数据", list: []})
Volcanos("onaction", {help: "组件交互", list: []})
Volcanos("onchoice", {help: "组件菜单", list: ["执行", "返回", "共享", "重命名", "选项", "加参", "减参", "克隆", "删除"],
    "执行": function(event, can, msg, cmd, field) {can.Runs(event)},
    "返回": function(event, can, msg, cmd, field) {can.Last(event)},
    "共享": function(event, can, msg, cmd, field) {
        can.user.input(event, can, ["name", "text"], function(event, cmd, meta, list) {
            var msg = can.Event(event);
            msg.Option("name", meta.name)
            msg.Option("text", meta.text)
            can.Conf("args", JSON.stringify(can.Option()))
            can.core.List(["node", "group", "index", "args"], function(key) {
                msg.Option(key, can.Conf(key))
            })
            can.Export(event, "action", "share")
            return true
        })
    },
    "重命名": function(event, can, msg, cmd, field) {var meta = field.Meta;
        meta.help = can.user.prompt("", function(help) {
            meta.help = help
        }, meta.help)
    },
    "选项": function(event, can, msg, cmd, field) {
        can.user.input(event, can, ["name", "value"], function(event, cmd, meta, list) {
            var data = {type: "text", value: meta.value||""}
            can.page.ClassList.add(can, data, "opts");

            var input = {type: "input", name: meta.name, data: data};
            var target = can.Dream(can.option, "option", input)[input.name];
            return true
        })
    },
    "加参": function(event, can, msg, cmd, field) {can.Append()},
    "减参": function(event, can, msg, cmd, field) {can.Remove(event)},
    "克隆": function(event, can, msg, cmd, field) {can.Clone(event)},
    "删除": function(event, can, msg, cmd, field) {can.Delete(event)},
})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})

