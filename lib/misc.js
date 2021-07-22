Volcanos("misc", {help: "通信协议", Message: function(event, can) { var msg = {} 
        var proto = {_event: event, _can: can,
            OptionStatus: function() { return msg.Option("_status") },
            OptionProcess: function() { return msg.Option("_process") },
            Option: function(key, val) {
                if (key == undefined) { return msg && msg.option || [] }
                if (typeof key == "object") { can.core.Item(key, msg.Option) }
                if (val == undefined) { return msg && msg[key] && msg[key][0] || "" }
                return msg.option = can.base.AddUniq(msg.option, key), msg[key] = can.core.List(arguments).slice(1), val
            },
            Append: function(key, val) {
                if (key == undefined) { return msg && msg.append || [] }
                if (typeof key == "object") { can.core.Item(key, msg.Append) }
                if (val == undefined) { return msg && msg[key] && msg[key][0] || "" }
                return msg.append = can.base.AddUniq(msg.append, key), msg[key] = can.core.List(arguments).slice(1), val
            },
            Result: function() { return msg.result && msg.result.join("") || "" },

            Length: function() {
                var max = "", len = 0; can.core.List(msg.append, function(key, index) {
                    if (msg[key] && msg[key].length > len) { max = key, len = msg[key].length }
                })
                return len
            },
            Table: function(cb) { if (!msg.append || msg.append.length == 0) { return }
                var max = "", len = 0; can.core.List(msg.append, function(key, index) {
                    if (msg[key] && msg[key].length > len) { max = key, len = msg[key].length }
                })

                return can.core.List(msg[max], function(value, index, array) { var one = {}, res
                    can.core.List(msg.append, function(key) { one[key] = (msg[key]&&msg[key][index]||"") })
                    return can.base.isFunc(cb) && (res = cb(one, index, array)) && res != undefined && res || one
                })
            },
            Clear: function(key) { switch (key) {
                case "append":
                case "option":
                    can.core.List(msg[key], function(item) { delete(msg[item]) })
                default: msg[key] = []
            } },
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
            Push: function(key, value, detail) {
                if (typeof key == "object") {
                    value = value || can.core.Item(key), can.core.List(value, function(item) {
                        detail? msg.Push("key", item).Push("value", key[item]||""):
                            msg.Push(item, key[item]||"")
                    })
                    return msg
                }

                msg.append = can.base.AddUniq(msg.append, key), msg[key] = msg[key] || []
                msg[key].push(typeof value == "string" || typeof value == "function"? value: JSON.stringify(value))
                return msg
            },
            Echo: function(res) { msg.result = msg.result || []
                for (var i = 0; i < arguments.length; i++) { msg.result.push(arguments[i]) }
                return msg._hand = true, msg
            },
        }; msg.__proto__ = proto
        return msg
    },
    POST: function(can, msg, url, form, cb) {
        var xhr = new XMLHttpRequest(); msg._xhr = xhr
        xhr.open(msg._method||"POST", url), xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) { return }

            try { // 解析响应
                var res = JSON.parse(xhr.responseText)
            } catch (e) {
                var res = {"result": [xhr.responseText]}
            }
            xhr.status == 200 && can.base.isFunc(cb) && cb(msg.Copy(res))
        }

        if (msg._upload) { // 上传文件
            var data = new FormData(); can.core.Items(form, function(value, index, key) {
                data.append(key, value)
            }), data.append("upload", msg._upload), data.append("_upload", "some")

            xhr.upload.onprogress = function(event) {
                can.base.isFunc(msg._progress) && msg._progress(event, parseInt(event.loaded*100/event.total), event.total, event.loaded)
            }
        } else { // 请求数据
            var data = can.core.Items(form, function(value, index, key) {
                return key+"="+encodeURIComponent(value)
            }).join("&")

            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        }

        // 发送请求
        xhr.setRequestHeader("Accept", "application/json")
        try { xhr.send(data) } catch(e) { can.misc.Log(e) }
    },
    Run: function(event, can, dataset, cmds, cb) {
        var skip = {_handle: true}
        var msg = can.request(event||{})
        var form = {cmds: cmds||msg.cmd}; msg.option && msg.option.forEach(function(item) {
            !skip[item] && msg[item] && (form[item] = msg[item])
        })

        can.misc.POST(can, msg, can.base.MergeURL(dataset.names.toLowerCase(),
            "_", (msg._can.sup||msg._can)._name, "_daemon", msg._daemon||dataset.daemon||"",
        ), form, cb)
    },
    WSS: function(can, args, cb, onopen, onclose, onerror) {
        var url = location.protocol.replace("http", "ws")+"//"+location.host+"/space/"
        if (url.indexOf("chrome") == 0) { url = "ws://localhost:9020/space/" }

        var socket = new WebSocket(can.base.MergeURL(url, args))
        socket.onclose = function() { can.misc.Log("wss", "close", args)
            can.base.isFunc(onclose)? onclose(socket): can.core.Timer(1000, function() {
                can.misc.WSS(can, args, cb, onopen, onerror, onclose)
            })
        }, socket.onerror = function() { can.misc.Log("wss", "error", args)
            can.base.isFunc(onerror)? onerror(socket): socket.close()

        }, socket.onopen = function() { can.misc.Log("wss", "open", args)
            can.base.isFunc(onopen) && onopen(socket)
        }

        socket.onmessage = function(event) {
            try { // 解析命令
                var data = JSON.parse(event.data)
            } catch (e) {
                var data = {"detail": [event.data]}
            }

            var msg = can.request(event); msg.Reply = function() { // 回复命令
                msg.result = (msg.result||[]).concat(can.core.List(arguments))

                msg.Option({_handle: true, _target: msg.Option("_source")})
                can.misc.Log("wss", "result", msg.result, msg)

                delete(msg._event), delete(msg._can)
                socket.send(JSON.stringify(msg))
            }, msg.detail = data.detail, msg.Copy(data)

            // 执行命令
            try {
                can.misc.Log("wss", "detail", msg.detail, msg)
                can.base.isFunc(cb) && cb(event, msg, msg.detail[0], msg.detail.slice(1))
            } catch (e) { // 执行失败
                can.misc.Log(e), msg.Reply()
            }
        }
    },

    Log: function() {
        var args = [this._time(), this.FileLine(2, 3)]
        for (var i in arguments) { args.push(arguments[i]) }
        console.log.apply(console, args)
    },
    Warn: function() {
        var args = [this._time(), this.FileLine(2, 3), "warn"]
        for (var i in arguments) { args.push(arguments[i]) }
        args.push("\n", this._fileLine().split("\n").slice(2).join("\n"))
        console.log.apply(console, args)
    },
    Debug: function() {
        var args = [this._time(), this.FileLine(2, 3), "debug"]
        for (var i in arguments) { args.push(arguments[i]) }
        args.push(this.fileLine(2, 3))
        console.log.apply(console, args)
        navigator.userAgent.indexOf("Mobile") > -1 && alert(JSON.stringify(args.join(" ")))
    },
    FileLine: function(depth, length) {
        return this.fileLine(depth+1).split("/").slice(3).slice(-length).join("/").split(")")[0]
    },
    fileLine: function(depth) {
        return (this._fileLine().split("\n")[1+depth]||"").trim()
    },
    _fileLine: function() { var obj = {}
        Error.captureStackTrace && Error.captureStackTrace(obj, arguments.callee)
        return obj.stack || ""
    },
    _time: function() { var now = new Date()
        return now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()
    },
})

