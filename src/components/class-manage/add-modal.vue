<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">

        <div class="modal-header"><h3>添加班级信息</h3></div>
        <div class="modal-body">
        <!-- for-id v-modal
         span v-show="showtips" class  -->
          <label>班级：</label>
          <select v-model="claObj.grade">
            <option>初一</option>
            <option>初二</option>
            <option>初三</option>
            <option>高一</option>
            <option>高二</option>
            <option>高三</option>
          </select>
          <select v-model="claObj.class">
            <option>(1)班</option>
            <option>(2)班</option>
            <option>(3)班</option>
            <option>(4)班</option>
            <option>(5)班</option>
          </select><br>
          <label for="locate">班级位置：</label>
          <input type="text" v-model="claObj.ClassRoom"> 
          <label>班主任：</label>
          <input id="Headmaster" type="text" v-model="claObj.TeacherName"> 
          <br>
          <label>班别类型：</label>
          <select v-model='claObj.classTypeName'>
            <option selected="selected">文科</option>
            <option>理科</option>
          </select>
          <br>
          <span v-show='checkmes' style='color: red;font-size: 11px;margin-left: 35px;'>
            请先完善所有信息再提交
          </span>
        </div>
        <div class="modal-footer">
          <button class="ok" @click="formatNsubmit(claObj)">添加</button>
          <button class="cancel" @click="$emit('cancelAddM')">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import param from '@/global-utils/utils' 
export default {
  name: 'add-modal',
  props:["classes"],
  data () {
    return {
      showLocateTs: false,
      //获取添加班级的信息
      claObj: {"Type":"1"},
      checkmes: false
    }
  },
  components: {
  },
  methods: {
    formatNsubmit: function (claObj) {
      var _Array = JSON.stringify(claObj).split(',')
      for(var i=0;i<this.classes.length;i++){
        if(this.claObj.TeacherName == this.classes[i].claTeacher){
          alert('该老师已存在')
          this.$emit('submitAddM')
          this.$emit('getClasses')
          return
        }
      }
     if(_Array.length != 6){
        this.checkmes = true
     }else{
        this.$ajax.get(`${this.URLroot}/insertClass/?Type=1&grade=${this.claObj.grade}&class=${this.claObj.class}&ClassRoom=${this.claObj.ClassRoom}&classTypeName=${this.claObj.classTypeName}&TeacherName=${this.claObj.TeacherName}`).then(res => {
          this.checkmes = false
          if(res.data.error == 'this class is exist'){
            alert('班级已存在')
          }
          this.$emit('submitAddM')
          this.$emit('getClasses')
        }).catch(error => {
          alert('添加错误！原因1：参数填写错误。原因2：网络故障。')
        }) 
     } 
    }
  },
  mounted () {
    // 需要一个ajax，获得教师信息
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
  height: 300px;
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
.modal-body input[type="number"] {
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
.tips {
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
</style>
