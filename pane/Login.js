Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, conf, output, action, option, field) {
        var ui = can.page.Appends(can, option, [
            {text: ["账号: ", "label"]}, {username: []}, {type: "br"},
            {text: ["密码: ", "label"]}, {password: []}, {type: "br"},
            {button: ["密码登录", function(event, cmd) {
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
            }]},
            {button: ["扫码登录", function(event, cmd) {
                can.onimport.username(event, can, "", function(event, msg) {
                    switch (msg.detail[0]) {
                        case "space":
                            if (msg.detail[1] == "share") {can._share = msg.detail[2]
                                can.user.toast({title: "请用微信扫描", list: [{img: [can.user.Share(can, {
                                    path: "/share/"+msg.detail[2],
                                }, true)]}]})
                                return true
                            }
                            break
                        case "sessid":
                            can.user.Cookie(can, "sessid", msg.detail[1])
                            can.Hide(), can.Export(event, "", "login")
                            can.user.toast("")
                            return true
                    }
                })
                event.stopPropagation()
                event.preventDefault()
                return true
            }]},
            {type: "br"},
        ])
    },
    username: function(event, can, value, cmd, output) {can._username = value
        return can._socket = can._socket || can.misc.WSS(can, function(event, msg) {
            if (msg.Option("_handle")) {return can.user.toast(msg.result.join(""))}
            if (typeof cmd == "function" && cmd(event, msg)) {return msg.Reply(msg)}

            switch (msg.detail[0]) {
                case "space": can._share = msg.detail[2]; break
                case "pwd": msg.Echo("hello world"); break
            }
            msg.Reply(msg)
        })
    },
    login: function(event, can, value, cmd, output) {
        if (!can.user.Cookie("sessid")) {can.Show(event, 400, 400); return}
            can.run(event||{}, ["check"], function(msg) {var user = msg.nickname && msg.nickname[0] || msg.Result()
                user? can.Export(event, user, "username"): can.Show(event, -1, -1)
            })
    },
})
Volcanos("onaction", {help: "组件交互", list: []})
Volcanos("onchoice", {help: "组件菜单", list: []})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})

