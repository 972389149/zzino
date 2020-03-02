<template>
  <div id="teachertable">
    <!--   <div>for debug:</div>
    <div>cur:{{cur}}</div>
    <div>offset:{{offset}}</div>
    <div>pageTotal:{{pageTotal}}</div>
    <div>tmpLimitLen:{{tmpLimitLen}}<br>limitLen:{{limitLen}}</div> -->

    <div id="toolbar">

      <select-group :selText="selTexts" :optData="optsArr"
       @returnSel="changeSel"></select-group>

      <span id="btn-wrap">
        <!-- <button v-show="hideBtn" @click="addTeacher">添加</button> -->
        <button v-show="hideBtn" @click="isDeling = true">删除</button>
        <button v-if="isDeling" style="background:#f15757;" @click="cancelDel">取消</button>
        <button v-show="isDeling === true" @click="submitDel" style="background:#f15757;width:132px;">提交“删除”操作</button>

        <!-- <button v-show="hideBtn" @click="isEditing = true">编辑</button>
        <button v-if="isEditing" style="background:#f15757;" @click="cancelEdit">取消</button>
        <button v-show="isEditing === true" @click="submitEdit" style="background:#f15757;width:132px;">提交“编辑”操作</button> -->
      </span>
    </div>  

    <div id="wrap-show">
      <ul id="show">
        <li v-for="tea in teachers">

          <img class="avatar" src="./img/avatar.png">

          <dl>
            <dt>姓名:</dt>
            <dd class="teaName">
              <span v-if="tea.edited === false">{{tea["teaName"]}}</span>
              <input v-if="tea.edited === true" type="text" v-model="tea['teaName']">
            </dd>
            <dt>授课班级:</dt>
            <dd class="TClass">
              <span v-if="tea.edited === false">{{tea["TClass"]}}</span>
              <input v-if="tea.edited === true" type="text" v-model="tea['TClass']">
            </dd>
            <dt>授课科目:</dt>
            <dd class="TSubject">
              <span v-if="tea.edited === false">{{tea["TSubject"]}}</span>
              <input v-if="tea.edited === true" type="text" v-model="tea['TSubject']">
            </dd>
            <dt>联系方式:</dt>
            <dd class="tel">
              <span v-if="tea.edited === false">{{tea["tel"]}}</span>
              <input v-if="tea.edited === true" type="text" v-model="tea['tel']">
            </dd>
          </dl>
          
          <!-- 编辑模式 -->
          <img v-if="!valueBeforeEdit[tea.id] || !is2ndclick[tea.id]" class="checkbox" src="./img/btn-edit.png" v-show="isEditing === true" @click="handleEdit($event, tea)"/>
          <img v-if="valueBeforeEdit[tea.id] && is2ndclick[tea.id]" class="checkbox" src="./img/btn-select.png" v-show="isEditing === true" @click="handleEdit($event, tea)"/>
          <!-- 删除模式 -->
          <img @click="handleDel($event, tea)"
           v-show="isDeling&&!tea.deled" class="checkbox"
            src="./img/btn-unselect.png">
          <img @click="handleDel($event, tea)"
           v-show="isDeling&&tea.deled" class="checkbox"
            src="./img/btn-select.png">
        </li>
      </ul>
    </div>

    <!-- <div style="position:absolute;top:0;left:0;">{{fortest}}</div>
    <div style="position:absolute;top:20px;left:0;">{{fortest2}}</div> -->
  </div>
</template>

