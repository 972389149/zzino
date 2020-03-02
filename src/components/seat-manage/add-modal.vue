<template id="add-modal">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">

        <div class="modal-header"><h3>添加学生</h3></div>
        <div class="modal-body">
          <label>位置：</label>
          <span>{{stuObj.rowNum+1}}行{{stuObj.colNum+1}}列</span><br>
          <!-- <label for="stuName">姓名：</label>
          <input id="stuName" type="text" v-model="stuObj.stuName">
          <span v-show="showStuNameTs" class="name-tips">请输入姓名！</span><br> -->
          <label for="stuId">学号：</label>
          <input id="stuId" type="text" v-model="stuObj.stuId">
          <span v-show="showStuIdTs" class="stuNum-tips">请输入学号！</span><br>
          <!-- <label for="sex">性别：</label>
          <select v-model="sexSelected" id="sex">
            <option value="1">男</option>
            <option value="2">女</option>
          </select><br> -->
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
  props: ['data'],
  data () {
    return {
      // sexSelected: '1',
      // showStuNameTs: false,
      showStuIdTs: false
    }
  },
  components: {
  },
  methods: {
    formatNsubmit: function (stuObj) {
      // if (stuObj.stuName && stuObj.stuId) {
      //   stuObj.sex = this.sexSelected
      //   this.$emit('handleAddM', stuObj)
      // } else {
      //   this.showStuNameTs = !stuObj.stuName
      //   this.showStuIdTs = !stuObj.stuId
      // }
      if (stuObj.stuId) {
        // stuObj.sex = this.sexSelected
        this.$emit('handleAddM', stuObj)
      } else {
        this.showStuIdTs = !stuObj.stuId
      }
    }
  },
  mounted () {
  },
  computed: {
    stuObj: function () {
      return Object.assign({}, this.data)
    }
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
  height: 210px;
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
.modal-body input {
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
input {  
  background:transparent;
  border-color:#ccc;
  border-style:solid;
  border-top-width:0px;
  border-right-width:0px;
  border-bottom-width:1px; 
  border-left-width:0px;

  outline:none;
}
</style>
