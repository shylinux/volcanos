setTimeout(function() { Volcanos({Option: function() { return [] },
    spide: function(can, msg, _target) {
        if (!_target) {
            msg.Push(mdb.TYPE, mdb.LINK)
            msg.Push(mdb.NAME, document.title)
            msg.Push(mdb.LINK, location.href)
        }

        var has = {}; _target = _target||can._root._target
        can.page.Select(can, _target, html.IFRAME, function(item) {
            if (!item.src || has[item.src]) { return } has[item.src] = true

            msg.Push(mdb.TYPE, html.IFRAME)
            msg.Push(mdb.NAME, "")
            msg.Push(mdb.LINK, item.src)

            can.spide(can, msg, item.contentWindow.document.body)
        })
        can.page.Select(can, _target, html.VIDEO, function(item) {
            if (!item.src || has[item.src]) { return } has[item.src] = true
            var name = item.src.split("?")[0].split(ice.PT).pop()
            var p = can.page.Select(can, _target, "p.title")[0]

            msg.Push(mdb.TYPE, html.VIDEO)
            msg.Push(mdb.NAME, (p && p.innerText || html.VIDEO)+ice.PT+name)
            msg.Push(mdb.LINK, item.src)
        })

        can.page.Select(can, _target, html.IMG, function(item) {
            if (!item.src || has[item.src]) { return } has[item.src] = true
            var name = item.src.split("?")[0].split(ice.PS).pop()

            msg.Push(mdb.TYPE, html.IMG)
            if (item.src.indexOf("data:image") == 0) {
                msg.Push(mdb.NAME, item.src.slice(item.src.length-20))
            } else {
                msg.Push(mdb.NAME, name||"image.jpg")
            }
            msg.Push(mdb.LINK, item.src)
        })
    },
    change: function(can, msg, arg) {
        arg.length > 1 && can.page.Modify(can, arg[0], can.base.Obj(arg[1]))
        arg.length > 0 && can.page.Select(can, can._root._target, arg[0], function(item) {
            msg.Push(mdb.TEXT, item.outerHTML)
        })
    },
    
    order: function(can, msg, arg) {
        var ui = can.user.input(event, can, [ctx.INDEX, ctx.ARGS, "selection", html.LEFT, html.TOP], function(event, button, data, list, args) {
            can.run(event, [chat.FIELD, mdb.INSERT, mdb.ZONE, location.host].concat(args), function(res) {
                can.user.toastSuccess(can)
            })
        }); can.page.style(can, ui._target, {left: 200, top: 200})
        can.page.ClassList.add(can, ui._target, chat.CONTEXTS)
    },
    field: function(can, msg, arg) {
        can.onappend.plugin(can, {type: chat.CONTEXTS, index: arg[0], args: can.base.Obj(arg[1])}, function(sub, meta) {
            var pos = {left: msg.Option(html.LEFT), top: msg.Option(html.TOP), right: msg.Option(html.RIGHT), bottom: msg.Option(html.BOTTOM)}
            can.page.style(can, sub._target, pos)
            can.onmotion.move(can, sub._target, pos, function(target) {
				can.page.style(can, sub._output,
					html.MAX_HEIGHT, can._root._height-target.offsetTop-80,
					html.MAX_WIDTH, can._root._width-target.offsetLeft-20,
				)
            })

            sub._legend.onclick = function(event) {
                can.onmotion.toggle(can, sub._option)
                can.onmotion.toggle(can, sub._action)
                can.onmotion.toggle(can, sub._output)
                can.onmotion.toggle(can, sub._status)
            }, msg.Option("selection")||sub._legend.onclick()

            sub.run = function(event, cmds, cb) { if (msg.RunAction(event, can, cmds)) { return }
                can.run(event, can.misc.concat(can, [ctx.ACTION, ice.RUN, meta.index], cmds), cb)
            }

            msg.Option("selection") && (can.onengine.listen(can, "onselection", function() {
                sub.Option(msg.Option("selection"), window.getSelection()), sub.Update()
            }))

            sub.onaction["保存参数"] = function(event) {
                can.request(event, {zone: location.host, id: msg.Option(mdb.ID)})
                can.run(event, [chat.FIELD, mdb.MODIFY, html.TOP, sub._target.offsetTop])
                can.run(event, [chat.FIELD, mdb.MODIFY, html.LEFT, sub._target.offsetLeft])
                can.run(event, [chat.FIELD, mdb.MODIFY, ctx.ARGS, JSON.stringify(sub.Input([], true))])
                can.user.toastSuccess(can)
            }
        }, can._root._target)
    },
    style: function(can, msg, arg) {
        can.core.List(arg[0].split(ice.FS), function(item) {
            can.page.Select(can, can._root._target, item, function(target) {
                can.page.Modify(can, target, can.base.Obj(arg[1]))
            })
        })
    },

    _daemon: function(can) {
        chrome.extension.onMessage.addListener(function(req, sender, cb) { var msg = can.request(); msg.Copy(req); can.misc.Log(req.detail, msg)
            can.core.CallFunc([can, req.detail[3]||"spide"], {can: can, msg: msg, cmds: req.detail.slice(4), arg: req.detail.slice(4), cb: function() {
                delete(msg._event), delete(msg._can), cb(msg)
            }})
        })
    },
    _motion: function(can) { can.onmotion.float.auto(can, can._root._target)
        document.body.ondblclick = function(event) { can.onengine.signal(can, "onselection") }

        can.run({}, [ctx.ACTION, ctx.COMMAND], function(msg) {
            msg.result && msg.result[0] && can.field(can, msg, msg.result)
        })
    },
}, function(can) {
    can.run = function(event, cmds, cb) { if (cmds[0] == "_search") { return }
        var msg = can.request(event, {host: location.host}); msg.detail = can.misc.concat(can, ["page"], cmds)
        chrome.runtime.sendMessage(msg, function(res) { can.base.isFunc(cb) && cb(msg.Copy(res)) })
    }, can._daemon(can), can._motion(can)
}) }, 1)
