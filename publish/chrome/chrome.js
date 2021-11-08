Volcanos({
    pwd: function(can, msg, arg) {
        msg.Push("hi", "hello")
        msg.Echo("hello")
    },
    chrome: function(can, msg, arg, cb) {
        if (arg.length == 0) { // 窗口列表
            chrome.windows.getAll(function(wins) {
                can.core.List(wins, function(win) { win.wid = win.id
                    msg.Push(win, ["wid", "state", "left", "top", "width", "height"])
                })
                can.base.isFunc(cb) && cb(msg)
            })
        } else if (arg.length == 1) { // 标签列表
            chrome.tabs.getAllInWindow(parseInt(arg[0]), function(tabs) {
                can.core.List(tabs, function(tab) { tab.tid = tab.id
                    msg.Push(tab, ["tid", "active", "width", "height", "index", "title", "url"])
                })
                can.base.isFunc(cb) && cb(msg)
            })
        } else if (arg[1] == "") { // 当前标签
            chrome.tabs.query({currentWindow: true, active: true}, function(tabs) { arg[1] = tabs[0].id
                chrome.tabs.sendMessage(parseInt(arg[1]), msg, function(res) {
                    can.base.isFunc(cb) && cb(msg.Copy(res))
                })
            })
        } else {
            chrome.tabs.sendMessage(parseInt(arg[1]), msg, function(res) {
                can.base.isFunc(cb) && cb(msg.Copy(res))
            })
        }
    },
}, function(can) {
    can.run = function(event, cmds, cb) { var msg = can.request(event)
        can.misc.Run(event, can, {names: "http://localhost:9020/code/chrome/"+cmds[0]}, cmds.slice(1), cb)
    },
    chrome.history.onVisited.addListener(function(item) {
        can.run({}, ["sync", kit.MDB_TYPE, "link", kit.MDB_NAME, item.title, kit.MDB_TEXT, item.url, "tid", item.id])
    })

    can.user.toast = function(can, message, title) { chrome.notifications.create(null, {
        message: message, title: title||can._name, iconUrl: "/favicon.ico", type: "basic",
    })},
    can.misc.WSS(can, {type: "chrome", name: "chrome"}, function(event, msg, cmd, arg) {
        if (msg.Option("_target")) { msg.detail = ["", "", ""].concat(msg.detail)
            chrome.tabs.sendMessage(parseInt(msg.Option("_target")), msg, function(res) {
                msg.Copy(res), msg.Reply()
            })
            return
        }
        can.core.CallFunc([can, cmd], {can: can, msg: msg, arg: arg, cb: function() { msg.Reply() }})
    })

    chrome.runtime.onMessage.addListener(function(req, sender, cb) {
        var msg = can.request({}, {tid: sender.tab.id, url: sender.url})
        msg.__daemon = "chrome."+sender.tab.id
        can.core.List(req.option, function(key) { msg.Option(key, req[key][0]) })
        can.run(msg._event, req.detail||[], cb)
        return true
    })

    chrome.contextMenus.create({title: "field", onclick: function(event) {
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
            var msg = can.request(event); msg.detail = ["chrome", "", "", "order"]
            chrome.tabs.sendMessage(tabs[0].id, msg)
        })
    }})
})

