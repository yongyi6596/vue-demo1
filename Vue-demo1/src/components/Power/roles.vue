<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialogVisible()">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand"></el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
        <el-table-column prop="level" label="操作">
          <template v-slot="slot">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户弹出框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="30%" @close="addRolesFormClose()">
      <el-form :model="addRolesInfo" :rules="addRules" ref="addRolesForm" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
         <el-input v-model="addRolesInfo.roleDesc"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles()">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 所有角色列表数据
      rolesList: [],
      // 添加角色
      addRolesInfo: {
        roleName: '',
        roleDesc: ''
      },
      addRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在3~10个字符之间', trigger: 'blur' }
        ],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 0, max: 10, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      addDialogVisible: false
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色
    async getRolesList () {
      const {
        data: res
      } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('获取数据不成功')
      } else {
        this.rolesList = res.data
        this.$message.success('获取数据成功')
      }
    },
    // 显示添加角色对话框
    showAddDialogVisible () {
      this.addDialogVisible = true
    },
    // 添加角色窗口关闭，清空所有验证
    addRolesFormClose () {
      this.$refs.addRolesForm.resetFields()
    },
    // 添加角色方法
    addRoles () {
      this.$refs.addRolesForm.validate(async valid => {
        if (!valid) {
        } else {
          const { data: res } = await this.$http.post('roles', this.addRolesInfo)
          this.getRolesList()
        }
      })
    }
  }
}
</script>

<style>
</style>
