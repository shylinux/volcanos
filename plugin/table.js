Volcanos(chat.ONIMPORT, {_init: function(can, msg, target) { can.onmotion.clear(can, target)
		if (can.isCmdMode) {
			can.page.style(can, can._output, html.MAX_WIDTH, can.ConfWidth()||window.innerWidth)
		}
		if (can.Mode() == html.ZONE) {
			msg.Table(function(value) { var action = []
				can.page.Select(can, can.page.Create(can, html.DIV, value.action), html.INPUT, function(target) {
					action.push(target.name), target.name != target.value && can.user.trans(can, kit.Dict(target.name, target.value))
				})
				can.onimport.item(can, {name: can.page.Color(value[can.Conf(mdb.FIELD)||mdb.VIEW]||value[mdb.NAME])}, function() {
					can.sup.onexport.record(can, value.name, mdb.NAME, value)
				}, function() { return shy(action, function(event, button, meta, carte) { can.misc.Event(event, can, function(msg) {
					can.sup.onexport.action(can, button, value) || can.run(event, [ctx.ACTION, button], function(msg) { can.Update() })
					carte.close()
				}, value) }) })
			})
			return
		}
		var cbs = can.onimport[can.Conf(ctx.STYLE)||msg.Option(ctx.STYLE)]; if (can.base.isFunc(cbs)) {
			can.onappend.style(can, can._args[ctx.STYLE], target), can.core.CallFunc(cbs, {can: can, msg: msg, target: target})
		} else { can.onappend.table(can, msg, null, target), can.onappend.board(can, msg, target) } can.onmotion.story.auto(can, target)
		if (can.isCmdMode()) { can.page.style(can, can._output, html.MAX_HEIGHT, can.ConfHeight()) }
	},
	_system_app: function(can, msg, target) {
		can.page.Appends(can, target, msg.Table(function(item) { var name = item.name||item.text
			return {view: html.ITEM, style: {"text-align": "center", margin: 10, width: 100, "float": "left"}, list: [
				{type: html.IMG, src: "/share/local/usr/icons/"+item.text, style: {display: html.BLOCK, width: 100}},
				{text: name.split(ice.PT)[0].replace(ice.SP, ice.NL), style: {display: html.BLOCK, height: 40}},
			], onclick: function(event) { can.runAction(can.request(event, item, can.Option()), "xterm", []) }}
		}))
	},
	_open: function(can, msg, target) {
		can.page.Appends(can, target, msg.Table(function(item) {
			return {view: html.ITEM, style: {"text-align": "center", margin: 10, width: 100, "float": "left"}, list: [
				{type: html.IMG, src: "/share/local/usr/icons/"+item.name, style: {display: html.BLOCK, width: 100}},
				{text: item.name.split(ice.PT)[0].replace(ice.SP, ice.NL), style: {display: html.BLOCK, height: 40}},
			], onclick: function(event) { can.runAction(can.request(event, item, can.Option()), "click", []) }}
		}))
	},
	_zone: function(can, zone, index, cb, field) { zone._delay_show = function() { can.onimport.plug(can, {index: index, mode: html.ZONE, field: field}, function(sub) {
		var action = can.core.List(sub.Conf(ctx.INPUTS), function(item) { if (item.type == html.BUTTON && [ice.LIST, ice.BACK].indexOf(item.name) == -1) { return item.name } })
		sub.onexport.output = function(sub, msg) { zone._total(msg.Length()), cb(sub, msg)
			zone._menu = shy({_trans: sub._trans}, action.concat(can.base.Obj(msg.Option(ice.MSG_ACTION), [])), function(event, button, meta, carte) {
				sub.Update(event, [ctx.ACTION, button]), carte.close()
			}), can.user.toastSuccess(can)
		}, zone._target = sub._target, can.ui[zone.name].refresh = function() { sub.Update() }
	}, zone._target) } },
	card: function(can, msg, target) { can.page.Appends(can, target||can._output, msg.Table(function(item) {
		return {view: [[html.ITEM, item.status]], list: [{view: [wiki.TITLE, html.DIV, item.name]}, {view: [wiki.CONTENT, html.DIV, item.text]},
			{view: html.ACTION, inner: item.action, onclick: function(event) { can.run(can.request(event, item), [ctx.ACTION, event.target.name]) }},
		]}
	})) },

	tabs: function(can, list, cb, cbs, action) { action = action||can._action
		return can.page.Append(can, action, can.core.List(list, function(tabs) {
			function close(target) { var next = target.nextSibling||target.previousSibling; if (!next) { return }
				next.click(), can.onmotion.delay(can, function() { can.base.isFunc(cbs) && cbs(tabs), can.page.Remove(can, target) })
			}
			return {view: html.TABS, title: tabs.text, list: [{text: [tabs.name, html.SPAN]}, {text: ["\u2715", html.SPAN, html.ICON], onclick: function(event) {
				close(event.target.parentNode), can.onkeymap.prevent(event)
			}}], onclick: function(event) {
				can.onmotion.select(can, action, html.DIV_TABS, tabs._target), can.base.isFunc(cb) && cb(event, tabs)
			}, _init: function(target) { tabs._target = target; var menu = tabs._menu||shy()
				can.page.Modify(can, target, {draggable: true, _close: function() { close(target) },
					ondragstart: function(event) { action._drop = function(before) { before.parentNode == action && action.insertBefore(target, before) } },
					ondragover: function(event) { event.preventDefault(), action._drop(event.target) },
					oncontextmenu: function(event) { can.user.carte(event, can, kit.Dict("Close", function(event) { close(target) },
						"Close Other", function(event) { can.page.Select(can, action, html.DIV_TABS, function(target) { target == tabs._target || close(target) }) },
						menu.meta
					), ["Close", "Close Other", ""].concat(can.base.getValid(menu.list, can.core.Item(menu.meta))), function(event, button, meta) { (meta[button]||menu)(event, button, meta) }) },
				}), can.onmotion.delay(can, function() { target.click() })
			}}
		}))._target
	},
	tool: function(can, list, cb, target, status) { target = target||can._output, status = status||can._status
		can.core.List(list.reverse(), function(meta) { can.base.isString(meta) && (meta = {index: meta}), meta.mode = html.FLOAT
			can.onimport.plug(can, meta, function(sub) { can.onmotion.hidden(can, sub._target), sub._delay_init = true
				sub.ConfHeight(can.ConfHeight()-4*html.ACTION_HEIGHT), sub.ConfWidth(can.ConfWidth()), can.page.style(can, sub._output, html.MAX_HEIGHT, sub.ConfHeight(), html.MAX_WIDTH, sub.ConfWidth())
				status.appendChild(sub._legend), sub._legend._fields = sub._target, sub._legend.onclick = function(event) { can.misc.Event(event, can, function(msg) {
					if (can.page.SelectOne(can, status, ice.PT+html.SELECT, function(target) { can.onmotion.hidden(can, target._fields), can.page.ClassList.del(can, target, html.SELECT) }) == sub._legend) { return }
					if (sub._delay_init || meta.msg) { sub._delay_init = false, meta.msg = false, sub.Update() }
					can.onmotion.select(can, status, html.LEGEND, sub._legend), can.onmotion.toggle(can, sub._target, true), sub.Focus()
				}) }, sub.select = function() { return sub._legend.click(), sub }, sub.onaction.close = function() { sub.select() }, can.base.isFunc(cb) && cb(sub)
			}, target)
		})
	},
	plug: function(can, meta, cb, target) { if (!meta || !meta.index) { return }
		meta.type = meta.type||html.PLUG, meta.name = meta.index, can.onappend.plugin(can, meta, function(sub) { sub.sup = can
			sub.ConfHeight(can.ConfHeight()-2*html.ACTION_HEIGHT), sub.ConfWidth(can.ConfWidth()), can.page.style(can, sub._output, html.MAX_HEIGHT, sub.ConfHeight(), html.MAX_WIDTH, sub.ConfWidth())
			sub.run = function(event, cmds, cb) { if (can.page.Select(can, sub._option, "input[name=path]").length > 0 && sub.Option(nfs.PATH) == "") { sub.request(event, {path: "./"}) }
				can.runActionCommand(can.request(event, can.Option()), meta.index, cmds, cb)
			}, sub.onaction.close = function() { can.onmotion.hidden(can, target) }, can.base.isFunc(cb) && cb(sub)
		}, target)
	},
	icon: function(can, name, button, target) {
		can.page.Append(can, target, [{text: [name, html.SPAN, html.ICON], onclick: function(event) {
			can.base.isFunc(button)? button(event, button): can.onaction[button](event, can, button), can.onkeymap.prevent(event)
		}}])
	},
	zone: function(can, list, target) {
		return can.page.Append(can, target, can.core.List(list, function(zone) { can.base.isString(zone) && (zone = {name: zone}); return zone && {view: [[html.ZONE, zone.name]], list: [
			{view: html.ITEM, inner: can.user.trans(can, zone.name), _init: function(target) { zone._legend = target }, onclick: function() {
				if (zone._delay_show) { zone._delay_show(zone._target, zone), delete(zone._delay_show) }
				can.onmotion.toggle(can, zone._action), can.onmotion.toggle(can, zone._target)
			}, oncontextmenu: function(event) { var menu = zone._menu
				menu? can.user.carteRight(event, can, menu.meta, menu.list||can.core.Item(menu.meta), can.base.isFunc(menu)? menu: function(event, button, meta, carte) {
					can.runAction(event, button), carte.close()
				}): can.onmotion.clearCarte(can)
			}},
			{view: html.ACTION, _init: function(target) { zone._action = target
				can.onappend._action(can, [{input: html.TEXT, _init: function(target) { zone._search = target }, onkeyup: function(event) {
					can.onkeymap.selectItems(event, can, zone._target), can.page.Select(can, zone._target, html.DIV_LIST, function(item) { can.onmotion.toggle(can, item, true) })
					if (event.target.value == "") { can.page.Select(can, zone._target, html.DIV_LIST, function(target) { can.onmotion.hidden(can, target) })
						can.page.Select(can, zone._target, "div.switch", function(target) { can.page.ClassList.del(can, target, cli.OPEN) })
					}
				}, onfocus: function(event) { var target = event.target; target.setSelectionRange && target.setSelectionRange(0, target.value.length) }}], target, {})
			}},
			{view: html.LIST, _init: function(target) { can.ui.zone = can.ui.zone||{}, can.ui.zone[zone.name] = zone, zone._target = target, zone.refresh = function() { can.onmotion.clear(can, target), zone._init(target, zone) }
				zone._total = function(total) { return can.page.Modify(can, zone._search, {placeholder: "search in "+total+" item"}), total }
				zone._icon = function(list) {
					can.page.Select(can, zone._legend, "span.icon", function(target) { can.page.Remove(can, target) })
					can.core.Item(list, function(name, button) { can.onimport.icon(can, name, button, zone._legend) })
				}
				can.base.isFunc(zone._init) && (zone._menu = zone._init(target, zone)||zone._menu); if (zone._delay_show) { can.onmotion.hidden(can, zone._action), can.onmotion.hidden(can, zone._target) }
			}}
		]} }))
	},
	tree: function(can, list, field, split, cb, target, node) {
		node = node||{"": target}; can.core.List(list, function(item) { item[field] && can.core.List(item[field].split(split), function(value, index, array) { if (!value) { return }
			var last = array.slice(0, index).join(split), name = array.slice(0, index+1).join(split); if (node[name]) { return }
			var ui = can.page.Append(can, node[last], [{view: html.ITEM, list: [
				{view: [["switch", item.expand? cli.OPEN: ""], html.DIV, (index==array.length-1? "": can.page.unicode.close)]},
				{view: [mdb.NAME, html.DIV, value], _init: item._init},
			], onclick: function(event) { if (node[name].childElementCount == 2) { node[name].firstChild.click() }
				index < array.length - 1? can.page.ClassList.set(can, ui["switch"], cli.OPEN, !can.page.ClassList.neg(can, node[name], html.HIDE)): can.base.isFunc(cb) && cb(event, item)
			}, oncontextmenu: function(event) { if (!item._menu) { return }
				var menu = item._menu; can.user.carteRight(event, can, menu.meta, menu.list, menu)
			}}, {view: [[html.LIST, item.expand? "": html.HIDE]]}]); node[name] = ui.list
		}) }); return node
	},
	item: function(can, item, cb, cbs, target) { target = target||(can.ui && can.ui.project? can.ui.project: can._output)
		var ui = can.page.Append(can, target, [{view: [html.ITEM, html.DIV, item.nick||item.name], onclick: function(event) { can.onmotion.select(can, target, html.DIV_ITEM, event.target)
				cb(event, event.target, event.target._list && can.onmotion.toggle(can, event.target._list))
			}, oncontextmenu: function(event) { if (can.base.isFunc(cbs)) { var menu = cbs(event, ui._target); if (menu) { can.user.carteRight(event, can, menu.meta, menu.list, menu) } } },
		}]); return ui._target
	},
	itemlist: function(can, list, cb, cbs, target) {
		return target._list = can.page.insertBefore(can, [{view: html.LIST, list: can.core.List(list, function(item) {
			return {view: [html.ITEM, html.DIV, item.name], onclick: function(event) {
				cb(event, item, event.target._list && can.page.ClassList.neg(can, event.target._list, html.HIDE))
			}, oncontextmenu: function(event) { if (can.base.isFunc(cbs)) { var menu = cbs(event, ui._target); if (menu) { can.user.carteRight(event, can, menu.meta, menu.list, menu) } } }}
		}) }], target.nextSibling, target.parentNode)
	},
	list: function(can, root, cb, target) { target = target||can._output
		can.core.List(root.list, function(item) { var ui = can.page.Append(can, target, [{view: [html.ITEM, html.DIV, item.meta.name], onclick: function(event) {
			can.base.isFunc(cb) && cb(event, item) || can.onmotion.toggle(can, ui.list), can.onmotion.select(can, target, html.DIV_ITEM, event.target)
		}}, {view: html.LIST}]); can.onimport.list(can, item, cb, ui.list) })
	},
})
Volcanos(chat.ONLAYOUT, {
	_init: function(can) { can.core.CallFunc([can.onimport, html.LAYOUT], {can: can}) },
	simple: function(can) { can.onlayout._init(can) },
	output: function(can) { can.onlayout._init(can) },
	float: function(can) { can.onlayout._init(can) },
	full: function(can) { can.onlayout._init(can) },
	cmd: function(can) { can.onlayout._init(can) },
})
Volcanos(chat.ONEXPORT, {
	table: function(can) { var msg = can._msg; if (msg.Length() == 0) { return }
		var res = [msg.append && msg.append.join(ice.FS)]; msg.Table(function(line, index, array) {
			res.push(can.core.Item(line, function(key, value) { return value }).join(ice.FS))
		}); return res.join(ice.NL)
	},
	board: function(can) { var msg = can._msg; return msg.Result() },
	title: function(can, title) { can._legend.innerHTML = title
		can.sup && can.sup._tabs && (can.sup._tabs.innerHTML = title)
		can.sup && can.sup._header_tabs && (can.sup._header_tabs.innerHTML = title)
		can.isCmdMode() && can.user.title(title)
	},
})
