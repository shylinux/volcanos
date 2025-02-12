Volcanos({
	chrome: function(can, msg, arg, cb) { msg.detail = msg.detail.slice(3)
		if (arg.length == 0 || arg[0] == "") {
			chrome.windows.getAll(function(win) { can.core.List(win, function(win) { win.wid = win.id
				msg.Push(win, ["type", "state", "wid", "focused", html.LEFT, html.TOP, html.WIDTH, html.HEIGHT])
			}), can.base.isFunc(cb) && cb(msg) })
		} else if (arg.length == 1 || arg[1] == "") {
			chrome.tabs.getAllInWindow(parseInt(arg[0]), function(tab) { can.core.Next(tab, function(tab, next) { var _msg = can.request(); _msg.detail = ["info"]
				can._tabsend(can, _msg, function(res) { tab.tid = tab.id
					msg.Push(tab, ["index", "tid", "active", html.WIDTH, html.HEIGHT])
					msg.Push("title", res&&res["title"][0]||"").Push("url", res&&res["url"][0]||"")
					next()
				}, tab.id)
			}, function() { can.base.isFunc(cb) && cb(msg) }) })
		} else if (arg[1] == "current") {
			chrome.tabs.query({currentWindow: true, active: true}, function(tabs) { arg[1] = tabs[0].id
				can._tabsend(can, msg, null, arg[1])
			})
		} else {
			can._tabsend(can, msg, null, arg[1])
		}
	},
	_tabsend: function(can, msg, cb, target) {
		chrome.tabs.sendMessage(parseInt(target||msg.Option(ice.MSG_TARGET)), msg, cb||function(res) { msg.Copy(res), msg.Reply() })
	},
	_daemon: function(can) {
		can.misc.WSS(can, {type: web.PORTAL, name: html.CHROME, module: "shylinux.com/x/volcanos", version: "v0.9.4"}, function(event, msg, cmd, arg, cb) {
			msg.Option(ice.MSG_TARGET)? can._tabsend(can, msg): can.core.CallFunc([can, cmd], {can: can, msg: msg, arg: arg, cb: cb})
		})
		chrome.runtime.onMessage.addListener(function(req, sender, cb) {
			var msg = can.request({}, {tid: sender.tab.id, url: sender.url}); can.core.List(req.option, function(key) { msg.Option(key, req[key][0]) })
			return msg._source = [sender.tab.id], can.run(msg, req.detail||[], cb), true
		})
		chrome.history && chrome.history.onVisited.addListener(function(item) {
			can.run({}, ["sync", mdb.TYPE, web.LINK, mdb.NAME, item.title, web.LINK, item.url, "tid", item.id])
		})
	},
	_motion: function(can) {
		can.user.toast = function(can, message, title) { chrome.notifications.create(null, {
			message: message, title: title||can._name, iconUrl: "/page/favicon.ico", type: "basic",
		})}
		chrome.contextMenus && chrome.contextMenus.create({title: "volcanos", onclick: function(event) {
			chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
				var msg = can.request(event); msg.detail = ["order"], can._tabsend(can, msg, function() {})
			})
		}})
	},
}, function(can) {
	can.run = function(event, cmds, cb) { can.misc.Run(event, can, {names: "http://localhost:9020/code/chrome/"+cmds[0]+"/"}, cmds.slice(1), cb) }
	can._motion(can), can._daemon(can)
})

