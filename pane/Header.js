Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can._trans = {
            "river": "菜单",
            "search": "搜索",
            "setting": "设置",
            "black": "黑色主题",
            "white": "白色主题",
            "print": "打印主题",
            "void": "清除背景",
            "pack": "打包页面",
            "logout": "退出",
        }
        can.onmotion.clear(can)
        can.onimport._title(can, msg, target)
        can.onimport._state(can, msg, target)
        can.onimport._search(can, msg, target)
        // can.onengine._daemon(can, can.user.title())
        can.onimport._background(can, msg, target)
        can.onimport._agent(can, msg, target)
        can.onimport._menu(can, msg, target)
        typeof cb == "function" && cb(msg)
    },
    _title: function(can, msg, target) {
        can.user.title(can.user.Search(can, "title") || can.user.Search(can, "pod"))
        can.user.isMobile || can.core.List(msg.result||["github.com/shylinux/contexts"], function(item) {
            can.page.Append(can, target, [{view: ["title", "div", item], onclick: function(event) {
                can.onaction.title(event, can)
            }}])
        })
    },
    _state: function(can, msg, target) {
        can.core.List(can.Conf("state")||["time", "username"], function(item) {
            can.page.Append(can, target, [{view: ["state "+item, "div", can.Conf(item)], onclick: function(event) {
                can.core.CallFunc([can.onaction, item], [event, can, item])
            }, _init: function(target) {
                item == "time" && can.onimport._time(can, target)
            }}])
        })
    },
    _search: function(can, msg, target) {
        can.user.isMobile || (can.search = can.page.Append(can, target, [{view: "search", list: [{type: "input", data: {placeholder: "search"}, onkeydown: function(event) {
            can.onkeypop.input(event, can); switch (event.key) {
                case "Enter": can.run(event, ["search", "Search.onimport.select", "*", event.target.value]); break
            }
        }, }], }]).input)
    },
    _daemon: function(can, name, cb) {
        can.misc.WSS(can, {type: "chrome", name: name}, cb||function(event, msg, cmd, arg) {
            msg && can.run(event, ["search"].concat(msg["detail"]||[]), function(msg) {
                msg.Reply()
            })
        })
    },
    _background: function(can, msg) {
        can.onlayout.background(can, msg.Option("background"), document.body)
    },
    _agent: function(can, msg, target) {
        if (can.user.isMobile) {
            can.onaction.River(can)
            can.onaction.Footer(can)
        } else if (can.user.isExtension) {
            can.onaction.River(can)
        } else if (can.user.Search(can, "pod")) {
            can.onaction.River(can)
            can.onaction.Footer(can)
        }
        can.user.isWeiXin && can.onimport._weixin(can)
    },
    _menu: function(can, msg, target) {
        can.page.Append(can, target, can.core.List(can.user.isMobile || can.user.isExtension || can.user.Search(can, "pod")? ["river", "setting"]: ["setting"], function(item) {
            return {view: ["menus", "div", item], onclick: function(event) {
                can.core.CallFunc([can.onaction, item], [event, can, item])
            }}
        }))
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
    _time: function(can, target) {
        can.core.Timer({interval: 1000, length: -1}, function() {
            can.onimport.time(can, target)
        })
        can.onappend.figure(can, {style: {left: "", right: "0", top: can._target.offsetHeight}}, "@date", target)
    },

    time: function(can, target) { can.onlayout.topic(can)
        target.innerHTML = can.base.Time(null, "%w %H:%M:%S")
    },
    background: function(event, can, url) {
        can.run(event, ["action", "background", url], function(msg) {
            can.onimport._background(can, msg)
        })
    },
    menu: function(can, cmds, cb) { // type item...
        return can.page.Append(can, can._output, [{type: cmds[0], list: can.core.List(cmds.slice(1), function(item) {
            if (typeof item == "string") {
                return {view: ["menu", "div", item], onclick: function(event) {
                    typeof cb == "function" && cb(event, item)
                }}

            } else if (item.length > 0) {
                return {view: ["menu", "div", item[0]], onclick: function(event) {
                    var ui = can.user.carte(event, can, can.onaction, item.slice(1), cb)
                    can.page.Modify(can, ui.first, {style: {top: can._target.offsetHeight}})
                }}

            } else if (typeof item == "object") {
                return item
            }
        }) }]).first
    },
})
Volcanos("onaction", {help: "交互数据", list: [], _init: function(can, msg, list, cb, target) {
        function init() { can.run({}, [], function(msg) {
            can.Conf("username", msg.Option("user.nick")||msg.Option("user.name"))
            can.onimport._init(can, msg, list, function(msg) {
                can.run(msg._event, ["search", "Search.onaction._init"])
                can.run(msg._event, ["search", "Action.onaction._init"])
                can.run(msg._event, ["search", "River.onaction._init"])
                can.run(msg._event, ["search", "Footer.onaction._init"])
                typeof cb == "function" && cb(msg)
            }, can._output)
            can.page.Select(can, document.body, "fieldset.River", function(item) {
                can.onmotion.toggle(can, item)
            })
        }) }
        can.page.Select(can, document.body, "fieldset.River", function(item) {
            can.onmotion.hidden(can, item)
        })

        can.onlayout.topic(can)
        can.user.isLocalFile? init(): can.run({}, ["check"], function(msg) {
            msg.Result()? init(): msg.Option("sso")? can.user.jumps(msg.Option("sso")): can.user.login(can, init)
        })
    },

    title: function(event, can) {
        var args = {}; can.core.List(["pod", "topic", "title"], function(key) {
            var value = can.user.Search(can, key); value && (args[key] = value)
        })
        can.user.jumps(can.user.MergeURL(can, args, true))
    },
    username: function(event, can) {
        var ui = can.user.carte(event, can, can.onaction, ["logout"])
        can.page.Modify(can, ui.first, {style: {top: can._target.offsetHeight}})
    },
    logout: function(event, can) { can.user.logout(can) },

    river: function(event, can) { can.run(event, ["search", "River.onmotion.toggle"]) },
    setting: function(event, can) {
        var ui = can.user.carte(event, can, can.onaction, ["black", "white", "print", "void", "pack"])
        can.page.Modify(can, ui.first, {style: {top: can._target.offsetHeight}})
    },
    black: function(event, can, button) { can.onlayout.topic(can, button) },
    white: function(event, can, button) { can.onlayout.topic(can, button) },
    print: function(event, can, button) { can.onlayout.topic(can, "white print") },
    void: function(event, can, button) { can.onimport.background(event, can, button) },
    pack: function(event, can) {
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
Volcanos("onexport", {help: "导出数据", list: [],
    height: function(can) { return can._target.offsetHeight },
})
