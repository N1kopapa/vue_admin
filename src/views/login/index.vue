<template>
  <div class="page">
    <div class="login-container">
      <div class="left"></div>
      <div class="right">
        <!-- <svg viewBox="0 0 320 300">
          <defs>
            <linearGradient
              inkscape:collect="always"
              id="linearGradient"
              x1="13"
              y1="193.49992"
              x2="307"
              y2="193.49992"
              gradientUnits="userSpaceOnUse"
            >
              <stop style="stop-color:#ff00ff;" offset="0" id="stop876" />
              <stop style="stop-color:#ff0000;" offset="1" id="stop878" />
            </linearGradient>
          </defs>
          <path
            d="m 40,120.00016 239.99984,-3.2e-4 c 0,0 24.99263,0.79932 25.00016,35.00016 0.008,34.20084 -25.00016,35 -25.00016,35 h -239.99984 c 0,-0.0205 -25,4.01348 -25,38.5 0,34.48652 25,38.5 25,38.5 h 215 c 0,0 20,-0.99604 20,-25 0,-24.00396 -20,-25 -20,-25 h -190 c 0,0 -20,1.71033 -20,25 0,24.00396 20,25 20,25 h 168.57143"
          />
        </svg>-->
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          autocomplete="on"
          label-position="left"
        >
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              id="username"
              ref="username"
              v-model="loginForm.username"
              placeholder="Username"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>

          <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                id="password"
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="Password"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </el-tooltip>
          <el-button class="submit" id="submit" @click.native.prevent="handleLogin">Login</el-button>
        </el-form>
      </div>
    </div>
    <div class="login-footer">
      <div class="login-footer-content">
        <span>开发人员：2016072053 周旭</span>
        <el-popover placement="top-start" width="200" trigger="hover">
          <div class="weixinCode">
            <img src="https://img13.360buyimg.com/jdcms/s150x150_jfs/t1/10018/13/6490/138053/5c209aafEa10695fe/0d41fbfd0b2acdf1.jpg.webp" alt="">
          </div>
          <el-button type="text" slot="reference">联系方式：微信</el-button>
        </el-popover>
        <span>网站备案：鲁ICP备18044872号-1</span>
        <a href="https://www.jianshu.com/u/76e71c842014">|&nbsp;博客：N1kopapa</a>
      </div>
    </div>
  </div>
</template>

<script>
// 非法校验
import { validUsername } from "@/utils/validate";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "admin",
        password: "111111"
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.changeInputStyle();
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || "/",
                query: this.otherQuery
              });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    // 首页登录动画
    changeInputStyle() {
      let current = null;
      document
        .querySelector("#username")
        .addEventListener("focus", function(e) {
          if (current) current.pause();
          current = anime({
            targets: "path",
            strokeDashoffset: {
              value: 0,
              duration: 700,
              easing: "easeOutQuart"
            },
            strokeDasharray: {
              value: "240 1386",
              duration: 700,
              easing: "easeOutQuart"
            }
          });
        });
      document
        .querySelector("#password")
        .addEventListener("focus", function(e) {
          if (current) current.pause();
          current = anime({
            targets: "path",
            strokeDashoffset: {
              value: -336,
              duration: 700,
              easing: "easeOutQuart"
            },
            strokeDasharray: {
              value: "240 1386",
              duration: 700,
              easing: "easeOutQuart"
            }
          });
        });
      document.querySelector("#submit").addEventListener("focus", function(e) {
        if (current) current.pause();
        current = anime({
          targets: "path",
          strokeDashoffset: {
            value: -730,
            duration: 700,
            easing: "easeOutQuart"
          },
          strokeDasharray: {
            value: "530 1386",
            duration: 700,
            easing: "easeOutQuart"
          }
        });
      });
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #474a59;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #e2e2e5;
$dark_gray: #889aa4;
$light_gray: #eee;
.page {
  background: $bg;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: absolute;
  place-content: center;
  width: 100%;
  .login-container {
    display: flex;
    height: 320px;
    margin: 0 auto;
    width: 640px;
    .left {
      background: white;
      height: calc(100% - 40px);
      top: 20px;
      position: relative;
      width: 50%;
    }
    .right {
      background: #474a59;
      box-shadow: 0px 0px 40px 16px rgba(0, 0, 0, 0.22);
      color: #f1f1f2;
      position: relative;
      width: 50%;
      .login-form /deep/ {
        position: relative;
        width: 520px;
        max-width: 100%;
        padding: 35px 35px 0;
        margin: 0 auto;
        overflow: hidden;
        input {
          background: transparent;
          border: 0;
          color: #f2f2f2;
          font-size: 20px;
          height: 30px;
          line-height: 30px;
          outline: none !important;
          width: 100%;
        }
      }

      .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
          &:first-of-type {
            margin-right: 16px;
          }
        }
      }

      .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
      }

      .title-container {
        position: relative;

        .title {
          font-size: 26px;
          color: $light_gray;
          margin: 0px auto 40px auto;
          text-align: center;
          font-weight: bold;
        }
      }

      .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
      }

      .thirdparty-button {
        position: absolute;
        right: 0;
        bottom: 6px;
      }

      @media only screen and (max-width: 470px) {
        .thirdparty-button {
          display: none;
        }
      }
    }
  }
  .login-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 50px;
    background: #39424d;
    color: #ffffff;
    font-size: 14px;
    padding-top: 10px;
    .login-footer-content {
      text-align: center;
      /deep/ .el-button--text{
        color:#ffffff
      }
      span {
        // margin-top: 5px;
        // display: block;
        text-align: center;
        margin: 0 auto;
      }
      span:after {
        content: "  |  ";
      }
      span:last-of-type:after {
        content: "";
      }
    }
  }
}
</style>
