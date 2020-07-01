var can = Volcanos("chrome", {
    chrome: function(msg, cmd, cb) {
        if (cmd.length == 0) {
            // 窗口列表
            chrome.windows.getAll(function(wins) {
                can.core.List(wins, function(win) {win.wid = win.id
                    msg.Push(win, ["wid", "state", "left", "top", "width", "height"])
                })
                typeof cb == "function" && cb(msg)
            })
            return
        }
        if (cmd.length == 1) {
            // 标签列表
            chrome.tabs.getAllInWindow(parseInt(cmd[0]), function(tabs) {
                can.core.List(tabs, function(tab) {tab.tid = tab.id
                    msg.Push(tab, ["tid", "active", "width", "height", "index", "title", "url"])
                })
                typeof cb == "function" && cb(msg)
            })
            return
        }

        // 新建标签
        chrome.tabs.create({windowId: parseInt(cmd[0]), url: cmd[1], selected: false}, function() {
            can.chrome(msg, [cmd[0]], cb)
        })
    },
    bookmark: function(msg, cmd, cb) {
        chrome.bookmarks.getSubTree(cmd[0]||"0", function(labs) {
            for (var i = 0; i < labs.length; i++) {labs[i].pid = labs[i].parentId
                msg.Push("time", can.base.Time(labs[i].dateAdded))
                msg.Push(labs[i], ["pid", "id", "index", "title", "url"])
                labs = labs.concat(labs[i].children||[])
            }
            typeof cb == "function" && cb(msg)
        })
    },
}, ["/lib/base", "/lib/core", "/lib/misc", "/lib/page", "/lib/user"], function(can) {can.Conf({iceberg: "http://localhost:9020/"})
    can.user.toast = function(message, title) {chrome.notifications.create(null, {
        message: message, title: title||"volcanos", iconUrl: "/favicon.ico", type: "basic",
    })},

    can.misc.WSS(can, "ws://localhost:9020/space/", {name: "chrome", type: "chrome"}, function(event, msg) {
        if (msg.Option("_handle")) { return can.user.toast(msg.result.join("")) }

        can.user.toast(msg.detail.join(" "))
        switch (msg.detail[0]) {
            case "space": can._share = msg.detail[2]; break
            case "pwd": msg.Echo("hello world"); break
            default: (can[msg.detail[0]]||can.chrome[msg.detail[0]])(msg, msg.detail.slice(1), function(msg) {
                msg.Reply(msg)
            }); return
        }
        msg.Reply(msg)
    }, function() {can.user.toast("wss connect", "iceberg")})

    can.run = function(event, cmd, cb, silent) { var msg = can.request(event)
        can.misc.Run(event, can, {names: "code/chrome/crx"}, cmd, cb)
    },
    chrome.history.onVisited.addListener(function(item) {
        can.run({}, ["history", item.id, item.title, item.url])
    })
})

