Volcanos("user", {help: "用户操作", info: {}, agent: {
		scanQRCode: function(can, cb) {
			can.user.input(event, can, [{type: html.TEXTAREA, name: "text", text: ""}], function(list) {
				cb(can.base.ParseJSON(list[0]))
			})
		},
		getLocation: function(can, cb) { var call = arguments.callee
			if (call._res) { return cb(call._res) }

			navigator.geolocation.getCurrentPosition(function(res) {
				cb(call._res = {latitude: parseInt(res.coords.latitude*100000), longitude: parseInt(res.coords.longitude*100000)})
			}, function(some) {
				typeof cb == lang.FUNCTION && cb({type: "unknown", name: "unknown", latitude: 3998412, longitude: 11630748})
			} );
		},
		openLocation: function(can, msg) {
			window.open("https://map.baidu.com/search/"+encodeURIComponent(msg.Option(mdb.TEXT))
				+"/@12958750.085,4825785.55,16z?querytype=s&da_src=shareurl&wd="+encodeURIComponent(msg.Option(mdb.TEXT)))
		},
		chooseImage: function(can, cb) {
			typeof cb == lang.FUNCTION && cb([])
		},
	},
	isWeiXin: navigator.userAgent.indexOf("MicroMessenger") > -1,
	isIPhone: navigator.userAgent.indexOf("iPhone") > -1,
	isMobile: navigator.userAgent.indexOf("Mobile") > -1,
	isMacOSX: navigator.userAgent.indexOf("Mac OS X") > -1,
	isWindows: navigator.userAgent.indexOf("Windows") > -1,
	isIE: navigator.userAgent.indexOf("MSIE") > -1,
	isExtension: location && location.protocol && location.protocol == "chrome-extension:",
	isLocalFile: location && location.protocol && location.protocol == "file:",
	isLandscape: function() { return window.innerWidth > window.innerHeight },
	isPortrait: function() { return window.innerWidth < window.innerHeight },
	mod: {
		isPod: location && location.pathname && (location.pathname.indexOf("/chat/pod/") == 0 || location.pathname.indexOf("/x/") == 0),
		isDiv: location && location.pathname && (location.pathname.indexOf("/chat/div/") == 0),
		isCmd: location && location.pathname && (location.pathname.indexOf("/chat/pod/") == 0 && location.pathname.indexOf("/cmd/") > 0 ||
			location.pathname.indexOf("/chat/cmd/") == 0 || location.pathname.indexOf("/help/") == 0),
		isWeb: location && location.pathname && (location.pathname.indexOf("/chat/pod/") == 0 && location.pathname.indexOf("/website/") > 0 ||
			location.pathname.indexOf("/chat/website/") == 0),
	},

	alert: function(text) { alert(JSON.stringify(text)) },
	confirm: function(text) { return confirm(JSON.stringify(text)) },
	prompt: function(tip, def, cb, silent) { (text = silent? def: prompt(tip, def||"")) != undefined && typeof cb == lang.FUNCTION && cb(text); return text },
	reload: function(force) { (force || confirm("重新加载页面？")) && location.reload() },
	jumps: function(url) { location.href = url },
	open: function(url) { window.open(url) },
	close: function(url) { window.close() },
	time: function(can, time, fmt) { var now = can.base.Date(time)
		var list = can.user.language(can) == "en"? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
		return can.base.Time(time, (fmt||"%y-%m-%d %H:%M:%S").replace("%w", list[now.getDay()]))
	},
	args: function(can) {
		if (can.user.isExtension) {
			return can.base.Obj(localStorage.getItem(ctx.ARGS), {})
		}
		return {}
	},

	title: function(text) {
		if (window.webview) { return title(text) }
		return text && (document.title = Volcanos.meta.args.name||text), document.title
	},
	topic: function(can, name) { can.base.isArray(name) && (name = can.base.join(name))
		can.user.isMobile && (name += " mobile") && can.user.isLandscape() && (name += " landscape")
		can.user.language(can) && (name += " "+can.user.language(can))
		can.Conf("display") && (name += " "+can.Conf("display"))
		can.user.mod.isCmd && (name += " simple")
		can.page.styleClass(can, can._root._target, name)
	},
	language: function(can) { return can.misc.Search(can, "language") },
	trans: function(can, text, list) { if (can.base.isObject(text)) {
			return can.core.Item(text, function(k, v) { can.core.Value(can._trans, k, v) })
		}

		if (can.user.language(can) == "en") { return text }
		if (can.base.isFunction(text)) { text = text.name||"" }
		return list&&list[text] || can.Conf("trans."+text) || can.Conf("feature._trans."+text) || can._trans&&can._trans[text] || {
			"create": "创建", "remove": "删除", "insert": "添加", "delete": "删除", "modify": "编辑",
			"inputs": "补全", "prunes": "清理", "export": "导出", "import": "导入",
			"list": "查看", "back": "返回", "run": "执行", "done": "完成", "share": "共享",
			"edit": "编辑", "save": "保存", "copy": "复制", "show": "显示", "hide": "隐藏",
			"project": "项目", "profile": "详情", "actions": "参数",
			"download": "下载", "toimage": "截图",
			"plugin": "插件",
			"prev": "上一页", "next": "下一页",

			"Close": "关闭",
			"Close others": "关闭其它",
			"Close all": "关闭所有",

			"trash": "删除",
			"open": "打开", "close": "关闭",
			"start": "启动", "stop": "停止",
			"begin": "开始", "end": "结束",
			"clear": "清空", "refresh": "刷新",
			"submit": "提交", "cancel": "取消",
			"label": "标签", "exec": "执行",
		}[text]||text
	},
	toastScript: function(can, content, title) {
		var ui = can.user.toast(can, {title: title, duration: -1, width: -300, content: content, action: [cli.CLOSE]})
		can.onmotion.story.auto(can, ui._target)
	},
	toastConfirm: function(can, content, title, action) {
		return can.user.toast(can, {title: title, content: content, action: action||[cli.CLOSE], duration: -1, width: -300})
	},
	toastProcess: function(can, content, title) { return can.user.toast(can, content, title||ice.PROCESS, -1) },
	toastSuccess: function(can, content, title) { return can.user.toast(can, content, title||ice.SUCCESS) },
	toast: function(can, content, title, duration, progress) {
		var meta = can.base.isObject(content)? content: {content: content, title: title||can._help, duration: duration, progress: progress}
		var width = meta.width||400, height = meta.height||100; if (width < 0) { width = window.innerWidth + width }

		var ui = can.page.Append(can, document.body,  [{view: chat.TOAST, style: {
			left: (window.innerWidth-width)/2, width: width, bottom: 100,
		}, list: [
			{text: [meta.title||"", html.DIV, html.TITLE], title: "点击复制", onclick: function(event) {
				can.user.copy(event, can, meta.title)
			}},
			{view: "duration", title: "点击关闭", onclick: function() { action.close() }},
			can.base.isObject(meta.content)? meta.content: {text: [meta.content||"执行成功", html.DIV, "content"]},

			{view: html.ACTION}, meta.progress != undefined && {view: "progress", style: {width: width}, list: [
				{view: "current", style: {width: (meta.progress||0)/100*width}},
			]},
		] }])

		can.page.ClassList.add(can, ui._target, chat.FLOAT)
		var action = can.onappend._action(can, meta.action && meta.action.list? meta.action.list: meta.action||[""], ui.action, {
			_engine: function(event, button) {
				var cb = meta.action[button]||meta.action; can.base.isFunc(cb) && cb(event, button)
			},
			open: function(event) {
				if (meta.content.indexOf("http") == 0) { can.user.open(meta.content) }
				if (meta.title.indexOf("http") == 0) { can.user.open(meta.title) }
			},
			close: function(event) { can.page.Remove(can, action._target), action.timer.stop = true },
			timer: can.core.Timer({interval: 100, length: (parseInt(meta.duration||1000))/100}, function(event, interval, index) {
				if (index > 30) { ui.duration.innerHTML = parseInt(index/10)+ice.PT+(index%10)+"s..." }
			}, function() { action.close() }), _target: ui._target, ui: ui,
		}); can.onmotion.story.auto(can, ui._target)

		can.onengine.signal(can, chat.ONTOAST, can.request({}, {time: can.misc._time(), title: meta.title, content: meta.content, fileline: can.misc.FileLine(2, 2)}))
		return !meta.action && can.onmotion.float.add(can, chat.TOAST, action), action
	},
	share: function(can, msg, cmd) {
		can.run(msg, cmd||[ctx.ACTION, chat.SHARE], function(msg) {
			can.user.toast(can, {
				title: msg.Append(mdb.NAME), duration: -1,
				content: msg.Append(mdb.TEXT), action: [cli.CLOSE, cli.OPEN],
			}), can.user.copy(msg._event, can, msg.Append(mdb.NAME))
		})
	},
	login: function(can, cb, method, auto) { method = can.base.Obj(method, ["登录", "扫码"])
		var list = {
			"登录": function(event, button, data) {
				can.run({}, [aaa.LOGIN, data[html.USERNAME], data[html.PASSWORD]], function(msg) {
					if (msg.Option(ice.MSG_USERNAME)) {
						can.page.Remove(can, ui._target), can.base.isFunc(cb) && cb()
					} else {
						can.user.toast(can, "用户名或密码错误")
					}
				})
				return true
			}, 
			"扫码": function() {
				can.misc.WSS(can, {type: html.CHROME, cmd: "pwd"}, function(event, msg, cmd, arg) { if (!msg) { return }
					if (cmd == "pwd") {
						return can.user.toast(can, arg[2], arg[1], -1), msg.Reply()
					}
					if (cmd == ice.MSG_SESSID) {
						return can.misc.CookieSessid(can, arg[0]), msg.Reply(), can.user.reload(true)
					}
					can.search(event, msg[ice.MSG_DETAIL]||[], function(msg) { msg.Reply() })
				})
			},
			"授权": function() {
				can.misc.WSS(can, {type: html.CHROME, cmd: "sso", "back": location.href}, function(event, msg, cmd, arg) { if (!msg) { return }
					if (cmd == "pwd") {
						return location.href = arg[1]
					}
					if (cmd == ice.MSG_SESSID) {
						return can.misc.CookieSessid(can, arg[0]), msg.Reply(), can.user.reload(true)
					}
					can.search(event, msg[ice.MSG_DETAIL]||[], function(msg) { msg.Reply() })
				})
			},
			"飞书": function() { location.href = "/chat/lark/sso" },
		}; if (auto) { return list["授权"]() } else if (method.length == 1) { list[method[0]](); return }

		var ui = can.user.input({}, can, [{type: html.USERNAME}, {type: html.PASSWORD}], function(event, button, data) { return list[button](event, button, data) }, method)
		can.page.Modify(can, ui._target, {className: "input login", style: {left: (window.innerWidth-ui._target.offsetWidth)/2, top: window.innerHeight/6}})
	},
	logout: function(can, force) { if (force||can.user.confirm("logout?")) {
		can.runAction({}, aaa.LOGOUT, [], function(msg) {
			can.misc.Search(can, chat.SHARE)? can.misc.Search(can, chat.SHARE, ""): can.user.reload(true)
		})
	} },

	toPNG: function(can, name, text, height, width) {
		if (text.indexOf("<svg") != 0) {
			text = '<svg xmlns="http://www.w3.org/2000/svg">'+text+"</svg>"
		}
		var img = document.createElement(html.IMG)
		img.onload = function() {
			var canvas = document.createElement("canvas")
			canvas.height = height, canvas.width = width
			canvas.getContext("2d").drawImage(img, 0, 0)

			var a = document.createElement("a")
			a.href = canvas.toDataURL("image/png")
			a.download = name, a.click()
		}, img.src = "data:image/svg+xml,"+encodeURIComponent(text)
	},
	copy: function(event, can, text) { if (!text) { return }
		if (navigator.clipboard) { var ok = false
			navigator.clipboard.writeText(text).then(function() { ok = true }); if (ok) {
				can.user.toastSuccess(can, text, "copy success"), can.misc.Log("copy", text)
				return text
			}
		}

		var input = can.page.Append(can, event.target.parentNode, [{type: html.TEXTAREA, value: text}]).first
		can.onmotion.focus(can, input), document.execCommand("Copy"), can.page.Remove(can, input)
		can.user.toastSuccess(can, text, "copy success"), can.misc.Log("copy", text)
		return text
	},
	carte: function(event, can, meta, list, cb, parent) { // event item meta
		meta = meta||can.ondetail||can.onaction||{}, list = list&&list.length > 0? list: meta.list||can.core.Item(meta)||[]; if (list.length == 0) { return }
		cb = cb||function(event, button, meta) { var cb = meta[button]||meta["_engine"]; can.base.isFunc(cb) && cb(event, can, button) }

		var ui = can.page.Append(can, document.body, [{view: chat.CARTE, style: {left: 0, top: 0}, onmouseleave: function(event) {
			// can.page.Remove(can, ui._target)
		}, list: can.core.List(list, function(item, index) {
			return can.base.isString(item)? item ==""? /* space */ {view: "space"}: /* string */ {view: html.ITEM, list: [{text: can.user.trans(can, item), onclick: function(event) {
				can.user.isMobile && can.page.Remove(can, ui._target)
				can.base.isFunc(cb) && cb(event, item, meta, index)
				can.onkeymap.prevent(event)
			}, onmouseenter: function(event) {
				carte._float && can.page.Remove(can, carte._float._target)
			} }] }: can.base.isArray(item)? /* array */ {view: html.ITEM, list: [{text: can.user.trans(can, item[0])+" -> "}], onmouseenter: function(event) {
				var sub = can.user.carte(event, can, meta, item.slice(1), cb, carte)
				carte._float && can.page.Remove(can, carte._float._target), carte._float = sub
				can.onlayout.figure(event, can, sub._target, true)
			} }: /* object */ {view: html.ITEM, list: [{text: can.user.trans(can, item.name), onclick: function(event) {
				can.user.isMobile && can.page.Remove(can, ui._target)
				can.base.isFunc(cb) && cb(event, item.name, meta, index)
			}, onmouseenter: function(event) {
				carte._float && can.page.Remove(can, carte._float._target)
			} }] }
		}) }] )

		can.page.ClassList.add(can, ui._target, chat.FLOAT)
		ui._target.onmouseover = function(event) { can.onkeymap.prevent(event) }
		var carte = {_target: ui._target, _parent: parent, layout: can.onlayout.figure(event, can, ui._target)}
		return can.onkeymap.prevent(event), carte
	},
	carteRight: function(event, can, meta, list, cb, parent) {
		var carte = can.user.carte(event, can, meta, list, cb, parent)
		return can.page.style(can, carte._target, can.onlayout.figure(event, can, carte._target, true)), carte
	},
	carteClient: function(event, can, meta, list, cb, parent) {
		var ui = can.user.carte(event, can, meta, list, cb, parent)
		can.page.style(can, ui._target, {left: event.clientX, top: event.clientY})
	},

	input: function(event, can, form, cb, button) { if (!form || form.length == 0) { return cb() }
		var msg = can.request(event); event = event._event||event
		var ui = can.page.Append(can, document.body, [{view: [html.INPUT], style: {left: 0, top: 0}, list: [
			{view: "content", list: [{view: [html.OPTION, html.TABLE], list: can.core.List(form, function(item) {
				item = can.base.isString(item)? {type: html.TEXT, name: item}: item.length > 0? {type: html.SELECT, name: item[0], values: item.slice(1)}: item
				item.type = item.type||(item.values? html.SELECT: item.name == html.TEXT? html.TEXTAREA: html.TEXT)

				item._init = function(target) {
					item.run = function(event, cmds, cb) {
						var _msg = can.request(event, {_handle: ice.TRUE, action: msg.Option(html.ACTION)}, msg, can.Option())
						can.page.Select(can, ui.table, html.OPTION_ARGS, function(item) {
							item.name && item.value && _msg.Option(item.name, item.value)
						})
						can.run(event, cmds, cb, true)
					}

					if (item.name != "action" && item.name) {
						target.value = msg.Option(item.name)||can.Option(item.name)||target.value||""
					}
					item.mode = "simple"
					if (item.type == html.USERNAME) { return }
					if (item.type == html.PASSWORD) { return }
					can.onappend.figure(can, item, target)
				}

				// return {type: html.TR, list: [{type: html.TD, list: [{text: item._trans||can.user.trans(can, item.name)||""}]}, {type: html.TD, list: [can.page.input(can, item)]} ]}
				return {type: html.TR, list: [{type: html.TD, list: [{text: item.name||""}]}, {type: html.TD, list: [can.page.input(can, item)]} ]}
			})}]}, {view: html.ACTION},
		]}])

		var layout = can.onlayout.figure(event, can, ui._target)
		can.page.ClassList.add(can, ui._target, chat.FLOAT)

		var action = can.onappend._action(can, button||[html.SUBMIT, html.CANCEL], ui.action, {
			focus: function(event) { can.page.Select(can, ui.first, html.INPUT_ARGS)[0].focus() },
			cancel: function(event) { can.page.Remove(can, ui._target) },
			_engine: function(event, can, button) { action.submit(event, can, button) },
			submit: function(event, can, button) { var data = {}, args = [], list = []
				list = can.page.Select(can, ui.table, html.OPTION_ARGS, function(item) {
					return item.name && item.value && args.push(item.name, item.value), data[item.name] = item.value
				})
				var msg = can.request(event, {_handle: ice.TRUE})
				!can.core.CallFunc(cb, {event: event, button: button, data: data, list: list, args: args}) && action.cancel()
				// can.base.isFunc(cb) && !cb(event, button, data, list, args) && action.cancel()
				can.onkeymap.prevent(event)
			}, _target: ui._target,
		})
		if (button ===  true) { return action.submit(event, can, "submit"), action }

		can.page.Select(can, ui._target, html.INPUT_ARGS, function(item, index) {
			index == 0 && can.onmotion.delay(can, function() { can.onmotion.focus(can, item) })
		})
		return action
	},
	select: function(event, can, type, fields, cb, cbs) {
		var msg = can.request(event, {fields: fields||"type,name,text"})
		can.search(msg, ["Search.onimport.select", type, "", ""], function(list) {
			can.core.Next(list, cb, cbs||function() {
				can.user.toastSuccess(can)
			})
		})
	},
	upload: function(event, can) { var begin = new Date()
		var ui = can.page.Append(can, document.body, [{view: html.UPLOAD, style: {left: 0, top: 0}, list: [
			{view: html.ACTION}, {view: html.OUTPUT, list: [{view: "progress"}]},
			{view: html.STATUS, list: [{view: html.SHOW}, {view: "cost"}, {view: "size"}]},
		]}]); can.onlayout.figure(event, can, ui._target)
		can.page.ClassList.add(can, ui._target, chat.FLOAT)

		var action = can.onappend._action(can, [
			{type: html.UPLOAD, onchange: function(event) {
				action.show(event, 0, event.target.files[0].size, 0)
			}}, cli.CLOSE,
		], ui.action, {
			close: function(event) { can.page.Remove(can, ui._target) },
			begin: function(event) { begin = new Date()
				var upload = can.page.Select(can, ui.action, "input[type=file]")
				if (upload[0].files.length == 0) { return upload[0].focus() }

				var msg = can.request(event, can.Option(), {_handle: "true"})
				msg._upload = upload[0].files[0], msg._progress = action.show

				can.runAction(event, html.UPLOAD, [], function(msg) {
					can.user.toastSuccess(can), can.Update(), action.close()
				})
			},
			show: function (event, value, total, loaded) { now = new Date()
				value == 0 && action.begin(event)

				ui.show.innerHTML = value+"%"
				ui.cost.innerHTML = can.base.Duration(now - begin)
				ui.size.innerHTML = can.base.Size(loaded)+ice.PS+can.base.Size(total)
				can.page.style(can, ui.progress, {width: value*(ui.output.offsetWidth-2)/100})
			},
		}); can.page.Select(can, ui.action, "input[type=file]")[0].click()

		return action
	},
	download: function(can, path, name, ext) {
		var a = can.page.Append(can, document.body, [{type: html.A, href: path, download: can.core.Keys(name, ext)||path.split(ice.PS).pop()}]).first
		a.click(), can.page.Remove(can, a)
		return path
	},
	downloads: function(can, text, name, ext) { if (!text) { return }
		return can.user.download(can, URL.createObjectURL(new Blob([text])), name, ext)
	},
	camera: function(can, msg, cb) {
		navigator.getUserMedia({video: true}, cb, function(error) {
			can.misc.Log(error)
		})
	},
	localStorage: function(can, key, value) {
		if (value != undefined) { localStorage.setItem(key, JSON.stringify(value)) }
		return can.base.Obj(localStorage.getItem(key), {})
	},
})
