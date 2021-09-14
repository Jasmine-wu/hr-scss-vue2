
 <template>
  <!-- 权限点页面 -->
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button
            type="primary"
            size="small"
            @click="showAddPermissionDialog('0', 1)"
            >添加权限</el-button
          >
        </template>
      </page-tools>
      <!-- 表格 -->
      <!-- el-table渲染树形数据必须指定row-key:row的唯一标识 -->
      <el-table border :data="treeData" row-key="id">
        <el-table-column align="left" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <!-- 只要第一层目录才有添加按钮 -->
            <el-button
              v-if="row.type === 1"
              type="text"
              @click="showAddPermissionDialog(row.id, 2)"
              >添加</el-button
            >
            <el-button type="text" @click="showEditPermissionDialog(row.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="clickDeletePermissionBtn(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增/编辑弹层 -->
      <el-dialog
        :title="title"
        :visible="isShowAddorEditDialog"
        @close="dismissDialog"
      >
        <!-- 表单 -->
        <el-form
          ref="perForm"
          :model="formData"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width: 90%" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" style="width: 90%" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" style="width: 90%" />
          </el-form-item>
          <el-form-item label="开启">
            <el-switch
              v-model="formData.enVisible"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>

        <el-row slot="footer" type="flex" justify="center">
          <el-button size="small" type="primary" @click="clickConfirmBtn"
            >确定</el-button
          >
          <el-button size="small" @click="dismissDialog">取消</el-button>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>


<script>
import { transListToTree } from "@/utils";
import {
  updatePermission,
  addPermission,
  getPermissionDetail,
  delPermission,
  getPermissionList,
} from "@/api/permission";
export default {
  created() {
    this.getAllPermissons();
  },
  data() {
    return {
      treeData: [], //所有权限
      isShowAddorEditDialog: false,
      formData: {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0", // 开启
      },
      rules: {
        name: [
          { required: true, message: "权限名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "权限标识不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    title() {
      return this.formData.id ? "编辑权限" : "新增权限";
    },
  },

  // 获取权限列表
  methods: {
    async getAllPermissons() {
      // 将列表数据转换成树形层级数据
      this.treeData = transListToTree(await getPermissionList(), "0");
    },
    // 添加权限
    showAddPermissionDialog(pid, type) {
      this.formData.pid = pid;
      this.formData.type = type;
      this.isShowAddorEditDialog = true;
    },

    // 编辑权限
    async showEditPermissionDialog(id) {
      this.formData = await getPermissionDetail(id);
      this.isShowAddorEditDialog = true;
    },

    // 删除权限
    async clickDeletePermissionBtn(id) {
      try {
        await this.$confirm("确定要删除该数据吗");
        await delPermission(id);
        this.getAllPermissons();
        this.$message.success("删除成功");
      } catch (error) {
        console.log(error);
      }
    },

    // 确认添加/编辑权限
    clickConfirmBtn() {
      // 区分是添加还是编辑
      this.$refs.perForm
        .validate()
        .then(() => {
          if (this.formData.id) {
            return updatePermission(this.formData);
          }
          return addPermission(this.formData);
        })
        .then(() => {
          //  提示消息
          this.$message.success("新增成功");
          this.getAllPermissons();
          this.dismissDialog();
        });
    },
    dismissDialog() {
      this.$refs.perForm.resetFields();
      this.formData = {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0", // 开启
      };
      this.isShowAddorEditDialog = false;
    },
  },
};
</script>

<style>
</style>

