Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
		can.user.isMobile && !can.user.isLandscape() && can.onmotion.hidden(can, can._action)
		var cbs = can.onimport[msg.Option(ctx.STYLE)||can.Conf(ctx.STYLE)]; if (can.base.isFunc(cbs)) {
			can.core.CallFunc(cbs, {can: can, msg: msg, target: target, list: msg.Table()})
			can.page.ClassList.add(can, target, can._args[ctx.STYLE])
			return cbs(can, msg, target)
		}

		can.page.style(can, can._output, html.HEIGHT, "")
		can.onmotion.clear(can, target)
		can.onappend.table(can, msg, null, target)
		can.onappend.board(can, msg, target)
		can.onmotion.story.auto(can, target)
		can.base.isFunc(cb) && cb(msg)
	},
	_open: function(can, msg, list) {
		can.core.List(list, function(item) {
			can.page.Append(can, can._output, [{view: "item", style: {"text-align": "center", "float": "left", "width": "120"}, list: [
				{type: "img", src: "/share/local/usr/icons/"+item.name, width: 120, style: {display: "block"}},
				{text: item.name.split(".")[0].replace(" ", "\n"), style: {display: "block"}}], onclick: function(event) {
				can.runAction(can.request(event, item, can.Option()), "click", [])
			}}])
		})
	},
	_title: function(can, title) {
		can.user.title(title+ice.SP+(can.misc.Search(can, ice.POD)||location.host))
	},
	_panel: function(can, target, action) {
		var ui = can.page.Append(can, target, [html.ACTION, html.OUTPUT])
		var action = can.onappend._action(can, [], ui.action, kit.Dict(
			cli.CLOSE, function(event) { can.onmotion.hidden(can, target), can.onimport.layout(can) },
			cli.CLEAR, function(event) { can.onmotion.clear(can, ui.output) },
			cli.SHOW, function(event) { can.onaction[cli.SHOW](event, can) },
			action,
			mdb.PLUGIN, function(event) { can.user.input(event, can, [ctx.INDEX, ctx.ARGS], function(data) {
				can.onimport.plug(can, data, ui.output, function(sub) {
					sub.ConfHeight(target.offsetHeight-4*html.ACTION_HEIGHT)
				})
			}) },
		)); target._toggle = function(event, show) { action[show? cli.SHOW: cli.CLOSE](event) }
		return ui
	},
	title: function(can, title) {
		can._legend.innerHTML = title, can.sup && can.sup._tabs && (can.sup._tabs.innerHTML = title)
		can.sup && can.sup._header_tabs && (can.sup._header_tabs.innerHTML = title)
		can.isCmdMode() && can.user.title(title)
	},
	zone: function(can, list, target) { var color = [""]
		return can.page.Append(can, target, can.core.List(list, function(zone, index) { can.base.isString(zone) && (zone = {name: zone}); return zone && {view: html.ZONE+" "+zone.name, list: [
			{view: html.NAME, inner: can.user.trans(can, zone.name), style: {background: color[index%color.length]}, onclick: function() {
				can.onmotion.toggle(can, zone._action), can.onmotion.toggle(can, zone._target)
			}, onmouseenter: function(event) {
				zone._menu? can.user.carteRight(event, can, zone._menu.meta, zone._menu.list||can.core.Item(zone._menu.meta), function(event, button, meta) {
					(meta[button]||can.onaction[button])(event, can, button)
				}): can.user.carteRight(event, can, {
					"折叠": function() { can.page.Select(can, zone._target, html.DIV_LIST, function(item) { can.onmotion.toggle(can, item, false) }) },
					"展开": function() { can.page.Select(can, zone._target, html.DIV_LIST, function(item) { can.onmotion.toggle(can, item, true) }) },
					"刷新": function() { can.onmotion.clear(can, zone._target), zone._init(zone._target) },
				}, ["刷新", "折叠", "展开"])
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
					can.onmotion.delay(can, function() { can.page.styleWidth(can, target, target.parentNode.parentNode.parentNode.offsetWidth-32) })
					// can.onappend.figure(can, {name: zone.name}, target)
				}}], target, {})
			}},
			{view: html.LIST, _init: function(target) { can.ui[zone.name] = zone
				zone._total = function(total) { return can.page.Modify(can, zone._search, {placeholder: "search in "+total+" item"}), total }
				zone._target = target, zone.refresh = function() { can.onmotion.clear(can, target), zone._init(target, zone) }
				can.base.isFunc(zone._init) && (zone._menu = zone._init(target, zone)||zone._menu)
			}}
		]} }))
	},
	tree: function(can, list, field, split, cb, target, node) {
		node = node||{"": target}; can.core.List(list, function(item) {
			item[field] && can.core.List(item[field].split(split), function(value, index, array) { if (!value) { return }
				var last = array.slice(0, index).join(split), name = array.slice(0, index+1).join(split); if (node[name]) { return }
				var ui = can.page.Append(can, node[last], [{view: "item", list: [{view: ["switch", "div", (index==array.length-1?"":"⌃")]}, {view: ["name", html.DIV, value+(index==array.length-1?"":"")], _init: item._init, onmouseenter: function(event) { if (!item._menu) { return }
					can.user.carteRight(event, can, item._menu.meta, item._menu.list||can.core.Item(item._meta.meta), function(event, button) {
						(item._menu.meta[button]||item._menu)(event, can, button)
					})
				}}], onclick: function(event) {
					index < array.length - 1? can.onmotion.toggle(can, node[name], function() { can.page.ClassList.add(can, ui["switch"], "open") }, function() { can.page.ClassList.del(can, ui["switch"], "open") }): can.base.isFunc(cb) && cb(event, item)
					if (node[name].childElementCount == 2) { node[name].firstChild.click() }
				}}, {view: html.LIST, style: {display: html.NONE}, _init: function(list) { item.expand && can.page.style(can, list, html.DISPLAY, html.BLOCK) }}])
				node[name] = ui.list
			})
		}); return node
	},
	list: function(can, root, cb, target) { target = target||can._output
		can.core.List(root.list, function(item) {
			var ui = can.page.Append(can, target, [{view: [html.ITEM, html.DIV, item.meta.name], onclick: function(event) {
				can.base.isFunc(cb) && cb(event, item) || can.onmotion.toggle(can, ui.list)
				can.onmotion.select(can, target, html.DIV_ITEM, event.target)
			}}, {view: html.LIST}]); can.onimport.list(can, item, cb, ui.list)
		})
	},
	item: function(can, item, cb, cbs, target) { target = target||(can.ui && can.ui.project? can.ui.project: can._output)
		var ui = can.page.Append(can, target, [{view: [html.ITEM, html.DIV, item.nick||item.name],
			onclick: function(event) { cb(event, ui.first, event.target._list && can.onmotion.toggle(can, event.target._list))
				can.onmotion.select(can, target, can.core.Keys(html.DIV, html.ITEM), ui.first)
			}, onmouseenter: function(event) {
				if (can.base.isFunc(cbs)) {
					var menu = cbs(event, ui.first)
					if (menu) {
						can.user.carteRight(event, can, menu.meta, menu.list, menu)
					}
				}
			},
		}]); return ui.first
	},
	itemlist: function(can, list, cb, cbs, target) {
		return target._list = can.page.insertBefore(can, [{view: html.LIST, list: can.core.List(list, function(item) {
			return {view: [html.ITEM, html.DIV, item.name], onclick: function(event) {
				cb(event, item, event.target._list && can.onmotion.toggle(can, event.target._list))
			}, onmouseenter: function(event) { cbs(event, item) }}
		}) }], target.nextSibling, target.parentNode)
	},
	tabs: function(can, list, cb, cbs, action, each) { action = action||can._action
		return can.page.Append(can, action, can.core.List(list, function(tabs) {
			return {text: [tabs.name, html.DIV, html.TABS], title: tabs.text, onclick: function(event) {
				can.onmotion.select(can, action, html.DIV_TABS, event.target), can.base.isFunc(cb) && cb(event, tabs)
			}, _init: function(item) {
				function close(item) { var next = item.nextSibling||item.previousSibling; next && next.click()
					if (next) { can.base.isFunc(cbs) && cbs(item._meta), can.page.Remove(can, item) }
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
		})).first
	},
	card: function(can, msg, target) {
		can.page.Appends(can, target, msg.Table(function(value) {
			return {view: html.ITEM+" "+(value.status||""), list: [
				{view: [wiki.TITLE, html.DIV, value.name]},
				{view: [wiki.CONTENT, html.DIV, value.text]},
				{view: html.ACTION, inner: value.action, onclick: function(event) {
					can.run(can.request(event, value), [ctx.ACTION, event.target.name])
				}},
			]}
		}))
	},
	plug: function(can, meta, target, cb) { if (!meta || !meta.index) { return }
		meta.type = "plug", can.onappend.plugin(can, meta, function(sub) { sub.sup = can
			sub.ConfHeight(target.offsetHeight-2*html.ACTION_HEIGHT), sub.ConfWidth(target.offsetWidth)
			sub.run = function(event, cmds, cb) { can.runActionCommand(can.request(event, can.Option()), meta.index, cmds, cb) }
			sub.onaction.close = function() { can.ui && target == can.ui.profile? can.onmotion.hidden(sub, target): can.onmotion.hidden(sub, sub._target) }
			can.base.isFunc(cb) && cb(sub), can.page.style(can, sub._output, html.MAX_HEIGHT, sub.ConfHeight(), html.MAX_WIDTH, sub.ConfWidth())
		}, target)
	},
	tool: function(can, list, cb, target) { target = target||can._output
		can.core.List(list, function(meta) { typeof meta == "string" && (meta = {index: meta})
			can.onimport.plug(can, meta, target, function(sub) {
				sub.ConfHeight(can.ConfHeight()-4*html.ACTION_HEIGHT), sub.ConfWidth(can.ConfWidth())
				sub.page.style(sub, sub._output, html.MAX_HEIGHT, sub.ConfHeight())
				sub.page.style(sub, sub._output, html.MAX_WIDTH, sub.ConfWidth())

				can._status.appendChild(sub._legend), sub._legend.onclick = function(event) {
					if (can.page.Select(can, can._status, ice.PT+html.SELECT)[0] == event.target) {
						can.page.ClassList.del(can, event.target, html.SELECT)
						can.page.ClassList.del(can, sub._target, html.SELECT)
						return
					}
					can.onmotion.select(can, target, html.FIELDSET, sub._target), sub.Focus()
					can.onmotion.select(can, can._status, html.LEGEND, event.target)
					if (meta.msg == true) { meta.msg = false, sub.Update() }
				}, sub.select = function() { return sub._legend.click(), sub }
				sub.onaction.close = function() { sub.select() }
				sub._legend.onmouseenter = null
				can.base.isFunc(cb) && cb(sub)
			})
		})
	},
})
Volcanos(chat.ONLAYOUT, {help: "界面布局",
	_init: function(can) { can.core.CallFunc([can.onimport, html.LAYOUT], {can: can}) },
	float: function(can) { can.onlayout._init(can) },
	full: function(can) {
		can.sup.onimport.size(can.sup, can.ConfHeight(), can.ConfWidth(), false)
		can.onlayout._init(can)
	},
	cmd: function(can) {
		can.ConfHeight(can.ConfHeight()+html.ACTION_HEIGHT)
		can.sup.onimport.size(can.sup, can.ConfHeight(), can.ConfWidth(), true)
		can.onlayout._init(can)
	},
})
Volcanos(chat.ONACTION, {help: "操作数据",
	_trans: {"full": "全屏"},
})
Volcanos(chat.ONEXPORT, {help: "导出数据",
	table: function(can) { var msg = can._msg; if (msg.Length() == 0) { return }
		var res = [msg.append && msg.append.join(ice.FS)]; msg.Table(function(line, index, array) {
			res.push(can.core.Item(line, function(key, value) { return value }).join(ice.FS))
		})
		return res.join(ice.NL)
	},
	board: function(can) { var msg = can._msg; return msg.Result() },
})
