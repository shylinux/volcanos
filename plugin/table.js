Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb, target) { can.onmotion.clear(can, target)
		var cbs = can.onimport[can.Conf(ctx.STYLE)||msg.Option(ctx.STYLE)]; if (can.base.isFunc(cbs)) {
			can.core.CallFunc(cbs, {can: can, msg: msg, target: target})
			can.page.ClassList.add(can, target, can._args[ctx.STYLE])
		} else {
			can.onappend.table(can, msg, null, target), can.onappend.board(can, msg, target)
		} can.onmotion.story.auto(can, target), can.base.isFunc(cb) && cb(msg)
		if (can.isCmdMode()) {
			can.page.style(can, can._output, html.MAX_HEIGHT, can.ConfHeight())
		}
	},
	card: function(can, msg, target) {
		can.page.Appends(can, target, msg.Table(function(item) {
			return {view: html.ITEM+ice.SP+(item.status||""), list: [
				{view: [wiki.TITLE, html.DIV, item.name]},
				{view: [wiki.CONTENT, html.DIV, item.text]},
				{view: html.ACTION, inner: item.action, onclick: function(event) {
					can.run(can.request(event, item), [ctx.ACTION, event.target.name])
				}},
			]}
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

	_panel: function(can, target, action) {
		var ui = can.page.Append(can, target, [html.ACTION, html.OUTPUT])
		var action = can.onappend._action(can, [], ui.action, kit.Dict(
			cli.CLOSE, function(event) { can.onmotion.hidden(can, target), can.onimport.layout(can) },
			cli.CLEAR, function(event) { can.onmotion.clear(can, ui.output) },
			ice.SHOW, function(event) { can.onaction[ice.SHOW](event, can) },
			action,
			mdb.PLUGIN, function(event) { can.user.input(event, can, [ctx.INDEX, ctx.ARGS], function(data) {
				can.onimport.plug(can, data, function(sub) {
					sub.ConfHeight(target.offsetHeight-4*html.ACTION_HEIGHT)
				}, ui.output)
			}) },
		)); target._toggle = function(event, show) { action[show? ice.SHOW: cli.CLOSE](event) }
		return ui
	},
	_title: function(can, title) {
		can.user.title(title+ice.SP+(can.misc.Search(can, ice.POD)||location.host))
	},
	title: function(can, title) { can._legend.innerHTML = title
		can.sup && can.sup._tabs && (can.sup._tabs.innerHTML = title)
		can.sup && can.sup._header_tabs && (can.sup._header_tabs.innerHTML = title)
		can.isCmdMode() && can.onimport._title(can, title)
	},
	item: function(can, item, cb, cbs, target) { target = target||(can.ui && can.ui.project? can.ui.project: can._output)
		var ui = can.page.Append(can, target, [{view: [html.ITEM, html.DIV, item.nick||item.name],
			onclick: function(event) { can.onmotion.select(can, target, html.DIV_ITEM, event.target)
				cb(event, event.target, event.target._list && can.onmotion.toggle(can, event.target._list))
			}, onmouseenter: function(event) {
				if (can.base.isFunc(cbs)) { var menu = cbs(event, ui._target); if (menu) {
					can.user.carteRight(event, can, menu.meta, menu.list, menu)
				} }
			},
		}]); return ui._target
	},
	itemlist: function(can, list, cb, cbs, target) {
		return target._list = can.page.insertBefore(can, [{view: html.LIST, list: can.core.List(list, function(item) {
			return {view: [html.ITEM, html.DIV, item.name], onclick: function(event) {
				cb(event, item, event.target._list && can.onmotion.toggle(can, event.target._list))
			}, onmouseenter: function(event) { cbs(event, item) }}
		}) }], target.nextSibling, target.parentNode)
	},
	list: function(can, root, cb, target) { target = target||can._output
		can.core.List(root.list, function(item) {
			var ui = can.page.Append(can, target, [{view: [html.ITEM, html.DIV, item.meta.name], onclick: function(event) {
				can.base.isFunc(cb) && cb(event, item) || can.onmotion.toggle(can, ui.list)
				can.onmotion.select(can, target, html.DIV_ITEM, event.target)
			}}, {view: html.LIST}]); can.onimport.list(can, item, cb, ui.list)
		})
	},
	tree: function(can, list, field, split, cb, target, node) {
		node = node||{"": target}; can.core.List(list, function(item) {
			item[field] && can.core.List(item[field].split(split), function(value, index, array) { if (!value) { return }
				var last = array.slice(0, index).join(split), name = array.slice(0, index+1).join(split); if (node[name]) { return }
				var ui = can.page.Append(can, node[last], [{view: html.ITEM, list: [{view: ["switch", html.DIV, (index==array.length-1?"":"⌃")]}, {view: [mdb.NAME, html.DIV, value+(index==array.length-1?"":"")], _init: item._init, onmouseenter: function(event) { if (!item._menu) { return }
					can.user.carteRight(event, can, item._menu.meta, item._menu.list||can.core.Item(item._meta.meta), function(event, button) {
						(item._menu.meta[button]||item._menu)(event, can, button)
					})
				}}], onclick: function(event) { if (node[name].childElementCount == 2) { node[name].firstChild.click() }
					index < array.length - 1? can.page.ClassList.set(can, ui["switch"], "open", can.onmotion.toggle(can, node[name])): can.base.isFunc(cb) && cb(event, item)
				}}, {view: html.LIST, style: {display: html.NONE}, _init: function(list) { item.expand && can.page.style(can, list, html.DISPLAY, html.BLOCK) }}]); node[name] = ui.list
			})
		}); return node
	},
	zone: function(can, list, target) {
		return can.page.Append(can, target, can.core.List(list, function(zone, index) { can.base.isString(zone) && (zone = {name: zone}); return zone && {view: html.ZONE+ice.SP+zone.name, list: [
			{view: html.NAME, inner: can.user.trans(can, zone.name), onclick: function() {
				can.onmotion.toggle(can, zone._action), can.onmotion.toggle(can, zone._target)
			}, onmouseenter: function(event) {
				zone._menu? can.user.carteRight(event, can, zone._menu.meta, zone._menu.list||can.core.Item(zone._menu.meta), function(event, button, meta) {
					(meta[button]||can.onaction[button])(event, can, button)
				}): can.user.carteRight(event, can, {
					"refresh": function() { zone.refresh() },
					"fold": function() { can.page.Select(can, zone._target, html.DIV_LIST, function(item) { can.onmotion.toggle(can, item, false) }) },
					"expand": function() { can.page.Select(can, zone._target, html.DIV_LIST, function(item) { can.onmotion.toggle(can, item, true) }) },
				}, ["refresh", "fold", "expand"])
			}},
			{view: html.ACTION, _init: function(target) { zone._action = target
				can.onappend._action(can, [{input: html.TEXT, placeholder: "search", onkeyup: function(event) {
					can.page.Select(can, zone._target, html.DIV_LIST, function(item) { can.onmotion.toggle(can, item, true) })
					can.page.Select(can, zone._target, html.DIV_ITEM, function(item) {
						can.page.Select(can, item, "div.name", function(name) { can.onmotion.toggle(can, item, name.innerText.indexOf(event.target.value) > -1) })
					})
				}, onclick: function(event) {
					can.onmotion.focus(can, event.target)
				}, _init: function(target) { zone._search = target
					can.onmotion.delay(can, function() { can.page.styleWidth(can, target, can.core.Value(target.parentNode.parentNode, "parentNode.offsetWidth")-32) })
				}}], target, {})
			}},
			{view: html.LIST, _init: function(target) { can.ui[zone.name] = zone
				zone._total = function(total) { return can.page.Modify(can, zone._search, {placeholder: "search in "+total+" item"}), total }
				zone._target = target, zone.refresh = function() { can.onmotion.clear(can, target), zone._init(target, zone) }
				can.base.isFunc(zone._init) && (zone._menu = zone._init(target, zone)||zone._menu)
			}}
		]} }))
	},

	tabs: function(can, list, cb, cbs, action, each) { action = action||can._action
		return can.page.Append(can, action, can.core.List(list, function(tabs) {
			return {text: [tabs.name, html.DIV, html.TABS], title: tabs.text, onclick: function(event) {
				can.onmotion.select(can, action, html.DIV_TABS, event.target), can.base.isFunc(cb) && cb(event, tabs)
			}, _init: function(item) {
				function close(item) { var next = item.nextSibling||item.previousSibling; if (!next) { return }
					can.base.isFunc(cbs) && cbs(item._meta), can.page.Remove(can, item), next.click()
				}
				var menu = tabs._menu||shy({}, [], function(event, button, meta) { (meta[button])(event, can, button) })
				can.page.Modify(can, item, {draggable: true, _close: function() { close(item) }, _meta: tabs,
					onmouseenter: function(event) { can.user.carte(event, can, can.base.Copy(kit.Dict(
						"Close", function(event) { close(item) },
						"Close others", function(event) { can.page.Select(can, action, html.DIV_TABS, function(_item) { _item == item || close(_item) }) },
						"Close all", function(event) { can.page.Select(can, action, html.DIV_TABS, close) },
					), menu.meta), ["Close", "Close others", "Close all", ""].concat(menu.list), function(event, button, meta) {
						menu(event, button, meta)
					}) },
					ondragstart: function(event) { action._drop = function(before) { action.insertBefore(event.target, before) } },
					ondragover: function(event) { event.preventDefault(), action._drop(event.target) },
					ondrop: function(event) { event.preventDefault(), action._drop(event.target) },
				})
				can.base.isFunc(each) && each(item), can.onmotion.delay(can, function() { item.click() })
			}}
		}))._target
	},
	plug: function(can, meta, cb, target) { if (!meta || !meta.index) { return }
		meta.type = "plug", can.onappend.plugin(can, meta, function(sub) { sub.sup = can
			sub.ConfHeight(target.offsetHeight-2*html.ACTION_HEIGHT), sub.ConfWidth(target.offsetWidth)
			can.page.style(can, sub._output, html.MAX_HEIGHT, sub.ConfHeight(), html.MAX_WIDTH, sub.ConfWidth())
			sub.run = function(event, cmds, cb) { can.runActionCommand(can.request(event, can.Option()), meta.index, cmds, cb) }
			sub.onaction.close = function() { can.onmotion.hidden(can, target) }
			can.base.isFunc(cb) && cb(sub)
		}, target)
	},
	tool: function(can, list, cb, target) { target = target||can._output
		can.core.List(list.reverse(), function(meta) { can.base.isString(meta) && (meta = {index: meta})
			can.onimport.plug(can, meta, function(sub) { sub._delay_init = true
				sub.ConfHeight(can.ConfHeight()-4*html.ACTION_HEIGHT), sub.ConfWidth(can.ConfWidth())
				can.page.style(can, sub._output, html.MAX_HEIGHT, sub.ConfHeight(), html.MAX_WIDTH, sub.ConfWidth())
				can._status.appendChild(sub._legend), sub._legend.onclick = function(event) {
					if (can.page.Select(can, can._status, ice.PT+html.SELECT)[0] == event.target) {
						can.page.ClassList.del(can, event.target, html.SELECT)
						can.page.ClassList.del(can, sub._target, html.SELECT)
						return
					}
					can.onmotion.select(can, target, html.FIELDSET, sub._target), sub.Focus()
					can.onmotion.select(can, can._status, html.LEGEND, event.target)
					if (sub._delay_init || meta.msg == true) { sub._delay_init = false, meta.msg = false, sub.Update() }
				}, sub.select = function() { return sub._legend.click(), sub }, sub._legend.onmouseenter = null
				sub.onaction.close = function() { sub.select() }
				can.base.isFunc(cb) && cb(sub)
			}, target)
		})
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
})
