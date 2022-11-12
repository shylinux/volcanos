Volcanos("misc", {Message: function(event, can) { var msg = {} 
		var proto = {_event: event, _can: can,
			RunAction: function(event, sub, cmds, meta) { var msg = can.request(event); meta = meta || sub&&sub.onaction || {}
				if (msg.Option(ice.MSG_HANDLE) == ice.TRUE) { return }
				if (cmds && cmds[0] == ctx.ACTION && can.base.isFunc(meta[cmds[1]])) { msg.Option(ice.MSG_HANDLE, ice.TRUE)
					return can.core.CallFunc(meta[cmds[1]], {event: event._event||event, can: sub, msg: msg, button: cmds[1], cmd: cmds[1]}), true
				} return false
			},
			Display: function(file) { msg.Option(ice.MSG_DISPLAY, file) },
			DisplayStory: function(file) { msg.Option(ice.MSG_DISPLAY, chat.PLUGIN_STORY+file) },
			OptionStatus: function() { return msg.Option(ice.MSG_STATUS) },
			OptionProcess: function() { return msg.Option(ice.MSG_PROCESS) },
			SearchOrOption: function(key) { return can.misc.Search(can, key)||msg.Option(key) },
			StatusTimeCount: function(obj) { msg.append && msg.Status(can.base.Copy(kit.Dict(mdb.TIME, can.base.Time(), mdb.COUNT, msg.Length()+"x"+msg.append.length), obj)) },
			Status: function(obj) { msg.Option(ice.MSG_STATUS, JSON.stringify(can.core.Item(obj, function(key, value) { return {name: key, value: value} }))) },

			Option: function(key, val) {
				if (key == undefined) { return msg && msg.option || [] }
				if (can.base.isObject(key)) { can.core.Item(key, msg.Option) }
				if (val == undefined) { return msg && msg[key] && msg.option && msg.option.indexOf(key) > -1 && msg[key][0] || "" }
				return msg.option = can.base.AddUniq(msg.option, key), msg[key] = can.core.List(arguments).slice(1), val
			},
			Append: function(key, val) {
				if (key == undefined) { return msg && msg.append || [] }
				if (can.base.isObject(key)) { can.core.Item(key, msg.Append) }
				if (val == undefined) { return msg && msg[key] && msg[key][0] || "" }
				return msg.append = can.base.AddUniq(msg.append, key), msg[key] = can.core.List(arguments).slice(1), val
			},
			Result: function() {
				if (msg.result && msg.result[0] == ice.ErrWarn) { var res = msg.result[0]
					for (var i = 1; i < msg.result.length; i+=2) { res += msg.result[i]+(msg.result[i+1]||"")+ice.SP }
					return res
				} return msg.result && msg.result.join("") || ""
			},
			Results: function() { return msg.result && msg.result[0] == ice.ErrWarn? "": msg.Result() },
			TableDetail: function() { var item = {hash: can.Option(mdb.HASH)}
				return msg.Table(function(value) { can.core.Value(item, value.key, value.value) }), item
			},
			Table: function(cb) {
				return can.core.List(msg.Length(), function(value, index, array) { var one = {}, res
					can.core.List(msg.append, function(key) { one[key] = (msg[key]&&msg[key][index]||"") })
					return can.base.isFunc(cb) && (res = cb(one, index, array)) && res != undefined && res || one
				})
			},
			Length: function() {
				var max = "", len = 0; can.core.List(msg.append, function(key, index) {
					if (msg[key] && msg[key].length > len) { max = key, len = msg[key].length }
				}); return len
			},
			Clear: function(key) { switch (key||ice.MSG_APPEND) {
				case ice.MSG_APPEND:
				case ice.MSG_OPTION:
					can.core.List(msg[key], function(item) { delete(msg[item]) })
				default: msg[key] = []
			} },
			Copy: function(res) { if (!res) { return msg }
				res.append && (msg.append = res.append) && res.append.forEach(function(item) {
					var i = msg.option && msg.option.indexOf(item); if (i > -1) { msg.option[i] = "", delete(msg[item]) }
					res[item] && (msg[item] = (msg[item]||[]).concat(res[item]))
				}), res.result && (msg.result = (msg.result||[]).concat(res.result))
				res.option && (msg.option = res.option) && res.option.forEach(function(item) { res[item] && (msg[item] = res[item]) })
				res._option && (msg._option = res._option) && res._option.forEach(function(item) { res[item] && (msg[item] = res[item]) })
				return msg
			},
			Push: function(key, value, detail) {
				if (can.base.isObject(key)) {
					can.core.List(value||can.base.Obj(msg.Option(ice.MSG_FIELDS))||can.core.Item(key), function(item) {
						detail? msg.Push(mdb.KEY, item).Push(mdb.VALUE, key[item]||""): msg.Push(item, key[item]||"")
					}); return msg
				}
				msg.append = can.base.AddUniq(msg.append, key), msg[key] = msg[key]||[]
				var i = msg.option && msg.option.indexOf(key); if (i > -1) { msg.option[i] = "", msg[key] = [] }
				msg[key].push(can.base.isString(value)||can.base.isFunction(value)? value: JSON.stringify(value))
				return msg
			},
			Echo: function(res) { msg.result = msg.result||[]
				for (var i = 0; i < arguments.length; i++) { msg.result.push(arguments[i]) }
				return msg._hand = true, msg
			},
			Dump: function(can) {
				can.onmotion.clear(can)
				can.onappend.table(can, msg)
				can.onappend.board(can, msg)
				can.onmotion.story.auto(can)
			},
		}; return kit.proto(msg, proto)
	},
	concat: function(can, to, from) { to = to||[], from = from||[]
		if (from[0] == ctx.ACTION && from[1] == ice.RUN && can.onengine.plugin(can, from[2])) { return from }
		if (can.onengine.plugin(can, from[0])) { return from }
		if (from[0] == "_search") { return from }
		return to.concat(from)
	},
	runAction: function(can, msg, cmds, cb, meta) {
		if (cmds[0] == ctx.ACTION && meta[cmds[1]]) { return meta[cmds[1]](cmds.slice(2)), true }
		if (meta[cmds[0]]) { return meta[cmds[0]](cmds.slice(1)), true }
	},
	Run: function(event, can, dataset, cmds, cb) { var msg = can.request(event)
		var form = {cmds: cmds||msg.cmd}; msg.option && msg.option.forEach(function(item) {
			if ([ice.MSG_HANDLE, ice.MSG_DAEMON].indexOf(item) > -1) { return }
			if (can.base.isObject(msg.Option(item))) { return }
			if (can.base.isFunc(msg.Option(item))) { return }
			msg[item] && (form[item] = msg[item])
		})
		can.misc.POST(can, msg, can.base.MergeURL(dataset.names.toLowerCase(),
			"_name", (msg._can.sup||msg._can)._name, "_index", (msg._can.sup||msg._can)._index, ice.MSG_DAEMON, msg.__daemon||dataset.daemon||""
		), form, cb)
	},
	POST: function(can, msg, url, form, cb) { var xhr = new XMLHttpRequest(), begin = new Date(); msg._xhr = xhr
		xhr.open(msg._method||web.POST, url), xhr.onreadystatechange = function() { if (xhr.readyState != 4) { return }
			try { var res = JSON.parse(xhr.responseText) } catch (e) { var res = {result: [xhr.responseText]} } msg.Option("_cost", new Date() - begin)
			if (xhr.status == 200) { return can.base.isFunc(cb) && cb(msg.Copy(res)) } can.misc.Warn(xhr.status, res, url, form)
		}, xhr.setRequestHeader(web.Accept, msg._accept||web.ContentJSON)

		if (msg._upload) {
			var data = new FormData(); can.core.Items(form, function(value, index, key) { data.append(key, value) })
			data.append(ice.MSG_UPLOAD, web.UPLOAD), data.append(web.UPLOAD, msg._upload)
			xhr.upload.onprogress = function(event) { can.base.isFunc(msg._progress) && msg._progress(event, parseInt(event.loaded*100/event.total), event.total, event.loaded) }
		} else {
			var data = can.core.Items(form, function(value, index, key) { return key+ice.EQ+encodeURIComponent(value) }).join("&")
			xhr.setRequestHeader(web.ContentType, web.ContentFORM)
		}
		try { xhr.send(data) } catch(e) { can.misc.Warn(e) }
	},
	GET: function(can, url, cb) { var xhr = new XMLHttpRequest()
		xhr.open(msg._method||web.GET, url), xhr.onreadystatechange = function() { if (xhr.readyState != 4) { return }
			if (xhr.status == 200) { return can.base.isFunc(cb) && cb(xhr.responseText) } can.misc.Warn(xhr.status, res, url, form)
		}; try { xhr.send() } catch(e) { can.misc.Warn(e) }
	},
	WSS: function(can, args, cb, onopen, onclose, onerror) { if (can.user.isIE) { return }
		var url = location.protocol.replace(ice.HTTP, "ws")+"//"+location.host+"/space/"
		if (url.indexOf(html.CHROME) == 0) { url = "ws://localhost:9020/space/" }

		var socket = new WebSocket(can.base.MergeURL(url, args))
		socket.onclose = function() { can.misc.Log(html.WSS, cli.CLOSE, args)
			can.base.isFunc(onclose)? onclose(socket): can.core.Timer(can.base.random(3000, 1000), function() {
				args.name = args.name||can._wss_name, can.misc.WSS(can, args, cb, onopen, onerror, onclose)
			})
		}, socket.onerror = function() { can.misc.Log(html.WSS, log.ERROR, args)
			can.base.isFunc(onerror)? onerror(socket): socket.close()
		}, socket.onopen = function() { can.misc.Log(html.WSS, cli.OPEN, args)
			can.base.isFunc(onopen) && onopen(socket)
		}, socket.onmessage = function(event) {
			try { var data = JSON.parse(event.data) } catch (e) { var data = {detail: [event.data]} }

			var msg = can.request(event); msg.Reply = function() {
				var res = can.request({}); res._source = (msg[ice.MSG_TARGET]||[]).reverse().slice(1)||[]
				res.Option({_handle: ice.TRUE, _target: (msg[ice.MSG_SOURCE]||[]).reverse().join(ice.PT)})
				res.append = msg.append, can.core.List(msg.append, function(key) { res[key] = msg[key] }), res.result = (msg.result||[]).concat(can.core.List(arguments))
				res.Option(ice.LOG_DISABLE, msg.Option(ice.LOG_DISABLE)) != ice.TRUE && can.misc.Log(html.WSS, ice.MSG_RESULT, msg.result||[], msg)
				socket.send(JSON.stringify(res))
			}, msg.detail = data.detail, msg.Copy(data)

			try {
				msg.Option(ice.LOG_DISABLE) != ice.TRUE && can.misc.Log(html.WSS, ice.MSG_DETAIL, msg.detail, msg)
				can.base.isFunc(cb) && cb(event, msg, msg.detail[0], msg.detail.slice(1))
			} catch (e) { can.misc.Warn(e), msg.Reply() }
		}
	},

	MergePath: function(can, file, path) { return file.indexOf(ice.PS) == 0 || file.indexOf(ice.HTTP) == 0? file: can.base.Path(path, file) },
	MergeCache: function(can, hash) { return can.misc.MergeURL(can, {_path: can.base.Path(web.SHARE_CACHE, hash)}, true) },
	MergePodCmd: function(can, objs) {
		objs.pod = can.core.Keys(can.misc.Search(can, ice.POD), objs.pod)
		objs.topic = can.misc.Search(can, chat.TOPIC)
		return can.misc.MergeURL(can, objs, true)
	},
	MergeURL: function(can, objs, clear) { var pod = ""
		var path = location.pathname; objs._path && (path = objs._path), delete(objs._path)
		objs.pod && (path = can.base.Path("/chat/pod/", objs.pod)), delete(objs.pod)
		var ls = path.split("/"); ls[1] == "chat" && ls[2] == "pod" && (pod = ls[3])
		objs.cmd && (path = can.base.Path("/chat", pod? "pod/"+pod: "", ice.CMD, objs.cmd)), delete(objs.cmd)
		objs.website && (path = can.base.Path("/chat", pod? "pod/"+pod: "", web.WEBSITE, objs.website)), delete(objs.website)
		return can.base.MergeURL(location.origin+path+(clear?"":location.search), objs)
	},
	SearchOrConf: function(can, key, def) { return can.base.getValid(can.misc.Search(can, key), can.Conf(key), def) },
	SearchHash: function(can) { if (!can.isCmdMode()) { return [] }
		if (arguments.length > 1) { location.hash = encodeURIComponent(can.core.List(arguments).slice(1).join(ice.FS)) }
		return can.core.Split(decodeURIComponent(location.hash.slice(1)))||[]
	},
	Search: function(can, key, value) { var args = {}
		if (value == undefined && can.base.isString(key)) { var ls = location.pathname.split(ice.PS); if (ls[1] == chat.SHARE) { args[chat.SHARE] = ls[2] }
			for (var i = 2; i < ls.length; i += 2) { if (kit.Dict(ice.POD, true, ice.CMD, true, web.WEBSITE, true)[ls[i]]) { args[ls[i]] = ls[i+1] } }
		} location.search && location.search.slice(1).split("&").forEach(function(item) { var x = item.split(ice.EQ); x[1] != "" && (args[x[0]] = decodeURIComponent(x[1])) })

		if (can.base.isUndefined(key)) { return args } else if (can.base.isObject(key)) {
			can.core.Item(key, function(key, value) { can.base.isUndefined(value) || (args[key] = value), args[key] == "" && delete(args[key]) })
		} else if (can.base.isUndefined(value)) { return args[key] } else {
			args[key] = value, args[key] == "" && delete(args[key])
		}
		var search = can.core.Item(args, function(key, value) { return key+ice.EQ+encodeURIComponent(value) }).join("&")
		return search? location.search = search: location.href = location.pathname
	},
	CookieSessid: function(can, value, path) {
		return can.misc.Cookie(can, ice.MSG_SESSID+"_"+can.base.replaceAll(location.host, ice.PT, "_", ice.DF, "_"), value, path)
	},
	Cookie: function(can, key, value, path) {
		function set(k, v) { document.cookie = k+ice.EQ+v+";path="+(path||ice.PS) }
		if (can.base.isObject(key)) { for (var k in key) { set(k, key[k]) } key = undefined }
		if (can.base.isUndefined(key)) { var cs = {}
			return document.cookie.split("; ").forEach(function(item) { var ls = item.split(ice.EQ); cs[ls[0]] = ls[1] }), cs
		}
		can.base.isUndefined(value) || set(key, value)
		var val = (new RegExp(key+"=([^;]*);?")).exec(document.cookie)
		return val && val.length > 1? val[1]: ""
	},
	localStorage: function(can, key, value) {
		if (value != undefined) { localStorage.setItem(key, value) }
		return localStorage.getItem(key)
	},

	Log: function() {
		var args = [this._time(), this.FileLine(2, 3), ""]
		for (var i in arguments) { arguments[i] != undefined && args.push(arguments[i]) }
		console.log.apply(console, args)
		if (arguments[0] && arguments[0].onengine) { var can = arguments[0]; can.onengine.signal(can, chat.ONDEBUG, can.request({}, {time: can.misc._time(), fileline: can.misc.FileLine(-3), _args: args})) }
	},
	Info: function() {
		var args = [this._time(), this.FileLine(2, 3), log.INFO]
		for (var i in arguments) { arguments[i] != undefined && args.push(arguments[i]) }
		console.info.apply(console, args)
		if (arguments[0] && arguments[0].onengine) { var can = arguments[0]; can.onengine.signal(can, chat.ONDEBUG, can.request({}, {time: can.misc._time(), fileline: can.misc.FileLine(-3), _args: args})) }
	},
	Warn: function() {
		var args = [this._time(), this.fileLine(2, 3).link, log.WARN]
		for (var i in arguments) { arguments[i] != undefined && args.push(arguments[i]) }
		console.warn.apply(console, args)
		if (arguments[0] && arguments[0].onengine) { var can = arguments[0]; can.onengine.signal(can, chat.ONDEBUG, can.request({}, {time: can.misc._time(), fileline: can.misc.FileLine(-3), _args: args})) }
	},
	Error: function() {
		var args = [this._time(), this.fileLine(2, 3).link, log.ERROR]
		for (var i in arguments) { arguments[i] != undefined && args.push(arguments[i]) }
		args.push(ice.NL, this._stack().slice(1).join(ice.NL))
		console.error.apply(console, args)
		if (arguments[0] && arguments[0].onengine) { var can = arguments[0]; can.onengine.signal(can, chat.ONDEBUG, can.request({}, {time: can.misc._time(), fileline: can.misc.FileLine(-3), _args: args})) }
	},
	Debug: function() {
		var args = [this._time(), this.fileLine(2, 3).link, log.DEBUG]
		for (var i in arguments) { arguments[i] != undefined && args.push(arguments[i]) }
		args.push(ice.NL, this._stacks().slice(1, 4).join(ice.NL))
		console.debug.apply(console, args)
		if (arguments[0] && arguments[0].onengine) { var can = arguments[0]; can.onengine.signal(can, chat.ONDEBUG, can.request({}, {time: can.misc._time(), fileline: can.misc.FileLine(-3), _args: args})) }
	},
	Trace: function() { var filter = "", output = false
		var args = [this._time(), this.fileLine(2, 3).link, log.TRACE]
		for (var i in arguments) { var item = arguments[i]; if (item == undefined) { continue }
			if (item.misc && item.misc.Search) {
				filter += item.misc.Search(item, log.TRACE)||""
				item._name && args.push(item._name)
			} else if (item.Option) {
				filter += item.Option(log.TRACE)||""
			} else if (arguments[i].indexOf && arguments[i].indexOf(filter||log.TRACE) > -1) {
				output = true
			} args.push(arguments[i])
		} if (output) { return console.trace.apply(console, args), true }
	},
	FileLine: function(depth, length) { var file = this.fileLine(depth+1, length||9); return file.file+ice.DF+file.line },
	fileLine: function(depth, length) { var list = this._stack()
		function split(i) { if (!list[i]) { return {} }
			var ls = list[i].trim().split(ice.SP).slice(-2), link = ls.slice(-1)[0]; link.indexOf("(") == 0 && (link = link.slice(1, -1)), link.indexOf("@") > -1 && (ls = link.split("@"), link = ls[1])
			var path = link, file = "", line = "", cols = ""; path = link.indexOf(ice.HTTP) == 0 && (path = link.split(ice.PS).slice(3).join(ice.PS))
			for (var i = path.length; i > 0; i--) { if (path[i] != ice.DF) { continue }
				if (cols == "") { cols = path.slice(i+1), path = path.slice(0, i) } else if (line == "") {
					line = path.slice(i+1), path = path.slice(0, i)
					file = path.split(ice.PS).slice(-length).join(ice.PS), path = path.slice(0, -file.length)
					break
				}
			} return {name: ls[0], link: link, path: path, file: file, line: line, cols: cols}
		}
		if (depth < 0) { var current = split(-depth)
			for (var i = -depth+1; i < list.length; i++) { var pos = split(i); if (pos.file != current.file) { return pos } }
		} return split(depth)||{}
	},
	_stack: function() { return ((new Error()).stack||"").split(ice.NL).slice(2) },
	_stacks: function() { var list = ((new Error()).stack||"").split(ice.NL).slice(2), prefix = location.protocol+"//"+location.host
		for (var i = 0; i < list.length; i++) { var ls = list[i].trim().split(ice.SP)
			list[i] = ls.pop().trim(); if (list[i][0] == "(") { list[i] = list[i].slice(1, -1) }
			if (list[i].indexOf(prefix) == 0) { list[i] = list[i].slice(prefix.length).split(ice.PS).slice(-2).join(ice.PS) }
			list[i] = ice.TB+list[i]; if (ls.length > 1) { list[i] += ice.TB+ls.pop() }
		} return list
	},
	_time: function() { var now = new Date()
		var hour = now.getHours(); hour < 10 && (hour = "0"+hour)
		var minute = now.getMinutes(); minute < 10 && (minute = "0"+minute)
		var second = now.getSeconds(); second < 10 && (second = "0"+second)
		var mill = now.getMilliseconds(); mill < 10 && (mill = "00"+mill) || mill < 100 && (mill = "0"+mill)
		return [hour, minute, second].join(ice.DF)+ice.PT+mill
	},
})
