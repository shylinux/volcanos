setTimeout(function() { Volcanos({
	Option: function() { return [] },
    spide: function(can, msg, target) {
        if (!target) {
            msg.Push(mdb.TYPE, mdb.LINK)
            msg.Push(mdb.NAME, document.title)
            msg.Push(mdb.LINK, location.href)
        }
        var has = {}; target = target||document.body
        can.page.Select(can, target, html.AUDIO, function(target) {
            if (!target.src || has[target.src]) { return } has[target.src] = true
            var name = target.src.split("?")[0].split(ice.PT).pop()
            msg.Push(mdb.TYPE, html.AUDIO)
            msg.Push(mdb.NAME, html.AUDIO+ice.PT+name)
            msg.Push(mdb.LINK, target.src)
        })
        can.page.Select(can, target, html.VIDEO, function(target) {
            if (!target.src || has[target.src]) { return } has[target.src] = true
            var name = target.src.split("?")[0].split(ice.PT).pop()
            msg.Push(mdb.TYPE, html.VIDEO)
            msg.Push(mdb.NAME, html.VIDEO+ice.PT+name)
            msg.Push(mdb.LINK, target.src)
        })
        can.page.Select(can, target, html.IMG, function(target) {
            if (!target.src || has[target.src]) { return } has[target.src] = true
            var name = target.src.split("?")[0].split(ice.PS).pop()
            msg.Push(mdb.TYPE, html.IMG)
            if (target.src.indexOf("data:image") == 0) {
                msg.Push(mdb.NAME, target.src.slice(target.src.length-20))
            } else {
                msg.Push(mdb.NAME, name||"image.jpg")
            }
            msg.Push(mdb.LINK, target.src)
        })
        can.page.Select(can, target, html.IFRAME, function(target) {
            if (!target.src || has[target.src]) { return } has[target.src] = true
            msg.Push(mdb.TYPE, html.IFRAME)
            msg.Push(mdb.NAME, "")
            msg.Push(mdb.LINK, target.src)
            can.spide(can, msg, target.contentWindow.document.body)
        })
        can.page.Select(can, target, html.A, function(target) {
            msg.Push(mdb.TYPE, html.A)
            msg.Push(mdb.NAME, "")
            msg.Push(mdb.LINK, target.href)
        })
    },
    style: function(can, msg, arg) {
        can.core.List(arg[0].split(ice.FS), function(item) {
            can.page.Select(can, document.body, item, function(target) {
                can.page.Modify(can, target, can.base.Obj(arg[1]))
            })
        })
	},
	field: function(can, msg, arg) {
		can.onappend.plugin(can, {type: chat.CONTEXTS, index: arg[0], args: can.base.Obj(arg[1])}, function(sub, meta) {
			sub.run = function(event, cmds, cb) { msg.RunAction(event, can, cmds) || can.runActionCommand(event, meta.index, cmds, function(msg) {
				can.onmotion.toggle(can, sub._option, true), can.onmotion.toggle(can, sub._action, true), can.onmotion.toggle(can, sub._output, true), can.onmotion.toggle(can, sub._status, true)
				can.page.style(can, sub._output, html.MAX_HEIGHT, window.innerHeight-sub._target.offsetTop-2*html.ACTION_HEIGHT, html.MAX_WIDTH, window.innerWidth-sub._target.offsetLeft)
				can.base.isFunc(cb) && cb(msg)
			}) }
			can.onmotion.move(can, sub._target, {left: msg.Option(html.LEFT), top: msg.Option(html.TOP), right: msg.Option(html.RIGHT), bottom: msg.Option(html.BOTTOM)})
			sub._legend.onclick = function(event) { can.onmotion.toggle(can, sub._option), can.onmotion.toggle(can, sub._action), can.onmotion.toggle(can, sub._output), can.onmotion.toggle(can, sub._status) }
			msg.Option("selection")? can.onengine.listen(can, "onselection", function() { sub.Option(msg.Option("selection"), window.getSelection()), sub.Update() }): sub._legend.onclick()
			sub.onaction["保存参数"] = function(event) { can.run(can.request(event, {domain: location.host, id: msg.Option(mdb.ID)}), [chat.FIELD, mdb.MODIFY, html.TOP, sub._target.offsetTop, html.LEFT, sub._target.offsetLeft, ctx.ARGS, JSON.stringify(sub.Input([], true))]) }
		}, document.body)
	},
    
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
    can.run = function(event, cmds, cb) { if (cmds[0] == "_search") { return }
        var msg = can.request(event, {domain: location.host}); msg.detail = can.misc.concat(can, ["page"], cmds)
        chrome.runtime.sendMessage(msg, function(res) { can.base.isFunc(cb) && cb(msg.Copy(res)) })
    }, can._motion(can), can._daemon(can)
}) }, 100)
