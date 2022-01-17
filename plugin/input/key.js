Volcanos("onfigure", {help: "控件详情", list: [], key: {
    _init: function(can, msg, target) { var call = arguments.callee
        can.onmotion.clear(can), can.onappend.table(can, msg, function(value, key, index, line) {
            return {text: [value, html.TD], onclick: function(event) { target.value = line[key]
                if (msg.Option(ice.MSG_PROCESS) != ice.PROCESS_AGAIN) { return can.close() }
                can.run(event, [ctx.ACTION, mdb.INPUTS, can.Conf(mdb.NAME), target.value], function(msg) {
                    call(can, msg, target)
                })
            }}
        })
    },
    _show: function(can, meta, cbs, target) {
        can.run(event, [ctx.ACTION, mdb.INPUTS, meta.name, target.value], function(msg) {
            if (msg.Length() == 0) { return can.close() }
            target._can && target._can.close(), target._can = can
            can.onfigure.key._init(can, msg, target), can.Status(mdb.TOTAL, msg.Length())
            target._msg = msg, can.base.isFunc(cbs) && cbs(can)
        })

    },
    _select: function(event, can, target) {
        function select(order) { if (order == 0) { target.value = target._value }
            var index = 0; return can.page.Select(can, can._output, html.TR, function(tr) {
                if (can.page.ClassList.has(can, tr, html.HIDDEN)) { return }
                can.page.ClassList.del(can, tr, html.SELECT); if (order != index++) { return tr }
                can.page.ClassList.add(can, tr, html.SELECT), can.page.Select(can, tr, html.TD, function(td, index) {
                    target._value = target._value||target.value, index == 0 && (target.value = td.innerText)
                }); return tr
            }).length
        }
        switch (event.key) {
            case "n":
                var total = select(target._index)
                select(target._index = ((target._index)+1) % total)
                break
            case "p":
                var total = select(target._index)
                select(target._index = (target._index-1) < 0? total-1: (target._index-1))
                break
            default: target._index = 0, target._value = ""
        }
    },
    onfocus: function(event, can, meta, cb, target) { if (target._figure) { return } target._figure = {}; cb(function(can, cbs) {
        target._figure = can.onlayout.figure(event, can, can._target, false, {top: can.page.offsetTop(target)+target.offsetHeight, left: can.page.offsetLeft(target)})
        can.onfigure.key._show(can, meta, cbs, target)
    }) },
    onblur: function(event, can, meta, cb, target) { delete(target._figure), target._can && target._can.close() },
    onclick: function(event, can, meta, cb, target) { if (target._figure) { target._figure = can.onlayout.figure(event, can, can.core.Value(target, "_can._target")||{}); return } target._figure = {}; cb(function(can, cbs) {
        target._figure = can.onlayout.figure(event, can)
        can.onfigure.key._show(can, meta, cbs, target)
    }) },
    onkeydown: function(event, can, meta, cb, target, last) {
        if (target._figure) { if (!(can = target._can)) { return }
            if (event.ctrlKey) { can.onfigure.key._select(event, can, target) } else {
                target._index = 0, target._value = ""
                switch (event.key) { case lang.ENTER: can.close(); return }
                can.page.Select(can, can._output, html.TR, function(tr, index) {
                    var has = false; can.page.Select(can, tr, html.TD, function(td) {
                        has = has || td.innerText.indexOf(target.value)>-1
                    }), can.page.ClassList.set(can, tr, html.HIDDEN, !has && index != 0)
                })
            }

            var total = can.page.Select(can, can._output, html.TR, function(tr) {
                if (!can.page.ClassList.has(can, tr, html.HIDDEN)) { return tr}
            }).length-1
            if (total == 0) {
                can.run(event, [ctx.ACTION, mdb.INPUTS, meta.name, target.value], function(msg) {
                    can.onfigure.key._init(can, msg, target), can.Status(mdb.TOTAL, msg.Length())
                    target._msg = msg
                })
            }
            can.Status(kit.Dict(mdb.TOTAL, total, mdb.INDEX, target._index))
        }

        if (event.ctrlKey && ["n", "p"].indexOf(event.key) > -1) {
            return can.onkeypop.prevent(event)
        }
        switch (event.key) { case lang.ESCAPE: event.target.blur(); return }
        can.base.isFunc(last) && last(event, can)
    },
}})

