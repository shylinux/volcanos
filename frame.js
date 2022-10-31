Volcanos(chat.ONENGINE, {_init: function(can, meta, list, cb, target) {
		if (can.misc.Search(can, ice.MSG_SESSID)) { can.misc.CookieSessid(can, can.misc.Search(can, ice.MSG_SESSID))
			return can.misc.Search(can, ice.MSG_SESSID, "") 
		} can.user.title(can.misc.Search(can, chat.TITLE)||can.misc.Search(can, ice.POD)||location.host)

		can.run = function(event, cmds, cb) { var msg = can.request(event); cmds = cmds||[]
			return (can.onengine[cmds[0]]||can.onengine._remote)(event, can, msg, can, cmds, cb)
		}; can.require([can.volcano], null, function(can, key, sub) { can[key] = sub })

		can.core.Next(list, function(item, next) { item.type = chat.PANEL
			can.onappend._init(can, can.base.Copy(item, can.core.Value(can, [chat.RIVER, item.name])), item.list, function(sub) {
				sub.run = function(event, cmds, cb) { var msg = sub.request(event); cmds = cmds||[]
					return (can.onengine[cmds[0]]||can.onengine._remote)(event, can, msg, sub, cmds, cb)
				}, can[item.name] = sub
				can.core.ItemCB(sub.onaction, function(key, cb) {
					can.onengine.listen(can, key, function(msg) { can.core.CallFunc(cb, {can: sub, msg: msg}) })
				}), can.core.CallFunc([sub.onaction, chat._INIT], {can: sub, cb: next, target: sub._target})
				can.core.Item(sub.onplugin, function(key, cmd) {
					sub.onplugin.hasOwnProperty(key) && can.base.isFunc(cmd) && can.onengine.plugin(sub, key, cmd)
				})
			}, target)
		}, function() { can.onmotion._init(can, target), can.onkeymap._init(can), can.misc.Info(can.user.title(), ice.RUN, can)
			can.onengine.listen(can, chat.ONSEARCH, function(msg, word) { word[0] == ctx.COMMAND && can.run(msg, ["can.command"]) })
			can.onengine.signal(can, chat.ONMAIN, can.request()), can.base.isFunc(cb) && cb(can)
		})
	},
	_search: function(event, can, msg, panel, cmds, cb) {
		var sub, mod = can, fun = can, key = ""; can.core.List(cmds[1].split(ice.PT), function(value) {
			fun && (sub = mod, mod = fun, fun = mod[value], key = value)
		}); if (!sub || !mod || !fun) { can.misc.Warn(ice.ErrNotFound, cmds); return can.base.isFunc(cb) && cb(msg.Echo(ice.ErrWarn, ice.ErrNotFound, cmds)) }
		return can.core.CallFunc(fun, {
			event: event, can: sub, msg: msg, cmds: cmds.slice(2), cb: cb, target: sub._target, button: key, cmd: key, arg: cmds.slice(2), list: cmds.slice(2),
		}, mod)
	},
	_remote: function(event, can, msg, panel, cmds, cb) {
		if (panel.onengine._engine(event, can, msg, panel, cmds, cb)) { return }
		if (panel.onengine._plugin(event, can, msg, panel, cmds, cb)) { return }
		if (panel.onengine._static(event, can, msg, panel, cmds, cb)) { return }

		var toast, _toast = msg.Option(chat._TOAST); if (_toast) { can.onmotion.delay(can, function() { toast = toast||can.user.toastProcess(msg._can, _toast) }, 500) }
		msg.option = can.core.List(msg.option, function(item) { return [chat._TOAST, ice.MSG_HANDLE].indexOf(item) > -1 && delete(msg[item])? undefined: item })
		can.getHeader(chat.TOPIC, function(topic) { msg.Option(chat.TOPIC, topic) })
		if (can.base.isUndefined(msg._daemon)) { var sub = msg._can
			can.base.isUndefined(sub._daemon) && can.ondaemon._list[0] && (sub._daemon = can.ondaemon._list.push(sub)-1)
			if (sub._daemon) { msg.Option(ice.MSG_DAEMON, can.core.Keys(can.ondaemon._list[0], sub._daemon)) }
		} can.onengine.signal(panel, chat.ONREMOTE, can.request({}, {_follow: panel._follow, _msg: msg, _cmds: cmds}))

		var names = msg.Option(chat._NAMES)||panel._names||((can.Conf("iceberg")||Volcanos.meta.iceberg)+panel._name)
		can.misc.Run(event, can, {names: names, daemon: msg._daemon}, cmds, function(msg) { toast && toast.close(), toast = true
			can.base.isFunc(cb) && cb(msg), Volcanos.meta.pack[can.core.Keys(panel._name, cmds.join(ice.FS))] = msg
		})
	},
	_static: function(event, can, msg, panel, cmds, cb) {
		if (can.user.isLocalFile) { var msg = can.request(event); msg.Clear(ice.MSG_APPEND)
			var res = Volcanos.meta.pack[can.core.Keys(panel._name, cmds.join(ice.FS))]; res? msg.Copy(res): can.user.toast(can, "miss data")
			return can.base.isFunc(cb) && cb(msg), true
		} return false
	},
	_engine: function(event, can, msg, panel, cmds, cb) { return false },
	_plugin: function(event, can, msg, panel, cmds, cb) {
		if (cmds[0] == ctx.ACTION && cmds[1] == ice.RUN) {
			var p = can.onengine.plugin(can, cmds[2]); if (p) {
				return can.core.CallFunc(p, {can: p.can||panel, msg: msg, arg: cmds.slice(3), cmds: cmds.slice(3), cb: cb}), true
			}
		}
		var p = can.onengine.plugin(can, cmds[0]), n = 1; if (p) {
			if (p.meta && p.meta[cmds[1]] && cmds[0] == ctx.ACTION) { n = 3 } else if (p.meta && p.meta[cmds[0]]) { n = 2 }
			return can.core.CallFunc(p, {can: p.can||panel, msg: msg, arg: cmds.slice(n), cmds: cmds.slice(n), cb: cb}), true
		} return false
	},
	plugin: shy(function(can, name, command) {
		if (can.base.isUndefined(name)) { return } else if (can.base.isUndefined(command)) {
			if (!can.base.isString(name) || name.indexOf("can.") == -1) { return }
			return arguments.callee.meta[can.base.trimPrefix(name, "can.")]
		}
		var type = html.TEXT; command.list = can.core.List(command.list, function(item) {
			return can.base.isString(item) && (item = can.core.SplitInput(item, type)), type = item.type, item
		}), command.can = can, arguments.callee.meta[can.base.trimPrefix(name, "can.")] = command, command.name = name
	}),
	listen: shy(function(can, name, cb) { arguments.callee.meta[name] = (arguments.callee.meta[name]||[]).concat(cb) }),
	signal: function(can, name, msg) { msg = msg||can.request(); var _msg = name == chat.ONREMOTE? msg.Option("_msg"): msg
		_msg.Option(ice.LOG_DISABLE) == ice.TRUE || can.misc.Log(gdb.SIGNAL, name, can._name, (msg._cmds||[]).join(ice.SP), _msg)
		return can.core.List(can.onengine.listen.meta[name], function(cb) { can.core.CallFunc(cb, {event: msg._event, msg: msg}) }).length
	},
})
Volcanos(chat.ONDAEMON, {_init: function(can, name) { if (can.user.isLocalFile) { return }
		can.misc.WSS(can, {type: html.CHROME, name: can.misc.Search(can, cli.DAEMON)||name||"", text: can.user.title()}, function(event, msg, cmd, arg) { if (!msg) { return }
			var sub = can.ondaemon._list[msg.Option(ice.MSG_TARGET)]||can; can.base.isFunc(sub.ondaemon[cmd])?
				can.core.CallFunc(sub.ondaemon[cmd], {can: can, msg: msg, sub: sub, cmd: cmd, arg: arg, cb: function() { msg.Reply() }}):
					can.onengine._search({}, can, msg, can, [chat._SEARCH, cmd].concat(arg), function() { msg.Reply() })
		})
	}, _list: [""],
	pwd: function(can, arg) { can._wss_name = can.ondaemon._list[0] = arg[0] },
	toast: function(can, sub, arg) { can.core.CallFunc(can.user.toast, [sub].concat(arg)) },
	refresh: function(can, sub) { can.base.isFunc(sub.Update) && sub.Update() },
	action: function(can, msg, sub, arg) {
		if (can.page.SelectInput(can, sub._option, arg[0], function(target) { return arg[1] && (target.value = arg[1]), target.focus(), target })) { return }
		(can.core.Value(sub, chat._OUTPUTS_CURRENT)||sub).runAction(can.request({}, msg), arg[0], arg.slice(1))
	},
	input: function(can, msg, sub, arg) { can.page.Select(can, sub._target, "input:focus", function(target) { target.value += arg[0] }) },
	grow: function(can, msg, sub, arg) {
		if (sub.onimport && sub.onimport._grow) {
			sub.onimport._grow(sub, msg, can.page.Color(arg.join("")))
		} if (sub.sup && sub.sup.onimport._grow) {
			sub.sup.onimport._grow(sub.sup, msg, can.page.Color(arg.join("")))
		}
	},
	close: function(can, msg, sub) { can.user.close() },
	exit: function(can, msg, sub) { can.user.close() },
})
Volcanos(chat.ONAPPEND, {_init: function(can, meta, list, cb, target, field) {
		meta.name = (meta.name||"").split(ice.SP)[0].split(ice.PT).pop()
		field = field||can.onappend.field(can, meta.type, meta, target).first
		var legend = can.page.Select(can, field, html.LEGEND)[0]
		var option = can.page.Select(can, field, html.FORM_OPTION)[0]
		var action = can.page.Select(can, field, html.DIV_ACTION)[0]
		var output = can.page.Select(can, field, html.DIV_OUTPUT)[0]
		var status = can.page.Select(can, field, html.DIV_STATUS)[0]

		var sub = Volcanos(meta.name, {_root: can._root||can, _follow: can.core.Keys(can._follow, meta.name), _target: field,
			_legend: legend, _option: option, _action: action, _output: output, _status: status, _history: [], _inputs: {}, _outputs: [],
			Status: function(key, value) {
				if (can.base.isObject(key)) { return can.core.Item(key, sub.Status), key }
				can.page.Select(can, status, [[[html.DIV, key], html.SPAN]], function(target) {
					if (can.base.beginWith(value, ice.HTTP)) { value = can.page.Format(html.A, value) }
					return can.base.isUndefined(value)? (value = target.innerHTML): (target.innerHTML = value)
				}); return value
			},
			Action: function(key, value) { return can.page.SelectArgs(can, action, key, value)[0] },
			Option: function(key, value) { return can.page.SelectArgs(can, option, key, value)[0] },
			Update: function(event, cmds, cb, silent) { sub.onappend._output0(sub, sub.Conf(), event||{}, cmds||sub.Input(), cb, silent); return true },
			Focus: function() { can.page.SelectOne(can, option, html.INPUT_ARGS, function(target) { target.focus() }) },
			Input: function(cmds, save) { cmds = cmds && cmds.length > 0? cmds: can.page.SelectArgs(sub), cmds = can.base.trim(cmds)
				return !save || cmds[0] == ctx.ACTION || can.base.Eq(sub._history[sub._history.length-1], cmds) || sub._history.push(cmds), cmds
			},
			Clone: function() { meta.args = can.page.SelectArgs(can)
				can.onappend._init(can, meta, list, function(sub) { can.base.isFunc(cb) && cb(sub, true), can.onmotion.delay(can, sub.Focus) }, target)
			},
		}, list, function(sub) { sub.Conf(meta), meta.feature = can.base.Obj(meta.feature, {})
			can.page.ClassList.add(can, field, meta.index? meta.index.split(ice.PT).pop(): meta.name)
			var style = can.base.getValid(meta.style||meta.feature.style); switch (typeof style) {
				case lang.STRING: can.page.ClassList.add(can, field, style); break
				case lang.OBJECT: can.page.style(can, sub._target, style); break
			} sub.Mode() != meta.type && can.page.ClassList.add(can, field, sub.Mode())

			sub._trans = can.base.Copy(sub._trans||{}, can.core.Value(sub, [chat.ONACTION, chat._TRANS])), meta.inputs && sub.onappend._option(sub, meta, sub._option, meta.msg)
			if (meta.msg) { var msg = sub.request(); msg.Copy(can.base.Obj(meta.msg)), sub.onappend._output(sub, msg, meta.display||msg.Option(ice.MSG_DISPLAY)||meta.feature.display) }

			sub._legend[chat.ONMOUSEENTER] = function(event) {
				can.user.carte(event, sub, sub.onaction, sub.onaction.list.concat([[ctx.ACTION].concat(can.core.Item(meta.feature._trans))]), function(event, button, meta) {
					var _sub = can.core.Value(sub, chat._OUTPUTS_CURRENT)
					var cb = can.core.Value(_sub, [chat.ONACTION, button]); if (can.base.isFunc(cb)) { return cb(event, _sub, button) }
					var cb = meta[button]||meta[chat._ENGINE]; if (can.base.isFunc(cb)) { return cb(event, sub, button, _sub) }
				})
			}, can.base.isFunc(cb) && cb(sub)
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
				sub.run = function(event, cmds, cb, silent) { var msg = can.request(event, kit.Dict(chat._TOAST, ice.PROCESS))
					msg.RunAction(event, sub, cmds) || msg.RunAction(event, can.core.Value(can, chat._OUTPUTS_CURRENT), cmds) || can.Update(event, can.Input(cmds, !silent), cb, silent)
				}, can._inputs[item.name] = sub, sub.sup = can

				can.core.ItemCB(sub.onaction, function(key, cb) { sub._target[key] = function(event) { cb(can.request(event)._event, sub) } })
				can.core.ItemCB(item, function(key, cb) { sub._target[key] = function(event) { cb(can.request(event)._event, sub) } })
				skip? next(): can.core.CallFunc([sub.onaction, chat._INIT], {can: sub, meta: item, cb: next, target: sub._target});
				(item.action||can.core.Value(meta, [ctx.FEATURE, ctx.INPUTS])) && can.onappend.figure(sub, item, sub._target, function(_sub, value) {
					sub._target.value = value, can.onmotion.focus(can, sub._target), can.onmotion.delay(can, function() { can.Update() })
				})
			})
		}; can.core.Next(([{type: html.BUTTON, name: cli.CLOSE}]).concat(can.base.getValid(can.core.Value(can, [chat.ONIMPORT, mdb.LIST]), can.base.Obj(meta.inputs, []))||[]), add)
	},
	_action: function(can, list, action, meta) { meta = meta||can.onaction||{}, action = action||can._action, can.onmotion.clear(can, action)
		return can.core.List(can.page.inputs(can, can.base.getValid(can.base.Obj(list), can.core.Value(can, [chat.ONACTION, mdb.LIST]), meta != can.onaction? can.core.Item(meta): [])||[]), function(item) {
			can.base.isUndefined(item) || can.onappend.input(can, item == ""? /* 空白 */ {type: html.SPACE}:
				can.base.isString(item)? /* 按键 */ {type: html.BUTTON, name: item, value: can.user.trans(can, item, meta._trans), onclick: function(event) {
					var cb = meta[item]||meta[chat._ENGINE]; cb? can.core.CallFunc(cb, {event: event, can: can, button: item}): can.run(event, [ctx.ACTION, item].concat(can.sup.Input()))
				}, onkeydown: function(event) { if (event.key == lang.ENTER) { target.click() }}}:
				item.length > 0? /* 列表 */ {type: html.SELECT, name: item[0], values: item.slice(1), onchange: function(event) { var button = item[event.target.selectedIndex+1]
					meta[item[0]]? can.core.CallFunc(meta[item[0]], [event, can, item[0], button]): meta[button] && can.core.CallFunc(meta[button], [event, can, button])
				}}: /* 其它 */ item, "", action)
		}), meta
	},
	_output0: function(can, meta, event, cmds, cb, silent) { var msg = can.request(event); if (msg.RunAction(event, can, cmds)) { return }
		if (msg.Option(ice.MSG_HANDLE) != ice.TRUE && cmds && cmds[0] == ctx.ACTION && meta.feature[cmds[1]]) { var msg = can.request(event, {action: cmds[1]})
			return can.user.input(event, can, meta.feature[cmds[1]], function(args) { can.Update(can.request(event, {_handle: ice.TRUE}, can.Option()), cmds.slice(0, 2).concat(args)) })
		}
		return can.onengine._plugin(event, can, msg, can, cmds, cb) || can.run(event, cmds, cb||function(msg) { if (silent) { return }
			if ((msg._can == can || msg._can == can.core.Value(can, chat._OUTPUTS_CURRENT)) && can.core.CallFunc([can, chat.ONIMPORT, ice.MSG_PROCESS], {can: can, msg: msg})) { return }
			if (cmds && cmds[0] == ctx.ACTION) { if (cmds[1] == mdb.CREATE || cmds[1] == mdb.INSERT || msg.Length() == 0 && msg.Result() == "") { return can.Update() } }
			can.onappend._output(can, msg, meta.display||msg.Option(ice.MSG_DISPLAY)||meta.feature.display)
		})
	},
	_output: function(can, msg, display, output, action, cb) { display = display||chat.PLUGIN_TABLE_JS, output = output||can._output
		Volcanos(display, {_root: can._root, _follow: can.core.Keys(can._follow, display), _target: output, _fields: can._target,
			_legend: can._legend, _option: can._option, _action: can._action, _output: output, _status: can._status,
			Update: can.Update, Option: can.Option, Action: can.Action, Status: can.Status,
		}, [display, chat.PLUGIN_TABLE_JS], function(sub) { sub.Conf(can.Conf())
			sub.run = function(event, cmds, cb, silent) {
				can.request(event).RunAction(event, sub, cmds) || can.Update(event, can.Input(cmds, !silent), cb, silent)
			}, can._outputs && can._outputs.push(sub), sub.sup = can

			sub._index = can._index, sub._msg = msg, sub.Conf(sub._args = can.base.ParseURL(display))
			sub._trans = can.base.Copy(sub._trans||{}, can._trans, can.core.Value(sub, [chat.ONACTION, chat._TRANS]))
			if (sub.onimport && can.base.isArray(sub.onimport.list) && sub.onimport.list.length > 0) {
				can.onmotion.clear(can, can._option), can.onappend._option(can, {inputs: can.page.inputs(can, sub.onimport.list) })
			}
			can.core.CallFunc([sub, chat.ONIMPORT, chat._INIT], {can: sub, msg: msg, cb: function(msg) {
				can.onmotion.clear(can, can._action), can.user.isMobile && can.ConfHeight() > can.ConfWidth() && can.onmotion.hidden(can, can._action)
				action === false || sub.onappend._action(sub, can.Conf(ice.MSG_ACTION)||msg.Option(ice.MSG_ACTION), action||can._action)
				action === false || sub.onappend._status(sub, msg.Option(ice.MSG_STATUS)), sub.onappend.tools(sub, msg)
				can.core.List([chat.FLOAT, chat.FULL, chat.CMD], function(mode) { can.page.ClassList.has(can, can._target, mode) && sub.onlayout[mode](sub) })
				can.user.isMobile && can.isCmdMode() && can.page.style(can, can._output, html.MAX_HEIGHT, can.ConfHeight())
				can.onmotion.story.auto(can, can._output), can.onaction._output(can, msg), can.base.isFunc(cb) && cb(msg)
			}, target: output})
		})
	},
	_status: function(can, list, status) { status = status||can._status, can.onmotion.clear(can, status)
		can.core.List(can.base.Obj(list, can.core.Value(can, [chat.ONEXPORT, mdb.LIST])), function(item) { item = can.base.isString(item)? {name: item}: item
			if (can.base.beginWith(item.value, ice.HTTP)) { item.value = can.page.Format(html.A, item.value) }
			can.page.Append(can, status, [{view: can.base.join([html.ITEM, item.name]), title: item.name, list: [
				{text: [item.name, html.LABEL]}, {text: [": ", html.LABEL]}, {text: [(item.value||"")+"", html.SPAN, item.name]},
			], onclick: function(event) { can.user.copy(event, can, item.value) }}])
		})
	},

	field: function(can, type, item, target) { type = type||html.PLUGIN, item = item||{}
		var name = (item.nick||item.name||"").split(ice.SP)[0], title = !item.help || can.user.language(can) == "en"? name: name+"("+item.help.split(ice.SP)[0]+")"
		return can.page.Append(can, target||can._output, [{view: [can.base.join([type||"", item.name||"", item.pos||""]), html.FIELDSET], list: [
			{text: [name == "word"? item.help.split(ice.SP)[0]: title, html.LEGEND]}, {view: [html.OPTION, html.FORM]}, html.ACTION, html.OUTPUT, html.STATUS,
		]}])
	},
	input: function(can, item, value, target, style) {
		switch (item.type) {
			case "": return can.page.Append(can, target, [item])
			case html.SPACE: return can.page.Append(can, target, [{view: can.base.join([html.ITEM, html.SPACE])}])
		}
		var input = can.page.input(can, can.base.Copy({}, item), value)
		if (item.type == html.SELECT && item.value) { input._init = function(target) { target.value = item.value } }
		if (item.type == html.TEXT) { input.onkeydown = item.onkeydown||function(event) {
			can.onkeymap.input(event, can), can.onkeymap.selectOutput(event, can), event.key == lang.ENTER && can.onkeymap.prevent(event)
		} }
		if (item.range) { input._init = function(target) { can.onappend.figure(can, item, target, function(sub, value, old) {
			target.value = value, can.core.CallFunc([can.onaction, item.name], [event, can, item.name])
		}) } }
		var br = input.type == html.TEXTAREA? [{type: html.BR, style: {clear: html.BOTH}}]: []
		var title = can.Conf(can.core.Keys(ctx.FEATURE, chat.TITLE, item.name))||""; title && (input.title = title)
		return can.page.Append(can, target, ([{view: style||can.base.join([html.ITEM, item.type]), list: [input]}]).concat(br))[item.name]
	},
	table: function(can, msg, cb, target, sort) { if (msg.Length() == 0) { return } var meta = can.base.Obj(msg.Option(mdb.META))
		var table = can.page.AppendTable(can, msg, target||can._output, msg.append, cb||function(value, key, index, line, array) {
			if (msg.append.length == 2 && msg.append[0] == mdb.KEY && msg.append[1] == mdb.VALUE) { if (key == mdb.VALUE) { key = line.key }
				line = {}, can.core.List(array, function(item) { line[item.key] = item.value })
			} function run(event, cmd, arg) { return can.run(can.request(event, line, can.Option()), [ctx.ACTION, cmd].concat(arg)) }
			return {text: [value, html.TD], onclick: function(event) { var target = event.target
				if (can.page.tagis(target, html.INPUT) && target.type == html.BUTTON) {
					meta && meta[target.name]? can.user.input(can.request(event, {action: target.name}), can, meta[target.name], function(args) { run(event, target.name, args) }): run(event, target.name)
				} else { can.sup.onimport.change(event, can.sup, key, event.target.innerText) || can.sup.onexport.record(can.sup, line) }
			}, ondblclick: function(event) { if ([mdb.KEY, mdb.HASH, mdb.ID].indexOf(key) > -1) { return }
				var item = can.core.List(can.Conf([ctx.FEATURE, mdb.INSERT]), function(item) { if (item.name == key) { return item } })[0]||{name: key, value: value}
				item.run = function(event, cmds, cb) { can.run(can.request(event, line), cmds, cb, true) }
				can.onmotion.modifys(can, event.target, function(event, value, old) { run(event, mdb.MODIFY, [key, value]) }, item)
			}}
		}); table && can.page.styleClass(can, table, chat.CONTENT), msg.append && msg.append[msg.append.length-1] == ctx.ACTION && can.page.ClassList.add(can, table, ctx.ACTION)
		return sort && can.page.RangeTable(can, table, sort), table
	},
	board: function(can, text, target) { text && text.Result && (text = text.Result()); if (!text) { return }
		var code = can.page.Append(can, target||can._output, [{text: [can.page.Color(text), html.DIV, html.CODE]}]).code
		can.page.Select(can, target, html.INPUT_BUTTON, function(target) {
			target.onclick = function(event) { can.run(can.request(event, can.Option()), [ctx.ACTION, target.name]) }
		}); return code.scrollBy && code.scrollBy(0, 10000), code
	},
	tools: function(can, msg, cb, target) { can.onimport.tool(can, can.base.Obj(msg.Option(ice.MSG_TOOLKIT), []), cb, target) },

	_plugin: function(can, value, meta, cb, target, field) { can.base.Copy(meta, value, true)
		meta.type = meta.type||chat.PLUGIN, meta.height = meta.height||can.ConfHeight(), meta.width = meta.width||can.ConfWidth()
		meta.args = can.base.getValid(can.base.Obj(meta.args), can.base.Obj(meta.arg), can.base.Obj(value.args), can.base.Obj(value.arg))||[]
		meta.inputs = can.base.getValid(meta.inputs, can.base.Obj(value.list))||[], meta.feature = can.base.getValid(meta.feature, can.base.Obj(value.meta))||{}
		if (can.misc.Debug(can, chat.PLUGIN, meta.index, meta.args, meta)) { debugger }
		can.onappend._init(can, meta, [chat.PLUGIN_STATE_JS], function(sub, skip) {
			sub.run = function(event, cmds, cb) { can.runActionCommand(event, sub._index, cmds, cb) }
			sub._index = value.index||meta.index, can.base.isFunc(cb) && cb(sub, meta, skip)
		}, target||can._output, field)
	},
	plugin: function(can, meta, cb, target, field) { meta = meta||{}, meta.index = meta.index||can.core.Keys(meta.ctx, meta.cmd)
		var res = {}; function _cb(sub, meta, skip) { kit.proto(res, sub), cb(sub, meta, skip) } if (can.misc.Debug(can, chat.PLUGIN, meta.index, meta.args, meta)) { debugger }
		if (meta.inputs && meta.inputs.length > 0 || meta.meta) { can.onappend._plugin(can, {meta: meta.meta, list: meta.list}, meta, _cb, target, field); return res }
		var value = can.onengine.plugin(can, meta.index); if (value) { can.onappend._plugin(can, value, meta, _cb, target, field); return res }
		can.runAction(can.request({}, meta), ctx.COMMAND, [meta.index], function(msg) { msg.Table(function(value) { can.onappend._plugin(can, value, meta, _cb, target, field) })}); return res
	},
	figure: function(can, meta, target, cb) { if (meta.action == ice.AUTO || meta.type == html.BUTTON) { return }
		var input = meta.action||mdb.KEY, path = chat.PLUGIN_INPUT+input+nfs._JS; can.require([path], function(can) {
			function _cb(sub, value, old) { if (value == old) { return } can.base.isFunc(cb)? cb(sub, value, old): target.value = value||"", can.onmotion.delay(can, function() { can.onmotion.focus(can, target) }) }
			can.core.ItemCB(can.onfigure[input], function(key, on) { var last = target[key]||function(){}; target[key] = function(event) {
				can.core.CallFunc(on, {event: event, can: can, meta: meta, cb: _cb, target: target, sub: target._can, last: last, cbs: function(cb) {
					function show() { var sub = target._can
						can.onlayout.figure(event, can, target._can._target), can.onmotion.toggle(can, target._can._target, true), can.base.isFunc(cb) && cb(target._can, _cb)
						can.page.style(can, sub._output, html.MAX_HEIGHT, can.base.Max(can.page.height()-sub._target.offsetTop-2*html.ACTION_HEIGHT, can.page.height()/2))
					} if (target._can) { return show() }
					can.onappend._init(can, {type: html.INPUT, name: input, pos: chat.FLOAT, mode: meta.mode}, [path], function(sub) { sub.Conf(meta)
						sub.run = function(event, cmds, cb) { var msg = sub.request(event)
							if (meta.range) { for (var i = meta.range[0]; i < meta.range[1]; i += meta.range[2]||1) { msg.Push(mdb.VALUE, i) } cb(msg); return }
							(meta.run||can.run)(sub.request(event, can.Option()), cmds, cb, true)
						}, target._can = sub, can.base.Copy(sub, can.onfigure[input], true), sub._name = sub._path = path
						sub.hidden = function() { return sub._target.style.display == html.NONE }, sub.close = function() { can.page.Remove(can, sub._target), delete(target._can) }
						can.onmotion.delay(can, function() { can.page.style(sub, sub._target, meta.style), show(), can.base.isFunc(meta._init) && meta._init(sub, sub._target) })
					}, document.body)
				}})
			} }), can.onfigure[input]._init && can.onfigure[input]._init(can, meta, target, _cb)
		})
	},
})
Volcanos(chat.ONLAYOUT, {_init: function(can, target) { target = target||document.body; var height = can.page.height(), width = can.page.width()
		can.page.SelectChild(can, target, can.page.Keys(html.FIELDSET_HEAD, html.FIELDSET_FOOT), function(field) { height -= field.offsetHeight })
		can.page.SelectChild(can, target, html.FIELDSET_LEFT, function(field) {
			can.page.styleHeight(can, field, height), can.user.isMobile || (width -= field.offsetWidth)
			can.page.SelectChild(can, field, html.DIV_OUTPUT, function(output) { can.page.styleHeight(can, output, height-html.ACTION_HEIGHT) })
		})
		can.user.isMobile || can.page.SelectChild(can, target, html.FIELDSET_MAIN, function(field) {
			can.page.style(can, field, html.HEIGHT, height, html.WIDTH, width)
			can.page.SelectChild(can, field, html.DIV_ACTION, function(action) { height -= action.offsetHeight })
			can.page.SelectChild(can, field, html.DIV_OUTPUT, function(output) { can.page.styleHeight(can, output, height) })
		}), can.onengine.signal(can, chat.ONSIZE, can.request({}, {height: height, width: width}))
	},
	background: function(can, url, target) { can.page.style(can, target||document.body, "background-image", url == "" || url == "void"? "": 'url("'+url+'")') },
	figure: function(event, can, target, right) { if (!event || !event.target) { return {} } target = target||can._fields||can._target
		var rect = event.target == document.body? {left: can.page.width()/2, top: can.page.height()/2, right: can.page.width()/2, bottom: can.page.height()/2}: event.target.getBoundingClientRect()
		var layout = right? {left: rect.right, top: rect.top}: {left: rect.left, top: rect.bottom}
		can.getActionSize(function(left, top, width, height) { left = left||0, top = top||0, height = can.base.Max(height, can.page.height()-top)
			if (target.offsetHeight > height) {
				layout.top = top, layout[html.MAX_HEIGHT] = height, layout[html.OVERFLOW] = ice.AUTO
			} else if (layout.top+target.offsetHeight > top+height) {
				layout.top = top+height-target.offsetHeight
			}
			if (target.offsetWidth > width) {
				layout.left = left, layout[html.MAX_WIDTH] = width, layout[html.OVERFLOW] = ice.AUTO
			} else if (layout.left+target.offsetWidth > left+width) {
				layout.left = left+width-target.offsetWidth
			}
		}); return can.onmotion.move(can, target, layout), layout
	},

	display: function(can, target) { return can.page.Appends(can, target||can._output, [{view: [chat.LAYOUT, html.TABLE], list: [
		{type: html.TR, list: [chat.CONTENT]}, {type: html.TR, list: [chat.DISPLAY]},
	]}]) },
	profile: function(can, target) {
		function toggle(view) { var show = view.style.display == html.NONE
			can.onmotion.toggle(can, view, show), view._toggle? view._toggle(event, show): can.onimport.layout && can.onimport.layout(can); return show
		} var gt = "❯", lt = "❮", down = lt, up = gt, button = {}
		var ui = can.page.Append(can, target||can._output, [{view: [chat.LAYOUT, html.TABLE], list: [
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
		document.body.onclick = function(event) { if (can.page.tagis(event.target, html.SELECT, html.INPUT, html.TEXTAREA)) { return }
			if (can.page.tagis(event.target, html.A) && can.user.isWebview) { return event.shiftKey? window.outopen(event.target.href): can.user.open(event.target.href) }
			can.page.Select(can, document.body, can.page.Keys("div.carte.float"), function(target) { can.page.Remove(can, target) })
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
				can.core.CallFunc(that._hash[meta.type]||that._hash[target.tagName], [can, meta, target])
			})
			can.page.Select(can, target, html.INPUT_BUTTON, function(target) {
				if (target.value == target.name) { target.value = can.user.trans(can, target.name) }
			})
			can.page.Select(can, target, html.IFRAME, function(item) {
				can.page.style(can, item, html.HEIGHT, can.ConfHeight()-88, html.WIDTH, can.ConfWidth()-30)
			})
		},
	},

	hidden: function(can, target, show) { target = target||can._target, can.page.styleDisplay(can, target, show? "": html.NONE)
		return show? target._show && target._show(): target._hide && target._hide(), show
	},
	toggle: function(can, target, show, hide) { target = target||can._target
		if (show === true) { return can.onmotion.hidden(can, target, true) } if (show === false) { return can.onmotion.hidden(can, target, false) }
		var status = target.style.display == html.NONE; if (status? can.base.isFunc(show) && show(): can.base.isFunc(hide) && hide()) { return !status }
		return can.onmotion.hidden(can, target, status)
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
		index == 0 && can.page.ClassList.set(can, tr, html.HIDDEN, can.page.Select(can, tr, html.TD, function(td) { if (td.innerText.indexOf(value) > -1) { return td } }) == 0)
	}) },

	delay: function(can, cb, interval) { can.core.Timer(interval||30, cb) },
	clear: function(can, target) { return can.page.Modify(can, target||can._output, ""), target },
	cache: function(can, next) { var list = can.base.Obj(can.core.List(arguments).slice(2), [can._output])
		can.core.List(list, function(target) { target && target._cache_key && can.page.Cache(target._cache_key, target, target.scrollTop+1) })
		var key = next(can._cache_data = can._cache_data||{}, arguments[2]._cache_key); return key && can.core.List(list, function(target) { if (!target) { return }
			var pos = can.page.Cache(target._cache_key = key, target); if (pos) { target.scrollTo && target.scrollTo(0, pos-1); return target }
		}).length > 0
	},
	share: function(event, can, input, args) { var _args = args
		return can.user.input(event, can, input, function(args) { can.onengine.signal(can, chat.ONSHARE, can.request(event, {args: [mdb.TYPE, chat.FIELD].concat(_args||[], args||[])})) })
	},
	focus: function(can, target) { if (!target) { return } target.focus(), target.setSelectionRange && target.setSelectionRange(0, target.value.length) },
	copy: function(can, target, cb) { target.title = "点击复制", target.onclick = function(event) { can.user.copy(event, can, target.innerText), can.base.isFunc(cb) && cb(event) } },

	move: function(can, target, layout, cb) { var begin; layout = layout||{}
		can.page.style(can, target, layout), target.onmousedown = function(event) {
			if (!event.ctrlKey && !can.page.tagis(target, html.FIELDSET)) { return }
			layout.height = target.offsetHeight, layout.width = target.offsetWidth
			layout.left = target.offsetLeft, layout.top = target.offsetTop
			begin = can.base.Copy({x: event.x, y: event.y}, layout)
		}, target.onmouseup = function(event) { begin = null }, target.onmousemove = function(event) { if (!begin) { return }
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
Volcanos(chat.ONKEYMAP, {_init: function(can, target) {
		can.onkeymap._build(can), document.body.onkeydown = function(event) {
			if (can.page.tagis(event.target, html.SELECT, html.INPUT, html.TEXTAREA)) { return }
			var msg = can.request(event, {"model": "normal"}); if (msg.Option(ice.MSG_HANDLE) == ice.TRUE) { return }
			if (can.user.isWebview && event.metaKey) { msg.Option("model", "webview"); if (event.key >= "0" && event.key <= "9") {
				can.onengine.signal(can, chat.ONKEYDOWN, msg); if (msg.Option(ice.MSG_HANDLE) == ice.TRUE) { return }
			} }
			can.onengine.signal(can, chat.ONKEYDOWN, msg); if (msg.Option(ice.MSG_HANDLE) == ice.TRUE) { return }
			can._keylist = can.onkeymap._parse(event, can, msg.Option("model"), can._keylist, can._output)
		}, document.body.onkeyup = function(event) {
			if (can.page.tagis(event.target, html.SELECT, html.INPUT, html.TEXTAREA)) { return }
			var msg = can.request(event, {"model": "normal"}); if (msg.Option(ice.MSG_HANDLE) == ice.TRUE) { return }
			can.onengine.signal(can, chat.ONKEYUP, msg); if (msg.Option(ice.MSG_HANDLE) == ice.TRUE) { return }
			can._keylist = can.onkeymap._parse(event, can, msg.Option("model"), can._keylist, can._output)
		}
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
		return can.page.Select(can, target, key, function(target, index) { if (index+1 == event.key) { return cb(target) } })[0]
	},
	selectInputs: function(event, can, cb, target) { if (can.page.ismodkey(event)) { return }
		if (event.key == lang.ESCAPE) { return target.blur() }
		if (event.ctrlKey || event.key == lang.TAB) { if (can.base.isUndefined(target._index)) { target._index = -1, target._value = target.value }
			function select(order) { if (order == -1) { target.value = target._value }
				var index = 0; return can.page.Select(can, can._output, [html.TBODY, html.TR], function(tr) {
					if (can.page.ClassList.has(can, tr, html.HIDDEN)) { return }
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
