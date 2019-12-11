Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, conf, output, action, option, field) {
    },
    favor: function(event, can, value, cmd, output) {
        console.log(can.base.Time(), value)
    },
})
Volcanos("onaction", {help: "组件交互", list: []})
Volcanos("onchoice", {help: "组件菜单", list: []})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})


