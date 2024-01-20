Volcanos("user", {
	agent: {
		enableDebug: function(can) {},
		getLocation: function(can, cb) { var call = arguments.callee; if (call._res) { return cb(call._res) }
			navigator.geolocation.getCurrentPosition(function(res) {
				cb(call._res = {type: "ip", name: "当前位置", text: "某某大街", latitude: res.coords.latitude.toFixed(6), longitude: res.coords.longitude.toFixed(6)})
			}, function(some) { can.base.isFunc(cb) && cb({type: "location", name: "北京市", text: "天安门", latitude: 39.98412, longitude: 116.30748}) } )
		},
		openLocation: function(can, msg) {
			window.open("https://map.baidu.com/search/"+encodeURIComponent(msg.Option(mdb.TEXT))
				+"/@12958750.085,4825785.55,16z?querytype=s&da_src=shareurl&wd="+encodeURIComponent(msg.Option(mdb.TEXT)))
		},
		connectWifi: function(can, ssid, password, cb, cbs) {},
		getClipboard: function(can, cb) {},
		scanQRCode: function(can, cb) { can.user.input(event, can, [{type: html.TEXTAREA, name: mdb.TEXT, text: ""}], function(list) { cb(can.base.ParseJSON(list[0])) }) },
		chooseImage: function(can, cb) { can.base.isFunc(cb) && cb([]) },
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
		isPod: location && location.pathname && (location.pathname.indexOf(web.CHAT_POD) == 0 || location.pathname.indexOf("/x/") == 0 || location.pathname.indexOf("/s/") == 0),
		isCmd: location && location.pathname && (location.pathname.indexOf(web.CHAT_POD) == 0 && location.pathname.indexOf("/cmd/") > 0
			|| location.pathname.indexOf(web.CHAT_CMD) == 0 || location.pathname.indexOf(nfs.WIKI_PORTAL) == 0
		),
	},
	alert: function(text) { alert(JSON.stringify(text)) },
	confirm: function(text) { return confirm(JSON.stringify(text)) },
	prompt: function(tip, def, cb, silent) { (text = silent? def: prompt(tip, def||"")) != undefined && typeof cb == code.FUNCTION && cb(text); return text },
	reload: function(force) { (force || confirm("重新加载页面？")) && location.reload() },
	jumps: function(url) { location.href = url },
	opens: function(url) {
		if (window.parent && window.parent.openurl) { return window.parent.openurl(url) }
		window.openurl? window.openurl(url): this.open(url)
	},
	open: function(url) {
		if (location.search.indexOf("debug=true") > 0 && url.indexOf("debug=true") == -1) {
			var ls = url.split("#"); ls[0] += (ls[0].indexOf("?") > 0? "&": "?") + "debug=true", url = ls.join("#")
		}
		if (window.open(url)) { return }
		this.isMobile? location.href = url: null
	},
	close: function(url) { return window.close() },
	theme: function(can, name) { can.base.isString(name) && (name = [name]) || name || []
		name.push(html.WIDTH+parseInt((can.page.width()+32)/320))
		can.misc.isDebug(can) && name.push(log.DEBUG)
		can.user.info.userrole && name.push(can.user.info.userrole)
		can.user.language(can) && name.push(can.core.Split(can.user.language(can), "-")[0])
		can.user.mod.isCmd && name.push(chat.CMD), can.user.mod.cmd && name.push(can.user.mod.cmd.replaceAll(".", " "))
		can.user.isMobile && name.push(html.MOBILE) && can.user.isLandscape() && name.push(html.LANDSCAPE)
		can.user.isWebview && name.push(html.WEBVIEW), can.user.isWindows && name.push("windows")
		can.page.styleClass(can, document.body, name.join(lex.SP))
	},
	title: function(text) { if (window.webview) { return title(text) } return text && (document.title = text), document.title },
	language: function(can) { return (can.misc.SearchOrConf(can, aaa.LANGUAGE)||can.user.info.language||"") },
	isEnglish: function(can) { return can.base.isIn(can.core.Split(can.user.language(can).toLowerCase()||"en", "_-.")[0], "en", "en-us") },
	trans: function(can, text, list, zone) { if (can.base.isNumber(text)) { return text+"" } if (can.user.isEnglish(can)) { return text }
		if (can.base.isObject(text)) { return can.core.Item(text, function(k, v) { can.core.Value(can._trans, can.core.Keys(zone, k), v) }) }
		if (can.base.isFunc(text)) { text = text.name||"" } if (can.base.isString(list)) { return list }
		var key = can.core.Keys(zone, text)
		return can.core.Value(list, key) || can.core.Value(can._trans, key) ||
			can.Conf(["trans", key]) || can.Conf(["feature._trans", key]) ||
			can.core.Value(can.user._trans, key) || text
	}, _trans: {"_week_header": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]},
	time: function(can, time, fmt) { var now = can.base.Date(time), list = can.user._trans["_week_header"]
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
		content = {"success": "✅ success", "failure": "❌ failure", "process": "🕑 process"}[content]||content
		var meta = can.base.isObject(content)? content: {content: content, duration: duration, progress: progress, caller: caller}
		meta.title = meta.title||can.core.Keys(can.Conf(web.SPACE), can.Conf(ctx.INDEX))||can._name.split(nfs.PS).slice(-2).join(nfs.PS)
		var width = meta.width||380; if (width < 0) { width = window.innerWidth + width } meta.action = meta.action||[""]
		var ui = can.page.Append(can, document.body, [{view: [[chat.TOAST, chat.FLOAT]], style: {left: (window.innerWidth-width)/2, width: width, top: can.page.height()/2}, list: [
			{text: [meta.title||"", html.DIV, html.TITLE], title: "点击复制", onclick: function(event) { can.user.copy(event, can, meta.title) }},
			{view: ["delete", "", can.page.unicode.delete], title: "点击关闭", onclick: function() { action.close() }},
			{view: "duration", title: "点击关闭", onclick: function() { action.close() }},
			can.base.isObject(meta.content)? meta.content: {text: [meta.content||"", html.DIV, [nfs.CONTENT, html.FLEX]]},
			html.ACTION, !can.base.isUndefined(meta.progress) && {view: "progress", style: {width: width-2*html.PLUGIN_PADDING}, list: [
				{view: "current", style: {width: (meta.progress||0)*(width-2*html.PLUGIN_PADDING-2)/100}},
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
		if (meta.action && meta.action.length == 1 && meta.action[0] === "") {
			can.page.Select(can, action._target, html.DIV_ACTION, function(target) { can.onmotion.hidden(can, target) })
		} return can._toast && (can._toast.close(), delete(can._toast)), can._toast = action
	},
	space: function(can) { return can.Conf(web.SPACE)||can.Conf(ice.POD)||can.misc.Search(can, ice.POD) },
	template: function(can, file) { return can.base.MergeURL(can.base.Path(nfs.SRC_TEMPLATE, can.Conf(ctx.INDEX), file), ice.POD, can.user.space(can)) },
	share: function(can, msg, cmds) { can.page.exportValue(can, msg)
		can.run(msg, cmds||[ctx.ACTION, chat.SHARE], function(msg) { can.user.copy(msg._event, can, msg.Append(mdb.NAME))
			var ui = can.user.toast(can, {title: msg.Append(mdb.NAME), duration: -1, content: msg.Append(mdb.TEXT), action: [cli.CLOSE, cli.OPEN], resize: html.IMG})
			can.page.style(can, ui._target, html.TOP, (can.page.height() - 360)/4)
		})
	},
	copy: function(event, can, text) { if (!text) { return }
		if (navigator.clipboard) { var ok = false; navigator.clipboard.writeText(text).then(function() { ok = true })
			if (ok) { return can.user.toastSuccess(can, text, "copy success"), can.misc.Log(nfs.COPY, text), text }
		}
		var input = can.page.Append(can, document.body, [{type: html.TEXTAREA, value: text}])._target
		can.onmotion.focus(can, input), document.execCommand("Copy"), can.page.Remove(can, input)
		return can.user.toastSuccess(can, text, "copy success"), can.misc.Log(nfs.COPY, text), text
	},
	carte: function(event, can, meta, list, cb, parent, trans) { var msg = can.request(event); event = msg._event
		function remove_sub(carte) { carte._sub && can.page.Remove(can, carte._sub._target), delete(carte._sub) } parent? remove_sub(parent): can.onmotion.clearCarte(can)
		meta = meta||can.ondetail||can.onaction||{}, list = can.base.getValid(list, meta.list, can.core.Item(meta)), trans = trans||meta._trans; if (!list || list.length == 0) { return }
		var _events = event._events||event
		function click(event, button, index) { can.misc.Event(event, can, function() { can.request(event, {action: button}), can.onkeymap.prevent(event), event._events = _events;
			(can.base.isFunc(cb)? cb(event, button, meta, carte, index):
				meta[button]? can.core.CallFunc([meta, button], {event: event, can: can, msg: msg, button: button}):
				can.Update(event, [ctx.ACTION, button])) || can.onmotion.clearCarte(can)
		}) }
		var isinput = can.page.tagis(event.target, html.INPUT)
		var ui = can.page.Append(can, document.body, [{view: [[chat.CARTE, meta._style||msg.Option("_style")||can.base.replaceAll(can.ConfIndex()||"", nfs.PT, lex.SP)||"", chat.FLOAT]], list: can.core.List(list, function(item, index) {
			if (typeof item == code.FUNCTION) { item = item(can); if (!item) { return } }
			if (item === "") { return {type: html.HR} }
			if (item == web.FILTER) { return {
				input: [html.FILTER, function(event) { if (event.key == code.ESCAPE) { return carte.close() } can.onkeymap.selectItems(event, can, carte._target) } ],
				_init: function(target) { can.onmotion.delay(can, function() { target.placeholder = "search in "+(can.core.List(list, function(item) { if (item) { return item } }).length-1)+" items", target.focus() }) }
			} }
			if (can.base.isString(item)||can.base.isNumber(item)) { var _style = can.page.buttonStyle(can, item)
				return {
					view: [[html.ITEM, item, _style], html.DIV, (isinput || meta._style == ice.CMD) && !trans? item: can.user.trans(can, item, trans)],
					onmouseenter: function(event) { remove_sub(carte) },
					onclick: function(event) { click(event, item, index) },
				}
			}
			if (can.base.isArray(item)) {
				function subs(event) { var sub = can.user.carte(event, can, meta, item.slice(1), cb||function(event, button) {
					can.onimport && can.onimport[item[0]]? can.onimport[item[0]](can, button): click(event, button, index)
				}, carte, trans); carte._sub = sub }
				return {view: html.ITEM, list: [
					{text: can.user.trans(can, item[0], trans)},
					{text: [lex.SP+can.page.unicode.next, "", [html.ICON, "next"]]}
				], onmouseenter: subs, onclick: subs}
			}
			return item
		})}]); can.onkeymap.prevent(event), can.page.Select(can, ui._target, html.IMG, function(target) { target.onload = function() { can.onlayout.figure(event, can, ui._target) } })
		var carte = {_target: ui._target, _parent: parent, layout: can.onlayout.figure(event, can, ui._target, parent, 200), close: function() { can.page.Remove(can, ui._target) }}
		return parent && (parent._sub = carte), carte
	},
	carteRight: function(event, can, meta, list, cb, parent) { var carte = can.user.carte(event, can, meta, list, cb, parent)
		return carte && can.onlayout.figure(event, can, carte._target, true), carte
	},
	carteItem: function(event, can, item) { if (!item.action) { return }
		var trans = {}, list = can.page.Select(can, can.page.Create(can, html.DIV, item.action), "", function(target) { trans[target.name] = can.user.trans(can, target.value); return target.name })
		can.user.carteRight(event, can, {_trans: trans}, list, function(event, button) { can.Update(can.request(event, item), [ctx.ACTION, button]) })
	},
	input: function(event, can, form, cb, button) { if (!form || form.length == 0) { return cb() }
		event = event||{}; var msg = can.request(event); event = event._event||event; var need = {}
		var title = msg.Option(wiki.TITLE)
		var ui = can.page.Append(can, document.body, [{view: [[html.INPUT].concat((can.ConfIndex()||"").split("."), msg.Option(mdb.TYPE), [chat.FLOAT])], list: [
			title && {view: [wiki.TITLE, html.LEGEND, title]},
			{view: html.OPTION, list: [{type: html.TABLE, list: can.core.List(form, function(item) {
				item = can.base.isString(item)? {type: html.TEXT, name: item}: item.length > 0? {type: html.SELECT, name: item[0], values: item.slice(1)}: item
				item.type = item.type||(item.values? html.SELECT: item.name == html.TEXT? html.TEXTAREA: html.TEXT), need[item.name] = item.need
				item._init = function(target) {
					if (item.name && item.name != ctx.ACTION) { target.value = item.value||msg.Option(item.name)||can.Option(item.name)||can.Status(item.name)||target.value||"" }
					item.mode = chat.SIMPLE, can.onappend.figure(can, can.base.Copy({space: msg.Option(web.SPACE), run: function(event, cmds, cb) { var _msg = can.request(event, {_handle: ice.TRUE, action: msg.Option(html.ACTION)}, msg, can.Option())
						can.page.Select(can, ui.table, html.OPTION_ARGS, function(item) { item.name && item.value && _msg.Option(item.name, item.value) })
						can.run(event, cmds, cb, true)
					}, _enter: function(event) { return action.submit(event, can, html.SUBMIT), true }}, item), target)
				}, item.onkeydown = function(event) { if (event.key == code.ESCAPE) { event.target.blur() } }
				item.placeholder = can.user.trans(can, item.placeholder||item.name, null, html.INPUT)
				item.title = can.user.trans(can, item.title||item.placeholder||item.name, null, html.INPUT)
				return {view: [[item.name, item.type, item.action], html.TR], list: [
					{type: html.TD, list: [{text: [can.user.trans(can, item.name||"", item._trans, html.INPUT), html.LABEL]}]}, {type: html.TD, list: [{text: item.need == "must"? "*": "", style: {color: cli.RED}}]},
					{type: html.TD, _init: function(target) { can.onappend.input(can, item, "", target) }},
				]}
			})}]}, html.ACTION,
		], onclick: function(event) { if (!can.page.tagis(event.target, html.INPUT, html.TEXTAREA)) { can.onmotion.clearCarte(can) } }}])
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
		if (event && event.target) { can.onlayout.figure(event, can, ui._target) } else {
			can.getActionSize(function(left, top, height) { can.page.style(can, ui._target, html.LEFT, left||0, html.TOP, (height/4||0)) })
		} can.onmotion.resize(can, ui._target), can.onmotion.delay(can, function() { action.focus() }, 300)
		return button === true && action.submit(event, can, html.SUBMIT), action
	},
	select: function(event, can, type, fields, cb, cbs) {
		can.search(can.request(event, {fields: fields||"type,name,text"}), ["Search.onimport.select", type, "", ""], function(list) {
			can.core.Next(list, cb, cbs||function() { can.user.toastSuccess(can) })
		})
	},
	upload: function(event, can, cb, silent) { var begin = new Date()
		var ui = can.page.Append(can, document.body, [{view: [[html.UPLOAD, chat.FLOAT]], list: [
			html.ACTION, {view: html.OUTPUT, list: ["progress"]}, {view: html.STATUS, list: [html.SHOW, cli.COST, nfs.SIZE]},
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
				if (silent) { can.user.toast(can, ui.size.innerHTML, ui.cost.innerHTML, -1, value) }
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
			html2canvas(target||can._target).then(function (canvas) { var url = canvas.toDataURL(html.IMAGE_PNG)
				silent? (can.user.download(can, url, name, nfs.PNG), can.user.toastSuccess(can)): can.user.toastImage(can, name, url)
			})
		})
	},
	toastImage: function(can, name, url) { var toast = can.user.toast(can, {content: {img: url, style: {"max-height": window.innerHeight/2, display: html.BLOCK}}, title: name, duration: -1,
		action: shy([cli.CLOSE, web.DOWNLOAD], function(event, button) {
			can.user.input(event, can, [{name: mdb.NAME, value: name}], function(list) { can.user.download(can, url, list[0], nfs.PNG) })
		}), resize: html.IMG,
	}) },
	login: function(can, _cb, _msg) {
		can.page.ClassList.add(can, document.body.parentNode, aaa.LOGIN), can.onimport.theme(can), can.misc.CookieSessid(can, "")
		var socket = can.ondaemon._init(can, "", aaa.LOGIN, function(event, msg, cmd, arg, cb) {
			function check() {
				if (can.misc.CookieSessid(can)) { can.page.ClassList.del(can, document.body.parentNode, aaa.LOGIN)
					can.onmotion.clearFloat(can), can.onmotion.delay(can, function() { socket._close = true, socket.close() })
					return can.base.isFunc(_cb) && _cb(), _cb = null, true
				} can.core.Timer(1000, function() { check() }), can.onimport.theme(can)
			}
			if (cmd == cli.PWD) { if (check()) { return } can.page.ClassList.add(can, document.body, aaa.LOGIN), can._wss_name = can.ondaemon._list[0] = arg[0]
				var _list = [], list = {}; _msg.Table(function(value) { if (value.order == "") {} else if (value.type == mdb.PLUGIN) { _list.push(value.name), list[value.name] = function(target) {
					can.onappend.plugin(can, {space: value.space, index: value.index, args: can.core.Split(value.args), style: html.OUTPUT}, function(sub) {
						var run = sub.run; sub.run = function(event, cmds, cb) { var msg = can.request(event, {space: arg[0]}); can.page.exportValue(can, msg), run(event, cmds, cb) }
						sub.onexport.output = function() { can.page.style(can, sub._output, html.MAX_HEIGHT, ""), can.page.style(can, sub._output, html.MAX_WIDTH, "") }
					}, ui.output)
				} } else if (value.type == cli.QRCODE) { _list.push(value.name), list[value.name] = function(target) { can.page.Modify(can, target, arg[2]) } } })
				var ui = can.onappend.tabview(can, list, _list, can.page.Append(can, document.body, [{view: "input login float flex"}])._target)
				if (window.parent != window && window.innerHeight < 480) { can.onmotion.hidden(can, ui.output) }
				var _cmd = "space login "+arg[0]; ui.display = can.page.Append(can, ui._target, [html.DISPLAY])._target, can.onappend.style(can, html.FLEX, ui.display)
				can.page.Appends(can, ui.display, [{text: ["或命令行授权: ", html.LABEL]}, {text: ["$ "+_cmd, "", html.ITEM], title: "点击复制，并后台执行此命令，即可登录", style: {cursor: "copy"}, onclick: function() { can.user.copy(event, can, _cmd) }}])
				can.page.Append(can, ui.display, [{text: ["或第三方授权: ", html.LABEL]}, {view: [["sso", html.FLEX]], list: _msg.Table(function(value) {
					return value.type == "oauth" && {view: [[html.ITEM, html.FLEX]], title: "点击跳转，授权登录", list: [{img: can.misc.Resource(can, value.icons)}, {text: value.name}], onclick: function() { can.user.jumps(value.link) }}
				}) }])
				can.page.style(can, ui._target, {left: (can.page.width()-ui._target.offsetWidth)/2, top: can.page.height() < 640? (can.page.height()-ui._target.offsetHeight)/2:
					(can.page.height()-ui._target.offsetHeight-html.HEADER_HEIGHT-html.ACTION_HEIGHT)/4+html.HEADER_HEIGHT})
				cb && cb(); return true
			} else if (cmd == ice.MSG_SESSID) { if (!can.misc.CookieSessid(can, arg[0])) { can.user.info.sessid = arg[0] } check(), cb && cb(); return true }
		})
	},
	logout: function(can) { can.user.toastConfirm(can, aaa.LOGOUT, "", function() { can.runAction({}, aaa.LOGOUT, [], function(msg) {
		can.misc.CookieSessid(can, ""), can.misc.Search(can, chat.SHARE)? can.misc.Search(can, chat.SHARE, ""): can.user.reload(true)
	}) }) },
	header: function(can) { if (!can._root) { return } var header = can._root.Header
		var meta = {
			time: !can.user.isMobile && {view: [[html.ITEM, "state", mdb.TIME, html.FLEX]], _init: function(target) {
				can.onappend.figure(can, {action: "date", _hold: true}, target, function(sub, value) {})
				can.core.Timer({interval: 100}, function() { can.page.Modify(can, target, can.user.time(can, null, "%H:%M:%S %w")) })
			}},
			avatar: {view: [[html.ITEM, "state", aaa.AVATAR]], list: [{img: can.user.info.avatar}], onclick: function(event) { header && header.onaction.avatar(event, header) }},
			usernick: {view: [[html.ITEM, "state", aaa.USERNICK, html.FLEX], "", can.user.info.usernick], onclick: function(event) { header && header.onaction.usernick(event, header) }},
			qrcode: {view: [[html.ITEM, "state", cli.QRCODE]], list: [{icon: icon.qrcode}], onclick: function(event) {
				var _can = can._fields? can.sup: can; _can.onaction["生成链接"](event, _can)
				// can._root.Header.onaction.qrcode(event, can._root.Header)
			}},
		}; return can.core.List(can.base.getValid(can.core.List(arguments).slice(1), [html.SPACE, mdb.TIME, aaa.AVATAR, aaa.USERNICK, cli.QRCODE]), function(item) { return meta[item] })
	},
	email: function(can) {
		can.page.Select(can, document.body, html.IFRAME, function(target) {
			can.page.style(can, target, html.HEIGHT, can.page.height())
			can.page.style(can, target, html.WIDTH, can.page.width())
		})
	},
})
