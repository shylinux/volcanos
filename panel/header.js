Volcanos(chat.ONIMPORT, {_init: function(can, msg, target) {
		can.onimport._title(can, msg, target), can.onimport._state(can, msg, target), can.onimport._avatar(can, msg, target), can.onimport._background(can, msg, target), can.onimport._search(can, msg, target)
	},
	_title: function(can, msg, target) { can.user.isMobile || can.core.List(can.base.getValid(can.Conf(chat.TITLE)||(can.user.isExtension? "contexts": location.host)||msg.result, [location.host]), function(item) {
		can.page.Append(can, target, [{view: [[html.ITEM, chat.TITLE], "", item], title: "返回主页", onclick: function(event) { can.onaction.title(event, can) }}])
	}) },
	_state: function(can, msg, target) { can.core.List(can.base.Obj(can.Conf(chat.STATE)||msg.Option(chat.STATE), [aaa.USERNICK, aaa.AVATAR, mdb.TIME]).reverse(), function(item) {
		if (item == aaa.AVATAR ) { can.user.isLocalFile || can.page.Append(can, target, [{view: [[html.ITEM, chat.STATE, item]], list: [{img: lex.SP}], onclick: function(event) {
			can.core.CallFunc([can.onaction, item], [event, can, item])
		}}]); return }
		if (can.user.isMobile && item == mdb.TIME) { return }
		can.page.Append(can, target, [{view: [[html.ITEM, chat.STATE, item], "", (can.Conf(item)||msg.Option(item)||"").split(ice.AT)[0].slice(0, 10)], onclick: function(event) {
			can.core.CallFunc([can.onaction, item], [event, can, item])
		}, _init: function(target) { item == mdb.TIME && can.onimport._time(can, target) }}])
	}) },
	_avatar: function(can, msg) { can.user.isExtension || can.user.isLocalFile || can.page.Modify(can, "div.state.avatar>img", {src: can.onexport.avatar(can)}) },
	_background: function(can, msg) { if (can.user.isExtension || can.user.isLocalFile) { return }
		can.onlayout.background(can, can.onexport.background(can))
		// window.parent == window? can.onlayout.background(can, can.onexport.background(can)): can.page.style(can, document.body, html.BACKGROUND_COLOR, "transparent")
	},
	_search: function(can, msg, target) {
		can._search = can.onappend.input(can, {type: html.TEXT, icon: icon.SEARCH, name: mdb.SEARCH, value: can.misc.Search(can, "_search"), onkeydown: function(event) { can.onkeymap.input(event, can)
			event.key == code.ENTER && can.onengine.signal(can, chat.ONOPENSEARCH, can.request(event, {type: mdb.FOREACH, word: event.target.value||""}))
		}}, "", target, [chat.TITLE])
		can.onimport.menu(can, mdb.SEARCH, function() { can.onengine.signal(can, chat.ONOPENSEARCH, can.request(event, {type: mdb.FOREACH, word: can._search.value||""})) })
	},
	_time: function(can, target) { can.core.Timer({interval: 100}, function() { can.onimport.time(can, target) }), can.onappend.figure(can, {action: "date"}, target) },
	time: function(can, target) { can.onimport.theme(can), target.innerHTML = can.user.time(can, null, can.Conf(mdb.TIME)||"%H:%M:%S %w") },
	avatar: function(event, can, avatar) { can.user.isExtension || can.user.isLocalFile || can.runAction(event, aaa.AVATAR, [avatar], function(msg) {
		can.user.info.avatar = avatar, can.onimport._avatar(can, msg), can.user.toastSuccess(can)
	}) },
	background: function(event, can, background) { can.user.isExtension || can.user.isLocalFile || can.runAction(event, aaa.BACKGROUND, [background], function(msg) {
		can.user.info.background = background, can.onimport._background(can, msg), can.user.toastSuccess(can)
	}) },
	language: function(can, language) { can.runAction(event, aaa.LANGUAGE, [language == ice.AUTO? "": language], function(msg) {
		can.user.toastConfirm(can, "reload page for "+language, "language", function() { can.user.reload(true) })
	}) },
	theme: function(can, theme) { theme && can.runAction({}, "theme", [theme])
		theme && can.misc.localStorage(can, "can.theme", can._theme = theme == ice.AUTO? "": theme) && can.onengine.signal(can, chat.ONTHEMECHANGE, can.request(event, {theme: theme})), can.user.theme(can, can.onexport.theme(can))
	},
	menu: function(can, cmds, cb, trans) { can.base.isString(cmds) && (cmds = [cmds])
		return can.page.Append(can, can._output, [{view: cmds[0], list: can.core.List(can.base.getValid(cmds.slice(1), [cmds[0]]), function(item) {
			return can.base.isString(item)? /* 1.string */ {view: [[html.ITEM, html.MENU], "", can.user.trans(can, item, trans)], onclick: function(event) { can.base.isFunc(cb) && cb(event, item, [item]) }}:
				can.base.isArray(item)? /* 2.array */ {view: [[html.ITEM, html.MENU], "", can.user.trans(can, item[0], trans)], onclick: function(event) { can.onkeymap.prevent(event)
					can.onaction.carte(event, can, item.slice(1), function(event, button, meta) { can.base.isFunc(cb) && cb(event, button, item) }, trans)
				}}: /* 3.others */ item
		}) }])._target
	},
})
Volcanos(chat.ONACTION, {_init: function(can) {
		can.page.theme(function(theme) { can.onengine.signal(can, chat.ONTHEMECHANGE, can.request(event, {theme: can.__theme = theme})) }), can.onimport.theme(can)
	},
	onsize: function(can) { can.ConfHeight(can._target.offsetHeight), can.ConfWidth(can._target.offsetWidth) },
	onmain: function(can) {
		function lang(msg, cb) { can.user.info.language = msg.SearchOrOption(aaa.LANGUAGE)
			can.user.info.language? can.require(["src/template/web.chat.header/language/"+can.user.info.language+".js"], cb, function(can, name, sub) { can.base.Copy(can.user._trans, sub._trans) }): cb && cb()
		}
		function show(msg) { var p = can.misc.Search(can, "redirect_uri")
			if (location.pathname == "/login" && p) { return location.replace(can.base.MergeURL(p, ice.MSG_SESSID, can.misc.CookieSessid(can))) }
			can.user.info.usernick = can.Conf(aaa.USERNICK), can.user.info.userrole = msg.Option(ice.MSG_USERROLE), can.user.info.avatar = msg.Option(aaa.AVATAR), can.user.info.background = msg.Option(aaa.BACKGROUND)
			can.user.info.repos = msg.Option("spide.hub")
			can.user.info.email = msg.Option("email")
			msg.Option(nfs.SCRIPT) && can.require(can.base.Obj(msg.Option(nfs.SCRIPT)), function(can) { can.onaction.source(can, msg) }) 
			lang(msg, function() { can.onmotion.clear(can), can.onimport._init(can, can.request(), can._output), can.onengine.signal(can, chat.ONLOGIN) })
		}
		can.run(can.request({}, {_method: web.GET}), [], function(msg) { lang(msg)
			can.require(can.core.List(msg["theme.list"], function(item) { return "src/template/web.chat.header/theme/"+item }))
			can.onaction._menus[1] = can.onaction._menus[1].concat(can.core.List(msg["theme.list"], function(item) { if (item == "mobile.css") { return } return can.base.trimSuffix(item, ".css") }))
			can.onaction._menus[2] = can.onaction._menus[2].concat(can.core.List(msg["language.list"], function(item) { return can.base.trimSuffix(item, ".js") }))
			if (can.base.beginWith(location.pathname, "/wiki/portal/", "/chat/cmd/web.wiki.portal/", "/chat/cmd/web.chat.oauth.client", "/chat/pod/20230511-golang-story/cmd/web.code.gitea.client")) { return show(msg) }
			if (location.pathname == "/" && can.base.beginWith(msg.Option(ice.MAIN)||"", "/wiki/portal/", "/chat/cmd/web.wiki.portal/")) { return show(msg) }
			if (!can.Conf(aaa.USERNICK, msg.Option(aaa.USERNICK)||msg.Option(ice.MSG_USERNICK)||msg.Option(ice.MSG_USERNAME))) {
				return msg.Option(chat.SSO)? can.user.jumps(msg.Option(chat.SSO)): can.user.login(can, function() { can.onengine.signal(can, chat.ONMAIN, msg) }, msg.Option(aaa.LOGIN))
			} show(msg)
		})
	},
	onstorm_select: function(can, river, storm) { can.Conf(chat.RIVER, river), can.Conf(chat.STORM, storm) },
	onaction_cmd: function(can) { can.onappend.style(can, html.HIDE) },
	onsearch_focus: function(can) { can._search && can._search.focus() },
	onshare: function(can, msg, args) { can.user.share(can, msg, [ctx.ACTION, chat.SHARE].concat(args||[])) },
	onwebpack: function(can, msg) { can.user.input(msg._event, can, [{name: mdb.NAME, value: can.user.title()}], function(data) {
		can.core.Item(Volcanos.meta.pack, function(key, msg) { can.core.List(["_event", "_can", "_xhr", ""], function(key) { delete(msg[key]) }) })
		can.runAction(can.request({}, {args: "name,river,storm,title,theme,layout", _toast: "打包中...", content: JSON.stringify(Volcanos.meta.pack),
			name: data.name, river: can.Conf(chat.RIVER), storm: can.Conf(chat.STORM), theme: can._theme, title: can.user.title(), layout: can.getAction(html.LAYOUT),
		}), code.WEBPACK, [], function(msg) { can.user.download(can, web.SHARE_LOCAL+msg.Result(), name, nfs.HTML), can.user.toastSuccess(can, "打包成功", code.WEBPACK) })
	}) },

	title: function(event, can) { var args = {};
		can.core.List(can.onaction._params, function(key) { var value = can.misc.Search(can, key); value && (args[key] = value) })
		var msg = can.request(event); can.onengine.signal(can, "ontitle", msg)
		can.core.List(msg.Append(), function(key) { args[key] = msg.Append(key) })
		can.user.jumps(can.misc.MergeURL(can, args, true))
	},
	carte: function(event, can, list, cb, trans) { return can.user.carte(event, can, can.onaction, list, cb, null, trans) },
	share: function(event, can, args) { can.user.share(can, can.request(event), [ctx.ACTION, chat.SHARE].concat(args||[])) },
	avatar: function(event, can) { can.onaction.carte(event, can, [can.page.Format(html.IMG, can.onexport.avatar(can), can.page.height()/2)]) },
	usernick: function(event, can) { can.onaction.carte(event, can, can.onaction._menus) },
	shareuser: function(event, can) { can.user.share(can, can.request(event), [ctx.ACTION, chat.SHARE, mdb.TYPE, aaa.LOGIN, mdb.NAME, can.user.title(), mdb.TEXT, location.href]) },
	toimage: function(event, can) { can.onmotion.clearCarte(can), can.user.toimage(can, can.user.title(), can._target.parentNode) },
	webpack: function(event, can) { can.onengine.signal(can, chat.ONWEBPACK, can.request(event)) },
	setnick: function(event, can) { can.user.input(event, can, [{name: aaa.USERNICK, value: can.Conf(aaa.USERNICK)}], function(list) { can.runAction(event, aaa.USERNICK, [list[0]], function(msg) {
		can.page.Select(can, can._output, can.core.Keys(html.DIV, aaa.USERNICK), function(item) { can.page.Modify(can, item, can.Conf(aaa.USERNICK, list[0])) }), can.user.toastSuccess(can)
	}) }) },
	password: function(event, can) { var ui = can.user.input(event, can, [{name: html.PASSWORD, type: html.PASSWORD, action: ice.AUTO}, {name: html.PASSWORD, type: html.PASSWORD, action: ice.AUTO}], function(list) {
		if (list[0] != list[1]) { return can.user.toast(can, "密码不一致"), ui.focus(), true } can.runAction(event, aaa.PASSWORD, [list[0]], function() { can.user.toastSuccess(can) })
	}) },
	clear: function(event, can) { can.onimport.background(event, can, ""), can.onimport.avatar(event, can, "") },
	logout: function(event, can) { can.user.logout(can) },
	email: function(event, can) {
		can.user.input(can.request(event, {to: can.user.info.email, subject: can.user.title()}), can, ["to", "subject","content"], function(args) {
			can.runAction(event, aaa.EMAIL, args, function() { can.user.toastSuccess(can) })
		})
	},
	fullscreen: function(event, can) { document.body.requestFullscreen() },
	
	_params: [log.DEBUG, chat.TITLE],
	_menus: ["shareuser",
		[chat.THEME, ice.AUTO],
		[aaa.LANGUAGE, ice.AUTO],
		[nfs.SAVE, aaa.EMAIL, web.TOIMAGE, code.WEBPACK],
		[aaa.USER, "setnick", aaa.PASSWORD, cli.CLEAR, aaa.LOGOUT],
		"fullscreen",
	],
	_trans: kit.Dict(
		"shareuser", "共享用户", chat.THEME, "界面主题", aaa.LANGUAGE, "语言地区", nfs.SAVE, "保存网页", web.TOIMAGE, "生成图片", code.WEBPACK, "打包页面",
		aaa.USER, "用户信息", "setnick", "设置昵称", aaa.PASSWORD, "修改密码", web.CLEAR, "清除背景", aaa.LOGOUT, "退出登录",
		aaa.EMAIL, "发送邮件",
		
	),
})
Volcanos(chat.ONEXPORT, {height: function(can) { return can._target.offsetHeight },
	avatar: function(can) { return can.user.info.avatar == "void"? "": can.user.info.avatar },
	background: function(can) { return can.user.info.background == "void"? "": can.user.info.background },
	theme: function(can) { return can._theme || can.misc.SearchOrConf(can, chat.THEME) || can.__theme || (can.base.isNight()? html.DARK: html.LIGHT) },
})
Volcanos(chat.ONPLUGIN, {
	cookie: shy("会话参数", {
		create: shy([mdb.NAME, mdb.VALUE], function(can, name, value) { can.misc.Cookie(can, name, value) }),
		remove: shy(function(can, name) { name && can.misc.Cookie(can, name, "") }),
		modify: shy(function(can, msg, arg) { if (arg[0] == mdb.VALUE) { can.misc.Cookie(can, msg.Option(mdb.NAME), arg[1]) } else {
			can.misc.Cookie(can, arg[1], msg.Option(mdb.VALUE)), can.misc.Cookie(can, msg.Option(mdb.NAME), "")
		} }),
	}, [web.FILTER, ice.LIST, mdb.CREATE], function(can, msg, arg) { msg.Defer(function() { msg.PushAction(mdb.REMOVE).StatusTimeCount() })
		can.core.Item(can.misc.Cookie(can), function(name, value) { can.base.contains(name, arg[0]) && msg.Push(mdb.NAME, name).Push(mdb.VALUE, value) })
	}),
	localStorage: shy("本地存储", {
		create: shy([mdb.NAME, mdb.VALUE], function(can, name, value) { can.misc.localStorage(can, name, value) }),
		remove: shy(function(can, name) { name && can.misc.localStorage(can, name, "") }),
		modify: shy(function(can, msg, arg) { if (arg[0] == mdb.VALUE) { can.misc.localStorage(can, msg.Option(mdb.NAME), arg[1]) } else {
			can.misc.localStorage(can, arg[1], msg.Option(mdb.VALUE)), can.misc.localStorage(can, msg.Option(mdb.NAME), "")
		} }),
	}, [web.FILTER, ice.LIST, mdb.CREATE], function(can, msg, arg) { msg.Defer(function() { msg.PushAction(mdb.REMOVE).StatusTimeCount() })
		can.core.Item(can.misc.localStorage(can), function(name, value) { can.base.contains(name, arg[0]) && msg.Push(mdb.NAME, name).Push(mdb.VALUE, value) })
	}),
	sessionStorage: shy("会话存储", {
		create: shy([mdb.NAME, mdb.VALUE], function(can, name, value) { can.misc.sessionStorage(can, name, value) }),
		remove: shy(function(can, name) { name && can.misc.sessionStorage(can, name, "") }),
		prunes: shy(function(can, name) { can.core.Item(can.misc.sessionStorage(can), function(key, value) { can.misc.sessionStorage(can, key, "") }) }),
		modify: shy(function(can, msg, arg) { if (arg[0] == mdb.VALUE) { can.misc.sessionStorage(can, msg.Option(mdb.NAME), arg[1]) } else {
			can.misc.sessionStorage(can, arg[1], msg.Option(mdb.VALUE)), can.misc.sessionStorage(can, msg.Option(mdb.NAME), "")
		} }),
	}, [web.FILTER, ice.LIST, mdb.CREATE, mdb.PRUNES], function(can, msg, arg) { msg.Defer(function() { msg.PushAction(mdb.REMOVE).StatusTimeCount() })
		can.core.Item(can.misc.sessionStorage(can), function(name, value) { can.base.contains(name, arg[0]) && msg.Push(mdb.NAME, name).Push(mdb.VALUE, value) })
	}),
	location: shy("请求地址", {copy: function(can) { can.user.copy(msg._event, can, location.href) }}, [mdb.LINK, ice.LIST, ice.COPY], function(can, msg, cb) {
		can.runAction(can.request({}, kit.Dict(mdb.LINK, location.href)), web.SHARE, [], function(res) {
			msg.Echo(res.Append(mdb.TEXT)).Status(kit.Dict(mdb.LINK, res.Append(mdb.NAME))), can.base.isFunc(cb) && cb(msg)
		}) 
	}),
	avatar: shy("用户头像", function(can, sub, cb) { can.page.Append(can, sub._output, [{img: can.user.info.avatar, style: kit.Dict(html.MAX_HEIGHT, sub.ConfHeight(), html.MAX_WIDTH, sub.ConfWidth())}]) }),
	background: shy("背景图片", function(can, sub, cb) { can.page.Append(can, sub._output, [{img: can.user.info.background, style: kit.Dict(html.MAX_HEIGHT, sub.ConfHeight(), html.MAX_WIDTH, sub.ConfWidth())}]) }),
	language: shy("语言地区", {_init: function(can) { can.Option(aaa.LANGUAGE, can.user.info.language||ice.AUTO) }}, ["language:select=auto,zh,en", ice.RUN], function(can, msg, arg) { can.onimport.language(can, arg[0]) }),
	title: shy("网页标题", [chat.TITLE], function(can, msg, arg) { msg.Echo(can.user.title(arg[0])) }),
	theme: shy("界面主题", {
		_init: function(can) { can.Option(chat.THEME, can.getHeader(chat.THEME)) },
		save: function(can, sup) {
			can.user.downloads(can, sup._themes[can.Option("theme")], can.Option("theme"), "css")
		},
	}, ["theme:select=auto,dark,light,print,white,black", ice.RUN, nfs.SAVE], function(can, msg, arg) {
		if (arg[0] == ice.AUTO) { arg[0] = "", can._theme = "" } can.misc.localStorage(can, "can.theme", arg[0]), can.onimport.theme(can, arg[0])
	}),
	logout: shy("退出登录", kit.Dict(aaa.LOGOUT, shy("退出", function(can) { can.user.logout(can._root.Header) })), [aaa.LOGOUT]),
})
