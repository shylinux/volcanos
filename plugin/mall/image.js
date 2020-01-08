Volcanos("onimport", {help: "导入数据", list: [],
    init: function(can, msg, cb, output, option) {output.innerHTML = msg.Result();
        can.page.Append(can, output, [{type: "img", src: "data:image/jpg;base64,"+msg.image[0], onclick: function(event) {
            var p = can.page.Append(can, output, [{view: ["what", "div"], dataset: {meta: ""+(event.offsetX+1)+","+(event.offsetY-30+1)+""}, style: {
                background: "red", position: "absolute", width: "10px", height: "10px",
                left: event.offsetX+1+"px", top: event.offsetY+30+1+"px",
            }, onclick: function(event) {
                p.parentNode.removeChild(p)
            }}]).what
        }}])
    },
})
Volcanos("onaction", {help: "组件交互", list: [],
})
Volcanos("onchoice", {help: "组件菜单", list: ["提交"],
    "提交": function(event, can, msg, key, target) {
        can.run(event, ["check", can.page.Select(can, can.target, "div.what", function(item) {return item.dataset.meta}).join(",")], function(msg) {
            can.user.toast(msg.result_message[0])
        }, true)
    },
})
Volcanos("ondetail", {help: "组件详情", list: ["选择", "修改", "复制"],
    "选择": "select",
    "删除": "delete",
    "复制": function(event, can, msg, cmd, target) {
        can.user.toast(can.page.CopyText(can, svg.innerHTML), "复制成功")
    },
})
Volcanos("onexport", {help: "导出数据", list: []})



