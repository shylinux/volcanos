Volcanos("onimport", {help: "导入数据", list: [],
    init: function(can, msg, output) {output.innerHTML = "";
        msg.Table(function(item, index) {
            can.page.Append(can, output, [{view: ["item"], list: [{text: [item.key]}], click: function(event) {
                can.Export(event, item.key, "storm")
            }}])
        })
    },
    river: function(event, can, value, key, output) {
        can.run(event, [value], function(msg) {
            can.onimport.init(can, msg, output)
            can.Export(event, msg.key[0], "storm")
        })
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
    "复制": function(event, can, msg, value, index, key, target) {
        can.user.toast(can.page.CopyText(can, target.innerHTML), "复制成功")
    },
    "下载": function(event, can, msg, value, index, key, target) {
        can.page.Download(can, key, target.innerHTML);
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




