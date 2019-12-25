Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, conf, output, action, option, field) {
        var ui = can.page.Appends(can, option, [
            {text: ["username: ", "label"]}, {username: []}, {type: "br"},
            {text: ["password: ", "label"]}, {password: []}, {type: "br"},
            {button: ["login", function(event, cmd) {
                if (!ui.username.value) {ui.username.focus(); return}
                if (!ui.password.value) {ui.password.focus(); return}

                can.run(event, ["login", ui.username.value, ui.password.value], function(msg) {
                    if (msg.result && msg.result.length > 0) {
                        can.Hide(), can.Export(event, "", "login")
                    } else {
                        can.user.toast("用户或密码错误")
                    }
                })
                event.stopPropagation()
                event.preventDefault()
                return true
            }]}, {type: "br"},
        ])
    },
    login: function(event, can, value, cmd, output) {
        if (!can.user.Cookie("sessid")) {can.Show(event, 400, 400); return}
            can.run(event||{}, ["check"], function(msg) {var user = msg.Result()
                user? can.Export(event, user, "username"): can.Show(event, -1, -1)
            })
    },
})
Volcanos("onaction", {help: "组件交互", list: []})
Volcanos("onchoice", {help: "组件菜单", list: []})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})

