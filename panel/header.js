Volcanos(chat.ONIMPORT, {_init: function(can, msg, target) {
		can.onimport._title(can, msg, target)
		can.onimport._state(can, msg, target)
		can.onimport._avatar(can, msg, target)
		can.onimport._background(can, msg, target)
		can.onimport._search(can, msg, target)
		// can.onimport._menus(can, msg, target)
		var themeMedia = window.matchMedia("(prefers-color-scheme: light)")
		can.__theme = themeMedia.matches? html.LIGHT: html.DARK, themeMedia.addListener(function(event) {
			can.__theme = event.matches? html.LIGHT: html.DARK
			can.onengine.signal(can, "onthemechange", can.request(event, {theme: can.__theme}))
		})
	},
	_title: function(can, msg, target) { if (can.user.isMobile) { return }
		can.core.List(can.base.getValid(can.Conf(chat.TITLE)||msg.result, ["shylinux.com/x/contexts"]), function(item) {
			can.page.Append(can, target, [{view: [chat.TITLE, html.DIV, item], title: "返回主页", onclick: function(event) { can.onaction.title(event, can) }}])
		})
	},
	_state: function(can, msg, target) { if (can.user.isMobile) { return }
		can.core.List(can.base.Obj(can.Conf(chat.STATE)||msg.Option(chat.STATE), [aaa.USERNICK, aaa.AVATAR, mdb.TIME]).reverse(), function(item) {
		// can.core.List(can.base.Obj(can.Conf(chat.STATE)||msg.Option(chat.STATE), [aaa.AVATAR, aaa.USERNICK, mdb.TIME]).reverse(), function(item) {
			if (item == aaa.AVATAR ) { if (can.user.isLocalFile) { return }
				can.page.Append(can, target, [{view: can.base.join([chat.STATE, item]), list: [{img: ice.SP}], onclick: function(event) {
					can.onaction.carte(event, can, [can.page.Format(html.IMG, can.onexport.avatar(can), 160)])
				}}]); return
			}
			can.page.Append(can, target, [{view: [can.base.join([chat.STATE, item]), html.DIV, (can.Conf(item)||msg.Option(item)||"").split("@")[0].slice(0, 10)], onclick: function(event) {
				can.core.CallFunc([can.onaction, item], [event, can, item])
			}, _init: function(target) { item == mdb.TIME && can.onimport._time(can, target) }}])
		})
	},
	_avatar: function(can, msg) { can.user.isExtension || can.user.isLocalFile || can.page.Modify(can, "div.state.avatar>img", {src: can.onexport.avatar(can)}) },
	_background: function(can, msg) { can.user.isExtension || can.user.isLocalFile || can.onlayout.background(can, can.onexport.background(can)) },
	_search: function(can, msg, target) {
		can._search = can.onappend.input(can, {type: html.TEXT, name: mdb.SEARCH, onkeydown: function(event) { can.onkeymap.input(event, can)
			event.key == lang.ENTER && can.onengine.signal(can, chat.ONOPENSEARCH, can.request(event, {type: mdb.FOREACH, word: event.target.value||""}))
		}}, "", target, [chat.TITLE])
		can.user.isMobile || can.onimport.menu(can, mdb.SEARCH, function() { can.onengine.signal(can, chat.ONOPENSEARCH, can.request(event, {type: mdb.FOREACH, word: can._search.value||""})) })
	},
	_menus: function(can, msg, target) { if (can.user.mod.isPod || can.user.isMobile) { return }
		can.setHeaderMenu(can.base.Obj(can.Conf(chat.MENUS)||msg.Option(chat.MENUS), can.onaction._menus), function(event, button) {
			can.core.CallFunc(can.onaction[button]||function(event, can) { can.runAction(event, button, [], function(msg) { can.user.toastSuccess(can, button) }) }, {event: event, can: can, button: button})
		})
	},
	_time: function(can, target) { can.core.Timer({interval: 100}, function() { can.onimport.time(can, target) })
		can.onappend.figure(can, {action: "date"}, target)
	},
	time: function(can, target) { can.onimport.theme(can), target.innerHTML = can.user.time(can, null, "%w %H:%M:%S") },
	avatar: function(event, can, avatar) { if (can.user.isExtension || can.user.isLocalFile) { return }
		can.runAction(event, aaa.AVATAR, [avatar], function(msg) { can.user.info.avatar = avatar, can.onimport._avatar(can, msg), can.user.toastSuccess(can) })
	},
	background: function(event, can, background) { if (can.user.isExtension || can.user.isLocalFile) { return }
		can.runAction(event, aaa.BACKGROUND, [background], function(msg) { can.user.info.background = background, can.onimport._background(can, msg), can.user.toastSuccess(can) })
	},
	theme: function(can, theme) { theme && (can._theme = can.base.Obj(theme).join(ice.SP)), can.user.theme(can, can.onexport.theme(can)) },
	menu: function(can, cmds, cb, trans) { can.base.isString(cmds) && (cmds = [cmds])
		return can.page.Append(can, can._output, [{view: cmds[0], list: can.core.List(can.base.getValid(cmds.slice(1), [cmds[0]]), function(item) {
			if (can.base.isString(item)) { return {view: [html.MENU, html.DIV, can.user.trans(can, item, trans)], onclick: function(event) { can.base.isFunc(cb) && cb(event, item, [item]) }} }
			if (can.base.isArray(item)) {
				return {view: [html.MENU, html.DIV, can.user.trans(can, item[0], trans)], onmouseenter: function(event) {
					can.onaction.carte(event, can, item.slice(1), function(event, button, meta, index) { can.base.isFunc(cb) && cb(event, button, item) }, trans)
				}}
			} if (can.base.isObject(item)) { return item }
		}) }])._target
	},
})
Volcanos(chat.ONACTION, {
	_menus: [["setting", chat.BLACK, chat.WHITE, chat.PRINT, code.WEBPACK, web.TOIMAGE]],
	_trans: kit.Dict(
		"setting", "设置", chat.BLACK, "黑色主题", chat.WHITE, "白色主题", chat.PRINT, "打印主题", code.WEBPACK, "打包页面", web.TOIMAGE, "生成图片",
		"shareuser", "共享用户", "setnick", "设置昵称", aaa.PASSWORD, "修改密码", aaa.LANGUAGE, "语言地区", aaa.CHINESE, "中文", web.CLEAR, "清除背景", aaa.LOGOUT, "退出登录",
	),
	onsize: function(can) { can.onimport.theme(can), can.ConfHeight(can._target.offsetHeight), can.ConfWidth(can._target.offsetWidth) },
	onmain: function(can) { can.onimport.theme(can), can.onkeymap._init(can)
		can.run({}, [], function(msg) { if (!can.Conf(aaa.USERNICK, msg.Option(aaa.USERNICK)||msg.Option(ice.MSG_USERNICK)||msg.Option(ice.MSG_USERNAME))) {
			return msg.Option(chat.SSO)? can.user.jumps(msg.Option(chat.SSO)): can.user.login(can, function() { can.onengine.signal(can, chat.ONMAIN, msg) }, msg.Option(aaa.LOGIN))
		} can.user.info.usernick = can.Conf(aaa.USERNICK), can.user.info.language = can.misc.Search(can, aaa.LANGUAGE)||msg.Option(aaa.LANGUAGE)
			can.user.info.background = msg.Option(aaa.BACKGROUND), can.user.info.avatar = msg.Option(aaa.AVATAR)
			msg.Option(nfs.SCRIPT) && can.require(can.base.Obj(msg.Option(nfs.SCRIPT)), function(can) { can.onaction.source(can, msg) }) 
			can.onmotion.clear(can), can.onimport._init(can, msg, can._output), can.onengine.signal(can, chat.ONLOGIN, msg)
		})
	},
	
	onstorm_select: function(can, river, storm) { can.Conf(chat.RIVER, river), can.Conf(chat.STORM, storm) },
	onaction_cmd: function(can) { can.onappend.style(can, html.HIDE) },
	onsearch_focus: function(can) { can._search && can._search.focus() },
	onshare: function(can, msg, args) { can.user.share(can, msg, [ctx.ACTION, chat.SHARE].concat(args||[])) },
	onkeydown: function(can, msg, model) { can._keylist = can.onkeymap._parse(msg._event, can, model, can._keylist||[], can._output) },
	onwebpack: function(can, msg) { can.user.input(msg._event, can, [{name: mdb.NAME, value: can.user.title()}], function(data) {
		can.core.Item(Volcanos.meta.pack, function(key, msg) { can.core.List(["_event", "_can", "_xhr", ice.MSG_SESSID, ""], function(key) { delete(msg[key]) }) })
		can.runAction(can.request({}, {args: "name,river,storm,theme,layout", _toast: "打包中...",
			name: data.name, content: JSON.stringify(Volcanos.meta.pack), river: can.Conf(chat.RIVER), storm: can.Conf(chat.STORM), theme: can._theme, layout: can.getAction(html.LAYOUT),
		}), code.WEBPACK, [], function(msg) { can.user.download(can, web.SHARE_LOCAL+msg.Result(), name, nfs.HTML), can.user.toastSuccess(can, "打包成功", code.WEBPACK) })
	}) },

	title: function(event, can) { var args = {}; can.core.List([chat.TITLE, chat.THEME], function(key) { var value = can.misc.Search(can, key); value && (args[key] = value) }); can.user.jumps(can.misc.MergeURL(can, args, true)) },
	black: function(event, can, button) { can.onimport.theme(can, button) },
	white: function(event, can, button) { can.onimport.theme(can, button) },
	print: function(event, can, button) { can.onimport.theme(can, [chat.WHITE, button]), can.onengine.signal(can, chat.ONPRINT) },
	webpack: function(event, can) { can.onengine.signal(can, "onwebpack", can.request(event)) },
	toimage: function(event, can) { can.onmotion.clearCarte(can), can.user.toimage(can, can.user.title(), can._target.parentNode) },

	carte: function(event, can, list, cb, trans) { can.user.carte(event, can, can.onaction, list, cb, null, trans) },
	share: function(event, can, args) { can.user.share(can, can.request(event), [ctx.ACTION, chat.SHARE].concat(args||[])) },

	usernick: function(event, can) { if (can.user.mod.isPod || can.user.isExtension || can.user.isLocalFile) { return }
		can.onaction.carte(event, can, ["shareuser", "setnick", aaa.PASSWORD, [aaa.LANGUAGE, aaa.CHINESE, aaa.ENGLISH], cli.CLEAR, aaa.LOGOUT])
	},
	shareuser: function(event, can) { can.user.share(can, can.request(event), [ctx.ACTION, chat.SHARE, mdb.TYPE, aaa.LOGIN]) },
	setnick: function(event, can) { can.user.input(event, can, [{name: aaa.USERNICK, value: can.Conf(aaa.USERNICK)}], function(list) { can.runAction(event, aaa.USERNICK, [list[0]], function(msg) {
		can.page.Select(can, can._output, can.core.Keys(html.DIV, aaa.USERNICK), function(item) { can.page.Modify(can, item, can.Conf(aaa.USERNICK, list[0])) }), can.user.toastSuccess(can)
	}) }) },
	password: function(event, can) { var ui = can.user.input(event, can, [{name: html.PASSWORD, type: html.PASSWORD, action: ice.AUTO}, {name: html.PASSWORD, type: html.PASSWORD, action: ice.AUTO}], function(list) {
		if (list[0] != list[1]) { return can.user.toast(can, "密码不一致"), ui.focus(), true } can.runAction(event, aaa.PASSWORD, [list[0]], function() { can.user.toastSuccess(can) })
	}) },
	chinese: function(event, can) { can.runAction(event, aaa.LANGUAGE, ["zh"], function(msg) { can.user.reload() }) },
	english: function(event, can) { can.runAction(event, aaa.LANGUAGE, ["en"], function(msg) { can.user.reload() }) },
	clear: function(event, can) { can.onimport.background(event, can, ""), can.onimport.avatar(event, can, "") },
	logout: function(event, can) { can.user.logout(can) },
})
Volcanos(chat.ONEXPORT, {height: function(can) { return can._target.offsetHeight },
	theme: function(can) {
		return can._theme || can.misc.Search(can, chat.THEME) || can.misc.localStorage(can, "can.theme") || can.__theme || (can.base.isNight()? "dark": "light")
	},
	background: function(can) { return can.user.info.background == "void"? "": can.user.info.background },
	avatar: function(can) { return can.user.info.avatar == "void"? "": can.user.info.avatar },
})
Volcanos(chat.ONKEYMAP, {_init: function(can, target) { can.onkeymap._build(can) },
	_mode: { normal: {
		b: function(event, can) { can.search(event, ["Header.onaction.black"]) },
		w: function(event, can) { can.search(event, ["Header.onaction.white"]) },
		p: function(event, can) { can.search(event, ["Header.onaction.print"]) },
		c: function(event, can) { can.user.toimage(can, can.user.title(), can._target.parentNode, true) },
		
		":": function(event, can) { can.onengine.signal(can, chat.ONCOMMAND_FOCUS), can.onkeymap.prevent(event) },
		" ": function(event, can) { can.onengine.signal(can, chat.ONSEARCH_FOCUS), can.onkeymap.prevent(event) },
		Enter: function(event, can) { can.onengine.signal(can, chat.ONOPENSEARCH, can.request(event)) },
		Escape: function(event, can) { can.onmotion.clearFloat(can) },
	}, }, _engine: {},
})
Volcanos(chat.ONPLUGIN, {
	title: shy("应用标题", [chat.TITLE], function(can, msg, arg) {
		msg.Echo(can.user.title(arg[0]))
	}),
	theme: shy("界面主题", {
		_init: function(can) { can.Option(chat.THEME, can.getHeader(chat.THEME)) },
	}, ["theme:select=auto,dark,light,white,black,print", ice.RUN], function(can, msg, arg) {
		if (arg[0] == "auto") { arg[0] = "", can._theme = "" }
		if (arg.length > 0) { can.misc.localStorage(can, "can.theme", arg[0]) }
		msg.Echo(can.onimport.theme(can, arg[0]))
	}),
	location: shy("请求地址", {
		copy: function(can) { can.user.copy(msg._event, can, location.href) },
	}, [mdb.LINK, ice.LIST, ice.COPY], function(can, msg, cb) {
		can.runAction(can.request({}, kit.Dict(mdb.LINK, location.href)), web.SHARE, [], function(res) {
			msg.Echo(res.Append(mdb.TEXT)).Status(kit.Dict(mdb.LINK, res.Append(mdb.NAME))), can.base.isFunc(cb) && cb(msg)
		}) 
	}),
	cookie: shy("请求参数", [mdb.NAME, mdb.VALUE, ice.LIST, ice.BACK], function(can, msg, arg) {
		arg.length > 1 && can.misc.Cookie(can, arg[0], arg[1])
		can.core.Item(can.misc.Cookie(can), function(key, value) { if (!key || !value || arg[0] && key != arg[0]) { return }
			msg.Push(mdb.NAME, key), msg.Push(mdb.VALUE, value)
		}), msg.StatusTimeCount()
	}),
	avatar: shy("用户头像", [mdb.LINK], function(can, sub, cb) {
		can.page.Append(can, sub._output, [{img: can.user.info.avatar, style: kit.Dict(html.MAX_HEIGHT, sub.ConfHeight(), html.MAX_WIDTH, sub.ConfWidth())}])
	}),
	background: shy("背景图片", [mdb.LINK], function(can, sub, cb) {
		can.page.Append(can, sub._output, [{img: can.user.info.background, style: kit.Dict(html.MAX_HEIGHT, sub.ConfHeight(), html.MAX_WIDTH, sub.ConfWidth())}])
	}),
	language: shy("语言地区", {
		_init: function(can) { can.Option(aaa.LANGUAGE, can.user.info.language||"zh") },
	}, ["language:select=auto,zh,en", ice.RUN], function(can, msg, arg) {
		if (arg[0] == "auto") { arg[0] = "" }
		if (arg.length > 0) { can.misc.localStorage(can, "can.language", arg[0]) }
		can.runAction(event, aaa.LANGUAGE, [arg[0]], function(msg) { can.user.reload() }) 
	}),
	logout: shy("退出登录", kit.Dict(
		aaa.LOGOUT, shy("退出", function(can) { can.user.logout(can._root.Header, true) })
	), [aaa.LOGOUT]),
})
