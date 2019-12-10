Volcanos("onimport", {help: "导入数据", list: [],
    init: function(event, can, msg, key, output) {output.innerHTML = "";
        msg.Table(function(item, index) {if (!item.name) {return}
            can[item.name] = can.Plugin(can, item.name, item, function(event, cmds, cbs) {
                can.run(event, [item.river, item.storm, item.action].concat(cmds), cbs)
            }, can.page.AppendField(can, output, "item "+item.group+" "+item.name, item))
        })
    },
    river: function(event, can, value, key, output) {
        if (value == "update") {return}
        can.Conf("temp_river", value)
    },
    storm: function(event, can, value, key, output) {
        can.Cache(can.Conf("river")+"."+can.Conf("storm"), output, "some");

        can.Conf("river", can.Conf("temp_river"))
        can.Conf("storm", value)
        if (!can.Cache(can.Conf("river")+"."+can.Conf("storm"), output)) {
            can.run(event, [can.Conf("river"), can.Conf("storm")], function(msg) {
                can.onimport.init(event, can, msg, key, output)
            })
        }
    },
})
Volcanos("onaction", {help: "组件交互", list: [],
})
Volcanos("onchoice", {help: "组件菜单", list: ["返回", "清空", "复制", "下载", "表格", "绘图", "媒体"],
    "返回": function(event, can, msg, value, target) {
        can.run(event, ["", "Last"])
    },
    "清空": function(event, can, msg, value, target) {
        can.target.innerHTML = "";
    },
    "复制": function(event, can, msg, value, target) {
        var list = can.onexport.Format(can, msg, "data");
        can.user.toast(can.page.CopyText(can, list[2]), "复制成功")
    },
    "下载": function(event, can, msg, value, target) {
        var list = can.onexport.Format(can, msg, msg._plugin_name||"data");
        can.page.Download(can, list[0]+list[1], list[2]);
    },
})
Volcanos("ondetail", {help: "组件详情", list: ["选择", "修改", "删除", "复制", "下载"],
    "选择": "select",
    "删除": "delete",
    "修改": function(event, can, msg, value, index, key, td) {
        var text = td.innerHTML;
        can.page.Appends(can, td, [{type: "input", style: {width: td.clientWidth+"px"}, data: {onkeydown: function(event) {
            if (event.key != "Enter") {return}
            can.run(event, [index, "modify", key == "value" && msg.key? msg[key][index]: key, event.target.value,], function(msg) {
                td.innerHTML = event.target.value;
                can.user.toast("修改成功")
            }, true)
        }}}])
    },
    "复制": function(event, can, msg, value, index, key, td) {
        can.user.toast(can.page.CopyText(can, td.innerHTML), "复制成功")
    },
    "下载": function(event, can, msg, value, index, key, td) {
        can.page.Download(can, key, td.innerHTML);
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    Format: function(can, msg, name) {
        var ext = ".csv", txt = can.page.Select(can, can.target, "tr", function(tr) {
            return can.page.Select(can, tr, "td,th", function(td) {return td.innerText}).join(",")
        }).join("\n");

        !txt && (ext = ".txt", txt = msg.result && msg.result.join("") || "");
        return [name, ext, txt]
    },
})

