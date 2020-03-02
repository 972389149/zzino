<template id="slide-manage">
  <div id="slidetable" style="margin-left:50px;">
    <div id="toolbar">
      <input type="button" class=wrap-last @click='getBack()'>
      <span> <img :src="require('./img/index.png')" class="wrap-logo"></span>
      <span> 课件管理 </span>
      <span>
           {{message}}
      </span>
      <div id="wrap-btn">
        <button @click='showUploadModal=true'>上传</button>
        <!-- <button @click='downloadFiles()'>下载</button> -->
        <button @click="deleteFile()">删除</button><button @click="showMkdir()">新建文件夹</button>
      </div>
    </div>

    <div class="wrap-table">
      <table id="table">
        <thead id="thead">
           <tr>
            <th class="checkbox-col"><input type="checkbox" :checked="isAllChecked" @click="globalCheck"></th>
            <th class="name-col">文件名</th>
            <th class="size-col">大小</th>
            <th class="updatetime-col">更新时间</th>
           </tr>
        </thead>
        <tbody id="tbody">
          <tr v-for="slide in slides">
            <td class="checkbox-col"><input type="checkbox" :value="slide['id']" v-model="checkedIds"></td>
            <td class="name-col">
              <span @click="inFolder(slide.name,slide.icon)">
                <img :src="slide.icon">
                {{slide["name"]}}
              </span>
              <span class="manipulate">
                <button class="download-one" @click="downloadOneFile(slide.name)"></button>
                <button class="delete-one" @click="deleteOneFile(slide.name)"></button>
              </span> 
            </td>
            <td class="size-col">{{slide["size"]}}</td>
            <td class="updatetime-col">{{slide["updateTime"]}}</td>
          </tr>
        </tbody>
      </table>
      </div>


      <mkdir-modal v-if="showMkdirModal" @cancelMkdir='cancelMk' @finishMkdir='finishMk' :nowPlace="nowplace"></mkdir-modal>

      <delete-modal v-if="showDelModal" :deleteFileName="delFileName" :count="this.checkedIds.length" @confirm='confirmDel()' @cancel='cancelDel()'></delete-modal>

      <upload-modal v-if="showUploadModal" :uploadPath="nowplace" @cancelULdir='cancelUL'  @ulDir='finishULdir'></upload-modal>

      <onload-modal v-if="showonLoad">
      </onload-modal>
      <loading-modal v-if="showLoading">
      </loading-modal>

  </div>
</template>

