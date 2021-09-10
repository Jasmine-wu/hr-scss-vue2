<template>
  <div class="dashboard-container">
    <div class="app-container">
      <h2>员工</h2>
      <page-tools :show-before="true">
        <!-- 具名插槽的三种使用方式： -->
        <!-- <template slot="before">
          <span>共xxx条记录</span>
        </template> -->

        <!-- <span slot="before">共xxx条记录</span> -->

        <template v-slot:before>
          <span>共{{ page.total }}条记录</span>
        </template>

        <template slot="after">
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import')"
            >Excel导入</el-button
          >
          <el-button size="small" type="danger" @click="cliclExportToExcelBtn"
            >Excel导出</el-button
          >

          <el-button size="small" type="primary" @click="clickAddEmployeeBtn"
            >新增员工</el-button
          >
        </template>
      </page-tools>

      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <!-- 处理聘用形式 -->
          <el-table-column
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
            :formatter="formatFormOfEmployment"
          />

          <el-table-column label="部门" sortable="" prop="departmentName" />

          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <!-- 处理入职时间 -->
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <!-- 根据当前状态来确定 是否打开开关 -->
            <template slot-scope="{ row }">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="clickDeleteEmployeesBtn(row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>

    <!-- 放置弹层组件 -->
    <dialog-employee-add :show-dialog.sync="isShowDialog">
    </dialog-employee-add>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from "@/api/employees";
import DialogEmployeeAdd from "@/views/employees/components/dialog-employee-add.vue";
import { formatDate } from "@/filters";
import EmployeeEnum from "@/api/constant/employees";
export default {
  components: {
    DialogEmployeeAdd,
  },
  data() {
    return {
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0, // 总数
      },
      isShowDialog: false,
    };
  },
  created() {
    this.getEmployeeList();
  },
  methods: {
    changePage(newPage) {
      this.page.page = newPage;
      this.getEmployeeList();
    },
    async getEmployeeList() {
      this.loading = true;
      // 获取当前也雇员数据
      const { total, rows } = await getEmployeeList(this.page);
      this.page.total = total;
      this.list = rows;
      this.loading = false;
    },
    //格式化聘用形式列
    formatFormOfEmployment(row, column, cellValue) {
      const item = EmployeeEnum.hireType.find((item) => item.id === cellValue);
      console.log(item.value);
      return item ? item.value : "未知";
    },
    // 点击删除按钮
    async clickDeleteEmployeesBtn() {
      try {
        await this.$confirm("您确定删除该员工吗");
        await delEmployee(id);
        this.getEmployeeList();
        this.$message.success("删除员工成功");
      } catch (error) {
        console.log(error);
      }
    },
    // 点击新增员工按钮
    clickAddEmployeeBtn() {
      this.isShowDialog = true;
    },
    //点击excel导出
    cliclExportToExcelBtn() {
      // 按需导入Export2Excel
      // const tHeader = [];
      // 获取所有雇员

      // 设置excel表头对应关系
      const headers = {
        姓名: "username",
        手机号: "mobile",
        入职日期: "timeOfEntry",
        聘用形式: "formOfEmployment",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName",
      };

      // 复杂表头和合并项
      const multiHeader = [["姓名", "主要信息", "", "", "", "", "部门"]];
      const merges = ["A1:A2", "B1:F1", "G1:G2"];

      // 后台数据格式 [{username:'孙某人', mobile:'12224445676'},{},{}]
      // data接收的数据格式：[['孙某人','12224445676'],[],[]]
      // 问题：要先将后台json格式的数据转换成二维数组格式数据

      import("@/vendor/Export2Excel").then(async (excel) => {
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total,
        });
        const data = this.transJsonToTDArrary(headers, rows);

        excel.export_json_to_excel({
          header: Object.keys(headers), //表头 必填
          data, //具体数据 必填
          filename: "员工基本信息表格", //非必填
          autoWidth: true, //非必填
          bookType: "xlsx", //非必填
          multiHeader,
          merges,
        });
      });
    },
    // 将json数据转换成二维数组数据
    transJsonToTDArrary(headers, rows) {
      return rows.map((row) => {
        return Object.keys(headers).map((key) => {
          // 单独处理后台的日期数据:"2018-11-16T00:00:00.000+0000"格式的
          if (
            headers[key] === "timeOfEntry" ||
            headers[key] === "correctionTime"
          ) {
            return formatDate(row[headers[key]]);
          }
          // 单独处理后台的聘用形式数据：1/2
          if (headers[key] === "formOfEmployment") {
            const item = EmployeeEnum.hireType.find(
              (item) => row[headers[key]] === item.id
            );
            return item ? item.value : "未知";
          }
          return row[headers[key]];
        });
      });
    },
  },
};
</script>

<style>
</style>

