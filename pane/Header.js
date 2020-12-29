(function() { const TITLE = "title", TOPIC = "topic", POD = "pod", STATE = "state", USERNAME = "username"
Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can._trans = {
            "river": "菜单",
            "search": "搜索",
            "setting": "设置",
            "pack": "打包页面",
            "white": "白色主题",
            "black": "黑色主题",
            "print": "打印主题",
            "logout": "退出",
        }
        can.onmotion.clear(can)
        can.onimport._title(can, msg, target)
        can.onimport._state(can, msg, target)
        can.onimport._search(can, msg, target)
        can.onimport._agent(can, msg, target)
        can.onimport._menu(can, msg, target)
        typeof cb == "function" && cb(msg)
    },
    _title: function(can, msg, target) {
        can.user.title(can.user.Search(can, TITLE) || can.user.Search(can, POD))
        can.user.isMobile || can.core.List(msg.result||["github.com/shylinux/contexts"], function(item) {
            can.page.Append(can, target, [{view: [TITLE, "div", item],
                click: function(event) { can.onaction.title(event, can) },
            }])
        })
    },
    _state: function(can, msg, target) {
        can.core.List(can.Conf(STATE)||["time", USERNAME], function(item) {
            can.page.Append(can, target, [{view: ["state "+item, "div", can.Conf(item)],
                click: function(event) { can.onaction[item](event, can, item) },
                _init: function(target) {
                    item == "time" && can.core.Timer({interval: 1000, length: -1}, function(event) {
                        can.onimport.time(can, target)
                    })
                },
            }])
        })
    },
    _search: function(can, msg, target) {
        can.user.isMobile || (can.search = can.page.Append(can, target, [{view: "search", list: [{type: "input", data: {placeholder: "search"}, onkeydown: function(event) {
            can.onkeypop.input(event, can)

            switch (event.key) {
                case "Enter": can.run(event, ["search", "Search.onimport.select", "*", event.target.value]); break
            }
        }, }], }]).input)
    },
    _agent: function(can, msg, target) {
        if (can.user.isMobile) {
            can.onaction.River(can)
            can.onaction.Footer(can)
        } else if (can.user.isExtension) {
            can.onaction.River(can)
        } else if (can.user.Search(can, POD)) {
            can.onaction.River(can)
            can.onaction.Footer(can)
        }
        can.user.isWeiXin && can.onimport._weixin(can)
    },
    _weixin: function(can, msg) { can.run({}, ["action", "wx"], function(msg) {
        can.require(["https://res.wx.qq.com/open/js/jweixin-1.6.0.js"], function(can) {
            can.user.agent = { __proto__: can.user.agent,
                getLocation: function(cb) { wx.getLocation({type: "gcj02", success: function (res) {
                    typeof cb == "function" && cb({latitude: parseInt(res.latitude*100000), longitude: parseInt(res.longitude*100000) })
                } }) },
                openLocation: function(msg) { wx.openLocation({
                    latitude: parseInt(msg.Option("latitude"))/100000,
                    longitude: parseInt(msg.Option("longitude"))/100000,
                    name: msg.Option("name"), address: msg.Option("text"),
                    scale: msg.Option("scale")||14, infoUrl: msg.Option("link"),
                }) },
                scanQRCode: function(cb) { wx.scanQRCode({ needResult: cb? 1: 0, scanType: ["qrCode","barCode"], success: function (res) {
                    typeof cb == "function" && cb(can.user.scan(res.resultStr))
                } }) },
                chooseImage: function(cb, count) { wx.chooseImage({count: count||9, sizeType: ['original', 'compressed'], sourceType: ['album', 'camera'], success: function (res) {
                    typeof cb == "function" && cb(res.localIds)
                } }) },
            }
            wx.config({debug: msg.Option("debug") == "true", jsApiList: can.core.Item(can.user.agent),
                nonceStr: msg.Option("noncestr"), timestamp: msg.Option("timestamp"),
                appId: msg.Option("appid"), signature: msg.Option("signature"),
            })
        }) })
    },
    _menu: function(can, msg, target) {
        can.page.Append(can, target, can.core.List(can.user.isMobile || can.user.isExtension || can.user.Search(can, POD)? ["river", "setting"]: ["setting"], function(item) {
            return {view: ["menus", "div", item], onclick: function(event) {
                var cb = can.onaction[item]; typeof cb == "function" && cb(event, can, item)
            }}
        }))
        can.menu = can.page.Append(can, target, [{view: ["menu", "some"], style: {float: "left"}}]).first
    },

    time: function(can, target) {
        target.innerHTML = can.base.Time(null, "%w %H:%M:%S")
        can.onlayout.topic(can)
    },

    menu: function(can, cmds, cb) {
        can.onmotion.clear(can, can.menu)
        can.core.List(cmds, function(item) {
            if (typeof item == "string") {
                can.page.Append(can, can.menu, [{view: ["menu", "div", item], onclick: function(event) {
                    typeof cb == "function" && cb(event, item)
                }}])

            } else if (item.length > 0) {
                can.page.Append(can, can.menu, [{view: ["menu", "div", item[0]], onclick: function(event) {
                    var ui = can.user.carte(event, can, can.onaction, item.slice(1), cb)
                    can.page.Modify(can, ui.first, {style: {top: can._target.offsetHeight}})
                }}])

            } else if (typeof item == "object") {
                can.page.Append(can, can.menu, [item])
            }
        })
    },
})
Volcanos("onaction", {help: "交互数据", list: [], _init: function(can, msg, list, cb, target) {
        function init() { can.run({}, [], function(msg) { can.Conf(USERNAME, msg.Option("user.nick")||msg.Option("user.name"))
            can.onimport._init(can, msg, list, function(msg) {
                typeof cb == "function" && cb(msg)
                can.run({}, ["search", "River.onaction._init"])
                can.run({}, ["search", "Action.onaction._init"])
                can.run({}, ["search", "Footer.onaction._init"])
            }, can._output)
        }) }

        can.onlayout.topic(can)
        can.user.isLocalFile? init(): can.run({}, ["check"], function(msg) { msg.Result()? init(): can.user.login(can, init) })
    },

    title: function(event, can) {
        var args = {}; can.core.List([POD, TOPIC, TITLE], function(key) {
            var value = can.user.Search(can, key); value && (args[key] = value)
        })
        can.user.jumps(can.user.Share(can, args, true))
    },
    username: function(event, can) {
        var ui = can.user.carte(event, can, can.onaction, ["logout"])
        can.page.Modify(can, ui.first, {style: {top: can._target.offsetHeight}})
    },
    logout: function(event, can) {
        can.user.logout(can)
    },
    time: function(event, can) {
        can.require(["/plugin/input/date.js"], function(can) {
            event.target.value = ""
            var ui = can.onfigure.date.onclick(event, can)
            can.page.Modify(can, ui.fieldset, {style: {right: 0, top: can._target.offsetHeight, left: ""}})
        })
    },

    pack: function(event, can) {
        can.core.Item(Volcanos.meta.pack, function(key, msg) { delete(msg._event), delete(msg._can) })
        var msg = can.request(event, {name: "demo", content: JSON.stringify(Volcanos.meta.pack)})

        var toast = can.user.toast(can, "打包中...", "webpack", 1000000)
        can.run(event, ["pack"], function(msg) {
            toast.Close(), can.user.toast(can, "打包成功", "webpack")
        })
    },

    river: function(event, can) { can.run(event, ["search", "River.onmotion.toggle"]) },
    setting: function(event, can) {
        var ui = can.user.carte(event, can, can.onaction, ["pack", "white", "black", "print"])
        can.page.Modify(can, ui.first, {style: {top: can._target.offsetHeight}})
    },
    black: function(event, can, button) { can.onlayout.topic(can, button) },
    white: function(event, can, button) { can.onlayout.topic(can, button) },
    print: function(event, can, button) { can.onlayout.topic(can, "white print") },

    River: function(can) { can.run({}, ["search", "River.onmotion.toggle"]) },
    Footer: function(can) { can.run({}, ["search", "River.onmotion.autosize"]) },
})
Volcanos("onexport", {help: "导出数据", list: []})
})()
