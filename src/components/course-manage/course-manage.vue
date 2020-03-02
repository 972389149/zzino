<template>
  <div id="coursetable" style="margin-left:50px;">
    <!--   <div>for debug:</div>
    <div>cur:{{cur}}</div>
    <div>offset:{{offset}}</div>
    <div>pageTotal:{{pageTotal}}</div>
    <div>tmpLimitLen:{{tmpLimitLen}}<br>limitLen:{{limitLen}}</div> -->
    <div id="toolbar">

      <select-group :selText="selTexts" :optData="optsArr"
       @returnSel="changeSel"></select-group>

      <div id="wrap-btn">
        <button v-if="hideBtn" @click="addCourse()">添加</button>
        <button v-show="hideBtn" @click="isDeling = true ; unselect=true ; select=false">删除</button>
        <button v-if="isDeling" style="background:#f15757;" @click="cancelDel">取消</button>
        <button v-show="isDeling === true" @click="submitDel" style="background:#f15757;width:132px;">提交“删除”操作</button>
      </div>
    </div>

    <div class="wrap-table">
      <table id="table">
        <thead id="thead">
           <tr><td>&nbsp;</td><th v-for="head in columns">周{{head}}</th></tr>
        </thead>
        <tbody id="tbody">
          <tr v-for="(row, index) in schedule">
            <th v-bind:id="(index)">{{index+1}}</th>
            <td v-for="(col,colIndex) in row"> 
              <div class="wrap-course">
                <span >{{col}}</span>

                <!-- 删除模式 -->
                <img v-bind:col="(colIndex)" v-bind:row="(index)"  @click="handleDel($event)" :colt="(colIndex)" :rowt="(index)"
                 v-show="unselect&&col" class="checkbox"
                  src="./img/btn-unselect.png">
                <img v-bind:col="(colIndex)" v-bind:row="(index)"  @click="handleDel($event)" :colt="(colIndex)" :rowt="(index)"
                 v-show="select&&col&& index == (rowA) && colIndex == (colA)" class="checkbox"
                  src="./img/btn-select.png">
              </div>
            </td>
          </tr>
        </tbody>
      </table> 
    </div>
    <!--新增条目的Modal-->
    <!-- <add-modal v-if="showAddModal" @cancelAddM="cancelAdd" :data="objAdded" @handleAddM="handleAdd"></add-modal> -->
    <add-modal v-if="showAddModal" @cancelAddM="cancelAdd" @handleAddM="handleAdd"></add-modal>
  </div>
</template>

