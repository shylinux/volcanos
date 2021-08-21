Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        var meta = {}; msg.Table(function(value) { meta[value.key] = value.value })
        can._meta = can.base.Obj(meta.text, {meta: {name: meta.name}, list: []})
        can.base.isFunc(cb) && cb(msg)

        can.ui = can.page.Appends(can, target, [{type: "table", list: [{type: "tr", list: [
            {type: "td", list: [{view: "project"}]},
            {type: "td", list: [{view: "display"}]},
            {type: "td", list: [{view: "profile"}]},
        ]}] }])

        can.ui.project._fieldset = can.ui.display
        can.onimport._item(can, can._meta, can.ui.project).click()
        if (location.pathname.indexOf("/chat/cmd") == 0) {

        }
    },
    _field: function(can, meta, target) {
        var field = can.onappend.field(can, "layout", {width: meta.width, height: meta.height}, target).fieldset
        can.page.Modify(can, field, {style: can.base.Copy({}, meta, "width", "height")})
        can.page.ClassList.add(can, field, meta.style)
        meta.index && can.run(event, [ctx.ACTION, ctx.COMMAND, meta.index], function(msg) {
            can.onappend._init(can, {
                feature: can.base.Obj(msg.Append("meta")), 
                inputs: can.base.Obj(msg.Append("list")),
                width: meta.width, height: meta.height,
                args: meta.args,
            }, ["/plugin/state.js"], function(sub) {
                can.page.Modify(can, sub._output,  {style: {width: meta.width}})
                sub.run = function(event, cmds, cb) {
                    can.run(event, [ctx.ACTION, cli.RUN, meta.index].concat(cmds), cb, true)
                }
            }, target, field)
        }, true)
        return field
    }, 
    _item: function(can, node, target) {
        var ui = can.page.Append(can, target, [{view: ["item", "div", node.meta.name]}, {view: ["list"]}])
        ui.list._fieldset = can.onimport._field(can, node.meta, target._fieldset)

        var msg = can.request({}); msg.Push(node.meta, "", true)
        ui.item.onclick = function(event) {
            can.onmotion.select(can, can.ui.project, "div.item", ui.item)
            can.current = ui.item, can.onmotion.clear(can, can.ui.profile)
            can.onappend.table(can, msg, function(value, key, index, line, array) {
                return {text: [value, "td"], ondblclick: function(event) {
                    can.onmotion.modifys(can, event.target, function(event, value, old) {
                        node.meta[key == "value"? line.key: key] = value
                    })
                }}
            }, can.ui.profile)
        }
        ui.item._add = function(data) {
            node.list.push(data)
            can.onimport._item(can, data, ui.list)
        }
        can.core.List(node.list, function(node) { can.onimport._item(can, node, ui.list) })
        return ui.item
    },
}, ["/plugin/local/chat/div.css"])
Volcanos("onaction", {help: "操作数据", list: [],
    "添加": function(event, can) {
        can.user.input(event, can, ["name", "index", "args", "width", "height", "style"], function(event, button, data, list, args) {
            can.current._add({meta: data, list: []})
        })
    },
    "保存": function(event, can) { var msg = can.request(event, can.Option())
        can.run(event, ["modify", "text", JSON.stringify(can._meta)], function(msg) {
            can.user.toast(can, "保存成功")
        }, true)
    },
    "预览": function(event, can) {
        can.page.Modify(can, can.ui.display, {style: {
            position: "fixed", left: 0, top: 0, "z-index": 10,  "background": "gray",
            width: window.innerWidth, height: window.innerHeight,
        }})
    },
})
Volcanos("onexport", {help: "导出数据", list: []})
