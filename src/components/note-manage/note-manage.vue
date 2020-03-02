<template id="node-manage">
  <div id="nodetable" style="margin-left:50px;">
    <div id="toolbar">
      <div id="wrap-title">
        <!-- <span>笔记管理</span> -->
        <span v-for="title in titleList" :class="{'choseTitle':title.isSelected,'listTitle':listT}"  @click="goList(title.path,title.num),selectTitle(title)">
        {{title.name}}{{title.icon}}
        </span>
      </div>
      <div id="wrap-btn">
        <button v-if="showUpdataButton" @click="showULdir()">上传图片</button><button @click="deleteFile()">删除</button><button @click="showMkdir()" v-if="showMkdirButton">新建文件夹</button>
      </div>
    </div>

    <div class="wrap-table" v-if="showPicture">
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
            <td class="checkbox-col">
              <input type="checkbox" :value="slide['id']" v-model="checkedIds">
            </td>
            <td class="name-col">
              <span @click="inFolder(slide.name,slide.icon),selectTitle(slide)">
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

   <!--  用来展示图片的 -->
    <div class="wrap-picture" v-if="showPic">
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
            <td class="checkbox-col">
              <input type="checkbox" :value="slide['id']" v-model="checkedIds">
            </td>
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

    <mkdir-modal v-if="showMkdirModal" 
                 :nowPlace="nowplace"
                 @cancelMkdir='cancelMk' 
                 @finishMkdir='finishMk'>
    </mkdir-modal>

    <mkdir-modaltwo v-if="showmkdirModal2" 
                 :nowPlace="nowplace"
                 @cancelMkdir='cancelMk' 
                 @finishMkdir='finishMk'>
    </mkdir-modaltwo>

    <delete-modal v-if="showDelModal" 
                  :deleteFileName="delFileName" 
                  :count="count"
                  @confirm='confirmDel()' 
                  @cancel='cancelDel()'>
    </delete-modal>

    <upload-modal v-if="showULdirModal" 
                  :uploadPath="nowplace"
                  @cancelULdir='cancelUL'
                  @ulDir='finishULdir'>
    </upload-modal>
    
    <onload-modal v-if="showonLoad">
    </onload-modal>
    <loading-modal v-if="showLoading">
    </loading-modal>
  </div>
</template>


