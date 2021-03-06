Volcanos("user", {help: "用户操作", agent: {
        scanQRCode: function(cb, can) {
            can.user.input(event, can, [{type: "textarea"}], function(ev, button, data, list, args) {
                cb(list[0])
            })
        },
        getLocation: function(cb) {
            typeof cb == "function" && cb({name: "some"})
        },
        openLocation: function(msg) {
            window.open("https://map.baidu.com/search/"+encodeURIComponent(msg.Option("text"))
                +"/@12958750.085,4825785.55,16z?querytype=s&da_src=shareurl&wd="+encodeURIComponent(msg.Option("text")))
        },
        chooseImage: function(cb) {
            typeof cb == "function" && cb([])
        },
    },
    isLandscape: window.innerWidth > window.innerHeight,
    isWeiXin: navigator.userAgent.indexOf("MicroMessenger") > -1,
    isMobile: navigator.userAgent.indexOf("Mobile") > -1,
    isIPhone: navigator.userAgent.indexOf("iPhone") > -1,
    isMacOSX: navigator.userAgent.indexOf("Mac OS X") > -1,
    isWindows: navigator.userAgent.indexOf("Windows") > -1,
    isLocalFile: location && location.protocol && location.protocol == "file:",
    isExtension: location && location.protocol && location.protocol == "chrome-extension:",

    alert: function(text) { alert(JSON.stringify(text)) },
    confirm: function(text) { return confirm(JSON.stringify(text)) },
    prompt: function(text, cb, def, silent) { (text = silent? def: prompt(text, def||"")) != undefined && typeof cb == "function" && cb(text); return text },
    reload: function(force) { (force || confirm("重新加载页面？")) && location.reload() },
    jumps: function(url) { location.href = url },
    open: function(url) { window.open(url) },

    title: function(text) { return text && (document.title = text), document.title },
    topic: function(can, name) {
        can.user.isMobile && (name += " mobile") && can.user.isLandscape && (name += " landscape")
        can.page.Modify(can, document.body, {className: name})
    },
    trans: function(can, text) {
        if (typeof text == "object") {
            return can.core.Item(text, function(k, v) { can.core.Value(can._trans, k, v) })
        }

        if (typeof text == "function") { text = text.name || "" }
        return can._trans&&can._trans[text] || can.Conf("trans."+text) || can.Conf("feature.trans."+text) || {
            "submit": "提交", "cancel": "取消",
            "open": "打开", "close": "关闭",
            "begin": "启动", "end": "结束",
        }[text] || text
    },
    toast: function(can, content, title, duration, progress) {
        var meta = typeof content == "object"? content: {content: content, title: title||can._help, duration: duration, progress: progress}
        var width = meta.width||400, height = meta.height||100; if (width < 0) { width = window.innerWidth + width }

        var ui = can.page.Append(can, document.body,  [{view: "toast", style: {
            left: (window.innerWidth-width)/2, width: width, bottom: 100,
        }, list: [
            {text: [meta.title||"", "div", "title"], title: "点击复制", onclick: function(event) {
                can.user.copy(event, can, meta.title)
            }},
            {view: "duration", title: "点击关闭", onclick: function() { action.close() }},
            typeof meta.content == "object"? meta.content: {text: [meta.content||"执行成功", "div", "content"]},

            {view: "action"}, meta.progress != undefined && {view: "progress", style: {width: width}, list: [
                {view: "current", style: {width: (meta.progress||0)/100*width}},
            ]},
        ] }])

        var action = can.onappend._action(can, meta.action||[], ui.action, {
            close: function(event) { can.page.Remove(can, action._target), action.timer.stop = true },
            timer: can.core.Timer({interval: 100, length: (parseInt(meta.duration||1000))/100}, function(event, interval, index) {
                if (index > 30) { ui.duration.innerHTML = parseInt(index/10)+"."+(index%10)+"s..." }
            }, function() { action.close() }), _target: ui._target, ui: ui,
        }); can.onmotion.story.auto(can, ui._target)

        can.search(can.request({}, {
            title: meta.title, content: meta.content,
            time: can.base.Time(), fileline: can.misc.FileLine(2, 2),
        })._event, ["Footer.onimport.toast"])
        return action
    },
    share: function(can, msg, cmd) {
        can.run(msg._event, cmd||["action", "share"], function(msg) {
            can.user.toast(can, {height: 300, width: 500,
                title: msg.Append("name"), duration: -1,
                content: msg.Append("text"), action: ["close"],
            })
        })
    },
    login: function(can, cb) {
        var ui = can.user.input({}, can, [
            {username: "username"}, {password: "password"},
        ], function(event, button, data, list) { return {
            "登录": function() {
                can.run({}, ["action", "login", data["username"], data["password"]], function(msg) {
                    if (msg.Option("user.name")) {
                        can.page.Remove(can, ui._target), can.base.isFunc(cb) && cb()
                    } else {
                        can.user.toast(can, "用户名或密码错误")
                    }
                })
                return true
            }, 
            "扫码": function() {
                can.misc.WSS(can, {type: "chrome"}, function(event, msg, cmd, arg) { if (!msg) { return }
                    if (cmd == "pwd") {
                        return can.user.toast(can, arg[2], arg[1], -1), msg.Reply()
                    }

                    if (cmd == "sessid") {
                        return can.user.Cookie(can, "sessid", arg[0]), msg.Reply(), can.user.reload(true)
                    }

                    can.search(event, msg["detail"]||[], function(msg) { msg.Reply() })
                })
            },
        }[button]() }, ["登录", "扫码"])

        can.page.Modify(can, ui._target, {className: "input login", style: {left: (window.innerWidth-ui._target.offsetWidth)/2, top: window.innerHeight/6}})
    },
    logout: function(can, force) { if (force||can.user.confirm("logout?")) {
        can.run({}, ["action", "logout"], function(msg) { can.user.Cookie(can, "sessid", "")
            can.user.Search(can, "share")? can.user.Search(can, "share", ""): can.user.reload(true)
        })
    } },
    camera: function(can, msg, cb) {
        navigator.getUserMedia({video: true}, cb, function(error) {
            can.misc.Log(error)
        })
    },

    copy: function(event, can, text) {
        if (navigator.clipboard) { var ok = false
            navigator.clipboard.writeText(text).then(() => { ok = true })
            if (ok) { return can.user.toast(can, text, "复制成功") }
        }

        var input = can.page.Append(can, event.target.parentNode, [{type: "textarea", value: text}]).first
        input.setSelectionRange(0,-1), input.focus(), document.execCommand("Copy")
        can.page.Remove(can, input), can.user.toast(can, text, "复制成功")
        event.stopPropagation(), event.preventDefault()
    },
    carte: function(event, can, meta, list, cb, parent) {
        meta = meta||can.ondetail||can.onaction||{}, list = list&&list.length > 0? list: meta.list||[]; if (list.length == 0) { return }
        cb = cb||function(event, item, meta) { var cb = meta[item]||meta["_engine"]; can.base.isFunc(cb) && cb(event, can, item) }

        var ui = can.page.Append(can, document.body, [{view: "carte", style: {left: 0, top: 0}, onmouseleave: function(event) {
            // can.page.Remove(can, ui._target)
        }, list: can.core.List(list, function(item) {
            return typeof item == "string"? {view: "item", list: [{text: can.user.trans(can, item), click: function(event) {
                can.user.isMobile && can.page.Remove(can, ui._target)
                can.base.isFunc(cb) && cb(event, item, meta)
                // can.onmotion.float.del(can, "carte")
            }, onmouseenter: function(event) {
                carte._float && can.page.Remove(can, carte._float._target)
            } }] }: {view: "item", list: [{text: can.user.trans(can, item[0])}], onmouseenter: function(event) {
                var sub = can.user.carte(event, can, meta, item.slice(1), cb, carte)
                carte._float && can.page.Remove(can, carte._float._target), carte._float = sub
                can.onlayout.figure(event, can, sub._target, true)
            } }
        }) }] ); can.onlayout.figure(event, can, ui._target)

        var carte = {_target: ui._target, _parent: parent}
        null && can.onmotion.float.add(can, "carte", carte)
        return event.stopPropagation(), event.preventDefault(), carte
    },
    input: function(event, can, form, cb, button) { // form [ string, array, object, {_input: "select", values: []}
        var msg = can.request(event, can.Option())
        var ui = can.page.Append(can, document.body, [{view: ["input"], style: {left: 0, top: 0}, list: [
            {view: ["option", "table"], list: can.core.List(form, function(item) { 
                (item._input == "select"||item.values) && (item = {select: [[item.name].concat(item.values)], data: item, name: item.name, _trans: item._trans})
                item = typeof item == "string"? {input: item, name: item}: item.length > 0? {select: [item], name: item[0]}: item
                item.type = item.type||"input", item.type == "input" && (item.data=item.data||{}, item.data.type = item.data.type||"text")

                item._init = function(target) {
                    item.run = function(event, cmds, cb) {
                        var res = can.request(event, msg, function() { var value = {_handle: "true"}
                            can.page.Select(can, ui.table, "textarea,input,select", function(item) {
                                item.name && item.value && (value[item.name] = item.value)
                            }); return value
                        }); can.run(event, cmds, cb, true)
                    }

                    can.onappend.figure(can, item, item.value, function() {}, target)
                    target.value = target.value || msg.Option(item.name)
                }

                return {type: "tr", list: [{type: "td", list: [{text: item._trans||can.user.trans(can, item.name)||""}]}, {type: "td", list: [item]} ]}
            })},
            {view: "action"},
        ]}]); can.onlayout.figure(event, can, ui._target)

        var action = can.onappend._action(can, button||["submit", "cancel"], ui.action, {
            cancel: function(event) { can.page.Remove(can, ui._target) },
            _engine: function(event, can, button) { action.submit(event, can, button) },
            submit: function(event, can, button) { var data = {}, args = [], list = []
                list = can.page.Select(can, ui.table, "textarea,input,select", function(item) {
                   return item.name && item.value && args.push(item.name, item.value), data[item.name] = item.value
                })
                var msg = can.request(event, {_handle: "true"})
                can.base.isFunc(cb) && !cb(event, button, data, list, args) && action.cancel()
            }, _target: ui._target,
        })

        can.page.Select(can, ui._target, "input", function(item, index) {
            index == 0 && can.onmotion.focus(can, item)
        })

        return action
    },
    select: function(event, can, type, fields, cb, cbs) {
        var msg = can.request(event, {fields: fields||"type,name,text"})
        can.search(msg._event, ["Search.onimport.select", type, "", ""], function(list) {
            can.core.Next(list, cb, cbs||function() {
                can.user.toast(can, "添加成功")
            })
        })
    },
    upload: function(event, can) { var begin = new Date()
        var ui = can.page.Append(can, document.body, [{view: "upload", style: {left: 0, top: 0}, list: [
            {view: "action"}, {view: "output", list: [{view: "progress"}]},
            {view: "status", list: [{view: "show"}, {view: "cost"}, {view: "size"}]},
        ]}]); can.onlayout.figure(event, can, ui._target)

        var action = can.onappend._action(can, [
            {type: "upload", onchange: function(event) {
                action.show(event, 0, event.target.files[0].size, 0)
            }}, "close",
        ], ui.action, {
            close: function(event) { can.page.Remove(can, ui._target) },
            begin: function(event) { begin = new Date()
                var upload = can.page.Select(can, ui.action, "input[type=file]")
                if (upload[0].files.length == 0) { return upload[0].focus() }

                var msg = can.request(event, can.Option(), {_handle: "true"})
                msg._upload = upload[0].files[0], msg._progress = action.show

                can.run(event, ["action", "upload"], function(msg) {
                    can.user.toast(can, "上传成功"), can.run()
                }, true)
            },
            show: function (event, value, total, loaded) { now = new Date()
                value == 0 && action.begin(event)

                ui.show.innerHTML = value+"%"
                ui.cost.innerHTML = can.base.Duration(now - begin)
                ui.size.innerHTML = can.base.Size(loaded)+"/"+can.base.Size(total)
                can.page.Modify(can, ui.progress, {style: {width: value*(ui.output.offsetWidth-2)/100}})
            },
        }); can.page.Select(can, ui.action, "input[type=file]")[0].click()

        return action
    },
    download: function(can, path, name) {
        var a = can.page.Append(can, document.body, [{type: "a", href: path, download: name||path.split("/").pop()}]).first
        a.click(), can.page.Remove(can, a)
    },
    downloads: function(can, text, name) { can.user.download(can, URL.createObjectURL(new Blob([text])), name) },

    MergeURL: shy("地址链接", function(can, objs, clear) {
        var path = location.pathname; objs._path && (path = objs._path, delete(objs._path))
        return can.base.MergeURL(location.origin+path+(clear?"":location.search), objs)
    }),
    Search: shy("请求参数", function(can, key, value) { var args = {}
        location.search && location.search.slice(1).split("&").forEach(function(item) { var x = item.split("=")
            x[1] != "" && (args[x[0]] = decodeURIComponent(x[1]))
        })

        if (typeof key == "object") {
            can.core.Item(key, function(key, value) {
                if (value != undefined) {args[key] = value}
                args[key] == "" && delete(args[key])
            })
        } else if (key == undefined) {
            return args
        } else if (value == undefined) {
            return args[key]
        } else {
            args[key] = value, args[key] == "" && delete(args[key])
        }

        return location.search = can.core.Item(args, function(key, value) {
            return key+"="+encodeURIComponent(value)
        }).join("&")
    }),
    Cookie: shy("会话变量", function(can, key, value, path) {
        function set(k, v) {document.cookie = k+"="+v+";path="+(path||"/")}

        if (typeof key == "object") {
            for (var k in key) {set(k, key[k])}
            key = null
        }
        if (key == undefined) {var cs = {}
            document.cookie.split("; ").forEach(function(item) {
                var cookie = item.split("=")
                cs[cookie[0]] = cookie[1]
            })
            return cs
        }

        value != undefined && set(key, value)
        var result = (new RegExp(key+"=([^;]*);?")).exec(document.cookie)
        return result && result.length > 0? result[1]: ""
    }),
})

