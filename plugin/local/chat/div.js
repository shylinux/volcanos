Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        var meta = {}; msg.Table(function(value) { meta[value.key] = value.value })
        can._meta = can.base.Obj(meta.text, {meta: {name: meta.name}, list: []})
        can.base.isFunc(cb) && cb(msg)

        can.ui = can.page.Appends(can, target, [{view: ["layout", "table"], list: [{type: "tr", list: [
            {type: "td", list: [{view: "project"}]},
            {type: "td", list: [{view: "display"}]},
            {type: "td", list: [{view: "profile"}]},
        ]}] }]), can.ui.project._fieldset = can.ui.display

        can.onimport._item(can, can._meta, can.ui.project, can.onimport._size(can)).click()
    },
    _size: function(can) {
        var width = can.Conf("width")-260, height = can.Conf("height")-100
        if (can.Conf("auto.cmd")) {
            can.onmotion.hidden(can, can.ui.project)
            can.onmotion.hidden(can, can.ui.profile)
            can.onmotion.hidden(can, can._option)
            can.onmotion.hidden(can, can._action)
            width = can.Conf("width"), height = can.Conf("height")
        }
        if (can.user.mod.isCmd) {
            width = window.innerWidth, height = window.innerHeight
            can.page.Modify(can, can._output, {style: {width: width, height: height}})
        }
        return width
    },
    _item: function(can, node, target, width) { width = node.meta.width||width
        var ui = can.page.Append(can, target, [{view: ["item", "div", node.meta.name||"some"]}, {view: ["list"]}])
        ui.list._fieldset = can.onimport._field(can, node.meta, target._fieldset, width)

        var msg = can.request({}); msg.Push(node.meta, "", true)
        ui.item.onclick = function(event) {
            can.onmotion.select(can, can.ui.project, "div.item", ui.item)
            can.current = ui.item, can.onmotion.clear(can, can.ui.profile)
            can.onappend.table(can, msg, function(value, key, index, line, array) {
                return {text: [value, "td"], ondblclick: function(event) {
                    key == "value" && can.onmotion.modifys(can, event.target, function(event, value, old) {
                        node.meta[line.key] = value
                    })
                }}
            }, can.ui.profile)
        }

        ui.item._add = function(data) {
            if (node.meta.style == "span") { width = width * node.list.length }
            node.list.push(data)
            if (node.meta.style == "span") { width = width / node.list.length }
            can.onmotion.clear(can, ui.list), can.onmotion.clear(can, ui.list._fieldset)
            can.core.List(node.list, function(node) { can.onimport._item(can, node, ui.list, width) })
        }
        if (node.meta.style == "span") { width = width / node.list.length }
        can.core.List(node.list, function(node) { can.onimport._item(can, node, ui.list, width) })
        return ui.item
    },
    _field: function(can, meta, target, width) {
        var size = {width: width, height: meta.height}
        var field = can.onappend.field(can, "layout", {}, target).fieldset
        can.page.ClassList.add(can, field, meta.style)
        can.page.Modify(can, field, {style: size})

        meta.index && can.run(event, [ctx.ACTION, ctx.COMMAND, meta.index], function(msg) {
            can.onappend._init(can, can.base.Copy({
                feature: can.base.Obj(msg.Append("meta")), 
                inputs: can.base.Obj(msg.Append("list")),
                args: meta.args,
            }, size), ["/plugin/state.js"], function(sub) {
                can.page.Modify(can, sub._output,  {style: size})
                sub.run = function(event, cmds, cb) {
                    can.run(event, can.misc.Concat([ctx.ACTION, cli.RUN, meta.index], cmds), cb, true)
                }
            }, target, field)
        }, true)
        return field
    }, 
}, ["/plugin/local/chat/div.css"])
Volcanos("onaction", {help: "操作数据", list: [],
    "添加": function(event, can) {
        can.user.input(event, can, ["name", "index", "args", "style", "width", "height"], function(event, button, data, list, args) {
            can.current._add({meta: data, list: []})
        })
    },
    "保存": function(event, can) { var msg = can.request(event, can.Option())
        can.run(event, [mdb.MODIFY, "text", JSON.stringify(can._meta)], function(msg) {
            can.user.toast(can, "保存成功")
        }, true)
    },
    "预览": function(event, can) {
        can.run(event, [ctx.ACTION, "生成链接"], function() {}, true)
    },
})
Volcanos("onexport", {help: "导出数据", list: []})
