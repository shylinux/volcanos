Volcanos("onimport", {help: "导入数据", _init: function(can, args, cb) { var history = []
    function show(msg, word) { if (!msg) { return } history.push(msg); var sub = msg._can; sub.Option("word", word||msg._word)
        sub.onmotion.clear(sub), sub.onappend.table(sub, msg, function(value, key, index, line) {
            return {text: ["", html.TD], list: [{text: [can.page.replace(can, value, ice.PWD, ""), html.DIV]}], onclick: function(event) {
                line.line && can.onimport.tabview(can, can.Option(nfs.PATH), line.file.replace(ice.PWD, ""), parseInt(line.line))
            }}
        }, sub._output), sub.onappend._status(sub, msg.Option(ice.MSG_STATUS)), can.Status("标签数", msg.Length())
    }
    can.onengine.plugin(can, "can.code.inner.search", shy("搜索", {}, [
        {type: html.TEXT, name: "word", value: cli.MAIN}, {type: html.BUTTON, name: nfs.FIND}, {type: html.BUTTON, name: "last"},
    ], function(msg, cmds, cb) { can.misc.runAction(can, msg, cmds, cb, kit.Dict(
        nfs.FIND, function(cmds) { msg.Option(kit.Dict(ice.MSG_HANDLE, ice.TRUE, ice.MSG_FIELDS, "file,line,text"))
            can.run(msg._event, [ctx.ACTION, mdb.SEARCH, can.parse, cmds[0], can.Option(nfs.PATH)], function(msg) { var sub = msg._can
                can.page.style(can, sub._output, html.MAX_HEIGHT, 200), show(msg, msg._word = cmds[0])
                can.page.ClassList.has(sub, sub._target, html.SELECT) || sub._legend.click()
            }, true)
        },
        "last", function(cmds) { history.pop(), show(history.pop()) },
    )) }))
can.onimport.toolkit(can, {index: "can.code.inner.search"}, function(sub) {
    can.ui.search = sub, can.base.isFunc(cb) && cb()
})
}})

