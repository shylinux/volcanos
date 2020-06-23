Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, meta, list, cb, target) {
    },
    demo: function(can, msg, cmd, cb) {
        msg.Echo("hello demo world")
        cb(msg)
    },
})
Volcanos("onaction", {help: "交互数据", list: [], _init: function(can, msg, list, cb, target) {
        function init() {
            can.onexport._init(can, msg, list, function() {
                can.user.title(can.user.Search(can, "pod"))
                can.run(msg._event, ["search", "River.onaction._init"])
                can.run(msg._event, ["search", "Footer.onaction._init"])
            }, target)
        }
        can.run({}, ["check"], function(msg) { if (msg.Result()) { return init() }
            var ui = can.user.input({}, can, [
                {username: "username", name: "用户"},
                {password: "password", name: "密码"},
                {button: [["登录", function(event) {
                    can.run({}, ["login", ui["用户"].value, ui["密码"].value], function(msg) {
                        if (msg.Result()) { can.page.Remove(can, ui.first); return init() }
                        can.user.alert("用户或密码错误")
                    })
                }], ["扫码", function(event) {
                    // TODO
                }]]},
            ], function(event, button, data, list) {
                // TODO
            })
        })
    },
    title: function(event, can, key) { var msg = can.request(event)
        can.core.List(["share", "pod"], function(key) { var value = can.user.Search(can, key)
            value != undefined && msg.Option(key, can.user.Search(key))
        })
        var args = {}; can.core.List(msg.option, function(key) { args[key] = msg.Option(key) })
        location.href = can.user.Share(can, args, true)
    },
    username: function(event, can, key) {
        if (can.user.confirm("logout?")) {
            can.user.Cookie(can, "sessid", "")
            can.user.reload(true)
        }
    },
})
Volcanos("onexport", {help: "导出数据", list: [], _init: function(can, msg, list, cb, target) {
        can.run(msg._event, [], function(msg) { can._output.innerHTML = ""
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

            can.page.Append(can, can._output, [{view: "search", list: [{type: "input", onkeydown: function(event) {
                switch (event.key) {
                    case "Enter": can.run(event, ["search", "Search.onimport.input", event.target.value]); break
                }
            }, }], }])

            var height = document.body.offsetHeight
            var ui = can.page.Append(can, can._output, can.core.List(["Search", "River", "Storm", "Footer"], function(item) {
                return {view: "item", list: [{type: "input", data: {name: item, type: "button", value: item.toLowerCase()},
                    onclick: function(event) {
                        if (item == "Footer") { can.page.Select(can, document.body, "fieldset.Action", function(item) {
                            if (item.style.height) {
                                height = document.body.offsetHeight
                                can.page.Select(can, item, "div.output")[0].style.height = ""
                                item.style.height = ""
                            } else {
                                can.page.Select(can, item, "div.output")[0].style.height = height-100+"px"
                                item.style.height = height-88+"px"
                            }
                        }) }

                        can.page.Select(can, document.body, "fieldset."+item, function(item) {
                            can.page.Modify(can, item, {style: {display: item.style.display == "none"? "block": "none"}})
                        })
                    },
                }]}
            })); ui.River.click(), ui.Footer.click(), ui.Storm.click()

            typeof cb == "function" && cb()
        })
    },
    time: function(event, can, key, target) { target.innerHTML = can.base.Time().split(" ")[1] },
})
