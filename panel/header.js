Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.Conf(aaa.USERNAME, msg.Option(aaa.USERNICK)||msg.Option(ice.MSG_USERNAME)||can.Conf(aaa.USERNAME))
        can.Conf(aaa.BACKGROUND, msg.Option(aaa.BACKGROUND))
        can.Conf(aaa.AVATAR, msg.Option(aaa.AVATAR))

        can.onmotion.clear(can)
        can.onimport._agent(can, msg, target)
        can.onimport._grant(can, msg, target)
        can.onimport._title(can, msg, target)
        can.onimport._state(can, msg, target)
        can.onimport._search(can, msg, target)
        can.onimport._background(can, msg, target)
        can.onimport._menus(can, msg, target)
        can.base.isFunc(cb) && cb(msg)
    },
    _agent: function(can, msg, target) {
        if (can.user.isMobile) {
            can.onaction.River(can)
            can.onaction.Footer(can)
        } else if (can.user.isExtension) {
            can.onaction.River(can)
        } else if (can.user.Search(can, cli.POD)) {
            can.onaction.River(can)
            can.onaction.Footer(can)
        }
        can.user.isWeiXin && can.onimport._weixin(can)
    },
    _grant: function(can, msg, target) {
        if (can.user.Search(can, chat.GRANT)) {
            if (can.user.confirm(chat.GRANT+" "+can.user.Search(can, chat.GRANT))) {
                can.run(event, [ctx.ACTION, chat.GRANT, web.SPACE, can.user.Search(can, chat.GRANT)])
            }
            can.user.Search(can, chat.GRANT, "")
        }
    },
    _title: function(can, msg, target) { const TITLE = chat.TITLE
        can.user.title(can.user.Search(can, TITLE)||can.user.Search(can, cli.POD))
        !can.user.isMobile && can.core.List(msg.result||["shylinux.com/x/contexts"], function(item) {
            can.page.Append(can, target, [{view: [TITLE, html.DIV, item], title: "返回主页", onclick: function(event) {
                can.onaction.title(event, can)
            }}])
        })
    },
    _state: function(can, msg, target) { const STATE = "state"
        can.core.List(can.base.Obj(can.Conf(STATE)||msg.Option(STATE), [kit.MDB_TIME, aaa.USERNAME]), function(item) {
            if (item == aaa.AVATAR) {
                can.page.Append(can, target, [{view: [STATE+" "+item], list: [{img: can.Conf(item)}], onmouseenter: function(event) {
                    can.onaction.carte(event, can, [can.page.Format(html.IMG, can.Conf(item), 160)])
                }}])
                return
            }

            can.page.Append(can, target, [{view: [STATE+" "+item, html.DIV, (can.Conf(item)||"").slice(0, 10)], onmouseenter: function(event) {
                can.core.CallFunc([can.onaction, item], [event, can, item])
            }, _init: function(target) {
                item == kit.MDB_TIME && can.onimport._time(can, target)
            }}])
        })
    },
    _search: function(can, msg, target) { const SEARCH = "search"
        var ui = can.page.Append(can, target, [{view: SEARCH, list: [{type: html.INPUT, data: {placeholder: SEARCH}, onkeydown: function(event) {
            can.onkeypop.input(event, can); switch (event.key) {
                case "Enter": can.search(event, ["Search.onimport.select", "*", event.target.value]); break
            }
        }}] }])
        can.user.isMobile && can.page.Modify(can, ui.first, {style: {float: "right"}})
        // can.onmotion.autosize(can, ui.input, 240, 120)
    },
    _background: function(can, msg) {
        if (can.user.isLocalFile) { return }
        if (can.user.isExtension) { return }
        can.onlayout.background(can, msg.Option(aaa.BACKGROUND), document.body)
    },
    _menus: function(can, msg, target) {
        var menus = can.base.Obj(can.Conf(chat.MENUS)||msg.Option(chat.MENUS), [chat.HEADER, ["setting", "black", "white", "print"]])
        can.onimport.menu(can, can.user.isMobile||can.user.isExtension||can.user.Search(can, cli.POD)? [chat.HEADER, chat.RIVER]: menus, function(event, item) {
            can.core.CallFunc(can.onaction[item]||function(event, can) {
                can.run(event, [item], function(msg) { can.user.toast(can, "执行成功", can.user.trans(can, item)) })
            }, {event: event, can: can, button: item})
        })
    },

    _weixin: function(can, msg) { can.run({}, [ctx.ACTION, chat.AGENT], function(msg) {
        can.require(can.base.Obj(msg.Option(ssh.SCRIPT)), function(can) {
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
                        name: msg.Option(kit.MDB_NAME), address: msg.Option(kit.MDB_TEXT),
                        scale: msg.Option("scale")||14, infoUrl: msg.Option(kit.MDB_LINK),
                    }) },
                    chooseImage: function(cb, count) { wx.chooseImage({count: count||9, sizeType: ['original', 'compressed'], sourceType: ['album', 'camera'], success: function (res) {
                        can.base.isFunc(cb) && cb(res.localIds)
                    } }) },
                }, function(key, value) { return can.user.agent[key] = value, key }),
            })
        }) })
    },
    _avatar: function(can, msg) {
        can.page.Modify(can, "div.output div.state.avatar>img", {src: can.Conf(aaa.AVATAR, msg.Option(aaa.AVATAR))})
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
                return {view: ["menu", html.DIV, can.user.trans(can, item)], onclick: function(event) {
                    can.base.isFunc(cb) && cb(event, item, cmds)
                }}

            } else if (item.length > 0) {
                return {view: ["menu", html.DIV, can.user.trans(can, item[0])], onmouseenter: function(event) {
                    can.onaction.carte(event, can, item.slice(1), function(event, button) {
                        can.base.isFunc(cb) && cb(event, button, item)
                    })
                }}

            } else if (typeof item == "object") {
                return item
            }
        }) }]).first
    },
    avatar: function(event, can, url) {
        !can.user.isLocalFile && can.run(event, [ctx.ACTION, aaa.AVATAR, url], function(msg) {
            can.onimport._avatar(can, msg)
        })
    },
    background: function(event, can, url) {
        !can.user.isLocalFile && can.run(event, [ctx.ACTION, aaa.BACKGROUND, url], function(msg) {
            can.onimport._background(can, msg)
        })
    },
})
Volcanos("onaction", {help: "交互数据", list: [], _init: function(can, meta, list, cb, target) {
        can.base.isFunc(cb) && cb()
    },
    _trans: {
        "river": "菜单",
        "search": "搜索",

        "help": "帮助",
        "tutor": "入门简介",
        "manual": "使用手册",
        "service": "服务手册",
        "devops": "编程手册",
        "refer": "参考手册",

        "setting": "设置",
        "black": "黑色主题",
        "white": "白色主题",
        "print": "打印主题",

        "shareuser": "共享用户",
        "clear": "清除背景",
    },
    onmain: function(can, msg) {
        function init() { can.run({}, [], function(msg) {
            can.base.Copy(can.onaction._trans, can.base.Obj(msg.Option(chat.TRANS), {}))
            can.onimport._init(can, msg, [], function(msg) { can.onengine.signal(can, "onlogin", msg) }, can._output)

            can.search({}, ["River.onmotion.toggle"])
        }) }; can.search({}, ["River.onmotion.hidden"])

        // 登录检查
        can.user.isLocalFile? init(): can.run({}, [chat.CHECK], function(msg) {
            can.Conf(aaa.USERNAME, msg.Option(ice.MSG_USERNAME))? init():
                msg.Option("sso")? can.user.jumps(msg.Option("sso")): can.user.login(can, init)
        })
    },
    onstorm_select: function(can, msg, river, storm) {
        can.Conf(chat.RIVER, river), can.Conf(chat.STORM, storm)
    },

    title: function(event, can) {
        var args = {}; can.core.List([chat.TITLE, chat.TOPIC, "layout"], function(key) {
            var value = can.user.Search(can, key); value && (args[key] = value)
        })
        can.user.jumps(can.user.MergeURL(can, args, true))
    },
    carte: function(event, can, list, cb) { can.user.carte(event, can, can.onaction, list, cb) },
    river: function(event, can) { can.onaction.River(can) },

    black: function(event, can, button) {
        can.onlayout.topic(can, button)
        can.onlayout._init(can)
    },
    white: function(event, can, button) {
        can.onlayout.topic(can, button)
        can.onlayout._init(can)
    },
    print: function(event, can, button) {
        can.onlayout.topic(can, "white print")

        can.set("River", "height", -1)
        can.set("Action", "height", -1)
    },
    webpack: function(event, can) {
        can.user.input(event, can, [
            {name: "name", value: can.user.title()},
        ], function(ev, button, meta, list) {
            can.core.Item(Volcanos.meta.pack, function(key, msg) { 
                can.core.List(["_event", "_can", "_xhr", "sessid", ""], function(key) { delete(msg[key]) })
            })
            var msg = can.request(event, {
                name: meta.name, content: JSON.stringify(Volcanos.meta.pack),
                river: can.Conf(chat.RIVER), storm: can.Conf(chat.STORM),
            })

            var toast = can.user.toast(can, "打包中...", code.WEBPACK, 1000000)
            can.run(event, [code.WEBPACK], function(msg) {
                toast.close(), can.user.toast(can, "打包成功", code.WEBPACK)
                can.user.download(can, "/share/local/"+msg.Result(), name+".html")
            })
        })
    },

    username: function(event, can) {
        can.onaction.carte(event, can, ["shareuser", aaa.USERNICK, "clear", aaa.LOGOUT])
    },
    shareuser: function(event, can) {
        can.user.share(can, can.request(event), [ctx.ACTION, chat.SHARE, kit.MDB_TYPE, aaa.LOGIN])
    },
    share: function(event, can, arg) {
        can.user.share(can, can.request(event), [ctx.ACTION, chat.SHARE].concat(arg||[]))
    },
    usernick: function(event, can) {
        can.user.input(event, can, [{name: aaa.USERNICK, value: can.Conf(aaa.USERNAME)}], function(ev, button, data, list, args) {
            can.run(event, [aaa.USERNICK, list[0]], function(msg) {
                can.page.Select(can, can._output, "div.username", function(item) {
                    can.page.Modify(can, item, can.Conf(aaa.USERNAME, list[0]))
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
