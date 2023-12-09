const {kit, ice, ctx, mdb, web, nfs, code, chat, http, html} = require("const.js")
function shy(help, meta, list, cb) { var arg = arguments, i = 0; function next(type) {
	if (type == code.OBJECT) { if (typeof arg[i] == code.OBJECT && arg[i].length == undefined) { return arg[i++] }
	} else if (type == code.ARRAY) { if (typeof arg[i] == code.OBJECT && arg[i].length != undefined) { return arg[i++] }
	} else if (i < arg.length && (!type || type == typeof arg[i])) { return arg[i++] }
} return cb = typeof arg[arg.length-1] == code.FUNCTION? arg[arg.length-1]: function() {}, cb.help = next(code.STRING)||"", cb.meta = next(code.OBJECT)||{}, cb.list = next(code.ARRAY)||[], cb }
function Volcanos(name, list) { if (Volcanos._page) { Volcanos._page[name] = list } return list }
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
		run: function(event, cmds, cb) { wx.showLoading(); const sys = wx.getSystemInfoSync()
			can.misc.request(can, can.request(event, {share: can.db.share}), can.base.MergeURL(can.onaction._apis||nfs.CHAT_ACTION, kit.Dict(
				ice.POD, can.db.pod||can.db.space, ice.MSG_THEME, sys.theme, ice.MSG_DEBUG, can.db.debug,
			)), {cmds: (can.onaction._cmds||[]).concat(cmds)}, function(msg) { wx.hideLoading()
				msg.Dump = function() { can.ui.setData({list: msg.Table()}) }, cb(msg)
			})
		},
	}; Volcanos._page.__proto__ = getApp()
	Volcanos._page.onimport = Volcanos._page.onimport||{}
	Volcanos._page.onaction = can.base.Copy({
		_refresh: function(event, can, order) { can.page.setData(can)
			can.onaction.onAction({}, can, ice.LIST, {order: order, name: ice.LIST})
		},
		_reload: function(can, msg) {
			can.misc.ParseCmd(can, msg)
		},
		refresh: function(event, can) {
			can.onaction._apis = "", can.onaction._cmds = []
			if (can.db.share) { can.onaction._apis = "/share/"+can.db.share
				can.run(event, [ctx.ACTION, ctx.COMMAND], function(msg) {
					can.onaction._cmds = [ctx.ACTION, ctx.RUN], can.onaction._reload(can, msg)
				})
			} else if (can.db.river && can.db.storm) {
				can.onaction._cmds = [can.db.river, can.db.storm]
				can.run(event, [], function(msg) { can.onaction._reload(can, msg) })
			} else {
				can.run(event, [ctx.ACTION, ctx.COMMAND, can.db.cmd||can.db.index||"cli.qrcode"], function(msg) {
					can.onaction._cmds = [ctx.ACTION, ctx.RUN], can.onaction._reload(can, msg)
				})
			}
		},
		onaction: function(event, can, button, data) { var name = data.name;
			(can.onaction[name]||function(event) { can.run(event, [ctx.ACTION, name]) })(event, can)
		},
		onInputs: function(event, can, button, data) { var order = data.order, index = data.index
			var input = can.ui.data.list[order||0].inputs[index||0]
			input.value = event.detail.value
		},
		onChange: function(event, can, button, data) { var order = data.order, index = data.index
			var input = can.ui.data.list[order||0].inputs[index||0]
			input.value = input.values[parseInt(event.detail.value)]
			can.onaction._refresh(event, can, order)
		},
		onAction: function(event, can, button, data) { var order = data.order, name = data.name
			var field = can.ui.data.list[order||0], msg = can.request(event)
			if (field.feature[name]) { if (can.base.isIn(name, mdb.CREATE, mdb.INSERT)) { msg._method = http.PUT }
				return can.data.insert = {field: field, name: name, list: field.feature[name], cb: function(res) {
					can.run(event, can.base.Simple([field.id||field.index, ctx.ACTION, name], res), function(msg) {
						can.onaction._refresh(event, can, order)
					})
				}}, can.user.jumps(chat.PAGES_INSERT)
			} field._history = field._history||[]
			switch (name) {
				case ice.BACK: field._history.pop(); var ls = field._history.pop()||[], i = 0
					can.core.List(field.inputs, function(input) { if (input.type != html.BUTTON) { input.value = ls[i++]||"" } })
					can.onaction._refresh(event, can, order); break
				case ctx.RUN: break
				case ice.LIST:
				case web.REFRESH: msg._method = http.GET; break
				default: msg.Option(ctx.ACTION, name)
			}
			var cmd = can.core.List(field.inputs, function(input) { if (input.type != html.BUTTON) { return input.value } })
			for (var i = cmd.length-1; i > 0; i--) { if (cmd[i] === "") { cmd.pop() } else { break } }
			function eq(to, from) { if (!to) { return false } if (to.length != from.length) { return false }
				for (var i = 0; i < to.length; i++) { if (to[i] != from[i]) { return false } } return true
			} eq(field._history[field._history.length-1], cmd) || field._history.push(cmd)
			can.run(event, [field.id||field.index].concat(cmd), function(msg) { can.onimport._init && can.onimport._init(can, msg)
				msg._head = can.core.List(msg.append, function(item) { return can.user.trans(can, item, field, html.INPUT) })
				can.core.Item(msg._view, function(key, value) { can.core.List(value, function(value) { can.core.List(value, function(input, i) {
					if (input.type == html.BUTTON) { input.value = can.user.trans(can, input.value||input.name, field) }
					if (input._type == html.TEXT) { input._text = can.user.trans(can, input._text, field, html.VALUE) }
				}) }) })
				msg._status = can.core.List(can.base.Obj(msg.Option(ice.MSG_STATUS)), function(item) { return item })
				msg._action = can.core.List(can.base.Obj(msg.Option(ice.MSG_ACTION)), function(item) {
					if (typeof item == code.STRING) { return {type: html.BUTTON, name: item, value: can.user.trans(can, item)} }
					return item.value = can.user.trans(can, item.value||item.name), item
				}), field.msg = msg, can.page.setData(can)
			})
		},
		onDetail: function(event, can, button, data) { var order = data.order, name = data.name, value = data.value, input = data.input
			var field = can.ui.data.list[order||0]
			if (input && input.type == html.BUTTON) { var msg = can.request(event, field.msg.Table()[data.index])
				if (can.base.isIn(name, mdb.REMOVE, mdb.DELETE)) { msg._method = http.DELETE }
				var _input = {}; can.core.List(field.inputs, function(input) { if (input.type != html.BUTTON) { _input[input.name] = input.value } }), can.request(event, _input)
				if (field.feature[input.name]) {
					can.onAction(event, can, input.name, {order: order, name: input.name})
				} else {
					can.run(event, [field.id||field.index, ctx.ACTION, input.name], function(msg) {
						can.onaction._refresh(event, can, order)
					})
				} return
			}
			can.core.List(field.inputs, function(input) {
				if (input.name == name) { input.value = value, can.onaction._refresh(event, can, order) }
			})
		}}, Volcanos._page.onaction||{})
	delete(Volcanos._page)
	var page = {data: {action: can.onaction.list, list: []},
		onLoad: function(options) { can.ui = this, can.db = options, can.db.serve = can.db.serve||can.conf.serve
			can.core.Item(can.db, function(key, value) { can.db[key] = decodeURIComponent(value) })
			can.core.Item(can.db, function(key, value) { can.db[key] = decodeURIComponent(value) })
			can.misc.Info("app show", can.ui.route, can.db, can.user.info), can.user.agent.enableDebug(can)
			can.user.title(can.db.title||can.db.pod||can.db.space||(can.db.serve||can.conf.serve).split("://")[1])
			function refresh() { can.ui.setData({conf: can.db}), can.user.login(can, function() {
				can.misc.WSS(can), can.core.Timer(300, function() {
					if (can.onaction.refresh) {
						can.onaction.refresh({}, can)
					} else {
						can.run({}, [ctx.ACTION, ctx.COMMAND, can.db.index], function(msg) {
							can.misc.ParseCmd(can, msg)
						})
					}
				})
			}) }
			function wifi(cb) { can.db.ssid && can.db.password != "******"? can.user.agent.connectWifi(can, can.db.ssid, can.db.password||"", function() { can.db.password = "******", cb() }): cb() }
			if (can.db.scene) { var ls = can.db.scene.split(nfs.PS); can.db.scene = ls[2]
				if (ls[0] == "s") { can.db.serve = "https://"+ls[1] } if (ls[0] == "h") { can.db.serve = "http://"+ls[1] }
				if (ls[0] == "w") { can.db.serve = "http://192.168."+parseInt("0x"+ls[1][0])+"."+parseInt("0x"+ls[1][1])+":9020", can.db.ssid = ls[3], can.db.password = ls[4] }
				wifi(function() { can.user.scene(can, can.db.scene) })
			} else {
				wifi(refresh)
			}
		},
		onShow: function() { }, onReady: function() {},
		onHide: function() { can._socket && can._socket.close(), delete(can._socket) },
		onUnload: function() { can._socket && can._socket.close(), delete(can._socket) },
		onReachBottom: function() {}, onPullDownRefresh: function() { this.onLoad(can.db) },
		onShareAppMessage: function() {}
	}; can.core.ItemCB(can.onaction, function(key, cb) { page[key] = function(event) { can.core.CallFunc(cb, [event, can, key, event.target.dataset]) } }), Page(page)
}
module.exports = {shy, Volcanos}
