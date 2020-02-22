Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, conf, output, action, option, field) {
        can.Show(event, 400, 100), can.Hide();
        can.target.style.height = ""
        can.target.style.width = ""

        function res(msg) {
            if (msg._hand) {ui.cmd.value = "", output.innerHTML = "";
                msg.result && msg.result.length > 0? can.page.Append(can, output, [{text: msg.Result()}]):
                    can.page.AppendTable(can, output, msg, msg.append);
            }
            return msg
        }
        function run(event, cmds) {cmds = can.core.Split(cmds);
            var cmd = cmds[0]; if (cmd == "") {return}
            can.msg = can.Event(event, {detail: cmds});

            var cb = can.onexport[cmd];
            typeof cb == "function"? cb(event, can, can.msg, cmds, output): can.Export(event, can.msg, "favor");
            return can.msg._hand? res(can.msg): can.run(event, cmds, res, true);
        }

        var ui = can.page.Append(can, option, [{input: ["cmd", function(event) {
            switch (event.key) {
                case "Enter": run(event, event.target.value); return
                case "Escape": can.Hide(); return
                default: if (event.target.value.endsWith("j") && event.key == "k") {
                    can.page.DelText(event.target, event.target.selectionStart-1, 2)
                    event.target.value == ""? can.Hide(): run(event, event.target.value)
                    return
                }
            }

            can.page.oninput(event, can)
            return true
        }, function(event) {
            switch (event.key) {
                default: return false
            }
            event.stopPropagation()
            event.preventDefault()
            return true
        }]}])
    },

    space: function(event, can, value, cmd, field) {
        can.page.Select(can, can.Show(), "input.cmd", function(item) {
            item.focus()
        })
    },
})
Volcanos("onaction", {help: "组件交互", list: ["关闭", "清空", "下载"],
    onmousedown: function(event, can) {
        if (event.ctrlKey) {can.moving = !can.moving, can.movarg = {
            left: can.target.offsetLeft,
            top: can.target.offsetTop,
            x: event.x, y: event.y,
        }}
    },
    onmousemove: function(event, can) {
        if (can.moving) {
            can.target.style.top = can.movarg.top + event.y - can.movarg.y + "px"
            can.target.style.left = can.movarg.left + event.x - can.movarg.x + "px"
        }
    },
    onmouseup: function(event, can) {
    },
    "关闭": function(event, can, value, cmd, field) {
        can.Hide();
    },
    "清空": function(event, can, value, cmd, field) {
        can.output.innerHTML = ""
    },
    "下载": function(event, can, value, cmd, field) {
        var list = can.msg.Export(can._name);
        can.page.Download(can, list[0]+list[1], list[2]);
    },
})
Volcanos("onchoice", {help: "组件菜单", list: ["下载", "关闭"]})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: [], 
    time: function(event, can, msg, cmd, field) {msg.Echo(can.base.Time())},
})