<script>
import selectGroup from '@/components/common/select-group.vue'
import param from '@/global-utils/utils'
export default {
  name: 'teacher-manage',
  computed: {
    hideBtn: function () {
      return !(this.isDeling || this.isEditing)
    },
    // fortest: function () {
    //   return JSON.stringify(this.is2ndclick)
    // },
    // fortest2: function () {
    //   return JSON.stringify(this.editedObj)
    // }
  },
  data () {
    return {
// 工具栏(toolbar)用到的：
      selTexts: ['初一', '(1)班', '语文'],
      optsArr: [],
      selValues: ['初一', '(1)班', "语文"],

// 表格(table)用到的：
      teachers: [
      ],
      editedObj: [],
      is2ndclick: {},
      isEditing: false,
      valueBeforeEdit: {},
      // 删除模式：
      deledObj: [],
      isDeling: false
    }
  },
  methods: {
    changeSel: function (index, value) {
      // 等价于：this.selValues[index] = value
      this.$set(this.selValues, index, value)
      this.getTeachers()
    },
    copyArr (arr) {
      return arr.map((e) => {
        if (typeof e === 'object') {
          return Object.assign({}, e)
        } else {
          return e
        }
      })
    },
    getTeachers: function () {
      var _teacherArr = []
      this.$ajax.get(`${this.URLroot}/TeacherManager/?Type=1?CellPhone=10086&grade=${this.selValues[0]}&class=${this.selValues[1]}&CourseName=${this.selValues[2]}`
      // , {
      //   params: {
      //     // Type: 1,
      //     // CellPhone: 10086,
      //     // grade: this.selValues[0],
      //     // class: this.selValues[1],
      //     // CourseName: this.selValues[2]
      //   }
      // }
      ).then(res => {
        for (var i = 0; i < res.data.length; i++) {
          var _teacher = {}
          _teacher.teaName = res.data[i].TeacherName
          _teacher.TClass = res.data[i].ClassName
          _teacher.TSubject = res.data[i].CourseName
          _teacher.id = res.data[i].TeacherID
          _teacher.tel = res.data[i].CellPhone
          // 返回参数的ClassID和TeacherID属性暂时没有用到
          _teacher.edited = false
          _teacher.deled = false
          _teacherArr.push(_teacher)
        }
        this.teachers = _teacherArr
      }).catch(error => {
        // alert('服务器异常，请联系维护人员！')
        console.error(error)
      })
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
    cancelEdit: function () {
      this.getTeachers()
      this.valueBeforeEdit = {}
      this.is2ndclick = {}
      this.editedObj = []
      this.isEditing = false
    },
    editable: function (obj) {

      // 用vue就不应该干这种事情：
      // var claNameDOM = this.getByClass(_target, 'claName')
      // var targetObj = {}
      // var _target = e.target.parentNode.firstChild
      // targetObj['claName'] = claNameDOM.innerText
      
      // 这都能绑定，牛逼了！！！！！！！！！也可能是js原来的性质
      // var _obj = {}
      //  _obj = obj
      // _obj.edited = true

      var _obj = {}
      _obj = this.cloneObject(obj)
      _obj.edited = true

      this.valueBeforeEdit[_obj.id + ''] = _obj
      // IS_DEV && console.log('cun name' + this.valueBeforeEdit[_obj.id + '']['claName'])

      // claNameDOM.innerHTML = "<input type='text' value='" + this.valueBeforeEdit[obj.id].claName + "' style='  width: 86px;height: 18px;box-sizing:border-box;background:transparent;font-size:14px;color:red;text-align:center;'>"
    },
    handleEdit: function (e, obj) {
      if (this.is2ndclick[obj.id]) {
        return
        // 只允许修改一次
      }
      // _target 暂时还没有被用到：
      // var _target = e.target.parentNode.firstChild
      if (obj.edited === true) {

        if (!this.is2ObjContentEqual(obj, this.valueBeforeEdit[obj.id])) {
          IS_DEV && console.log('no equal')
          obj.edited = false

          // 因为vue的奇妙特性，下面这句话会触发this.editedObj的setter：obj的每一次变化，能在此刻马上反应到this.editedObj那里，所以我们省去对this.editedObj数组进行查找替换name数据的操作：
          var _Arr = this.editedObj
          var _inArr = false
          for (var i = 0; i < _Arr.length; i++) {
            if(_Arr[i].id === obj.id) {
              _inArr = true
              break;
            }
          }
          if (_inArr === false) {
            this.editedObj.push(obj)
          } else {
          }
          this.is2ndclick[obj.id] = "true"
        } else {
          IS_DEV && console.log('equal')
          obj.edited = false
          if (this.valueBeforeEdit[obj.id]) {
            // --------------------------
          }
        }

        obj.edited = false

      } else {
        this.editable(obj)
        obj.edited = true
      }
    },
    submitEdit: function () {
      // if (this.teachers) {
      //   for (var i = 0; i < this.teachers.length; i++) {
      //     if (this.teachers[i].edited) {
      //       alert('仍有未确认修改的项，请先确认这些项的修改，再作提交！')
      //       return
      //     }
      //   }
      // }

      this.isEditing = false
      var _arr = this.editedObj
      this.valueBeforeEdit = {} // 清空
      console.log(JSON.stringify(this.editedObj))
      for (var i = 0; i < _arr.length; i++) {
        // -----------------------
      }
      // 还差将所有input text还原！！！！！！！！！！！！！
      // 拿到this.editedObj，发给后端
    },
    addTeacher: function () {
      // 暂时先这样：
      alert('请到注册页面填写详细信息！')
    },
    // 5.删除模式
    cancelDel: function () {
      this.getTeachers()
      this.deledObj = []
      this.isDeling = false
    },
    handleDel: function (e, obj) {
      if (obj.deled) {
        return
      }
      obj.deled = true
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
        if (_arr[i].teaName && _arr[i].id) {
          paraQueue.push('UserID')
          paraQueue.push(_arr[i].id)
        }
      }
      this.$ajax.get(this.URLroot + '/TeacherManager/deleteUser/?' + param(paraQueue)).then(res => {
        if (res.data[0].Result === '1') {
          this.getTeachers()
          alert('删除成功！')
        } else {
          alert('删除失败！')
        }
      }).catch(error => {
        // alert('服务器异常，请联系维护人员！')
        console.error(error)
      })
      this.deledObj = []
      this.isDeling = false
    }
  },
  mounted () {
    this._subjectOpts = this.copyArr(this.optionsArr.subjectOpts)
    this._subjectOpts.unshift({
      text: '"科目"',
      value: null
    })
    this.optsArr.push(this.optionsArr.gradeOpts)
    this.optsArr.push(this.optionsArr.classOpts)
    this.optsArr.push(this._subjectOpts)
    this.getTeachers()
  },
  components: {
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  padding: 0;
  margin: 0;
  list-style: none;
}
#teachertable {
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
  float:left;
  background: #fff;
  border-left: 4px solid #00aa7a;
  margin-right: 20px;
  margin-bottom: 20px;
  width: 460px;
  height: 190px;
  box-sizing: border-box;
  position: relative;
}
#show li dl {
  line-height: 34px;
  text-align: left;
  padding: 0px 0px 0px 140px;

  /*for firefox：*/
  margin-top: 14px;

  /*float: left;*/
}
/*http://www.zhangxinxu.com/wordpress/2012/03/tip-css-multiline-display/*/
dd, dt { display: inline; margin: 0; }
dd:after {
    content: '\A';
    white-space: pre;
}

#toolbar {
  width: 940px;
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
.avatar {
  float: left;
  position: relative;
  top: 20px;
  left: 20px;
}
input[type="text"] {
  width: 158px;
  box-sizing:border-box;
  background:transparent;
  font-size:14px;
  color:red;
  /*text-align:center;*/
}
</style>
