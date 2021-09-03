<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 组织架构：头部 -->
        <tree-node
          :node-data="titles"
          :is-root="true"
          @add-dept="onClickAddDepartment"
        ></tree-node>

        <!-- 组织架构：树形控件 -->
        <el-tree :data="departs" :props="defaultProps">
          <!-- 传入插槽内容:自定义组件tree-node -->
          <tree-node
            slot-scope="{ data }"
            :node-data="data"
            @del-dept="getDepartments"
            @add-dept="onClickAddDepartment"
          ></tree-node>
        </el-tree>
      </el-card>
    </div>

    <!-- 添加部门对话框 -->
    <dialog-department-add
      v-if="isShowAddDepartmentDialog"
      :isShow="isShowAddDepartmentDialog"
      :dept-id="deptId"
      @update-depts="getDepartments"
      @cancel="isShowAddDepartmentDialog = false"
    ></dialog-department-add>
  </div>
</template>

<script>
import TreeNode from "@/views/departments/components/tree-node.vue";
import DialogDepartmentAdd from "@/views/departments/components/dialog-department-add.vue";
import { getDepartments } from "@/api/departments";
import { transListToTree } from "@/utils";

export default {
  components: {
    TreeNode,
    DialogDepartmentAdd,
  },
  created() {
    // 获取部门数据
    this.getDepartments();
  },
  data() {
    return {
      titles: {},
      departs: [],
      defaultProps: {
        label: "name",
      },
      isShowAddDepartmentDialog: false, //是否显示添加部门对话框
      deptId: "", //部门ID
    };
  },
  methods: {
    // 获取部门
    async getDepartments() {
      const result = await getDepartments();
      // 给头部treeNode添加id：原数据是没有id属性的
      this.titles = {
        name: result.companyName,
        manager: result.companyManager,
        id: "",
      };
      // 将后台原始数组数组转成树形数据
      const transResults = transListToTree(result.depts, "");
      this.departs = transResults;
    },
    // 点击添加部门
    onClickAddDepartment(deptId) {
      this.deptId = deptId;
      this.isShowAddDepartmentDialog = true;
    },
  },
};
</script>

<style lang="scss" scope>
.tree-card {
  padding: 30px 100px;
  font-size: 14px;
}
</style>

