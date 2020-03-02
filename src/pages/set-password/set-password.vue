<template>
    <div class="container">
        <div id="backgd">
            <div></div>
            <div></div>
        </div>
        <div class="Setpw">
            <div class="regHeading"></div>
            <p>修改密码</p>
            <ul class="stateBar" :class="{'stateBar_on':status === 3}">
                <li class="stateItem stateProcess" :class="{'stateProcess_on':status >= 1}">验证身份</li>
                <li class="stateItem stateProcess" :class="{'stateProcess_on':status >= 2}">设置新密码</li>
                <li class="stateItem" :class="{'stateItem_on':status === 3}">完成</li>
            </ul>
            <div class="stateContent">
                <div class="contentItem" v-if="status === 1">
                    <div>
                        <span>手机号</span>
                        <input type="text" v-model="userId">
                    </div>
                    <div>
                        <span>验证码</span>
                        <input type="text" class="codeConfirm" maxlength="11">
                        <span class="getConfirm" @click='getCode'>获取短信验证码</span>
                    </div>
                    <button @click="nextProcess">下一步</button>
                </div>
                <div class="contentItem" v-else-if="status === 2">
                    <div>
                        <span>设置新密码</span>
                        <input type="text" v-model="newPassword" maxlength="16">
                    </div>
                    <div>
                        <span>确认密码</span>
                        <input type="text" v-model="oldPassword" maxlength="16">
                    </div>
                    <button @click="nextProcess">下一步</button>
                </div>
                <div class="contentItem" v-else-if="status === 3">
                    <p>密码重设成功！</p>
                    <button @click="toLogin">立即登录</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import LSUtils from '@/global-utils/local-storage-utils.js'
    export default{
      name: 'set-password',
      data: function () {
        return {
          status: 1,
          userId: '',
          oldPassword: '',
          newPassword: '',
          code: ''
        }
      },
      mounted () {
          // 修改密码需要userid
          console.log(LSUtils.getItemWithMaxAge("user").UserID)
      },
      methods: {
        nextProcess () {
            if(this.status === 2 && this.userId && this.oldPassword && this.newPassword) {
                this.$ajax({
                    url: `${this.URLroot}/PasswordChange`,
                    method: 'get',
                    data: {
                        userID: this.userId,
                        oldPassword: this.oldPassword,
                        newPassword: this.newPassword
                    }
                }).then(res => {
                    if (res.data[0].Result !== '1') {
                        alert(res.data[0].message)
                    }
                })
            } else {
                alert('信息填写不完整');
            }
          this.status++
        },
        toLogin () {
          this.$router.push('/login')
        },
        getCode (){
            var that = this
            if(that.userId.length == 11){
                this.$ajax({
                    url: `${this.URLroot}/IdentifySms/`,
                    method: 'get',
                    data: {
                        Type: 1,
                        smstype: 2,
                        phone: that.userId
                    }
                }).then(res => {
                    console.log(res.data)
                })
            }else{
                alert('手机号不符合格式')
            }
        }
      }
    }
</script>

<style lang="css" scoped>
@import './set-password.css'
</style>