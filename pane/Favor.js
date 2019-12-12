Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, conf, output, action, option, field) {
        can.Show(event, 400, 100), can.Hide();
        can.target.style.height = ""
        can.target.style.width = ""

        function res(msg) {
            if (msg._hand) {ui.cmd.value = "";
                output.innerHTML = msg.Result()
            }
            return msg
        }
        function run(event, cmds) {cmds = cmds.trim().split(" ");
            var cmd = cmds[0]; if (cmd == "") {return}
            var msg = can.Event(event, {detail: cmds});
            can.msg = msg;

            var cb = can.onexport[cmd];
            typeof cb == "function"? cb(event, can, msg, cmds, output): can.Export(event, msg, "favor");

            return msg._hand? res(msg): can.run(event, cmds, res, true);
        }

        var ui = can.page.Append(can, option, [{input: ["cmd", function(event) {
            can.page.oninput(event, can)

            switch (event.key) {
                case "Enter": run(event, event.target.value); break
                case "Escape": can.Hide(); break
                default: if (event.target.value.endsWith("j") && event.key == "k") {
                    can.page.DelText(event.target, event.target.selectionStart-1, 2)
                    event.target.value == ""? can.Hide(): run(event, event.target.value)
                    break
                } return false
            }
            event.stopPropagation()
            event.preventDefault()
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
})
Volcanos("onaction", {help: "组件交互", list: [],
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
        // can.moving = false;
    },
})
Volcanos("onchoice", {help: "组件菜单", list: ["下载"],
    "下载": function(event, can, msg, cmd, target) {msg = msg || can.msg;
        var list = msg.Export(can._name);
        can.page.Download(can, list[0]+list[1], list[2]);
    },
})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: [], 
    hi: function(event, can, msg, cmd, output) {msg.Echo("hello world")},
    time: function(event, can, msg, cmd, output) {msg.Echo(can.base.Time())},
})