<script>

  import { getNodeList,delFile } from '@/api/api'
  import mkdirModal from '@/components/note-manage/mkdir-modal.vue'
  import mkdirModal2 from '@/components/note-manage/mkdir-modal-2.vue'
  import deleteModal from '@/components/note-manage/delete-modal.vue'
  import uploadModal from '@/components/note-manage/upload-modal.vue'
  import dataPicker from '@/components/note-manage/data-picker.vue'
  import onloadModal from '@/components/note-manage/onload-modal.vue'
  import loadingModal from '@/components/note-manage/loading-modal.vue'

  export default{
    name: 'note-manage',

    data () {
      return {
        slides: [],
        titleList:[{name:'笔记管理',icon:'',path:'',num:0}],
        isAllChecked: false,
        checkedIds: [],
        nowplace:'',
        showMk:false,
        showMkdirModal:false,
        showmkdirModal2:false,
        showDelModal:false,
        delFileName:'',
        count:'',
        delOne:false,
        delOneName:'',
        showUpdataButton:false,
        showMkdirButton:true,
        showULdirModal:false,
        showPicture:true,
        showPic:false,
        showonLoad:false,
        listTitle:false,
        listT:false,
        isReturn:false,
        ifFinish:false,
        deleteNum:1,
        showLoading:false,
        dbclick:true
      }
    },

    components: {
      mkdirModal: mkdirModal,
      mkdirModaltwo: mkdirModal2,
      deleteModal:deleteModal,
      uploadModal:uploadModal,
      dataPicker:dataPicker,
      onloadModal:onloadModal,
      loadingModal:loadingModal
    },

    mounted () {
      this.getNodesModel();
    },
    methods:{
      //判断是否为文件或者图片
          isDirPic:function(typeObj){typeObj == 'jpg'
            if(typeObj == 'Directory' || typeObj == 'jpg' ||typeObj == 'png'||typeObj == 'jpeg')
            return true;
          },
      //选项全选
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

      //路径导航栏
          thePath:function(n,p){
            var array = [];
            var index = 0;
            var paths = new Array();
            paths=p.split("/"); 
            for(var list in this.titleList){
              var temp={
                name:this.titleList[list].name,
                icon:' >> ',
                num:list,
              }
              if(list == 0){
                temp.path = '';
                // temp.name="";
              }
              else if(list == 1){
                temp.path = paths[list-1];
              }
              else{
                for(var i=0; i<list-1; i++){
                  paths[i+1] = paths[i] + '/' + paths[i+1]; 
                }
                temp.path = paths[list-1];
                paths = [];
                paths=p.split("/"); 
              }
              array[index] = temp; 
              index++;
            }
            if(index=="1") {
              this.showMk=true;
            }
            if(index=="2") {
              this.showUpdataButton=true;
              this.showMkdirButton=false;
              this.showPicture=false;
              this.showPic=true;
            }
            var temp={name:n,icon:'',path:p,num:index}
            array[index] = temp;
            this.titleList = array;
          },

          selectTitle:function(selectTitle){
             this.titleList.forEach(title=>{
                title.isSelected=(title.name==selectTitle.name);
               })
           },

      //路径导航栏跳转
          goList:function(m,n){
            this.showUpdataButton=false;
            this.showMkdirButton=true;
            this.showPicture=true;
            this.showPic=false;
            IS_DEV && console.log(m);
            IS_DEV && console.log(n);
            this.nowplace=m;
            this.getNodesModel();
            this.nowplace = m;
            var newarray = [];
            var newindex = 0;
            for(var i=0; i<=n; i++){
              var newtemp={
                name:this.titleList[i].name,
                icon:this.titleList[i].icon,
                path:this.titleList[i].path,
                num:this.titleList[i].num,
              }
              newarray[newindex] = newtemp; 
              newindex++;
            }
            if(newarray.length==1){
              this.showMk=false;
            }
            newarray[n].icon = '';
            this.titleList = newarray;
          },

      //初始化表格
          getNodesModel: function () {
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
              if(1){
                // this.thePath(this.n,this.nowplace);
                var arr=[];
                var path="";
                console.log(res.data);
                var array = [];
                var index = 0;
                var dataA=[];
                var dataB=[];
                for(var file in res.data[this.nowplace]){
                  dataA.push(file);
                }
                if(this.showUpdataButton){
                    for(var i=0;i<dataA.length;i++){
                      if(dataA[i].indexOf(".")!=-1){
                            dataB.push(dataA[i]);
                      }
                  }
                }
                else{
                   for(var i=0;i<dataA.length;i++){
                      if(dataA[i].indexOf("note")!=-1){
                            dataB.push(dataA[i]);
                      }
                   }
                }
                console.log(dataB);
                console.log()              
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
                    }else if( res.data[this.nowplace][dataB[i]].FileType  == 'jpg'|| res.data[this.nowplace][dataB[i]].FileType  == 'png'){
                      temp.icon =  require('./img/picture.png');
                    }else if( res.data[this.nowplace][dataB[i]].FileType   == 'doc'|| res.data[this.nowplace][dataB[i]].FileType  == 'docx'){
                      temp.icon =  require('./img/file.png');
                    }else if( res.data[this.nowplace][dataB[i]].FileType  .FileType == 'txt'|| res.data[this.nowplace][dataB[i]].FileType  == 'text'){
                      temp.icon =  require('./img/file.png');
                    }else{
                      temp.icon =  require('./img/file.png');
                    }
                    temp.name = dataB[i];
                    temp.name=temp.name.replace(/note/,"");
                    temp.size = Math.ceil(Number(res.data[this.nowplace][dataB[i]].FileSize)/1024) + 'KB';
                    if(Number(temp.size)>1024){
                      temp.size = Math.ceil(temp.size/1024) + 'M';
                    }
                    temp.updateTime = new Date(parseInt(res.data[this.nowplace][dataB[i]].FileTime)).toLocaleDateString();
                    array[index] = temp; 
                    index++;  
                  }       
                }
                this.slides = array;
              }
            })
            .catch((error)=>{
               alert("服务器发生错误！");
            });
          },

      //进入文件时反应
          inFolder:function(n,m){
            if(this.dbclick){
              this.dbclick=false;
              this.listT=true;
              console.log(m);
              if(m ==  require('./img/file.png')){
                return false;
              }
              if(this.nowplace ==''){
                this.nowplace = this.nowplace+n+"note";
              }
              else{
                this.nowplace = this.nowplace+'/'+n+"note";
              }
              this.getNodesModel();
              this.thePath(n,this.nowplace);
            }
            
          },

      //新建文件
          showMkdir:function(){
               if(this.showMk){
                   this.showmkdirModal2 = true; 
               }
               else{
                   this.showMkdirModal = true; 
               }           
          },

      //新建文件确认
          finishMk:function(){
              this.showMkdirModal = false;
              this.showmkdirModal2 = false;
              this.getNodesModel();
          },

      //新建文件取消
          cancelMk:function(){
              this.showMkdirModal = false;
              this.showmkdirModal2 = false; 
          },


      //删除文件
          deleteFile:function(){
            if(this.checkedIds.length==0){
              alert("请至少选择一个需要删除的文件。");
             }
            else{
              var index = this.checkedIds[0];
              this.delFileName = this.slides[index].name;
              this.count = this.checkedIds.length;
              this.showDelModal = true;
            }
          },

          deleteOneFile:function(n){
            this.delFileName = n;
            this.count = 1;
            this.delOne = true;
            this.delOneName = n;
            this.showDelModal = true;
          },      

        //发送请求
        sendRequeir:function(i){
          var _this=this
          var deletepath=" "
          var slides=this.slides;
          var nowplace=this.nowplace;
          var showUpdataButton=this.showUpdataButton;
          setTimeout(function(){
           if(showUpdataButton){
               slides[i].name=slides[i].name;
           }
           else{
               slides[i].name=slides[i].name+"note";
           }
           if(_this.nowplace==""){
             deletepath=_this.nowplace+slides[i].name
           }
           else{
             deletepath=_this.nowplace+"/"+slides[i].name
           }  
           if(slides[i].name.indexOf(".")!=-1){
               deletepath=_this.nowplace
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
                console.log(error);
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
                console.log(error);
             })
           }
          },i*100)
        },

   
         //删除文件确认
          delete:function(){
            var deletepath=""
            if(this.delOne == true){
               if(this.showUpdataButton){
                   this.delOneName=this.delOneName;
               }
               else{
                  this.delOneName=this.delOneName+"note";
               }
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
                    console.log(error);
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
                  console.log(error);
                });
              }
            }
            else{
              for(var i=0;i<this.checkedIds.length;i++){
                 this.sendRequeir(this.checkedIds[i]);
                 this.deleteNum=this.checkedIds.length;
              }
            }
          },
           

          confirmDel:function(){
            this.showonLoad=true;
            this.delete();
            this.checkedIds = [];
            this.delOne = false;
            this.showDelModal = false;
            var sel=this;
            setTimeout(function(){
              sel.getNodesModel();
              sel.showonLoad=false;
            },sel.deleteNum*100); 
          },

      //删除文件取消
          cancelDel:function(){
            this.showDelModal = false;
          },


      //上传文件
          showULdir:function(){
            this.showULdirModal = true; 
          },

      //上传文件确认
          finish:function(){
               this.nowplace=this.nowplace+"note"
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
                       _this.getNodesModel();
                    },  
                    success: function(data) { 
                       _this.showLoading = false;  
                       _this.getNodesModel();
                    }  
                });  
              this.nowplace=this.nowplace.substring(0,this.nowplace.length-4);
          },


          finishULdir:function(){
            this.showULdirModal = false;
            this.showLoading=true;    
            //如果ref是定位在有v-if、v-for、v-show中的DOM节点，返回来的只能是undefined，因为在mounted阶段他们根本不存在！！
            this.finish();          
          },


         //上传文件取消
          cancelUL:function(){
            this.showULdirModal = false;
          },


          //下载文件
          downloadOneFile:function(n){
            if(n.indexOf(".")==-1){
                console.log(n);
                console.log(this.nowplace);
                // alert("暂时不能下载文件夹！");
                // return ;
                if(!this.nowplace){
                   window.location.href=`${this.URLroot}/FileOperate/?Type=1&CellPhone=1&UserName=1&Order=get&path=`+n+"note" ; 
                }
                else{
                   window.location.href=`${this.URLroot}/FileOperate/?Type=1&CellPhone=1&UserName=1&Order=get`+'&path='+this.nowplace; 
                }
            }
            else{
              if(!this.nowplace){
                var name=n;
              }
              else{
                 var name=this.nowplace + "/" + n;
                 if(name.indexOf(".")==-1){
                  name=name+"note";
                 }
              }  
               window.location.href=`${this.URLroot}/FileOperate/?Type=1&CellPhone=1&UserName=1&Order=get&filename=`+ n+'&path='+this.nowplace ; 
            }           
          }
    },
    watch: {
      'checkedIds': {
        handler: function (val, oldVal) {
          if (this.checkedIds.length === this.slides.length) {
            this.isAllChecked = true
          } else {
            this.isAllChecked = false
          }
        },
        deep: true
      },
    },

  }
