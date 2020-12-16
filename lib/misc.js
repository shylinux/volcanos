Volcanos("misc", {help: "工具模块",
    Message: function(event, can) { var msg = {} 
        msg.__proto__ = {_event: event, _can: can,
            Option: function(key, val) {
                if (key == undefined) { return msg && msg.option || [] }
                if (typeof key == "object") { can.core.Item(key, msg.Option) }
                if (val == undefined) { return msg && msg[key] && msg[key][0] || "" }
                msg.option = msg.option || [], can.core.List(msg.option, function(k) { if (k == key) { return k } }).length > 0 || msg.option.push(key)
                msg[key] = can.core.List(arguments).slice(1)
                return val
            },
            Append: function(key, val) {
                if (key == undefined) { return msg && msg.append || [] }
                if (typeof key == "object") { can.core.Item(key, msg.Append) }
                if (val == undefined) { return msg && msg[key] && msg[key][0] || "" }
                msg.append = msg.append || [], can.core.List(msg.append, function(k) { if (k == key) { return k } }).length > 0 || msg.append.push(key)
                msg[key] = can.core.List(arguments).slice(1)
                return val
            },
            Result: function() {
                return msg.result && msg.result.join("") || ""
            },
            Table: function(cb) { if (!msg.append || !msg.append.length || !msg[msg.append[0]]) { return }
                var max = "", len = 0; can.core.List(msg.append, function(key, index) {
                    if (msg[key] && msg[key].length > len) { max = key, len = msg[key].length }
                })

                return can.core.List(msg[max], function(value, index, array) { var one = {}, res
                    can.core.List(msg.append, function(key) { one[key] = (msg[key]&&msg[key][index]||"").trim() })
                    return typeof cb == "function" && (res = cb(one, index, array)) && res != undefined && res || one
                })
            },
            Clear: function(key) {
                switch (key) {
                    case "append":
                    case "option":
                        can.core.List(msg[key], function(item) {
                            delete(msg[item])
                        })
                    default:
                        msg[key] = []
                }
            },
            Copy: function(res) { if (!res) { return msg }
                res.result && (msg.result = (msg.result||[]).concat(res.result))
                res.append && (msg.append = res.append) && res.append.forEach(function(item) {
                    res[item] && (msg[item] = (msg[item]||[]).concat(res[item]))
                })
                res.option && (msg.option = res.option) && res.option.forEach(function(item) {
                    res[item] && (msg[item] = res[item])
                })
                return msg
            },
            Push: function(key, value, detail) { msg.append = msg.append || []
                if (typeof key == "object") {
                    value = value || can.core.Item(key)
                    can.core.List(value, function(item) {
                        detail? msg.Push("key", item).Push("value", key[item]||""):
                            msg.Push(item, key[item]||"")
                    })
                    return
                }

                for (var i = 0; i < msg.append.length; i++) {
                    if (msg.append[i] == key) {
                        break
                    }
                }
                if (i >= msg.append.length) { msg.append.push(key) }
                msg[key] = msg[key] || []
                msg[key].push(""+(typeof value == "object"? JSON.stringify(value): value)+"")
                return msg
            },
            Echo: function(res) { msg.result = msg.result || []
                for (var i = 0; i < arguments.length; i++) { msg.result.push(arguments[i]) }
                return msg._hand = true, msg
            },
        }
        return msg
    },
    POST: shy("请求后端", {order: 0}, function(can, msg, url, form, cb) {
        var xhr = new XMLHttpRequest()
        xhr.open("POST", url), xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) {return}

            switch (xhr.getResponseHeader("content-type")) {
                case "image/png":
                    if (xhr.responseType != "blob") {
                        msg.responseType = "blob"
                        can.misc.POST(can, msg, url, form, cb)
                        return
                    }
                    break
                default:
                    try { // 解析响应
                        var res = JSON.parse(xhr.responseText)
                    } catch (e) {
                        var res = {"result": [xhr.responseText]}
                    }
            }
            xhr.status == 200 && typeof cb == "function" && cb(msg.Copy(res))
        }

        if (msg.upload) {
            // 文件参数
            var data = new FormData()
            can.core.Items(form, function(value, index, key) {
                data.append(key, item)
            }), data.append("upload", msg.upload)

            xhr.upload.onprogress = function(event) {
                typeof msg._progress == "function" && msg._progress(event, parseInt(event.loaded*100/event.total), event.total, event.loaded)
            }
        } else {
            // 表单参数
            var data = can.core.Items(form, function(value, index, key) {
                return key+"="+encodeURIComponent(value)
            }).join("&")
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        }

        // 发送请求
        ++arguments.callee.meta.order
        xhr.setRequestHeader("Accept", "application/json")
        xhr.responseType = msg.responseType || ""
        try {
            xhr.send(data)
        } catch(e) {
            console.error(e)
            cb == "function" && cb(msg)
        }
        msg._xhr = xhr
    }),
    Run: shy("请求后端", {order: 0}, function(event, can, dataset, cmd, cb) {
        var msg = can.request(event = event || {})

        // 解析参数
        var option = {cmds: cmd||msg.cmd}
        msg.option && msg.option.forEach(function(item) {
            msg[item] && (option[item] = msg[item])
        })
        msg.option = can.core.Item(option, function(key, value) {
            return msg[key] = value, key
        })

        msg._hand = true, can.misc.POST(can, msg, can.Conf("iceberg")+(msg.names||dataset.names||event.names||"").toLowerCase()+"?="+(msg._can.sup||msg._can)._name, option, function(msg) {
            typeof cb == "function" && cb(msg)
        }), delete(event.msg)
    }),
    WSS: shy("请求后端", {order: 0}, function(can, url, args, cb, onopen, onerror, onclose) {var meta = arguments.callee.meta
        if (url.indexOf("ws") == -1) {
            url = location.protocol.replace("http", "ws")+"//"+location.host+"/space/" + (url||"")
        }
        if (url.indexOf("chrome") == 0) {
            url = "ws://localhost:9020/space/"
        }

        if (can._socket) {return can._socket}
        args["share"] = can._share || ""
        can._socket = new WebSocket(url+"?"+can.base.Args(args))

        can._socket.onclose = onclose || function() {if (!can._socket) {return}
            console.log("socket close")

            delete(can._socket), setTimeout(function() {
                // 断线重连
                can.misc.WSS(can, url, args, cb, onopen, onerror, onclose)
            }, 1000)
        }, can._socket.onerror = onerror || function() {if (!can._socket) {return}
            console.log("socket error")

            can._socket.close(), delete(can._socket), setTimeout(function() {
                // 断线重连
                can.misc.WSS(can, url, args, cb, onerror, onclose, onopen)
            }, 1000)
        }, can._socket.onopen = onopen || function() {

        }

        can._socket.onmessage = function(event) {var order = ++meta.order
            try { // 解析命令
                var data = JSON.parse(event.data)
            } catch (e) {
                var data = {"result": [event.data]}
            }

            var msg = can.request(event); msg.Reply = function() {
                // 回复命令
                delete(msg._can)
                delete(msg._event)
                msg.Option("_handle", true)
                msg.Option("_target", msg.Option("_source"))
                console.log(["wss", order, "result"].concat(msg.result).concat([msg]))
                can._socket.send(JSON.stringify(msg))
            }, msg.detail = data.detail, msg.Copy(data)

            try { // 执行命令
                console.log(["wss", order].concat(msg.detail).concat([msg]))
                typeof cb == "function" && cb(event, msg, msg.detail[0], msg.detail.slice(1))

            } catch (e) { // 执行失败
                console.log(e)
            }
        }
        return can._socket
    }),
})

