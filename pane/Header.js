Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, meta, list, cb, target) {
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
            can.user.login(can, init)
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
            if (can.Conf("username").length > 10) {
                can.Conf("username", can.Conf("username").slice(0, 10))
            }

            can.user.isMobile || can.core.List(msg.result||["github.com/shylinux/contexts"], function(title) {
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

            can.user.isMobile || (can.search = can.page.Append(can, can._output, [{view: "search", list: [{type: "input", onkeydown: function(event) {
                switch (event.key) {
                    case "Enter": can.run(event, ["search", "Search.onimport.input", "*", event.target.value]); break
                }
            }, }], }]).input)

            var height = document.body.offsetHeight
            var ui = can.page.Append(can, can._output, can.core.List(["Search", "River", "Footer"], function(item) {
                return {view: "item", list: [{type: "input", data: {name: item, type: "button", value: item.toLowerCase()},
                    onclick: function(event) {
                        if (item == "white") {
                            can.page.Modify(can, document.body, {className: item})
                            return
                        }
                        if (item == "black") {
                            can.page.Modify(can, document.body, {className: item})
                            return
                        }
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
            }));

            if (location.protocol == "chrome-extension:") {
                ui.River.click()
            } else if (can.user.Search(can, "pod")) {
                ui.River.click(), ui.Footer.click()
            } else if (can.user.isMobile) {
                ui.River.click(), ui.Footer.click()
            }

            typeof cb == "function" && cb()
        })
    },
    time: function(event, can, key, target) {
        var list = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
        target.innerHTML = list[(new Date()).getDay()]+" "+can.base.Time().split(" ")[1]
    },
})
