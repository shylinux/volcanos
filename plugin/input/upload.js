Volcanos("onfigure", {help: "控件详情", list: [],
    upload: {click: function(event, can, value, cmd, target, figure) {figure.stick = true
        var begin = new Date();
        function show(event, value, total, loaded) {
            var now = new Date(); can.page.Appends(can, figure.output, [
                {view: ["progress"], style: {height: "10px", border: "solid 2px red"}, list: [{
                    view: ["progress"], style: {height: "10px", width: value + "%", background: "red"},  
                }]},
                {text: [value+"%", "div"], style: {"float": "right"}},
                {text: [can.base.Duration(now - begin), "div"], style: {"float": "left"}},
                {text: [can.base.Size(loaded)+"/"+can.base.Size(total), "div"], style: {"text-align": "center"}},
            ]);
        }

        var action = can.page.AppendAction(can, figure.action, [
            {type: "input", data: {name: "upload", type: "file", onchange: function(event) {
                var file = action.upload.files[0]
                console.log(file)
                show(event, 0, file.size, 0)
            }}, style: {width: "200px"}}, "上传", "关闭"], function(event, value, cmd) {
                if (action.upload.files.length == 0) {return action.upload.focus()}
                if (value == "关闭") {figure.stick = false; return}

                var msg = can.Event(event);
                can.page.Select(can, can._plugin.option, "input", function(item) {
                    item.name && item.value && msg.Option(item.name, item.value)
                })

                // 上传文件
                begin = new Date();
                msg._progress = show
                msg.upload = action.upload.files[0];
                can.run(event, ["action", "upload"], function(msg) {
                    can.user.toast(can, "上传成功")
                }, true);
            })
    }},
})
