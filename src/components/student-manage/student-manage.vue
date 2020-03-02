<template>
  <div id="studenttable">

    <div id="toolbar">

      <select-group :selText="selTexts" :optData="optsArr"
       @returnSel="changeSel"></select-group>

      <span id="btn-wrap">
        <button v-show="hideBtn" @click="showAdd">添加</button>

        <button v-show="hideBtn" @click="isDeling = true">删除</button>
        <button v-if="isDeling" style="background:#f15757;" @click="cancelDel">取消</button>
        <button v-show="isDeling === true" @click="submitDel" style="background:#f15757;width:132px;">提交“删除”操作</button>

        <button v-show="hideBtn" @click="isEditing = true">编辑</button>
        <button v-if="isEditing" style="background:#f15757;" @click="cancelEdit">取消</button>
        <button v-show="isEditing === true" @click="submitEdit" style="background:#f15757;width:132px;">提交“编辑”操作</button>
      </span>
    </div>

    <div id="wrap-show">
      <ul id="show">
        <li v-for="stu in students">
          <dl @click='toStuDetail(stu)'>  <!--last modified by Erin:修改bug,删除和编辑模式下不跳转-->
            <dt>姓名:</dt>
            <dd class="stuName">
              <span v-if="stu.edited === false">{{stu["stuName"]}}</span>
              <input v-if="stu.edited === true" type="text" v-model="stu['stuName']">
              <!-- <span>{{stu["stuName"]}}</span> -->
            </dd>
            <dt>学号:</dt>
            <dd class="stuId">
              <!-- <span  v-if="stu.edited === false">{{stu["stuId"]}}</span>
              <input v-if="stu.edited === true" type="text" v-model="stu['stuId']"> -->
              <span>{{stu["stuId"]}}</span>
            </dd>
            <dt>性别:</dt>
            <dd class="sex">
              <span v-if="stu.edited === false">{{stu["sex"]}}</span>
              <!-- <input v-if="stu.edited === true" type="text" v-model="stu['sex']"> -->
              <select v-if="stu.edited === true" name="selected" v-model="stu['sex']">  
                  <option value="男">男</option>  
                  <option value="女">女</option>   
              </select> 
            </dd>
          </dl>

          <!-- 编辑模式 -->
          <!-- <img v-if="!valueBeforeEdit[stu.stuId] || !is2ndclick[stu.stuId]" class="checkbox" src="./img/btn-edit.png" v-show="isEditing === true" @click="handleEdit($event, stu)"/>
          <img v-if="valueBeforeEdit[stu.stuId] && is2ndclick[stu.stuId]" class="checkbox" src="./img/btn-select.png" v-show="isEditing === true" @click="handleEdit($event, stu)"/> -->
          <img v-if="stu.editing" class="checkbox" src="./img/btn-edit.png" v-show="isEditing === true" @click="handleEdit($event, stu)"/>
          <img v-if="stu.edited_" class="checkbox" src="./img/btn-select.png" v-show="isEditing === true" @click="handleEdit($event, stu)"/>
          <img v-if="stu.edit" class="checkbox" src="./img/btn-unselect.png" v-show="isEditing === true" @click="handleEdit($event, stu)"/>
          <!-- 删除模式 -->
          <img @click="handleDel($event, stu)"
           v-show="isDeling&&!stu.deled" class="checkbox"
            src="./img/btn-unselect.png">
          <img @click="handleDel($event, stu)"
           v-show="isDeling&&stu.deled" class="checkbox"
            src="./img/btn-select.png">
        </li>
      </ul>
    </div>

    <!--新增条目的Modal-->
    <add-modal v-if="showAddModal" @cancelAddM="cancelAdd" @submitAddM="submitAdd" :gradeData="gradeData"  :classData="classData" ></add-modal>
    <!-- <div style="position:absolute;top:0;left:0;">{{fortest}}</div> -->
  </div>
</template>


