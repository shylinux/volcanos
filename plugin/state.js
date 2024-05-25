Volcanos(chat.ONIMPORT, {
	_process: function(can, msg) { if (msg.IsErr()) { can.onappend.style(can, "warn", can.user.toastFailure(can, msg.Result())._target) }
		if (can.onimport[msg.OptionProcess()]) { return can.core.CallFunc([can.onimport, msg.OptionProcess()], {can: can, sub: can.sub, msg: msg, arg: msg.Option("_arg")}), true } },
	_location: function(can, msg, arg) { can.user.jumps(arg) },
	_replace: function(can, msg, arg) { location.replace(arg) },
	_history: function(can, msg) { history.length == 1? can.user.close(): history.back() },
	_confirm: function(can, msg, arg) { can.user.toastConfirm(can, arg, "", function() { can.runAction(can.request({}, msg), "confirm") }) },
	_refresh: function(can, msg, arg) { can.core.Timer(parseInt(arg||"30"), function() { can.Update(can.request({}, {_count: parseInt(msg.Option("_count")||"3")-1})) }) },
	_rewrite: function(can, msg) { var arg = msg._arg; for (var i = 0; i < arg.length; i += 2) {
		can.Option(arg[i], arg[i+1]), can.Action(arg[i], arg[i+1])
		can.misc.sessionStorage(can, [can.ConfIndex(), ctx.ACTION, arg[i]], arg[i+1])
	} can.Update() },
	_display: function(can, msg) { can.onappend._output(can, msg, msg.Option(ice.MSG_DISPLAY)) },
	_clear: function(can, msg) { can.onmotion.clear(can) },
	_inner: function(can, sub, msg) { sub = sub||can, can.onmotion.scrollIntoView(can, can.onappend.table(sub, msg)), can.onmotion.scrollIntoView(can, can.onappend.board(sub, msg)), can.onmotion.story.auto(sub) },
	_cookie: function(can, msg) { can.misc.Cookie(can, msg._arg[0], msg._arg[1]), can.Update() },
	_session: function(can, msg) { can.misc.sessionStorage(can, msg._arg[0], msg._arg[1]), can.Update() },
	_field: function(can, msg, cb) {
		can.page.style(can, can._target, "visibility", "")
		can.page.style(can, can._output, "visibility", "")
		var height = can.ConfHeight()-can.onexport.actionHeight(can)-(can.onexport.statusHeight(can)||1), width = can.ConfWidth()
		var tabs = false, tabHash = msg.Option("field.tabs"); if (tabHash) {
			can.sub && can.sub.onimport.tabs(can.sub, [{name: tabHash.slice(0, 6)}], function() { can.onmotion.cache(can, function() { return tabHash }) }), tabs = true
		} else {
			if (msg.Length() > 1) {
				height = height / msg.Length()
			} else if (can._output.innerHTML && !can.page.tagis(can._target, html.FIELDSET_OUTPUT)) {
				height = can.base.Max(html.STORY_HEIGHT, height)
			}
		}
		msg.Table(function(item) { tabs && can.onmotion.cache(can, function() { return tabHash })
			can.onappend._plugin(can, item, {index: item.index, args: can.base.Obj(item.args||item.arg, []), height: height, width: width}, function(sub) { can._plugins = (can._plugins||[]).concat([sub])
				sub.run = function(event, cmds, cb) { var index = msg.Option(ice.MSG_INDEX)||item.index; can.run(can.request(event, {pod: item.space}), (msg[ice.FIELD_PREFIX]? msg[ice.FIELD_PREFIX]: index? [ctx.RUN, index]: []).concat(cmds), cb, true) }
				can.page.ClassList.has(can, sub._target, html.FLOAT)? can.onmotion.float(sub): sub.onimport.size(sub, height, width, true), cb && cb(sub)
				if (item.style == html.FLOAT) { return } can.onmotion.delay(can, function() { can.onmotion.scrollIntoView(can, sub._target) }, 300)
				sub.onexport.output = function() { if (tabs) { msg.Option(ice.MSG_ACTION) && can.onappend._action(can, msg.Option(ice.MSG_ACTION))
					sub.sub.onimport.tabs(sub.sub, [{name: tabHash.slice(0, 6)}], function() { tabs || can.onmotion.cache(can, function() { return tabHash }) }), tabs = false
				} }
			}, item.style == html.FLOAT && can.page.tagis(can._target, "fieldset.story")? document.body: can._output)
		})
	},
	_float: function(can, msg) { can.onimport._field(can, msg, function(sub) { can.onmotion.float(sub) }) },
	_hold: function(can, msg, arg) { can.user.toast(can, arg||ice.SUCCESS) },
	_back: function(can) { can.onimport.back({}, can) },
	_rich: function(can, msg) { var sub = can.sub
		function _rich() {
			if (sub._rich_list.length == 0) { return } if (sub._rich_running) { return } sub._rich_running = true
			var msg = sub._rich_list.shift(), list = msg.detail.slice(1)
			if (!sub._rich._table) {
				for (var i = 1; i < msg.detail.length; i += 2) { msg.Push(msg.detail[i], msg.detail[i+1]) }
				sub._rich._table = can.page.SelectOne(can, can.onappend.table(sub._rich, msg), html.TBODY)
			} else { var list = []
				for (var i = 1; i < msg.detail.length; i += 2) { list.push(can.page.Color(msg.detail[i+1])) }
				var tr = can.page.Append(can, sub._rich._table, [{td: list}]).tr; sub._rich._output.scrollTop += 100000
				can.onmotion.delayOnce(can, function() { can.onmotion.select(can, tr.parentNode, html.TR, tr) }, 500)
				sub._rich.onappend._status(sub._rich, msg.Option(ice.MSG_STATUS), null, msg)
			} can.core.Timer(msg.Option(cli.DELAY)||0, function() { sub._rich_running = false, _rich() })
		}
		if (sub._rich) {
			(sub._rich_list = sub._rich_list||[]).push(msg); return _rich()
		} else {
			(sub._rich_list = sub._rich_list||[]).push(msg); if (sub._rich_list.length > 1) { return }
		}
		var height = can.onexport.outputHeight(can)
		can.onappend.plugin(can, {title: can.core.Keys(msg.Option(ice.MSG_TITLE)||"table.js"), index: "can._filter", height: height, style: "rich"}, function(sub) {
			sub.onexport.output = function() {
				can.page.style(can, sub._output, html.HEIGHT, "", html.MAX_HEIGHT, "")
				can.sub._rich = sub.sub, _rich(), can.onmotion.scrollIntoView(can, sub._target)
			}
		}); return
	},
	_grow: function(can, msg, arg) {
		var sub = can.sub; if (sub && sub.onimport && sub.onimport.grow) { return sub.onimport.grow(sub, msg, msg.detail[1], msg.detail[2]) }
		if (msg.Option(ctx.DISPLAY)) {
			function _grow() { if (can.sub._grow_list.length == 0) { return } if (can.sub._grow_running) { return } can.sub._grow_running = true
				var msg = can.sub._grow_list.shift(), text = msg.detail[1]; sub._grow.onappend._status(sub._grow, msg.Option(ice.MSG_STATUS), null, msg)
				sub._grow._size = (sub._grow._size||0)+text.length, text && text.match(/\n/g) && (sub._grow._count = (sub._grow._count||0)+text.match(/\n/g).length)
				if (msg.Option(cli.DELAY) && msg.Option(cli.DELAY) != "0") { var list = []; for (var i = 0; i < text.length; i++) { list.push(text[i]) }
					can.core.Next(list, function(text, next) {
						can.sub._grow.onimport.grow(can.sub._grow, msg, "current", text), can.core.Timer(msg.Option(cli.DELAY), next)
					}, function() { can.sub._grow_running = false, _grow() })
				} else {
					can.sub._grow.onimport.grow(can.sub._grow, msg, "current", text), can.sub._grow_running = false, _grow()
				} sub._grow.Status(mdb.COUNT, sub._grow._count), sub._grow.Status("msg", can.base.Size(sub._grow._size))
			}
			if (can.sub._grow) {
				(can.sub._grow_list = can.sub._grow_list||[]).push(msg); return _grow()
			} else {
				(can.sub._grow_list = can.sub._grow_list||[]).push(msg); if (can.sub._grow_list.length > 1) { return }
			}
			var height = can.onexport.outputHeight(can)
			can.onappend.plugin(can, {
				index: "can._filter", display: msg.Option(ctx.DISPLAY), height: height,
				title: can.core.Keys(msg.Option(ice.MSG_TITLE)||msg.Option(ctx.DISPLAY).split(nfs.PS).pop()),
			}, function(sub) {
				sub.onexport.output = function() { can.onmotion.scrollIntoView(can, sub._target), can.sub._grow = sub.sub, _grow() }
			}); return
		}
		arg = can.page.Color(arg); if (!can.page.SelectOne(can, can._output, html.DIV_CODE, function(div) {
			return can.page.style(can, div, html.MAX_HEIGHT, can.onexport.outputHeight(can)),
				can.page.Append(can, div, [{text: arg}]), can._output.scrollTop = div.offsetTop, div.scrollBy(0, 10000), true
		})) { can.onappend.board(can, arg) }
	},
	_open: function(can, msg, arg) { can.user.open(arg); msg._arg.length > 1 && can.Update() },
	_close: function(can, msg) { can.user.close() || history.back() },
	change: function(event, can, name, value, cb, data) { return can.page.SelectArgs(can, can._option, "", function(input) { if (input.name != name || value == input.value) { return }
		can.page.Select(can, input.parentNode, "span.value", function(target) { target.innerText = value })
		return input.value = value, can.Update(event, can.Input([], true, data), cb), input
	})[0] },
	_size: function(can, height, width, auto, mode) {},
	size: function(can, height, width, auto, mode) { typeof width == code.STRING && (width = can.base.ParseSize(width))
		can.Conf("_auto", auto), can.Mode(mode), can.ConfHeight(height), can.ConfWidth(width), height -= can.onexport.actionHeight(can)+(can.onexport.statusHeight(can)||(can.sub? 0: 1))
		var padding = can.Conf("padding")||0, margin = can.Conf("margin")||0; height -= 2*padding, width -= 2*padding+2*margin
		auto || auto == undefined? (can.page.style(can, can._output, html.HEIGHT, "", html.WIDTH, "", html.MAX_HEIGHT, height, html.MAX_WIDTH, width), can.page.style(can, can._target, html.HEIGHT, "", html.WIDTH, "")):
			(can.page.style(can, can._output, html.HEIGHT, height, html.WIDTH, width, html.MAX_HEIGHT, "", html.MAX_WIDTH, ""), can.page.style(can, can._target, html.WIDTH, width))
		if (can.misc.Search(can, log.DEBUG) == ice.TRUE) { can.Status(html.HEIGHT, can.base.Max(height, can._output.offsetHeight), html.WIDTH, width) }
		can.page.style(can, can._status, html.MAX_WIDTH, width)
		can.core.List(can._plugins, function(sub) { sub.onimport.size(sub, height, width, false) })
		var sub = can.sub; if (!sub) { return auto } sub.Mode(mode), sub.ConfHeight(height), sub.ConfWidth(width), can.onimport._size(can)
		mode? sub.onlayout[mode](sub, height, width): sub.onlayout._init(sub, height, width)
		return auto
	},
	display_size: function(can, sub) { var border = 1
		can.page.style(can, sub._output, html.MAX_HEIGHT, "")
		var _height = can.base.Max(sub._target.offsetHeight+border, can.ConfHeight()/2)
		sub.onimport.size(sub, _height-border, can.ConfWidth()-(can.ui && can.ui.project? can.ui.project.offsetWidth: 0), true)
	},
	back: function(event, can) { can._history.pop(); for (var i = 0, his = can._history.pop(); his; his = can._history.pop()) { if (his[0] == ctx.ACTION) { continue }
		can.page.SelectArgs(can, can._option, "", function(target) { target.value = his[i++]||"", can.page.Select(can, target.parentNode, "span.value", function(target) { target.innerText = target.value||"" }) })
		can.page.SelectArgs(can, can._action, "", function(target) { target.value = his[i++]||"" }); break
	} can.Update(event) },
})
Volcanos(chat.ONACTION, {list: ["刷新数据",
		function(can) { if (!can.user.isMobile) { return "刷新界面" } },
		function(can) { if (!can.user.isMobile && !can.isCmdMode()) { return "切换浮动" } },
		function(can) { if (!can.user.isMobile && !can.isCmdMode()) { return "切换全屏" } },
		function(can) { if (can.isCmdMode()) { return "打开首页" } },
		function(can) { if (can.ConfSpace() || can.isCmdMode() && can.misc.Search(can, ice.POD)) { return "打开空间" } },
		function(can) { if (!can.isCmdMode()) { return "打开链接" } },
		"生成链接", "共享工具", "发送聊天",
		function(can) { if (can.Conf("_help")) { return "查看文档" } },
		function(can) { if (can.misc.Search(can, ice.MSG_DEBUG)) { return "查看脚本" } },
		function(can) { if (can.misc.Search(can, ice.MSG_DEBUG)) { return "查看源码" } },
		function(can) { if (can.misc.Search(can, ice.MSG_DEBUG)) { return "查看镜像" } },
		["视图", "参数", "插件",
			function(can) { if (can._action.innerHTML) { return "操作" } },
			function(can) { if (can._status.innerHTML) { return "状态" } },
			function(can) { if (can.sub && can.sub.ui.project) { return "专注" } },
			function(can) { if (can.sub && can.sub.ui.project) { return "项目" } },
			function(can) { if (can.sub && can.sub.ui.profile) { return "预览" } },
			function(can) { if (can.sub && can.sub.ui.display) { return "演示" } },
		],
		function(can) { if (can.misc.Search(can, ice.MSG_DEBUG)) {
			return ["调试",
				function(can) { if (can.Conf("_help")) { return "查看文档" } },
				"查看脚本", "查看源码", "查看镜像",
				"查看通知", "查看视图", "查看数据", "会话存储", "本地存储",
				"查看报文", "查看配置", "查看日志", "删除工具",
			]
		} },
	],
	_engine: function(event, can, button) { can.Update(event, [ctx.ACTION, button].concat(can.Input())) },
	_switch: function(can, sub, mode, save, load) {
		if (can.page.ClassList.neg(can, can._target, mode)) {
			(can._mode_list = can._mode_list||[]).push(kit.Dict(
				html.HEIGHT, can.ConfHeight(), html.WIDTH, can.ConfWidth(), ice.MODE, can.Mode()||"",
				html.ACTION, can.page.isDisplay(can._action), html.STATUS, can.page.isDisplay(can._status),
				html.OUTPUT, can.base.Copy({}, can._output.style, html.HEIGHT, html.WIDTH, html.MAX_HEIGHT, html.MAX_WIDTH),
				ctx.STYLE, can.base.Copy({}, can._target.style, html.LEFT, html.TOP, html.RIGHT, html.BOTTOM), save()
			)), can.onimport.size(can, can.ConfHeight(), can.ConfWidth(), false, mode)
		} else { var back = (can._mode_list = can._mode_list||[]).pop(); if (!back) { return }
			can.onmotion.toggle(can, can._action, back.action), can.onmotion.toggle(can, can._status, back.status)
			can.onimport.size(can, back.height, back.width, false, back.mode), can.page.style(can, can._target, back.style), load && load(back)
		}
	},
	"刷新数据": function(event, can) { can.Update(event, can.Input()), can.user.toastSuccess(can) },
	"刷新界面": function(event, can) { var sub = can.sub; sub.onlayout._init(sub, sub.ConfHeight(), sub.ConfWidth()), can.user.toastSuccess(can) },
	"切换浮动": function(event, can, button, sub) {
		can.onaction._switch(can, sub, chat.FLOAT, function() {
			// can.onmotion.hidden(can, can._action), can.onmotion.hidden(can, can._status)
			can.onmotion.float(can)
		}) },
	"切换全屏": function(event, can, button, sub) { can.onaction._switch(can, sub, chat.FULL, function() { can.page.style(can, can._target, html.LEFT, "", html.TOP, can.onexport.marginTop(), html.BOTTOM, "")
		can.ConfHeight(can.page.height()-can.onexport.marginTop()-can.onexport.marginBottom(can)), can.ConfWidth(can.page.width())
	}) },
	"远程控制": function(event, can) { can.onaction.keyboard(event, can) },
	"共享工具": function(event, can) { var meta = can.Conf(); can.onmotion.share(can.request(event, {pod: can.ConfSpace()}), can, [], [mdb.NAME, meta.index, mdb.TEXT, JSON.stringify(can.Input())]) },
	"打开首页": function(event, can) { can.user.open(location.origin) },
	"打开空间": function(event, can) { can.user.open(can.misc.MergePodCmd(can, {pod: can.ConfSpace()||can.misc.Search(can, ice.POD)})) },
	"打开链接": function(event, can) { can.user.open(can.onexport.link(can)) },
	"发送聊天": function(event, can) {
		can.user.input(event, can, [{name: chat.MESSAGE, display: "/require/usr/icebergs/core/chat/message.js", run: function(event, cmds, cb) {
			can._root.Header.run(can.request(event, {pod: can.ConfSpace()}), [ctx.ACTION, chat.MESSAGE].concat(cmds), function(msg) { cb(msg) })
		}}], function(list) { var args = can.core.Item(can.Option(), function(key, value) { return value })
			can._root.Header.run(can.request(event, {pod: can.ConfSpace()}), [ctx.ACTION, chat.MESSAGE, list[0],
				mdb.TYPE, "plug", ctx.INDEX, can.ConfIndex(), ctx.ARGS, args.length < 2? args[0]||"": JSON.stringify(args)])
			can.onappend._float(can, chat.MESSAGE)
		})
	},
	"生成链接": function(event, can) { can.onmotion.share(event, can, [], [web.LINK, can.user.copy(event, can, can.onexport.link(can))]) },
	"生成脚本": function(event, can) { var args = can.Input().join(lex.SP), list = [
		"export ctx_dev="+location.origin+"; ctx_temp=$(mktemp); curl -o $ctx_temp -fsSL $ctx_dev;"+" source $ctx_temp cmd "+(can.Conf(ctx.INDEX))+lex.SP+args,
		"ish_sys_dev_run_command "+args, "ish_sys_dev_run_action", "ish_sys_dev_run_source",
	]; can.user.copy(event, can, list[0]) },
	"生成图片": function(event, can) { can.user.toimage(can, can.name) },

	_view: function(can, cb) { var sub = can.sub; cb(sub), sub.onimport.layout(sub) },
	"参数": function(event, can) { can.onaction._view(can, function(sub) { can.onmotion.toggle(can, can._option) }) },
	"操作": function(event, can) { can.onaction._view(can, function(sub) { can.onmotion.toggle(can, can._action) }) },
	"状态": function(event, can) { can.onaction._view(can, function(sub) { can.onmotion.toggle(can, can._status) }) },
	"专注": function(event, can) { can.onaction._view(can, function(sub) { if (!sub.ui) { return }
		sub.ui.project && can.onmotion.hidden(can, sub.ui.project)
		sub.ui.profile && can.onmotion.hidden(can, sub.ui.profile)
		sub.ui.display && can.onmotion.hidden(can, sub.ui.display)
	}) },
	"项目": function(event, can) { can.onaction._view(can, function(sub) { sub.ui && sub.ui.project && can.onmotion.toggle(can, sub.ui.project) }) },
	"预览": function(event, can) { can.onaction._view(can, function(sub) { sub.ui && sub.ui.project && can.onmotion.toggle(can, sub.ui.profile) }) },
	"演示": function(event, can) { can.onaction._view(can, function(sub) { sub.ui && sub.ui.project && can.onmotion.toggle(can, sub.ui.display) }) },
	"插件": function(event, can) {
		can.user.input(event, can, [ctx.INDEX, ctx.ARGS], function(data) {
			var sub = can.sub; sub.onimport.tool(sub, [data], function(sub) { sub.select() })
		})
	},

	"保存参数": function(event, can) { can.search(event, ["River.ondetail.保存参数"]) },
	"清空参数": function(event, can) { can.page.SelectArgs(can, can._option, "", function(target) { return target.value = "" }) },
	"复制数据": function(event, can) { var sub = can.sub; can.user.copy(event, can, sub.onexport.table(sub)||sub.onexport.board(sub)) },
	"下载数据": function(event, can) { var sub = can.sub; can.user.input(event, can, [{name: "filename", value: can.Conf(mdb.NAME)}], function(list) {
		can.user.downloads(can, sub.onexport.table(sub), list[0], nfs.CSV), can.user.downloads(can, sub.onexport.board(sub), list[0], nfs.TXT)
	}) },
	"清空数据": function(event, can) { can.onmotion.clear(can, can._output) },

	"查看文档": function(event, can) { can.requests(event, {action: ice.HELP}), can.onengine.signal(can, chat.ONDEBUGS, can.requestPodCmd(event)) },
	"查看脚本": function(event, can) { can.onappend._float(can, web.CODE_VIMER, can.misc.SplitPath(can, can.sub._path)) },
	"查看源码": function(event, can) { can.requests(event, {action: nfs.SOURCE}), can.onengine.signal(can, chat.ONDEBUGS, can.requestPodCmd(event)) },
	"查看镜像": function(event, can) { can.onappend._float(can, {index: "web.code.compile"}) },
	"查看通知": function(event, can) { can.onappend._float(can, {index: "can.toast"}, [can.ConfIndex()]) },
	"查看视图": function(event, can) { can.onappend._float(can, {index: "can.view", _target: can._fields||can._target}) },
	"查看数据": function(event, can) { can.onappend._float(can, {index: "can.data", _target: can}) },
	"会话存储": function(event, can) { can.onappend._float(can, {index: "can.sessionStorage"}, [can.ConfIndex()]) },
	"本地存储": function(event, can) { can.onappend._float(can, {index: "can.localStorage"}, [can.ConfIndex()]) },
	"查看报文": function(event, can) { var msg = can._msg
		can.onappend._float(can, {title: "msg(报文)", index: ice.CAN_PLUGIN, display: "/plugin/story/json.js"}, [], function(sub) {
			sub.run = function(event, cmds, cb) { var _msg = can.request(event); _msg.result = [JSON.stringify(msg)], cb(_msg) }
		})
	},
	"查看配置": function(event, can) { can.requests(event, {action: ctx.CONFIG}), can.onengine.signal(can, chat.ONDEBUGS, can.requestPodCmd(event)) },
	"查看日志": function(event, can) { var logid = can.Status("log.id"); can.onappend._float(can, web.CODE_XTERM, ["sh", logid, "grep "+logid+" var/log/bench.log | grep -v grep | grep -v '"+logid+" $'"]) },
	"打包页面": function(event, can) { can.onengine.signal(can, "onwebpack", can.request(event)) },
	"删除工具": function(event, can) { can.onaction._close(event, can) },

	refresh: function(event, can) { can.onimport.size(can, can.ConfHeight(), can.ConfWidth(), true, can.Mode()) },
	close: function(event, can) {
		if (can.isCmdMode()) {
			can.user.close()
		} else if (can.isFullMode()) {
			can.onaction["切换全屏"](event, can, "切换全屏", can.sub)
		} else if (can.isFloatMode()) {
			can.onaction["切换浮动"](event, can, "切换浮动", can.sub)
		} else {
			can.onaction._close(event, can), can.onexport.close(can)
		}
	},
	_close: function(event, can) {
		can.onengine.signal(can, "onremove", can.request(event, {query: can.page.getquery(can, can._target)}))
		can.page.Remove(can, can._target)
	},
	clear: function(event, can) { can.onmotion.clear(can, can._output) },
	actions: function(event, can) { can.onmotion.toggle(can, can._action) },
	help: function(event, can) {
		can.onappend._float(can, {index: web.WIKI_WORD}, [can.Conf("_help")])
	},
	full: function(event, can) { can.onaction["切换全屏"](event, can, "切换全屏", can.sub) },
	prev: function(event, can) { can.runAction(event, mdb.PREV, [can.Status(mdb.TOTAL)||0, can.Option(mdb.LIMIT)||can.Action(mdb.LIMIT)||can._msg.Option("cache.limit")||"", can.Option(mdb.OFFEND)||can.Action(mdb.OFFEND)||""], function(msg) { can.onimport._process(can, msg) }) },
	next: function(event, can) { can.runAction(event, mdb.NEXT, [can.Status(mdb.TOTAL)||0, can.Option(mdb.LIMIT)||can.Action(mdb.LIMIT)||can._msg.Option("cache.limit")||"", can.Option(mdb.OFFEND)||can.Action(mdb.OFFEND)||""], function(msg) { can.onimport._process(can, msg) }) },
	upload: function(event, can) { can.user.upload(event, can) },
	keyboard: function(event, can) {
		can.base.isUndefined(can._daemon) && can.ondaemon._list[0] && (can._daemon = can.ondaemon._list.push(can)-1)
		can.request(event, kit.Dict(ctx.INDEX, can._index, ice.MSG_DAEMON, can.core.Keys(can.ondaemon._list[0], can._daemon)))
		can.runAction(event, "keyboard", [], function(msg) { can.user.copy(msg._event, can, msg.Append(mdb.NAME))
			can.user.toast(can, {title: msg.Append(mdb.NAME), duration: -1, content: msg.Append(mdb.TEXT), action: [cli.CLOSE, cli.OPEN]})
		})
	},

	getClipboardData: function(event, can, button) {
		function add(text) { can.runAction(event, button, can.base.Simple(can.base.ParseJSON(text)), function() { can.Update() }) }
		navigator.clipboard? navigator.clipboard.readText().then(add).catch(function(err) { can.misc.Log(err) }):
			can.user.input(event, can, [{type: html.TEXTAREA, name: mdb.TEXT}], function(list) { add(list[0]) })
	},
	getLocation: function(event, can, button) { can.user.agent.getLocation(can, function(data) {
		can.user.input(can.request(event, data), can, [mdb.TYPE, mdb.NAME, mdb.TEXT, aaa.LATITUDE, aaa.LONGITUDE], function(args) {
			can.runAction(event, button, args, function() { can.Update() })
		})
	}) },
	openLocation: function(event, can) { can.user.agent.openLocation(can, can.request(event)) },
	scanQRCode0: function(event, can, button) { can.user.agent.scanQRCode(can) },
	scanQRCode: function(event, can, button) { can.user.agent.scanQRCode(can, function(data) { can.runAction(event, button, can.base.Simple(data), function() { can.Update() }) }) },
	record0: function(event, can, name, cb) { can.user.input(event, can, [{name: nfs.FILE, value: name}], function(list) {
		navigator.mediaDevices.getDisplayMedia({video: {height: window.innerHeight}}).then(function(stream) { var toast
			can.core.Next([3, 2, 1], function(item, next) { toast = can.user.toast(can, item + "s 后开始截图"), can.onmotion.delay(can, next, 1000) }, function() { toast.close()
				cb(stream, function(blobs, ext) { var msg = can.request(event); msg._upload = new File(blobs, list[0]+nfs.PT+ext)
					can.runAction(msg, html.UPLOAD, [], function() { can.user.toastSuccess(can), can.Update() })
					can.core.List(stream.getTracks(), function(item) { item.stop() })
				})
			})
		}).catch(function(err) { can.user.toast(can, err.name + ": " + err.message) })
	}) },
	record1: function(event, can) { can.onaction.record0(event, can, "shot", function(stream, cb) { var height = window.innerHeight
		var video = can.page.Append(can, document.body, [{type: html.VIDEO, height: height}])._target; video.srcObject = stream, video.onloadedmetadata = function() { video.play(), width = video.offsetWidth
			var canvas = can.page.Append(can, document.body, [{type: html.CANVAS, height: height, width: width}])._target; canvas.getContext("2d").drawImage(video, 0, 0, width, height)
			canvas.toBlob(function(blob) { cb([blob], nfs.PNG) })
		}
	}) },
	record2: function(event, can) { can.onaction.record0(event, can, "shot", function(stream, cb) {
		var recorder = new MediaRecorder(stream, {mimeType: html.VIDEO_WEBM}), blobs = []; recorder.ondataavailable = function(res) { blobs.push(res.data) }
		recorder.onstop = function() { cb(blobs, nfs.WEBM) }, recorder.start(1)
	}) },
})
Volcanos(chat.ONEXPORT, {
	_output: function(can, msg) {},
	output: function(can, msg) {}, action: function(can, button, data) {}, record: function(can, value, key, data) {},
	marginTop: function() { return 0 }, marginBottom: function() { return 0 }, outputMargin: function(can) { return 0 },
	actionHeight: function(can) { return can.page.ClassList.has(can, can._target, html.OUTPUT)? 0: html.ACTION_HEIGHT },
	outputHeight: function(can) { var height = can.ConfHeight() - can.onexport.actionHeight(can) - can.onexport.statusHeight(can)
		if (can.user.isMobile) { return height } height -= can.onexport.outputMargin(can)
		can.page.SelectChild(can, can._output, html.TABLE, function(target) { height -= target.offsetHeight })
		return can.base.Max(can.base.Min(height, can.ConfHeight()/2), can.ConfHeight()-2*html.ACTION_HEIGHT, 320)
	},
	statusHeight: function(can) {
		return can.page.ClassList.has(can, can._target, html.OUTPUT) || !can.page.isDisplay(can._status) || (can._target.offsetHeight > 0 && can._status.offsetHeight == 0) ||
			can._status.innerHTML == "" && !can.page.ClassList.has(can, can._target, html.PLUG)? 0: html.STATUS_HEIGHT
	},
	session: function(can, key, value) { if (value) { value = JSON.stringify(value) }
		return can.misc.sessionStorage(can, [can.ConfSpace()||can.misc.Search(can, ice.POD), can.ConfIndex(), key, location.pathname], value)
	},
	title: function(can, title) { if (can.base.isIn(title, web.DESKTOP)) { return }
		var list = []; function push(p) { p && list.indexOf(p) == -1 && list.push(p) }
		push(can.user.trans(can, can.ConfIndex(), can.Conf("help")))
		// push(can.ConfIndex())
		can.core.List(arguments, function(title, index) { index > 0 && push(title) }), push(can.ConfSpace()||can.misc.Search(can, ice.POD))
		can.isCmdMode() && can.user.title(list.join(" "))
	},
	args: function(can) { return can.Option() },
	link: function(can) {
		// if (can.sub && can.sub.onexport.link) { return can.sub.onexport.link(can.sub) }
		var args = can.Option(); args.pod = can.ConfSpace()||can.misc.Search(can, ice.POD), args.cmd = can.ConfIndex()
		can.core.Item(args, function(key, value) { key != ice.POD && !value && delete(args[key]) })
		var hash = can.misc.localStorage(can, [args.pod, args.cmd, "hash"])||""
		hash && (hash = "#"+hash)
		return can.misc.MergePodCmd(can, args, true)+hash
	},
	close: function(can, msg) {},
})
