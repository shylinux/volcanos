Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.Conf(can._USERNAME, msg.Option("user.nick")||msg.Option("user.name")||can.Conf(can._USERNAME))
        can.Conf(can._BACKGROUND, msg.Option(can._BACKGROUND))
        can.Conf(can._AVATAR, msg.Option(can._AVATAR))

        can.onmotion.clear(can)
        can.onimport._agent(can, msg, target)
        can.onimport._grant(can, msg, target)
        can.onimport._title(can, msg, target)
        can.onimport._state(can, msg, target)
        can.onimport._search(can, msg, target)
        can.onimport._background(can, msg, target)
        can.onimport._menu(can, msg, target)

        can.onmotion.float.auto(can, can._output, "carte", "input")
        can.base.isFunc(cb) && cb(msg)
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
    _grant: function(can, msg, target) { const GRANT = "grant"
        if (can.user.Search(can, GRANT)) {
            if (can.user.confirm(GRANT+" "+can.user.Search(can, GRANT))) {
                can.run(event, [can._ACTION, GRANT, "space", can.user.Search(can, GRANT)])
            }
            can.user.Search(can, GRANT, "")
        }
    },
    _title: function(can, msg, target) {
        can.user.title(can.user.Search(can, can._TITLE)||can.user.Search(can, "pod"))
        !can.user.isMobile && can.core.List(msg.result||["github.com/shylinux/contexts"], function(item) {
            can.page.Append(can, target, [{view: [can._TITLE, "div", item], title: "返回主页", onclick: function(event) {
                can.onaction.title(event, can)
            }}])
        })
    },
    _state: function(can, msg, target) { const STATE = "state"
        can.core.List(can.base.Obj(msg.Option(STATE), can.Conf(STATE)||["time", can._USERNAME]), function(item) {
            if (item == can._AVATAR) {
                can.page.Append(can, target, [{view: [STATE+" "+item], list: [{img: can.Conf(item)}], onmouseenter: function(event) {
                    can.onaction.carte(event, can, [can.page.Format("img", can.Conf(item), 160)])
                }}])
                return
            }

            can.page.Append(can, target, [{view: [STATE+" "+item, "div", (can.Conf(item)||"").slice(0, 10)], onmouseenter: function(event) {
                can.core.CallFunc([can.onaction, item], [event, can, item])
            }, _init: function(target) {
                item == "time" && can.onimport._time(can, target)
            }}])
        })
    },
    _search: function(can, msg, target) { const SEARCH = "search"
        var ui = can.page.Append(can, target, [{view: SEARCH, list: [{type: "input", data: {placeholder: SEARCH}, onkeydown: function(event) {
            can.onkeypop.input(event, can); switch (event.key) {
                case "Enter": can.search(event, ["Search.onimport.select", "*", event.target.value]); break
            }
        }}] }])
        can.user.isMobile && can.page.Modify(can, ui.first, {style: {float: "right"}})
        // can.onmotion.autosize(can, ui.input, 240, 120)
    },
    _background: function(can, msg) {
        if (can.user.isExtension) { return }
        if (can.user.isLocalFile) { return }
        can.onlayout.background(can, msg.Option(can._BACKGROUND), document.body)
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
    _avatar: function(can, msg) {
        can.page.Modify(can, "div.output div.state.avatar>img", {src: can.Conf(can._AVATAR, msg.Option(can._AVATAR))})
    },
    _time: function(can, target) {
        can.core.Timer({interval: 500}, function() { can.onimport.time(can, target) })
        can.onappend.figure(can, {style: {"min-width": 306}}, "@date", function(sub) {
            can.search({}, ["Action.onexport.size"], function(msg, top) {
                can.page.Modify(can, sub._target, {style: {top: top, left: window.innerWidth-sub._target.offsetWidth}})
            })
        }, target), target.onmouseenter = function() { target.click() }
    },

    time: function(can, target) { can.onlayout.topic(can)
        target.innerHTML = can.base.Time(null, "%w %H:%M:%S")
    },
    menu: function(can, cmds, cb) {
        return can.page.Append(can, can._output, [{type: cmds[0], list: can.core.List(cmds.slice(1), function(item) {
            if (typeof item == "string") {
                return {view: ["menu", "div", can.user.trans(can, item)], onclick: function(event) {
                    can.base.isFunc(cb) && cb(event, item)
                }}

            } else if (item.length > 0) {
                return {view: ["menu", "div", can.user.trans(can, item[0])], onmouseenter: function(event) {
                    can.onaction.carte(event, can, item.slice(1), cb)
                }}

            } else if (typeof item == "object") {
                return item
            }
        }) }]).first
    },
    avatar: function(event, can, url) {
        !can.user.isLocalFile && can.run(event, [can._ACTION, can._AVATAR, url], function(msg) {
            can.onimport._avatar(can, msg)
        })
    },
    background: function(event, can, url) {
        !can.user.isLocalFile && can.run(event, [can._ACTION, can._BACKGROUND, url], function(msg) {
            can.onimport._background(can, msg)
        })
    },
})
Volcanos("onaction", {help: "交互数据", list: [], _init: function(can, meta, list, cb, target) {
        can.base.isFunc(cb) && cb()
    },
    _const: [
        "action", "share", "grant", "title", "river", "storm",
        "avatar", "username", "background",
    ],
    _trans: {
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
    },
    onmain: function(can, msg) {
        function init() { can.run({}, [], function(msg) {
            can.onimport._init(can, msg, [], function(msg) {
                can.onengine.signal(can, "onlogin", msg)
            }, can._output)

            can.search({}, ["River.onmotion.toggle"])
        }) }; can.search({}, ["River.onmotion.hidden"])

        // 登录检查
        can.user.isLocalFile? init(): can.run({}, ["check"], function(msg) {
            can.Conf(can._USERNAME, msg.Result())? init():
                msg.Option("sso")? can.user.jumps(msg.Option("sso")): can.user.login(can, init)
        })
    },
    onstorm_select: function(can, msg, river, storm) {
        can.Conf(can._RIVER, river), can.Conf(can._STORM, storm)
    },

    title: function(event, can) {
        var args = {}; can.core.List(["pod", "title", "topic", "layout"], function(key) {
            var value = can.user.Search(can, key); value && (args[key] = value)
        })
        can.user.jumps(can.user.MergeURL(can, args, true))
    },
    carte: function(event, can, list, cb) { can.user.carte(event, can, can.onaction, list, cb) },
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
                toast.close(), can.user.toast(can, "打包成功", "webpack")
                can.user.download(can, "/share/local/"+msg.Result(), name+".html")
            })
        })
    },

    username: function(event, can) {
        can.onaction.carte(event, can, ["shareuser", "usernick", "clear", "logout"])
    },
    shareuser: function(event, can) {
        can.user.share(can, can.request(event), [can._ACTION, can._SHARE, "type", "login"])
    },
    share: function(event, can, arg) {
        can.user.share(can, can.request(event), [can._ACTION, can._SHARE].concat(arg))
    },
    usernick: function(event, can) {
        can.user.input(event, can, [{name: "usernick", value: can.Conf(can._USERNAME)}], function(ev, button, data, list, args) {
            can.run(event, ["usernick", list[0]], function(msg) {
                can.page.Select(can, can._output, "div.username", function(item) {
                    can.page.Modify(can, item, can.Conf(can._USERNAME, list[0]))
                }), can.user.toast(can, "修改成功")
            }, true)
        })
    },
    clear: function(event, can, button) { can.onimport.background(event, can, "") },
    logout: function(event, can) { can.user.logout(can) },

    River: function(can) { can.search({}, ["River.onmotion.toggle"]) },
    Footer: function(can) { can.search({}, ["Footer.onmotion.toggle"]) },
})
Volcanos("onexport", {help: "导出数据", list: [],
    height: function(can) { return can._target.offsetHeight },
    topic: function(can) { return can._topic },
})
