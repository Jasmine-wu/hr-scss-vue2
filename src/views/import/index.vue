<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="success" />
</template>
<script>
// 批量导入雇员api
import { importEmployee } from "@/api/employees";
export default {
  methods: {
    async success({ header, results }) {
      // 导入excel表格的表头，和内容
      // excel表格里的表头是中文的，映射对应关系
      const userRelations = {
        入职日期: "timeOfEntry",
        手机号: "mobile",
        姓名: "username",
        转正日期: "correctionTime",
        工号: "workNumber",
      };

      // 遍历数组,将数组里每一项数据里的中文key替换成后台真实值
      //   let newArr = [];
      //   results.forEach((element) => {
      //     const userInfo = {};
      //     Object.keys(element).forEach((key) => {
      //       userInfo[userRelations[key]] = element[key];
      //     });
      //     newArr.push(userInfo);
      //   });

      // 注意
      // 第二种写法：arr.map; map会返回一个数组
      const newArr = results.map((item) => {
        const userInfo = {};
        Object.keys(item).forEach((key) => {
          // 问题： excle中时间格式的数据被XLSX转换成了数值
          // 解决：formatDate

          if (
            userRelations[key] === "timeOfEntry" ||
            userRelations[key] === "correctionTime"
          ) {
            // 还有一个问题："2019/3/10"仍然是字符串数据，但后台接口要求日期是日期类型的数据
            // 解决: new Date(日期格式字符串)转换成日期类型数据->Sun Mar 10 2019 00:00:00 GMT+0800 (中国标准时间)
            userInfo[userRelations[key]] = new Date(
              this.formatDate(item[key], "/")
            );
          } else {
            userInfo[userRelations[key]] = item[key];
          }
        });
        return userInfo;
      });
      //   发送请求
      await importEmployee(newArr);
      this.$message.success("导入成功");

      //   返回上一个
      this.$router.back();
    },

    // 将数值化的日期在转化成日期格式的数据
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1);
      time.setYear(time.getFullYear() - 70);
      const year = time.getFullYear() + "";
      const month = time.getMonth() + 1 + "";
      const date = time.getDate() - 1 + "";
      if (format && format.length === 1) {
        return year + format + month + format + date;
      }
      return (
        year +
        (month < 10 ? "0" + month : month) +
        (date < 10 ? "0" + date : date)
      );
    },
  },
};
</script>