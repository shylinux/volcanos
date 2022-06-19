Volcanos("onimport", {help: "导入数据", _init: function(can, msg, cb, target) {

		can.onmotion.clear(can), can.base.isFunc(cb) && cb(msg)
		if (msg.Length() > 0) { return can.onappend.table(can, msg) }

		can.page.Modify(can, target, msg.Result())
		can.page.Select(can, target, wiki.ITEM, function(item) { var data = item.dataset||{}
			can.page.Modify(can, item, {style: can.base.Obj(data.style)})
			can.core.CallFunc([can.onimport, data.type], [can, data, item])
			// can.page.style(can, item, html.MAX_WIDTH, can.ConfWidth()-(can.user.isWindows? 40: 30))
		})
	},
	image: function(can, data, target) {
		can.page.style(can, target, html.MAX_HEIGHT, can.ConfHeight()/2, html.MAX_WIDTH, can.ConfWidth())

		// if (can.user.isMobile) {
			if (can.user.isLandscape()) {
			} else{
				can.page.style(can, target, html.MAX_HEIGHT, can.ConfHeight(), html.MAX_WIDTH, can.ConfWidth())
			}
		// 	return
		// }
		// can.page.style(can, target, html.MAX_HEIGHT, can.ConfHeight()/4)
	},
	navmenu: function(can, data, target) { var nav = can.sup._navmenu
		nav = nav||can.page.Append(can, can._fields, [{view: wiki.NAVMENU}]).first
		can.onmotion.clear(can, nav), can._fields.insertBefore(nav, can._output)

		can.onappend.list(can, can.base.Obj(data.data), function(event, item) {
			var link = item.meta.link, list = can.core.Split(item.meta.link)
			if (can.core.Value(can, list[0])) { return can.core.CallFunc([can, list[0]], list.slice(1)) }
			if (!link || link == can.Option(nfs.PATH)) { return false }

			if (can.onmotion.cache(can, function() { can.user.mod.isCmd && can.user.title(item.meta.name); return can.Option(nfs.PATH, link) })) { return }
			return can.sup.Update(event, [link])
		}, nav), can.sup._navmenu = nav

		can.getActionSize(function(msg) { 
			can.page.style(can, nav, html.HEIGHT, can.Conf(html.HEIGHT)+(can.user.mod.isCmd? msg.Option(html.MARGIN_Y): 0))
			can.Conf(html.WIDTH, can.Conf(html.WIDTH)-nav.offsetWidth-(can.user.mod.isCmd? 10: 20)-10)
			can.page.Modify(can, can._output, {style: kit.Dict(
				html.HEIGHT, can.sup._navmenu.offsetHeight, html.MAX_WIDTH, can.Conf(html.WIDTH),
				html.FLOAT, html.LEFT, html.CLEAR, html.NONE
			)})
		})
	},
	premenu: function(can, data, target) {
		can.page.Select(can, can._output, can.page.Keys(wiki.H2, wiki.H3), function(item) {
			can.page.Append(can, target, [{text: [item.innerHTML, html.LI, item.tagName], onclick: function() {
				item.scrollIntoView()
			}}]), item.onclick = function(event) { target.scrollIntoView() }
		})
	},
	title: function(can, data, target) {
		can.user.mod.isCmd && target.tagName == "H1" && can.user.title(data.text)
	},
	refer: function(can, data, target) {
		can.page.Select(can, target, html.A, function(item) {
			item.onclick = function(event) {
				can.request(event, kit.Dict(ice.MSG_HANDLE, ice.TRUE))
				can.run(event, [ctx.ACTION, mdb.CREATE, mdb.TYPE, "refer", mdb.NAME, item.dataset.name, mdb.TEXT, item.href], null, true)
			}
		})
	},
	spark: function(can, data, target) {
		if (data[mdb.NAME] == chat.FIELD) {
			function deep(text) { var d = 0
				for (var i = 0; i < text.length; i++) {
					switch (text[i]) {
						case "\t": d += 4; break
						case " ": d++; break
						default: return d
					}
				}
				return d
			}
			var list = []; can.core.List(target.innerText.split(ice.NL), function(line) { var _deep = deep(line)
				while (list.length > 0) { if (_deep <= list[list.length-1]._deep) { list.pop() } else { break } }
				var ls = can.core.Split(line), item = {_deep: _deep, meta: {index: ls[0], name: ls[1], args: ls.slice(2)}, list: []}
				if (list.length > 0) { list[list.length-1].list.push(item) } list.push(item)
			})

			var first; function show(item, index, target, output) {
				var ui = can.page.Append(can, target, [{view: [html.ITEM, html.DIV, item.meta.name||item.meta.index], onclick: function(event) {
					if (ui.list.innerText) { return can.onmotion.toggle(can, ui.list) }
					can.onmotion.select(can, view.menu, html.DIV_ITEM, event.target)
					if (can.onmotion.cache(can, function() { return index }, output)) { return }
					can.core.List(item.list, function(item) {
						can.onappend.plugin(can, item.meta, function(sub) {
							sub.run = function(event, cmds, cb, silent) {
								can.run(event, can.misc.concat(can, [ctx.ACTION, ice.RUN, item.meta.index], cmds), cb, true)
							}
							sub.ConfWidth(item.meta.width = can.ConfWidth()-165)
							sub.ConfHeight(item.meta.height = can.ConfHeight()-300)
							can.page.style(can, sub._output, html.MAX_WIDTH, sub.ConfWidth()-2*html.PLUGIN_MARGIN)
							can.page.style(can, sub._status, html.MAX_WIDTH, sub.ConfWidth()-2*html.PLUGIN_MARGIN)
						}, output)
					})
				}}, {view: html.LIST}])
				can.core.List(item.list, function(item) { item.list.length > 0 && show(item, can.core.Keys(index, item.meta.index), ui.list, output) })
				ui.list.innerText == "" && (first = first||ui.item)
			}

			var view = can.page.Appends(can, target, [{view: html.MENU}, {view: html.LIST}])
			return show(list[0], list[0]._index, view.menu, view.list), first.click()
		}
		if (data[mdb.NAME] == html.INNER) { return can.onmotion.copy(can, target) }
		can.page.Select(can, target, html.A, function(item) { can.onmotion.link(can, item) })
		can.page.Select(can, target, html.SPAN, function(item) {
			can.onmotion.copy(can, item, "", function(event) {
				can.run(event, [ctx.ACTION, mdb.CREATE, mdb.TYPE, "spark", mdb.NAME, "shell", mdb.TEXT, item.innerText], null, true)
			})
		})
	},
	chart: function(can, data, target) {
		target.oncontextmenu = function(event) {
			can.user.carteClient(event, can, kit.Dict(mdb.EXPORT, function(event, can, button) {
				can.onmotion.toimage(event, can, "hi.png", target)
			}), [mdb.EXPORT])
		}
	},
	table: function(can, data, target) {
		can.page.OrderTable(can, target), can.page.ClassList.add(can, target, chat.CONTENT)
		can.page.Select(can, target, html.TD, function(item) { can.onmotion.copy(can, item) })
	},
	field: function(can, data, target, width) { var item = can.base.Obj(data.meta)
		can.onappend._init(can, item, [chat.PLUGIN_STATE_JS], function(sub) {
			sub.run = function(event, cmds, cb, silent) {
				can.run(event, can.misc.concat(can, [ctx.ACTION, chat.STORY, data.type, data.name, data.text], cmds), cb, true)
			}
			sub.ConfHeight(can.ConfHeight())
			sub.ConfWidth(item.width = (width||can.ConfWidth())-(can.user.isWindows? 40: 20))
			can.page.style(can, sub._output, html.MAX_WIDTH, sub.ConfWidth())

			can.core.Value(item, "auto.cmd") && can.core.Timer300ms(function() {
				var msg = sub.request({}, can.core.Value(item, "opts")); msg.Option(ice.MSG_HANDLE, ice.TRUE)
				sub.Update(msg._event, [ctx.ACTION, can.core.Value(item, "auto.cmd")])
			})
		}, can._output, target)
	},
	iframe: function(can, data, target) { var meta = can.base.Obj(data.meta)
		can.page.Modify(can, target, {width: can.Conf(html.WIDTH)-200})
	},
}, [""])
Volcanos("onkeymap", {help: "键盘交互", list: [],
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
Volcanos("onaction", {help: "控件交互", list: [],
	_trans: {view: "视图"},
	play: function(event, can) { var list = [], current = []
		can.page.Select(can, can._output, wiki.ITEM, function(item) {
			switch (item.tagName) {
				case "H1":
				case "H2":
				case "H3":
					list.push(current = [])
					break
			}
			current.push(item)
		})

		can.onappend._init(can, {type: "story word float"}, [], function(sub) {
			sub.run = can.run, sub.sup = can, can.sub = sub, can.onappend._action(sub, [
				["布局", "开讲", "快闪", "网格"], "大纲", "首页", "上一页",
				["菜单"].concat(can.core.List(list, function(page) { return page[0].innerHTML })),
				"下一页", "隐藏", "结束",
			], sub._action, can.ondetail)

			can.onengine.signal(can, "keymap.focus", can.request(event, {cb: function(event) {
				can.keylist = can.onkeymap._parse(event, can, "normal", can.keylist)
			}})), can.onkeymap._build(can)

			sub.page.style(sub, sub._target, html.BACKGROUND, document.body.style.background)
			sub.page.style(sub, sub._output, html.HEIGHT, window.innerHeight-4*html.PLUGIN_MARGIN-2*html.ACTION_HEIGHT)
			sub.page.style(sub, sub._output, html.WIDTH, window.innerWidth-4*html.PLUGIN_MARGIN)

			sub.ui = sub.page.Append(sub, sub._output, [{view: chat.PROJECT}, {view: chat.CONTENT}])
			can.core.List(sub.list = list, function(page, index) {
				can.onappend.item(can, html.ITEM, {name: page[0].innerHTML}, function(event) {
					can.ondetail.show(sub, index) 
				}, function(event) {}, sub.ui.project)

				sub.page.Append(sub, sub.ui.content, [{view: "page"+(index==0? " first": ""), list: can.core.List(page, function(item) { var data = item.dataset||{}
					switch (data.type) {
						case wiki.PREMENU: item = item.cloneNode(false); break
						case chat.FIELD: item = can.onappend.field(can, chat.STORY, can.base.Obj(data.meta), sub.ui.content).first; break
						default: item = item.cloneNode(true)
					}
					return can.core.CallFunc([can.onimport, data.type], [sub, data, item, window.innerWidth-4*html.PLUGIN_MARGIN]), item
				}), }])
			}), can.onmotion.hidden(can, sub.ui.project), can.ondetail.show(sub, 0) 

			sub.onappend._status(sub, [mdb.PAGE, cli.FROM, cli.COST]), sub.Status(cli.FROM, can.base.Time())
			var from = new Date(); can.core.Timer({interval: 100}, function() { var now = new Date()
				sub.Status(cli.COST, can.base.Duration(now-from))
			})
		}, document.body)
	},
	view: function(event, can) {
		if (can._height) {
			can.page.styleHeight(can, can._target, can._height), can.page.styleHeight(can, can.sup._navmenu, can._height), delete(can._height)
		} else { can._height = can.page.styleHeight(can, can._target)
			can.page.styleHeight(can, can._target, ""), can.page.styleHeight(can, can.sup._navmenu, "")
		}
	},
})
Volcanos("ondetail", {help: "交互操作", list: ["删除"], _init: function(can, msg, list, cb, target) {
	},
	show: function(sub, which) { sub.page.Modify(sub, sub.ui.content, {className: chat.CONTENT})
		sub.page.Select(sub, sub.ui.content, wiki.DIV_PAGE, function(page, index) {
			if (index == which || page == which) {
				sub.page.Select(sub, page, sub.page.Keys(html.H1, html.H2, html.H3), function(item) { sub.Action("菜单", item.innerHTML) })
				sub.onmotion.select(sub, sub.ui.project, html.DIV_ITEM, index)
				sub.Status(mdb.PAGE, index+1+ice.PS+sub.list.length)
				sub.page.ClassList.add(sub, page, html.SHOW)
			} else {
				sub.page.ClassList.del(sub, page, html.SHOW)
			}
		})
	},
	next: function(sub) {
		sub.page.Select(sub, sub.ui.content, sub.core.Keys(wiki.DIV_PAGE, ice.SHOW), function(page) {
			page.nextSibling? sub.sup.ondetail.show(sub, page.nextSibling): sub.user.toast(sub, cli.END)
		})
	},
	prev: function(sub) {
		sub.page.Select(sub, sub.ui.content, sub.core.Keys(wiki.DIV_PAGE, ice.SHOW), function(page) {
			page.previousSibling? sub.sup.ondetail.show(sub, page.previousSibling): sub.user.toast(sub, cli.END)
		})
	},
	flash: function(sub) {
		sub.core.Next(sub.page.Select(sub, sub.ui.content, wiki.DIV_PAGE), function(page, next) {
			sub.sup.ondetail.show(sub, page), sub.core.Timer(500, function() { next() })
		})
	},
	grid: function(sub) { sub.page.Modify(sub, sub.ui.content, {className: "content grid"}) },

	"开讲": function(event, can) { can.sup.ondetail.show(can, 0) },
	"快闪": function(event, can) { can.sup.ondetail.flash(can) },
	"网格": function(event, can) { can.sup.ondetail.grid(can) },

	"大纲": function(event, can) { can.onmotion.toggle(can, can.ui.project) },
	"首页": function(event, can) { can.sup.ondetail.show(can, 0) },
	"上一页": function(event, can) { can.sup.ondetail.prev(can, can.ui.content) },
	"菜单": function(event, can) { can.sup.ondetail.show(can, event.target.selectedIndex) },
	"下一页": function(event, can) { can.sup.ondetail.next(can, can.ui.content) },
	"隐藏": function(event, can) { can.onmotion.toggle(can, can._output) },
	"结束": function(event, can) { can.page.Remove(can, can._target) },
	"删除": function(event, sub) { sub.page.Remove(sub, sub._target) },
})

