<template>
  <el-dialog title="添加部门" :visible="isShow" @close="$emit('cancel')">
    <el-form
      :model="form"
      :rules="rules"
      label-width="120px"
      label-position="right"
    >
      <el-form-item label="部门名称" placeholder="请输入1-50个字符" prop="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="部门编号" placeholder="请输入1-50个字符" prop="code">
        <el-input v-model="form.code" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="form.manager"
          @focus="getManagers"
          placeholder="请选择"
        >
          <el-option
            v-for="(people, index) in peoples"
            :key="index"
            :label="people.username"
            :value="people.username"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="部门介绍"
        placeholder="请输入1-300个字符"
        prop="introduce"
      >
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入内容"
          v-model="form.introduce"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getDepartments } from "@/api/departments";
import { getEmployeeSimple } from "@/api/employees";

export default {
  name: "DialogDepartmentAdd",
  props: {
    isShow: {
      type: false,
      default: false,
    },
    deptId: {
      type: [String, Number, Object],
      required: true,
    },
  },

  data() {
    // 检查部门name是否重复：
    // 同级部门下是否有重复的部门名称
    const checkNameRepeat = async (rule, value, callback) => {
      // 去除左右空格
      value = value.trim();
      // 获取所有部门数据
      const { depts } = await getDepartments();
      // 找到该部门下所有子部门
      const subdepts = depts.filter((item) => item.pid === this.deptId);
      // 检查该部门名称在子部门中是否重复
      // find/some的区别 find返回符合条件的item, some满足条件则返回true
      const isExist = subdepts.some((item) => item.name === value);

      isExist ? callback(new Error(`同级部门下已存在${value}`)) : callback();
    };

    // 检查部门编码是否重复：
    // 部门编码在整个模块中都不允许重复
    const checkCodeRepeat = async (rule, value, callback) => {
      // 去除左右空格
      value = value.trim();
      // 获取所有部门数据
      const { depts } = await getDepartments();

      depts.some((item) => item.code === value)
        ? callback(new Error("编号已存在"))
        : callback();
    };
    return {
      form: {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      },
      // 表单校验规则
      rules: {
        name: [
          { required: true, message: "部门名称必须填写", trigger: "blur" }, //默认支持
          { min: 1, max: 50, message: "长度必须在1-50之内", trigger: "blur" }, //默认支持
          { trigger: "blur", validator: checkNameRepeat }, //自定义校验规则可通过函数
        ],
        code: [
          { required: true, message: "部门编号必须填写", trigger: "blur" },
          { min: 1, max: 50, message: "长度必须在1-50之内", trigger: "blur" },
          { trigger: "blur", validator: checkCodeRepeat },
        ],
        manager: [
          { required: true, message: "部门责任人必须填写", trigger: "blur" },
          { min: 1, max: 50, message: "长度必须在1-50之内", trigger: "blur" },
        ],
        introduce: [
          { required: true, message: "部门介绍必须填写", trigger: "blur" },
          { min: 1, max: 300, message: "长度必须在1-300之内", trigger: "blur" },
        ],
      },
      peoples: [],
    };
  },
  methods: {
    // 点击确认
    onConfirm() {
      this.$emit("confirm");
    },
    // 点击取消
    onCancel() {
      this.$emit("cancel");
    },
    // 获取部门负责人数据
    async getManagers() {
      // 下拉框里的部门负责人从所有人里选
      const employees = await getEmployeeSimple();
      this.peoples = employees;
    },
  },
};
</script>