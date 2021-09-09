<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="dismissDialog">
    <!-- 表单 -->
    <el-form
      :model="formData"
      :rules="rules"
      ref="employeeForm"
      label-width="120px"
    >
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="formData.username"
          style="width: 50%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          v-model="formData.mobile"
          style="width: 50%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width: 50%"
          placeholder="请选择入职时间"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          v-model="formData.formOfEmployment"
          style="width: 50%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in EmployeesEnum.hireType"
            :key="item.id"
            :lable="item.value"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          v-model="formData.workNumber"
          style="width: 50%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          style="width: 50%"
          placeholder="请选择部门"
          @focus="showDepartments"
        />
        <!-- 放置一个tree组件 -->
        <el-tree
          v-if="showTree"
          :data="treeData"
          default-expand-all=""
          :props="{ label: 'name' }"
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="formData.correctionTime"
          style="width: 50%"
          placeholder="请选择转正时间"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-button size="small" @click="onCancel">取消</el-button>
        <el-button type="primary" size="small" @click="onConfirm"
          >确定</el-button
        >
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
// 选择部门：从树形结构里选择一个部门
// 选择聘用形式
import { getDepartments } from "@/api/departments";
import { addEmployee } from "@/api/employees";
import { transListToTree } from "@/utils";
import EmployeesEnum from "@/api/constant/employees";

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      },
      loading: false,
      treeData: [],
      showTree: false, //控制树形的显示
      EmployeesEnum,
      rules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" },
          { min: 1, max: 4, trigger: "blur", message: "用户名必须是1～4位" },
        ],
        mobile: [
          { required: true, trigger: "blur", message: "请输入正确的手机号" },
          {
            pattern: /^1[3-9]\d{9}$/,
            trigger: "blur",
            message: "手机号格式不正确",
          },
        ],
        formOfEmployment: [
          { required: true, message: "聘用形式不能为空", trigger: "blur" },
        ],
        workNumber: [
          { required: true, message: "工号不能为空", trigger: "blur" },
        ],
        departmentName: [
          { required: true, message: "部门不能为空", trigger: "change" }, //change时触发
        ],
        timeOfEntry: [{ required: true, message: "入职时间", trigger: "blur" }],
      },
    };
  },
  methods: {
    onCancel() {
      this.dismissDialog();
    },
    // 点击确认按钮
    async onConfirm() {
      try {
        await this.$refs.employeeForm.validate();
        // 表单数据验证通过
        // 新增员工
        await addEmployee(this.formData);
        // 通知父组件雇员数据
        this.$parent.getEmployeeList();
        // 隐藏弹层
        this.dismissDialog();
      } catch (error) {
        this.$message(error.message);
      }
    },

    dismissDialog() {
      // 重置数据
      this.formData = {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      };

      // 移除校验
      this.$refs.employeeForm.resetFields();

      // 隐藏弹层
      this.$emit("update:showDialog", false);
    },

    // 获取部门数据：输入框聚焦时触发
    async showDepartments() {
      this.showTree = true;
      this.loading = true;
      const { depts } = await getDepartments();
      // depts是数组 但不是树形
      this.treeData = transListToTree(depts, "");
      this.loading = false;
    },
    // 树形组件-部门节点被点击时调用
    selectNode(node) {
      this.formData.departmentName = node.name;
      this.showTree = false;
    },
  },
};
</script>

<style>
</style>

