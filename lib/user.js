Volcanos("user", {help: "用户操作", agent: {
        scanQRCode: function(cb, can) {
            can.user.input(event, can, [{type: html.TEXTAREA, name: "text", text: ""}], function(ev, button, data, list, args) {
                cb(list[0], can.base.ParseJSON(list[0]))
            })
        },
        getLocation: function(cb) {
            navigator.geolocation.getCurrentPosition(function(res) {
                cb({latitude: parseInt(res.coords.latitude*100000), longitude: parseInt(res.coords.longitude*100000)})
            }, function(some) {
                typeof cb == lang.FUNCTION && cb({name: "some"})
            } );
        },
        openLocation: function(msg) {
            window.open("https://map.baidu.com/search/"+encodeURIComponent(msg.Option(kit.MDB_TEXT))
                +"/@12958750.085,4825785.55,16z?querytype=s&da_src=shareurl&wd="+encodeURIComponent(msg.Option(kit.MDB_TEXT)))
        },
        chooseImage: function(cb) {
            typeof cb == lang.FUNCTION && cb([])
        },
    },
    isWeiXin: navigator.userAgent.indexOf("MicroMessenger") > -1,
    isIPhone: navigator.userAgent.indexOf("iPhone") > -1,
    isMobile: navigator.userAgent.indexOf("Mobile") > -1,
    isMacOSX: navigator.userAgent.indexOf("Mac OS X") > -1,
    isWindows: navigator.userAgent.indexOf("Windows") > -1,
    isIE: navigator.userAgent.indexOf("MSIE") > -1,
    isExtension: location && location.protocol && location.protocol == "chrome-extension:",
    isLocalFile: location && location.protocol && location.protocol == "file:",
    isLandscape: function() { return window.innerWidth > window.innerHeight },
    mod: {
        isPod: location && location.pathname && (location.pathname.indexOf("/chat/pod/") == 0),
        isDiv: location && location.pathname && (location.pathname.indexOf("/chat/div/") == 0),
        isCmd: location && location.pathname && (location.pathname.indexOf("/chat/pod/") == 0 && location.pathname.indexOf("/cmd/") > 0 ||
            location.pathname.indexOf("/chat/cmd/") == 0 || location.pathname.indexOf("/help/") == 0),
    },

    alert: function(text) { alert(JSON.stringify(text)) },
    confirm: function(text) { return confirm(JSON.stringify(text)) },
    prompt: function(text, cb, def, silent) { (text = silent? def: prompt(text, def||"")) != undefined && typeof cb == lang.FUNCTION && cb(text); return text },
    reload: function(force) { (force || confirm("重新加载页面？")) && location.reload() },
    jumps: function(url) { location.href = url },
    open: function(url) { window.open(url) },
    time: function(can, time, fmt) { var now = can.base.Date(time)
        var list = can.user.language(can) == "en"? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
        return can.base.Time(time, (fmt||"%y-%m-%d %H:%M:%S").replace("%w", list[now.getDay()]))
    },

    title: function(text) {
        return text && (document.title = text), document.title
    },
    topic: function(can, name) {
        can.user.isMobile && (name += " mobile") && can.user.isLandscape() && (name += " landscape")
        can.page.Modify(can, document.body, {className: name})
    },
    language: function(can) {
        return can.misc.Search(can, "language")
    },
    trans: function(can, text) {
        if (can.user.language(can) == "en") { return text }
        if (can.base.isObject(text)) {
            return can.core.Item(text, function(k, v) { can.core.Value(can._trans, k, v) })
        }

        if (can.base.isFunction(text)) { text = text.name||"" }
        return can._trans&&can._trans[text] || can.Conf("trans."+text) || can.Conf("feature._trans."+text) || {
            "create": "创建", "remove": "删除", "insert": "添加", "delete": "删除", "modify": "编辑",
            "list": "查看", "back": "返回", "run": "执行", "done": "完成", "share": "共享",
            "edit": "编辑", "save": "保存", "copy": "复制", "show": "显示", "hide": "隐藏",
            "project": "项目", "profile": "详情", "actions": "参数",

            "start": "启动", "stop": "停止",
            "open": "打开", "close": "关闭",
            "begin": "开始", "end": "结束",
            "clear": "清空", "refresh": "刷新",
            "submit": "提交", "cancel": "取消",
            "label": "标签", "exec": "执行",
        }[text]||text
    },
    toastSuccess: function(can) {
        can.user.toast(can, ice.SUCCESS)
    },
    toast: function(can, content, title, duration, progress) {
        var meta = can.base.isObject(content)? content: {content: content, title: title||can._help, duration: duration, progress: progress}
        var width = meta.width||400, height = meta.height||100; if (width < 0) { width = window.innerWidth + width }

        var ui = can.page.Append(can, document.body,  [{view: chat.TOAST, style: {
            left: (window.innerWidth-width)/2, width: width, bottom: 100,
        }, list: [
            {text: [meta.title||"", html.DIV, html.TITLE], title: "点击复制", onclick: function(event) {
                can.user.copy(event, can, meta.title)
            }},
            {view: "duration", title: "点击关闭", onclick: function() { action.close() }},
            can.base.isObject(meta.content)? meta.content: {text: [meta.content||"执行成功", html.DIV, "content"]},

            {view: "action"}, meta.progress != undefined && {view: "progress", style: {width: width}, list: [
                {view: "current", style: {width: (meta.progress||0)/100*width}},
            ]},
        ] }])

        var action = can.onappend._action(can, meta.action||[], ui.action, {
            close: function(event) { can.page.Remove(can, action._target), action.timer.stop = true },
            timer: can.core.Timer({interval: 100, length: (parseInt(meta.duration||1000))/100}, function(event, interval, index) {
                if (index > 30) { ui.duration.innerHTML = parseInt(index/10)+ice.PT+(index%10)+"s..." }
            }, function() { action.close() }), _target: ui._target, ui: ui,
        }); can.onmotion.story.auto(can, ui._target)

        can.onengine.signal(can, "ontoast", can.request({}, {
            title: meta.title, content: meta.content,
            time: can.base.Time(), fileline: can.misc.FileLine(2, 2),
        }))
        return action
    },
    share: function(can, msg, cmd) {
        can.run(msg._event, cmd||[ctx.ACTION, chat.SHARE], function(msg) {
            can.user.toast(can, {height: 300, width: 500,
                title: msg.Append(kit.MDB_NAME), duration: -1,
                content: msg.Append(kit.MDB_TEXT), action: [cli.CLOSE],
            }), can.user.copy(msg._event, can, msg.Append(kit.MDB_NAME))
        })
    },
    login: function(can, cb, method) {
        var ui = can.user.input({}, can, [
            {username: html.USERNAME}, {password: html.PASSWORD},
        ], function(event, button, data, list) { return {
            "登录": function() {
                can.run({}, [aaa.LOGIN, data[html.USERNAME], data[html.PASSWORD]], function(msg) {
                    if (msg.Option(ice.MSG_USERNAME)) {
                        can.page.Remove(can, ui._target), can.base.isFunc(cb) && cb()
                    } else {
                        can.user.toast(can, "用户名或密码错误")
                    }
                })
                return true
            }, 
            "扫码": function() {
                can.misc.WSS(can, {type: "chrome", cmd: "pwd"}, function(event, msg, cmd, arg) { if (!msg) { return }
                    if (cmd == "pwd") {
                        return can.user.toast(can, arg[2], arg[1], -1), msg.Reply()
                    }
                    if (cmd == ice.MSG_SESSID) {
                        return can.misc.Cookie(can, ice.MSG_SESSID, arg[0]), msg.Reply(), can.user.reload(true)
                    }
                    can.search(event, msg[ice.MSG_DETAIL]||[], function(msg) { msg.Reply() })
                })
            },
            "飞书": function() {
                location.href = "/chat/lark/sso"
            },
        }[button]() }, can.base.Obj(method, ["登录", "扫码", "飞书"]))

        can.page.Modify(can, ui._target, {className: "input login", style: {left: (window.innerWidth-ui._target.offsetWidth)/2, top: window.innerHeight/6}})
    },
    logout: function(can, force) { if (force||can.user.confirm("logout?")) {
        can.run({}, [ctx.ACTION, aaa.LOGOUT], function(msg) { can.misc.Cookie(can, ice.MSG_SESSID, "")
            can.misc.Search(can, chat.SHARE)? can.misc.Search(can, chat.SHARE, ""): can.user.reload(true)
        })
    } },

    toPNG: function(can, name, text, height, width) {
        if (text.indexOf("<svg") != 0) {
            text = '<svg xmlns="http://www.w3.org/2000/svg">'+text+"</svg>"
        }
        var img = document.createElement("img")
        img.onload = function() {
            var canvas = document.createElement("canvas")
            canvas.height = height, canvas.width = width
            canvas.getContext("2d").drawImage(img, 0, 0)

            var a = document.createElement("a")
            a.href = canvas.toDataURL("image/png")
            a.download = name, a.click()
        }, img.src = "data:image/svg+xml,"+encodeURIComponent(text)
    },
    copy: function(event, can, text) {
        if (navigator.clipboard) { var ok = false
            navigator.clipboard.writeText(text).then(function() { ok = true })
            if (ok) { return can.user.toastSuccess(can) }
        }

        var input = can.page.Append(can, event.target.parentNode, [{type: html.TEXTAREA, value: text}]).first
        input.setSelectionRange(0,-1), input.focus(), document.execCommand("Copy")
        can.page.Remove(can, input), can.user.toastSuccess(can)
        event.stopPropagation(), event.preventDefault()
    },
    carte: function(event, can, meta, list, cb, parent) {
        meta = meta||can.ondetail||can.onaction||{}, list = list&&list.length > 0? list: meta.list||[]; if (list.length == 0) { return }
        cb = cb||function(event, item, meta) { var cb = meta[item]||meta["_engine"]; can.base.isFunc(cb) && cb(event, can, item) }

        var ui = can.page.Append(can, document.body, [{view: chat.CARTE, style: {left: 0, top: 0}, onmouseleave: function(event) {
            // can.page.Remove(can, ui._target)
        }, list: can.core.List(list, function(item, index) {
            return can.base.isString(item)? {view: "item", list: [{text: can.user.trans(can, item), click: function(event) {
                can.user.isMobile && can.page.Remove(can, ui._target)
                can.base.isFunc(cb) && cb(event, item, meta, index)
            }, onmouseenter: function(event) {
                carte._float && can.page.Remove(can, carte._float._target)
            } }] }: {view: "item", list: [{text: can.user.trans(can, item[0])}], onmouseenter: function(event) {
                var sub = can.user.carte(event, can, meta, item.slice(1), cb, carte)
                carte._float && can.page.Remove(can, carte._float._target), carte._float = sub
                can.onlayout.figure(event, can, sub._target, true)
            } }
        }) }] ); can.onlayout.figure(event, can, ui._target)

        var carte = {_target: ui._target, _parent: parent}
        null && can.onmotion.float.add(can, chat.CARTE, carte)
        ui._target.onmouseover = function(event) {
            event.stopPropagation(), event.preventDefault()
        }
        return event.stopPropagation(), event.preventDefault(), carte
    },
    cartes: function(event, can, meta, list, cb, parent) {
        var carte = can.user.carte(event, can, meta, list, cb, parent)
        can.page.Modify(can, carte._target, {style: {
            left: event.clientX-event.offsetX+event.target.offsetWidth-3,
            top: carte._target.offsetTop-event.target.offsetHeight+5,
        }})
        return carte
    },
    input: function(event, can, form, cb, button) { // form [ string, array, object, {type: "select", values: []}
        var msg = can.request(event)
        var ui = can.page.Append(can, document.body, [{view: [html.INPUT], style: {left: 0, top: 0}, list: [
            {view: [chat.OPTION, html.TABLE], list: can.core.List(form, function(item) { 
                item = can.base.isString(item)? {type: html.TEXT, name: item}: item.length > 0? {type: html.SELECT, name: item[0], values: item.slice(1)}: item
                item.type = item.type||(item.values? html.SELECT: item.name == html.TEXT? html.TEXTAREA: html.TEXT)

                item._init = function(target) {
                    item.run = function(event, cmds, cb) {
                        can.request(event, function() { var value = {_handle: ice.TRUE, action: msg.Option(chat.ACTION)}
                            can.page.Select(can, ui.table, "textarea,input,select", function(item) {
                                item.name && item.value && (value[item.name] = item.value)
                            }); return value
                        }, msg, can.Option()); can.run(event, cmds, cb, true)
                    }

                    target.value = target.value||(item.name&&(msg.Option(item.name)||can.Option(item.name)))||""
                    can.onappend.figure(can, item, target)
                }

                return {type: html.TR, list: [{type: html.TD, list: [{text: item._trans||can.user.trans(can, item.name)||""}]}, {type: html.TD, list: [can.page.input(can, item)]} ]}
            })}, {view: chat.ACTION},
        ]}]); can.onlayout.figure(event, can, ui._target)

        var action = can.onappend._action(can, button||[html.SUBMIT, html.CANCEL], ui.action, {
            cancel: function(event) { can.page.Remove(can, ui._target) },
            _engine: function(event, can, button) { action.submit(event, can, button) },
            submit: function(event, can, button) { var data = {}, args = [], list = []
                list = can.page.Select(can, ui.table, "textarea,input,select", function(item) {
                   return item.name && item.value && args.push(item.name, item.value), data[item.name] = item.value
                })
                var msg = can.request(event, {_handle: ice.TRUE})
                can.base.isFunc(cb) && !cb(event, button, data, list, args) && action.cancel()
            }, _target: ui._target,
        })

        can.page.Select(can, ui._target, "textarea,input", function(item, index) {
            index == 0 && can.onmotion.focus(can, item)
        })
        return action
    },
    select: function(event, can, type, fields, cb, cbs) {
        var msg = can.request(event, {fields: fields||"type,name,text"})
        can.search(msg._event, ["Search.onimport.select", type, "", ""], function(list) {
            can.core.Next(list, cb, cbs||function() {
                can.user.toastSuccess(can)
            })
        })
    },
    upload: function(event, can) { var begin = new Date()
        var ui = can.page.Append(can, document.body, [{view: html.UPLOAD, style: {left: 0, top: 0}, list: [
            {view: "action"}, {view: "output", list: [{view: "progress"}]},
            {view: "status", list: [{view: "show"}, {view: "cost"}, {view: "size"}]},
        ]}]); can.onlayout.figure(event, can, ui._target)

        var action = can.onappend._action(can, [
            {type: html.UPLOAD, onchange: function(event) {
                action.show(event, 0, event.target.files[0].size, 0)
            }}, cli.CLOSE,
        ], ui.action, {
            close: function(event) { can.page.Remove(can, ui._target) },
            begin: function(event) { begin = new Date()
                var upload = can.page.Select(can, ui.action, "input[type=file]")
                if (upload[0].files.length == 0) { return upload[0].focus() }

                var msg = can.request(event, can.Option(), {_handle: "true"})
                msg._upload = upload[0].files[0], msg._progress = action.show

                can.run(event, [ctx.ACTION, html.UPLOAD], function(msg) {
                    can.user.toastSuccess(can), can.Update(), action.close()
                }, true)
            },
            show: function (event, value, total, loaded) { now = new Date()
                value == 0 && action.begin(event)

                ui.show.innerHTML = value+"%"
                ui.cost.innerHTML = can.base.Duration(now - begin)
                ui.size.innerHTML = can.base.Size(loaded)+ice.PS+can.base.Size(total)
                can.page.Modify(can, ui.progress, {style: {width: value*(ui.output.offsetWidth-2)/100}})
            },
        }); can.page.Select(can, ui.action, "input[type=file]")[0].click()

        return action
    },
    download: function(can, path, name) {
        var a = can.page.Append(can, document.body, [{type: html.A, href: path, download: name||path.split(ice.PS).pop()}]).first
        a.click(), can.page.Remove(can, a)
    },
    downloads: function(can, text, name) { can.user.download(can, URL.createObjectURL(new Blob([text])), name) },
    camera: function(can, msg, cb) {
        navigator.getUserMedia({video: true}, cb, function(error) {
            can.misc.Log(error)
        })
    },
})

