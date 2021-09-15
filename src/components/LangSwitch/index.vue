<template>
  <!-- 多语言切换插件 -->
  <el-dropdown trigger="click" @command="changeLanguage">
    <!-- 这里必须加一个div -->
    <div>
      <svg-icon style="color: #fff; font-size: 20px" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <!-- 细节：当前语言对应的选项disabled，不允许用户选 -->
      <el-dropdown-item command="zh" :disabled="'zh' === $i18n.locale"
        >中文</el-dropdown-item
      >
      <el-dropdown-item command="en" :disabled="'en' === $i18n.locale"
        >English</el-dropdown-item
      >
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookie from "js-cookie";
export default {
  methods: {
    changeLanguage(lang) {
      // 数据持久化
      Cookie.set("lang", lang);
      // 设置当前语言
      this.$i18n.locale = lang;
      // 提示
      this.$message.success("切换多语言成功");
    },
  },
};
</script>