</script>

<style scoped>
  #toolbar {
    width: 1033px;
    height: 33px;
    margin-top: 40px;
  }
  #wrap-title{
    height:30px;
    line-height:30px;
    border-left:2px solid #00ab7a;
    padding-left:8px;
    float: left;
    font-size: 14px;
    color:#333;
  }
  #wrap-title span{
    cursor: pointer;
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
    cursor: pointer;
  }
  .wrap-table {
    float: left;
    overflow: hidden;
    position: relative;
    top: 4px;
    margin: 0 0 30px 0;
    background: #fff;
  }
  .listTitle{
    margin-left: 5px;
    color: #00aa7a;
    text-decoration:underline;
  }
  .choseTitle{
    color: #666;
    text-decoration:none;
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
    padding-left: 10px;
  }
  .updatetime-col {
    width: 240px;
    box-sizing: border-box;
    padding-left: 10px;
  }
  #thead .size-col {
    border-left: 1px solid rgba(0,0,0,.1);
    padding-left:6px;
    border-right: 1px solid rgba(0,0,0,.1);
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
    background: url(./img/down.png) no-repeat right top;
   /* background: #eee;*/
    margin-right: 4px;
  }
  .delete-one {
    display: none;
    width:22px;
    height:22px;
    border:0;
    background: url(./img/trashbin.png) no-repeat left top;
    margin-right: 15px;
  }
  #tbody tr:hover td {
    background-color: #eee;
  }
  tbody tr:hover .download-one, tbody tr:hover .delete-one {
    display: inline-block;
  }
</style>
