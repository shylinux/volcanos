Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can._output.innerHTML = ""
        can.onimport._title(can, msg)
        can.onimport._state(can, msg)
        can.onimport._search(can, msg)
        can.onimport._agent(can, msg)
        typeof cb == "function" && cb()
    },
    _title: function(can, msg) {
        can.user.title(can.user.Search(can, "title") || can.user.Search(can, "pod"))
        can.user.isMobile || can.core.List(msg.result||["github.com/shylinux/contexts"], function(title) {
            can.page.Append(can, can._output, [{view: ["title", "div", title],
                click: function(event) { can.onaction["title"](event, can, "title") },
            }])
        })
    },
    _search: function(can, msg) {
        can.user.isMobile || (can.search = can.page.Append(can, can._output, [{view: "search", list: [{type: "input", data: {placeholder: "search"}, onkeydown: function(event) {
            switch (event.key) {
                case "Enter": can.run(event, ["search", "Search.onimport.input", "*", event.target.value]); break
            }
        }, }], }]).input)

        var ui = can.page.Append(can, can._output, can.core.List(can.user.isMobile || can.user.isExtension || can.user.Search(can, "pod")? ["River"]: ["pack"], function(item) {
            return {view: "item", list: [{type: "input", data: {type: "button", name: item, value: item.toLowerCase()}, onclick: function(event) {
                var cb = can.onaction[item]; typeof cb == "function" && cb(event, can, item)
            }, }]}
        }))
    },
    _state: function(can, msg) {
        can.core.List(can.Conf("state")||["time", USERNAME], function(item) {
            can.page.Append(can, can._output, [{view: ["state "+item, "div", can.Conf(item)],
                click: function(event) { can.onaction[item](event, can, item) },
                _init: function(target) {
                    item == "time" && can.core.Timer({interval: 1000, length: -1}, function(event) {
                        can.onimport.time(can, target)
                    })
                },
            }])
        })
    },
    _agent: function(can, msg) {
        if (can.user.isExtension) {
            can.onaction.River({}, can)
        } else if (can.user.isMobile) {
            can.onaction.River({}, can)
            can.onaction.Footer({}, can)
        } else if (can.user.Search(can, "pod")) {
            can.onaction.River({}, can)
            can.onaction.Footer({}, can)
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

    time: function(can, target) {
        target.innerHTML = can.base.Time(null, "%w %H:%M:%S")

        if (can.user.Search(can, "topic")) { return }
        if (can.user.Search(can, "pod")) { return }

        var h = parseInt(can.base.Time(null, "%H"))
        var topic = h<7 || h>17? "black": "white"
        can.onaction[topic]({}, can, topic)
    },
})
Volcanos("onaction", {help: "交互数据", list: [], _init: function(can, msg, list, cb, target) {
        function init() { can.run({}, [], function(msg) {
            const USERNAME = "username"
            can.Conf(USERNAME, msg.Option("user.nick")||msg.Option("user.name"))
            can.Conf(USERNAME).length > 10 && can.Conf(USERNAME, can.Conf(USERNAME).slice(0, 10))

            can.onimport._init(can, msg, msg.append, function() {
                can.run({}, ["search", "River.onaction._init"])
                can.run({}, ["search", "Footer.onaction._init"])
            }, target)
        }) }

        can.page.Modify(can, target, {
            className: can.user.Search(can, "topic") || (can.user.Search(can, "pod") || can.base.isNight() ? "black": "white"),
        })

        location.protocol == "file:"? init(): can.run({}, ["check"], function(msg) {
            msg.Result()? init(): can.user.login(can, init)
        })
    },
    title: function(event, can, key) {
        var args = {}; can.core.List(["pod", "topic"], function(key) {
            var value = can.user.Search(can, key); value && (args[key] = value)
        })
        location.href = can.user.Share(can, args, true)
    },
    username: function(event, can, key) {
        if (can.user.confirm("logout?")) {
            can.user.Cookie(can, "sessid", "")
            can.user.reload(true)
        }
    },

    white: function(event, can, key) {
        can.page.Modify(can, document.body, {className: key})
    },
    black: function(event, can, key) {
        can.page.Modify(can, document.body, {className: key})
    },
    pack: function(event, can, key) {
        can.core.Item(Volcanos.meta.pack, function(key, msg) {
            delete(msg._event), delete(msg._can)
        })

        var toast = can.user.toast(can, "打包中...", "webpack", 1000000)
        var msg = can.request(event)
        msg.Option("name", "demo")
        msg.Option("content", JSON.stringify(Volcanos.meta.pack))
        can.run(event, ["pack"], function(msg) {
            toast.Close(), can.user.toast(can, "打包成功", "webpack")
        })
    },

    River: function(event, can, key) {
        can.page.Select(can, document.body, "fieldset.River", function(item) {
            can.page.Modify(can, item, {style: {display: item.style.display == "none"? "block": "none"}})
        })
    },
    Footer: function(event, can, key) {
        can.page.Select(can, document.body, "fieldset.Action", function(item) {
            can.page.Select(can, item, "div.output")[0].style.height = ""
            item.style.height = ""
        }) 
    },
})
Volcanos("onexport", {help: "导出数据", list: []})

