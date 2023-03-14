Volcanos("misc", {
	Message: function(event, can) { var msg = kit.proto({}, {_event: event, _can: can, _target: can._target,
		RunAction: function(event, sub, cmds, meta) { var msg = can.request(event); meta = meta || sub&&sub.onaction || {}
			if (msg.Option(ice.MSG_HANDLE) != ice.TRUE && cmds && cmds[0] == ctx.ACTION && can.base.isFunc(meta[cmds[1]])) { msg.Option(ice.MSG_HANDLE, ice.TRUE)
				return can.core.CallFunc(meta[cmds[1]], {event: event._event||event, can: sub, msg: msg, button: cmds[1], cmd: cmds[1]}), true
			}
		},
		Display: function(file) { return msg.Option(ice.MSG_DISPLAY, file) },
		DisplayStory: function(file) { return msg.Option(ice.MSG_DISPLAY, chat.PLUGIN_STORY+file) },
		SearchOrOption: function(key) { return can.misc.Search(can, key)||msg.Option(key) },
		OptionProcess: function() { return msg.Option(ice.MSG_PROCESS) },
		OptionStatus: function() { return msg.Option(ice.MSG_STATUS) },
		StatusTimeCount: function(obj) { msg.append && msg.Status(can.base.Copy(kit.Dict(mdb.TIME, can.base.Time(), mdb.COUNT, msg.Length()+"x"+msg.append.length), obj)) },
		Status: function(obj) { return msg.Option(ice.MSG_STATUS, JSON.stringify(can.core.Item(obj, function(key, value) { return {name: key, value: value} }))) },
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
		Result: function() { if (!msg.result) { return "" } return msg.result[0] == ice.ErrWarn? msg.result.join(ice.SP): msg.result.join("") },
		Results: function() { return msg.result && msg.result[0] == ice.ErrWarn? "": msg.Result() },
		TableDetail: function() { var item = can.Option(); return msg.Table(function(value) { can.core.Value(item, value.key, value.value) }), item },
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
			res.append && (msg.append = res.append) && res.append.forEach(function(key) {
				var i = msg.option && msg.option.indexOf(key); if (i > -1) { msg.option[i] = "", delete(msg[key]) }
				res[key] && (msg[key] = (msg[key]||[]).concat(res[key]))
			}), res.result && (msg.result = (msg.result||[]).concat(res.result))
			res.option && (msg.option = res.option) && res.option.forEach(function(key) { res[key] && (msg[key] = res[key]) })
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
		Dump: function(can) { can = can||msg._can
			if (can.user.isNodejs) { return }
			can.onmotion.clear(can), can.onappend.table(can, msg), can.onappend.board(can, msg), can.onmotion.story.auto(can)
		},
		Defer: function(cb) { msg._defer = msg._defer||[]
			if (arguments.length == 0) { msg._defer = can.core.List(msg._defer.reverse(), function(cb) { can.base.isFunc(cb) && cb() }) } else { msg._defer.push(cb) }
		},
		_caller: function(skip) { msg.Option("log.caller") || msg.Option("log.caller", can.misc.fileLine((skip||2)+1).link); return msg },
	}); return msg },
	Event: function(event, can, cb) { for (var i = 3; i < arguments.length; i++) { can.request(event, arguments[i]) } cb(can.request(event)) },
	Run: function(event, can, dataset, cmds, cb) { var msg = can.request(event), _can = msg._can; _can._fields && _can.sup && (_can = _can.sup)
		var form = {cmds: cmds}; can.core.List(msg.option, function(key) { msg[key] && (form[key] = msg[key]) })
		can.misc.POST(can, msg, can.base.MergeURL(dataset.names.toLowerCase(), "_name", _can._name, "_index", _can._index), form, cb)
	},
	POST: function(can, msg, url, form, cb) { var xhr = new XMLHttpRequest(), begin = new Date(); msg._xhr = xhr
		xhr.open(msg._method||web.POST, url), xhr.onreadystatechange = function() { if (xhr.readyState != 4) { return }
			try { var res = JSON.parse(xhr.responseText) } catch (e) { var res = {result: [xhr.responseText]} } msg.Option("_cost", new Date() - begin)
			if (xhr.status == 200) { return msg.detail || (msg.detail = res.detail), can.base.isFunc(cb) && cb(msg.Copy(res)) }
			can.user.toastFailure(can, xhr.response), can.misc.Warn(xhr.status, res, url, form)
		}, xhr.setRequestHeader(web.Accept, msg._accept||web.ContentJSON)
		if (msg._upload) { var data = new FormData(); can.core.ItemForm(form, function(v, i, k) { data.append(k, v) })
			data.append(ice.MSG_UPLOAD, web.UPLOAD), data.append(web.UPLOAD, msg._upload)
			xhr.upload.onprogress = function(event) { can.base.isFunc(msg._progress) && msg._progress(event, parseInt(event.loaded*100/event.total), event.total, event.loaded) }
		} else if (can.user.isMailMaster) { var data = can.core.ItemForm(form, function(value, index, key) { return key+ice.EQ+encodeURIComponent(value) }).join("&")
			if (data) { xhr.open(msg._method||web.POST, url += (url.indexOf(url, ice.QS) == -1? ice.QS: "&")+data) }
		} else { var data = can.core.ItemForm(form, function(v, i, k) { return k+ice.EQ+encodeURIComponent(v) }).join("&")
			xhr.setRequestHeader(web.ContentType, web.ContentFORM)
		} try { xhr.send(data) } catch(e) { can.misc.Warn(e) }
	},
	WSS: function(can, args, cb, onopen, onclose, onerror, _msg) { if (can.user.isIE) { return }
		var url = location.protocol.replace(ice.HTTP, "ws")+"//"+location.host+"/space/"
		if (url.indexOf(html.CHROME) == 0) { url = "ws://localhost:9020/space/" }
		var socket = new WebSocket(can.base.MergeURL(url, args)); _msg = _msg || can.request()._caller()
		socket.onclose = function() { can.misc.Log(html.WSS, cli.CLOSE, args)
			can.base.isFunc(onclose)? onclose(socket): can.core.Timer(can.base.random(3000, 100), function() {
				args.name = args.name||can._wss_name, can.misc.WSS(can, args, cb, onopen, onerror, onclose, _msg)
			})
		}, socket.onerror = function() { can.misc.Log(html.WSS, log.ERROR, args)
			can.base.isFunc(onerror)? onerror(socket): socket.close()
		}, socket.onopen = function() { can.misc.Log(html.WSS, cli.OPEN, args, _msg)
			can.base.isFunc(onopen) && onopen(socket)
		}, socket.onmessage = function(event) { can.misc.Event(event, can, function(msg) {
			try { var data = JSON.parse(event.data) } catch (e) { var data = {detail: [event.data]} }
			msg.Reply = function() { var res = can.request({}, {_handle: ice.TRUE})
				res._target = (msg[ice.MSG_SOURCE]||[]).reverse(), res._source = (msg[ice.MSG_TARGET]||[]).reverse().slice(1)||[]
				res.append = msg.append, can.core.List(msg.append, function(key) { res[key] = msg[key] }), res.result = (msg.result||[]).concat(can.core.List(arguments))
				res.Option(ice.LOG_DISABLE, msg.Option(ice.LOG_DISABLE)) != ice.TRUE && can.misc.Log(html.WSS, ice.MSG_RESULT, msg.result&&msg.result.length>0? msg.result: undefined, msg, _msg)
				socket.send(JSON.stringify(res))
			}, msg.detail = data.detail, msg.Copy(data)
			try { msg.Option(ice.LOG_DISABLE) != ice.TRUE && can.misc.Log(html.WSS, ice.MSG_DETAIL, msg.detail, msg, _msg)
				can.core.CallFunc(cb, {event: event, msg: msg, cmd: msg.detail[0], arg: msg.detail.slice(1), cb: function() { msg.Reply() }})
			} catch (e) { can.misc.Warn(e), msg.Reply() }
		}) }
	},
	MergePath: function(can, file, path) { return file.indexOf(ice.PS) == 0 || file.indexOf(ice.HTTP) == 0? file: can.base.Path(path, file) },
	MergeCache: function(can, hash) { return can.misc.MergeURL(can, {_path: can.base.Path(web.SHARE_CACHE, hash)}, true) },
	MergePodCmd: function(can, obj) {
		if (can.base.beginWith(obj.pod, "http://", "https://")) { return obj.pod }
		obj.pod = can.core.Keys(can.misc.Search(can, ice.POD), obj.pod); return can.misc.MergeURL(can, obj, true)
	},
	MergeURL: function(can, obj, clear) { var path = location.pathname; obj._path && (path = obj._path), delete(obj._path)
		can.misc.Search(can, log.DEBUG) && (obj.debug = ice.TRUE); var hash = obj._hash||""; delete(obj._hash)
		var args = [web.CHAT]; can.core.List([ice.POD, ice.CMD, web.WEBSITE], function(key) { obj[key] && args.push(key, obj[key]), delete(obj[key]) })
		var _location = location; if (can.user.isExtension) { var _location = new URL(Volcanos.meta.iceberg) }
		return can.base.MergeURL(_location.origin+(args.length == 1? path: ice.PS+args.join(ice.PS))+(clear? "": _location.search), obj)+(hash? "#"+hash: "")
	},
	ParseURL: function(can, url) { var args = can.base.ParseURL(url), _location = new URL(url)
		delete(args.link), delete(args.origin), delete(args._origin)
		var ls = can.core.Split(_location.pathname, ice.PS); if (ls[0] == chat.SHARE) { args[chat.SHARE] = ls[1] }
		for (var i = 1; i < ls.length; i += 2) { if (can.base.isIn(ls[i], [ice.POD, ice.CMD, web.WEBSITE])) { args[ls[i]] = ls[i+1] } }
		return args
	},
	SplitPath: function(can, path) { var ls = path.split(ice.PS); if (ls.length == 1) { return [nfs.PWD, ls[0]] }
		if (ls[0] == ice.USR) { return [ls.slice(0, 2).join(ice.PS)+ice.PS, ls.slice(2).join(ice.PS)] }
		return [ls.slice(0, 1).join(ice.PS)+ice.PS, ls.slice(1).join(ice.PS)]
	},
	Search: function(can, key, value) { var args = this.ParseURL(can, location.href)
		if (can.base.isUndefined(key)) { return args } else if (can.base.isObject(key)) {
			can.core.Item(key, function(k, v) { v === ""? delete(args[k]): (args[k] = v) })
		} else if (can.base.isUndefined(value)) { return args[key] } else {
			value === ""? delete(args[key]): (args[key] = value)
		} var search = can.base.Args(args); return search? (location.search = search): (location.href = location.href.split(ice.QS)[0])
	},
	SearchHash: function(can) { var hash = location.hash
		if (arguments.length > 1) {
			hash = can.core.List(arguments, function(item) {
				return can.base.replaceAll(item, ":", "%3A")
				return encodeURIComponent(item)
			}).slice(1).join(ice.DF)
			if (can.isCmdMode() || can._name == "Action") { location.hash = hash }
		}
		return can.core.List(can.core.Split(can.base.trimPrefix(location.hash, "#"), ice.DF)||[], function(item) { return decodeURIComponent(item) })
	},
	SearchOrConf: function(can, key, def) { return can.misc.Search(can, key)||Volcanos.meta.args[key]||can.misc.sessionStorage(can, "can."+key)||can.misc.localStorage(can, "can."+key)||can.Conf(key)||def },
	CookieSessid: function(can, value, path) { return can.misc.Cookie(can, ice.MSG_SESSID+"_"+(location.port||(location.protocol == "https:"? "443": "80")), value, path) },
	Cookie: function(can, key, value, path) { function set(k, v) { document.cookie = k+ice.EQ+v+";path="+(path||ice.PS) }
		if (can.base.isObject(key)) { for (var k in key) { set(k, key[k]) } key = undefined }
		if (can.base.isUndefined(key)) { var cs = {}; if (!document.cookie) { return } return document.cookie.split("; ").forEach(function(item) { var ls = item.split(ice.EQ); cs[ls[0]] = ls[1] }), cs }
		if (value === "") { var expires = new Date(); expires.setTime(expires.getTime() - 10)
			return document.cookie = key+ice.EQ+value+";path="+(path||ice.PS)+";expires=" + expires.toGMTString(); 
		} can.base.isUndefined(value) || set(key, value)
		var val = (new RegExp(key+"=([^;]*);?")).exec(document.cookie); return val && val.length > 1? val[1]: ""
	},
	localStorage: function(can, key, value) {
		if (can.base.isUndefined(key)) { var res = {}; can.core.Item(localStorage, function(name, value) { can.base.isFunc(value) || name == "length" || (res[name] = value) }); return res }
		if (!can.base.isUndefined(value)) { if (value === "") { return localStorage.removeItem(key) } localStorage.setItem(key, value) } return localStorage.getItem(key)
	},
	sessionStorage: function(can, key, value) {
		if (can.base.isUndefined(key)) { var res = {}; can.core.Item(sessionStorage, function(name, value) { can.base.isFunc(value) || name == "length" || (res[name] = value) }); return res }
		if (!can.base.isUndefined(value)) { if (value === "") { return sessionStorage.removeItem(key) } sessionStorage.setItem(key, value) } return sessionStorage.getItem(key)
	},
	Log: function() { var args = this._args("", arguments)
		if (arguments[0].indexOf && arguments[0].indexOf("on") == 0) { args[1] = this.FileLine((arguments[0] == "onremote"? 4: 2)+this._skip) }
		for (var i in arguments) { var arg = arguments[i]; if (arg && arg.Option && arg.Option("log.caller")) { args[1] = arg.Option("log.caller") } }
		console.log.apply(console, args), this._signal(args)
	},
	Info: function() { var args = this._args(log.INFO, arguments); console.info.apply(console, args), this._signal(args) },
	Warn: function() { var args = this._args(log.WARN, arguments); console.warn.apply(console, args), this._signal(args); debugger },
	Error: function() {
		var args = this._args(log.ERROR, arguments); args.push(ice.NL, this._stacks().slice(1).join(ice.NL)), console.error.apply(console, args), this._signal(args); debugger
	},
	Debug: function() { var args = this._args(log.DEBUG, arguments); args.push(ice.NL, this._stacks().slice(1, 4).join(ice.NL)), console.debug.apply(console, args), this._signal(args) },
	Trace: function() { var output = false
		for (var i in arguments) { var arg = arguments[i]; if (arg.Conf && arg.Conf("log.trace") == ice.TRUE || arg.Option && arg.Option("log.trace") == ice.TRUE) { output = true } } if (!output) { return }
		var args = this._args(log.TRACE, arguments); args.push(ice.NL, this._stacks().slice(1, 4).join(ice.NL)), console.debug.apply(console, args), this._signal(args)
	},
	FileLine: function(depth, length) { var file = this.fileLine(depth+1, length||9); return file.link },
	fileLine: function(depth, length) { var list = this._stacks()
		function split(i) { if (!list[i]) { return {} }
			var ls = /(https*:\/\/[^/]+)*([^:]+):([0-9]+):([0-9]+)/.exec(list[i])
			var name = ""; list[i].lastIndexOf(ice.TB) > 0 && (name = list[i].split(ice.TB).pop())
			if (ls[0].indexOf(ice.QS) > -1) { ls[0] = ls[0].split(ice.QS)[0]+ice.DF+ls[3]+ice.DF+ls[4] }
			return {name: name, link: ls[0], path: ls[2], file: ls[2].split(ice.PS).slice(-length).join(ice.PS), line: ls[3], cols: ls[4]}
		}
		if (depth < 0) { var current = split(-depth)
			for (var i = -depth+1; i < list.length; i++) { var pos = split(i); if (pos.path != current.path) { return pos } }
		} return split(depth)||{}
	},
	_stacks: function(n, s) { var list = ((s||(new Error())).stack||"").split(ice.NL).slice(typeof n == undefined? 2: n)
		for (var i = 0; i < list.length; i++) { var ls = list[i].trim().split(ice.SP)
			list[i] = ls.pop().trim(); if (list[i][0] == "(") { list[i] = list[i].slice(1, -1) }
			list[i] = ice.TB+list[i]; if (ls.length > 1) { list[i] += ice.TB+ls.pop() }
			list[i] = list[i].replace(/\?[^:]+/, "").replace(location.origin, "")
		} return list
	}, _stack: function() { return ((new Error()).stack||"").split(ice.NL).slice(2) },
	_time: function() { var now = new Date()
		var hour = now.getHours(); hour < 10 && (hour = "0"+hour)
		var minute = now.getMinutes(); minute < 10 && (minute = "0"+minute)
		var second = now.getSeconds(); second < 10 && (second = "0"+second)
		var mill = now.getMilliseconds(); mill < 10 && (mill = "00"+mill) || mill < 100 && (mill = "0"+mill)
		return [hour, minute, second].join(ice.DF)+ice.PT+mill
	},
	_args: function(level, arg) { var args = [this._time(), this.FileLine(this._skip+1, 3)].concat(level? [level]: [])
		for (var i in arg) { arg[i] != undefined && args.push(arg[i]) } return args
	},
	_signal: function(args) { this._list.push(args) }, _list: [], _skip: navigator.userAgent.indexOf("Chrome") > -1? 1: 1,
})
