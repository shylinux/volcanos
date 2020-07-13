Volcanos("onimport", {help: "导入数据", list: [],
    init: function(event, can, msg, cmd, field) {can.output.innerHTML = "";
        can.page.AppendItem(can, can.output, msg.Table(), can.user.Search(can, can.Name()), function(event, line, item) {
            can.Export(event, line.key, can.Name())
        })
    },
    river: function(event, can, value, cmd, field) {if (value == "update") {
        can.run(event, [], function(msg) {
            can.onimport.init(event, can, msg, cmd, field)
        })
    }},
    favor: function(event, can, msg, cmd, field) {if (msg._hand) {return}
        var cmds = msg.detail, key = cmds[0];
        if (key == can.Name()) {key = cmds[1], cmds = cmds.slice(1)}

        can.page.Select(can, field, "div.item>span", function(item) {
            if (item.innerText == key)  {
                item.click(), msg._hand = true;
                msg.Echo(can._name, " ", key)
            }
        })
    },
})
Volcanos("onaction", {help: "组件交互", list: ["创建", "刷新"],
    "创建": function(event, can, meta, cmd, field) {
        can.Export(event, "create", "ocean")
    },
    "刷新": function(event, can, meta, cmd, field) {
        can.Import(event, "update", can.Name())
    },
})
Volcanos("onchoice", {help: "组件菜单", list: ["创建", "刷新", "宽度"],
    "宽度": function(event, can, meta, cmd, field) {
        var begin;
        function end() {
            field.onmousedown = null;
            field.onmousemove = null;
            field.style.cursor = "";
            begin = null;
        }

        field.style.cursor = "e-resize"
        field.onmousedown = function(event) {if (begin) {return end()}
            begin = {x: event.clientX, width: field.offsetWidth}
        }
        field.onmousemove = function(event) {if (!begin) {return}
            field.dataset.width = field.style.width = begin.width + event.clientX - begin.x + "px";
            can.Export(event, "", "layout");
        }

        can.user.prompt("输入宽度", function(width) {
            field.dataset.width = field.style.width = width + "px"
            can.Export(event, "", "layout")
            end()
        }, field.offsetWidth)
    },
})
Volcanos("ondetail", {help: "组件详情", list: ["共享", "重命名", "删除"],
    "共享": function(event, can, line, value, cmd, item) {
        var msg = can.Event(event);
        msg.Option("name", line.name)
        msg.Option("text", line.key)
        can.Export(event, can.Name(), "share")
    },
    "重命名": function(event, can, line, value, cmd, item) {
        can.user.prompt("输入新名：", function(name) {
            can.run(event, [value, "rename", name], function(msg) {
                can.Import(event, "update", can.Name())
            })
        }, line.name)
    },
    "删除": function(event, can, line, value, cmd, item) {
        can.run(event, [value, "remove"], function(msg) {
            can.Import(event, "update", can.Name())
        })
    },
})
Volcanos("onexport", {help: "导出数据", list: []})

