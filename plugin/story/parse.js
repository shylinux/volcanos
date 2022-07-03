Volcanos(chat.ONAPPEND, {help: "渲染引擎", list: [], 
	parse: function(can, list, target, keys, data, type) { target = target||can._output, data = data||{}
		if (!list) { return } else if (can.base.isArray(list)) {
			return can.core.List(list, function(meta, index) {
				return can.onappend.parse(can, meta, target, keys, data, type)
			})

		} else if (can.base.isString(list)) {
			var ls = can.core.Split(list, "", ":=@"); if (ls.length == 1) {
				var meta = type? {type: type, name: ls[0]}: {type: ls[0]}
			} else {
				var meta = {name: ls[0]}; for (var i = 1; i < ls.length; i += 2) { switch (ls[i]) {
					case ":": meta.type = ls[i+1]; break
					case "=": meta.value = ls[i+1]; break
					case "@": meta.action = ls[i+1]; break
				} }
			}

		} else if (can.base.isObject(list)) { var meta = list }

		keys = can.core.Keys(keys, meta.name||meta.type) 
		var item = {view: meta.type}, init, subtype; switch (meta.type) {
			case html.HEAD: subtype = "menu", data = {}
				init = function(target) { data.head = target
					can.page.ClassList.add(can, target, html.LAYOUT)
				}
				break
			case html.LEFT: subtype = "item"
				init = function(target) {
					can.page.ClassList.add(can, target, html.LAYOUT)
					can.core.Timer(10, function() { var height = target.parentNode.offsetHeight
						can.page.Select(can, target.parentNode, can.page.Keys(html.DIV_LAYOUT_HEAD, html.DIV_LAYOUT_FOOT), function(item) {
							height -= item.offsetHeight
						}), can.page.style(can, target, html.HEIGHT, height)
					})
				}
				break
			case html.MAIN:
				init = function(target) { data.main = target
					can.page.ClassList.add(can, target, html.LAYOUT)
					can.core.Timer(10, function() { var height = target.parentNode.offsetHeight
						can.page.Select(can, target.parentNode, can.page.Keys(html.DIV_LAYOUT_HEAD, html.DIV_LAYOUT_FOOT), function(item) {
							height -= item.offsetHeight
						}), can.page.style(can, target, html.HEIGHT, height)
					})

					can.core.Timer(100, function() {
						var width = target.parentNode.offsetWidth
						can.page.Select(can, target.parentNode, html.DIV_LAYOUT_LEFT, function(item) {
							width -= item.offsetWidth+1
						}), can.page.style(can, target, html.WIDTH, width)
					})

				}
				break
			case html.FOOT:
				init = function(target) { data.foot = target
					can.page.ClassList.add(can, target, html.LAYOUT)
				}
				break
			case html.TABS:
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
							can.onappend.parse(can, item.list, target, can.core.Keys(keys, item.name), data, html.ITEM)
						}}])
					})
					can.core.Timer(100, function() { var height = target.offsetHeight
						can.page.style(can, ui.page, html.HEIGHT, height-10-(meta.style? 0: ui.name.offsetHeight))
						can.page.style(can, _target, html.HEIGHT, height-10)
					}), can.page.Select(can, ui.name, html.DIV_ITEM)[0].click()
				}
				break
			case aaa.USERNAME:
				can.page.Append(can, target, [
					can.base.Copy({view: [aaa.USERNAME, html.DIV], onclick: function(event) {
				}, list: [{view: ["some", html.DIV, can.user.info.usernick]}, {img: can.user.info.avatar}]})])
				return
		}

		item._init = item._init||function(target) {
			meta.list && can.onappend.parse(can, meta.list, target, keys, data, type||subtype)
			can.base.isFunc(init) && init(target), can.base.isFunc(meta.init) && meta.init(target)
		}
		if (can.base.isString(meta.style)) { item.className = meta.style }
		if (can.base.isObject(meta.style)) { item.style = meta.style }

		if ((meta.type||type) == html.MENU) {
			can.page.Append(can, target, [can.base.Copy({view: [html.MENU, html.DIV, meta.name||meta], onclick: function(event) {
				if (meta.list && meta.list.length > 0) { return }
				can.onengine.signal(can, meta.name) || can.onengine.signal(can, html.MENU, can.request(event, {item: meta.name}))
			}, onmouseenter: function(event) {
				meta.list && meta.list.length > 0 && can.user.carte(event, can, {}, meta.list, function(event, item) {
					can.onengine.signal(can, item) || can.onengine.signal(can, meta.name, can.request(event, {item: item}))
				})
			}})]).first
			return
		}
		if ((type||subtype) == html.ITEM) { item.view = item.view||html.LIST
			if (meta.action == "auto") {
				meta.init = meta.init||function(item) { can.core.Timer(100, function() { item.click() }) }
			}
			if (decodeURIComponent(location.hash) == "#"+can.core.Keys(keys, item.name)) {
				meta.init = meta.init||function(item) { can.core.Timer(300, function() { item.click() }) }
			} 

			var _item = can.page.Append(can, target, [can.base.Copy({view: [html.ITEM, html.DIV, meta.name||meta], onclick: function(event) {
				var url = can.misc.MergeURL(can, {pod: can.misc.Search(can, "pod"), cmd: meta.index})
				if (meta.action == "push") { return can.user.jumps(url) }
				if (meta.action == "open") { return can.user.open(url) }
				location.hash = can.core.Keys(keys, item.name)

				switch (meta.type) {
					case html.PLUGIN:
						if (can.onmotion.cache(can, function() { return keys }, data.main)) { break }
						if (can.base.Ext(meta.index) == nfs.ZML || can.base.Ext(meta.index) == nfs.IML) {
							can.page.Append(can, data.main, [{type: html.IFRAME, src: "/chat/cmd/"+meta.index,
								height: data.main.offsetHeight, width: data.main.offsetWidth,
							}])
							break
						}

						can.onappend.plugin(can, {index: meta.index, args: can.base.Obj(meta.args)}, function(sub) {
							sub.ConfHeight(data.main.offsetHeight-160)
							sub.run = function(event, cmds, cb, silent) {
								can.page.style(can, sub._output, html.MAX_WIDTH, sub.ConfWidth(data.main.offsetWidth-40))
								can.run(event, can.misc.concat(can, [ctx.ACTION, ice.RUN, sub._index||meta.index], cmds), function(msg) {
									cb(msg), can.core.Timer(10, function() {
										can.page.style(can, sub._table, html.MAX_HEIGHT, data.main.offsetHeight-150)
									})
								}, true)
							}
						}, data.main)
					default:
						meta.list && can.onmotion.toggle(can, event.target.nextSibling)
				}
			}})]).first; can.core.ItemCB(meta, function(key, cb) { _item[key] = can.base.isFunc(cb)? cb: function(event) {
				can.onengine.signal(can, cb, can.request(event))
			} })
			can.core.Timer(10, function() { meta.init && meta.init(_item) })
			if (!meta.list) { return }
		}
		return can.page.Append(can, target, [item]).first
	},
	_parse: function(can, text) { var stack = [{_deep: -1, list: []}]
		can.core.List(can.core.Split(text, ice.NL, ice.NL, ice.NL), function(line) { if (line == "") { return }
			var deep = 0; for (var i = 0; i < line.length; i++) { if (line[i] == ice.SP) { deep++ } else if (line[i] == ice.TB) { deep += 4 } else { break } }
			for (var i = stack.length-1; i > 0; i--) { if (deep <= stack[i]._deep) { stack.pop() } }

			var item = {_deep: deep, list: []}; var list = stack[stack.length-1]; list.list.push(item); if (deep > list._deep) { stack.push(item) }
			var ls = can.core.Split(line); switch (ls[0]) {
				case html.HEAD:
				case html.LEFT:
				case html.MAIN:
				case html.FOOT:
				case html.TABS:
				case aaa.USERNAME:
				case html.MENU: item.type = ls[0]; break
				default: item.name = ls[0]; break
			}
			for (var i = 1; i < ls.length; i += 2) { can.core.Value(item, ls[i], ls[i+1])
				if (ls[i] == ctx.INDEX) { item.type = item.type||html.PLUGIN }
			}
		})
		return {type: "demo", style: {height: can.ConfHeight()||can._root._height}, list: stack[0].list}
	},
})

