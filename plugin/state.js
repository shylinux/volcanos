Volcanos(chat.ONIMPORT, {
	_process: function(can, msg) { msg.OptionStatus() && can.onmotion.clear(can, can._status) && can.onappend._status(can, msg.OptionStatus())
		if (can.onimport[msg.OptionProcess()]) { return can.core.CallFunc([can.onimport, msg.OptionProcess()], {can: can, sub: can.sub, msg: msg, arg: msg.Option("_arg")}), true }
	},
	_location: function(can, msg, arg) { can.user.jumps(arg) },
	_replace: function(can, msg, arg) { location.replace(arg) },
	_history: function(can, msg) { history.length == 1? can.user.close(): history.back() },
	_confirm: function(can, msg, arg) { can.user.toastConfirm(can, arg, "", function() { can.runAction(can.request({}, msg), "confirm") }) },
	_refresh: function(can, msg, arg) { can.core.Timer(parseInt(arg||"30"), function() { can.Update(can.request({}, {_count: parseInt(msg.Option("_count")||"3")-1})) }) },
	_rewrite: function(can, msg) { var arg = msg._arg; for (var i = 0; i < arg.length; i += 2) { can.Option(arg[i], arg[i+1]), can.Action(arg[i], arg[i+1]) } can.Update() },
	_display: function(can, msg) { can.onappend._output(can, msg, msg.Option(ice.MSG_DISPLAY)) },
	_clear: function(can, msg) { can.onmotion.clear(can) },
	_inner: function(can, sub, msg) { can.onappend.table(sub, msg), can.onappend.board(sub, msg), can.onmotion.story.auto(sub) },
	_field: function(can, msg, cb) { var height = can.onexport.outputHeight(can), width = can.ConfWidth()
		msg.Table(function(item) { can.onappend._plugin(can, item, {index: item.index, args: can.base.Obj(item.args||item.arg, []), height: height, width: width}, function(sub) {
			can.onmotion.delay(can, function() { can.onmotion.scrollIntoView(can, sub._target) }, 300)
			sub.run = function(event, cmds, cb) { var index = msg.Option(ice.MSG_INDEX)
				can.run(event, (!index || index == can._index || index.indexOf("can.") == 0? msg[ice.MSG_PREFIX]||[]: [ctx.RUN, index]).concat(cmds), cb, true)
			}, can.page.ClassList.has(can, sub._target, html.FLOAT)? can.onmotion.float(sub): sub.onimport.size(sub, height, width, true), cb && cb(sub)
		}) })
	},
	_float: function(can, msg) { can.onimport._field(can, msg, function(sub) { can.onmotion.float(sub) }) },
	_hold: function(can, msg, arg) { can.user.toast(can, arg||ice.SUCCESS) },
	_back: function(can) { can._history.pop(); for (var i = 0, his = can._history.pop(); his; his = can._history.pop()) { if (his[0] == ctx.ACTION) { continue }
		can.page.SelectArgs(can, can._option, "", function(target) { target.value = his[i++]||"", can.page.Select(can, target.parentNode, "span.value", function(target) { target.innerText = target.value||"" }) })
		can.page.SelectArgs(can, can._action, "", function(target) { target.value = his[i++]||"" }); break
	} can.Update() },
	_rich: function(can, msg) { if (can.page.Select(can, can._output, [html.TABLE_CONTENT, html.TBODY], function(table) {
		var head = can.page.Select(can, can._output, [html.TABLE_CONTENT, html.TH], function(th) { return th.innerText })
		return can.page.Append(can, table, msg.Table(function(value) { return {row: can.core.List(head, function(key) { return value[key] })} }))
	}).length == 0) { can.onappend.table(can, msg) } },
	_grow: function(can, msg, arg) { var sub = can.sub
		if (sub && sub.onimport && sub.onimport.grow) { return sub.onimport.grow(sub, msg, arg) }
		arg = can.page.Color(arg); if (can.page.SelectOne(can, can._output, html.DIV_CODE, function(div) {
			return can.page.style(can, div, html.MAX_HEIGHT, can.onexport.outputHeight(can)),
				can.page.Append(can, div, [{text: arg}]), can._output.scrollTop = div.offsetTop, div.scrollBy(0, 10000), true
		}).length == 0) { can.onappend.board(can, arg) }
	},
	_open: function(can, msg, arg) { can.user.opens(arg), can.Update() },
	_close: function(can, msg) { can.user.close() || history.back() },
	change: function(event, can, name, value, cb) { return can.page.SelectArgs(can, can._option, "", function(input) { if (input.name != name || value == input.value) { return }
		can.page.Select(can, input.parentNode, "span.value", function(target) { target.innerText = value })
		return input.value = value, can.Update(event, can.Input([], true), cb), input
	})[0] },
	_size: function(can, height, width, auto, mode) {},
	size: function(can, height, width, auto, mode) {
		can.Conf("_auto", auto), can.Mode(mode), can.ConfHeight(height), can.ConfWidth(width), height -= can.onexport.actionHeight(can)+can.onexport.statusHeight(can)
		auto || auto == undefined? (can.page.style(can, can._output, html.HEIGHT, "", html.WIDTH, "", html.MAX_HEIGHT, height, html.MAX_WIDTH, width), can.page.style(can, can._target, html.HEIGHT, "", html.WIDTH, "")):
			(can.page.style(can, can._output, html.HEIGHT, height, html.WIDTH, width, html.MAX_HEIGHT, "", html.MAX_WIDTH, ""), can.page.style(can, can._target, html.WIDTH, width))
		var sub = can.sub; if (!sub) { return auto } sub.Mode(mode), sub.ConfHeight(height), sub.ConfWidth(width)
		can.onimport._size(can)
		mode? sub.onlayout[mode](sub, height, width): sub.onlayout._init(sub, height, width); return auto
	},
	display_size: function(can, sub) { var border = 1
		can.page.style(can, sub._output, html.MAX_HEIGHT, "")
		var _height = can.base.Max(sub._target.offsetHeight+border, can.ConfHeight()/2)
		sub.onimport.size(sub, _height-border, can.ConfWidth()-(can.ui && can.ui.project? can.ui.project.offsetWidth: 0), true)
	},
})
Volcanos(chat.ONACTION, {list: [
		"刷新数据", "刷新界面", "切换浮动", "切换全屏",
		// "远程控制", "共享工具",
		"共享工具", "打开链接", "生成链接",
		"生成脚本",
		// "生成图片",
		["视图", "参数", "操作", "状态", "专注", "项目", "预览", "演示"],
		["数据", "保存参数", "清空参数", "复制数据", "下载数据", "清空数据", "添加工具"],
		["调试", "查看文档", "查看脚本", "查看源码", "查看配置", "删除工具"],
		// ["调试", "打包页面", "查看文档", "查看脚本", "查看源码", "查看配置", "查看日志", "添加工具"],
	],
	_engine: function(event, can, button) { can.Update(event, [ctx.ACTION, button].concat(can.Input())) },
	_switch: function(can, sub, mode, save, load) {
		if (can.page.ClassList.neg(can, can._target, mode)) {
			(can._mode_list = can._mode_list||[]).push(kit.Dict(
				html.HEIGHT, can.ConfHeight(), html.WIDTH, can.ConfWidth(), ice.MODE, can.Mode()||"",
				html.ACTION, can.page.isDisplay(can._action), html.STATUS, can.page.isDisplay(can._status),
				html.OUTPUT, can.base.Copy({}, can._output.style, html.HEIGHT, html.WIDTH, html.MAX_HEIGHT, html.MAX_WIDTH),
				ctx.STYLE, can.base.Copy({}, can._target.style, html.LEFT, html.TOP, html.RIGHT, html.BOTTOM), save(),
			)), can.onimport.size(can, can.ConfHeight(), can.ConfWidth(), false, mode)
		} else { var back = (can._mode_list = can._mode_list||[]).pop(); if (!back) { return }
			can.onmotion.toggle(can, can._action, back.action), can.onmotion.toggle(can, can._status, back.status)
			can.onimport.size(can, back.height, back.width, false, mode), can.page.style(can, can._target, back.style), load && load(back)
		}
	},
	"刷新数据": function(event, can) { can.Update(event, can.Input()), can.user.toastSuccess(can) },
	"刷新界面": function(event, can) { var sub = can.sub; sub.onlayout._init(sub, sub.ConfHeight(), sub.ConfWidth()), can.user.toastSuccess(can) },
	"切换浮动": function(event, can, button, sub) { can.onaction._switch(can, sub, chat.FLOAT, function() { can.onmotion.hidden(can, can._action), can.onmotion.hidden(can, can._status)
		can.onmotion.float(can), can.onmotion.resize(can, can._target, function(height, width) { can.onimport.size(can, height, width) })
	}) },
	"切换全屏": function(event, can, button, sub) { can.onaction._switch(can, sub, chat.FULL, function() { can.page.style(can, can._target, html.LEFT, "", html.TOP, can.onexport.marginTop(), html.BOTTOM, "")
		can.ConfHeight(can.page.height()-can.onexport.marginTop()-can.onexport.marginBottom(can)), can.ConfWidth(can.page.width())
	}) },
	"远程控制": function(event, can) { can.onaction.keyboard(event, can) },
	"共享工具": function(event, can) { var meta = can.Conf(); can.onmotion.share(event, can, [], [mdb.NAME, meta.index, mdb.TEXT, JSON.stringify(can.Input())]) },
	"打开链接": function(event, can) { can.user.open(can.onexport.link(can)) },
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

	"保存参数": function(event, can) { can.search(event, ["River.ondetail.保存参数"]) },
	"清空参数": function(event, can) { can.page.SelectArgs(can, can._option, "", function(target) { return target.value = "" }) },
	"复制数据": function(event, can) { var sub = can.sub; can.user.copy(event, can, sub.onexport.table(sub)||sub.onexport.board(sub)) },
	"下载数据": function(event, can) { var sub = can.sub; can.user.input(event, can, [{name: "filename", value: can.Conf(mdb.NAME)}], function(list) {
		can.user.downloads(can, sub.onexport.table(sub), list[0], nfs.CSV), can.user.downloads(can, sub.onexport.board(sub), list[0], nfs.TXT)
	}) },
	"清空数据": function(event, can) { can.onmotion.clear(can, can._output) },
	"添加工具": function(event, can) {
		can.user.input(event, can, [ctx.INDEX, ctx.ARGS], function(data) {
			var sub = can.sub; sub.onimport.tool(sub, [data], function(sub) { sub.select() })
		})
	},

	"打包页面": function(event, can) { can.onengine.signal(can, "onwebpack", can.request(event)) },
	"查看文档": function(event, can) { can.requests(event, {action: ice.HELP}), can.onengine.signal(can, "ondebugs", can.requestPodCmd(event)) },
	"查看脚本": function(event, can) { can.requests(event, {action: nfs.SCRIPT}), can.onengine.signal(can, "ondebugs", can.requestPodCmd(event)) },
	"查看源码": function(event, can) { can.requests(event, {action: nfs.SOURCE}), can.onengine.signal(can, "ondebugs", can.requestPodCmd(event)) },
	"查看配置": function(event, can) { can.requests(event, {action: ctx.CONFIG}), can.onengine.signal(can, "ondebugs", can.requestPodCmd(event)) },
	"查看日志": function(event, can) { var sub = can.sub; sub.onimport.tool(sub, ["can.debug"], function(sub) { sub.select() }) },
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
	}, _close: function(event, can) { can.page.Remove(can, can._target) },
	clear: function(event, can) { can.onmotion.clear(can, can._output) },
	actions: function(event, can) { can.onmotion.toggle(can, can._action) },
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
			canvas.toBlob((blob) => { cb([blob], nfs.PNG) })
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
	title: function(can, title) { can.isCmdMode() && can.user.title(title) },
	marginTop: function() { return 0 }, marginBottom: function() { return 0 },
	actionHeight: function(can) { return can.page.ClassList.has(can, can._target, html.OUTPUT)? 0: html.ACTION_HEIGHT },
	outputHeight: function(can) { var height = can.sub.ConfHeight() - can.onexport.outputMargin(can)
		if (can.user.isMobile) { return can.ConfHeight() - can.onexport.actionHeight(can) - can.onexport.statusHeight(can) }
		can.page.SelectChild(can, can._output, html.TABLE, function(target) { height -= target.offsetHeight })
		return can.base.Min(height, can.sub.ConfHeight()/2)
	},
	outputMargin: function(can) { return 0 },
	statusHeight: function(can) { return can.page.ClassList.has(can, can._target, html.OUTPUT) || !can.page.isDisplay(can._status) || can._status.innerHTML == "" || (can._target.offsetHeight > 0 && can._status.offsetHeight == 0)? 0: html.ACTION_HEIGHT },
	link: function(can) { var args = can.Option(); args.pod = can.ConfSpace(), args.cmd = can.ConfIndex(); return can.misc.MergePodCmd(can, args, true) },
	args: function(can) { return can.Option() },
	close: function(can, msg) {},
})
