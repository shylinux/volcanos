Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.require(["/plugin/github.com/Tencent/vConsole/dist/vconsole.min.js"], function(can) {
            var v = new VConsole();
            console.log(v);
        })
    },
})
Volcanos("onaction", {help: "交互数据", list: [], _init: function(can, msg, list, cb, target) {
        can.onimport._init(can, msg, list, cb, target)
        can.user.log = function() {
            can.page.Append(can, can._output, [{td: [
                can.base.Time(),
                can.base.FileLine(),
            ].concat(can.core.List(arguments))}])
        }
    },
})
Volcanos("onexport", {help: "导出数据", list: []})


