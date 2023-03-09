Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb) { can.page.requireModules(can, ["xterm/css/xterm.css", "xterm", "xterm-addon-fit", "xterm-addon-web-links"], function() {
		var item = msg.TableDetail(); item.hash = item.hash||can.Option(mdb.HASH), can.onmotion.clear(can), can.base.isFunc(cb) && cb(msg), can.onappend._status(can)
		if (item.type == html.LAYOUT) { can.onimport._layout(can, item) } else { can.onimport._connect(can, item, can._output) } can.onimport.layout(can)
		can.sup.onexport.link = function() { return can.misc.MergePodCmd(can, {cmd: web.CODE_XTERM, hash: item.hash, style: html.OUTPUT}) }
	}) },
	_layout: function(can, item) {
		function show(list, target, root, tabs) { root = root||target, can.core.List(list, function(item) {
			if (item.type.indexOf(html.LAYOUT) == 0) {
				show(item.list, can.page.Append(can, target, [item.type])._target, root, tabs)._root = root
			} else {
				can.onimport._connect(can, item, can.page.Append(can, target, [html.OUTPUT])._target, tabs)._output._root = root
			}
		}); return target }
		var main, output = can._output; can.core.List(can.base.Obj(item.text), function(item) {
			if (item.type.indexOf(html.LAYOUT) == 0) { var tabs = can.onimport._tabs(can, item, {})
				var target = show(item.list, can.page.insertBefore(can, [item.type], can._status), null, tabs); target._tabs = tabs, tabs._output = target
				if (item.type.indexOf(html.HIDE) == -1) { main = target }
			} else {
				main = main||can.onimport._connect(can, item, output||can.page.insertBefore(can, [html.OUTPUT], can._status))._output, output = null
			}
		}), can.onaction.select(can, main)
	},
	_tabs: function(can, item, output) { if (output != output._root && output._root) { return output._tabs = output._root._tabs }
		var tabs = can.page.Append(can, can._action, [{view: [html.TABS, "", item.name||item.type||item.hash], onclick: function() {
			can.onaction.select(can, tabs._output)
		}}])._target; return tabs._output = output, output._tabs = tabs
	},
	_theme: function(can, item) { return can.base.Obj(item.theme)||(can.getHeaderTheme() == html.LIGHT? {background: cli.WHITE, foreground: cli.BLACK, cursor: cli.BLUE}: {}) },
	_connect: function(can, item, output, tabs, text) { var term = new Terminal({tabStopWidth: 4, cursorBlink: true, theme: can.onimport._theme(can, item)})
		var fitAddon = new FitAddon.FitAddon(); term.loadAddon(fitAddon), term._fit = fitAddon, can.onmotion.delay(can, function() { fitAddon.fit() })
		term.onTitleChange(function(title) { can.onexport.title(can, title) }), can.onexport.title(can, item.name)
		term.onResize(function(size) { can.onimport._resize(can, term, size) })
		term.onData(function(data) { can.onimport._input(can, term, data) })
		term.onCursorMove(function() { can.onexport.term(can, term) })
		term.loadAddon(new WebLinksAddon.WebLinksAddon())
		term._item = item, term._output = output, output._term = term, output._tabs || (tabs? (output._tabs = tabs): can.onimport._tabs(can, item, output))
		term.open(output), term.focus(), text && term.write(text.replaceAll(ice.NL, "\r\n"))
		can.onengine.listen(can, chat.ONTHEMECHANGE, function() { can = can.core.Value(can.sup, chat._OUTPUTS_CURRENT)
			term.selectAll(), can.onimport._connect(can, item, output, tabs, can.base.trimSuffix(term.getSelection(), ice.NL))
		}), can.page.style(can, output, html.BACKGROUND_COLOR, term._publicOptions.theme.background||cli.BLACK)
		output.onclick = function() { can.onmotion.select(can, can._fields, html.DIV_OUTPUT, can._output = output), can.onexport.term(can, term) }
		return can.db = can.db||{}, can.db[item.hash] = term
	},
	_resize: function(can, term, size) { can.runAction(can.request({}, size, term._item), web.RESIZE, [], function() { can.onexport.term(can, term) }) },
	_input: function(can, term, data) { can._output = term._output, can.runAction(can.request({}, term._item), web.INPUT, [btoa(data)], function() {}) },
	grow: function(can, msg) { var arg = msg.detail.slice(1), term = can.db[arg[0]]; arg[1] == "~~~end~~~"? can.onaction.delete(can, term._output): term.write(arg[1]) },
	layout: function(can) { function show(target, height, width) { var list = can.page.SelectChild(can, target, can.page.Keys(html.DIV_OUTPUT, html.DIV_LAYOUT))
		var h = height/list.length, w = width; if (can.page.ClassList.has(can, target, html.FLEX)) { h = height, w = width/list.length } if (target == can._fields) { h = height, w = width }
		can.core.List(list, function(target) { can.page.style(can, target, html.HEIGHT, h, html.WIDTH, w), can.page.ClassList.has(can, target, html.LAYOUT)? show(target, h, w): target._term && target._term._fit.fit() })
	} show(can._fields, can.ConfHeight(), can.ConfWidth()) },
})
Volcanos(chat.ONACTION, {list: ["+", "-", "/", "sess"],
	"+": function(event, can) { can.Update(event, [ctx.ACTION, mdb.CREATE], function(msg) { can.Update(event, [msg.Result()], function(msg) {
		can.onaction.select(can, can._output = can.page.insertBefore(can, [html.OUTPUT], can._status)), can.onimport._init(can, msg)
	}) }) },
	"-": function(event, can) { can.onaction.split(event, can, html.FLOW) },
	"/": function(event, can) { can.onaction.split(event, can, html.FLEX) },
	split: function(event, can, button) { can.Update(event, [ctx.ACTION, mdb.CREATE], function(msg) { can.Update(event, [msg.Result()], function(msg) {
		if (can.page.ClassList.has(can, can._output.parentNode, button)) { var layout = can._output.parentNode } else {
			var layout = can.page.insertBefore(can, [{view: [[html.LAYOUT, button]]}], can._output); layout.appendChild(can._output)
		}
		var root = can._output._root||layout, tabs = can._output._tabs; tabs._output = root, root._tabs = tabs
		can._output._root = root, can._output = can.page.insertBefore(can, [html.OUTPUT], can._output.nextSibling, layout)
		can._output._root = root, can._output._tabs = tabs, can.onimport._init(can, msg)
	}) }) },
	delete: function(can, output) {
		if (output == can.sup._output) {
			can.onmotion.clear(can, output)
		} else {
			while (output && output.parentNode.children.length == 1) { output = output.parendNode }
			can.page.Remove(can, output)
		} can.onimport.layout(can)
	},
	select: function(can, output) { can.page.SelectChild(can, can._fields, can.page.Keys(html.DIV_OUTPUT, html.DIV_LAYOUT), function(target) { can.onmotion.hidden(can, target, target == output || target == output._root)
		can.onmotion.delay(can, function() { can.page.Select(can, target, can.page.Keys(html.DIV_OUTPUT, html.DIV_LAYOUT), function(target) { target._term && target._term._fit.fit() }) })
	}) },
	sess: function(can) { can.runAction({}, mdb.CREATE, [mdb.TYPE, html.LAYOUT, mdb.TEXT, can.base.Format(can.onexport.sess(can))], function() {}, true) },
})
Volcanos(chat.ONEXPORT, {list: [mdb.TIME, mdb.HASH, mdb.TYPE, mdb.NAME, "rows", "cols", "cursorY", "cursorX"],
	term: function(can, term) { item = term._item
		can.core.List(can.onexport.list, function(key) { can.Status(key, can.base.getValid(item[key], term[key], term.buffer.active[key], "")+"") })
		can.core.List([mdb.HASH, mdb.TYPE, mdb.NAME], function(key) { can.Status(key, item[key]||"") })
	},
	sess: function(can) { return can.page.Select(can, can._action, html.DIV_TABS, function(target) { function show(target) {
		if (can.page.ClassList.has(can, target, html.LAYOUT)) {
			return {type: target.className, name: target._tabs? target._tabs.innerText: "", list: can.page.SelectChild(can, target, can.page.Keys(html.DIV_OUTPUT, html.DIV_LAYOUT), function(target) { return show(target) })}
		} else {
			var item = target._term._item; return {type: item.type, name: target._tabs.innerText, text: item.text, hash: item.hash}
		}
	} return show(target._output) }) },
	title: function(can, title) { can.page.Modify(can, can._output._tabs, title), can.Status(mdb.NAME, title), can.sup.onexport.title(can.sup, title) },
})
