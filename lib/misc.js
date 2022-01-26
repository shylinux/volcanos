Volcanos("misc", {help: "通信协议", Message: function(event, can) { var msg = {} 
	var proto = {_event: event, _can: can,
		RunAction: function(event, sub, cmds, meta) { var msg = can.request(event); meta = meta || sub&&sub.onaction || {}
			if (msg.Option(ice.MSG_HANDLE) == ice.TRUE) { return }
			if (cmds && cmds[0] == ctx.ACTION && can.base.isFunc(meta[cmds[1]])) {
				return msg.Option(ice.MSG_HANDLE, ice.TRUE), can.core.CallFunc(meta[cmds[1]], {event: event, can: sub, msg: msg, button: cmds[1], cmd: cmds[1]}), true
			}
			return false
		},
		OptionStatus: function() { return msg.Option(ice.MSG_STATUS) },
		OptionProcess: function() { return msg.Option(ice.MSG_PROCESS) },
		OptionOrSearch: function(key) { return can.misc.Search(can, key)||msg.Option(key) },
		Option: function(key, val) {
			if (key == undefined) { return msg && msg.option || [] }
			if (can.base.isObject(key)) { can.core.Item(key, msg.Option) }
			if (val == undefined) { return msg && msg[key] && msg[key][0] || "" }
			return msg.option = can.base.AddUniq(msg.option, key), msg[key] = can.core.List(arguments).slice(1), val
		},
		Append: function(key, val) {
			if (key == undefined) { return msg && msg.append || [] }
			if (can.base.isObject(key)) { can.core.Item(key, msg.Append) }
			if (val == undefined) { return msg && msg[key] && msg[key][0] || "" }
			return msg.append = can.base.AddUniq(msg.append, key), msg[key] = can.core.List(arguments).slice(1), val
		},
		Result: function() { return msg.result && msg.result.join("") || "" },

		Length: function() {
			var max = "", len = 0; can.core.List(msg.append, function(key, index) {
				if (msg[key] && msg[key].length > len) { max = key, len = msg[key].length }
			})
			return len
		},
		Table: function(cb) { if (!msg.append || msg.append.length == 0) { return }
			var max = "", len = 0; can.core.List(msg.append, function(key, index) {
				if (msg[key] && msg[key].length > len) { max = key, len = msg[key].length }
			})

			return can.core.List(msg[max], function(value, index, array) { var one = {}, res
				can.core.List(msg.append, function(key) { one[key] = (msg[key]&&msg[key][index]||"") })
				return can.base.isFunc(cb) && (res = cb(one, index, array)) && res != undefined && res || one
			})
		},
		Clear: function(key) { switch (key||ice.MSG_APPEND) {
			case ice.MSG_APPEND:
			case ice.MSG_OPTION:
				can.core.List(msg[key], function(item) { delete(msg[item]) })
			default: msg[key] = []
		} },
		Copy: function(res) { if (!res) { return msg }
			res.result && (msg.result = (msg.result||[]).concat(res.result))
			res.append && (msg.append = res.append) && res.append.forEach(function(item) {
				var i = msg.option && msg.option.indexOf(item); if (i > -1) {
					msg.option[i] = "", delete(msg[item])
				}
				res[item] && (msg[item] = (msg[item]||[]).concat(res[item]))
			})
			res.option && (msg.option = res.option) && res.option.forEach(function(item) {
				res[item] && (msg[item] = res[item])
			})
			res._option && (msg._option = res._option) && res._option.forEach(function(item) {
				res[item] && (msg[item] = res[item])
			})
			return msg
		},
		Push: function(key, value, detail) {
			if (can.base.isObject(key)) {
				value = value||can.core.Item(key), can.core.List(value, function(item) {
					detail? msg.Push(mdb.KEY, item).Push(mdb.VALUE, key[item]||""):
						msg.Push(item, key[item]||"")
				})
				return msg
			}

			msg.append = can.base.AddUniq(msg.append, key), msg[key] = msg[key] || []
			msg[key].push(can.base.isString(value)||can.base.isFunction(value)? value: JSON.stringify(value))
			return msg
		},
		Echo: function(res) { msg.result = msg.result || []
			for (var i = 0; i < arguments.length; i++) { msg.result.push(arguments[i]) }
			return msg._hand = true, msg
		},
	};
	return can.misc.proto(msg, proto)
},
	POST: function(can, msg, url, form, cb) { // _method _accept _upload _progress
		var xhr = new XMLHttpRequest(); msg._xhr = xhr
		xhr.open(msg._method||"POST", url), xhr.onreadystatechange = function() {
			if (xhr.readyState != 4) { return }

			try { // 解析响应
				var res = JSON.parse(xhr.responseText)
			} catch (e) {
				var res = {result: [xhr.responseText]}
			}
			if (xhr.status == 200) {
				return can.base.isFunc(cb) && cb(msg.Copy(res))
			}
			can.user.toast(can, res, xhr.status)
		}

		if (msg._upload) { // 上传文件
			var data = new FormData(); can.core.Items(form, function(value, index, key) {
				data.append(key, value)
			}), data.append(html.UPLOAD, msg._upload), data.append(ice.MSG_UPLOAD, "upload")

			xhr.upload.onprogress = function(event) {
				can.base.isFunc(msg._progress) && msg._progress(event, parseInt(event.loaded*100/event.total), event.total, event.loaded)
			}
		} else { // 请求数据
			var data = can.core.Items(form, function(value, index, key) { return key+"="+encodeURIComponent(value) }).join("&")
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
		}

		// 发送请求
		xhr.setRequestHeader("Accept", msg._accept||"application/json")
		try { xhr.send(data) } catch(e) { can.misc.Log(e) }
	},
	Run: function(event, can, dataset, cmds, cb) {
		var msg = can.request(event||{}), skip = {_handle: true}
		var form = {cmds: cmds||msg.cmd}; msg.option && msg.option.forEach(function(item) {
			!skip[item] && msg[item] && (form[item] = msg[item])
		})

		can.misc.POST(can, msg, can.base.MergeURL(dataset.names.toLowerCase(),
			"_", (msg._can.sup||msg._can)._name, ice.MSG_DAEMON, msg.__daemon||dataset.daemon||""
		), form, cb)
	},
	WSS: function(can, args, cb, onopen, onclose, onerror) { if (can.user.isIE) { return }
		var url = location.protocol.replace("http", "ws")+"//"+location.host+"/space/"
		if (url.indexOf("chrome") == 0) { url = "ws://localhost:9020/space/" }

		var socket = new WebSocket(can.base.MergeURL(url, args))
		socket.onclose = function() { can.misc.Log(html.WSS, cli.CLOSE, args)
			can.base.isFunc(onclose)? onclose(socket): can.core.Timer(1000, function() {
				can.misc.WSS(can, args, cb, onopen, onerror, onclose)
			})
		}, socket.onerror = function() { can.misc.Log(html.WSS, cli.ERROR, args)
			can.base.isFunc(onerror)? onerror(socket): socket.close()

		}, socket.onopen = function() { can.misc.Log(html.WSS, cli.OPEN, args)
			can.base.isFunc(onopen) && onopen(socket)
		}

		socket.onmessage = function(event) {
			try { // 解析命令
				var data = JSON.parse(event.data)
			} catch (e) {
				var data = {detail: [event.data]}
			}

			var msg = can.request(event); msg.Reply = function() { // 回复命令
				msg.result = (msg.result||[]).concat(can.core.List(arguments))

				msg.Option({_handle: true, _source: (msg[ice.MSG_TARGET]||[]).reverse().slice(1).join(ice.PT)||"",_target: (msg[ice.MSG_SOURCE]||[]).reverse().join(".")})
				can.misc.Log(html.WSS, ice.MSG_RESULT, msg.result, msg)

				delete(msg._event), delete(msg._can)
				socket.send(JSON.stringify(msg))
			}, msg.detail = data.detail, msg.Copy(data)

			// 执行命令
			try {
				can.misc.Log(html.WSS, ice.MSG_DETAIL, msg.detail, msg)
				can.base.isFunc(cb) && cb(event, msg, msg.detail[0], msg.detail.slice(1))
			} catch (e) { // 执行失败
				can.misc.Log(e), msg.Reply()
			}
		}
	},

	CookieSessid: shy("会话变量", function(can, value, path) {
		var name = ice.MSG_SESSID+"_"+location.host.replaceAll(".", "_").replaceAll(":", "_")
		return can.misc.Cookie(can, name, value, path)
	}),
	Cookie: shy("会话变量", function(can, key, value, path) {
		function set(k, v) { document.cookie = k+"="+v+";path="+(path||ice.PS) }

		if (can.base.isObject(key)) {
			for (var k in key) { set(k, key[k]) }
			key = undefined
		}
		if (key == undefined) { var cs = {}
			document.cookie.split("; ").forEach(function(item) {
				var ls = item.split("="); cs[ls[0]] = ls[1]
			})
			return cs
		}

		value != undefined && set(key, value)
		var val = (new RegExp(key+"=([^;]*);?")).exec(document.cookie)
		return val && val.length > 0? val[1]: ""
	}),
	SearchOrConf: function(can, key, def) {
		can.base.getValid(can.misc.Search(can, key), can.Conf(key), def)
	},
	Search: shy("请求参数", function(can, key, value) { var args = {}
		if (value == undefined && can.base.isString(key)) {
			var ls = location.pathname.split(ice.PS)
			if (ls[1] == chat.SHARE) { args[chat.SHARE] = ls[2] }
			if (ls[1] == "chat" && ls[2] == ice.POD) { args[ice.POD] = ls[3] }
		}

		location.search && location.search.slice(1).split("&").forEach(function(item) { var x = item.split("=")
			x[1] != "" && (args[x[0]] = decodeURIComponent(x[1]))
		})

		if (can.base.isObject(key)) {
			can.core.Item(key, function(key, value) {
				if (value != undefined) {args[key] = value}
				args[key] == "" && delete(args[key])
			})
		} else if (key == undefined) {
			return args
		} else if (value == undefined) {
			return args[key]
		} else {
			args[key] = value, args[key] == "" && delete(args[key])
		}

		return location.search = can.core.Item(args, function(key, value) {
			return key+"="+encodeURIComponent(value)
		}).join("&")
	}),
	MergeURL: shy("地址链接", function(can, objs, clear) {
		var path = location.pathname; objs._path && (path = objs._path, delete(objs._path))
		objs && objs.pod && (path = "/chat/pod/"+objs.pod, delete(objs.pod))
		return can.base.MergeURL(location.origin+path+(clear?"":location.search), objs)
	}),

	runAction: function(can, msg, cmds, cb, list) {
		if (cmds[0] == ctx.ACTION && list[cmds[1]]) { return list[cmds[1]](cmds.slice(2)), true }
		if (list[cmds[0]]) { return list[cmds[0]](cmds.slice(1)), true }
	},
	concat: function(can, to, from) { to = to||[], from = from||[]
		if (from[0] == ctx.ACTION && from[1] == ice.RUN && can.onengine.plugin.meta[from[2]]) {
			return from
		}
		if (can.onengine.plugin.meta[from[0]]) {
			return from
		}
		if (from[0] == "_search") { return from }
		return to.concat(from)
	},
	proto: function(sub, sup) {
		if (navigator.userAgent.indexOf("MSIE") > -1) {
			for (var k in sup) { sub[k] = sub[k]||sup[k] }
		} else {
			sub.__proto__ = sup
		}
		return sub
	},

	Log: function() {
		var args = [this._time(), this.FileLine(2, 3)]
		for (var i in arguments) { args.push(arguments[i]) }
		console.log.apply(console, args)
	},
	Info: function() {
		var args = [this._time(), this.FileLine(2, 3)]
		for (var i in arguments) { args.push(arguments[i]) }
		console.log.apply(console, args)
	},
	Warn: function() {
		var args = [this._time(), this.FileLine(2, 3), "warn"]
		for (var i in arguments) { args.push(arguments[i]) }
		args.push(ice.NL, this._fileLine().split(ice.NL).slice(2).join(ice.NL))
		console.log.apply(console, args)
	},
	Debug: function() {
		var args = [this._time(), this.FileLine(2, 3), "debug"]
		for (var i in arguments) { args.push(arguments[i]) }
		args.push(this.fileLine(2, 3))
		console.log.apply(console, args)
		navigator.userAgent.indexOf("Mobile") > -1 && alert(JSON.stringify(args.join(ice.SP)))
	},
	FileLine: function(depth, length) {
		return this.fileLine(depth+1).split(ice.PS).slice(3).slice(-length).join(ice.PS).split(")")[0]
	},
	fileLine: function(depth) {
		return (this._fileLine().split(ice.NL)[1+depth]||"").trim()
	},
	_fileLine: function() { var obj = {}
		Error.captureStackTrace && Error.captureStackTrace(obj, arguments.callee)
		return obj.stack || ""
	},
	_time: function() { var now = new Date()
		var hour = now.getHours()
		if (hour < 10) { hour = "0"+hour }
		var minute = now.getMinutes()
		if (minute < 10) { minute = "0"+minute }
		var second = now.getSeconds()
		if (second < 10) { second = "0"+second }
		return hour+":"+minute+":"+second
	},
})

