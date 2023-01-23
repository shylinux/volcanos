Volcanos(chat.ONENGINE, {_init: function(can, meta, list, cb, target) {
		can.user.isMobile && can.require(["https://unpkg.com/vconsole@latest/dist/vconsole.min.js"], function() { return window.VConsole() })
		if (!can.user.isMailMaster) {
			if (can.misc.Search(can, ice.MSG_SESSID)) { can.misc.CookieSessid(can, can.misc.Search(can, ice.MSG_SESSID)); return can.misc.Search(can, ice.MSG_SESSID, "") }
		} can._path = location.href
		can.user.title(can.misc.Search(can, chat.TITLE)||can.misc.Search(can, ice.POD)||location.host)
		can.run = function(event, cmds, cb) { var msg = can.request(event); cmds = cmds||[]; return (can.onengine[cmds[0]]||can.onengine._remote)(event, can, msg, can, cmds, cb) }
		can.require([can.volcano], null, function(can, key, sub) { can[key] = sub })
		can.core.Next(list, function(item, next) { item.type = chat.PANEL
			can.onappend._init(can, can.base.Copy(item, can.core.Value(can, [chat.RIVER, item.name])), item.list, function(sub) { can[item.name] = sub
				sub.run = function(event, cmds, cb) { var msg = sub.request(event); cmds = cmds||[]; return (can.onengine[cmds[0]]||can.onengine._remote)(event, can, msg, sub, cmds, cb) }
				can.core.Item(sub.onplugin, function(key, cmd) { sub.onplugin.hasOwnProperty(key) && can.base.isFunc(cmd) && can.onengine.plugin(sub, can.core.Keys(ice.CAN, key), cmd) })
				can.core.ItemCB(sub.onaction, function(key, cb) { can.onengine.listen(can, key, function(msg) { can.core.CallFunc(cb, {can: sub, msg: msg}) }) })
				can.core.CallFunc([sub.onaction, chat._INIT], {can: sub, cb: next, target: sub._target})
				delete(sub._history), delete(sub._conf.feature)
			}, target)
		}, function() { can.onlayout._init(can, target), can.onmotion._init(can, target), can.onkeymap._init(can, target)
			can.onengine.listen(can, chat.ONSEARCH, function(msg, arg) { arg[0] == ctx.COMMAND && can.run(msg, ["can.command"]) })
			can.onengine.signal(can, chat.ONMAIN, can.request()), can.base.isFunc(cb) && cb(can)
		})
		can.onappend.topic(can, html.DARK), can.onappend.topic(can, html.LIGHT, {panel: cli.WHITE, plugin: cli.ALICEBLUE, legend: "lavender", input: cli.WHITE, output: cli.WHITE, table: cli.ALICEBLUE,
			hover: cli.ALICEBLUE, border: cli.GLASS, label: cli.BLACK, text: cli.BLACK, info: cli.BLUE, warn: cli.RED})
	},
	_search: function(event, can, msg, panel, cmds, cb) {
		var sub, mod = can, fun = can, key = ""; can.core.List(cmds[1].split(ice.PT), function(value) { fun && (sub = mod, mod = fun, fun = mod[value], key = value) })
		if (!sub || !mod || !fun) { can.misc.Warn(ice.ErrNotFound, cmds); return can.base.isFunc(cb) && cb(msg.Echo(ice.ErrWarn, ice.ErrNotFound, cmds)) }
		return can.core.CallFunc(fun, {event: event, can: sub, msg: msg, cmds: cmds.slice(2), cb: cb, target: sub._target, button: key, cmd: key, arg: cmds.slice(2), list: cmds.slice(2)}, mod)
	},
	_remote: function(event, can, msg, panel, cmds, cb) {
		if (panel.onengine._engine(event, can, msg, panel, cmds, cb)) { return }
		if (panel.onengine._plugin(event, can, msg, panel, cmds, cb)) { return }
		if (panel.onengine._static(event, can, msg, panel, cmds, cb)) { return }

		msg.Option(ice.SESS_WIDTH) || msg.Option(ice.SESS_WIDTH, panel.Conf(html.WIDTH))
		msg.Option(ice.SESS_HEIGHT) || msg.Option(ice.SESS_HEIGHT, panel.Conf(html.HEIGHT))
		var toast, _toast = msg.Option(chat._TOAST); if (_toast) { can.onmotion.delay(can, function() { toast = toast||can.user.toastProcess(msg._can, _toast) }, 500) }
		msg.option = can.core.List(msg.option, function(item) { return [chat._TOAST, ice.MSG_HANDLE].indexOf(item) > -1 && delete(msg[item])? undefined: item })
		msg.Option(ice.MSG_TOPIC) || msg.Option(ice.MSG_TOPIC, can.getHeader(chat.TOPIC))
		if (can.base.isUndefined(msg[ice.MSG_DAEMON])) { var sub = msg._can; can.base.isUndefined(sub._daemon) && can.ondaemon._list[0] && (sub._daemon = can.ondaemon._list.push(sub)-1)
			if (sub._daemon) { msg.Option(ice.MSG_DAEMON, can.core.Keys(can.ondaemon._list[0], sub._daemon)) }
		} can.onengine.signal(panel, chat.ONREMOTE, can.request({}, {_follow: panel._follow, _msg: msg, _cmds: cmds}))

		var names = msg.Option(chat._NAMES)||panel._names||((can.Conf("iceberg")||Volcanos.meta.iceberg)+panel._name)
		can.misc.Run(event, can, {names: names, daemon: msg[ice.MSG_DAEMON]}, cmds, function(msg) { toast && toast.close(), toast = true
			can.base.isFunc(cb) && cb(msg), Volcanos.meta.pack[can.core.Keys(panel._name, cmds.join(ice.FS))] = msg
		})
	},
	_static: function(event, can, msg, panel, cmds, cb) { if (!can.user.isLocalFile) { return false }
		var res = Volcanos.meta.pack[can.core.Keys(panel._name, cmds.join(ice.FS))], msg = can.request(event); msg.Clear(ice.MSG_APPEND)
		return res? msg.Copy(res): can.user.toast(can, "miss data"), can.base.isFunc(cb) && cb(msg), true
	},
	_engine: function(event, can, msg, panel, cmds, cb) { return false },
	_plugin: function(event, can, msg, panel, cmds, cb) {
		if (cmds[0] == ctx.ACTION && cmds[1] == ice.RUN) { var p = can.onengine.plugin(can, cmds[2])
			if (p) { return can.core.CallFunc(p, {can: p.can||panel, msg: msg, arg: cmds.slice(3), cmds: cmds.slice(3), cb: cb}), true }
		}
		var p = can.onengine.plugin(can, cmds[0]), n = 1; if (p) { if (p.meta && p.meta[cmds[1]] && cmds[0] == ctx.ACTION) { n = 3 } else if (p.meta && p.meta[cmds[0]]) { n = 2 }
			return can.core.CallFunc(p, {can: p.can||panel, sub: msg._can, msg: msg, arg: cmds.slice(n), cmds: cmds.slice(n), cb: cb}), true
		} return false
	},
	plugin: shy(function(can, name, command) { var _name = can.base.trimPrefix(name, "can.")
		if (can.base.isUndefined(name) || !can.base.isString(name) || name == _name) { return }
		if (can.base.isUndefined(command)) { return arguments.callee.meta[_name] }
		var button = false, type = html.TEXT; command.list = can.core.List(command.list, function(item) {
			return can.base.isString(item) && (item = can.core.SplitInput(item, can.base.isFunc(command.meta[item])? html.BUTTON: type)), item.type != html.SELECT && (type = item.type), button = button || item.type == html.BUTTON, item
		}); if (!button) { command.list.push(can.core.SplitInput(ice.LIST, html.BUTTON)) }
		command.can = can, command.meta.name = name, arguments.callee.meta[_name] = command
	}),
	listen: shy(function(can, name, cb) { arguments.callee.meta[name] = (arguments.callee.meta[name]||[]).concat(cb) }),
	signal: function(can, name, msg) { msg = msg||can.request(); var _msg = name == chat.ONREMOTE? msg.Option("_msg"): msg
		// _msg.Option(ice.LOG_DISABLE) == ice.TRUE || can.misc.Log(name, can._name, (msg._cmds||[]).join(ice.SP), name == chat.ONMAIN? can: _msg)
		_msg.Option(ice.LOG_DISABLE) == ice.TRUE || can.misc.Log(name, can._name, (msg._cmds||[]).join(ice.SP), name == chat.ONMAIN? can: _msg, _msg._can._target)
		return can.core.List(can.onengine.listen.meta[name], function(cb) { can.core.CallFunc(cb, {event: msg._event, msg: msg}) }).length
	},
})
Volcanos(chat.ONDAEMON, {_init: function(can, name) { if (can.user.isLocalFile) { return }
		can.misc.WSS(can, {type: html.CHROME, name: can.misc.Search(can, cli.DAEMON)||name||"", text: can.user.title()}, function(event, msg, cmd, arg, cb) {
			var sub = can.ondaemon._list[msg.Option(ice.MSG_TARGET)]||can; can.base.isFunc(sub.ondaemon[cmd])?
				can.core.CallFunc(sub.ondaemon[cmd], {can: can, msg: msg, sub: sub, cmd: cmd, arg: arg, cb: cb}):
					can.onengine._search({}, can, msg, can, [chat._SEARCH, cmd].concat(arg), cb)
		})
	}, _list: [""],
	pwd: function(can, arg) { can._wss_name = can.ondaemon._list[0] = arg[0] },
	toast: function(can, sub, arg) { can.core.CallFunc(can.user.toast, [sub].concat(arg)) },
	refresh: function(can, sub) { can.base.isFunc(sub.Update) && sub.Update() },
	action: function(can, msg, sub, arg) {
		if (arg[0] == "ctrl") { var list = []; can.misc.Log("what ", document.activeElement)
			can.page.Select(can, can._root._target, "input", function(target, index) { list[index] = target
				if (document.activeElement == document.body) { return target.focus() }
				switch (arg[1]) {
					case "next": if (list[index-1] == document.activeElement) { target.focus() } break
					case "prev": if (target == document.activeElement) { list[index-1].focus() } break
					case "ok": if (target == document.activeElement) { target.focus() } break
				}
			})
			return
		}
		if (arg[0].indexOf(ice.PT) == -1 && can.page.SelectInput(can, sub._option, arg[0], function(target) { target.type == html.BUTTON? target.click(): (target.value = arg[1]||"", target.focus()); return target })) { return }
		var _sub = can.core.Value(sub, chat._OUTPUTS_CURRENT); if (_sub && _sub.onaction && _sub.onaction[arg[0]]) { return _sub.onaction[arg[0]]({}, _sub, arg[0]) }
		if (sub && sub.onaction && sub.onaction[arg[0]]) { return sub.onaction[arg[0]]({}, sub, arg[0], _sub) }
		can.core.CallFunc(can.core.Value(can, arg[0]), kit.Dict({can: can}, arg.slice(1)))
	},
	input: function(can, msg, sub, arg) { can.page.Select(can, sub._target, "input:focus", function(target) { target.value += arg[0] }) },
	grow: function(can, msg, sub, arg) {
		if (sub.sup && sub.sup.onimport._grow) { return sub.sup.onimport._grow(sub.sup, msg, arg.join("")) }
		if (sub && sub.onimport._grow) { return sub.onimport._grow(sub, msg, arg.join("")) }
	},
	close: function(can, msg, sub) { can.user.close() },
	exit: function(can, msg, sub) { can.user.close() },
})
Volcanos(chat.ONAPPEND, {_init: function(can, meta, list, cb, target, field) {
		meta.index && (meta.name = meta.index), meta.name = can.core.Split(meta.name||"", "\t .\n").pop()
		field = field||can.onappend.field(can, meta.type, meta, target)._target
		var legend = can.page.SelectOne(can, field, html.LEGEND)
		var option = can.page.SelectOne(can, field, html.FORM_OPTION)
		var action = can.page.SelectOne(can, field, html.DIV_ACTION)
		var output = can.page.SelectOne(can, field, html.DIV_OUTPUT)
		var status = can.page.SelectOne(can, field, html.DIV_STATUS)
		meta.index && can.page.Append(can, option, [{view: [[html.ITEM, html.ICON], html.DIV, can.page.unicode.delete], onclick: function(event) { sub.onaction.close(event, sub) }}])
		var sub = Volcanos(meta.name, {_root: can._root||can, _follow: can.core.Keys(can._follow, meta.name), _target: field,
			_legend: legend, _option: option, _action: action, _output: output, _status: status, _history: [],
			Status: function(key, value) { if (can.base.isObject(key)) { return can.core.Item(key, sub.Status), key }
				can.page.Select(can, status, [[[html.SPAN, key]]], function(target) {
					if (can.base.beginWith(value, ice.PS, ice.HTTP)) { value = can.page.Format(html.A, value) }
					return can.base.isUndefined(value)? (value = target.innerHTML): (target.innerHTML = value)
				}); return value
			},
			Action: function(key, value) { return can.page.SelectArgs(can, action, key, value)[0] },
			Option: function(key, value) { return can.page.SelectArgs(can, option, key, value)[0] },
			Update: function(event, cmds, cb, silent) { sub.request(event)._caller()
				sub.onappend._output0(sub, sub.Conf(), event||{}, cmds||sub.Input([], !silent), cb, silent); return true },
			Focus: function() { can.page.SelectOne(can, option, html.INPUT_ARGS, function(target) { target.focus() }) },
			Input: function(cmds, save) { cmds = cmds && cmds.length > 0? cmds: can.page.SelectArgs(sub), cmds = can.base.trim(cmds)
				return !save || cmds[0] == ctx.ACTION || can.base.Eq(sub._history[sub._history.length-1], cmds) || sub._history.push(cmds), cmds
			},
			Clone: function() { meta.args = can.page.SelectArgs(can)
				can.onappend._init(can, meta, list, function(sub) { can.base.isFunc(cb) && cb(sub, true), can.onmotion.delay(can, sub.Focus) }, target)
			},
		}, list, function(sub) { meta.feature = can.base.Obj(meta.feature, {}), sub.Conf(meta)
			can.onappend.style(sub, meta.index? meta.index.split(ice.PT): meta.name), can.onappend.style(sub, sub.Conf(ctx.STYLE)), can.onappend.style(sub, sub.Mode())
			sub._trans = can.base.Copy(sub._trans||{}, can.core.Value(sub, [chat.ONACTION, chat._TRANS]))
			can.core.Item(meta.feature, function(key, cb) { cb.help && sub.user.trans(sub, kit.Dict(key, cb.help)) })
			meta.msg && can.onmotion.delay(can, function() { var msg = sub.request(); msg.Copy(can.base.Obj(meta.msg))
				sub.onappend._output(sub, msg, meta.display||msg.Option(ice.MSG_DISPLAY)||meta.feature.display)
			}), meta.inputs && sub.onappend._option(sub, meta, sub._option, meta.msg)
			sub._legend && (sub._legend.onclick = function(event) {
				can.user.carte(event, sub, sub.onaction, sub.onaction.list.concat([[ctx.ACTION].concat(can.core.Item(meta.feature._trans))]), function(event, button) { can.misc.Event(event, sub, function(msg) {
					msg.RunAction(event, can.core.Value(sub, chat._OUTPUTS_CURRENT), [ctx.ACTION, button]) || msg.RunAction(event, sub, [ctx.ACTION, button]) || sub.runAction(event, button)
				}) })
			}), can.base.isFunc(cb) && cb(sub)
		}); return sub
	},
	_option: function(can, meta, option, skip) { meta = meta||{}; var index = -1, args = can.base.Obj(meta.args||meta.arg||meta.opt, []), opts = can.base.Obj(meta.opts, {})
		function add(item, next) { item = can.base.isString(item)? {type: html.TEXT, name: item}: item, item.type != html.BUTTON && index++
			return Volcanos(item.name, {_root: can._root, _follow: can.core.Keys(can._follow, item.name),
				_target: can.onappend.input(can, item, args[index]||opts[item.name], option||can._option),
				_option: option||can._option, _action: can._action, _output: can._output, _status: can._status,
				CloneField: can.Clone, CloneInput: function() { can.onmotion.focus(can, add(item)._target) },
				Option: can.Option, Action: can.Action, Status: can.Status, Input: can.Input,
			}, [item.display, chat.PLUGIN_INPUT_JS], function(sub) { sub.Conf(item)
				sub.run = function(event, cmds, cb, silent) { var msg = can.request(event, kit.Dict(chat._TOAST, ice.PROCESS))._caller()
					msg.RunAction(event, sub, cmds) || msg.RunAction(event, can.core.Value(can, chat._OUTPUTS_CURRENT), cmds) || can.Update(event, can.Input(cmds, !silent), cb, silent)
				}, can._inputs = can._inputs||{}, can._inputs[item.name] = sub, sub.sup = can
				can.core.ItemCB(sub.onaction, function(key, cb) { sub._target[key] = function(event) { can.misc.Event(event, can, function(msg) { cb(event, sub) })} })
				can.core.ItemCB(item, function(key, cb) { sub._target[key] = function(event) { can.misc.Event(event, can, function(msg) { cb(event, sub) })} })
				skip? next(): can.core.CallFunc([sub.onaction, chat._INIT], {can: sub, meta: item, cb: next, target: sub._target});
				(item.action||can.core.Value(meta, [ctx.FEATURE, ctx.INPUTS])) && can.onappend.figure(sub, item, sub._target, function(_sub, value) {
					can.onmotion.focus(can, sub._target, value), can.onmotion.delay(can, function() { can.Update() })
				})
			})
		} can.core.Next(can.base.getValid(can.core.Value(can, [chat.ONIMPORT, mdb.LIST]), can.base.Obj(meta.inputs, []))||[], add)
	},
	_action: function(can, list, action, meta) { meta = meta||can.onaction||{}, action = action||can._action, can.onmotion.clear(can, action)
		function run(event, button) { can.misc.Event(event, can, function(msg) {
			var cb = meta[button]||meta[chat._ENGINE]; cb? can.core.CallFunc(cb, {event: event, can: can, button: button}): can.run(event, [ctx.ACTION, button].concat(can.sup.Input()), function(msg) {
				if (can.core.CallFunc([can, chat.ONIMPORT, ice.MSG_PROCESS], {can: can, msg: msg})) { return }
			})
		}) }
		return can.core.List(can.page.inputs(can, can.base.getValid(can.base.Obj(list), can.core.Value(can, [chat.ONACTION, mdb.LIST]), meta != can.onaction? can.core.Item(meta): [])||[]), function(item) {
			can.base.isUndefined(item) || can.onappend.input(can, item == ""? /* 1.空白 */ {type: html.BR}:
				can.base.isString(item)? /* 2.按键 */ {type: html.BUTTON, name: item, value: can.user.trans(can, item, meta._trans), onclick: function(event) {
					run(event, item)
				}, onkeydown: function(event) { if (event.key == lang.ENTER) { target.click() }}}:
				item.length > 0? /* 3.列表 */ {type: html.SELECT, name: item[0], values: item.slice(1), onchange: function(event) { can.misc.Event(event, can, function(msg) {
					var button = item[event.target.selectedIndex+1]
					meta[item[0]]? can.core.CallFunc(meta[item[0]], [event, can, item[0], button]): meta[button] && can.core.CallFunc(meta[button], [event, can, button])
				}) }}: /* 4.其它 */(item.type == html.BUTTON && (item.value = item.value||can.user.trans(can, item.name, meta._trans), item.onclick = item.onclick||function(event) {
					run(event, item.name)
				}), item), "", action)
		}), meta
	},
	_output0: function(can, meta, event, cmds, cb, silent) { var msg = can.request(event); if (msg.RunAction(event, can, cmds)) { return }
		if (msg.Option(ice.MSG_HANDLE) != ice.TRUE && cmds && cmds[0] == ctx.ACTION && meta.feature[cmds[1]]) { var msg = can.request(event, {action: cmds[1]})
			if (can.base.isFunc(meta.feature[cmds[1]])) { return meta.feature[cmds[1]](can, msg, cmds.slice(2)) }
			return can.user.input(event, can, meta.feature[cmds[1]], function(args) { can.Update(can.request(event, {_handle: ice.TRUE}, can.Option()), cmds.slice(0, 2).concat(args)) })
		}
		return can.onengine._plugin(event, can, msg, can, cmds, cb) || can.run(event, cmds, cb||function(msg) { if (silent) { return } var _can = can._fields? can.sup: can
			if (_can == (msg._can._fields? msg._can._fields.sup: msg._can._fields) && can.core.CallFunc([_can, chat.ONIMPORT, ice.MSG_PROCESS], {can: _can, msg: msg})) { return }
			if (cmds && cmds[0] == ctx.ACTION) { if (can.base.isIn(cmds[1], mdb.CREATE, mdb.INSERT, mdb.IMPORT) || msg.Length() == 0 && msg.Result() == "") { return can.user.toastSuccess(can, cmds[1]), can.Update() } }
			can.onappend._output(can, msg, meta.display||msg.Option(ice.MSG_DISPLAY)||meta.feature.display)
		})
	},
	_output: function(can, msg, display, output, action, cb) { display = display||chat.PLUGIN_TABLE_JS, output = output||can._output
		Volcanos(display, {_root: can._root, _follow: can.core.Keys(can._follow, display), _fields: can._target, _target: output,
			_legend: can._legend, _option: can._option, _action: can._action, _output: output, _status: can._status,
			Update: can.Update, Option: can.Option, Action: can.Action, Status: can.Status,
		}, [display, chat.PLUGIN_TABLE_JS], function(sub) { sub.Conf(can.Conf())
			sub.run = function(event, cmds, cb, silent) {
				sub.request(event)._caller().RunAction(event, sub, cmds) || can.Update(event, can.Input(cmds, !silent), cb, silent)
			}, can._outputs = can._outputs||[], can._outputs.push(sub), sub.sup = can
			sub._index = can._index, sub._msg = msg, sub.Conf(sub._args = can.base.ParseURL(display))
			sub._trans = can.base.Copy(can.base.Copy(sub._trans||{}, can._trans), can.core.Value(sub, [chat.ONACTION, chat._TRANS]))
			if (sub.onimport && can.base.isArray(sub.onimport.list) && sub.onimport.list.length > 0) {
				can.onmotion.clear(can, can._option), can.onappend._option(can, {inputs: can.page.inputs(can, sub.onimport.list, html.TEXT) })
			}
			can.core.CallFunc([sub, chat.ONIMPORT, chat._INIT], {can: sub, msg: msg, cb: function(msg) {
				action === false || can.onmotion.clear(can, can._action), sub.onappend._action(sub, can.Conf(ice.MSG_ACTION)||msg.Option(ice.MSG_ACTION), action||can._action)
				action === false || sub.onappend._status(sub, sub.onexport&&sub.onexport.list||msg.Option(ice.MSG_STATUS)), can.user.isMobile || sub.onappend.tools(sub, msg)
				can.core.List([chat.FLOAT, chat.FULL, chat.CMD], function(mode) { can.page.ClassList.has(can, can._target, mode) && sub.onlayout[mode](sub) })
				can.onmotion.story.auto(can, can._output), can.onexport.output(can, msg), can.onaction._output(can, msg), can.base.isFunc(cb) && cb(msg)
			}, target: output})
		})
	},
	_status: function(can, list, status) { status = status||can._status, can.onmotion.clear(can, status)
		can.core.List(can.base.Obj(list, can.core.Value(can, [chat.ONEXPORT, mdb.LIST])), function(item) { item = can.base.isString(item)? {name: item}: item
			if (can.base.beginWith(item.value, ice.PS, ice.HTTP)) { item.value = can.page.Format(html.A, item.value, item.value.split("?")[0]) }
			can.page.Append(can, status, [{view: html.ITEM, list: [
				{text: [item.name, html.LABEL]}, {text: [": ", html.LABEL]}, {text: [(item.value == undefined? "": item.value)+"", html.SPAN, item.name]},
			], onclick: function(event) { can.user.copy(event, can, item.value) }}])
		})
	},

	topic: function(can, topic, color, style, list) { const PANEL_STYLE = "panel-style", PLUGIN_STYLE = "plugin-style"
		const LEGEND_STYLE = "legend-style", INPUT_STYLE = "input-style", INPUT_HOVER_STYLE = "input-hover-style", OUTPUT_STYLE = "output-style", GLASS_STYLE = "glass-style"
		const TABLE_HEAD_STYLE = "table-head-style", TABLE_HEAD_HOVER_STYLE = "table-head-hover-style", TABLE_ROW_HOVER_STYLE = "table-row-hover-style", TABLE_CELL_HOVER_STYLE = "table-cell-hover-style"
		const ITEM_HOVER_STYLE = "item-hover-style", CARTE_ITEM_HOVER_STYLE = "carte-item-hover-style", CARTE_ITEM_STYLE = "carte-item-style"
		const SOLID = " solid 1px", RADIUS = "border-radius", GLASS = "transparent", INPUT_COLOR = "#212121", OUTPUT_COLOR = "#0d1117"
		function _bg(color) { return kit.Dict(html.BACKGROUND_COLOR, color, can.core.List(arguments).slice(1)) }
		function _fg(color) { return kit.Dict(html.COLOR, color, can.core.List(arguments).slice(1)) }
		function _b_r(size) { return kit.Dict(RADIUS, size) }
		color = kit.Dict(
			html.PANEL, cli.BLACK, html.PLUGIN, cli.BLACK, html.LEGEND, INPUT_COLOR, html.INPUT, INPUT_COLOR, html.OUTPUT, OUTPUT_COLOR, html.TABLE, cli.BLACK,
			html.HOVER, INPUT_COLOR, html.BORDER, cli.GRAY, html.LABEL, "silver", html.TEXT, cli.WHITE, log.INFO, cli.BLUE, log.WARN, cli.RED, color,
		), style = kit.Dict(LEGEND_STYLE, _bg(color.legend),
			INPUT_STYLE, _bg(color.input, html.COLOR, color.label, RADIUS, "5px", "outline", html.NONE, "box-shadow", html.NONE),
			INPUT_HOVER_STYLE, _fg(color.text), OUTPUT_STYLE, _bg(color.output), GLASS_STYLE, _bg(GLASS),
			TABLE_HEAD_STYLE, _bg(color.table, html.COLOR, color.label), TABLE_HEAD_HOVER_STYLE, _bg(color.table, html.COLOR, color.text),
			TABLE_ROW_HOVER_STYLE, _bg(color.table), TABLE_CELL_HOVER_STYLE, _bg(color.output),
			ITEM_HOVER_STYLE, _bg(color.hover, html.COLOR, color.text), CARTE_ITEM_HOVER_STYLE, _bg(color.input, html.COLOR, color.text),
			PANEL_STYLE, _bg(color.panel, html.COLOR, color.label), PLUGIN_STYLE, _bg(color.plugin, RADIUS, "10px"), style,
		), list = [{type: "", style: _fg(color.label)},
			{type: html.LEGEND, style: [INPUT_STYLE, LEGEND_STYLE]}, {type: html.LEGEND, style: [INPUT_HOVER_STYLE]},
			{type: html.SELECT, style: [INPUT_STYLE]}, {type: html.SELECT, style: [INPUT_HOVER_STYLE]},
			{type: html.INPUT, style: [INPUT_STYLE]}, {type: html.INPUT, style: [INPUT_HOVER_STYLE]},
			{type: html.INPUT+":not([type=button])", style: _b_r(0)}, {type: html.INPUT+":not([type=button])", name: [html.HOVER], style: {border: color.info+SOLID}},
			{type: html.TEXTAREA, style: [INPUT_STYLE]}, {type: html.TEXTAREA, style: _b_r(0)},
			{type: html.FORM_OPTION, list: [{type: html.DIV_ITEM, name: [html.SELECT], style: [GLASS_STYLE]}]},
			{type: html.FORM_OPTION, list: [{type: html.DIV_ITEM, name: [html.HOVER], style: [GLASS_STYLE]}]},
			{type: html.DIV_ACTION, list: [{type: html.DIV_ITEM, name: [html.SELECT], style: [GLASS_STYLE]}]},
			{type: html.DIV_ACTION, list: [{type: html.DIV_ITEM, name: [html.HOVER], style: [GLASS_STYLE]}]},
			{type: html.DIV_OUTPUT, style: [OUTPUT_STYLE]}, {type: html.DIV_STATUS, style: kit.Dict(_bg(color.plugin), _fg(color.label))},
			{type: html.DIV_CODE, style: {border: color.border+SOLID}},
			{type: html.DIV_ITEM, name: [html.SELECT], style: [ITEM_HOVER_STYLE]}, {type: html.DIV_ITEM, style: [ITEM_HOVER_STYLE]},
			{type: html.DIV_TABS, list: [{type: html.DIV, style: _bg(color.plugin)}]},
			{type: html.DIV_TABS, list: [{type: html.DIV, name: [html.HOVER], style: [OUTPUT_STYLE]}]},
			{type: html.DIV_TABS, list: [{type: html.DIV, name: [html.HOVER], style: _fg(color.text)}]},
			{type: html.DIV_TABS, list: [{type: html.DIV, name: [html.SELECT], style: [OUTPUT_STYLE]}]},
			{type: html.DIV_PATH, style: [OUTPUT_STYLE]}, {type: html.DIV_PATH, list: [{type: html.SPAN, style: [ITEM_HOVER_STYLE]}]},
			{type: html.DIV_PLUG, list: [{type: html.LEGEND, style: [OUTPUT_STYLE]}]},
			{type: html.DIV_PLUG, list: [{type: html.LEGEND, name: [html.SELECT], style: [PLUGIN_STYLE]}]},
			{type: "div.zone>div.item", style: [TABLE_HEAD_STYLE]}, {type: "div.zone>div.item", style: [TABLE_HEAD_HOVER_STYLE]},
			{type: "div.zone>div.list>div.zone>div.item", style: [TABLE_HEAD_STYLE]}, {type: "div.zone>div.list>div.zone>div.item", style: [TABLE_HEAD_HOVER_STYLE]},
			{type: "div.zone div.item>div.name", name: [html.HOVER], style: _fg(color.text)},
			{type: "tr.line.select", style: [ITEM_HOVER_STYLE]}, {type: "tr.line", style: [ITEM_HOVER_STYLE]},
			{type: "tr.line>td.line", style: [OUTPUT_STYLE]}, {type: "tr.line.select>td.line", style: [ITEM_HOVER_STYLE]},
			{type: html.TABLE_CONTENT, list: [{type: html.TR, style: [TABLE_ROW_HOVER_STYLE]}]},
			{type: html.TABLE_CONTENT, list: [{type: html.TH, style: [TABLE_HEAD_STYLE]}]},
			{type: html.TABLE_CONTENT, name: [html.ACTION], list: [{type: html.TD+":last-child", style: [TABLE_HEAD_STYLE]}]},
			{type: html.TABLE_CONTENT, list: [{type: html.TD, name: [html.SELECT], style: [TABLE_CELL_HOVER_STYLE]}]},
			{type: html.TABLE_CONTENT, list: [{type: html.TD, style: [TABLE_CELL_HOVER_STYLE]}]},
			{type: html.H1, style: [ITEM_HOVER_STYLE]}, {type: html.H2, style: [ITEM_HOVER_STYLE]}, {type: html.H3, style: [ITEM_HOVER_STYLE]},
			{type: html.LABEL, style: _fg(color.label)}, {type: html.A, style: _fg(color.info)},
			{type: html.FIELDSET_PANEL, style: [PANEL_STYLE]}, {type: html.FIELDSET_PANEL+ice.GT+html.DIV_OUTPUT, style: [PANEL_STYLE]},
			{type: html.FIELDSET_PANEL, name: [chat.HEADER], list: [{type: html.DIV_OUTPUT, list: [{type: html.DIV, style: [ITEM_HOVER_STYLE]}], }]},
			{type: html.FIELDSET_PANEL, name: [chat.FOOTER], list: [{type: html.DIV_OUTPUT, list: [{type: html.DIV, style: [ITEM_HOVER_STYLE]}], }]},
			{type: html.FIELDSET_PANEL, name: [chat.FOOTER], list: [{type: html.DIV_OUTPUT, list: [{type: html.DIV_TOAST, style: [TABLE_HEAD_STYLE]}], }]},
			{type: html.FIELDSET_PANEL, name: [chat.ACTION], list: [{type: html.DIV_OUTPUT, style: [OUTPUT_STYLE]}]},
			{type: html.FIELDSET_PLUGIN, style: [PLUGIN_STYLE]}, {type: html.FIELDSET_PLUGIN, list: [{type: html.DIV_STATUS, style: {"border-top": color.border+SOLID}}]},
			{type: html.FIELDSET_STORY, style: [PLUGIN_STYLE]}, {type: html.FIELDSET_STORY, list: [{type: html.DIV_STATUS, style: {"border-top": color.border+SOLID}}]},
			{type: html.FIELDSET_INPUT, list: [{type: html.DIV_OUTPUT, style: [PLUGIN_STYLE]}], style: [PLUGIN_STYLE]}, {type: html.FIELDSET_INPUT, style: _b_r(0)},
			{type: html.FIELDSET_INPUT, list: [{type: html.TD, name: [html.SELECT], style: _bg(color.output)}]},
			{type: html.FIELDSET_INPUT, list: [{type: html.TD, name: [html.HOVER], style: _bg(color.hover)}]},
			{type: html.FIELDSET_INPUT, list: [{type: html.TR, name: [html.HOVER], style: _bg(color.output)}]},
			{type: html.FIELDSET_FLOAT, style: [PLUGIN_STYLE]}, {type: html.DIV_FLOAT, style: [PLUGIN_STYLE]},
			{type: html.DIV_CARTE, list: [{type: html.DIV_ITEM, style: [TABLE_HEAD_STYLE, CARTE_ITEM_STYLE]}]},
			{type: html.DIV_CARTE, list: [{type: html.DIV_ITEM, style: [CARTE_ITEM_HOVER_STYLE]}]},
		].concat(list); const DF = ":", FS = ";"
		function render(pre, list) { return can.core.List(list, function(item) { if (!item) { return } var type = item.type+can.core.List(item.name, function(name) { return (name==html.HOVER? ice.DF: ice.PT)+name }).join("")
			if (!item.name && type.indexOf(ice.PT+html.SELECT) == -1 && type.indexOf(ice.DF+html.HOVER) == -1 && can.base.isArray(item.style) && item.style.join(ice.FS).indexOf("-hover-") > -1) { type += ice.DF+html.HOVER }
			return (item.style? (pre+ice.SP+type+" { "+(can.base.isArray(item.style)? can.core.List(item.style, function(item) {
				return can.core.Item(style[item], function(key, value) { return key&&value? key+DF+value: undefined }).join(FS)
			}).join(FS): can.core.Item(can.base.Obj(item.style), function(key, value) { return key+DF+value }).join(FS))+" }"): "")+(item.list? render(pre+ice.SP+type, item.list): "")
		}).join(ice.NL) } can.page.Append(can, document.head, ctx.STYLE, {"innerText": render(html.BODY+ice.PT+topic, list)})
	},
	style: function(can, style, target) { target = target||can._fields||can._target
		can.base.isObject(style) && !can.base.isArray(style)? can.page.style(can, target, style): can.page.ClassList.add(can, target, style)
	},
	field: function(can, type, item, target) { type = type||html.STORY, item = item||{}
		var name = can.core.Split(item.nick||item.name||"").pop(), title = !item.help || item.help == name || can.user.language(can) == "en"? name: name+"("+can.core.Split(item.help)[0]+")"
		return can.page.Append(can, target||can._output, [{view: [type, html.FIELDSET], list: [{text: [title, html.LEGEND]}, {view: [html.OPTION, html.FORM]}, html.ACTION, html.OUTPUT, html.STATUS]}])
	},
	input: function(can, item, value, target, style) { if ([html.BR, html.HR].indexOf(item.type) > -1) { return can.page.Append(can, target, [item]) }
		var icon = []
		var input = can.page.input(can, can.base.Copy({className: "", type: "", name: ""}, item), value); input.title = can.Conf(can.core.Keys(ctx.FEATURE, chat.TITLE, item.name))||""
		if (item.type == html.SELECT && item.value) { input._init = function(target) { target.value = value||item.value } }
		if (item.type == html.TEXT) { input.onkeydown = item.onkeydown||function(event) {
			can.onkeymap.input(event, can), can.onkeymap.selectOutput(event, can), event.key == lang.ENTER && can.onkeymap.prevent(event)
		}, icon.push({text: can.page.unicode.delete, className: "icon delete", onclick: function(event) {
			_input.value = ""; if (item.name == html.FILTER) { can.page.Select(can, can._output, html.TR, function(tr) { can.page.ClassList.del(can, tr, html.HIDE) }) }
		}}) }
		if (item.range) { input._init = function(target) { can.onappend.figure(can, item, target, function(sub, value, old) {
			target.value = value, can.core.CallFunc([can.onaction, item.name], [event, can, item.name])
		}) } }
		var _input = can.page.Append(can, target, [{view: [[html.ITEM, item.type, item.name].concat(style)], list: [input].concat(icon)}])[item.name]
		return _input
	},
	table: function(can, msg, cb, target, keys) { if (!msg || msg.Length() == 0) { return } var meta = can.base.Obj(msg.Option(mdb.META))
		var table = can.page.AppendTable(can, msg, target||can._output, msg.append, cb||function(value, key, index, line, array) {
			if (msg.append.length == 2 && msg.append[0] == mdb.KEY && msg.append[1] == mdb.VALUE) { if (key == mdb.VALUE) { key = line.key }
				line = {}, can.core.List(array, function(item) { line[item.key] = item.value })
			} function run(event, cmd, arg) { can.misc.Event(event, can, function(msg) {
				can.run(can.request(event, line, can.Option()), [ctx.ACTION, cmd].concat(arg))
			}) }
			return {text: [value, html.TD], onclick: function(event) { var target = event.target
				if (can.page.tagis(target, html.INPUT) && target.type == html.BUTTON) {
					meta && meta[target.name]? can.user.input(can.request(event, {action: target.name}), can, meta[target.name], function(args) { run(event, target.name, args) }): run(event, target.name)
				} else { can.sup.onimport.change(event, can.sup, key, event.target.innerText) || can.sup.onexport.record(can.sup, value, key, line) }
			}, ondblclick: function(event) { if ([mdb.KEY, mdb.HASH, mdb.ID].indexOf(key) > -1) { return }
				var item = can.core.List(can.Conf([ctx.FEATURE, mdb.INSERT]), function(item) { if (item.name == key) { return item } })[0]||{name: key, value: value}
				item.run = function(event, cmds, cb) { can.run(can.request(event, line, can.Option()), cmds, cb, true) }
				can.onmotion.modifys(can, event.target, function(event, value, old) { run(event, mdb.MODIFY, [key, value]) }, item)
			}}
		}); table && can.onappend.style(can, chat.CONTENT, table), msg.append && msg.append[msg.append.length-1] == ctx.ACTION && can.onappend.style(can, ctx.ACTION, table)
		return keys && can.page.RangeTable(can, table, can.core.List(keys, function(key) { return can.page.Select(can, table, html.TH, function(th, index) { if (th.innerHTML == key) { return index } })[0] })), table
	},
	board: function(can, text, target) { text && text.Result && (text = text.Result()); if (!text) { return }
		var code = can.page.Append(can, target||can._output, [{text: [can.page.Color(text), html.DIV, html.CODE]}]).code
		can.page.Select(can, code, html.INPUT_BUTTON, function(target) { target.onclick = function(event) { can.misc.Event(event, can, function(msg) {
			can.run(can.request(event, can.Option()), [ctx.ACTION, target.name])
		}) } }); return code.scrollBy && code.scrollBy(0, 10000), code
	},
	tools: function(can, msg, cb, target) {
		can.onimport.tool(can, can.base.Obj(msg.Option(ice.MSG_TOOLKIT), []).concat(can.misc.Search(can, "debug") == ice.TRUE? ["can.debug"]: []), cb, target)
	},
	layout: function(can, target, type, list) { const FLOW = html.FLOW, FLEX = html.FLEX
		switch (type||ice.AUTO) {
			case FLOW:
			case FLEX:
			case ice.AUTO: var count = 0, ui = {size: {}}; type = type == "" || type == ice.AUTO? FLEX: type
				function append(target, type, list) { can.page.ClassList.add(can, target, [html.LAYOUT, type]), can.core.List(list, function(item) {
					if (can.base.isString(item)) {
						ui[item] = can.page.Append(can, target, [item])._target
					} else if (can.base.isArray(item)) {
						append(can.page.Append(can, target, [html.LAYOUT])._target, type==FLOW? FLEX: FLOW, item)
					} else if (can.base.isObject(item)) {
						if (item.index) { item._index = count++, ui.size[item._index] = item.height||item.width
							can.onappend.plugin(can, item, function(sub) { can._plugins = can.misc.concat(can, can._plugins, [sub])
								item.layout = function(width, height) { sub.onimport.size(sub, height, width) }
							}, target, ui[item._index] = can.onappend.field(can, item.type, {name: item.index, help: item.help}, target)._target)
						} else { can.page.Append(can, target, [item]) }
					}
				}); return list }
				function calc(item, size, total) { return !ui.size[item]? size: ui.size[item] < 1? total*ui.size[item]: ui.size[item] }
				var defer = [], content_height, content_width; function layout(type, list, width, height) { var _width = width, _height = height; can.core.List(list, function(item) {
					if (item == html.CONTENT) { content_height = height, content_width = width
						return defer.push(function() { can.page.style(can, ui[item], html.HEIGHT, height, html.WIDTH, width) })
					}
					if (!can.page.isDisplay(ui[item])) { return } if (can.base.isObject(item)) { var meta = item; item = item._index }
					if (type == FLOW) { var h = calc(item, ui[item].offsetHeight, height)
						if (can.base.isObject(meta)) { meta.layout(width, h) }
						can.page.style(can, ui[item], html.WIDTH, width), height -= h
					} else { var w = calc(item, ui[item].offsetWidth||_width/list.length, _width), h = height
						if (can.base.isObject(meta)) { meta.layout(w = _width/list.length, h) }
						can.page.style(can, ui[item], html.HEIGHT, h, html.WIDTH, w), width -= w
					}
				}), can.core.List(list, function(item) { if (can.base.isArray(item)) { layout(type == FLOW? FLEX: FLOW, item, width, height) } }) }
				ui.layout = function(width, height, delay, cb) { can.onmotion.delay(can, function() { defer = [], layout(type, ui.list, width, height), defer.forEach(function(cb) { cb() }), cb && cb(content_height, content_width) }, delay||0) }
				ui.list = append(target, type, list||[html.PROJECT, [[html.CONTENT, html.PROFILE], html.DISPLAY]])
				return ui
			case "tabs-top":
				can.onappend.style(can, target, [html.LAYOUT, html.TABS, html.TOP])
				var ui = can.page.Append(can, target, [html.TABS, html.LIST])
				break
			case "tabs-left":
				can.onappend.style(can, target, [html.LAYOUT, html.TABS, html.LEFT])
				var ui = can.page.Append(can, target, [html.TABS, html.LIST])
				break
			case "tabs-right":
				can.onappend.style(can, target, [html.LAYOUT, html.TABS, html.RIGHT])
				var ui = can.page.Append(can, target, [html.LIST, html.TABS])
				break
			case "tabs-bottom":
				can.onappend.style(can, target, [html.LAYOUT, html.TABS, html.BOTTOM])
				var ui = can.page.Append(can, target, [html.LIST, html.TABS])
				break
		}
		ui.append = function(item, carte) {
			var tabs = can.page.Append(can, ui.tabs, [{type: html.DIV, inner: item.name, onclick: function(event) {
				can.onmotion.select(can, ui.tabs, html.DIV, tabs),
				can.page.SelectChild(can, ui.list, html.DIV, function(item) {
					can.page.ClassList.set(can, item, html.HIDE, item != view)
					if (item.className == "") { delete(item.className) }
				})
			}}])._target
			var view = can.page.Append(can, ui.list, [{view: html.HIDE, list: item.list}])._target
			if (ui.tabs.childElementCount == 1) { tabs.click() }
			return {
				close: function() {
					if (can.page.ClassList.has(can, tabs, html.SELECT)) {
						(tabs.nextSibling||tabs.previousSibling).click()
					} can.page.Remove(can, tabs), can.page.Remove(can, view)
				},
			}
		}
		can.core.List(list, function(item) {
			var view = ui.append(item, shy({
				close: function() { view.close() },
			}))
		})
		return ui
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
		can.runAction(can.request()._caller(), ctx.COMMAND, [meta.index], function(msg) { msg.Table(function(value) { can.onappend._plugin(can, value, meta, _cb, target, field) })}); return res
	},
	_plugin: function(can, value, meta, cb, target, field) { can.base.Copy(meta, value, true)
		meta.type = meta.type||chat.STORY, meta.name = meta.name||value.meta&&value.meta.name||"", meta.height = meta.height||can.ConfHeight(), meta.width = meta.width||can.ConfWidth()
		meta.inputs = can.base.getValid(meta.inputs, can.base.Obj(value.list))||[], meta.feature = can.base.getValid(meta.feature, can.base.Obj(value.meta))||{}
		meta.args = can.base.getValid(can.base.Obj(meta.args), can.base.Obj(meta.arg), can.base.Obj(value.args), can.base.Obj(value.arg))||[]
		can.onappend._init(can, meta, [chat.PLUGIN_STATE_JS], function(sub, skip) {
			sub.run = function(event, cmds, cb) {
				can.runActionCommand(sub.request(event), sub._index, cmds, cb)
			}
			sub._index = value.index||meta.index, can.base.isFunc(cb) && cb(sub, meta, skip)
		}, target||can._output, field)
	},
	_float: function(can, index, args) {
		can.onappend.plugin(can, {index: index, args: args, mode: chat.FLOAT}, function(sub) {
			can.getActionSize(function(left, top, width, height) { sub.onimport.size(sub, sub.ConfHeight(height/2), sub.ConfWidth(width), true)
				can.onmotion.move(can, sub._target, {left: left||0, top: (top||0)+height/4})
			}), sub.onaction.close = function() { can.page.Remove(can, sub._target) }
		}, can._root._target)
	},
	figure: function(can, meta, target, cb) { if (meta.type == html.BUTTON || meta.type == html.SELECT) { return }
		var input = meta.action||mdb.KEY, path = chat.PLUGIN_INPUT+input+nfs._JS; can.require([path], function(can) {
			// function _cb(sub, value, old) { if (value == old) { return } can.base.isFunc(cb)? cb(sub, value, old): can.onmotion.delay(can, function() { can.onmotion.focus(can, target, value||"") }) }
			function _cb(sub, value, old) { if (value == old) { return } can.base.isFunc(cb)? cb(sub, value, old): target.value = value }
			can.core.ItemCB(can.onfigure[input], function(key, on) { var last = target[key]||function(){}; target[key] = function(event) { can.misc.Event(event, can, function(msg) {
				function show(sub, cb) { can.base.isFunc(cb) && cb(sub, _cb), can.onlayout.figure(event, can, sub._target), can.onmotion.toggle(can, sub._target, true) }
				can.core.CallFunc(on, {event: event, can: can, meta: meta, cb: _cb, target: target, sub: target._can, last: last, cbs: function(cb) {
					target._can? show(target._can, cb): can.onappend._init(can, {type: html.INPUT, name: input, style: meta.name, mode: chat.FLOAT}, [path], function(sub) { sub.Conf(meta)
						sub.run = function(event, cmds, cb) { var msg = sub.request(event)
							if (meta.range) { for (var i = meta.range[0]; i < meta.range[1]; i += meta.range[2]||1) { msg.Push(mdb.VALUE, i) } cb(msg); return }
							(meta.run||can.run)(sub.request(event, can.Option()), cmds, cb, true)
						}, target._can = sub, can.base.Copy(sub, can.onfigure[input], true), sub._name = sub._path = path
						sub.hidden = function() { return !can.page.isDisplay(sub._target) }, sub.close = function() { can.page.Remove(can, sub._target), delete(target._can) }
						can.page.style(sub, sub._target, meta.style), can.base.isFunc(meta._init) && meta._init(sub, sub._target), show(sub, cb)
					}, can._root._target)
				}})
			}) } }), can.onfigure[input]._init && can.onfigure[input]._init(can, meta, target, _cb)
		})
	},
})
Volcanos(chat.ONLAYOUT, {_init: function(can, target) { target = target||can._root._target; var height = can.page.height(), width = can.page.width()
		can.page.SelectChild(can, target, can.page.Keys(html.FIELDSET_HEAD, html.FIELDSET_FOOT), function(field) { height -= field.offsetHeight })
		can.page.SelectChild(can, target, html.FIELDSET_LEFT, function(field) { can.user.isMobile || (width -= field.offsetWidth)
			var h = height; can.page.SelectChild(can, field, html.DIV_ACTION, function(action) { h -= action.offsetHeight })
			can.page.SelectChild(can, field, html.DIV_OUTPUT, function(output) { can.page.styleHeight(can, output, h) })
		})
		can.page.SelectChild(can, target, html.FIELDSET_MAIN, function(field) {
			can.page.SelectChild(can, field, html.DIV_ACTION, function(action) { height -= action.offsetHeight })
			can.page.SelectChild(can, field, html.DIV_OUTPUT, function(output) { can.page.styleHeight(can, output, height) })
		}), can.onengine.signal(can, chat.ONSIZE, can.request({}, {height: height, width: width}))
		can.page.style(can, document.body, kit.Dict(html.OVERFLOW, html.HIDDEN))
	},
	background: function(can, url, target) { can.page.style(can, target||can._root._target, "background-image", url == "" || url == "void"? "": 'url("'+url+'")') },
	figure: function(event, can, target, right) { if (!event || !event.target) { return {} } target = target||can._fields||can._target
		var rect = event.target == document.body? {left: can.page.width()/2, top: can.page.height()/2, right: can.page.width()/2, bottom: can.page.height()/2}: event.target.getBoundingClientRect()
		var layout = right? {left: rect.right, top: rect.top}: {left: rect.left, top: rect.bottom}
		can.getActionSize(function(left, top, width, height) { left = left||0, top = top||0, height = can.base.Max(height, can.page.height()-top)
			can.page.style(can, target, html.MAX_HEIGHT, can.base.Max(top+height-layout.top, height/2))
			if (layout.top+target.offsetHeight > top+height) { layout.top = top+height-target.offsetHeight }
			if (layout.left+target.offsetWidth > left+width) { layout.left = left+width-target.offsetWidth }
		}); return can.onmotion.move(can, target, layout), layout
	},

	display: function(can, target) { return can.page.Appends(can, target||can._output, [{view: [html.LAYOUT, html.TABLE], list: [
		{type: html.TR, list: [chat.CONTENT]}, {type: html.TR, list: [chat.DISPLAY]},
	]}]) },
	profile: function(can, target) {
		function toggle(view) { var show = view.style.display == html.NONE
			can.onmotion.toggle(can, view, show), view._toggle? view._toggle(event, show): can.onimport.layout && can.onimport.layout(can); return show
		} var gt = "❯", lt = "❮", down = lt, up = gt, button = {}
		var ui = can.page.Append(can, target||can._output, [{view: [html.LAYOUT, html.TABLE], list: [
			{view: [chat.PROJECT, html.TD], list: [chat.PROJECT]}, {type: html.TD, list: [ {type: html.TR, list: [{type: html.TR, list: [
				{view: [chat.CONTENT, html.TD], list: [chat.CONTENT,
					{view: [[html.TOGGLE, chat.PROJECT]], list: [{text: [gt, html.DIV]}], _init: function(target) {
						button[chat.PROJECT] = {target: target, show: lt, hide: gt}, target.onclick = function() { toggle(ui.project) }
					}},
					{view: [[html.TOGGLE, chat.PROFILE]], list: [{text: [lt, html.DIV]}], _init: function(target) {
						button[chat.PROFILE] = {target: target, show: gt, hide: lt}, target.onclick = function() { toggle(ui.profile) }
					}},
					{view: [[html.TOGGLE, chat.DISPLAY]], list: [{text: [up, html.DIV]}], _init: function(target) {
						button[chat.DISPLAY] = {target: target, show: down, hide: up}, target.onclick = function() { toggle(ui.display) }
					}},
				]}, {view: [chat.PROFILE, html.TD], list: [chat.PROFILE]},
			]}]}, {view: [chat.DISPLAY, html.TR], list: [chat.DISPLAY]} ]}
		] }]); function set(meta, button) { can.page.Appends(can, meta.target, [{text: [button, html.DIV]}]) }
		can.core.List([chat.PROJECT, chat.DISPLAY, chat.PROFILE], function(item) { var meta = button[item] 
			ui[item]._hide = function() { set(meta, meta.hide) }, ui[item]._show = function() { set(meta, meta.show) }
		}); return can.ui = ui
	},
})
Volcanos(chat.ONMOTION, {_init: function(can, target) {
		target.onclick = function(event) { if (can.page.tagis(event.target, html.SELECT, html.INPUT, html.TEXTAREA)) { return }
			if (can.page.tagis(event.target, html.A) && can.user.isWebview) { return event.shiftKey? window.outopen(event.target.href): can.user.open(event.target.href) }
			can.page.Select(can, target, can.page.Keys("div.carte.float"), function(target) { can.page.Remove(can, target) })
		}
	},
	story: {
		_hash: {
			spark: function(can, meta, target) {
				meta[mdb.NAME] == html.INNER? can.onmotion.copy(can, target): can.page.Select(can, target, html.SPAN, function(item) { can.onmotion.copy(can, item) })
			},
		},
		auto: function(can, target) { var that = this; target = target||can._output
			can.page.Select(can, target, wiki.STORY_ITEM, function(item) { var meta = item.dataset; can.page.style(can, item, can.base.Obj(meta.style))
				can.core.CallFunc(that._hash[meta.type]||that._hash[target.tagName], [can, meta, item])
			})
			can.page.Select(can, target, html.INPUT_BUTTON, function(target) {
				if (target.value == target.name) { target.value = can.user.trans(can, target.name) }
			})
			can.page.Select(can, target, html.IFRAME, function(item) {
				// can.page.style(can, item, html.HEIGHT, can.ConfHeight()-88, html.WIDTH, can.ConfWidth()-30)
			})
		},
	},
	clearFloat: function(can) {
		can.page.SelectChild(can, can._root._target, "div.float", function(target) {
			can.page.Remove(can, target)
		})
	},
	clearCarte: function(can) {
		can.page.SelectChild(can, can._root._target, "div.carte.float", function(target) {
			can.page.Remove(can, target)
		})
	},
	clearInput: function(can) {
		can.page.SelectChild(can, can._root._target, "div.input.float", function(target) {
			can.page.Remove(can, target)
		})
	},

	hidden: function(can, target, show) { target = target||can._target
		if (target.length > 0) { return can.core.List(target, function(target) { can.onmotion.hidden(can, target, show) }) }
		return can.page.ClassList.set(can, target, html.HIDE, !show)? target._hide && target._hide(): target._show && target._show(), show
	},
	toggle: function(can, target, show, hide) { target = target||can._target
		if (show === true) { return can.onmotion.hidden(can, target, true) } if (show === false) { return can.onmotion.hidden(can, target, false) }
		var status = can.page.isDisplay(target); if (status? can.base.isFunc(hide) && hide(): can.base.isFunc(show) && show()) { return !status }
		return can.onmotion.hidden(can, target, !status)
	},
	select: function(can, target, name, which, cb) {
		var old = can.page.Select(can, target, name, function(target, index) { if (can.page.ClassList.has(can, target, html.SELECT)) { return index } })[0]
		can.base.isUndefined(which) || can.page.Select(can, target, name, function(target, index) {
			if (can.page.ClassList.set(can, target, html.SELECT, target == which || which == index)) { can.base.isFunc(cb) && cb(target) }
		}); return old
	},
	modify: function(can, target, cb, item) { var back = target.innerHTML
		if (back.length > 120 || back.indexOf(ice.NL) > -1) { return can.onmotion.modifys(can, target, cb) }
		var ui = can.page.Appends(can, target, [{type: html.INPUT, value: target.innerText, style: {width: can.base.Max(target.offsetWidth-20, 400)}, onkeydown: function(event) { switch (event.key) {
			case lang.ENTER: target.innerHTML = event.target.value, event.target.value == back || cb(event, event.target.value, back); break
			case lang.ESCAPE: target.innerHTML = back; break
			default: can.onkeymap.input(event, can)
		} }, _init: function(target) { item && can.onappend.figure(can, item, target, cb), can.onmotion.focus(can, target), can.onmotion.delay(can, function() { target.click() }) }}])
	},
	modifys: function(can, target, cb, item) { var back = target.innerHTML
		var ui = can.page.Appends(can, target, [{type: html.TEXTAREA, value: target.innerText, style: {
			height: can.base.Min(target.offsetHeight-20, 60), width: can.base.Max(target.offsetWidth-20, 400),
		}, onkeydown: function(event) { switch (event.key) {
			case lang.ENTER: if (event.ctrlKey) { target.innerHTML = event.target.value, event.target.value == back || cb(event, event.target.value, back) } break
			case lang.ESCAPE: target.innerHTML = back; break
			default: can.onkeymap.input(event, can)
		} }, _init: function(target) { item && can.onappend.figure(can, item, target), can.onmotion.focus(can, target), can.onmotion.delay(can, function() { target.click() }) }}])
	},
	tableFilter: function(can, target, value) { can.page.Select(can, target, html.TR, function(tr, index) {
		index > 0 && can.page.ClassList.set(can, tr, html.HIDDEN, can.page.Select(can, tr, html.TD, function(td) { if (td.innerText.indexOf(value) > -1) { return td } }) == 0)
	}) },
	highlight: function(can, value, target) {
		can.page.Select(can, target||can._output, [html.TBODY, html.TR], function(tr) {
			can.page.ClassList.set(can, tr, html.HIDDEN, can.page.Select(can, tr, html.TD, function(td) { td._text = td._text||td.innerText
				if (td.innerText.indexOf(value) > -1) {
					td.innerHTML = td._text.replaceAll(value, "<span style='background-color:yellow;color:red;'>"+value+"</span>")
					return td
				} else {
					td.innerText = td._text
				}
			}).length == 0)
		})
	},

	delayResize: function(can, target, key) {
		can.onmotion.delay(can, function() { can.page.Select(can, target, key, function(_target) {
			can.page.style(can, target, html.WIDTH, _target.offsetWidth+10, html.LEFT, (window.innerWidth-_target.offsetWidth)/2)
		}) })
	},
	delayLong: function(can, cb, interval, key) { can.onmotion.delay(can, cb, interval||300, key) },
	delay: function(can, cb, interval, key) { if (!key) { return can.core.Timer(interval||30, cb) }
		can._delay_list = can._delay_list||shy({}, [])
		var last = can._delay_list.meta[key]||0, self = can._delay_list.meta[key] = can._delay_list.list.push(cb)
		can.core.Timer(interval||30, function() { cb(self, last, can._delay_list.meta[key]) })
	},
	clear: function(can, target) { return can.page.Modify(can, target||can._output, ""), target },
	cache: function(can, next) { var list = can.base.getValid(can.base.Obj(can.core.List(arguments).slice(2)), [can._output])
		can.core.List(list, function(target) { target && target._cache_key && can.page.Cache(target._cache_key, target, target.scrollTop+1) })
		var key = next(can._cache_data = can._cache_data||{}, list[0]._cache_key); return key && can.core.List(list, function(target) { if (!target) { return }
			var pos = can.page.Cache(target._cache_key = key, target); if (pos) { target.scrollTo && target.scrollTo(0, pos-1); return target }
		}).length > 0
	},
	selectRange: function(target) { target && target.setSelectionRange && target.setSelectionRange(0, target.value.length) },
	share: function(event, can, input, args) { var _args = args
		return can.user.input(event, can, input, function(args) { can.onengine.signal(can, chat.ONSHARE, can.request(event, {args: [mdb.TYPE, chat.FIELD].concat(_args||[], args||[])})) })
	},
	focus: function(can, target, value) { if (!target) { return } if (!can.base.isUndefined(value)) { target.value = value }
		target.focus(), target.setSelectionRange && target.setSelectionRange(0, target.value.length)
	},
	copy: function(can, target, cb) { target.title = "点击复制", target.onclick = function(event) { can.user.copy(event, can, target.innerText), can.base.isFunc(cb) && cb(event) } },

	move: function(can, target, layout, cb) { var begin; layout = layout||{}
		can.page.style(can, target, layout), target.onmousedown = function(event) {
			if (event.target != target && !event.ctrlKey) { return }
			can.onkeymap.prevent(event)
			// if (can.page.tagis(event.target, html.BUTTON, html.SELECT)) { return }
			// if (!event.ctrlKey && !can.page.tagis(target, html.FIELDSET)) { return }
			layout.height = target.offsetHeight, layout.width = target.offsetWidth
			layout.left = target.offsetLeft, layout.top = target.offsetTop
			begin = can.base.Copy({x: event.x, y: event.y}, layout)
		}, target.onmouseup = function(event) { begin = null }, target.onmousemove = function(event) { if (!begin) { return }
			// if (event.target != target) { return }
			// if (can.page.tagis(event.target, html.BUTTON, html.SELECT)) { return }
			if (event.shiftKey) {
				layout.height = begin.height + event.y - begin.y, layout.width = begin.width + event.x - begin.x 
				can.page.style(can, target, html.HEIGHT, layout.height, html.WIDTH, layout.width)
			} else {
				layout.left = begin.left + event.x - begin.x , layout.top = begin.top + event.y - begin.y
				can.page.style(can, target, html.LEFT, layout.left, html.TOP, layout.top)
			}
		}
	},
	hide: function(can, time, cb, target) { target = target||can._target, can.page.style(can, target, html.OPACITY, 1)
		time = can.base.isObject(time)? time: {value: 10, length: time||20}
		can.core.Timer(time, function(event, value, index) { can.page.style(can, target, html.OPACITY, 1-(index+1)/time.length) },
			function() { can.base.isFunc(cb) && cb(), can.page.style(can, target, html.DISPLAY, html.NONE) })
	},
	show: function(can, time, cb, target) { target = target||can._target, can.page.style(can, target, html.OPACITY, 0, html.DISPLAY, html.BLOCK)
		time = can.base.isObject(time)? time: {interval: 10, length: time||30}
		can.core.Timer(time, function(event, value, index) { can.page.style(can, target, html.OPACITY, (index+1)/time.length) }, cb)
	},
})
Volcanos(chat.ONKEYMAP, {_init: function(can, target) { target = target||document.body
		can.onkeymap._build(can), target.onkeydown = function(event) { can.misc.Event(event, can, function(msg) {
			if (can.page.tagis(event.target, html.SELECT, html.INPUT, html.TEXTAREA)) { return }
			var msg = can.request(event, {"model": "normal"}); if (msg.Option(ice.MSG_HANDLE) == ice.TRUE) { return }
			if (can.user.isWebview && event.metaKey) { msg.Option("model", "webview"); if (event.key >= "0" && event.key <= "9") {
				can.onengine.signal(can, chat.ONKEYDOWN, msg); if (msg.Option(ice.MSG_HANDLE) == ice.TRUE) { return }
			} }
			can.onengine.signal(can, chat.ONKEYDOWN, msg); if (msg.Option(ice.MSG_HANDLE) == ice.TRUE) { return }
			can._keylist = can.onkeymap._parse(event, can, msg.Option("model"), can._keylist, can._output)
		}) }, target.onkeyup = function(event) { can.misc.Event(event, can, function(msg) {
			if (can.page.tagis(event.target, html.SELECT, html.INPUT, html.TEXTAREA)) { return }
			var msg = can.request(event, {"model": "normal"}); if (msg.Option(ice.MSG_HANDLE) == ice.TRUE) { return }
			can.onengine.signal(can, chat.ONKEYUP, msg); if (msg.Option(ice.MSG_HANDLE) == ice.TRUE) { return }
			can._keylist = can.onkeymap._parse(event, can, msg.Option("model"), can._keylist, can._output)
		}) }
	},
	_build: function(can) { can.core.Item(can.onkeymap._mode, function(item, value) { var engine = {list: {}}
		can.core.Item(value, function(key, cb) { var map = engine; for (var i = 0; i < key.length; i++) {
			if (!map.list[key[i]]) { map.list[key[i]] = {list: {}} } map = map.list[key[i]]; if (i == key.length-1) { map.cb = cb }
		} }), can.onkeymap._engine[item] = engine
	}) },
	_parse: function(event, can, mode, list, target) { list = list||[]
		if (event.metaKey && !can.user.isWebview) { return } if ([lang.META, lang.ALT, lang.CONTROL, lang.SHIFT].indexOf(event.key) > -1) { return list }
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
		webview: {
			"[": function(event, can, target) { history.back() },
			"]": function(event, can, target) { history.forward() },
			r: function(event, can, target) { can.user.reload(true) },
			w: function(event, can, target) { can.user.close() },
			q: function(event, can, target) { window.terminate() },

			o: function(event, can, target) { window.openurl(location.href) },
			p: function(event, can, target) { window.openapp("QuickTime Player") },
			t: function(event, can, target) { window.opencmd("cd contexts; pwd") },
			f: function(event, can, target) { can.onengine.signal(can, chat.ONOPENSEARCH, can.request({}, {type: mdb.FOREACH})) },
		},
		insert: {
			Escape: function(event, can, target) { if (event.key == lang.ESCAPE) { target.blur() } },
			Enter: function(event, can, target) { if (event.key != lang.ENTER) { return }
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
					if (target.value[end] == ice.SP && target.value[i] != ice.SP) { break }
					if (target.value[end] != ice.SP && target.value[i] == ice.SP) { break }
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
			if (!can.page.ClassList.set(can, item, html.HIDE, item.innerText.toLowerCase().indexOf(name) == -1)) {
				for (item = item.parentNode; item != target; item = item.parentNode) {
					can.page.ClassList.del(can, item, html.HIDE), can.page.ClassList.del(can, item.previousSibling, html.HIDE)
					can.page.Select(can, item.previous, "div.switch", function(item) {
						can.page.ClassList.add(can, item, "open")
					})
				}
			}
		}), can.onkeymap.selectCtrlN(event, can, target, html.DIV_ITEM+":not(.hide)", function(target) {
			target.click(), can.onmotion.focus(can, event.target)
		})
		if (event.key == lang.ENTER) { can.page.Select(can, target, html.DIV_ITEM+":not(.hide)")[0].click(), can.onmotion.focus(can, event.target) }
		if (event.key == lang.ESCAPE) { event.target.blur() }
	},
	selectInputs: function(event, can, cb, target) { if (can.page.ismodkey(event)) { return } if (event.key == lang.ESCAPE) { return target.blur() }
		if (event.ctrlKey || event.key == lang.TAB) { if (can.base.isUndefined(target._index)) { target._index = -1, target._value = target.value }
			function select(order) { if (order == -1) { target.value = target._value }
				var index = 0; return can.page.Select(can, can._output, [html.TBODY, html.TR], function(tr) { if (can.page.ClassList.has(can, tr, html.HIDDEN)) { return }
					can.page.ClassList.del(can, tr, html.SELECT); if (order == index++) { can.page.ClassList.add(can, tr, html.SELECT)
						can.page.Select(can, tr, html.TD, function(td, index) { index == 0 && (target.value = td.innerText) })
					} return tr
				}).length
			}
			var total = select(target._index), key = event.key; if (event.key == lang.TAB) { key = event.shiftKey? "p": "n" } switch (key) {
				case "n": select(target._index = (target._index+2) % (total+1) - 1); break
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
			var head = can.page.Select(can, can._output, html.TH, function(th, order) { return th.innerText })
			can.page.Select(can, tr, html.TD, function(td, index) { can.Option(head[index], td.innerText) }), can.Update(event)
		} })
	},
	prevent: function(event) { event && (event.stopPropagation(), event.preventDefault()); return true },
})
