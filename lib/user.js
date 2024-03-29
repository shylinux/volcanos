Volcanos("user", {
	agent: {
		chooseImage: function(can, cb) { can.base.isFunc(cb) && cb([]) },
		scanQRCode: function(can, cb) { can.user.input(event, can, [{type: html.TEXTAREA, name: mdb.TEXT, text: ""}], function(list) { cb(can.base.ParseJSON(list[0])) }) },
		getLocation: function(can, cb) { var call = arguments.callee; if (call._res) { return cb(call._res) }
			navigator.geolocation.getCurrentPosition(function(res) {
				cb(call._res = {latitude: parseInt(res.coords.latitude*100000), longitude: parseInt(res.coords.longitude*100000)})
			}, function(some) { can.base.isFunc(cb) && cb({type: "location", name: "北京市", text: "天安门", latitude: 3998412, longitude: 11630748}) } )
		},
		openLocation: function(can, msg) {
			window.open("https://map.baidu.com/search/"+encodeURIComponent(msg.Option(mdb.TEXT))
				+"/@12958750.085,4825785.55,16z?querytype=s&da_src=shareurl&wd="+encodeURIComponent(msg.Option(mdb.TEXT)))
		},
	}, info: {},
	isTesla: navigator.userAgent.indexOf("Tesla") > -1,
	isChrome: navigator.userAgent.indexOf("Chrome") > -1,
	isMailMaster: navigator.userAgent.indexOf("MailMaster") > -1,
	isWeiXin: navigator.userAgent.indexOf("MicroMessenger") > -1,
	isIPhone: navigator.userAgent.indexOf("iPhone") > -1,
	isMobile: navigator.userAgent.indexOf("Mobile") > -1,
	isMacOSX: navigator.userAgent.indexOf("Mac OS X") > -1,
	isWindows: navigator.userAgent.indexOf("Windows") > -1,
	isNodejs: navigator.userAgent.indexOf("nodejs") > -1,
	isIE: navigator.userAgent.indexOf("MSIE") > -1,
	isWebview: window.webview != undefined,
	isExtension: location && location.protocol && location.protocol == "chrome-extension:",
	isLocalFile: location && location.protocol && location.protocol == "file:",
	isLandscape: function() { return window.innerWidth > window.innerHeight },
	mod: {
		isPod: location && location.pathname && (location.pathname.indexOf("/chat/pod/") == 0 || location.pathname.indexOf("/x/") == 0),
		isCmd: location && location.pathname && (
			location.pathname.indexOf("/chat/pod/") == 0 && location.pathname.indexOf("/cmd/") > 0
			|| location.pathname.indexOf("/chat/cmd/") == 0
			|| location.pathname.indexOf("/wiki/portal/") == 0
			|| location.pathname.indexOf("/help/") == 0
		),
	},
	alert: function(text) { alert(JSON.stringify(text)) },
	confirm: function(text) { return confirm(JSON.stringify(text)) },
	prompt: function(tip, def, cb, silent) { (text = silent? def: prompt(tip, def||"")) != undefined && typeof cb == code.FUNCTION && cb(text); return text },
	reload: function(force) { (force || confirm("重新加载页面？")) && location.reload() },
	jumps: function(url) { location.href = url },
	opens: function(url) {
		if (location.search.indexOf("debug=true") > 0 && url.indexOf("debug=true") == -1) {
			var ls = url.split("#"); ls[0] += (ls[0].indexOf("?") > 0? "&": "?") + "debug=true", url = ls.join("#")
		}
		window.openurl? window.openurl(url): window.parent && window.parent.openurl? window.parent.openurl(url): window.open(url)
	},
	open: function(url) {
		if (window.open(url)) { return }
		this.isMobile? location.href = url: null
	},
	close: function(url) { return window.close() },
	theme: function(can, name) { can.base.isString(name) && (name = [name]) || name || []
		name.indexOf(chat.BLACK) > -1 && name.push(html.DARK), name.indexOf(chat.WHITE) > -1 && name.push(chat.BLACK, html.LIGHT)
		can.user.language(can) && name.push(can.user.language(can)), can.user.mod.isCmd && name.push(chat.CMD), can.user.isWebview && name.push(html.WEBVIEW)
		can.user.isWindows && name.push("windows"), can.user.isMobile && name.push(html.MOBILE) && can.user.isLandscape() && name.push(html.LANDSCAPE)
		can.page.styleClass(can, document.body, name.join(lex.SP))
	},
	title: function(text) { if (window.webview) { return title(text) } return text && (document.title = text), document.title },
	language: function(can) { return can.misc.SearchOrConf(can, aaa.LANGUAGE)||can.user.info.language||"zh" },
	trans: function(can, text, list) { if (can.base.isNumber(text)) { return text+"" } if (can.user.language(can) != "zh") { return text }
		if (can.base.isObject(text)) { return can.core.Item(text, function(k, v) { can.core.Value(can._trans, k, v) }) }
		if (can.base.isFunc(text)) { text = text.name||"" } if (can.base.isString(list)) { return list }
		return list&&list[text] || can._trans&&can._trans[text] || can.Conf("trans."+text) || can.Conf("feature._trans."+text) || kit.Dict(
			mdb.CREATE, "创建", mdb.REMOVE, "删除", mdb.INSERT, "添加", mdb.DELETE, "删除", mdb.MODIFY, "修改", mdb.PRUNES, "清理", mdb.PRUNE, "清理", mdb.REVERT, "恢复", mdb.EXPORT, "导出", mdb.IMPORT, "导入", mdb.SEARCH, "搜索",
			aaa.INVITE, "邀请", ctx.ACTION, "操作", ice.RUN, "执行", ice.LIST, "查看", ice.BACK, "返回", mdb.PREV, "上一页", mdb.NEXT, "下一页", mdb.LINK, "链接",
			web.CLEAR, "清空", web.REFRESH, "刷新", web.SUBMIT, "提交", web.CANCEL, "取消", web.UPLOAD, "上传", web.DOWNLOAD, "下载", web.TOIMAGE, "截图", web.SHARE, "共享",
			nfs.SAVE, "保存", nfs.LOAD, "加载", nfs.COPY, "复制", nfs.EDIT, "编辑", nfs.SAVE, "保存", nfs.TRASH, "清理", nfs.SOURCE, "源码", nfs.MODULE, "模块", nfs.RECENT, "最近",
			cli.BEGIN, "开始", cli.START, "启动", cli.OPEN, "打开", cli.CLOSE, "关闭", cli.STOP, "停止", cli.END, "结束", cli.EXEC, "执行", cli.DONE, "完成", cli.RESTART, "重启",
			cli.SYSTEM, "命令", cli.ORDER, "加载", cli.BUILD, "构建",
			code.XTERM, "终端", code.INNER, "源码", chat.IFRAME, "浏览", chat.LOCATION, "地图",
			html.PLUGIN, "插件", html.LABEL, "标签", html.HEIGHT, "高度", html.WIDTH, "宽度", ice.SHOW, "显示", ice.HIDE, "隐藏", chat.PROJECT, "项目", chat.PROFILE, "详情", chat.ACTIONS, "操作",
			"full", "全屏", "Close", "关闭", "Close Other", "关闭其它", "Rename Tabs", "重命名",
			"add", "添加", "opt", "优化", "fix", "修复", "message", "信息",
			"max", "最大", "auto", "自动",
			"push", "上传", "pull", "下载",
			"logs", "日志",
			"configs", "配置",
			"inspect", "详情",
			"portal", "首页",
			"confirm", "确定",
			"upgrade", "升级",
			"compile", "编译",
			"prepare", "准备", "process", "处理", "finish", "完成",
			"today", "今天",
		)[text]||text
	},
	time: function(can, time, fmt) { var now = can.base.Date(time)
		var list = can.user.language(can) == "en"? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
		return fmt == "%W"? list: can.base.Time(time, (fmt||"%y-%m-%d %H:%M:%S").replace("%w", list[now.getDay()]))
	},
	toastConfirm: function(can, content, title, action) {
		if (!action.list || action.list.length == 0) { action = shy({confirm: action}, ["confirm", web.CANCEL], function() {}) }
		var carte = can.user.toast(can, {content: content, title: title, action: action||[cli.CLOSE], duration: -1})
		can.page.style(can, carte._target, html.TOP, 200, html.BOTTOM, ""); return carte
	},
	toastProcess: function(can, content, title) { return can.user.toast(can, {content: "🕑 "+(content||ice.PROCESS), title: title, duration: -1, caller: 2}) },
	toastSuccess: function(can, content, title) { return can.user.toast(can, {content: "✅ "+(content||ice.SUCCESS), title: title, caller: 2}) },
	toastFailure: function(can, content, title) { return can.user.toast(can, {content: "❌ "+(content||ice.FAILURE), title: title, duration: 10000, caller: 2}) },
	toast: function(can, content, title, duration, progress, caller) {
		var meta = can.base.isObject(content)? content: {content: content, duration: duration, progress: progress, caller: caller}
		meta.title = meta.title||can.core.Keys(can.Conf(web.SPACE), can.Conf(ctx.INDEX))||can._name.split(nfs.PS).slice(-2).join(nfs.PS)
		var width = meta.width||400; if (width < 0) { width = window.innerWidth + width } meta.action = meta.action||[""]
		var ui = can.page.Append(can, document.body, [{view: [[chat.TOAST, chat.FLOAT]], style: {left: (window.innerWidth-width)/2, width: width, top: can.page.height()/2}, list: [
			{text: [meta.title||"", html.DIV, html.TITLE], title: "点击复制", onclick: function(event) { can.user.copy(event, can, meta.title) }},
			{view: "duration", title: "点击关闭", onclick: function() { action.close() }},
			can.base.isObject(meta.content)? meta.content: {text: [meta.content||"", html.DIV, nfs.CONTENT]},
			html.ACTION, !can.base.isUndefined(meta.progress) && {view: "progress", style: {width: width-10}, list: [
				{view: "current", style: {width: (meta.progress||0)*(width-12)/100}},
			]},
		] }]); can.onengine.signal(can, chat.ONTOAST, can.request({}, {time: can.misc._time(), title: meta.title, content: meta.content})._caller(meta.caller||4))
		meta.action.meta && can.core.Item(meta.action.meta, function(key, cb) { cb.help && can.core.Value(meta.action.meta, ["_trans", key], cb.help) })
		var action = can.onappend._action(can, meta.action.list? meta.action.list: meta.action, ui.action, {
			_trans: meta.action.meta? meta.action.meta._trans: {},
			_engine: function(event, button) { can.core.CallFunc(meta.action.meta? meta.action.meta[button]: meta.action, [event, button]) },
			open: function(event) { meta.content.indexOf(ice.HTTP) == 0 && can.user.open(meta.content), meta.title.indexOf(ice.HTTP) == 0 && can.user.open(meta.title) },
			close: function(event) { can.page.Remove(can, ui._target), action.timer.stop = true },
			cancel: function(event) { can.page.Remove(can, ui._target), action.timer.stop = true },
			timer: can.core.Timer({interval: 100, length: (meta.duration||1000)/100}, function(event, interval, index) {
				if (index > 30) { ui.duration.innerHTML = index/10+(index%10==0?".0":"")+"s..." }
			}, function() { action.close() }), _target: ui._target,
		}); can.onmotion.story.auto(can, ui._target), meta.resize && can.onmotion.delayResize(can, ui._target, meta.resize)
		return can._toast && (can._toast.close(), delete(can._toast)), can._toast = action
	},
	share: function(can, msg, cmds) { can.run(msg, cmds||[ctx.ACTION, chat.SHARE], function(msg) { can.user.copy(msg._event, can, msg.Append(mdb.NAME))
		can.user.toast(can, {title: msg.Append(mdb.NAME), duration: -1, content: msg.Append(mdb.TEXT), action: [cli.CLOSE, cli.OPEN], resize: html.IMG})
	}) },
	copy: function(event, can, text) { if (!text) { return }
		if (navigator.clipboard) { var ok = false; navigator.clipboard.writeText(text).then(function() { ok = true })
			if (ok) { return can.user.toastSuccess(can, text, "copy success"), can.misc.Log(nfs.COPY, text), text }
		}
		var input = can.page.Append(can, document.body, [{type: html.TEXTAREA, value: text}])._target
		can.onmotion.focus(can, input), document.execCommand("Copy"), can.page.Remove(can, input)
		return can.user.toastSuccess(can, text, "copy success"), can.misc.Log(nfs.COPY, text), text
	},
	carte: function(event, can, meta, list, cb, parent, trans) {
		function remove_sub(carte) { carte._sub && can.page.Remove(can, carte._sub._target), delete(carte._sub) }
		parent? remove_sub(parent): can.onmotion.clearCarte(can)
		var msg = can.request(event); trans = trans||meta._trans
		meta = meta||can.ondetail||can.onaction||{}, list = can.base.getValid(list, meta.list, can.core.Item(meta)); if (!list || list.length == 0) { return }
		function click(event, button) { can.misc.Event(event, can, function() { can.onkeymap.prevent(event)
			meta[button]? can.core.CallFunc([meta, button], {event: event, can: can, msg: msg, button: button}): can.base.isFunc(cb)? cb(event, button, meta, carte):
				can.onaction && can.onaction[button] && can.core.CallFunc([can.onaction, button], [event, can, button])
				// meta._style == nfs.PATH || can.onmotion.clearCarte(can)
		}) }
		var ui = can.page.Append(can, document.body, [{view: [[chat.CARTE, meta._style||can.base.replaceAll(can._index||"", nfs.PT, lex.SP)||"", chat.FLOAT]], list: can.core.List(list, function(item, index) {
			if (item == web.FILTER) {
				return {input: [html.FILTER, function(event) { if (event.key == code.ESCAPE) { return carte.close() } can.onkeymap.selectItems(event, can, carte._target) }],
					_init: function(target) { can.onmotion.delay(can, function() { target.placeholder = "search in "+(can.core.List(list, function(item) { if (item) { return item } }).length-1)+" items", target.focus() }) }
				}
			}
			function subs(event) { var sub = can.user.carte(event, can, meta, item.slice(1), cb||function(event, button) {
				can.onimport && can.onimport[item[0]] && can.onimport[item[0]](can, button)
			}, carte, trans); can.onlayout.figure(event, can, sub._target, true), carte._sub = sub }
			return item === ""? /* 0.space */ {type: html.HR}: can.base.isString(item)||can.base.isNumber(item)? /* 1.string */ {view: [html.ITEM, html.DIV, meta._style == ice.CMD? item: can.user.trans(can, item, trans)], onclick: function(event) { click(event, item) }, onmouseenter: function(event) { remove_sub(carte) } }:
				can.base.isArray(item)? /* 2.array */ {view: html.ITEM, list: [{text: can.user.trans(can, item[0], trans)}, {text: [lex.SP+can.page.unicode.next, "", [html.ICON, "next"]]}], onmouseenter: subs, onclick: subs}: /* 3.object */ item
		})}]); can.onkeymap.prevent(event), can.page.Select(can, ui._target, html.IMG, function(target) { target.onload = function() { can.onlayout.figure(event, can, ui._target) } })
		var carte = {_target: ui._target, _parent: parent, layout: can.onlayout.figure(event, can, ui._target, false, 200), close: function() { can.page.Remove(can, ui._target) }}
		parent && (parent._sub = carte)
		return carte
	},
	carteRight: function(event, can, meta, list, cb, parent) { var carte = can.user.carte(event, can, meta, list, cb, parent)
		return carte && can.onlayout.figure(event, can, carte._target, true), carte
	},
	carteItem: function(event, can, item) { if (!item.action) { return }
		var trans = {}, list = can.page.Select(can, can.page.Create(can, html.DIV, item.action), "", function(target) { trans[target.name] = can.user.trans(can, target.value); return target.name })
		can.user.carteRight(event, can, {_trans: trans}, list, function(event, button) { can.Update(can.request(event, item), [ctx.ACTION, button]) })
	},
	input: function(event, can, form, cb, button) { if (!form || form.length == 0) { return cb() }
		var msg = can.request(event); event = event._event||event; var need = {}
		var ui = can.page.Append(can, document.body, [{view: [[html.INPUT, chat.FLOAT]], list: [
			msg.Option(wiki.TITLE) && {view: [wiki.TITLE, html.LEGEND, msg.Option(wiki.TITLE)]},
			{view: html.OPTION, list: [{type: html.TABLE, list: can.core.List(form, function(item) {
				item = can.base.isString(item)? {type: html.TEXT, name: item}: item.length > 0? {type: html.SELECT, name: item[0], values: item.slice(1)}: item
				item.type = item.type||(item.values? html.SELECT: item.name == html.TEXT? html.TEXTAREA: html.TEXT), need[item.name] = item.need
				item._init = function(target) { if (item.type == html.SELECT) { target.value = item.value||item.values[0]
					return can.onmotion.delay(can, function() { can.onappend.select(can, target, item) }) }
					if (item.name && item.name != ctx.ACTION) { target.value = msg.Option(item.name)||can.Option(item.name)||target.value||"" }
					item.mode = chat.SIMPLE, can.onappend.figure(can, can.base.Copy({run: function(event, cmds, cb) { var _msg = can.request(event, {_handle: ice.TRUE, action: msg.Option(html.ACTION)}, msg, can.Option())
						can.page.Select(can, ui.table, html.OPTION_ARGS, function(item) { item.name && item.value && _msg.Option(item.name, item.value) })
						can.run(event, cmds, cb, true)
					}, _enter: function(event) { return action.submit(event, can, html.SUBMIT), true }}, item), target)
				}, item.onkeydown = function(event) { if (event.key == code.ESCAPE) { event.target.blur() } }
				return {type: html.TR, list: [
					{type: html.TD, list: [{text: [can.user.trans(can, item.name||"", item._trans), html.LABEL]}]}, {type: html.TD, list: [{text: item.need == "must"? "*": "", style: {color: cli.RED}}]},
					{type: html.TD, list: [can.page.input(can, item), item.type == html.TEXT && {icon: "delete", onclick: function(event) { event.target.previousSibling.value = "" }}]},
				]}
			})}]}, html.ACTION,
		]}])
		var action = can.onappend._action(can, button||[html.SUBMIT, html.CANCEL], ui.action, {
			_trans: {submit: msg.Option(web.SUBMIT)},
			focus: function() { can.onmotion.focus(can, can.page.Select(can, ui._target, html.INPUT_ARGS)[0]) },
			cancel: function() { can.page.Remove(can, ui._target) },
			submit: function(event, can, button) { var args = [], data = {}, err = false
				var list = can.page.Select(can, ui.table, html.OPTION_ARGS, function(item) {
					if (item.value == "" && need[item.name] == "must") { err = true, item.focus(), can.user.toast(can, item.name+" 是必选字段, 请重新输入") }
					return item.name && args.push(item.name, item.value||""), data[item.name] = item.value||""
				}); if (err) { return } can.onkeymap.prevent(event)
				can.core.CallFunc(cb, {event: can.request(event, {_handle: ice.TRUE})._event, button: button, data: data, list: list, args: args, input: action}) || action.cancel()
			}, _target: ui._target, _engine: function(event, can, button) { action.submit(event, can, button) },
		});
		if (event && event.target) {
			can.onlayout.figure(event, can, ui._target)
		} else {
			can.getActionSize(function(left, top, height) { can.page.style(can, ui._target, html.LEFT, left||0, html.TOP, (height/4||0)) })
		}
		can.onmotion.delay(can, function() { action.focus() })
		// can.onmotion.move(can, ui._target, {})
		can.onmotion.resize(can, ui._target)
		return button === true && action.submit(event, can, html.SUBMIT), action
	},
	select: function(event, can, type, fields, cb, cbs) {
		can.search(can.request(event, {fields: fields||"type,name,text"}), ["Search.onimport.select", type, "", ""], function(list) {
			can.core.Next(list, cb, cbs||function() { can.user.toastSuccess(can) })
		})
	},
	upload: function(event, can, cb, silent) { var begin = new Date()
		var ui = can.page.Append(can, document.body, [{view: [[html.UPLOAD, chat.FLOAT]], list: [
			html.ACTION, {view: html.OUTPUT, list: ["progress"]}, {view: html.STATUS, list: [ice.SHOW, cli.COST, nfs.SIZE]},
		]}]); can.onlayout.figure(event, can, ui._target)
		var action = can.onappend._action(can, [{type: html.UPLOAD, onchange: function(event) { action.show(event, 0, event.target.files[0].size, 0) }}, {type: html.BUTTON, name: cli.CLOSE}], ui.action, {
			begin: function(event) { begin = new Date()
				var upload = can.page.Select(can, ui.action, html.INPUT_FILE)[0]; if (upload.files.length == 0) { return upload.focus() }
				var msg = can.request(event, can.Option(), {_handle: ice.TRUE}); msg._upload = upload.files[0], msg._progress = action.show
				can.runAction(event, html.UPLOAD, [], function(msg) { can.base.isFunc(cb)? cb(msg): can.Update(), action.close(), can.user.toastSuccess(can) })
			}, close: function(event) { can.page.Remove(can, ui._target) },
			show: function (event, value, total, loaded) {
				ui.cost.innerHTML = can.base.Duration(new Date() - begin)
				ui.show.innerHTML = value+"%", value == 0 && action.begin(event)
				ui.size.innerHTML = can.base.Size(loaded)+nfs.PS+can.base.Size(total)
				can.page.styleWidth(can, ui.progress, value*(ui.output.offsetWidth-2)/100)
			}, _target: ui._target,
		}); can.page.Select(can, ui.action, html.INPUT_FILE)[0].click(), silent && can.onmotion.hidden(can, ui._target); return action
	},
	downloads: function(can, text, name, ext) { return text && can.user.download(can, URL.createObjectURL(new Blob([text])), name, ext) },
	download: function(can, path, name, ext) {
		var a = can.page.Append(can, document.body, [{type: html.A, href: path, download: can.core.Keys(name, ext)||path.split(nfs.PS).pop()}])._target
		return a.click(), can.page.Remove(can, a), path
	},
	toimage: function(can, name, target, silent) { var toast = can.user.toastProcess(can, "生成中...")
		can.require(["/require/modules/html2canvas/dist/html2canvas.min.js"], function() { toast.close()
			html2canvas(target||can._target).then(function (canvas) { var url = canvas.toDataURL(web.IMAGE_PNG)
				silent? (can.user.download(can, url, name, nfs.PNG), can.user.toastSuccess(can)): can.user.toastImage(can, name, url)
			})
		})
	},
	toastImage: function(can, name, url) { var toast = can.user.toast(can, {content: {img: url, style: {"max-height": window.innerHeight/2, display: html.BLOCK}}, title: name, duration: -1,
		action: shy([cli.CLOSE, web.DOWNLOAD], function(event, button) {
			can.user.input(event, can, [{name: mdb.NAME, value: name}], function(list) { can.user.download(can, url, list[0], nfs.PNG) })
		}), resize: html.IMG,
	}) },
	login: function(can, cb, method) { var trans = kit.Dict(aaa.USERNAME, "用户", aaa.PASSWORD, "密码", aaa.LOGIN, "登录")
		function layout() { can.page.style(can, ui._target, {left: (window.innerWidth-ui._target.offsetWidth)/2, top: window.innerHeight/8}) }
		function button(list) { return {view: [html.ITEM, html.TR], list: [{type: html.TD}, {type: html.TD, list: can.core.Item(list, function(key, cb) {
			return {type: html.INPUT, value: can.user.trans(can, key, trans), data: {type: html.BUTTON}, onclick: cb}
		}) }]} }
		function input(name, type) { return {view: [html.ITEM, html.TR], list: [
			{type: html.TD, list: [{text: can.user.trans(can, name, trans)}]},
			{type: html.TD, list: [{type: html.INPUT, name: name, data: {type: type||html.TEXT}}]},
		]} }
		var ui = can.onappend.tabview(can, {
			"扫码授权": function(target) { can.misc.WSS(can, {type: aaa.LOGIN, name: "", "sess.theme": can.getHeaderTheme()}, function(cmd, arg) {
				if (cmd == cli.PWD) { var _cmd = " space login "+arg[0]; return can.page.Modify(can, target, arg[2]), can.page.Append(can, target, [
					{text: "<br/>或命令授权: "+_cmd, title: "点击复制，并后台执行此命令，即可登录", style: {cursor: "copy"}, onclick: function() { can.user.copy(event, can, _cmd) }},
				]), can.onmotion.delay(can, function() { layout() }, 10) }
				if (cmd == ice.MSG_SESSID) {
					if (!can.misc.CookieSessid(can, arg[0])) { can.user.info.sessid = arg[0] }
					return can.page.Remove(can, ui._target), can.base.isFunc(cb) && cb()
				}
			}) },
			"密码登录": function(target) { var _ui = can.page.Append(can, target, [input(aaa.USERNAME), input(aaa.PASSWORD, aaa.PASSWORD), button(kit.Dict(aaa.LOGIN, function(event) {
				can.runAction(event, aaa.LOGIN, [_ui.username.value, _ui.password.value], function(msg) {
					if (!msg.Option(ice.MSG_USERNAME)) { return can.user.toastFailure(can, "用户或密码错误") }
					can.page.Remove(can, ui._target), can.base.isFunc(cb) && cb()
				})
			}))]) },
		}, can.base.Obj(method, can.user.isMobile? ["密码登录"]: ["扫码授权"]), can.page.Append(can, document.body, [{view: "input login float"}])._target)
		can.onmotion.delay(can, function() { layout() })
	},
	logout: function(can) { can.user.toastConfirm(can, aaa.LOGOUT, "", function() { can.runAction({}, aaa.LOGOUT, [], function(msg) {
		can.misc.CookieSessid(can, ""), can.misc.Search(can, chat.SHARE)? can.misc.Search(can, chat.SHARE, ""): can.user.reload(true)
	}) }) },
	header: function(can) { if (!can._root) { return }
		var header = can._root.Header
		var meta = {
			space: {view: [[html.ITEM, html.SPACE]], style: {"flex-grow": "1"}},
			time: {view: [[html.ITEM, mdb.TIME]], _init: function(target) {
				can.onappend.figure(can, {action: "date", _hold: true}, target, function(sub, value) {})
				can.core.Timer({interval: 100}, function() { can.page.Modify(can, target, can.user.time(can, null, "%H:%M:%S %w")) })
			}},
			avatar: {view: [[html.ITEM, aaa.AVATAR]], list: [{img: can.user.info.avatar}], onclick: function(event) { header && header.onaction.avatar(event, header) }},
			usernick: {view: [[html.ITEM, aaa.USERNICK], "", can.user.info.usernick], onclick: function(event) { header && header.onaction.usernick(event, header) }},
		}; return can.core.List(can.base.getValid(can.core.List(arguments).slice(1), [html.SPACE, mdb.TIME, aaa.AVATAR, aaa.USERNICK]), function(item) { return meta[item] })
	}
})
