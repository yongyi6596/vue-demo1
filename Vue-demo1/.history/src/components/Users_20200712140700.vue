<template>
  <div>
    <!-- //面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- //卡片试图区域/ -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- //用户列表区 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" sortable width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" sortable width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" sortable width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" sortable width="180"></el-table-column>
        <el-table-column label="状态" sortable width="180">
          <template v-slot="slotProps">
            <el-switch
              v-model="slotProps.row.mg_state"
              @change="userStateChange(slotProps.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" sortable width="180">
          <template v-slot="slotProps">
            <el-row>
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="mini"
                @click="showEditDialog(slotProps.row.id)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                size="mini"
                @click="removeUsers(slotProps.row.id)"
              ></el-button>
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top-start"
                :enterable="false"
              >
                <el-button type="success" icon="el-icon-check" circle size="mini"></el-button>
              </el-tooltip>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!-- //分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5,10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" @close="addDialogClosed" :visible.sync="addDialogVisible" width="30%">
      <el-form ref="addFormRef" :model="addForm" label-width="70px" :rules="addFormRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- //修改用户信息的对话框 -->
    <el-dialog title="修改用户" :visible.sync="ediDialogVisible" width="30%" @close="ediDialogClosed">
      <el-form ref="amendForm" label-width="70px" :model="amendForm" :rules="ediFormRules">
        <el-form-item label="用户名">
          <el-input v-model="amendForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="amendForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="amendForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ediDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="amenduser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的自定义规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})/;

      if (regEmail.test(value)) {
        return cb();
      } else {
        cb(new Error("请输入合法邮箱"));
      }
    };
    // 验证手机号的自定义规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      } else {
        cb(new Error("请输入合法手机号"));
      }
    };
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        // 用户ID
        query: "",
        // 当前页面的页码
        pagenum: 1,
        // 当前每页显示多少数据
        pagesize: 10
      },
      amendForm: {
        id: "",
        mobile: null,
        email: null
      },
      addDialogVisible: false,
      ediDialogVisible: false,
      removeDialogVisible: false,
      userList: [],
      total: 0,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: null
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3~10个字符之间",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 15,
            message: "密码的长度在6~15位之间",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            validator: checkEmail,
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          {
            validator: checkMobile,
            trigger: "blur"
          }
        ]
      },
      ediFormRules: {
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            validator: checkEmail,
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          {
            validator: checkMobile,
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败！");
      } else {
        this.userList = res.data.users;
        this.total = res.data.total;
        return this.$message.success("获取用户列表成功！");
      }
    },
    handleSizeChange(newSize) {
      (this.queryInfo.pagesize = newSize), this.getUserList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    async userStateChange(el) {
      const { data: res } = await this.$http.put(
        `users/${el.id}/state/${el.mg_state}`
      );
      console.log(res);
      if (res.meta.status !== 200) {
        this.el.mg_state = !el.mg_state;
        return this.$message.error("设置用户状态失败！");
      } else {
        return this.$message.success("设置用户状态成功");
      }
    },
    // 关闭添加用户框，重置所有验证
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
        } else {
          const { data: res } = await this.$http.post("users", this.addForm);
          if (res.meta.status !== 201) {
            return this.$message.error("添加用户失败");
          } else {
            this.$message.success("添加用户成功");
            this.addDialogVisible = false;
            this.getUserList();
          }
        }
      });
    },
    // 修改用户
    async showEditDialog(id) {
      this.ediDialogVisible = true;
      const { data: res } = await this.$http.get(`users/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户失败");
      } else {
        this.amendForm = res.data;
      }
    },
    // 关闭用户框，重置所有验证
    ediDialogClosed() {
      this.$refs.amendForm.resetFields();
    },
    amenduser() {
      this.$refs.amendForm.validate(async valid => {
        if (!valid) {
        } else {
          const { data: res } = await this.$http.put(
            `users/${this.amendForm.id}`,
            this.amendForm
          );
          if (res.meta.status !== 200) {
            this.$message.error("用户修改失败");
          } else {
            this.$message.success("用户修改成功");
            this.getUserList();
            this.ediDialogVisible = false;
          }
        }
      });
    },
    // 删除用户
    showRemoveDialog(id) {
      this.removeDialogVisible = true;
    },
    async removeUsers(id) {
      await this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const { data: res } = await this.$http.delete(`users/${id}`, id);
        this.getUserList();
      });
      this.$message({
        type: "success",
        message: "删除成功!"
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}

.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}

.el-table {
  margin-top: 15px;
  font-size: 12px;
}

.el-pagination {
  margin-top: 10px;
}
</style>
