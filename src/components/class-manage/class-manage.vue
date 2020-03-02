<template id="class-manage">
  <div id="classtable">

    <div id="toolbar">

      <select-group :selText="selTexts" :optData="optsArr"
       @returnSel="changeSel"></select-group>

      <span id="btn-wrap">
        <button v-show="hideBtn" @click="showAddModal=true">添加</button>
        <button v-show="hideBtn" @click="isDeling = true">删除</button>
        <button v-if="isDeling" style="background:#f15757;" @click="cancelDel">取消</button>
        <button v-show="isDeling === true" @click="submitDel" style="background:#f15757;width:132px;">提交“删除”操作</button>

       <!--  <button v-show="hideBtn">编辑</button> -->
        <!-- <button v-show="hideBtn" @click="isEditing = true">编辑</button> -->
        <!-- <button v-if="isEditing" style="background:#f15757;" @click="cancelEdit">取消</button>
        <button v-show="isEditing === true" @click="submitEdit" style="background:#f15757;width:132px;">提交“编辑”操作</button> -->
      </span>
    </div>

    <div id="wrap-show">
      <ul id="show">
        <li v-for="(cla,index) in classes">
          <dl>
            <dt>班级:</dt>
            <dd class="claName">
              <span v-if="cla.edited === false">{{cla["claName"]}}</span>
              <input v-if="cla.edited === true" type="text" v-model="cla['claName']">
            </dd>
            <dt>班级位置:</dt>
            <dd class="locate">
              <span v-if="cla.edited === false">{{cla["locate"]}}</span>
              <input v-if="cla.edited === true" type="text" v-model="cla['locate']">
            </dd>
            <dt>班主任:</dt>
            <dd class="claTeacher">
              <span v-if="cla.edited === false">{{cla["claTeacher"]}}</span>
              <input v-if="cla.edited === true" type="text" v-model="cla['claTeacher']">
            </dd>
            <dt>学生总数:</dt>
            <dd class="total">
              <span v-if="cla.edited === false">{{cla["total"]}}</span>
              <input v-if="cla.edited === true" type="text" v-model="cla['total']">
            </dd>
            <dt>男生人数:</dt>
            <dd class="boyTotal">
              <span v-if="cla.edited === false">{{cla["boyTotal"]}}</span>
              <input v-if="cla.edited === true" type="text" v-model="cla['boyTotal']">
            </dd>
            <dt>女生人数:</dt>
            <dd class="girlTotal">
              <span v-if="cla.edited === false">{{cla["girlTotal"]}}</span>
              <input v-if="cla.edited === true" type="text" v-model="cla['girlTotal']">
            </dd>
          </dl>

          <!-- 编辑模式 -->
          <img v-if="!valueBeforeEdit[cla.id] || !is2ndclick[cla.id]" class="checkbox" src="./img/btn-edit.png" v-show="isEditing === true" @click="handleEdit($event, cla)"/>
          <img v-if="valueBeforeEdit[cla.id] && is2ndclick[cla.id]" class="checkbox" src="./img/btn-select.png" v-show="isEditing === true" @click="handleEdit($event, cla)"/>
          <!-- 删除模式 -->
          <img @click="handleDel($event, cla,index)"
           v-show="isDeling&&!cla.deled" class="checkbox"
            src="./img/btn-unselect.png">
          <img @click="handleDel($event, cla,index)"
           v-show="isDeling&&cla.deled" class="checkbox"
            src="./img/btn-select.png">
        </li>
      </ul>
    </div>
    <add-modal v-if="showAddModal" @cancelAddM="cancelAdd" @submitAddM="submitAdd" :classes="classes"></add-modal>
    <!-- <div style="position:absolute;top:0;left:0;">{{fortest}}</div> -->
  </div>
</template>


