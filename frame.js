_can_name = "/frame.js"
Volcanos("onengine", {help: "搜索引擎", list: [], _init: function(can, meta, list, cb, target) {
		can.run = function(event, cmds, cb) { var msg = can.request(event); cmds = cmds||[]
			return (can.onengine[cmds[0]]||can.onengine._remote)(event, can, msg, can, cmds, cb)
		}
		if (can.user.isExtension) { Volcanos.meta.args = can.base.Obj(localStorage.getItem(ctx.ARGS), {}) }

		can.core.Next(list, function(item, next) { item.type = chat.PANEL
			can.onappend._init(can, can.base.Copy(item, can.core.Value(can._root, can.core.Keys(chat.RIVER, item.name))), item.list, function(panel) {
				panel.run = function(event, cmds, cb) { var msg = panel.request(event); cmds = cmds||[]
					return (can.onengine[cmds[0]]||can.onengine._remote)(event, can, msg, panel, cmds, cb)
				}, can[item.name] = panel, panel._root = can, panel._trans = panel.onaction && panel.onaction._trans||{}

				can.core.ItemCB(panel.onaction, function(key, cb) {
					can.onengine.listen(can, key, function(msg) { can.core.CallFunc(cb, {can: panel, msg: msg}) })
				}), can.core.CallFunc([panel.onaction, "_init"], {can: panel, cb: next, target: panel._target})

				can.page.Modify(can, panel._target, {style: panel.Conf(ctx.STYLE)})
			}, target)
		}, function() { can.misc.Log(can.user.title(), ice.RUN, can)
			can.require([can.volcano], null, function(can, name, sub) { can[name] = sub })
			can.ondaemon._init(can), can.onmotion._init(can, target), can.onkeymap._init(can)
			can.onlayout.topic(can), can.onengine.signal(can, chat.ONMAIN, can.request())
			can.onmotion.float.auto(can, target), can.base.isFunc(cb) && cb()
		})
	},
	_search: function(event, can, msg, panel, cmds, cb) {
		var sub, mod = can, fun = can, key = ""; can.core.List(cmds[1].split(ice.PT), function(value) {
			fun && (sub = mod, mod = fun, fun = mod[value], key = value)
		}); if (!sub || !mod || !fun) { can.misc.Warn(ice.ErrNotFound, cmds)
			return can.base.isFunc(cb) && cb(msg.Echo(ice.ErrWarn, ice.ErrNotFound, cmds))
		}

		return can.core.CallFunc(fun, {
			"event": event, "can": sub, "msg": msg, "cmds": cmds.slice(2), "cb": cb, "target": sub._target,
			"button": key, "cmd": key, "arg": cmds.slice(2), "list": cmds.slice(2),
		}, mod)
	},
	_engine: function(event, can, msg, panel, cmds, cb) { return false },
	_plugin: function(event, can, msg, panel, cmds, cb) {
		if (cmds[0] == ctx.ACTION && cmds[1] == ice.RUN && can.onengine.plugin.meta[cmds[2]]) {
			return can.core.CallFunc(can.onengine.plugin.meta[cmds[2]], {msg: msg, cmds: cmds.slice(3), cb: cb}), true
		}
		if (can.onengine.plugin.meta[cmds[0]]) {
			return can.core.CallFunc(can.onengine.plugin.meta[cmds[0]], {msg: msg, cmds: cmds.slice(1), cb: cb}), true
		}
		return false
	},
	_remote: function(event, can, msg, panel, cmds, cb) {
		if (panel.onengine._engine(event, can, msg, panel, cmds, cb)) { return }
		if (panel.onengine._plugin(event, can, msg, panel, cmds, cb)) { return }

		var key = can.core.Keys(panel._name, cmds.join(ice.FS))
		if (can.user.isLocalFile) { var msg = can.request(event); msg.Clear(ice.MSG_APPEND)
			var res = Volcanos.meta.pack[key]; res? msg.Copy(res): can.user.toast(can, "缺失数据")
			return can.base.isFunc(cb) && cb(msg)
		}

		var names = msg.Option("_names")||panel._names||((can.Conf("iceberg")||"/chat/")+panel._name)
		can.onengine.signal(can, chat.ONREMOTE, can.request({}, {_follow: panel._follow, _msg: msg, _cmds: cmds}))
		can.misc.Run(event, can, {names: names, daemon: can.core.Keys(can.ondaemon._list[0], msg._daemon)}, cmds, function(msg) {
			Volcanos.meta.pack[key] = msg, delete(msg._handle), delete(msg._toast), can.base.isFunc(cb) && cb(msg)
		})
	},

	plugin: shy("添加插件", {}, [], function(can, name, command) { name = can.base.trimPrefix(name, "can.")
		var type = html.TEXT; command.list = can.core.List(command.list, function(item) {
			switch (typeof item) {
				case lang.OBJECT: return type = item.type||type, item
				case lang.STRING:
					switch (item) {
						case mdb.LIST:
						case cli.BACK: return {type: type = html.BUTTON, name: item}
						case mdb.NAME: return {type: type = html.TEXT, name: item}
						case mdb.TEXT: return {type: type = html.TEXTAREA, name: item}
						default: return {type: type, name: item}
					}
			}
		}), arguments.callee.meta[can.core.Keys("can", name)] = command
	}),
	listen: shy("监听事件", {}, [], function(can, name, cb) { arguments.callee.meta[name] = (arguments.callee.meta[name]||[]).concat(cb) }),
	signal: shy("触发事件", function(can, name, msg) { msg = msg||can.request()
		name == chat.ONREMOTE? can.misc.Log("signal", name, msg.Option("_msg")): can.misc.Log("signal", name, msg)
		can.core.List(can.onengine.listen.meta[name], function(cb) { can.core.CallFunc(cb, {event: msg._event, msg: msg}) })
	}),
})
Volcanos("ondaemon", {help: "推荐引擎", list: [], _init: function(can, name) { if (can.user.isLocalFile) { return }
		can.misc.WSS(can, {type: html.CHROME, name: can.misc.Search(can, "daemon")||name||""}, function(event, msg, cmd, arg) { if (!msg) { return }
			can.base.isFunc(can.ondaemon[cmd])? can.core.CallFunc(can.ondaemon[cmd], {
				"can": can, "msg": msg, "cmd": cmd, "arg": arg, "cb": function() { msg.Reply() },
			}): can.onengine._search({}, can, msg, can, ["_search", cmd].concat(arg), function() { msg.Reply() })
		})
		can.onengine.listen(can, chat.ONSEARCH, function(msg, word) { var meta = can.onengine.plugin.meta
			if (word[0] != mdb.FOREACH && word[0] != ctx.COMMAND) { return }
			var list = word[1] == ""? meta: meta[word[1]]? kit.Dict(word[1], meta[word[1]]): {}
			can.core.Item(list, function(name, command) { name = can.base.trimPrefix(name, "can.")
				can.core.List(msg.Option(ice.MSG_FIELDS).split(ice.FS), function(item) {
					msg.Push(item, kit.Dict(
						ice.CTX, "onengine", ice.CMD, "command",
						mdb.TYPE, "can", mdb.NAME, name, mdb.TEXT, command.help,
						ctx.CONTEXT, "can", ctx.COMMAND, name,
					)[item]||"")
				})
			})
		})
	}, _list: [""],
	pwd: function(can, msg, arg) { can.ondaemon._list[0] = arg[0] },
	grow: function(can, msg, arg) {
		var sub = can.ondaemon._list[msg.Option(ice.MSG_TARGET)]
		sub.onimport._grow(sub, can.page.Color(arg.join("")))
	},
	toast: function(can, msg, arg) { can.core.CallFunc(can.user.toast, {can: can, msg: msg, cmds: arg}) },
	confirm: function(can, msg, arg) { if (can.user.confirm(arg[0])) { msg.Echo(ice.TRUE) } },
})
Volcanos("onappend", {help: "渲染引擎", list: [], _init: function(can, meta, list, cb, target, field) {
		meta.name = (meta.name||"").split(ice.SP)[0].split(ice.PT).pop()
		field = field||can.onappend.field(can, meta.type, meta, target).first
		var legend = can.page.Select(can, field, html.LEGEND)[0]
		var option = can.page.Select(can, field, html.FORM_OPTION)[0]
		var action = can.page.Select(can, field, html.DIV_ACTION)[0]
		var output = can.page.Select(can, field, html.DIV_OUTPUT)[0]
		var status = can.page.Select(can, field, html.DIV_STATUS)[0]

		var sub = Volcanos(meta.name, {_follow: can.core.Keys(can._follow, meta.name), _target: field,
			_legend: legend, _option: option, _action: action, _output: output, _status: status,
			_inputs: {}, _outputs: [], _history: [],

			Status: function(key, value) {
				if (can.base.isObject(key)) { return can.core.Item(key, sub.Status), key }
				can.page.Select(can, status, [[[html.DIV, key], html.SPAN]], function(item) {
					return value == undefined? (value = item.innerHTML): (item.innerHTML = value)
				}); return value
			},
			Action: function(key, value) { return can.page.SelectArgs(can, action, key, value)[0] },
			Option: function(key, value) { return can.page.SelectArgs(can, option, key, value)[0] },
			Update: function(event, cmds, cb, silent) { sub.onappend._output0(sub, sub.Conf(), event||{}, cmds||sub.Input(), cb, silent); return true },
			Input: function(cmds, silent) {
				cmds = cmds && cmds.length > 0? cmds: can.page.SelectArgs(can, option, ""), cmds = can.base.trim(cmds)
				silent || cmds[0] == ctx.ACTION || can.base.Eq(sub._history[sub._history.length-1], cmds) || sub._history.push(cmds)
				return cmds
			},
			Clone: function() { meta.args = can.page.SelectArgs(can, option, "")
				can.onappend._init(can, meta, list, function(sub) { can.base.isFunc(cb) && cb(sub, true)
					can.core.Timer(10, function() { for (var k in sub._inputs) { can.onmotion.focus(can, sub._inputs[k]._target); break } })
				}, target)
			},
		}, list, function(sub) { sub.Conf(meta), meta.feature = can.base.Obj(meta.feature, {})
			can.page.ClassList.add(can, field, meta.index? meta.index.split(ice.PT).pop(): meta.name)
			can.page.ClassList.add(can, field, meta.style||meta.feature.style||"")

			meta.inputs && sub.onappend._option(sub, meta, sub._option, meta.msg)
			if (meta.msg) { var msg = sub.request(); msg.Copy(can.base.Obj(meta.msg)), sub.onappend._output(sub, msg, msg.Option(ice.MSG_DISPLAY)) }

			can.page.Modify(can, sub._legend, {onmouseenter: function(event) {
				can.user.carte(event, sub, sub.onaction, sub.onaction.list.concat([["所有 ->"].concat(can.core.Item(meta.feature._trans))], [cli.CLOSE]))
			}}), can.base.isFunc(cb) && cb(sub)
		}); return sub
	},
	_option: function(can, meta, option, skip) { meta = meta||{}; var index = -1, args = can.base.Obj(meta.args||meta.arg||meta.opt, []), opts = can.base.Obj(meta.opts, {})
		function add(item, next) { item = can.base.isString(item)? {type: html.TEXT, name: item}: item, item.type != html.BUTTON && index++
			return Volcanos(item.name, {_follow: can.core.Keys(can._follow, item.name),
				_target: can.onappend.input(can, item, args[index]||opts[item.name], option||can._option),
				_option: can._option, _action: can._action, _output: can._output, _status: can._status,
				Option: can.Option, Action: can.Action, Status: can.Status, CloneField: can.Clone,
				CloneInput: function() { can.onmotion.focus(can, add(item)._target) },
			}, [item.display, chat.PLUGIN_INPUT_JS], function(input) { input.Conf(item)
				input.run = function(event, cmds, cb, silent) { var msg = can.request(event)
					if (msg.RunAction(event, can.core.Value(can, "_outputs.-1"), cmds)) { return }
					if (msg.RunAction(event, input, cmds)) { return }
					return can.Update(event, can.Input(cmds, silent), cb, silent)
				}, can._inputs[item.name] = input, input.sup = can

				can.core.ItemCB(input.onaction, function(key, cb) { input._target[key] = function(event) { cb(event, input) } })
				can.core.ItemCB(item, function(key, cb) { input._target[key] = function(event) { cb(event, input) } })
				skip? next(): can.core.CallFunc([input.onaction, "_init"], [input, item, next, input._target]);
				(item.action||can.core.Value(meta, "feature.inputs")) && can.onappend.figure(input, item, input._target)
			})
		}; can.core.Next(can.base.Obj(meta.inputs, can.core.Value(can, "onimport.list")).concat(meta.type == chat.FLOAT? [{type: html.BUTTON, name: cli.CLOSE}]: []), add)
	},
	_action: function(can, list, action, meta) { meta = meta||can.onaction, action = action||can._action, can.onmotion.clear(can, action)
		return can.core.List(can.base.Obj(list, can.core.Value(can, "onaction.list")), function(item) { if (item == undefined) { return } can.onappend.input(can, item == ""? /*空白*/ {type: html.SPACE}:
			can.base.isString(item)? /*按键*/ {type: html.BUTTON, value: can.user.trans(can, item), onclick: function(event) {
				var cb = meta[item]||meta["_engine"]; cb? can.core.CallFunc(cb, {event: event, can: can, button: item}): can.run(event, [ctx.ACTION, item].concat(can.sup.Input()))

			}}: item.length > 0? /*列表*/ {type: html.SELECT, name: item[0], values: item.slice(1), onchange: function(event) {
				var which = item[event.target.selectedIndex+1]
				can.core.CallFunc(meta[which], [event, can, which])
				can.core.CallFunc(meta[item[0]], [event, can, item[0], which])

			}}: /*其它*/ item, "", action)}), meta
	},
	_output0: function(can, meta, event, cmds, cb, silent) { var msg = can.request(event); if (msg.RunAction(event, can, cmds)) { return }
		if (msg.Option(ice.MSG_HANDLE) != ice.TRUE && cmds && cmds[0] == ctx.ACTION && meta.feature[cmds[1]]) { can.request(event, {action: cmds[1]})
			return can.user.input(event, can, meta.feature[cmds[1]], function(ev, button, data, list, args) { var msg = can.request(event, {_handle: ice.TRUE}, can.Option())
				can.Update(event, cmds.slice(0, 2).concat(args), function(msg) { can.Update({}, can.Input(), cb) }, true)
			})
		}

		if (can.base.isUndefined(msg._daemon)) {
			can.base.isUndefined(can._daemon) && can.ondaemon._list[0] && (can._daemon = can.ondaemon._list.push(can)-1)
			if (can._daemon) { msg._daemon = can._daemon }
		}

		if (msg.Option("_toast")) { var toast = can.user.toast(can, msg.Option("_toast"), "", -1) }
		return can.run(event, cmds, function(msg) { var sub = can.core.Value(can, "_outputs.-1")||{}; can._msg = msg, sub._msg = msg, toast && toast.close()
			if (can.base.isFunc(cb)) { can.core.CallFunc(cb, {can: can, msg: msg}); return }
			var process = msg._can == can || msg._can == sub
			if (process && can.core.CallFunc([sub, "onimport._process"], {can: sub, msg: msg})) { return }
			if (process && can.core.CallFunc([can, "onimport._process"], {can: can, msg: msg})) { return }
			!silent && can.onappend._output(can, msg, msg.Option(ice.MSG_DISPLAY)||meta.display||meta.feature.display)
		})
	},
	_output: function(can, msg, display, output) { display = display||chat.PLUGIN_TABLE_JS, output = output||can._output
		Volcanos(display, {_follow: can.core.Keys(can._follow, display), _display: display, _target: output, _fields: can._target,
			_option: can._option, _action: can._action, _output: can._output, _status: can._status, _legend: can._legend, _inputs: {},
			Update: can.Update, Option: can.Option, Action: can.Action, Status: can.Status,
		}, [display, chat.PLUGIN_TABLE_JS], function(table) { table.Conf(can.Conf())
			table.run = function(event, cmds, cb, silent) { var msg = can.request(event)
				if (msg.RunAction(event, table, cmds)) { return }
				return can.Update(event, can.Input(cmds, silent), cb, silent)
			}, can._outputs.push(table), table.sup = can, table._msg = msg

			if (can.Conf(ctx.INDEX) == "can.code.inner.plugin" && table.onimport && table.onimport.list.length > 0) {
				can.onmotion.clear(can, can._option), can.onappend._option(can, {inputs: table.onimport.list})
			}

			table.onimport && can.core.CallFunc(table.onimport._init, {can: table, msg: msg, list: msg.result||msg.append||[], cb: function(msg) {
				table.onappend._action(table, msg.Option(ice.MSG_ACTION)||can.Conf(ice.MSG_ACTION))
				table.onappend._status(table, msg.Option(ice.MSG_STATUS))
			}, target: output})
		})
	},
	_status: function(can, list, status) { status = status||can._status, can.onmotion.clear(can, status)
		can.core.List(can.base.Obj(list, can.core.Value(can, [chat.ONEXPORT, mdb.LIST])), function(item) { item = can.base.isObject(item)? item: {name: item}
			can.page.Append(can, status, [{view: can.base.join([html.ITEM, item.name]), title: item.name, list: [
				{text: [item.name, html.LABEL]}, {text: [": ", html.LABEL]}, {text: [(item.value||"")+"", html.SPAN, item.name]},
			], }])
		})
	},

	tabs: function(can, list, cb, cbs, action) { action = action||can._action
		return can.page.Append(can, action, can.core.List(list, function(meta) {
			return {text: [meta.name, html.DIV, html.TABS], title: meta.text, onclick: function(event) {
				can.base.isFunc(cb) && cb(event, meta)
			}, _init: function(item) { const OVER = "over"
				function close(item) { var next = item.nextSibling || item.previousSibling
					item._close(item) || can.page.Remove(can, item), next && next.click()
				}
				can.core.Timer(10, function() { item.click() })
				can.page.Modify(can, item, {draggable: true, _close: cbs,
					onmouseenter: function(event) {
						can.user.carte(event, can, kit.Dict(
							"close tab", function(event) { close(item) },
							"close other", function(event) {
								can.page.Select(can, action, html.DIV_TABS, function(_item) {
									_item == item || close(_item)
								})
							},
							"close all", function(event) { can.page.Select(can, action, html.DIV_TABS, close) },
						), ["close tab", "close other", "close all"])
					},
					ondragstart: function(event) { var target = event.target; target.click()
						action._drop = function(event, before) { action.insertBefore(target, before) }
					},
					ondragover: function(event) { event.preventDefault(), action._drop(event, event.target) },
					ondrop: function(event) { event.preventDefault(), action._drop(event, event.target) },
				})
			}}
		})).first
	},
	list: function(can, root, cb, target) { target = target||can._output
		can.core.List(root.list, function(item) {
			var ui = can.page.Append(can, target, [{view: [html.ITEM, html.DIV, item.meta.name], onclick: function(event) {
				can.base.isFunc(cb) && cb(event, item) || can.onmotion.toggle(can, ui.list)
				can.onmotion.select(can, target, html.DIV_ITEM, event.target)
			}}, {view: html.LIST}]); can.onappend.list(can, item, cb, ui.list)
		})
	},
	item: function(can, type, item, cb, cbs, target) { target = target||can._output
		var ui = can.page.Append(can, target, [{view: [type, html.DIV, item.nick||item.name],
			onclick: function(event) { cb(event, ui.first)
				can.onmotion.select(can, target, can.core.Keys(html.DIV, type), ui.first)
			}, onmouseenter: function(event) { cbs(event, ui.first) },
		}]); return ui.first
	},
	tree: function(can, list, field, split, cb, target, node) {
		node = node||{"": target}; can.core.List(list, function(item) {
			item[field] && can.core.List(item[field].split(split), function(value, index, array) { if (!value) { return }
				var last = array.slice(0, index).join(split), name = array.slice(0, index+1).join(split)

				node[name] || (node[name] = can.page.Append(can, node[last], [{view: [html.ITEM, html.DIV, value+(index==array.length-1?"":split)], onclick: function(event) {
					index < array.length - 1? can.onmotion.toggle(can, node[name]): can.base.isFunc(cb) && cb(event, item)
				}}, {view: html.LIST, style: {display: html.NONE}}]).last)
			})
		}); return node
	},
	field: function(can, type, item, target) { type = type||html.PLUGIN, item = item||{}
		var name = (item.nick||item.name||"").split(ice.SP)[0]
		var title = !item.help || can.user.language(can) == "en"? name: name+"("+item.help.split(ice.SP)[0]+")"
		return can.page.Append(can, target||can._output, [{view: [can.base.join([type||"", item.name||"", item.pos||""]), html.FIELDSET], list: [
			name && {text: [title, html.LEGEND]}, {view: [html.OPTION, html.FORM]}, {view: [html.ACTION]}, {view: [html.OUTPUT]}, {view: [html.STATUS]},
		]}])
	},
	input: function(can, item, value, target, style) {
		switch (item.type) {
			case "": return can.page.Append(can, target, [item])
			case html.SPACE: return can.page.Append(can, target, [{view: can.base.join([html.ITEM, html.SPACE])}])
		}

		var input = can.page.input(can, item, value)
		var br = input.type == html.TEXTAREA? [{type: html.BR, style: {clear: html.BOTH}}]: []
		var title = can.Conf([ctx.FEATURE, chat.TITLE, item.name].join(ice.PT))||""; title && (input.title = title)
		return can.page.Append(can, target, ([{view: style||can.base.join([html.ITEM, item.type]), onkeydown: function(event) {
			item.type == "textarea" && event.key == "Tab" && can.onkeymap.insertText(event.target, "\t")
			item.type == "text" && can.onkeymap.input(event, can), can.onmotion.selectField(event, can)
		}, list: [input]}]).concat(br))[item.name]
	},
	table: function(can, msg, cb, target, sort) {
		var table = can.page.AppendTable(can, msg, target||can._output, msg.append, cb||function(value, key, index, line, array) {
			if (msg.append.length == 2 && msg.append[0] == mdb.KEY && msg.append[1] == mdb.VALUE) {
				if (key == mdb.VALUE) { key = line.key }
				line = {}, can.core.List(array, function(item) { line[item.key] = item.value })
			}

			if (key == "extra.cmd") {
				can.onappend.plugin(can, {ctx: line["extra.ctx"], cmd: line["extra.cmd"], arg: line["extra.arg"]}, function(sub) {
					sub.run = function(event, cmds, cb) { var msg = can.request(event, line, can.Option())
						can.run(event, can.misc.concat(can, [ctx.ACTION, ice.RUN, can.core.Keys(line["extra.ctx"], line["extra.cmd"])], cmds), cb, true)
					}
				}, target)
			}

			return {text: [value, html.TD], onclick: function(event) { var target = event.target
				if (target.tagName == "INPUT" && target.type == html.BUTTON) { var msg = can.sup.request(event, line, can.Option())
					return can.run(event, [ctx.ACTION, target.name], function(msg) { can.run() }, true)
				}
				if (key == mdb.HASH && can.user.mod.isDiv) { return can.user.jumps("/chat/div/"+value) }
				can.sup.onaction.change(event, can.sup, key, value)
			}, ondblclick: function(event) { if ([mdb.KEY].indexOf(key) > -1) { return }
				var item = can.core.List(can.Conf("feature.insert"), function(item) {
					if (item.name == key) { return item }
				})[0]||{name: key, value: value}

				item.run = function(event, cmds, cb) { can.run(can.request(event, line)._event, cmds, cb, true) }

				can.onmotion.modifys(can, event.target, function(event, value, old) { var msg = can.sup.request(event, line, can.Option())
					can.run(event, [ctx.ACTION, mdb.MODIFY, key, value], function(msg) { can.run() }, true)
				}, item)
			}}
		}); table && can.page.Modify(can, table, {className: chat.CONTENT})
		return sort && can.page.RangeTable(can, table, sort), table
	},
	board: function(can, text, target) { text && text.Result && (text = text.Result()); if (!text) { return }
		var code = can.page.Append(can, target||can._output, [{text: [can.page.Color(text), html.DIV, html.CODE]}]).code
		can.page.Select(can, code, html.INPUT_BUTTON, function(target) {
			target.onclick = function(event) { var msg = can.sup.request(event, can.Option())
				return can.run(event, [ctx.ACTION, target.name], function(msg) { can.run() }, true)
			}
		})
		return code.scrollBy(0, 10000), code
	},

	_plugin: function(can, value, meta, cb, target) {
		meta.feature = meta.feature||can.base.Obj(value.meta, {})
		meta.inputs = meta.inputs||can.base.Obj(value.list, [])

		meta.height = meta.height||can.Conf(html.HEIGHT)
		meta.width = meta.width||can.Conf(html.WIDTH)

		meta.name = meta.name||value.name||chat.PLUGIN
		meta.help = meta.help||value.help||chat.PLUGIN
		meta.type = meta.type||chat.PLUGIN

		can.onappend._init(can, meta, [chat.PLUGIN_STATE_JS], function(sub, skip) {
			sub.run = function(event, cmds, cb) { can.run(event, can.misc.concat(can, [ctx.ACTION, ice.RUN, meta.index], cmds), cb) }
			can.base.isFunc(cb) && cb(sub, meta, skip)
		}, target||can._output)
	},
	plugin: function(can, meta, cb, target) { meta = meta||{}, meta.index = meta.index||can.core.Keys(meta.ctx, meta.cmd)
		var p = can.onengine.plugin.meta[meta.index], res = {}; function cbs(sub, meta, skip) { res.__proto__ = sub, cb(sub, meta, skip) }
		(meta.meta || meta.inputs && meta.inputs.length > 0)? /* 局部命令 */ can.onappend._plugin(can, {meta: meta.meta, list: meta.list}, meta, cbs, target):
			p? /* 前端命令 */ can.onappend._plugin(can, {name: meta.index, help: p.help, meta: p.meta, list: p.list}, meta, function(sub, meta, skip) {
				sub.run = function(event, cmds, cb) { can.core.CallFunc(p, {msg: can.request(event), cmds: cmds, cb: cb}) }
				can.base.isFunc(cbs) && cbs(sub, meta, skip)
			}, target): /* 后端命令 */ can.run(can.request({}, meta)._event, [ctx.ACTION, ctx.COMMAND, meta.index], function(msg) { msg.Table(function(value) {
				can.onappend._plugin(can, value, meta, cbs, target)
			}) }, true)
		return res
	},
	figure: function(can, meta, target, cbs) { if ([html.BUTTON, html.SELECT].indexOf(meta.type) > -1) { return }
		var input = meta.action||mdb.KEY; input != ice.AUTO && can.require(["/plugin/input/"+input+".js"], function(can) {
			can.core.ItemCB(can.onfigure[input], function(key, on) { var last = target[key]; target[key] = function(event) { on(event, can, meta, function(cb) {
				can.sub? can.base.isFunc(cb) && cb(can.sub, cbs): can.onappend._init(can, {type: html.INPUT, name: input, pos: chat.FLOAT}, ["/plugin/input/"+input+".js"], function(sub) { sub.Conf(meta)
					can.onmotion.hidden(can, sub._target)
					sub.run = function(event, cmds, cb) { var msg = sub.request(event, can.Option()); (meta.run||can.run)(event, cmds, cb, true) }, can.sub = sub
					sub.close = function() { sub.page.Remove(sub, sub._target), delete(can.sub) }

					sub.onappend._action(sub, [cli.CLOSE, cli.CLEAR, cli.REFRESH], sub._action, kit.Dict(
						cli.CLOSE, function(event) { sub.close() },
						cli.CLEAR, function(event) { target.value = "" },
						cli.REFRESH, function(event) { can.base.isFunc(cb) && cb(sub) },
					)), sub.onappend._status(sub, [mdb.TOTAL, mdb.INDEX])

					meta.style && sub.page.Modify(sub, sub._target, {style: meta.style})
					can.base.isFunc(cb) && cb(sub, function() {
						can.onmotion.hidden(can, sub._target, true)
						can.base.isFunc(cbs) && cbs(sub)
					})
				}, document.body)
			}, target, last) } })
		})
	},
	float: function(can, msg, cb) {
		var ui = can.onappend.field(can, "story toast float", {}, document.body)
		ui.close = function() { can.page.Remove(can, ui.first) }

		can.getActionSize(function(left, top, height, width) {
			can.page.Modify(can, ui.output, {style: kit.Dict(html.MAX_HEIGHT, height-28, html.MAX_WIDTH, width)})
			can.page.Modify(can, ui.first, {style: {left: left, top: top}})
		})

		can.onappend._action(can, [cli.CLOSE, cli.REFRESH, {input: html.TEXT, placeholder: "filter", _init: function(input) {
			can.onengine.signal(can, "keymap.focus", can.request({}, {cb: function(event) {
				if (event.target.tagName == "INPUT") { return }
				if (event.key == lang.ESCAPE) { ui.close(); return }
				if (event.key == ice.SP) { input.focus(), can.onkeymap.prevent(event) }
			}}))
		}, onkeydown: function(event) { can.onkeymap.input(event, can)
			if (event.key != lang.ENTER) { return }
			event.target.setSelectionRange(0, -1)

			can.page.Select(can, ui.output, html.TR, function(tr, index) { if (index == 0) { return }
				can.page.ClassList.add(can, tr, html.HIDDEN)
				can.page.Select(can, tr, html.TD, function(td) { if (td.innerText.indexOf(event.target.value) > -1) {
					can.page.ClassList.del(can, tr, html.HIDDEN)
				} })
			})
		}}], ui.action, kit.Dict(cli.CLOSE, ui.close, cli.REFRESH, function(event) { ui.close(), can.toast.click()}))

		can.onappend.table(can, msg, function(value, key, index, line, list) {
			return {text: [value, html.TD], onclick: function(event) {
				can.base.isFunc(cb) && cb(value, key, index, line, list)
			}}
		}, ui.output), can.onappend.board(can, msg.Result(), ui.output)
		return ui
	},
}, [], function(can) {})
Volcanos("onlayout", {help: "页面布局", list: [], _init: function(can, target) { target = target||document.body
		// var list = []; document.body.onresize = function() {
		//     can.core.Delay(list, 1000, function() { can.onlayout._init(can, target) })
		// }
		//
		if (can.page.Select(can, target, html.FIELDSET_MAIN+".page").length > 0) {
			can.page.Select(can, target, html.FIELDSET_LEFT, function(field, index) {
				can.page.Modify(can, field, {style: {height: ""}})
				can.page.Select(can, target, [[html.FIELDSET_LEFT, html.DIV_OUTPUT]], function(output) {
					can.page.Modify(can, output, {style: {height: ""}})
				})
			})
			can.page.Select(can, target, html.FIELDSET_MAIN, function(field, index) {
				can.page.style(can, field, html.HEIGHT, "")
				can.page.Select(can, target, [[html.FIELDSET_MAIN, html.DIV_OUTPUT]], function(output) {
					can.page.style(can, output, html.HEIGHT, "")
				})
			})
			return
		}
		var width = window.innerWidth, height = window.innerHeight
		can.page.Select(can, target, can.page.Keys(html.FIELDSET_HEAD, html.FIELDSET_FOOT), function(field) {
			height -= field.offsetHeight
		})

		can.page.Select(can, target, html.FIELDSET_LEFT, function(field, index) {
			can.user.isMobile || (width -= field.offsetWidth)
			can.page.Modify(can, field, {style: {height: height}})
			can.page.Select(can, target, [[html.FIELDSET_LEFT, html.DIV_OUTPUT]], function(output) {
				can.page.Modify(can, output, {style: {height: height-32}})
			})
		})

		can.page.Select(can, target, html.FIELDSET_MAIN, function(field, index) {
			if (can.user.isMobile) {
				can.page.style(can, field, "padding-top", can.user.isLandscape()? "0px": "")
			} else {
				can.page.style(can, field, html.HEIGHT, height, html.WIDTH, width-1)
				can.page.Select(can, target, [[html.FIELDSET_MAIN, html.DIV_OUTPUT]], function(output) {
					height -= can.page.Select(can, field, html.DIV_ACTION)[0].offsetHeight
					can.page.style(can, output, html.HEIGHT, height)
				})
			}
		})

		can.onengine.signal(can, chat.ONSIZE, can.request({}, {width: width, height: height}))
	},
	topic: function(can, topic) { topic && (can._topic = topic)
		can.user.topic(can, can._topic || can.misc.Search(can, chat.TOPIC) || ((can.base.isNight()||can.user.mod.isPod)? chat.BLACK: chat.WHITE))
		can.page.ClassList.add(can, document.body, can.user.language(can))
	},
	background: function(can, url, target) {
		can.page.Modify(can, target||document.body, {style: {background: url == "" || url == "void"? "": 'url("'+url+'")'}})
	},
	figure: function(event, can, target, right, layout) { target = target||can._target
		if (layout) { return can.page.Modify(can, target, {style: layout}), can.onmotion.move(can, target, layout), layout }

		if (!event || !event.target || !event.clientX) { return {} }

		var left = event.clientX-event.offsetX, top = event.clientY-event.offsetY+event.target.offsetHeight-5; if (right) {
			var left = event.clientX-event.offsetX+event.target.offsetWidth, top = event.clientY-event.offsetY
		}

		layout = {left: left, top: top}
		if (layout.top < 0) { layout.top = 0 }
		if (layout.left < 0) { layout.left = 0 }
		if (layout.left+target.offsetWidth>window.innerWidth) {
			layout.right = 0, layout.left = ""
		}
		if (top+target.offsetHeight>window.innerHeight-100) {
			layout.bottom = window.innerHeight - event.clientY+event.offsetY, layout.top = ""
		}
		return can.page.Modify(can, target, {style: layout}), can.onmotion.move(can, target, layout), layout
	},

	display: function(can, target) { target = target||can._target
		return can.page.Appends(can, target, [{view: [chat.LAYOUT, html.TABLE], list: [
			{type: html.TR, list: [{view: chat.CONTENT}]},
			{type: html.TR, list: [{view: chat.DISPLAY}]},
		]}])
	},
	project: function(can, target) { target = target||can._target
		return can.page.Append(can, target, [{view: [chat.LAYOUT, html.TABLE], list: [{type: html.TR, list: [
			{type: html.TD, list: [{view: chat.PROJECT, style: {display: html.NONE}}]}, {type: html.TD, list: [
				{view: [chat.LAYOUT, html.TABLE], list: [
					{type: html.TR, list: [{view: chat.CONTENT}]},
					{type: html.TR, list: [{view: chat.DISPLAY}]},
				]}
			]}
		]}] }])
	},
	profile: function(can, target) { target = target||can._output
		var gt = "&#10095;", lt = "&#10094;", down = "&#709;", up = "&#708;"
		function toggle(view) {
			view._toggle? view._toggle(event, view.style.display == html.NONE): can.onmotion.toggle(can, view)
			return view.style.display == html.NONE
		}

		var ui = can.page.Append(can, target, [{view: [chat.LAYOUT, html.TABLE], list: [
			{view: [chat.PROJECT, html.TD], list: [{view: [chat.PROJECT]}]},
			{type: html.TD, list: [
				{type: html.TR, list: [{type: html.TR, list: [
					{view: [chat.CONTENT, html.TD], list: [{view: [chat.CONTENT]},
						{view: ["toggle project"], list: [{text: [gt, html.DIV]}], onclick: function(event) {
							event.target.innerHTML = toggle(can.ui.project)? gt: lt
						}},
						{view: ["toggle profile"], list: [{text: [lt, html.DIV]}], onclick: function(event) {
							event.target.innerHTML = toggle(can.ui.profile)? lt: gt
						}},
						{view: ["toggle display"], list: [{text: [up, html.DIV]}], onclick: function(event) {
							event.target.innerHTML = toggle(can.ui.display)? up: down
						}},
					]},
					{view: [chat.PROFILE, html.TD], list: [{view: [chat.PROFILE], style: {display: html.NONE}}]},
				]}]},
				{view: [chat.DISPLAY, html.TR], list: [{view: [chat.DISPLAY], style: {display: html.NONE}}]}
			]}
		] }]); return can.ui = ui
	},
})
Volcanos("onmotion", {help: "动态特效", list: [], _init: function(can, target) {
	},
	focus: function(can, target) { if (!target) { return }
		target.setSelectionRange && target.setSelectionRange(0, -1), target.focus()
	},
	clear: function(can, target) {
		return can.page.Modify(can, target||can._output, ""), true
	},
	share: function(event, can, input, args) {
		return can.user.input(event, can, input, function(ev, button, data, list, _args) {
			can.search(can.request(event, {args: [mdb.TYPE, chat.FIELD].concat(args||[], _args||[])})._event, ["Header.onaction.share"])
		})
	},
	story: {
		_hash: {
			spark: function(can, meta, target) {
				if (meta[mdb.NAME] == html.INNER) {
					target.title = "点击复制", target.onclick = function(event) {
						can.user.copy(event, can, target.innerText)
					}
				} else {
					can.page.Select(can, target, html.SPAN, function(item) {
						item.title = "点击复制", item.onclick = function(event) {
							can.user.copy(event, can, item.innerText)
						}
					})
				}
			},
		},
		auto: function(can, target) { var that = this
			can.page.Select(can, target||can._output, ".story", function(item) { var meta = item.dataset
				can.page.Modify(can, item, {style: can.base.Obj(meta.style)})
				can.core.CallFunc(that._hash[meta.type], [can, meta, target||can._output])
			})
			can.page.Select(can, target||can._output, html.IFRAME, function(item) {
				can.page.Modify(can, item, {style: {height: can.Conf(html.HEIGHT)-88, width: can.Conf(html.WIDTH)-30}})
			})
			can.page.Select(can, target||can._output, html.SVG, function(item) {
				item.oncontextmenu = function(event) {
					can.user.carte(event, can, {"导出": function(event, can, button) {

					}}, ["导出"])
				}
				// can.page.Modify(can, item, {style: {height: can.Conf(html.HEIGHT)-88, width: can.Conf(html.WIDTH)-30}})
			})
		},
	},
	float: {_hash: {},
		del: function(can, key) {
			if (key == chat.CARTE) {
				can.page.Select(can, document.body, can.core.Keys(html.DIV, chat.CARTE), function(item) {
					can.page.Remove(can, item)
				})
			}
			this._hash[key] && can.page.Remove(can, this._hash[key]._target)
		},
		add: function(can, key, value) {
			this.del(can, key), this._hash[key] = value
		},

		auto: function(can, target, key) { var that = this
			var list = can.core.List(arguments).slice(2)
			if (list.length == 0) { list = [chat.CARTE, chat.INPUT] }
			can.page.Modify(can, target, {onmouseover: function(event) { 
				if (event.target.tagName == "IMG") { return }
				can.core.List(list, function(key, index) { that.del(can, key) })
			}})
		},
	},
	cache: function(can, next) { var list = can.base.Obj(can.core.List(arguments).slice(2), [can._output])
		can.core.List(list, function(item) { can.page.Cache(item._cache_key, item, item.scrollTop+1) })
		var key = next(can._cache_data = can._cache_data||{})
		return can.core.List(list, function(item) { var pos = can.page.Cache(item._cache_key = key, item)
			if (pos) { item.scrollTo(0, pos-1); return item }
		}).length > 0
	},
	delay: function(can, cb) {
		can.core.Timer(50, cb)
	},
	toimage: function(event, can, name, target) {
		can.user.input(event, can, [{name: "name", value: name}], function(ev, button, data) {
			can.require(["https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.5/dist/html2canvas.min.js"], function() {
				html2canvas(target||can._target).then(function (canvas) {
					can.page.Create(can, html.A, {href: canvas.toDataURL("image/png"), download: data.name}).click()
				})
			})
		})
	},

	hidden: function(can, target, show) {
		can.page.Modify(can, target||can._target, {style: {display: show? "": html.NONE}})
	},
	toggle: function(can, target, show, hide) { target = target||can._target
		var status = target.style.display == html.NONE
		can.page.Modify(can, target, {style: {display: status? "": html.NONE}})
		status? can.base.isFunc(show) && show(): can.base.isFunc(hide) && hide()
		return status
	},
	select: function(can, target, name, which) {
		can.page.Select(can, target, name, function(item, index) {
			if (item == which || which == index) {
				can.page.ClassList.add(can, item, html.SELECT)
			} else {
				can.page.ClassList.del(can, item, html.SELECT)
			}
		})
	},
	modify: function(can, target, cb, item) { var back = target.innerHTML, text = target.innerText
		if (back.length > 120 || back.indexOf(ice.NL) > -1) {
			return can.onmotion.modifys(can, target, cb)
		}
		var ui = can.page.Appends(can, target, [{type: html.INPUT, value: target.innerText, style: {
			width: target.offsetWidth > 400? 400: target.offsetWidth-20,
		}, onkeydown: function(event) {
			switch (event.key) {
				case lang.ENTER: target.innerHTML = event.target.value
					event.target.value == back || cb(event, event.target.value, back)
					break
				case lang.ESCAPE: target.innerHTML = back; break
				default: can.onkeymap.input(event, can)
			}
		}, _init: function(target) {
			item && can.onappend.figure(can, item, target), target.value = text
			can.onmotion.focus(can, target)
		}}])
	},
	modifys: function(can, target, cb, item) { var back = target.innerHTML
		var ui = can.page.Appends(can, target, [{type: html.TEXTAREA, value: target.innerText, style: {
			width: target.offsetWidth > 400? 400: target.offsetWidth-20, height: target.offsetHeight < 60? 60: target.offsetHeight-20,
		}, onkeydown: function(event) {
			switch (event.key) {
				case lang.ENTER:
					if (event.ctrlKey) {
						target.innerHTML = event.target.value
						event.target.value == back || cb(event, event.target.value, back)
					}
					break
				case lang.ESCAPE: target.innerHTML = back; break
				default: can.onkeymap.input(event, can)
			}
		}, _init: function(target) {
			item && can.onappend.figure(can, item, target)
			can.onmotion.focus(can, target)
		}}])
	},

	link: function(can, target, text) {
		if (target.innerText == "") { target.innerText = target.href }
		can.page.Modify(can, target, {target: "_blank"})
	},
	copy: function(can, target, text) {
		target.title = "点击复制", target.onclick = function(event) {
			can.user.copy(event, can, text||target.innerText)
		}
	},
	move: function(can, target, layout, cb) { var begin
		can.page.Modify(can, target, {style: layout})
		target.onmousedown = function(event) {
			layout.height = target.offsetHeight, layout.width = target.offsetWidth
			layout.left = target.offsetLeft, layout.top = target.offsetTop
			begin = can.base.Copy({x: event.x, y: event.y}, layout)
		}, target.onmouseup = function(event) { begin = null }

		target.onmousemove = function(event) { if (!begin || !event.ctrlKey) { return }
			if (event.shiftKey) {
				layout.width = layout.width + event.x - begin.x 
				layout.height = layout.height + event.y - begin.y
				can.page.Modify(can, target, {style: {width: layout.width, height: layout.height}})
			} else {
				layout.top = begin.top + event.y - begin.y
				layout.left = begin.left + event.x - begin.x 
				can.page.Modify(can, target, {style: {left: layout.left, top: layout.top}})
			}
			can.base.isFunc(cb) && cb(target)
			can.onkeymap.prevent(event)
		}
		can.base.isFunc(cb) && cb(target)
	},
	show: function(can, time, cb, target) { target = target||can._target
		time = can.base.isObject(time)? time: {interval: 10, length: time||30}

		can.page.Modify(can, target, {style: {opacity: 0, display: html.BLOCK}})
		can.core.Timer(time, function(event, value, index) {
			can.page.Modify(can, target, {style: {opacity: (index+1)/time.length}})
		}, cb)
	},
	hide: function(can, time, cb, target) { target = target||can._target
		time = can.base.isObject(time)? time: {value: 10, length: time||20}

		can.page.Modify(can, target, {style: {opacity: 1}})
		can.core.Timer(time, function(event, value, index) {
			can.page.Modify(can, target, {style: {opacity: 1-(index+1)/time.length}})
		}, function() {
			can.page.Modify(can, target, {style: {display: html.NONE}})
			can.base.isFunc(cb) && cb()
		})
	},


	selectField: function(event, can) {
		if (event.ctrlKey && event.key >= "0" && event.key <= "9") {
			if (event.shiftKey) {
				can.page.Select(can, can._option, "input[type=button]", function(item, index) {
					index == event.key && (item.click())
				})
				return
			}
			if (event.key == "0") { return can.onimport._back(can) }

			can.page.Select(can, can._output, html.TR, function(tr, index) { if (index == event.key) {
				var head = can.page.Select(can, can._output, html.TH, function(th, order) { return th.innerText })
				can.page.Select(can, tr, html.TD, function(td, index) { can.Option(head[index], td.innerText) })
				can.Update(event)
			} })
		}
	},
	selectTable: function(event, can, target, cb) {
		if (event.ctrlKey) {
			function select(order) {
				var index = 0; return can.page.Select(can, can._output, html.TR, function(tr) {
					if (can.page.ClassList.has(can, tr, html.HIDDEN)) { return }
					if (!can.page.ClassList.set(can, tr, html.SELECT, order == index++)) { return tr}
					can.base.isFunc(cb) && cb(tr)
					can.Status("index", index-1)
					return tr
				}).length
			}
			switch (event.key) {
				case "n":
					var total = select(target._index)
					select(target._index = ((target._index)+1) % total)
					can.onkeymap.prevent(event)
					break
				case "p":
					var total = select(target._index)
					select(target._index = (target._index-1) < 0? total-1: (target._index-1))
					can.onkeymap.prevent(event)
					break
				default: target._index = 0
			}
		}
	},
	selectTableInput: function(event, can, target, cb) {
		if (event.ctrlKey) {
			function select(order) { if (order == 0) { target.value = target._value }
				var index = 0; return can.page.Select(can, can._output, html.TR, function(tr) {
					if (can.page.ClassList.has(can, tr, html.HIDDEN)) { return }
					can.page.ClassList.del(can, tr, html.SELECT); if (order != index++) { return tr }
					can.page.ClassList.add(can, tr, html.SELECT), can.page.Select(can, tr, html.TD, function(td, index) {
						target._value = target._value||target.value, index == 0 && (target.value = td.innerText)
					}); return tr
				}).length
			}
			switch (event.key) {
				case "n":
					var total = select(target._index)
					select(target._index = ((target._index)+1) % total)
					break
				case "p":
					var total = select(target._index)
					select(target._index = (target._index-1) < 0? total-1: (target._index-1))
					break
				default: target._index = 0, target._value = ""; return
			}
			return can.onkeymap.prevent(event)
		}

		target._index = 0, target._value = ""
		can.page.Select(can, can._output, html.TR, function(tr, index) {
			var has = false; can.page.Select(can, tr, html.TD, function(td) {
				has = has || td.innerText.indexOf(target.value)>-1
			}), can.page.ClassList.set(can, tr, html.HIDDEN, !has && index != 0)
		})

		var total = can.page.Select(can, can._output, html.TR, function(tr) {
			if (!can.page.ClassList.has(can, tr, html.HIDDEN)) { return tr}
		}).length-1
		total == 0 && can.base.isFunc(cb) && cb()
		can.Status(kit.Dict(mdb.TOTAL, total, mdb.INDEX, target._index))
	},
})
Volcanos("onkeymap", {help: "键盘交互", list: [], _focus: [], _init: function(can, target) {
		can.onkeymap._build(can), document.body.onkeydown = function(event) { if (event.metaKey) { return }
			if (event.target.tagName == "SELECT" || event.target.tagName == "INPUT" || event.target.tagName == "TEXTAREA") { return }
			var msg = can.request(event, {"model": "normal"}); if (msg.Option(ice.MSG_HANDLE) == ice.TRUE) { return }
			can.onengine.signal(can, "onkeydown", msg); if (msg.Option(ice.MSG_HANDLE) == ice.TRUE) { return }
			can._keylist = can.onkeymap._parse(event, can, msg.Option("model"), can._keylist, can._output)
		}
	},
	_build: function(can) {
		can.core.Item(can.onkeymap._mode, function(item, value) { var engine = {list: {}}
			can.core.Item(value, function(key, cb) { var map = engine
				for (var i = 0; i < key.length; i++) {
					if (!map.list[key[i]]) { map.list[key[i]] = {list: {}} }
					map = map.list[key[i]]; if (i == key.length-1) { map.cb = cb }
				}
			}), can.onkeymap._engine[item] = engine
		})
	},
	_parse: function(event, can, mode, list, target) { list = list||[]
		if (["Control", "Shift"].indexOf(event.key) > -1) { return list }
		list.push(event.key); for (var pre = 0; pre < list.length; pre++) {
			if ("0" <= list[pre] && list[pre] <= "9") { continue } break
		}; var count = parseInt(list.slice(0, pre).join(""))||1


		var map = can.onkeymap._mode[mode]
		function repeat(cb, count) { list = []; for (var i = 1; i <= count; i++) { if (cb(event, can, target, count)) { break } } }
		var cb = map && map[event.key]; if (can.base.isFunc(cb) && event.key.length > 1) { repeat(cb, count); return list }
		var cb = map && map[event.key.toLowerCase()]; if (can.base.isFunc(cb) && event.key.length > 1) { repeat(cb, count); return list }

		can.misc.Log("keys", count, list)
		var map = can.onkeymap._engine[mode]; if (!map) { return [] }
		for (var i = pre; i < list.length; i++ ) {
			var map = map.list[list[i]]; if (!map) { return [] }
			if (i == list.length-1 && can.base.isFunc(map.cb)) { repeat(map.cb, count); return [] }
		}
		return list
	},
	_mode: {
		insert: {
			jk: function(event, can, target) { target.blur(), can.onkeymap.deleteText(target, target.selectionStart-1, target.selectionStart) },
			Escape: function(event, can, target) { target.blur() },
			Enter: function(event, can, target) {
				var his = target._history||[]; his.push(target.value)
				event.target.tagName == "INPUT" && can.onmotion.focus(can, target)
				target._history = his, target._current = his.length
			},
		},
		insert_ctrl: {
			p: function(event, can, target) {
				var his = target._history||[], pos = target._current||0
				pos = --pos % (his.length+1); if (pos < 0) { pos = his.length }
				target._current = pos, target.value = his[pos]||""
			},
			n: function(event, can, target) {
				var his = target._history||[], pos = target._current||0
				pos = ++pos % (his.length+1)
				target._current = pos, target.value = his[pos]||""
			},

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
		},
	}, _engine: {},

	input: function(event, can) { if (event.metakey) { return } var target = event.target
		target._keys = can.onkeymap._parse(event, can, event.ctrlKey? "insert_ctrl": mdb.INSERT, target._keys, target)
	},
	prevent: function(event) { event.stopPropagation(), event.preventDefault() },
	deleteText: function(target, start, count) { var end = count? start+count: target.value.length
		var cut = target.value.slice(start, end)
		target.value = target.value.substring(0, start)+target.value.substring(end, target.value.length)
		return target.setSelectionRange(start, start), cut
	},
	insertText: function(target, text) { var start = target.selectionStart
		var before = target.value.slice(0, target.selectionStart)
		var after = target.value.slice(target.selectionEnd)
		target.value = before+text+after
		return target.setSelectionRange(start+1, start+1)
	},
	cursorMove: function(can, target, count, begin) { begin != undefined && target.setSelectionRange(begin, begin)
		target.setSelectionRange(target.selectionStart+count, target.selectionStart+count)
	},
})
_can_name = ""
