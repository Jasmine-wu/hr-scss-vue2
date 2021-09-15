<template>
  <div id="radar-chart"></div>
</template>
<script>
// 注意使用echarts时一定要先给一个宽高，不然会显示不出来

// 按需引入雷达组件：
// 1. 引入echarts主模块
var echarts = require("echarts/lib/echarts");
// 2. 引入雷达图
require("echarts/lib/chart/radar");

// 引入提示框和标题组件
// require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");

export default {
  created() {},

  // 虚拟dom转成真实dom
  mounted() {
    var myChart = echarts.init(document.getElementById("radar-chart"));

    const option = {
      title: {
        text: "基础雷达图",
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: "工作效率", max: 100 },
          { name: "考勤", max: 100 },
          { name: "积极性", max: 100 },
          { name: "帮助同事", max: 100 },
          { name: "自主学习", max: 100 },
          { name: "正确率", max: 100 },
        ],
        axisLine: {
          lineStyle: {
            color: "#ccc",
          },
        },
      },
      series: [
        {
          name: "预算 vs 开销（Budget vs spending）",
          type: "radar",
          data: [
            {
              value: [10, 1, 100, 5, 100, 0],
              name: "张三",
            },
            {
              value: [50, 50, 50, 50, 50, 10],
              name: "李四",
            },
          ],
        },
      ],
    };

    myChart.setOption(option);
  },
};
</script>
<style  scoped>
/* 注意使用echarts时一定要先给一个宽高，不然会显示不出来 */
#radar-chart {
  width: 600px;
  height: 400px;
}
</style>