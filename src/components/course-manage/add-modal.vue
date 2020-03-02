<template id="add-modal">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">

        <div class="modal-header"><h3>添加课程</h3></div>
        <div class="modal-body">
          <label for="subject">科目：</label>
          <select v-model="subjectSelected" id="subject">
            <option value="语文">语文</option>
            <option value="数学">数学</option>
            <option value="英语">英语</option>
            <option value="物理">物理</option>
            <option value="化学">化学</option>
            <option value="生物">生物</option>
          </select>
        </div>
        <div>
           <data-picker @ievent = "ievent"></data-picker>
        </div>
        <div class="classTime">
          <span>上课时长：45分钟</span>
        </div>
        <div class="classTime">
          <span>教学学时：</span>
          <input type="text"  v-model="teachTime">
        </div>
         <div class="classNum"> 
           <label>请选择上课地点：</label>
           <select v-model="classRoom">
            <option :value="item.ClassroomID"  v-for="item in obj">{{item.ClassroomValue}}</option>
            <!-- <option value="2">教学区102教室</option>
            <option value="3">教学区103教室</option>
            <option value="4">教学区104教室</option>
            <option value="5">教学区105教室</option>
            <option value="6">教学区106教室</option>
            <option value="7">教学区107教室</option>
            <option value="8">教学区108教室</option>
            <option value="9">教学区109教室</option>
            <option value="10">教学区110教室</option>
            <option value="11">教学区111教室</option>
            <option value="12">教学区112教室</option>
            <option value="13">教学区113教室</option>
            <option value="14">教学区114教室</option>
            <option value="15">教学区115教室</option> -->
          </select>
        </div>
        <div class="classNum"> 
          <label>请选择课时：</label>
          <select v-model="classNum">
            <option value="1">第一节</option>
            <option value="2">第二节</option>
            <option value="3">第三节</option>
            <option value="4">第四节</option>
            <option value="5">第五节</option>
            <option value="6">第六节</option>
            <option value="7">第七节</option>
            <option value="8">第八节</option>
          </select>
        </div>
        <div class="modal-footer">
          <button class="ok" @click="formatNsubmit(courseObj)">添加</button>
          <button class="cancel" @click="$emit('cancelAddM')">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dataPicker from '@/components/course-manage/data-picker.vue'
export default {
  name: 'add-modal',
  props: ['data'],
  data () {
    return {
      subjectSelected: '语文',
      classNum:"1",
      dataTime:"",
      classRoom:"1",
      teachTime:"",
      obj:{}
    }
  },
  components: {
     dataPicker:dataPicker
  },
  methods: {
    formatNsubmit: function (courseObj) {
      var courseObj = this.subjectSelected
      // console.log(courseObj)
      var classNum=this.classNum
      // console.log(classNum)
      this.$emit('handleAddM', courseObj,classNum,this.dataTime,this.classRoom,this.teachTime)
    },
    ievent:function(data){
        // console.log(data)
         this.dataTime=data
    }
  },
  mounted () {
    this.$ajax.get(`${this.URLroot}/listClassroom/`, {
      }).then(res=>{
        console.log(res.data)
        var _data=res.data
        this.obj=_data
        // this.getCourses()
      }).catch(error=>{
        console.log(error);
        alert('服务器异常，请联系维护人员！');
    });
  },
  computed: {
    courseObj: function () {
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
  z-index: 9;
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
  width: 400px;
  height: 450px;
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
  margin-left: 30px;
  width: 130px;
  height: 50px;
}
.modal-body label {
  display: inline-block;
  height: 36px;
  text-align: center;
  margin: 0 auto;
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
  margin-left: 40px;
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
.classTime{
  margin-left: 30px;
  height: 50px;
}
.classNum{
  margin-left: 30px;
  height: 50px;
}
</style>
