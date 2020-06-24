var can = Volcanos("chrome", {
    _send: function(msg, cb) {chrome.extension.sendRequest(msg, cb)},
    _open: function(url) {chrome.windows.create({url: url})},

    open: function(msg, cmd, cb) {
        chrome.windows.create({url: cmd[0]})
        typeof cb == "function" && cb(msg)
    },
    wins: function(msg, cmd, cb) {
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

        if (cmd.length > 1) {
            // 新建标签
            chrome.tabs.create({windowId: parseInt(cmd[0]), url: cmd[1], selected: false}, function() {
                can.wins(msg, [cmd[0]], cb)
            })
            return
        }

        // 标签列表
        chrome.tabs.getAllInWindow(parseInt(cmd[0]), function(tabs) {
            can.core.List(tabs, function(tab) {tab.tid = tab.id
                msg.Push(tab, ["tid", "active", "width", "height", "index", "title", "url"])
            })
            typeof cb == "function" && cb(msg)
        })
    },
    tabs: function(msg, cmd, cb) {
        if (cmd.length == 0) {
            chrome.tabs.getAllInWindow(function(tabs) {
                can.core.List(tabs, function(tab) {
                    msg.Push("id", tab.id)
                    msg.Push("active", tab.active)
                    msg.Push("index", tab.index)
                    msg.Push("title", tab.title)
                    msg.Push("url", tab.url)
                })
                typeof cb == "function" && cb(msg)
            })
            return
        }

        chrome.tabs[cmd[1]](parseInt(cmd[0]), cb)
    },
    cookie: function(msg, cmd, cb) {
        if (cmd[0] == "modify")  {var data = {}; data[cmd[1]] = cmd[2]
            chrome.bookmarks.update(cmd[4], data, function() {
                typeof cb == "function" && cb(msg)
            })
            return
        } else if (cmd[0] == "delete")  {
            chrome.bookmarks.remove(cmd[2], function() {
                typeof cb == "function" && cb(msg)
            })
            return
        } else if (cmd.length > 2) {
            chrome.bookmarks.create({parentId: cmd[0], url: cmd[1], title: cmd[2], index: cmd[3]||0}, cb)
        }

        chrome.cookies.getAll({name: ""}, function(cs) {
            typeof cb == "function" && cb(msg)
        })
    },
    history: function(msg, cmd, cb) {
        chrome.tabs.getAllInWindow(function(tabs) {
            can.core.List(tabs, function(tab) {
                msg.Push("id", tab.id)
                msg.Push("active", tab.active)
                msg.Push("index", tab.index)
                msg.Push("title", tab.title)
                msg.Push("url", tab.url)
            })
            typeof cb == "function" && cb(msg)
        })
    },
    bookmark: function(msg, cmd, cb) {
        if (cmd[0] == "modify")  {var data = {}; data[cmd[1]] = cmd[2]
            chrome.bookmarks.update(cmd[4], data, function() {
                typeof cb == "function" && cb(msg)
            })
            return
        } else if (cmd[0] == "delete")  {
            chrome.bookmarks.remove(cmd[2], function() {
                typeof cb == "function" && cb(msg)
            })
            return
        } else if (cmd.length > 2) {
            chrome.bookmarks.create({parentId: cmd[0], url: cmd[1], title: cmd[2], index: cmd[3]||0}, cb)
        }

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

    can.run = function(event, cmd, cb, silent) { var msg = can.request(event)
        can.misc.Run(event, can, {names: "code/chrome/crx"}, cmd, cb)
    },
    can.misc.WSS(can, "ws://localhost:9020/space/", {name: "chrome", type: "chrome"}, function(event, msg) {
        if (msg.Option("_handle")) {return can.user.toast(msg.result.join(""))}

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

    chrome.history.onVisited.addListener(function(item) {
        can.run({}, ["history", item.id, item.title, item.url], function(msg) {
            // can.user.toast(item.url, item.title)
        })
    })

    return

    chrome.bookmarks.onCreated.addListener(function(id, item) {
        chrome.bookmarks.get(item.parentId, function(root) {
            can.run(can, {cmd: ["bookmark", item.id, item.url, item.title, root[0].title]}, function(msg) {
                can.user.toast(item.url, item.title)
            })
        })
    })

    chrome.extension.onRequest.addListener(function(msg, sender, cb) {
        can.run(can, msg, cb)
    })
})

