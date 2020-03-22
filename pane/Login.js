Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, conf, output, action, option, field) {
        can.user.login = function(cb) {
            can.misc.WSS(can, "", {node: "active"}, function(event, msg, cmd, arg) {
                switch (cmd) {
                    case "space":
                        can._share = arg[1]
                        break
                    case "sessid":
                        can.user.Cookie(can, "sessid", arg[0]), can.user.toast(""), can.Hide()
                        typeof cb == "function" && cb({name: msg["user.name"]})
                        break
                }
            })
            can.user.Cookie("sessid")? can.onaction.check(event, can, cb, "check", output):
                can.onaction.login(event, can, cb, "login", output)
        }
    },
    share: function(event, can, value, cmd, target) {var msg = can.Event(event)
        var list = [];
        switch (value) {
            case "storm": list.push("river", msg.Conf("river")); break
            case "action": list.push("river", msg.Conf("river")), list.push("storm", msg.Conf("storm")); break
        }
        can.run(event, ["share", value, msg.Option("name"), msg.Option("text")].concat(list), function(msg) {
            var p = "/share/" + msg.Result(); can.user.toast({title: msg.Option("name"),
                text: [{text: '<a target="_blank" href="'+can.user.Share(can, {path: p}, true)+'">'+p+'</a>'}, {img: p+"/share"}],
                width: 300, height: 400, duration: 300000,
            })
        })
    },
})
Volcanos("onaction", {help: "组件交互", list: [],
    check: function(event, can, cb, cmd, target) {
        can.run(event||{}, ["check"], function(msg) {var user = msg.nickname && msg.nickname[0] || msg.Result()
            user? typeof cb == "function" && cb({name: user}): can.onaction.login(event, can, cb, "login", target)
        })
    },
    login: function(event, can, cb, cmd, target) {
        var ui = can.page.Appends(can, target, [
            {text: ["账号: ", "label"]}, {username: []}, {type: "br"},
            {text: ["密码: ", "label"]}, {password: []}, {type: "br"},
            {button: ["密码登录", function(event, cmd) {
                if (!ui.username.value) {ui.username.focus(); return}
                if (!ui.password.value) {ui.password.focus(); return}

                can.run(event, ["login", ui.username.value, ui.password.value], function(msg) {
                    if (msg.result && msg.result.length > 0) {
                        can.Hide(), can.onaction.check(event, can, cb, "check", target)
                        return
                    }
                    can.user.toast("用户或密码错误")
                })
            }]},
            {button: ["扫码登录", function(event, cmd) {
                can.user.toast({title: "请用微信扫码("+can._share+")", list: [{img: [can.user.Share(can, {
                    path: "/share/"+can._share+"/value",
                }, true)]}]})
            }]},
            {type: "br"},
        ])
        can.Show(event, -1, -1)
    },
})
Volcanos("onchoice", {help: "组件菜单", list: []})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})

