Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, meta, list, cb, target) {
    },
})
Volcanos("onaction", {help: "控件交互", list: [], _init: function(can, meta, list, cb, target) {
        can.base.isFunc(cb) && cb(); switch (meta.type) {
            case html.SELECT: meta.value && (target.value = meta.value); break
            case html.BUTTON: meta.action == ice.AUTO && target.click(); break
        }
    },

    run: function(event, can) {
        var title = can.sup._name+ice.SP+can.sup.Input([], true)
        var toast = can.user.toast(can, "执行中...", title, -1)
        can.run(event, [], function() { toast.close(), can.user.toast(can, "执行成功...", title) })
    },
    list: function(event, can) { can.run(event) },
    back: function(event, can) { can.sup.onimport._back(can.sup) },
    refresh: function(event, can) { can.run(event) },

    onclick: function(event, can) {
        if (can.Conf(kit.MDB_TYPE) == html.BUTTON) { can.run(event, [ctx.ACTION, can.Conf(kit.MDB_NAME)].concat(can.sup.Input())) }
    },
    onchange: function(event, can) {
        if (can.Conf(kit.MDB_TYPE) == html.SELECT) { can.run(event) }
    },
    onkeydown: function(event, can) {
        if (can.Conf(kit.MDB_TYPE) == html.TEXTAREA) { if (!event.ctrlKey) { return } }
        can.onkeypop.input(event, can, event.target); switch (event.key) {
            case lang.ENTER:
                switch (can.Conf(kit.MDB_TYPE)) {
                    case html.TEXTAREA: if (!event.ctrlKey) { return }
                    case html.TEXT: event.target.setSelectionRange(0, -1); break
                }; can.run(event), event.stopPropagation(), event.preventDefault(); break
            case "b": if (event.ctrlKey) { can.CloneInput() } break
            case "m": if (event.ctrlKey) { can.CloneField(), event.stopPropagation(), event.preventDefault() } break
        }
    },
})
Volcanos("onexport", {help: "导出数据", list: []})

