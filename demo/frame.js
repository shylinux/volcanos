Volcanos("onappend", {
    init: function(can, type, item, list, cb, target) {
        var sub = Volcanos(item.name, {
            _target: can.page.AppendField(can, target, type, item),
        }, list, function(sub) { cb(sub) })
    },
}, [], function(can) {})
Volcanos("onremove", {}, [], function(can) {})

Volcanos("onimport", {}, [], function(can) {})
Volcanos("onexport", {}, [], function(can) {})

Volcanos("onaction", {}, [], function(can) {})
Volcanos("ondetail", {}, [], function(can) {})
