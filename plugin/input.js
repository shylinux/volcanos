Volcanos("onaction", {help: "控件交互", list: [], _init: function(can, meta, list, cb, target) {
        can.base.isFunc(cb) && cb(); switch (meta.type) {
            case html.SELECT: meta.value && (target.value = meta.value); break
            case html.BUTTON: meta.action == ice.AUTO && target.click(); break
        }
    },

    run: function(event, can) {
        var title = can.sup._name+ice.SP+can.sup.Input([], true)
        var toast = can.user.toast(can, "执行中...", title, -1)
        can.run(event, [], function() { toast.close(), can.user.toastSuccess(can) })
    },
    list: function(event, can) { can.run(event) },
    back: function(event, can) { can.sup.onimport._back(can.sup) },
    refresh: function(event, can) { can.run(event) },

    onclick: function(event, can) {
        if (can.Conf(mdb.TYPE) == html.BUTTON) { can.run(event, [ctx.ACTION, can.Conf(mdb.NAME)].concat(can.sup.Input())) }
    },
    onchange: function(event, can) {
        if (can.Conf(mdb.TYPE) == html.SELECT) { can.run(event) }
    },
    onkeydown: function(event, can) { can.onkeymap.input(event, can, event.target)
        if (can.Conf(mdb.TYPE) == html.TEXTAREA) { if (!event.ctrlKey) { return } }
        if (event.key == lang.ENTER) {
            can.run(event), can.onmotion.focus(can, event.target)
            can.onkeymap.prevent(event)
        } if (!event.ctrlKey) { return }

        switch (event.key) {
            case "b": can.CloneInput(); break
            case "m": can.CloneField(); break
            default: return
        } can.onkeymap.prevent(event)
    },
})

