Volcanos("onfigure", {help: "控件详情", list: [],
    upload: {click: function(event, can, value, cmd, target) {
        if (!can.onfigure._prepare(event, can, value, cmd, target)) {return}
        can.figure.stick = true
        var action = can.page.AppendAction(can, can.figure.action, [{type: "input", data: {name: "upload", type: "file"}}, "上传", "关闭"], function(event, value, cmd) {
            switch (value) {
                case "关闭": can.onfigure._release(event, can, value, cmd, target); return
            }

            var msg = can.Event(event);
            msg.upload = action.upload.files[0]
            can.run(event, ["action", "上传"], true, function(msg) {
                can.user.toast("上传成功")
            })
        })
    }},
    _prepare: function(event, can, value, cmd, target) {if (can.figure) {return}
        can.figure = can.page.Append(can, document.body, [{view: ["input "+cmd, "fieldset"], style: {
            position: "absolute", left: "20px", top: event.clientY+10+"px",
        }, list: [{text: [cmd, "legend"]}, {view: ["action"]}, {view: ["output"]}], onmouseleave: function(event) {
            !can.figure.stick && can.onfigure._release(event, can, value, cmd, target)
        }}])
        return can.figure
    },
    _release: function(event, can, value, cmd, target) {
        can.page.Remove(can, can.figure.first); delete(can.figure);
    },
})
