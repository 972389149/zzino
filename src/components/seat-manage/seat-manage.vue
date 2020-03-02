<template id="seat-manage">
  <div id="seattable" style="margin-left:50px;">
    <!--   <div>for debug:</div>
    <div>cur:{{cur}}</div>
    <div>offset:{{offset}}</div>
    <div>pageTotal:{{pageTotal}}</div>
    <div>tmpLimitLen:{{tmpLimitLen}}<br>limitLen:{{limitLen}}</div> -->
    <div id="toolbar">

      <select-group :selText="selTexts" :optData="optsArr"
       @returnSel="changeSel"></select-group>

      <div id="btn-wrap">
        <button v-show="hideBtn" @click="isAdding=true">添加</button>
        <button v-if="isAdding" style="background:#f15757;" @click="cancelAllAdd">取消</button>
        <button v-if="isAdding" style="background:#f15757;width:132px;" @click="submitAdd">提交“添加”操作</button>

        <button v-show="hideBtn" @click="isDeling = true">删除</button>
        <button v-if="isDeling" style="background:#f15757;" @click="cancelDel">取消</button>
        <button v-show="isDeling === true" @click="submitDel" style="background:#f15757;width:132px;">提交“删除”操作</button>
        <button v-show="hideBtn" @click='adjust'>调整</button>
        <button v-if='isAdjusting' style="background:#f15757;" @click='cancelAdjust'>取消</button>
        <button v-if='isAdjusting' style="background:#f15757;width:132px;" @click='submitAdjust'>提交“调整”操作</button>
      </div>
    </div>

    <div class="wrap-table">
    <table id="table">
      <thead id="thead">
         <tr><td>&nbsp;</td><th v-for="head in 8" draggable="false" @dragover="allowDrop($event)"  @dragstart="dragRow($event,head)" @drop="dropRow($event,head)" class="row_ drag_able" style='user-select:none;'><div class="row_2">{{head}}</div></th></tr>
      </thead>
      <tbody id="tbody">
        <tr v-for="(row, index) in seat">
          <th draggable="false" class="col_  drag_able" @dragover="allowDrop($event)" @drop="dropCol($event,index)" @dragstart="drapCol($event,index)" style='user-select:none;'><div class="col_2">{{index+1}}</div></th>
          <td v-for="(col,colIndex) in row" @drop="drop($event,colIndex,index)" @dragover="allowDrop($event)" draggable="false" @dragstart="drag($event,colIndex,index)" class="_dragDrop drag_able" >
            <div v-if="col.sex !== '-1'" class="wrap-stu">
              <img v-if="col.sex === '男'"
               src="./img/b-st.png" draggable="false" style='user-select:none;'></img>
              <img v-if="col.sex === '女'"
               src="./img/g-st.png" draggable="false" style='user-select:none;'></img>
              <br draggable="false"><span style='user-select:none;'>{{col.stuName}}</span><br/>
              <span class="light-color" draggable="false" style='user-select:none;'>{{col.stuId}}</span>
              <!-- 如果是临时的一条信息： -->
              <img v-if="col.addedTemp" class="checkbox"
               src="./img/btn-select.png"/>
               <!-- 删除模式 -->
              <img @click="handleDel($event, col)"
               v-show="isDeling&&!col.deled" class="checkbox"
                src="./img/btn-unselect.png">
              <img @click="handleDel($event, col)"
               v-show="isDeling&&col.deled" class="checkbox"
                src="./img/btn-select.png">
            </div>
            <div v-if="col.sex === '-1'" class="wrap-stu">
              <img v-if="isAdding"
               src="./img/add-seat.png"
                @click="addSeat(index, colIndex)"
                 style="cursor:pointer;" />
            </div>
            <!-- <edit-area v-if="showEditArea" :data="col">
              <button slot="ok" alt="ok" @click="editSubmit">OK</button>
            </edit-area> -->
          </td>
        </tr>
      </tbody>
    </table>
    </div>
    <!--新增条目的Modal-->
    <add-modal v-if="showAddModal" @cancelAddM="cancelAdd" :data="objAdded" @handleAddM="handleAdd"></add-modal>
  </div>
</template>

