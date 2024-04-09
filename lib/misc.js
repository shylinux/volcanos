Volcanos("misc", {
	Event: function(event, can, cb) { for (var i = 3; i < arguments.length; i++) { can.request(event, arguments[i]) } cb(can.request(event)) },
	Message: function(event, can) { var msg = kit.proto({}, {_event: event, _can: can, _target: can._target,
		RunAction: function(event, sub, cmds, meta) { var msg = can.request(event); meta = meta || sub&&sub.onaction || {}
			if (!msg._method) {
				if (!cmds || cmds.length == 0 || cmds[0] != ctx.ACTION) {
					msg._method = http.GET
				} else if (can.base.isIn(cmds[1], mdb.CREATE, mdb.INSERT)) {
					msg._method = http.PUT
				} else if (can.base.isIn(cmds[1], mdb.REMOVE, mdb.DELETE)) {
					msg._method = http.DELETE
				} else {
					msg._method = http.POST
				}
			}
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
			if (msg.IsDetail()) {
				for (var i = 0; i < msg.key.length; i++) {
					if (msg.key[i] == key) {
						if (val != undefined) { msg.value[i] = val }
						return msg.value[i]
					}
				}
				return
			}
			if (val == undefined) { return can.base.isIn(key, msg.append) && msg[key] && msg[key][0] || "" }
			return msg.append = can.base.AddUniq(msg.append, key), msg[key] = can.core.List(arguments).slice(1), val
		},
		Result: function() { if (!msg.result) { return "" } return msg.result[0] == ice.ErrWarn? msg.result.join(lex.SP): msg.result.join("") },
		Results: function() { return msg.result && msg.result[0] == ice.ErrWarn? "": msg.Result() },
		TableDetail: function() { var item = can.Option(); return msg.Table(function(value) { can.core.Value(item, value.key, value.value) }), item },
		IsDetail: function() {
			return msg.Option("fields") == "detail" || msg.append && msg.append.length == 2 && msg.append[0] == "key" && msg.append[1] == "value"
		},
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
		Dump: function(can) { can = can||msg._can; if (can.user.isNodejs) { return }
			can.onmotion.clear(can), can.onappend.table(can, msg), can.onappend.board(can, msg), can.onmotion.story.auto(can)
		},
		Defer: function(cb) { msg._defer = msg._defer||[]
			if (arguments.length == 0) { msg._defer = can.core.List(msg._defer.reverse(), function(cb) { can.base.isFunc(cb) && cb() }) } else { msg._defer.push(cb) }
		},
		IsErr: function() { return msg.result && msg.result[0] == "warn: " },
		_caller: function(skip) { msg.Option("log.caller") || msg.Option("log.caller", can.misc.fileLine((skip||2)+3).link); return msg },
		isDebug: function() { return msg.Option(log.DEBUG) == ice.TRUE },
	}); return msg },
	Inputs: function(can, msg, cmds, cb, meta) {
		if (msg.Option(ice.MSG_HANDLE) != ice.TRUE && cmds && cmds[0] == ctx.ACTION && meta.feature[cmds[1]]) {
			var msg = can.request(event, {action: cmds[1]})
			var action = meta.feature[cmds[1]]; if (can.base.isFunc(action)) { cb = cb||function() { can.Update() }
				return action.list && action.list.length > 0? can.user.input(event, can, action.list, function(data) {
					can.core.CallFunc(action, {can: can, msg: can.request(event, data), arg: cmds.slice(2), cb: cb})
				}): can.core.CallFunc(action, {sup: meta.can, can: can, msg: can.request(event), arg: cmds.slice(2), cb: cb})
			}
			var input = can.user.input(event, can, meta.feature[cmds[1]], function(args) {
				can.page.ClassList.add(can, input._target, html.PROCESS)
				can.Update(can.request(event, {_handle: ice.TRUE}, msg, can.Option()), cmds.slice(0, 2).concat(args), cb||function(msg) {
					can.page.ClassList.del(can, input._target, html.PROCESS)
					if (msg.IsErr()) {
						can.onappend.style(can, "warn", can.user.toastFailure(can, msg.Result())._target)
						input.focus()
					} else {
						can.Update()
						input.cancel()
					}
				}); return true
			}); return true
		} return false
	},
	ParseCmd: function(can, msg, cb, cbs) { var list = []
		return msg.Table(function(field, order) {
			field.feature = can.base.Obj(field.meta, {})
			field.inputs = can.base.Obj(field.list, [])
			field.name = can.core.Split(field.name)[0]
			if (!field.inputs || field.inputs.length === 0) {
				return can.onmotion.delay(can, function() { cb(field, order) })
			}
			can.core.List(field.inputs, function(input, index) {
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
					cbs(input, index, field, order)
				}
				input.type == html.BUTTON && input.action == ice.AUTO && can.onmotion.delay(can, function() { cb(field, order) })
			})
			return field
		})
	},
	Run: function(event, can, dataset, cmds, cb) { var msg = can.request(event), _can = msg._can; _can._fields && _can.sup && (_can = _can.sup)
		var form = {cmds: cmds}; can.core.List(msg.option, function(key) { !can.base.isIn(key, "log.caller", "_handle", "_toast") && msg[key] && (form[key] = msg[key]) })
		can.misc.POST(can, msg, dataset.names.toLowerCase(), form, cb)
	},
	GET: function(can, path, cb) { can.misc.POST(can, can.request({}, {_method: http.GET}), path, {}, function(msg) {
		cb(msg._xhr.responseText)
	}) },
	POST: function(can, msg, url, form, cb, cbs) { var xhr = new XMLHttpRequest(), begin = new Date(); msg._xhr = xhr, xhr._begin = begin
		var data = can.core.ItemForm(form, function(v, i, k) { return k+mdb.EQ+encodeURIComponent(v) }).join("&")
		if (can.user.isMailMaster && location.protocol == "http:") { msg._method = http.GET }
		if (data && can.base.isIn(msg._method,  http.GET, http.DELETE)) { url += (url.indexOf("?") == -1? "?": "&")+data, data = "" }
		xhr.open(msg._method||http.POST, url), xhr.onreadystatechange = function() { if (xhr.readyState != 4) { return }
			try { var res = JSON.parse(xhr.responseText) } catch (e) {
				if (xhr.responseText.indexOf("warn: ")) { var res = {result: [xhr.responseText]} } else { var res = {result: [xhr.responseText]} }
			} msg.Option("_cost", new Date() - begin), msg.detail || (msg.detail = res.detail), msg.Copy(res)
			if (xhr.status == 200) { return can.base.isFunc(cb) && cb(msg) } typeof msg._failure == code.FUNCTION && msg._failure()
			can.user.toastFailure(msg._can||can, msg.Result(), msg.Option(ice.MSG_TITLE)), can.misc.Warn(xhr.status, res, url, form), cbs && cbs(xhr)
		}, xhr.setRequestHeader(http.Accept, msg._accept||http.ApplicationJSON)
		if (msg._upload) { var data = new FormData(); can.core.ItemForm(form, function(v, i, k) { data.append(k, v) })
			data.append(ice.MSG_UPLOAD, web.UPLOAD), data.append(web.UPLOAD, msg._upload)
			xhr.upload.onprogress = function(event) { can.base.isFunc(msg._progress) && msg._progress(event, parseInt(event.loaded*100/event.total), event.total, event.loaded) }
		} else {
			xhr.setRequestHeader(http.ContentType, http.ApplicationFORM)
		} try { xhr.send(data) } catch(e) { can.misc.Warn(e), cbs && cbs(e) }
	},
	WSS: function(can, args, cb, onopen, onclose, onerror, _msg) { if (can.user.isIE) { return }
		args.debug = can.misc.Search(can, ice.MSG_DEBUG)
		args[ice.FROM_DAEMON] = can.misc.Search(can, ice.FROM_DAEMON)
		args.text = location.pathname+location.search, args.module = "shylinux.com/x/volcanos", args.version = can.base.trimPrefix(window._version, "?_v=")
		var msg = can.request(); can.page.exportValue(can, msg), can.core.List(msg.Option(), function(value) { args[value] = msg.Option(value) })
		var url = location.protocol.replace(ice.HTTP, "ws")+"//"+location.host+"/space/"; if (url.indexOf(html.CHROME) == 0) { url = "ws://localhost:9020/space/" }
		try { var socket = new WebSocket(can.base.MergeURL(url, args)); _msg = _msg || can.request()._caller() } catch {}
		can._socket = socket, socket.onclose = function() { can.misc.Log(html.WSS, cli.CLOSE, args); if (socket._close) { return }
			can.base.isFunc(onclose)? onclose(socket): can.core.Timer(can.base.random(3000, 300), function() {
				args.name = args.name||can._wss_name, can.misc.WSS(can, args, cb, onopen, onerror, onclose, _msg)
			})
		}, socket.onerror = function() { can.misc.Log(html.WSS, log.ERROR, args)
			can.base.isFunc(onerror)? onerror(socket): socket.close()
		}, socket.onopen = function() { can.misc.Log(html.WSS, cli.OPEN, args, _msg)
			can.base.isFunc(onopen) && onopen(socket)
		}, socket.onmessage = function(event) { can.misc.Event(event, can, function(msg) {
			try { var data = JSON.parse(event.data) } catch (e) { var data = {detail: [event.data]} }
			msg.Reply = function() { if (msg.Option("space.noecho") == ice.TRUE) { return }
				var res = can.request({}, {_handle: ice.TRUE})
				res._target = (msg[ice.MSG_SOURCE]||[]).reverse(), res._source = (msg[ice.MSG_TARGET]||[]).reverse().slice(1)||[]
				res.append = msg.append, can.core.List(msg.append, function(key) { res[key] = msg[key] }), res.result = (msg.result||[]).concat(can.core.List(arguments))
				res.Option(ice.LOG_DISABLE, msg.Option(ice.LOG_DISABLE)) != ice.TRUE && can.misc.Log(html.WSS, ice.MSG_RESULT, msg.result&&msg.result.length>0? msg.result: undefined, msg, _msg)
				res.Option(ice.LOG_TRACEID, msg.Option(ice.LOG_TRACEID))
				res.Option(ice.MSG_DEBUG, msg.Option(ice.MSG_DEBUG))
				socket.send(JSON.stringify(res))
			}, msg.detail = data.detail||[], msg.Copy(data), msg[ice.MSG_TARGET] = data[ice.MSG_TARGET]||[]
			try { msg.Option(ice.LOG_DISABLE) != ice.TRUE && can.misc.Log(html.WSS, ice.MSG_DETAIL, msg.detail, msg, _msg)
				can.core.CallFunc(cb, {event: event, msg: msg, cmd: msg.detail[0], arg: msg.detail.slice(1), cb: function() { msg.Reply() }})
			} catch (e) { can.misc.Warn(e), msg.Reply() }
		}) }
		return socket
	},
	ResourceFavicon(can, path) { return can.misc.Resource(can, path||can.user.info.favicon||nfs.SRC_MAIN_ICO) },
	Resource(can, path, space, serve) {
		if (!can.base.beginWith(path, web.HTTP, nfs.PS)) { path = nfs.REQUIRE+path+_version }
		if (!can.base.beginWith(path, web.HTTP)) { if (serve && serve.indexOf(location.origin) == -1) { var u = can.base.ParseURL(serve); path = u.origin + path } }
		if (path.indexOf("pod=") > 0) { return path }
		return can.base.MergeURL(path, ice.POD, space||can.ConfSpace()||can.misc.Search(can, ice.POD))
	},
	ShareLocal(can, path, space) { if (can.base.beginWith(path, web.HTTP, nfs.PS)) { return path }
		return can.base.MergeURL(nfs.SHARE_LOCAL+path+_version, ice.POD, space||can.ConfSpace())
	},
	ShareCache(can, path, space) { if (can.base.beginWith(path, web.HTTP, nfs.PS)) { return path }
		return can.base.MergeURL(nfs.SHARE_CACHE+path+_version, ice.POD, space||can.ConfSpace())
	},
	Template(can, path, file) { return can.base.Path(nfs.SRC_TEMPLATE, can.ConfIndex(), path, file) },
	MergePath: function(can, file, path) { return file.indexOf(nfs.PS) == 0 || file.indexOf(ice.HTTP) == 0? file: can.base.Path(path, file) },
	MergeCache: function(can, hash, pod) { return can.base.MergeURL(can.misc.MergeURL(can, {_path: can.base.Path(web.SHARE_CACHE, hash)}, true), ice.POD, pod) },
	MergePodCmd: function(can, obj) {
		if (can.base.beginWith(obj.pod, nfs.PS, web.HTTP)) {
			if (location.search.indexOf("debug=true") > 0 && obj.pod.indexOf("debug=true") == -1) {
				var ls = obj.pod.split("#"); ls[0] += (ls[0].indexOf("?") > 0? "&": "?") + "debug=true", obj.pod = ls.join("#")
			} return obj.pod
		}
		obj.pod = obj.pod == undefined? can.misc.Search(can, ice.POD): obj.pod; return can.misc.MergeURL(can, obj, true)
	},
	MergeURL: function(can, obj, clear) { var path = location.pathname; obj._path && (path = obj._path), delete(obj._path)
		can.misc.Search(can, log.DEBUG) && (obj.debug = ice.TRUE); var hash = obj._hash||""; delete(obj._hash)
		var args = []; can.core.List([ice.POD, ice.CMD], function(key) { obj[key] && args.push(key == ice.POD? "s": "c", obj[key]), delete(obj[key]) })
		var _location = location; if (can.user.isExtension) { var _location = new URL(Volcanos.meta.iceberg) }
		return can.base.MergeURL(_location.origin+(args.length > 0? nfs.PS+args.join(nfs.PS): path)+(clear? "": _location.search), obj)+(hash? "#"+hash: "")
	},
	ParseURL: function(can, url) { url = url||location.href; var args = can.base.ParseURL(url)
		delete(args.link), delete(args.origin), delete(args._origin)
		var raw = new RegExp("(https?://[^/]+)([^?#]*)([^#]*)(.*)").exec(url)
		var ls = can.core.Split(raw[2], nfs.PS);
		if (ls[0] == chat.SHARE) { args[chat.SHARE] = ls[1] }
		if (ls[0] == "s") { args[ice.POD] = decodeURIComponent(ls[1]); if (ls[2] == "c") { args[ice.CMD] = ls[3] } }
		if (ls[0] == "c") { args[ice.CMD] = ls[1] }
		for (var i = 1; i < ls.length; i += 2) { if (can.base.isIn(ls[i], [ice.POD, ice.CMD])) { args[ls[i]] = ls[i+1] } }
		return args
	},
	SplitPath: function(can, path) {
		if (path.indexOf("http") == 0) { return [path] }
		if (path.indexOf("/require/") == 0) { return [path] }
		if (path.indexOf("/plugin/") == 0) { return ["usr/volcanos/", path.split("?")[0]] }
		var ls = path.split(nfs.PS); if (ls.length == 1) { return [nfs.PWD, ls[0]] }
		if (ls[0] == ice.USR) { return [ls.slice(0, 2).join(nfs.PS)+nfs.PS, ls.slice(2).join(nfs.PS)] }
		return [ls.slice(0, 1).join(nfs.PS)+nfs.PS, ls.slice(1).join(nfs.PS)]
	},
	PathJoin: function(dir, file, ext) { file = file||""
		if (file.indexOf(nfs.PS) == 0 || file.indexOf(web.HTTP) == 0) { return file }
		if (dir.indexOf(nfs.SRC) == 0 || dir.indexOf(nfs.USR) == 0) { dir = "/require/"+dir }
		return dir+file+(ext? nfs.PT+ext: "")
	},
	isDebug: function(can) { return can.misc.Search(can, log.DEBUG) == ice.TRUE },
	Search: function(can, key, value) { var args = this.ParseURL(can, location.href)
		if (can.base.isUndefined(key)) { return args } else if (can.base.isObject(key)) {
			can.core.Item(key, function(k, v) { v === ""? delete(args[k]): (args[k] = v) })
		} else if (can.base.isUndefined(value)) { return args[key] } else {
			value === ""? delete(args[key]): (args[key] = value)
		}
		location.pathname.indexOf("/chat/pod/") == 0 && delete(args["pod"])
		location.pathname.indexOf("/s/") == 0 && delete(args["pod"])
		var search = can.base.Args(args)
		return search? (location.search = search): (location.href = location.href.split(ice.QS)[0])
	},
	SearchHash: function(can) { var hash = location.hash
		if (arguments.length > 1) {
			hash = can.core.List(arguments, function(item) { return can.base.replaceAll(item, ":", "%3A") }).slice(1).join(nfs.DF)
			if (can.isCmdMode() || can._name == "River" || can._name == "Action") { location.hash = hash }
		}
		return can.core.List(can.core.Split(can.base.trimPrefix(location.hash, "#"), nfs.DF)||[], function(item) { return decodeURIComponent(item) })
	},
	SearchOrConf: function(can, key, def) { return can.misc.Search(can, key)||Volcanos.meta.args[key]||can.misc.sessionStorage(can, "can."+key)||can.misc.localStorage(can, "can."+key)||can.Conf(key)||def },
	CookieSessid: function(can, value, path) { return can.misc.Cookie(can, ice.MSG_SESSID+"_"+(location.port||(location.protocol == "https:"? "443": "80")), value, path) },
	Cookie: function(can, key, value, path) {
		function set(k, v) { var expires = new Date(); expires.setTime(expires.getTime() + 30*24*3600000)
			document.cookie = k+mdb.EQ+v+";path="+(path||nfs.PS)+";expires="+expires.toGMTString()
		}
		if (can.base.isObject(key)) { for (var k in key) { set(k, key[k]) } key = undefined }
		if (can.base.isUndefined(key)) { var cs = {}; if (!document.cookie) { return } return document.cookie.split("; ").forEach(function(item) { var ls = item.split(mdb.EQ); cs[ls[0]] = ls[1] }), cs }
		if (value === "") { var expires = new Date(); expires.setTime(expires.getTime() - 10)
			return document.cookie = key+mdb.EQ+value+";path="+(path||nfs.PS)+";expires="+expires.toGMTString()
		} can.base.isUndefined(value) || set(key, value)
		var val = (new RegExp(key+"=([^;]*);?")).exec(document.cookie); return val && val.length > 1? val[1]: ""
	},
	localStorage: function(can, key, value) {
		if (can.base.isUndefined(key)) { var res = {}; can.core.Item(localStorage, function(name, value) { can.base.isFunc(value) || name == "length" || (res[name] = value) }); return res }
		if (!can.base.isUndefined(value)) { if (value === "") { return localStorage.removeItem(key) } localStorage.setItem(key, value) } return can.base.Obj(localStorage.getItem(key))
	},
	sessionStorage: function(can, key, value) {
		if (can.base.isUndefined(key)) { var res = {}; can.core.Item(sessionStorage, function(name, value) { can.base.isFunc(value) || name == "length" || (res[name] = value) }); return res }
		if (can.base.isArray(key)) { key = key.join(":") }
		if (!can.base.isUndefined(value)) {
			if (value === "") { return sessionStorage.removeItem(key) } sessionStorage.setItem(key, value)
		} return can.base.Obj(sessionStorage.getItem(key))
	},
	Log: function() {
		var args = this._args("", arguments)
		if (arguments[0].indexOf && arguments[0].indexOf("on") == 0) { args[1] = this.FileLine((arguments[0] == "onremote"? 1: 1)+this._skip) }
		for (var i in arguments) { var arg = arguments[i]; if (arg && arg.Option && arg.Option("log.caller")) { args[1] = arg.Option("log.caller") } }
		console.log.apply(console, args), this._signal(args)
	},
	Info: function() { var args = this._args(log.INFO, arguments); console.info.apply(console, args), this._signal(args) },
	Warn: function() {
		var args = this._args(log.WARN, arguments); console.warn.apply(console, args), this._signal(args);
		// debugger
	},
	Error: function() { var args = this._args(log.ERROR, arguments); args.push(lex.NL, this._stacks().slice(1).join(lex.NL)), console.error.apply(console, args), this._signal(args); debugger },
	Debug: function() { var args = this._args(log.DEBUG, arguments); args.push(lex.NL, this._stacks().slice(1, 4).join(lex.NL)), console.debug.apply(console, args), this._signal(args) },
	Trace: function() { var output = false
		for (var i in arguments) { var arg = arguments[i]; if (arg.Conf && arg.Conf("log.trace") == ice.TRUE || arg.Option && arg.Option("log.trace") == ice.TRUE) { output = true } } if (!output) { return }
		var args = this._args(log.TRACE, arguments); args.push(lex.NL, this._stacks().slice(1, 4).join(lex.NL)), console.debug.apply(console, args), this._signal(args)
	},
	FileLine: function(depth, length) { var file = this.fileLine(depth+1, length||9); return file.link },
	fileLine: function(depth, length) { var list = this._stacks()
		function split(i) { if (!list[i]) { return {} }
			var ls = /(https*:\/\/[^/]+)*([^:]+):([0-9]+):([0-9]+)/.exec(list[i]); if (!ls) { return {} }
			var name = ""; list[i].lastIndexOf(lex.TB) > 0 && (name = list[i].split(lex.TB).pop())
			if (ls[0].indexOf(ice.QS) > -1) { ls[0] = ls[0].split(ice.QS)[0]+nfs.DF+ls[3]+nfs.DF+ls[4] }
			return {name: name, link: ls[0], path: ls[2], file: ls[2].split(nfs.PS).slice(-length).join(nfs.PS), line: ls[3], cols: ls[4]}
		}
		if (depth < 0) { var current = split(-depth)
			for (var i = -depth+1; i < list.length; i++) { var pos = split(i); if (pos.path != current.path) { return pos } }
		} return split(depth)||{}
	},
	_stacks: function(n, s) { var list = ((s||(new Error())).stack||"").split(lex.NL).slice(typeof n == "undefined"? 2: n)
		for (var i = 0; i < list.length; i++) { var ls = list[i].trim().split(lex.SP)
			list[i] = ls.pop().trim(); if (list[i][0] == "(") { list[i] = list[i].slice(1, -1) }
			list[i] = " "+list[i]; if (ls.length > 1) { list[i] += " "+ls.pop() }
			list[i] = list[i].replace(/\?[^:]+/, "").replace(location.origin, "")
		} return list
	}, _stack: function() { return ((new Error()).stack||"").split(lex.NL).slice(2) },
	_time: function() { var now = new Date()
		var hour = now.getHours(); hour < 10 && (hour = "0"+hour)
		var minute = now.getMinutes(); minute < 10 && (minute = "0"+minute)
		var second = now.getSeconds(); second < 10 && (second = "0"+second)
		var mill = now.getMilliseconds(); mill < 10 && (mill = "00"+mill) || mill < 100 && (mill = "0"+mill)
		return [hour, minute, second].join(nfs.DF)+nfs.PT+mill
	},
	_args: function(level, arg) { var args = [this._time(), this.FileLine(this._skip+1, 3)].concat(level? [level]: [])
		for (var i in arg) { arg[i] != undefined && args.push(arg[i]) } return args
	},
	_signal: function(args) { this._list.push(args) }, _list: [], _skip: navigator && navigator.userAgent.indexOf("Chrome") > -1? 3: 3,
})
