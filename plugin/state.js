Volcanos("onimport", {help: "导入数据", list: []})
Volcanos("onaction", {help: "组件交互", list: []})
Volcanos("onchoice", {help: "组件菜单", list: [["display", "表格", "文档", "相册"],
    "执行", "返回", "加参", "减参", "克隆", "删除"],

    "表格": function(event, can, msg, cmd, field) {can.Show("table", can.msg)},
    "文档": function(event, can, msg, cmd, field) {can.Show("inner", can.msg)},
    "相册": function(event, can, msg, cmd, field) {can.Show("media", can.msg)},

    "返回": function(event, can, msg, cmd, field) {can.Last(event)},
    "执行": function(event, can, msg, cmd, field) {can.Runs(event)},
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

