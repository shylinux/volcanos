const {kit, ice,
	ctx, mdb, web, aaa,
	lex, yac, ssh, gdb,
	tcp, nfs, cli, log,
	code, wiki, chat, team, mall,
	http, html, icon, svg
} = require("const.js")

function shy(help, meta, list, cb) { var arg = arguments, i = 0; function next(type) {
	if (type == code.OBJECT) { if (typeof arg[i] == code.OBJECT && arg[i].length == undefined) { return arg[i++] }
	} else if (type == code.ARRAY) { if (typeof arg[i] == code.OBJECT && arg[i].length != undefined) { return arg[i++] }
	} else if (i < arg.length && (!type || type == typeof arg[i])) { return arg[i++] }
} return cb = typeof arg[arg.length-1] == code.FUNCTION? arg[arg.length-1]: function() {}, cb.help = next(code.STRING)||"", cb.meta = next(code.OBJECT)||{}, cb.list = next(code.ARRAY)||[], cb }
function Volcanos(name, list) { if (Volcanos._page) { Volcanos._page[name] = list } return list }

Volcanos._init = function() { var page = Volcanos._page; page.__proto__ = getApp(), delete(Volcanos._page)
	var can = {__proto__: page,
		Option: function() { return {} },
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
		run: function(event, cmds, cb) { wx.showLoading(); const info = wx.getSystemInfoSync()
			can.misc.POST(can, can.request(event, {share: can.db.share}), can.base.MergeURL(can.onaction._apis||nfs.CHAT_ACTION, kit.Dict(
				// ice.POD, can.db.pod||can.db.space, ice.MSG_THEME, info.theme, ice.MSG_DEBUG, can.db.debug,
				ice.POD, can.db.pod, ice.MSG_THEME, info.theme, ice.MSG_DEBUG, can.db.debug,
			)), {cmds: (can.onaction._cmds||[]).concat(cmds)}, function(msg) { wx.hideLoading()
				msg.Dump = function() { can.ui.setData({list: msg.Table()}) }, cb(msg)
			})
		},
	}
	can.core.Item(require("frame-wx.js"), function(key, mod) { page[key] = can.base.Copy(page[key]||{}, mod, true) })
	can.core.Item(require("frame.js"), function(key, mod) { page[key] = can.base.Copy(page[key]||{}, mod, true) })
	var page = {data: {action: can.onaction.list, list: []},
		onLoad: function(options) { can.ui = this, can.db = options, can.db.serve = can.db.serve||can.conf.serve
			can.core.Item(can.db, function(key, value) { can.db[key] = decodeURIComponent(value) })
			can.core.Item(can.db, function(key, value) { can.db[key] = decodeURIComponent(value) })
			can.misc.Info("app show", can.ui.route, can.db, can.user.info), can.user.agent.enableDebug(can)
			can.user.title(can.db.title||can.db.pod||can.db.space||(can.db.serve||can.conf.serve).split("://")[1])
			function refresh() { can.ui.setData({conf: can.db}), can.user.login(can, function() { can.misc.WSS(can), can.onmotion.delay(can, function() { can.onaction.refresh({}, can) }, 300) }) }
			function wifi(cb) { can.db.ssid && can.db.password != "******"? can.user.agent.connectWifi(can, can.db.ssid, can.db.password||"", function() { can.db.password = "******", cb() }): cb() }
			if (can.db.scene) { var ls = can.db.scene.split(nfs.PS); can.db.scene = ls[2]
				if (ls[0] == "s") { can.db.serve = "https://"+ls[1] } if (ls[0] == "h") { can.db.serve = "http://"+ls[1] }
				if (ls[0] == "w") { can.db.serve = "http://192.168."+parseInt("0x"+ls[1][0])+"."+parseInt("0x"+ls[1][1])+":9020", can.db.ssid = ls[3], can.db.password = ls[4] }
				wifi(function() { can.user.scene(can, can.db.scene) })
			} else { wifi(refresh) }
		},
		onShow: function() {}, onReady: function() {}, onHide: function() {},
		onUnload: function() { can._socket && can._socket.close(), delete(can._socket) },
		onReachBottom: function() {}, onPullDownRefresh: function() { this.onUnload(), this.onLoad(can.db) }, onShareAppMessage: function() {}
	}; can.core.ItemCB(can.onaction, function(key, cb) { page[key] = function(event) { can.core.CallFunc(cb, [event, can, key, event.target.dataset]) } }), Page(page)
}

module.exports = {shy, Volcanos}
