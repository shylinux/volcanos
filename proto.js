function shy(help, meta, list, cb) { var arg = arguments, i = 0; function next(type) {
	if (type == code.OBJECT) { if (typeof arg[i] == code.OBJECT && arg[i].length == undefined) { return arg[i++] }
	} else if (type == code.ARRAY) { if (typeof arg[i] == code.OBJECT && arg[i].length != undefined) { return arg[i++] }
	} else if (i < arg.length && (!type || type == typeof arg[i])) { return arg[i++] }
} return cb = typeof arg[arg.length-1] == code.FUNCTION? arg[arg.length-1]: function() {}, cb.help = next(code.STRING)||"", cb.meta = next(code.OBJECT)||{}, cb.list = next(code.ARRAY)||[], cb
}; var _can_name = "", _can_path = ""
var Volcanos = shy({iceberg: "", volcano: "", frame: chat.FRAME_JS, _cache: {}, cache: {}, pack: {}, args: {}}, function(name, can, libs, cb) {
	var meta = arguments.callee.meta, list = arguments.callee.list; if (typeof name == code.OBJECT) {
		if (name.length > 0) { return Volcanos({panels: [{name: chat.HEADER, style: html.HIDE, state: [mdb.TIME, aaa.USERNICK]}, {name: chat.ACTION, style: html.MAIN, tool: name}, {name: chat.FOOTER, style: html.HIDE}]}) }
		var Config = name; name = Config.name||ice.CAN, meta.iceberg = Config.iceberg||meta.iceberg, meta.volcano = Config.volcano||meta.volcano
		meta.libs = (Config.libs||chat.libs).concat(Config.list), panels = Config.panels||chat.panel_list, delete(Config.panels)
		libs = [], panels.forEach(function(p) { p && (libs = libs.concat(p.list = p.list||["/panel/"+p.name+nfs._JS, "/panel/"+p.name+nfs._CSS])) }), libs = libs.concat(Config.plugins||chat.plugin_list)
		cb = can||function(can) { can.require([can.frame], function() { can.onengine._init(can, can.Conf(Config), panels, Config._init||meta._init, can._target) }, function(can, key, sub) { can[key] = sub }) }
		can = Config, can._follow = name, can._target = Config.target||meta.target, can._height = Config.height||meta._height, can._width = Config.width||meta._width, _can_name = ""
	}
	can = kit.proto(can||{}, kit.proto({_name: name, _path: _can_name,
		_load: function(name, cbs) { var cache = meta.cache[name]||[]
			for (list.reverse(); list.length > 0; list) { var sub = list.pop(); sub != can && cache.push(sub), sub._path = sub._path||name } meta.cache[name] = cache
			cache.forEach(function(sub) { var name = sub._name
				if (typeof cbs == code.FUNCTION && cbs(can, name, sub)) { return }
				can[name] = can[name]||{}, name == chat.ONIMPORT && (can[name]._last_init = sub._init)
				for (var k in sub) { can[name].hasOwnProperty(k) || sub.hasOwnProperty(k) && (can[name][k] = sub[k]) }
			})
		},
		require: function(libs, cb, cbs) {
			if (!libs || libs.length == 0) {
				if (navigator.userAgent == "nodejs") { return typeof cb == code.FUNCTION && cb(can) }
				return typeof cb == code.FUNCTION && setTimeout(function() { cb(can) }, 30)
			}
			if (libs[0] == undefined) { return can.require(libs.slice(1), cb, cbs) }
			if (libs[0] == "") { libs[0] = can._path.replace(nfs._JS, nfs._CSS) }
			if (libs[0].indexOf(nfs.SRC) == 0 || libs[0].indexOf(nfs.USR) == 0) { libs[0] = nfs.P+libs[0] }
			if (libs[0][0] != nfs.PS && libs[0].indexOf(web.HTTP) != 0) { libs[0] = can._path.slice(0, can._path.lastIndexOf(ice.PS)+1)+libs[0] }
			// var name = (libs[0].indexOf(web.HTTP) == 0 || libs[0].indexOf("?pod=") > -1? libs[0]: libs[0].split(ice.QS)[0]).toLowerCase()
			var name = (libs[0].indexOf(web.HTTP) == 0 || libs[0].indexOf("?pod=") > -1? libs[0]: libs[0]).toLowerCase()
			function next() { can._load(name, cbs), can.require(libs.slice(1), cb, cbs) }
			if (name.indexOf("/lib/") == 0) { name = "/v"+name }
			if (name.indexOf("/panel/") == 0) { name = "/v"+name }
			if (name.indexOf("/plugin/") == 0) { name = "/v"+name }
			if (name.indexOf("/volcanos/") == 0 && meta.volcano) { name = meta.volcano+name }
			if (name.indexOf("/require/") == 0 && meta.iceberg) { name = meta.iceberg+name }
			if (name.indexOf("/p/") == 0 && meta.iceberg) { name = meta.iceberg+name }
			if (name.indexOf("/v/") == 0 && meta.iceberg) { name = meta.iceberg+name }
			meta.cache[name]? next(): meta._load(name, next)
		},
		request: function(event) { event = event||{}, event = event._event||event
			var msg = event._msg||can.misc.Message(event, can); event._msg = msg
			function set(key, value) {
				if (key == "_method") { return msg._method = value }
				if (key == "action" && value.indexOf("<input") == 0) { return }
				if (typeof value == code.FUNCTION) { return msg[key] = value }
				value == "" || msg.Option(key) || msg.Option(key, value)
			}
			can.core.List(arguments, function(item, index) { if (!item || index == 0) { return }
				can.base.isFunc(item.Option)? can.core.List(item.Option(), function(key) {
					key.indexOf("_") == 0 || key.indexOf("user.") == 0 || set(key, item.Option(key))
				}): can.core.Item(can.base.isFunc(item)? item(): item, set)
			})
			return msg
		},
		requests: function(event) { var msg = can.request(event); function set(key, value) { msg.Option(key, value) }
			can.core.List(arguments, function(item, index) { if (!item || index == 0) { return } can.core.Item(item, set) }); return msg
		},
		requestPodCmd: function(event) { return can.request(event, {pod: can.ConfSpace(), index: can.ConfIndex()}) },
		requestAction: function(event, button) { return can.request(event, {action: button, _toast: event.isTrusted? button+lex.SP+ice.PROCESS: ""}) },
		runActionInputs: function(event, cmds, cb) { var msg = can.request(event), meta = can.Conf()
			if (msg.Option(ice.MSG_HANDLE) != ice.TRUE && cmds && cmds[0] == ctx.ACTION && meta.feature[cmds[1]]) { var msg = can.request(event, {action: cmds[1]})
				if (can.base.isFunc(meta.feature[cmds[1]])) { return meta.feature[cmds[1]](can, msg, cmds.slice(2)) }
				return can.user.input(event, can, meta.feature[cmds[1]], function(args) { can.Update(can.request(event, {_handle: ice.TRUE}, can.Option()), cmds.slice(0, 2).concat(args)) })
			} can.runAction(event, cmds[1], cmds.slice(2), cb, true)
		},
		runActionCommand: function(event, index, args, cb) {
			can.request(event)._caller()
			// can.runAction(event, ctx.RUN, [index].concat(args), cb, true)
			can.run(event, [ctx.ACTION, ctx.RUN].concat(index, args||[]), cb, true)
		},
		runAction: function(event, action, args, cb, silent) {
			var msg = can.request(event, {_handle: ice.TRUE})
			// can.request(can.base.isIn(msg._can, can, can._fields? can.sup: can.sub)? can.Option(): {})._caller()
			can.request(event, can.Option())._caller()
			can.run(event, [ctx.ACTION].concat(action, args||[]), cb, silent)
		},
		search: function(event, cmds, cb) {
			if (cmds && typeof cmds == code.OBJECT && cmds.length > 0 && typeof cmds[0] == code.OBJECT && cmds[0].length > 0 ) { cmds[0] = cmds[0].join(nfs.PT) }
			return (can._root||can).run(event, [chat._SEARCH].concat(cmds), cb, true)
		},
		get: function(name, key, cb) { var value; can.search({}, [can.core.Keys(name, chat.ONEXPORT, key)], cb||function(msg) { value = msg.Result() }); return value },
		set: function(name, key, value) { var msg = can.request(); msg.Option(key, value); return can.search(msg, [[name, chat.ONIMPORT, key]]) },
		setHeaderMenu: function(list, cb) { can._menu && can.page.Remove(can, can._menu)
			return can._menu = can.search(can.request({}, {trans: can.onaction._trans}), [[chat.HEADER, chat.ONIMPORT, html.MENU], can._name].concat(list), cb)
		},
		setFooterMenu: function(list, cb) { can._footer_menu && can.page.Remove(can, can._footer_menu)
			return can._footer_menu = can.search(can.request({}, {trans: can.onaction._trans}), [[chat.FOOTER, chat.ONIMPORT, html.MENU], can._name].concat(list), cb)
		},
		getHeaderTheme: function(cb) { return can.get(chat.HEADER, chat.THEME, cb) },
		getHeaderLanguage: function(cb) { return can.get(chat.HEADER, aaa.LANGUAGE, cb) },
		getHeaderHeight: function() { return can._root.Header? can._root.Header._target.offsetHeight: 0},
		getFooterHeight: function() { return can._root.Footer? can._root.Footer._target.offsetHeight: 0},
		getHeader: function(key, cb) { return can.get(chat.HEADER, key, cb) },
		setHeader: function(key, value) { return can.set(chat.HEADER, key, value) },
		setAction: function(key, value) { return can.set(chat.ACTION, key, value) },
		getAction: function(key, cb) { return can.get(chat.ACTION, key, cb) },
		getActionSize: function(cb) { return can.get(chat.ACTION, nfs.SIZE, cb) },
		getRiverWidth: function() { return can._root.River? can._root.River._target.offsetWidth: 0},
		isPanelType: function() { return can.page.ClassList.has(can, can._fields||can._target, chat.PANEL) },
		isPluginType: function() { return can.page.ClassList.has(can, can._fields||can._target, chat.PLUGIN) },
		isStoryType: function() { return can.page.ClassList.has(can, can._fields||can._target, chat.STORY) },
		isOutputStyle: function() { return can.page.ClassList.has(can, can._fields||can._target, chat.OUTPUT) },
		isSimpleMode: function() { return can.Mode() == chat.SIMPLE },
		isFloatMode: function() { return can.Mode() == chat.FLOAT },
		isFullMode: function() { return can.Mode() == chat.FULL },
		isZoneMode: function() { return can.Mode() == "zone" },
		isCmdMode: function() { return can.Mode() == chat.CMD },
		isAutoMode: function() { return can.Mode() == "" },
		Mode: function(value) { return can.Conf(ice.MODE, value) },
		ConfDefault: function(value) { can.core.Item(value, function(k, v) { can.Conf(k) || can.Conf(k, v) }) },
		ConfSpace: function(space) {
			if (space) { can.Conf(web.SPACE, space) }
		return can.Conf("_space")||can.Conf(web.SPACE)||"" },
		ConfIndex: function(index) {
			if (index) { can.Conf(ctx.INDEX, index) }
		return can.Conf("_command")||can.Conf(ctx.INDEX)||can.Conf("_index") },
		ConfHeight: function(value) { return can.Conf(html.HEIGHT, value) },
		ConfWidth: function(value) { return can.Conf(html.WIDTH, value)||can._output.offsetWidth },
		Conf: function(key, value) { var res = can._conf
			for (var i = 0; i < arguments.length; i += 2) {
				if (typeof key == code.OBJECT) { res = can.core.Value(can._conf, arguments[i]), i--; continue }
				res = can.core.Value(can._conf, arguments[i], arguments[i+1])
			} return can.base.isUndefined(res) && key.indexOf(ctx.FEATURE+nfs.PT) == -1? can.Conf(can.core.Keys(ctx.FEATURE, key)): res
		}, _conf: {},
	}, meta)); if (_can_name) { meta.cache[_can_name] = meta.cache[_can_name]||[], meta.cache[_can_name].push(can) } else { list.push(can) }
	setTimeout(function() { can.require(can._follow? libs.concat(meta.libs, meta.frame): libs, cb) }, 1)
	return can
})
try { if (typeof(window) == code.OBJECT) { var meta = Volcanos.meta
	try { var debug = location.search.indexOf("debug=true") > -1
		meta.version = window._version||"", window.parent.outerWidth-window.parent.innerWidth > 100 && (meta.version = "", debug = false)
	} catch (e) {
		meta.version = window._version, window.outerWidth-window.innerWidth > 100 && (meta.version = "", debug = false)
	}
	meta._load = function(url, cb) {
		if (meta.version) { url += (url.indexOf(web.QS) == -1? web.QS: "&")+meta.version.slice(1) }
		if (meta._cache[url]) { return meta._cache[url].push(cb) } else { meta._cache[url] = [cb] }
		function _cb() { meta._cache[url].forEach(function(cb) { cb() }), delete(meta._cache[url]) }
		switch (url.split(web.QS)[0].split(nfs.PT).pop().toLowerCase()) {
			case nfs.CSS: var item = document.createElement(web.LINK); item.href = url, item.rel = "stylesheet", item.onload = _cb, document.head.appendChild(item); break
			default: var item = document.createElement(nfs.SCRIPT); item.src = url, item.onerror = _cb, item.onload = _cb, document.body.appendChild(item)
		}
	}
	meta.target = document.body, meta._height = window.innerHeight, meta._width = window.innerWidth
	meta._init = function(can) { var last = can.page.width() < can.page.height()
		window.onresize = function(event) { can.misc.Event(event, can, function(msg) {
			if (can.user.isMobile && last === can.page.width() < can.page.height()) { return } last = can.page.width() < can.page.height()
			can.onmotion.delayOnce(can, function() { can.onengine.signal(can, chat.ONRESIZE, can.request(event, kit.Dict(html.HEIGHT, window.innerHeight, html.WIDTH, window.innerWidth))) }, 100, can._delay_resize = can._delay_resize||[])
		}) }
		window.onerror = function(message, source, lineno, colno, error) { debug? alert([message].concat(can.misc._stacks(0, error)).join(lex.NL)): can.misc.Error(message, lex.NL+[source, lineno, colno].join(ice.DF), error) }
		window.onmousemove = function(event) { window._mousemove && (window._mousemove.onmousemove(event)) }
		window.onmouseup = function(event) { window._mousemove && (window._mousemove.onmouseup(event)) }
		window.onbeforeunload = function() { can.onengine.signal(can, chat.ONUNLOAD) }
	}
} else { // nodejs
	global.document = {}, global.location = {}, global.window = {}, global.navigator = {userAgent: "nodejs"}
	global.kit = kit, global.ice = ice
	global.ctx = ctx, global.mdb = mdb, global.web = web, global.aaa = aaa
	global.lex = lex, global.yac = yac, global.ssh = ssh, global.gdb = gdb
	global.tcp = tcp, global.nfs = nfs, global.cli = cli, global.log = log
	global.code = code, global.wiki = wiki, global.chat = chat, global.team = team, global.mall = mall
	global.http = http, global.html = html, global.icon = icon, global.svg = svg
	global.shy = shy, global.Volcanos = Volcanos
} } catch (e) { console.log(e) }
