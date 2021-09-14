<template>
  <el-row
    type="flex"
    justify="space-around"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col>
      <span>{{ nodeData.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>
          <span>{{ nodeData.manager }}</span>
        </el-col>
        <el-col>
          <el-dropdown @command="operatoeDepts">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- 使用混入对象的checkPermission方法检查功能权限 -->
              <el-dropdown-item
                command="add"
                :disabled="!checkPermission('add-dept')"
                >添加子部门</el-dropdown-item
              >
              <el-dropdown-item v-if="!isRoot" command="edit"
                >编辑部门</el-dropdown-item
              >
              <el-dropdown-item v-if="!isRoot" command="del">
                删除部门</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import { delDepartments } from "@/api/departments";
export default {
  name: "TreeNode",
  props: {
    nodeData: {
      type: Object,
      required: true,
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    //部门操作
    operatoeDepts(command) {
      if (command === "add") {
        // 添加部门
        this.$emit("add-dept", this.nodeData);
      } else if (command === "edit") {
        // 编辑部门
        this.$emit("edit-dept", this.nodeData);
      } else {
        // 删除部门
        this.$confirm("确认要删除该部门？")
          .then(() => {
            // 确认删除
            return delDepartments(this.nodeData.id);
          })
          .then((res) => {
            //  如果删除成功了  就会进入这里
            this.$emit("del-dept"); // 触发自定义事件
            this.$message.success("删除部门成功");
          });
      }
    },
  },
};
</script>