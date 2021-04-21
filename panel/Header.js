Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can._trans = {
            "river": "菜单",
            "search": "搜索",

            "setting": "设置",
            "black": "黑色主题",
            "white": "白色主题",
            "print": "打印主题",
            "clear": "清除背景",
            "pack": "打包页面",

            "usernick": "修改昵称",
            "logout": "退出登录",
        }
        can.onmotion.clear(can)
        can.onimport._title(can, msg, target)
        can.onimport._state(can, msg, target)
        can.onimport._background(can, msg, target)
        can.onimport._search(can, msg, target)
        can.onimport._agent(can, msg, target)
        can.onimport._menu(can, msg, target)
        typeof cb == "function" && cb(msg)
        can.page.Modify(can, can._output, {onmouseover: function(event) {
            can.menu && can.page.Remove(can, can.menu.first)
        }})

        can.core.Timer(1000, function() {
            can.onimport._daemon(can, msg, target)
        })
    },
    _title: function(can, msg, target) {
        can.user.title(can.user.Search(can, "title")||can.user.Search(can, "pod"))
        !can.user.isMobile && can.core.List(msg.result||["github.com/shylinux/contexts"], function(item) {
            can.page.Append(can, target, [{view: ["title", "div", item], onclick: function(event) {
                can.onaction.title(event, can)
            }}])
        })
    },
    _state: function(can, msg, target) {
        can.core.List(can.Conf("state")||["time", "username"], function(item) {
            can.page.Append(can, target, [{view: ["state "+item, "div", (can.Conf(item)||"").slice(0, 10)], onmouseenter: function(event) {
                can.core.CallFunc([can.onaction, item], [event, can, item])
            }, _init: function(target) {
                item == "time" && can.onimport._time(can, target)
            }}])
        })
    },
    _background: function(can, msg) {
        !can.user.isLocalFile && can.onlayout.background(can, msg.Option("background"), document.body)
    },
    _search: function(can, msg, target) {
        !can.user.isMobile && (can.search = can.page.Append(can, target, [{view: "search", list: [{type: "input", data: {placeholder: "search"}, onkeydown: function(event) {
            can.onkeypop.input(event, can); switch (event.key) {
                case "Enter": can.run(event, ["search", "Search.onimport.select", "*", event.target.value]); break
            }
        }, onfocus: function(event) {
            can.onmotion.resize(can, event.target, 240, 10)
        }, onmouseenter: function(event) {
            can.onmotion.resize(can, event.target, 240, 10)
        }, onmouseleave: function(event) {
            can.onmotion.resize(can, event.target, 120, 5)
        }, onblur: function(event) {
            can.onmotion.resize(can, event.target, 120, 5)
        },
        }] }]).input)
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
        can.onimport.menu(can, can.user.isMobile||can.user.isExtension||can.user.Search(can, "pod")? ["header", "river"]:
            ["header", ["setting", "black", "white", "print", "clear", "pack"]], function(event, item) {
                can.core.CallFunc([can.onaction, item], [event, can, item])
            })
    },

    _daemon: function(can, msg, target) {
        can.misc.WSS(can, {type: "chrome", name: can.user.Search(can, "daemon")}, function(event, msg, cmd, arg) { if (!msg) { return }
            can.run(event, ["search"].concat(msg["detail"]||[]), function(msg) {
                msg.Reply()
            })
        })
    },
    _weixin: function(can, msg) { can.run({}, ["action", "agent"], function(msg) {
        can.require(["https://res.wx.qq.com/open/js/jweixin-1.6.0.js"], function(can) {
            wx.config({debug: msg.Option("debug") == "true", jsApiList: can.core.Item({
                scanQRCode: function(cb) { wx.scanQRCode({needResult: cb? 1: 0, scanType: ["qrCode","barCode"], success: function (res) {
                    typeof cb == "function" && cb(res.resultStr)
                } }) },
                getLocation: function(cb) { wx.getLocation({type: "gcj02", success: function (res) {
                    typeof cb == "function" && cb({type: "gcj02", name: "当前位置", text: "当前位置", latitude: parseInt(res.latitude*100000), longitude: parseInt(res.longitude*100000) })
                } }) },
                openLocation: function(msg) { wx.openLocation({
                    latitude: parseInt(msg.Option("latitude"))/100000,
                    longitude: parseInt(msg.Option("longitude"))/100000,
                    name: msg.Option("name"), address: msg.Option("text"),
                    scale: msg.Option("scale")||14, infoUrl: msg.Option("link"),
                }) },
                chooseImage: function(cb, count) { wx.chooseImage({count: count||9, sizeType: ['original', 'compressed'], sourceType: ['album', 'camera'], success: function (res) {
                    typeof cb == "function" && cb(res.localIds)
                } }) },
            }, function(key, value) { return can.user.agent[key] = value, key }),
                nonceStr: msg.Option("noncestr"), timestamp: msg.Option("timestamp"),
                appId: msg.Option("appid"), signature: msg.Option("signature"),
            })
        }) })
    },

    _time: function(can, target) {
        can.core.Timer({interval: 1000}, function() { can.onimport.time(can, target) })
        can.onappend.figure(can, {style: {left: "", right: "0", top: can._target.offsetHeight, "min-width": 310}}, "@date", target)
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
            if (!item) {

            } else if (typeof item == "string") {
                return {view: ["menu", "div", item], onclick: function(event) {
                    typeof cb == "function" && cb(event, item)
                }}

            } else if (item.length > 0) {
                return {view: ["menu", "div", item[0]], onmouseenter: function(event) {
                    can.onaction.carte(event, can, item.slice(1), cb)
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
                can.onengine.listen(can, "storm.select", function(msg, river, storm) {
                    can.Conf("river", river), can.Conf("storm", storm)
                })

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
        var args = {}; can.core.List(["pod", "title", "topic", "layout"], function(key) {
            var value = can.user.Search(can, key); value && (args[key] = value)
        })
        can.user.jumps(can.user.MergeURL(can, args, true))
    },
    username: function(event, can) {
        can.onaction.carte(event, can, ["usernick", "logout"])
    },
    usernick: function(event, can) {
        can.user.input(event, can, [{_input: "text", name: "usernick", value: can.Conf("username")}], function(ev, button, data, list, args) {
            can.run(event, ["usernick", list[0]], function(msg) {
                can.page.Select(can, can._output, "div.username", function(item) {
                    can.page.Modify(can, item, can.Conf("username", list[0]))
                }), can.user.toast(can, "修改成功")
            }, true)
        })
    },
    logout: function(event, can) { can.user.logout(can) },

    river: function(event, can) { can.onaction.River(can) },
    black: function(event, can, button) { can.onlayout.topic(can, button) },
    white: function(event, can, button) { can.onlayout.topic(can, button) },
    print: function(event, can, button) { can.onlayout.topic(can, "white print") },
    clear: function(event, can, button) { can.onimport.background(event, can, "") },
    pack: function(event, can) {
        can.user.input(event, can, [
            {_input: "text", name: "name", value: "demo"},
        ], function(ev, button, meta, list) {
            can.core.Item(Volcanos.meta.pack, function(key, msg) { 
                can.core.List(["_event", "_can", "_xhr", "sessid", ""], function(key) { delete(msg[key]) })
            })
            var msg = can.request(event, {
                name: meta.name, content: JSON.stringify(Volcanos.meta.pack),
                river: can.Conf("river"), storm: can.Conf("storm"),
            })

            var toast = can.user.toast(can, "打包中...", "webpack", 1000000)
            can.run(event, ["webpack"], function(msg) {
                toast.Close(), can.user.toast(can, "打包成功", "webpack")
            })
        })
    },
    carte: function(event, can, list, cb) {
        can.menu && can.page.Remove(can, can.menu.first)
        can.menu = can.user.carte(event, can, can.onaction, list, cb)
        can.page.Modify(can, can.menu.first, {style: {top: -list.length*15, left: event.target.offsetLeft}})
        can.onmotion.downward(can, can.menu.first, can._target.offsetHeight, 10-list.length)
    },

    River: function(can) { can.run({}, ["search", "River.onmotion.toggle"]) },
    Footer: function(can) { can.run({}, ["search", "River.onmotion.autosize"]) },
})
Volcanos("onexport", {help: "导出数据", list: [],
    height: function(can) { return can._target.offsetHeight },
    topic: function(can) { return can._topic },
})
