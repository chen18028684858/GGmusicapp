<template>
  <div class="register">
    <van-nav-bar
      title="GG音乐注册"
      left-arrow
      @click-left="goBack"
    />
    <van-form @submit="register">
      <van-field
        v-model="userInfo.phone"
        @change="existence"
        placeholder="手机号"
        :rules="[
          { 
            required: true, 
            message: '请填写手机号' 
          },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: '请填写正确的手机号'
          }
        ]"
      />
      <van-field
        v-model="userInfo.nickName"
        placeholder="昵称"
      />
      <van-field
        v-model="userInfo.password"
        :type="isEye ? 'text' : 'password'"
        placeholder="请输入密码"
        :right-icon="isEye ? 'eye-o' : 'closed-eye'"
        @click-right-icon="changePwdIcon"
      />
      <van-field
        v-model="userInfo.captcha"
        center
        clearable
        label="短信验证码"
        placeholder="请输入短信验证码"
        
      >
        <template #button>
          <van-button size="small" :disabled="isSend" @click="sent" type="primary">{{text}}</van-button>
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button  round block type="info" native-type="submit">
          注册
        </van-button>
      </div>
    </van-form>
    
    
  </div>
</template>

<script>
import axios from '@/plugins/axios.js' 

  export default {
    data(){
      return {
        isEye:true,
        userInfo:{
          phone:'',
          password:'',
          nickName:'',
          captcha:''
        },
        //判断是否被注册过
        isRegister:false,
        //按钮文本内容
        text:'发送验证码',
        //控制按钮display
        isSend:false,
        //判断验证码是否正确
        isVerify:false
      }
    },
    methods:{
      //切换密码框的眼睛
      changePwdIcon() {
        this.isEye = !this.isEye;
      },

      goBack(){
        this.$router.go(-1)
      },

      //验证手机是否被注册过
      existence(){
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
          duration: 0
        });

        this.axios({
          method:'GET',
          url:'/cellphone/existence/check',
          params:{
            phone:this.userInfo.phone
          }
        }).then(res => {
          this.$toast.clear();
          
          if(res.data.exist == 1){
            this.isRegister = true
            this.$toast('该手机号已被注册')
          }else{
            this.isRegister = false

          }
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      //发送验证码
      sent(){

        //获取邮箱验证码
        let num = 60;
        this.text = num + '秒后重新发送';
        this.isSend = true;
        let timer = setInterval(() => {
          if(num == 0){
            clearInterval(timer);
            timer = null;
            this.text = '发送验证码';
            this.isSend = false
          }else{
            num--;
            this.text = num + '秒后重新发送';
          }
        },1000)

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
          duration: 0
        });

        this.axios({
          method:'GET',
          url:'/captcha/sent',
          params:{
            phone:this.userInfo.phone
          }
        }).then(res => {
          this.$toast.clear();
          

        }).catch(err => {
          this.$toast.clear();
          

        })
      },

      //验证验证码
      // verify(){
        
      //   this.$toast.loading({
      //     message: '加载中...',
      //     forbidClick: true,
      //     //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
      //     duration: 0
      //   });

        

      // },

      //注册
      register(info){

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
          duration: 0
        });

        this.axios({
          method:'GET',
          url:'/captcha/verify',
          params:{
            phone:this.userInfo.phone,
            captcha:this.userInfo.captcha
          }
        }).then(res => {
          this.$toast.clear();
          
          if(res.data.code == 200){
            this.isVerify = true

          }else{
            this.isVerify = false

          }
            

        }).catch(err => {
          this.$toast.clear();
          

        })
        if(this.isVerify==true && this.isRegister==true ){
  
          this.axios({
            method:'GET',
            url:'/register/cellphone',
            params:{
              phone :info.phone,
              password:info.password,
              nickname:info.nickName,
              captcha:info.captcha,
            }
          }).then(res => {
            this.$toast.clear();
            this.$router.push({name:'Login'})
  
          }).catch(err => {
            this.$toast.clear();
  
          })

        }else if(this.isVerify==false){
          
        }

      }

    }
  }
</script>

<style lang="less" scoped>
  .register{
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
    .van-button--primary{
      background-color: skyblue;
      border-color: skyblue;
    }
    .changRegister{
      color: #bbb;
      padding: 10px 20px;
    }
    
  }
</style>