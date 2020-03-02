<template id="mkdir-modal">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">

        <div class="modal-header"><h3>上传</h3></div>
        <div class="modal-body">
          <form id="formId">
            <input type="file" id="selectFile" name="file" @change="onSelectChange()" class="selectFile">
           <!--  <span class="upload"></span> -->
            <input name="filepath" :value="uploadPath" type="hidden">
            <input name="Cellphone" :value="1" type="hidden">
            <input name="Username" :value="1" type="hidden"> 
            <input type="button"  class="ok" value="上传" @click="$emit('ulDir')">
            <input type="button" class="cancel" value="取消" @click="$emit('cancelULdir')">
           </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'upload-modal',
  props: ['uploadPath'],
  data () {
    return {
      filename:""
     
    };
  },
  components: {},
  methods: {
    // ulDir:function(){
    //   IS_DEV && console.log(1);
    //   var fileName = $("#fileName").val();
    //   var uploadPath = this.uploadPath;
      
    //   $.ajax({
    //       type:"POST",
    //       url:"https://39.108.184.191/EducationSystem/uploadTOserver",
    //       data:{"fileName":fileName,"path":uploadPath},
    //       //dataType: "json",
    //       xhrFields:{withCredentials: true},
    //       async: false, 
    //       success:function (data){
    //           alert(data);
    //       }
    //   });
    // }
    onSelectChange:function(){
        // var file=document.getElementById("selectFile").value;
        // var k=file.lastIndexOf("\\");
        // file=file.substring(k+1);
        // file=file.slice(0,8);
        // file=file+"…";
        // var showFile=document.getElementById("show_file");
        // showFile.innerHTML=file;
        // this.filename=obj.value.replace(/.+./,"");
        // console.log(this.filename);
      }
  },
  mounted () {},
  computed: {}
  
}
</script>

<style scoped>
/*.selectFile{
  opacity: 0;
}*/
/*.upload{
    padding: 4px 10px;
    height: 20px;
    line-height: 20px;
    border: 1px solid #999;
    text-decoration: none;
    color: #666;
    position:relative;
    top: -50px;

}*/
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
  height: 170px;
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
  height:40px;
  line-height: 40px;
  padding-left: 60px;
}


.modal-body button {
  float: left;
  width: 80px;
  height: 36px;
  padding: 0;
  font-size: 14px;
  cursor: pointer;
}
.ok {
  display: inline-block;
  height: 34px;
  width: 73px;
  background: #00ab7a;
  color: #ffffff;
  border: 0;
  cursor: pointer;
}
.cancel {
  display: inline-block;
  height: 34px;
  width: 73px;
  margin-left: 20px;
  border: 0;
  background: #00ab7a;
  color: #ffffff;
  cursor: pointer;
}
.name-tips, .stuNum-tips {
  color: #ccc;
}
.file {
    position: relative;
    display: inline-block;
    background: #00ab7a;
    border: 1px solid #00ab7a;
    padding: 7px 7px;
    overflow: hidden;
    color: #fff;
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;
}
.file input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
}
.file:hover {
    background: #00ab7a;
    border-color: #00ab7a;
    color: #fff;
    text-decoration: none;
    cursor:pointer;
}
.show_file{
  position: relative;
  top: -10px;
  left: 15px;
}
</style>
