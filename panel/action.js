Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg) {
		var river = can.Conf(chat.RIVER), storm = can.Conf(chat.STORM)
		can.onmotion.clear(can), can.core.Next(msg.Table(), function(item, next) {
			item.height = can.Conf(html.HEIGHT)-can.Conf(html.MARGIN_Y)
			item.width = can.Conf(html.WIDTH)-can.Conf(html.MARGIN_X)
			item.feature = can.base.Obj(item.feature||item.meta)
			item.inputs = can.base.Obj(item.inputs||item.list)

			can.onappend.plugin(can, item, function(sub, meta, skip) {
				can.onimport._plugin(can, river, storm, sub, meta), skip || next()
			})
		}, function() {
			can.onaction.layout(can, can.misc.SearchOrConf(can, chat.LAYOUT)||Volcanos.meta.args.layout||"auto", true)
			can.onimport._menu(can, msg), can.onkeymap._init(can)
		})
	},
	_plugin: function(can, river, storm, sub, meta) { sub._target._meta = meta
		sub.run = function(event, cmds, cb) { var msg = sub.request(event)
			return can.run(event, can.misc.concat(can, [river, storm, meta.id||meta.index], cmds), function(msg) {
				can.base.isFunc(cb) && cb(msg)
			})
		}, can._plugins = can.misc.concat(can, can._plugins, [sub])

		meta.id && (sub._option.dataset = sub._option.dataset||{}, sub._option.dataset.id = meta.id)

		can.onengine.listen(can, "orientationchange", function(event) {
			can.page.style(can, sub._output, html.MAX_WIDTH, meta.width-(can.user.isWindows? 20: 0))
		})
		can.page.style(can, sub._output, html.MAX_WIDTH, meta.width-(can.user.isWindows? 20: 0))

		can.page.Append(can, can._action, [{view: [html.TABS, html.DIV, meta.name], onclick: function(event) {
			can.onmotion.select(can, can._output, html.FIELDSET_PLUGIN, sub._target)
			can.onmotion.select(can, can._action, html.DIV_TABS, event.target)
		}, onmouseenter: sub._legend.onmouseenter, ondblclick: sub._legend.onclick}])
	},
	_menu: function(can, msg) { if (can.user.mod.isPod||can.user.isMobile) { return }
		can.setHeaderMenu(can.base.Obj(msg.Option(chat.MENUS), can.Conf(chat.MENUS)||can.onaction._menus), function(event, button, list) {
			can.core.CallFunc([can.onaction, list[0]], [can, button])
		})
	},

	_share: function(can, share) { share && can.run({}, ["_share", share], function(msg) {
		can.user.title(msg.OptionOrSearch(chat.TITLE))
		can.setHeader(chat.TOPIC, msg.OptionOrSearch(chat.TOPIC))

		if (msg.Length() == 1) {
			can.search(event, ["Header.onmotion.hidden"])
			can.search(event, ["Footer.onmotion.hidden"])
			can.page.ClassList.add(can, can._target, "cmd")
			can.Conf(html.HEIGHT, window.innerHeight)
			can.Conf(html.WIDTH, window.innerWidth)
		}

		can.Conf(html.MARGIN_X, 0, html.MARGIN_Y, 2*html.ACTION_HEIGHT)
		can.onlayout._init(can, document.body)

		can.Conf(chat.RIVER, "_share", chat.STORM, share)
		msg.Length() > 0 && can.onimport._init(can, msg)
	}) },
	_cmd: function(can, item, next) {
		can.base.Copy(item, {
			height: can.Conf(html.HEIGHT)-can.Conf(html.MARGIN_Y)+(can.user.isWindows? 17: 0),
			width: can.Conf(html.WIDTH),
			opts: can.misc.Search(can),
		})
		can.onappend.plugin(can, item, function(sub, meta, skip) {
			can.page.style(can, sub._output, html.MAX_WIDTH, window.innerWidth)
			can.user.title(meta.name), skip || next()
		})
	},
})
Volcanos("onengine", {help: "解析引擎", list: [], _engine: function(event, page, msg, can, cmds, cb) {
	var storm = can.core.Value(can._root, can.core.Keys(chat.RIVER, cmds[0], chat.STORM, cmds[1]))
	if (!storm || cmds.length != 2) { return false }

	if (storm.index) { // 命令索引
		can.run(event, [ctx.ACTION, ctx.COMMAND].concat(storm.index), cb)
	} else { // 命令列表
		can.core.List(storm.list, function(value) {
			msg.Push(mdb.NAME, value.name||"")
			msg.Push(mdb.HELP, value.help||"")
			msg.Push(ctx.INPUTS, JSON.stringify(value.inputs))
			msg.Push(ctx.FEATURE, JSON.stringify(value.feature))
			msg.Push(ctx.INDEX, value.index||"")
			msg.Push(ctx.ARGS, value.args||"[]")
			msg.Push(ice.MSG_ACTION, value._action||"")
			msg.Push("display", value.display||"")
		}), can.base.isFunc(cb) && cb(msg)
	}
	return true
}})
Volcanos("onaction", {help: "交互操作", list: [], _init: function(can, cb, target) {
		can.Conf(html.MARGIN_Y, 4*html.PLUGIN_MARGIN+2*html.ACTION_HEIGHT+html.ACTION_MARGIN)
		can.Conf(html.MARGIN_X, 4*html.PLUGIN_MARGIN)

		if (can.user.mod.isPod || can.user.isMobile) {
			var gt = "&#10095;", lt = "&#10094;"; function toggle(view) { return !can.setRiver("display") }
			can.page.Append(can, target, [{view: [[html.TOGGLE, chat.PROJECT]], list: [{text: [gt, html.DIV]}], onclick: function(event) {
				event.target.innerHTML = toggle()? gt: lt
			}}])
		}

		can.onengine.plugin(can, "cookie", shy("提示", {}, ["text", "list", "back"], function(msg, cmds) {
			can.core.Item(can.misc.Cookie(can), function(key, value) {
				msg.Push("key", key)
				msg.Push("value", value)
			})
		}))
		can.onengine.plugin(can, "alert", shy("提示", {}, ["text", "list", "back"], function(msg, cmds) {
			can.user.alert(cmds[0])
		}))
		can.onengine.plugin(can, "info", shy("信息", {}, ["text", "list", "back"], function(msg, cmds) {
			msg.Echo("hello world")
		}))
		can.onengine.plugin(can, "log", shy("日志", {}, ["text", "list", "back"], function(msg, cmds) {
			console.log(cmds[0])
		}))

		can.onengine.plugin(can, "nfs.save", shy("保存文件", {}, ["file=hi.txt", "text:textarea='hello world'", "save:button"], function(msg, cmds, cb) {
			can.misc.runAction(can, msg, cmds, cb, kit.Dict(
				"save", function(cmds) { can.user.downloads(can, cmds[1], cmds[0]) }
			))
		}))

		can.onengine.plugin(can, "pie", shy("比例图", {}, ["list", "back"], function(msg, cmds) {
			msg.DisplayStory("pie.js")
			msg.Push("value", 200)
			msg.Push("value", 300)
			msg.Push("value", 400)
		}))
		can.onengine.plugin(can, "can.code.inner.plugin", shy("插件", {}, [{type: "button", name: "list", action: "auto"}, "back"], function(msg, cmds) {}))

		target.ontouchstart = function(event) {
			can.onengine.signal(can, "onaction_touch", can.request(event))
		}, can.base.isFunc(cb) && cb()
	},
	_menus: [
		[chat.LAYOUT, "auto", "tabs", "grid", "free", "flow", "page", "toimage"],
		[ice.HELP, "tutor", "manual", "service", "devops", "refer"],
	],
	_trans: {
		"layout": "布局",
		"auto": "默认布局",
		"flow": "流动布局",
		"grid": "网格布局",
		"tabs": "标签布局",
		"free": "自由布局",
		"page": "网页布局",
		"toimage": "生成图片",

		"help": "帮助",
		"tutor": "入门简介",
		"manual": "使用手册",
		"service": "服务手册",
		"devops": "编程手册",
		"refer": "参考手册",
	},
	onmain: function(can) {
		can.onimport._share(can, can.misc.Search(can, web.SHARE))
	},
	onlogin: function(can) { if (!can.Conf(chat.TOOL) && !can.user.mod.isCmd) { return }
		can.Conf(html.MARGIN_X, 0, html.MARGIN_Y, 2*html.ACTION_HEIGHT)
		can.page.ClassList.add(can, can._target, ice.CMD)
		can.onlayout._init(can)

		can._names = location.pathname
		can.Conf(chat.TOOL)? can.core.Next(can.Conf(chat.TOOL), function(item, next) {
			can.onimport._cmd(can, item, next)

		}): can.run(can.request()._event, [ctx.ACTION, ctx.COMMAND], function(msg) {
			can.core.Next(msg.Table(), function(item, next) {
				can.onimport._cmd(can, item, next)
			})
		})
	},
	onstorm_select: function(can, msg, river, storm) { can.onlayout._init(can)
		if (can.onmotion.cache(can, function() {
			var key = can.core.Keys(can.Conf(chat.RIVER, river), can.Conf(chat.STORM, storm))
			return key
		}, can._action, can._output)) {
			var conf = can.core.Value(can._root, can.core.Keys(chat.RIVER, river, chat.STORM, storm))||{}
			can.onaction.layout(can, conf.layout||can.misc.SearchOrConf(can, chat.LAYOUT)||Volcanos.meta.args.layout||"auto", true)
			return
		}

		can.run({}, [river, storm], function(msg) { if (msg.Length() > 0) { return can.onimport._init(can, msg) }
			can.onengine.signal(can, "onaction_notool", can.request({}, {river: river, storm: storm}))
		})
	},
	onsearch: function(can, msg, word) {
		if (word[0] == mdb.PLUGIN || word[1] != "") { can.onexport.plugin(can, msg, word) }
	},
	onsize: function(can, msg, height, width) { can.Conf({height: height, width: width}) },

	help: function(can, button) { can.user.open("/help/"+button+".shy") },
	layout: function(can, button, silent) {
		if (button == "toimage") {
			can.onmotion.toimage(event, can, document.title, can._output)
			return
		}
		can.page.ClassList.del(can, can._target, can.Conf(chat.LAYOUT))
		can.page.ClassList.add(can, can._target, can.Conf(chat.LAYOUT, button))

		if (button == "auto") {
			can.Conf(chat.LAYOUT, "")

		} else if (button == "tabs") {
			can.onmotion.select(can, can._output, html.FIELDSET_PLUGIN, 0)
			can.onmotion.select(can, can._action, html.DIV_TABS, 0)
		} else if (button == "free") {
			can.page.Select(can, can._target, [[html.DIV_OUTPUT, html.FIELDSET_PLUGIN]], function(item, index) {
				can.page.Modify(can, item, {style: {left: 40*index, top: 40*index}})
				can.onmotion.move(can, item, {left: 40*index, top: 40*index})
			})
		} else if (button == "grid") {
			can.user.input(event, can, [{name: "m", value: 2}, {name: "n", value: 2}], function(event, button, data, list, args) {
				can.getActionSize(function(height, width) { var m = parseInt(data.m)||2, n = parseInt(data.n)||2
					can.page.css(can.base.replaceAll(chat.ACTION_LAYOUT_FMT, "_width", (width-(4*m+1)*html.PLUGIN_MARGIN)/m+"px", "_height", (height-(4*n+1)*html.PLUGIN_MARGIN)/n+"px"))
				})
			}, silent)
		}
		can.onlayout._init(can)
	},
})
Volcanos("onkeymap", {help: "键盘交互", list: [], _focus: [], _init: function(can, target) {
		can.onkeymap._build(can), can.onengine.listen(can, "onkeydown", function(msg, model) {
			can._keylist = can.onkeymap._parse(msg._event, can, model, can._keylist||[], can._output)
		})
	},
	_mode: {
		normal: {
			j: function(event, can, target) { target.scrollBy(0, event.ctrlKey? 300: 30) },
			k: function(event, can, target) { target.scrollBy(0, event.ctrlKey? -300: -30) },

			b: function(event, can, target) { can.search(event, ["Header.onaction.black"]) },
			w: function(event, can, target) { can.search(event, ["Header.onaction.white"]) },

			g: function(event, can, target) { can.search(event, ["River.ondetail.创建群组"]) },
			s: function(event, can, target) { can.search(event, ["River.ondetail.添加应用"]) },
			t: function(event, can, target) { can.search(event, ["River.ondetail.添加工具"]) },

			" ": function(event, can, target) {
				can.onengine.signal(can, "onsearchfocus")
				can.onkeymap.prevent(event)
			},
			":": function(event, can, target) {
				can.onengine.signal(can, "oncommandfocus")
				can.onkeymap.prevent(event)
			},
			enter: function(event, can, target) { can.misc.Log("enter") },
			escape: function(event, can, target) {
				can.page.Select(can, document.body, html.FIELDSET_AUTO, function(item) {
					// can.onmotion.hidden(can, item)
				})
				can.page.Select(can, document.body, can.page.Keys(html.FIELDSET_FLOAT, html.DIV_FLOAT), function(item) {
					can.page.Remove(can, item)
				})
			},
		},
	}, _engine: {},
})
Volcanos("onexport", {help: "导出数据", list: [],
	args: function(can, cb, target) {
		can.core.Next(can.page.Select(can, target, [[html.FIELDSET_PLUGIN, html.FORM_OPTION]]), function(item, next, index, array) {
			item.dataset.args = JSON.stringify(can.page.Select(can, item, html.OPTION_ARGS, function(item) { return item.value||"" }))
			cb(item, next, index, array)
		})
	},
	size: function(can, msg) {
		msg.Option(html.TOP, can._target.offsetTop)
		msg.Option(html.LEFT, can._target.offsetLeft)
		msg.Option(html.WIDTH, can._target.offsetWidth)
		if (msg.Option(html.HEIGHT, can._target.offsetHeight-can._action.offsetHeight) > window.innerHeight) {
			msg.Option(html.HEIGHT, window.innerHeight-2*html.ACTION_HEIGHT)
		}
		msg.Option(html.SCROLL, can.user.isMobile? can._target.parentNode.parentNode.scrollTop: can._output.scrollTop)
		msg.Option(html.MARGIN_X, can.Conf(html.MARGIN_X))
		msg.Option(html.MARGIN_Y, can.Conf(html.MARGIN_Y))
	},
	layout: function(can, msg) { return can.Conf(chat.LAYOUT) },
	plugin: function(can, msg, word) { var fields = can.core.Split(msg.Option(ice.MSG_FIELDS))
		can.page.Select(can, can._output, [[html.FIELDSET_PLUGIN, html.LEGEND]], function(item) {
			if (item.innerHTML.indexOf(word[1]) == -1) { return }

			var meta = item.parentNode._meta
			var list = can.page.Select(can, item.nextSibling, html.OPTION_ARGS, function(item) { return item.value||"" })

			var data = {ctx: "web.chat", cmd: ctx.ACTION,
				type: mdb.PLUGIN, name: item.innerHTML, text: shy("跳转", function(event) {
					var input = can.page.Select(can, item.parentNode, html.INPUT_ARGS)[0]
					input && input.focus()
				}), argument: JSON.stringify(list),
			}
			if (meta.index) {
				data.context = "", data.command = meta.index
			} else if (meta.cmd) {
				data.context = meta.ctx, data.command = meta.cmd
			} else {
				return
			}
			msg.Push(data, fields)
		})
	},
})

