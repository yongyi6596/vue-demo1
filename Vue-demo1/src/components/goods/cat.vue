<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card>
      <el-row>
        <el-col :span="12"></el-col>
        <el-col :span="12"></el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table>
        
      </tree-table>
      <!-- 分页区域 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catelist: []
    };
  },
  created() {
    this.getcatelist();
  },
  methods: {
    async getcatelist() {
      const { data: res } = await this.$http.get("categories", {
        type: 3,
        pagenum: 1,
        pagesize: 5
      });
      console.log(res.data);
      if (res.meta.status !== 200) {
        return this.$message.error("商品列表更新没有成功");
      } else {
        this.$message.success("商品更新成功了");
        this.catelist = res.data;
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
