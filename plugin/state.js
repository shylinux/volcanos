Volcanos(chat.ONIMPORT, {help: "导入数据", _process: function(can, msg) {
		msg.OptionStatus() && can.onmotion.clear(can, can._status) && can.onappend._status(can, msg.OptionStatus())
		return can.core.CallFunc([can.onimport, msg.OptionProcess()], {can: can, msg: msg})
	},

	_location: function(can, msg, _arg) { can.user.jumps(_arg); return true },
	_replace: function(can, msg, _arg) { location.replace(_arg); return true },
	_history: function(can, msg) { history.back(); return true },
	_confirm: function(can, msg, _arg) { can.user.confirm(_arg) && can.runAction(can.request({}, msg), "confirm"); return true },
	_refresh: function(can, msg) {
		can.core.Timer(parseInt(msg.Option("_delay")||"500"), function() {
			can.Update(can.request({}, {_count: parseInt(msg.Option("_count"))-1}))
		})
		return true
	},
	_rewrite: function(can, msg) {
		for (var i = 0; i < msg._arg.length; i += 2) {
			can.Option(msg._arg[i], msg._arg[i+1]), can.Action(msg._arg[i], msg._arg[i+1])
		}
		return can.Update()
	},
	_display: function(can, msg) {
		return can.onappend._output(can, msg, msg.Option(ice.MSG_DISPLAY)), true
	},
	_inner: function(can, msg) {
		can.onappend.table(can, msg), can.onappend.board(can, msg), can.onmotion.story.auto(can)
		can.page.style(can, can._output, html.DISPLAY, html.BLOCK)
		return true
	},
	_field: function(can, msg) { var opts = {}
		can.page.Select(can, can._option, html.INPUT_ARGS, function(target) {
			var value = msg.Option(target.name); target.name && value && (opts[target.name] = value)
		})
		msg.Table(function(item) { can.onappend._plugin(can, item, {type: chat.STORY, index: item.index, args: can.base.Obj(item[ice.ARG], [])}, function(sub, meta) {
			sub.Conf(can.base.Obj(item.conf)); if (sub.isSimpleMode()) { (function() { sub.ConfHeight(can.ConfHeight()/2)
				var msg = can.request(); msg.Echo(sub.Conf(ice.MSG_RESULT))
				can.onappend._output(sub, msg, sub.Conf("feature.display"))
			})(); return }

			var opt = can.base.Obj(item[ice.OPT], [])
			sub.ConfHeight(can.ConfHeight()), sub.ConfWidth(can.ConfWidth()-4*html.PLUGIN_MARGIN)
			sub.run = function(event, cmds, cb) {
				var res = can.request(event, can.Option(), opts, {pid: msg.Option("pid")})
				for (var i = 0; i < opt.length; i += 2) { res.Option(opt[i], opt[i+1]) }
				can.run(event, (msg[ice.MSG_PREFIX]||[]).concat(cmds), cb, true)
			}
		}) })
		return true
	},
	_float: function(can, msg) { var _arg = msg._arg
		msg.Table(function(item) { can.onappend._plugin(can, item, {type: chat.FLOAT, index: item.index, args: _arg.slice(1), mode: chat.FLOAT}, function(sub, meta) {
			sub.run = function(event, cmds, cb) { can.runAction(can.request(event, {path: msg.Option(nfs.PATH), text: msg.Option(mdb.TEXT)}), [ice.RUN, msg._arg[0]], cmds, cb) }
			sub.Mode(chat.FLOAT), can.getActionSize(function(left, top, width, height) { left = left||0
				var top = can.Mode() == undefined? 120: 0; if (can.user.isMobile) { top = can.user.isLandscape()? 0: 48 }
				sub.ConfHeight(height-top-2*html.ACTION_HEIGHT-(can.user.isMobile&&!can.user.isLandscape()? 2*html.ACTION_HEIGHT: 0)), sub.ConfWidth(width)
				can.page.style(can, sub._output, html.MAX_HEIGHT, window.innerHeight - top, html.OVERFLOW, ice.AUTO)
				can.onmotion.move(can, sub._target, {position: html.FIXED, left: left, top: top})
			})
		}, document.body) })
		return true
	},

	_hold: function(can, msg, _arg) { return _arg && can.user.toast(can, _arg), true },
	_back: function(can) { can._history.pop()
		for (var index = 0, his = can._history.pop(); his; his = can._history.pop()) { if (his[0] == ctx.ACTION) { continue }
			can.page.SelectArgs(can, can._option, "", function(item) { item.value = his[index++]||"" })
			can.page.SelectArgs(can, can._action, "", function(item) { item.value = his[index++]||"" })
			can.Update(); break
		} !his && can.Update()
		return true
	},
	_rich: function(can, msg, _arg) {
		if (can.page.Select(can, can._output, [html.TABLE_CONTENT, html.TBODY], function(table) {
			var head = can.page.Select(can, can._output, [html.TABLE_CONTENT, html.TH], function(th) { return th.innerText })
			can.page.Append(can, table, msg.Table(function(value) { return {row: can.core.List(head, function(key) { return value[key] })} }))
			return true
		}).length == 0) { can.onappend.table(can, msg) }
		return true
	},
	_grow: function(can, msg, _arg) {
		sub = can.core.Value(can, chat._OUTPUTS_CURRENT)
		if (sub && sub.onimport && sub.onimport.grow) {
			sub.onimport.grow(sub, msg, _arg)
			return true
		}
		if (can.page.Select(can, can._output, html.DIV_CODE, function(div) {
			can.page.style(can, div, html.MAX_HEIGHT, 400)
			can.page.Append(can, div, [{text: _arg}])
			div.scrollBy(0, 10000)
			return true
		}).length == 0) { can.onappend.board(can, _arg) }
		return true
	},
	_open: function(can, msg, _arg) {
		return can.user.open(_arg), can.Update()
	},
})
Volcanos(chat.ONACTION, {help: "交互操作", list: [
		"刷新数据", "切换全屏", "共享工具", "打开链接", "生成链接", "生成脚本", "生成图片", [
			"其它", "刷新页面", "保存参数", "清空参数", "扩展参数", "复制数据", "下载数据", "清空数据",
			"查看文档", "查看脚本", "查看源码", "查看配置", "删除配置", "删除工具",
		],
	],
	_engine: function(event, can, button) { can.Update(event, [ctx.ACTION, button].concat(can.Input([], true))) },

	"刷新数据": function(event, can) { can.Update({}, can.Input([], true)) },
	"切换全屏": function(event, can) { var sub = can.core.Value(can, chat._OUTPUTS_CURRENT)
		if (can.page.ClassList.neg(can, can._target, "full")) {
			var height = window.innerHeight-(can._status.innerText? 2: 1)*html.ACTION_HEIGHT; can.user.isMobile && (height -= 2*html.ACTION_HEIGHT)
			can._mode_bak = can.Mode(), can._height_bak = sub.ConfHeight(), can._width_bak = sub.ConfWidth()
			sub.Mode("full"), can.Mode("full"), can.ConfHeight(height), can.ConfWidth(window.innerWidth)
			can.page.style(can, can._output, html.HEIGHT, sub.ConfHeight(height), html.MIN_WIDTH, sub.ConfWidth(window.innerWidth))
		} else {
			can.Mode(can._mode_bak||""), can.ConfHeight(can._height_bak), can.ConfWidth(can._width_bak)
			sub.Mode(can._mode_bak||""), sub.ConfHeight(can._height_bak), sub.ConfWidth(can._width_bak)
			can.page.style(can, can._output, html.HEIGHT, "", html.MIN_WIDTH, "")
		}
		can.core.CallFunc([sub, chat.ONIMPORT, html.LAYOUT], {can: sub})
	},
	"共享工具": function(event, can) { var meta = can.Conf()
		can.onmotion.share(event, can, [{name: chat.TITLE, value: meta.name}, {name: chat.TOPIC, values: [cli.WHITE, cli.BLACK]}], [
			mdb.NAME, meta.index, mdb.TEXT, JSON.stringify(can.Input([], true)),
		])
	},
	"打开链接": function(event, can) { var meta = can.Conf(), args = can.Option(); args.river = "", args.storm = ""
		args.cmd = meta.index||can.core.Keys(meta.ctx, meta.cmd), args.cmd == "web.wiki.word" && (args.cmd = args.path)
		can.user.isWeiXin? can.user.jumps(can.misc.MergeURL(can, args)): can.user.open(can.misc.MergeURL(can, args))
	},
	"生成链接": function(event, can) { var meta = can.Conf(), args = can.Option()
		args.cmd = meta.index||can.core.Keys(meta.ctx, meta.cmd), args.cmd == "web.wiki.word" && (args.cmd = args.path)
		can.onmotion.share(event, can, [], [mdb.LINK, can.user.copy(event, can, can.misc.MergeURL(can, args))])
	},
	"生成脚本": function(event, can) { var conf = can.Conf()
		var args = can.Input("", true).join(ice.SP), list = [
			"export ctx_dev="+location.origin+"; ctx_temp=$(mktemp); curl -o $ctx_temp -fsSL $ctx_dev;"+" source $ctx_temp "+(conf.index||"")+ice.SP+args,
			"ish_sys_dev_run_command "+args, "ish_sys_dev_run_action", "ish_sys_dev_run_source",
		]
		can.user.toastScript(can, '<div class="story" data-type="spark", data-name="shell">'+
			'<label>$ </label>'+'<span>'+list.join("</span><br/><label>$ </label><span>")+'</span>'+'</div>', conf.index+ice.SP+args)
		can.user.copy(event, can, list[0])
	},
	"生成图片": function(event, can) { can.onmotion.toimage(event, can, can._name) },

	"刷新页面": function(event, can) { var sub = can.core.Value(can, chat._OUTPUTS_CURRENT)
		can.core.CallFunc([sub, chat.ONIMPORT, "_init"], {can: sub, msg: sub._msg, cb: function(msg) {}, target: can._output})
	},
	"保存参数": function(event, can) { can.search(event, ["River.ondetail.保存参数"]) },
	"清空参数": function(event, can) { can.page.SelectArgs(can, can._option, "", function(item) { return item.value = "" }) },
	"扩展参数": function(event, can) { can.onmotion.toggle(can, can._action) },
	"复制数据": function(event, can) { can.user.copy(event, can, can.onexport.table(can)||can.onexport.board(can)) },
	"下载数据": function(event, can) { var meta = can.Conf()
		can.user.input(event, can, [{name: "filename", value: meta.name}], function(list) {
			can.user.downloads(can, can.onexport.table(can), list[0], nfs.CSV)||can.user.downloads(can, can.onexport.board(can), meta.name, nfs.TXT)
		})
	},
	"清空数据": function(event, can) { can.onmotion.clear(can, can._output) },

	"查看文档": function(event, can) { can.runAction(event, "config", ["help"]) },
	"查看脚本": function(event, can) { can.runAction(event, "config", ["script"]) },
	"查看源码": function(event, can) { can.runAction(event, "config", ["source"]) },
	"查看配置": function(event, can) { can.runAction(event, "config", ["select"], function(msg) {
		can.onappend.board(can, msg)
	}) },
	"删除配置": function(event, can) { can.runAction(event, "config", ["reset"]) },
	"删除工具": function(event, can) { can.page.Remove(can, can._target) },

	"打包页面": function(event, can) { can.onengine.signal(can, "onwebpack", can.request(event)) },
	"摄像头": function(event, can) {
		var constraints = {audio: false, video: {width: 200, height: 200}}
		var ui = can.page.Append(can, can._output, [{view: ctx.ACTION}, {view: "capture", list: [{type: "video", _init: function(item) {
			navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
				item.srcObject = stream, item.onloadedmetadata = function(e) {
					item.play()
				}, ui.stream = stream
			}).catch(function(err) { console.log(err.name + ": " + err.message); })
		}}]}])

		can.onappend._action(can, ["关闭", "抓拍"], ui.action, {
			"抓拍": function(event) {
				var canvas = can.page.Append(can, ui.capture, [{type: "canvas", width: ui.video.offsetWidth, height: ui.video.offsetHeight}]).first
				canvas.getContext("2d").drawImage(ui.video, 0, 0)
				can.page.Append(can, ui.capture, [{img: canvas.toDataURL('image/png'), style: {width: ui.video.offsetWidth, height: ui.video.offsetHeight}}])
				can.page.Remove(can, canvas)
			},
			"关闭": function(event) {
				can.core.List(ui.stream.getTracks(), function(track) { track.stop() })
				can.page.Remove(can, ui.action)
				can.page.Remove(can, ui.video)
				can.page.Remove(can, ui.capture)
			},
		})
	},

	clear: function(event, can, name) { can.onmotion.clear(can, can._output) },
	close: function(event, can) {
		if (can.isFullMode()) {
			can.onaction["切换全屏"](event, can)
		} else {
			can.page.Remove(can, can._target)
		}
	},
	upload: function(event, can) { can.user.upload(event, can) },
	actions: function(event, can) { can.onmotion.toggle(can, can._action) },
	next: function(event, can) { can.Update(event, [ctx.ACTION, mdb.NEXT, can.Status(mdb.TOTAL)||0, can.Option(mdb.LIMIT)||can.Action(mdb.LIMIT)||"", can.Option(mdb.OFFEND)||can.Action(mdb.OFFEND)||""]) },
	prev: function(event, can) { can.Update(event, [ctx.ACTION, mdb.PREV, can.Status(mdb.TOTAL)||0, can.Option(mdb.LIMIT)||can.Action(mdb.LIMIT)||"", can.Option(mdb.OFFEND)||can.Action(mdb.OFFEND)||""]) },
	change: function(event, can, name, value, cb) {
		return can.page.SelectArgs(can, can._option, "", function(input) {
			if (input.name == name && value != input.value) { input.value = value
				var data = input.dataset||{}; can.Update(event, can.Input(), cb)
				return input
			}
		})
	},
	getClipboardData: function(event, can, button) {
		function add(text) { can.runAction(event, button, can.base.Simple(can.base.ParseJSON(text)), function() { can.Update() }) }
		navigator.clipboard? navigator.clipboard.readText().then(add).catch(function(err) { can.misc.Log(err) }):
			can.user.input(event, can, [{type: html.TEXTAREA, name: mdb.TEXT}], function(list) { add(list[0]) })
	},
	scanQRCode0: function(event, can, button) { can.user.agent.scanQRCode(can) },
	scanQRCode: function(event, can, button) {
		can.user.agent.scanQRCode(can, function(data) {
			can.runAction(event, button, can.base.Simple(data), function() { can.Update() })
		})
	},
	openLocation: function(event, can) { can.user.agent.openLocation(can, can.request(event)) },
	getLocation: function(event, can, button) {
		can.user.agent.getLocation(can, function(data) { can.request(event, data)
			can.user.input(event, can, [mdb.TYPE, mdb.NAME, mdb.TEXT, "latitude", "longitude"], function(args) {
				can.runAction(event, button, args)
			})
		})
	},
})
Volcanos(chat.ONEXPORT, {help: "导出数据",
	table: function(can) { var msg = can._msg; if (msg.Length() == 0) { return }
		var res = [msg.append && msg.append.join(ice.FS)]; msg.Table(function(line, index, array) {
			res.push(can.core.Item(line, function(key, value) { return value }).join(ice.FS))
		})
		return res.join(ice.NL)
	},
	board: function(can) { var msg = can._msg; return msg.Result() },
})
