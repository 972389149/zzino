<template>
<div id="login">
  <div class="container left_container" v-if="!isLeaving">
    <img src="./img/logo.png" alt="logo无法加载" class="smallLogo">
    <img src="./img/background.png" alt="logo无法加载" class="bigLogo" />
  </div>
  <div class="container right_container" v-if="!isLeaving">
    <div id="infoForm">
      <div class="headImg"></div>
      <input type="text" class="userApass" id="username" placeholder="用户名" name="username" v-model="userInfo.account"/>
      <input type="password" class="userApass" id="password" placeholder="密码" name="password" v-model="userInfo.password"/>
      <div class="confirm">
        <input type="text" class="conCode" placeholder="验证码" v-model="userInfo.checkcode"/>
        <img v-bind:src="userInfo.ckcodeUrl" alt="" class="codeImg confirmCode" title="看不清？点一下换一张" @click="getCheckCode"/>
      </div>
      <button id="submit" @click="login">登录</button>
      <div class="footEtc">
        <ul>
            <li><a @click="findPassword">忘记密码？</a></li>
            <li><a @click="toRegister">用户注册</a></li>
            <li><a @click="toMaster">前往主站</a></li>
        </ul>
      </div>
    </div>
  </div>

  <Loading v-if="isLeaving"></loading>
</div>
</template>

<script>
import loading from '@/components/common/loading.vue'
import LSUtils from '@/global-utils/local-storage-utils.js'
export default {
  name: 'login',
  data () {
    return {
      isLeaving: false,
      userInfo: {
        // 用v-model从表单处拿到数据
        account: '',
        password: '',
        checkcode: '',
        ckcodeUrl: ''
      },
      userId:""     //教师id
    }
  },
  components: {
    loading
  },
  mounted () {
    this.getCheckCode()
  },
  methods: {
    login () {
      // if (this.userInfo.account !== '' && this.userInfo.password !== '') {
      //   if (this.userInfo.checkcode === '') { alert('验证码不能为空！') }
      //   this.toLogin()
      // } else {
      //   alert('账号或密码不能为空！')
      // }
      if (this.userInfo.account === '' || this.userInfo.password === '') {
        alert('账号或密码不能为空！')
        return
      } else if (this.userInfo.checkcode === '') {
        alert('验证码不能为空！')
        return
      } else {
        this.toLogin()
      }
    },
    getCheckCode () {
       this.$ajax({
        url: `${this.URLroot}/IdentifyCode/`,
        method: 'get'
       }).then(res => {
         if (res.data.result === '1') {
          IS_DEV && console.log("获取验证码成功")
          this.userInfo.ckcodeUrl = this.URLroot + res.data.path
         } else {
          alert('获取验证码失败')
         }
       })
    },

    // 登录请求
    toLogin () {
      // 一般要跟后端了解密码的加密规则
      // 这里例子用的哈希算法来自./js/sha1.min.js
      // let password_sha = hex_sha1(hex_sha1( this.password ));
      var that = this
      this.$ajax({
        url: `${this.URLroot}/login/?CellPhone=${this.userInfo.account}&Type=1&PassWord=${this.userInfo.password}&checkcode=${this.userInfo.checkcode}`,
        method: 'get',
        })
      .then(res => {
        console.log(res.data)
        // console.log(res)
        if (res.data && res.data.error) {
          alert("密码或验证码错误!")
          this.getCheckCode()
        } else {
          sessionStorage.setItem('cellPhone',that.userInfo.account)
          sessionStorage.setItem('userName',res.data.UserName)
          LSUtils.setItemWithMaxAge("user", res.data, 2*60*60*1000)
          this.userId=res.data.UserID
          console.log(this.userId)
          sessionStorage.setItem("key", this.userId); 
          this.$router.push('/home')
        }
      }).catch(error => {
        alert('服务器异常，请联系维护人员！')
        console.error(error)
      })
    },
    toRegister () {
      this.$router.push('/register')
    },
    toMaster () {
      window.location.href = 'http://www.zzinno.com'
    },
    findPassword () {
      this.$router.push('/set-password')
    }
  }
}
</script>

<style lang="css" scoped>
@import './login.css'
</style>