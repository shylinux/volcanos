Volcanos({
    chrome: function(can, msg, arg, cb) {
        if (arg.length == 0 || arg[0] == "") { // 窗口列表
            chrome.windows.getAll(function(wins) {
                can.core.List(wins, function(win) { win.wid = win.id
                    msg.Push(win, ["wid", "state", html.LEFT, html.TOP, html.WIDTH, html.HEIGHT])
                }), can.base.isFunc(cb) && cb(msg)
            })
        } else if (arg.length == 1 || arg[1] == "") { // 标签列表
            chrome.tabs.getAllInWindow(parseInt(arg[0]), function(tabs) {
                can.core.List(tabs, function(tab) { tab.tid = tab.id
                    msg.Push(tab, ["tid", "active", html.WIDTH, html.HEIGHT, "index", "title", "url"])
                }), can.base.isFunc(cb) && cb(msg)
            })
        } else if (arg[1] == "current") { // 当前标签
            chrome.tabs.query({currentWindow: true, active: true}, function(tabs) { arg[1] = tabs[0].id
                chrome.tabs.sendMessage(parseInt(arg[1]), msg, function(res) {
                    can.base.isFunc(cb) && cb(msg.Copy(res))
                })
            })
        } else { // 下发命令
            chrome.tabs.sendMessage(parseInt(arg[1]), msg, function(res) {
                can.base.isFunc(cb) && cb(msg.Copy(res))
            })
        }
    },
    _daemon: function(can) {
        can.misc.WSS(can, {type: html.CHROME, name: html.CHROME}, function(event, msg, cmd, arg) {
            if (msg.Option(ice.MSG_TARGET)) { msg.detail = ["", "", ""].concat(msg.detail)
                chrome.tabs.sendMessage(parseInt(msg.Option(ice.MSG_TARGET)), msg, function(res) {
                    msg.Copy(res), msg.Reply()
                })
                return
            }
            can.core.CallFunc([can, cmd], {can: can, msg: msg, arg: arg, cb: function() { msg.Reply() }})
        })
        chrome.runtime.onMessage.addListener(function(req, sender, cb) {
            var msg = can.request({}, {tid: sender.tab.id, url: sender.url})
            can.core.List(req.option, function(key) { msg.Option(key, req[key][0]) })
            msg.__daemon = can.core.Keys(html.CHROME, sender.tab.id)
            can.run(msg, req.detail||[], cb)
            return true
        })
        chrome.history.onVisited.addListener(function(item) {
            can.run({}, ["sync", mdb.TYPE, "link", mdb.NAME, item.title, mdb.LINK, item.url, "tid", item.id])
        })
    },
    _motion: function(can) {
        can.user.toast = function(can, message, title) { chrome.notifications.create(null, {
            message: message, title: title||can._name, iconUrl: "/favicon.ico", type: "basic",
        })},
        chrome.contextMenus.create({title: "volcanos", onclick: function(event) {
            chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
                var msg = can.request(event); msg.detail = [html.CHROME, "", "", "order"]
                chrome.tabs.sendMessage(tabs[0].id, msg)
            })
        }})
    },
}, function(can) {
    can.run = function(event, cmds, cb) { var msg = can.request(event)
        can.misc.Run(event, can, {names: "http://localhost:9020/code/chrome/"+cmds[0]}, cmds.slice(1), cb)
    }, can._daemon(can), can._motion(can)
})

