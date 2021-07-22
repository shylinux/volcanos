Volcanos("chrome", {
    pwd: function(can, msg, cmds, cb) {
        console.log(cmds)
        cb()
    },
    chrome: function(can, msg, cmds, cb) {
        if (cmds.length == 0) { // 窗口列表
            chrome.windows.getAll(function(wins) {
                can.core.List(wins, function(win) { win.wid = win.id
                    msg.Push(win, ["wid", "state", "left", "top", "width", "height"])
                })
                can.base.isFunc(cb) && cb(msg)
            })
            return
        }
        if (cmds.length == 1) { // 标签列表
            chrome.tabs.getAllInWindow(parseInt(cmds[0]), function(tabs) {
                can.core.List(tabs, function(tab) { tab.tid = tab.id
                    msg.Push(tab, ["tid", "active", "width", "height", "index", "title", "url"])
                })
                can.base.isFunc(cb) && cb(msg)
            })
            return
        }

        if (cmds[1] == "") { // 当前标签
            chrome.tabs.query({currentWindow: true, active: true}, function(tabs) { cmds[1] = tabs[0].id
                chrome.tabs.sendMessage(parseInt(cmds[1]), msg, function(res) {
                    msg.Copy(res), can.base.isFunc(cb) && cb(msg)
                })
            })
        } else {
            chrome.tabs.sendMessage(parseInt(cmds[1]), msg, function(res) {
                can.base.isFunc(cb) && cb(msg.Copy(res))
            })
        }
    },
    bookmark: function(msg, cmds, cb) {
        chrome.bookmarks.getSubTree(cmds[0]||"0", function(labs) {
            for (var i = 0; i < labs.length; i++) {labs[i].pid = labs[i].parentId
                msg.Push("time", can.base.Time(labs[i].dateAdded))
                msg.Push(labs[i], ["pid", "id", "index", "title", "url"])
                labs = labs.concat(labs[i].children||[])
            }
            can.base.isFunc(cb) && cb(msg)
        })
    },
}, ["/lib/base.js", "/lib/core.js", "/lib/misc.js", "/lib/page.js", "/lib/user.js"], function(can) {
    can.run = function(event, cmds, cb) { var msg = can.request(event)
        can.misc.Run(event, can, {names: "http://localhost:9020/code/chrome/"+cmds[0]}, cmds.slice(1), cb)
    },
    chrome.history.onVisited.addListener(function(item) {
        can.run({}, ["sync", "link", item.title, item.url])
    })

    can.user.toast = function(message, title) {chrome.notifications.create(null, {
        message: message, title: title||can._name, iconUrl: "/favicon.ico", type: "basic",
    })},
    can.misc.WSS(can, {type: "chrome", name: "chrome"}, function(event, msg, cmd, arg) {
        if (msg.Option("_target")) { msg.detail = ["", "", ""].concat(msg.detail)
            chrome.tabs.sendMessage(parseInt(msg.Option("_target")), msg, function(res) {
                msg.Copy(res), msg.Reply()
            })
            return
        }
        can.core.CallFunc([can, cmd], {can: can, msg: msg, cmds: arg, cb: function() { msg.Reply() }})
    })

    chrome.runtime.onMessage.addListener(function(req, sender, cb) {
        var msg = can.request({}, {tid: sender.tab.id, url: sender.url})
        msg._daemon = "chrome."+sender.tab.id
        can.core.List(req.option, function(key) { msg.Option(key, req[key][0]) })
        can.run(msg._event, req.detail||[], cb)
        return true
    })

    chrome.contextMenus.create({title: "favor", onclick: function(event) {
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
            var msg = can.request(event); msg.detail = ["chrome", "", "", "favor"]
            chrome.tabs.sendMessage(tabs[0].id, msg, function(res) {
                return
                can.run({}, ["history", "id", response.title, response.src])
            })
        })
    }, })
})

