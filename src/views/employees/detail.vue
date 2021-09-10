<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form
              label-width="120px"
              style="margin-left: 120px; margin-top: 30px"
              :model="userInfo"
              :rules="rules"
              ref="userForm"
            >
              <el-form-item label="姓名:" prop="username">
                <el-input style="width: 300px" v-model="userInfo.username" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input
                  style="width: 300px"
                  type="password"
                  v-model="userInfo.password2"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUserInfo">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 个人详情组件: -->
            <!-- <user-info></user-info> -->
            <!-- 使用内置动态组件component: -->
            <!-- 动态组件的优点：is绑定的是组件名称的变量，可以用来切换组件 -->
            <component :is="userComponent"></component>
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <component :is="jobComponent"></component>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getUserDetailById } from "@/api/user";
import { saveUserDetailById } from "@/api/employees";
import UserInfo from "@/views/employees/components/user-info.vue";
import JobInfo from "@/views/employees/components/job-info.vue";
export default {
  name: "EmployeeDetail",
  components: {
    UserInfo,
    JobInfo,
  },
  data() {
    return {
      userComponent: "UserInfo",
      jobComponent: "JobInfo",
      userId: this.$route.params.id, // 这样可以后面直接通过 this.userId进行获取数据
      userInfo: {
        //   专门存放基本信息
        username: "",
        password2: "",
      },
      rules: {
        username: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        password2: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 9, message: "密码长度6-9位", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserDetailById();
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId);
    },
    async saveUserInfo() {
      try {
        // 校验
        await this.$refs.userForm.validate();
        await saveUserDetailById({
          ...this.userInfo,
          password: this.userInfo.password2,
        }); // 将新密码的值替换原密码的值
        this.$message.success("保存成功");
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>