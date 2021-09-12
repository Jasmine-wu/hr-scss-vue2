<template>
  <el-dialog title="分配角色" :visible="isShow" @close="clickCancel">
    <el-checkbox-group v-model="checkedList">
      <el-checkbox v-for="role in list" :label="role.id" :key="role.id">{{
        role.name
      }}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-button type="primary" size="small" @click="clickConfirm"
        >确定</el-button
      >
      <el-button size="small" @click="clickCancel">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from "@/api/setting";
import { getUserDetailById } from "@/api/user";
import { assignRoles } from "@/api/employees";

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      list: [], //所有角色列表
      checkedList: [], //当前用户角色选中列表
      userId: "", //当前用户id
    };
  },
  created() {
    // 获取所有角色
    this.getAllRoles();
  },
  methods: {
    // 获取所有角色
    async getAllRoles() {
      const { rows } = await getRoleList();
      this.list = rows;
    },

    // 获取当前用户角色
    async getUserRoleIds(userId) {
      const { roleIds } = await getUserDetailById(userId);
      this.checkedList = roleIds; // 赋值本用户的角色
      this.userId = userId;
    },

    // 点击确认，给用户分配角色
    async clickConfirm() {
      await assignRoles({ id: this.userId, roleIds: this.checkedList });
      this.clear();
    },

    // 点击取消
    clickCancel() {
      this.clear();
    },
    clear() {
      this.checkedList = [];
      this.$emit("update:isShow", false);
    },
  },
};
</script>


