const {kit, ice, ctx, mdb, web, nfs, code, chat, http, html} = require("../const.js")
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
	ParseURL: function(can, url) { url = url||location&&location.href; var args = can.base.ParseURL(url)
		delete(args.link), delete(args.origin), delete(args._origin)
		var ls = can.core.Split(url.split("://")[1].split("?")[0].split("#")[0], nfs.PS).slice(1)
		if (ls[0] == chat.SHARE) { args[chat.SHARE] = ls[1] }
		for (var i = 1; i < ls.length; i += 2) { if (can.base.isIn(ls[i], [ice.POD, ice.CMD])) { args[ls[i]] = ls[i+1] } }
		return args
	},
	requests: function(can, msg, cmd, data, cb) {
		can.misc.request(can, msg, cmd, data, function(msg) { cb && cb(msg) })
	},
	request: function(can, msg, cmd, data, cb) { data.sessid = can.conf.sessid, data.appid = data.appid||can.conf.appid
		can.core.List(msg.option, function(key) { data[key] = data[key]||[msg.Option(key)] }), data.option = data.option||msg.option
		wx.request({method: http.POST, url: (msg._serve||can.db.serve||can.conf.serve)+cmd, data: data, success: function(res) {
			if (res.statusCode == 401) {
				can.user.info = {}, can.misc.localStorage(can, ice.MSG_SESSID, can.conf.sessid = "")
				return can.user.login(can, function() { can.misc.request(can, msg, cmd, data, cb) })
			}
			wx.hideLoading()
			msg.Copy(res.data), console.log("request", cmd, data.cmds||data, msg)
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
})
