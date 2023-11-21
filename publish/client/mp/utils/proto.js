const {kit, ice, ctx, mdb, nfs, code, chat} = require("const.js")
function shy(help, meta, list, cb) { var arg = arguments, i = 0; function next(type) {
	if (type == code.OBJECT) { if (typeof arg[i] == code.OBJECT && arg[i].length == undefined) { return arg[i++] }
	} else if (type == code.ARRAY) { if (typeof arg[i] == code.OBJECT && arg[i].length != undefined) { return arg[i++] }
	} else if (i < arg.length && (!type || type == typeof arg[i])) { return arg[i++] }
} return cb = typeof arg[arg.length-1] == code.FUNCTION? arg[arg.length-1]: function() {}, cb.help = next(code.STRING)||"", cb.meta = next(code.OBJECT)||{}, cb.list = next(code.ARRAY)||[], cb }
function Volcanos(name, list) {
	if (Volcanos._page) { Volcanos._page[name] = list }
	return list
}
Volcanos._init = function() {
	var can = {__proto__: Volcanos._page,
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
		run: function(event, cmds, cb) {
			wx.showLoading(); const res = wx.getSystemInfoSync()
			can.misc.request(can, can.request(event), can.base.MergeURL(can.onaction._apis||nfs.CHAT_ACTION, kit.Dict(
				ice.POD, can.db.pod||can.db.space, ice.MSG_THEME, res.theme, ice.MSG_DEBUG, can.db.debug,
			)), {cmds: (can.onaction._cmds||[]).concat(cmds)}, function(msg) {
				msg.Dump = function() { can.ui.setData({list: msg.Table()}) }, cb(msg), wx.hideLoading()
			})
		},
	}; Volcanos._page.__proto__ = getApp(), delete(Volcanos._page)
	var page = {data: {action: can.onaction.list, list: []},
		onLoad: function(options) { can.ui = this, can.db = options, can.db.serve = can.db.serve||can.conf.serve
			can.core.Item(can.db, function(key, value) { can.db[key] = decodeURIComponent(value) })
			can.user.title(can.db.title||can.db.pod||can.db.space||(can.db.serve||can.conf.serve).split("://")[1])
			console.log("app show", can.ui.route, can.db)
			if (can.db.ssid && can.db.password != "******") {
				can.user.agent.connectWifi(can, can.db.ssid, can.db.password||"", function() { can.db.password = "******"
					can.core.Timer(300, function() {
						can.ui.setData({conf: can.db}), can.user.login(can, function() { can.onaction.refresh({}, can) })
					})
				})
			} else {
				can.ui.setData({conf: can.db}), can.user.login(can, function() { can.onaction.refresh({}, can) })
			}
		},
		onShow: function() { can.misc.WSS(can) },
		onReady: function() {},
		onHide: function() { can._socket && can._socket.close(), delete(can._socket) },
		onUnload: function() { can._socket && can._socket.close(), delete(can._socket) },
		onReachBottom: function() {},
		onPullDownRefresh: function() { this.onLoad(can.db) },
		onShareAppMessage: function() {}
	}
	can.core.ItemCB(can.onaction, function(key, cb) { page[key] = function(event) {
		can.core.CallFunc(cb, [event, can, key, event.target.dataset])
	} }), Page(page)
}
module.exports = {shy, Volcanos}
