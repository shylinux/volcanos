Volcanos("user", {help: "用户模块", agent: {
        getLocation: function(cb) {
            typeof cb == "function" && cb({name: "some"})
        },
        openLocation: function(msg) {
            window.open("https://map.baidu.com/search/"+encodeURIComponent(msg.Option("text"))+"/@12958750.085,4825785.55,16z?querytype=s&da_src=shareurl&wd="+encodeURIComponent(msg.Option("text")))
        },
        scanQRCode: function(cb) {
            typeof cb == "function" && cb({name: "some"})
        },
        chooseImage: function(cb) {
            typeof cb == "function" && cb([])
        },
    },
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
    title: function(text) { return text && (document.title = text), document.title },
    jumps: function(url) { location.href = url },
    open: function(url) { window.open(url) },

    scan: function(str) {
        try { var value = JSON.parse(str) } catch(e) { try {
            var value = {"type": "url", "text": str}
            var ls = str.split("?"); if (ls.length > 1) { ls = ls[1].split("&")
                for (var i = 0; i < ls.length; i++) { var vs = ls[i].split("=")
                    value[vs[0]] = decodeURIComponent(vs[1])
                }
            }
        } catch(e) { } }
        return value
    },
    copy: function(event, can, text) {
        var input = can.page.Append(can, event.target, [{type: "input", value: text}]).first
        input.setSelectionRange(0,-1), input.focus()
        document.execCommand("Copy"), can.page.Remove(can, input)
        can.user.toast(can, text, "复制成功")
        event.stopPropagation(), event.preventDefault()
    },

    camera: function(can, msg, cb) {
        navigator.getUserMedia({video: true}, cb, function(error) {
            can.base.Log(error)
        })
    },
    trans: function(can, text) {
        if (typeof text == "function") {
            text = text.name || ""
        }
        return can._trans && can._trans[text] || can.Conf("trans."+text) || can.Conf("feature.trans."+text) || {

        }[text] || text
    },
    topic: function(can, name) {
        can.page.Modify(can, document.body, {className: name})
        if (can.user.isMobile) { can.page.ClassList.add(can, document.body, "mobile") }
    },
    toast: function(can, text, title, duration, progress) {
        var meta = typeof text == "object"? text: {text: text, title: title||can._help, duration: duration, progress: progress}
        var width = meta.width||400, height = meta.height||100

        var ui = can.page.Append(can, document.body,  [{view: "toast", style: {
            width: width, bottom: 100, left: document.body.clientWidth/2-width/2,
        }, list: [
            {text: [meta.title||"", "div", "title"]},
            typeof meta.text == "object"? meta.text: {text: [meta.text||"执行成功", "div", "content"]},
            {view: ["button"], list: meta.button},
            {text: ["", "div", "duration"]},
            meta.progress > 0 && {text: ["", "div", "progress"], style: {width: width}, list: [
                {text: ["", "div", "current"], style: {width: meta.progress/100*width}},
            ]},
        ], ondblclick: function(event) { ui.Close() }}])

        var timer = can.core.Timer({value: 100, length: (meta.duration||1000)/100}, function(event, interval, index) {
            if (index > 20) { ui.duration.innerHTML = parseInt(index/10)+"."+(index%10)+"s..." }
        }, function() {
            can.page.Remove(can, ui.first), timer.stop = true
        })

        ui.Close = function() { can.page.Remove(can, ui.first), timer.stop = true }
        return ui
    },
    share: function(can, msg, cmd) {
        can.run(msg._event, cmd||["action", "share"], function(msg) {
            var src = can.user.MergeURL(can, {_path: "/share/"+msg.Result()}, true)
            var ui = can.user.toast(can, {
                title: can.page.Format("a", "/share?share="+msg.Result(), "share"),
                text: can.page.Format("img", src+"/share"), width: 300, height: 300, duration: 100000,
                button: [{button: ["确定", function(event) { ui.Close() }]}],
            })
        })
    },
    login: function(can, cb) {
        var ui = can.user.input({clientX: 200, clientY: 100}, can, [
            {username: "username", name: "用户"},
            {password: "password", name: "密码"},
            {button: [["登录", function(event) {
                can.user.Cookie(can, "sessid", "")
                can.run({}, ["login", ui["用户"].value, ui["密码"].value], function(msg) {
                    if (can.user.Cookie(can, "sessid")||msg.Option("user.name")||msg.Result()) {
                        can.page.Remove(can, ui.first); return typeof cb == "function" && cb()
                    }
                    can.user.alert("用户或密码错误")
                })
            }], ["扫码", function(event) {
                // TODO
            }]]},
        ], function(event, button, data, list) {
            // TODO
        })
    },
    carte: function(event, can, meta, list, cb) {
        meta = meta||can.ondetail||can.onaction||{}, list = list&&list.length > 0? list: meta.list||[]; if (list.length == 0) { return }
        cb = cb||function(ev, item, meta) {
            var cb = meta[item] || can.ondetail&&can.ondetail[item] || can.onaction&&can.onaction[item] || can.onkeymap&&can.onkeymap._remote
            typeof cb == "function" && cb(event, can, item)
        }

        var x = event.clientX, y = event.clientY; y += 0; if (x > 600) { x -= 20 }

        var ui = can.page.Append(can, document.body, [{view: "carte", style: {left: x, top: y}, onmouseleave: function(event) {
            can.page.Remove(can, ui.first)
        }, list: can.core.List(list, function(item) {
            return {view: "item", list: [typeof item == "string"? /* button */ {text: item, click: function(event) {
                can.user.isMobile && can.page.Remove(can, ui.first)
                typeof cb == "function" && cb(event, item, meta)
            }}: item.args? /* input */ {text: item.name, click: function(event) {
                can.user.input(event, can, item.args, cb)
            }}: /* select */ {select: [item, function(event) {
                typeof cb == "function" && cb(event, event.target.value, meta)
            }]} ]}
        }) }])

        event.stopPropagation()
        event.preventDefault()
        return ui
    },
    input: function(event, can, form, cb) { // form [ string, {_input: }, array, object, button ]
        function cbs(event, button) {
            var data = {}; var list = can.page.Select(can, ui.table, "select,input,textarea", function(item) {
                return data[item.name] = item.value
            })
            if (typeof cb == "function" && cb(event, button, data, list)) {
                can.page.Remove(can, ui.first)
            }
        }

        var msg = can.request(event)
        var x = event.clientX||200, y = event.clientY||48; y += 10; if (x > 600) { x -= 160 }
        if (can.user.isMobile) { x = 100, y = 100 }

        var button; var ui = can.page.Append(can, document.body, [{view: ["input", "fieldset"], style: {left: x+"px", top: y+"px"}, list: [
            {view: ["option", "table"], list: can.core.List(form, function(item) {
                if (item.button) { button = can.core.List(item.button, function(item) {
                    return {button: typeof item == "object"? item: [item, function(event) { cbs(event, item) }]}
                }); return }

                function _init(target) { can.onappend.figure(can, item, item.value, target) }

                return {type: ["tr"], list: [
                    {type: "td", list: [{text: typeof item == "string"? item: item.length > 0? item[0]: item.name || ""}]},
                    {type: "td", list: [typeof item == "string"? /* input */ {input: item, data: {autofocus: true}, _init: _init}:
                        item._input == "textarea"? /* textarea */ {type: "textarea", data: item, _init: _init}:
                        item._input == "select"? /* select */ {select: [[item.name].concat(item.values)], data: item}:
                        item._input? /* input */ {type: "input", data: (item.type = item._input, item), _init: _init}:
                        item.length > 0? /* select */ {select: [item]}:
                        /* other */ item,
                    ], _init: function(target) {
                        target.value = target.value || msg.Option(item.name)
                    }},
                ]}
            })},
            {view: "action", list: button||[{button: ["提交", function(event) {
                cbs(event, "提交")
            }]}, {button: ["关闭", function(event, button) {
                can.page.Remove(can, ui.first)
            }]}]},
        ]}])
        can.page.Select(can, ui.first, "input", function(item, index) {
            index == 0 && (item.focus(), item.setSelectionRange(0, -1))
        })
        return ui
    },
    select: function(event, can, type, fields, cb, cbs) {
        var msg = can.request(event, {fields: fields||"pod,name,text"})
        can.run(msg._event, ["search", "Search.onimport.select", type, "", ""], function(list) {
            can.core.Next(list, cb, cbs||function() {
                can.user.toast(can, "添加成功")
            })
        })
    },
    upload: function(event, can) { var begin = new Date()
        var x = event.clientX, y = event.clientY; y += 10; if (x > 400) { x -= 200 }
        if (can.user.isMobile) { x = 100, y = 100 }
        var ui = can.page.Append(can, document.body, [{view: "upload", style: {left: x+"px", top: y+"px"}, list: [
            {view: "action"}, {view: "output"},
        ]}])

        function show(event, value, total, loaded) {
            var now = new Date(); can.page.Appends(can, ui.output, [
                {view: ["progress"], style: {height: "10px", border: "solid 2px red"}, list: [{
                    view: ["progress"], style: {height: "10px", width: value + "%", background: "red"},  
                }]},
                {text: [value+"%", "div"], style: {"float": "right"}},
                {text: [can.base.Duration(now - begin), "div"], style: {"float": "left"}},
                {text: [can.base.Size(loaded)+"/"+can.base.Size(total), "div"], style: {"text-align": "center"}},
            ])
        }

        var action = can.page.AppendAction(can, ui.action, [
            {type: "input", data: {name: "upload", type: "file", onchange: function(event) {
                var file = action.upload.files[0]
                show(event, 0, file.size, 0)
            }}, style: {width: "200px"}}, "上传", "关闭"], function(event, value, cmd) {
                if (value == "关闭") { return can.page.Remove(can, ui.first) }
                if (action.upload.files.length == 0) {return action.upload.focus()}

                var msg = can.request(event)
                can.core.Item(can.Option(), msg.Option)

                // 上传文件
                begin = new Date()
                msg._progress = show
                msg.upload = action.upload.files[0]
                msg.Option("_upload", "file")
                can.run(event, ["action", "upload"], function(msg) {
                    can.user.toast(can, "上传成功")
                }, true)
            })
        action.upload.click()
        return ui
    },
    download: function(can, path) {
        var a = can.page.Append(can, document.body, [{type: "a", href: path, download: path.split("/").pop()}]).first
        a.click()
        can.page.Remove(can, a)
    },
    logout: function(can) {
        if (can.user.confirm("logout?")) {
            can.user.Cookie(can, "sessid", "")
            can.user.reload(true)
        }
    },

    MergeURL: shy("地址链接", function(can, objs, clear) { var obj = objs || {}; var path = location.pathname;
        obj._path && (path = obj._path, delete(obj._path))
        !clear && can.core.Item(can.user.Search(), function(key, value) {obj[key] || (obj[key] = value)});
        return can.core.List([location.origin+path, can.core.Item(obj, function(key, value) {
            if (!value) { return }
            return can.core.List(value, function(value) {return key+"="+encodeURIComponent(value)}).join("&")
        }).join("&")], function(item) { return item? item: undefined }).join("?")
    }),
    Search: shy("请求参数", function(can, key, value) {var args = {}
        location.search && location.search.slice(1).split("&").forEach(function(item) {var x = item.split("=")
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
            // return args[key] || can.user.Cookie(can, key)
            return args[key]
        } else {
            args[key] = value
            args[key] == "" && delete(args[key])
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

