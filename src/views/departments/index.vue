<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 组织架构：头部 -->
        <tree-node :node-data="titles" :is-root="true"></tree-node>

        <!-- 组织架构：树形控件 -->
        <el-tree :data="departs" :props="defaultProps">
          <!-- 传入插槽内容:自定义组件tree-node -->
          <tree-node slot-scope="{ data }" :node-data="data"></tree-node>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeNode from "@/views/departments/components/tree-node.vue";
import { getDepartments } from "@/api/departments";
import { transListToTree } from "@/utils";

export default {
  components: {
    TreeNode,
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
    };
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments();
      this.titles = {
        name: result.companyName,
        manager: result.companyManager,
      };
      // 将后台原始数组数组转成树形数据
      const transResults = transListToTree(result.depts, "");
      this.departs = transResults;
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

