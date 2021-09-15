<template>
  <div>
    <!--头部：可选择年份和月份 -->
    <el-row type="flex" justify="end">
      <el-select
        placeholder="请选择年份"
        v-model="currentYear"
        size="small"
        style="width: 100px"
        @change="changeDate"
      >
        <el-option
          v-for="(year, index) in yearList"
          :key="index"
          :label="year"
          :value="year"
        ></el-option>
      </el-select>
      <el-select
        placeholder="请选择年份"
        v-model="currentMonth"
        size="small"
        style="width: 70px; margin-left: 10px"
        @change="changeDate"
      >
        <el-option
          v-for="month in 12"
          :key="month"
          :label="month"
          :value="month"
        ></el-option>
      </el-select>
    </el-row>

    <!-- 日历组件 -->
    <el-calendar v-model="currentDate">
      <!-- 自定义日期单元格 -->
      <!--  #dateCell // v-slot:"dateCell" // slot="" -->
      <template v-slot:dateCell="{ date, data }">
        <!-- date：当前单元格的日期Date对象 -->
        <!-- data： 包括 type，isSelected，day:2021-09-02 -->
        <div class="date-cell-content">
          <span class="date" :class="{ selected: data.isSelected }">
            {{ data.day | subDay }}
          </span>
          <span class="rest" v-if="isRest(date)">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>
<script>
// 1.下拉选择年份/月份
// 2.隐藏日历自带的头部
// 3.选择月份/年份，切换日历显示
// - 动态修改日历的绑定值currentDate
// 4.自定义dateCell的内容
//  - 比如在周末/周日/节假日后面添加 休 字
// 5. 修改日期选中时的样式
export default {
  props: {
    //开始日期
    startDate: {
      type: Date,
      //Object /数组类型的props默认值应用工厂函数返回 ()=>{}, ()=>[]
      default: () => new Date(),
    },
  },
  data() {
    return {
      yearList: [], // 下拉选择年份列表
      currentYear: null, // 当前年份
      currentMonth: null, // 当前月份
      currentDate: null, // 当前选中的日期
    };
  },
  created() {
    this.currentYear = this.startDate.getFullYear();
    // 快速生成当前年份的上下5年list
    this.yearList = Array.from(
      Array(11),
      (value, index) => this.currentYear - 5 + index
    );

    // 获取的月份是0-11
    this.currentMonth = this.startDate.getMonth() + 1;

    // this.changeDate();
  },
  methods: {
    // 下拉框选择年/月份时触发
    changeDate() {
      // 使用日期字符串生成新的date
      // 2021-8-1 => Tue May 01 2018 00:00:00 GMT+0800 (中国标准时间)
      this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-1`);
    },
    // 判断是否是周末
    isRest(date) {
      // 周几：日期对象.getDay() ：周日是0
      // 几号：日期对象.getDate()
      // 几月：日期对象.getMonth(): 0-11月
      return date.getDay() === 6 || date.getDay() === 0;
    },
  },
  filters: {
    // 截取2021-09-02最后的day
    subDay: function (value) {
      const day = value.split("-")[2];
      // 01去掉0
      return day.startsWith("0") ? day.substr(1) : day;
    },
  },
};
</script>
<style  scoped>
/* 去掉边框 */
/deep/ .el-calendar-table .el-calendar-table__row td,
/deep/ .el-calendar-table tr,
/deep/ .el-calendar-table tbody {
  border: none;
}

/* 调整row高度 */
/deep/ .el-calendar-table .el-calendar-day {
  height: auto;
  text-align: center;
}

/deep/ .el-calendar-table .el-calendar-day span {
  display: inline-block;
}

/* 隐藏日历头部 */
/deep/.el-calendar__header {
  display: none;
}
.date-cell-content .date {
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 15px;
}
/* 休字的样式 */
.date-cell-content .rest {
  color: #fff;
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 10px;
  line-height: 20px;
  margin-left: 5px;
  background: rgb(250, 124, 77);
}
/* 日期选中时的样式 */
.selected {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
</style>