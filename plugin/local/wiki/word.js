Volcanos(chat.ONIMPORT, {
	_init: function(can, msg, target) { can.Conf(html.PADDING, html.PLUGIN_PADDING)
		can.page.Modify(can, target, msg.Results()), can.onimport._content(can, target)
		can.onmotion.delay(can, function() { can.onappend.scroll(can) })
		can.onexport.title(can, can.Option(nfs.PATH))
	},
	_content: function(can, target, cb) { can.onappend.style(can, web.WIKI_WORD)
		can.page.Select(can, target, wiki.STORY_ITEM, function(target) { var meta = target.dataset||{}; cb && cb(target, meta)
			can.core.CallFunc([can.onimport, can.onimport[meta.name]? meta.name: meta.type||target.tagName.toLowerCase()], [can, meta, target])
			var _meta = can.base.Obj(meta.meta);
			if (_meta && _meta.style) {
				if (can.user.isMobile && _meta.style.width == "480px") { _meta.style.width = can.ConfWidth() - 2*can.Conf(html.PADDING) }
				can.page.style(can, target, can.base.Obj(_meta.style))
			}
			meta.style && can.page.style(can, target, can.base.Obj(meta.style))
		})
		can.page.Select(can, target, html.A, function(target) {
			target.innerText = target.innerText || target.href, target.href = target.href || target.innerText, target.target = target || "_blank"
		})
	},
	list: function(can, root, cb, cbs, target) { target = target||can._output
		can.core.List(root.list, function(item) { var ui = can.page.Append(can, target, [{view: [[html.ITEM, "open"]], list: [{text: item.meta.name}, item.list && {icon: icon.CHEVRON_DOWN}], onclick: function(event) {
			can.page.ClassList.set(can, ui.item, "open", can.base.isFunc(cb) && cb(event, item) || can.onmotion.toggle(can, ui.list))
			can.onmotion.select(can, target, html.DIV_ITEM, event.currentTarget)
		}, _init: function(target) { if (item.meta.name == "_") { target.innerHTML = "", can.onappend.style(can, html.SPACE, target) }
			cbs && cbs(target, item)
		}}, {view: html.LIST}]); can.onimport.list(can, item, cb, cbs, ui.list) })
	},
	navmenu: function(can, meta, target) { var nav = can.sup._navmenu
		nav = can.onmotion.clear(can, nav||can.page.insertBefore(can, [wiki.NAVMENU], can._output)), can.sup._navmenu = nav
		can.onimport.list(can, can.base.Obj(meta.data), function(event, item) {
			var link = item.meta.link; if (!link || link == can.Option(nfs.PATH)) { return false }
			if (can.base.beginWith(link, nfs.PS, web.HTTP)) { return can.user.opens(link) }
			if (can.onmotion.cache(can, function() { return can.onexport.title(can, item.meta.name), can.Option(nfs.PATH, link) })) { return }
			return can.sup.Update(event, [link])
		}, function() {}, nav)
		can.onimport.layout(can)
	},
	premenu: function(can, meta, target) { can.page.Select(can, can._output, can.page.Keys(html.H2, html.H3), function(_target) {
		can.onimport.item(can, {name: _target.innerHTML}, function() { can.onmotion.scrollIntoView(can, _target) }, function() {}, target)
		_target.onclick = function(event) { can.onmotion.scrollIntoView(can, target) }
	}) },
	endmenu: function(can, meta, target) { can.page.Select(can, can._output, can.page.Keys(html.H2, html.H3), function(_target) {
		can.onimport.item(can, {name: _target.innerHTML}, function() { can.onmotion.scrollIntoView(can, _target) }, function() {}, target)
	}) },
	spark: function(can, meta, target) {
		if (meta[mdb.NAME] == html.INNER) { return can.onmotion.copy(can, target) }
		can.page.Select(can, target, "kbd,samp", function(item) { can.onmotion.copy(can, item, function() {
			meta.type == "shell" && can.onappend.float(can, {index: web.CODE_XTERM, args: ["sh"]})
		}) })
	},
	spark_tabs: function(can, meta, target) { var select
		can.page.Select(can, target, "div.tabs>div.item", function(tabs, index) {
			(index == 0 || can.user.isMacOSX && can.base.isIn(tabs.innerText, cli.DARWIN, "macos") || can.user.isWindows && tabs.innerText == cli.WINDOWS) && (select = tabs)
			tabs.onclick = function() { can.onmotion.select(can, tabs.parentNode, "div.tabs>div.item", tabs), can.onmotion.select(can, target, "div.story", index) }
			return tabs
		}); select && select.click()
	},
	table: function(can, meta, target) {
		can.page.OrderTable(can, target), can.page.ClassList.add(can, target, chat.CONTENT)
		can.page.Select(can, target, html.TD, function(item) { can.onmotion.copy(can, item) })
	},
	order: function(can, meta, target) {
		target.onclick = function(event) {
			can.user.copy(event, can, event.target.innerText)
		}
	},
	chart: function(can, meta, target) {
		if (!meta.fg && !meta.bg) { target.className.baseVal = "story auto" }
		target.onclick = function(event) { can.misc.Event(event, can, function(msg) {
			meta.index && can.onappend._float(can, meta.index, can.base.Obj(meta.args, []).concat([event.target.innerHTML]))
		}) }
		target.oncontextmenu = function(event) { can.misc.Event(event, can, function(msg) {
			var ui = can.user.carte(event, can, kit.Dict(mdb.EXPORT, function(event, can, button) {
				can.user.toimage(can, "hi", target)
			})); can.page.style(can, ui._target, {left: event.clientX, top: event.clientY})
		}) }
	},
	field: function(can, meta, target) { var item = can.base.Obj(meta.meta), padding = can.Conf(html.PADDING)
		var height = can.base.Max(html.STORY_HEIGHT, can.ConfHeight()-4*html.ACTION_HEIGHT-2*padding), width = item.width||can.ConfWidth()-2*padding
		can.core.Item(item, function(key, value) { if (can.base.beginWith(key, "meta.")) { can.core.Value(item, key, value), delete(item[key]) } })
		can.onappend.plugin(can, item, function(sub) { can._plugins = (can._plugins||[]).concat([sub])
			can.core.Value(item, "auto.cmd") && can.onmotion.delay(function() { sub.runAction(sub.request({}, can.core.Value(item, "opts")), can.core.Value(item, "auto.cmd")) })
			var size = sub.onimport.size; sub.onimport.size = function(can, height, width, auto, mode) { size(can, height, width, auto, mode)
				can.page.style(can, sub._output, html.MAX_HEIGHT, "", "overflow-y", "hidden")
				sub.sub && sub.sub.ui.content && can.page.style(can, sub.sub.ui.content, html.HEIGHT, "", "overflow-y", "hidden")
			}, sub.onimport.size(sub, height, width, true)
			can.onimport.layout(can)
		}, can._output, target)
	},
	layout: function(can) { padding = can.Conf(html.PADDING)
		if (can.sup._navmenu) { can.ConfWidth(can.ConfWidth()-can.sup._navmenu.offsetWidth)
			can.page.style(can, can.sup._navmenu, html.HEIGHT, can.ConfHeight())
			can.page.style(can, can._output, html.HEIGHT, can.ConfHeight(), html.WIDTH, can.ConfWidth(), "clear", "none", "float", "left")
		}
		can.core.List(can._plugins, function(sub) { sub.onimport.size(sub, can.base.Min(can.ConfHeight()/2, 300, 600), (can.ConfWidth()-2*padding), true) })
		can.page.Select(can, can._output, html.IMG, function(target) { can.page.style(can, target, html.MAX_HEIGHT, can.base.Max(can.ConfHeight(), 420)) })
	},
}, [""])
Volcanos(chat.ONACTION, {
	play: function(event, can) { var list = [], current = []
		can.page.Select(can, can._output, wiki.STORY_ITEM, function(item) { can.page.tagis(item, "h1", "h2", "h3") && list.push(current = []), current.push(item) })
		can.onappend._init(can, {type: "story word play float", height: can.page.height(), width: can.page.width(), padding: 10}, [], function(sub) { sub._legend.onclick = can._legend.onclick
			sub._trans = {input: {page: "页码", from: "开始"}}
			sub.run = can.run, sub.sup = can, can.sub = sub, can.onappend._action(sub, can.user.isMobile && can.page.height() > can.page.width()? [
				"大纲", "上一页", "下一页", "结束",
			]: [
				["布局", "开讲", "网格", "快闪"], "大纲", "首页", "上一页",
				["菜单"].concat(can.core.List(list, function(page) { return page[0].innerHTML })),
				"下一页", "隐藏", "结束",
			], sub._action, can.ondetail, false, 10), can.onkeymap._build(can)
			sub.page.style(sub, sub._target, "background", can._root._target.style.background)
			sub.page.style(sub, sub._output, html.HEIGHT, can.page.height()-2*html.ACTION_HEIGHT)
			sub.page.style(sub, sub._output, html.WIDTH, can.page.width())
			sub.ui = sub.page.Append(sub, sub._output, [chat.PROJECT, chat.CONTENT])
			can.core.List(sub.list = list, function(page, index) {
				can.onimport.item(can, {name: page[0].innerHTML}, function(event) { can.ondetail.show(sub, index) }, function(event) {}, sub.ui.project)
				sub.page.Append(sub, sub.ui.content, [{view: "page"+(index==0? " first": ""), list: can.core.List(page, function(item) { var data = item.dataset||{}
					switch (data.type) {
						case wiki.PREMENU: item = item.cloneNode(false); break
						case chat.FIELD: item = can.onappend.field(can, chat.STORY, can.base.Copy(can.base.Obj(data.meta), {height: can.page.height(), width: can.page.width()}), sub.ui.content)._target; break
						default: item = item.cloneNode(true)
					}
					return can.core.CallFunc([can.onimport, data.type], [sub, data, item, can.page.width()]), item
				}), }])
			}), can.onmotion.hidden(can, sub.ui.project), can.ondetail.show(sub, 0)
			sub.onappend._status(sub, [mdb.PAGE, cli.FROM, cli.COST]), sub.Status(cli.FROM, can.base.Time()), sub.Status(mdb.PAGE, list.length)
			var from = new Date(); can.core.Timer({interval: 100}, function() { var now = new Date(); sub.Status(cli.COST, can.base.Duration(now-from)) })
		}, can._root._target)
	},
})
Volcanos(chat.ONDETAIL, {
	show: function(sub, which) { sub.page.styleClass(sub, sub.ui.content, chat.CONTENT)
		sub.page.Select(sub, sub.ui.content, html.DIV_PAGE, function(page, index) {
			if (index == which || page == which) {
				sub.page.Select(sub, page, sub.page.Keys(html.H1, html.H2, html.H3), function(item) { sub.Action("菜单", item.innerHTML) })
				sub.onmotion.select(sub, sub.ui.project, html.DIV_ITEM, index)
				sub.Status(mdb.PAGE, index+1+nfs.PS+sub.list.length)
				sub.page.ClassList.add(sub, page, html.SHOW)
			} else {
				sub.page.ClassList.del(sub, page, html.SHOW)
			}
		})
	},
	next: function(sub) { sub.page.Select(sub, sub.ui.content, sub.core.Keys(html.DIV_PAGE, html.SHOW), function(page) {
		page.nextSibling? sub.sup.ondetail.show(sub, page.nextSibling): sub.user.toast(sub.sup, cli.END)
	}) },
	prev: function(sub) { sub.page.Select(sub, sub.ui.content, sub.core.Keys(html.DIV_PAGE, html.SHOW), function(page) {
		page.previousSibling? sub.sup.ondetail.show(sub, page.previousSibling): sub.user.toast(sub.sup, cli.END)
	}) },
	flash: function(sub) { sub.core.Next(sub.page.Select(sub, sub.ui.content, html.DIV_PAGE), function(page, next) {
		sub.sup.ondetail.show(sub, page), sub.onmotion.delay(sub, next, 500)
	}) },
	grid: function(sub) {
		sub.page.styleClass(sub, sub.ui.content, "content grid")
	},
	"开讲": function(event, can) {
		can.page.SelectChild(can, can.ui.content, "", function(target) { can.page.style(can, target, html.HEIGHT, "", html.WIDTH, "") })
		can.sup.ondetail.show(can, 0)
	},
	"网格": function(event, can) { function size(p) { return (p-2*html.PLUGIN_PADDING)/3-2*html.PLUGIN_PADDING }
		can.onlayout.expand(can, can.ui.content, can.base.Min(size(can.ConfWidth()), 320, 640), can.base.Min(size(can.ConfHeight()-2*html.ACTION_HEIGHT), 240, 320), html.DIV_PAGE)
		can.sup.ondetail.grid(can)
	},
	"快闪": function(event, can) {
		can.page.SelectChild(can, can.ui.content, "", function(target) { can.page.style(can, target, html.HEIGHT, "", html.WIDTH, "") })
		can.sup.ondetail.flash(can)
	},
	"大纲": function(event, can) { can.onmotion.toggle(can, can.ui.project) },
	"首页": function(event, can) { can.sup.ondetail.show(can, 0) },
	"上一页": function(event, can) { can.sup.ondetail.prev(can, can.ui.content) },
	"菜单": function(event, can) { can.sup.ondetail.show(can, event.target.selectedIndex) },
	"下一页": function(event, can) { can.sup.ondetail.next(can, can.ui.content) },
	"隐藏": function(event, can) { can.onmotion.toggle(can, can._output) },
	"结束": function(event, can) { can.page.Remove(can, can._target) },
	"删除": function(event, sub) { sub.page.Remove(sub, sub._target) },
})
Volcanos(chat.ONKEYMAP, {
	_mode: {
		plugin: {
			"j": function(event, can) { can.ondetail.next(can.sub) },
			"k": function(event, can) { can.ondetail.prev(can.sub) },
			"n": function(event, can) { can.ondetail.next(can.sub) },
			"p": function(event, can) { can.ondetail.prev(can.sub) },
			"ArrowRight": function(event, can) { can.ondetail.next(can.sub) },
			"ArrowLeft": function(event, can) { can.ondetail.prev(can.sub) },
			"q": function(event, can) { can.ondetail["结束"](event, can.sub) },
			"h": function(event, can) { can.ondetail["隐藏"](event, can.sub) },
		},
	}, _engine: {},
})
