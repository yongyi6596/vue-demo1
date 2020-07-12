<template>
  <div>
    <!-- //头不面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限表格 -->
    <el-card>
    <el-table :data="rightsList" border stripe >
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180">
      </el-table-column>
      <el-table-column prop="path" label="路径" width="180">
      </el-table-column>
      <el-table-column prop="level" label="权限等级">
        <template v-slot="slotProp">
          <el-tag v-if="slotProp.row.level==='0'">一级</el-tag>
          <el-tag type="success"  v-else-if="slotProp.row.level==='1'">二级</el-tag>
          <el-tag type="warning"  v-else="slotProp.row.level==='2'">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
  </div>

</template>

<script>
export default {
  data () {
    return {
      // 权限列表
      rightsList: []
    }
  },
  created () {
    // 获取所有权限
    this.getRightList()
  },
  methods: {
    // 获取权限列表
    async getRightList () {
      const {
        data: res
      } = await this.$http.get('rights/list')

      if (res.meta.status !== 200) {
        this.$message.error('请求权限列表不成功')
      } else {
        this.$message.success('获取权限列表成功')
        this.rightsList = res.data
      }
    }
  }
}
</script>

<style>
  .el-card{
    margin-top: 15px;
  }
</style>
