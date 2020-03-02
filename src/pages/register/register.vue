<template>
    <div class="container">
        <div id="backgd">
            <div></div>
            <div></div>
        </div>
        <div id="register">
            <div class="regHeading"></div>
            <p>注册</p>
            <div id="userSel">
                <div class="userSel_item" :class="{'userSel_itemclick' :thisIndex === index}" v-for="(item,index) in navbar" :id="item.id" @click="tabchange(index)" :key="item.id">{{item.title}}</div>
            </div>
            <div id="userCon">
                <div class="userCon_item manager" v-if="tab==='manager'">
                    <div>
                        <img src="./img/name.png" alt="" />
                        <span>用户名</span>
                        <input type="text" placeholder="请设置您的用户名（昵称）" id="usernameM" name="usernameM" v-model="registerData.username"/>
                    </div>
                    <div>
                        <img src="./img/post.png" alt="" />
                        <span>邮箱</span>
                        <input type="text" placeholder="请输入您的邮箱" id="emailM" name="emailM" v-model="registerData.email"/>
                    </div>
                    <div>
                        <img src="./img/id.png" alt="" />
                        <span>身份证</span>
                        <input type="text" placeholder="请输入您的身份证号" maxlength="18" id="idcodeM" name="idcodeM" v-model="registerData.idCard"/>
                    </div>
                    <div>
                        <img src="./img/sex.png" alt="" />
                        <span>性别</span>
                        <input type="radio" name="sex1" value="1" v-model="registerData.sex"/>男
                        <input type="radio" name="sex1" value="2" v-model="registerData.sex"/>女
                    </div>
                    <div>
                        <img src="./img/phone-num.png" alt="" />
                        <span>手机号</span>
                        <input type="text" placeholder="请输入您的手机号" maxlength="11" id="telM" name="telM" v-model="registerData.telNumber"/>
                    </div>
                    <div>
                        <img src="./img/identify.png" alt="" />
                        <span>验证码</span>
                        <input type="text" placeholder="请输入手机验证码"  maxlength="6" class="confirmCodeInput" id="confirmCodeInput_" v-model="registerData.SmsCode"/>
                        <button class="IdentifySms" @click='phoneCode'>{{phoneCode_}}</button>
                    </div>
                    <div>
                        <img src="./img/post.png" alt="" />
                        <span>职位</span>
                        <input type="text" placeholder="请输入您的职位" id="jobM" name="jobM" v-model="registerData.job"/>
                    </div>
                    <div>
                        <img src="./img/post.png" alt="" />
                        <span>年级</span>
                        <select name="selected" v-model='registerData.grade' style="margin-left: 10px;">  
                            <option value="初一">初 一</option>  
                            <option value="初二">初 二</option>  
                            <option value="初三">初 三</option> 
                            <option value="高一">高 一</option> 
                            <option value="高二">高 二</option> 
                            <option value="高三">高 三</option> 
                        </select>  
                        <!-- <input type="text" placeholder="请选择年级" id="gradeM" name="gradeM" v-model="registerData.grade"/> -->
                    </div>
                    <div>
                        <img src="./img/post.png" alt="" />
                        <span>班级</span>
                        <select name="selected" v-model='registerData.class' style="margin-left: 10px;">  
                            <option value="(1)班">(1) 班</option>  
                            <option value="(2)班">(2) 班</option>  
                            <option value="(3)班">(3) 班</option> 
                            <option value="(4)班">(4) 班</option> 
                            <option value="(5)班">(5) 班</option> 
                            <option value="(6)班">(6) 班</option> 
                        </select> 
                        <!-- <input type="text" placeholder="请选择班级" id="classM" name="classM" v-model="registerData.class"/> -->
                    </div>
                    <div>
                        <img src="./img/time.png" alt="" />
                        <span>入职时间</span>
                        <input type="date" id="timeM" v-model="registerData.jobTime"/>
                    </div>
                    <div>
                        <img src="./img/password.png" alt="" />
                        <span>密码</span>
                        <input type="password" placeholder="请设置您的密码(6-16位纯英文字母)" id="passwordM" name="passwordM" v-model="registerData.password"/>
                    </div>
                    <div>
                        <img src="./img/identify.png" alt="" />
                        <span>验证码</span>
                        <input type="text" placeholder="请输入验证码"  maxlength="4" id="confirmCodeInput1"  class="confirmCodeInput" v-model="registerData.codeConfirm"/>
                        <img v-bind:src="checkCode" alt="" class="confirmCode" style="width:120px" @click="getCheckCode"/>
                    </div>
                    <button class="submit" id="managerSm" @click="register">注册</button>
            </div>
                <!-- <div class="userCon_item teacher" v-if="tab==='teacher'">
                    <div>
                        <img src="./img/name.png" alt="" />
                        <span>用户名</span>
                        <input type="text" placeholder="请设置您的用户名" v-model="registerData.username"/>
                    </div>
                    <div>
                        <img src="./img/phone-num.png" alt="" />
                        <span>手机号</span>
                        <input type="text" placeholder="请输入您的手机号" v-model="registerData.telNumber"/>
                    </div>
                    <div>
                        <img src="./img/id.png" alt="" />
                        <span>身份证</span>
                        <input type="text" placeholder="请输入您的身份证号" v-model="registerData.idCard"/>
                    </div>
                    <div>
                        <img src="./img/sex.png" alt="" />
                        <span>性别</span>
                        <input type="radio" name="sex2" value="1" v-model="registerData.sex"/>男
                        <input type="radio" name="sex2" value="2" v-model="registerData.sex"/>女
                    </div>
                    <div>
                        <img src="./img/post.png" alt="" />
                        <span>职位</span>
                        <input type="text" placeholder="请输入您的职位" v-model="registerData.job"/>
                    </div>
                    <div>
                        <img src="./img/time.png" alt="" />
                        <span>入职时间</span>
                        <input type="date" v-model="registerData.jobTime"/>
                    </div>
                    <div>
                        <img src="./img/password.png" alt="" />
                        <span>密码</span>
                        <input type="password" placeholder="请设置您的密码(6-16位纯英文字母)" v-model="registerData.password"/>
                    </div>
                    <div>
                        <img src="./img/identify.png" alt="" />
                        <span>验证码</span>
                        <input type="text" placeholder="请输入验证码" id="confirmCodeInput2" class="confirmCodeInput" v-model="registerData.codeConfirm"/>
                        <img v-bind:src="checkCode" alt="" class="confirmCode" style="width:65px" @click="getCheckCode"/>
                    </div>
                    <button class="submit" id="teacherSm" @click="register">注册</button>
                </div>
                <div class="userCon_item parent" v-if="tab==='parent'">
                    <div>
                        <img src="./img/name.png" alt="" />
                        <span>用户名</span>
                        <input type="text" placeholder="请设置您的用户名" v-model="registerData.username"/>
                    </div>
                    <div>
                        <img src="./img/phone-num.png" alt="" />
                        <span>手机号</span>
                        <input type="text" placeholder="请输入您的手机号" v-model="registerData.telNumber"/>
                    </div>
                    <div>
                        <img src="./img/id.png" alt="" />
                        <span>身份证</span>
                        <input type="text" placeholder="请输入您的身份证号" v-model="registerData.idCard"/>
                    </div>
                    <div>
                        <img src="./img/sex.png" alt="" />
                        <span>性别</span>
                        <input type="radio" name="sex3" value="1" v-model="registerData.sex"/>男
                        <input type="radio" name="sex3" value="2" v-model="registerData.sex"/>女
                    </div>
                    <div>
                        <img src="./img/password.png" alt="" />
                        <span>密码</span>
                        <input type="password" placeholder="请设置您的密码(6-16位纯英文字母)" v-model="registerData.password"/>
                    </div>
                    <div>
                        <img src="./img/identify.png" alt="" />
                        <span>验证码</span>
                        <input type="text" placeholder="请输入验证码" id="confirmCodeInput3" class="confirmCodeInput" v-model="registerData.codeConfirm"/>
                        <img v-bind:src="checkCode" alt="" class="confirmCode" style="width:65px" @click="getCheckCode"/>
                    </div>
                    <button class="submit" id="parentSm" @click="register">注册</button>
                </div> -->
            </div>
        </div>
    </div>
