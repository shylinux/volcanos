(function() { const TITLE = "title", TOPIC = "topic", POD = "pod", STATE = "state", USERNAME = "username"
Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.onmotion.clear(can)
        can.onimport._title(can, msg, target)
        can.onimport._state(can, msg, target)
        can.onimport._search(can, msg, target)
        can.onimport._agent(can, msg, target)
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
    _search: function(can, msg, target) {
        can.user.isMobile || (can.search = can.page.Append(can, target, [{view: "search", list: [{type: "input", data: {placeholder: "search"}, onkeydown: function(event) {
            switch (event.key) {
                case "Enter": can.run(event, ["search", "Search.onimport.input", "*", event.target.value]); break
            }
        }, }], }]).input)

        var ui = can.page.Append(can, target, can.core.List(can.user.isMobile || can.user.isExtension || can.user.Search(can, POD)? ["River"]: ["pack"], function(item) {
            return {view: "item", list: [{type: "input", data: {type: "button", name: item, value: item.toLowerCase()}, onclick: function(event) {
                var cb = can.onaction[item]; typeof cb == "function" && (item == "River"? cb(can): cb(event, can, item))
            }, }]}
        }))
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

    time: function(can, target) { target.innerHTML = can.base.Time(null, "%w %H:%M:%S")
        can.user.Search(can, TOPIC) || can.user.Search(can, POD) || can.user.topic(can, can.base.isNight()? "black": "white")
    },
})
Volcanos("onaction", {help: "交互数据", list: [], _init: function(can, msg, list, cb, target) {
        function init() { can.run({}, [], function(msg) { can.Conf(USERNAME, msg.Option("user.nick")||msg.Option("user.name"))
            can.onimport._init(can, msg, list, function(msg) {
                typeof cb == "function" && cb(msg)
                can.run({}, ["search", "River.onaction._init"])
                can.run({}, ["search", "Footer.onaction._init"])
            }, can._output)
        }) }

        can.user.topic(can, can.user.Search(can, TOPIC) || (can.user.Search(can, POD)||can.base.isNight() ? "black": "white"))
        can.user.isLocalFile? init(): can.run({}, ["check"], function(msg) { msg.Result()? init(): can.user.login(can, init) })
    },
    title: function(event, can) {
        var args = {}; can.core.List([POD, TOPIC, TITLE], function(key) {
            var value = can.user.Search(can, key); value && (args[key] = value)
        })
        can.user.jumps(can.user.Share(can, args, true))
    },
    username: function(event, can) { can.user.logout(can) },

    pack: function(event, can, key) {
        can.core.Item(Volcanos.meta.pack, function(key, msg) { delete(msg._event), delete(msg._can) })
        var msg = can.request(event, {name: "demo", content: JSON.stringify(Volcanos.meta.pack)})

        var toast = can.user.toast(can, "打包中...", "webpack", 1000000)
        can.run(event, ["pack"], function(msg) {
            toast.Close(), can.user.toast(can, "打包成功", "webpack")
        })
    },

    River: function(can) { can.run({}, ["search", "River.onmotion.toggle"]) },
    Footer: function(can) { can.run({}, ["search", "River.onmotion.autosize"]) },
})
Volcanos("onexport", {help: "导出数据", list: []})
})()
