Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
    var meta = {}; msg.Table(function(value) { meta[value.key] = value.value })
    can._meta = can.base.Obj(meta.text, {meta: {name: meta.name}, list: []})
    can.base.isFunc(cb) && cb(msg)

    can.ui = can.page.Appends(can, target, [{type: "table", list: [{type: "tr", list: [
        {type: "td", list: [{view: "project"}]},
        {type: "td", list: [{view: "display"}]},
        {type: "td", list: [{view: "profile"}]},
    ]}]}])
    can.ui.project._fieldset = can.onimport._field(can, can.ui.display, can._meta.meta)
    can.onimport._item(can, can._meta, can.ui.project).click()

}, _field: function(can, target, meta) {
    return can.page.Append(can, target, [{type: "fieldset", style: {width: meta.width||200, height: meta.height||200}}]).first
},_item: function(can, node, target) {
    var ui = can.page.Append(can, target, [{view: ["item", "div", node.meta.name]}, {view: ["list"]}])
    can.core.List(node.list, function(node) { can.onimport._item(can, node, ui.list) })
    var msg = can.request({}); msg.Push(node.meta, "", true)
    ui.item.onclick = function(event) {
        can.onmotion.select(can, can.ui.project, "div.item", ui.item)
        can.current = ui.item
        can.onmotion.clear(can, can.ui.profile)
        can.onappend.table(can, msg, null, can.ui.profile)
    }
    ui.list._fieldset = can.onimport._field(can, target._fieldset, node.meta)
    ui.item._add = function(data) {
        node.list.push(data)
        can.onimport._item(can, data, ui.list)
    }
    return ui.item
}}, ["/plugin/local/chat/div.css"])
Volcanos("onaction", {help: "操作数据", list: ["添加", "保存"],
    "添加": function(event, can) {
        can.user.input(event, can, ["name", "index", "args", "width", "height"], function(event, button, data, list, args) {
            can.current._add({meta: data, list: []})
        })
    },
    "保存": function(event, can) {
        var msg = can.request(event, can.Option())
        can.run(event, ["modify", "text", JSON.stringify(can._meta)], function(msg) {
            can.user.toast(can, "保存成功")
        }, true)
    },
})
Volcanos("onexport", {help: "导出数据", list: []})
