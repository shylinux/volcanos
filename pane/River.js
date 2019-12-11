Volcanos("onimport", {help: "导入数据", list: [],
    init: function(event, can, msg, key, output) {output.innerHTML = "";
        can.page.AppendItem(can, output, msg.Table(), can.user.Search(can, "river"), function(event, line, item) {
            can.Export(event, line.key, "river")
        })
    },
    username: function(event, can, value, key, output) {
        can.run(event, [], function(msg) {
            can.onimport.init(event, can, msg, key, output)
        })
    },
    river: function(event, can, value, key, output) {
        if (value == "update") {
            can.run(event, [], function(msg) {
                can.onimport.init(event, can, msg, key, output)
            })
        }
    },
    favor: function(event, can, msg, cmd, output) {
        can.page.Select(can, output, "div.item>span", function(item) {
            if (item.innerText == msg.detail[0])  {
                msg.Echo("storm", msg.detail[0])
                item.click(), msg._hand = true;
            }
        })
    },
})
Volcanos("onaction", {help: "组件交互", list: ["创建", "刷新"],
    "创建": function(event, can, meta, key, output) {
        can.Export(event, "create", "ocean")
    },
    "刷新": function(event, can, meta, key, output) {
        can.run(event, [], function(msg) {
            can.onimport.init(event, can, msg, key, output)
        })
    },
})
Volcanos("onchoice", {help: "组件菜单", list: ["创建", "刷新"],
    "创建": function(event, can, msg, key, target) {
        can.Export(event, "create", "ocean")
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

