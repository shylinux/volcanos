Volcanos("misc", {help: "工具模块",
    POST: shy("请求后端", {order: 0}, function(can, msg, url, form, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url), xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) {return}
            try { // 解析响应
                var res = JSON.parse(xhr.responseText);
            } catch (e) {
                var res = {"result": [xhr.responseText]}
            }
            xhr.status == 200 && typeof cb == "function" && cb(msg.Copy(res));
        }

        if (msg.upload) {
            // 文件参数
            var data = new FormData();
            can.core.Item(form, function(key, value) {
                can.core.List(value, function(item) {data.append(key, item)});
            })
            data.append("upload", msg.upload);
            xhr.upload.onprogress = function(event) {
                typeof msg._progress == "function" && msg._progress(event, parseInt(event.loaded/event.total*100), event.total, event.loaded)
            }
        } else {
            // 表单参数
            var data = can.core.Items(form, function(value, index, key) {
                return key+"="+encodeURIComponent(value)
            }).join("&");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }

        // 发送请求
        ++arguments.callee.meta.order
        xhr.setRequestHeader("Accept", "application/json")
        xhr.send(data)
        msg._xhr = xhr
    }),
    Run: shy("请求后端", {order: 0}, function(event, can, dataset, cmd, cb) {
        var msg = can.Event(event);

        // 解析参数
        var option = {"cmds": cmd||msg.cmd}
        msg.option && msg.option.forEach(function(item) {
            msg[item] && (option[item] = msg[item])
        })
        msg.option = can.core.Item(option, function(key, value) {
            return msg[key] = value, key
        })

        msg._hand = true, can.misc.POST(can, msg, can.Conf("iceberg")+(msg.names||dataset.names||event.names||"").toLowerCase(), option, function(msg) {
            typeof cb == "function" && cb(msg)
        }), delete(event.msg)
    }),
    WSS: shy("请求后端", {order: 0}, function(can, url, args, cb, onopen, onerror, onclose) {var meta = arguments.callee.meta
        can._socket = new WebSocket(url+"?"+can.base.Args(args))

        var timer = can.Timer(30000, function() {can._socket.send("{}")})
        can._socket.onclose = onclose || function() {
            timer.stop = true, can.user.toast("wss redial")
            can.Log("wss", "close"), delete(can._socket), setTimeout(function() {
                // 断线重连
                can.misc.WSS(can, url, args, cb, onerror, onclose, onopen)
            }, 1000)
        }, can._socket.onerror = onerror || function() {
            can._socket.close()
        }, can._socket.onopen = onopen

        can._socket.onmessage = function(event) {var order = ++meta.order
            try {
                // 解析命令
                var msg = JSON.parse(event.data)
            } catch (e) {
                var msg = {"result": [event.data]}
            }

            msg = can.Event(event, msg), msg.Reply = function() {
                // 回复命令
                msg.Option("_handle", true)
                msg.Option("_target", msg.Option("_source"))
                can.Log(["wss", order, "result"].concat(msg.result).concat([msg]))
                delete(msg.event), can._socket.send(JSON.stringify(msg))
            }

            try {
                // 执行命令
                can.Log(["wss", order].concat(msg.detail).concat([msg]))
                typeof cb == "function" && cb(event, msg)
            } catch (e) {
                // 执行失败
                msg.Reply(can.Log("err", e))
            }
        }
        return can._socket
    }),
})

