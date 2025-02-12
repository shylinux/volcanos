setTimeout(function() { Volcanos({
	Option: function() { return [] },
    spide: function(can, msg, target) {
        if (!target) {
            msg.Push(mdb.TYPE, web.LINK)
            msg.Push(mdb.NAME, document.title)
            msg.Push(web.LINK, location.href)
        }
        var has = {}; target = target||document.body
        can.page.Select(can, target, html.AUDIO, function(target) {
            if (!target.src || has[target.src]) { return } has[target.src] = true
            var name = target.src.split("?")[0].split(nfs.PT).pop()
            msg.Push(mdb.TYPE, html.AUDIO)
            msg.Push(mdb.NAME, html.AUDIO+nfs.PT+name)
            msg.Push(web.LINK, target.src)
        })
        can.page.Select(can, target, html.VIDEO, function(target) {
            if (!target.src || has[target.src]) { return } has[target.src] = true
            var name = target.src.split("?")[0].split(nfs.PT).pop()
            msg.Push(mdb.TYPE, html.VIDEO)
            msg.Push(mdb.NAME, html.VIDEO+nfs.PT+name)
            msg.Push(web.LINK, target.src)
        })
        can.page.Select(can, target, html.IMG, function(target) {
            if (!target.src || has[target.src]) { return } has[target.src] = true
            var name = target.src.split("?")[0].split(nfs.PS).pop()
            msg.Push(mdb.TYPE, html.IMG)
            if (target.src.indexOf("data:image") == 0) {
                msg.Push(mdb.NAME, target.src.slice(target.src.length-20))
            } else {
                msg.Push(mdb.NAME, name||"image.jpg")
            }
            msg.Push(web.LINK, target.src)
        })
        can.page.Select(can, target, html.IFRAME, function(target) {
            if (!target.src || has[target.src]) { return } has[target.src] = true
            msg.Push(mdb.TYPE, html.IFRAME)
            msg.Push(mdb.NAME, "")
            msg.Push(web.LINK, target.src)
			try {
            	can.spide(can, msg, target.contentWindow.document.body)
			} catch(e) {
			}
        })
        can.page.Select(can, target, html.A, function(target) {
            msg.Push(mdb.TYPE, html.A)
            msg.Push(mdb.NAME, "")
            msg.Push(web.LINK, target.href)
        })
    },
    style: function(can, msg, arg) {
		if (arg[0] == "style")  {
			can.page.AppendStyle(can, arg[1])
		} else {
			can.core.List(arg[0].split(mdb.FS), function(item) {
				can.page.Select(can, document.body, item, function(target) {
					can.page.Modify(can, target, can.base.Obj(arg[1]))
				})
			})
		}
	},
	field: function(can, msg, arg) { can.onappend.plugin(can, {type: chat.CONTEXTS, index: arg[0], args: can.base.Obj(arg[1])}, function(sub, meta) {
		var height = can.base.Max(window.innerHeight-sub._target.offsetTop-2*html.ACTION_HEIGHT, 160), width = can.base.Max(window.innerWidth-sub._target.offsetLeft, 600)
		sub.Conf({height: height, width: width}), sub._legend.innerText = meta.help
		sub.run = function(event, cmds, cb) { msg.RunAction(event, can, cmds) || can.runActionCommand(event, meta.index, cmds, function(msg) {
			can.onmotion.toggle(can, sub._option, true), can.onmotion.toggle(can, sub._action, true), can.onmotion.toggle(can, sub._output, true), can.onmotion.toggle(can, sub._status, true)
			can.onimport.size(sub, height, width, true), can.base.isFunc(cb) && cb(msg)
		}) }
		can.onmotion.move(can, sub._target, {left: msg.Option(html.LEFT)||window.innerWidth-width, top: msg.Option(html.TOP)||window.innerHeight-height-2*html.ACTION_HEIGHT, right: msg.Option(html.RIGHT), bottom: msg.Option(html.BOTTOM)})
		sub._target.onclick = function() { can.page.Select(can, document.body, can.page.Keys("div.carte.float"), function(target) { can.page.Remove(can, target) }) }
		// sub._legend.onclick = function(event) { can.onmotion.toggle(can, sub._option), can.onmotion.toggle(can, sub._action), can.onmotion.toggle(can, sub._output), can.onmotion.toggle(can, sub._status) }
		msg.Option("selection") && can.onengine.listen(can, "onselection", function() { sub.Option(msg.Option("selection"), window.getSelection()), sub.Update() })
		sub.onaction["保存参数"] = function(event) { can.run(can.request(event, {domain: location.host, id: msg.Option(mdb.ID)}), [chat.FIELD, mdb.MODIFY, html.TOP, sub._target.offsetTop, html.LEFT, sub._target.offsetLeft, ctx.ARGS, JSON.stringify(sub.Input([], true))]) }
	}, document.body) },
    
    order: function(can, msg, arg) {
        var ui = can.user.input(event, can, [ctx.INDEX, ctx.ARGS, "selection", html.LEFT, html.TOP], function(args) {
            can.run(event, [chat.FIELD, mdb.INSERT, web.DOMAIN, location.host].concat(args), function(res) { can.user.toastSuccess(can) })
        }); can.page.style(can, ui._target, {left: 200, top: 200})
        can.page.ClassList.add(can, ui._target, chat.CONTEXTS)
    },

	info: function(can, msg, arg) {
		msg.Push("title", document.title)
		msg.Push("url", location.href)
	},
    _daemon: function(can) {
        chrome.extension.onMessage.addListener(function(req, sender, cb) { var msg = can.request(); msg.Copy(req); can.misc.Log(req.detail, msg)
            can.core.CallFunc([can, req.detail[0]||"spide"], {can: can, msg: msg, cmds: req.detail.slice(1), arg: req.detail.slice(1), cb: function() {
                delete(msg._event), delete(msg._can), cb(msg)
            }})
        })
    },
	_motion: function(can) { can.onmotion.story.auto(can, document.body)
		document.body.ondblclick = function(event) { can.onengine.signal(can, "onselection") }
		can.runAction({}, ctx.COMMAND, [], function(msg) { msg.result && msg.result[0] && can.field(can, msg, msg.result) })
	},
}, function(can) {
	can.page.theme(function(theme) {
		if (theme == html.LIGHT) {
			can.page.ClassList.add(can, document.body, html.LIGHT)
			can.page.ClassList.del(can, document.body, html.DARK)
		} else {
			can.page.ClassList.add(can, document.body, html.DARK)
			can.page.ClassList.del(can, document.body, html.LIGHT)
		}
	})
    can.run = function(event, cmds, cb) { if (cmds[0] == "_search") { return }
        var msg = can.request(event, {domain: location.host}); msg.detail = ["page"].concat(cmds)
        chrome.runtime.sendMessage(msg, function(res) { can.base.isFunc(cb) && cb(msg.Copy(res)) })
    }, can._motion(can), can._daemon(can)
}) }, 100)
