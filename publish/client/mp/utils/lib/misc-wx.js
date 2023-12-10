const {kit, ice,
	ctx, mdb, web, aaa,
	lex, yac, ssh, gdb,
	tcp, nfs, cli, log,
	code, wiki, chat, team, mall,
	http, html, icon, svg
} = require("../const.js")
const {shy, Volcanos} = require("../proto.js")
module.exports =
Volcanos("misc", {
	POST: function(can, msg, cmd, data, cb) { data.sessid = can.conf.sessid, data.appid = data.appid||can.conf.appid
		can.core.List(msg.option, function(key) { data[key] = data[key]||[msg.Option(key)] }), data.option = data.option||msg.option
		var url = (msg._serve||can.db.serve||can.conf.serve)+cmd
		if (data && can.base.isIn(msg._method, http.GET, http.DELETE)) { url = can.base.MergeURL(url, data), data = {} }
		wx.request({method: msg._method||http.POST, url: url, data: data, success: function(res) {
			if (res.statusCode == 401) {
				can.user.info = {}, can.misc.localStorage(can, ice.MSG_SESSID, can.conf.sessid = "")
				return can.user.login(can, function() { can.misc.POST(can, msg, cmd, data, cb) })
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
	localStorage: function(can, key, value) { value != undefined && wx.setStorageSync(key, value); return wx.getStorageSync(key) },
})