<script>
// 1到9的学号默认不给删除：
import addModal from '@/components/student-manage/add-modal.vue'
import selectGroup from '@/components/common/select-group.vue'
import LSUtils from '@/global-utils/local-storage-utils.js'
import param from '@/global-utils/utils'
export default {
  name: 'student-manage',
  computed: {
    hideBtn: function () {
      return !(this.isDeling || this.isEditing)
    }
    // fortest: function () {
    //   return JSON.stringify(this.editedObj)
    // }
  },
  data () {
    return {
      editing: true,
      edited: false,
      edit: false,
      editList: [],
// 工具栏(toolbar)用到的：
      selTexts: ['初一', '(1)班'],
      optsArr: [],
      selValues: ['初一', '(1)班'],

// 表格(table)用到的：
      // 原始数据：
      students: [
        // 数据模板：
        // {
        //   stuName: '李搜索',
        //   sex: '男',
        //   stuId: '123',
        //   editing: true,
        //   edited: false,
        //   edit: fale,
        //   deled: false
        // }
      ],
      students_: [],
      // 修改模式：
      editedObj: [], // 用来发给后台
      isEditing: false, // 是否编辑模式
      is2ndclick: {},
      valueBeforeEdit: {}, // 对比出是否修改过
      // 添加模式：
      showAddModal: false,
      // 删除模式：
      deledObj: [],
      isDeling: false,
      classData:" ",
      gradeData:" "
    }
  },
  methods: {
    changeSel: function (index, value) {
      // 等价于：this.selValues[index] = value
      this.$set(this.selValues, index, value)
      this.getStudents()
    },
    // 表格(table)用到的：
    // 1.公共工具函数：
    // 根据class获取一个元素:
    // 下面这个函数暂时没有被启用：
    getByClass: function (parent, clsName) {
      var elements = parent.getElementsByTagName('*') // 拿到所有子元素
      for (var i = 0; i < elements.length; i++) {
        if (elements[i].className === clsName) {
          return elements[i]
        }
      }
    },

    showAdd:function(){
      this.showAddModal=true;
      this.gradeData=this.selValues[0]
      this.classData=this.selValues[1]
    },
    // 2.原始数据：
    getStudents: function () {
      let _this = this;
      this.$ajax.get(`${this.URLroot}/StudentPosition/?Type=1&grade=${this.selValues[0]}&class=${this.selValues[1]}`
      ).then(res => {
        // console.log(res.data.error);
        if(res.data.error){
          // alert(res.data.error);
        }
        IS_DEV && console.log(res.data)
        var _courses = res.data
        var reformattedArray = []
        var _obj = {}
        for (var key in _courses) {
          if (key === 'error') {
            break; //跳出循环，this.students直接赋值为空
          }
          _obj = {}
          _obj.stuId = key + ""
          _obj.stuName = _courses[key].StudentName
          if (_courses[key].Sex == 1) {
            _obj.sex = '男'
          } else if (_courses[key].Sex == 2) {
            _obj.sex = '女'
          } else {
            _obj.sex = 'error'
          }

          _obj.edited = false
          _obj.edited_ = false
          _obj.editing = true
          _obj.edit = false
          _obj.deled = false
          //路由跳转后需要座位参数，将RowCount和ColumnCount添加到学生对象里,加一是为了和当前座位表对应
          _obj.RowCount = _courses[key].RowCount+1  //学生座位行号  last modified by Erin
          _obj.ColumnCount = _courses[key].ColumnCount+1  //学生座位列号 last modified by Erin
          reformattedArray.push(_obj)
        }
        this.students = reformattedArray
        this.students_ = this.students
      }).catch(error => {
        alert('服务器异常，请联系维护人员！')
        console.error(error)
      })
    },
    // 3.修改模式：
    cancelEdit: function () {
      this.getStudents()
      this.valueBeforeEdit = {}
      this.is2ndclick = {}
      this.editedObj = []
      this.editList = []
      this.isEditing = false
    },
    cloneObject: function (src) {
      var o; //result
      if (Object.prototype.toString.call(src) === "[object Array]") {
        o = []; //判断是否是数组，并赋初始值
      } else {
        o = {};
      }
      for (var i in src) { //遍历这个对象
        if (src.hasOwnProperty(i)) { //排出继承属性
          if (typeof src[i] === "object") {
            o[i] = cloneObject(src[i]); //递归赋值
          } else {
            o[i] = src[i]; //直接赋值
          }
        }
      }
      return o
    },
    editable: function (obj) {
      var _obj = {}
      _obj = this.cloneObject(obj)
      _obj.edited = true

      this.valueBeforeEdit[_obj.stuId + ''] = _obj
    },
    handleEdit: function (e, obj) {
      // if (this.is2ndclick[obj.stuId]) {
      //   return
        // 只允许修改一次
      // }
      var that = this
      // var _target = e.target.parentNode.firstChild
      if(obj.editing){
        obj.editing = false
        obj.edit = true
        obj.edited_ = false
        obj.edited = true
      }else if(obj.edit){
        obj.editing = false
        obj.edit = false
        obj.edited_ = true
        obj.edited = false
        var add = true
        for(var i=0; i<this.editList.length;i++){
          if(this.editList[i].id == obj.stuId){
            add = false
            if(this.editList[i].name != obj.stuName){
              this.editList[i].name = obj.stuName
            }
            if(this.editList[i].sex != obj.sex){
              this.editList[i].sex= obj.sex
            }
          }else{
            continue
          }
        }
        if(add){
          this.editList.push({
            'name': obj.stuName,
            'sex': obj.sex,
            'id': obj.stuId
          })
        }
      }else if(obj.edited_){
        console.log('进入编辑模式')
        obj.editing = false
        obj.edit = true
        obj.edited_ = false
        obj.edited = true
      }
      console.log(this.editList)
      // if (obj.edited === true) {
      //   IS_DEV && console.log('yes'+obj.edited)

      //   if (!this.is2ObjContentEqual(obj, this.valueBeforeEdit[Number(obj.stuId)])) {
      //     obj.edited = false

      //     // 因为vue的奇妙特性，下面这句话会触发this.editedObj的setter：obj的每一次变化，能在此刻马上反应到this.editedObj那里，所以我们省去对this.editedObj数组进行查找替换name数据的操作：
      //     var _Arr = this.editedObj
      //     var _inArr = false
      //     for (var i = 0; i < _Arr.length; i++) {
      //       if(_Arr[i].stuId === obj.stuId) {
      //         _inArr = true
      //         break;
      //       }
      //     }
      //     if (_inArr === false) {
      //       this.editedObj.push(obj)
      //     } else {
      //     }
      //     this.is2ndclick[obj.stuId] = "true"
      //   } else {
      //     obj.edited = false
      //     if (this.valueBeforeEdit[obj.stuId]) {
      //       // --------------------------
      //     }
      //   }

      //   obj.edited = false

      // } else {
      //   this.editable(obj)
      //   obj.edited = true
      // }
    },
    is2ObjContentEqual: function (obj1, obj2) {
      for (var key in obj1) {
        if ((key !== 'edited') && (key !== 'deled')) {
          // 这个函数运行时的bug：应该是下句判断的时候edited突变为false会导致函数返回false：
          // 为了暂时规避这个bug，外层加一个判断，让key为edited时不执行下面的代码：
          if (!obj2 || !obj2[key + '']) { return false }
          if (obj1[key + ''] !== obj2[key + '']) {
            return false
          }
        }
      }
      return true
    },
    submitEdit: function () {
      // alert(JSON.stringify(this.students))
      var that = this
      if (this.students) {
        for (var i = 0; i < this.students.length; i++) {
          if (this.students[i].edit) {
            alert('仍有未确认修改的项，请先确认这些项的修改，再作提交！')
            return
          }
        }
      }
      if(this.editList.length == 0){
        this.editList = []
        this.cancelEdit()
        return 
      }
      var _arr = []
      for (var i = 0; i < this.editList.length; i++) {
        var _obj_ = {}
        _obj_ .StudentID = this.editList[i].id
        _obj_ .StudnetName = this.editList[i].name
        if(this.editList[i].sex=='男'){
          _obj_ .Sex = 1
        }else{
          _obj_ .Sex = 2
        }
        _arr.push({_obj_})

      }
      var url = '?Type=1'
      for(var j=0;j<_arr.length;j++){
        url = url +  '&StudentID='+_arr[j]._obj_.StudentID+'&StudentName='+_arr[j]._obj_.StudnetName +'&Sex='+_arr[j]._obj_.Sex
      }
      this.$ajax.get(`${this.URLroot}/EditStudent/`+url).then(res => {
        if(res.data.success == 1){
          alert('编辑成功！')
          that.editList = []
          that.cancelEdit()
        }else{
          alert('编辑失败！')
          that.editList = []
          that.cancelEdit()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 4.增加模式：
    cancelAdd: function () {
      this.showAddModal = false
    },
    submitAdd: function (stuObj) {
      this.$ajax.get(`${this.URLroot}/insertStudent/`, {
        params: {
          StudentID: stuObj.stuNum,
          grade: this.gradeData,
          class: this.classData,
          Sex: Number(stuObj.sex),
          StudentName: stuObj.name
        }
      }).then(res => {
        var _data = res.data        
        if (_data && !_data.error) {
          this.getStudents()
          this.showAddModal = false
        } else if (_data && _data.error) {
          alert(_data.error);
          this.showAddModal = false
        } else {
          alert('添加学生信息失败！')
          this.showAddModal = false
        }
      }).catch(error => {
        console.error(error)
        alert('服务器出现错误，请联系维护人员！！');
        this.showAddModal = false
      })
    },
    // 5.删除模式
    cancelDel: function () {
      this.getStudents()
      this.deledObj = []
      this.isDeling = false
    },
    handleDel: function (e, obj) {
      console.log(obj.deled)
      if (obj.deled==true) {
        obj.deled=false;
        // return
      }
      else if(obj.deled==false){
        obj.deled=true;
      }
      this.deledObj.push(obj)
    },
    submitDel: function () {
      if (this.deledObj.length === 0) {
        this.isDeling = false
        return
      }
      var _arr = this.deledObj
      var paraQueue = []
      for (var i = 0; i < _arr.length; i++) {
        if (_arr[i].stuName && _arr[i].stuId) {
          paraQueue.push('StudentID')
          paraQueue.push(_arr[i].stuId)
          paraQueue.push('StudentName')
          paraQueue.push(_arr[i].stuName)
        }
      }
      this.$ajax.get(this.URLroot + '/deleteStudent/?' + param(paraQueue)).then(res => {
        if (res.data[0].Result === '1') {
          this.getStudents()
          alert('删除成功！')
        } else {
          alert('删除失败！')
        }
      }).catch(error => {
        // alert('服务器异常，请联系维护人员！')
        this.getStudents();
        console.error(error)
      })
      this.deledObj = []
      this.isDeling = false
    },
    toStuDetail: function(obj){ //obj: 被点击的学生对象
      if (!this.isEditing && (!this.isDeling)){
        obj.Grade=this.selValues[0];
        obj.Class=this.selValues[1];
        this.$router.push({path:'/student-details/',query:obj});
      }
    }
  },
  mounted () {
    this.optsArr.push(this.optionsArr.gradeOpts)
    this.optsArr.push(this.optionsArr.classOpts)
    this.getStudents()
  },
  components: {
    addModal: addModal,
    selectGroup: selectGroup
  },
  watch: {
    selValues: function () {
      // if (this.isAdding) { this.cancelAllAdd() }
      if (this.isDeling) { this.cancelDel() }
      if (this.isEditing) { this.cancelEdit() }
    }
  }
}
</script>

<style scoped>
ul {
  padding: 0;
  margin: 0;
  list-style: none;
}
#studenttable {
  margin-top: 40px;
  margin-left: 50px;
  margin-bottom: 30px;
}
body {
  background: #bfbfbf;
}
* {
  color: #333;
  font-size: 14px;
}

#wrap-show {
  position: relative;
  top: 4px;
  box-sizing: border-box;
}
#show {
  list-style: none;
}
#show li {
  cursor: pointer;
  float:left;
  background: #fff;
  border-left: 4px solid #00aa7a;
  margin-right: 20px;
  margin-bottom: 20px;
  width: 239px;
  height: 130px;
  box-sizing: border-box;
  position: relative;

  /*垂直居中：*/
  /*http://blog.mihoweb.com/archives/790.html*/
  display:table;
  overflow:hidden;
}
#show li dl {
  vertical-align: middle;
  display: table-cell;
  width: 200px;
  height: 130px;
  line-height: 34px;
  text-align: left;
  padding: 0px 0px 0px 40px;

  /*垂直居中的第二种方法：*/
/*  position: relative;
  top: 50%;
  transform: translate(0, -50%);
  -webkit-transform: translate(0, -50%);
  -moz-transform: translate(0, -50%);
  -o-transform: translate(0, -50%);
  -ms-transform: translate(0, -50%);
  margin: 0;*/
}
/*http://www.zhangxinxu.com/wordpress/2012/03/tip-css-multiline-display/*/
dd, dt { display: inline; margin: 0; }
dd:after {
    content: '\A';
    white-space: pre;
}

#toolbar {
  width: 1020px;
  height: 32px;
  margin-top: 40px;
}
#btn-wrap {
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
dd span {
  color: #999;
}
/*下面这个名要改：*/
.checkbox {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
}
input[type="text"] {
  width: 88px;
  box-sizing:border-box;
  background:transparent;
  font-size:14px;
  color:red;
  text-align:center;
}
.stu-detail-link{
  text-decoration: none;
}
</style>
<!-- { {name:'123',sex:'男','id': 123}, {name:'456',sex:'女','id': 789}} -->
