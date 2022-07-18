Volcanos(chat.ONAPPEND, {help: "渲染引擎", list: ["{", "}", html.HEAD, html.LEFT, html.MAIN, html.FOOT],
	_parse: function(can, text, name, height) { var stack = [{_deep: -1, list: []}], finish = false
		can.core.List(can.core.Split(text, ice.NL, ice.NL, ice.NL), function(line) { if (line == "" || finish) { return }
			var deep = 0; for (var i = 0; i < line.length; i++) { if (line[i] == ice.SP) { deep++ } else if (line[i] == ice.TB) { deep += 4 } else { break } }
			for (var i = stack.length-1; i > 0; i--) { if (deep <= stack[i]._deep) { stack.pop() } }

			var ls = can.core.Split(line); if (ls[0] == "return ") { return finish = true }
			var item = {_deep: deep, list: []}; var list = stack[stack.length-1]; list.list.push(item); if (deep > list._deep) { stack.push(item) }
			can.onappend.list.indexOf(ls[0]) > -1 || can.onappend[ls[0]]? item.type = ls[0]: item.name = ls[0]
			for (var i = 1; i < ls.length; i += 2) { can.core.Value(item, ls[i], ls[i+1]) }
		})
		return {type: name, style: {height: height||can.ConfHeight()||window.innerHeight}, list: stack[0].list}
	},
	parse: function(can, list, target, keys, data, type) { target = target||can._output, data = data||{}
		if (!list) { return } else if (can.base.isArray(list)) {
			return can.core.List(list, function(meta, index) { return can.onappend.parse(can, meta, target, keys, data, type) })

		} else if (can.base.isString(list)) {
			var ls = can.core.Split(list, "", ":=@"); if (ls.length == 1) {
				var meta = type? {type: type, name: ls[0]}: {type: ls[0]}
			} else {
				var meta = {name: ls[0]}; for (var i = 1; i < ls.length; i += 2) { switch (ls[i]) {
					case "@": meta.action = ls[i+1]; break
					case "=": meta.value = ls[i+1]; break
					case ":": meta.type = ls[i+1]; break
				} }
			}

		} else if (can.base.isObject(list)) { var meta = list }

		var item = {view: meta.type}; switch (meta.type) {
			case html.HEAD: meta.subtype = html.MENU
				meta.init = function(target) { can.page.ClassList.add(can, target, html.LAYOUT), data.head = target }
				break
			case "{": if (meta._deep > 0) { return }
				item.view = meta.type = html.LEFT // no break
			case html.LEFT: meta.subtype = html.ITEM
				meta.init = function(target) { can.page.ClassList.add(can, target, html.LAYOUT), data.left = target
					can.onmotion.delay(can, function() { var height = target.parentNode.offsetHeight
						can.page.Select(can, target.parentNode, can.page.Keys(html.DIV_LAYOUT_HEAD, html.DIV_LAYOUT_FOOT), function(item) {
							if (item.parentNode == target.parentNode) {
								height -= item.offsetHeight // 高度
							}
						}), can.page.style(can, target, html.HEIGHT, height)
					})
				}
				break
			case "}": if (meta._deep > 0) { return }
				item.view = meta.type = html.MAIN // no break
			case html.MAIN:
				meta.init = function(target) { can.page.ClassList.add(can, target, html.LAYOUT)
					can.onmotion.delay(can, function() { var height = target.parentNode.offsetHeight
						can.page.Select(can, target.parentNode, can.page.Keys(html.DIV_LAYOUT_HEAD, html.DIV_LAYOUT_FOOT), function(item) {
							if (item.parentNode == target.parentNode) {
								height -= item.offsetHeight // 高度
							}
						}), can.page.style(can, target, html.HEIGHT, height)
					}, data.main? 10: 100)
					can.onmotion.delay(can, function() { var width = target.parentNode.offsetWidth
						can.page.Select(can, target.parentNode, html.DIV_LAYOUT_LEFT, function(item) {
							if (item.parentNode == target.parentNode) {
								width -= item.offsetWidth // 宽度
							}
						}), can.page.style(can, target, html.WIDTH, width)
					}, data.main? 10: 100)

					if (!data.main) { data.main = target
						can.onmotion.delay(can, function() { data.main_init && data.main_init() }, 300)
					}
				}
				break
			case html.FOOT: meta.subtype = html.MENU
				meta.init = function(target) { can.page.ClassList.add(can, target, html.LAYOUT), data.foot = target }
				break
			default: var cb = can.onappend[meta.type]; cb && cb(can, item, meta, target, data)
		}
		if (can.base.isObject(meta.style)) { item.style = meta.style }
		if (can.base.isString(meta.style)) { item.className = meta.style }

		meta.keys = meta.keys||can.core.Keys(keys, meta.name||meta.type) 
		var cb = can.onappend[type]; !can.onappend[meta.type] && cb && cb(can, item, meta, target, data)
		item._init = item._init||function(target) { meta.list && can.onappend.parse(can, meta.list, target, meta.keys, data, meta.subtype||type) }
		item.target = can.page.Append(can, target, [item]).first; meta.init && meta.init(item.target)
		can.core.ItemCB(meta, function(key, cb) { item.target[key] = can.base.isFunc(cb)? cb: function(event) { can.onengine.signal(can, cb, can.request(event, meta)) } })
	},
	username: function(can, item, meta, target) {
		can.base.Copy(item, {view: [aaa.USERNAME, html.DIV], list: [{view: [html.NAME, html.DIV, can.user.info.usernick]}, {view: [html.ICON, html.DIV], list: [{img: can.user.info.avatar}]}]})
	},
	menu: function(can, item, meta, target) {
		can.base.Copy(item, meta.list && meta.list.length > 0? {view: [html.MENU, html.DIV, meta.name], onmouseenter: function(event) {
			can.user.carte(event, can, {}, can.core.List(meta.list, function(item) { return item.name }), function(event, button, meta) {
				can.onengine.signal(can, button) || can.onengine.signal(can, html.MENU, can.request(event, {item: button}))
			})
		}, _init: function() {}}: {view: [html.MENU, html.DIV, meta.name], onclick: function(event) {
			can.onengine.signal(can, meta.name) || can.onengine.signal(can, html.MENU, can.request(event, {item: meta.name}))
		}, _init: function() {}})
	},
	item: function(can, item, meta, target, data) { item.view = item.view||html.LIST
		if (decodeURIComponent(location.hash) == "#"+meta.keys) {
			data.main_init = function() { can.onappend._show(can, meta, data) }
		}
		if (meta.action == ice.AUTO && !location.hash) {
			data.main_init = function() { can.onappend._show(can, meta, data) }
		}

		can.base.Copy(item, {view: "some", list: [{view: [html.ITEM, html.DIV, meta.name||meta], onclick: function(event) {
			can.onappend._show(can, meta, data), can.onkeymap.prevent(event), event.target.nextSibling && can.onmotion.toggle(can, event.target.nextSibling)
		}}, {view: html.LIST, _init: function(target) { meta.list && can.onappend.parse(can, meta.list, target, meta.keys, data, html.ITEM) }}], _init: function() {}})
	},
	tabs: function(can, item, meta, target) {
		item.list = [{view: "name"}, {view: html.PAGE}], item._init = function(_target, ui) {
			can.page.Append(can, ui.page, [{view: html.INPUT, list: [{type: html.INPUT, onkeyup: function(event) {
				can.page.Select(can, _target, [html.DIV_PAGE, html.DIV_ITEM], function(item) {
					can.page.ClassList.set(can, item, html.HIDE, item.innerText.indexOf(event.target.value) == -1)
				})
			}}]}])
			can.core.List(meta.list, function(item, index) {
				can.page.Append(can, ui.name, [{view: [html.ITEM, html.DIV, item.name||item], onclick: function(event) {
					can.onmotion.select(can, _target, [[html.DIV_PAGE, html.DIV_LIST]], index)
					can.onmotion.select(can, ui.name, html.DIV_ITEM, index)
					ui.page.scrollTo(0, 0)
				}}])
				can.page.Append(can, ui.page, [{view: [html.ITEM, html.DIV, item.name], onclick: function(event) {
					can.page.ClassList.neg(can, event.target.nextSibling, html.SELECT)
					can.onmotion.select(can, ui.name, html.DIV_ITEM, index)
				}}, {view: [html.LIST], _init: function(target) {
					can.onappend.parse(can, item.list, target, can.core.Keys(meta.keys, item.name), data, html.ITEM)
				}}])
			})
			can.onmotion.delay(can, function() { var height = target.offsetHeight
				can.page.style(can, ui.page, html.HEIGHT, height-10-(meta.style? 0: ui.name.offsetHeight))
				can.page.style(can, _target, html.HEIGHT, height-10)
			}), can.page.Select(can, ui.name, html.DIV_ITEM)[0].click()
		}
	},
	_show: function(can, meta, data) { var target = data.main
		if (!meta.index) { return }
		var url = can.misc.MergeURL(can, {pod: can.misc.Search(can, "pod"), cmd: meta.index})
		if (meta.action == "push") { return can.user.jumps(url) }
		if (meta.action == "open") { return can.user.open(url) }

		location.hash = meta.keys
		if (can.onmotion.cache(can, function() { return meta.keys }, target)) { return }

		if (can.base.Ext(meta.index) == nfs.ZML || can.base.Ext(meta.index) == nfs.IML) {
			return can.page.Append(can, target, [{type: html.IFRAME, src: "/chat/cmd/"+meta.index, height: target.offsetHeight, width: target.offsetWidth}])
		}

		can.onappend.plugin(can, {index: meta.index, args: can.base.Obj(meta.args)}, function(sub) {
			sub.run = function(event, cmds, cb) { can.runActionCommand(event, sub._index||meta.index, cmds, cb) }
			sub.ConfHeight(target.offsetHeight-3*html.ACTION_HEIGHT-6*html.PLUGIN_MARGIN), sub.ConfWidth(target.offsetWidth-4*html.PLUGIN_MARGIN)
			can.page.style(can, sub._output, html.MAX_HEIGHT, sub.ConfHeight())
			can.page.style(can, sub._output, html.MAX_WIDTH, sub.ConfWidth())
		}, target)
	},
})

