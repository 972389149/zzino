<template id="add-modal">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">

        <div class="modal-header"><h3>添加学生</h3></div>
        <div class="modal-body">
          <label for="name">姓名：</label>
          <input id="name" type="text" v-model="stuObj.name">
          <span v-show="showNameTs" class="name-tips">请输入姓名！</span><br>
          <label for="stuNum">学号：</label>
          <input id="stuNum" type="text" v-model="stuObj.stuNum">
          <span v-show="showStuNumTs" class="stuNum-tips">请输入学号！</span><br>
          <label>班级：</label>
          <!-- <select v-model="gradeSelected">
            <option>初一</option>
            <option>初二</option>
            <option>初三</option>
            <option>高一</option>
            <option>高二</option>
            <option>高三</option>
          </select>
          <select v-model="classSelected">
            <option>(1)班</option>
            <option>(2)班</option>
            <option>(3)班</option>
            <option>(4)班</option>
            <option>(5)班</option>
          </select><br> -->
          <span class="block">{{gradeData}}{{classData}}</span>
          <label>性别：</label>
          <input type="radio" id="boy" value="1" v-model="sexSelected">
          <label for="boy" id="boy-label">男</label>
          <input type="radio" id="girl" value="2" v-model="sexSelected">
          <label for="girl" id="girl-label">女</label>
        </div>
        <div class="modal-footer">
          <button class="ok" @click="formatNsubmit(stuObj)">添加</button>
          <button class="cancel" @click="$emit('cancelAddM')">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'add-modal',
  props:["gradeData","classData"],
  data () {
    return {
      sexSelected: '1',
      classSelected: '(1)班',
      gradeSelected: '初一',
      showNameTs: false,
      showStuNumTs: false,

      stuObj: {}
    }
  },
  components: {
  },
  methods: {
    formatNsubmit: function (stuObj) {
      if (stuObj.name && stuObj.stuNum) {
        stuObj.sex = this.sexSelected
        stuObj.classSelected = this.classSelected
        stuObj.gradeSelected = this.gradeSelected
        this.$emit('submitAddM', stuObj)
      } else {
        this.showNameTs = !stuObj.name
        this.showStuNumTs = !stuObj.stuNum
      }
    }
  },
  mounted () {
  },
  computed: {
  }
}
</script>

<style scoped>
/*来自：
*https://cn.vuejs.org/v2/examples/modal.html
*/
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  height: 270px;
  box-sizing: border-box;
  border: 2px solid #00ab7a;
  margin: 0px auto;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
}
.modal-header {
  background: #00ab7a;
}
.modal-header h3 {
  margin-top: 0;
  color: #fff;
  font-size: 16px;
  line-height: 40px;
  text-align: center;
}

.modal-body {
  margin: 20px 0 10px 0;
}
.modal-body label {
  display: inline-block;
  width: 100px;
  height: 36px;

  text-align: right;
}
.modal-body input[type="text"] {
  width: 90px;
  font-size: 14px;
  height: 16px;
  vertical-align: text-bottom;
}
/*暂时的样式：*/
.modal-body select {
  width: 64px;
  height: 28px;
  cursor: pointer;
}
.modal-footer button {
  float: left;
  width: 80px;
  height: 36px;
  padding: 0;
  font-size: 14px;

  cursor: pointer;
}
.ok {
  margin-left: 60px;
  background: #00ab7a;
  color: #ffffff;
  border: 0;
}
.cancel {
  margin-left: 20px;
  border: 2px solid #00ab7a;
  color: #00ab7a;
  background: #fff;
}
.name-tips, .stuNum-tips {
  color: #ccc;
}
/*new:*/
input[type="text"] {  
  background:transparent;
  border-color:#ccc;
  border-style:solid;
  border-top-width:0px;
  border-right-width:0px;
  border-bottom-width:1px; 
  border-left-width:0px;

  outline:none;
}
#boy-label, #girl-label {
  width: auto;
  cursor: pointer;
}
.block{
   margin-right: 50px;
}
</style>
