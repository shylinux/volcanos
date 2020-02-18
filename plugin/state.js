Volcanos("onimport", {help: "导入数据", list: [],
    favor: function(event, can, msg, cmd, output) {var key = msg.detail[0];
        var cb = can.onaction[key]; if (typeof cb == "function") {cb(event, can, msg, cmd, output); return msg.Echo(can._name, " onaction ", key), msg._hand = true}
        var cb = can.onchoice[key]; if (typeof cb == "function") {cb(event, can, msg, cmd, output); return msg.Echo(can._name, " onchoice ", key), msg._hand = true}

        var sub = can[key]; if (sub && sub.target) {sub.target.focus; return msg.Echo(can._name, " ", sub._name, " ", key), msg._hand = true}
        can._output && can._output.Import(event, msg, cmd)
    },
})
Volcanos("onaction", {help: "组件交互", list: []})
Volcanos("onchoice", {help: "组件菜单", list: ["执行", "返回", "重命名", "选项", "加参", "减参", "克隆", "删除"],
    "执行": function(event, can, msg, cmd, field) {can.Runs(event)},
    "返回": function(event, can, msg, cmd, field) {can.Last(event)},
    "重命名": function(event, can, msg, cmd, field) {can.Rename(event)},
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
Volcanos("ondetail", {help: "组件详情", list: ["copy", "复制", "下载"]})
Volcanos("onexport", {help: "导出数据", list: ["复制", "下载"],
    you_status: function(event, can, msg, value, key, index) {
        var cmd = [can.option.pod.value, msg.you[index]]
        value == "start" && cmd.push("stop")
        var timer = can.user.toast(cmd.join(" ")+"...", msg.you[index], 5000)
        can.Run(event, cmd, function(msg) {
        })
    }
})

