Volcanos("misc", {help: "工具模块", Message: function(event, can) { var msg = {} 
        var proto = {_event: event, _can: can,
            Option: function(key, val) {
                if (key == undefined) { return msg && msg.option || [] }
                if (typeof key == "object") { can.core.Item(key, msg.Option) }
                if (val == undefined) { return msg && msg[key] && msg[key][0] || "" }
                msg.option = msg.option || [], can.core.List(msg.option, function(k) { if (k == key) { return k } }).length > 0 || msg.option.push(key)
                return msg[key] = can.core.List(arguments).slice(1), val
            },
            Append: function(key, val) {
                if (key == undefined) { return msg && msg.append || [] }
                if (typeof key == "object") { can.core.Item(key, msg.Append) }
                if (val == undefined) { return msg && msg[key] && msg[key][0] || "" }
                msg.append = msg.append || [], can.core.List(msg.append, function(k) { if (k == key) { return k } }).length > 0 || msg.append.push(key)
                return msg[key] = can.core.List(arguments).slice(1), val
            },
            Result: function() { return msg.result && msg.result.join("") || "" },

            Table: function(cb) { if (!msg.append || msg.append.length == 0 || !msg[msg.append[0]]) { return }
                var max = "", len = 0; can.core.List(msg.append, function(key, index) {
                    if (msg[key] && msg[key].length > len) { max = key, len = msg[key].length }
                })

                return can.core.List(msg[max], function(value, index, array) { var one = {}, res
                    can.core.List(msg.append, function(key) { one[key] = (msg[key]&&msg[key][index]||"") })
                    return typeof cb == "function" && (res = cb(one, index, array)) && res != undefined && res || one
                })
            },
            Clear: function(key) {
                switch (key) {
                    case "append":
                    case "option":
                        can.core.List(msg[key], function(item) { delete(msg[item]) })
                    default: msg[key] = []
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
                    value = value || can.core.Item(key), can.core.List(value, function(item) {
                        detail? msg.Push("key", item).Push("value", key[item]||""):
                            msg.Push(item, key[item]||"")
                    })
                    return msg
                }

                for (var i = 0; i < msg.append.length; i++) {
                    if (msg.append[i] == key) { break }
                }; i >= msg.append.length && msg.append.push(key)

                msg[key] = msg[key] || []
                msg[key].push(typeof value == "string" || typeof value == "function"? value: JSON.stringify(value))
                return msg
            },
            Echo: function(res) { msg.result = msg.result || []
                for (var i = 0; i < arguments.length; i++) { msg.result.push(arguments[i]) }
                return msg._hand = true, msg
            },
            Length: function() {
                return msg.append && msg.append[0] && msg[msg.append[0]] && msg[msg.append[0]].length || 0
            },
        }

        for (var k in proto) { msg[k] = proto[k] }
        return msg
    },
    POST: shy("请求后端", {order: 0}, function(can, msg, url, form, cb) {
        var xhr = new XMLHttpRequest(); msg._xhr = xhr
        xhr.open("POST", url), xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) { return }

            try { // 解析响应
                var res = JSON.parse(xhr.responseText)
            } catch (e) {
                var res = {"result": [xhr.responseText]}
            }
            xhr.status == 200 && typeof cb == "function" && cb(msg.Copy(res))
        }

        if (msg.upload) { // 上传文件
            var data = new FormData()
            can.core.Items(form, function(value, index, key) {
                data.append(key, value)
            }), data.append("upload", msg.upload)

            xhr.upload.onprogress = function(event) {
                typeof msg._progress == "function" && msg._progress(event, parseInt(event.loaded*100/event.total), event.total, event.loaded)
            }
        } else { // 请求数据
            var data = can.core.Items(form, function(value, index, key) {
                return key+"="+encodeURIComponent(value)
            }).join("&")

            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        }

        // 发送请求
        xhr.setRequestHeader("Accept", "application/json")
        try { xhr.send(data) } catch(e) { can.base.Log(e) }
    }),
    Run: shy("请求后端", {order: 0}, function(event, can, dataset, cmds, cb) {
        var msg = can.request(event = event || {})
        var form = {cmds: cmds||msg.cmd}
        msg.option && msg.option.forEach(function(item) {
            msg[item] && (form[item] = msg[item])
        })

        can.misc.POST(can, msg, (can.Conf("iceberg")?can.Conf("iceberg"):"/chat/")+dataset.names.toLowerCase()+"?="+(msg._can.sup||msg._can)._name, form, function(msg) {
            typeof cb == "function" && cb(msg)
        })
    }),
    WSS: shy("请求后端", {order: 0}, function(can, args, cb, onopen, onclose, onerror) {
        var url = location.protocol.replace("http", "ws")+"//"+location.host+"/space/"
        if (url.indexOf("chrome") == 0) { url = "ws://localhost:9020/space/" }

        var socket = new WebSocket(can.base.URLMerge(url, args))
        socket.onclose = function() { can.base.Log("wss", "close", args)
            typeof onclose == "function"? onclose(socket): can.core.Timer(1000, function() {
                can.misc.WSS(can, args, cb, onopen, onerror, onclose)
            })
        }, socket.onerror = function() { can.base.Log("wss", "error", args)
            typeof onerror == "function"? onerror(socket): socket.close()

        }, socket.onopen = function() { can.base.Log("wss", "open", args)
            typeof onopen == "function" && onopen(socket)
        }

        socket.onmessage = function(event) {
            try { // 解析命令
                var data = JSON.parse(event.data)
            } catch (e) {
                var data = {"detail": [event.data]}
            }

            var msg = can.request(event); msg.Reply = function() {
                msg.result = (msg.result||[]).concat(can.core.List(arguments))

                // 回复命令
                delete(msg._can)
                delete(msg._event)
                msg.Option("_handle", true)
                msg.Option("_target", msg.Option("_source"))
                can.base.Log("wss", "result", msg.result, msg)
                socket.send(JSON.stringify(msg))
            }, msg.detail = data.detail, msg.Copy(data)

            try { // 执行命令
                can.base.Log("wss", "detail", msg.detail, msg)
                typeof cb == "function" && cb(event, msg, msg.detail[0], msg.detail.slice(1))
            } catch (e) { // 执行失败
                can.base.Log(e)
                msg.Reply(e)
            }
        }
    }),
})

