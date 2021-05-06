Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        const GRANT = "grant"; if (can.user.Search(can, GRANT)) {
            if (can.user.confirm(GRANT+" "+can.user.Search(can, GRANT))) {
                can.run(event, [can._ACTION, GRANT, "space", can.user.Search(can, GRANT)])
            }
            can.user.Search(can, GRANT, "")
            return
        }

        can._trans = {
            "river": "菜单",
            "search": "搜索",

            "setting": "设置",
            "black": "黑色主题",
            "white": "白色主题",
            "print": "打印主题",
            "clear": "清除背景",
            "pack": "打包页面",

            "shareuser": "共享用户",
            "usernick": "修改昵称",
            "logout": "退出登录",
        }

        can.onmotion.clear(can)
        can.onimport._title(can, msg, target)
        can.onimport._state(can, msg, target)
        can.onimport._search(can, msg, target)
        can.onimport._background(can, msg, target)
        can.onimport._agent(can, msg, target)
        can.onimport._menu(can, msg, target)

        can.base.isFunc(cb) && cb(msg)
        can.page.Modify(can, can._output, {onmouseover: function(event) {
            can.menu && can.page.Remove(can, can.menu.first)
        }})
    },
    _title: function(can, msg, target) {
        can.user.title(can.user.Search(can, can._TITLE)||can.user.Search(can, "pod"))
        !can.user.isMobile && can.core.List(msg.result||["github.com/shylinux/contexts"], function(item) {
            can.page.Append(can, target, [{view: [can._TITLE, "div", item], onclick: function(event) {
                can.onaction.title(event, can)
            }}])
        })
    },
    _state: function(can, msg, target) {
        can.core.List(can.base.Obj(msg.Option("state"), can.Conf("state")||["time", can._USERNAME]), function(item) {
            if (item == can._AVATAR) {
                can.page.Append(can, target, [{view: ["state "+item], list: [{img: can.Conf(item), onmouseenter: function(event) {
                    can.onaction.carte(event, can, [can.page.Format("img", can.Conf(item), 160)])
                }}]}])
                return
            }

            can.page.Append(can, target, [{view: ["state "+item, "div", (can.Conf(item)||"").slice(0, 10)], onmouseenter: function(event) {
                can.core.CallFunc([can.onaction, item], [event, can, item])
            }, _init: function(target) {
                item == "time" && can.onimport._time(can, target)
            }}])
        })
    },
    _search: function(can, msg, target) {
        var ui = can.page.Append(can, target, [{view: can._SEARCH, list: [{type: "input", data: {placeholder: can._SEARCH}, onkeydown: function(event) {
            can.onkeypop.input(event, can); switch (event.key) {
                case "Enter": can.run(event, [can._SEARCH, "Search.onimport.select", "*", event.target.value]); break
            }
        }}] }]); can.onmotion.autosize(can, ui.input, 240, 120)
        can.user.isMobile && can.page.Modify(can, ui.first, {style: {float: "right"}})
    },
    _avatar: function(can, msg) {
        !can.user.isLocalFile && can.page.Modify(can, "div.output div.state.avatar>img", {src: can.Conf(can._AVATAR, msg.Option(can._AVATAR))})
    },
    _background: function(can, msg) {
        if (can.user.isLocalFile) { return }
        if (can.user.isExtension) { return }
        can.onlayout.background(can, msg.Option(can._BACKGROUND), document.body)
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
        can.onimport.menu(can, can.user.isMobile||can.user.isExtension||can.user.Search(can, "pod")? ["header", can._RIVER]:
            ["header", ["setting", "black", "white", "print", "pack"]], function(event, item) {
                can.core.CallFunc([can.onaction, item], [event, can, item])
            })
    },

    _weixin: function(can, msg) { can.run({}, [can._ACTION, "agent"], function(msg) {
        can.require(can.base.Obj(msg.Option("script")), function(can) {
            wx.config({debug: msg.Option("debug") == "true",
                appId: msg.Option("appid"), signature: msg.Option("signature"),
                nonceStr: msg.Option("noncestr"), timestamp: msg.Option("timestamp"),

                jsApiList: can.core.Item({
                    scanQRCode: function(cb) { wx.scanQRCode({needResult: cb? 1: 0, scanType: ["qrCode","barCode"], success: function (res) {
                        can.base.isFunc(cb) && cb(res.resultStr)
                    } }) },
                    getLocation: function(cb) { wx.getLocation({type: "gcj02", success: function (res) {
                        can.base.isFunc(cb) && cb({type: "gcj02", name: "当前位置", text: "当前位置", latitude: parseInt(res.latitude*100000), longitude: parseInt(res.longitude*100000) })
                    } }) },
                    openLocation: function(msg) { wx.openLocation({
                        latitude: parseInt(msg.Option("latitude"))/100000,
                        longitude: parseInt(msg.Option("longitude"))/100000,
                        name: msg.Option("name"), address: msg.Option("text"),
                        scale: msg.Option("scale")||14, infoUrl: msg.Option("link"),
                    }) },
                    chooseImage: function(cb, count) { wx.chooseImage({count: count||9, sizeType: ['original', 'compressed'], sourceType: ['album', 'camera'], success: function (res) {
                        can.base.isFunc(cb) && cb(res.localIds)
                    } }) },
                }, function(key, value) { return can.user.agent[key] = value, key }),
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
    menu: function(can, cmds, cb) { // type item...
        return can.page.Append(can, can._output, [{type: cmds[0], list: can.core.List(cmds.slice(1), function(item) {
            if (typeof item == "string") {
                return {view: ["menu", "div", item], onclick: function(event) {
                    can.base.isFunc(cb) && cb(event, item)
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
    avatar: function(event, can, url) {
        can.run(event, [can._ACTION, can._AVATAR, url], function(msg) {
            can.onimport._avatar(can, msg)
        })
    },
    background: function(event, can, url) {
        can.run(event, [can._ACTION, can._BACKGROUND, url], function(msg) {
            can.onimport._background(can, msg)
        })
    },
})
Volcanos("onaction", {help: "交互数据", list: [], _init: function(can, msg, list, cb, target) {
        can.const(
            "search", "action", "share", "title", "river", "storm",
            "grant",
            "username", "background", "avatar",
        )

        function init() { can.run({}, [], function(msg) {
            can.Conf(can._USERNAME, msg.Option("user.nick")||msg.Option("user.name")||can.Conf(can._USERNAME))
            can.Conf(can._BACKGROUND, msg.Option(can._BACKGROUND))
            can.Conf(can._AVATAR, msg.Option(can._AVATAR))

            can.onimport._init(can, msg, list, function(msg) {
                can.onengine.listen(can, "storm.select", function(msg, river, storm) {
                    can.Conf(can._RIVER, river), can.Conf(can._STORM, storm)
                })

                can.run(msg._event, [can._SEARCH, "Footer.onaction._init"])
                can.run(msg._event, [can._SEARCH, "Action.onaction._init"])
                can.run(msg._event, [can._SEARCH, "River.onaction._init"])
                can.run(msg._event, [can._SEARCH, "Search.onaction._init"])
                can.base.isFunc(cb) && cb(msg)
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
            can.Conf(can._USERNAME, msg.Result())? init():
                msg.Option("sso")? can.user.jumps(msg.Option("sso")): can.user.login(can, init)
        })
    },

    title: function(event, can) {
        var args = {}; can.core.List(["pod", can._TITLE, "topic", "layout"], function(key) {
            var value = can.user.Search(can, key); value && (args[key] = value)
        })
        can.user.jumps(can.user.MergeURL(can, args, true))
    },
    carte: function(event, can, list, cb) {
        can.menu && can.page.Remove(can, can.menu.first)
        can.menu = can.user.carte(event, can, can.onaction, list, cb)
        can.page.Modify(can, can.menu.first, {style: {top: can._target.offsetHeight, left: event.target.offsetLeft}})
        return can.menu
    },
    river: function(event, can) { can.onaction.River(can) },
    black: function(event, can, button) {
        can.onlayout.topic(can, button)

        var header = can.get("Header", "height")
        var footer = can.get("Footer", "height")
        can.set("River", "height", window.innerHeight-header-footer)
        can.set("Action", "height", window.innerHeight-header-footer)
    },
    white: function(event, can, button) {
        can.onlayout.topic(can, button)

        var header = can.get("Header", "height")
        var footer = can.get("Footer", "height")
        can.set("River", "height", window.innerHeight-header-footer)
        can.set("Action", "height", window.innerHeight-header-footer)
    },
    print: function(event, can, button) {
        can.onlayout.topic(can, "white print")

        can.set("River", "height", -1)
        can.set("Action", "height", -1)
    },
    pack: function(event, can) {
        can.user.input(event, can, [
            {name: "name", value: can.user.title()},
        ], function(ev, button, meta, list) {
            can.core.Item(Volcanos.meta.pack, function(key, msg) { 
                can.core.List(["_event", "_can", "_xhr", "sessid", ""], function(key) { delete(msg[key]) })
            })
            var msg = can.request(event, {
                name: meta.name, content: JSON.stringify(Volcanos.meta.pack),
                river: can.Conf(can._RIVER), storm: can.Conf(can._STORM),
            })

            var toast = can.user.toast(can, "打包中...", "webpack", 1000000)
            can.run(event, ["webpack"], function(msg) {
                toast.Close(), can.user.toast(can, "打包成功", "webpack")
                can.user.download(can, "/share/local/"+msg.Result(), name+".html")
            })
        })
    },

    username: function(event, can) {
        var ui = can.onaction.carte(event, can, ["shareuser", "usernick", "clear", "logout"])

        can.user.isMobile && can.page.Modify(can, ui.first, {style: {left: 320}})
    },
    shareuser: function(event, can) {
        can.user.share(can, can.request(event), [can._ACTION, can._SHARE, "type", "login"])
    },
    share: function(event, can, arg) {
        can.user.share(can, can.request(event), [can._ACTION, can._SHARE].concat(arg))
    },
    usernick: function(event, can) {
        can.user.input(event, can, [{_input: "text", name: "usernick", value: can.Conf(can._USERNAME)}], function(ev, button, data, list, args) {
            can.run(event, ["usernick", list[0]], function(msg) {
                can.page.Select(can, can._output, "div.username", function(item) {
                    can.page.Modify(can, item, can.Conf(can._USERNAME, list[0]))
                }), can.user.toast(can, "修改成功")
            }, true)
        })
    },
    clear: function(event, can, button) { can.onimport.background(event, can, "") },
    logout: function(event, can) { can.user.logout(can) },

    River: function(can) { can.run({}, [can._SEARCH, "River.onmotion.toggle"]) },
    Footer: function(can) { can.run({}, [can._SEARCH, "River.onmotion.autosize"]) },
})
Volcanos("onexport", {help: "导出数据", list: [],
    height: function(can) { return can._target.offsetHeight },
    topic: function(can) { return can._topic },
})
