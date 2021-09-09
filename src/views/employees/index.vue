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
          <span>共xxx条记录</span>
        </template>

        <template slot="after">
          <el-button size="small" type="warning">导入</el-button>
          <el-button size="small" type="danger">导出</el-button>
          <el-button size="small" type="primary">新增员工</el-button>
        </template>
      </page-tools>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>

