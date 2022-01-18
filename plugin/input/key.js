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
            switch (event.key) { case lang.ENTER: can.close(); return }
            can.onmotion.selectTableInput(event, can, target, function() {
                can.run(event, [ctx.ACTION, mdb.INPUTS, meta.name, target.value], function(msg) {
                    can.onfigure.key._init(can, msg, target), can.Status(mdb.TOTAL, msg.Length())
                    target._msg = msg
                })
            }) 
        }

        if (event.ctrlKey && ["n", "p"].indexOf(event.key) > -1) {
            return can.onkeymap.prevent(event)
        }
        switch (event.key) { case lang.ESCAPE: event.target.blur(); return }
        can.base.isFunc(last) && last(event, can)
    },
}})