<script>
import selectGroup from '@/components/common/select-group.vue'
import addModal from '@/components/class-manage/add-modal.vue'
import param from '@/global-utils/utils'
export default {
  name: 'class-manage',
  computed: {
    // fortest: function () {
    //   return JSON.stringify(this.editedObj)
    // },
    hideBtn: function () {
      return !(this.isDeling || this.isEditing)
    }
  },
  data () {
    return {
// 工具栏(toolbar)用到的：
      selTexts: ['初一'],
      optsArr: [],
      selValues: ['初一'],
      showAddModal: false,
// 表格(table)用到的：
      // 1.原始数据：
      classes: [],
      // classes: [
      //   {
      //     id: '0100',
      //     claName: '七年级1班',
      //     locate: 'B栋301',
      //     claTeacher: '刘备',
      //     total: '50',
      //     boyTotal: '20',
      //     girlTotal: '30',
      //     edited: false
      //   }
      // ],
      // 下面这个还没有被启用：
      columns: {
        claName: '班级',
        locate: '班级位置',
        claTeacher: '班主任',
        total: '学生总数',
        boyTotal: '男生人数',
        girlTotal: '女生人数'
      },
      // 2.修改模式：
      editedObj: [],
      isEditing: false,
      is2ndclick: {},
      valueBeforeEdit: {},
      // 下面这个还没有被启用：
      valueEditing: {},
      // 删除模式：
      deledObj: [],
      isDeling: false
    }
  },
  methods: {
    changeSel: function (index, value) {
      // 等价于：this.selValues[index] = value
      this.$set(this.selValues, index, value)
      // 我把于希在前端的过滤器逻辑全删掉了，太难维护了
      // 直接让后台过滤就行了
      this.getClasses()
    },
// 表格(table)用到的：
    // 1.公共工具函数：
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
    // 2.原始数据：
    getClasses: function () {
      this.$ajax.get(`${this.URLroot}/ClassSituation/?Type=1&grade=${this.selValues[0]}`)
      .then(res => {
        IS_DEV && console.log(res.data)
        var _classes = res.data
        var reformattedArray = []
        var _obj = {}
        var ManCount = 0
        var WomanCount = 0
        for (var i = 0; i < _classes.length; i++) {
          // 因为男女生人数如果是0的话，返回来的是
          if (_classes[i].ManCount == null){
            ManCount = 0
          }else{
            ManCount = _classes[i].ManCount
          }

          if(_classes[i].WomanCount == null){
            WomanCount = 0
          }else{
            WomanCount = _classes[i].WomanCount
          }
          _obj = {}
          _obj.id = _classes[i].ClassID
          _obj.claName = _classes[i].ClassName
          _obj.locate = _classes[i].ClassRoomPosition
          _obj.claTeacher = _classes[i].ClassTeacher
          _obj.total = _classes[i].TotalCount
          _obj.boyTotal = ManCount
          _obj.girlTotal = WomanCount
          _obj.edited = false
          _obj.deled = false
          reformattedArray.push(_obj)
        }
        this.classes = reformattedArray
      }).catch(error => {
        // alert('服务器异常，请联系维护人员！')
        console.error(error)
      })
    },
    // 3.修改模式：
    cancelEdit: function () {
      this.getClasses()
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
      var _target = e.target.parentNode.firstChild
      if (obj.edited === true) {

        if (!this.is2ObjContentEqual(obj, this.valueBeforeEdit[obj.id])) {
          // IS_DEV && console.log('数据经过修改')
          obj.edited = false

          // 因为vue的奇妙特性，下面这句话会触发this.editedObj的setter：obj的每一次变化，能在此刻马上反应到this.editedObj那里，所以我们省去对this.editedObj数组进行查找替换name数据的操作：
          var _Arr = this.editedObj
          var _inArr = false
          for (var i = 0; i < _Arr.length; i++) {
            if (_Arr[i].id === obj.id) {
              _inArr = true
              break
            }
          }
          if (_inArr === false) {
            this.editedObj.push(obj)
          } else {
          }
          this.is2ndclick[obj.id] = 'true'
        } else {
          // IS_DEV && console.log('数据经过修改后与原来的相同')
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
      if (this.classes) {
        for (var i = 0; i < this.classes.length; i++) {
          if (this.classes[i].edited) {
            alert('仍有未确认修改的项，请先确认这些项的修改，再作提交！')
            return
          }
        }
      }

      this.isEditing = false
      var _arr = this.editedObj
      this.valueBeforeEdit = {} // 清空
      for (var i = 0; i < _arr.length; i++) {
        // -----------------------
      }
      // 还差将所有input text还原！！！！！！！！！！！！！
      // 拿到this.editedObj，发给后端
    },
    //添加班级
    cancelAdd: function () {
      this.showAddModal = false
    },
    submitAdd: function () {
      // 仅供参考：
      // this.$ajax.get(this.URLroot + '/insertStudent', {
      //   params: {
      //     StudentID: stuObj.stuNum,
      //     grade: stuObj.gradeSelected,
      //     class: stuObj.classSelected,
      //     Sex: Number(stuObj.sex),
      //     StudentName: stuObj.name
      //   }
      // }).then(res => {
      //   if (res.data[0].Result === '1') {
      //     this.getClasses()
          // this.showAddModal = false
      //   } else {
      //     IS_DEV && console.log(res.data)
      //     alert('添加学生信息失败！')
      //   }
      // }).catch(error => {
      //   // alert('服务器异常，请联系维护人员！')
      //   console.error(error)
      //   alert('添加学生信息失败！')
      // })
          this.optsArr.push(this.optionsArr.gradeOpts)
          this.getClasses()
          this.showAddModal = false
    },
    // 5.删除模式
    cancelDel: function () {
      this.getClasses()
      this.deledObj = []
      this.isDeling = false
    },
    //暂时还不能多个班级删除
    handleDel: function (e, obj) {
      if (obj.deled) {
        obj.deled = false
        for (var i=0;i<this.deledObj.length;i++){
          if(this.deledObj[i].className == obj.claName){
            this.deledObj.splice(i,i+1)
          }
        }
      }else {
          this.deledObj.push ({
            className : obj.claName
          })
        obj.deled = true
      }
    },
    submitDel: function () {
      if (this.deledObj.length === 0) {
        this.isDeling = false
        return 
      }
      // var paraQueue = []
      // for (var i = 0; i < _arr.length; i++) {
      //   if (_arr[i].stuName && _arr[i].stuId) {
      //     paraQueue.push('StudentID')
      //     paraQueue.push(_arr[i].stuId)
      //     paraQueue.push('StudentName')
      //     paraQueue.push(_arr[i].stuName)
      //   }
      // }
      var url = ''
      for(var i=0;i<this.deledObj.length;i++){
        if(i!=this.deledObj.length-1){
          url = url + 'className='+this.deledObj[i].className+'&'
        }else{
          url = url + 'className='+this.deledObj[i].className
        }
      }
      this.$ajax.get(this.URLroot + '/deleteClass/?' +url).then(res => {
        this.cancelDel()
        this.getClasses()
      }).catch(error => {
        alert(error)
      })
      this.deledObj = []
      this.isDeling = false
    }
  },
  mounted () {
    this.optsArr.push(this.optionsArr.gradeOpts)
    this.getClasses()
  },
  components: {
    selectGroup: selectGroup,
    addModal: addModal
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
#classtable {
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
  margin-right: 30px;
  margin-bottom: 30px;
  width: 210px;
  height: 250px;
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
  width: 930px;
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
</style>
