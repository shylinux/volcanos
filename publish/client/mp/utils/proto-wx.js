const {kit, ice,
	ctx, mdb, web, aaa,
	lex, yac, ssh, gdb,
	tcp, nfs, cli, log,
	code, wiki, chat, team, mall,
	http, html,
} = require("const.js")

function shy(help, meta, list, cb) { var arg = arguments, i = 0; function next(type) {
	if (type == code.OBJECT) { if (typeof arg[i] == code.OBJECT && arg[i].length == undefined) { return arg[i++] }
	} else if (type == code.ARRAY) { if (typeof arg[i] == code.OBJECT && arg[i].length != undefined) { return arg[i++] }
	} else if (i < arg.length && (!type || type == typeof arg[i])) { return arg[i++] }
} return cb = typeof arg[arg.length-1] == code.FUNCTION? arg[arg.length-1]: function() {}, cb.help = next(code.STRING)||"", cb.meta = next(code.OBJECT)||{}, cb.list = next(code.ARRAY)||[], cb }
function Volcanos(name, list) { if (Volcanos._page) { Volcanos._page[name] = list } return list }

Volcanos._init = function() { var page = Volcanos._page; page.__proto__ = getApp(), delete(Volcanos._page)
	var can = {__proto__: page,
		request: function(event) { event = event||{}, event = event._event||event
			var msg = event._msg||can.misc.Message(event, can); event._msg = msg
			function set(key, value) { if (key == "_method") { return msg._method = value }
				value == "" || msg.Option(key) || msg.Option(key, value)
			}
			can.core.List(arguments, function(item, index) { if (!item || index == 0) { return }
				can.base.isFunc(item.Option)? can.core.List(item.Option(), function(key) {
					key.indexOf("_") == 0 || key.indexOf("user.") == 0 || set(key, item.Option(key))
				}): can.core.Item(can.base.isFunc(item)? item(): item, set)
			}); return msg
		},
		run: function(event, cmds, cb) { const info = wx.getSystemInfoSync(); var done = false
			can.misc.POST(can, can.request(event, {share: can.db.share}), can.base.MergeURL(can.onaction._apis||nfs.CHAT_ACTION, kit.Dict(
				ice.POD, can.base.isIn(can.db.index, "grant", "web.chat.grant")? can.db.pod: can.ConfSpace(), ice.MSG_DEBUG, can.db.debug, ice.MSG_THEME, info.theme,
			)), {cmds: (can.onaction._cmds||[ctx.ACTION, ctx.RUN, can.ConfIndex()]).concat(cmds)}, function(msg) { done = true, wx.hideLoading(), wx.stopPullDownRefresh()
				msg.Dump = function() { can.ui.setData({list: msg.Table()}) }, cb(msg)
			}), can.onmotion.delay(can, function() { done || wx.showLoading() }, 500)
		},
		ConfIndex: function() { return can.db.index||can.ui.route.split("/").pop() },
		ConfSpace: function() { return can.db.space },
		Option: function() { return {} },
	}
	can.core.Item(require("frame-wx.js"), function(key, mod) { page[key] = can.base.Copy(page[key]||{}, mod, true) })
	can.core.Item(require("frame.js"), function(key, mod) { page[key] = can.base.Copy(page[key]||{}, mod, true) })
	var _page = {data: {action: can.onaction.list, list: []},
		onLoad: function(options) { can.ui = this, can.db = options, can.db.serve = can.db.serve||can.misc.localStorage(can, web.SERVE)||can.conf.serve
			can.core.Item(can.db, function(key, value) { can.db[key] = decodeURIComponent(value) })
			can.core.Item(can.db, function(key, value) { can.db[key] = decodeURIComponent(value) })
			can.misc.Info("app show", can.ui.route, can.db, can.ui, can), can.user.agent.enableDebug(can)
			can.misc.serveList(can, {serve: can.db.serve}, true)
			can.user.scene(can, can.db.scene, function() { can.ui.setData({conf: can.db})
				can.user.login(can, function() { can.misc.WSS(can)
					can.onmotion.delay(can, function() { can.onaction.refresh({}, can) }, 300)
				}, function() { can.onaction.refresh({}, can) })
			})
		},
		onUnload: function() { can._socket && can._socket.close(), delete(can._socket) },
		onShow: function() { can.user.title(can.db.title = can.db.title||can.db.pod||can.db.space||can.db.serve.split("://")[1]) },
		onHide: function() {},
		onReady: function() {},
		onReachBottom: function() {},
		onPullDownRefresh: function() { this.onUnload(), this.onLoad(can.db) },
		onShareAppMessage: function() {
			var share = {title: can.db.title, path: can.base.MergeURL(can.ui.route, ctx.INDEX, can.db.index, web.SPACE, can.db.space, web.SERVE, can.db.serve)}
			can.misc.Info("app share", share)
			return share
		},
	}; can.core.ItemCB(can.onaction, function(key, cb) { _page[key] = function(event) { can.core.CallFunc(cb, [event, can, key, event.currentTarget.dataset]) } }), Page(_page)
}

module.exports = {shy, Volcanos}