<script>
// sex 2代表女 1代表男 -1代表不存在
// 待完成的改进：https://cn.vuejs.org/v2/guide/list.html#%E6%95%B0%E7%BB%84%E6%9B%B4%E6%96%B0%E6%A3%80%E6%B5%8B
import addModal from './add-modal.vue'
import selectGroup from '@/components/common/select-group.vue'
import LSUtils from '@/global-utils/local-storage-utils.js'
import param from '@/global-utils/utils'
export default {
  name: 'seat-manage',
  computed: {
    hideBtn: function () {
      return !(this.isAdding || this.isDeling || this.isAdjusting)
    },
    seat: function () {
      var result = []
      for (var j = 0; j < 11; j++) {
        result[j] = []
        for (var k = 0; k < 8; k++) {
          result[j][k] = {sex: '-1'}
        }
      }
      for (var i = 0; i < this.students.length; i++) {
        // 先暂时为0到99：
        var reg = /^([1-9]\d|\d)$/
        if (reg.test(this.students[i].colNum) && reg.test(this.students[i].rowNum)) {
          var r = this.students[i].rowNum
          var c = this.students[i].colNum
          // 数字和数字字符串做Index有区别吗？
          result[r][c] = this.students[i]
        }
      }

      return result
    }
  },
  data () {
    return {
// 工具栏(toolbar)用到的：
      selTexts: ['初一', '(1)班'],
      optsArr: [],
      selValues: ['初一', '(1)班'],

// 表格(table)用到的：
      // 原始数据：
      students: [
      // 数据模板：
      // {
      //   stuId: '123456',
      //   stuName: '李22',
      //   rowNum: '1',
      //   colNum: '1',
      //   sex: '男'
      // }
      ],
      // 添加模式：
      isAdding: false,
      objAdded: {
        colNum: '-1',
        rowNum: '-1'
      },
      saveBeforeAdd: [],
      showAddModal: false,

      // 删除模式：
      deledObj: [],
      isDeling: false,

      // 调整模式：
      isAdjusting: false,
      // 拖曳内容
      dragAll: '',
        // 单个拖拽
      srcdiv: [],
        // 行列拖拽
      srcdivRow: [],
      srcdivCol: [],
      dragRowRecord: null,
      dragColRecord: null,
        // 用于drop类型的函数判断drag类型
      dragType: null,
        // 用于存放提交调整过的数据
      dragChange: [],
        // 用于判断是否调整过座位来改变样式
      dragStyle: true,
        // 用于处理座位调整的bug
      dragBug: false,
      dragbox: []

    }
  },
  methods: {
    changeSel: function (index, value) {
      // 等价于：this.selValues[index] = value
      this.$set(this.selValues, index, value)
      this.getStudents()
    },
// 表格(table)用到的：
    // 原始数据：
    getStudents: function () {
      this.$ajax.get(`${this.URLroot}/StudentPosition/?Type=1&grade=${this.selValues[0]}&class=${this.selValues[1]}`
      // , {
      //   params: {
      //     Type: 1,
      //     grade: this.selValues[0],
      //     class: this.selValues[1],
      //     Cookie: LSUtils.getItemWithMaxAge('user')
      //   }
      // }
      ).then(res => {
        IS_DEV && console.log(res.data)
        console.log(JSON.stringify(res.data))
        var _courses = res.data
        var reformattedArray = []
        var _obj = {}
        for (var key in _courses) {
          if (key === 'error') {
            break; //跳出循环，this.students直接赋值为空
          }
          _obj = {}
          _obj.stuId = key + ''
          _obj.stuName = _courses[key].StudentName
          if (_courses[key].Sex == 1) {
            _obj.sex = '男'
          } else if (_courses[key].Sex == 2) {
            _obj.sex = '女'
          } else {
            _obj.sex = 'error'
          }

          _obj.rowNum = _courses[key].RowCount + ''
          _obj.colNum = _courses[key].ColumnCount + ''
          _obj.edited = false
          _obj.deled = false
          _obj.addedTemp = false
          reformattedArray.push(_obj)
        }

        this.students = reformattedArray
      }).catch(error => {
        // alert('服务器异常，请联系维护人员！')
        console.error(error)
      })
    },
    // 增加模式：
    addSeat: function (rowNum, colNum) {
      this.objAdded.colNum = colNum
      this.objAdded.rowNum = rowNum
      this.showAddModal = true
    },
    cancelAdd: function () {
      this.objAdded.colNum = '-1'
      this.objAdded.rowNum = '-1'
      this.showAddModal = false
    },
    cancelAllAdd: function () {
      this.objAdded.colNum = '-1'
      this.objAdded.rowNum = '-1'

      this.getStudents()
      this.saveBeforeAdd = []
      this.isAdding = false
    },
    handleAdd: function (stuObj) {
      // 还没有分班级，先伪装是初一一班：
      stuObj.addedTemp = true
      stuObj.clasz = '初一一班'
      this.saveBeforeAdd.push(stuObj)
      // if (stuObj.sex === '1') {
      //   stuObj.sex = '男'
      // } else if (stuObj.sex === '2') {
      //   stuObj.sex = '女'
      // } else {
      //   stuObj.sex = 'error'
      // }
      stuObj.stuName = '待提交'
      this.students.push(stuObj)

      this.objAdded.colNum = '-1'
      this.objAdded.rowNum = '-1'
      this.showAddModal = false
    },
    submitAdd: function () {
      if (this.saveBeforeAdd.length === 0) {
        this.isAdding = false
        return
      }
      var _arr = this.saveBeforeAdd
      var paraQueue = []
      for (var i = 0; i < _arr.length; i++) {
        if (_arr[i].stuId) {
          var _grade = JSON.stringify(_arr[i].clasz).substring(1,3)
          var _class = JSON.stringify(_arr[i].clasz).substring(3,5)
          paraQueue.push('RowCount')
          paraQueue.push(Number(_arr[i].rowNum))
          paraQueue.push('ColumnCount')
          paraQueue.push(Number(_arr[i].colNum))
          paraQueue.push('StudentID')
          paraQueue.push(_arr[i].stuId)
          paraQueue.push('grade')
          paraQueue.push(this.selValues[0])
          paraQueue.push('class')
          paraQueue.push(this.selValues[1])
        }
      }
      this.$ajax.get(this.URLroot + '/insertPosition/?' + param(paraQueue)).then(res => {
        // 这个条件要修改：
        // if (res.data[0].Sex || _arr.length === res.data.length) {
        //   this.getStudents()
        //   alert('添加成功！')
        // } else {
        //   alert('添加失败！')
        // }
        this.getStudents()
      }).catch(error => {
        // alert('服务器异常，请联系维护人员！')
        console.error(error)
      })
      this.saveBeforeAdd = []
      this.isAdding = false
    },
    // 删除模式：
    cancelDel: function () {
      this.getStudents()
      this.deledObj = []
      this.isDeling = false

    },
    handleDel: function (e, obj) {
      // 重写了一遍，搞定了之前的bug，现在实现了1.选择取消的样式改变；2.重复选择但不发送相同的内容
      if(!obj.deled) {
        obj.deled = !obj.deled
        if(this.deledObj.length==0){
          this.deledObj.push(obj)
        }else if(obj.deled){
          //遍历一遍，查询是否之前已添加过相同的信息
          for (var i=0; i<this.deledObj.length; i++){
            if (this.deledObj[i].stuId === obj.stuId){
              return
            }
          }
          this.deledObj.push(obj)
        }else{
          return
        }
        // 点击取消的时候，遍历一遍deledObj，找出之前该学生的信息，并且从deledObj中删除
      }else{
        obj.deled = !obj.deled
        for (var i=0; i<this.deledObj.length; i++){
          if (this.deledObj[i].stuId === obj.stuId){
            this.deledObj.splice(i,1)
          }
        }
      } 
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
      this.$ajax.get(this.URLroot + '/deletePosition/?' + param(paraQueue)).then(res => {
        this.getStudents()
      }).catch(error => {
        // alert('服务器异常，请联系维护人员！')
        console.error(error)
        this.getStudents()
      })
      this.deledObj = []
      this.isDeling = false
      this.getStudents()
    },

    // 调整模式
    cancelAdjust: function(){
      this.isAdjusting = false
      // 关闭调整状态
      this.closeDrap()
      // 从dragAll中取回之前未更改过的数据，这里还可以拓展一个“撤销上一步操作”功能
      this.students = JSON.parse(this.dragAll)
    },
    submitAdjust: function(){
      this.isAdjusting = false
      //  关闭调整状态
      this.closeDrap()
      var that = this
      // 用现在students与未更改之前的students作比较，得出已改变的位置信息
      var submitChange_= JSON.parse(this.dragAll)
      for (var i=0 ; i<this.students.length ; i++){
        if(this.students[i].colNum == submitChange_[i].colNum && this.students[i].rowNum == submitChange_[i].rowNum){
          continue
        }else{
          this.dragChange.push({'stuId': this.students[i].stuId,'colNum': this.students[i].colNum,'rowNum': this.students[i].rowNum})
        }
      }
      IS_DEV && console.log(JSON.stringify(this.dragChange))
      var url = ''
      for (var i=0; i<this.dragChange.length; i++){
        if(i != this.dragChange.length-1){
          url = url + 'RowCount='+Number(this.dragChange[i].rowNum)+'&ColumnCount='+Number(this.dragChange[i].colNum)+'&StudentID='+this.dragChange[i].stuId+'&grade='+this.selValues[0]+'&class='+this.selValues[1]+'&'
        }else{
          url = url + 'RowCount='+Number(this.dragChange[i].rowNum)+'&ColumnCount='+Number(this.dragChange[i].colNum)+'&StudentID='+this.dragChange[i].stuId+'&grade='+this.selValues[0]+'&class='+this.selValues[1]
        }
      }
        this.$ajax.get(this.URLroot + '/insertPosition/?' + url).then(res => {
          this.getStudents()
        }).catch(error => {
          this.getStudents()
          console.log('ERROR : 500\n'+'对象 : '+paraQueue+'\n原因 : 调整失败')
        })
    },
    adjust: function(){
      this.isAdjusting = true
      // 将上一次储存的调整信息清空
      this.dragChange = []
      this.isDeling = false
      this.isAdding = false
      //  开启可调整状态
      this.allowDrap()
      // 把所有学生位置信息保存，用于点击取消按钮位置信息的恢复
      this.dragAll = JSON.stringify(this.students)
    },
    //  调整状态开启函数
    allowDrap: function(){
      //  鼠标样式变小手
      var mouse_ = document.getElementById('table')
      mouse_.setAttribute('style','cursor: move')
      // 把所有学生状态设置可拖曳状态
      var _dragDrop = document.getElementsByClassName(' drag_able')
      for (var i=0 ; i<_dragDrop.length ; i++){
        _dragDrop[i].setAttribute('draggable','true')
      }
      this.openStyle()
    },
    //  调整状态关闭函数
    closeDrap: function(){
      //  鼠标样式回调
      var mouse_ = document.getElementById('table')
      mouse_.setAttribute('style','cursor: default')
      // 把所有学生状态设置为不可拖曳状态
      var _dragDrop = document.getElementsByClassName(' drag_able')
      for (var i=0 ; i<_dragDrop.length ; i++){
        _dragDrop[i].setAttribute('draggable','false')
      }
      this.closeStyle()
    },
    openStyle: function(){
      var _stuStyle = document.getElementsByClassName('wrap-stu')
      var _rowStyle = document.getElementsByClassName('row_2')
      var _colStyle = document.getElementsByClassName('col_2')
      for(var k=0 ; k<_stuStyle.length ; k++){
        _stuStyle[k].setAttribute('style','height:65px;width:112px')
        _stuStyle[k].setAttribute('class','wrap-stu wrap-stu-change')
      }
      for(var k=0 ; k<_rowStyle.length ; k++){
        _rowStyle[k].setAttribute('class','row_2 row_1')
      }
      for(var k=0 ; k<_colStyle.length ; k++){
        _colStyle[k].setAttribute('class','col_2 col_1')
      }

    },
    closeStyle: function(){
      var _stuStyle = document.getElementsByClassName('wrap-stu')
      var _rowStyle = document.getElementsByClassName('row_2')
      var _colStyle = document.getElementsByClassName('col_2')
      for(var k=0 ; k<_stuStyle.length ; k++){
        _stuStyle[k].setAttribute('style',' ')
        _stuStyle[k].setAttribute('class','wrap-stu')
      }
      for(var k=0 ; k<_rowStyle.length ; k++){
        _rowStyle[k].setAttribute('class','row_2')
      }
      for(var k=0 ; k<_colStyle.length ; k++){
        _colStyle[k].setAttribute('class','col_2')
      }
    },
    //拖曳相关函数
    allowDrop: function(ev){
      // 阻止冒泡
      ev.preventDefault()
    },
    //  单个抓取函数
    drag: function(ev,colindex,rowindex){
      if(this.isAdjusting){
        // ！！！火狐和Safari的抓取函数一定一定一定要设置数据！！！
        // 因为这两个浏览器认为没有数据传递的拖动的是没有意义，所以就拖不动！！！
        ev.dataTransfer.setData("f**k","null")
        //  用于储存抓取到的东西的位置信息
        this.srcdiv = []
        // 定义抓取类型为“单”
        this.dragType = 'single'
        // 把座位的位置信息放入srcdiv中
        for (var i=0 ; i<this.students.length ; i++){
          if(this.students[i].colNum == colindex && this.students[i].rowNum == rowindex){
            this.srcdiv.push(colindex,rowindex,i)
            return
          }
        }
      }else{
        return
      }
    },
    //单个放置函数
    drop: function(ev,colindex,rowindex,type){
      ev.preventDefault();
      if(this.isAdjusting){
        // 检测放下的数据是否为“单”类型、是否为“空”。True：进行两坐标交换操作。
        if(this.dragType == 'single' && this.srcdiv[0] != undefined && this.srcdiv[1] != undefined){
          for (var i=0 ; i<this.students.length ; i++){
            if(this.students[i].colNum == colindex && this.students[i].rowNum == rowindex){
              //IS_DEV && console.log("之前"+this.srcdiv[0]+":"+this.srcdiv[1]+"现在"+this.students[i].colNum+":"+this.students[i].rowNum)
              this.students[this.srcdiv[2]].colNum = this.students[i].colNum
              this.students[this.srcdiv[2]].rowNum = this.students[i].rowNum
              this.students[i].colNum = this.srcdiv[0]
              this.students[i].rowNum = this.srcdiv[1]
            }
          }
          this.students[this.srcdiv[2]].colNum = colindex
          this.students[this.srcdiv[2]].rowNum = rowindex
        }
        // 检测到放下的数据从空白的地方抓取
        else if(this.srcdiv[0] == undefined || this.srcdiv[1] == undefined){
          alert("空座位之间调整是没有意义的哟~")
        }
        // 检测到放下的数据不是从“单”类型抓取
        else{
          alert('该位置仅限两个“学生”之间调整！')
        }
      }else{
        return 
      }
    },
    // 成列抓取函数
    dragRow: function(ev,index){
      if(this.isAdjusting){
        ev.dataTransfer.setData("f**k","null")
        // 定义抓取类型为“行”(从第一行中抓取一整列数据)
        this.dragType = 'row'
        // 用于储存该列下的所有学生的“行”坐标
        this.srcdivRow = []
        // 用于记录抓取的是第几列
        this.dragRowRecord = index-1
        // 把该列下所有的学生的“行”坐标push进srcdivRow中
        for(var i=0 ; i<this.students.length ; i++){
          if(this.students[i].colNum == this.dragRowRecord){
            this.srcdivRow.push(this.students[i].rowNum)
          }
        }
      }else{
        return 
      }
    },
    // 成列放置函数
    dropRow: function(ev,index){
      ev.preventDefault()
      if(this.isAdjusting){
        // 用于储存‘放下的列’的所有学生的“行”坐标
        this.srcdivCol = []
        // 用于储存‘放下的列’的"列"坐标
        this.dragColRecord = index-1
        // 检测是否的“行”类型
        if(this.dragType == 'row'){
          // 将‘放下的列’的所有学生的“行”坐标push进srcdivCol中
          for(var i=0; i<this.students.length; i++){
            if(index-1 == this.students[i].colNum){
              this.srcdivCol.push(this.students[i].rowNum)
            }
          }
          //IS_DEV && console.log("原来："+this.dragRowRecord+':'+this.srcdivRow+"现在"+this.dragColRecord+':'+this.srcdivCol)
          // 通过 循环遍历+判断+循环遍历 的方式，实现两“列”元素坐标的重定位
          for(var i=0; i<this.students.length; i++){
            if(this.students[i].colNum == this.dragRowRecord){
              for(var j=0;j<this.srcdivRow.length; j++){
                if(this.students[i].rowNum == this.srcdivRow[j]){
                  this.students[i].colNum = this.dragColRecord
                }
              }
            }else if(this.students[i].colNum == this.dragColRecord){
              for(var j=0;j<this.srcdivCol.length; j++){
                if(this.students[i].rowNum == this.srcdivCol[j]){
                  this.students[i].colNum = this.dragRowRecord
                }
              }
            }
          }
        }
        // 检测到抓取类型不为“行”
        else{
          alert('该位置仅接受两个“列”之间调整！')
        }
      }else{
        return 
      }
    },
    // 成列抓取函数
    drapCol: function(ev,index){
      if(this.isAdjusting){
        ev.dataTransfer.setData("f**k","null")
        // 定义抓取类型为“列”(从第一列中抓取一整行数据)
        this.dragType = 'col'
        // 用于储存该行下的所有学生的“列”坐标
        this.srcdivCol = []
        // 用于记录抓取的是第几行
        this.dragColRecord = index
        // 把该行下所有的学生的“列”坐标push进srcdivRow中
        for(var i=0 ; i<this.students.length ; i++){
          if(this.students[i].rowNum == this.dragColRecord){
            this.srcdivCol.push(this.students[i].colNum)
          }
        }
      }else{
        return 
      }
    },
    // 成行放置函数
    dropCol: function(ev,index){
      ev.preventDefault()
      if(this.isAdjusting){
        // 用于储存‘放下的行’的所有学生的“列”坐标
        this.srcdivRow = []
        // 用于储存‘放下的行’的"行"坐标
        this.dragRowRecord = index
        // 检测是否的“列”类型
        if(this.dragType == 'col'){
           // 将‘放下的行’的所有学生的“列”坐标push进srcdivRow中
          for(var i=0; i<this.students.length; i++){
            if(this.dragRowRecord == this.students[i].rowNum){
              this.srcdivRow.push(this.students[i].colNum)
            }
          }

          //IS_DEV && console.log("原来："+this.dragColRecord+':'+this.srcdivCol+"现在"+this.dragRowRecord+':'+this.srcdivRow)
          // 通过 循环遍历+判断+循环遍历 的方式，实现两“行”元素坐标的重定位
          for(var i=0; i<this.students.length; i++){
            if(this.students[i].rowNum == this.dragColRecord){
              for(var j=0;j<this.srcdivCol.length; j++){
                if(this.students[i].colNum == this.srcdivCol[j]){
                  this.students[i].rowNum = this.dragRowRecord
                }
              }
            }else if(this.students[i].rowNum == this.dragRowRecord){
              for(var j=0;j<this.srcdivRow.length; j++){
                if(this.students[i].colNum == this.srcdivRow[j]){
                  this.students[i].rowNum = this.dragColRecord
                }
              }
            }
          }
        }
        // 检测到抓取类型不为“列”
        else{
          alert('该位置仅接受两个“行”之间调整！')
        }
      }else{
        return 
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
table
{
  border-collapse:collapse;
  border: 2px solid #dcdcdc;
  text-align: center;
}
table td {
  box-sizing: border-box;
  border: 1px dashed #dcdcdc;
}
table th, #thead td {
  background-color: #dcdcdc;
}
thead th {
  box-sizing: border-box;
  height: 36px;
  width: 140px;
}
#tbody th {
  width: 36px;
  height: 70px;
  box-sizing: border-box;
}
img {
  width: 16px;
  height: 16px;
}
#toolbar {
  width: 1018px;
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
.light-color {
  color: #999;
}
.wrap-stu {
  position: relative;
}
.wrap-stu-change {
  position: relative;
  margin: 3px 0 0 5px;
  width: 90%;
  height: 80%;
  border: 1px solid #00AB7A;
  box-shadow:4px 4px 10px #00AB7A;
  background-color: #F5F5F5;
}
.wrap-stu-change:hover {
  background-color: #DCDCDC;
}
.col_{
  text-align: center;
  /*border: 1px solid #00AB7A;*/
}
.col_1 {
  text-align: center;
  line-height: 3.8;
  border: 1px solid #00AB7A;
  width: 80%;
  height: 90%;
  box-shadow:2px 2px 5px #00AB7A;
  background-color: #F5F5F5;
}
.col_1:hover {
  background-color: #DCDCDC;
}
.row_{
  text-align: center;
}
.row_1 {
  text-align: center;
  border: 1px solid #00AB7A;
  margin-left: 5%;
  width: 90%;
  height: 80%;
  box-shadow:2px 2px 5px #00AB7A;
  background-color: #F5F5F5;
}
.row_1:hover {
  background-color: #DCDCDC;
}
/*下面这个名要改：*/
.checkbox {
  position: absolute;
  top: 0px;
  right: 4px;
  width: 24px;
  height: 24px;
}
</style>
