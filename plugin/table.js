Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
		can.user.isMobile && !can.user.isLandscape() && can.onmotion.hidden(can, can._action)
		var cbs = can.onimport[can.Conf(ctx.STYLE)]; if (can.base.isFunc(cbs)) {
			can.page.ClassList.add(can, target, can._args[ctx.STYLE])
			can.core.CallFunc(cbs, {
				can: can, msg: msg, target: target,
				list: msg.Table(),
			})
			return cbs(can, msg, target)
		}

		can.onmotion.clear(can, target)
		can.onappend.table(can, msg, null, target)
		can.onappend.board(can, msg, target)
		can.onmotion.story.auto(can, target)
		can.base.isFunc(cb) && cb(msg)
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
				}, ["折叠", "展开", "刷新"])
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
				zone._target = target, zone.refresh = function() { can.onmotion.clear(can, target), zone._init(target) }
				can.base.isFunc(zone._init) && zone._init(target, zone)
			}}
		]} }))
	},
	tree: function(can, list, field, split, cb, target, node) {
		node = node||{"": target}; can.core.List(list, function(item) {
			item[field] && can.core.List(item[field].split(split), function(value, index, array) { if (!value) { return }
				var last = array.slice(0, index).join(split), name = array.slice(0, index+1).join(split)
				if (node[name]) { return }
				var ui = can.page.Append(can, node[last], [{view: "item", list: [{view: ["switch", "div", (index==array.length-1?"":"&#8963;")]}, {view: ["name", html.DIV, value+(index==array.length-1?"":"")], _init: item._init}], onclick: function(event) {
					index < array.length - 1? can.onmotion.toggle(can, node[name], function() {
						can.page.ClassList.add(can, ui["switch"], "open")
					}, function() {
						can.page.ClassList.del(can, ui["switch"], "open")
					}): can.base.isFunc(cb) && cb(event, item)
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
			}, onmouseenter: function(event) { can.base.isFunc(cbs) && cbs(event, ui.first) },
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
			sub.run = function(event, cmds, cb) { can.runActionCommand(can.request(event, can.Option()), meta.index, cmds, cb) }
			sub.onaction.close = function() { can.ui && target == can.ui.profile? can.onmotion.hidden(sub, target): can.onmotion.hidden(sub, sub._target) }
			can.page.style(can, sub._output, html.MAX_HEIGHT, can.ConfHeight()-2*html.ACTION_HEIGHT, html.MAX_WIDTH, can.ConfWidth())
			can.base.isFunc(cb) && cb(sub)
		}, target)
	},
})
