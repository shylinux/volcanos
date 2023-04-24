Volcanos(chat.ONIMPORT, {_init: function(can, msg, target) { can.onmotion.clear(can)
		can.page.Modify(can, target, msg.Result())
		can.page.Select(can, target, wiki.STORY_ITEM, function(target) { var meta = target.dataset||{}
			can.core.CallFunc([can.onimport, can.onimport[meta.name]? meta.name: meta.type||target.tagName.toLowerCase()], [can, meta, target])
			meta.style && can.page.style(can, target, can.base.Obj(meta.style))
		}), can.onmotion.delay(can, function() { can.onimport.layout(can) })
	},
	navmenu: function(can, meta, target) { var nav = can.sup._navmenu
		nav = can.onmotion.clear(can, nav||can.page.insertBefore(can, [wiki.NAVMENU], can._output)), can.sup._navmenu = nav
		can.onimport.list(can, can.base.Obj(meta.data), function(event, item) {
			var link = item.meta.link; if (!link || link == can.Option(nfs.PATH)) { return false }
			if (can.base.beginWith(link, web.HTTP)) { return can.user.open(link) }
			if (can.onmotion.cache(can, function() { can.isCmdMode() && can.user.title(item.meta.name); return can.Option(nfs.PATH, link) })) { return }
			return can.sup.Update(event, [link])
		}, nav)
	},
	premenu: function(can, meta, target) { can.page.Select(can, can._output, can.page.Keys(wiki.H2, wiki.H3), function(_target) {
		can.page.Append(can, target, [{text: [_target.innerHTML, html.DIV, html.ITEM], onclick: function() {
			_target.scrollIntoView()
		}}]), _target.onclick = function(event) { target.scrollIntoView() }
	}) },
	endmenu: function(can, meta, target) { can.page.Select(can, can._output, can.page.Keys(wiki.H2, wiki.H3), function(_target) {
		can.page.Append(can, target, [{text: [_target.innerHTML, html.DIV, html.ITEM], onclick: function() {
			_target.scrollIntoView()
		}}])
	}) },
	title: function(can, meta, target) { can.isCmdMode() && target.tagName == "H1" && can.user.title(meta.text) },
	spark: function(can, meta, target) {
		if (meta[mdb.NAME] == html.INNER) { return can.onmotion.copy(can, target) }
		can.page.Select(can, target, html.SPAN, function(item) { can.onmotion.copy(can, item) })
	},
	field: function(can, meta, target, width) { var item = can.base.Obj(meta.meta); item.inputs = item.list, item.feature = item.meta
		can.onappend._init(can, item, [chat.PLUGIN_STATE_JS], function(sub) {
			sub.run = function(event, cmds, cb, silent) { var msg = sub.request(event)
				if (msg.Option(nfs.PATH) == can.Option(nfs.PATH)) { msg.Option(nfs.PATH, "") }
				can.runAction(event, chat.STORY, [meta.type, meta.name, meta.text].concat(cmds), cb, true)
			}, can._plugins = (can._plugins||[]).concat([sub])

			sub.ConfHeight(can.base.Min(300, can.ConfHeight()-300)), sub.ConfWidth(item.width = (width||can.ConfWidth())-(can.user.isWindows? 42: 22))
			can.page.style(can, sub._output, html.MAX_WIDTH, sub.ConfWidth())

			can.core.Value(item, "auto.cmd") && can.onmotion.delay(function() {
				sub.runAction(sub.request({}, can.core.Value(item, "opts")), can.core.Value(item, "auto.cmd"))
			})
		}, can._output, target)
	},
	table: function(can, meta, target) {
		can.page.OrderTable(can, target), can.page.ClassList.add(can, target, chat.CONTENT)
		can.page.Select(can, target, html.TD, function(item) { can.onmotion.copy(can, item) })
	},
	chart: function(can, meta, target) {
		can.page.style(can, target, html.MAX_WIDTH, can.ConfWidth(), html.OVERFLOW, ice.AUTO)
		if (!meta.fg && !meta.bg) { target.className.baseVal = "story auto" }
		target.onclick = function(event) { can.misc.Event(event, can, function(msg) {
			meta.index && can.onappend._float(can, meta.index, [event.target.innerHTML])
		}) }
		target.oncontextmenu = function(event) { can.misc.Event(event, can, function(msg) {
			var ui = can.user.carte(event, can, kit.Dict(mdb.EXPORT, function(event, can, button) {
				can.user.toimage(can, "hi", target)
			})); can.page.style(can, ui._target, {left: event.clientX, top: event.clientY})
		}) }
	},
	image: function(can, meta, target) {
		can.page.style(can, target, html.MAX_HEIGHT, can.base.Min(can.ConfHeight()-20, window.innerHeight/2), html.MAX_WIDTH, can.ConfWidth()-20)
	},
	video: function(can, meta, target) {
		can.page.style(can, target, html.MAX_HEIGHT, can.base.Min(can.ConfHeight()-20, window.innerHeight/2), html.MAX_WIDTH, can.ConfWidth()-20)
	},
	audio: function(can, meta, target) {},
	
	layout: function(can) { var height = can.ConfHeight(), width = can.ConfWidth()
		can.isCmdMode() && can.ConfHeight(can.page.height())
		if (can.sup._navmenu) { can.page.style(can, can.sup._navmenu, html.HEIGHT, can.ConfHeight())
			can.page.style(can, can._output, html.HEIGHT, height, html.WIDTH, width = can.ConfWidth()-can.sup._navmenu.offsetWidth, "clear", "none", "float", "left")
		} else {
			can.isCmdMode() && can.ConfHeight(can.page.height()) && can.page.styleHeight(can, can._output, "")
		}
		can.core.List(can._plugins, function(sub) {
			sub.ConfHeight(can.base.Min(300, height-300)), sub.ConfWidth(width-(can.user.isWindows? 40: 20))
			sub.onimport.size(sub, can.base.Min(300, height-300), width-(can.user.isWindows? 40: 20), true)
		})
		can.page.Select(can, can._output, can.page.Keys(html.IMG, html.VIDEO), function(target) { can.page.style(can, target, html.MAX_HEIGHT, height-20, html.MAX_WIDTH, width-20) })
	},
}, [""])
Volcanos(chat.ONACTION, {_trans: {view: "视图"},
	onkeydown: function(event, can) { can.keylist = can.onkeymap._parse(event, can, "normal", can.keylist) },
	play: function(event, can) { var list = [], current = []
		can.page.Select(can, can._output, wiki.STORY_ITEM, function(item) { can.page.tagis(item, "h1", "h2", "h3") && list.push(current = []), current.push(item) })
		can.onappend._init(can, {type: "story word play float"}, [], function(sub) { sub._legend.onclick = can._legend.onclick
			sub.run = can.run, sub.sup = can, can.sub = sub, can.onappend._action(sub, can.user.isMobile && can.page.height() > can.page.width()? [
				"大纲", "上一页", "下一页", "结束",
			]: [
				["布局", "开讲", "网格", "快闪"], "大纲", "首页", "上一页",
				["菜单"].concat(can.core.List(list, function(page) { return page[0].innerHTML })),
				"下一页", "隐藏", "结束",
			], sub._action, can.ondetail), can.onkeymap._build(can)
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
			sub.onappend._status(sub, [mdb.PAGE, cli.FROM, cli.COST]), sub.Status(cli.FROM, can.base.Time())
			var from = new Date(); can.core.Timer({interval: 100}, function() { var now = new Date(); sub.Status(cli.COST, can.base.Duration(now-from)) })
		}, can._root._target)
	},
})
Volcanos(chat.ONDETAIL, {list: ["删除"],
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
	next: function(sub) { sub.page.Select(sub, sub.ui.content, sub.core.Keys(html.DIV_PAGE, ice.SHOW), function(page) {
		page.nextSibling? sub.sup.ondetail.show(sub, page.nextSibling): sub.user.toast(sub.sup, cli.END)
	}) },
	prev: function(sub) { sub.page.Select(sub, sub.ui.content, sub.core.Keys(html.DIV_PAGE, ice.SHOW), function(page) {
		page.previousSibling? sub.sup.ondetail.show(sub, page.previousSibling): sub.user.toast(sub.sup, cli.END)
	}) },
	flash: function(sub) { sub.core.Next(sub.page.Select(sub, sub.ui.content, html.DIV_PAGE), function(page, next) {
		sub.sup.ondetail.show(sub, page), sub.onmotion.delay(sub, next, 500)
	}) },
	grid: function(sub) { sub.page.styleClass(sub, sub.ui.content, "content grid") },

	"开讲": function(event, can) { can.sup.ondetail.show(can, 0) },
	"网格": function(event, can) { can.sup.ondetail.grid(can) },
	"快闪": function(event, can) { can.sup.ondetail.flash(can) },

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
		normal: {
			"n": function(event, can) { can.ondetail.next(can.sub) },
			"j": function(event, can) { can.ondetail.next(can.sub) },
			"ArrowRight": function(event, can) { can.ondetail.next(can.sub) },
			"ArrowLeft": function(event, can) { can.ondetail.prev(can.sub) },
			"k": function(event, can) { can.ondetail.prev(can.sub) },
			"p": function(event, can) { can.ondetail.prev(can.sub) },

			"q": function(event, can) { can.ondetail["结束"](event, can.sub) },
			"h": function(event, can) { can.ondetail["隐藏"](event, can.sub) },
		},
	}, _engine: {},
})
