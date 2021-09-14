<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理" name="0">
            <!-- 角色管理 -->
            <el-row style="margin: 25px 0">
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="showDialog = true"
                >新增角色</el-button
              >
            </el-row>
            <el-table :data="rolesData" border style="width: 100%">
              <el-table-column type="index" label="序号" width="80">
              </el-table-column>
              <el-table-column prop="name" label="角色名" width="120">
              </el-table-column>
              <el-table-column prop="description" label="描述">
              </el-table-column>
              <el-table-column prop="companyId" label="操作" width="300">
                <!-- 作用域插槽 -->
                <template slot-scope="{ row }">
                  <el-button
                    size="mini"
                    type="success"
                    @click="clickAssignPermissions(row.id)"
                    >分配权限</el-button
                  >
                  <el-button
                    size="mini"
                    type="primary"
                    @click="clickEditRoleBtn(row.id)"
                    >编辑</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    @click="clickDeleteRoleBtn(row.id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-pagination
              :page-size="page.pagesize"
              layout="total, prev, pager, next"
              :total="total"
              background
              @current-change="onCurrentPageChange"
            >
            </el-pagination>
          </el-tab-pane>
          <el-tab-pane label="公司信息" name="1">
            <!-- 公司信息 -->
            <el-form :model="formData" label-width="80px" style="width: 70%">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled></el-input>
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled></el-input>
              </el-form-item>

              <el-form-item label="备注">
                <el-input v-model="formData.remarks" disabled></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <!-- 编辑角色弹层 -->
        <el-dialog :title="title" :visible="showDialog" @close="onCancelEdit">
          <el-form
            ref="roleForm"
            :model="roleForm"
            label-width="120px"
            :rules="rules"
          >
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="roleForm.name" />
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="roleForm.description" />
            </el-form-item>
          </el-form>
          <!-- 底部 -->
          <el-row slot="footer" type="flex" justify="center">
            <el-button size="small" @click="onCancelEdit">取消</el-button>
            <el-button size="small" type="primary" @click="onConfirmEdit"
              >确定</el-button
            >
          </el-row>
        </el-dialog>

        <!-- 分配权限弹层 -->
        <el-dialog
          title="分配权限"
          :visible="isShowPermDialog"
          @close="btnPermCancel"
        >
          <!-- check-strictly=true, 那表示父子勾选时，不互相关联-->
          <!-- id作为唯一标识 -->
          <el-tree
            ref="permTree"
            :data="permData"
            :props="defaultProps"
            node-key="id"
            :show-checkbox="true"
            :check-strictly="true"
            :default-expand-all="true"
            :default-checked-keys="selectCheck"
          />
          <el-row slot="footer" type="flex" justify="center">
            <el-button type="primary" size="small" @click="btnPermOK"
              >确定</el-button
            >
            <el-button size="small" @click="btnPermCancel">取消</el-button>
          </el-row>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
  updateRole,
  addRole,
  assignPerm,
} from "@/api/setting";
import { mapGetters } from "vuex";
import { transListToTree } from "@/utils";
import { getPermissionList } from "@/api/permission";

export default {
  name: "Setting",

  data() {
    return {
      rolesData: [],
      page: {
        // 放置页码及相关数据
        page: 1, //第几页
        pagesize: 10, //每页多少条
      },
      total: 0, //总条数
      formData: {
        //公司表单数据
        name: "",
        companyAddress: "",
        mailbox: "",
        remarks: "",
      },
      showDialog: false,
      roleForm: {
        //角色详情信息
        name: "",
        description: "",
      },
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
      },
      isShowPermDialog: false,
      defaultProps: {
        label: "name",
      },
      permData: [], // 专门用来接收权限数据 树形数据
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null, // 用来记录分配角色的id
    };
  },
  computed: {
    ...mapGetters(["companyId"]),
    title: function () {
      return this.roleForm.id ? "编辑角色" : "添加角色";
    },
  },

  created() {
    this.getRoleList(); // 获取角色列表
    this.getCompanyInfo(); // 获取公司信息
  },
  methods: {
    // 获取公司角色列表
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page);
      this.total = total;
      this.rolesData = rows;
    },

    // 当前页发生改变时调用
    onCurrentPageChange(curPage) {
      this.page.page = curPage;
      this.getRoleList();
    },

    // 获取的公司的信息 （companyId来自登陆时获取的公司id）
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId);
    },

    // 点击分配权限
    async clickAssignPermissions(id) {
      this.permData = transListToTree(await getPermissionList(), "0"); // 转化list到树形数据
      this.roleId = id;
      // 应该去获取 这个id的 权限点
      // 有id 就可以 id应该先记录下来
      const { permIds } = await getRoleDetail(id); // permIds是当前角色所拥有的权限点数据
      this.selectCheck = permIds; // 将当前角色所拥有的权限id赋值
      this.isShowPermDialog = true;
    },

    // 点击删除某角色
    async clickDeleteRoleBtn(id) {
      //  提示
      try {
        await this.$confirm("确认删除该角色吗");
        // 只有点击了确定 才能进入到下方
        await deleteRole(id); // 调用删除接口
        this.getRoleList(); // 重新加载数据
        this.$message.success("删除角色成功");
      } catch (error) {
        console.log(error);
      }
    },

    // 点击编辑按钮
    async clickEditRoleBtn(id) {
      this.roleForm = await getRoleDetail(id);
      this.showDialog = true; // 为了不出现闪烁的问题 先获取数据 再弹出层
    },

    // 点击编辑弹层取消按钮
    onCancelEdit() {
      // 移除校验
      this.$refs.roleForm.resetFields();

      // 通过this.roleForm.id是否存在来区分的是新增还是编辑，因此不能直接把this.roleForm={}置空
      this.roleForm = {
        name: "",
        description: "",
      };
      this.showDialog = false;
    },
    // 点击编辑弹层确认按钮
    async onConfirmEdit() {
      try {
        await this.$refs.roleForm.validate();
        // 只有校验通过的情况下 才会执行await的下方内容
        // roleForm这个对象有id就是编辑 没有id就是新增
        if (this.roleForm.id) {
          await updateRole(this.roleForm);
        } else {
          // 新增业务
          await addRole(this.roleForm);
        }
        // 重新拉取数据
        this.getRoleList();
        this.$message.success("操作成功");
        this.showDialog = false;
      } catch (error) {
        console.log(error);
      }
    },

    async btnPermOK() {
      // 调用el-tree的方法
      // console.log(this.$refs.permTree.getCheckedKeys())
      await assignPerm({
        permIds: this.$refs.permTree.getCheckedKeys(),
        id: this.roleId,
      });
      this.$message.success("分配权限成功");
      this.isShowPermDialog = false;
    },
    btnPermCancel() {
      this.selectCheck = []; // 重置数据
      this.isShowPermDialog = false;
    },
  },
};
</script>

<style>
</style>

