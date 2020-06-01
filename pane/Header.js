Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, meta, list, cb, target) {
    },
})
Volcanos("onaction", {help: "交互数据", list: [], _init: function(can, msg, list, cb, target) {
        function init() {
            can.onexport._init(can, msg, list, function() {
                can.user.title(can.user.Search(can, "pod"));
                can.run(msg._event, ["search", "River.onaction._init"]);
                can.run(msg._event, ["search", "Footer.onaction._init"]);
            }, target)
        }
        can.run({}, ["check"], function(msg) {
            if (msg.Result()) { return init() }

            var ui = can.user.input({}, can, [
                {username: "username", name: "用户"},
                {password: "password", name: "密码"},
                {button: [["登录", function(event) {
                    var username = ui["用户"].value
                    var password = ui["密码"].value
                    can.run({}, ["login", username, password], function(msg) {
                        if (msg.Result()) {
                            can.page.Remove(can, ui.first)
                            return init()
                        }
                        can.user.alert("用户或密码错误")
                    })
                }], "扫码"]},
            ], function(event, button, data, list) {
            })
        })
    },
    title: function(event, can, key) { var msg = can.request(event)
        can.core.List(["River", "Storm", "Action"], function(item) {
            can.run(event, ["search", item+".onexport.key"])
        })
        var args = {}; can.core.List(msg.option, function(key) { args[key] = msg.Option(key) })
        location.href = can.user.Share(can, args)
    },
    username: function(event, can, key) {
        if (can.user.confirm("logout?")) {
            can.user.Cookie(can, "sessid", "")
            can.user.reload(true)
        }
    },
})
Volcanos("onexport", {help: "导出数据", list: [], _init: function(can, msg, list, cb, target) {
        can.run(msg._event, [], function(msg) { can._output.innerHTML = "";
            can.Conf("username", msg.Option("user.nick")||msg.Option("user.name"))

            can.core.List(msg.result||["github.com/shylinux/contexts"], function(title) {
                can.page.Append(can, can._output, [{view: ["title", "div", title],
                    click: function(event) { can.onaction["title"](event, can, "title") },
                }])
            })
            can.core.List(can.Conf("state")||["time", "username"], function(item) {
                can.page.Append(can, can._output, [{view: ["state "+item, "div", can.Conf(item)],
                    click: function(event) { can.onaction[item](event, can, item) },
                }])
            })
            can.page.Select(can, can._output, "div.state.time", function(item) {
                can.timer = can.Timer({interval: 1000, length: -1}, function(event) {
                    can.onexport.time(event, can, "time", item)
                })
            })
            typeof cb == "function" && cb()
        })
    },
    time: function(event, can, key, target) { target.innerHTML = can.base.Time().split(" ")[1] },
})
