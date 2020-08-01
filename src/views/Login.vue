<template>
  <div class="login">
    <van-nav-bar
      title="GG音乐登录"
      left-arrow
    />
    <van-form @submit="login">
      <van-field
        v-model="userInfo.phone"
        placeholder="用户名/邮箱/手机号"
      />
      <van-field
        v-model="userInfo.password"
        :type="isEye ? 'text' : 'password'"
        placeholder="请输入密码"
        :right-icon="isEye ? 'eye-o' : 'closed-eye'"
        @click-right-icon="changePwdIcon"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">
          登录
        </van-button>
        
      </div>
    </van-form>
    <div class="changRegister clearfix">
      <div class="fl">忘记密码</div>
      <div class="fr">手机快速注册</div>
    </div>
    
  </div>
</template>

<script>
import axios from '@/plugins/axios.js' 
  export default {
    data() {
      return {
        isEye:true,
        userInfo:{
          phone: '',
          password: '',
        }
      };
    },
    methods: {
      //切换密码框的眼睛
      changePwdIcon() {
        this.isEye = !this.isEye;
      },

      //登录
      login() {
        
        
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
          duration: 0
        });

        this.axios({
          method:'GET',
          url:'/login/cellphone',
          params:{
            phone:this.userInfo.phone,
            password:this.userInfo.password
          }
        }).then(res => {
          this.$toast.clear();
          
          if(res.data.code==200){
            this.$router.push({name:'Main'})
            localStorage.setItem("__tnek",res.data.token)
          }
        }).catch(err => {
          this.$toast.clear();
          

        })

      },


    },
  }
</script>

<style lang="less" scoped>
  .login{
    /deep/ [class*=van-hairline]::after{
      border-color: #fff;
    }
    /deep/ .van-cell{
      margin-top: 15px;
    }
    /deep/ .van-form{
      margin-top: 20px;
      padding: 0 10px;
    }
    /deep/ .van-button--info{
      background-color: skyblue;
      border-color: skyblue;
      height: 50px;
      font-size: 16px;
    }
    /deep/ .van-button{
      line-height: normal;
    }
    .changRegister{
      color: #bbb;
      padding: 10px 20px;
    }
    .one_login{
      background-color: #fff;
      color: #ff2000;
      border-color: #ff2000;
      margin-top: 10px;
    }
  }
</style>