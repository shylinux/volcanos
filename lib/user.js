Volcanos("user", {info: {}, agent: {
		chooseImage: function(can, cb) { can.base.isFunc(cb) && cb([]) },
		scanQRCode: function(can, cb) { can.user.input(event, can, [{type: html.TEXTAREA, name: "text", text: ""}], function(list) { cb(can.base.ParseJSON(list[0])) }) },
		getLocation: function(can, cb) { var call = arguments.callee; if (call._res) { return cb(call._res) }
			navigator.geolocation.getCurrentPosition(function(res) {
				cb(call._res = {latitude: parseInt(res.coords.latitude*100000), longitude: parseInt(res.coords.longitude*100000)})
			}, function(some) { can.base.isFunc(cb) && cb({type: "unknown", name: "unknown", latitude: 3998412, longitude: 11630748}) } )
		},
		openLocation: function(can, msg) {
			window.open("https://map.baidu.com/search/"+encodeURIComponent(msg.Option(mdb.TEXT))
				+"/@12958750.085,4825785.55,16z?querytype=s&da_src=shareurl&wd="+encodeURIComponent(msg.Option(mdb.TEXT)))
		},
	},
	isWeiXin: navigator.userAgent.indexOf("MicroMessenger") > -1,
	isIPhone: navigator.userAgent.indexOf("iPhone") > -1,
	isMobile: navigator.userAgent.indexOf("Mobile") > -1,
	isMacOSX: navigator.userAgent.indexOf("Mac OS X") > -1,
	isWindows: navigator.userAgent.indexOf("Windows") > -1,
	isIE: navigator.userAgent.indexOf("MSIE") > -1,
	isWebview: window.webview != undefined,
	isExtension: location && location.protocol && location.protocol == "chrome-extension:",
	isLocalFile: location && location.protocol && location.protocol == "file:",
	isLandscape: function() { return window.innerWidth > window.innerHeight },
	mod: {
		isPod: location && location.pathname && (location.pathname.indexOf("/chat/pod/") == 0 || location.pathname.indexOf("/x/") == 0),
		isCmd: location && location.pathname && (location.pathname.indexOf("/chat/pod/") == 0 && location.pathname.indexOf("/cmd/") > 0 || location.pathname.indexOf("/chat/cmd/") == 0 || location.pathname.indexOf("/help/") == 0),
		isWeb: location && location.pathname && (location.pathname.indexOf("/chat/pod/") == 0 && location.pathname.indexOf("/website/") > 0 || location.pathname.indexOf("/chat/website/") == 0),
		isDiv: location && location.pathname && (location.pathname.indexOf("/chat/div/") == 0),
	},

	alert: function(text) { alert(JSON.stringify(text)) },
	confirm: function(text) { return confirm(JSON.stringify(text)) },
	prompt: function(tip, def, cb, silent) { (text = silent? def: prompt(tip, def||"")) != undefined && typeof cb == lang.FUNCTION && cb(text); return text },
	reload: function(force) { (force || confirm("重新加载页面？")) && location.reload() },
	jumps: function(url) { location.href = url },
	open: function(url) { window.open(url) },
	close: function(url) { window.close() },

	title: function(text) { if (window.webview) { return title(text) } return text && (document.title = text), document.title },
	topic: function(can, name) { can.base.isString(name) && (name = [name]) || name || []
		can.user.isMobile && name.push("mobile") && can.user.isLandscape() && name.push("landscape")
		can.user.language(can) && name.push(can.user.language(can))
		can.Conf("display") && name.push(can.Conf("display"))
		can.user.isWebview && name.push("webview")
		can.user.mod.isCmd && name.push(chat.SIMPLE)
		can.page.styleClass(can, can._root._target, name.join(ice.SP))
	},
	language: function(can) { return can.misc.Search(can, "language")||can.user.info.language },
	trans: function(can, text, list) { if (can.base.isFunc(text)) { text = text.name||"" }
		if (can.base.isObject(text)) { return can.core.Item(text, function(k, v) { can.core.Value(can._trans, k, v) }) }
		if (can.user.language(can) == "en") { return text } if (can.base.isString(list)) { return list }
		return list&&list[text] || can._trans&&can._trans[text] || can.Conf("trans."+text) || can.Conf("feature._trans."+text) || {
			"plugin": "插件", "label": "标签", "height": "高度", "width": "宽度", "show": "显示", "hide": "隐藏", "project": "项目", "profile": "详情", "actions": "参数",
			"create": "创建", "remove": "删除", "insert": "添加", "delete": "删除", "modify": "修改", "prunes": "清理", "export": "导出", "import": "导入", "search": "搜索",
			"link": "链接", "copy": "复制", "edit": "编辑", "save": "保存", "trash": "删除", "share": "共享", "toimage": "截图", "download": "下载", "upload": "上传",
			"run": "执行", "list": "查看", "back": "返回", "prev": "上一页", "next": "下一页",
			"source": "源码", "module": "模块", "action": "操作", "recent": "最近",

			"open": "打开", "close": "关闭",
			"start": "启动", "stop": "停止",
			"begin": "开始", "end": "结束",
			"exec": "执行", "done": "完成",
			"clear": "清空", "refresh": "刷新",
			"submit": "提交", "cancel": "取消",

			"Close": "关闭", "Close others": "关闭其它", "Close all": "关闭所有",
		}[text]||text
	},
	time: function(can, time, fmt) { var now = can.base.Date(time)
		var list = can.user.language(can) == "en"? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
		return fmt == "%W"? list: can.base.Time(time, (fmt||"%y-%m-%d %H:%M:%S").replace("%w", list[now.getDay()]))
	},

	toastConfirm: function(can, content, title, action) { return can.user.toast(can, {content: content, title: title, action: action||[cli.CLOSE], duration: -1, width: -300}) },
	toastProcess: function(can, content, title) { return can.user.toast(can, content||ice.PROCESS, title||can._name.split(ice.PS).slice(-2).join(ice.PS), -1) },
	toastSuccess: function(can, content, title) { return can.user.toast(can, content||ice.SUCCESS, title||can._name.split(ice.PS).slice(-2).join(ice.PS)) },
	toast: function(can, content, title, duration, progress) {
		var meta = can.base.isObject(content)? content: {content: content, title: title||can._help, duration: duration, progress: progress}
		var width = meta.width||400; if (width < 0) { width = window.innerWidth + width }
		var ui = can.page.Append(can, can._root._target,  [{view: [[chat.TOAST, chat.FLOAT]], style: {left: (window.innerWidth-width)/2, width: width, bottom: 100}, list: [
			{text: [meta.title||"", html.DIV, html.TITLE], title: "点击复制", onclick: function(event) { can.user.copy(event, can, meta.title) }},
			{view: "duration", title: "点击关闭", onclick: function() { action.close() }},
			can.base.isObject(meta.content)? meta.content: {text: [meta.content||"", html.DIV, nfs.CONTENT]},
			html.ACTION, !can.base.isUndefined(meta.progress) && {view: "progress", style: {width: width}, list: [
				{view: "current", style: {width: (meta.progress||0)/100*width}},
			]},
		] }]); can.onengine.signal(can, chat.ONTOAST, can.request({}, {time: can.misc._time(), title: meta.title, content: meta.content, fileline: can.misc.FileLine(-3)}))
		var action = can.onappend._action(can, meta.action && meta.action.list? meta.action.list: meta.action||[""], ui.action, {
			_engine: function(event, button) { can.core.CallFunc(meta.action[button]||meta.action, [event, button]) },
			open: function(event) { meta.content.indexOf(ice.HTTP) == 0 && can.user.open(meta.content), meta.title.indexOf(ice.HTTP) == 0 && can.user.open(meta.title) },
			close: function(event) { can.page.Remove(can, action._target), action.timer.stop = true },
			timer: can.core.Timer({interval: 100, length: (parseInt(meta.duration||1000))/100}, function(event, interval, index) {
				if (index > 30) { ui.duration.innerHTML = parseInt(index/10)+ice.PT+(index%10)+"s..." }
			}, function() { action.close() }), _target: ui._target, ui: ui,
		}); can.onmotion.story.auto(can, ui._target)
		return can._toast && (can._toast.close(), delete(can._toast)), can._toast = action
	},
	share: function(can, msg, cmd) { can.run(msg, cmd||[ctx.ACTION, chat.SHARE], function(msg) { can.user.copy(msg._event, can, msg.Append(mdb.NAME))
		can.user.toast(can, {title: msg.Append(mdb.NAME), duration: -1, content: msg.Append(mdb.TEXT), action: [cli.CLOSE, cli.OPEN]})
	}) },
	copy: function(event, can, text) { if (!text) { return }
		if (navigator.clipboard) { var ok = false; navigator.clipboard.writeText(text).then(function() { ok = true })
			if (ok) { return can.user.toastSuccess(can, text, "copy success"), can.misc.Log("copy", text), text }
		}
		var input = can.page.Append(can, event.target.parentNode, [{type: html.TEXTAREA, value: text}])._target
		can.onmotion.focus(can, input), document.execCommand("Copy"), can.page.Remove(can, input)
		return can.user.toastSuccess(can, text, "copy success"), can.misc.Log("copy", text), text
	},

	carte: function(event, can, meta, list, cb, parent) {
		meta = meta||can.ondetail||can.onaction||{}, list = can.base.getValid(list, meta.list, can.core.Item(meta))||[]; if (list.length == 0) { return }
		cb = cb||function(event, button, meta) { var cb = meta[button]||meta[chat._ENGINE]; can.base.isFunc(cb) && cb(event, can, button) }
		parent || can.page.Select(can, can._root._target, can.page.Keys("div.carte.float"), function(target) { can.onmotion.delay(can, function () { can.page.Remove(can, target) }) })
		var ui = can.page.Append(can, can._root._target, [{view: [[chat.CARTE, chat.FLOAT]], list: can.core.List(list, function(item, index) {
			return can.base.isString(item)? item ==""? /* space */ {view: html.SPACE}: /* string */ {view: [html.ITEM, html.DIV, can.user.trans(can, item)], onclick: function(event) {
				can.base.isFunc(cb) && cb(event, item, meta, index), can.onkeymap.prevent(event), can.user.isMobile && can.page.Remove(can, ui._target)
			}, onmouseenter: function(event) { carte._float && can.page.Remove(can, carte._float._target) } }:
			can.base.isArray(item)? /* array */ {view: html.ITEM, list: [{text: can.user.trans(can, item[0])+" -> "}], onmouseenter: function(event) {
				var sub = can.user.carte(event, can, meta, item.slice(1), cb, carte); can.onlayout.figure(event, can, sub._target, true)
				carte._float && can.page.Remove(can, carte._float._target), carte._float = sub
			} }: /* object */ {view: html.ITEM, list: [{text: can.user.trans(can, item.name), onclick: function(event) {
				can.base.isFunc(cb) && cb(event, item.name, meta, index), can.user.isMobile && can.page.Remove(can, ui._target)
			}, onmouseenter: function(event) { carte._float && can.page.Remove(can, carte._float._target) } }] }
		}), onmouseover: function(event) { can.onkeymap.prevent(event) } }] )
		var carte = {_target: ui._target, _parent: parent, layout: can.onlayout.figure(event, can, ui._target)}
		return can.onkeymap.prevent(event), carte
	},
	carteRight: function(event, can, meta, list, cb, parent) { var carte = can.user.carte(event, can, meta, list, cb, parent)
		return can.page.style(can, carte._target, can.onlayout.figure(event, can, carte._target, true)), carte
	},

	input: function(event, can, form, cb, button) { if (!form || form.length == 0) { return cb() }
		var msg = can.request(event); event = event._event||event; var need = {}
		var ui = can.page.Append(can, can._root._target, [{view: [[html.INPUT, chat.FLOAT]], list: [
			{view: nfs.CONTENT, list: [{view: [html.OPTION, html.TABLE], list: can.core.List(form, function(item) {
				item = can.base.isString(item)? {type: html.TEXT, name: item}: item.length > 0? {type: html.SELECT, name: item[0], values: item.slice(1)}: item
				item.type = item.type||(item.values? html.SELECT: item.name == html.TEXT? html.TEXTAREA: html.TEXT), need[item.name] = item.need
				item._init = function(target) { if (item.type == html.PASSWORD || item.type == html.USERNAME) { return }
					if (item.name && item.name != ctx.ACTION) { target.value = msg.Option(item.name)||can.Option(item.name)||target.value||"" }
					item.run = item.run||function(event, cmds, cb) { var _msg = can.request(event, {_handle: ice.TRUE, action: msg.Option(html.ACTION)}, msg, can.Option())
						can.page.Select(can, ui.table, html.OPTION_ARGS, function(item) { item.name && item.value && _msg.Option(item.name, item.value) })
						can.run(event, cmds, cb, true)
					}, item._enter = function(event) { return action.submit(event, can, html.SUBMIT), true }
					item.mode = chat.SIMPLE, can.onappend.figure(can, item, target)
				}; return {type: html.TR, list: [{type: html.TD, list: [{text: item.name||""}, {text: item.need == "must"? "*": "", style: {color: cli.RED}}]}, {type: html.TD, list: [can.page.input(can, item)]}]}
			})}]}, html.ACTION,
		]}])
		var action = can.onappend._action(can, button||[html.SUBMIT, html.CANCEL], ui.action, {
			focus: function() { can.onmotion.focus(can, can.page.Select(can, ui._target, html.INPUT_ARGS)[0]) },
			cancel: function() { can.page.Remove(can, ui._target) },
			submit: function(event, can, button) { var args = [], data = {}, err = false
				var list = can.page.Select(can, ui.table, html.OPTION_ARGS, function(item) {
					if (item.value == "" && need[item.name] == "must") { err = true, item.focus(), can.user.toast(can, item.name+" 是必选字段, 请重新输入") }
					return item.name && args.push(item.name, item.value||""), data[item.name] = item.value||""
				}); if (err) { return } can.onkeymap.prevent(event)
				can.core.CallFunc(cb, {event: can.request(event, {_handle: ice.TRUE})._event, button: button, data: data, list: list, args: args}) || action.cancel()
			}, _target: ui._target, _engine: function(event, can, button) { action.submit(event, can, button) },
		}); can.onlayout.figure(event, can, ui._target), can.onmotion.delay(can, function() { action.focus() })
		return button ===  true && action.submit(event, can, html.SUBMIT), action
	},
	select: function(event, can, type, fields, cb, cbs) {
		can.search(can.request(event, {fields: fields||"type,name,text"}), ["Search.onimport.select", type, "", ""], function(list) {
			can.core.Next(list, cb, cbs||function() { can.user.toastSuccess(can) })
		})
	},
	upload: function(event, can, cb, silent) { var begin = new Date()
		var ui = can.page.Append(can, can._root._target, [{view: [[html.UPLOAD, chat.FLOAT]], list: [
			html.ACTION, {view: html.OUTPUT, list: ["progress"]}, {view: html.STATUS, list: [ice.SHOW, cli.COST, nfs.SIZE]},
		]}]); can.onlayout.figure(event, can, ui._target)
		var action = can.onappend._action(can, [{type: html.UPLOAD, onchange: function(event) { action.show(event, 0, event.target.files[0].size, 0) }}, cli.CLOSE], ui.action, {
			close: function(event) { can.page.Remove(can, ui._target) },
			begin: function(event) { begin = new Date()
				var upload = can.page.Select(can, ui.action, html.INPUT_FILE)[0]; if (upload.files.length == 0) { return upload.focus() }
				var msg = can.request(event, can.Option(), {_handle: ice.TRUE}); msg._upload = upload.files[0], msg._progress = action.show
				can.runAction(event, html.UPLOAD, [], function(msg) { action.close()
					if (can.base.isFunc(cb)) { return cb(msg) }
					can.user.toastSuccess(can), can.Update()
				})
			},
			show: function (event, value, total, loaded) {
				ui.cost.innerHTML = can.base.Duration(new Date() - begin)
				ui.show.innerHTML = value+"%", value == 0 && action.begin(event)
				ui.size.innerHTML = can.base.Size(loaded)+ice.PS+can.base.Size(total)
				can.page.styleWidth(can, ui.progress, value*(ui.output.offsetWidth-2)/100)
			}, _target: ui._target,
		}); can.page.Select(can, ui.action, html.INPUT_FILE)[0].click(), silent && can.onmotion.hidden(can, ui._target); return action
	},
	download: function(can, path, name, ext) {
		var a = can.page.Append(can, can._root._target, [{type: html.A, href: path, download: can.core.Keys(name, ext)||path.split(ice.PS).pop()}])._target
		return a.click(), can.page.Remove(can, a), path
	},
	downloads: function(can, text, name, ext) { if (!text) { return }
		return can.user.download(can, URL.createObjectURL(new Blob([text])), name, ext)
	},
	toimage: function(event, can, name, target, silent) {
		can.require(["https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.5/dist/html2canvas.min.js"], function() {
			html2canvas(target||can._target).then(function (canvas) { var url = canvas.toDataURL("image/png")
				silent? can.user.download(can, url, name, nfs.PNG): can.user.toastImage(can, url)
			})
		})
	},
	toPNG: function(can, name, text, height, width) {
		if (text.indexOf("<svg") != 0) { text = '<svg xmlns="http://www.w3.org/2000/svg">'+text+"</svg>" }
		var img = can.page.Create(can, html.IMG, {src: "data:image/svg+xml,"+encodeURIComponent(text), onload: function() {
			var canvas = can.page.Create(can, html.CANVAS, {height: height, width: width}); canvas.getContext("2d").drawImage(img, 0, 0)
			can.user.download(can, canvas, name, nfs.PNG)
		}})
	},
	toastImage: function(can, url) { url = can.base.isString(url)? url: url.toDataURL("image/png")
		var toast = can.user.toast(can, {content: {img: url, style: {"max-height": window.innerHeight/2, display: html.BLOCK}}, title: can._name, duration: -1,
			action: shy({}, [cli.CLOSE, web.DOWNLOAD], function(event, button) { can.user.download(can, url, name, nfs.PNG) }),
		})
		can.onmotion.delay(can, function() { can.page.Select(can, toast._target, html.IMG, function(target) {
			can.page.style(can, toast._target, html.WIDTH, target.offsetWidth, html.LEFT, (window.innerWidth-target.offsetWidth)/2)
		}) })
	},

	login: function(can, cb, method, auto) { method = can.base.Obj(method, ["登录", "扫码"])
		var meta = {
			"登录": function(event, button, data) { can.run({}, [aaa.LOGIN, data[html.USERNAME], data[html.PASSWORD]], function(msg) {
				if (!msg.Option(ice.MSG_USERNAME)) { return can.user.toast(can, "用户名或密码错误") }
				can.page.Remove(can, ui._target), can.base.isFunc(cb) && cb()
			}); return true }, 
			"扫码": function() { can.misc.WSS(can, {type: html.CHROME, cmd: "pwd"}, function(event, msg, cmd, arg) { if (!msg) { return }
				if (cmd == "pwd") { return can.user.toast(can, arg[2], arg[1], -1), msg.Reply() }
				if (cmd == ice.MSG_SESSID) { return can.misc.CookieSessid(can, arg[0]), msg.Reply(), can.user.reload(true) }
				can.search(event, msg[ice.MSG_DETAIL]||[], function(msg) { msg.Reply() })
			}) },
			"授权": function() { can.misc.WSS(can, {type: html.CHROME, cmd: chat.SSO, "back": location.href}, function(event, msg, cmd, arg) { if (!msg) { return }
				if (cmd == "pwd") { return location.href = arg[1] }
				if (cmd == ice.MSG_SESSID) { return can.misc.CookieSessid(can, arg[0]), msg.Reply(), can.user.reload(true) }
				can.search(event, msg[ice.MSG_DETAIL]||[], function(msg) { msg.Reply() })
			}) },
		}; if (auto) { return meta["授权"]() } else if (method.length == 1) { meta[method[0]](); return }

		var ui = can.user.input({}, can, [{type: html.USERNAME}, {type: html.PASSWORD}], function(event, button, data) { return meta[button](event, button, data) }, method)
		can.page.Modify(can, ui._target, {className: "input login", style: {left: (window.innerWidth-ui._target.offsetWidth)/2, top: window.innerHeight/6}})
	},
	logout: function(can, force) { if (force||can.user.confirm("logout?")) { can.runAction({}, aaa.LOGOUT, [], function(msg) {
		can.misc.Search(can, chat.SHARE)? can.misc.Search(can, chat.SHARE, ""): can.user.reload(true)
	}) } },
})
