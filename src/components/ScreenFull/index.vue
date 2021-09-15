
<template>
  <!-- 全屏显示插件 -->
  <div>
    <svg-icon
      icon-class="fullscreen"
      @click="changeScreenMode"
      style="color: #fff; width: 20px; height: 20px"
    >
    </svg-icon>
  </div>
</template>
<script>
import ScreenFull from "screenfull";
export default {
  methods: {
    // 点击切换全屏
    changeScreenMode() {
      // 如果全凭功能不可用
      if (!ScreenFull.isEnabled) {
        return this.$message.warning("此时全屏不可用");
      }
      // 如果可以全屏
      // 切换全凭
      ScreenFull.toggle();
    },
  },
};
</script>