</template>
<script>
export default{
  name: 'register',
  data: function () {
    return {
      tab: 'manager',
      phoneCode_: '获取手机验证码',
      disabled_: false,
      thisIndex: 0,
      checkCode: 0,
      registerData: {
        username: '',
        telNumber: '',
        idCard: '',
        sex: 1,
        job: '',
        jobTime: '',
        password: '',
        codeConfirm: '',
        class: '(1)班',
        grade: '初一',
        email: '',
        SmsCode: ''
      },
      navbar: [
        {
          id: 'manager',
          title: '管理员'
        },
        {
          id: 'teacher',
          title: '老师'
        },
        {
          id: 'parent',
          title: '家长'
        }
      ]
    }
  },
  mounted () {
    setTimeout(this.getCheckCode(),500)
  },
  methods: {
    phoneCode: function(){
        var that = this
        if(this.disabled){
            alert('手机验证码已经发送了哟~')
            return
        }
        if(this.registerData.telNumber.length == 11){
            this.$ajax({
                url: `${this.URLroot}/IdentifySms/?smstype=1&phone=`+that.registerData.telNumber,
                method: 'get'
              }).then(res => {
                if(res.data.result == 'OK'){
                    that.phoneCode_ = '验证码已经发送'
                    that.disabled = true
                }else{
                    alert('臣妾也不知道为什么验证码发不出去呀~')
                }
              })
        }else{
            alert('只有手机号码填写正确才能收到验证码哟~')
        } 
    },
    tabchange (thisindex, e) {
      e = e || window.event
      this.thisIndex = thisindex
      this.tab = e.target.id
    },
    getCheckCode () {
        var that = this
      this.$ajax({
        url: `${this.URLroot}/IdentifyCode/`,
        method: 'get'
      }).then(res => {
        if (res.data.result === '1') {
        // console.log(that.getCookie('sessionid'))
          this.checkCode = this.URLroot + res.data.path
        } else {
          alert('获取验证码失败')
        }
      })
    },
    register (e) {
      var usertype
      switch (this.tab) {
        case 'manager':
          usertype = 0
          break
        case 'teacher':
          usertype = 1
          break
        case 'parent':
          usertype = 2
          break
      }
      this.$ajax({
        url: `${this.URLroot}/register/?Type=1&CellPhone=${this.registerData.telNumber}&PassWord=${this.registerData.password}&IdCard=${this.registerData.idCard}&Name=${this.registerData.username}&Sex=1&UserType=1&SchoolID=1&PositionInfo=${this.registerData.job}&Email=${this.registerData.email}&InductionTime=${this.registerData.jobTime}&SmsCode=${this.registerData.SmsCode}&class=${this.registerData.class}&grade=${this.registerData.grade}&CheckCode=${this.registerData.codeConfirm}`,
        method: 'get'
      }).then(res => {
            // if(res.data.result == 1){
            //     alert('注册成功，前往登录')
            //     this.$router.push('/login')
            // }else{
            //     alert('注册失败！')
            // }
            alert('注册成功，前往登录')
            this.$router.push('/login')
      })
    }
  }
}
</script>
<style lang="css" scoped>
@import './register.css'
</style>