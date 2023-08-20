Volcanos(chat.ONENGINE, {_init: function(can, meta, list, cb, target) { can.require([can.volcano], null, function(can, key, sub) { can[key] = sub })
		if (!can.user.isMailMaster) { if (can.misc.Search(can, ice.MSG_SESSID)) { can.misc.CookieSessid(can, can.misc.Search(can, ice.MSG_SESSID)); return can.misc.Search(can, ice.MSG_SESSID, "") } }
		can.run = function(event, cmds, cb) { var msg = can.request(event); cmds = cmds||[]; return (can.onengine[cmds[0]]||can.onengine._remote)(event, can, msg, can, cmds, cb) }
		can.user.title(can.misc.SearchOrConf(can, chat.TITLE)||can.misc.Search(can, ice.POD)||location.host)
		can.core.Next(list, function(item, next) { item.type = chat.PANEL
			can.onappend._init(can, item, item.list, function(sub) { can[item.name] = sub
				sub.run = function(event, cmds, cb) { var msg = sub.request(event); cmds = cmds||[]; return (can.onengine[cmds[0]]||can.onengine._remote)(event, can, msg, sub, cmds, cb) }
				can.core.Item(sub.onplugin, function(key, cmd) { sub.onplugin.hasOwnProperty(key) && can.base.isFunc(cmd) && can.onengine.plugin(sub, can.core.Keys(ice.CAN, key), cmd) })
				can.core.ItemCB(sub.onaction, function(key, cb) { can.onengine.listen(can, key, function(msg) { can.core.CallFunc(cb, {event: msg._event, can: sub, msg: msg}) }) })
				can.core.CallFunc([sub.onaction, chat._INIT], {can: sub, cb: next, target: sub._target}), delete(sub._history), delete(sub._conf.feature)
			}, target)
		}, function() { can.onlayout._init(can, target), can.onmotion._init(can, target), can.onkeymap._init(can, target)
			can.onengine.signal(can, chat.ONMAIN, can.request()), can.base.isFunc(cb) && cb(can)
		}), can._path = location.href
	},
	_search: function(event, can, msg, panel, cmds, cb) {
		var sub, mod = can, fun = can, key = ""; can.core.List(cmds[1].split(nfs.PT), function(value) { fun && (sub = mod, mod = fun, fun = mod[value], key = value) })
		if (!sub || !mod || !fun) { can.misc.Warn(ice.ErrNotFound, cmds); return can.base.isFunc(cb) && cb(msg.Echo(ice.ErrWarn, ice.ErrNotFound, cmds)) }
		return can.core.CallFunc(fun, {event: event, can: sub, msg: msg, cmds: cmds.slice(2), cb: cb, target: sub._target, button: key, cmd: key, arg: cmds.slice(2), list: cmds.slice(2)}, mod)
	},
	_remote: function(event, can, msg, panel, cmds, cb) {
		if (panel.onengine._plugin(event, can, msg, panel, cmds, cb)) { return }
		if (panel.onengine._engine(event, can, msg, panel, cmds, cb)) { return }
		if (panel.onengine._static(event, can, msg, panel, cmds, cb)) { return }
		var toast, _toast = msg.Option(chat._TOAST); if (_toast) { can.onmotion.delay(can, function() { if (msg._can && msg._can._toast) { return } toast = toast||can.user.toastProcess(msg._can, _toast) }, 500) }
		msg.OptionDefault(ice.MSG_THEME, can.getHeader(chat.THEME), ice.MSG_LANGUAGE, can.user.info.language, ice.MSG_HEIGHT, panel.Conf(html.HEIGHT)||panel._target.offsetHeight+"", ice.MSG_WIDTH, panel.Conf(html.WIDTH)||panel.offsetWidth+"")
		msg.Option(ice.MSG_HEIGHT, msg.Option(ice.MSG_HEIGHT)+""), msg.Option(ice.MSG_WIDTH, msg.Option(ice.MSG_WIDTH)+"")
		if (can.base.isUndefined(msg[ice.MSG_DAEMON])) { var sub = msg._can; can.base.isUndefined(sub._daemon) && can.ondaemon._list[0] && (sub._daemon = can.ondaemon._list.push(sub)-1)
			if (sub._daemon) { msg.Option(ice.MSG_DAEMON, can.core.Keys(can.ondaemon._list[0], sub._daemon)) }
		} if (!can.misc.CookieSessid(can) && can.user.info.sessid) { msg.Option(ice.MSG_SESSID, can.user.info.sessid) }
		can.onengine.signal(panel, chat.ONREMOTE, can.request({}, {_follow: panel._follow, _msg: msg, _cmds: cmds}))
		var names = msg.Option(chat._NAMES)||panel._names||((can.Conf("iceberg")||Volcanos.meta.iceberg)+panel._name)
		can.misc.Run(event, can, {names: names, daemon: msg[ice.MSG_DAEMON]}, cmds, function(msg) { toast && toast.close(), toast = true
			can.base.isFunc(cb) && cb(msg), Volcanos.meta.pack[can.core.Keys(panel._name, cmds.join(mdb.FS))] = msg
		})
	},
	_static: function(event, can, msg, panel, cmds, cb) { if (!can.user.isLocalFile) { return false }
		var res = Volcanos.meta.pack[can.core.Keys(panel._name, cmds.join(mdb.FS))], msg = can.request(event); msg.Clear(ice.MSG_APPEND)
		return res? msg.Copy(res): can.user.toastFailure(can, "miss data"), can.base.isFunc(cb) && cb(msg), true
	},
	_engine: function(event, can, msg, panel, cmds, cb) { return false },
	_plugin: function(event, can, msg, panel, cmds, cb) {
		if (cmds[0] == ctx.ACTION && cmds[1] == ice.RUN) { var p = can.onengine.plugin(can, cmds[2])
			if (p) { return can.core.CallFunc(p, {can: p.can||panel, sub: msg._can, msg: msg, arg: cmds.slice(3), cmds: cmds.slice(3), cb: cb}), true }
		}
		var p = can.onengine.plugin(can, cmds[0]), n = 1; if (!p) { return false }
		var func = p, _can = p.can||panel, _sup = _can
		if (p.meta && p.meta[cmds[2]] && cmds[1] == ctx.ACTION) { n = 3, func = p.meta[cmds[2]], _can = msg._can } else if (p.meta && p.meta[cmds[1]]) { n = 2, func = p.meta[cmds[2]], _can = msg._can }
		if (cmds[n] == ctx.ACTION && cmds[n+1] == mdb.INPUTS) { return true }
		return can.core.CallFunc(func, {sup: _sup, can: _can, sub: msg._can, msg: msg, arg: cmds.slice(n), cmds: cmds.slice(n), cb: cb}), true
	},
	plugin: shy(function(can, name, command) { var _name = can.base.trimPrefix(name, "can.")
		if (can.base.isUndefined(name) || !can.base.isString(name) || name == _name) { return }
		if (can.base.isUndefined(command)) { return arguments.callee.meta[_name] }
		var button = false, type = html.TEXT; command.list = can.core.List(command.list, function(item) {
			return can.base.isString(item) && (item = can.core.SplitInput(item, can.base.isFunc(command.meta[item])? html.BUTTON: type)), item.type != html.SELECT && (type = item.type), button = button || item.type == html.BUTTON, item
		}); if (!button) { command.list.push(can.core.SplitInput(ice.LIST, html.BUTTON)) } command.can = can, command.meta.name = name, arguments.callee.meta[_name] = command
	}),
	listen: shy(function(can, name, cb, target) {
		arguments.callee.meta[name] = (arguments.callee.meta[name]||[]).concat(cb)
		if (target) { target[name] = function(event) { can.onengine.signal(can, name, can.request(event)) } }
	}),
	signal: function(can, name, msg) { msg = msg||can.request(); var _msg = name == chat.ONREMOTE? msg.Option("_msg"): msg
		_msg.Option(ice.LOG_DISABLE) == ice.TRUE || can.misc.Log(name, can._name, (msg._cmds||[]).join(lex.SP), name == chat.ONMAIN? can: _msg)
		return can.core.List(can.onengine.listen.meta[name], function(cb) { can.core.CallFunc(cb, {event: msg._event, msg: msg}) }).length, msg
	},
})
Volcanos(chat.ONDAEMON, {_init: function(can, name) { if (can.user.isLocalFile) { return }
		can.misc.WSS(can, {type: html.CHROME, name: can.misc.Search(can, cli.DAEMON)||name||"", text: location.pathname, module: "shylinux.com/x/volcanos", version: can.base.trimPrefix(window._version, "?_v=")}, function(event, msg, cmd, arg, cb) {
			var sub = can.ondaemon._list[msg.Option(ice.MSG_TARGET)]||can; can.base.isFunc(sub.ondaemon[cmd])?
				can.core.CallFunc(sub.ondaemon[cmd], {can: can, msg: msg, sub: sub, cmd: cmd, arg: arg, cb: cb}):
					can.onengine._search({}, can, msg, can, [chat._SEARCH, cmd].concat(arg), cb)
		})
	}, _list: [""], pwd: function(can, arg) { can._wss_name = can.ondaemon._list[0] = arg[0] },
	close: function(can, msg, sub) { can.user.close() }, exit: function(can, msg, sub) { can.user.close() },
	toast: function(can, sub, arg) { can.core.CallFunc(can.user.toast, [sub].concat(arg)) },
	grow: function(can, msg, sub, arg) {
		if (sub._fields && sub.sup && sub.sup.onimport._grow) { return sub.sup.onimport._grow(sub.sup, msg, arg.join("")) }
		if (!sub._fields && sub && sub.onimport._grow) { return sub.onimport._grow(sub, msg, arg.join("")) }
	},
	refresh: function(can, sub) { can.base.isFunc(sub.Update) && sub.Update() },
	action: function(can, msg, sub, arg) {
		if (arg[0] == "ctrl") { var list = []; can.misc.Log("what ", document.activeElement)
			can.page.Select(can, can._root._target, html.INPUT, function(target, index) { list[index] = target
				if (document.activeElement == document.body) { return target.focus() }
				switch (arg[1]) {
					case "next": if (list[index-1] == document.activeElement) { target.focus() } break
					case "prev": if (target == document.activeElement) { list[index-1].focus() } break
					case "ok": if (target == document.activeElement) { target.focus() } break
				}
			})
			return
		}
		if (arg[0].indexOf(nfs.PT) == -1 && can.page.SelectInput(can, sub._option, arg[0], function(target) { target.type == html.BUTTON? target.click(): (target.value = arg[1]||"", target.focus()); return target })) { return }
		var _sub = sub.sub; if (_sub && _sub.onaction && _sub.onaction[arg[0]]) { return _sub.onaction[arg[0]]({}, _sub, arg[0]) }
		if (sub && sub.onaction && sub.onaction[arg[0]]) { return sub.onaction[arg[0]]({}, sub, arg[0], _sub) }
		can.core.CallFunc(can.core.Value(can, arg[0]), kit.Dict({can: can}, arg.slice(1)))
	},
	input: function(can, msg, sub, arg) { can.page.Select(can, sub._target, "input:focus", function(target) { target.value += arg[0] }) },
})
Volcanos(chat.ONAPPEND, {_init: function(can, meta, list, cb, target, field) {
		meta.index && (meta.name = meta.index), meta.name = can.core.Split(meta.name||"", "\t .\n").pop()||can.Conf(mdb.NAME)
		field = field||can.onappend.field(can, meta.type, meta, target)._target
		var legend = can.page.SelectOne(can, field, html.LEGEND)
		var option = can.page.SelectOne(can, field, html.FORM_OPTION)
		var action = can.page.SelectOne(can, field, html.DIV_ACTION)
		var output = can.page.SelectOne(can, field, html.DIV_OUTPUT)
		var status = can.page.SelectOne(can, field, html.DIV_STATUS)
		legend.innerHTML = legend.innerHTML || meta.index
		can.base.isIn(meta.index, web.WIKI_PORTAL) && can.onappend.style(can, html.OUTPUT, field)
		var sub = Volcanos(meta.name, {_root: can._root||can, _follow: can.core.Keys(can._follow, meta.name), _target: field,
			_legend: legend, _option: option, _action: action, _output: output, _status: status, _history: [],
			Status: function(key, value) { if (can.base.isObject(key)) { return can.core.Item(key, sub.Status), key } try {
				can.page.Select(can, status, [[[html.SPAN, key]]], function(target) {
					if (can.base.beginWith(value, nfs.PS, ice.HTTP)) { value = can.page.Format(html.A, value) }
					return can.base.isUndefined(value)? (value = target.innerHTML): (target.innerHTML = value.trim? value.trim(): value+"")
				}); return value
			} catch {} },
			Action: function(key, value) { return can.page.SelectArgs(can, action, key, value)[0] },
			Option: function(key, value) { return can.page.SelectArgs(can, option, key, value)[0] },
			Update: function(event, cmds, cb, silent) { sub.request(event)._caller(), sub.onappend._output0(sub, sub.Conf(), event||{}, cmds||sub.Input([], !silent), cb, silent); return true },
			Focus: function() { can.page.SelectOne(can, option, html.INPUT_ARGS, function(target) { target.focus() }) },
			Input: function(cmds, save) { cmds = cmds && cmds.length > 0? cmds: can.page.SelectArgs(sub), cmds = can.base.trim(cmds)
				return !save || cmds[0] == ctx.ACTION || can.base.Eq(sub._history[sub._history.length-1], cmds) || sub._history.push(cmds), cmds
			},
			Clone: function() { meta.args = can.page.SelectArgs(can), can.onappend._init(can, meta, list, function(sub) { can.base.isFunc(cb) && cb(sub, true), can.onmotion.delay(can, sub.Focus) }, target) },
		}, list, function(sub) { meta.feature = can.base.Obj(meta.feature, {}), sub.Conf(meta), field._can = sub
			can.onappend.style(sub, meta.index? meta.index.split(nfs.PT): meta.name), can.onappend.style(sub, sub.Conf(ctx.STYLE)), can.onappend.style(sub, sub.Mode())
			sub.isCmdMode() && can.onappend.style(sub, can.misc.Search(can, ctx.STYLE)), sub.isCmdMode() && sub.Conf(can.misc.Search(can))
			sub._trans = can.base.Copy(sub._trans||{}, can.core.Value(sub, [chat.ONACTION, chat._TRANS]))
			can.core.Item(meta.feature, function(key, cb) { cb.help && sub.user.trans(sub, kit.Dict(key, cb.help)) })
			meta.msg && can.onmotion.delay(can, function() { var msg = sub.request(); msg.Copy(can.base.Obj(meta.msg))
				sub.onappend._output(sub, msg, meta.display||msg.Option(ice.MSG_DISPLAY)||meta.feature.display)
			}), meta.inputs && sub.onappend._option(sub, meta, sub._option, meta.msg)
			sub._legend && (sub._legend.onclick = function(event) {
				can.user.carte(event, sub, sub.onaction, sub.onaction.list.concat([[ctx.ACTION].concat(can.core.Item(meta.feature._trans))]), function(event, button) { can.misc.Event(event, sub, function(msg) {
					msg.RunAction(event, sub.sub, [ctx.ACTION, button]) || msg.RunAction(event, sub, [ctx.ACTION, button]) || sub.runAction(event, button, [], function(msg) { can.onappend._output(sub, msg) })
				}) })
			}), can.base.isFunc(cb) && cb(sub)
			if (sub.isOutputStyle()) { return } if (can.user.isMobile && !can.user.isLandscape()) { return }
			sub.isCmdMode() && !can.base.isIn(meta.index, web.CODE_VIMER, web.CODE_INNER, web.CHAT_MACOS_DESKTOP) && can.page.insertBefore(can, can.user.header(can), sub._output, sub._fields)
		}); return sub
	},
	_option: function(can, meta, option, skip) { var index = -1, args = can.base.Obj(meta.args||meta.arg, []), opts = can.base.Obj(meta.opts, {})
		can.core.List([""].concat(meta.inputs), function(item) { if (item != "" && item.type != html.BUTTON) { return } 
			var icon = {
				"": {name: mdb.DELETE, cb: function(event) { can.onaction.close(event, can) }},
				run: {name: web.PLAY, cb: function(event) { can.Update(event) }},
				list: {name: web.REFRESH, cb: function(event) { can.Update(event) }},
				back: {name: "goback", cb: function(event) { can.onimport._back(can) }},
				refresh: {name: web.REFRESH, cb: function(event) { can.Update(event) }},
				prev: {name: mdb.PREV, cb: function(event) { var sub = can.sub; sub.onaction && sub.onaction.prev? sub.onaction.prev(event, sub): can.onaction.prev(event, can) }},
				next: {name: mdb.NEXT, cb: function(event) { var sub = can.sub; sub.onaction && sub.onaction.next? sub.onaction.next(event, sub): can.onaction.next(event, can) }},
				play: {name: web.PLAY},
			}[item.name||""]; if (!icon) { return } item.style = "icons"
			can.page.Append(can, option, [{view: [[html.ITEM, html.ICON, icon.name, item.name], html.DIV, can.page.unicode[icon.name]], title: item.name, onclick: icon.cb||function(event) {
				var msg = can.request(event), cmds = [ctx.ACTION, item.name]; msg.RunAction(event, can.sub, cmds) || msg.RunAction(event, can, cmds) || can.Update(event, cmds)
			}}])
		})
		can.core.List(args.slice(can.core.List(meta.inputs, function(item) { if (can.base.isIn(item.type, html.TEXTAREA, html.TEXT, html.SELECT)) { return item } }).length), function(item, index) { meta.inputs.push({type: mdb.TEXT, name: "args"+index, value: item}) })
		function add(item, next) { item = can.base.isString(item)? {type: html.TEXT, name: item}: item, item.type != html.BUTTON && index++
			return Volcanos(item.name, {_root: can._root, _follow: can.core.Keys(can._follow, item.name),
				_target: can.onappend.input(can, item, args[index]||opts[item.name], option||can._option), _option: option||can._option, _action: can._action, _output: can._output, _status: can._status,
				CloneField: can.Clone, CloneInput: function() { can.onmotion.focus(can, add(item)._target) }, Input: can.Input, Option: can.Option, Action: can.Action, Status: can.Status,
			}, [item.display, chat.PLUGIN_INPUT_JS], function(sub) { sub.Conf(item)
				if (item.type == html.TEXT) { can.page.Append(can, sub._target.parentNode, [{text: [sub._target.value, html.SPAN, mdb.VALUE]}]) }
				if (item.type == html.BUTTON && can.base.isIn(item.name, mdb.CREATE, mdb.INSERT, mdb.PRUNES, mdb.PRUNE)) { can.onappend.style(can, "icons", sub._target.parentNode)
					can.page.Append(can, sub._target.parentNode, [{icon: item.name, onclick: function(event) { can.Update(event, [ctx.ACTION, item.name]) }}])
				}
				sub.run = function(event, cmds, cb, silent) { var msg = can.requestAction(event, item.name)._caller()
					msg.RunAction(event, sub, cmds) || msg.RunAction(event, can.sub, cmds) || can.Update(event, can.Input(cmds, !silent), cb, silent)
				}, can._inputs = can._inputs||{}, can._inputs[item.name] = sub, sub.sup = can
				can.core.ItemCB(sub.onaction, function(key, cb) { sub._target[key] = function(event) { can.misc.Event(event, can, function(msg) { cb(event, sub, sub._target) })} })
				can.core.ItemCB(item, function(key, cb) { sub._target[key] = function(event) { can.misc.Event(event, can, function(msg) { cb(event, sub, sub._target) })} })
				item.action && can.onappend.figure(sub, item, sub._target, function(_sub, value) { can.Update() }); if (skip === true) { return }
				item.type == html.BUTTON && item.action == ice.AUTO && can.base.isUndefined(can._delay_init) && (auto = sub._target), next()
				can.Conf(ice.AUTO) == item.name && (auto = sub._target)
			})
		}; var auto; can.core.Next(can.core.Value(can, [chat.ONIMPORT, mdb.LIST])||meta.inputs, add, function() { skip || can.Conf(ice.AUTO) == "delay" || auto && auto.click() })
	},
	_action: function(can, list, action, meta) { meta = meta||can.onaction||{}, action = action||can._action, can.onmotion.clear(can, action)
		function run(event, button) { can.misc.Event(event, can, function(msg) { var _can = can._fields? can.sup: can; can.requestAction(event, button)
			var cb = meta[button]||meta[chat._ENGINE]; cb? can.core.CallFunc(cb, {event: event, can: can, button: button}): can.run(event, button == mdb.LIST? []: [ctx.ACTION, button].concat(_can.Input()))
		}) }
		return can.core.List(can.page.inputs(can, can.base.getValid(can.base.Obj(list), can.core.Value(can, [chat.ONACTION, mdb.LIST]), meta != can.onaction? can.core.Item(meta): [])||[]), function(item) {
			can.base.isUndefined(item) || can.onappend.input(can, item == ""? /* 1.空白 */ {type: html.BR}:
				can.base.isString(item)? /* 2.按键 */ {type: html.BUTTON, name: item, value: can.user.trans(can, item, meta._trans), onclick: function(event) {
					run(event, item)
				}}: item.length > 0? /* 3.列表 */ {type: html.SELECT, name: item[0], values: item.slice(1), onchange: function(event) { can.misc.Event(event, can, function(msg) {
					var button = event.target.value; meta[item[0]]? can.core.CallFunc(meta[item[0]], [event, can, item[0], button]): meta[button] && can.core.CallFunc(meta[button], [event, can, button])
				}) }}: /* 4.其它 */(item.type == html.BUTTON && (item.value = item.value||can.user.trans(can, item.name, meta._trans), item.onclick = item.onclick||function(event) {
					run(event, item.name)
				}, item._init = item._init||function(target) { item.action && can.onappend.figure(sub, item, target, function(_sub, value) { can.Update() })
					if (can.base.isIn(item.name, mdb.CREATE, mdb.INSERT)) { can.onappend.style(can, "icons", target.parentNode)
						can.page.Append(can, target.parentNode, [{icon: item.name, onclick: function(event) { can.Update(event, [ctx.ACTION, item.name]) }}])
					}
				}), item), "", action)
		}), meta
	},
	_output0: function(can, meta, event, cmds, cb, silent) { var msg = can.request(event); meta.feature = meta.feature||{}
		if (msg.Option(ice.MSG_HANDLE) != ice.TRUE && cmds && cmds[0] == ctx.ACTION) { if (msg.RunAction(event, can.sub, cmds)) { return } }
		if (msg.RunAction(event, can, cmds)) { return }
		if (msg.Option(ice.MSG_HANDLE) != ice.TRUE && cmds && cmds[0] == ctx.ACTION && meta.feature[cmds[1]]) { var msg = can.request(event, {action: cmds[1]})
			var action = meta.feature[cmds[1]]; if (can.base.isFunc(action)) { cb = cb||function() { can.Update() }
				return action.list && action.list.length > 0? can.user.input(event, can, action.list, function(data) {
					can.core.CallFunc(action, {can: can, msg: can.request(event, data), arg: cmds.slice(2), cb: cb})
				}): can.core.CallFunc(action, {sup: meta.can, can: can, msg: can.request(event), arg: cmds.slice(2), cb: cb})
			} return can.user.input(event, can, meta.feature[cmds[1]], function(args) { can.Update(can.request(event, {_handle: ice.TRUE}, msg, can.Option()), cmds.slice(0, 2).concat(args), cb) })
		}
		return can.onengine._plugin(event, can, msg, can, cmds, cb) || can.run(event, cmds, function(msg) { if (can.base.isFunc(cb)) { return cb(msg) } if (silent) { return }
			var _can = can._fields? can.sup: can; if (_can == (msg._can._fields? msg._can.sup: msg._can)) { if (can.core.CallFunc([_can, chat.ONIMPORT, ice.MSG_PROCESS], {can: _can, msg: msg})) { return } }
			if (cmds && cmds[0] == ctx.ACTION) { if (can.base.isIn(cmds[1], mdb.CREATE, mdb.INSERT, mdb.PRUNES, mdb.EXPORT, mdb.IMPORT, "exports", "imports", nfs.TRASH) || msg.Length() == 0 && !msg.Result()) { return can.user.toastSuccess(can, cmds[1]), can.Update() } }
			can.onappend._output(can, msg, meta.display||msg.Option(ice.MSG_DISPLAY)||meta.feature.display)
		})
	},
	_output: function(can, msg, display, output, action, cb) { display = display||chat.PLUGIN_TABLE_JS, output = output||can._output
		can.misc.Search(can, log.DEBUG) == ice.TRUE && can.base.beginWith(display, "/require/src/") && delete(Volcanos.meta.cache[display])
		Volcanos(display, {_root: can._root, _follow: can.core.Keys(can._follow, display), _fields: can._target, _target: output, _path: display||chat.PLUGIN_TABLE_JS,
			_legend: can._legend, _option: can._option, _action: can._action, _output: output, _status: can._status,
			Update: can.Update, Option: can.Option, Action: can.Action, Status: can.Status, db: {}, ui: {},
		}, [display, chat.PLUGIN_TABLE_JS], function(sub) { sub.Conf(can.Conf())
			var last = can.sub; last && can.core.CallFunc([last, "onaction.hidden"], {can: last})
			sub.run = function(event, cmds, cb, silent) { var msg = sub.request(event)._caller()
				msg.RunAction(event, sub, cmds) || can.Update(event, can.Input(cmds, !silent), cb, silent)
			}, can._outputs = can._outputs||[], can._outputs.push(sub), sub.sup = can, can.sub = sub
			sub._index = can._index, can._msg = sub._msg = msg, sub.Conf(sub._args = can.base.ParseURL(display))
			sub._trans = can.base.Copy(can.base.Copy(sub._trans||{}, can._trans), can.core.Value(sub, [chat.ONACTION, chat._TRANS]))
			if (sub.onimport && can.base.isArray(sub.onimport.list) && sub.onimport.list.length > 0) {
				can.onmotion.clear(can, can._option), can.onappend._option(can, {inputs: can.page.inputs(can, sub.onimport.list, html.TEXT) })
			}
			can.core.CallFunc([sub, chat.ONIMPORT, chat._INIT], {can: sub, msg: msg, cb: function(msg) {
				action === false || can.onmotion.clear(can, can._action), sub.onappend._action(sub, can.Conf(ice.MSG_ACTION)||msg.Option(ice.MSG_ACTION), action||can._action)
				action === false || sub.onappend._status(sub, sub.onexport&&sub.onexport.list||msg.Option(ice.MSG_STATUS)), can.user.isMobile || sub.onappend.tools(sub, msg)
				can.onappend.style(sub, sub.Conf(ctx.STYLE)), can.onmotion.story.auto(can, can._output)
				if (can.onimport.size) { if (can.isFullMode() || can.isCmdMode()) { can.ConfHeight(can.page.height()), can.ConfWidth(can.page.width()) }
					can.onimport.size(can, can.ConfHeight(), can.ConfWidth(), can.Conf("_auto"), can.Mode()), can.onexport.output(sub, msg)
				} can.base.isFunc(cb) && cb(msg)
			}, target: output})
		})
	},
	_status: function(can, list, status) { status = status||can._status, can.onmotion.clear(can, status)
		can.core.List(can.base.Obj(list, can.core.Value(can, [chat.ONEXPORT, mdb.LIST])), function(item) { item = can.base.isString(item)? {name: item}: item
			if (can.base.beginWith(item.value, nfs.PS, ice.HTTP)) { item.value = can.page.Format(html.A, item.value, item.value.split("?")[0]) }
			can.page.Append(can, status, [{view: html.ITEM, list: [
				{text: [item.name, html.LABEL]}, {text: [": ", html.LABEL]}, {text: [(item.value == undefined? "": item.value.trim())+"", html.SPAN, item.name]},
			], onclick: function(event) { can.user.copy(event, can, item.value) }}])
		})
	},

	field: function(can, type, item, target) { type = type||html.STORY, item = item||{}
		var name = can.core.Split(item.nick||item.name||"").pop()||""; name = can.core.Keys(item.space, name)
		var title = item.help && item.help != name && !can.user.isEnglish(can)? name+"("+can.core.Split(item.help)[0]+")": name
		return can.page.Append(can, target||can._output, [{view: [type, html.FIELDSET], list: [{type: html.LEGEND, list: [{icon: item.icon}, {text: title}]}, {view: [html.OPTION, html.FORM]}, html.ACTION, html.OUTPUT, html.STATUS]}])
	},
	input: function(can, item, value, target, style) { if ([html.BR, html.HR].indexOf(item.type) > -1) { return can.page.Append(can, target, [item]) }
		var icon = [], _item = can.base.Copy({className: "", type: "", name: ""}, item), input = can.page.input(can, _item, value)
		if (item.type == html.BUTTON && !input.value) { input.value = can.user.trans(can, item.name) }
		if (item.type == html.TEXT) { input.onfocus = input.onfocus||function(event) { can.onmotion.selectRange(event.target) }
			input.onkeydown = item.onkeydown||function(event) { if (event.key == code.ENTER) { return can.Update(), can.onkeymap.prevent(event) }
				can.onkeymap.input(event, can), can.onkeymap.selectOutput(event, can)
			}
			input.onkeyup = item.onkeyup||function(event) { if (item.name == html.FILTER) { can.user.toast(can, "filter out "+can.page.Select(can, can._output, html.TR, function(tr, index) {
				if (!can.page.ClassList.set(can, tr, html.HIDE, index > 0 && tr.innerText.indexOf(event.target.value) == -1)) { return tr }
			}).length+" lines") } }, icon.push({icon: mdb.DELETE, onclick: function(event) { _input.value = "", input.onkeyup({target: event.target.previousSibling}) }})
		} if (item.range) { input._init = function(target) { can.onappend.figure(can, item, target, function(sub, value, old) { target.value = value, can.core.CallFunc([can.onaction, item.name], [event, can, item.name]) }) } }
		var _input = can.page.Append(can, target, [{view: [[html.ITEM].concat(style, [item.type, item.name])], list: [item.icon && {icon: item.icon}, input].concat(icon), _init: function(target, _input) {
			if (item.type == html.SELECT) { _input.select.value =  value||_item.value||_item.values[0], can.onappend.select(can, _input.select, _item) }
			item.style && can.onappend.style(can, item.style, target)
		}}])[item.name]; return _input
	},
	select: function(can, select, item) {
		return can.page.Append(can, select.parentNode, [{type: html.INPUT, data: {className: html.SELECT, type: html.BUTTON, name: item.name, value: can.user.trans(can, item.value||item.values[0]), title: item.name}, onclick: function(event) { var target = event.target
			var carte = can.user.carte(event, can, {}, item.values, function(event, button) { carte.close(); if (target.value == button) { return }
				target.value = button, select.value = button, select.onchange && select.onchange({target: select})
			}); can.onappend.style(can, [html.SELECT, item.name], carte._target), can.page.style(can, carte._target, html.MIN_WIDTH, event.target.offsetWidth)
		}, _init: function(target) { can.page.style(can, target, html.WIDTH, (select.offsetWidth||80)+10), can.onappend.style(can, html.HIDE, select) }}, {icon: mdb.SELECT}])
	},
	table: function(can, msg, cb, target, keys) { if (!msg || msg.Length() == 0) { return } var meta = can.base.Obj(msg.Option(mdb.META))
		for (var i = 0; i < msg.append.length-1; i++) { if (msg.append[i] == ctx.ACTION) { msg.append[i] = msg.append[msg.append.length-1], msg.append[msg.append.length-1] = ctx.ACTION } }
		var table = can.page.AppendTable(can, msg, target||can._output, msg.append, cb||function(value, key, index, data, list) {
			if (msg.append.length == 2 && msg.append[0] == mdb.KEY && msg.append[1] == mdb.VALUE) { if (key == mdb.VALUE) { key = data.key } data = {}, can.core.List(list, function(item) { data[item.key] = item.value }) }
			function run(event, cmd, arg) { can.misc.Event(event, can, function(msg) { can.run(can.request(event, data, can.Option()), [ctx.ACTION, cmd].concat(arg)) }) }
			return {text: [value, html.TD], onclick: function(event) { var target = event.target
				if (can.page.tagis(target, html.INPUT) && target.type == html.BUTTON) { can.requestAction(event, target.name)
					meta && meta[target.name]? can.user.input(event, can, meta[target.name], function(args) { run(event, target.name, args) }): run(event, target.name)
				} else { can.sup.onimport.change(event, can.sup, key, event.target.innerText) || can.sup.onexport.record(can.sup, value, key, data, event) }
			}, ondblclick: function(event) { if (can.base.isIn(key, mdb.KEY, mdb.HASH, mdb.ID)) { return }
				var item = can.core.List(can.Conf([ctx.FEATURE, mdb.INSERT]), function(item) { if (item.name == key) { return item } })[0]||{name: key, value: value}
				item.run = function(event, cmds, cb) { can.run(can.request(event, data, can.Option()), cmds, cb, true) }
				item._enter = function(event, value) { if (event.ctrlKey) { run(event, mdb.MODIFY, [key, value]) } }
				can.onmotion.modifys(can, event.target, function(event, value, old) { run(event, mdb.MODIFY, [key, value]) }, item)
			}}
		}); table && can.onappend.style(can, chat.CONTENT, table), msg.append && msg.append[msg.append.length-1] == ctx.ACTION && can.onappend.style(can, ctx.ACTION, table)
		;(can.isCmdMode() || table.offsetWidth > can.ConfWidth() / 2) && can.onappend.style(can, "full", table)
		can.page.Select(can, table, html.INPUT_BUTTON, function(target) { target.name == target.value && (target.value = can.user.trans(can, target.value)) })
		return keys && can.page.RangeTable(can, table, can.core.List(keys, function(key) { return can.page.Select(can, table, html.TH, function(th, index) { if (th.innerHTML == key) { return index } })[0] })), table
	},
	board: function(can, text, target) { text && text.Result && (text = text.Result()); if (!text) { return }
		var code = can.page.Append(can, target||can._output, [{text: [can.page.Color(text), html.DIV, html.CODE]}]).code
		if (text.indexOf("<fieldset") == 0) { can.page.Select(can, code, html.FIELDSET, function(target) { var data = target.dataset
			data.index && can.onappend.plugin(can, {index: data.index, args: can.base.Split(data.args)}, function(sub) {
				can.page.Modify(can, sub._legend, data.index.split(nfs.PT).pop())
			}, can._output, target)
		}) } else if (text.indexOf("<iframe") == 0) { can.page.Select(can, code, html.IFRAME, function(target) { var data = target.dataset
			can.page.style(can, target, html.HEIGHT, can.ConfHeight(), html.WIDTH, can.ConfWidth())
		}) }  else if (text.indexOf("<svg") > 0) { can.page.Select(can, code, html.SVG, function(target) {
			can.page.style(can, target, html.MIN_HEIGHT, can.ConfHeight(), html.MIN_WIDTH, can.ConfWidth())
		}) } else { can.page.Select(can, code, html.INPUT_BUTTON, function(target) {
			target.onclick = function(event) { can.misc.Event(event, can, function(msg) { can.run(can.request(event, can.Option()), [ctx.ACTION, target.name]) }) }
		}) } return code.scrollBy && code.scrollBy(0, 10000), code 
	},
	tools: function(can, msg, cb, target) { can.onimport.tool(can, can.base.Obj(msg.Option(ice.MSG_TOOLKIT), []), cb, target) },

	style: function(can, style, target) { target = target||can._fields||can._target
		if (can.base.endWith(style, ".css")) { return can.require([style]) }
		can.base.isObject(style) && !can.base.isArray(style)? can.page.style(can, target, style): can.page.ClassList.add(can, target, style)
	},
	scroll: function(can, target, offset, length) {
		if (offset) { var ui = can.page.Append(can, target, [{view: "scrollbar", style: {height: length*target.offsetHeight*2}}])
			target.addEventListener("scroll", function(event) { can.page.style(can, ui.scrollbar, html.TOP, target.scrollTop+offset*target.offsetHeight, html.RIGHT, -target.scrollLeft) })
			return ui.scrollbar
		}
		var vbegin, vbar = can.page.Append(can, target, [{view: [["scrollbar", html.VERTICAL]],
			onmousedown: function(event) { vbegin = {top: target.scrollTop, y: event.y}, window._mousemove = event.target },
			onmousemove: function(event) { if (!vbegin) { return } target.scrollTop = vbegin.top+(event.y-vbegin.y)/target.offsetHeight*target.scrollHeight, can.onkeymap.prevent(event) },
			onmouseup: function(event) { vbegin = null, delete(window._mousemove) },
		}])._target
		var hbegin, hbar = can.page.Append(can, target, [{view: [["scrollbar", html.HORIZON]],
			onmousedown: function(event) { hbegin = {left: target.scrollLeft, x: event.x}, window._mousemove = event.target },
			onmousemove: function(event) { if (!hbegin) { return } target.scrollLeft = hbegin.left+(event.x-hbegin.x)/target.offsetWidth*target.scrollWidth, can.onkeymap.prevent(event) },
			onmouseup: function(event) { hbegin = null, delete(window._mousemove) },
		}])._target
		target.addEventListener("scroll", function(event) {
			var height = can.base.Min(target.offsetHeight*target.offsetHeight/target.scrollHeight, target.offsetHeight/4)
			target.scrollHeight > target.offsetHeight && can.page.style(can, vbar, html.HEIGHT, height, html.RIGHT, -target.scrollLeft, html.VISIBILITY, html.VISIBLE,
				html.TOP, target.scrollTop+target.scrollTop/(target.scrollHeight-target.offsetHeight)*(target.offsetHeight-height),
			)
			vbar.innerHTML = `${target.scrollTop}+${target.offsetHeight}/${target.scrollHeight}`
			var width = can.base.Min(target.offsetWidth*target.offsetWidth/target.scrollWidth, target.offsetWidth/4)
			target.scrollWidth > target.offsetWidth && can.page.style(can, hbar, html.WIDTH, width, html.BOTTOM, -target.scrollTop, html.VISIBILITY, html.VISIBLE,
				html.LEFT, target.scrollLeft+target.scrollLeft/(target.scrollWidth-target.offsetWidth)*(target.offsetWidth-width),
			)
			hbar.innerHTML = `${target.scrollLeft}+${target.offsetWidth}/${target.scrollWidth}`
			can.onmotion.delayOnce(can, function() {
				can.page.style(can, vbar, html.VISIBILITY, html.HIDDEN), can.page.style(can, hbar, html.VISIBILITY, html.HIDDEN)
			}, 1000, target._delay_scroll = target._delay_scroll||[])
		})
		return vbar
	},
	toggle: function(can, target) {
		var toggle = can.page.Append(can, target, [
			{view: [[html.PROJECT, html.TOGGLE]], onclick: function() { can.onmotion.toggle(can, can.ui.project), can.onimport.layout(can) }},
			{view: [[html.DISPLAY, html.TOGGLE]], onclick: function() { can.onmotion.toggle(can, can.ui.display), can.onimport.layout(can) }},
			{view: [[html.PROFILE, html.TOGGLE]], onclick: function() { can.onmotion.toggle(can, can.ui.profile), can.onimport.layout(can) }},
		])
		toggle.layout = function() { var up = "\u25B2", down = "\u25BC", left = "\u25C0", right = "\u25B6"
			can.page.Modify(can, toggle.project, can.page.isDisplay(can.ui.project)? left: right)
			can.page.Modify(can, toggle.display, can.page.isDisplay(can.ui.display)? down: up)
			can.page.Modify(can, toggle.profile, can.page.isDisplay(can.ui.profile)? right: left)
		}; return toggle
	},
	layout: function(can, list, type, target) { const FLOW = html.FLOW, FLEX = html.FLEX
		var count = 0, ui = {size: {}}; type = type||FLEX, target = target||can._output
		function append(target, type, list) { can.page.ClassList.add(can, target, [html.LAYOUT, type]), can.core.List(list, function(item) {
			if (can.base.isString(item)) {
				ui[item] = can.page.Append(can, target, [item])._target
			} else if (can.base.isArray(item)) {
				append(can.page.Append(can, target, [html.LAYOUT])._target, type==FLOW? FLEX: FLOW, item)
			} else if (can.base.isObject(item)) {
				if (item.index) { item._index = count++, ui.size[item._index] = item.height||item.width
					can.onappend.plugin(can, item, function(sub) { can._plugins = (can._plugins||[]).concat([sub])
						item.layout = function(height, width) { sub.onimport.size(sub, height, width) }
					}, target, ui[item._index] = can.onappend.field(can, item.type, {name: item.index.split(nfs.PT).pop(), help: item.help}, target)._target)
				} else { can.page.Append(can, target, [item]) }
			}
		}); return list } ui.list = append(target, type, list||[html.PROJECT, [[html.CONTENT, html.PROFILE], html.DISPLAY]])
		function calc(item, size, total) { return !ui.size[item]? can.base.isString(size)? parseInt(can.base.trimSuffix(size, "px")): size: ui.size[item] < 1? total*ui.size[item]: ui.size[item] }
		var defer = [], content_height, content_width; function layout(type, list, height, width) { var _width = width, _height = height; can.core.List(list, function(item) {
			if (can.base.isArray(item)) { return } if (can.base.isObject(item)) { var meta = item; item = item._index }
			var target = ui[item]; if (!can.page.isDisplay(target)) { return }
			if (item == html.CONTENT || item == "main") { return defer.push(function() { can.page.style(can, target, html.HEIGHT, content_height = height, html.WIDTH, content_width = width) }) }
			if (type == FLOW) { var h = calc(item, target.offsetHeight, height)
				if (can.base.isObject(meta) && meta.layout) { meta.layout(h, width) }
				can.page.style(can, target, html.WIDTH, width), height -= h
			} else {
				if (item == html.PROJECT) { var w = 230, h = height } else { var w = calc(item, target.offsetWidth||target.style.width||_width/list.length, _width), h = height }
				if (can.base.isObject(meta)) { meta.layout(h, w = _width/list.length) }
				can.page.style(can, target, html.HEIGHT, h, html.WIDTH, w), width -= w
			}
		}), can.core.List(list, function(item) { if (can.base.isArray(item)) { layout(type == FLOW? FLEX: FLOW, item, height, width) } }) }
		if (can.onimport.filter) { ui.filter = can.onimport.filter(can, ui.project) }
		ui.layout = function(height, width, delay, cb) { can.onmotion.delay(can, function() { defer = [], layout(type, ui.list, height, width), defer.forEach(function(cb) { cb() }), cb && cb(content_height, content_width) }, delay||0) }; return ui
	},
	tabview: function(can, meta, list, target) { var ui = can.page.Append(can, target, [html.ACTION, html.OUTPUT])
		can.core.List(can.base.getValid(list, can.core.Item(meta)), function(name, index) {
			ui[name] = can.page.Append(can, ui.action, [{text: name, onclick: function(event) {
				if (can.onmotion.cache(can, function() { return name }, ui.output)) { return } meta[name](ui.output)
			}, _init: function(target) { index == 0 && can.onmotion.delay(can, function() { target.click() }) }}])._target
		}); return ui._target = target, ui
	},

	plugin: function(can, meta, cb, target, field) { meta = meta||{}, meta.index = meta.index||can.core.Keys(meta.ctx, meta.cmd)||ice.CAN_PLUGIN
		var res = {}; function _cb(sub, meta, skip) { kit.proto(res, sub), cb && cb(sub, meta, skip) }
		if (meta.inputs && meta.inputs.length > 0 || meta.meta) { can.onappend._plugin(can, {meta: meta.meta, list: meta.list}, meta, _cb, target, field); return res }
		var value = can.onengine.plugin(can, meta.index); if (value) { can.onappend._plugin(can, value, meta, function(sub, meta, skip) {
			value.meta && value.meta._init && value.meta._init(sub, meta), _cb(sub, meta, skip)
		}, target, field); return res }
		can.runAction(can.request({}, {_method: web.GET, pod: meta.space})._caller(), ctx.COMMAND, [meta.index], function(msg) { msg.Table(function(value) { can.onappend._plugin(can, value, meta, _cb, target, field) })}); return res
	},
	_plugin: function(can, value, meta, cb, target, field) { can.base.Copy(meta, value, true)
		meta.type = meta.type||chat.STORY, meta.name = meta.name||value.meta&&value.meta.name||"", meta.help = meta.help||value.help||"", meta.height = meta.height||can.ConfHeight()-2*html.ACTION_HEIGHT, meta.width = meta.width||can.ConfWidth()
		meta.inputs = can.base.getValid(meta.inputs, can.base.Obj(value.list))||[], meta.feature = can.base.getValid(meta.feature, can.base.Obj(value.meta))||{}
		meta.args = can.base.getValid(can.base.Obj(meta.args), can.base.Obj(meta.arg), can.base.Obj(value.args), can.base.Obj(value.arg))||[]
		can.onappend._init(can, meta, [chat.PLUGIN_STATE_JS], function(sub, skip) {
			sub.run = function(event, cmds, cb) {
				if (can.base.isFunc(value)) {
					can.onengine._plugin(event, can._root, can.request(event), value.can, [meta.index].concat(cmds), cb)
				} else {
					can.runActionCommand(sub.request(event, {pod: meta.space}), sub._index, cmds, cb)
				}
			}, sub._index = value.index||meta.index, can.base.isFunc(cb) && cb(sub, meta, skip)
		}, target||can._output, field)
	},
	_float: function(can, index, args, cb) { can.onappend.plugin(can, {index: index, args: args, mode: chat.FLOAT}, function(sub) {
		sub.onmotion.float(sub), sub.onaction.close = function() { can.page.Remove(can, sub._target) }, cb && cb(sub)
	}, can._root._target) },
	figure: function(can, meta, target, cb) { if (meta.type == html.SELECT || meta.type == html.BUTTON) { return }
		var input = meta.action||mdb.KEY, path = chat.PLUGIN_INPUT+input+nfs._JS; can.require([path], function(can) {
			function _cb(sub, value, old) { if (value == old) { return } target.value = value, can.base.isFunc(cb) && cb(sub, value, old) }
			target.onkeydown = function() { if (event.key == code.ESCAPE && target._can) { return target._can.close(), target.blur() } else if (event.key == code.ENTER) { can.base.isFunc(cb) && cb(event, target.value) } }
			can.core.ItemCB(can.onfigure[input], function(key, on) { var last = target[key]||function() { }; target[key] = function(event) { can.misc.Event(event, can, function(msg) {
				function show(sub, cb) { can.base.isFunc(cb) && cb(sub, _cb), can.onlayout.figure(event, can, sub._target), can.onmotion.toggle(can, sub._target, true) }
				can.core.CallFunc(on, {event: event, can: can, meta: meta, cb: _cb, target: target, sub: target._can, last: last, cbs: function(cb) {
					target._can? show(target._can, cb): can.onappend._init(can, {type: html.INPUT, name: input, style: meta.name, mode: chat.FLOAT}, [path], function(sub) { sub.Conf(meta)
						sub.run = function(event, cmds, cb) { var msg = sub.request(event)
							if (meta.range) { for (var i = meta.range[0]; i < meta.range[1]; i += meta.range[2]||1) { msg.Push(mdb.VALUE, i) } cb(msg); return }
							(meta.run||can.run)(sub.request(event, can.Option()), cmds, cb, true)
						}, target._can = sub, can.base.Copy(sub, can.onfigure[input], true), sub._name = sub._path = path
						sub._target._close = sub.close = function() { can.page.Remove(can, sub._target), delete(target._can) }, sub.hidden = function() { return !can.page.isDisplay(sub._target) }
						meta.mode && can.onappend.style(sub, meta.mode), can.page.style(sub, sub._target, meta.style), can.base.isFunc(meta._init) && meta._init(sub, sub._target), show(sub, cb)
					}, can._root._target)
				}})
			}) } }), can.onfigure[input]._init && can.onfigure[input]._init(can, meta, target, _cb)
		})
	},
})
Volcanos(chat.ONLAYOUT, {_init: function(can, target) { target = target||can._root._target; var height = can.page.height(), width = can.page.width()
		can.page.SelectChild(can, target, can.page.Keys(html.FIELDSET_HEAD, html.FIELDSET_FOOT), function(field) { height -= field.offsetHeight })
		can.page.SelectChild(can, target, html.FIELDSET_LEFT, function(field) { can.user.isMobile || can.page.isDisplay(field) && (width -= field.offsetWidth)
			var h = height; can.page.SelectChild(can, field, html.DIV_ACTION, function(action) { h -= action.offsetHeight })
			can.page.SelectChild(can, field, html.DIV_OUTPUT, function(output) { can.page.styleHeight(can, output, h) })
		})
		can.page.SelectChild(can, target, html.FIELDSET_MAIN, function(field) {
			can.page.SelectChild(can, field, html.DIV_ACTION, function(action) { height -= action.offsetHeight })
			if (can.user.isMobile && can.user.isLandscape()) { return }
			can.page.SelectChild(can, field, html.DIV_OUTPUT, function(output) { can.page.styleHeight(can, output, height) })
		}), can.onengine.signal(can, chat.ONSIZE, can.request({}, {height: height, width: width}))
		can.user.isMobile && can.user.isLandscape() || can.page.style(can, document.body, kit.Dict(html.OVERFLOW, html.HIDDEN))
	},
	expand: function(can, target, width) { var n = parseInt(target.offsetWidth/(width+20)); width = target.offsetWidth/n - 20
		can.page.SelectChild(can, target, "", function(target) { can.page.styleWidth(can, target, width) })
	},
	background: function(can, url, target) { can.page.style(can, target||can._root._target, "background-image", url == "" || url == "void"? "": 'url("'+url+'")') },
	figure: function(event, can, target, right, min) { if (!event || !event.target) { return {} } target = target||can._fields||can._target
		var rect = event.target == document.body? {left: can.page.width()/2, top: can.page.height()/2, right: can.page.width()/2, bottom: can.page.height()/2}: (event.currentTarget||event.target).getBoundingClientRect()
		var layout = right? {left: rect.right, top: rect.top}: {left: rect.left, top: rect.bottom}
		can.getActionSize(function(left, top, width, height) { left = left||0, top = top||0, height = can.base.Max(height, can.page.height()-top)
			if (layout.top+target.offsetHeight > top+height) {
				if (min && top+height-layout.top > min) {
					can.page.style(can, target, html.MAX_HEIGHT, top+height-layout.top)
				} else if (!right && rect.top-top>target.offsetHeight) {
					layout.top = rect.top-target.offsetHeight
				} else {
					if (!right) { right = true, layout.left += (event.currentTarget||event.target).offsetWidth }
					can.page.style(can, target, html.MAX_HEIGHT, height)
					layout.top = top+height-target.offsetHeight
				}
			}
			if (layout.left+target.offsetWidth > left+width) { layout.left = (right? rect.left: left+width)-target.offsetWidth-1 }
		}); return can.onmotion.move(can, target, layout), layout
	},
})
Volcanos(chat.ONMOTION, {_init: function(can, target) {
		target.onclick = function(event) { if (can.page.tagis(event.target, html.SELECT, html.INPUT, html.TEXTAREA)) { return }
			if (can.page.tagis(event.target, html.A) && can.user.isWebview) { return event.shiftKey? window.outopen(event.target.href): can.user.open(event.target.href) }
			can.onmotion.clearCarte(can)
		}
	},
	story: {
		_hash: {
			spark: function(can, meta, target) {
				meta[mdb.NAME] == html.INNER? can.onmotion.copy(can, target): can.page.Select(can, target, "kbd", function(item) { can.onmotion.copy(can, item, function(event) {
					if (event.metaKey) {
						if (item.innerText.indexOf(web.HTTP) == 0) { return can.user.open(item.innerText) }
						if (item.innerText.indexOf("vim ") == 0) {
							can.onappend._float(can, web.CODE_VIMER, can.misc.SplitPath(can, item.innerText.split(" ")[1]))
						} else {
							meta.name == "shell" && can.onappend._float(can, web.CODE_XTERM, ["sh"])
						}
					}
				}) })
			},
		},
		auto: function(can, target) { var that = this; target = target||can._output
			can.page.Select(can, target, wiki.STORY_ITEM, function(item) { var meta = item.dataset; meta.style && can.page.style(can, item, can.base.Obj(meta.style))
				can.core.CallFunc(that._hash[meta.type]||that._hash[target.tagName], [can, meta, item])
			})
			can.page.Select(can, target, html.INPUT_BUTTON, function(target) {
				if (target.value == target.name) { target.value = can.user.trans(can, target.name) }
			})
		},
	},
	scrollHold: function(can, cb, target) { target = target || can._output; var left = target.scrollLeft; cb(), target.scrollLeft = left },
	clearFloat: function(can) {
		var list = ["fieldset.input.float", "div.input.float", "div.carte.float"]; for (var i = 0; i < list.length; i++) {
			if (can.page.Select(can, document.body, list[i], function(target) { return target._close? target._close(): can.page.Remove(can, target) }).length > 0) { return true }
		}
	},
	clearCarte: function(can) { can.page.SelectChild(can, document.body, "div.carte.float", function(target) { can.page.Remove(can, target) }) },
	clearInput: function(can) { can.page.SelectChild(can, document.body, "div.input.float", function(target) { can.page.Remove(can, target) }) },
	hidden: function(can, target, show) { target = target||can._target
		if (!target.tagName && target.length > 0) { return can.core.List(target, function(target) { can.onmotion.hidden(can, target, show) }) }
		return can.page.ClassList.set(can, target, html.HIDE, !show)? target._hide && target._hide(): target._show && target._show(), show
	},
	toggle: function(can, target, show, hide) { target = target||can._target
		if (show === true) { return can.onmotion.hidden(can, target, true) } if (show === false) { return can.onmotion.hidden(can, target, false) }
		var status = can.page.isDisplay(target); if (status? can.base.isFunc(hide) && hide(): can.base.isFunc(show) && show()) { return !status }
		return can.onmotion.hidden(can, target, !status)
	},
	select: function(can, target, name, which, cb) { var old = can.page.SelectOne(can, target, name+".select")
		can.base.isUndefined(which) || can.page.SelectChild(can, target, name, function(target, index) {
			if (can.page.ClassList.set(can, target, html.SELECT, target == which || index == which)) { can.base.isFunc(cb) && cb(target) }
		}); return old
	},
	modify: function(can, target, cb, item) { var back = target.innerHTML, _target = target
		if (back.length > 120 || back.indexOf(lex.NL) > -1) { return can.onmotion.modifys(can, target, cb) }
		var ui = can.page.Appends(can, target, [{type: html.INPUT, value: target.innerText, style: {width: can.base.Max(target.offsetWidth-20, 400)}, onkeydown: function(event) { switch (event.key) {
			case code.ENTER: target.innerHTML = event.target.value, event.target.value == back || cb(event, event.target.value, back); break
			case code.ESCAPE: target.innerHTML = back; break
			default: can.onkeymap.input(event, can)
		} }, _init: function(target) { item && can.onappend.figure(can, item, target, function(event, value) {
			can.base.isFunc(cb) && cb(event, value), _target.innerText = value
		}), can.onmotion.focus(can, target), can.onmotion.delay(can, function() { target.click() }) }}])
	},
	modifys: function(can, target, cb, item) { var back = target.innerHTML
		var ui = can.page.Appends(can, target, [{type: html.TEXTAREA, value: target.innerText, style: {
			height: can.base.Min(target.offsetHeight-20, 60), width: can.base.Max(target.offsetWidth-20, 400),
		}, onkeydown: function(event) { switch (event.key) {
			case code.ENTER: if (event.ctrlKey) { target.innerHTML = event.target.value, event.target.value == back || cb(event, event.target.value, back) } break
			case code.ESCAPE: target.innerHTML = back; break
			default: can.onkeymap.input(event, can)
		} }, _init: function(target) { item && can.onappend.figure(can, item, target), can.onmotion.focus(can, target), can.onmotion.delay(can, function() { target.click() }) }}])
	},
	highlight: function(can, value, target) { can.page.Select(can, target||can._output, [html.TBODY, html.TR], function(tr) {
		can.page.ClassList.set(can, tr, html.HIDDEN, can.page.Select(can, tr, html.TD, function(td) { td._text = td._text||td.innerText
			if (td.innerText.indexOf(value) > -1) {
				return td.innerHTML = td._text.replaceAll(value, "<span style='background-color:yellow;color:red;'>"+value+"</span>")
			} else {
				td.innerText = td._text
			}
		}).length == 0)
	}) },
	tableFilter: function(can, target, value) { can.page.Select(can, target, html.TR, function(tr, index) {
		index > 0 && can.page.ClassList.set(can, tr, html.HIDDEN, can.page.Select(can, tr, html.TD, function(td) { if (td.innerText.toLowerCase().indexOf(value.toLowerCase()) > -1) { return td } }) == 0)
	}) },
	delayResize: function(can, target, key) { can.onmotion.delay(can, function() { can.page.Select(can, target, key, function(_target) {
		can.page.style(can, target, html.WIDTH, _target.offsetWidth+10, html.LEFT, (window.innerWidth-_target.offsetWidth)/2, html.TOP, (window.innerHeight-_target.offsetHeight)/2)
	}) }) },
	delayLong: function(can, cb, interval, key) { can.onmotion.delay(can, cb, interval||300, key) },
	delayOnce: function(can, cb, interval, list) {
		if (!list) { var call = can.misc.fileLine(2), _call = "_delay_"+call.file+call.line; list = can[_call] = can[_call]||{} }
		can.core.Item(list, function(key) { clearTimeout(list[key]._timer), delete(list[key]) })
		var key = can.base.Time(null, "%H:%M:%S.%s"); list[key] = {}, list[key] = can.onmotion.delay(can, function() { list[key] && cb() }, interval)||{}
	},
	delay: function(can, cb, interval, key) {
		if (!key) { if (interval === 0) { return cb() }
			return can.core.Timer(interval||30, cb)
		}
		can._delay_list = can._delay_list||shy({}, [])
		var last = can._delay_list.meta[key]||0, self = can._delay_list.meta[key] = can._delay_list.list.push(cb)
		return can.core.Timer(interval||30, function() { cb(self, last, can._delay_list.meta[key]) })
	},
	float: function(can) { var height = can.page.height()/2, width = can.page.width()*3/4
		if (can.user.isMobile) {
			if (can.user.isLandscape()) {
				height = can.page.height()*3/4, width = can.page.width()*3/4
			} else {
				width = can.page.width()
			}
		}
		can.onimport.size(can, height, width, true)
		can.onmotion.move(can, can._target, {left: can.page.width()-width, top: can.page.height()/4})
	},
	clear: function(can, target) { return can.page.Modify(can, target||can._output, ""), target },
	cache: function(can, next) { var list = can.base.getValid(can.base.Obj(can.core.List(arguments).slice(2)), [can._output])
		var key = next(can._cache_data = can._cache_data||{}, list[0]._cache_key); if (key == list[0]._cache_key) { return true }
		can.core.List(list, function(target) { target && target._cache_key && can.page.Cache(target._cache_key, target, target.scrollTop+1) })
		return key && can.core.List(list, function(target) { if (!target) { return }
			var pos = can.page.Cache(target._cache_key = key, target); if (pos) { target.scrollTo && target.scrollTo(0, pos-1); return target }
		}).length > 0
	},
	share: function(event, can, input, args) { var _args = args; can.request(event, {submit: "共享"})
		return can.user.input(event, can, input, function(args) { can.onengine.signal(can, chat.ONSHARE, can.request(event, {args: [mdb.TYPE, chat.FIELD].concat(_args||[], args||[])})) })
	},
	focus: function(can, target, value) { if (!target) { return } if (!can.base.isUndefined(value)) { target.value = value }
		target.focus(), can.onmotion.selectRange(target)
	}, selectRange: function(target) { target && target.setSelectionRange && target.setSelectionRange(0, target.value.length) },
	copy: function(can, target, cb) { target.title = "点击复制，或 Command + Click 打开应用", target.onclick = function(event) {
		can.user.copy(event, can, target.innerText), can.base.isFunc(cb) && cb(event)
		can.onkeymap.prevent(event)
	} },
	hide: function(can, time, cb, target) { target = target||can._target, can.page.style(can, target, html.OPACITY, 1)
		time = can.base.isObject(time)? time: {value: 10, length: time||20}
		can.core.Timer(time, function(event, value, index) { can.page.style(can, target, html.OPACITY, 1-(index+1)/time.length) },
			function() { can.base.isFunc(cb) && cb(), can.page.style(can, target, html.DISPLAY, html.NONE) })
	},
	show: function(can, time, cb, target) { target = target||can._target, can.page.style(can, target, html.OPACITY, 0, html.DISPLAY, html.BLOCK)
		time = can.base.isObject(time)? time: {interval: 10, length: time||30}
		can.core.Timer(time, function(event, value, index) { can.page.style(can, target, html.OPACITY, (index+1)/time.length) }, cb)
	},
	move: function(can, target, layout) { layout && can.page.style(can, target, layout), can.onmotion.resize(can, target, function() {}) },
	resize: function(can, target, cb, top) { var begin, action
		target.onmousedown = function(event) { if (event.which != 1 || event.target != target && !(can.page.ClassList.has(can, event.target, html.STATUS) && can.page.tagis(event.target, html.DIV))) { return } window._mousemove = target
			begin = {left: target.offsetLeft, top: target.offsetTop, height: target.offsetHeight, width: target.offsetWidth, x: event.x, y: event.y}
		}, target.onmouseup = function(event) { begin = null, delete(window._mousemove) }
		target.onmousemove = function(event) {
			if (begin) { var dy = event.y - begin.y, dx = event.x - begin.x
				switch (action) {
					case html.LEFT: can.page.style(can, target, html.LEFT, can.base.Min(begin.left + dx, 0, window.innerWidth-target.offsetWidth)), dx = -dx
					case html.RIGHT: cb? cb(begin.height, begin.width + dx): can.page.style(can, target, html.WIDTH, begin.width + dx); break
					case html.TOP: can.page.style(can, target, html.TOP, can.base.Min(begin.top + dy, top, window.innerHeight-target.offsetHeight)), dy = -dy
					case html.BOTTOM: cb? cb(begin.height + dy, begin.width): can.page.style(can, target, html.HEIGHT, begin.height + dy); break
					default:
						can.page.style(can, target,
							html.LEFT, can.base.Min(begin.left + dx, 0, window.innerWidth-target.offsetWidth),
							html.TOP, can.base.Min(begin.top + dy, top||0, window.innerHeight-html.ACTION_HEIGHT)
						)
				} can.onkeymap.prevent(event)
			} else { var p = can.page.position(event, target), margin = 20, cursor = ""
				if (p.x < margin) { cursor = "ew-resize", action = html.LEFT
				} else if (target.offsetWidth-margin < p.x) { cursor = "ew-resize", action = html.RIGHT
				} else if (target.offsetHeight-margin < p.y || can.page.ClassList.has(can, event.target, html.STATUS) && can.page.tagis(event.target, html.DIV)) { cursor = "ns-resize", action = html.BOTTOM
				} else if (p.y < margin) { cursor = "ns-resize", action = html.TOP
				} else { cursor = "", action = "" } can.page.style(can, target, "cursor", cursor)
			}
		}
	},
	touch: function() {
	},
})
Volcanos(chat.ONKEYMAP, {_init: function(can, target) { target = target||document.body
		can.onkeymap._build(can), target.onkeydown = function(event) { can.misc.Event(event, can, function(msg) {
			if (can.user.isWindows && event.ctrlKey) { can.onkeymap.prevent(event) }
			if (can.page.tagis(event.target, html.SELECT, html.INPUT, html.TEXTAREA)) { return }
			can.onengine.signal(can, chat.ONKEYDOWN, can.request(event, {"model": can.user.isWebview && event.metaKey? "webview": mdb.NORMAL}))
		}) }, target.onkeyup = function(event) { can.misc.Event(event, can, function(msg) {
			if (can.user.isWindows && event.ctrlKey) { can.onkeymap.prevent(event) }
			if (can.page.tagis(event.target, html.SELECT, html.INPUT, html.TEXTAREA)) { return }
			can.onengine.signal(can, chat.ONKEYUP, can.request(event, {"model": mdb.NORMAL}))
		}) }
	},
	_build: function(can) { can.core.Item(can.onkeymap._mode, function(item, value) { var engine = {list: {}}
		can.core.Item(value, function(key, cb) { var map = engine; for (var i = 0; i < key.length; i++) {
			if (!map.list[key[i]]) { map.list[key[i]] = {list: {}} } map = map.list[key[i]]; if (i == key.length-1) { map.cb = cb }
		} }), can.onkeymap._engine[item] = engine
	}) },
	_parse: function(event, can, mode, list, target) { list = list||[]
		if (event.metaKey && !can.user.isWebview) { return } if ([code.META, code.ALT, code.CONTROL, code.SHIFT].indexOf(event.key) > -1) { return list }
		list.push(event.key); for (var pre = 0; pre < list.length; pre++) { if ("0" <= list[pre] && list[pre] <= "9") { continue } break }
		var count = parseInt(list.slice(0, pre).join(""))||1, map = can.onkeymap._mode[mode]
		function repeat(cb, count) { list = []; for (var i = 1; i <= count; i++) { if (can.core.CallFunc(cb, {event: event, can: can, target: target, count: count})) { break } } }
		var cb = map && map[event.key]; if (can.base.isFunc(cb) && event.key.length > 1) { repeat(cb, count); return list }
		var cb = map && map[event.key.toLowerCase()]; if (can.base.isFunc(cb) && event.key.length > 1) { repeat(cb, count); return list }
		var map = can.onkeymap._engine[mode]; if (!map) { return [] }
		for (var i = pre; i < list.length; i++ ) { var map = map.list[list[i]]; if (!map) { return [] }
			if (i == list.length-1 && can.base.isFunc(map.cb)) { repeat(map.cb, count); return [] }
		} return list
	},
	_mode: {
		insert: {
			Escape: function(event, can, target) { if (event.key == code.ESCAPE) { target.blur() } },
			Enter: function(event, can, target) { if (event.key != code.ENTER) { return }
				var his = target._history||[]; his.push(target.value), target._history = his, target._current = his.length
				can.page.tagis(event.target, html.INPUT) && can.onmotion.focus(can, target)
			},
		},
		insert_ctrl: {
			u: function(event, can, target) { can.onkeymap.deleteText(target, 0, target.selectionEnd) },
			k: function(event, can, target) { can.onkeymap.deleteText(target, target.selectionStart) },
			h: function(event, can, target) { can.onkeymap.deleteText(target, target.selectionStart-1, 1) },
			d: function(event, can, target) { can.onkeymap.deleteText(target, 0, target.selectionStart) },
			w: function(event, can, target) { var start = target.selectionStart-2, end = target.selectionEnd-1
				for (var i = start; i >= 0; i--) {
					if (target.value[end] == lex.SP && target.value[i] != lex.SP) { break }
					if (target.value[end] != lex.SP && target.value[i] == lex.SP) { break }
				} can.onkeymap.deleteText(target, i+1, end-i)
			},
			n: function(event, can, target) { var his = target._history||[], pos = target._current||0
				pos = ++pos % (his.length+1), target._current = pos, target.value = his[pos]||""
			},
			p: function(event, can, target) { var his = target._history||[], pos = target._current||0
				pos = --pos % (his.length+1); if (pos < 0) { pos = his.length } target._current = pos, target.value = his[pos]||""
			},
		},
	}, _engine: {},
	prevent: function(event) { event && (event.stopPropagation(), event.preventDefault()); return true },
	input: function(event, can) { if (event.metaKey) { return } var target = event.target
		target._keys = can.onkeymap._parse(event, can, mdb.INSERT+(event.ctrlKey? "_ctrl": ""), target._keys, target)
	},
	cursorMove: function(target, count, begin) {
		if (begin != undefined) { if (begin < 0) { begin += target.value.length+1 } target.setSelectionRange(begin, begin) }
		return count == undefined || target.setSelectionRange(target.selectionStart+count, target.selectionStart+count), target.selectionStart
	},
	insertText: function(target, text) { var start = target.selectionStart
		var left = target.value.slice(0, target.selectionStart), rest = target.value.slice(target.selectionEnd)
		return target.value = left+text+rest, target.setSelectionRange(start+text.length, start+text.length)
	},
	deleteText: function(target, start, count) {
		var end = count? start+count: target.value.length, cut = target.value.slice(start, end)
		target.value = target.value.substring(0, start)+target.value.substring(end, target.value.length)
		return target.setSelectionRange(start, start), cut
	},

	selectCtrlN: function(event, can, target, key, cb) { if (!event.ctrlKey || event.key < "0" || event.key > "9") { return }
		return can.page.Select(can, target, key, function(target, index) { if (index+1 == event.key) { return cb? cb(target): target.click() } })[0]
	},
	selectItems: function(event, can, target, name) { name = (name||event.target.value).toLowerCase()
		can.page.Select(can, target, html.DIV_ITEM, function(item) {
			if (!can.page.ClassList.set(can, item, html.HIDE, item.innerText == "" || item.innerText.toLowerCase().indexOf(name) == -1)) {
				for (item = item.parentNode; item != target; item = item.parentNode) {
					can.page.ClassList.del(can, item, html.HIDE), can.page.ClassList.del(can, item.previousSibling, html.HIDE)
					can.page.Select(can, item.previous, "div.expand", function(item) { can.page.ClassList.add(can, item, "open") })
				}
			}
		}), can.onkeymap.selectCtrlN(event, can, target, html.DIV_ITEM+":not(.hide)", function(target) {
			target.click(), can.onmotion.focus(can, event.target)
		})
		if (event.key == code.ENTER) { can.page.Select(can, target, html.DIV_ITEM+":not(.hide)")[0].click(), can.onmotion.focus(can, event.target) }
		if (event.key == code.ESCAPE) { event.target.blur() }
	},
	selectInputs: function(event, can, cb, target) { if (can.page.ismodkey(event)) { return } if (event.key == code.ESCAPE) { return target.blur() }
		if (event.ctrlKey || can.base.isIn(event.key, "Tab", "ArrowUp", "ArrowDown")) { if (can.base.isUndefined(target._index)) { target._index = -1, target._value = target.value }
			function select(order) { if (order == -1) { target.value = target._value }
				var index = 0; return can.page.Select(can, can._output, [html.TBODY, html.TR], function(tr) { if (can.page.ClassList.has(can, tr, html.HIDDEN)) { return }
					can.page.ClassList.del(can, tr, html.SELECT); if (order == index++) { can.page.ClassList.add(can, tr, html.SELECT)
						can.page.Select(can, tr, html.TD, function(td, index) { index == 0 && (target.value = td.innerText) })
					} return tr
				}).length
			}
			var total = select(target._index), key = event.key; if (event.key == code.TAB) { key = event.shiftKey? "p": "n" } switch (key) {
				case "ArrowDown":
				case "n": select(target._index = (target._index+2) % (total+1) - 1); break
				case "ArrowUp":
				case "p": select(target._index = (target._index+total+1) % (total+1) - 1); break
				default: return
			} return can.Status(mdb.INDEX, target._index), can.onkeymap.prevent(event)
		}
		can.page.Select(can, can._output, [html.TBODY, html.TR], function(tr, index) { var has = false
			can.page.Select(can, tr, html.TD, function(td) { has = has || td.innerText.indexOf(target.value)>-1 }), can.page.ClassList.set(can, tr, html.HIDDEN, !has)
		}), target._index = -1, target._value = target.value
		var total = can.page.Select(can, can._output, [html.TBODY, html.TR], function(tr) { if (!can.page.ClassList.has(can, tr, html.HIDDEN)) { return tr } }).length
		total == 0 && can.base.isFunc(cb) && cb(), can.Status(kit.Dict(mdb.TOTAL, total, mdb.INDEX, target._index))
	},
	selectOutput: function(event, can) { if (!event.ctrlKey || event.key < "0" || event.key > "9") { return }
		event.key == "0"? can.onimport._back(can): can.page.Select(can, can._output, html.TR, function(tr, index) { if (index == event.key) {
			var head = can.page.Select(can, can._output, html.TH, function(th, order) { return th.innerText }), data = {}
			can.page.Select(can, tr, html.TD, function(td, index) { data[head[index]] = td.innerText
				can.Option(head[index], td.innerText)
			})
			can.onexport.record(can, "", "", data) || can.Update(event)
		} })
	},
})
