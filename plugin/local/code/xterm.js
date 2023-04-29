Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb) { can.page.requireModules(can, ["xterm/css/xterm.css", "xterm", "xterm-addon-fit", "xterm-addon-web-links"], function() {
		var item = msg.TableDetail(); item.hash = item.hash||can.Option(mdb.HASH), can.onmotion.clear(can), can.base.isFunc(cb) && cb(msg), can.onappend._status(can), can.onkeymap._build(can)
		if (item.type == html.LAYOUT) { can.onimport._layout(can, item) } else { can.onimport._connect(can, item, can._output) } can.onimport.layout(can)
		can.sup.onexport.link = function() { return can.misc.MergePodCmd(can, {pod: can.Conf(ice.POD), cmd: web.CODE_XTERM, hash: item.hash}) }
		can.sup.onexport.title(can, item.name||item.type)
	}) },
	_layout: function(can, item) {
		function connect(item, output, tabs) { can.run(can.request({}, item), [item.hash], function(msg) {
			can.core.Item(msg.TableDetail(), function(key, value) { item[key] = value })
			can.onappend._status(can), can.onimport._connect(can, item, output, tabs)
		}, true); return output }
		function show(list, target, root, tabs) { root = root||target, can.core.List(list, function(item) {
			if (item.type.indexOf(html.LAYOUT) == 0) {
				show(item.list, can.page.Append(can, target, [item.type])._target, root, tabs)._root = root
			} else {
				connect(item, can.page.Append(can, target, [html.OUTPUT])._target, tabs)._root = root
			}
		}); return target }
		var main, output = can._output; can.core.List(can.base.Obj(item.text), function(item) {
			if (item.type.indexOf(html.LAYOUT) == 0) { var tabs = can.onimport._tabs(can, item, {})
				var target = show(item.list, can.page.insertBefore(can, [item.type], can._status), null, tabs); target._tabs = tabs, tabs._output = target
				if (item.type.indexOf(html.HIDE) == -1) { main = target }
			} else {
				var target = connect(item, output||can.page.insertBefore(can, [html.OUTPUT], can._status)); output = null
				main = main||target
			}
		}), main && can.onaction.select(can, main)
	},
	_tabs: function(can, item, output) { if (output != output._root && output._root) { return output._tabs = output._root._tabs }
		var tabs = can.onimport.tabs(can, [{name: item.name||item.type||item.hash}], function() {
			can.onmotion.delay(can, function() { var output = tabs._output; can.onaction.select(can, output._root||output) })
		}, function() { can.onaction.delete(can, tabs._output) }); return tabs._output = output, output._tabs = tabs
	},
	_theme: function(can, item) { return can.base.Obj(item.theme)||(
		can.getHeaderTheme() == html.LIGHT? {background: cli.WHITE, foreground: cli.BLACK, cursor: cli.BLUE}:
			can.getHeaderTheme() == html.DARK? {foreground:"silver", cursor: "silver"}:
			can.getHeaderTheme() == chat.BLACK? {background: "#061c3c9e", foreground:cli.WHITE, cursor: cli.WHITE}:
			{background: "#d5cfcf3b", foreground: cli.BLACK, cursor: cli.BLUE}
	) },
	_connect: function(can, item, output, tabs, text) { var term = new Terminal({tabStopWidth: 4, cursorBlink: true, theme: can.onimport._theme(can, item)})
		term._item = item, term._output = output, output._term = term, output._tabs || (tabs? (output._tabs = tabs): can.onimport._tabs(can, item, output))
		var fitAddon = new FitAddon.FitAddon(); term.loadAddon(fitAddon), term._fit = fitAddon, can.onmotion.delay(can, function() { fitAddon.fit() })
		term.onTitleChange(function(title) { can.onexport.title(can, term, title) }), can.onexport.title(can, term, item.name)
		term.onResize(function(size) { can.onimport._resize(can, term, size) })
		term.onData(function(data) { can.onimport._input(can, term, data) })
		term.onCursorMove(function() { can.onexport.term(can, term) })
		term.loadAddon(new WebLinksAddon.WebLinksAddon())
		can.onmotion.clear(can, output), term.open(output), term.focus(), text && can.onmotion.delay(can, function() { term.write(text.replaceAll(lex.NL, "\r\n")) })
		can.onengine.listen(can, chat.ONTHEMECHANGE, function() { can = can.core.Value(can.sup, chat._OUTPUTS_CURRENT)
			term.selectAll(), can.onimport._connect(can, item, output, tabs, can.base.trimSuffix(term.getSelection(), lex.NL))
		}), can.page.style(can, output, html.BACKGROUND_COLOR, term._publicOptions.theme.background||cli.BLACK)
		output.onclick = function() { output._tabs._current = output
			can.onmotion.select(can, can._fields, html.DIV_OUTPUT, can._output = output), term.focus(), can.onexport.term(can, term)
		}; return can.db = can.db||{}, can.db[item.hash] = term
	},
	_resize: function(can, term, size) { can.runAction(can.request({}, size, term._item), web.RESIZE, [], function() { can.onexport.term(can, term) }) },
	_input: function(can, term, data) {
		if (data == "\u0013") { can._delay = true
			can.onmotion.delay(can, function() { can._delay && can.runAction(can.request({}, term._item), web.INPUT, [btoa(data)], function() {}) })
		} else {
			if (can._delay) { can._delay = false; var msg = can.request({}, {_handle: ice.TRUE}, term._item)
				can._keylist = can.onkeymap._parse({key: data, _msg: msg}, can, mdb.NORMAL, can._keylist||[], term); return
			} can._output = term._output, can.runAction(can.request({}, term._item), web.INPUT, [btoa(data)], function() {})
		}
	},
	grow: function(can, msg) { var arg = msg.detail.slice(1), term = can.db[arg[0]]; arg[1] == "~~~end~~~"? can.onaction.delete(can, term._output): term.write(arg[1]); msg.Option(ice.LOG_DISABLE, ice.TRUE) },
	layout: function(can) { function show(target, height, width) { var list = can.page.SelectChild(can, target, can.page.Keys(html.DIV_OUTPUT, html.DIV_LAYOUT))
		var h = height/list.length, w = width; if (can.page.ClassList.has(can, target, html.FLEX)) { h = height, w = width/list.length } if (target == can._fields) { h = height, w = width }
		can.core.List(list, function(target) { can.page.style(can, target, html.HEIGHT, h, html.WIDTH, w), can.page.ClassList.has(can, target, html.LAYOUT)? show(target, h, w): target._term && target._term._fit.fit() })
	} show(can._fields, can.ConfHeight(), can.ConfWidth()) },
})
Volcanos(chat.ONKEYMAP, {
	_mode: {
		normal: {
			u: function(event, can) { can.onaction.split(event, can, html.FLOW) },
			v: function(event, can) { can.onaction.split(event, can, html.FLEX) },
			j: function(event, can) { can.onaction.selectSibling(can, html.FLOW) },
			k: function(event, can) { can.onaction.selectSibling(can, html.FLOW, true) },
			h: function(event, can) { can.onaction.selectSibling(can, html.FLEX, true) },
			l: function(event, can) { can.onaction.selectSibling(can, html.FLEX) },
			c: function(event, can) { can.onaction.tabnew(event, can) },
			e: function(event, can) { can.user.input({target: can._output._tabs}, can, [mdb.NAME], function(list) { can.onexport.title(can, can._output._term, list[0]) }) },
			n: function(event, can) { can._output._tabs.nextSibling && can._output._tabs.nextSibling.click() },
			p: function(event, can) { can._output._tabs.previousSibling && can._output._tabs.previousSibling.click() },
			s: function(event, can) { can.onaction.sess(event, can) },
			t: function(event, can) { can.user.input({target: can._output._tabs}, can, [ctx.INDEX, ctx.ARGS], function(list, data) { can.onimport.tool(can, [data], function(sub) {
				sub.select(), sub.onexport.record = function(_, value) { can.onimport._input(can, can._output._term, value+lex.NL) }
			}, can._fields) }) },
			f: function(event, can) {
				var input = can.user.input({target: can._output._tabs}, can, [{type: mdb.TEXT, name: nfs.FILE, select: function(item) {
					var ls = item.split(nfs.DF); switch (ls[0]) {
						case "tabs": can.page.Select(can, can._action, [html.DIV_TABS, html.SPAN_NAME], function(target) { target.innerText == ls[1] && target.click() }); break
						case web.LAYOUT: can.Option(mdb.HASH, ls[1]), can.Update(); break
						case ctx.INDEX: can.onimport.tool(can, [ls[1]], function(sub) { sub.select() }); break
						case ssh.SHELL: can.onaction.tabnew(can.request({}, {_handle: ice.TRUE, type: ls[1]}), can); break
						default: can.onimport._input(can, can._output._term, item+lex.NL)
					} input.cancel()
				}, run: function(event, cmds, cb) { can.run(event, cmds, function(msg) { var _msg = can.request()
					function push(type, name) { _msg.Push(nfs.FILE, can.core.List(arguments).join(nfs.DF)) }
					can.page.Select(can, can._action, [html.DIV_TABS, html.SPAN_NAME], function(target) { push("tabs", target.innerText) })
					_msg.Copy(msg), can.core.Item(can.onengine.plugin.meta, function(key, value) { push(ctx.INDEX, "can."+key) }), cb(_msg)
				}) }}], function(list) {})
			},
			Escape: function(can) { can.onmotion.clearFloat(can), can._output.click() },
		},
	}, _engine: {},
})
Volcanos(chat.ONACTION, {
	tabnew: function(event, can) { can.Update(event, [ctx.ACTION, mdb.CREATE], function(msg) { can.Update(event, [msg.Result()], function(msg) {
		can.onaction.select(can, can._output = can.page.insertBefore(can, [html.OUTPUT], can._status)), can.onimport._init(can, msg)
	}) }) },
	split: function(event, can, button) { can.Update(event, [ctx.ACTION, mdb.CREATE], function(msg) { can.Update(event, [msg.Result()], function(msg) {
		if (can.page.ClassList.has(can, can._output.parentNode, button)) { var layout = can._output.parentNode } else {
			var layout = can.page.insertBefore(can, [{view: [[html.LAYOUT, button]]}], can._output); layout.appendChild(can._output)
		} var root = can._output._root||layout, tabs = can._output._tabs; tabs._output = root, root._tabs = tabs
		can._output._root = root, can._output = can.page.insertBefore(can, [html.OUTPUT], can._output.nextSibling, layout)
		can._output._root = root, can._output._tabs = tabs, can.onimport._init(can, msg), can.onmotion.delay(can, function() { can._output.click() })
	}) }) },
	delete: function(can, output) { if (can.page.Select(can, can._fields, html.DIV_OUTPUT).length == 1) { can.onmotion.delay(can, function() { can.sup.onimport._back(can.sup) }) }
		if (output == can.sup._output) { can.onmotion.clear(can, output) } else { while (output && output.parentNode.children.length == 1) { output = output.parentNode }
			var next = output.parentNode; can.page.Remove(can, output), can.onmotion.delay(can, function() { can.page.Select(can, next, html.DIV_OUTPUT, function(target) { target.click() }) })
		} can.onimport.layout(can)
	},
	select: function(can, output) { can.page.SelectChild(can, can._fields, can.page.Keys(html.DIV_OUTPUT, html.DIV_LAYOUT), function(target) { can.onmotion.hidden(can, target, target == output || target == output._root)
		can.onmotion.delay(can, function() {
			output._tabs._current? output._tabs._current.click(): (target.click(), can.page.SelectOne(can, target, html.DIV_OUTPUT, function(target) { target.click() }))
			can.page.Select(can, target, can.page.Keys(html.DIV_OUTPUT, html.DIV_LAYOUT), function(target) { target._term && target._term._fit.fit() })
		})
	}) },
	selectSibling: function(can, layout, prev) { var key = prev? "previousSibling": "nextSibling"
		var output = can._output; while ((!output[key] || !can.page.ClassList.has(can, output.parentNode, layout)) && output != can._fields) { output = output.parentNode }
		if (can.page.ClassList.has(can, output.parentNode, layout) && output[key]) {
			can.page.SelectOne(can, output[key], html.DIV_OUTPUT, function(target) { target.click() })||output[key].click()
		}
	},
	sess: function(event, can) { can.user.input({target: can._legend}, can, [mdb.NAME], function(list) {
		can.runAction({}, mdb.CREATE, [mdb.TYPE, html.LAYOUT, mdb.NAME, list[0], mdb.TEXT, can.base.Format(can.onexport.sess(can))], function(msg) {
			can.user.toastSuccess(can, can.user.trans(can, nfs.SAVE)+lex.SP+msg.Result())
		}, true)
	}) },
	onkeydown: function(event, can) {
		if (can.onkeymap.selectCtrlN(event, can, can._action, html.DIV_TABS)) { return }
		can._keylist = can.onkeymap._parse(event, can, mdb.NORMAL, can._keylist||[], can._output._term)
	},
	hidden: function(can) { can.page.Select(can, can._fields, "div.output,div.layout", function(target) {
		target == can.sup._output? can.page.insertBefore(can, target, can._status): can.page.Remove(can, target)
	}) },
})
Volcanos(chat.ONEXPORT, {list: [mdb.TIME, mdb.HASH, mdb.TYPE, mdb.NAME, "rows", "cols", "cursorY", "cursorX"],
	term: function(can, term) { item = term._item
		can.core.List(can.onexport.list, function(key) { can.Status(key, can.base.getValid(item[key], term[key], term.buffer.active[key], "")+"") })
		can.core.List([mdb.TIME, mdb.HASH, mdb.TYPE, mdb.NAME], function(key) { can.Status(key, item[key]||"") })
	},
	sess: function(can) { return can.page.Select(can, can._action, html.DIV_TABS, function(target) { function show(target) {
		var name = can.page.SelectOne(can, target._tabs, html.SPAN_NAME).innerText
		if (can.page.ClassList.has(can, target, html.LAYOUT)) {
			return {type: target.className, name: name, list: can.page.SelectChild(can, target, can.page.Keys(html.DIV_OUTPUT, html.DIV_LAYOUT), function(target) { return show(target) })}
		} else { var item = target._term._item; return {type: item.type, name: name, text: item.text, hash: item.hash} }
	} return show(target._output) }) },
	title: function(can, term, title) { can.page.Modify(can, can.page.SelectOne(can, term._output._tabs, html.SPAN_NAME), title), can.Status(mdb.NAME, title), can.sup.onexport.title(can.sup, title) },
})
