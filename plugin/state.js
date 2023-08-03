Volcanos(chat.ONIMPORT, {
	_process: function(can, msg) { msg.OptionStatus() && can.onmotion.clear(can, can._status) && can.onappend._status(can, msg.OptionStatus())
		if (can.onimport[msg.OptionProcess()]) { return can.core.CallFunc([can.onimport, msg.OptionProcess()], {can: can, msg: msg, arg: msg.Option("_arg")}), true }
	},
	_location: function(can, msg, arg) { can.user.jumps(arg) },
	_replace: function(can, msg, arg) { location.replace(arg) },
	_history: function(can, msg) { history.back() },
	_confirm: function(can, msg, arg) { can.user.toastConfirm(can, arg, "", function() { can.runAction(can.request({}, msg), "confirm") }) },
	_refresh: function(can, msg, arg) { can.core.Timer(parseInt(arg||"30"), function() { can.Update(can.request({}, {_count: parseInt(msg.Option("_count")||"3")-1})) }) },
	_rewrite: function(can, msg) { var arg = msg._arg; for (var i = 0; i < arg.length; i += 2) { can.Option(arg[i], arg[i+1]), can.Action(arg[i], arg[i+1]) } can.Update() },
	_display: function(can, msg) { can.onappend._output(can, msg, msg.Option(ice.MSG_DISPLAY)) },
	_clear: function(can, msg) { can.onmotion.clear(can) },
	_inner: function(can, msg) { can.onappend.table(can, msg), can.onappend.board(can, msg), can.onmotion.story.auto(can) },
	_field: function(can, msg, cb) { var height = can.ConfHeight(), width = can.ConfWidth(); can.page.SelectChild(can, can._output, can.page.Keys(html.TABLE, html.DIV_CODE), function(target) { height -= target.offsetHeight })
		height = can.base.Min(msg.Option(html.HEIGHT)||height, can.isCmdMode()? can.ConfHeight()/2: 320), width = msg.Option(html.WIDTH)||can.ConfWidth()
		msg.Table(function(item) { can.onappend._plugin(can, item, {index: item.index, args: can.base.Obj(item.args||item.arg, []), height: height, width: width}, function(sub, meta) {
			sub.Conf(can.base.Obj(item.conf)); if (sub.isSimpleMode()) { sub.ConfHeight(can.ConfHeight()/2)
				var res = can.request(); res.Echo(sub.Conf(ice.MSG_RESULT)), can.onappend._output(sub, res, sub.Conf(ctx.DISPLAY)); return
			}
			if (can.page.ClassList.has(can, sub._target, html.FLOAT)) {
				height = window.innerHeight/2, width = window.innerWidth/2
				can.onmotion.move(can, sub._target, {left: window.innerWidth-width, top: window.innerHeight-height})
			}
			sub.run = function(event, cmds, cb) { sub.onimport.size(sub, height, width, true)
				sub.onexport.output = function() { sub.onimport.size(sub, height, width, true)
					// can.page.SelectChild(can, can._output, html.TABLE, function(target) { can.page.style(can, target, html.MAX_HEIGHT, height, html.DISPLAY, html.BLOCK) })
				}, can.run(event, (!msg.Option("_index") || msg.Option("_index") == can._index || can._index.indexOf("can.") == 0? msg[ice.MSG_PREFIX]||[]: [ice.RUN, msg.Option("_index")]).concat(cmds), cb, true)
			}
			sub._target.onclick = function() {
				can.page.SelectChild(can, can._output, html.FIELDSET, function(target) { can.page.style(can, target, "z-index", "9") })
				can.page.style(can, sub._target, "z-index", "10")
			}
			can.base.isFunc(cb) && cb(sub)
		}) })
	},
	_float: function(can, msg) { var arg = msg._arg; msg.Table(function(item) { can.onappend._plugin(can, item, {index: item.index, args: arg? arg.slice(1): [], mode: chat.FLOAT}, function(sub, meta) {
		sub.run = function(event, cmds, cb) { can.runAction(can.request(event, {path: msg.Option(nfs.PATH), text: msg.Option(mdb.TEXT)}), [ice.RUN, arg[0]], cmds, cb) }
		can.getActionSize(function(left, top, width, height) { left = left||0, top = !can.Mode()? 120: 0, can.onmotion.move(can, sub._target, {left: left, top: top})
			sub.onimport.size(sub, can.base.Max(height, can.page.height())-top-(can.user.isMobile&&!can.user.isLandscape()? 2*html.ACTION_HEIGHT: 0), width, true)
		})
	}, document.body) }) },
	_hold: function(can, msg, arg) { can.user.toast(can, arg||ice.SUCCESS) },
	_back: function(can) { can._history.pop(); for (var index = 0, his = can._history.pop(); his; his = can._history.pop()) { if (his[0] == ctx.ACTION) { continue }
		can.page.SelectArgs(can, can._option, "", function(item) { item.value = his[index++]||""
			can.page.Select(can, item.parentNode, "span.value", function(target) { target.innerText = target.value||"" })
		})
		can.page.SelectArgs(can, can._action, "", function(item) { item.value = his[index++]||"" })
		can.Update(); break
	} !his && can.Update() },
	_rich: function(can, msg) { if (can.page.Select(can, can._output, [html.TABLE_CONTENT, html.TBODY], function(table) {
		var head = can.page.Select(can, can._output, [html.TABLE_CONTENT, html.TH], function(th) { return th.innerText })
		return can.page.Append(can, table, msg.Table(function(value) { return {row: can.core.List(head, function(key) { return value[key] })} }))
	}).length == 0) { can.onappend.table(can, msg) } },
	_grow: function(can, msg, arg) { var sub = can.core.Value(can, chat._OUTPUTS_CURRENT)
		if (sub && sub.onimport && sub.onimport.grow) { return sub.onimport.grow(sub, msg, arg) }
		arg = can.page.Color(arg); if (can.page.Select(can, can._output, html.DIV_CODE, function(div) {
			return can.page.style(can, div, html.MAX_HEIGHT, 400), can.page.Append(can, div, [{text: arg}]), div.scrollBy(0, 10000), true
		}).length == 0) { can.onappend.board(can, arg) }
	},
	_open: function(can, msg, arg) { return can.Update(), can.user.open(arg) },
	_close: function(can, msg) { return can.user.close() || history.back() },
	size: function(can, height, width, auto, mode) { height -= can.onexport.actionHeight(can)+can.onexport.statusHeight(can)
		auto? (can.page.style(can, can._output, html.HEIGHT, "", html.WIDTH, "", html.MAX_HEIGHT, height? can.ConfHeight(height): "", html.MAX_WIDTH, can.ConfWidth(width)),
				can.page.style(can, can._target, html.HEIGHT, "", html.WIDTH, "")):
			(can.page.style(can, can._output, html.HEIGHT, can.ConfHeight(height), html.WIDTH, can.ConfWidth(width), html.MAX_HEIGHT, "", html.MAX_WIDTH, ""),
				can.page.style(can, can._target, html.WIDTH, can.ConfWidth(width)))
		var sub = can.core.Value(can, chat._OUTPUTS_CURRENT); if (!sub) { return can.Mode(mode), auto } sub.ConfHeight(can.ConfHeight()), sub.ConfWidth(can.ConfWidth())
		if (mode) { sub.Mode(can.Mode(mode)), sub.onlayout[mode](sub, height, width) } else { sub.onlayout._init(sub, height, width) } return auto
	},
	change: function(event, can, name, value, cb) { return can.page.SelectArgs(can, can._option, "", function(input) { if (input.name != name || value == input.value) { return }
		can.page.Select(can, input.parentNode, "span.value", function(target) { target.innerText = value })
		return input.value = value, can.Update(event, can.Input([], true), cb), input
	})[0] },
})
Volcanos(chat.ONACTION, {list: [
		"刷新界面", "刷新数据", "切换浮动", "切换全屏", "远程控制", "共享工具", "打开链接", "生成链接", "生成脚本", "生成图片",
		["视图", "操作", "专注", "项目", "预览", "演示", "状态"],
		["其它", "扩展参数", "保存参数", "清空参数", "复制数据", "下载数据", "清空数据", "删除工具"],
		["调试", "查看文档", "查看脚本", "查看源码", "查看配置", "查看日志", "打包页面"],
	],
	"参数": function(event, can) { can.onmotion.toggle(can, can._option) },
	"操作": function(event, can) { can.onmotion.toggle(can, can._action) },
	"专注": function(event, can) { can.onaction._view(event, can, function(sub) { if (!sub.ui) { return }
		sub.ui.project && can.onmotion.hidden(can, sub.ui.project)
		sub.ui.profile && can.onmotion.hidden(can, sub.ui.profile)
		sub.ui.display && can.onmotion.hidden(can, sub.ui.display)
	}) },
	"项目": function(event, can) { can.onaction._view(event, can, function(sub) { sub.ui && sub.ui.project && can.onmotion.toggle(can, sub.ui.project) }) },
	"预览": function(event, can) { can.onaction._view(event, can, function(sub) { sub.ui && sub.ui.project && can.onmotion.toggle(can, sub.ui.profile) }) },
	"演示": function(event, can) { can.onaction._view(event, can, function(sub) { sub.ui && sub.ui.project && can.onmotion.toggle(can, sub.ui.display) }) },
	"状态": function(event, can) { can.onaction._view(event, can, function(sub) { can.onmotion.toggle(can, can._status) }) },
	_view: function(event, can, cb) { var sub = can.core.Value(can, chat._OUTPUTS_CURRENT); cb(sub), sub.onimport.layout(sub) },
	_engine: function(event, can, button) { can.Update(event, [ctx.ACTION, button].concat(can.Input())) },
	_switch: function(can, sub, mode, save, load) {
		if (can.page.ClassList.neg(can, can._target, mode)) {
			(can._mode_list = can._mode_list||[]).push(kit.Dict(
				html.HEIGHT, can.ConfHeight(), html.WIDTH, can.ConfWidth(), ice.MODE, can.Mode()||"",
				html.ACTION, can.page.isDisplay(can._action), html.STATUS, can.page.isDisplay(can._status),
				html.OUTPUT, can.base.Copy({}, can._output.style, html.HEIGHT, html.WIDTH, html.MAX_HEIGHT, html.MAX_WIDTH),
				ctx.STYLE, can.base.Copy({}, can._target.style, html.LEFT, html.TOP, html.RIGHT, html.BOTTOM), save(),
			)), can.onimport.size(can, can.ConfHeight()+can.onexport.actionHeight(can)+can.onexport.statusHeight(can), can.ConfWidth(), false, mode)
		} else { var back = (can._mode_list = can._mode_list||[]).pop(); if (!back) { return }
			can.onmotion.toggle(can, can._action, back.action), can.onmotion.toggle(can, can._status, back.status)
			can.onimport.size(can, back.height+can.onexport.actionHeight(can)+can.onexport.statusHeight(can), back.width, false, mode)
			can.page.style(can, can._target, html.LEFT, back.style.left, html.TOP, back.style.top)
			can.base.isFunc(load) && load(back)
		}
	},
	"刷新界面": function(event, can) { var sub = can._outputs[0]; sub.onlayout._init(sub), can.user.toastSuccess(can) },
	"刷新数据": function(event, can) { can.Update(event, can.Input()), can.user.toastSuccess(can) },
	"切换浮动": function(event, can, button, sub) { can.onaction._switch(can, sub, chat.FLOAT, function() { can.onmotion.hidden(can, can._action), can.onmotion.hidden(can, can._status)
		can.getActionSize(function(left, top) {
			can.onmotion.move(can, can._target, {left: (left||0)+(can.user.isMobile? 0: html.PLUGIN_MARGIN), top: can.page.height()/2-html.PLUGIN_MARGIN-html.ACTION_HEIGHT})
			can.onmotion.resize(can, can._target, function(height, width) { can.onimport.size(can, height, width) }, top)
		})
		can.ConfHeight(can.page.height()/2-can.onexport.actionHeight(can)-can.onexport.statusHeight(can)), can.ConfWidth(can.page.width()/(can.user.isMobile? 1: 2))
	}) },
	"切换全屏": function(event, can, button, sub) { can.onaction._switch(can, sub, chat.FULL, function() { can.page.style(can, can._target, html.LEFT, "", html.TOP, can.onexport.marginTop(), html.BOTTOM, "")
		can.ConfHeight(can.page.height()-can.onexport.marginTop()-can.onexport.actionHeight(can)-can.onexport.statusHeight(can)-can.onexport.marginBottom(can)), can.ConfWidth(can.page.width())
	}) },
	"远程控制": function(event, can) { can.onaction.keyboard(event, can) },
	"共享工具": function(event, can) { var meta = can.Conf(); can.onmotion.share(event, can, [
		{name: chat.TITLE, value: meta.name}, {name: chat.THEME, values: [can.getHeader(chat.THEME), html.DARK, html.LIGHT, cli.WHITE, cli.BLACK]},
	], [mdb.NAME, meta.index, mdb.TEXT, JSON.stringify(can.Input())]) },
	"打开链接": function(event, can) { can.user.opens(can.onexport.link(can)) },
	"生成链接": function(event, can) { can.onmotion.share(event, can, [], [mdb.LINK, can.user.copy(event, can, can.onexport.link(can))]) },
	"生成脚本": function(event, can) { var conf = can.Conf(), args = can.Input().join(lex.SP), list = [
		"export ctx_dev="+location.origin+"; ctx_temp=$(mktemp); curl -o $ctx_temp -fsSL $ctx_dev;"+" source $ctx_temp cmd "+(conf.index||"")+lex.SP+args,
		"ish_sys_dev_run_command "+args, "ish_sys_dev_run_action", "ish_sys_dev_run_source",
	]; can.user.copy(event, can, list[0]) },
	"生成图片": function(event, can) { can.user.toimage(can, can._name) },

	"扩展参数": function(event, can) { can.onmotion.toggle(can, can._action) },
	"保存参数": function(event, can) { can.search(event, ["River.ondetail.保存参数"]) },
	"清空参数": function(event, can) { can.page.SelectArgs(can, can._option, "", function(item) { return item.value = "" }) },
	"复制数据": function(event, can) { var sub = can._outputs[0]; can.user.copy(event, can, sub.onexport.table(sub)||sub.onexport.board(sub)) },
	"下载数据": function(event, can) { var sub = can._outputs[0]; can.user.input(event, can, [{name: "filename", value: can.Conf(mdb.NAME)}], function(list) {
		can.user.downloads(can, sub.onexport.table(sub), list[0], nfs.CSV), can.user.downloads(can, sub.onexport.board(sub), list[0], nfs.TXT)
	}) },
	"清空数据": function(event, can) { can.onmotion.clear(can, can._output) },
	"删除工具": function(event, can) { can.onaction._close(event, can) },

	"查看文档": function(event, can) { can.onengine.signal(can, "ondebugs", can.request(event, {action: ice.HELP, index: can.Conf(ctx.INDEX)})) },
	"查看脚本": function(event, can) { can.onengine.signal(can, "ondebugs", can.request(event, {action: nfs.SCRIPT, index: can.Conf(ctx.INDEX)})) },
	"查看源码": function(event, can) { can.onengine.signal(can, "ondebugs", can.request(event, {action: nfs.SOURCE, index: can.Conf(ctx.INDEX)})) },
	"查看配置": function(event, can) { can.onengine.signal(can, "ondebugs", can.request(event, {action: ctx.CONFIG, index: can.Conf(ctx.INDEX)})) },
	"查看日志": function(event, can) { var sub = can._outputs[0]; sub.onimport.tool(sub, ["can.debug"], function(sub) { sub.select() }) },
	"打包页面": function(event, can) { can.onengine.signal(can, "onwebpack", can.request(event)) },

	refresh: function(event, can) { var sub = can.core.Value(can, chat._OUTPUTS_CURRENT); if (sub) { sub.ConfHeight(can.ConfHeight()), sub.ConfWidth(can.ConfWidth()), sub.onimport.layout(sub) } },
	close: function(event, can) {
		if (can.isCmdMode()) {
			can.user.close()
		} else if (can.isFullMode()) {
			can.onaction["切换全屏"](event, can, "切换全屏", can.core.Value(can, chat._OUTPUTS_CURRENT))
		} else if (can.isFloatMode()) {
			can.onaction["切换浮动"](event, can, "切换浮动", can.core.Value(can, chat._OUTPUTS_CURRENT))
		} else {
			can.onaction._close(event, can)
		}
	},
	_close: function(event, can) { can.page.Remove(can, can._target) },
	clear: function(event, can) { can.onmotion.clear(can, can._output) },
	actions: function(event, can) { can.onmotion.toggle(can, can._action) },
	full: function(event, can) { can.onaction["切换全屏"](event, can, "切换全屏", can.core.Value(can, chat._OUTPUTS_CURRENT)) },
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
		can.user.input(can.request(event, data), can, [mdb.TYPE, mdb.NAME, mdb.TEXT, "latitude", "longitude"], function(args) {
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
			canvas.toBlob((blob) => { cb([blob], nfs.PNG) })
		}
	}) },
	record2: function(event, can) { can.onaction.record0(event, can, "shot", function(stream, cb) {
		var recorder = new MediaRecorder(stream, {mimeType: web.VIDEO_WEBM}), blobs = []; recorder.ondataavailable = function(res) { blobs.push(res.data) }
		recorder.onstop = function() { cb(blobs, nfs.WEBM) }, recorder.start(1)
	}) },
})
Volcanos(chat.ONEXPORT, {
	args: function(can) { return can.page.SelectArgs(can, can._option, "", function(target) { return target.value }) },
	output: function(can, msg) {}, action: function(can, button, line) {}, record: function(can, value, key, data) {},
	marginTop: function() { return 0 }, marginBottom: function() { return 0 },
	actionHeight: function(can) { return can.page.ClassList.has(can, can._target, html.OUTPUT)? 0: html.ACTION_HEIGHT },
	statusHeight: function(can) { return can.page.ClassList.has(can, can._target, html.OUTPUT) || !can.page.isDisplay(can._status) || can._status.innerHTML == "" || (can._target.offsetHeight > 0 && can._status.offsetHeight == 0)? 0: html.ACTION_HEIGHT },
	title: function(can, title) { can.isCmdMode() && can.user.title(title) },
	link: function(can) { var meta = can.Conf(), args = can.Option(); can.misc.Search(can, log.DEBUG) == ice.TRUE && (args[log.DEBUG] = ice.TRUE)
		args.pod = meta._space||meta.space||meta.pod, args.cmd = meta.index||can.core.Keys(meta.ctx, meta.cmd)
		return can.misc.MergePodCmd(can, args, true)
	},
})
