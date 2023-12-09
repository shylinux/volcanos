const {kit, ice, ctx, mdb, web, lex, nfs, log, code, chat, http, html} = require("../const.js")
const {Volcanos} = require("../proto.js")
module.exports =
Volcanos("misc", {
	Message: function(event, can) { var msg = kit.proto({}, {_event: event, _can: can, _target: can._target,
		OptionDefault(key, val) { var arg = arguments; for (var i = 0; i < arg.length; i += 2) { msg.Option(arg[i]) || msg.Option(arg[i], arg[i+1]) } return msg.Option(key) },
		Option: function(key, val) { if (key == undefined) { return msg.option || [] }
			if (can.base.isObject(key)) { return can.core.Item(key, msg.Option) }
			if (val == undefined) { return can.base.isIn(key, msg.option) && msg[key] && msg[key][0] || "" }
			return msg.option = can.base.AddUniq(msg.option, key), msg[key] = can.core.List(arguments).slice(1), val
		},
		Append: function(key, val) { if (key == undefined) { return msg.append || [] }
			if (can.base.isObject(key)) { return can.core.Item(key, msg.Append) }
			if (val == undefined) { return can.base.isIn(key, msg.append) && msg[key] && msg[key][0] || "" }
			return msg.append = can.base.AddUniq(msg.append, key), msg[key] = can.core.List(arguments).slice(1), val
		},
		Result: function() { if (!msg.result) { return "" } return msg.result[0] == ice.ErrWarn? msg.result.join(lex.SP): msg.result.join("") },
		Results: function() { return msg.result && msg.result[0] == ice.ErrWarn? "": msg.Result() },
		TableDetail: function() { var item = can.Option(); return msg.Table(function(value) { can.core.Value(item, value.key, value.value) }), item },
		IsDetail: function() { return msg.Option(ice.MSG_FIELDS) == "detail" || msg.append && msg.append.length == 2 && msg.append[0] == mdb.KEY && msg.append[1] == mdb.VALUE },
		Table: function(cb) { return can.core.List(msg.Length(), function(index) { var item = {}
			can.core.List(msg.append, function(k) { item[k] = msg[k]&&msg[k][index]||"" })
			return can.base.isFunc(cb)? cb(item, index): item
		}) },
		Length: function() { var max = 0; can.core.List(msg.append, function(k) { if (msg[k] && msg[k].length > max) { max = msg[k].length } }); return max },
		Clear: function(key) { switch (key||ice.MSG_APPEND) {
			case ice.MSG_OPTION:
			case ice.MSG_APPEND: can.core.List(msg[key], function(key) { delete(msg[key]) })
			default: delete(msg[key])
		} },
		Copy: function(res) { if (!res) { return msg }
			res.append && res.append.length > 0 && (msg.append = res.append) && res.append.forEach(function(key) {
				var i = msg.option && msg.option.indexOf(key); if (i > -1) { msg.option[i] = "", delete(msg[key]) }
				res[key] && (msg[key] = (msg[key]||[]).concat(res[key]))
			}), res.result && res.result.length > 0 && (msg.result = (msg.result||[]).concat(res.result))
			res.option && res.option.length > 0 && (msg.option = res.option) && res.option.forEach(function(key) { res[key] && (msg[key] = res[key]) })
			res._option && (msg._option = res._option) && res._option.forEach(function(key) { res[key] && (msg[key] = res[key]) })
			return msg
		},
		Push: function(key, value, detail) {
			if (can.base.isObject(key)) { can.core.List(value||msg.append||can.base.Obj(msg.Option(ice.MSG_FIELDS))||can.core.Item(key), function(item) {
				detail? msg.Push(mdb.KEY, item).Push(mdb.VALUE, key[item]||""): msg.Push(item, key[item]||"")
			}); return msg }
			var i = msg.option && msg.option.indexOf(key); if (i > -1) { msg.option[i] = "", msg[key] = [] }
			msg.append = can.base.AddUniq(msg.append, key), msg[key] = msg[key]||[]
			msg[key].push(can.base.isString(value)||can.base.isFunc(value)? value: JSON.stringify(value)); return msg
		},
		PushAction: function(button) { can.core.List(msg.Length(), function() {
			msg.Push(ctx.ACTION, can.page.Format(html.INPUT, "", mdb.TYPE, html.BUTTON, mdb.NAME, button, mdb.VALUE, can.user.trans(can, button)))
		}); return msg },
		Echo: function(res) { msg.result = (msg.result||[]).concat(can.core.List(arguments)); return msg._hand = true, msg },
	}); return msg },
	ParseCmd: function(can, msg) { can.ui.data.list = []
		msg.Table(function(field, order) { can.ui.data.list.push(field)
			field.feature = can.base.Obj(field.meta, {})
			field.inputs = can.base.Obj(field.list, [])
			field.name = can.core.Split(field.name)[0]
			if (!field.inputs || field.inputs.length === 0) {
				return can.core.Timer(30, function() {
					can.onaction._refresh({}, can, order)
				})
			}
			can.core.List(field.inputs, function(input) {
				input.action = input.action || input.value
				input.value == ice.AUTO && (input.value = "")
				if (input.value && input.value.indexOf("@") == 0) {
					input.action = input.value.slice(1), input.value = ""
				}
				if (input.type == html.SELECT) {
					input.values = input.values || can.core.Split(input.value)
				}
				if (can.base.isIn(input.type, html.TEXT, html.TEXTAREA)) {
					input.placeholder = can.user.trans(can, input.placeholder||input.name, field, html.INPUT)
				}
				if (input.type == html.BUTTON) {
					input.value = can.user.trans(can, input.value||input.name, field)
				} else {
					if (can.db.cmd||can.db.index) { input.value = input.value||can.db[input.name] }
				}
				input.type == html.BUTTON && input.action == ice.AUTO && can.core.Timer(30, function() {
					can.onaction._refresh({}, can, order)
				})
			})
		}), can.page.setData(can), can.user.toast(can, "加载成功")
	},
	ParseURL: function(can, url) { url = url||location&&location.href; var args = can.base.ParseURL(url)
		delete(args.link), delete(args.origin), delete(args._origin)
		var ls = can.core.Split(url.split("://")[1].split("?")[0].split("#")[0], nfs.PS).slice(1)
		if (ls[0] == chat.SHARE) { args[chat.SHARE] = ls[1] }
		for (var i = 1; i < ls.length; i += 2) { if (can.base.isIn(ls[i], [ice.POD, ice.CMD])) { args[ls[i]] = ls[i+1] } }
		return args
	},
	WSS: function(can) { if (can.conf.platform == "devtools" && can.db.serve != can.conf.serve) { return }
		var url = can.base.MergeURL(can.db.serve.replace("http", "ws")+"/space/", mdb.TYPE, "weixin", mdb.NAME, "weixin", mdb.TEXT, can.base.MergeURL(nfs.PS+can.ui.route, can.db), can.conf)
		var socket = wx.connectSocket({url: url, header:{"content-type": "application/json"}}); can.misc.Info("wss connect", url, socket)
		socket.onOpen(function(res) { can.misc.Info("wss open", res) })
		socket.onClose(function(res) { can.misc.Info("wss close", res), can._socket && can.core.Timer(can.base.random(30000, 3000), function() { can.misc.WSS(can) }) })
		socket.onMessage(function(res) { var msg = can.request(), data = can.base.Obj(res.data); msg.Copy(data), msg.detail = data.detail, can.misc.Info("wss recv", msg.detail, msg)
			switch (msg.detail[0]) {
				case "pwd": can._daemon = msg.detail[1]; break
				case "parse": can.core.Timer(30, function() { can.user.parse(can, data.detail[1]) }); break
				case "info": break
			} delete(msg._hand), delete(msg.detail), msg.Option("_handle", ice.TRUE)
			msg._target = (msg._source||[]).reverse(), msg._source = (msg._target||[]).reverse().slice(1)||[]
			can.misc.Info("wss send", msg.result, msg), socket.send({data: JSON.stringify(msg)})
		}); return can._socket = socket
	},
	request: function(can, msg, cmd, data, cb) { data.sessid = can.conf.sessid, data.appid = data.appid||can.conf.appid
		can.core.List(msg.option, function(key) { data[key] = data[key]||[msg.Option(key)] }), data.option = data.option||msg.option
		var url = (msg._serve||can.db.serve||can.conf.serve)+cmd
		if (data && can.base.isIn(msg._method, http.GET, http.DELETE)) { url = can.base.MergeURL(url, data), data = {} }
		wx.request({method: msg._method||http.POST, url: url, data: data, success: function(res) {
			if (res.statusCode == 401) {
				can.user.info = {}, can.misc.localStorage(can, ice.MSG_SESSID, can.conf.sessid = "")
				return can.user.login(can, function() { can.misc.request(can, msg, cmd, data, cb) })
			}
			if (res.statusCode == 403) { msg.result = [res.data] }
			msg.Copy(res.data), can.misc.Info("request", cmd, data.cmds||data, msg)
			can.base.toLast(msg.append, mdb.TIME), can.base.toLast(msg.append, web.LINK), can.base.toLast(msg.append, ctx.ACTION)
			if (msg.append && msg.append.indexOf(ctx.ACTION) > 0) {
				msg._style = "content action"
			} else if (msg.IsDetail()) {
				msg._style = "content detail"
			} else {
				msg._style = "content"
			}
			msg.Data = function(item, index) {
				var text = msg[item]&&msg[item][index]||""
				var data = {_type: html.TEXT, _text: text}
				if (text.indexOf("<") != 0) { return [data] }
				var res = [], list = can.core.Split(text, " ", "<=/>")
				for (var i = 0; i < list.length; i++) {
					if (list[i] == "<") { data = {}
						if (list[i] == "/") { i++ } else { res.push(data) }
						data._type = list[i+1], data._text = text, i++
						continue
					} else if (list[i] == ">") {
						continue
					} else if (list[i+1] == "=") {
						data[list[i]] = list[i+2], i += 2
					} else {
						data[list[i]] = list[i]
					}
				}
				return res.length == 0? [data]: res
			}
			msg._index = []; for (var i = 0; i < msg.Length(); i++) { msg._index.push(i) }
			msg._view = {}, msg[ice.MSG_APPEND] && can.core.List(msg[ice.MSG_APPEND], function(k) { msg._view[k] = []
				for (var i in msg[k]) { msg._view[k][i] = msg.Data(k, i) }
			}), cb && cb(msg)
		}})
	},
	download: function(can, msg, cmd, data, cb) { data.sessid = can.conf.sessid
		wx.downloadFile({url: can.conf.serve+nfs.PS+cmd, data: data, success: cb})
	},
	localStorage: function(can, key, value) {
		value != undefined && wx.setStorageSync(key, value)
		return wx.getStorageSync(key)
	},
	Log: function() { var args = this._args("", arguments); console.log.apply(console, args), this._signal(args) },
	Info: function() { var args = this._args("", arguments); console.log.apply(console, args), this._signal(args) },
	Warn: function() { var args = this._args(log.WARN, arguments); console.warn.apply(console, args), this._signal(args); debugger },
	Error: function() { var args = this._args(log.ERROR, arguments); args.push(lex.NL, this._stacks().slice(1).join(lex.NL)), console.error.apply(console, args), this._signal(args); debugger },
	FileLine: function(depth, length) { var file = this.fileLine(depth+1, length||9); return file.link },
	fileLine: function(depth, length) { var list = this._stacks()
		function split(i) { if (!list[i]) { return {} }
			var ls = new RegExp("(https?://[^/]+)?([^:]+):([0-9]+):([0-9]+)").exec(list[i]); if (!ls) { return {} }
			var name = ""; list[i].lastIndexOf(lex.TB) > 0 && (name = list[i].split(lex.TB).pop())
			if (ls[0].indexOf(ice.QS) > -1) { ls[0] = ls[0].split(ice.QS)[0]+nfs.DF+ls[3]+nfs.DF+ls[4] }
			return {_path: ls[2]+":"+ls[3], name: name, link: ls[0], path: ls[2], file: ls[2].split(nfs.PS).slice(-length).join(nfs.PS), line: ls[3], cols: ls[4]}
		}
		if (depth < 0) { var current = split(-depth)
			for (var i = -depth+1; i < list.length; i++) { var pos = split(i); if (pos.path != current.path) { return pos } }
		} return split(depth)||{}
	},
	_stacks: function(n, s) { var list = ((s||(new Error())).stack||"").split(lex.NL).slice(typeof n == "undefined"? 2: n)
		for (var i = 0; i < list.length; i++) { var ls = list[i].trim().split(lex.SP)
			list[i] = ls.pop().trim(); if (list[i][0] == "(") { list[i] = list[i].slice(1, -1) }
			list[i] = " "+list[i]; if (ls.length > 1) { list[i] += " "+ls.pop() }
			list[i] = list[i].replace(/\?[^:]+/, "")
		} return list
	}, _stack: function() { return ((new Error()).stack||"").split(lex.NL).slice(2) },
	_time: function() { var now = new Date()
		var hour = now.getHours(); hour < 10 && (hour = "0"+hour)
		var minute = now.getMinutes(); minute < 10 && (minute = "0"+minute)
		var second = now.getSeconds(); second < 10 && (second = "0"+second)
		var mill = now.getMilliseconds(); mill < 10 && (mill = "00"+mill) || mill < 100 && (mill = "0"+mill)
		return [hour, minute, second].join(nfs.DF)+nfs.PT+mill
	},
	_args: function(level, arg) { var app = getApp()
		var args = [this._time(), app && app.conf.platform == "devtools"? this.FileLine(this._skip+1, 3)||"": ""].concat(level? [level]: [])
		for (var i in arg) { arg[i] != undefined && args.push(arg[i]) } return args
	},
	_signal: function(args) { this._list.push(args) }, _list: [], _skip: 2,
})