<script>
import selectGroup from '@/components/common/select-group.vue'
import { getSlideList,getNodeList,delFile} from '@/api/api'
import mkdirModal from '@/components/slide-manage/mkdir-modal.vue'
import deleteModal from '@/components/slide-manage/delete-modal.vue'
import uploadModal from '@/components/slide-manage/upload-modal.vue'
import onloadModal from '@/components/note-manage/onload-modal.vue'
import loadingModal from '@/components/note-manage/loading-modal.vue'
export default {
  name: 'slide-manage',
  data () {
    return {
     // 工具栏(toolbar)用到的：
      selTexts: ['初二', '(2)班', '"科目"'],
      optsArr: [],
      selValues: ['初二', '(2)班', null],
      showMkdirModal:false,
      showDelModal:false,

      // 表格(table)用到的：
      checkedIds: [],
      isAllChecked: false,
      slides: [],
      nowplace:'',
      delFileName:'',
      showUploadModal:'',
      showonLoad:false,
      titleList:[{icon:'',num:0}],
      slide_show:true,
      slide_hidden:false,
      message:'',
      count:1,
      isFinish:false,
      isReturn:false,
      deleteNum:1,
      showLoading:false,
      dbclick:true
    }
  },
  components: {
    selectGroup: selectGroup,
    mkdirModal: mkdirModal,
    deleteModal:deleteModal,
    uploadModal:uploadModal,
    onloadModal:onloadModal,
    loadingModal:loadingModal
  },
  computed: {
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
    this.getSlides()
  },

  methods: {
    changeSel: function (index, value) {
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

    //模态框显示
    showMkdir:function(){
        this.showMkdirModal = true; 
    },
    cancelMk:function(){
        this.showMkdirModal = false; 
    },
    finishMk:function(){
        this.showMkdirModal = false;
        this.getSlides();
    },

    //删除文件
    deleteFile:function(){
      if(this.checkedIds.length==0){
        alert("请至少选择一个需要删除的文件。");
      }
      else{
        var index = this.checkedIds[0];
        this.delFileName = this.slides[index].name;
        this.showDelModal = true;
        if(this.count==0){
          this.count=1;
        }
        else{
          this.count = this.checkedIds.length;
        }
      }
    },   
    deleteOneFile:function(n){
      this.delFileName = n;
      this.count = 1;
      this.delOne = true;
      this.delOneName = n;
      this.showDelModal = true;
    }, 
    sendRequeir:function(i){
      var _this=this
      var deletepath=" "
      var checkedIds=this.checkedIds;
      var nowplace=this.nowplace;
      var slides=this.slides;
      setTimeout(function(){
       if(_this.nowplace==""){
         deletepath=_this.nowplace+slides[i].name
       }
       else{
         deletepath=_this.nowplace+"/"+slides[i].name
       }  
       if(slides[i].name.indexOf(".")!=-1){
           deletepath=nowplace
            _this.$ajax.get(`${_this.URLroot}/FileOperate/`, { 
              params:{
                 Type:1,
                 CellPhone:1,
                 UserName:1,
                 Order:'rm',
                 path:deletepath,
                 filename:slides[i].name
              },
          }).then((res) => {
             if(res.data.error){
                alert(res.data.error);
              }
          })
         .catch((error)=>{
            alert("服务器发生错误！请联系维修人员！");
         })
       }
       else{
          _this.$ajax.get(`${_this.URLroot}/FileOperate/`, { 
              params:{
                 Type:1,
                 CellPhone:1,
                 UserName:1,
                 Order:'rm',
                 path:deletepath,
              },
          }).then((res) => {
            if(res.data.error){
              alert(res.data.error);
            }
          })
         .catch((error)=>{
            alert("服务器发生错误！请联系维修人员！");
         })
       }
      },i*200)
    },
    //删除确认
    delete:function(){
      if(this.delOne){
         var deletepath=" "
         var index = this.checkedIds[i];
         if(this.nowplace==""){
           deletepath=this.nowplace+this.delOneName
         }
         else{
           deletepath=this.nowplace+"/"+this.delOneName
         }   
         if(this.delOneName.indexOf(".")!=-1){
             deletepath=this.nowplace;
             this.$ajax.get(`${this.URLroot}/FileOperate/`, { 
                  params:{
                     Type:1,
                     CellPhone:1,
                     UserName:1,
                     Order:'rm',
                     path:deletepath,
                     filename:this.delOneName
                  },
             }).then((res) => {
                if(res.data.error){
                    alert(res.data.error);
                }
                // var delfile=this.delOneName.repalce("note","");
                // alert(delfile+"文件删除失败");
             })
             .catch((error)=>{
                 alert("服务器发生错误！请联系维修人员！");
             });
          }
         else{
           this.$ajax.get(`${this.URLroot}/FileOperate/`, { 
                params:{
                   Type:1,
                   CellPhone:1,
                   UserName:1,
                   Order:'rm',
                   path:deletepath
                },
            }).then((res) => {
              if(1){
                  if(res.data.error){
                    alert(res.data.error);
                  }
                  // var delfile=this.delOneName.repalce("note","");
                  // alert(delfile+"文件删除失败");
                }
            })
            .catch((error)=>{
               alert("服务器发生错误！请联系维修人员！");
            });
          }
      }
      else{
        for(var i=0;i<this.checkedIds.length;i++){
           this.deleteNum=this.checkedIds.length;
           this.sendRequeir(this.checkedIds[i]);
        }    
      }       
    },


    confirmDel:function(){
      this.showonLoad=true;
      this.delete();
      this.checkedIds = [];
      this.showDelModal = false;
      var sel=this;
      setTimeout(function(){
          sel.getSlides();
          sel.showonLoad=false;
        },sel.deleteNum*200);   
    },

    cancelDel:function(){
      this.showDelModal = false;
    },

    // 表格(table)用到的：
    getSlides: function () {
      this.$ajax.get(`${this.URLroot}/FileOperate/`, { 
          params:{
             Type:1,
             CellPhone:1,
             UserName:1,
             Order:'cd',
             path:this.nowplace
          },
    }).then((res) => {
        this.dbclick=true;
        var array = [];
        if(1){
          var index = 0;
          var dataA=[];
          var dataB=[];
          for(var file in res.data[this.nowplace]){
            dataA.push(file);
          }
          for(var i=0;i<dataA.length;i++){
            if(dataA[i].indexOf("note")==-1){
                  dataB.push(dataA[i]);
            }
          }
          console.log(dataB);
          for(var i=0;i<dataB.length;i++){
            if(1){
              var temp={
                id:'',
                icon:'',
                name:'',
                size:0,
                updateTime:''
              }
              temp.id = index;
              if( res.data[this.nowplace][dataB[i]].FileType == 'Directory'){
                temp.icon = require('./img/folder.png');
              }else if( res.data[this.nowplace][dataB[i]].FileType == 'jpg'|| res.data[this.nowplace][dataB[i]].FileType == 'png'|| res.data[this.nowplace][dataB[i]].FileType == 'jpeg'){
                temp.icon = require('./img/picture.png');
              }else if( res.data[this.nowplace][dataB[i]].FileType == 'doc'|| res.data[this.nowplace][dataB[i]].FileType == 'docx'){
                temp.icon = require('./img/doc.png');
              }else if( res.data[this.nowplace][dataB[i]].FileType == 'rar'){
                temp.icon = require('./img/rar.png');
              }else{
                temp.icon =require('./img/doc.png');
              }
              temp.name = dataB[i];
              temp.size = Math.ceil(Number( res.data[this.nowplace][dataB[i]].FileSize)/1024) + 'KB';
              if(Number(temp.size.substring(0,temp.size.length-2))>1024){
                  temp.size =Math.ceil(temp.size.substring(0,temp.size.length-2)/1024) + 'M';
              }
              temp.updateTime =new Date(parseInt(res.data[this.nowplace][dataB[i]].FileTime)).toLocaleDateString();
              array[index] = temp; 
              index++;  
            }          
          }
        }
        this.slides = array;
      })
      .catch((error)=>{
        alert("服务器发生错误！");
      })
    },
    

    globalCheck: function () {
      if (this.checkedIds.length === 0) {
        for (var i = 0; i < this.slides.length; i++) {
          this.checkedIds.push(this.slides[i].id)
        }
      } else if (this.checkedIds.length === this.slides.length) {
        this.checkedIds = []
      } else {
        this.checkedIds = []
        for (var j = 0; j < this.slides.length; j++) {
          this.checkedIds.push(this.slides[j].id)
        }
      }
    },


    getJsonLength:function(jsonObj){
      var Length = 0;
      for (var item in jsonObj) {
        if(jsonObj[item].FileType == 'Directory'){
          Length++;
        }
      }
      return Length;
    },

    isDirPic:function(typeObj){
      return true;
    },

    // getNodesModel: function (sendData) {
    //   let para = sendData;
    //   getNodeList(para).then((res) => {
    //     if(res.data[0].Result==1 || res.data[0].Result==0){
    //       var array = [];
    //       var index = 0;
    //       for(var folder in res.data[0]){
    //         if(folder!='Result' && folder!='Error' && (this.isDirPic(res.data[0][folder].FileType))){
    //           var temp={
    //             id:'',
    //             icon:'',
    //             name:'',
    //             size:0,
    //             updateTime:'2017-08-23'
    //           }
    //           temp.id = index;
    //           if(res.data[0][folder].FileType == 'Directory'){
    //             temp.icon = './img/folder.png';
    //           }else if(res.data[0][folder].FileType == 'jpg'||res.data[0][folder].FileType == 'png'){
    //             temp.icon = './img/picture.png';
    //           }else if(res.data[0][folder].FileType == 'doc'||res.data[0][folder].FileType == 'docx'){
    //             temp.icon = './img/word.png';
    //           }else{
    //             temp.icon = './img/file.png';
    //           }
    //           temp.name = folder;
    //           temp.size = res.data[0][folder].FileSize;
    //           temp.updateTime = res.data[0][folder].FileTime;
    //           array[index] = temp; 
    //           index++;  
    //         }       
    //       }
    //       this.slides = array;
    //     }
    //   })
    //   .catch((error)=>{
    //     alert("服务器发生错误！获取文件列表失败");
    //   })
    // },

    inFolder:function(n,m){
        console.log(m);
        if(this.dbclick){
          this.dbclick=false;
          if(m != require('./img/folder.png')){
            this.dbclick=true;
            return false;
          }
          if(this.nowplace ==''){
            this.nowplace = this.nowplace+n;
          }
          else{
            this.nowplace = this.nowplace+'/'+n;
          }
          this.getSlides();
          var arr=[];
          arr=this.nowplace.split("/");
          this.message=this.message+" > "+arr[arr.length-1];
      }       
    },

    //点击返回上一级
    getBack:function(){
       if(this.nowplace.indexOf("/")<=0){
          this.nowplace=""; 
          this.message="";
       }
       else{
           var arr=[];
           arr=this.nowplace.split("/");
           var k=" > "+arr[arr.length-1];
           IS_DEV && console.log(k);
           this.message=this.message.replace(k," ");
           this.nowplace="";
           for(var i=0;i<arr.length-1;i++){
              this.nowplace+=arr[i]+"/";
           }
           if(this.nowplace.substr(this.nowplace.length-1,1)=="/"){
              this.nowplace=this.nowplace.substr(0,this.nowplace.length-1);
           }
       }
       this.getSlides();
    },


    // downloadFiles:function(){
    //   if(this.checkedIds.length==0){
    //     alert("请至少选择一个需要删除的文件。");
    //   }
    // },

     downloadOneFile:function(n){
      if(n.indexOf(".")==-1){
          console.log(n);
          console.log(this.nowplace);
          // alert("暂时不能下载文件夹！");
          // return ;
          if(!this.nowplace){
             window.location.href=`${this.URLroot}/FileOperate/?Type=1&CellPhone=1&UserName=1&Order=get&path=`+n ; 
          }
          else{
             window.location.href=`${this.URLroot}/FileOperate/?Type=1&CellPhone=1&UserName=1&Order=get`+'&path='+this.nowplace; 
          }
      }
      else{
        if(!this.nowplace){
          var name=n;
        }
        // else{
        //    var name=this.nowplace + "/" + n;
        //    if(name.indexOf(".")==-1){
        //     name=name+"note";
        //    }
        // }  
         window.location.href=`${this.URLroot}/FileOperate/?Type=1&CellPhone=1&UserName=1&Order=get&filename=`+ n+'&path='+this.nowplace ; 
      }           
    },

  //上传文件确认
  finishULdir:function(){
       this.showLoading=true;
       this.showUploadModal = false;
       var _this=this
       var formData = new FormData(document.getElementById("formId"));
       $.ajax({  
            cache: true,  
            type: "POST",  
            url:`${this.URLroot}/FileOperate/uploadTOserver/`, 
            enctype:"multipart/form-data",
            data:formData,
            processData: false,
            contentType: false,
            xhrFields: {
               withCredentials: true
            },
            crossDomain: true,
            error: function(request) {
               _this.showLoading = false;  
               _this.getSlides();
            },  
            success: function(data) {  
               _this.showLoading = false;  
               _this.getSlides();
            }  
        }); 
       
      // var xhr  = new XMLHttpRequest();
      // xhr.open("POST","https://api2.zzinno.com/FileOperate/uploadTOserver/",true);     
      // xhr.onload = function () {
      //     console.log(xhr.responseText);
      // }
      // xhr.send(formData);  
    },

  //上传文件取消
   cancelUL:function(){
      this.showUploadModal = false; 
    }
  },

  watch: {
    'checkedIds': {// 深度 watcher
      handler: function (val, oldVal) {
        if (this.checkedIds.length === this.slides.length) {
          this.isAllChecked = true
        } else {
          this.isAllChecked = false
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
#toolbar {
  width: 1033px;
  height: 33px;
  margin-top: 40px;
}
#wrap-btn {
  float: right;
}
button {
  width: 100px;
  height: 32px;
  margin-left: 4px;
  background: #00aa7a;
  color: #ffffff;
  border: 0;
  padding: 0;
}
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
.wrap-last{
  border: 0px;
  height: 24px;
  width: 24px;
  background:  #322a2a url(./img/arrow.png)  no-repeat center center; 
  background-size: 20px 20px;
  cursor: pointer;
  margin-right: 30px;
}
.wrap-logo{
  display: inline-block;
  height: 13px;
  width: 15px;
}
table
{
  border-collapse:collapse;
  border: 2px solid #dcdcdc;
  table-layout: fixed;
}
th {
  font-weight: normal;
}
table tr {
  border: 1px dashed #dcdcdc;
  text-align: left;
}
table th {
  box-sizing: border-box;
  background-color: #dcdcdc;
  height: 48px;
}
table td {
  /*position: relative;*/
  background-color: #fff;
  height: 40px;
}
input[type=checkbox] {
  margin: 0;
  width: 13px;
}
.checkbox-col {
  width: 24px;
  box-sizing: border-box;
  margin-right: 0;
  padding-left: 10px;
  padding-right: 0;
}
.name-col {
  width: 556px;
  box-sizing: border-box;
  padding-left: 10px;
}
.name-col span:first-child{
  cursor: pointer;
}
.name-col span:last-child button{
  cursor: pointer;
}
.name-col img{
   width:22px;
   height:22px;
   margin-right: 10px;
   vertical-align: bottom;
}
.size-col {
  width: 200px;
  /*为什么用box-sizing不行?*/
/*  box-sizing: border-box;*/
  padding-left: 10px;
}
.updatetime-col {
  width: 240px;
  box-sizing: border-box;
  padding-left: 10px;
}
#tbody .size-col {
  color: #999;
}
#tbody .updatetime-col {
  color: #999;
}
.manipulate {
  float: right;
}
.download-one {
  display: none;
  width:32px;
  height:22px;
  border:0;
  background: url(./img/down.png) no-repeat;
  margin-right: 16px;
}
.delete-one {
  display: none;
  width:22px;
  height:22px;
  border:0;
  background: url(./img/trashbin.png) no-repeat left top;
}
#tbody tr:hover td {
  background-color: #eee;
}
tbody tr:hover .download-one, tbody tr:hover .delete-one {
  display: inline-block;
}
</style>
