<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登陆表单区域 -->
      <el-form
        label-width="0px"
        class="login_form"
        :rules="loginFormRules"
        :model="loginForm"
        ref="loginFormRef"
      >
        <!-- 用户名,prop为这个iten校验对象下面有定义 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 ，prop为这个iten校验对象下面有定义-->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      // 这是表单验证规则对象
      loginFormRules: {
        // 验证用户名
        username: [
          // 验证用户名是否合法
          { required: true, message: "请输入正确的用户名", trigger: "blur" },
          // 验证用户名长度
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        // 验证密码
        password: [
          // 验证用户名是否合法
          { required: true, message: "请输入正确的密码", trigger: "blur" },
          // 验证密码长度
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetLoginForm() {
      // elementUI提供的resetFields方法，可以重置表单对象
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        var { data: res } = await this.$http.post("login", this.loginForm);

        if (res.meta.status !== 200) {
          return this.$message.error("登陆失败");
        } else {
          this.$message.success("登录成功");
          // 1.将登录成功之后的token，保存在客户端的sessionStorage中
          // 1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
          // 1.2 token 只应在当前网站打开期间生效。所以将token保存在sessionStorage
          // 2 .通过编程式导航，跳转到后台主页，路由地址是/home
          window.sessionStorage.setItem("token", res.data.token);
          // 成功后，跳转到/home页面
          this.$router.push("/home");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: aliceblue;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;

    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
