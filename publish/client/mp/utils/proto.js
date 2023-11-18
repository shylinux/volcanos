const {ctx, nfs, code, chat} = require("const.js")

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
			can.misc.requests(can, can.request(event), can.onaction._name||nfs.CHAT_ACTION, {cmds: cmds}, function(msg) {
				msg.Dump = function() { can.ui.setData({list: msg.Table()}) }, cb(msg)
			})
		},
	}; Volcanos._page.__proto__ = getApp(), delete(Volcanos._page)
	var page = {data: {action: can.onaction.list, list: []},
		onLoad: function(options) { can.ui = this, can.db = options
			console.log("app show", can.ui.route, options)
			can.user.title(decodeURIComponent(options.title||""))
			can.user.login(can, function() {
				if (can.onaction.refresh) {
					can.onaction.refresh({}, can)
				} else {

				}
			})
		},
		onShow: function() {},
		onReady: function() {},
		onHide: function() {},
		onUnload: function() {},
		onReachBottom: function() {},
		onPullDownRefresh: function() { this.onLoad(can.db) },
		onShareAppMessage: function() {}
	}
	can.core.ItemCB(can.onaction, function(key, cb) { page[key] = function(event) {
		can.core.CallFunc(cb, [event, can, key, event.target.dataset])
	} }), Page(page)
}

module.exports = {shy, Volcanos}
