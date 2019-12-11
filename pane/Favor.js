Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, conf, output, action, option, field) {
        can.Show(400, 100, 100), can.Hide();
        can.page.Append(can, option, [{input: ["cmd", function(event) {
            can.page.oninput(event, can)

            function run(cmds) {cmds = cmds.split(" ")
                var cmd = cmds[0]

                var msg = can.Event(event, {detail: cmds});
                var cb = can.onexport[cmd]
                if (typeof cb == "function") {
                    cb(event, can, msg, cmds, output);
                } else {
                    can.Export(event, msg, "favor")
                }

                if (!msg._hand) {
                    can.run(event, cmds, function(msg) {
                        (output.innerHTML = msg.Result()) == ""? (can.target.style.height = "100px"): (can.target.style.height = "");
                        event.target.value = "";
                    }, true)
                } else {
                    output.innerHTML = msg.Result();
                    event.target.value = "";
                }
                return msg
            }

            switch (event.key) {
                case "Enter": run(event.target.value.trim()); break
                case "Escape": can.Hide(); break
            }
        }]}])
    },
})
Volcanos("onaction", {help: "组件交互", list: [],
    onmousedown: function(event, can) {
        can.moving = !can.moving;
        can.movarg = {
            x: event.x, y: event.y,
            top: can.target.offsetTop,
            left: can.target.offsetLeft,
        };
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
Volcanos("onchoice", {help: "组件菜单", list: []})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: [], 
    pwd: function(event, can, msg, cmd, output) {
        msg.Echo("hello world")
    },
    time: function(event, can, msg, cmd, output) {
        msg.Echo(can.base.Time())
    },
})



