Volcanos("onfigure", {help: "控件详情", list: [],
    date: {click: function(event, can, value, cmd, target, figure) {
        // 设置输入
        target.style.width = "120px"
        function set(now) {
            target.value = can.base.Time(now); 
            can.item.action == "auto" && can.run({});
        }

        // 添加插件
        figure.table = can.page.Append(can, figure.output, [{type: "table"}]).first

        // 添加控件
        can.now = target.value? new Date(target.value): new Date();
        var control = can.page.AppendAction(can, figure.action, ["今天", "随机",
            ["hour"].concat(can.core.List(24)), ["minute"].concat(can.core.List(0, 60, 5)), ["second"].concat(can.core.List(0, 60, 5)), {view: ["", "br"]},
            {type: "hr", style: {margin: 0}}, {type: "br"},
            "上一月", ["year"].concat(can.core.List(can.now.getFullYear() - 20, can.now.getFullYear() + 20)),
            ["month"].concat(can.core.List(1, 13)), "下一月", {view: ["", "br"]},
        ], function(event, value, cmd) {can.stick = true;
            // 设置时间
            switch (cmd) {
                case "year": can.now.setFullYear(parseInt(value)); show(can.now); return;
                case "month": can.now.setMonth(parseInt(value)-1); show(can.now); return;
                case "hour": can.now.setHours(parseInt(value)); set(show(can.now)); return;
                case "minute": can.now.setMinutes(parseInt(value)); set(show(can.now)); return;
                case "second": can.now.setSeconds(parseInt(value)); set(show(can.now)); return;
            }

            // 设置日期
            switch (value) {
                case "今天": can.now = new Date(); set(show(can.now)); break;
                case "随机": can.now.setDate((Math.random() * 100 - 50) + can.now.getDate()); set(show(can.now)); break;
                case "关闭": can.page.Remove(can, figure.first); delete(can.figure);
                case "前一年": can.now.setFullYear(can.now.getFullYear()-1); show(can.now); break;
                case "后一年": can.now.setFullYear(can.now.getFullYear()+1); show(can.now); break;
                case "上一月": can.now.setMonth(can.now.getMonth()-1); show(can.now); break;
                case "下一月": can.now.setMonth(can.now.getMonth()+1); show(can.now); break;
            }
        })

        function show(now) {
            // 设置控件
            control.month.value = now.getMonth()+1;
            control.year.value = now.getFullYear();
            control.hour.value = now.getHours();
            control.minute.value = parseInt(now.getMinutes()/5)*5;
            control.second.value = parseInt(now.getSeconds()/5)*5;

            // 设置组件
            can.page.Appends(can, figure.table, [{type: "tr", list: can.core.List(["日", "一", "二", "三", "四", "五", "六"], function(day) {return {text: [day, "th"]}})}])
            var tr; function add(day, type) {if (day.getDay() == 0) {tr = can.page.Append(can, figure.table, [{type: "tr"}]).tr}
                can.page.Append(can, tr, [{text: [day.getDate(), "td", can.base.Time(day).split(" ")[0] == can.base.Time(now).split(" ")[0]? "select": type],
                    dataset: {date: day.getTime()}, click: function(event) {set(can.now = new Date(parseInt(event.target.dataset.date)))},
                }])
            }

            // 时间区间
            var one = new Date(now); one.setDate(1);
            var end = new Date(now); end.setMonth(now.getMonth()+1); end.setDate(1);
            var head = new Date(one); head.setDate(one.getDate()-one.getDay());
            var tail = new Date(end); tail.setDate(end.getDate()+7-end.getDay());

            // 时间序列
            for (var day = new Date(head); day < one; day.setDate(day.getDate()+1)) {add(day, "last")}
            for (var day = new Date(one); day < end; day.setDate(day.getDate()+1)) {add(day, "main")}
            for (var day = new Date(end); end.getDay() != 0 && day < tail; day.setDate(day.getDate()+1)) {add(day, "next")}
            return now
        }

        set(show(can.now));
    }},
})
