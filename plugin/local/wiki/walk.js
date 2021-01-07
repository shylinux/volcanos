Volcanos("onimport", {help: "导入数据", list: [],
    init: function(can, msg, cb, output, action, option) {output.innerHTML = "";
        if (!msg.result || msg.result.length == 0) {
            var table = can.page.AppendTable(can, msg, output, msg.append);
            table.onclick = function(event) {switch (event.target.tagName) {
                case "TD":
                    can.onimport.which(event, table, msg.append, function(index, key) {
                        can.Option("file", event.target.innerHTML.trim())
                        can.run(event, [event.target.innerHTML.trim()], function(msg) {})
                    })
                    break
                case "TH":
                    break
                case "TR":
                case "TABLE":
            }}
            return typeof cb == "function" && cb(msg), table;
        }

        // can.page.Append(can, action, [{type: "script", src: "https://cdn.bootcss.com/echarts/4.2.0-rc.2/echarts.js"}]);
        can.page.Append(can, output, [{include: ["require/github.com/shylinux/echarts/echarts.js", function(event) {
            can.page.Append(can, output, [{include: ["require/github.com/shylinux/echarts/china.js", function(event) {
                var china_chart = echarts.init(can.page.Append(can, output, [{type: "div", style: {width: "600px", height: "400px"}}]).last);
                var data = msg.Table()

                var yData = [];
                var barData = [];
                for (var i = 0; i < (data.length>10? 10: data.length); i++) {
                    yData.push(i + data[i].name);
                    barData.push(data[i]);
                }

                var option = {
                    title: [{
                        text: msg.Option("title"),
                        show: true, right: 250, top: 10,
                        textStyle: {color: '#2D3E53', fontSize: 18},
                    }],
                    tooltip: {
                        show: true, formatter: function(params) {
                            return params.name +": "+params.value
                        },
                    },
                    visualMap: {
                        type: 'continuous',
                        orient: 'horizontal',
                        itemWidth: 10,
                        itemHeight: 80,
                        text: ['高', '低'],
                        showLabel: true,
                        seriesIndex: [0],
                        min: 0,
                        max: data[1].value,
                        inRange: {
                            color: ['#6FCF6A', '#FFFD64', '#FF5000']
                        },
                        textStyle: {
                            color: '#7B93A7'
                        },
                        bottom: 30,
                        left: 'left',
                    },
                    grid: {right: 10, top: 135, bottom: 100, width: '20%'},
                    xAxis: {show: false},
                    yAxis: {
                        type: 'category',
                        inverse: true,
                        nameGap: 16,
                        axisLine: {show: false, lineStyle: {color: '#ddd'}},
                        axisTick: {show: false, lineStyle: {color: '#ddd'}},
                        axisLabel: {
                            margin: 0,
                            interval: 0,
                            textStyle: {color: '#455A74', align: 'left', fontSize: 14},
                            rich: {
                                a: {
                                    color: '#fff',
                                    backgroundColor: '#FAAA39',
                                    width: 20,
                                    height: 20,
                                    align: 'center',
                                    borderRadius: 2
                                },
                                b: {
                                    color: '#fff',
                                    backgroundColor: '#4197FD',
                                    width: 20,
                                    height: 20,
                                    align: 'center',
                                    borderRadius: 2
                                }
                            },
                            formatter: function(params) {
                                if (parseInt(params.slice(0, 1)) < 3) {
                                    return [
                                        '{a|' + (parseInt(params.slice(0, 1)) + 1) + '}' + '  ' + params.slice(1)
                                    ].join('\n')
                                } else {
                                    return [
                                        '{b|' + (parseInt(params.slice(0, 1)) + 1) + '}' + '  ' + params.slice(1)
                                    ].join('\n')
                                }
                            }
                        },
                        data: yData
                    },
                    geo: {
                        map: 'china', left: 'left', right: '100',
                        label: {emphasis: {show: false}},
                        itemStyle: {emphasis: {areaColor: '#fff464'}},
                    },
                    series: [{
                        roam: false, type: 'map', name: 'mapSer',
                        geoIndex: 0, label: {show: false},
                        data: data
                    }, {
                        roam: false, type: 'bar', name: 'barSer',
                        visualMap: false, barGap: 0, barMaxWidth: 8,
                        zlevel: 100, itemStyle: {
                            normal: {
                                color: function(params) {
                                    // build a color map as your need.
                                    var colorList = [{colorStops: [
                                        {offset: 0, color: '#FFD119'}, // 0% 处的颜色
                                        {offset: 1, color: '#FFAC4C'}, // 100% 处的颜色
                                    ]}, {colorStops: [
                                        {offset: 0, color: '#00C0FA'}, // 0% 处的颜色
                                        {offset: 1, color: '#2F95FA'}, // 100% 处的颜色
                                    ]}];
                                    return params.dataIndex < 3? colorList[0]: colorList[1]
                                },
                                barBorderRadius: 15
                            }
                        },
                        data: barData
                    }]
                };
                china_chart.setOption(option);
            }]}]);
        }]}]);
    },
    which: function(event, table, list, cb) {if (event.target == table) {return cb(-1, "")}
        can.page.Select(can, table, "tr", function(tr, index) {if (event.target == tr) {return cb(index-1, "")}
            can.page.Select(can, tr, "th,td", function(td, order) {
                if (event.target == td) {return cb(index-1, list[order])}
            })
        })
    },
})

