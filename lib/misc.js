Volcanos("misc", {help: "工具模块",
    POST: shy("请求后端", {order: 0}, function(can, msg, url, form, cb) {
        var args = can.core.Items(form, function(value, index, key) {
            return key+"="+encodeURIComponent(value)
        })

        var xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) {return}
            if (xhr.status != 200) {return}

            try {
                var res = JSON.parse(xhr.responseText||'[{"result":[]}]')
                res.length > 0 && res[0] && (res = res[0])

                if (res.download_file) {
                    window.open(res.download_file.join(""))
                } else if (res.page_redirect) {
                    location.href = res.page_redirect.join("")
                } else if (res.page_refresh) {
                    location.reload()
                }
            } catch (e) {
                var res = {"result": [xhr.responseText]}
            }

            typeof cb == "function" && cb(msg.Copy(res))
        }

        xhr.open("POST", url)
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        xhr.setRequestHeader("Accept", "application/json")
        xhr.send(args.join("&"))
        ++arguments.callee.meta.order
    }),
    Run: shy("请求后端", {order: 0}, function(event, can, dataset, cmd, cb) {
        var msg = can.Event(event)

        var option = {"cmds": cmd}
        msg.option && msg.option.forEach(function(item) {
            msg[item] && (option[item] = msg[item])
        })
        for (var k in dataset) {
            option[k] = dataset[k].toLowerCase().split(",")
        }

        var what = ++arguments.callee.meta.order

        msg._hand = true
        msg.option = []
        for (var k in option) {
            msg.option.push(k)
            msg[k] = option[k]
        }
        // msg.detail = ["run", what].concat(option.group).concat(option.names).concat(option.cmds)
        // kit.Log(msg.detail.concat([msg]))

        // kit.History("run", -1, option)
if (can.user.Search(can, "feature") == "ice") {
        this.POST(can, msg, can.Conf("context")+msg.Option("names"), option, function(msg) {
            // kit.Log("run", what, "result", msg.result? msg.result[0]: "", msg)
            typeof cb == "function" && cb(msg)
        }), delete(event.msg)
} else {
        this.POST(can, msg, can.Conf("context"), option, function(msg) {
            // kit.Log("run", what, "result", msg.result? msg.result[0]: "", msg)
            typeof cb == "function" && cb(msg)
        }), delete(event.msg)
}
    }),
})

