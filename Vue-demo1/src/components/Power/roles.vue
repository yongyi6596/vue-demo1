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
        <el-table-column type="expand">
          <template v-slot="slotp">

            <el-row class="bdbottom  vcenter" v-for="item in slotp.row.children" :key="item.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(slotp.row,item.id)"> {{item.authName}}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row class="bdbottom vcenter" v-for="item2 in item.children " :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(slotp.row,item2.id)"> {{item2.authName}}</el-tag>
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 渲染三级权限 -->
                    <el-tag type="warning" closable v-for="item3 in item2.children" :key="item3.id" @close="removeRightById(slotp.row,item3.id)">{{item3.authName}}</el-tag>
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
        <el-table-column prop="level" label="操作">
          <template v-slot="slot">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="ediRoles(slot.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRoles(slot.row.id)"> </el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRightDialog(slot.row)"></el-button>
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
    <!-- 编辑用户弹出框 -->
    <el-dialog title="编辑角色" :visible.sync="ediDialogVisible" width="30%" @close="ediRolesFormClose()">
      <el-form :model="ediRolesInfo" :rules="ediRules" ref="ediRolesForm" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="ediRolesInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="ediRolesInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ediDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ediRoled()">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 分配权限树状图 -->
     <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="30%" @close="setRightFormClose()">
       <el-tree :data="setRightInfo" ref="tree" show-checkbox :props="setRightProp"  node-key="id" default-expand-all :default-checked-keys="setRightArray"></el-tree>
       <span slot="footer" class="dialog-footer">
         <el-button @click="setRightDialogVisible = false">取 消</el-button>
         <el-button type="primary"   @click="getCheckedKeys">确 定</el-button>
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
      // 添加角色信息
      addRolesInfo: {
        roleName: '',
        roleDesc: ''
      },
      // 编辑用户角色信息
      ediRolesInfo: {
        roleId: 0,
        roleName: '',
        roleDesc: ''
      },
      // 添加用户验证规则
      addRules: {
        roleName: [{
          required: true,
          message: '请输入角色名称',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 10,
          message: '用户名的长度在3~10个字符之间',
          trigger: 'blur'
        }
        ],
        roleDesc: [{
          required: true,
          message: '请输入角色描述',
          trigger: 'blur'
        },
        {
          min: 0,
          max: 10,
          message: '请输入角色描述',
          trigger: 'blur'
        }
        ]
      },
      // 编辑用户验证规则
      ediRules: {
        roleName: [{
          required: true,
          message: '请输入角色名称',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 10,
          message: '用户名的长度在3~10个字符之间',
          trigger: 'blur'
        }
        ],
        roleDesc: [{
          required: true,
          message: '请输入角色描述',
          trigger: 'blur'
        },
        {
          min: 0,
          max: 10,
          message: '请输入角色描述',
          trigger: 'blur'
        }
        ]
      },
      // 添加用户弹框控制
      addDialogVisible: false,
      // 编辑用户弹框控制
      ediDialogVisible: false,
      // 树状图显示隐藏
      setRightDialogVisible: false,
      // 权限设置信息
      setRightInfo: {},
      // 树形控件绑定对象，以children向下分组，以label显示想要的文字
      setRightProp: {
        children: 'children',
        label: 'authName'
      },
      // 树状图默认显示权限的数组
      setRightArray: [],
      // 即将分配权限的角色id
      roleId: 0
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
        if (!valid) {} else {
          const {
            data: res
          } = await this.$http.post('roles', this.addRolesInfo)
          this.getRolesList()
          this.addDialogVisible = false
        }
      })
    },
    // 编辑用户事件
    async ediRoles (id) {
      this.ediDialogVisible = true
      const {
        data: res
      } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        this.$message.error('请求数据不成功')
      } else {
        this.$message.success('请求数据成功')
        this.ediRolesInfo = res.data
      }
    },
    // 编辑用户弹框关闭事件
    ediRolesFormClose () {
      this.$refs.ediRolesForm.resetFields()
    },
    // 编辑用户
    ediRoled () {
      this.$refs.ediRolesForm.validate(async valid => {
        if (!valid) {

        } else {
          const {
            data: res
          } = await this.$http.put(`roles/${this.ediRolesInfo.roleId}`, this.ediRolesInfo)
          this.getRolesList()
          this.ediDialogVisible = false
        }
      })
    },
    deleteRoles (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {
          data: res
        } = await this.$http.delete(`roles/${id}`)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getRolesList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除权限操作
    removeRightById (Role, rightid) {
      this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {
          data: res
        } = await this.$http.delete(`roles/${Role.id}/rights/${rightid}`)
        Role.children = res.data
        this.$message({
          type: 'success',
          message: '删除成功!'

        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 显示权限分配树状图，并默认显示该角色拥有的权限
    async showRightDialog (row) {
      const { data: res } = await this.$http.get('rights/tree')
      this.setRightInfo = res.data
      // 调用递归函数,获得该角色默认在树状图中显示的第三级权限
      function getRightlist (node, arr) {
        if (!node.children) {
          return arr.push(node.id)
        } else {
          node.children.forEach(item => {
            getRightlist(item, arr)
          })
        }
      }
      getRightlist(row, this.setRightArray)
      // 通过roleID将row.id在getCheckedKeys()使用
      this.roleId = row.id
      this.setRightDialogVisible = true
    },

    // 当分配权限树状图关闭时,将默认显示权限的数组清空
    setRightFormClose () {
      this.setRightArray = []
    },
    // 获得树状图中选中的权限的数组，准备发送给服务器
    async getCheckedKeys () {
      const keys = [...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()]
      const strkeys = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: strkeys })

      if (res.meta.status !== 200) {
        return this.$message.error('修改权限没有成功')
      } else {
        this.$message.success('权限修改成功')
        this.setRightDialogVisible = false
        this.getRolesList()
      }
    }

  }
}
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 20px;
  }

  ;

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .bdbottom:nth-child(1) {
    border-top: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