<script>
import addModal from '@/components/course-manage/add-modal.vue'
import selectGroup from '@/components/common/select-group.vue'
export default {
  name: 'course-manage',
  computed: {
    hideBtn: function () {
      return !(this.isAdding || this.isDeling)
    },
  },
  data () {
    return {
// 工具栏(toolbar)用到的：
      selTexts: ['初一', '(1)班'],
      optsArr: [],
      selValues: ['初一', '(1)班'],
// 表格(table)用到的：
      // 1.原始数据：
      columns: [ "一", "二", "三", "四", "五", "六","日"],
      courses: [],
      schedule:[],
      saveTime:[],
      courseNum:[],
      isAdding: false,
      showAddModal: false,
      isDeling: false,
      id:"",
      unselect:false,
      select:false,
      rowA:9,
      colA:9,
      courseName:"",
      courseTime:"",
      data:[],
      courseNumber:""
    }
  },
  methods: {
    changeSel: function (index, value) {
      this.$set(this.selValues, index, value)
      this.getCourses()
    },
// 表格(table)用到的：
    // 1.原始数据：
    getCourses: function () {
      var result = [];
      for (var j = 0; j < 8; j++) {
       result[j] = []
        for (var k = 0; k < 7; k++) {
          result[j][k] = ''
        }
      }
      var resultTime = [];
      for (var a = 0; a < 8; a++) {
       resultTime[a] = []
        for (var b = 0; b < 7; b++) {
          result[a][b] = ''
        }
      }
      var resultNum = [];
      for (var j = 0; j < 8; j++) {
       resultNum[j] = []
        for (var k = 0; k < 7; k++) {
          resultNum[j][k] = ''
        }
      }
      this.$ajax.get(`${this.URLroot}/ClassCourses/?Type=1&grade=${this.selValues[0]}&class=${this.selValues[1]}`, {
        }).then(res=>{
          var _data=res.data;
          for(var i=0;i<_data.length;i++){
            for(var item in _data[i]){
              var m=_data[i][item].Weekday-1;
              var n=_data[i][item].CourseNum;
              result[n-1][m]=_data[i][item].CourseName;
              resultTime[n-1][m]=_data[i][item].StartTime;
              resultNum[n-1][m]=_data[i][item].CourseNum;
            }
          }
          // console.log(result);
          this.schedule=result;
          this.saveTime=resultTime
          this.courseNum=resultNum
        }).catch(error=>{
          console.log(error);
          alert('服务器异常，请联系维护人员！');
      });
    },
    // 增加模式：
    addCourse: function (rowNum, colNum) {
      this.showAddModal = true
    },
    cancelAdd: function () {
      this.showAddModal = false
    },
    cancelAllAdd: function () {
      this.isAdding = false
    },
    handleAdd: function (...data) {
      var myDate=new Date()
      var hour=myDate.getHours()
      var min=myDate.getMinutes()
      var second=myDate.getSeconds()
      data[2]=data[2]+" "+hour+":"+min+":"+second
      console.log(data)
      console.log(this.selTexts[0])
      console.log(this.selTexts[1])
      this.data=data
      this.$ajax.get(`${this.URLroot}/ClassCourses/addCourse/?Type=1&grade=${this.selTexts[0]}&class=${this.selTexts[1]}&teacherid=${this.id}&classromid=${data[3]}&classhour=${data[4]}&coursename=${data[0]}`, {
        }).then(res=>{
          console.log(res.data)
          if(res.data.error){
            alert(res.data.error)
            return ;
          }
          else{
              this.$ajax.get(`${this.URLroot}/ClassCourses/assignCourse/?Type=1&grade=${this.selTexts[0]}&class=${this.selTexts[1]}&coursename=${data[0]}&starttime=${data[2]}&duration=45&coursenum=${data[1]}`, {
                }).then(res=>{
                  if(res.data.error){
                     alert(res.data.error)
                     return ;
                  }
                  console.log(res.data)
                  this.getCourses()
                }).catch(error=>{
                  console.log(error);
                  alert('服务器异常，请联系维护人员！');
              });
          }
        }).catch(error=>{
          console.log(error);
          alert('服务器异常，请联系维护人员！');
      });
      this.showAddModal = false
    },
    submitAdd: function () {
    },
    // 删除模式：
    cancelDel: function () {
      this.isDeling = false
      this.unselect=false
      this.select=false      
 },
    handleDel: function (event) {
      this.select=true
      // console.log(event.currentTarget.getAttribute('colt'))
      // console.log(this.colA)
      // console.log(this.rowA)
      if(this.colA==event.currentTarget.getAttribute('colt')&&this.rowA==event.currentTarget.getAttribute('rowt')){
          this.colA=9
          this.rowA=9
      }
      else{
        this.colA=event.currentTarget.getAttribute('colt')
        this.rowA=event.currentTarget.getAttribute('rowt')
      }  
      // console.log(this.colA)
      // console.log(this.rowA)
      // console.log(this.schedule)
      // console.log(this.saveTime)
      // console.log(this.schedule[this.rowA][this.colA])
      // console.log(this.saveTime[this.rowA][this.colA])
      this.courseName=this.schedule[this.rowA][this.colA]
      this.courseTime=this.saveTime[this.rowA][this.colA]
      this.courseNumber=this.courseNum[this.rowA][this.colA]
    },
    submitDel: function () {
      if(this.colA==9){
        alert("请先选要删除的课程")
        return ;
      }
      else{
          // this.$ajax.get(`${this.URLroot}/ClassCourses/delCourse/?Type=1&grade=${this.selTexts[0]}&class=${this.selTexts[1]}&coursename=${this.courseName}`, {
          //   }).then(res=>{
          //     console.log(res.data)
          //     if(res.data.error){
          //       alert(res.data.error)
          //       return ;
          //     }
          //     else{
                  this.$ajax.get(`${this.URLroot}/ClassCourses/unassignCourse/?Type=1&grade=${this.selTexts[0]}&class=${this.selTexts[1]}&starttime=${this.courseTime}&coursenum=${this.courseNumber}`, {
                    }).then(res=>{
                      console.log(res.data)
                      this.getCourses()
                    }).catch(error=>{
                      console.log(error);
                      alert('服务器异常，请联系维护人员！');
                  });
                  this.cancelDel()
              // }
          //   }).catch(error=>{
          //     console.log(error);
          //     alert('服务器异常，请联系维护人员！');
          // });
       }    
    }
  },
  mounted () {
    // console.log(this.rowA)
    // console.log(this.colA)
    this.id = sessionStorage.getItem("key"); 
    var _weekOpts = []
    var _tempOpt = {}
    for (var i = 1; i < 21; i++) {
      _tempOpt = {
        text: '第' + i + '周',
        value: i
      }
      _weekOpts.push(_tempOpt)
    }
    this.optsArr.push(this.optionsArr.gradeOpts)
    this.optsArr.push(this.optionsArr.classOpts)
    this.optsArr.push(_weekOpts)
    this.optsArr.push(this.optionsArr.subjectOpts)
    this.getCourses()
  },
  components: {
    addModal: addModal,
    selectGroup: selectGroup
  },
  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*@import './course-manage.css'*/
/*在IE和火狐下，因为表格的虚线边框和表格背景相矛盾，所以加多一层父元素来做背景：*/
.wrap-table {
    /*父元素的宽高由子元素来决定：*/
    /*https://segmentfault.com/q/1010000005654981*/
    float: left;
    overflow: hidden;
  
    position: relative;
    top: 4px;
  
    margin: 0 0 30px 0;
    background: #fff;
  }
  /*table td {
    background-color: #fff;
  }*/
  table {
    border-collapse:collapse;
    border: 2px solid #dcdcdc;
  
    text-align: center;
  }
  th {
    font-weight: normal;
  }
  table td {
    box-sizing: border-box;
    border: 1px dashed #dcdcdc;
    position: relative;
  }
  table th, #thead td {
    background-color: #dcdcdc;
  }
  thead th {
    box-sizing: border-box;
    height: 48px;
    width: 140px;
  }
  thead td {
    box-sizing: border-box;
    width: 36px;
  }
  #tbody th {
    box-sizing: border-box;
    width: 36px;
    height: 60px;
  }
  /*img {
    width: 16px;
    height: 16px;
  }*/
  #toolbar {
    width: 1018px;
    height: 32px;
    margin-top: 40px;
  }
  #wrap-btn {
    float: right;
  }
  button {
    width: 64px;
    height: 32px;
    margin-left: 4px;
    background: #00aa7a;
    color: #ffffff;
    border: 0;
    padding: 0;
  }
  .filtered {
    background: #eee;
    color: #333;
  }
  /*下面这个名要改：*/
  .checkbox {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 24px;
    height: 24px;
  }
</style>
